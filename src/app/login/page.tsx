import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Shell from "@/components/Shell";
import { hasSupabase, siteUrl } from "@/lib/env";
import { createAuthClient } from "@/lib/supabase/server";

type Search = Promise<{ next?: string; sent?: string; error?: string; why?: string }>;

// Email magic link login. No passwords.
export default async function LoginPage({ searchParams }: { searchParams: Search }) {
  const { next = "/library", sent, error, why } = await searchParams;

  async function sendLink(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const nextPath = String(formData.get("next") ?? "/library");
    if (!email || !hasSupabase()) redirect(`/login?error=email`);
    const base = siteUrl(await headers());
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${base}/auth/confirm?next=${encodeURIComponent(nextPath)}` },
    });
    if (error) {
      console.error("signInWithOtp failed", error.status, error.code, error.message);
      redirect(`/login?error=send&why=${encodeURIComponent(error.message.slice(0, 160))}`);
    }
    redirect(`/login?sent=1`);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md pt-16">
        <p className="label text-xs text-birch">Members</p>
        <h1 className="font-display mt-3 text-6xl">Log in</h1>
        {sent ? (
          <p className="mt-6 text-chalk/80">
            Check your email. The link in it logs you in. If you don&apos;t see it in a minute, look
            in spam.
          </p>
        ) : (
          <form action={sendLink} className="mt-8 flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />
            <label className="label text-[10px] text-chalk/60" htmlFor="email">
              Email you bought with
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border-2 border-oak bg-bedrock px-4 py-3 text-chalk outline-none focus:border-birch"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              className="label rounded-full border-2 border-chalk px-6 py-4 text-xs text-chalk hover:bg-chalk hover:text-bedrock"
            >
              Email me a login link
            </button>
            {error && (
              <p className="text-sm text-birch">
                {error === "link"
                  ? "That link has expired. Request a new one."
                  : "Couldn't send the link. Check the email and try again."}
                {why && <span className="mt-1 block text-xs text-chalk/50">Reason: {why}</span>}
              </p>
            )}
            {!hasSupabase() && (
              <p className="text-sm text-chalk/50">Login isn&apos;t set up yet.</p>
            )}
          </form>
        )}
      </div>
    </Shell>
  );
}
