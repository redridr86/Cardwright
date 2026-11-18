import { useRef, useState } from "react";
import { Download, Plus, Trash2, Upload } from "lucide-react";
import { LibraryLocation } from "@/components/library-location";
import { bookToFile, emptyBook, emptyEntry, lorebookFromUnknown, type LoreEntry, type Lorebook } from "@/lib/lore";
import { saveNamedFile } from "@/lib/save-file";
import { useStudio } from "@/lib/studio-store";
import { deleteBook, saveBook } from "@/lib/vault";

export function LoreTab() {
  const lorebooks = useStudio((state) => state.lorebooks);
  const worldbooks = useStudio((state) => state.worldbooks);
  const upsertLore = useStudio((state) => state.upsertLore);
  const upsertWorld = useStudio((state) => state.upsertWorld);
  const removeLore = useStudio((state) => state.removeLore);
  const removeWorld = useStudio((state) => state.removeWorld);
  const card = useStudio((state) => state.card);
  const patchCard = useStudio((state) => state.patchCard);
  const [kind, setKind] = useState<Lorebook["kind"]>("lore");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const books = kind === "world" ? worldbooks : lorebooks;
  const selected = books.find((book) => book.id === (selectedId ?? books[0]?.id)) ?? null;

  async function persist(book: Lorebook) {
    const next = { ...book, kind, updatedAt: Date.now() };
    if (kind === "world") upsertWorld(next);
    else upsertLore(next);
    setSelectedId(next.id);
    await saveBook(next);
  }

  function change(book: Lorebook, recipe: (current: Lorebook) => Lorebook) {
    void persist(recipe(book)).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not save that book.");
    });
  }

  async function onImport(file: File) {
    setError(null);
    try {
      const parsed = lorebookFromUnknown(
        JSON.parse(await file.text()) as unknown,
        file.name.replace(/\.marinara\.json$/i, "").replace(/\.json$/i, ""),
      );
      if (!parsed) {
        setError("That file has no lore entries. Use a character book or a world book JSON.");
        return;
      }
      const next = { ...parsed, id: crypto.randomUUID(), kind };
      await persist(next);
      setNotice(
        next.entries.length
          ? `Imported ${next.name} with ${next.entries.length} entries.`
          : `Imported ${next.name}, but that file had no entries.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "That file could not be read.");
    }
  }

  async function onDownload(book: Lorebook) {
    const filename = `${book.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "lorebook"}.json`;
    const blob = new Blob([JSON.stringify(bookToFile(book), null, 2)], { type: "application/json" });
    const saved = await saveNamedFile(filename, blob);
    if (saved) setNotice(`Saved ${saved}.`);
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
      <LibraryLocation />
      {error ? (
        <p role="alert" className="rounded-md border border-primary bg-surface px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{notice}</p> : null}
      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <section className="rounded-lg border border-border bg-surface p-3">
          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={kind === "lore"}
              onClick={() => {
                setKind("lore");
                setSelectedId(null);
              }}
              className={kindButton(kind === "lore")}
            >
              Lorebooks
            </button>
            <button
              type="button"
              aria-pressed={kind === "world"}
              onClick={() => {
                setKind("world");
                setSelectedId(null);
              }}
              className={kindButton(kind === "world")}
            >
              World books
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                const book = emptyBook(kind);
                void persist(book).then(() => setNotice(`${book.name} is ready.`));
              }}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg"
            >
              <Plus className="size-4" aria-hidden="true" />
              New
            </button>
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold"
            >
              <Upload className="size-4" aria-hidden="true" />
              Import
            </button>
          </div>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json,.marinara.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onImport(file);
              event.target.value = "";
            }}
          />
          <ul className="mt-3 flex flex-col gap-1">
            {books.length === 0 ? (
              <li className="px-2 py-3 text-sm text-muted">No {kind === "world" ? "world books" : "lorebooks"} yet.</li>
            ) : null}
            {books.map((book) => (
              <li key={book.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(book.id)}
                  className={`min-h-11 w-full rounded-md px-3 text-left text-sm ${selected?.id === book.id ? "bg-surface-2 text-fg" : "text-muted"}`}
                >
                  {book.name}
                  <span className="mt-0.5 block text-xs">{book.entries.length} entries</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        {selected ? (
          <BookEditor
            book={selected}
            linked={card.lorebookId === selected.id}
            onLink={() => {
              const linked = card.lorebookId === selected.id;
              patchCard({ lorebookId: linked ? "" : selected.id });
              setNotice(linked ? "Unlinked from the card in the editor." : "New chats with the card in the editor include this lorebook.");
            }}
            onChange={(recipe) => change(selected, recipe)}
            onDownload={() => void onDownload(selected)}
            onDelete={() => {
              const id = selected.id;
              if (kind === "world") removeWorld(id);
              else removeLore(id);
              if (card.lorebookId === id) patchCard({ lorebookId: "" });
              void deleteBook(kind, id);
              setSelectedId(null);
              setNotice("Deleted.");
            }}
          />
        ) : (
          <section className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
            Lorebooks belong to a character and fire when a keyword shows up in the chat. World books are the same idea for a place or a cast, and you turn them on per chat.
          </section>
        )}
      </div>
    </main>
  );
}

function kindButton(selected: boolean) {
  return `min-h-11 flex-1 rounded-md px-2 text-sm font-semibold ${selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`;
}

function BookEditor({
  book,
  linked,
  onLink,
  onChange,
  onDownload,
  onDelete,
}: {
  book: Lorebook;
  linked: boolean;
  onLink: () => void;
  onChange: (recipe: (current: Lorebook) => Lorebook) => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  function patchEntry(id: string, patch: Partial<LoreEntry>) {
    onChange((current) => ({
      ...current,
      entries: current.entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    }));
  }

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDownload}
          className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold"
        >
          <Download className="size-4" aria-hidden="true" />
          Export
        </button>
        {book.kind === "lore" ? (
          <button
            type="button"
            onClick={onLink}
            className="min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold"
          >
            {linked ? "Linked to this card" : "Link to the card"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDelete}
          className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-primary"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </button>
      </div>
      <label className="block text-xs font-semibold tracking-wide text-muted uppercase">
        Name
        <input
          value={book.name}
          onChange={(event) => onChange((current) => ({ ...current, name: event.target.value }))}
          className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg normal-case"
        />
      </label>
      <label className="block text-xs font-semibold tracking-wide text-muted uppercase">
        Description
        <textarea
          value={book.description}
          rows={2}
          onChange={(event) => onChange((current) => ({ ...current, description: event.target.value }))}
          className="mt-1 min-h-16 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg normal-case"
        />
      </label>
      <label className="block text-xs font-semibold tracking-wide text-muted uppercase">
        Scan depth {book.scanDepth}
        <input
          type="range"
          min={1}
          max={20}
          value={book.scanDepth}
          onChange={(event) => onChange((current) => ({ ...current, scanDepth: Number(event.target.value) }))}
          className="mt-2 w-full accent-primary"
        />
      </label>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">Entries</h3>
        <button
          type="button"
          onClick={() => onChange((current) => ({ ...current, entries: [...current.entries, emptyEntry()] }))}
          className="flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg"
        >
          <Plus className="size-4" aria-hidden="true" />
          Entry
        </button>
      </div>
      {book.entries.length === 0 ? <p className="text-sm text-muted">Add an entry with keywords. Constant entries are always included.</p> : null}
      <div className="flex flex-col gap-3">
        {book.entries.map((entry) => (
          <article key={entry.id} className="rounded-md border border-border bg-bg p-3">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]">
              <input
                value={entry.name}
                placeholder="Entry name"
                onChange={(event) => patchEntry(entry.id, { name: event.target.value })}
                className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
              />
              <input
                type="number"
                value={entry.order}
                aria-label="Order"
                onChange={(event) => patchEntry(entry.id, { order: Number(event.target.value) })}
                className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
              />
            </div>
            <input
              value={entry.keys}
              placeholder="Keywords, separated by commas"
              onChange={(event) => patchEntry(entry.id, { keys: event.target.value })}
              className="mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
            />
            <textarea
              value={entry.content}
              rows={4}
              placeholder="What the model should know when this entry is active"
              onChange={(event) => patchEntry(entry.id, { content: event.target.value })}
              className="mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  onChange={(event) => patchEntry(entry.id, { enabled: event.target.checked })}
                  className="size-4 accent-primary"
                />
                On
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={entry.constant}
                  onChange={(event) => patchEntry(entry.id, { constant: event.target.checked })}
                  className="size-4 accent-primary"
                />
                Always
              </label>
              <button
                type="button"
                onClick={() => onChange((current) => ({ ...current, entries: current.entries.filter((item) => item.id !== entry.id) }))}
                className="ml-auto flex size-11 items-center justify-center rounded-md text-primary"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                <span className="sr-only">Remove entry</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
