import { revalidatePath } from "next/cache";
import Link from "next/link";
import Shell from "@/components/Shell";
import { requireAdmin } from "@/lib/members";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Row = {
  slug: string;
  title: string;
  creator_handle: string | null;
  published: boolean;
  is_free: boolean;
  published_at: string | null;
};

// Martin's page: upload a breakdown, publish or unpublish it, see member counts.
export default async function AdminPage() {
  const viewer = await requireAdmin();
  const db = createAdminClient();
  const [{ data: breakdowns }, { count: active }, { count: total }] = await Promise.all([
    db
      .from("breakdowns")
      .select("slug, title, creator_handle, published, is_free, published_at")
      .order("created_at", { ascending: false }),
    db.from("members").select("*", { count: "exact", head: true }).in("status", ["active", "trialing", "past_due"]),
    db.from("members").select("*", { count: "exact", head: true }),
  ]);

  async function upload(formData: FormData) {
    "use server";
    await requireAdmin();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const handle = String(formData.get("handle") ?? "").trim().replace(/^@/, "");
    const summary = String(formData.get("summary") ?? "").trim();
    if (!(file instanceof File) || !title) return;
    const slug = (String(formData.get("slug") ?? "") || handle || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const html = stripWrapper(await file.text());
    await createAdminClient()
      .from("breakdowns")
      .upsert(
        { slug, title, creator_handle: handle || null, summary: summary || null, html },
        { onConflict: "slug" },
      );
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

  return (
    <Shell viewer={viewer}>
      <div className="pt-10">
        <p className="label text-xs text-birch">Admin</p>
        <h1 className="font-display mt-3 text-6xl sm:text-7xl">Dashboard</h1>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat value={active ?? 0} label="active members" />
        <Stat value={total ?? 0} label="people who ever bought" />
        <Stat value={(breakdowns ?? []).filter((b) => b.published).length} label="breakdowns live" />
      </div>

      <section className="mt-14">
        <h2 className="label text-sm">Upload a breakdown</h2>
        <form action={upload} className="mt-4 grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field name="title" label="Title" placeholder="Nate Gaffney Breakdown" required />
          <Field name="handle" label="Creator handle" placeholder="nategaffney" />
          <Field name="slug" label="URL slug (optional)" placeholder="nategaffney" />
          <Field name="summary" label="One-line summary" placeholder="The rare breed hook behind 60% of his views" />
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
                </p>
              </div>
              <div className="flex gap-2">
                <Toggle action={toggle} slug={b.slug} field="published" value={!b.published}>
                  {b.published ? "Unpublish" : "Publish"}
                </Toggle>
                <Toggle action={toggle} slug={b.slug} field="is_free" value={!b.is_free}>
                  {b.is_free ? "Make members-only" : "Make free"}
                </Toggle>
              </div>
            </li>
          ))}
          {(breakdowns ?? []).length === 0 && <li className="py-4 text-chalk/60">Nothing uploaded yet.</li>}
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

function Stat({ value, label }: { value: number; label: string }) {
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
  field,
  value,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  slug: string;
  field: string;
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(value)} />
      <button type="submit" className="label border-2 border-oak px-3 py-2 text-[10px] text-chalk hover:border-birch">
        {children}
      </button>
    </form>
  );
}
