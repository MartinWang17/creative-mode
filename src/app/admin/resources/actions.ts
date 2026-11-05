"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/members";
import { BUCKET } from "@/lib/resources";
import { createAdminClient } from "@/lib/supabase/server";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// The browser uploads straight to Supabase storage with this one-time token,
// so big files never pass through Vercel (which caps request bodies at a few MB).
export async function signUpload(slug: string, fileName: string) {
  await requireAdmin();
  const safe = fileName.replace(/[^\w.-]+/g, "-");
  const path = `${slugify(slug) || "file"}/${Date.now()}-${safe}`;
  const { data, error } = await createAdminClient().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Could not start the upload");
  return { path, token: data.token };
}

export type ResourceInput = {
  id?: string;
  title: string;
  slug?: string;
  blurb?: string;
  link?: string;
  annual_only: boolean;
  available_at?: string; // "2026-12-11T09:00", Eastern time
  storage_path?: string | null;
  cover_path?: string | null;
  sort?: number;
};

export async function saveResource(input: ResourceInput) {
  await requireAdmin();
  const title = input.title.trim();
  if (!title) throw new Error("Title is required");
  const slug = slugify(input.slug?.trim() || title);
  // Eastern time in late November is EST (UTC-5).
  const available_at = input.available_at ? new Date(`${input.available_at}:00-05:00`).toISOString() : null;
  const row: Record<string, unknown> = {
    title,
    slug,
    blurb: input.blurb?.trim() || null,
    link: input.link?.trim() || null,
    annual_only: input.annual_only,
    available_at,
    sort: Number.isFinite(input.sort) ? input.sort : 0,
  };
  if (input.storage_path) row.storage_path = input.storage_path;
  if (input.cover_path) row.cover_path = input.cover_path;
  const db = createAdminClient();
  const q = input.id ? db.from("resources").update(row).eq("id", input.id) : db.from("resources").insert(row);
  const { error } = await q;
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/resources");
}

export async function toggleResource(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const field = String(formData.get("field"));
  const value = formData.get("value") === "true";
  if (field !== "published" && field !== "annual_only") return;
  await createAdminClient().from("resources").update({ [field]: value }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/resources");
}

export async function deleteResource(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const db = createAdminClient();
  const { data } = await db.from("resources").select("storage_path, cover_path").eq("id", id).maybeSingle();
  const paths = [data?.storage_path, data?.cover_path].filter((p): p is string => !!p);
  if (paths.length) await db.storage.from(BUCKET).remove(paths);
  await db.from("resources").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/resources");
}
