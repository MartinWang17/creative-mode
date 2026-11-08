import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/env";
import { hasKit, subscribeToKit } from "@/lib/kit";
import { createAdminClient } from "@/lib/supabase/server";
import { SIGNUP_EMAIL_COOKIE } from "@/components/InlineSurvey";

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
  // Also onto the Kit list, so launch emails reach everyone from one place.
  if (hasKit()) {
    try {
      await subscribeToKit(email, ["waitlist"]);
    } catch (err) {
      console.error("kit subscribe failed", err);
    }
  }
  const res = back("joined");
  res.cookies.set(SIGNUP_EMAIL_COOKIE, email, { maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax", httpOnly: true, secure: true });
  return res;
}
