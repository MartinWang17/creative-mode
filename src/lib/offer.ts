// Everything the sales page says about price and plans lives here,
// so a price or date change is a one-line edit.
// Source of truth: the "Creator Breakdown: the offer" doc.

export type PlanId = "annual" | "monthly";

export const offer = {
  product: "Creator Breakdown",
  promise:
    "These creators spent years refining their strategies. I spent days breaking them down so you can spend 30 minutes reading, learning and applying them.",
  breakdownsPerMonth: 4,
  currency: "usd",
  // Cart dates, Eastern time. Founding prices apply until the cart closes (Sat Nov 21, per Martin on Oct 28).
  cartOpens: "2026-11-11T09:00:00-05:00",
  cartCloses: "2026-11-21T23:59:00-05:00",
  plans: [
    {
      id: "annual" as PlanId,
      name: "Annual",
      interval: "year" as const,
      per: "/year",
      founding: { cents: 19700, label: "$197" },
      public: { cents: 26700, label: "$267" },
      bonus:
        "Hook Vault: the top 50 hooks across every breakdown, with views and outlier scores. Annual members only.",
      featured: true,
    },
    {
      id: "monthly" as PlanId,
      name: "Monthly",
      interval: "month" as const,
      per: "/month",
      founding: { cents: 1999, label: "$19.99" },
      public: { cents: 2699, label: "$26.99" },
      bonus: null,
      featured: false,
    },
  ],
  // Shown on the Terms, Privacy and Refund pages and in the footer.
  contactEmail: "martin@joincreativemode.com",
  guarantee:
    "Read your first 4 breakdowns. If you're unhappy for any reason, you get a full refund within 30 days.",
};

// CHECKOUT_OPEN=true in Vercel opens checkout early (for testing in Stripe test mode).
export function checkoutOpen(now = new Date()) {
  if (process.env.CHECKOUT_OPEN === "true") return true;
  return now >= new Date(offer.cartOpens);
}

export function foundingPricing(now = new Date()) {
  return now <= new Date(offer.cartCloses);
}
