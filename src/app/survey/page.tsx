import type { Metadata } from "next";
import Link from "next/link";
import LandingFx from "@/components/LandingFx";

// Branded survey for the first email: one open question, a followers range, and the email
// prefilled from the link (?email=... via Kit's merge tag) so answers can be matched to subscribers.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quick question | Creative Mode",
  description: "Two questions from Martin Wang. Takes a minute.",
  robots: { index: false },
};

const FOLLOWER_RANGES = ["Under 1K", "1K to 10K", "10K to 50K", "50K to 100K", "100K+"];

export default async function SurveyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; done?: string; error?: string }>;
}) {
  const { email, done, error } = await searchParams;
  const prefill = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.toLowerCase() : "";
  return (
    <div className="cm">
      <div className="wrap topbar">
        <Link className="home" href="/">
          <span className="c">CREATIVE</span> <span className="m">MODE</span>
        </Link>
      </div>
      <section className="wl-hero">
        <div className="wrap">
          <p className="label eyebrow">Quick question · 1 minute</p>
          {done ? (
            <>
              <h1>Got it. Thank you.</h1>
              <p className="lead">
                I read every one of these. Your answers decide what I break down next, so keep an eye on your inbox.
              </p>
            </>
          ) : (
            <>
              <h1>
                What are your <em>top TWO questions</em> about getting your Reels to go viral and growing a following?
              </h1>
              <p className="lead">
                I&apos;m building something tailored to your answers. Be specific. &quot;Why do my hooks get
                skipped&quot; beats &quot;how do I grow&quot;.
              </p>
              <form action="/api/survey" method="post" className="survey" id="survey">
                <label className="label">
                  Your two questions
                  <textarea name="answer" required minLength={10} rows={6} placeholder={"1. …\n2. …"} />
                </label>
                <label className="label">
                  How many followers do you have? (optional)
                  <select name="followers" defaultValue="">
                    <option value="">Pick one</option>
                    {FOLLOWER_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="label">
                  Email (optional)
                  <input type="email" name="email" defaultValue={prefill} placeholder="you@email.com" />
                </label>
                <button type="submit" className="pill label solid">
                  <span className="sq"></span>
                  <span>Send my answers</span>
                  <span aria-hidden="true">→</span>
                </button>
                {error && <p className="wl-note">Something went wrong. Try again in a minute.</p>}
              </form>
            </>
          )}
        </div>
      </section>
      <footer>
        <div className="wrap">
          <span>© 2026 Creative Mode</span>
          <span className="legal">
            <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
          </span>
        </div>
      </footer>
      <LandingFx />
    </div>
  );
}
