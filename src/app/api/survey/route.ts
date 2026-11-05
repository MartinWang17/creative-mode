import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase, siteUrl } from "@/lib/env";
import { hasKit, subscribeToKit } from "@/lib/kit";
import { createAdminClient } from "@/lib/supabase/server";

const RANGES = ["Under 1K", "1K to 10K", "10K to 50K", "50K to 100K", "100K+"];

// Saves a survey answer. If an email came along, the subscriber is tagged "surveyed" in Kit.
export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const form = await request.formData();
  if (String(form.get("website") ?? "")) return NextResponse.redirect(`${base}/survey?done=1`, 303); // bot filled the honeypot

  const answer = String(form.get("answer") ?? "").trim().slice(0, 4000);
  const followers = String(form.get("followers") ?? "");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
  if (answer.length < 10 || !hasSupabase()) return NextResponse.redirect(`${base}/survey?error=1#survey`, 303);

  const { error } = await createAdminClient().from("survey_responses").insert({
    answer,
    followers: RANGES.includes(followers) ? followers : null,
    email: validEmail ? email : null,
  });
  if (error) {
    console.error("survey insert failed", error);
    return NextResponse.redirect(`${base}/survey?error=1#survey`, 303);
  }
  if (validEmail && hasKit()) {
    try {
      await subscribeToKit(email, ["surveyed"]);
    } catch (err) {
      console.error("kit tag surveyed failed", err);
    }
  }
  return NextResponse.redirect(`${base}/survey?done=1`, 303);
}
