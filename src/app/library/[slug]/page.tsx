import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/Shell";
import BreakdownFrame from "@/components/BreakdownFrame";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";
import { cartClosed, doorsOpen } from "@/lib/offer";

export const dynamic = "force-dynamic";

// One breakdown. The report itself loads in a sandboxed iframe from /api/breakdowns/[slug].
export default async function BreakdownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasSupabase()) notFound();
  const { data: b } = await createAdminClient()
    .from("breakdowns")
    .select("slug, title, creator_handle, published, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (!b) notFound();

  const viewer = await getViewer();
  if (!b.published && !viewer?.isAdmin) notFound();
  if (!b.is_free && !viewer?.isAdmin) {
    if (!viewer) redirect(`/login?next=${encodeURIComponent(`/library/${slug}`)}`);
    if (!viewer.hasAccess) redirect("/creator-breakdown#pricing");
  }

  return (
    <Shell viewer={viewer} wide>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pb-3">
        <Link href="/library" className="label text-xs text-chalk/60 hover:text-chalk">
          ← Library
        </Link>
        {b.creator_handle && (
          <a
            href={`https://www.instagram.com/${b.creator_handle}/`}
            target="_blank"
            rel="noreferrer"
            className="label text-[10px] text-birch"
          >
            @{b.creator_handle}
          </a>
        )}
      </div>
      <BreakdownFrame src={`/api/breakdowns/${slug}`} title={b.title} />
      {b.is_free && !viewer?.hasAccess && (
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
      <p className="label text-xs text-birch">Creator Breakdown</p>
      <h2 className="font-display mt-3 text-4xl sm:text-5xl text-chalk">{heading}</h2>
      <p className="mt-4 max-w-2xl text-chalk/85">{body}</p>
      <Link
        href={cta.href}
        className="label mt-6 inline-block border-2 border-birch px-5 py-3 text-xs text-birch hover:bg-bedrock"
      >
        {cta.label} →
      </Link>
    </section>
  );
}
