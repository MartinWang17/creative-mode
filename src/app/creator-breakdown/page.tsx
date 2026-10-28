import type { Metadata } from "next";
import LandingFx from "@/components/LandingFx";
import { planButtonHtml } from "@/components/PlanButton";
import { breakdownsHtml } from "@/content/breakdowns-html";
import { offer } from "@/lib/offer";

// Rendered per request so the plan buttons switch on by themselves when the cart opens.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Creator Breakdowns | Creative Mode",
  description:
    "Every week Martin Wang takes one fast-growing creator apart and hands you their strategy. A different niche, style and strategy every week.",
};

export default function CreatorBreakdownPage() {
  const html = breakdownsHtml
    .replace("%%PLAN_ANNUAL%%", planButtonHtml("annual", true))
    .replace("%%PLAN_MONTHLY%%", planButtonHtml("monthly", false));
  return (
    <div className="cm">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <LandingFx deadline={offer.cartCloses} />
    </div>
  );
}
