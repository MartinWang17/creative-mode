import { createHmac, timingSafeEqual } from "node:crypto";

// Free view links for featured creators: /library/<slug>?k=<key>.
// The key is derived from the slug with a server secret, so nothing new is stored.
// Set SHARE_SECRET in Vercel to rotate every link at once; otherwise the Supabase secret is used.
function secret() {
  return process.env.SHARE_SECRET || process.env.SUPABASE_SECRET_KEY || "";
}

export function shareKey(slug: string) {
  return createHmac("sha256", secret()).update(`share:${slug}`).digest("base64url").slice(0, 22);
}

export function validShareKey(slug: string, key: string | null | undefined) {
  if (!key || !secret()) return false;
  const a = Buffer.from(shareKey(slug));
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}
