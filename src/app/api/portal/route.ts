import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/env";
import { getViewer } from "@/lib/members";
import { getStripe } from "@/lib/stripe";

// "Manage billing" on the account page: Stripe's own page to cancel, change card or switch plan.
export async function POST(request: NextRequest) {
  const base = siteUrl(request.headers);
  const viewer = await getViewer();
  const customer = viewer?.member?.stripe_customer_id;
  if (!customer) return NextResponse.redirect(`${base}/account`, 303);

  const session = await getStripe().billingPortal.sessions.create({
    customer,
    return_url: `${base}/account`,
  });
  return NextResponse.redirect(session.url, 303);
}
