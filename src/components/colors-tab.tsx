import { RotateCcw } from "lucide-react";
import { ChatColors } from "@/components/chat-colors";
import { DEFAULT_THEME, type AppTheme } from "@/lib/look";
import { useStudio } from "@/lib/studio-store";

const FIELDS: { key: keyof AppTheme; label: string; hint: string }[] = [
  { key: "bg", label: "Background", hint: "The app behind the panels" },
  { key: "surface", label: "Panels", hint: "Cards, menus, and sidebars" },
  { key: "surface2", label: "Raised", hint: "Buttons and inputs on panels" },
  { key: "fg", label: "Text", hint: "Writing on the dark panels" },
  { key: "muted", label: "Muted", hint: "Hints and labels" },
  { key: "border", label: "Lines", hint: "Borders and dividers" },
  { key: "primary", label: "Accent", hint: "The main action color" },
  { key: "primaryFg", label: "Accent text", hint: "Writing on the accent" },
  { key: "paper", label: "Chat paper", hint: "The page behind messages" },
  { key: "ink", label: "Chat text", hint: "Narration on the paper" },
  { key: "inkSoft", label: "Chat secondary", hint: "Small notes in a chat" },
  { key: "gold", label: "Your mark", hint: "The bar beside your messages" },
];

export function ColorsTab() {
  const theme = { ...DEFAULT_THEME, ...useStudio((state) => state.theme) };
  const setTheme = useStudio((state) => state.setTheme);
  const card = useStudio((state) => state.card);
  const patchCard = useStudio((state) => state.patchCard);

  function setField(key: keyof AppTheme, value: string) {
    setTheme({ ...theme, [key]: value });
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-2">
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold">App colors</h2>
          <button
            type="button"
            onClick={() => setTheme(DEFAULT_THEME)}
            className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
        </div>
        <p className="mt-1 text-sm text-muted">These colors are saved with the app. Character colors stay on each card.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <label key={field.key} className="block text-xs font-semibold tracking-wide text-muted uppercase">
              {field.label}
              <span className="mt-1 flex min-w-0 gap-2">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(String(theme[field.key])) ? String(theme[field.key]) : "#12100e"}
                  aria-label={field.label}
                  onChange={(event) => setField(field.key, event.target.value)}
                  className="size-11 shrink-0 rounded-md border border-border bg-bg"
                />
                <input
                  value={String(theme[field.key])}
                  onChange={(event) => setField(field.key, event.target.value)}
                  className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg normal-case"
                />
              </span>
              <span className="mt-1 block text-xs font-normal tracking-normal text-muted normal-case">{field.hint}</span>
            </label>
          ))}
        </div>
        <label className="mt-4 block text-xs font-semibold tracking-wide text-muted uppercase">
          Default dialogue color
          <input
            value={theme.dialogueDefault}
            placeholder="Used when a character’s dialogue color is empty"
            onChange={(event) => setField("dialogueDefault", event.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg normal-case"
          />
        </label>
        <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-fg">
          <input
            type="checkbox"
            checked={theme.boldDialogue}
            onChange={(event) => setTheme({ ...theme, boldDialogue: event.target.checked })}
            className="size-4 accent-primary"
          />
          Bold text inside quotation marks
        </label>
        <label className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
          Chat text size {theme.chatTextSize}
          <input
            type="range"
            min={12}
            max={22}
            value={theme.chatTextSize}
            onChange={(event) => setTheme({ ...theme, chatTextSize: Number(event.target.value) })}
            className="mt-2 w-full accent-primary"
          />
          <span className="mt-1 block text-xs font-normal tracking-normal text-muted normal-case">Size of the writing in a chat.</span>
        </label>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="font-display text-lg font-semibold">This character</h2>
        <p className="mt-1 text-sm text-muted">Saved on the card in the editor. A running chat keeps its own copy until you change it there.</p>
        <div className="mt-4">
          <ChatColors look={card.chatLook} theme={theme} name={card.name} onChange={(chatLook) => patchCard({ chatLook })} />
        </div>
        <label htmlFor="cardAliases" className="mt-4 block text-xs font-semibold tracking-wide text-muted uppercase">
          Aliases
          <textarea
            id="cardAliases"
            value={card.aliases ?? ""}
            rows={3}
            placeholder="Nicknames, one per line. A group chat answers when you write one."
            onChange={(event) => patchCard({ aliases: event.target.value })}
            className="mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg normal-case"
          />
        </label>
        <p className="mt-1 text-xs text-muted">Aliases are saved on this card and exported with it.</p>
      </section>
    </main>
  );
}
