import { cardFromUnknown } from "@/lib/card";
import { lorebookFromUnknown, type Lorebook } from "@/lib/lore";
import type { MarinaraPreset } from "@/lib/preset";
import { starterPreset } from "@/lib/preset";
import { isDesktopHost } from "@/lib/kobold";
import type { ShelfItem } from "@/lib/studio-store";

export type VaultBucket = "cards" | "personas" | "presets" | "media" | "gallery" | "lore" | "world" | "chats";

export type VaultHead = {
  id: string;
  name: string;
  updatedAt: number;
};

export type VaultInfo = {
  mode: "desktop" | "folder" | "idb";
  label: string;
  detail: string;
};

const BUCKETS = new Set<VaultBucket>(["cards", "personas", "presets", "media", "gallery", "lore", "world", "chats"]);
const DB_NAME = "cardwright-vault";
const STORE = "records";

type Envelope = {
  id: string;
  name: string;
  updatedAt: number;
  body: unknown;
};

type Writable = { write: (data: string) => Promise<void>; close: () => Promise<void> };

type FileHandle = {
  getFile: () => Promise<File>;
  createWritable: () => Promise<Writable>;
};

type DirHandle = {
  name: string;
  queryPermission?: (descriptor: { mode: "readwrite" }) => Promise<string>;
  getDirectoryHandle: (name: string, options?: { create?: boolean }) => Promise<DirHandle>;
  getFileHandle: (name: string, options?: { create?: boolean }) => Promise<FileHandle>;
  removeEntry?: (name: string) => Promise<void>;
  values: () => AsyncIterable<{ kind: string; name: string; getFile?: () => Promise<File> }>;
};

let mode: VaultInfo["mode"] | null = null;
let folderHandle: DirHandle | null = null;
let desktopPath = "";
let allowLibrarySync = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function vaultKey(raw: string): string {
  const cleaned = raw.trim().replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
  const key = cleaned.slice(0, 120);
  if (/^[A-Za-z0-9]/.test(key)) return key;
  return `k${key || "item"}`.slice(0, 120);
}

export function armLibrarySync() {
  allowLibrarySync = true;
}

export function disarmLibrarySync() {
  allowLibrarySync = false;
}

export function librarySyncArmed() {
  return allowLibrarySync;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open the library."));
  });
}

function withStore<T>(access: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T> | Promise<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, access);
        const result = run(tx.objectStore(STORE));
        if (result instanceof Promise) {
          result.then(resolve, reject);
          tx.oncomplete = () => db.close();
          tx.onerror = () => {
            db.close();
            reject(tx.error ?? new Error("Could not update the library."));
          };
          return;
        }
        result.onsuccess = () => resolve(result.result);
        result.onerror = () => reject(result.error ?? new Error("Could not update the library."));
        tx.oncomplete = () => db.close();
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("Could not update the library."));
        };
      }),
  );
}

function recordKey(bucket: VaultBucket, id: string) {
  return `${bucket}/${vaultKey(id)}`;
}

function envelopeOf(id: string, value: unknown): Envelope {
  const record = isRecord(value) ? value : {};
  const name = typeof record.name === "string" && record.name.trim() ? record.name.trim() : id;
  const updatedAt = typeof record.updatedAt === "number" ? record.updatedAt : Date.now();
  return { id: vaultKey(id), name, updatedAt, body: value };
}

async function idbPut(bucket: VaultBucket, id: string, value: unknown) {
  const envelope = envelopeOf(id, value);
  await withStore("readwrite", (store) => store.put(envelope, recordKey(bucket, id)));
}

async function idbGet<T>(bucket: VaultBucket, id: string): Promise<T | null> {
  const value = await withStore<Envelope | undefined>("readonly", (store) => store.get(recordKey(bucket, id)));
  if (!value || !isRecord(value) || !("body" in value)) return (value as T) ?? null;
  return (value.body as T) ?? null;
}

async function idbDelete(bucket: VaultBucket, id: string) {
  await withStore("readwrite", (store) => store.delete(recordKey(bucket, id)));
}

