import { cookies } from "next/headers";

// The survey question, shown under the "you're on the list" message on the waitlist page.
// Optional, never gates anything. The email they just used comes from a
// short-lived httpOnly cookie set at sign-up (never put in the URL).
export const SIGNUP_EMAIL_COOKIE = "cm_email";

export default async function InlineSurvey({ back, done }: { back: string; done: boolean }) {
  if (done) {
    return (
      <div className="inline-survey" id="survey">
        <h1>Got it. Thank you.</h1>
        <p className="wl-note muted">I read every one of these. Your answers decide what I break down next.</p>
      </div>
    );
  }
  const email = (await cookies()).get(SIGNUP_EMAIL_COOKIE)?.value ?? "";
  return (
    <div className="inline-survey" id="survey">
      <p className="label eyebrow">Creator Breakdowns · doors open Tue Dec 8</p>
      <h1>ONE LAST THING</h1>
      <p className="when">You&apos;re on the list! But...</p>
      <p className="iq">
        I&apos;m building something <em>FOR you</em>, so let me know your top 2 questions about getting your Reels to go
        viral and growing a following.
      </p>
      <form action="/api/survey" method="post" className="survey">
        <input type="hidden" name="back" value={back} />
        <label className="label">
          Your top 2 questions
          <textarea name="answer" required minLength={10} rows={5} placeholder={"1. …\n2. …"} />
        </label>
        {email ? (
          <input type="hidden" name="email" value={email} />
        ) : (
          <label className="label">
            Email (optional)
            <input type="email" name="email" placeholder="you@email.com" />
          </label>
        )}
        <button type="submit" className="pill label solid">
          <span className="sq"></span>
          <span>Send my answers</span>
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
