// Markup for the breakdowns page, ported from the approved preview. Plain HTML so it matches the preview exactly.
// Styles: src/app/landing.css. Motion: src/components/LandingFx.tsx.
export const breakdownsHtml = `<div class="wrap topbar">
  <a class="home" href="/"><span class="c">CREATIVE</span> <span class="m">MODE</span></a>
  <a class="pricing label" href="#pricing" data-scroll>Pricing</a>
</div>

<section class="cbhero">
  <div class="wrap">
    <div class="grid">
      <div>
        <span class="cb" id="cb" aria-label="Creator Breakdowns">
          <span class="creator">Creator</span>
          <span class="bd" id="bd" aria-hidden="true"></span>
        </span>
        <p class="label tagline" style="margin-top:14px">A weekly membership · 4 breakdowns a month</p>
        <h1>Turn any viral video into <em>your next Reel.</em></h1>
        <p class="lead">I find what's working, I break down exactly why it went viral, and I give you a step by step to use it in your next Reel. So you're never copying. You're using what worked and <b>making it your own.</b></p>
        <div class="cta">
          <!--open--><a class="pill solid plain" href="#pricing" data-scroll><span class="sq"></span><span>Join now</span><span aria-hidden="true">→</span></a>
          <span class="ends">30-day guarantee</span><!--/open-->
          <!--closed--><a class="pill solid plain" href="#waitlist" data-scroll><span class="sq"></span><span>Join the waitlist</span><span aria-hidden="true">→</span></a>
          <span class="ends">Until the next launch</span><!--/closed-->
        </div>
      </div>
      <div class="side">
      <aside class="cred" aria-label="Who's behind this">
        <div class="who"><span class="label eyebrow">Built by Martin Wang</span><a href="https://www.instagram.com/martinwang.mp4/" target="_blank" rel="noreferrer">@martinwang.mp4</a></div>
        <div class="st">
          <div><b>200K</b><small>followers in 45 days, after a 6-month plateau</small></div>
          <div><b>8 / 11</b><small>Reels went viral on a brand-new account</small></div>
          <div><b>500M+</b><small>views across my videos</small></div>
        </div>
        <p class="q">Everything I know about growing on Instagram came from breaking down other creators, not from a course. This is that process, done for you every week.</p>
      </aside>
        <!--open--><div class="doors" role="note"><span class="label">Doors close</span><b>Sun Dec 13 · 11:59pm ET</b><span class="sub">After that, nobody can join until the next launch. And I don't know when that is yet lol.</span></div><!--/open-->
        <!--closed--><div class="doors shut" role="note"><span class="label">Doors are closed</span><b>Closed Dec 13</b><span class="sub">Nobody can join until the next launch. And I don't know when that is yet lol.</span></div><!--/closed-->
      </div>
    </div>
  </div>
</section>

<section class="band story">
  <div class="wrap">
    <div class="pains">
      <p class="label eyebrow">Sound familiar?</p>
      <div class="pain-list">
        <p>You&rsquo;re stuck at <em>200 views.</em></p>
        <p>You&rsquo;re posting every day and <em>nothing works.</em></p>
        <p>You don&rsquo;t know <em>what to post.</em></p>
      </div>
      <p class="pain-note">Those came up again and again when 140 of my followers told me their top questions. I&rsquo;ve been there too.</p>
    </div>
    <p class="label eyebrow">Why this exists</p>
    <div class="story-copy">
      <div class="say">
      <p class="big-line">I spent $5,000 on courses learning hooks, storytelling and filming. I was still stuck at 2,000 views.</p>
      <p class="big-line">Those skills make you <em>competitive.</em> They don't make you go <em>viral.</em></p>
      </div>
      <div class="tell">
      <p>What does? Noticing the patterns audiences are resonating with right now, and breaking them down.</p>
      <p>Nate Gaffney never talks about the news. He found a pattern: videos describing a &ldquo;rare breed&rdquo; of person his viewers identify with. That one pattern helped him grow past 900k followers, and it works in any niche.</p>
      <p>Once I started spotting patterns like that, I gained <b>200k followers in 45 days.</b></p>
      <p class="pull">Creator Breakdown finds these patterns first, shows you why they work, and gives you the step by step to use them in your own niche.</p>
      </div>
    </div>
  </div>
</section>
<section class="scene" id="scene-promise" data-label="The promise">
  <div class="stick">
    <div class="wrap">
      <p class="step label"></p>
      <div class="lines" aria-live="polite"></div>
    </div>
    <p class="hint label">Scroll</p>
  </div>
</section>

<section class="spillband" aria-label="Every week">
  <div class="wrap">
    <div class="spill" id="spill">
      <div class="spill-pill" id="spill-pill"><div class="spill-in"><p>A <b>different niche, a different style and a different strategy every single week.</b> You get the numbers, the outlier Reels, the hook pattern behind most of their views, and the AI Script Button so you can turn it into your own Reel that night. No course, no theory: what's working right now, and why.</p></div></div>
    </div>
  </div>
</section>

<section class="band proof">
  <div class="wrap">
    <p class="label eyebrow">Proof</p>
    <h2 class="big">One creator's strategy, applied to my own account.</h2>
    <p class="lead">I broke down one creator in a completely different niche from mine, pulled out the pattern behind his best Reels, and ran it on my account. The before was taken on <b style="color:var(--chalk);font-weight:500">September 20</b>. The after on <b style="color:var(--chalk);font-weight:500">October 27</b>.</p>
    <div class="ba">
      <figure class="shot before"><img src="/landing/before.jpg" alt="Martin Wang's Instagram profile at 50K followers" width="760" height="446"><figcaption class="tag label">Before · Sept 20 · 50K</figcaption></figure>
      <figure class="shot after"><img src="/landing/after.jpg" alt="Martin Wang's Instagram profile at 167K followers" width="760" height="301"><figcaption class="tag label">After · Oct 27 · 167K</figcaption></figure>
    </div>
    <div class="stats">
      <div class="stat"><b>+117K</b><small>followers gained</small></div>
      <div class="stat"><b>3.3x</b><small>the account size</small></div>
      <div class="stat"><b>1</b><small>creator's strategy, from a different niche</small></div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <p class="label eyebrow">Every week is different</p>
    <h2 class="big">A different niche, a different style, a different strategy. Every single week.</h2>
    <p class="lead">The best strategies rarely come from your own niche. They come from a corner of the industry you'd never think to look at. Every week, Creator Breakdowns brings you one of those.</p>
    <div class="niche">
      <div class="ncard">
        <p class="label eyebrow">What happened to me</p>
        <div class="from"><span>His niche</span><i>→</i><span class="to">Mine</span></div>
        <h3>I broke down @nategaffney. He's in a completely different niche from me.</h3>
        <p>I took his hook pattern, the one that made 60% of his views, brought it into my own account and my own topics, and it blew up. 50K to 167K followers in a few weeks. That's the before and after above.</p>
        <p class="res">Strategy from another niche. Applied to mine. Blew up.</p>
      </div>
      <div class="ncard">
        <p class="label eyebrow">What happened to them</p>
        <div class="from"><span>Gaming edits</span><i>→</i><span class="to">Finance</span></div>
        <h3>@thekumarmethod blew up in finance with a strategy from video-game editing.</h3>
        <p>Their videos are finance. Their editing style isn't. They took the way gaming editors cut and pace their videos and dropped it into a niche where nobody was doing it. That's what made it so unique, and that's why it worked.</p>
        <p class="res">Strategy from another niche. Applied to theirs. Blew up.</p>
      </div>
    </div>
    <div class="weekly">
      <p><b>That's exactly what you get from Creator Breakdowns:</b> a brand-new, fresh strategy from another part of the industry, every single week, broken down to the point where you can apply it to your own account.</p>
      <a class="pill label" href="#pricing" data-scroll><span class="sq"></span><span>See pricing</span><span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<section class="band swap">
  <div class="wrap">
    <p class="label eyebrow">The method</p>
    <h2 class="big">SWAP: swap your own story into a format that's already proven.</h2>
    <p class="lead">Every breakdown runs on the same four steps. You learn them once in the free training, then practise them on a new creator every week.</p>
    <div class="steps4">
      <div class="s4"><span class="k">S</span><h3>Spot it</h3><p>Find the Reels that did 10x or more of the creator's usual views. Check them against the 6 levers that make a video worth using. If it doesn't hit them, skip it.</p></div>
      <div class="s4"><span class="k">W</span><h3>Why it worked</h3><p>Find the deeper psychological reason it went viral. This is the part most people skip, and it's exactly why I break down whole accounts to spot the patterns.</p></div>
      <div class="s4"><span class="k">A</span><h3>Adapt the structure</h3><p>Keep the hook, the format and the order. Not the video.</p></div>
      <div class="s4"><span class="k">P</span><h3>Put yourself in</h3><p>Your own story, your niche, your face. Because you know why it worked, you can change everything else and keep what matters. That's why it's never copying.</p></div>
    </div>
  </div>
</section>
<section class="band flopped">
  <div class="wrap">
    <p class="label eyebrow">But I already tried that</p>
    <h2 class="big">Tried copying viral videos and they flopped?</h2>
    <div class="flop-copy">
      <p class="big-line">That&rsquo;s because you copied the <em>WHAT</em> without the <em>WHY.</em></p>
      <p class="pull">Better hooks make it easier to catch fish. But if you&rsquo;re fishing in an empty lake, it doesn&rsquo;t matter how good your hook is. You have to know where the fish are. That&rsquo;s exactly what Creator Breakdowns solves.</p>
    </div>
  </div>
</section>
<section class="band">
  <div class="wrap">
    <p class="label eyebrow">Straight up</p>
    <h2 class="big">What this is. What this isn't.</h2>
    <div class="notis">
      <div class="ni"><p class="n">This is NOT teaching you about branding.</p><p class="y">This IS teaching you how to take any viral format or concept that's working for someone else and make it go viral for you. That's how you get lots of attention for your brand.</p></div>
      <div class="ni"><p class="n">This is NOT a course teaching you how to write hooks and storytelling.</p><p class="y">This IS giving you the step by step process behind how to make each viral concept your own, and the underlying psychology of why it went viral.</p></div>
      <div class="ni"><p class="n">This is NOT promising you money.</p><p class="y">This IS showing you exactly how I've been able to go viral 8 out of 11 times on a new account and grow 200k followers in 45 days.</p></div>
      <div class="ni"><p class="n">This is NOT an “easy way out”.</p><p class="y">This DOES take some work, but it really works. I was stuck at a plateau for 6 months. Then I started doing this, and for the same 1 hour a day of effort I grew 200k followers in 45 days.</p></div>
      <div class="ni"><p class="n">This is NOT about monetization, brand deals or editing.</p><p class="y">This IS about the part that comes before all of that: knowing what to post so people actually watch, share and follow.</p></div>
    </div>
  </div>
</section>

<section class="band peek">
  <div class="wrap">
    <p class="label eyebrow">Peek inside</p>
    <h2 class="big">This is what a breakdown looks like.</h2>
    <p class="lead">Ten pages from the Nate Gaffney breakdown, the one I used to grow my own account. The numbers, the charts, and the subtle things he does that nobody else noticed. Every Reel it quotes links to the Reel, and you can read the whole thing free right now.</p>
    <div class="pages">
      <figure class="page"><img src="/landing/nate-story.jpg" alt="1 · The story (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">1 · The story</figcaption></figure>
      <figure class="page"><img src="/landing/nate-stat.jpg" alt="2 · The surprising stat (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">2 · The surprising stat</figcaption></figure>
      <figure class="page"><img src="/landing/nate-scale.jpg" alt="3 · All 100 Reels, flop to 42.8x (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">3 · All 100 Reels, flop to 42.8x</figcaption></figure>
      <figure class="page"><img src="/landing/nate-hook.jpg" alt="4 · The hook (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">4 · The hook</figcaption></figure>
      <figure class="page"><img src="/landing/nate-sp1.jpg" alt="5 · Subtle pattern 1: virtue + mischief (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">5 · Subtle pattern 1: virtue + mischief</figcaption></figure>
      <figure class="page"><img src="/landing/nate-sp2.jpg" alt="6 · Subtle pattern 2: the job-title comparison (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">6 · Subtle pattern 2: the job-title comparison</figcaption></figure>
      <figure class="page"><img src="/landing/nate-sp3.jpg" alt="7 · Subtle pattern 3: same trait, new partner, 32x (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">7 · Subtle pattern 3: same trait, new partner, 32x</figcaption></figure>
      <figure class="page"><img src="/landing/nate-sp4.jpg" alt="8 · Subtle pattern 4: he re-shoots winners (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">8 · Subtle pattern 4: he re-shoots winners</figcaption></figure>
      <figure class="page"><img src="/landing/nate-pillars.jpg" alt="9 · Where the views come from (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">9 · Where the views come from</figcaption></figure>
      <figure class="page"><img src="/landing/nate-funnel.jpg" alt="10 · Strangers at the top, creators at the bottom (page from the Nate Gaffney breakdown)" width="1140" height="855" loading="lazy"><figcaption class="label">10 · Strangers at the top, creators at the bottom</figcaption></figure>
    </div>
    <p class="note">The full breakdown also covers the exact video that split his account in two, his best format in one line, the AI Script Button, and all 100 Reels in a sortable table.</p>
    <a class="pill label" href="/free-resource" style="margin-top:22px"><span class="sq"></span><span>Read the Nate breakdown free</span><span aria-hidden="true">→</span></a>
  </div>
</section>

<section class="band course-band">
  <div class="wrap">
    <p class="label eyebrow">Why this isn't a course</p>
    <h2 class="big">I bought two courses. Over $5,000. I still had 44 followers.</h2>
    <div class="course">
      <figure class="shot"><img src="/landing/start.jpg" alt="Martin Wang's Instagram profile when he started: 35 posts, 44 followers" width="760" height="511"><figcaption class="tag label">35 posts in · 44 followers</figcaption></figure>
      <div class="copy">
        <p>This is my account after my first 35 posts. By then I had already paid for two courses that cost me over $5,000 combined, and I still hadn't learned anything I could use.</p>
        <p>Everything was <b>prerecorded</b>. Prerecorded means generic advice that won't stay up to date: just the fundamentals, the same ones you can find anywhere else for free.</p>
        <p>What actually worked was <b>breaking down other creators and watching their strategy in real time.</b> What's working for them right now is probably what's going to work for the next few months at least. I could take their strategy, study what was working, and study <b>why</b> they were doing what they were doing.</p>
        <div class="pull">You don't need a course. Every creator's lessons are already in their content.</div>
        <p>So that's what this is. I break down the creators, I explain why they're doing what they're doing, and you learn at the same time as you find out the best strategies from the best people in the industry.</p>
        <div class="receipts">
          <div><b>$5K+</b><small>on two courses. Nothing to show for it</small></div>
          <div><b>44</b><small>followers after 35 posts</small></div>
          <div><b>167K</b><small>once I started breaking creators down</small></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!--open--><section class="scene price" id="scene-price" data-label="The price" style="--h:360vh">
  <div class="stick">
    <div class="wrap">
      <p class="label eyebrow">Okay but</p>
      <h2 class="omg-h">OMG this sounds SO good ✨ But how much is this going to cost?</h2>
      <p class="lead" style="margin:-14px 0 26px">I want this to be accessible to everyone.</p>
      <p class="step label"></p>
      <div class="lines" aria-live="polite"></div>
    </div>
    <p class="hint label">Scroll</p>
  </div>
</section><!--/open-->
<!--open--><section class="bigmac">
  <div class="wrap">
    <p class="lead">$19.99 a month for four breakdowns. Here's what that actually is.</p>
    <div class="grid">
      <div class="tile"><b>1.5</b><span>Big Mac meals. That's the whole month.</span></div>
      <div class="tile"><b>$5</b><span>per breakdown. Literally.</span></div>
      <div class="tile"><b>1 day</b><span>a week without Starbucks and you can afford this.</span></div>
    </div>
  </div>
</section><!--/open-->

<section class="band" id="pricing">
  <div class="wrap">
    <p class="label eyebrow">Here's the math</p>
    <h2 class="big">Add it all up.</h2>
    <div class="sheet">
      <div class="grp">
        <p class="label eyebrow">The core: a new creator decoded every week</p>
        <div class="row"><span>4 creator breakdowns a month: what went viral, why it went viral, and a step by step to use it in your next Reel</span><span>$267 a year</span></div>
        <div class="row"><span>The AI Script Button in every breakdown. You bring your idea and rough points; it helps you make them stronger using that creator's best scripts</span><span>Included</span></div>
        <div class="row"><span>The full library, tagged by difficulty and by each creator's main format, so you find the ones you can actually film</span><span>Included</span></div>
      </div>
      <!--open--><div class="grp">
        <p class="label eyebrow">Founding bonuses · every launch buyer</p>
        <div class="row"><span><b>Bonus 1: The Founding Library.</b> 4 creators already decoded, unlocked on day one</span><span>$97</span></div>
        <div class="row"><span><b>Bonus 2: Your First Viral Reel in 7 Days.</b> The training, the 7-day checklist, the Spot It Yourself guide, and the Viral Idea Scorecard to score any idea before you film it</span><span>$47</span></div>
        <div class="row"><span>Founding price locked for life ($197 a year instead of $267)</span><span>$70 a year, every year</span></div>
      </div>
      <div class="grp">
        <p class="label eyebrow">Annual only · gone when doors close</p>
        <div class="row new"><span><b>Bonus 3: The 50 Hooks Behind Millions of Views.</b> Each hook with its views and outlier score</span><span>$97</span></div>
        <div class="row new"><span><b>Bonus 4: The Trial Reels Playbook.</b> 10x a Reel before your followers ever see it: write 2 hooks, test both as Trial Reels, repost the winner</span><span>$97</span></div>
        %%SCRIPT_PACK_ROW%%
      </div>
      <div class="total"><span>Total value on annual</span><span>$605+</span></div>
      <div class="today">
        <div><p class="label eyebrow">Founding price</p><p class="t" style="margin:8px 0 0">Today's price</p><p class="off">All of it for <em>$19.99 a month</em>. Or <em>$197 a year</em> and Bonus 3 and Bonus 4 are yours too.</p></div>
        <p class="p" style="margin:0">$19.99<small>/month</small><span class="yr">or $197/year</span></p>
      </div><!--/open-->
      <!--closed--><div class="today">
        <div><p class="label eyebrow">Next launch</p><p class="t" style="margin:8px 0 0">Doors are closed</p><p class="off">When doors open again it's <em>$26.99 a month</em> or <em>$267 a year</em>. The waitlist hears first.</p></div>
        <p class="p" style="margin:0">$26.99<small>/month</small><span class="yr">or $267/year</span></p>
      </div><!--/closed-->
    </div>
    <!--closed--><a class="pill label solid" href="#waitlist" data-scroll style="margin-top:30px"><span class="sq"></span><span>Join the waitlist</span><span aria-hidden="true">→</span></a><!--/closed-->
    <!--open--><div class="doors wide" role="note"><span class="label">Doors close</span><b>Sun Dec 13 · 11:59pm ET</b><span class="sub">After that, nobody can join until the next launch. And I don't know when that is yet lol.</span></div>
    <div class="plans">
      <div class="plan best">
        <span class="best-tag label">Best deal</span>
        <p class="label">Annual</p>
        <p class="price">$197<small>/year</small></p>
        <p class="was">$267/year next launch</p>
        <p class="lock">Founding price, locked for life</p>
        <p class="bonus">Includes both annual-only bonuses: The 50 Hooks Behind Millions of Views and The Trial Reels Playbook.%%SCRIPT_PACK_CARD%%</p>
        <p class="newyear"><b>Start 2027 with a system.</b> It took me a full year of showing up, most of it stuck at 44 followers, before my account finally took off. The best gift you can give yourself is a year of turning what's working into your own Reels. One year, one price, one year of consistency.</p>
        %%PLAN_ANNUAL%%
      </div>
      <div class="plan">
        <p class="label">Monthly</p>
        <p class="price">$19.99<small>/month</small></p>
        <p class="was">$26.99/month next launch</p>
        <p class="lock">Founding price, locked for life</p>
        <p class="bonus">Cancel anytime from your account page. Bonuses 1 and 2 included. Bonuses 3 and 4 are annual only.</p>
        %%PLAN_MONTHLY%%
      </div>
    </div><!--/open-->
    <div class="guar">
      <div class="seal">30<small>days</small></div>
      <div>
        <h3>The I-Gotchu Guarantee.</h3>
        <p><b>Read 4 breakdowns and try it. If for any reason you don't like it, ask for a refund within 30 days and we'll handle it for you.</b> Monthly or annual. You risk nothing except 30 minutes a week.</p>
      </div>
    </div>
  </div>
</section>

<!--open--><section class="deadline">
  <div class="wrap">
    <p class="label eyebrow">Read this part twice</p>
    <h2 class="shout">Doors close Sunday, December 13.</h2>
    <p class="time">11:59pm Eastern.</p>
    <p class="when">After that, nobody can join until the next launch. And I don't know when that is yet lol.</p>
    <div class="count" id="count" aria-label="Time left until doors close">
      <div><b data-u="d">0</b><small>days</small></div>
      <div><b data-u="h">0</b><small>hours</small></div>
      <div><b data-u="m">0</b><small>minutes</small></div>
      <div><b data-u="s">0</b><small>seconds</small></div>
    </div>
    <p class="after">Whoever joins before then keeps $19.99 a month or $197 a year for as long as they stay a member. The next launch will be $26.99 a month or $267 a year.</p>
  </div>
</section><!--/open-->
<!--closed--><section class="deadline" id="waitlist">
  <div class="wrap">
    <p class="label eyebrow">Doors are closed</p>
    <h2>Join the waitlist for the next launch.</h2>
    <p class="when">Doors closed on December 13. I don't know when the next launch is yet, so the waitlist is how you hear first.</p>
    <form action="/api/waitlist" method="post" class="wl-form">
      <input type="email" name="email" required placeholder="you@email.com" aria-label="Email">
      <button type="submit" class="pill label solid"><span class="sq"></span><span>Join the waitlist</span><span aria-hidden="true">→</span></button>
    </form>
    %%WL_NOTE%%
  </div>
</section><!--/closed-->

<section class="band">
  <div class="wrap">
    <p class="label eyebrow">Be honest with yourself</p>
    <h2 class="big">Read this before you buy.</h2>
    <div class="fit">
      <div class="yes">
        <p class="label eyebrow">This is for you if</p>
        <ul>
          <li><i></i>You're building a personal brand on Instagram and want to know what actually makes Reels blow up</li>
          <li><i></i>You post, or you're about to, and you're tired of guessing at hooks and topics</li>
          <li><i></i>You'd rather study proof than opinions. Every claim here comes with numbers and links</li>
          <li><i></i>You can give it 30 minutes a week to read and one night to apply</li>
          <li><i></i>You're at 0, 10K or 100K. The patterns scale</li>
        </ul>
      </div>
      <div class="no">
        <p class="label">This is not for you if</p>
        <ul>
          <li><i></i>You want someone to post for you</li>
          <li><i></i>You're looking for a growth hack or a loophole</li>
          <li><i></i>You expect results without posting consistently</li>
          <li><i></i>You want to copy a creator instead of learning the pattern behind them</li>
          <li><i></i>You're after editing or camera lessons. This is strategy</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <h2 class="big" style="margin-top:0">Questions</h2>
    <div class="faq">
      <details><summary><span>Who is this for?</span><i>+</i></summary><p>Creators building a personal brand on Instagram. Mostly beginners and intermediates, plus advanced creators with 100K+ followers who want fresh patterns to test.</p></details>
      <details><summary><span>How long does a breakdown take to read?</span><i>+</i></summary><p>About 30 minutes, including the step by step at the end.</p></details>
      <details><summary><span>Which creators do you break down?</span><i>+</i></summary><p>A different niche, style and strategy every week, on purpose. Fitness one week, finance the next, then comedy, then a niche you've never heard of. The best strategies usually come from outside your own corner, and I pick creators whose Reels are outperforming their own average so the pattern is real. Members vote on the Creator of the Month.</p></details>
      <details><summary><span>Does the AI write my scripts?</span><i>+</i></summary><p>No, on purpose. You come up with the idea and the rough points, because you know yourself and your audience better than any AI. The AI Script Button helps you make them stronger: sharper hooks, tighter wording, line notes, all based on that creator's best scripts.</p></details>
      <details><summary><span>What's in Your First Viral Reel in 7 Days?</span><i>+</i></summary><p>A short training that takes one breakdown and turns it into a Reel start to finish, a 7-day checklist, the Spot It Yourself guide, and the Viral Idea Scorecard. Every launch buyer gets it, monthly or annual.</p></details>
      <details><summary><span>What do annual members get?</span><i>+</i></summary><p>The 50 Hooks Behind Millions of Views (each hook with its views and outlier score) and The Trial Reels Playbook (how I test 2 hooks with Trial Reels before my followers ever see the video). Both are annual only and go away when doors close.</p></details>
      <details><summary><span>Do I get a say in who gets broken down?</span><i>+</i></summary><p>Yes. Members vote on a Creator of the Month, and that creator gets broken down at the end of the month.</p></details>
      %%SCRIPT_PACK_FAQ%%
      <details><summary><span>Is it just Instagram?</span><i>+</i></summary><p>The data comes from Instagram Reels. The hook, topic and format patterns carry to TikTok and Shorts.</p></details>
      <details><summary><span>Can I cancel?</span><i>+</i></summary><p>Anytime, from your account page. No emails, no calls. You keep access until the end of the period you paid for.</p></details>
      <details><summary><span>Is there a guarantee?</span><i>+</i></summary><p>Yes, the I-Gotchu Guarantee. Read 4 breakdowns and try it. If for any reason you don't like it, ask for a refund within 30 days and we'll handle it for you, on monthly or annual.</p></details>
      <!--open--><details><summary><span>Does the founding price really stay the same?</span><i>+</i></summary><p>Yes. Join before doors close and you pay $19.99 a month or $197 a year for as long as you stay a member, even when the next launch is priced higher.</p></details><!--/open-->
      <!--closed--><details><summary><span>When do doors open again?</span><i>+</i></summary><p>There's no date yet. Join the waitlist and you'll hear first.</p></details><!--/closed-->
    </div>
  </div>
</section>

<section class="cta-final">
  <div class="wrap">
    <!--open--><div class="doors wide" role="note"><span class="label">Doors close</span><b>Sun Dec 13 · 11:59pm ET</b><span class="sub">After that, nobody can join until the next launch. And I don't know when that is yet lol.</span></div>
    <h2 class="big" style="margin-top:34px">Four breakdowns a month. $5 each.</h2>
    <p class="lead">A fresh strategy from a different niche every week. Lock in the founding price before doors close.</p>
    <a class="pill label solid" href="#pricing" data-scroll style="margin-top:30px"><span class="sq"></span><span>Join now</span><span aria-hidden="true">→</span></a><!--/open-->
    <!--closed--><p class="label eyebrow">Doors are closed</p>
    <h2 class="big">Four breakdowns a month.</h2>
    <p class="lead">A fresh strategy from a different niche every week. Join the waitlist and you'll hear first when doors open again.</p>
    <a class="pill label solid" href="#waitlist" data-scroll style="margin-top:30px"><span class="sq"></span><span>Join the waitlist</span><span aria-hidden="true">→</span></a><!--/closed-->
  </div>
</section>

<footer><div class="wrap"><span>© 2026 Creative Mode</span><span>Creators featured are not affiliated with or endorsed by Creative Mode. Breakdowns describe what I observed in their public content.</span><span class="legal"><a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a></span></div></footer>
`;