async function idbList(bucket: VaultBucket): Promise<VaultHead[]> {
  const db = await openDb();
  const prefix = `${bucket}/`;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).openCursor();
    const heads: VaultHead[] = [];
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (typeof cursor.key === "string" && cursor.key.startsWith(prefix)) {
        const envelope = cursor.value as Envelope;
        heads.push({
          id: envelope?.id || cursor.key.slice(prefix.length),
          name: envelope?.name || cursor.key.slice(prefix.length),
          updatedAt: envelope?.updatedAt || 0,
        });
      }
      cursor.continue();
    };
    request.onerror = () => reject(request.error ?? new Error("Could not read the library."));
    tx.oncomplete = () => {
      db.close();
      resolve(heads.sort((a, b) => b.updatedAt - a.updatedAt));
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("Could not read the library."));
    };
  });
}

async function desktopSend(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(path, init);
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : {};
  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.message === "string" ? payload.message : "Could not update the library folder.";
    throw new Error(message);
  }
  return payload;
}

async function ensureMode(): Promise<VaultInfo["mode"]> {
  if (mode) return mode;
  const info = await vaultInfo();
  return info.mode;
}

export async function vaultInfo(): Promise<VaultInfo> {
  if (await isDesktopHost()) {
    const payload = (await desktopSend("/__vault/info")) as { path?: string };
    desktopPath = payload.path || "Cardwright library";
    mode = "desktop";
    folderHandle = null;
    return {
      mode: "desktop",
      label: desktopPath,
      detail: "Cards, personas, presets, and pictures are files in this folder.",
    };
  }
  const saved = await withStore<DirHandle | undefined>("readonly", (store) => store.get("meta/dir")).catch(() => undefined);
  if (saved && typeof saved.queryPermission === "function") {
    const permission = await saved.queryPermission({ mode: "readwrite" }).catch(() => "prompt");
    if (permission === "granted") {
      folderHandle = saved;
      mode = "folder";
      return { mode: "folder", label: saved.name, detail: "Cards and pictures are files in the folder you chose." };
    }
  }
  mode = "idb";
  folderHandle = null;
  return {
    mode: "idb",
    label: "This browser",
    detail: "This preview keeps the library in the browser. The Windows app can save it in a folder you choose.",
  };
}

export async function chooseVaultFolder(): Promise<VaultInfo | null> {
  if (await isDesktopHost()) {
    const payload = (await desktopSend("/__vault/choose", { method: "POST" })) as { cancelled?: boolean; path?: string };
    if (payload.cancelled || !payload.path) return null;
    desktopPath = payload.path;
    mode = "desktop";
    return { mode: "desktop", label: payload.path, detail: "Cards, personas, presets, and pictures are files in this folder." };
  }
  const choose = (window as Window & { showDirectoryPicker?: (options?: { mode?: "readwrite" }) => Promise<DirHandle> }).showDirectoryPicker;
  if (typeof choose !== "function") {
    throw new Error("Choosing a folder is in the Windows app. This preview keeps cards and pictures in the browser.");
  }
  try {
    const handle = await choose({ mode: "readwrite" });
    await copyIdbIntoFolder(handle);
    await withStore("readwrite", (store) => store.put(handle, "meta/dir"));
    folderHandle = handle;
    mode = "folder";
    return { mode: "folder", label: handle.name, detail: "Cards and pictures are files in the folder you chose." };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    throw error instanceof Error ? error : new Error("Could not use that folder.");
  }
}

async function bucketDir(bucket: VaultBucket): Promise<DirHandle> {
  if (!folderHandle) throw new Error("No library folder is open.");
  return folderHandle.getDirectoryHandle(bucket, { create: true });
}

async function folderPut(bucket: VaultBucket, id: string, value: unknown) {
  const dir = await bucketDir(bucket);
  const handle = await dir.getFileHandle(`${vaultKey(id)}.json`, { create: true });
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(envelopeOf(id, value)));
  await writable.close();
}

