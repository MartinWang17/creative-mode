import { joinHref } from "@/lib/offer";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { canOpen, embedUrl, getResource, isVideoFile, signedUrl, visible } from "@/lib/resources";

export const dynamic = "force-dynamic";

// One resource: a video plays here, a file downloads, an outside link opens in a new tab.
export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasSupabase()) notFound();
  const r = await getResource(slug);
  const viewer = await getViewer();
  if (!r || !visible(r, viewer)) notFound();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(`/resources/${slug}`)}`);
  if (!canOpen(r, viewer)) redirect(viewer.hasAccess ? "/account" : joinHref());

  const embed = embedUrl(r.link);
  const video = isVideoFile(r.storage_path) ? await signedUrl(r.storage_path, 60 * 60 * 3) : null;
  const fileName = r.storage_path?.split("/").pop() ?? null;

  return (
    <Shell viewer={viewer}>
      <div className="pt-4">
        <Link href="/resources" className="label text-sm text-chalk/60 hover:text-chalk">
          ← Resources
        </Link>
      </div>
      <div className="mt-8 max-w-3xl">
        <p className="label text-sm text-birch">{r.annual_only ? "Annual members" : "All members"}</p>
        <h1 className="font-display mt-3 text-5xl leading-none sm:text-6xl">{r.title}</h1>
        {r.blurb && <p className="mt-4 text-chalk/75">{r.blurb}</p>}
      </div>

      {embed && (
        <iframe
          src={embed}
          title={r.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="mt-8 aspect-video w-full max-w-4xl border-2 border-oak bg-bedrock"
        />
      )}
      {video && (
        <video src={video} controls playsInline className="mt-8 aspect-video w-full max-w-4xl border-2 border-oak bg-bedrock" />
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        {r.storage_path && !video && (
          <a
            href={`/api/resources/${r.slug}`}
            className="label rounded-full border-2 border-birch bg-birch px-6 py-4 text-sm text-bedrock hover:bg-chalk"
          >
            Download{fileName ? ` ${fileName.replace(/^[\w-]+-\d+-/, "")}` : ""}
          </a>
        )}
        {r.link && !embed && (
          <a
            href={r.link}
            target="_blank"
            rel="noreferrer"
            className="label rounded-full border-2 border-birch bg-birch px-6 py-4 text-sm text-bedrock hover:bg-chalk"
          >
            Open →
          </a>
        )}
      </div>
    </Shell>
  );
}
