"use client";

import { useEffect } from "react";

// The motion on the home page and the Creator Breakdowns page, ported from the approved preview:
// drifting blocks, the local hover break on CREATIVE MODE and BREAKDOWNS, the scroll scenes
// where each line breaks apart into the next, smooth in-page jumps, and the deadline countdown.
export default function LandingFx({ deadline }: { deadline?: string }) {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = matchMedia("(hover:hover)").matches && !reduced;
    const on = <K extends keyof WindowEventMap>(
      el: Window | HTMLElement,
      ev: K | string,
      fn: EventListener,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(ev, fn, opts);
      cleanups.push(() => el.removeEventListener(ev, fn, opts));
    };

    // In-page jumps (Pricing, Join now) scroll smoothly
    document.querySelectorAll<HTMLAnchorElement>(".cm [data-scroll]").forEach((a) => {
      on(a, "click", (e) => {
        const id = a.getAttribute("href")?.slice(1);
        const target = id ? document.getElementById(id) : null;
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        history.replaceState(null, "", `#${id}`);
      });
    });

    // Drifting blocks behind the home hero
    const drift = document.getElementById("drift");
    if (drift && !drift.childElementCount) {
      const cols = ["var(--forest)", "var(--oak)", "var(--birch)", "var(--forest)", "var(--oak)"];
      for (let i = 0; i < 16; i++) {
        const b = document.createElement("i");
        const s = 18 + Math.round(rnd() * 54);
        b.style.cssText = `--s:${s}px;--c:${cols[i % cols.length]};left:${Math.round(rnd() * 100)}%;top:${Math.round(rnd() * 100)}%;--x:${Math.round((rnd() - 0.5) * 160)}px;--y:${Math.round((rnd() - 0.5) * 160)}px;--r:${Math.round((rnd() - 0.5) * 40)}deg;--d:${14 + Math.round(rnd() * 16)}s;--o:-${Math.round(rnd() * 20)}s`;
        drift.appendChild(b);
      }
    }

    // CREATIVE MODE wordmark: a fine grid of clipped copies; only tiles near the cursor shift
    const wm = document.getElementById("wm");
    if (wm && !wm.querySelector(".tile")) {
      const C = 14,
        R = 6;
      const tiles: Array<{ el: HTMLElement; r: number; c: number }> = [];
      for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++) {
          const t = document.createElement("span");
          t.className = "tile";
          t.setAttribute("aria-hidden", "true");
          t.innerHTML = '<b class="l1">CREATIVE</b><b class="l2">MODE</b>';
          t.style.cssText = `--t:${(r * 100) / R}%;--b:${((R - 1 - r) * 100) / R}%;--l:${(c * 100) / C}%;--rt:${((C - 1 - c) * 100) / C}%;--dx:${((rnd() - 0.5) * 16).toFixed(1)}px;--dy:${((rnd() - 0.5) * 14).toFixed(1)}px;--rz:${((rnd() - 0.5) * 5).toFixed(2)}deg`;
          wm.appendChild(t);
          tiles.push({ el: t, r, c });
        }
      const RADIUS = 0.28; // of the wordmark's width
      if (canHover) {
        on(wm, "mousemove", (e) => {
          const { clientX, clientY } = e as MouseEvent;
          const box = wm.getBoundingClientRect();
          const mx = (clientX - box.left) / box.width,
            my = (clientY - box.top) / box.height;
          tiles.forEach((t) => {
            const dx = (t.c + 0.5) / C - mx,
              dy = ((t.r + 0.5) / R - my) * (box.height / box.width);
            const d = Math.sqrt(dx * dx + dy * dy);
            let k = d < RADIUS ? 1 - d / RADIUS : 0;
            k = k * k * (3 - 2 * k);
            t.el.style.setProperty("--k", k.toFixed(3));
          });
        });
        on(wm, "mouseleave", () => tiles.forEach((t) => t.el.style.setProperty("--k", "0")));
      }
    }

    // BREAKDOWNS: letters slipping, plus the same local hover break
    const bd = document.getElementById("bd");
    if (bd && !bd.childElementCount) {
      const word = "BREAKDOWNS";
      const letters: HTMLElement[] = [];
      for (let k = 0; k < word.length; k++) {
        const sp = document.createElement("span");
        sp.textContent = word[k];
        const y = (k * k * 0.09 + rnd() * 2).toFixed(1);
        const rz = ((rnd() - 0.5) * 5 + k * 0.3).toFixed(2);
        sp.style.cssText = `--y:${y}px;--r:${rz}deg;--dx:${((rnd() - 0.5) * 18).toFixed(1)}px;--dy:${(6 + rnd() * 16).toFixed(1)}px;--rz:${((rnd() - 0.5) * 12).toFixed(2)}deg`;
        bd.appendChild(sp);
        letters.push(sp);
      }
      if (canHover) {
        on(bd, "mousemove", (e) => {
          const { clientX, clientY } = e as MouseEvent;
          const rad = bd.getBoundingClientRect().width * 0.22;
          letters.forEach((s) => {
            const b = s.getBoundingClientRect();
            const dx = b.left + b.width / 2 - clientX,
              dy = b.top + b.height / 2 - clientY;
            const d = Math.sqrt(dx * dx + dy * dy);
            let k = d < rad ? 1 - d / rad : 0;
            k = k * k * (3 - 2 * k);
            s.style.setProperty("--k", k.toFixed(3));
          });
        });
        on(bd, "mouseleave", () => letters.forEach((s) => s.style.setProperty("--k", "0")));
      }
    }

    // Pill under the promise: holes masked out of its edges, chunks sitting below each hole, bits falling from them
    const spill = document.getElementById("spill");
    const pill = document.getElementById("spill-pill");
    if (spill && pill && !spill.querySelector(".chunk")) {
      // Each hole: distance from the pill's right (r) or left (l) edge, from its bottom (b), and size. Negative = cuts through the edge.
      type Hole = { r?: number; l?: number; b: number; s: number };
      const holes: Hole[] = [
        { r: 26, b: -3, s: 16 }, { r: 50, b: 5, s: 10 }, { r: -3, b: 34, s: 14 }, { r: 9, b: 56, s: 8 },
        { r: 128, b: -3, s: 12 }, { r: 154, b: 7, s: 7 }, { l: 44, b: -3, s: 12 }, { l: 70, b: 6, s: 8 },
        { r: 320, b: -3, s: 9 }, { l: -3, b: 70, s: 10 },
      ];
      const chunks: HTMLElement[] = [];
      const bits: Array<{ el: HTMLElement; h: number }> = [];
      const bcols = ["var(--birch)", "var(--forest)", "var(--oak)"];
      holes.forEach((h, i) => {
        const c = document.createElement("i");
        c.className = "chunk";
        c.setAttribute("aria-hidden", "true");
        spill.appendChild(c);
        chunks.push(c);
        for (let q = 0; q < 2; q++) {
          const e = document.createElement("i");
          e.className = "bit";
          e.setAttribute("aria-hidden", "true");
          e.style.cssText = `--s:${3 + Math.round(rnd() * 5)}px;--c:${bcols[(i + q) % 3]};--dx:${Math.round((rnd() - 0.5) * 36)}px;--fall:${50 + Math.round(rnd() * 80)}px;--r:${Math.round((rnd() - 0.5) * 200)}deg;--d:${(2.4 + rnd() * 2.4).toFixed(2)}s;--o:-${(rnd() * 5).toFixed(2)}s`;
          spill.appendChild(e);
          bits.push({ el: e, h: i });
        }
      });
      const holeXY = (h: Hole, W: number, H: number) => [h.l != null ? h.l : W - (h.r || 0) - h.s, H - h.b - h.s];
      const layout = () => {
        const W = pill.offsetWidth;
        const H = pill.offsetHeight;
        if (!W || !H) return;
        const imgs = ["linear-gradient(#000 0 0)"];
        const pos = ["0 0"];
        const size = ["100% 100%"];
        holes.forEach((h, i) => {
          const [x, y] = holeXY(h, W, H);
          imgs.push("linear-gradient(#000 0 0)");
          pos.push(`${x}px ${y}px`);
          size.push(`${h.s}px ${h.s}px`);
          chunks[i].style.cssText = `--s:${h.s}px;--x:${(x + (i % 2 ? -3 : 4)).toFixed(0)}px;--y:${(y + h.s * 0.9 + 6 + (i % 3) * 5).toFixed(0)}px;--r:${(i % 2 ? -1 : 1) * (8 + ((i * 7) % 22))}deg`;
        });
        bits.forEach((b) => {
          const [x, y] = holeXY(holes[b.h], W, H);
          b.el.style.setProperty("--x", `${x + holes[b.h].s / 2 - 3}px`);
          b.el.style.setProperty("--y", `${y + holes[b.h].s}px`);
        });
        const st = pill.style as CSSStyleDeclaration & { webkitMaskImage?: string; webkitMaskPosition?: string; webkitMaskSize?: string; webkitMaskRepeat?: string; webkitMaskComposite?: string };
        st.maskImage = st.webkitMaskImage = imgs.join(",");
        st.maskPosition = st.webkitMaskPosition = pos.join(",");
        st.maskSize = st.webkitMaskSize = size.join(",");
        st.maskRepeat = st.webkitMaskRepeat = "no-repeat";
        st.maskComposite = "exclude";
        st.webkitMaskComposite = "xor";
      };
      layout();
      on(window, "resize", layout);
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(layout);
        ro.observe(pill);
        cleanups.push(() => ro.disconnect());
      }
      if (document.fonts) document.fonts.ready.then(layout);
    }

    // Scroll scenes: each line breaks apart to reveal the next
    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    type Part = [string, 0 | 1];
    type Ch = HTMLSpanElement & { _dy: number; _dx: number; _r: number };
    function makeScene(id: string, LINES: Part[][]) {
      const scene = document.getElementById(id);
      if (!scene) return null;
      const linesEl = scene.querySelector(".lines")!;
      const stepEl = scene.querySelector(".step")!;
      const label = scene.getAttribute("data-label");
      const wrapEl = scene.querySelector(".wrap") as HTMLElement;
      let lastH = 0;
      linesEl.innerHTML = "";
      const chars: Array<{ el: HTMLElement; c: Ch[] }> = [];
      LINES.forEach((parts) => {
        const el = document.createElement("span");
        el.className = "line";
        const arr: Ch[] = [];
        parts.forEach(([text, em]) => {
          text.split(/(?= )/).forEach((word) => {
            const w = document.createElement("span");
            w.className = "w";
            for (const ch of word) {
              const s = document.createElement("span") as Ch;
              s.textContent = ch;
              if (em) s.className = "em";
              s._dy = 60 + rnd() * 180;
              s._dx = (rnd() - 0.5) * 70;
              s._r = (rnd() - 0.5) * 50;
              w.appendChild(s);
              arr.push(s);
            }
            el.appendChild(w);
          });
        });
        linesEl.appendChild(el);
        chars.push({ el, c: arr });
      });
      stepEl.textContent = `${label} · 1 of ${LINES.length}`;
      return function render() {
        const wh = wrapEl.offsetHeight;
        if (wh && wh !== lastH) {
          lastH = wh;
          scene!.style.setProperty("--lead", `${wh / 2 + 72}px`);
        }
        if (reduced) {
          chars.forEach((L) => (L.el.style.opacity = "1"));
          return;
        }
        const rect = scene.getBoundingClientRect(),
          vh = innerHeight;
        const p = Math.min(1, Math.max(0, -rect.top / (rect.height - vh)));
        const N = LINES.length,
          seg = 1 / N;
        const active = Math.min(N - 1, Math.floor(p / seg));
        let t = (p - active * seg) / seg;
        if (active === N - 1) t = Math.min(t, 0.5);
        stepEl.textContent = `${label} · ${active + 1} of ${N}`;
        scene.classList.toggle("done", p > 0.97);
        chars.forEach((L, i) => {
          if (i < active) {
            L.el.style.opacity = "0";
            return;
          }
          if (i > active) {
            L.el.style.opacity = "0";
            L.c.forEach((s) => {
              s.style.transform = "translateY(-18px)";
              s.style.opacity = "0";
            });
            return;
          }
          L.el.style.opacity = "1";
          const e = t < 0.5 ? 0 : ease((t - 0.5) / 0.5),
            inn = i === 0 ? 1 : Math.min(1, t / 0.18);
          L.c.forEach((s) => {
            const o = inn < 1 ? ease(inn) : 1 - e;
            s.style.opacity = String(Math.max(0, o));
            const y = inn < 1 ? (1 - ease(inn)) * -18 : e * s._dy;
            s.style.transform = `translate(${(e * s._dx).toFixed(1)}px,${y.toFixed(1)}px) rotate(${(e * s._r).toFixed(1)}deg)`;
          });
        });
      };
    }
    const scenes = [
      makeScene("scene-promise", [
        [["It took these creators ", 0], ["years", 1], [" to build their strategy.", 0]],
        [["It took me ", 0], ["days", 1], [" to break it down.", 0]],
        [["It will take you ", 0], ["half an hour", 1], [" to learn it.", 0]],
      ]),
      makeScene("scene-price", [
        [["It's not going to be ", 0], ["$200.", 1]],
        [["It's not going to be ", 0], ["$100.", 1]],
        [["It's not even going to be ", 0], ["$50.", 1]],
        [["It's going to be ", 0], ["JUST $20", 1], [" a month.", 0]],
      ]),
    ].filter(Boolean) as Array<() => void>;
    if (scenes.length) {
      const renderAll = () => scenes.forEach((f) => f());
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          renderAll();
          ticking = false;
        });
      };
      on(window, "scroll", onScroll, { passive: true });
      on(window, "resize", onScroll);
      renderAll();
    }

    // Countdown to the end of founding pricing
    const count = document.getElementById("count");
    if (count && deadline) {
      const end = Date.parse(deadline);
      const tick = () => {
        const ms = Math.max(0, end - Date.now());
        const v: Record<string, number> = {
          d: Math.floor(ms / 864e5),
          h: Math.floor(ms / 36e5) % 24,
          m: Math.floor(ms / 6e4) % 60,
          s: Math.floor(ms / 1e3) % 60,
        };
        count.querySelectorAll("b").forEach((b) => {
          b.textContent = String(v[b.getAttribute("data-u") || "d"]).padStart(2, "0");
        });
      };
      tick();
      const iv = setInterval(tick, 1000);
      cleanups.push(() => clearInterval(iv));
    }

    return () => cleanups.forEach((f) => f());
  }, [deadline]);

  return null;
}
