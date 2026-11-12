import Link from "next/link";

export type LibraryRow = {
  slug: string;
  title: string;
  creator_handle: string | null;
  summary: string | null;
  is_free: boolean;
  format?: string | null;
  difficulty?: string | null;
  size?: string | null;
  growth?: string | null;
};

// The library cards. The newest breakdown gets a full-width featured card; the rest sit in a grid.
export default function LibraryGrid({
  rows,
  hasAccess,
  empty,
}: {
  rows: LibraryRow[];
  hasAccess: boolean;
  empty: string;
}) {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2">
      {rows.map((b, i) => {
        const locked = !b.is_free && !hasAccess;
        const featured = i === 0;
        const href = locked ? "/creator-breakdown#pricing" : `/library/${b.slug}`;
        const tags = (b.format || b.difficulty || b.size) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {b.format && <span className="label bg-forest px-2 py-1 text-xs text-birch">{b.format}</span>}
            {b.difficulty && (
              <span className="label border border-oak px-2 py-1 text-xs text-chalk/70">{b.difficulty}</span>
            )}
            {b.size && <span className="label border border-birch px-2 py-1 text-xs text-birch">{b.size}</span>}
          </div>
        );
        const top = (
          <div className="flex items-center justify-between gap-4">
            <p className="label text-xs text-birch">
              {featured && <span className="mr-3 bg-birch px-2 py-1 text-bedrock">Newest</span>}
              {b.creator_handle ? `@${b.creator_handle}` : "Breakdown"}
            </p>
            <p className="label text-xs text-chalk/50">{locked ? "Members" : b.is_free ? "Free" : ""}</p>
          </div>
        );
        if (featured) {
          return (
            <li key={b.slug} className="border-2 border-birch bg-forest/20 p-6 sm:col-span-2 sm:p-10">
              {top}
              <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                <div>
                  <h2 className="font-display text-5xl leading-none sm:text-7xl">{b.title}</h2>
                  {b.growth && <p className="mt-4 text-lg text-birch">{b.growth}</p>}
                  {tags}
                </div>
                <div>
                  {b.summary && <p className="text-lg text-chalk/80">{b.summary}</p>}
                  <Link
                    href={href}
                    className="label mt-6 inline-block border-2 border-birch bg-birch px-6 py-3 text-sm text-bedrock hover:bg-chalk"
                  >
                    {locked ? "Unlock →" : "Read →"}
                  </Link>
                </div>
              </div>
            </li>
          );
        }
        return (
          <li key={b.slug} className="border-2 border-oak p-6 sm:p-8">
            {top}
            <h2 className="font-display mt-3 text-4xl leading-none sm:text-5xl">{b.title}</h2>
            {b.growth && <p className="mt-3 text-base text-birch">{b.growth}</p>}
            {tags}
            {b.summary && <p className="mt-3 text-chalk/75">{b.summary}</p>}
            <Link href={href} className="label mt-6 inline-block text-sm text-chalk underline-offset-4 hover:underline">
              {locked ? "Unlock →" : "Read →"}
            </Link>
          </li>
        );
      })}
      {rows.length === 0 && <li className="text-chalk/60">{empty}</li>}
    </ul>
  );
}
