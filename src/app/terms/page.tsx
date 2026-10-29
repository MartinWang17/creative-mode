import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { offer } from "@/lib/offer";

export const metadata: Metadata = { title: "Terms · Creative Mode" };

export default function TermsPage() {
  return (
    <LegalPage label="Policies" title="Terms of service" updated="October 29, 2026">
      <p>
        These terms cover your use of joincreativemode.com and the {offer.product} membership, run by
        Creative Mode (Martin Wang) in Canada. By buying or using the site, you agree to them.
      </p>
      <h2>What you get</h2>
      <p>
        A membership gives you access to the breakdown library for as long as your subscription is
        active, including about {offer.breakdownsPerMonth} new creator breakdowns a month. Each
        breakdown describes what we observed in a creator&apos;s public content and how you could apply
        it. We can&apos;t promise any particular result, follower count or number of views.
      </p>
      <h2>Billing</h2>
      <ul>
        <li>Plans renew automatically every month or every year until you cancel.</li>
        <li>Payments are handled by Stripe. We never see or store your full card number.</li>
        <li>
          Founding prices stay locked for as long as your subscription stays active. If you cancel
          and rejoin later, the price at that time applies.
        </li>
        <li>Prices are in US dollars, and taxes may be added where they apply.</li>
        <li>
          You can cancel any time from your Account page. Refunds follow our{" "}
          <Link href="/refunds">refund policy</Link>.
        </li>
      </ul>
      <h2>Your account</h2>
      <p>
        You log in with a link sent to your email. Memberships are for one person, so please
        don&apos;t share your login or republish breakdowns. We may close accounts that do.
      </p>
      <h2>Content and creators</h2>
      <p>
        Breakdowns and the site design belong to Creative Mode. You&apos;re free to use what you learn
        on your own accounts. Creators featured are credited by their public handle, and they are not
        affiliated with or endorsed by Creative Mode. If you&apos;re a featured creator and want
        something changed, email us and we&apos;ll respond quickly.
      </p>
      <h2>Changes and liability</h2>
      <p>
        We may update the site, the membership or these terms; if a change affects what you pay,
        we&apos;ll tell you by email first. The site is provided as is, and to the extent the law
        allows, our total liability to you is limited to what you paid us in the last 12 months.
      </p>
    </LegalPage>
  );
}
