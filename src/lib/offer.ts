// Everything the sales page says about price and plans lives here,
// so a price or date change is a one-line edit.
// Source of truth: the "Creator Breakdown: the offer" doc.

export const offer = {
  product: "Creator Breakdown",
  promise:
    "These creators spent years refining their strategies. I spent days breaking them down so you can spend 30 minutes reading, learning and applying them.",
  breakdownsPerMonth: 4,
  // Cart dates, Eastern time
  cartOpens: "2026-11-11T09:00:00-05:00",
  cartCloses: "2026-11-15T23:59:00-05:00",
  plans: [
    {
      id: "annual",
      name: "Annual",
      price: "$197",
      per: "/year",
      later: "$267/year after launch",
      note: "Founding price, locked for life",
      bonus: "Hook Vault: the top 50 hooks from every breakdown, with views and outlier scores. Annual only, first 48 hours.",
      featured: true,
    },
    {
      id: "monthly",
      name: "Monthly",
      price: "$19.99",
      per: "/month",
      later: "$26.99/month after launch",
      note: "Founding price, locked for life",
      bonus: null,
      featured: false,
    },
  ],
  guarantee:
    "Read your first 4 breakdowns. If you're unhappy, email within 30 days for a full refund.",
} as const;
