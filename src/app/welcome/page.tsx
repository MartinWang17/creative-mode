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
      <div className="mx-auto max-w-2xl pt-16">
        <p className="label text-xs text-birch">You&apos;re in</p>
        <h1 className="font-display mt-3 text-6xl sm:text-7xl">Welcome in 🎉</h1>
        <div className="mt-8 space-y-4 text-lg text-chalk/85">
          <p>Quick thing before you start.</p>
          <p className="font-display text-3xl leading-none text-chalk">This is a shortcut, not a magic button.</p>
          <p>
            I did the studying for you: hours of breaking down what&apos;s actually working right now. Your job is to
            take one pattern each week and put it into your own niche and your own story.
          </p>
          <p>
            Don&apos;t get discouraged if your first few don&apos;t pop. It took me 10 months and a lot of posts to
            figure this out the hard way. When I started using patterns on a new account, <b className="text-birch">8 of
            my first 11 went viral.</b> You won&apos;t need anywhere near as many tries as I did, but you do need to keep
            showing up.
          </p>
          <p>Here&apos;s how to start:</p>
        </div>
        <ol className="mt-6 divide-y-2 divide-oak border-y-2 border-oak">
          <li className="flex gap-4 py-4">
            <span className="font-display text-3xl leading-none text-birch">1</span>
            <span className="text-chalk/85">
              <b className="text-chalk">Log in.</b> There are no passwords. Use the email you just paid with
              {email ? ` (${email})` : ""} and we&apos;ll send you a link.
            </span>
          </li>
          <li className="flex gap-4 py-4">
            <span className="font-display text-3xl leading-none text-birch">2</span>
            <span className="text-chalk/85">
              <b className="text-chalk">Watch the free training in Resources.</b> It shows you how to turn any breakdown
              into your next Reel.
            </span>
          </li>
          <li className="flex gap-4 py-4">
            <span className="font-display text-3xl leading-none text-birch">3</span>
            <span className="text-chalk/85">
              <b className="text-chalk">Open this week&apos;s breakdown in the Library.</b> Pick one pattern, then use the
              AI Script Button to turn your own idea into a script.
            </span>
          </li>
        </ol>
        <Link
          href="/login"
          className="label mt-8 inline-block rounded-full border-2 border-chalk px-6 py-4 text-xs text-chalk hover:bg-chalk hover:text-bedrock"
        >
          Log in to start
        </Link>
      </div>
    </Shell>
  );
}
