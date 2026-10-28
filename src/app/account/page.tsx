import Link from "next/link";
import Shell from "@/components/Shell";
import { requireViewer } from "@/lib/members";
import { offer } from "@/lib/offer";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const viewer = await requireViewer("/account");
  const m = viewer.member;
  const renews = m?.current_period_end
    ? new Date(m.current_period_end).toLocaleDateString("en-US", { dateStyle: "long" })
    : null;

  return (
    <Shell viewer={viewer}>
      <div className="mx-auto max-w-xl pt-10">
        <p className="label text-xs text-birch">Account</p>
        <h1 className="font-display mt-3 text-6xl">{viewer.email}</h1>

        <dl className="mt-10 divide-y-2 divide-oak border-y-2 border-oak">
          <Row label="Plan">
            {m?.plan ? `${offer.product} · ${m.plan}${m.founding ? " · founding price" : ""}` : "No membership"}
          </Row>
          <Row label="Status">{m?.status ?? (viewer.isAdmin ? "admin" : "none")}</Row>
          {renews && <Row label={m?.status === "canceled" ? "Access until" : "Renews"}>{renews}</Row>}
        </dl>

        <div className="mt-8 flex flex-wrap gap-4">
          {m?.stripe_customer_id ? (
            <form action="/api/portal" method="post">
              <button
                type="submit"
                className="label rounded-full border-2 border-chalk px-6 py-4 text-xs text-chalk hover:bg-chalk hover:text-bedrock"
              >
                Manage billing
              </button>
            </form>
          ) : (
            <Link
              href="/creator-breakdown#pricing"
              className="label rounded-full border-2 border-birch bg-birch px-6 py-4 text-xs text-bedrock hover:bg-chalk"
            >
              Become a member
            </Link>
          )}
          <form action="/auth/signout" method="post">
            <button type="submit" className="label px-4 py-4 text-xs text-chalk/60 hover:text-chalk">
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
      <dt className="label w-32 shrink-0 text-[10px] text-chalk/60">{label}</dt>
      <dd className="text-chalk/85">{children}</dd>
    </div>
  );
}
