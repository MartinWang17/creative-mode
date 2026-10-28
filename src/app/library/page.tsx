import Link from "next/link";
import Shell from "@/components/Shell";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Row = {
  slug: string;
  title: string;
  creator_handle: string | null;
  summary: string | null;
  is_free: boolean;
  published_at: string | null;
};

// Every published breakdown. Free ones open for anyone; the rest need a membership.
export default async function LibraryPage() {
  const viewer = await getViewer();
  let rows: Row[] = [];
  if (hasSupabase()) {
    const { data } = await createAdminClient()
      .from("breakdowns")
      .select("slug, title, creator_handle, summary, is_free, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    rows = (data ?? []) as Row[];
  }

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
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {rows.map((b) => {
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
        {rows.length === 0 && (
          <li className="text-chalk/60">No breakdowns published yet.</li>
        )}
      </ul>
    </Shell>
  );
}
