import LandingFx from "@/components/LandingFx";
import { homeHtml } from "@/content/home-html";
import { doorsOpen } from "@/lib/offer";

// Rendered per request so the pill switches from the waitlist to the sales page when doors open.
export const dynamic = "force-dynamic";

// Creative Mode home: the wordmark, "by Martin Wang", and one pill to Creator Breakdowns
// (the waitlist page until the cart opens).
export default function Home() {
  const html = homeHtml.replace(
    'href="/creator-breakdown"',
    `href="${doorsOpen() ? "/creator-breakdown" : "/creator-breakdowns-waitlist"}"`,
  );
  return (
    <div className="cm">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <LandingFx />
    </div>
  );
}
