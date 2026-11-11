import type { Metadata } from "next";
import LandingFx from "@/components/LandingFx";
import TypeHero from "@/components/TypeHero";
import { offer } from "@/lib/offer";

// Free-resource page: where the Instagram "comment BREAKDOWN" DM and Kit sign-up links send people.
// Email goes to Kit (tag launch-list + free-resource); the page hands over the breakdown right away.
// It's a squeeze page: one job (the email), so the wordmark isn't a link and there's no site menu.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free breakdown | Creative Mode",
  description: "The creator breakdown Martin Wang used to grow 200k followers in 45 days, after plateauing for 6 months. Free.",
};

const NOTES: Record<string, string> = {
  invalid: "That email doesn't look right. Try again?",
  error: "Something went wrong. Try again in a minute.",
};

export default async function FreeResourcePage({
  searchParams,
}: {
  searchParams: Promise<{ signup?: string }>;
}) {
  const { signup } = await searchParams;
  const done = signup === "done";
  const note = signup && NOTES[signup] ? NOTES[signup] : null;
  const read = `/library/${offer.freeBreakdown.slug}`;
  return (
    <div className="cm">
      <div className="wrap topbar">
        <span className="home">
          <span className="c">CREATIVE</span> <span className="m">MODE</span>
        </span>
      </div>
      <section className={`wl-hero sq${done ? " got" : ""}`}>
        <div className="wrap">
          <div className="sq-copy" id="signup">
            <p className="label eyebrow">Free resource · Creator Breakdowns</p>
            {done ? (
              <>
                <h1>
                  You&apos;re in. <em>Here it is.</em>
                </h1>
                <p className="wl-form">
                  <a className="pill label solid" href={read}>
                    <span className="sq"></span>
                    <span>Read the breakdown</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </p>
                <p className="wl-note muted">
                  {process.env.KIT_FORM_ID
                    ? "The link is in your inbox too, so you can come back to it anytime."
                    : "Bookmark it. It's free to read whenever you want."}
                </p>
              </>
            ) : (
              <>
                <TypeHero
                  segments={[
                    { text: "The breakdown I used to grow " },
                    { text: "200k followers", em: true },
                    { text: " in 45 days, after plateauing for 6 months." },
                  ]}
                />
                <p className="lead">
                  It&apos;s the full {offer.freeBreakdown.title}: the one hook pattern behind most of his views, the
                  formats that keep winning, and exactly how I adapted it for my own account. Drop your email and
                  it&apos;s yours.
                </p>
                <form action="/api/subscribe" method="post" className="wl-form">
                  <input type="hidden" name="source" value="free-resource" />
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@email.com"
                    aria-label="Email"
                  />
                  <button type="submit" className="pill label solid">
                    <span className="sq"></span>
                    <span>Send me the breakdown</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </form>
                {note ? (
                  <p className="wl-note">{note}</p>
                ) : (
                  <p className="wl-note muted">
                    Free. You&apos;ll also join the early list for Creator Breakdowns: a weekly series launching in
                    December where I break down a creator who&apos;s blowing up and show you how to use their pattern in
                    your own niche. Unsubscribe anytime.
                  </p>
                )}
              </>
            )}
          </div>
          <figure className="shot sq-peek">
            <figcaption className="label tag">Inside the breakdown</figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/landing/nate-story.jpg"
              alt="The first page of the Nate Gaffney breakdown: how he went from 10K to 910K followers in 91 days"
              width={1140}
              height={855}
            />
          </figure>
        </div>
      </section>
      <footer>
        <div className="wrap">
          <span>© 2026 Creative Mode</span>
          <span>Creators featured are not affiliated with or endorsed by Creative Mode.</span>
          <span className="legal">
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
          </span>
        </div>
      </footer>
      <LandingFx />
    </div>
  );
}