async function folderGet<T>(bucket: VaultBucket, id: string): Promise<T | null> {
  try {
    const dir = await bucketDir(bucket);
    const handle = await dir.getFileHandle(`${vaultKey(id)}.json`);
    const file = await handle.getFile();
    const parsed = JSON.parse(await file.text()) as Envelope;
    return (parsed.body as T) ?? null;
  } catch {
    return null;
  }
}

async function folderDelete(bucket: VaultBucket, id: string) {
  const dir = await bucketDir(bucket);
  await dir.removeEntry?.(`${vaultKey(id)}.json`);
}

async function folderList(bucket: VaultBucket): Promise<VaultHead[]> {
  const heads: VaultHead[] = [];
  try {
    const dir = await bucketDir(bucket);
    for await (const entry of dir.values()) {
      if (entry.kind !== "file" || !entry.name.endsWith(".json")) continue;
      try {
        if (!entry.getFile) continue;
        const file = await entry.getFile();
        const parsed = JSON.parse(await file.text()) as Envelope;
        heads.push({
          id: parsed.id || entry.name.replace(/\.json$/, ""),
          name: parsed.name || entry.name,
          updatedAt: parsed.updatedAt || 0,
        });
      } catch {
        // Skip a file that is not a library record.
      }
    }
  } catch {
    return [];
  }
  return heads.sort((a, b) => b.updatedAt - a.updatedAt);
}

async function copyIdbIntoFolder(handle: DirHandle) {
  const previous = folderHandle;
  folderHandle = handle;
  try {
    for (const bucket of BUCKETS) {
      const heads = await idbList(bucket);
      for (const head of heads) {
        const body = await idbGet(bucket, head.id);
        if (body !== null) await folderPut(bucket, head.id, body);
      }
    }
  } finally {
    folderHandle = previous;
  }
}

function assertBucket(bucket: string): asserts bucket is VaultBucket {
  if (!BUCKETS.has(bucket as VaultBucket)) throw new Error("Unknown library.");
}

