"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import { offer } from "@/lib/offer";

export type Format = {
  id: string;
  category: string;
  number: number;
  instagram: string | null;
  hook: string;
  music: string;
  caption: string;
  script: string;
  notes: string;
};

// How the original creator's caption/script is shown. Martin hasn't decided:
//   "toggle"  = hidden behind a "See original caption" button (full text)
//   "excerpt" = always shows a short excerpt only, never the full text
//   "off"     = not shown at all
// Change this one line to switch.
const ORIGINAL_TEXT: "toggle" | "excerpt" | "off" = "toggle";
const EXCERPT_CHARS = 220;

const CATEGORIES = ["Easy to use", "Opinion", "Advice", "Relatable", "Storytelling"];
const BRIDGE_EVERY = 10;

function excerpt(t: string) {
  const s = t.trim();
  if (s.length <= EXCERPT_CHARS) return s;
  return s.slice(0, s.lastIndexOf(" ", EXCERPT_CHARS)).trimEnd() + "…";
}

// Notes are plain text with a few [label](url) links. Links to #id jump to that card.
function rich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href] = m;
    const inPage = href.startsWith("#");
    out.push(
      <a key={m.index} href={href} {...(inPage ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
        {label.replace(/^\(|\)$/g, "")}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const DOORS_OPEN = new Date(offer.cartOpens).getTime();

function Bridge() {
  return (
    <div className="fm-bridge">
      <p>
        <b>These are the what.</b> Creator Breakdown shows you why they work and how to make them your own. Doors open
        Dec 8, and you&apos;re on the list.
      </p>
      {/* No link to the sales page (and its price) before doors open. */}
      {Date.now() >= DOORS_OPEN && (
        <a className="pill label" href="/creator-breakdown">
          <span>See what&apos;s inside</span>
          <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}

function Card({ f }: { f: Format }) {
  const [open, setOpen] = useState(false);
  const original = [f.caption, f.script].filter((t) => t && t.trim()).join("\n\n");
  return (
    <article className="fm-card" id={f.id}>
      <p className="label fm-num">
        Format #{f.number} · {f.category}
      </p>
      <h3>{f.hook || "No text hook"}</h3>
      {f.music && <p className="fm-music">Sound: {f.music}</p>}
      <details className="fm-how">
        <summary>How to make it</summary>
        <div className="fm-notes">{rich(f.notes)}</div>
      </details>
      <div className="fm-actions">
        {f.instagram && (
          <a className="pill label" href={f.instagram} target="_blank" rel="noopener noreferrer">
            <span>Watch the example</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
        {ORIGINAL_TEXT === "toggle" && original && (
          <button type="button" className="fm-link" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? "Hide original caption" : "See original caption"}
          </button>
        )}
      </div>
      {ORIGINAL_TEXT === "toggle" && open && <div className="fm-original">{original}</div>}
      {ORIGINAL_TEXT === "excerpt" && original && (
        <div className="fm-original">
          <span className="label">Original caption, excerpt</span>
          <br />
          {excerpt(original)}
        </div>
      )}
    </article>
  );
}

export default function FormatsLibrary({ formats }: { formats: Format[] }) {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = useMemo(
    () => (query ? formats.filter((f) => f.hook.toLowerCase().includes(query)) : formats.filter((f) => f.category === cat)),
    [formats, cat, query],
  );
  const pick = (c: string) => {
    setQ("");
    setCat(c);
  };
  return (
    <div className="fm-lib">
      <div className="fm-bar">
        <div className="fm-tabs" role="tablist">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={!query && c === cat}
              className={!query && c === cat ? "on" : ""}
              onClick={() => pick(c)}
            >
              {c} <span>{formats.filter((f) => f.category === c).length}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the hooks…"
          aria-label="Search the hooks"
        />
      </div>
      {query && (
        <p className="fm-count">
          {shown.length} {shown.length === 1 ? "format" : "formats"} match &ldquo;{q.trim()}&rdquo;
        </p>
      )}
      <div className="fm-grid">
        {shown.map((f, i) => (
          <Fragment key={f.id}>
            <Card f={f} />
            {(i + 1) % BRIDGE_EVERY === 0 && i + 1 < shown.length && <Bridge />}
          </Fragment>
        ))}
      </div>
      <Bridge />
    </div>
  );
}
