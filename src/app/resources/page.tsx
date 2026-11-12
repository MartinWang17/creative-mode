import Link from "next/link";
import Shell from "@/components/Shell";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { canOpen, listResources, releaseLabel, signedUrl, type Resource } from "@/lib/resources";

export const dynamic = "force-dynamic";

// Everything that comes with the membership besides the breakdowns:
// the training, the checklist, the Hook Vault, the Script Pack, and whatever gets added later.
export default async function ResourcesPage() {
  const viewer = await getViewer();
  const rows: Resource[] = hasSupabase() ? await listResources(viewer) : [];
  const covers = await Promise.all(rows.map((r) => signedUrl(r.cover_path, 60 * 60)));
  const now = new Date();

  return (
    <Shell viewer={viewer}>
      <div className="pt-10">
        <p className="label text-sm text-birch">Resources</p>
        <h1 className="font-display mt-3 text-6xl sm:text-7xl">Your bonuses</h1>
        <p className="mt-4 max-w-xl text-chalk/75">
          {viewer?.hasAccess
            ? "Training, templates and the extras that come with your membership."
            : "Members get the training, templates and bonuses that come with Creator Breakdown."}
          {!viewer?.hasAccess && (
            <>
              {" "}
              <Link href="/creator-breakdown#pricing" className="text-birch underline">
                Become a member
              </Link>
              .
            </>
          )}
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r, i) => {
          const open = canOpen(r, viewer);
          const scheduled = !!r.available_at && new Date(r.available_at) > now;
          const href = open
            ? `/resources/${r.slug}`
            : viewer?.hasAccess
              ? "/account"
              : "/creator-breakdown#pricing";
          return (
            <li key={r.id} className="flex flex-col border-2 border-oak">
              {covers[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={covers[i]!} alt="" className="aspect-[4/3] w-full border-b-2 border-oak object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center border-b-2 border-oak bg-forest">
                  <span className="font-display px-6 text-center text-4xl leading-none text-birch">{r.title}</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="label text-xs text-birch">{r.annual_only ? "Annual members" : "All members"}</p>
                  <p className="label text-xs text-chalk/50">
                    {scheduled ? `Unlocks ${releaseLabel(r.available_at)} ET` : !r.published ? "Draft" : open ? "" : "Locked"}
                  </p>
                </div>
                <h2 className="font-display mt-3 text-4xl leading-none">{r.title}</h2>
                {r.blurb && <p className="mt-3 text-chalk/75">{r.blurb}</p>}
                <Link href={href} className="label mt-auto inline-block pt-6 text-sm text-chalk underline-offset-4 hover:underline">
                  {open ? "Open →" : viewer?.hasAccess ? "Upgrade to annual →" : "Unlock →"}
                </Link>
              </div>
            </li>
          );
        })}
        {rows.length === 0 && <li className="text-chalk/60">Nothing here yet. Bonuses show up as they&apos;re released.</li>}
      </ul>
    </Shell>
  );
}
