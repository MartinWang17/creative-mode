import { revalidatePath } from "next/cache";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Shell from "@/components/Shell";
import ResourceForm from "@/components/ResourceForm";
import CopyField from "@/components/CopyField";
import { siteUrl } from "@/lib/env";
import { shareKey } from "@/lib/share";
import { hasKit, subscribeToKit, tagCount } from "@/lib/kit";
import { requireAdmin } from "@/lib/members";
import { RESOURCE_COLS, releaseLabel, type Resource } from "@/lib/resources";
import { createAdminClient } from "@/lib/supabase/server";
import { SIZES } from "@/lib/tags";
import { deleteResource, toggleResource } from "./resources/actions";

export const dynamic = "force-dynamic";

type Row = {
  slug: string;
  title: string;
  creator_handle: string | null;
  published: boolean;
  is_free: boolean;
  published_at: string | null;
  format: string | null;
  difficulty: string | null;
  size?: string | null;
  growth?: string | null;
};

const FORMAT_SUGGESTIONS = [
  "Talking head",
  "Talking head with pictures",
  "B-roll with text",
  "Skits",
  "Timer challenge",
  "Storytime",
  "Voiceover",
  "Screen tutorial",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

// Martin's page: upload a breakdown, publish or unpublish it, see member counts.
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ kit?: string; upload?: string; msg?: string; comp?: string; cmsg?: string }> }) {
  const viewer = await requireAdmin();
  const { kit, upload: uploadStatus, msg, comp: compStatus, cmsg } = await searchParams;
  const base = siteUrl(await headers());
  const { data: comps } = await createAdminClient()
    .from("members")
    .select("email, status, current_period_end")
    .eq("plan", "comp")
    .order("current_period_end", { ascending: false });
  const db = createAdminClient();
  const [{ data: taggedBreakdowns }, { data: sizeRows }, { count: active }, { count: total }, { count: waitlist }, { data: resources }, { data: survey }] = await Promise.all([
    db
      .from("breakdowns")
      .select("slug, title, creator_handle, published, is_free, published_at, format, difficulty")
      .order("created_at", { ascending: false }),
    db.from("breakdowns").select("slug, size, growth"),
    db.from("members").select("*", { count: "exact", head: true }).in("status", ["active", "trialing", "past_due"]),
    db.from("members").select("*", { count: "exact", head: true }),
    db.from("waitlist").select("*", { count: "exact", head: true }),
    db.from("resources").select(RESOURCE_COLS).order("sort", { ascending: true }).order("created_at", { ascending: true }),
    db.from("survey_responses").select("id, email, followers, answer, created_at").order("created_at", { ascending: false }).limit(200),
  ]);
  const [kitLaunch, kitFree, kitFormats] = await Promise.all([
    tagCount(process.env.KIT_TAG || "launch-list"),
    tagCount("free-resource"),
    tagCount("formats"),
  ]);
  const surveyMissing = !survey;
  // If the format/difficulty columns aren't added yet, still list breakdowns (without tags).
  const tagsMissing = !taggedBreakdowns;
  const breakdowns = tagsMissing
    ? (
        await db
          .from("breakdowns")
          .select("slug, title, creator_handle, published, is_free, published_at")
          .order("created_at", { ascending: false })
      ).data?.map((b) => ({ ...b, format: null, difficulty: null }))
    : taggedBreakdowns;
  // Size + growth line need two more columns; until they exist, sizeRows is null and the fields stay hidden.
  const sizeMissing = !sizeRows;
  const sizeBySlug = new Map((sizeRows ?? []).map((r) => [r.slug as string, r as { size: string | null; growth: string | null }]));

  async function upload(formData: FormData) {
    "use server";
    await requireAdmin();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const handle = String(formData.get("handle") ?? "").trim().replace(/^@/, "");
    const summary = String(formData.get("summary") ?? "").trim();
    const format = String(formData.get("format") ?? "").trim();
    const difficulty = String(formData.get("difficulty") ?? "");
    const size = String(formData.get("size") ?? "");
    const growth = String(formData.get("growth") ?? "").trim();
    if (!(file instanceof File) || file.size === 0 || !title) {
      redirect("/admin?upload=error&msg=" + encodeURIComponent("Add a title and pick the HTML file, then try again."));
    }
    const slug = (String(formData.get("slug") ?? "") || handle || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const html = stripWrapper(await file.text());
    const db = createAdminClient();
    const base = { slug, title, creator_handle: handle || null, summary: summary || null, html };
    const tags = {
      ...(format ? { format } : {}),
      ...(DIFFICULTIES.includes(difficulty) ? { difficulty } : {}),
    };
    const extra = {
      ...(SIZES.includes(size) ? { size } : {}),
      ...(growth ? { growth } : {}),
    };
    let { error } = await db.from("breakdowns").upsert({ ...base, ...tags, ...extra }, { onConflict: "slug" });
    let note = "";
    if (error && Object.keys(extra).length > 0 && /size|growth/i.test(error.message)) {
      ({ error } = await db.from("breakdowns").upsert({ ...base, ...tags }, { onConflict: "slug" }));
      if (!error) note = " The size tag and growth line weren't saved because their columns are missing (see the note above).";
    }
    if (error && Object.keys(tags).length > 0 && /format|difficulty/i.test(error.message)) {
      // The tag columns haven't been added yet: save the breakdown without tags.
      ({ error } = await db.from("breakdowns").upsert(base, { onConflict: "slug" }));
      if (!error) note = " Tags weren't saved because the format and difficulty columns are missing (see the note above).";
    }
    revalidatePath("/admin");
    revalidatePath("/library");
    if (error) redirect("/admin?upload=error&msg=" + encodeURIComponent(error.message));
    redirect("/admin?upload=ok&msg=" + encodeURIComponent(`Uploaded "${title}" to /library/${slug}.${note}`));
  }

  async function setTags(formData: FormData) {
    "use server";
    await requireAdmin();
    const slug = String(formData.get("slug"));
    const format = String(formData.get("format") ?? "").trim();
    const difficulty = String(formData.get("difficulty") ?? "");
    const size = String(formData.get("size") ?? "");
    const growth = String(formData.get("growth") ?? "").trim();
    const tags = { format: format || null, difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : null };
    const db = createAdminClient();
    const withExtra = formData.has("size")
      ? { ...tags, size: SIZES.includes(size) ? size : null, growth: growth || null }
      : tags;
    const { error } = await db.from("breakdowns").update(withExtra).eq("slug", slug);
    if (error && withExtra !== tags) await db.from("breakdowns").update(tags).eq("slug", slug);
    revalidatePath("/admin");
    revalidatePath("/library");
  }

  // Free membership for a featured creator (or anyone): no Stripe, ends on its own date.
  async function giveComp(formData: FormData) {
    "use server";
    await requireAdmin();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const months = Math.min(Math.max(Number(formData.get("months")) || 12, 1), 60);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      redirect("/admin?comp=error&cmsg=" + encodeURIComponent("That email doesn't look right."));
    }
    const db = createAdminClient();
    const { data: existing } = await db
      .from("members")
      .select("status, stripe_subscription_id")
      .eq("email", email)
      .maybeSingle();
    if (existing?.stripe_subscription_id && ["active", "trialing", "past_due"].includes(existing.status ?? "")) {
      redirect("/admin?comp=error&cmsg=" + encodeURIComponent(`${email} already has a paid membership.`));
    }
    const end = new Date();
    end.setMonth(end.getMonth() + months);
    const { error } = await db
      .from("members")
      .upsert(
        { email, status: "active", plan: "comp", founding: false, current_period_end: end.toISOString() },
        { onConflict: "email" },
      );
    if (error) redirect("/admin?comp=error&cmsg=" + encodeURIComponent(error.message));
    revalidatePath("/admin");
    redirect(
      "/admin?comp=ok&cmsg=" +
        encodeURIComponent(`${email} has free access until ${end.toDateString()}. They log in at /login with that email.`),
    );
  }

  async function endComp(formData: FormData) {
    "use server";
    await requireAdmin();
    const email = String(formData.get("email") ?? "");
    if (!email) return;
    await createAdminClient().from("members").update({ status: "canceled" }).eq("email", email).eq("plan", "comp");
    revalidatePath("/admin");
  }

  async function removeBreakdown(formData: FormData) {
    "use server";
    await requireAdmin();
    const slug = String(formData.get("slug"));
    if (!slug) return;
    await createAdminClient().from("breakdowns").delete().eq("slug", slug);
    revalidatePath("/admin");
    revalidatePath("/library");
  }

  async function toggle(formData: FormData) {
    "use server";
    await requireAdmin();
    const slug = String(formData.get("slug"));
    const field = String(formData.get("field"));
    const value = formData.get("value") === "true";
    if (field !== "published" && field !== "is_free") return;
    const patch: Record<string, unknown> = { [field]: value };
    if (field === "published" && value) patch.published_at = new Date().toISOString();
    await createAdminClient().from("breakdowns").update(patch).eq("slug", slug);
    revalidatePath("/admin");
    revalidatePath("/library");
  }

  // One-off: push everyone on the waitlist table into Kit (tag launch-list + waitlist). Safe to repeat.
  async function sendWaitlistToKit() {
    "use server";
    await requireAdmin();
    const { data } = await createAdminClient().from("waitlist").select("email").order("created_at");
    let ok = 0;
    let failed = 0;
    for (const row of data ?? []) {
      try {
        await subscribeToKit(row.email, ["waitlist"]);
        ok++;
      } catch (err) {
        failed++;
        console.error("kit sync failed", row.email, err);
      }
    }
    redirect(`/admin?kit=${ok}-${failed}`);
  }

  return (
    <Shell viewer={viewer}>
      <div className="pt-10">
        <p className="label text-xs text-birch">Admin</p>
        <h1 className="font-display mt-3 text-6xl sm:text-7xl">Dashboard</h1>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat value={active ?? 0} label="active members" />
        <Stat value={total ?? 0} label="people who ever bought" />
        <Stat value={(breakdowns ?? []).filter((b) => b.published).length} label="breakdowns live" />
        <Stat value={kitLaunch ?? "?"} label="on the launch list in Kit (every free sign-up)" />
        <Stat value={kitFree ?? "?"} label="free breakdown sign-ups (Kit tag free-resource)" />
        <Stat value={kitFormats ?? "?"} label="formats sign-ups (Kit tag formats)" />
        <Stat value={waitlist ?? 0} label="waitlist page sign-ups (site table, not the free resources)" />
        <Stat value={(survey ?? []).length} label="survey answers" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-5">
        <a href="/admin/waitlist" className="label text-[10px] text-birch hover:text-chalk">
          Download waitlist (CSV)
        </a>
        <a href="/admin/survey" className="label text-[10px] text-birch hover:text-chalk">
          Download survey answers (CSV)
        </a>
        {hasKit() && (
          <form action={sendWaitlistToKit}>
            <button type="submit" className="label text-[10px] text-birch hover:text-chalk">
              Send waitlist to Kit
            </button>
          </form>
        )}
        {kit && (
          <p className="label text-[10px] text-chalk/60">
            Sent to Kit: {kit.split("-")[0]} added{Number(kit.split("-")[1]) > 0 ? `, ${kit.split("-")[1]} failed` : ""}
          </p>
        )}
      </div>

      {tagsMissing && (
        <p className="mt-6 border-2 border-oak p-4 text-sm text-chalk/80">
          Format and difficulty tags need two new columns. Run the last two lines of supabase/schema.sql in the
          Supabase SQL editor, then refresh.
        </p>
      )}
      {sizeMissing && (
        <p className="mt-6 border-2 border-oak p-4 text-sm text-chalk/80">
          The &ldquo;where they started&rdquo; tag and the growth line need two new columns. Run the last two lines of
          supabase/schema.sql in the Supabase SQL editor, then refresh.
        </p>
      )}
      <datalist id="formats">
        {FORMAT_SUGGESTIONS.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>

      <section className="mt-14">
        <h2 className="label text-sm">Upload a breakdown</h2>
        {uploadStatus && (
          <p
            className={`mt-4 max-w-2xl border-2 p-4 text-sm ${uploadStatus === "ok" ? "border-birch text-birch" : "border-oak text-chalk"}`}
          >
            {uploadStatus === "ok" ? "Done. " : "Upload failed. "}
            {msg}
          </p>
        )}
        <form action={upload} className="mt-4 grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field name="title" label="Title" placeholder="Nate Gaffney Breakdown" required />
          <Field name="handle" label="Creator handle" placeholder="nategaffney" />
          <Field name="slug" label="URL slug (optional)" placeholder="nategaffney" />
          <Field name="summary" label="One-line summary" placeholder="The rare breed hook behind 60% of his views" />
          <label className="label text-[10px] text-chalk/60">
            Main format
            <input name="format" list="formats" placeholder="Talking head" className={inputCls} />
          </label>
          <label className="label text-[10px] text-chalk/60">
            Difficulty
            <select name="difficulty" defaultValue="" className={inputCls}>
              <option value="">Not set</option>
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="label text-[10px] text-chalk/60">
            Where they started
            <select name="size" defaultValue="" className={inputCls}>
              <option value="">Not set</option>
              {SIZES.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
          </label>
          <Field name="growth" label="Growth line" placeholder="Went from 10K to 910K in 3 months" />
          <label className="label text-[10px] text-chalk/60 sm:col-span-2">
            Report HTML file
            <input
              type="file"
              name="file"
              accept=".html,text/html"
              required
              className="mt-2 block w-full text-sm text-chalk/80 file:mr-4 file:border-2 file:border-oak file:bg-bedrock file:px-4 file:py-2 file:text-chalk"
            />
          </label>
          <button
            type="submit"
            className="label rounded-full border-2 border-chalk px-6 py-4 text-xs text-chalk hover:bg-chalk hover:text-bedrock sm:col-span-2"
          >
            Upload as draft
          </button>
        </form>
      </section>

      <section className="mt-14">
        <h2 className="label text-sm">Breakdowns</h2>
        <ul className="mt-4 divide-y-2 divide-oak border-y-2 border-oak">
          {((breakdowns ?? []) as Row[]).map((b) => (
            <li key={b.slug} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/library/${b.slug}`} className="font-display text-3xl hover:text-birch">
                  {b.title}
                </Link>
                <p className="label mt-1 text-[10px] text-chalk/50">
                  /library/{b.slug}
                  {b.creator_handle ? ` · @${b.creator_handle}` : ""}
                  {b.published ? " · live" : " · draft"}
                  {b.is_free ? " · free" : ""}
                  {b.format ? ` · ${b.format}` : " · no format"}
                  {b.difficulty ? ` · ${b.difficulty}` : ""}
                  {sizeBySlug.get(b.slug)?.size ? ` · ${sizeBySlug.get(b.slug)!.size}` : ""}
                </p>
                <div className="mt-2">
                  <p className="label mb-1 text-[10px] text-chalk/50">Creator gift link (free view, works even as a draft)</p>
                  <CopyField value={`${base}/library/${b.slug}?k=${shareKey(b.slug)}`} />
                </div>
                <form action={setTags} className="mt-2 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="slug" value={b.slug} />
                  <input
                    name="format"
                    list="formats"
                    defaultValue={b.format ?? ""}
                    placeholder="Main format"
                    className="border-2 border-oak bg-bedrock px-2 py-1 text-sm text-chalk outline-none focus:border-birch"
                  />
                  <select
                    name="difficulty"
                    defaultValue={b.difficulty ?? ""}
                    className="border-2 border-oak bg-bedrock px-2 py-1 text-sm text-chalk outline-none focus:border-birch"
                  >
                    <option value="">Difficulty</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  {!sizeMissing && (
                    <>
                      <select
                        name="size"
                        defaultValue={sizeBySlug.get(b.slug)?.size ?? ""}
                        className="border-2 border-oak bg-bedrock px-2 py-1 text-sm text-chalk outline-none focus:border-birch"
                      >
                        <option value="">Where they started</option>
                        {SIZES.map((z) => (
                          <option key={z}>{z}</option>
                        ))}
                      </select>
                      <input
                        name="growth"
                        defaultValue={sizeBySlug.get(b.slug)?.growth ?? ""}
                        placeholder="Went from 10K to 910K in 3 months"
                        className="w-72 max-w-full border-2 border-oak bg-bedrock px-2 py-1 text-sm text-chalk outline-none focus:border-birch"
                      />
                    </>
                  )}
                  <button type="submit" className="label border-2 border-oak px-3 py-1 text-[10px] text-chalk hover:border-birch">
                    Save tags
                  </button>
                </form>
              </div>
              <div className="flex gap-2">
                <Toggle action={toggle} slug={b.slug} field="published" value={!b.published}>
                  {b.published ? "Unpublish" : "Publish"}
                </Toggle>
                <Toggle action={toggle} slug={b.slug} field="is_free" value={!b.is_free}>
                  {b.is_free ? "Make members-only" : "Make free"}
                </Toggle>
                <details className="relative">
                  <summary className="label cursor-pointer list-none border-2 border-oak px-3 py-2 text-[10px] text-chalk/70 hover:border-birch">
                    Delete
                  </summary>
                  <form action={removeBreakdown} className="absolute right-0 z-10 mt-2 w-56 border-2 border-oak bg-bedrock p-3">
                    <input type="hidden" name="slug" value={b.slug} />
                    <p className="text-xs text-chalk/80">Delete this breakdown for good? You can upload it again later.</p>
                    <button type="submit" className="label mt-3 w-full border-2 border-birch bg-forest px-3 py-2 text-[10px] text-birch hover:text-chalk">
                      Yes, delete it
                    </button>
                  </form>
                </details>
              </div>
            </li>
          ))}
          {(breakdowns ?? []).length === 0 && <li className="py-4 text-chalk/60">Nothing uploaded yet.</li>}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="label text-sm">Give a free membership</h2>
        <p className="mt-2 max-w-2xl text-sm text-chalk/70">
          For featured creators or anyone you want to gift. They get full member access with no payment, and it
          ends on its own after the months you pick.
        </p>
        {compStatus && (
          <p className={`mt-4 max-w-2xl border-2 p-4 text-sm ${compStatus === "ok" ? "border-birch text-birch" : "border-oak text-chalk"}`}>
            {compStatus === "ok" ? "Done. " : "Didn't work. "}
            {cmsg}
          </p>
        )}
        <form action={giveComp} className="mt-4 flex max-w-2xl flex-wrap items-end gap-3">
          <label className="label flex-1 text-[10px] text-chalk/60">
            Email
            <input name="email" type="email" required placeholder="creator@email.com" className={inputCls} />
          </label>
          <label className="label w-28 text-[10px] text-chalk/60">
            Months
            <input name="months" type="number" min={1} max={60} defaultValue={12} className={inputCls} />
          </label>
          <button type="submit" className="label border-2 border-birch bg-forest px-4 py-3 text-[10px] text-birch hover:text-chalk">
            Give free access
          </button>
        </form>
        {(comps ?? []).length > 0 && (
          <ul className="mt-4 max-w-2xl divide-y-2 divide-oak border-y-2 border-oak text-sm">
            {(comps ?? []).map((c) => {
              const live = c.status === "active" && c.current_period_end && new Date(c.current_period_end) > new Date();
              return (
                <li key={c.email} className="flex items-center justify-between gap-3 py-2">
                  <span>
                    {c.email}
                    <span className="text-chalk/50">
                      {live ? ` · until ${new Date(c.current_period_end!).toDateString()}` : " · ended"}
                    </span>
                  </span>
                  {live && (
                    <form action={endComp}>
                      <input type="hidden" name="email" value={c.email} />
                      <button type="submit" className="label border-2 border-oak px-3 py-1 text-[10px] text-chalk/70 hover:border-birch">
                        End now
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="label text-sm">Survey answers</h2>
        <p className="mt-2 text-sm text-chalk/60">
          Link for emails: https://www.joincreativemode.com/survey?email=&#123;&#123; subscriber.email_address &#125;&#125;
        </p>
        <ul className="mt-4 divide-y-2 divide-oak border-y-2 border-oak">
          {(survey ?? []).map((r) => (
            <li key={r.id} className="py-4">
              <p className="whitespace-pre-wrap text-chalk/85">{r.answer}</p>
              <p className="label mt-2 text-[10px] text-chalk/50">
                {r.email ?? "no email"}
                {r.followers ? ` · ${r.followers}` : ""}
                {" · "}
                {new Date(r.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </p>
            </li>
          ))}
          {surveyMissing && (
            <li className="py-4 text-red-300">
              The survey table is missing in Supabase, so answers can&apos;t be saved. Run the survey SQL block in Supabase.
            </li>
          )}
          {!surveyMissing && (survey ?? []).length === 0 && <li className="py-4 text-chalk/60">No answers yet.</li>}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="label text-sm">Add a resource</h2>
        <p className="mt-2 max-w-2xl text-sm text-chalk/60">
          Training videos: paste a YouTube (unlisted), Vimeo or Loom link. PDFs and zips: upload the file. Members only
          ever get short-lived links, so files stay private.
        </p>
        <div className="mt-4">
          <ResourceForm />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="label text-sm">Resources</h2>
        <ul className="mt-4 divide-y-2 divide-oak border-y-2 border-oak">
          {((resources ?? []) as Resource[]).map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/resources/${r.slug}`} className="font-display text-3xl hover:text-birch">
                    {r.title}
                  </Link>
                  <p className="label mt-1 text-[10px] text-chalk/50">
                    /resources/{r.slug}
                    {r.published ? " · live" : " · draft"}
                    {r.annual_only ? " · annual only" : " · all members"}
                    {r.available_at ? ` · from ${releaseLabel(r.available_at)} ET` : ""}
                    {r.storage_path ? " · file" : ""}
                    {r.link ? " · link" : ""}
                    {r.cover_path ? " · cover" : " · no cover"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Toggle action={toggleResource} id={r.id} field="published" value={!r.published}>
                    {r.published ? "Unpublish" : "Publish"}
                  </Toggle>
                  <Toggle action={toggleResource} id={r.id} field="annual_only" value={!r.annual_only}>
                    {r.annual_only ? "Open to all members" : "Make annual-only"}
                  </Toggle>
                </div>
              </div>
              <details className="mt-3">
                <summary className="label cursor-pointer text-[10px] text-chalk/60 hover:text-chalk">Edit</summary>
                <div className="mt-4">
                  <ResourceForm
                    existing={{
                      id: r.id,
                      title: r.title,
                      slug: r.slug,
                      blurb: r.blurb ?? "",
                      link: r.link ?? "",
                      annual_only: r.annual_only,
                      sort: r.sort,
                      available_local: toLocalInput(r.available_at),
                    }}
                  />
                  <form action={deleteResource} className="mt-4">
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="label text-[10px] text-red-300 hover:text-red-200">
                      Delete this resource and its files
                    </button>
                  </form>
                </div>
              </details>
            </li>
          ))}
          {(resources ?? []).length === 0 && <li className="py-4 text-chalk/60">No resources yet.</li>}
        </ul>
      </section>
    </Shell>
  );
}

// Reports exported from the artifact tool start with a wrapper line; keep only the page.
function stripWrapper(html: string) {
  const i = html.search(/<(title|style|meta|link|div|section|main|header)[\s>]/i);
  return i > 0 && !/<!doctype|<html/i.test(html.slice(0, i)) ? html.slice(i) : html;
}

// ISO -> "2026-12-11T09:00" in Eastern time, for the datetime-local box.
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

const inputCls =
  "mt-2 block w-full border-2 border-oak bg-bedrock px-3 py-2 font-sans text-base normal-case tracking-normal text-chalk outline-none focus:border-birch";

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="bg-forest p-6">
      <p className="font-display text-6xl leading-none text-birch">{value}</p>
      <p className="mt-2 text-sm text-chalk/80">{label}</p>
    </div>
  );
}

function Field(props: { name: string; label: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="label text-[10px] text-chalk/60">
      {props.label}
      <input
        name={props.name}
        placeholder={props.placeholder}
        required={props.required}
        className="mt-2 block w-full border-2 border-oak bg-bedrock px-3 py-2 font-sans text-base normal-case tracking-normal text-chalk outline-none focus:border-birch"
      />
    </label>
  );
}

function Toggle({
  action,
  slug,
  id,
  field,
  value,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  slug?: string;
  id?: string;
  field: string;
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      {slug && <input type="hidden" name="slug" value={slug} />}
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(value)} />
      <button type="submit" className="label border-2 border-oak px-3 py-2 text-[10px] text-chalk hover:border-birch">
        {children}
      </button>
    </form>
  );
}
