import Link from "next/link";
import Shell from "@/components/Shell";
import { hasStripe } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

type Search = Promise<{ session_id?: string }>;

// Stripe sends buyers here after paying.
export default async function WelcomePage({ searchParams }: { searchParams: Search }) {
  const { session_id } = await searchParams;
  let email: string | null = null;
  if (session_id && hasStripe()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? null;
    } catch {
      email = null;
    }
  }
  return (
    <Shell>
      <div className="mx-auto max-w-xl pt-16">
        <p className="label text-xs text-birch">You&apos;re in</p>
        <h1 className="font-display mt-3 text-6xl sm:text-7xl">Welcome to Creator Breakdown.</h1>
        <p className="mt-6 text-chalk/80">
          There are no passwords here. To open the library, log in with the email you just paid
          with{email ? ` (${email})` : ""} and we&apos;ll send you a link.
        </p>
        <Link
          href="/login"
          className="label mt-8 inline-block rounded-full border-2 border-chalk px-6 py-4 text-xs text-chalk hover:bg-chalk hover:text-bedrock"
        >
          Log in to the library
        </Link>
      </div>
    </Shell>
  );
}
