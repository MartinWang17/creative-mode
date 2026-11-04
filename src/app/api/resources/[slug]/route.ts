import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { canOpen, getResource, signedUrl, visible } from "@/lib/resources";

// Download a resource file. Checks the membership, then sends the member to a link that works for a minute.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasSupabase()) return new NextResponse("Not found", { status: 404 });
  const r = await getResource(slug);
  const viewer = await getViewer();
  if (!r || !r.storage_path || !visible(r, viewer)) return new NextResponse("Not found", { status: 404 });
  if (!canOpen(r, viewer)) return new NextResponse("Members only", { status: 403 });
  const url = await signedUrl(r.storage_path, 60, true);
  if (!url) return new NextResponse("File missing", { status: 404 });
  return NextResponse.redirect(url, { headers: { "cache-control": "private, no-store" } });
}
