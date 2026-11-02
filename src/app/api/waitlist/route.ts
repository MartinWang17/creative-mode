import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/server";

// The waitlist forms (pre-launch page, and the sales page once doors close) post here.
const PAGES = ["/creator-breakdowns-waitlist", "/creator-breakdown"];

export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const form = await request.formData();
  const page = String(form.get("back") ?? "");
  const path = PAGES.includes(page) ? page : "/creator-breakdown";
  const back = (state: string) => NextResponse.redirect(`${base}${path}?waitlist=${state}#waitlist`, 303);

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return back("invalid");

  const { error } = await createAdminClient()
    .from("waitlist")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (error) {
    console.error("waitlist insert failed", error);
    return back("error");
  }
  return back("joined");
}
