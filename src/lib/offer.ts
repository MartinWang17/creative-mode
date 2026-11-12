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
  // Cart dates, Eastern time. Doors open Tue Dec 8 and close Sun Dec 13 (per Martin on Nov 4, pushed two weeks).
  // After the close nobody can join until the next launch (waitlist only), which uses the public prices.
  cartOpens: "2026-12-08T09:00:00-05:00",
  cartCloses: "2026-12-13T23:59:00-05:00",
  // Second annual bonus, announced mid-cart. Hidden on the sales page until this moment.
  scriptPack: {
    announcedAt: "2026-12-11T09:00:00-05:00",
    name: "Script Pack",
    blurb: "10 fill-in scripts built from the formats that keep winning. Annual members only.",
    value: "$37",
  },
  // The free sample behind /free-resource. Must be published and marked free in Admin.
  // Public copy never names the creator (Martin, Nov 12). Standby if it ever has to come down: Lana Isa,
  // slug "lanaisaa" (uploaded, unpublished): switch the slug here and add "nategaffney" to retiredBreakdowns.
  freeBreakdown: { slug: "nategaffney", title: "creator breakdown" },
  // Breakdowns taken down for good. Their links send people to the free sample instead, and they're never
  // served, listed or shared, even if still in the database.
  retiredBreakdowns: [] as string[],
  plans: [
    {
      id: "annual" as PlanId,
      name: "Annual",
      interval: "year" as const,
      per: "/year",
      founding: { cents: 19700, label: "$197" },
      public: { cents: 26700, label: "$267" },
      bonus:
        "The 50 Hooks Behind Millions of Views and The Trial Reels Playbook. Annual members only.",
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
    "The I-Gotchu Guarantee: read 4 breakdowns and try it. If for any reason you don't like it, ask for a refund within 30 days and we'll handle it for you.",
};

// CHECKOUT_OPEN=true in Vercel opens checkout early (for testing in Stripe test mode).
// Once doors close, checkout stays shut either way.
export function checkoutOpen(now = new Date()) {
  if (cartClosed(now)) return false;
  if (process.env.CHECKOUT_OPEN === "true") return true;
  return now >= new Date(offer.cartOpens);
}

// Date only, ignoring CHECKOUT_OPEN: decides whether the home button goes to the waitlist page
// or the sales page, so testing checkout early doesn't hide the pre-launch page.
export function doorsOpen(now = new Date()) {
  return now >= new Date(offer.cartOpens) && !cartClosed(now);
}

export function scriptPackAnnounced(now = new Date()) {
  return now >= new Date(offer.scriptPack.announcedAt);
}

export function cartClosed(now = new Date()) {
  return now > new Date(offer.cartCloses);
}

export function foundingPricing(now = new Date()) {
  return now <= new Date(offer.cartCloses);
}
