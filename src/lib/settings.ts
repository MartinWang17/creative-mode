import { hasSupabase } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/server";
import { offer } from "@/lib/offer";

// Small switches Martin flips in Admin, stored in Supabase (table site_settings).
// If the table isn't there yet, the Reel review bonus shows (Martin turns it off at 100) and the rest is empty.
export type Settings = {
  reelReviewBonus: boolean; // "First 100 annual members get a Reel reviewed by Martin"
  proofQuotes: string[]; // Praise next to the guarantee, one quote per line in Admin
  salesVideoUrl: string; // YouTube or Vimeo link for the video at the top of the sales page
};

const DEFAULTS: Settings = { reelReviewBonus: true, proofQuotes: [], salesVideoUrl: "" };

export async function getSettings(): Promise<Settings> {
  if (!hasSupabase()) return DEFAULTS;
  const { data, error } = await createAdminClient().from("site_settings").select("key, value");
  if (error || !data) return DEFAULTS;
  const map = new Map(data.map((r) => [r.key as string, r.value as unknown]));
  return {
    reelReviewBonus: map.has("reel_review_bonus") ? map.get("reel_review_bonus") === true : true,
    proofQuotes: Array.isArray(map.get("proof_quotes")) ? (map.get("proof_quotes") as string[]) : [],
    salesVideoUrl: typeof map.get("sales_video_url") === "string" ? (map.get("sales_video_url") as string) : "",
  };
}

export async function setSetting(key: "reel_review_bonus" | "proof_quotes" | "sales_video_url", value: unknown) {
  const { error } = await createAdminClient()
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  return error;
}

// Turns a YouTube or Vimeo link into its embed URL. Anything else returns null (and nothing is shown).
export function videoEmbedUrl(link: string): string | null {
  let u: URL;
  try {
    u = new URL(link.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
  }
  if (id && /^[\w-]{6,20}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = u.pathname.match(/(\d{6,12})(?:\/([0-9a-f]+))?/);
    if (m) return `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ""}`;
  }
  return null;
}

export const REEL_REVIEWS = 100;

// How many of the first-100 Reel reviews are left: 100 minus the real number of annual members
// who joined since the cart opened. Never a made-up number.
export async function reelReviewsLeft(): Promise<number> {
  if (!hasSupabase()) return REEL_REVIEWS;
  const { count, error } = await createAdminClient()
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("plan", "annual")
    .gte("created_at", new Date(offer.cartOpens).toISOString());
  if (error) return REEL_REVIEWS;
  return Math.max(0, REEL_REVIEWS - (count ?? 0));
}
