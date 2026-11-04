import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { foundingPricing } from "@/lib/offer";
import { getPriceId, getStripe, syncSubscription } from "@/lib/stripe";

// "Upgrade to annual" on the account page. Moves a monthly member onto the annual price for the
// current tier (founding while the cart is open), charging the year now with credit for the
// unused part of the month. Stripe's own portal isn't used for this so the founding price
// stays the only annual price a member can land on.
export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const back = (state: string) => NextResponse.redirect(`${base}/account?upgrade=${state}`, 303);
  const viewer = await getViewer();
  const m = viewer?.member;
  if (!m?.stripe_subscription_id || m.plan !== "monthly") return back("none");

  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(m.stripe_subscription_id);
  const item = sub.items.data[0];
  if (!item || !["active", "trialing", "past_due"].includes(sub.status)) return back("none");

  try {
    const price = await getPriceId("annual", foundingPricing());
    await stripe.subscriptions.update(sub.id, {
      items: [{ id: item.id, price }],
      billing_cycle_anchor: { type: "now" },
      proration_behavior: "always_invoice",
      payment_behavior: "error_if_incomplete",
      metadata: { upgraded_from: "monthly" },
    });
    await syncSubscription(sub.id);
    return back("done");
  } catch (err) {
    console.error("upgrade failed", err);
    return back("error");
  }
}
