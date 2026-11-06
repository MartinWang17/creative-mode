"use client";

import { useRef } from "react";

// The breakdown fills the page width and the screen height (under the site header).
// "Full screen" hides everything else; Esc exits.
export default function BreakdownFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
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
        className="label absolute right-4 top-4 hidden border-2 border-oak bg-bedrock/90 px-3 py-2 text-[10px] text-chalk/80 hover:text-chalk sm:block"
      >
        Full screen ⤢
      </button>
    </div>
  );
}
