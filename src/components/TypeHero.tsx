"use client";

import { useEffect, useRef, useState } from "react";

type Seg = { text: string; em?: boolean };

// The waitlist headline: types itself in, leaves a blinking block cursor at the end, and once typed
// each word drifts a pixel or two now and then, like the blocks on the home page.
// The server renders only the cursor (the text is in aria-label and the page description), so the
// headline doesn't flash fully formed before the typing starts.
export default function TypeHero({ segments, speed = 28 }: { segments: Seg[]; speed?: number }) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(total);
      setTyped(true);
      return;
    }
    let n = 0;
    const iv = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= total) {
        clearInterval(iv);
        setTyped(true);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [total, speed]);

  // Word-by-word spans so each word can drift on its own; characters past `shown` are hidden.
  let i = 0;
  let w = 0;
  const out = segments.map((seg, si) => {
    const words = seg.text.split(/(\s+)/);
    const nodes = words.map((word, wi) => {
      if (!word) return null;
      const start = i;
      i += word.length;
      if (/^\s+$/.test(word)) return start < shown ? " " : null;
      const visible = Math.max(0, Math.min(word.length, shown - start));
      if (visible <= 0) return null;
      w += 1;
      const style = typed
        ? ({ "--d": `${(w * 0.7) % 3}s`, "--t": `${5 + (w % 4)}s` } as React.CSSProperties)
        : undefined;
      return (
        <span key={wi} className="tw" style={style}>
          {word.slice(0, visible)}
        </span>
      );
    });
    return seg.em ? <em key={si}>{nodes}</em> : <span key={si}>{nodes}</span>;
  });

  return (
    <h1 className={`type${typed ? " typed" : ""}`} aria-label={segments.map((s) => s.text).join("")}>
      {/* Invisible full text holds the final height, so the page doesn't jump while typing. */}
      <span className="sizer" aria-hidden="true">
        {segments.map((seg, si) => (seg.em ? <em key={si}>{seg.text}</em> : seg.text))}
      </span>
      <span className="live" aria-hidden="true">
        {out}
        <span className="cursor" />
      </span>
    </h1>
  );
}
