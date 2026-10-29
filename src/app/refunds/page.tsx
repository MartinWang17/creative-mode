import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { offer } from "@/lib/offer";

export const metadata: Metadata = { title: "Refund policy · Creative Mode" };

export default function RefundsPage() {
  return (
    <LegalPage label="Policies" title="Refund policy" updated="October 29, 2026">
      <h2>The 30-day guarantee</h2>
      <p>{offer.guarantee} This applies to the monthly and the annual plan.</p>
      <p>
        To get your refund, email us from the address you signed up with within 30 days of your
        first payment. We refund the full amount to your original payment method, usually within 5
        to 10 business days depending on your bank.
      </p>
      <h2>After 30 days</h2>
      <p>
        You can cancel any time from your Account page, and you won&apos;t be charged again. You keep
        access until the end of the period you already paid for. Payments made after the first 30
        days aren&apos;t refunded, except where the law requires it.
      </p>
      <h2>Annual renewals</h2>
      <p>
        If your annual plan renews and you didn&apos;t mean to keep it, email us within 14 days of the
        renewal charge and we&apos;ll refund it.
      </p>
    </LegalPage>
  );
}
