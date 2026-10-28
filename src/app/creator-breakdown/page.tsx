import type { Metadata } from "next";
import Wordmark from "@/components/Wordmark";
import PillLink from "@/components/PillLink";
import { offer } from "@/lib/offer";
import PricingGrid from "@/components/PricingGrid";

// Rendered per request so the Nov 11 cart-open date and prices switch on their own.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Creator Breakdown | Creative Mode",
  description:
    "4 deep breakdowns a month of what's working for Instagram creators: the numbers, the outlier Reels and the patterns behind them.",
};

const inside = [
  {
    title: "Outlier scores",
    body: "Every Reel scored against the creator's own median views, so you see which ones actually broke out and by how much.",
  },
  {
    title: "The dominant hook",
    body: "The hook pattern behind most of their views, plus the hidden sub-pattern inside it that the biggest hits share.",
  },
  {
    title: "Topics that work",
    body: "Which topics carry the account, which are lottery tickets, and which quietly win more often than you'd think.",
  },
  {
    title: "What flopped",
    body: "Their worst performers and what they have in common, so you skip the mistakes.",
  },
];

const perks = [
  ["A new breakdown every week", "4 a month. Every Reel quoted links to the Reel itself."],
  ["An \"apply it\" page", "3 hook templates, the topic formula and the script structure, ready to fill in."],
  ["The full library", "Every past breakdown, growing each month."],
  ["Vote on the Creator of the Month", "Members pick a creator, and I break them down."],
];

const faqs = [
  [
    "Who is this for?",
    "Creators building a personal brand on Instagram. Mostly beginners and intermediates, plus advanced creators with 100k+ followers who want fresh patterns.",
  ],
  [
    "How long does a breakdown take to read?",
    "About 30 minutes, including the apply-it page.",
  ],
  ["Can I cancel?", "Anytime, from your account page. No emails, no calls."],
  ["What if I don't like it?", offer.guarantee],
];

export default function CreatorBreakdownPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Wordmark />
        <a href="#pricing" className="label text-xs text-chalk/70 hover:text-chalk">
          Pricing
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-20">
          <p className="label text-xs text-birch">{offer.product}</p>
          <h1 className="font-display mt-4 max-w-4xl text-6xl leading-[0.9] sm:text-8xl">
            See exactly why a creator&apos;s Reels <span className="text-birch">blow up.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-chalk/80 sm:text-xl">
            {offer.breakdownsPerMonth} deep breakdowns a month of what&apos;s working for Instagram
            creators: the numbers, the outlier Reels and the patterns behind them.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <PillLink href="#pricing" variant="solid">
              See founding pricing
            </PillLink>
          </div>
        </section>

        {/* Promise */}
        <section className="border-y-2 border-oak bg-forest">
          <blockquote className="mx-auto max-w-4xl px-6 py-14 text-center text-2xl leading-snug text-chalk sm:text-3xl">
            &ldquo;{offer.promise}&rdquo;
            <footer className="label mt-6 text-xs text-birch">Martin Wang</footer>
          </blockquote>
        </section>

        {/* What's inside */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="label text-xs text-birch">Inside every breakdown</p>
          <h2 className="font-display mt-3 text-5xl sm:text-6xl">The numbers, not guesses.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {inside.map((item) => (
              <div key={item.title} className="border-2 border-oak p-6">
                <h3 className="label text-sm text-chalk">{item.title}</h3>
                <p className="mt-3 text-chalk/75">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Sample finding */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Stat value="21" label="Reels used one hook" />
            <Stat value="60%" label="of all views came from it" />
            <Stat value="11.1x" label="median outlier for the best variant" />
          </div>
          <p className="mt-4 text-sm text-chalk/60">
            A real finding from the breakdown of{" "}
            <a
              href="https://www.instagram.com/nategaffney/"
              className="underline hover:text-chalk"
              target="_blank"
              rel="noreferrer"
            >
              @nategaffney
            </a>
            : the &ldquo;rare breed of person who is both A and B&rdquo; hook.
          </p>
        </section>

        {/* What members get */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <p className="label text-xs text-birch">Membership</p>
          <h2 className="font-display mt-3 text-5xl sm:text-6xl">What you get</h2>
          <ul className="mt-10 divide-y-2 divide-oak border-y-2 border-oak">
            {perks.map(([title, body]) => (
              <li key={title} className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-10">
                <span className="label shrink-0 sm:w-80 text-sm text-chalk">{title}</span>
                <span className="text-chalk/75">{body}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-8 bg-forest/40 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="label text-xs text-birch">Founding member pricing</p>
            <h2 className="font-display mt-3 text-5xl sm:text-6xl">Lock in the founding price</h2>
            <p className="mt-4 max-w-2xl text-chalk/75">
              The founding price ends when the cart closes on November 15 and stays yours for as
              long as you&apos;re a member.
            </p>
            <PricingGrid />
            <p className="mt-8 text-chalk/75">
              <span className="label text-xs text-birch">30-day guarantee.</span> {offer.guarantee}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-display text-5xl sm:text-6xl">Questions</h2>
          <div className="mt-8 divide-y-2 divide-oak border-y-2 border-oak">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="label flex cursor-pointer list-none items-center justify-between text-sm">
                  {q}
                  <span className="text-birch group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-chalk/75">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-oak">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-chalk/50">
          <p>© {new Date().getFullYear()} Creative Mode. Creator Breakdown by Martin Wang.</p>
          <p className="mt-2">
            Creators featured are not affiliated with or endorsed by Creative Mode. Breakdowns
            describe what I observed in their public content.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-forest p-6">
      <p className="font-display text-6xl leading-none text-birch">{value}</p>
      <p className="mt-2 text-sm text-chalk/80">{label}</p>
    </div>
  );
}
