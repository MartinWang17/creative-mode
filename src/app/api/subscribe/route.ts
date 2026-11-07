import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase, siteUrl } from "@/lib/env";
import { hasKit, subscribeToKit } from "@/lib/kit";
import { createAdminClient } from "@/lib/supabase/server";

// The free-resource page posts here. Adds the email to Kit; if Kit isn't set up or fails,
// keeps the email in the waitlist table so nothing is lost, and the page still hands over the link.
// Each free page sends its name as "source"; it decides the extra Kit tag and where we send them back.
const SOURCES = { "free-resource": "free-resource", formats: "formats" } as const;
type Source = keyof typeof SOURCES;

export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const form = await request.formData();
  const raw = String(form.get("source") ?? "free-resource");
  const source: Source = raw in SOURCES ? (raw as Source) : "free-resource";
  const back = (state: string) => {
    const res = NextResponse.redirect(`${base}/${source}?signup=${state}#signup`, 303);
    // Remember the sign-up so returning visitors go straight to the content.
    if (state === "done") res.cookies.set(`cm_${source}`, "1", { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
    return res;
  };

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return back("invalid");

  let saved = false;
  if (hasKit()) {
    try {
      await subscribeToKit(email, [SOURCES[source]]);
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
