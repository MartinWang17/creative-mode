import Link from "next/link";
import Wordmark from "@/components/Wordmark";

// Version B: game world. Pixel block ground, blinking cursor, PRESS START button.
const ground = ["forest", "forest", "oak", "forest", "birch", "forest", "oak", "oak", "forest", "forest", "birch", "oak"];
const blockColor: Record<string, string> = {
  forest: "bg-forest",
  oak: "bg-oak",
  birch: "bg-birch",
};

export default function VersionB() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* faint pixel grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-chalk) 1px, transparent 1px), linear-gradient(90deg, var(--color-chalk) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-1 flex-col justify-center px-6 py-16 sm:px-16">
        <p className="label mb-6 text-[10px] text-birch sm:text-xs">World 1 · Creator Breakdowns</p>
        <Wordmark size="hero" />
        <p className="label mt-10 text-sm text-chalk/60 sm:text-base">
          By <span className="font-bold text-chalk">Martin Wang</span>
          <span className="cursor-blink ml-1 inline-block h-[1em] w-[0.6em] translate-y-[0.15em] bg-birch" aria-hidden />
        </p>
        <div className="mt-12">
          <Link
            href="/creator-breakdown"
            className="label group inline-flex items-center gap-3 border-2 border-chalk bg-bedrock px-6 py-4 text-xs text-chalk shadow-[6px_6px_0_var(--color-forest)] transition-transform hover:-translate-y-0.5 hover:bg-chalk hover:text-bedrock sm:text-sm"
          >
            <span className="text-birch group-hover:text-oak">▶</span>
            <span className="whitespace-nowrap">Press start</span>
          </Link>
          <p className="label mt-4 text-[10px] text-chalk/40">Creator Breakdowns</p>
        </div>
      </div>

      {/* block ground */}
      <div aria-hidden className="relative grid grid-cols-6 sm:grid-cols-12">
        {[...ground, ...ground].map((c, i) => (
          <div key={i} className={`block-tile aspect-square ${blockColor[c]} ${i >= 12 ? "brightness-75" : ""}`} />
        ))}
      </div>
    </main>
  );
}
