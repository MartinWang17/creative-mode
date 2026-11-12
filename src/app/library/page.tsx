import Link from "next/link";
import Shell from "@/components/Shell";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";
import { SIZES } from "@/lib/tags";
import { offer } from "@/lib/offer";

export const dynamic = "force-dynamic";

type Row = {
  slug: string;
  title: string;
  creator_handle: string | null;
  summary: string | null;
  is_free: boolean;
  published_at: string | null;
  format?: string | null;
  difficulty?: string | null;
  size?: string | null;
  growth?: string | null;
};

// Every published breakdown. Free ones open for anyone; the rest need a membership.
export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string; size?: string }>;
}) {
  const { format: picked, size: pickedSize } = await searchParams;
  const viewer = await getViewer();
  let rows: Row[] = [];
  if (hasSupabase()) {
    const db = createAdminClient();
    const base = "slug, title, creator_handle, summary, is_free, published_at";
    // Newest columns first; if they haven't been added in Supabase yet, fall back step by step.
    let tagged: { data: unknown[] | null; error: unknown } = await db
      .from("breakdowns")
      .select(`${base}, format, difficulty, size, growth`)
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (tagged.error) {
      tagged = await db
        .from("breakdowns")
        .select(`${base}, format, difficulty`)
        .eq("published", true)
        .order("published_at", { ascending: false });
    }
    if (!tagged.error) {
      rows = (tagged.data ?? []) as Row[];
    } else {
      // Tag columns not added yet: show the library without tags.
      const { data } = await db
        .from("breakdowns")
        .select(base)
        .eq("published", true)
        .order("published_at", { ascending: false });
      rows = (data ?? []) as Row[];
    }
  }
  rows = rows.filter((r) => !offer.retiredBreakdowns.includes(r.slug));
  const formats = [...new Set(rows.map((r) => r.format).filter((f): f is string => !!f))].sort();
  const sizes = SIZES.filter((z) => rows.some((r) => r.size === z));
  const shown = rows.filter((r) => (!picked || r.format === picked) && (!pickedSize || r.size === pickedSize));
  // Filter links keep the other filter that's already picked.
  const href = (f?: string, z?: string) => {
    const q = new URLSearchParams();
    if (f) q.set("format", f);
    if (z) q.set("size", z);
    const qs = q.toString();
    return qs ? `/library?${qs}` : "/library";
  };
  const chip = (active: boolean) =>
    `label border-2 px-3 py-1.5 text-[10px] ${
      active ? "border-birch bg-forest text-birch" : "border-oak text-chalk/70 hover:text-chalk"
    }`;

  return (
    <Shell viewer={viewer}>
      <div className="pt-10">
        <p className="label text-xs text-birch">Library</p>
        <h1 className="font-display mt-3 text-6xl sm:text-7xl">Creator breakdowns</h1>
        {!viewer?.hasAccess && (
          <p className="mt-4 max-w-xl text-chalk/75">
            Free breakdowns are open to everyone.{" "}
            <Link href="/creator-breakdown#pricing" className="text-birch underline">
              Become a member
            </Link>{" "}
            to unlock the rest.
          </p>
        )}
      </div>
      {formats.length > 1 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="label mr-1 text-[10px] text-chalk/50">Format</span>
          <Link href={href(undefined, pickedSize)} className={chip(!picked)}>
            All
          </Link>
          {formats.map((f) => (
            <Link key={f} href={href(f, pickedSize)} className={chip(picked === f)}>
              {f}
            </Link>
          ))}
        </div>
      )}
      {sizes.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="label mr-1 text-[10px] text-chalk/50">Where they started</span>
          <Link href={href(picked, undefined)} className={chip(!pickedSize)}>
            All
          </Link>
          {sizes.map((z) => (
            <Link key={z} href={href(picked, z)} className={chip(pickedSize === z)}>
              {z}
            </Link>
          ))}
        </div>
      )}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {shown.map((b) => {
          const locked = !b.is_free && !viewer?.hasAccess;
          return (
            <li key={b.slug} className="border-2 border-oak p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="label text-[10px] text-birch">
                  {b.creator_handle ? `@${b.creator_handle}` : "Breakdown"}
                </p>
                <p className="label text-[10px] text-chalk/50">
                  {locked ? "Members" : b.is_free ? "Free" : ""}
                </p>
              </div>
              <h2 className="font-display mt-3 text-4xl leading-none">{b.title}</h2>
              {b.growth && <p className="mt-2 text-sm text-birch">{b.growth}</p>}
              {(b.format || b.difficulty || b.size) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {b.format && (
                    <span className="label bg-forest px-2 py-1 text-[10px] text-birch">{b.format}</span>
                  )}
                  {b.difficulty && (
                    <span className="label border border-oak px-2 py-1 text-[10px] text-chalk/70">
                      {b.difficulty}
                    </span>
                  )}
                  {b.size && (
                    <span className="label border border-birch px-2 py-1 text-[10px] text-birch">{b.size}</span>
                  )}
                </div>
              )}
              {b.summary && <p className="mt-3 text-chalk/75">{b.summary}</p>}
              <Link
                href={locked ? "/creator-breakdown#pricing" : `/library/${b.slug}`}
                className="label mt-6 inline-block text-xs text-chalk underline-offset-4 hover:underline"
              >
                {locked ? "Unlock →" : "Read →"}
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="text-chalk/60">
            {picked || pickedSize ? "No breakdowns match that yet." : "No breakdowns published yet."}
          </li>
        )}
      </ul>
    </Shell>
  );
}
