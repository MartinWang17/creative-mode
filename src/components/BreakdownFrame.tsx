"use client";

import { useEffect, useRef } from "react";

// The breakdown fills the page width and the screen height (under the site header).
// "Full screen" hides everything else; Esc exits.
// When the reader reaches the end of the report, the page scrolls to `endTarget` (e.g. the feedback box),
// which otherwise sits below a frame that fills the whole screen.
export default function BreakdownFrame({ src, title, endTarget }: { src: string; title: string; endTarget?: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!endTarget) return;
    let done = false;
    const onMsg = (e: MessageEvent) => {
      if (done || e.source !== ref.current?.contentWindow) return;
      if ((e.data as { type?: string } | null)?.type !== "cm-breakdown-end") return;
      done = true;
      if (document.fullscreenElement) return;
      document.getElementById(endTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [endTarget]);
  const goFull = () => {
    const el = ref.current as (HTMLIFrameElement & { webkitRequestFullscreen?: () => void }) | null;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else el.webkitRequestFullscreen?.();
  };
  return (
    <div className="relative">
      <iframe
        ref={ref}
        src={src}
        title={title}
        allowFullScreen
        className="block h-[calc(100dvh-5rem)] w-full border-y-2 border-oak bg-bedrock"
      />
      <button
        type="button"
        onClick={goFull}
        className="label absolute right-4 top-4 hidden border-2 border-oak bg-bedrock/90 px-3 py-2 text-xs text-chalk/80 hover:text-chalk sm:block"
      >
        Full screen ⤢
      </button>
    </div>
  );
}
