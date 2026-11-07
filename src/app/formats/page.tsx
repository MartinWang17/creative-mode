import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import LandingFx from "@/components/LandingFx";
import TypeHero from "@/components/TypeHero";
import FormatsLibrary, { type Format } from "@/components/FormatsLibrary";
import formats from "@/data/formats.json";

// The "comment FORMAT" freebie: 100 viral formats. Email goes to Kit (tags launch-list + formats),
// then the library shows right away. A cookie keeps it open for returning visitors.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "100 viral formats | Creative Mode",
  description: "100 proven Reel formats, each with a text hook, how to make it, and the original example. Free.",
};

const NOTES: Record<string, string> = {
  invalid: "That email doesn't look right. Try again?",
  error: "Something went wrong. Try again in a minute.",
};

export default async function FormatsPage({ searchParams }: { searchParams: Promise<{ signup?: string }> }) {
  const { signup } = await searchParams;
  const unlocked = signup === "done" || (await cookies()).get("cm_formats")?.value === "1";
  const note = signup && NOTES[signup] ? NOTES[signup] : null;
  return (
    <div className="cm">
      <div className="wrap topbar">
        <Link className="home" href="/">
          <span className="c">CREATIVE</span> <span className="m">MODE</span>
        </Link>
      </div>
      <section className={unlocked ? "wl-hero fm-hero-short" : "wl-hero"}>
        <div className="wrap">
          <p className="label eyebrow">Free resource · 100 viral formats</p>
          <TypeHero
            segments={[
              { text: "100 Reel formats that " },
              { text: "already went viral", em: true },
              { text: ". Pick one, make it yours." },
            ]}
          />
          <p className="lead">
            Every format comes with the text hook, a step by step for how to make it in your own niche, and the
            original video so you can see it work.
          </p>
          <div id="signup">
            {unlocked ? (
              <p className="when" style={{ marginTop: 30 }}>
                You&apos;re in. Scroll down and pick one.
              </p>
            ) : (
              <>
                <form action="/api/subscribe" method="post" className="wl-form">
                  <input type="hidden" name="source" value="formats" />
                  <input type="email" name="email" required placeholder="you@email.com" aria-label="Email" />
                  <button type="submit" className="pill label solid">
                    <span className="sq"></span>
                    <span>Send me the formats</span>
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
      {unlocked && (
        <section className="fm" id="library">
          <div className="wrap">
            <FormatsLibrary formats={formats as Format[]} />
          </div>
        </section>
      )}
      <footer>
        <div className="wrap">
          <span>© 2026 Creative Mode</span>
          <span>Example videos belong to their creators and are linked, not copied. Creators featured are not affiliated with or endorsed by Creative Mode.</span>
          <span className="legal">
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a>
          </span>
        </div>
      </footer>
      <LandingFx />
    </div>
  );
}
