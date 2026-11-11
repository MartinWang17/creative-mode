"use client";

import { useState } from "react";
import { RATINGS } from "@/lib/feedback";


// Optional feedback under a free breakdown. Visitors only ever see their own input and a thank-you;
// answers go to Supabase and show up in Admin only.
export default function FeedbackBox({ slug }: { slug: string }) {
  const [rating, setRating] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function send() {
    if (!rating && !answer.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, rating, answer }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <section className="mt-8 border-2 border-oak p-6 sm:p-8">
        <p className="font-display text-3xl leading-none text-birch">Thank you!</p>
        <p className="mt-3 text-chalk/75">I read every answer. It helps me make the next breakdown better.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 border-2 border-oak p-6 sm:p-8" aria-labelledby="fb-h">
      <p className="label text-[10px] text-birch">Quick feedback · optional</p>
      <h2 id="fb-h" className="font-display mt-3 text-3xl leading-none sm:text-4xl">
        How useful was this?
      </h2>
      <div className="mt-5 flex flex-wrap gap-3" role="radiogroup" aria-label="How useful was this?">
        {RATINGS.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={rating === r.id}
            onClick={() => setRating(rating === r.id ? null : r.id)}
            className={`flex items-center gap-2 border-2 px-4 py-2 text-chalk ${
              rating === r.id ? "border-birch bg-forest" : "border-oak hover:border-birch"
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {r.emoji}
            </span>
            <span className="label text-[10px]">{r.label}</span>
          </button>
        ))}
      </div>
      <label className="label mt-6 block text-[10px] text-chalk/60" htmlFor="fb-answer">
        What would make this better, or what should I break down next?
      </label>
      <textarea
        id="fb-answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        maxLength={4000}
        placeholder="Optional"
        className="mt-2 block w-full border-2 border-oak bg-bedrock px-3 py-2 text-base text-chalk outline-none focus:border-birch"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={send}
          disabled={state === "sending" || (!rating && !answer.trim())}
          className="label rounded-full border-2 border-chalk px-6 py-3 text-xs text-chalk hover:bg-chalk hover:text-bedrock disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-chalk"
        >
          {state === "sending" ? "Sending…" : "Send"}
        </button>
        {state === "error" && <p className="text-sm text-birch">That didn&apos;t send. Try again in a minute?</p>}
      </div>
    </section>
  );
}
