import { requireAdmin } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";

// Download all breakdown feedback as a CSV (linked from the admin dashboard). Admin only.
export async function GET() {
  await requireAdmin();
  const { data } = await createAdminClient()
    .from("breakdown_feedback")
    .select("created_at, slug, rating, answer, email")
    .order("created_at", { ascending: true });
  const q = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const rows = (data ?? []).map((r) => [r.created_at, r.slug, r.rating, r.answer, r.email].map(q).join(","));
  return new Response(["sent_at,breakdown,rating,answer,email", ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="breakdown-feedback.csv"',
    },
  });
}
