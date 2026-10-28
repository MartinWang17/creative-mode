import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "outline" | "solid";
};

// The rounded "■ LABEL →" button from the logo mockup.
export default function PillLink({ href, children, variant = "outline" }: Props) {
  const styles =
    variant === "solid"
      ? "bg-forest text-birch border-forest hover:bg-[#245a3d]"
      : "border-chalk text-chalk hover:bg-chalk hover:text-bedrock";
  return (
    <Link
      href={href}
      className={`label group inline-flex items-center gap-3 rounded-full border-2 px-6 py-4 text-xs sm:gap-4 sm:px-7 sm:text-sm transition-colors ${styles}`}
    >
      <span className="h-3 w-3 shrink-0 bg-birch/70 group-hover:bg-oak" aria-hidden />
      <span className="whitespace-nowrap">{children}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}
