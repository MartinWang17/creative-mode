import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";
import { SIGNUP_EMAIL_COOKIE } from "@/components/InlineSurvey";
import { RATINGS } from "@/lib/feedback";

// Saves feedback from the box under a free breakdown. Answers are private: only Admin reads them.
export async function POST(request: NextRequest) {
  let body: { slug?: unknown; rating?: unknown; answer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const slug = String(body.slug ?? "").slice(0, 120);
  const rating = RATINGS.some((r) => r.id === body.rating) ? String(body.rating) : null;
  const answer = String(body.answer ?? "").trim().slice(0, 4000) || null;
  if (!slug || (!rating && !answer) || !hasSupabase()) return NextResponse.json({ ok: false }, { status: 400 });

  const viewer = await getViewer();
  const cookieEmail = (request.cookies.get(SIGNUP_EMAIL_COOKIE)?.value ?? "").toLowerCase();
  const email = viewer?.email ?? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cookieEmail) ? cookieEmail : null);

  const { error } = await createAdminClient().from("breakdown_feedback").insert({ slug, rating, answer, email });
  if (error) {
    console.error("feedback insert failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
