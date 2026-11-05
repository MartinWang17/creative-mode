import { requireAdmin } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";

// Download every survey answer as a CSV (linked from the admin dashboard).
export async function GET() {
  await requireAdmin();
  const { data } = await createAdminClient()
    .from("survey_responses")
    .select("created_at, email, followers, answer")
    .order("created_at", { ascending: true });
  const q = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const rows = (data ?? []).map((r) => [r.created_at, r.email, r.followers, r.answer].map(q).join(","));
  return new Response(["answered_at,email,followers,answer", ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="survey.csv"',
    },
  });
}
