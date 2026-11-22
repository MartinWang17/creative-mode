"use client";

import { useEffect, useState } from "react";

// The 6 levers from PLC episode 2. Ticks and the idea text are kept in this browser only.
// Each link is [url, optional label]; unlabelled ones show as "Example N".
const LEVERS: { n: number; name: string; does: string; ask: string; ex: string; links: string[][] }[] = [
  {
    n: 1, name: "Trending",
    does: "Ride something everyone is already talking about.",
    ask: "Is this tied to something people are talking about right now?",
    ex: "The Odyssey",
    links: [["https://www.tiktok.com/@jettfranzen/video/7611283029457227021", "Jett"], ["https://www.instagram.com/reel/DboWLb1JczL/"], ["https://www.instagram.com/reel/Dd1tTlmJu8b/"], ["https://www.instagram.com/reel/DdwyyK6p2A8/"]],
  },
  {
    n: 2, name: "Unique angle",
    does: "Cover a familiar topic through an angle nobody has used: an analogy, a study, a quote or a named term.",
    ask: "Am I saying a familiar thing in a way people haven't heard?",
    ex: "Nietzsche's Last Man",
    links: [["https://www.instagram.com/reel/DceJhZoxQPr/"], ["https://www.instagram.com/reel/DdrKmIhxyWA/"], ["https://www.instagram.com/reels/DSlx4JljP9J/"], ["https://www.instagram.com/p/DX40WFjRiIR/"], ["https://www.instagram.com/p/DdqFf7TxxF0/", "Local legend"], ["https://www.instagram.com/p/Dbvb1AlxzLN/"]],
  },
  {
    n: 3, name: "Uniquely you",
    does: "Share the opinions, stories and results only you have.",
    ask: "Could anyone else make this exact video?",
    ex: "Your take, your story",
    links: [["https://www.instagram.com/reel/DasZuAEx8my/", "Proof"], ["https://www.instagram.com/reel/DeYSpz1Ay4C/"], ["https://www.instagram.com/reel/DZXs4OBxhIK/", "Story"], ["https://www.instagram.com/p/DeYZ_aVz-h4/", "Case study"], ["https://www.instagram.com/reel/Ddh75MJgS1b/"], ["https://www.instagram.com/reel/DbZuEySAQlX/"]],
  },
  {
    n: 4, name: "Broad topic, shown simply",
    does: "Take a big topic and show it instead of explaining it.",
    ask: "Do lots of people care about this, and can I show it instead of telling it?",
    ex: "IG settings on a projector",
    links: [["https://www.instagram.com/reel/Dczr8MGgHeo/"], ["https://www.instagram.com/reel/DbwrZzBg-r0/"], ["https://www.instagram.com/reel/DaENeI3JJHf/"], ["https://www.instagram.com/p/DeFFzgiCQOe/"], ["https://www.instagram.com/p/DcRJMuuR7wK/"], ["https://www.instagram.com/reel/Dd6jg8FvvAS/"], ["https://www.instagram.com/p/DDdWxQYy_cr/", "Tyler"]],
  },
  {
    n: 5, name: "Easy-to-copy format",
    does: "Put your message inside a structure people already love.",
    ask: "Is this a format people already recognize?",
    ex: "“How to sleep but brain rot”",
    links: [["https://www.instagram.com/p/DUCEigIAApp/", "Josh"], ["https://www.instagram.com/reel/De2nFEHx4Uy/"], ["https://www.instagram.com/reel/Dczr8MGgHeo/"], ["https://www.instagram.com/p/Ddm7ol9x3O8/"], ["https://www.instagram.com/reel/DbUZbtBMUic/"], ["https://www.instagram.com/p/Dcggcv6xgAn/"], ["https://www.instagram.com/p/DfR7E5jS9_L/"]],
  },
  {
    n: 6, name: "Make people feel seen",
    does: "Describe the viewer, or someone they know, so well they have to send it.",
    ask: "Will someone watch this and think 'this is me' or 'this is you'?",
    ex: "Rare Traits series",
    links: [["https://www.instagram.com/reel/DdnQC7HgPAa/"], ["https://www.instagram.com/reel/Dd2dgNpgxW8/"], ["https://www.instagram.com/reel/DWzMWLlibPB/"], ["https://www.instagram.com/reel/Da8psaIxYJf/"], ["https://www.instagram.com/reel/DaPyO5XiAR5/", "Richie"], ["https://www.instagram.com/reel/Dba2oQpufAb/"]],
  },
];
const KEY = "idea-filter-v1";
const EMPTY = LEVERS.map(() => false);

export default function IdeaFilter() {
  const [ticks, setTicks] = useState<boolean[]>(EMPTY);
  const [idea, setIdea] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (d && Array.isArray(d.t)) {
        setTicks(LEVERS.map((_, i) => !!d.t[i]));
        setIdea(typeof d.i === "string" ? d.i : "");
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ t: ticks, i: idea }));
    } catch {}
  }, [ticks, idea, loaded]);

  const c = ticks.filter(Boolean).length;
  const verdict =
    c === 0
      ? ["Skip it", "Tick the levers your idea pulls."]
      : c === 1
        ? ["Worth a try", "One lever. Can you add a second?"]
        : ["You've probably got a viral video", "Now check it against the big rule below."];

  return (
    <>
      <section className="how" aria-label="How to score an idea">
        <div className="steps">
          <div className="step"><b>0 LEVERS</b><span>Skip it. Find a different idea.</span></div>
          <div className="step"><b>1 LEVER</b><span>Worth a try.</span></div>
          <div className="step"><b>2+ LEVERS</b><span>You&apos;ve probably got a viral video.</span></div>
        </div>
        <div className="idea">
          <label htmlFor="idea">The idea you&apos;re checking (optional)</label>
          <input
            id="idea"
            type="text"
            placeholder="e.g. Rare traits of people who quietly outwork everyone"
            autoComplete="off"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
        </div>
      </section>

      <section aria-label="The 6 levers" style={{ display: "grid", gap: 12 }}>
        <div className="score" aria-live="polite">
          <div className="count">{c}/6</div>
          <div className="verdict">
            {verdict[0]}
            <small>{verdict[1]}</small>
          </div>
          <button className="reset" type="button" onClick={() => { setTicks(EMPTY); setIdea(""); }}>
            Start over
          </button>
        </div>
        <div className="levers">
          {LEVERS.map((l, i) => (
            <label className="lever" htmlFor={`lv${l.n}`} key={l.n}>
              <input
                type="checkbox"
                id={`lv${l.n}`}
                checked={ticks[i]}
                onChange={(e) => setTicks(ticks.map((v, j) => (j === i ? e.target.checked : v)))}
              />
              <span className="box">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8.5l3.2 3L13 4.5" stroke="#121411" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="body">
                <span className="name">
                  <span className="n">LEVER {l.n}</span>
                  <h3>{l.name}</h3>
                </span>
                <span className="does">{l.does}</span>
                <span className="ask"><b>Ask:</b> {l.ask}</span>
                <span className="ex"><span>EXAMPLE</span>{l.ex}</span>
                <span className="links">
                  <span className="lk">WATCH</span>
                  {l.links.map((k, j) => (
                    <a href={k[0]} target="_blank" rel="noopener" key={j}>
                      {k[1] || `Example ${j + 1}`}
                    </a>
                  ))}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>
    </>
  );
}
