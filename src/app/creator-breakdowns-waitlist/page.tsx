import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LandingFx from "@/components/LandingFx";
import { doorsOpen, offer } from "@/lib/offer";

// Pre-launch page: the home button points here until the cart opens. Martin's copy, a countdown
// to the doors opening, and an email box so nobody has to remember to come back.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Creator Breakdowns waitlist | Creative Mode",
  description:
    "The exact strategy Martin Wang used to grow to 200K followers after 10 months stuck at 44. Doors open Nov 24.",
};

const NOTES: Record<string, string> = {
  joined: "You're on the list. You'll get the link the moment doors open.",
  invalid: "That email doesn't look right. Try again?",
  error: "Something went wrong. Try again in a minute.",
};

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ waitlist?: string }>;
}) {
  if (doorsOpen()) redirect("/creator-breakdown");
  const { waitlist } = await searchParams;
  const note = waitlist && NOTES[waitlist] ? NOTES[waitlist] : null;
  return (
    <div className="cm">
      <div className="wrap topbar">
        <Link className="home" href="/">
          <span className="c">CREATIVE</span> <span className="m">MODE</span>
        </Link>
      </div>
      <section className="wl-hero">
        <div className="wrap">
          <p className="label eyebrow">Creator Breakdowns · doors open Tue Nov 24</p>
          <h1>
            I will share the exact strategy I used to grow to <em>200k followers</em> after being stuck at
            a plateau at 44 followers for 10 months.
          </h1>
          <p className="lead">
            (It&apos;s not a course, I bought over $5,000 worth of courses and I was still stuck. No one
            shares this because it&apos;s hard to package it, but I&apos;m going to reveal everything that
            worked for me, and I&apos;ll help you achieve the same results if you put in the work)
          </p>
          <p className="label eyebrow" style={{ marginTop: 44 }}>
            Doors open in
          </p>
          <div className="count" id="count" aria-label="Time until doors open">
            <div>
              <b data-u="d">0</b>
              <small>days</small>
            </div>
            <div>
              <b data-u="h">0</b>
              <small>hours</small>
            </div>
            <div>
              <b data-u="m">0</b>
              <small>minutes</small>
            </div>
            <div>
              <b data-u="s">0</b>
              <small>seconds</small>
            </div>
          </div>
          <p className="when">Tuesday, November 24. 9am Eastern.</p>
          <form action="/api/waitlist" method="post" className="wl-form" id="waitlist">
            <input type="hidden" name="back" value="/creator-breakdowns-waitlist" />
            <input type="email" name="email" required placeholder="you@email.com" aria-label="Email" />
            <button type="submit" className="pill label solid">
              <span className="sq"></span>
              <span>Join the waitlist</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
          {note ? (
            <p className="wl-note">{note}</p>
          ) : (
            <p className="wl-note muted">Drop your email and I&apos;ll send you the link the moment doors open.</p>
          )}
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
      <LandingFx deadline={offer.cartOpens} />
    </div>
  );
}
