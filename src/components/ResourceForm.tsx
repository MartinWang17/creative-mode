"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRef, useState } from "react";
import { saveResource, signUpload, type ResourceInput } from "@/app/admin/resources/actions";

type Existing = Partial<ResourceInput> & { id?: string; available_local?: string };

// Admin form for one resource. Files go browser -> Supabase storage directly, then the row is saved.
export default function ResourceForm({ existing, onDone }: { existing?: Existing; onDone?: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);

  async function upload(slug: string, file: File | null) {
    if (!file || file.size === 0) return null;
    setBusy(`Uploading ${file.name}…`);
    const { path, token } = await signUpload(slug, file.name);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    const { error } = await supabase.storage.from("resources").uploadToSignedUrl(path, token, file, {
      contentType: file.type || undefined,
    });
    if (error) throw new Error(`${file.name}: ${error.message}`);
    return path;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "");
    const slug = String(fd.get("slug") ?? "") || title;
    try {
      const storage_path = await upload(slug, fd.get("file") as File | null);
      const cover_path = await upload(slug, fd.get("cover") as File | null);
      setBusy("Saving…");
      await saveResource({
        id: existing?.id,
        title,
        slug: String(fd.get("slug") ?? ""),
        blurb: String(fd.get("blurb") ?? ""),
        link: String(fd.get("link") ?? ""),
        annual_only: fd.get("annual_only") === "on",
        available_at: String(fd.get("available_at") ?? ""),
        sort: Number(fd.get("sort") ?? 0),
        storage_path,
        cover_path,
      });
      form.current?.reset();
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <form ref={form} onSubmit={submit} className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <Field name="title" label="Title" placeholder="Hook Vault" required defaultValue={existing?.title} />
      <Field name="slug" label="URL slug (optional)" placeholder="hook-vault" defaultValue={existing?.slug} />
      <Field
        name="blurb"
        label="One-line description"
        placeholder="50 hooks that keep winning, sorted by what they do"
        defaultValue={existing?.blurb ?? ""}
        wide
      />
      <Field
        name="link"
        label="Video or outside link (YouTube, Vimeo, Loom, Google Drive…)"
        placeholder="https://youtu.be/…"
        defaultValue={existing?.link ?? ""}
        wide
      />
      <label className="label text-[10px] text-chalk/60">
        File (PDF, zip, Notion export…)
        <input type="file" name="file" className={fileCls} />
      </label>
      <label className="label text-[10px] text-chalk/60">
        Cover image (4:3 looks best)
        <input type="file" name="cover" accept="image/*" className={fileCls} />
      </label>
      <label className="label text-[10px] text-chalk/60">
        Available from (Eastern time, blank = right away)
        <input
          type="datetime-local"
          name="available_at"
          defaultValue={existing?.available_local ?? ""}
          className={inputCls}
        />
      </label>
      <label className="label text-[10px] text-chalk/60">
        Order (lower first)
        <input type="number" name="sort" defaultValue={existing?.sort ?? 0} className={inputCls} />
      </label>
      <label className="label flex items-center gap-3 text-[10px] text-chalk/80 sm:col-span-2">
        <input type="checkbox" name="annual_only" defaultChecked={existing?.annual_only ?? false} className="h-4 w-4 accent-birch" />
        Annual members only
      </label>
      {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
      <button
        type="submit"
        disabled={!!busy}
        className="label rounded-full border-2 border-chalk px-6 py-4 text-xs text-chalk hover:bg-chalk hover:text-bedrock disabled:opacity-50 sm:col-span-2"
      >
        {busy ?? (existing?.id ? "Save changes" : "Add as draft")}
      </button>
    </form>
  );
}

const inputCls =
  "mt-2 block w-full border-2 border-oak bg-bedrock px-3 py-2 font-sans text-base normal-case tracking-normal text-chalk outline-none focus:border-birch";
const fileCls =
  "mt-2 block w-full text-sm text-chalk/80 file:mr-4 file:border-2 file:border-oak file:bg-bedrock file:px-4 file:py-2 file:text-chalk";

function Field(props: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  wide?: boolean;
}) {
  return (
    <label className={`label text-[10px] text-chalk/60 ${props.wide ? "sm:col-span-2" : ""}`}>
      {props.label}
      <input
        name={props.name}
        placeholder={props.placeholder}
        required={props.required}
        defaultValue={props.defaultValue}
        className={inputCls}
      />
    </label>
  );
}
