import Shell from "@/components/Shell";
import { offer } from "@/lib/offer";

// Shared layout for Terms, Privacy and Refunds.
export default function LegalPage({
  label,
  title,
  updated,
  children,
}: {
  label: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Shell>
      <article className="legal mx-auto max-w-2xl pt-16">
        <p className="label text-xs text-birch">{label}</p>
        <h1 className="font-display mt-3 text-6xl">{title}</h1>
        <p className="mt-3 text-sm text-chalk/50">Last updated {updated}</p>
        <div className="mt-10 space-y-5 text-chalk/80 [&_a]:text-birch [&_a]:underline [&_h2]:font-display [&_h2]:pt-6 [&_h2]:text-3xl [&_h2]:text-chalk [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
          <h2>Contact</h2>
          <p>
            Questions? Email <a href={`mailto:${offer.contactEmail}`}>{offer.contactEmail}</a>.
          </p>
        </div>
      </article>
    </Shell>
  );
}
