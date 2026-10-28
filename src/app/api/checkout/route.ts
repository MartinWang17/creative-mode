import { NextResponse, type NextRequest } from "next/server";
import { checkoutOpen, foundingPricing, type PlanId } from "@/lib/offer";
import { hasStripe, siteUrl } from "@/lib/env";
import { getPriceId, getStripe } from "@/lib/stripe";

// The pricing buttons post here; we send the buyer to Stripe's hosted checkout.
export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const form = await request.formData();
  const plan = form.get("plan");
  if (plan !== "annual" && plan !== "monthly") {
    return NextResponse.redirect(`${base}/creator-breakdown#pricing`, 303);
  }
  if (!hasStripe() || !checkoutOpen()) {
    return NextResponse.redirect(`${base}/creator-breakdown#pricing`, 303);
  }

  const price = await getPriceId(plan as PlanId, foundingPricing());
  const tax = process.env.STRIPE_AUTOMATIC_TAX === "true";
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    automatic_tax: { enabled: tax },
    billing_address_collection: tax ? "required" : "auto",
    success_url: `${base}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/creator-breakdown#pricing`,
  });
  return NextResponse.redirect(session.url!, 303);
}
