import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase, siteUrl } from "@/lib/env";
import { hasKit, subscribeToKit } from "@/lib/kit";
import { createAdminClient } from "@/lib/supabase/server";

import { SIGNUP_EMAIL_COOKIE } from "@/components/InlineSurvey";

// The waitlist page shows the survey inline; answers send people back there instead of /survey.
const BACKS = ["/creator-breakdowns-waitlist"];

const RANGES = ["Under 1K", "1K to 10K", "10K to 50K", "50K to 100K", "100K+"];

// Saves a survey answer. If an email came along, the subscriber is tagged "surveyed" in Kit.
export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const form = await request.formData();

  const backPath = String(form.get("back") ?? "");
  const inline = BACKS.includes(backPath);
  const fail = () =>
    NextResponse.redirect(inline ? `${base}${backPath}?survey=error#survey` : `${base}/survey?error=1#survey`, 303);
  const answer = String(form.get("answer") ?? "").trim().slice(0, 4000);
  const followers = String(form.get("followers") ?? "");
  const email = (String(form.get("email") ?? "").trim() || request.cookies.get(SIGNUP_EMAIL_COOKIE)?.value || "").toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
  if (answer.length < 10 || !hasSupabase()) return fail();

  const { error } = await createAdminClient().from("survey_responses").insert({
    answer,
    followers: RANGES.includes(followers) ? followers : null,
    email: validEmail ? email : null,
  });
  if (error) {
    console.error("survey insert failed", error);
    return fail();
  }
  if (validEmail && hasKit()) {
    try {
      await subscribeToKit(email, ["surveyed"]);
    } catch (err) {
      console.error("kit tag surveyed failed", err);
    }
  }
  return NextResponse.redirect(inline ? `${base}${backPath}?survey=done#survey` : `${base}/survey?done=1`, 303);
}
