import { redirect } from "next/navigation";
import { adminEmails, hasSupabase } from "@/lib/env";
import { createAdminClient, createAuthClient } from "@/lib/supabase/server";

export type Member = {
  email: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: string | null;
  status: string | null;
  founding: boolean | null;
  current_period_end: string | null;
};

// Stripe statuses that still get access. past_due keeps access while Stripe retries the card.
const ACTIVE = ["active", "trialing", "past_due"];

export async function getViewer() {
  if (!hasSupabase()) return null;
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) return null;

  const { data: member } = await createAdminClient()
    .from("members")
    .select("email, stripe_customer_id, stripe_subscription_id, plan, status, founding, current_period_end")
    .eq("email", email)
    .maybeSingle<Member>();

  const isAdmin = adminEmails().includes(email);
  return {
    email,
    member,
    isAdmin,
    hasAccess: isAdmin || hasActiveMembership(member),
  };
}

// Paid members follow Stripe's status. Free memberships Martin gives from Admin (plan "comp")
// also end on their current_period_end date, since no Stripe subscription will cancel them.
function hasActiveMembership(member: Member | null) {
  if (!member?.status || !ACTIVE.includes(member.status)) return false;
  if (member.plan === "comp" && member.current_period_end) {
    return new Date(member.current_period_end) > new Date();
  }
  return true;
}

export async function requireViewer(next: string) {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewer("/admin");
  if (!viewer.isAdmin) redirect("/library");
  return viewer;
}
