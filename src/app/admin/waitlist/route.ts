import { requireAdmin } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";

// Download the waitlist as a CSV (linked from the admin dashboard).
export async function GET() {
  await requireAdmin();
  const { data } = await createAdminClient()
    .from("waitlist")
    .select("email, created_at")
    .order("created_at", { ascending: true });
  const rows = (data ?? []).map((r) => `${r.email},${r.created_at}`);
  return new Response(["email,joined_at", ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="waitlist.csv"',
    },
  });
}
