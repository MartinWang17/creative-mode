import { checkoutOpen } from "@/lib/offer";
import { hasStripe } from "@/lib/env";
import type { PlanId } from "@/lib/offer";

// HTML for a plan card's button on the sales page. Posts to /api/checkout once the cart is open
// (Nov 11, or earlier with CHECKOUT_OPEN=true); until then it shows the opening date.
export function planButtonHtml(plan: PlanId, solid: boolean) {
  const cls = `pill label${solid ? " solid" : ""}`;
  const name = plan === "annual" ? "Join annual" : "Join monthly";
  if (checkoutOpen() && hasStripe()) {
    return `<form action="/api/checkout" method="post" class="plan-form"><input type="hidden" name="plan" value="${plan}"><button type="submit" class="${cls}"><span class="sq"></span><span>${name}</span><span aria-hidden="true">→</span></button></form>`;
  }
  return `<span class="${cls} closed" aria-disabled="true"><span class="sq"></span><span>Opens Nov 11</span></span>`;
}
