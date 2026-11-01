import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/server";

// The waitlist form on the sales page (shown once doors close) posts here.
export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const back = (state: string) =>
    NextResponse.redirect(`${base}/creator-breakdown?waitlist=${state}#waitlist`, 303);

  const form = await request.formData();
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
