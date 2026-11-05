import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase, siteUrl } from "@/lib/env";
import { hasKit, subscribeToKit } from "@/lib/kit";
import { createAdminClient } from "@/lib/supabase/server";

// The free-resource page posts here. Adds the email to Kit; if Kit isn't set up or fails,
// keeps the email in the waitlist table so nothing is lost, and the page still hands over the link.
export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const back = (state: string) => NextResponse.redirect(`${base}/free-resource?signup=${state}#signup`, 303);

  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return back("invalid");

  let saved = false;
  if (hasKit()) {
    try {
      await subscribeToKit(email, ["free-resource"]);
      saved = true;
    } catch (err) {
      console.error("kit subscribe failed", err);
    }
  }
  if (!saved && hasSupabase()) {
    const { error } = await createAdminClient()
      .from("waitlist")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
    saved = !error;
    if (error) console.error("waitlist fallback failed", error);
  }
  return back(saved ? "done" : "error");
}
