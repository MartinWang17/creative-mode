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
  if (!res.ok) throw new Error(`Kit ${init?.method ?? "GET"} ${path} -> ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

const tagIds = new Map<string, number>();

async function tagId(name: string) {
  const cached = tagIds.get(name);
  if (cached) return cached;
  let cursor: string | null = null;
  do {
    const page: { tags: { id: number; name: string }[]; pagination?: { has_next_page: boolean; end_cursor: string } } =
      await kit(`/tags?per_page=500${cursor ? `&after=${cursor}` : ""}`);
    for (const t of page.tags) tagIds.set(t.name, t.id);
    cursor = page.pagination?.has_next_page ? page.pagination.end_cursor : null;
  } while (cursor);
  if (!tagIds.get(name)) {
    const made: { tag: { id: number; name: string } } = await kit("/tags", { method: "POST", body: JSON.stringify({ name }) });
    tagIds.set(made.tag.name, made.tag.id);
  }
  return tagIds.get(name)!;
}

// Creates (or finds) the subscriber, adds them to the delivery form if one is set, and tags them.
export async function subscribeToKit(email: string, extraTags: string[] = []) {
  await kit("/subscribers", { method: "POST", body: JSON.stringify({ email_address: email }) });
  const form = process.env.KIT_FORM_ID;
  if (form) await kit(`/forms/${form}/subscribers`, { method: "POST", body: JSON.stringify({ email_address: email }) });
  const tags = [process.env.KIT_TAG || "launch-list", ...extraTags];
  for (const t of tags) {
    const id = await tagId(t);
    await kit(`/tags/${id}/subscribers`, { method: "POST", body: JSON.stringify({ email_address: email }) });
  }
}
