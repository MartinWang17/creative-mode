import type { Metadata } from "next";
import LandingFx from "@/components/LandingFx";
import { planButtonHtml } from "@/components/PlanButton";
import { breakdownsHtml } from "@/content/breakdowns-html";
import { cartClosed, offer, scriptPackAnnounced } from "@/lib/offer";

// Rendered per request so the plan buttons switch on by themselves when the cart opens.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Creator Breakdowns | Creative Mode",
  description:
    "Every week Martin Wang takes one fast-growing creator apart and hands you their strategy. A different niche, style and strategy every week.",
};

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
  const sp = offer.scriptPack;
  const pack = scriptPackAnnounced();
  const note = waitlist && WL_NOTES[waitlist] ? `<p class="wl-note">${WL_NOTES[waitlist]}</p>` : "";
  const html = breakdownsHtml
    .replace(closed ? /<!--open-->[\s\S]*?<!--\/open-->/g : /<!--closed-->[\s\S]*?<!--\/closed-->/g, "")
    .replace("%%PLAN_ANNUAL%%", planButtonHtml("annual", true))
    .replace("%%PLAN_MONTHLY%%", planButtonHtml("monthly", false))
    .replace("%%WL_NOTE%%", note)
    .replace(
      "%%SCRIPT_PACK_ROW%%",
      pack ? `<div class="row new"><span>${sp.name}: ${sp.blurb.replace(" Annual members only.", " (annual members)")}</span><span>${sp.value}</span></div>` : "",
    )
    .replace("%%SCRIPT_PACK_CARD%%", pack ? ` And the ${sp.name}: ${sp.blurb.replace(" Annual members only.", "")}` : "")
    .replace(
      "%%SCRIPT_PACK_FAQ%%",
      pack
        ? `<details><summary><span>What's the ${sp.name}?</span><i>+</i></summary><p>${sp.blurb} Every annual member gets it, including everyone who joined before it was announced.</p></details>`
        : "",
    );
  return (
    <div className="cm">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <LandingFx deadline={closed ? undefined : offer.cartCloses} />
    </div>
  );
}
