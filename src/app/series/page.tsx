import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import LandingFx from "@/components/LandingFx";
import { cartClosed, doorsOpen, offer } from "@/lib/offer";
import { getViewer } from "@/lib/members";
import { getSettings, videoEmbedUrl } from "@/lib/settings";

// The "comment GROW" page: the free 3-part series. One link works for all three videos, so every
// released episode stays on the page (newest first) with its video and its free resource, and the
// ones still to come show as locked with their date. Email goes to Kit (tags launch-list + series).
// Admins can preview any day with ?at=2026-12-04.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The free series | Creative Mode",
  description: "A free 3-part series from Martin Wang on growing on Instagram, with a free resource for each episode.",
  robots: { index: false, follow: false },
};

const NOTES: Record<string, string> = {
  invalid: "That email doesn't look right. Try again?",
  error: "Something went wrong. Try again in a minute.",
};

export default async function SeriesPage({ searchParams }: { searchParams: Promise<{ signup?: string; at?: string }> }) {
  const { signup, at } = await searchParams;
  // Day previews are for admins (and for local development, where there is no login).
  const canPreview = process.env.NODE_ENV !== "production" || !!(await getViewer())?.isAdmin;
  const preview = canPreview && at && /^\d{4}-\d{2}-\d{2}$/.test(at) ? new Date(`${at}T12:00:00-05:00`) : null;
  const now = preview ?? new Date();

  // Anyone who already signed up for a free page is on the list, so they don't have to do it twice.
  const jar = await cookies();
  const unlocked = signup === "done" || ["cm_series", "cm_formats", "cm_free-resource"].some((c) => jar.get(c)?.value === "1");
  const note = signup && NOTES[signup] ? NOTES[signup] : null;

  const saved = (await getSettings()).seriesEpisodes;
  const episodes = offer.series.map((e, i) => ({
    ...e,
    title: saved[i]?.title || e.title,
    embed: saved[i]?.video ? videoEmbedUrl(saved[i].video) : null,
    out: now >= new Date(e.releases),
  }));
  const out = episodes.filter((e) => e.out).reverse(); // newest first
  const coming = episodes.filter((e) => !e.out);
  const started = out.length > 0;
  const first = offer.series[0];

  return (
    <div className="cm">
      <div className="wrap topbar">
        <Link className="home" href="/">
          <span className="c">CREATIVE</span> <span className="m">MODE</span>
        </Link>
      </div>
      {preview && (
        <div className="wrap">
          <p className="sr-preview label">Preview of {at} (only you see this)</p>
        </div>
      )}
      {doorsOpen(now) && (
        <div className="wrap">
          <a className="sr-doors" href="/creator-breakdown">
            <b>Doors are open until Sunday, Dec 13.</b> <span>See Creator Breakdowns →</span>
          </a>
        </div>
      )}
      {cartClosed(now) && (
        <div className="wrap">
          <a className="sr-doors" href="/creator-breakdowns-waitlist">
            <b>Doors are closed for now.</b> <span>Join the waitlist for the next launch →</span>
          </a>
        </div>
      )}
      <section className="wl-hero fm-hero-short sr-hero">
        <div className="wrap">
          <p className="label eyebrow">Free series · {offer.series.length} episodes</p>
          <h1>
            How I grew <em>224k followers in 30 days</em> after 6 months of nothing.
          </h1>
          <p className="lead">
            {started
              ? "Three short videos on what changed, each with a free resource so you can use it on your own content."
              : `Three short videos on what changed, each with a free resource so you can use it on your own content. Episode 1 drops ${first.drops}.`}
          </p>
          <div id="signup">
            {unlocked ? (
              <>
                <p className="when">{started ? "You're in. Start with the newest episode." : `You're on the list. Episode 1 drops ${first.drops}.`}</p>
                {/* Always leave a way to enter an email: a shared phone, or someone who wants it at another address. */}
                <details className="sr-again">
                  <summary>Not signed up yet, or want it at a different email?</summary>
                  <form action="/api/subscribe" method="post" className="wl-form">
                    <input type="hidden" name="source" value="series" />
                    <input type="email" name="email" required placeholder="you@email.com" aria-label="Email" />
                    <button type="submit" className="pill label solid">
                      <span className="sq"></span>
                      <span>Save my spot</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </form>
                </details>
                {note && <p className="wl-note">{note}</p>}
              </>
            ) : (
              <>
                <form action="/api/subscribe" method="post" className="wl-form">
                  <input type="hidden" name="source" value="series" />
                  <input type="email" name="email" required placeholder="you@email.com" aria-label="Email" />
                  <button type="submit" className="pill label solid">
                    <span className="sq"></span>
                    <span>{started ? "Unlock the series" : "Save my spot"}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </form>
                {note ? (
                  <p className="wl-note">{note}</p>
                ) : (
                  <p className="wl-note muted">Free. You&apos;ll also hear first when Creator Breakdowns opens. Unsubscribe anytime.</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="sr">
        <div className="wrap">
          {out.map((e) => (
            <article className="sr-ep" key={e.n} id={`episode-${e.n}`}>
              <p className="label eyebrow">Episode {e.n}</p>
              <h2>{e.title}</h2>
              {unlocked ? (
                <>
                  {e.embed ? (
                    <div className="vid-frame">
                      <iframe
                        src={e.embed}
                        title={`Episode ${e.n}: ${e.title}`}
                        loading="lazy"
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="vid-frame empty">
                      <p className="label">The video is on its way</p>
                      <p>Check back in a little bit.</p>
                    </div>
                  )}
                  {e.resource ? (
                    <a className="pill label solid" href={e.resource.href}>
                      <span className="sq"></span>
                      <span>{e.resource.label}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : doorsOpen(now) ? (
                    <a className="pill label solid" href="/creator-breakdown">
                      <span className="sq"></span>
                      <span>Get first access</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : cartClosed(now) ? (
                    <a className="pill label solid" href="/creator-breakdowns-waitlist">
                      <span className="sq"></span>
                      <span>Join the waitlist</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <p className="sr-first">
                      <b>You&apos;re on the list for first access.</b> Doors to Creator Breakdowns open Tuesday, Dec 8 at 9am ET, and
                      I&apos;ll email you the link the moment they do.
                    </p>
                  )}
                </>
              ) : (
                <a className="sr-gate" href="#signup">
                  Enter your email above to watch it and get the free resource ↑
                </a>
              )}
            </article>
          ))}
          {coming.map((e) => (
            <article className="sr-ep locked" key={e.n}>
              <p className="label eyebrow">Episode {e.n} · drops {e.drops}</p>
              <h2>{e.title}</h2>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div className="wrap">
          <span>© 2026 Creative Mode</span>
          <span className="legal">
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a>
          </span>
        </div>
      </footer>
      <LandingFx />
    </div>
  );
}
