import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/Shell";
import BreakdownFrame from "@/components/BreakdownFrame";
import FeedbackBox from "@/components/FeedbackBox";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";
import { cartClosed, doorsOpen, offer } from "@/lib/offer";
import { validShareKey } from "@/lib/share";

export const dynamic = "force-dynamic";

// Creator gift links (?k=) are private: keep them out of search engines.
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ k?: string }> }): Promise<Metadata> {
  const { k } = await searchParams;
  return k ? { robots: { index: false, follow: false } } : {};
}

// One breakdown. The report itself loads in a sandboxed iframe from /api/breakdowns/[slug].
export default async function BreakdownPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ k?: string }>;
}) {
  const { slug } = await params;
  const { k } = await searchParams;
  if (offer.retiredBreakdowns.includes(slug)) redirect(`/library/${offer.freeBreakdown.slug}`);
  const shared = validShareKey(slug, k);
  if (!hasSupabase()) notFound();
  const { data: b } = await createAdminClient()
    .from("breakdowns")
    .select("slug, title, creator_handle, published, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (!b) notFound();

  // "Went from X to Y in Z months" line; skipped quietly if the column isn't in Supabase yet.
  const { data: extra } = await createAdminClient().from("breakdowns").select("growth").eq("slug", slug).maybeSingle();
  const growth = (extra as { growth?: string | null } | null)?.growth ?? null;

  const viewer = await getViewer();
  if (!shared && !b.published && !viewer?.isAdmin) notFound();
  if (!shared && !b.is_free && !viewer?.isAdmin) {
    if (!viewer) redirect(`/login?next=${encodeURIComponent(`/library/${slug}`)}`);
    if (!viewer.hasAccess) redirect("/creator-breakdown#pricing");
  }

  return (
    <Shell viewer={viewer} wide>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pb-3">
        <Link href="/library" className="label text-sm text-chalk/60 hover:text-chalk">
          ← Library
        </Link>
        {b.creator_handle && (
          <a
            href={`https://www.instagram.com/${b.creator_handle}/`}
            target="_blank"
            rel="noreferrer"
            className="label text-xs text-birch"
          >
            @{b.creator_handle}
          </a>
        )}
      </div>
      {growth && (
        <p className="mx-auto max-w-6xl px-6 pb-3 font-display text-2xl leading-none text-birch sm:text-3xl">{growth}</p>
      )}
      <BreakdownFrame
        src={`/api/breakdowns/${slug}${shared ? `?k=${encodeURIComponent(k!)}` : ""}`}
        title={b.title}
        endTarget={b.is_free && !shared ? "after-breakdown" : undefined}
      />
      {b.is_free && !shared && (
        <div id="after-breakdown" className="mx-auto max-w-6xl scroll-mt-24 px-6">
          <FeedbackBox slug={slug} />
        </div>
      )}
      {b.is_free && !shared && !viewer?.hasAccess && (
        <div className="mx-auto max-w-6xl px-6">
          <EndBlock />
        </div>
      )}
    </Shell>
  );
}

// Shown under free breakdowns for people who aren't members yet. Changes with the launch dates.
function EndBlock() {
  const now = new Date();
  const teasing = now >= new Date("2026-11-28T00:00:00-05:00");
  let heading: string;
  let body: string;
  let cta: { href: string; label: string };
  if (doorsOpen(now)) {
    heading = "Doors are open";
    body =
      "Join Creator Breakdown and get a new breakdown like this every week. The founding price is locked in for life, but only until doors close Sunday, December 13th.";
    cta = { href: "/creator-breakdown", label: "Join now" };
  } else if (cartClosed(now)) {
    heading = "Doors are closed";
    body = "Creator Breakdown is closed until the next launch. Join the waitlist and you'll be the first to know when it opens again.";
    cta = { href: "/creator-breakdowns-waitlist", label: "Join the waitlist" };
  } else {
    heading = "You're on the list";
    body =
      "Doors open Tuesday, December 8th, and members get a new breakdown like this every week." +
      (teasing ? " Watch your inbox on December 2nd for my free video series." : "");
    cta = { href: "/creator-breakdown", label: "See what's inside" };
  }
  return (
    <section className="mt-8 border-2 border-oak bg-forest p-8 sm:p-10">
      <p className="label text-sm text-birch">Creator Breakdown</p>
      <h2 className="font-display mt-3 text-4xl sm:text-5xl text-chalk">{heading}</h2>
      <p className="mt-4 max-w-2xl text-chalk/85">{body}</p>
      <Link
        href={cta.href}
        className="label mt-6 inline-block border-2 border-birch px-5 py-3 text-sm text-birch hover:bg-bedrock"
      >
        {cta.label} →
      </Link>
    </section>
  );
}
