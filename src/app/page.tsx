import PillLink from "@/components/PillLink";
import Wordmark from "@/components/Wordmark";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-6 py-16 sm:px-16">
      <Wordmark size="hero" />
      <p className="label mt-10 text-sm text-chalk/60 sm:text-base">
        By <span className="font-bold text-chalk">Martin Wang</span>
      </p>
      <div className="mt-12">
        <PillLink href="/creator-breakdown">Creator Breakdowns</PillLink>
      </div>
    </main>
  );
}
