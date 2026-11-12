import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";
import { validShareKey } from "@/lib/share";
import { offer } from "@/lib/offer";

// Serves a breakdown's HTML for the iframe on /library/[slug].
// The sandbox header gives it its own throwaway origin, so the report's
// scripts run but can't touch the member's login cookies.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasSupabase() || offer.retiredBreakdowns.includes(slug)) return new NextResponse("Not found", { status: 404 });

  const { data: breakdown } = await createAdminClient()
    .from("breakdowns")
    .select("html, title, published, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (!breakdown) return new NextResponse("Not found", { status: 404 });

  const viewer = await getViewer();
  const shared = validShareKey(slug, request.nextUrl.searchParams.get("k"));
  const allowed =
    shared ||
    viewer?.isAdmin || (breakdown.published && (breakdown.is_free || viewer?.hasAccess));
  if (!allowed) return new NextResponse("Members only", { status: 403 });

  return new NextResponse(withEndSignal(wrap(breakdown.html, breakdown.title)), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}

// The report scrolls inside its own frame, so readers never reach the page below it (the feedback box,
// the "doors open" block). This tells the page once the reader reaches the end, so it can bring those up.
// Added when serving, so no breakdown file needs re-uploading.
const END_SIGNAL = `<script>(function(){var sent=false;function check(){if(sent)return;var d=document.documentElement;if(window.innerHeight+window.scrollY>=d.scrollHeight-60){sent=true;parent.postMessage({type:"cm-breakdown-end"},"*");}}addEventListener("scroll",check,{passive:true});})();</script>`;
function withEndSignal(html: string) {
  return /<\/body>/i.test(html) ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${END_SIGNAL}</body>`) : html + END_SIGNAL;
}

// Reports are saved as page fragments; give them a full document around them.
function wrap(html: string, title: string) {
  if (/<html[\s>]/i.test(html)) return html;
  const escaped = title.replace(/[<>&"]/g, "");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><title>${escaped}</title></head><body>${html}</body></html>`;
}
