import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";

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
    <Shell viewer={viewer}>
      <div className="flex items-center justify-between gap-4 pt-4">
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
      <iframe
        src={`/api/breakdowns/${slug}`}
        title={b.title}
        className="mt-6 h-[85dvh] w-full border-2 border-oak bg-bedrock"
      />
    </Shell>
  );
}
