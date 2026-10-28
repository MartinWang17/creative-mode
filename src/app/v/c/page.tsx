import PillLink from "@/components/PillLink";

// Version C: teaser. Wordmark plus a sample stat card from a real breakdown.
const bars = [0.4, 0.7, 0.5, 1, 0.6, 0.9, 0.45, 0.8];

export default function VersionC() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-7xl items-center gap-14 px-6 py-16 sm:px-16 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h1 className="font-display leading-[0.78]">
          <span className="shadow-forest block text-[30vw] text-chalk sm:text-[14rem] lg:text-[12rem] xl:text-[15rem]">
            CREATIVE
          </span>
          <span className="shadow-oak block text-[30vw] text-birch sm:text-[14rem] lg:text-[12rem] xl:text-[15rem]">
            MODE
          </span>
        </h1>
        <p className="label mt-10 text-sm text-chalk/60 sm:text-base">
          By <span className="font-bold text-chalk">Martin Wang</span>
        </p>
        <div className="mt-12">
          <PillLink href="/creator-breakdown">Creator Breakdowns</PillLink>
        </div>
      </div>

      <aside className="border-2 border-oak bg-forest p-6 shadow-[8px_8px_0_var(--color-oak)] sm:p-8">
        <p className="label text-[10px] text-birch">From a real breakdown · @nategaffney</p>
        <p className="font-display mt-5 text-7xl leading-none text-chalk sm:text-8xl">60%</p>
        <p className="mt-2 text-chalk/85">of his views came from one hook pattern.</p>
        <div className="mt-8 flex h-28 items-end gap-2" aria-hidden>
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 ${h === 1 ? "bg-birch" : "bg-bedrock/60"}`}
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t-2 border-oak pt-5">
          <div>
            <p className="font-display text-4xl leading-none text-birch">21</p>
            <p className="mt-1 text-sm text-chalk/75">Reels used it</p>
          </div>
          <div>
            <p className="font-display text-4xl leading-none text-birch">11.1x</p>
            <p className="mt-1 text-sm text-chalk/75">best variant vs median</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