export async function vaultPut(bucket: VaultBucket, id: string, value: unknown): Promise<void> {
  assertBucket(bucket);
  const current = await ensureMode();
  if (current === "desktop") {
    await desktopSend(`/__vault/entry?bucket=${bucket}&id=${encodeURIComponent(vaultKey(id))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(envelopeOf(id, value)),
    });
    return;
  }
  if (current === "folder") {
    await folderPut(bucket, id, value);
    return;
  }
  await idbPut(bucket, id, value);
}

export async function vaultGet<T>(bucket: VaultBucket, id: string): Promise<T | null> {
  assertBucket(bucket);
  const current = await ensureMode();
  if (current === "desktop") {
    const payload = (await desktopSend(`/__vault/entry?bucket=${bucket}&id=${encodeURIComponent(vaultKey(id))}`)) as { missing?: boolean; body?: T };
    if (payload.missing) return null;
    return payload.body ?? null;
  }
  if (current === "folder") return folderGet<T>(bucket, id);
  return idbGet<T>(bucket, id);
}

export async function vaultDelete(bucket: VaultBucket, id: string): Promise<void> {
  assertBucket(bucket);
  const current = await ensureMode();
  if (current === "desktop") {
    await desktopSend(`/__vault/entry?bucket=${bucket}&id=${encodeURIComponent(vaultKey(id))}`, { method: "DELETE" });
    return;
  }
  if (current === "folder") {
    await folderDelete(bucket, id);
    return;
  }
  await idbDelete(bucket, id);
}

export async function vaultList(bucket: VaultBucket): Promise<VaultHead[]> {
  assertBucket(bucket);
  const current = await ensureMode();
  if (current === "desktop") {
    const payload = (await desktopSend(`/__vault/entries?bucket=${bucket}`)) as { entries?: VaultHead[] };
    return Array.isArray(payload.entries) ? payload.entries : [];
  }
  if (current === "folder") return folderList(bucket);
  return idbList(bucket);
}

export function mergeShelf(current: ShelfItem[], incoming: ShelfItem[]): ShelfItem[] {
  const map = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) map.set(item.id, item);
  return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}

function asShelf(value: unknown, id: string): ShelfItem | null {
  if (!isRecord(value) || !isRecord(value.card)) return null;
  return {
    id: typeof value.id === "string" ? value.id : id,
    name: typeof value.name === "string" && value.name.trim() ? value.name : "Untitled",
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
    card: cardFromUnknown(value.card),
    revisions: revisionsFrom(value.revisions),
  };
}

function revisionsFrom(raw: unknown): ShelfItem["revisions"] {
  if (!Array.isArray(raw)) return [];
  const revisions: NonNullable<ShelfItem["revisions"]> = [];
  for (const entry of raw) {
    if (!isRecord(entry) || !isRecord(entry.card)) continue;
    revisions.push({
      version: typeof entry.version === "string" && entry.version.trim() ? entry.version.trim() : "1.0",
      savedAt: typeof entry.savedAt === "number" ? entry.savedAt : 0,
      card: cardFromUnknown(entry.card),
    });
  }
  return revisions.slice(-40);
}

export async function loadShelf(bucket: "cards" | "personas"): Promise<ShelfItem[]> {
  const heads = await vaultList(bucket);
  const items: ShelfItem[] = [];
  for (const head of heads) {
    const body = await vaultGet<unknown>(bucket, head.id);
    const item = asShelf(body, head.id);
    if (item) items.push(item);
  }
  return items.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function importMissingShelf(bucket: "cards" | "personas", items: ShelfItem[]): Promise<void> {
  if (items.length === 0) return;
  const heads = await vaultList(bucket);
  const have = new Set(heads.map((head) => head.id));
  for (const item of items) {
    if (have.has(item.id) || have.has(vaultKey(item.id))) continue;
    await vaultPut(bucket, item.id, item);
  }
}

export async function syncShelf(bucket: "cards" | "personas", items: ShelfItem[]): Promise<void> {
  if (!allowLibrarySync) return;
  const heads = await vaultList(bucket);
  const ids = new Set(items.map((item) => item.id));
  for (const head of heads) {
    if (!ids.has(head.id)) await vaultDelete(bucket, head.id);
  }
  for (const item of items) await vaultPut(bucket, item.id, { ...item, updatedAt: item.updatedAt || Date.now() });
}

function asPreset(value: unknown): MarinaraPreset | null {
  if (!isRecord(value) || typeof value.name !== "string" || !Array.isArray(value.sections)) return null;
  return value as MarinaraPreset;
}

export async function loadPresetList(): Promise<MarinaraPreset[]> {
  const heads = await vaultList("presets");
  const presets: MarinaraPreset[] = [];
  for (const head of heads) {
    const body = asPreset(await vaultGet("presets", head.id));
    if (body) presets.push(body);
  }
  if (presets.length > 0) return presets.sort((a, b) => a.name.localeCompare(b.name));
  const starter = starterPreset();
  await vaultPut("presets", starter.id, { ...starter, updatedAt: Date.now() });
  return [starter];
}

export async function savePresetRecord(preset: MarinaraPreset): Promise<void> {
  await vaultPut("presets", preset.id, { ...preset, name: preset.name, updatedAt: Date.now() });
}

export async function deletePresetRecord(id: string): Promise<void> {
  await vaultDelete("presets", id);
}

export async function loadBookList(kind: Lorebook["kind"]): Promise<Lorebook[]> {
  const bucket = kind === "world" ? "world" : "lore";
  const heads = await vaultList(bucket);
  const books: Lorebook[] = [];
  for (const head of heads) {
    const body = lorebookFromUnknown(await vaultGet(bucket, head.id), head.name);
    if (body) books.push({ ...body, id: body.id || head.id, kind });
  }
  return books.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveBook(book: Lorebook): Promise<void> {
  const bucket = book.kind === "world" ? "world" : "lore";
  await vaultPut(bucket, book.id, { ...book, name: book.name, updatedAt: Date.now() });
}

export async function deleteBook(kind: Lorebook["kind"], id: string): Promise<void> {
  await vaultDelete(kind === "world" ? "world" : "lore", id);
}
