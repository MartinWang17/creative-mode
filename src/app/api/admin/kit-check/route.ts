import { NextResponse, type NextRequest } from "next/server";
import { getViewer } from "@/lib/members";
import { hasKit, subscribeToKit } from "@/lib/kit";

// Admin-only Kit test: /api/admin/kit-check?email=you+test@gmail.com&tag=formats
// Subscribes and tags that email the same way the sign-up pages do, and shows each step's result.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) return NextResponse.json({ error: "admins only" }, { status: 403 });
  if (!hasKit()) return NextResponse.json({ error: "KIT_API_KEY is not set in Vercel" }, { status: 500 });
  const email = (request.nextUrl.searchParams.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "add ?email=..." }, { status: 400 });
  const tag = request.nextUrl.searchParams.get("tag") || "free-resource";
  try {
    const steps = await subscribeToKit(email, [tag]);
    return NextResponse.json({ email, launchTag: process.env.KIT_TAG || "launch-list", formId: process.env.KIT_FORM_ID || null, steps });
  } catch (err) {
    return NextResponse.json({ email, error: String(err) }, { status: 500 });
  }
}
