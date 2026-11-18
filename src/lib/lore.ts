export type LoreEntry = {
  id: string;
  name: string;
  keys: string;
  content: string;
  enabled: boolean;
  constant: boolean;
  order: number;
};

export type Lorebook = {
  id: string;
  name: string;
  kind: "lore" | "world";
  description: string;
  scanDepth: number;
  entries: LoreEntry[];
  updatedAt: number;
};

export function emptyBook(kind: Lorebook["kind"]): Lorebook {
  return {
    id: crypto.randomUUID(),
    name: kind === "world" ? "New world book" : "New lorebook",
    kind,
    description: "",
    scanDepth: 4,
    entries: [],
    updatedAt: Date.now(),
  };
}

export function emptyEntry(): LoreEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    keys: "",
    content: "",
    enabled: true,
    constant: false,
    order: 100,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "true") return true;
  if (value === 0 || value === "false") return false;
  return fallback;
}

function keysToText(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (isRecord(item)) return asString(item.key ?? item.text ?? item.name ?? item.value);
        return "";
      })
      .filter(Boolean)
      .join(", ");
  }
  if (isRecord(value)) {
    return Object.values(value)
      .map((item) => (typeof item === "string" ? item : isRecord(item) ? asString(item.key ?? item.text ?? item.name ?? item.value) : ""))
      .filter(Boolean)
      .join(", ");
  }
  return asString(value);
}

function entryContent(raw: Record<string, unknown>): string {
  const extensions = isRecord(raw.extensions) ? raw.extensions : {};
  return asString(raw.content ?? raw.text ?? raw.entry ?? raw.body ?? raw.value ?? extensions.content ?? extensions.text ?? extensions.entry);
}

function unwrapEntry(raw: Record<string, unknown>): Record<string, unknown> {
  const nested = [raw.entry, raw.data, raw.fields].find(
    (item) => isRecord(item) && (entryContent(item) || keysToText(item.keys ?? item.key ?? item.keywords ?? item.primaryKeys ?? item.primary_keys)),
  );
  if (!isRecord(nested)) return raw;
  return {
    ...raw,
    ...nested,
    name: nested.name ?? nested.comment ?? nested.title ?? raw.name ?? raw.comment,
    extensions: isRecord(nested.extensions) ? nested.extensions : raw.extensions,
  };
}

function entryFrom(raw: unknown, index: number): LoreEntry | null {
  if (!isRecord(raw)) return null;
  const source = unwrapEntry(raw);
  const content = entryContent(source) || asString(source.description);
  const keys = [
    keysToText(source.keys ?? source.key ?? source.keywords ?? source.primaryKeys ?? source.primary_keys ?? source.triggers),
    keysToText(source.secondaryKeys ?? source.secondary_keys ?? source.keysecondary),
  ]
    .filter(Boolean)
    .join(", ");
  if (!content.trim() && !keys.trim()) return null;
  const order = source.order ?? source.insertion_order ?? source.priority ?? source.displayIndex;
  const disabled = source.disable === true || source.disabled === true || source.enabled === false || source.enabled === 0 || source.enabled === "false";
  return {
    id: typeof source.id === "string" ? source.id : typeof source.uid === "number" ? `uid-${source.uid}` : typeof source.id === "number" ? `id-${source.id}` : crypto.randomUUID(),
    name: asString(source.name ?? source.comment ?? source.title ?? source.displayName),
    keys,
    content,
    enabled: disabled ? false : asBool(source.enabled, true),
    constant: asBool(source.constant, source.forceActivation === true || source.alwaysActive === true || source.always_active === true),
    order: typeof order === "number" && Number.isFinite(order) ? order : index,
  };
}

function entriesFrom(raw: unknown): LoreEntry[] {
  const parsed = typeof raw === "string" ? parseJson(raw) : raw;
  const list = Array.isArray(parsed) ? parsed : isRecord(parsed) ? Object.values(parsed) : [];
  return list.map(entryFrom).filter((entry): entry is LoreEntry => entry !== null);
}

