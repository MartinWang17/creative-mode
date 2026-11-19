import { hasSupabase } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/server";

// Small switches Martin flips in Admin, stored in Supabase (table site_settings).
// If the table isn't there yet, everything reads as off/empty.
export type Settings = {
  reelReviewBonus: boolean; // "First 100 annual members get a Reel reviewed by Martin"
  proofQuotes: string[]; // Praise next to the guarantee, one quote per line in Admin
};

const DEFAULTS: Settings = { reelReviewBonus: false, proofQuotes: [] };

export async function getSettings(): Promise<Settings> {
  if (!hasSupabase()) return DEFAULTS;
  const { data, error } = await createAdminClient().from("site_settings").select("key, value");
  if (error || !data) return DEFAULTS;
  const map = new Map(data.map((r) => [r.key as string, r.value as unknown]));
  return {
    reelReviewBonus: map.get("reel_review_bonus") === true,
    proofQuotes: Array.isArray(map.get("proof_quotes")) ? (map.get("proof_quotes") as string[]) : [],
  };
}

export async function setSetting(key: "reel_review_bonus" | "proof_quotes", value: unknown) {
  const { error } = await createAdminClient()
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  return error;
}
