// Kit (the email tool). Every free sign-up lands here with a tag, so Martin has one list.
// Key lives in Vercel as KIT_API_KEY. Optional: KIT_TAG (default "launch-list"),
// KIT_FORM_ID (a Kit form whose incentive email delivers the freebie).

const API = "https://api.kit.com/v4";

export const hasKit = () => Boolean(process.env.KIT_API_KEY);

async function kit<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "X-Kit-Api-Key": process.env.KIT_API_KEY!,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Kit ${init?.method ?? "GET"} ${path.split("?")[0]} -> ${res.status} ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : {}) as T;
}

type Tag = { id: number; name: string };

// Looks a tag up by name (ignoring case and spaces at the ends) and creates it if it's missing.
// No cache: a stale id from an earlier request is exactly the kind of bug we can't see.
export async function tagId(name: string, create = true): Promise<number | null> {
  const want = name.trim().toLowerCase();
  let cursor: string | null = null;
  do {
    const page: { tags?: Tag[]; pagination?: { has_next_page: boolean; end_cursor: string } } = await kit(
      `/tags?per_page=1000${cursor ? `&after=${encodeURIComponent(cursor)}` : ""}`,
    );
    const hit = (page.tags ?? []).find((t) => t.name.trim().toLowerCase() === want);
    if (hit) return hit.id;
    cursor = page.pagination?.has_next_page ? page.pagination.end_cursor : null;
  } while (cursor);
  if (!create) return null;
  const made: { tag?: Tag } = await kit("/tags", { method: "POST", body: JSON.stringify({ name: name.trim() }) });
  if (!made.tag?.id) throw new Error(`Kit tag "${name}" could not be created`);
  return made.tag.id;
}

export type KitStep = { step: string; ok: boolean; detail?: string };

// Creates (or finds) the subscriber, adds them to the delivery form if one is set, and tags them.
// Every step runs on its own, so one failure (say, a bad form id) can't stop the tags.
// Returns what happened; throws only if the subscriber itself couldn't be created.
export async function subscribeToKit(email: string, extraTags: string[] = []): Promise<KitStep[]> {
  const steps: KitStep[] = [];
  await kit("/subscribers", { method: "POST", body: JSON.stringify({ email_address: email }) });
  steps.push({ step: "subscriber", ok: true });

  const form = process.env.KIT_FORM_ID;
  if (form) {
    try {
      await kit(`/forms/${form}/subscribers`, { method: "POST", body: JSON.stringify({ email_address: email }) });
      steps.push({ step: `form ${form}`, ok: true });
    } catch (err) {
      steps.push({ step: `form ${form}`, ok: false, detail: String(err) });
    }
  }

  const tags = [...new Set([process.env.KIT_TAG || "launch-list", ...extraTags])];
  for (const t of tags) {
    try {
      const id = (await tagId(t))!;
      await kit(`/tags/${id}/subscribers`, { method: "POST", body: JSON.stringify({ email_address: email }) });
      steps.push({ step: `tag ${t} (#${id})`, ok: true });
    } catch (err) {
      steps.push({ step: `tag ${t}`, ok: false, detail: String(err) });
    }
  }
  const failed = steps.filter((s) => !s.ok);
  if (failed.length) console.error("kit subscribe: some steps failed", email, JSON.stringify(failed));
  return steps;
}

// How many subscribers carry a tag (null if Kit isn't set up, the tag doesn't exist yet, or Kit errors).
export async function tagCount(name: string): Promise<number | null> {
  if (!hasKit()) return null;
  try {
    const id = await tagId(name, false);
    if (!id) return 0;
    const res: { pagination?: { total_count?: number } } = await kit(
      `/tags/${id}/subscribers?include_total_count=true&per_page=1`,
    );
    return res.pagination?.total_count ?? null;
  } catch (err) {
    console.error("kit tag count failed", name, err);
    return null;
  }
}
