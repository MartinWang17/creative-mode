import { checkoutOpen, foundingPricing, offer } from "@/lib/offer";
import { hasStripe } from "@/lib/env";

// The two plan cards. Buttons post to /api/checkout once the cart is open.
export default function PricingGrid() {
  const open = checkoutOpen() && hasStripe();
  const founding = foundingPricing();
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {offer.plans.map((plan) => {
        const price = founding ? plan.founding : plan.public;
        return (
          <div
            key={plan.id}
            className={`flex flex-col border-2 p-8 ${
              plan.featured ? "border-birch bg-forest" : "border-oak bg-bedrock"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="label text-sm">{plan.name}</h3>
              {plan.featured && (
                <span className="label bg-birch px-2 py-1 text-[10px] text-bedrock">Best value</span>
              )}
            </div>
            <p className="font-display mt-6 text-7xl leading-none">
              {price.label}
              <span className="font-sans text-lg text-chalk/60">{plan.per}</span>
            </p>
            {founding ? (
              <>
                <p className="mt-2 text-sm text-birch">Founding price, locked for life</p>
                <p className="mt-1 text-sm text-chalk/50 line-through">
                  {plan.public.label}
                  {plan.per} after launch
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-chalk/60">Cancel anytime</p>
            )}
            {plan.bonus && <p className="mt-6 text-chalk/80">{plan.bonus}</p>}
            <div className="mt-auto pt-8">
              {open ? (
                <form action="/api/checkout" method="post">
                  <input type="hidden" name="plan" value={plan.id} />
                  <button
                    type="submit"
                    className={`label w-full rounded-full border-2 px-6 py-4 text-xs transition-colors ${
                      plan.featured
                        ? "border-birch bg-birch text-bedrock hover:bg-chalk"
                        : "border-chalk text-chalk hover:bg-chalk hover:text-bedrock"
                    }`}
                  >
                    Join {plan.name.toLowerCase()}
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  disabled
                  className="label w-full cursor-not-allowed rounded-full border-2 border-chalk/40 px-6 py-4 text-xs text-chalk/60"
                >
                  Opens Nov 11
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
