import Link from "next/link";

// The CREATIVE / MODE pixel wordmark. `size="hero"` is the landing page version.
export default function Wordmark({ size = "small" }: { size?: "hero" | "small" }) {
  if (size === "hero") {
    return (
      <h1 className="font-display leading-[0.78]">
        <span className="shadow-forest block text-[30vw] text-chalk sm:text-[16rem] lg:text-[21rem]">
          CREATIVE
        </span>
        <span className="shadow-oak block text-[30vw] text-birch sm:text-[16rem] lg:text-[21rem]">
          MODE
        </span>
      </h1>
    );
  }
  return (
    <Link href="/" className="font-display text-3xl leading-none" aria-label="Creative Mode home">
      <span className="shadow-forest text-chalk">CREATIVE</span>{" "}
      <span className="shadow-oak text-birch">MODE</span>
    </Link>
  );
}
