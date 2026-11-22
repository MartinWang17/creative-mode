import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import IdeaFilter from "@/components/IdeaFilter";
import "./idea-filter.css";

// PLC episode 2 free resource (GROW keyword): the Idea Filter checklist.
// Shared as /grow-1PLC2-free-resource; middleware sends any other casing of the path here.
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["400", "600", "800"] });

export const metadata: Metadata = {
  title: "The Idea Filter | Creative Mode",
  description: "Run a video idea through 6 levers before you film it.",
  robots: { index: false, follow: false },
};

export default function IdeaFilterPage() {
  return (
    <div className={`idf ${bricolage.variable}`}>
      <div className="wrap">
        <header>
          <div className="eyebrow">FREE CHECKLIST · EPISODE 2</div>
          <h1>The Idea Filter</h1>
          <p className="lead">
            Before you film anything, run the idea through these 6 levers. Every viral video I studied pulled at least
            one of them. Tick each lever your idea pulls and the score tells you whether to make it.
          </p>
        </header>

        <IdeaFilter />

        <section className="rule" aria-labelledby="rule-h">
          <div>
            <div className="eyebrow">THE BIG RULE</div>
            <h2 id="rule-h" style={{ marginTop: 6 }}>
              Even if a video pulls all 6 levers, don&apos;t copy it if it fails this.
            </h2>
          </div>
          <p className="q">Did this video go viral because of the idea, or because of who made it?</p>
          <p>The creator you learn from should have skills similar to yours.</p>
          <div className="match">
            <div className="row"><b>If you&apos;re famous</b><span className="use">You can use famous people&apos;s videos.</span></div>
            <div className="row"><b>If you&apos;re a great speaker</b><span className="use">You can use great speakers&apos; videos.</span></div>
            <div className="row key"><b>If you&apos;re a beginner</b><span className="use">Only use videos that would still go viral if a complete stranger posted them.</span></div>
          </div>
          <div className="signs">
            <h4>Signs it only worked because of who made it</h4>
            <ul>
              <li>
                They already have a huge fanbase and credibility, so people watch everything they post, even general
                advice with no levers.
              </li>
              <li>There&apos;s a celebrity or a famous face in it.</li>
              <li>The production is something you can&apos;t match yet.</li>
              <li>Their face, voice or delivery is carrying the video, not the idea.</li>
              <li>It&apos;s general advice that people only trust because of who&apos;s saying it.</li>
            </ul>
          </div>
        </section>

        <section className="cta">
          <b>NEXT</b>
          <p>
            A full breakdown of one creator takes me about 12 hours. In episode 3, I show you how to skip that and how
            my student Lukas used this exact process to go from 2,000 views to over 600,000.
          </p>
        </section>

        <p className="foot">Creative Mode by Martin Wang. Your ticks are saved in this browser only.</p>
      </div>
    </div>
  );
}
