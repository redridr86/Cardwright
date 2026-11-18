import { useEffect, useState } from "react";
import { Download, MessageCircle, Search, Trash2, Upload } from "lucide-react";
import { LibraryLocation } from "@/components/library-location";
import { slugName, toCharacterCardV2 } from "@/lib/card";
import { deleteChatRecord, loadChat, loadChatSummaries, saveChat, savedChatFrom, type ChatHead } from "@/lib/chats";
import type { ChatSummary } from "@/lib/chat";
import { loadMedia, portraitOf } from "@/lib/images";
import { pickCardFile } from "@/lib/pick-file";
import { savePngFile, saveNamedFile } from "@/lib/save-file";
import { useStudio, type ShelfItem } from "@/lib/studio-store";
import { vaultDelete, vaultGet, vaultList } from "@/lib/vault";

export type LibraryKind = "cards" | "personas" | "pictures" | "chats";

export function LibraryTab({
  cards,
  personas,
  kind,
  onKind,
  onOpenCard,
  onOpenPersona,
  onChatCard,
  onChatPersona,
  onDeleteCard,
  onDeletePersona,
  onImportCard,
  onContinueChat,
}: {
  cards: ShelfItem[];
  personas: ShelfItem[];
  kind: LibraryKind;
  onKind: (kind: LibraryKind) => void;
  onOpenCard: (id: string) => void;
  onOpenPersona: (id: string) => void;
  onChatCard: (item: ShelfItem) => void;
  onChatPersona: (item: ShelfItem) => void;
  onDeleteCard: (id: string) => void;
  onDeletePersona: (id: string) => void;
  onImportCard: (file: File) => void;
  onContinueChat: () => void;
}) {
  const [query, setQuery] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const source = kind === "cards" ? cards : personas;
  const needle = query.trim().toLowerCase();
  const items = source.filter((item) => {
    if (!needle) return true;
    const haystack = [item.name, item.card.summary, item.card.description, item.card.tags.join(" ")].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
  const kindClass = (selected: boolean) => `min-h-11 rounded-md px-4 text-sm font-semibold ${selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
      <LibraryLocation />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-fg">Library</h2>
          <p className="text-sm text-muted">
            {kind === "chats"
              ? "No slot limit. Saved chats stay in the folder above."
              : "No slot limit. Cards, personas, pictures, and chats stay in the folder above."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={kind === "cards"} onClick={() => onKind("cards")} className={kindClass(kind === "cards")}>
            Cards
          </button>
          <button type="button" aria-pressed={kind === "personas"} onClick={() => onKind("personas")} className={kindClass(kind === "personas")}>
            Personas
          </button>
          <button type="button" aria-pressed={kind === "chats"} onClick={() => onKind("chats")} className={kindClass(kind === "chats")}>
            Chats
          </button>
          <button type="button" aria-pressed={kind === "pictures"} onClick={() => onKind("pictures")} className={kindClass(kind === "pictures")}>
            Pictures
          </button>
          {kind === "cards" ? (
            <button
              type="button"
              onClick={() => {
                setImportError(null);
                void pickCardFile()
                  .then((file) => {
                    if (file) onImportCard(file);
                  })
                  .catch((err) => setImportError(err instanceof Error ? err.message : "Could not open that card."));
              }}
              className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg"
            >
              <Upload className="size-4" aria-hidden="true" />
              Import
            </button>
          ) : null}
        </div>
      </div>
      <label className="relative block">
        <span className="sr-only">Search the library</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={kind === "cards" ? "Search cards" : kind === "personas" ? "Search personas" : kind === "chats" ? "Search chats" : "Search pictures"}
          className="min-h-11 w-full rounded-md border border-border bg-surface pr-3 pl-10 text-sm text-fg"
        />
      </label>
      {importError ? (
        <p role="alert" className="rounded-md border border-primary bg-surface px-3 py-2 text-sm">
          {importError}
        </p>
      ) : null}
      {kind === "pictures" ? (
        <PictureGrid query={needle} />
      ) : kind === "chats" ? (
        <ChatLibrary query={needle} onContinue={onContinueChat} />
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted">
          {source.length === 0
            ? kind === "cards"
              ? "Keep a card from the Card tab and it will show up here."
              : "Keep a persona from the Persona tab and it will show up here."
            : "Nothing matches that search."}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col rounded-lg bg-paper p-4 text-ink shadow-xl">
                <Thumb mediaKey={kind === "cards" ? item.id : `persona:${item.id}`} />
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{item.name}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{item.card.summary.trim() || "No summary."}</p>
                {item.card.tags.length > 0 ? (
                  <p className="mt-2 text-xs text-ink-soft">{item.card.tags.slice(0, 4).join(" · ")}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => (kind === "cards" ? onOpenCard(item.id) : onOpenPersona(item.id))}
                    className="min-h-11 rounded-md bg-ink px-3 text-sm font-semibold text-paper"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => (kind === "cards" ? onChatCard(item) : onChatPersona(item))}
                    className="flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(toCharacterCardV2(item.card), null, 2)], { type: "application/json" });
                      void saveNamedFile(`${slugName(item.name)}.json`, blob);
                    }}
                    className="flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    JSON
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => (kind === "cards" ? onDeleteCard(item.id) : onDeletePersona(item.id))}
                    className="flex size-11 items-center justify-center rounded-md text-ink-soft"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function ChatLibrary({ query, onContinue }: { query: string; onContinue: () => void }) {
  const chatIndex = useStudio((state) => state.chatIndex);
  const setChatIndex = useStudio((state) => state.setChatIndex);
  const activeId = useStudio((state) => state.chatId);
  const activeTitle = useStudio((state) => state.chatTitle);
  const activeCard = useStudio((state) => state.chatCard);
  const activeCast = useStudio((state) => state.chatCast);
  const activeMessages = useStudio((state) => state.chatMessages);
  const activeKey = useStudio((state) => state.chatCardKey);
  const [loaded, setLoaded] = useState<ChatSummary[]>([]);
  const [tick, setTick] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const bump = () => setTick((value) => value + 1);
    window.addEventListener("cardwright-vault", bump);
    return () => window.removeEventListener("cardwright-vault", bump);
  }, []);

  useEffect(() => {
    let cancel = false;
    void loadChatSummaries().then((list) => {
      if (cancel) return;
      setLoaded(list);
      const current = useStudio.getState().chatIndex;
      const heads: ChatHead[] = list.map((item) => {
        const live = current.find((chat) => chat.id === item.id);
        if (live && live.updatedAt > item.updatedAt) return live;
        return { id: item.id, title: item.title, cardName: item.cardName, updatedAt: item.updatedAt };
      });
      for (const live of current) {
        if (!heads.some((item) => item.id === live.id)) heads.push(live);
      }
      setChatIndex(heads.sort((a, b) => b.updatedAt - a.updatedAt));
    });
    return () => {
      cancel = true;
    };
  }, [tick, setChatIndex]);

  const listed = chatIndex.map((head) => {
    const known = loaded.find((item) => item.id === head.id);
    return {
      id: head.id,
      title: head.title || known?.title || "Untitled chat",
      cardName: head.cardName || known?.cardName || "Chat",
      updatedAt: head.updatedAt,
      messages: known?.messages ?? 0,
      snippet: known?.snippet || "",
      cardKey: known?.cardKey || "",
    };
  });
  if (activeId && activeCard && !listed.some((item) => item.id === activeId)) {
    const names = (activeCast.length ? activeCast : [{ card: activeCard }]).map((member) => member.card.name.trim()).filter(Boolean);
    const last = [...activeMessages].reverse().find((turn) => turn.text.trim());
    listed.unshift({
      id: activeId,
      title: activeTitle.trim() || activeCard.name.trim() || "Untitled chat",
      cardName: names.join(", ") || "Chat",
      updatedAt: Date.now(),
      messages: activeMessages.length,
      snippet: (last?.text || "").trim().replace(/\s+/g, " ").slice(0, 160),
      cardKey: activeKey || "",
    });
  }
  const rows = listed.filter((item) => {
    if (!query) return true;
    return `${item.title} ${item.cardName} ${item.snippet}`.toLowerCase().includes(query);
  });

  async function onOpen(id: string) {
    setError(null);
    const saved = await loadChat(id);
    if (!saved) {
      setError("That chat is no longer in the library.");
      setTick((value) => value + 1);
      return;
    }
    useStudio.getState().openSavedChat(saved);
    onContinue();
  }

  async function onDelete(id: string) {
    await deleteChatRecord(id);
    setLoaded((current) => current.filter((item) => item.id !== id));
    setChatIndex(useStudio.getState().chatIndex.filter((item) => item.id !== id));
    if (useStudio.getState().chatId === id) useStudio.getState().clearChat();
  }

  async function onDownload(item: ChatSummary) {
    setBusyId(item.id);
    setError(null);
    try {
      const saved = await loadChat(item.id);
      if (!saved) {
        setError("That chat is no longer in the library.");
        setTick((value) => value + 1);
        return;
      }
      const portable = { ...saved, messages: saved.messages.map((turn) => ({ ...turn, image: null })) };
      const blob = new Blob([JSON.stringify(portable, null, 2)], { type: "application/json" });
      await saveNamedFile(`${slugName(item.title)}.json`, blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that chat.");
    } finally {
      setBusyId(null);
    }
  }

  async function onImport(file: File) {
    setError(null);
    try {
      const parsed = savedChatFrom(JSON.parse(await file.text()) as unknown, crypto.randomUUID());
      if (!parsed) {
        setError("That file is not a Cardwright chat.");
        return;
      }
      const next = { ...parsed, id: crypto.randomUUID(), updatedAt: Date.now() };
      await saveChat(next);
      useStudio.getState().openSavedChat(next);
      const rest = useStudio.getState().chatIndex.filter((item) => item.id !== next.id);
      setChatIndex([{ id: next.id, title: next.title, cardName: next.cardName, updatedAt: next.updatedAt }, ...rest]);
      onContinue();
    } catch {
      setError("Could not read that chat file.");
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg">
          <Upload className="size-4" aria-hidden="true" />
          Import chat
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onImport(file);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      {error ? (
        <p role="alert" className="rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg">
          {error}
        </p>
      ) : null}
      {rows.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted">
          {query ? "Nothing matches that search." : "Start a chat and it will show up here."}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col rounded-lg bg-paper p-4 text-ink shadow-xl">
                <Thumb mediaKey={item.cardKey && item.cardKey !== "editor" ? item.cardKey : `chat:${item.id}`} />
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{item.cardName}</p>
                <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{item.snippet || "No messages yet."}</p>
                <p className="mt-2 text-xs text-ink-soft">
                  {item.messages} {item.messages === 1 ? "message" : "messages"} · {when(item.updatedAt)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void onOpen(item.id)} className="min-h-11 rounded-md bg-ink px-3 text-sm font-semibold text-paper">
                    Open
                  </button>
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => void onDownload(item)}
                    className="flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink disabled:opacity-40"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    JSON
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => void onDelete(item.id)}
                    className="flex size-11 items-center justify-center rounded-md text-ink-soft"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function when(time: number) {
  if (!time) return "";
  return new Date(time).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function PictureGrid({ query }: { query: string }) {
  const [shots, setShots] = useState<{ id: string; name: string; prompt: string; dataUrl: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    const load = () => {
      void (async () => {
        const heads = await vaultList("gallery");
        const loaded: { id: string; name: string; prompt: string; dataUrl: string }[] = [];
        for (const head of heads) {
          const shot = await vaultGet<{ id: string; name: string; prompt: string; dataUrl: string }>("gallery", head.id);
          if (shot?.dataUrl) loaded.push(shot);
        }
        if (!cancel) setShots(loaded);
      })();
    };
    load();
    window.addEventListener("cardwright-vault", load);
    return () => {
      cancel = true;
      window.removeEventListener("cardwright-vault", load);
    };
  }, []);

  const visible = shots.filter((shot) => {
    if (!query) return true;
    return `${shot.name} ${shot.prompt}`.toLowerCase().includes(query);
  });

  if (visible.length === 0) {
    return <p className="rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted">Draw on the NovelAI tab and the pictures are kept here.</p>;
  }

  return (
    <>
      {error ? <p className="text-sm text-muted">{error}</p> : null}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((shot) => (
          <li key={shot.id} className="overflow-hidden rounded-lg bg-paper text-ink shadow-xl">
            <img src={shot.dataUrl} alt={shot.prompt || shot.name} className="aspect-square w-full object-cover" />
            <div className="flex flex-wrap gap-2 p-3">
              <button
                type="button"
                onClick={() => {
                  void (async () => {
                    try {
                      const bytes = new Uint8Array(await (await fetch(shot.dataUrl)).arrayBuffer());
                      await savePngFile(shot.name || "picture.png", bytes);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Could not save that picture.");
                    }
                  })();
                }}
                className="flex min-h-11 items-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-paper"
              >
                <Download className="size-4" aria-hidden="true" />
                Save as
              </button>
              <button
                type="button"
                aria-label={`Delete ${shot.name || "picture"}`}
                onClick={() => {
                  void vaultDelete("gallery", shot.id);
                  setShots((current) => current.filter((item) => item.id !== shot.id));
                }}
                className="flex size-11 items-center justify-center rounded-md text-ink-soft"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Thumb({ mediaKey }: { mediaKey: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancel = false;
    void loadMedia(mediaKey).then((record) => {
      if (!cancel) setSrc(portraitOf(record)?.dataUrl ?? null);
    });
    return () => {
      cancel = true;
    };
  }, [mediaKey]);
  if (!src) return <div className="aspect-[4/3] w-full rounded-md bg-[#e7e0d6]" />;
  return <img src={src} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />;
}