function parseJson(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function firstEntries(...candidates: unknown[]): LoreEntry[] {
  const merged: LoreEntry[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    for (const entry of entriesFrom(candidate)) {
      const key = `${entry.name}\n${entry.keys}\n${entry.content}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (merged.some((item) => item.id === entry.id)) entry.id = crypto.randomUUID();
      merged.push(entry);
    }
  }
  return merged;
}

function folderEntries(value: unknown): unknown[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((folder) => (isRecord(folder) ? [folder.entries] : []));
}

function nestedBookEntries(value: unknown): unknown[] {
  if (!Array.isArray(value)) return [];
  const buckets: unknown[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    buckets.push(item.entries);
    if (isRecord(item.lorebook)) buckets.push(item.lorebook.entries);
    if (isRecord(item.character_book)) buckets.push(item.character_book.entries);
    if (isRecord(item.data)) {
      buckets.push(item.data.entries);
      if (isRecord(item.data.lorebook)) buckets.push(item.data.lorebook.entries);
      if (isRecord(item.data.character_book)) buckets.push(item.data.character_book.entries);
    }
  }
  return buckets;
}

function originalEntries(value: unknown): unknown[] {
  if (!isRecord(value)) return [];
  return [value.entries, isRecord(value.character_book) ? value.character_book.entries : undefined];
}

export function lorebookFromUnknown(raw: unknown, fallbackName = "Imported book"): Lorebook | null {
  if (typeof raw === "string") {
    const parsed = parseJson(raw);
    return parsed === raw ? null : lorebookFromUnknown(parsed, fallbackName);
  }
  if (!isRecord(raw)) return null;
  const data = isRecord(raw.data) ? raw.data : null;
  const inner = data && isRecord(data.data) ? data.data : null;
  const lore = isRecord(raw.lorebook) ? raw.lorebook : isRecord(data?.lorebook) ? data.lorebook : isRecord(inner?.lorebook) ? inner.lorebook : null;
  const book = isRecord(raw.character_book)
    ? raw.character_book
    : isRecord(data?.character_book)
      ? data.character_book
      : isRecord(data?.characterBook)
        ? data.characterBook
        : isRecord(inner?.character_book)
          ? inner.character_book
          : null;
  const character = isRecord(raw.character) ? raw.character : isRecord(data?.character) ? data.character : null;
  const characterData = character && isRecord(character.data) ? character.data : null;
  const characterBook = character && isRecord(character.character_book) ? character.character_book : characterData && isRecord(characterData.character_book) ? characterData.character_book : null;
  const entries = firstEntries(
    raw.entries,
    data?.entries,
    inner?.entries,
    lore?.entries,
    book?.entries,
    characterBook?.entries,
    raw.loreEntries,
    data?.loreEntries,
    inner?.loreEntries,
    ...folderEntries(raw.folders),
    ...folderEntries(data?.folders),
    ...folderEntries(inner?.folders),
    ...folderEntries(lore?.folders),
    ...nestedBookEntries(raw.lorebooks),
    ...nestedBookEntries(data?.lorebooks),
    ...nestedBookEntries(inner?.lorebooks),
    ...originalEntries(raw.originalData),
    ...originalEntries(data?.originalData),
  );
  const name = firstText(lore?.name, book?.name, characterBook?.name, raw.name, data?.name, inner?.name, raw.title, data?.title);
  const description = firstText(lore?.description, book?.description, characterBook?.description, raw.description, data?.description, inner?.description);
  if (!name && entries.length === 0 && !description) return null;
  const depth = lore?.scan_depth ?? lore?.scanDepth ?? book?.scan_depth ?? book?.scanDepth ?? raw.scan_depth ?? raw.scanDepth ?? data?.scanDepth ?? inner?.scanDepth;
  const kind = lore?.category === "world" || lore?.kind === "world" || raw.kind === "world" || book?.kind === "world" ? "world" : "lore";
  return {
    id: firstText(lore?.id, book?.id, raw.id) || crypto.randomUUID(),
    name: name || fallbackName,
    kind,
    description,
    scanDepth: typeof depth === "number" && depth > 0 ? Math.min(50, Math.round(depth)) : 4,
    entries,
    updatedAt: Date.now(),
  };
}

export function bookToFile(book: Lorebook) {
  return {
    name: book.name,
    kind: book.kind,
    description: book.description,
    scan_depth: book.scanDepth,
    entries: book.entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      keys: entry.keys.split(/[,\n]/).map((key) => key.trim()).filter(Boolean),
      content: entry.content,
      enabled: entry.enabled,
      constant: entry.constant,
      insertion_order: entry.order,
    })),
  };
}

function escapeKey(key: string): string {
  return key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keyHits(haystack: string, key: string): boolean {
  const needle = key.trim().toLowerCase();
  if (!needle) return false;
  if (needle.length <= 3) return new RegExp(`(^|[^a-z0-9])${escapeKey(needle)}([^a-z0-9]|$)`, "i").test(haystack);
  return haystack.toLowerCase().includes(needle);
}

export function activateBooks(
  books: Lorebook[],
  history: { text: string }[],
): string {
  const hits: LoreEntry[] = [];
  for (const book of books) {
    const depth = Math.max(1, book.scanDepth || 4);
    const window = history
      .slice(-depth)
      .map((turn) => turn.text)
      .join("\n");
    for (const entry of book.entries) {
      if (!entry.enabled || !entry.content.trim()) continue;
      const keys = entry.keys.split(/[,\n]/).map((key) => key.trim()).filter(Boolean);
      if (entry.constant || keys.some((key) => keyHits(window, key))) hits.push(entry);
    }
  }
  hits.sort((a, b) => a.order - b.order);
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const entry of hits) {
    const content = entry.content.trim();
    if (seen.has(content)) continue;
    seen.add(content);
    const title = entry.name.trim();
    lines.push(title ? `${title}: ${content}` : content);
  }
  return lines.join("\n\n").slice(0, 6000);
}

export function loreCatalog(books: Lorebook[], limit = 30): string {
  const lines: string[] = [];
  const cap = Math.max(5, Math.min(80, limit));
  for (const book of books) {
    for (const entry of book.entries) {
      if (!entry.enabled || !entry.content.trim()) continue;
      const title = entry.name.trim() || "Entry";
      const keys = entry.keys.trim();
      const blurb = entry.content.trim().replace(/\s+/g, " ").slice(0, 240);
      lines.push(keys ? `${title} (${keys}): ${blurb}` : `${title}: ${blurb}`);
      if (lines.length >= cap) return lines.join("\n");
    }
  }
  return lines.join("\n");
}
