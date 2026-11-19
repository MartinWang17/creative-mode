import type { Metadata } from "next";
import LandingFx from "@/components/LandingFx";
import { planButtonHtml } from "@/components/PlanButton";
import { breakdownsHtml } from "@/content/breakdowns-html";
import { cartClosed, offer } from "@/lib/offer";
import { getSettings } from "@/lib/settings";
import { getViewer } from "@/lib/members";

// Rendered per request so the plan buttons switch on by themselves when the cart opens.
export const dynamic = "force-dynamic";

const description =
  "Every week Martin Wang takes one fast-growing creator apart and hands you their strategy. A different niche, style and strategy every week.";

// Kept out of search results until doors open, so the price isn't found before launch.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Creator Breakdowns | Creative Mode",
    description,
    ...(new Date() < new Date(offer.cartOpens) ? { robots: { index: false, follow: false } } : {}),
  };
}

const WL_NOTES: Record<string, string> = {
  joined: "You're on the list. You'll hear first when doors open again.",
  invalid: "That email doesn't look right. Try again?",
  error: "Something went wrong. Try again in a minute.",
};

// The page carries both versions of the launch copy; <!--open--> parts show until doors close,
// <!--closed--> parts (waitlist) after.
export default async function CreatorBreakdownPage({
  searchParams,
}: {
  searchParams: Promise<{ waitlist?: string }>;
}) {
  const { waitlist } = await searchParams;
  const closed = cartClosed();
  const isAdmin = !!(await getViewer())?.isAdmin;
  const settings = await getSettings();
  const note = waitlist && WL_NOTES[waitlist] ? `<p class="wl-note">${WL_NOTES[waitlist]}</p>` : "";
  const review = settings.reelReviewBonus;
  const html = breakdownsHtml
    .replace(closed ? /<!--open-->[\s\S]*?<!--\/open-->/g : /<!--closed-->[\s\S]*?<!--\/closed-->/g, "")
    .replace("%%PLAN_ANNUAL%%", planButtonHtml("annual", true, isAdmin))
    .replace("%%PLAN_MONTHLY%%", planButtonHtml("monthly", false, isAdmin))
    .replace("%%WL_NOTE%%", note)
    .replace(
      "%%REVIEW_ROW%%",
      review ? `<div class="row new hot"><span><b>First 100 annual members:</b> a Reel of yours, reviewed by me</span><span>Limited</span></div>` : "",
    )
    .replace("%%REVIEW_CARD%%", review ? `<p class="review"><b>First 100 annual members</b> get a Reel reviewed by me.</p>` : "")
    .replace("%%PROOF%%", proofHtml(settings.proofQuotes, isAdmin));
  return (
    <div className="cm">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <LandingFx deadline={closed ? undefined : offer.cartCloses} />
    </div>
  );
}

// Praise next to the guarantee. Martin adds quotes in Admin (from readers of the free breakdown);
// with none added, visitors see nothing and admins see a placeholder.
function proofHtml(quotes: string[], isAdmin: boolean) {
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (quotes.length === 0) {
    return isAdmin
      ? `<div class="praise empty"><p class="label eyebrow">Proof slot (only you see this)</p><p>Add quotes from readers of the free breakdown in Admin and they show here.</p></div>`
      : "";
  }
  return `<div class="praise" aria-label="What readers of the free breakdown said"><p class="label eyebrow">From the free breakdown</p>${quotes
    .map((q) => `<blockquote>&ldquo;${esc(q.replace(/^["“]|["”]$/g, ""))}&rdquo;</blockquote>`)
    .join("")}<p class="who">Names hidden for privacy.</p></div>`;
}
