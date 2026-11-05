import type { Metadata } from "next";
import Link from "next/link";
import LandingFx from "@/components/LandingFx";
import TypeHero from "@/components/TypeHero";
import { offer } from "@/lib/offer";

// Free-resource page: where the Instagram "comment BREAKDOWN" DM and Kit sign-up links send people.
// Email goes to Kit (tag launch-list + free-resource); the page hands over the breakdown right away.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free breakdown | Creative Mode",
  description: "The creator breakdown Martin Wang used to grow 200K followers in 45 days. Free.",
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
        <Link className="home" href="/">
          <span className="c">CREATIVE</span> <span className="m">MODE</span>
        </Link>
      </div>
      <section className="wl-hero">
        <div className="wrap">
          <p className="label eyebrow">Free resource · Creator Breakdowns</p>
          <TypeHero
            segments={[
              { text: "The breakdown I used to grow " },
              { text: "200k followers", em: true },
              { text: " in 45 days, after being stuck for a year." },
            ]}
          />
          <p className="lead">
            It&apos;s the full {offer.freeBreakdown.title}: the one hook pattern behind most of his views, the
            formats that keep winning, and exactly how I copied it for my own account. Drop your email and
            it&apos;s yours.
          </p>
          <div id="signup">
            {done ? (
              <>
                <p className="when" style={{ marginTop: 34 }}>
                  You&apos;re in. Here it is.
                </p>
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
                <form action="/api/subscribe" method="post" className="wl-form">
                  <input type="email" name="email" required placeholder="you@email.com" aria-label="Email" />
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
                    Free. You&apos;ll also hear first when Creator Breakdowns opens. Unsubscribe anytime.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <footer>
        <div className="wrap">
          <span>© 2026 Creative Mode</span>
          <span>Creators featured are not affiliated with or endorsed by Creative Mode.</span>
          <span className="legal">
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a>
          </span>
        </div>
      </footer>
      <LandingFx />
    </div>
  );
}
