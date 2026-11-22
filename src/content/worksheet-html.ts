// Markup of the DO, WHY, HOW worksheet (PLC episode 1 freebie). Static and written by us; the client script in
// components/Worksheet.tsx adds the 10 format rows and wires up saving.
export const WORKSHEET_HTML = "<div class=\"wrap\">\n" +
  "  <header>\n" +
  "    <div class=\"eyebrow\">FREE WORKSHEET · EPISODE 1</div>\n" +
  "    <h1>The DO → WHY → HOW Worksheet</h1>\n" +
  "    <p class=\"lead\">From Episode 1 of \"How I grew 224k followers in 30 days after plateauing for 6 months\". Use it on any video you want to learn from.</p>\n" +
  "  </header>\n" +
  "\n" +
  "  <p class=\"notice\"><b>Heads up:</b> your answers save automatically in this browser on this device. If you switch phones or computers, or clear your browser, they won't be there. Tap <b>Copy my answers</b> at the bottom to keep a copy in your Notes.</p>\n" +
  "\n" +
  "  <section class=\"step\" aria-labelledby=\"s1\">\n" +
  "    <div class=\"step-head\"><span class=\"num\">1</span><h2 id=\"s1\">Find 10 formats in 20 minutes</h2></div>\n" +
  "    <p>Most creators look for inspo on their main account, where the algorithm feeds you what <em>you</em> like, not what helps you grow. Give your brain a separate space for it.</p>\n" +
  "    <ul class=\"checks\">\n" +
  "      <li><label><input type=\"checkbox\" id=\"c1a\"> Make a brand-new Instagram account just for finding inspiration</label></li>\n" +
  "      <li><label><input type=\"checkbox\" id=\"c1b\"> Write down the exact format you're hunting for (e.g. B-roll with text, talking head that opens with a fact, advice video)</label></li>\n" +
  "      <li><label><input type=\"checkbox\" id=\"c1c\"> Set a 20-minute timer and aggressively scroll past everything that isn't that format</label></li>\n" +
  "      <li><label><input type=\"checkbox\" id=\"c1d\"> Save every video that did way better than that creator's usual views</label></li>\n" +
  "    </ul>\n" +
  "    <div class=\"card\">\n" +
  "      <div class=\"formats\" id=\"formats\">\n" +
  "        <div class=\"frow hd\"><span></span><span>Link</span><span>Format</span><span>Views</span><span>Usual views</span><span style=\"text-align:right\">x</span></div>\n" +
  "      </div>\n" +
  "      <p class=\"tip\"><b>Tip:</b> a video only counts as proven if it beat that creator's usual views by a lot (aim for 5-10x). A big creator's average video isn't a pattern, it's just their audience.</p>\n" +
  "    </div>\n" +
  "  </section>\n" +
  "\n" +
  "  <section class=\"step\" aria-labelledby=\"s2\">\n" +
  "    <div class=\"step-head\"><span class=\"num\">2</span><h2 id=\"s2\">Break down one video</h2></div>\n" +
  "    <p>Pick the best video from your list. Watch it and read the transcript until you can answer all 3 questions.</p>\n" +
  "    <p><b>Example we'll use below:</b> <a href=\"https://www.instagram.com/reel/DbwrZzBg-r0/\" target=\"_blank\" rel=\"noopener\">my viral background music video</a>. Watch it first, then follow along.</p>\n" +
  "    <div class=\"row3\">\n" +
  "      <label class=\"f wide\" for=\"v-link\">The video<input id=\"v-link\" type=\"url\" placeholder=\"Paste the link\"></label>\n" +
  "      <label class=\"f\" for=\"v-views\">Views<input id=\"v-views\" type=\"text\" inputmode=\"numeric\" placeholder=\"e.g. 1.2M\"></label>\n" +
  "      <label class=\"f\" for=\"v-usual\">Creator's usual<input id=\"v-usual\" type=\"text\" inputmode=\"numeric\" placeholder=\"e.g. 40K\"></label>\n" +
  "    </div>\n" +
  "\n" +
  "    <div class=\"card q\">\n" +
  "      <h3>1. DO: What did this video do for the viewer?</h3>\n" +
  "      <textarea id=\"a-do\" aria-label=\"DO answer\" placeholder=\"It ...\"></textarea>\n" +
  "      <p class=\"test\"><b>Test:</b> if your answer mentions the topic, you're still on the surface. Go again.</p>\n" +
  "      <div class=\"ex\"><p><i>SURFACE</i>\"It's about background music.\"</p><p><i>REAL ANSWER</i><span>\"It made a decision for them.\"</span></p></div>\n" +
  "    </div>\n" +
  "\n" +
  "    <div class=\"card q\">\n" +
  "      <h3>2. WHY: Why would they want that?</h3>\n" +
  "      <textarea id=\"a-why\" aria-label=\"WHY answer\" placeholder=\"Because they ...\"></textarea>\n" +
  "      <p class=\"test\"><b>Test:</b> keep asking \"why\" until your answer would be true in a totally different niche. That's when you stop.</p>\n" +
  "      <div class=\"ex\"><p><i>TOO NARROW</i>\"They want trending music.\"</p><p><i>DEEP ENOUGH</i><span>\"They don't want to think or put in effort.\"</span></p></div>\n" +
  "    </div>\n" +
  "\n" +
  "    <div class=\"card q\">\n" +
  "      <h3>3. HOW: How did it do that?</h3>\n" +
  "      <p class=\"muted\">Write the structure, beat by beat (you don't have to fill every line). This is the part you borrow.</p>\n" +
  "      <div class=\"beats\">\n" +
  "        <label for=\"b1\"><input id=\"b1\" type=\"text\" aria-label=\"Beat 1\"></label>\n" +
  "        <label for=\"b2\"><input id=\"b2\" type=\"text\" aria-label=\"Beat 2\"></label>\n" +
  "        <label for=\"b3\"><input id=\"b3\" type=\"text\" aria-label=\"Beat 3\"></label>\n" +
  "        <label for=\"b4\"><input id=\"b4\" type=\"text\" aria-label=\"Beat 4\"></label>\n" +
  "      </div>\n" +
  "      <div class=\"ex\"><p><i>EXAMPLE</i><span>One clear use case per song. Simple, fast, easy to save.</span></p></div>\n" +
  "    </div>\n" +
  "  </section>\n" +
  "\n" +
  "  <section class=\"step\" aria-labelledby=\"s3\">\n" +
  "    <div class=\"step-head\"><span class=\"num\">3</span><h2 id=\"s3\">Put it in your niche</h2></div>\n" +
  "    <p>Same job, totally different video. Try writing 3 versions for your niche.</p>\n" +
  "    <label class=\"f\" for=\"niche\">My niche<input id=\"niche\" type=\"text\" placeholder=\"e.g. fitness for busy moms\"></label>\n" +
  "    <div class=\"beats\">\n" +
  "      <label for=\"n1\"><input id=\"n1\" type=\"text\" aria-label=\"Version 1\"></label>\n" +
  "      <label for=\"n2\"><input id=\"n2\" type=\"text\" aria-label=\"Version 2\"></label>\n" +
  "      <label for=\"n3\"><input id=\"n3\" type=\"text\" aria-label=\"Version 3\"></label>\n" +
  "    </div>\n" +
  "    <div class=\"ex\">\n" +
  "      <p><i>FITNESS</i><span>\"Lower back hurts? Do these. Knees hurt? Do these.\"</span></p>\n" +
  "      <p><i>COOKING</i><span>\"10 minutes? Make this. 30 minutes? Make this.\"</span></p>\n" +
  "    </div>\n" +
  "  </section>\n" +
  "\n" +
  "  <section class=\"step\" aria-labelledby=\"s4\">\n" +
  "    <div class=\"step-head\"><span class=\"num\">4</span><h2 id=\"s4\">Gut check before you film</h2></div>\n" +
  "    <ul class=\"checks\">\n" +
  "      <li><label><input type=\"checkbox\" id=\"g1\"> Does my version still do the same job (my DO answer)?</label></li>\n" +
  "      <li><label><input type=\"checkbox\" id=\"g2\"> Is it my own message inside the structure, not a copy of theirs?</label></li>\n" +
  "      <li><label><input type=\"checkbox\" id=\"g3\"> Did the original go viral because of the idea, not the creator's face, fame or credibility?</label></li>\n" +
  "    </ul>\n" +
  "    <p class=\"next\">That last one is the reason some viral formats flop no matter how well you copy them. In <b>Episode 2</b> I'll show you the 6 levers I use to judge every idea before I film it.</p>\n" +
  "  </section>\n" +
  "\n" +
  "  <section class=\"step\" aria-labelledby=\"s5\">\n" +
  "    <h2 id=\"s5\">Worked example: the self-sabotaging empath</h2>\n" +
  "    <div style=\"overflow-x:auto\">\n" +
  "      <table class=\"worked\">\n" +
  "        <tr><th>DO</th><td>It described a type of person</td></tr>\n" +
  "        <tr><th>WHY</th><td>People want to know if it's them, or someone they know</td></tr>\n" +
  "        <tr><th>HOW</th><td>Name the type → show their contradictions → \"what makes this person…\" → call the name back</td></tr>\n" +
  "        <tr><th>NEW TOPIC</th><td>\"The high agency creator\": same reason underneath, different topic</td></tr>\n" +
  "      </table>\n" +
  "    </div>\n" +
  "  </section>\n" +
  "\n" +
  "  <div id=\"copywrap\" hidden>\n" +
  "    <label class=\"f\" for=\"copybox\">Your answers (select all and copy)</label>\n" +
  "    <textarea id=\"copybox\" readonly></textarea>\n" +
  "  </div>\n" +
  "\n" +
  "  <p class=\"foot\">Creative Mode by Martin Wang. Your answers are saved in this browser only, so use \"Copy my answers\" to keep them somewhere else.</p>\n" +
  "</div>\n" +
  "\n" +
  "<div class=\"bar\">\n" +
  "  <div class=\"bar-in\">\n" +
  "    <span class=\"status\" id=\"status\" aria-live=\"polite\">Your answers save as you type.</span>\n" +
  "    <button class=\"btn\" id=\"reset\" type=\"button\">Start over</button>\n" +
  "    <button class=\"btn primary\" id=\"copy\" type=\"button\">Copy my answers</button>\n" +
  "  </div>\n" +
  "</div>";
