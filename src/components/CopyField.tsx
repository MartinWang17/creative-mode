"use client";

import { useState } from "react";

// A read-only link with a Copy button (Admin: creator gift links).
export default function CopyField({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* the field is selectable as a fallback */
    }
  };
  return (
    <span className="flex max-w-xl items-center gap-2">
      <input
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 border-2 border-oak bg-bedrock px-2 py-1 text-xs text-chalk/80 outline-none"
      />
      <button type="button" onClick={copy} className="label border-2 border-oak px-3 py-1 text-[10px] text-chalk hover:border-birch">
        {done ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
