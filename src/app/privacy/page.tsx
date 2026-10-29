import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy · Creative Mode" };

export default function PrivacyPage() {
  return (
    <LegalPage label="Policies" title="Privacy policy" updated="October 29, 2026">
      <p>This page explains what we collect when you use joincreativemode.com and why.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address, so you can log in and we can contact you about your membership.</li>
        <li>
          Your subscription details from Stripe: plan, status and renewal date. Stripe handles your
          card; we never see the full number.
        </li>
        <li>Basic technical logs (like pages visited and errors) that keep the site running.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>
        Only the services that run the site: Stripe (payments), Supabase (login and member data) and
        Vercel (hosting). We don&apos;t sell your information.
      </p>
      <h2>Emails</h2>
      <p>
        We send login links and messages about your membership. If you join our email list, you can
        unsubscribe from any email.
      </p>
      <h2>Your choices</h2>
      <p>
        You can ask us to see, correct or delete your information at any time by email. Deleting
        your account ends your membership.
      </p>
    </LegalPage>
  );
}
