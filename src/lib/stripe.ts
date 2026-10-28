import Stripe from "stripe";
import { offer, type PlanId } from "@/lib/offer";
import { createAdminClient } from "@/lib/supabase/server";

let client: Stripe | null = null;
export function getStripe() {
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

// Prices are created in Stripe on first use and found again by lookup key,
// so nobody has to set up products by hand in the Stripe dashboard.
export async function getPriceId(planId: PlanId, founding: boolean) {
  const plan = offer.plans.find((p) => p.id === planId);
  if (!plan) throw new Error(`Unknown plan ${planId}`);
  const tier = founding ? "founding" : "public";
  const amount = plan[tier];
  const lookupKey = `${tier}_${plan.id}_${amount.cents}_${offer.currency}`;

  const stripe = getStripe();
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
  if (existing.data[0]) return existing.data[0].id;

  const product = await findOrCreateProduct();
  const price = await stripe.prices.create({
    product,
    currency: offer.currency,
    unit_amount: amount.cents,
    recurring: { interval: plan.interval },
    lookup_key: lookupKey,
    nickname: `${tier === "founding" ? "Founding" : "Public"} ${plan.name}`,
    metadata: { plan: plan.id, tier },
  });
  return price.id;
}

async function findOrCreateProduct() {
  const stripe = getStripe();
  const found = await stripe.products.search({ query: "metadata['app']:'creator-breakdown'" });
  if (found.data[0]) return found.data[0].id;
  const product = await stripe.products.create({
    name: offer.product,
    description: `${offer.breakdownsPerMonth} deep creator breakdowns a month by Creative Mode.`,
    metadata: { app: "creator-breakdown" },
  });
  return product.id;
}

// Copies a subscription's current state into the members table.
export async function syncSubscription(subscriptionId: string) {
  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["customer"] });
  const customer = sub.customer as Stripe.Customer | Stripe.DeletedCustomer;
  const email = "email" in customer && customer.email ? customer.email.toLowerCase() : null;
  if (!email) throw new Error(`Subscription ${sub.id} has no customer email`);

  const item = sub.items.data[0];
  const { error } = await createAdminClient()
    .from("members")
    .upsert(
      {
        email,
        stripe_customer_id: customer.id,
        stripe_subscription_id: sub.id,
        plan: item?.price.metadata.plan ?? item?.price.recurring?.interval ?? null,
        founding: item?.price.metadata.tier === "founding",
        status: sub.status,
        current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );
  if (error) throw error;
}
