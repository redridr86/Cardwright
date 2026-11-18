import { vaultDelete, vaultGet, vaultPut } from "@/lib/vault";

export type RefImage = {
  id: string;
  name: string;
  dataUrl: string;
};

export type MediaRecord = {
  images: RefImage[];
  portraitId: string | null;
};

export const EMPTY_MEDIA: MediaRecord = { images: [], portraitId: null };

const DB_NAME = "cardwright-media";
const STORE = "drafts";

const MAX_EDGE = 1024;
const MAX_FILES = 200;
const MAX_BYTES = 20 * 1024 * 1024;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open picture storage."));
  });
}

function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = run(tx.objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Could not save pictures."));
        tx.oncomplete = () => db.close();
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("Could not save pictures."));
        };
      }),
  );
}

function normalizeMedia(value: MediaRecord): MediaRecord {
  const images = value.images
    .filter((item) => item && typeof item.id === "string" && typeof item.dataUrl === "string")
    .slice(0, MAX_FILES);
  const portraitId = images.some((item) => item.id === value.portraitId) ? value.portraitId : (images[0]?.id ?? null);
  return { images, portraitId };
}

export async function loadMedia(key: string): Promise<MediaRecord> {
  try {
    const stored = await vaultGet<MediaRecord>("media", key);
    if (stored && Array.isArray(stored.images)) return normalizeMedia(stored);
  } catch {
    // Fall through to the older picture store.
  }
  try {
    const value = await withStore<MediaRecord | undefined>("readonly", (store) => store.get(key));
    if (!value || !Array.isArray(value.images)) return { ...EMPTY_MEDIA };
    const record = normalizeMedia(value);
    if (record.images.length > 0) void vaultPut("media", key, record).catch(() => undefined);
    return record;
  } catch {
    return { ...EMPTY_MEDIA };
  }
}

export async function saveMedia(key: string, media: MediaRecord): Promise<void> {
  await vaultPut("media", key, normalizeMedia(media));
}

export async function deleteMedia(key: string): Promise<void> {
  try {
    await vaultDelete("media", key);
  } catch {
    // A missing draft is already gone.
  }
  try {
    await withStore("readwrite", (store) => store.delete(key));
  } catch {
    // The older store may already be gone.
  }
}

export async function migrateLegacyMedia(): Promise<void> {
  try {
    const keys = await withStore<IDBValidKey[]>("readonly", (store) => store.getAllKeys());
    for (const key of keys) {
      if (typeof key !== "string") continue;
      const value = await withStore<MediaRecord | undefined>("readonly", (store) => store.get(key));
      if (!value || !Array.isArray(value.images) || value.images.length === 0) continue;
      const existing = await vaultGet<MediaRecord>("media", key).catch(() => null);
      if (existing && Array.isArray(existing.images) && existing.images.length > 0) continue;
      await vaultPut("media", key, normalizeMedia(value));
    }
  } catch {
    // Pictures already in the library folder are enough.
  }
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that picture."));
    image.src = src;
  });
}

async function downscale(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadHtmlImage(objectUrl);
    const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare that picture.");
    ctx.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("Could not prepare that picture."))),
        "image/jpeg",
        0.82,
      );
    });
    const dataUrl = await blobToDataUrl(blob);
    if (!dataUrl.startsWith("data:image/")) throw new Error("Could not prepare that picture.");
    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not prepare that picture."));
    reader.readAsDataURL(blob);
  });
}

export async function loadJson<T>(key: string): Promise<T | null> {
  try {
    const value = await withStore<T | undefined>("readonly", (store) => store.get(key));
    return value ?? null;
  } catch {
    return null;
  }
}

export async function saveJson(key: string, value: unknown): Promise<void> {
  await withStore("readwrite", (store) => store.put(value, key));
}

export async function fileToImage(file: File): Promise<RefImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name || "That file"} is not a picture.`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`${file.name || "That picture"} is over 20 MB.`);
  }
  return {
    id: crypto.randomUUID(),
    name: file.name || "reference",
    dataUrl: await downscale(file),
  };
}

export function addImages(current: MediaRecord, incoming: RefImage[]): MediaRecord {
  const images = [...current.images];
  for (const image of incoming) {
    if (images.length >= MAX_FILES) break;
    images.push(image);
  }
  return {
    images,
    portraitId: current.portraitId && images.some((item) => item.id === current.portraitId) ? current.portraitId : (images[0]?.id ?? null),
  };
}

export function removeImage(current: MediaRecord, id: string): MediaRecord {
  const images = current.images.filter((item) => item.id !== id);
  const portraitId = current.portraitId === id ? (images[0]?.id ?? null) : current.portraitId;
  return { images, portraitId };
}

export function placePortrait(current: MediaRecord, image: RefImage): MediaRecord {
  if (current.images.length < MAX_FILES) {
    return { images: [...current.images, image], portraitId: image.id };
  }
  const rest = current.portraitId ? current.images.filter((item) => item.id !== current.portraitId) : current.images.slice(1);
  return { images: [...rest, image].slice(0, MAX_FILES), portraitId: image.id };
}

export function portraitOf(media: MediaRecord): RefImage | null {
  return media.images.find((item) => item.id === media.portraitId) ?? media.images[0] ?? null;
}

export const IMAGE_LIMIT = MAX_FILES;
