import { isDesktopHost } from "@/lib/kobold";

type SaveHandle = {
  createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }>;
};

type DirHandle = {
  name: string;
  queryPermission?: (descriptor: { mode: "readwrite" }) => Promise<string>;
  getFileHandle: (name: string, options?: { create?: boolean }) => Promise<{
    createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }>;
  }>;
};

const DB_NAME = "cardwright-downloads";
const STORE = "meta";
let folderHandle: DirHandle | null = null;
let folderLabel = "";

function picker():
  | ((options: {
      suggestedName?: string;
      types?: { description?: string; accept: Record<string, string[]> }[];
    }) => Promise<SaveHandle>)
  | null {
  const candidate = (window as Window & { showSaveFilePicker?: unknown }).showSaveFilePicker;
  if (typeof candidate !== "function") return null;
  return candidate as (options: {
    suggestedName?: string;
    types?: { description?: string; accept: Record<string, string[]> }[];
  }) => Promise<SaveHandle>;
}

function directoryPicker(): ((options?: { mode?: "readwrite" }) => Promise<DirHandle>) | null {
  const candidate = (window as Window & { showDirectoryPicker?: unknown }).showDirectoryPicker;
  if (typeof candidate !== "function") return null;
  return candidate as (options?: { mode?: "readwrite" }) => Promise<DirHandle>;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open downloads."));
  });
}

async function storedFolder(): Promise<DirHandle | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const db = await openDb();
    const handle = await new Promise<DirHandle | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).get("folder");
      request.onsuccess = () => resolve(request.result as DirHandle | undefined);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return handle ?? null;
  } catch {
    return null;
  }
}

async function rememberFolder(handle: DirHandle): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(handle, "folder");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export function safeDownloadName(name: string): string {
  const base = name.trim().split(/[\\/]/).pop() || "download";
  const cleaned = base.replace(/[<>:"|?*\u0000-\u001f]/g, "-").replace(/^\.+$/, "").trim();
  return (cleaned || "download").slice(0, 180);
}

export async function downloadFolderLabel(): Promise<string> {
  if (await isDesktopHost()) {
    const response = await fetch("/__downloads");
    const payload = (await response.json().catch(() => ({}))) as { path?: string };
    folderLabel = payload.path || "";
    return folderLabel;
  }
  const handle = folderHandle ?? (await storedFolder());
  if (!handle) return "";
  const permission = await handle.queryPermission?.({ mode: "readwrite" }).catch(() => "prompt");
  if (permission && permission !== "granted") return "";
  folderHandle = handle;
  folderLabel = handle.name;
  return handle.name;
}

export async function chooseDownloadFolder(): Promise<string | null> {
  if (await isDesktopHost()) {
    const response = await fetch("/__downloads/choose", { method: "POST" });
    const payload = (await response.json().catch(() => ({}))) as { cancelled?: boolean; path?: string; message?: string };
    if (!response.ok) throw new Error(payload.message || "Could not choose that folder.");
    if (payload.cancelled || !payload.path) return null;
    folderLabel = payload.path;
    return payload.path;
  }
  const choose = directoryPicker();
  if (!choose) throw new Error("Choosing a download folder is in the Windows app. This preview saves files with the browser download.");
  try {
    const handle = await choose({ mode: "readwrite" });
    await rememberFolder(handle);
    folderHandle = handle;
    folderLabel = handle.name;
    return handle.name;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    throw error instanceof Error ? error : new Error("Could not use that folder.");
  }
}

async function writeToFolder(name: string, blob: Blob): Promise<boolean> {
  const safe = safeDownloadName(name);
  if (await isDesktopHost()) {
    const response = await fetch("/__downloads/file", {
      method: "POST",
      headers: { "Content-Type": blob.type || "application/octet-stream", "X-Filename": safe },
      body: blob,
    });
    const payload = (await response.json().catch(() => ({}))) as { missing?: boolean; message?: string };
    if (payload.missing) return false;
    if (!response.ok) throw new Error(payload.message || "Could not save that file.");
    return true;
  }
  const handle = folderHandle ?? (await storedFolder());
  if (!handle) return false;
  const permission = await handle.queryPermission?.({ mode: "readwrite" }).catch(() => "prompt");
  if (permission && permission !== "granted") return false;
  folderHandle = handle;
  const file = await handle.getFileHandle(safe, { create: true });
  const writable = await file.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}

function anchorDownload(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeDownloadName(name);
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function saveNamedFile(name: string, blob: Blob): Promise<string> {
  const safe = safeDownloadName(name);
  if (await writeToFolder(safe, blob)) return safe;
  const choose = picker();
  if (choose) {
    try {
      const handle = await choose({ suggestedName: safe });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return safe;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "";
    }
  }
  anchorDownload(safe, blob);
  return safe;
}

export async function savePngFile(name: string, bytes: Uint8Array): Promise<string> {
  const safe = safeDownloadName(name.toLowerCase().endsWith(".png") ? name : `${name}.png`);
  const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([copy], { type: "image/png" });
  if (await writeToFolder(safe, blob)) return safe;
  if (await isDesktopHost()) {
    const response = await fetch("/__save-png", {
      method: "POST",
      headers: { "Content-Type": "image/png", "X-Filename": safe },
      body: blob,
    });
    const payload = (await response.json().catch(() => ({}))) as { cancelled?: boolean; path?: string; message?: string };
    if (response.ok) {
      if (payload.cancelled) return "";
      return payload.path || safe;
    }
    if (response.status !== 501) throw new Error(payload.message || "Could not save that file.");
  }
  return saveNamedFile(safe, blob);
}
