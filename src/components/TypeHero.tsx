"use client";

import { useEffect, useRef, useState } from "react";

type Seg = { text: string; em?: boolean };

// The waitlist headline: types itself in, leaves a blinking block cursor at the end, and once typed
// each letter jitters a pixel now and then and breaks away from the cursor on hover, like the
// CREATIVE MODE wordmark on the home page.
// The server renders only the cursor (the text is in aria-label and the page description), so the
// headline doesn't flash fully formed before the typing starts.
export default function TypeHero({ segments, speed = 28 }: { segments: Seg[]; speed?: number }) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(false);
  const started = useRef(false);
  const h1 = useRef<HTMLHeadingElement>(null);

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

  // Idle jitter: at most MAX_MOVING letters nudge a pixel at any one time, picked at random.
  useEffect(() => {
    const el = h1.current;
    if (!el || !typed) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const MAX_MOVING = 3;
    const STEPS = ["0,-1px", "1px,-1px", "-1px,0", "0,1px", "-1px,1px", "1px,0"];
    const moving = new Set<HTMLElement>();
    const timers: number[] = [];
    const tick = () => {
      const all = Array.from(el.querySelectorAll<HTMLElement>(".ti"));
      if (all.length && moving.size < MAX_MOVING) {
        const pick = all[Math.floor(Math.random() * all.length)];
        if (!moving.has(pick)) {
          moving.add(pick);
          const a = STEPS[Math.floor(Math.random() * STEPS.length)];
          const b = STEPS[Math.floor(Math.random() * STEPS.length)];
          pick.style.transform = `translate(${a})`;
          timers.push(
            window.setTimeout(() => (pick.style.transform = `translate(${b})`), 450),
            window.setTimeout(() => {
              pick.style.transform = "";
              moving.delete(pick);
            }, 900 + Math.random() * 600),
          );
        }
      }
      timers.push(window.setTimeout(tick, 350 + Math.random() * 500));
    };
    timers.push(window.setTimeout(tick, 600));
    return () => timers.forEach(clearTimeout);
  }, [typed]);

  // Local hover break: letters near the cursor shift and tilt, and settle back when it leaves.
  useEffect(() => {
    const el = h1.current;
    if (!el || !typed) return;
    if (!matchMedia("(hover:hover)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = () => Array.from(el.querySelectorAll<HTMLElement>(".tc"));
    const move = (e: MouseEvent) => {
      const rad = Math.min(el.getBoundingClientRect().width * 0.16, 180);
      letters().forEach((s) => {
        const b = s.getBoundingClientRect();
        const dx = b.left + b.width / 2 - e.clientX,
          dy = b.top + b.height / 2 - e.clientY;
        const d = Math.sqrt(dx * dx + dy * dy);
        let k = d < rad ? 1 - d / rad : 0;
        k = k * k * (3 - 2 * k);
        s.style.setProperty("--k", k.toFixed(3));
      });
    };
    const leave = () => letters().forEach((s) => s.style.setProperty("--k", "0"));
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [typed]);

  // Seeded so every render lays the letters out the same way.
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Word spans keep wrapping sane; letter spans inside carry the motion. Characters past `shown` are hidden.
  let i = 0;
  const out = segments.map((seg, si) => {
    const words = seg.text.split(/(\s+)/);
    const nodes = words.map((word, wi) => {
      if (!word) return null;
      const start = i;
      i += word.length;
      if (/^\s+$/.test(word)) return start < shown ? " " : null;
      const chars = Array.from(word).map((ch, ci) => {
        const style = {
          "--dx": `${((rnd() - 0.5) * 14).toFixed(1)}px`,
          "--dy": `${(4 + rnd() * 12).toFixed(1)}px`,
          "--rz": `${((rnd() - 0.5) * 10).toFixed(2)}deg`,
        } as React.CSSProperties;
        if (start + ci >= shown) return null;
        return (
          <span key={ci} className="tc" style={style}>
            <span className="ti">{ch}</span>
          </span>
        );
      });
      if (chars.every((c) => c === null)) return null;
      return (
        <span key={wi} className="tw">
          {chars}
        </span>
      );
    });
    return seg.em ? <em key={si}>{nodes}</em> : <span key={si}>{nodes}</span>;
  });

  return (
    <h1
      ref={h1}
      className={`type${typed ? " typed" : ""}`}
      aria-label={segments.map((s) => s.text).join("")}
    >
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
