import Link from "next/link";
import Shell from "@/components/Shell";
import { requireViewer } from "@/lib/members";
import { foundingPricing, offer } from "@/lib/offer";

export const dynamic = "force-dynamic";

const UPGRADE_NOTES: Record<string, string> = {
  done: "You're on annual now, at the founding price. The annual bonuses are yours.",
  error: "The upgrade didn't go through. Check your card under Manage billing, then try again.",
  none: "Nothing to upgrade on this account.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const viewer = await requireViewer("/account");
  const m = viewer.member;
  const { upgrade } = await searchParams;
  const note = upgrade ? UPGRADE_NOTES[upgrade] : null;
  const annual = offer.plans.find((p) => p.id === "annual")!;
  // Monthly members can move to annual; while the cart is open that means the founding price.
  const canUpgrade =
    m?.plan === "monthly" && m.status != null && ["active", "trialing", "past_due"].includes(m.status);
  const annualPrice = foundingPricing() ? annual.founding.label : annual.public.label;
  const renews = m?.current_period_end
    ? new Date(m.current_period_end).toLocaleDateString("en-US", { dateStyle: "long" })
    : null;

  return (
    <Shell viewer={viewer}>
      <div className="mx-auto max-w-xl pt-10">
        <p className="label text-sm text-birch">Account</p>
        <h1 className="font-display mt-3 text-6xl">{viewer.email}</h1>

        <dl className="mt-10 divide-y-2 divide-oak border-y-2 border-oak">
          <Row label="Plan">
            {m?.plan ? `${offer.product} · ${m.plan}${m.founding ? " · founding price" : ""}` : "No membership"}
          </Row>
          <Row label="Status">{m?.status ?? (viewer.isAdmin ? "admin" : "none")}</Row>
          {renews && <Row label={m?.status === "canceled" ? "Access until" : "Renews"}>{renews}</Row>}
        </dl>

        {note && <p className="mt-6 text-sm text-birch">{note}</p>}

        {canUpgrade && (
          <div className="mt-8 border-2 border-birch p-6">
            <p className="label text-sm text-birch">Upgrade to annual</p>
            <p className="mt-3 text-chalk/85">
              Switch to {annualPrice}/year{foundingPricing() ? ", the founding price, locked for life" : ""}, and get
              the annual bonuses (The 50 Hooks and The Trial Reels Playbook). You pay for the year today, minus credit for the rest of this month.
            </p>
            <form action="/api/upgrade" method="post" className="mt-5">
              <button
                type="submit"
                className="label rounded-full border-2 border-birch bg-birch px-6 py-4 text-sm text-bedrock hover:bg-chalk"
              >
                Upgrade to annual · {annualPrice}/yr
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          {m?.stripe_customer_id ? (
            <form action="/api/portal" method="post">
              <button
                type="submit"
                className="label rounded-full border-2 border-chalk px-6 py-4 text-sm text-chalk hover:bg-chalk hover:text-bedrock"
              >
                Manage billing
              </button>
            </form>
          ) : (
            <Link
              href="/creator-breakdown#pricing"
              className="label rounded-full border-2 border-birch bg-birch px-6 py-4 text-sm text-bedrock hover:bg-chalk"
            >
              Become a member
            </Link>
          )}
          <form action="/auth/signout" method="post">
            <button type="submit" className="label px-4 py-4 text-sm text-chalk/60 hover:text-chalk">
              Log out
            </button>
          </form>
        </div>
        <p className="mt-10 text-sm text-chalk/50">{offer.guarantee}</p>
      </div>
    </Shell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
      <dt className="label w-32 shrink-0 text-xs text-chalk/60">{label}</dt>
      <dd className="text-chalk/85">{children}</dd>
    </div>
  );
}
