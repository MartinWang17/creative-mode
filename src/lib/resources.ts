import { createAdminClient } from "@/lib/supabase/server";

export type Resource = {
  id: string;
  slug: string;
  title: string;
  blurb: string | null;
  storage_path: string | null;
  cover_path: string | null;
  link: string | null;
  annual_only: boolean;
  available_at: string | null;
  published: boolean;
  sort: number;
  created_at: string;
};

export const BUCKET = "resources";

export const RESOURCE_COLS =
  "id, slug, title, blurb, storage_path, cover_path, link, annual_only, available_at, published, sort, created_at";

type Viewer = { isAdmin: boolean; hasAccess: boolean; member: { plan: string | null } | null } | null;

// Nothing before its release moment, and nothing unpublished, except for Martin.
export function visible(r: Resource, viewer: Viewer, now = new Date()) {
  if (viewer?.isAdmin) return true;
  if (!r.published) return false;
  return !r.available_at || new Date(r.available_at) <= now;
}

// Who can open it: any active member, or annual members only.
export function canOpen(r: Resource, viewer: Viewer) {
  if (viewer?.isAdmin) return true;
  if (!viewer?.hasAccess) return false;
  return !r.annual_only || viewer.member?.plan === "annual";
}

export async function listResources(viewer: Viewer) {
  const { data } = await createAdminClient()
    .from("resources")
    .select(RESOURCE_COLS)
    .order("sort", { ascending: true })
    .order("created_at", { ascending: true });
  return ((data ?? []) as Resource[]).filter((r) => visible(r, viewer));
}

export async function getResource(slug: string) {
  const { data } = await createAdminClient()
    .from("resources")
    .select(RESOURCE_COLS)
    .eq("slug", slug)
    .maybeSingle<Resource>();
  return data;
}

// Short-lived link to a private file, for covers (shown on the page) and downloads.
export async function signedUrl(path: string | null, seconds: number, download = false) {
  if (!path) return null;
  const { data } = await createAdminClient()
    .storage.from(BUCKET)
    .createSignedUrl(path, seconds, download ? { download: true } : undefined);
  return data?.signedUrl ?? null;
}

// Turns a YouTube, Vimeo or Loom share link into something an iframe can play. Other links open in a new tab.
export function embedUrl(link: string | null) {
  if (!link) return null;
  const yt = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = link.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  const loom = link.match(/loom\.com\/(?:share|embed)\/([a-f0-9]{16,})/);
  if (loom) return `https://www.loom.com/embed/${loom[1]}`;
  return null;
}

export function isVideoFile(path: string | null) {
  return !!path && /\.(mp4|webm|mov|m4v)$/i.test(path);
}

export function releaseLabel(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
