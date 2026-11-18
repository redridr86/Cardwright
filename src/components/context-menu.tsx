import { useEffect, useState } from "react";
import { spellSuggestions } from "@/lib/spell";

type TextField = HTMLInputElement | HTMLTextAreaElement;

type MenuState = {
  x: number;
  y: number;
  field: TextField | null;
  suggestions: string[];
  word: { start: number; end: number } | null;
  canEdit: boolean;
  hasSelection: boolean;
};

function isTextField(target: EventTarget | null): target is TextField {
  if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return false;
  const type = target instanceof HTMLInputElement ? target.type : "text";
  return !["password", "file", "checkbox", "radio", "range", "color", "button", "submit"].includes(type);
}

function wordRange(value: string, index: number): { start: number; end: number; word: string } {
  let start = Math.max(0, Math.min(index, value.length));
  let end = start;
  while (start > 0 && /[A-Za-z']/.test(value[start - 1] || "")) start -= 1;
  while (end < value.length && /[A-Za-z']/.test(value[end] || "")) end += 1;
  return { start, end, word: value.slice(start, end) };
}

function setFieldValue(field: TextField, value: string, from: number, to: number) {
  const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  setter?.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.focus();
  field.setSelectionRange(from, to);
}

export function ContextMenu() {
  const [menu, setMenu] = useState<MenuState | null>(null);

  useEffect(() => {
    const onContext = (event: MouseEvent) => {
      const field = isTextField(event.target) ? event.target : null;
      const selected = window.getSelection()?.toString() ?? "";
      if (!field && !selected.trim()) return;
      event.preventDefault();
      let suggestions: string[] = [];
      let word: MenuState["word"] = null;
      let hasSelection = selected.trim().length > 0;
      if (field && !field.readOnly && !field.disabled && field.spellcheck !== false) {
        const cursor = field.selectionStart ?? 0;
        const end = field.selectionEnd ?? cursor;
        hasSelection = end !== cursor || hasSelection;
        const range = wordRange(field.value, end === cursor ? cursor : end);
        if (range.word) {
          suggestions = spellSuggestions(range.word);
          if (suggestions.length) word = { start: range.start, end: range.end };
        }
      }
      const width = 220;
      const height = 48 * (suggestions.length + 4) + 16;
      setMenu({
        x: Math.max(8, Math.min(event.clientX, window.innerWidth - width - 8)),
        y: Math.max(8, Math.min(event.clientY, window.innerHeight - Math.min(height, window.innerHeight - 16))),
        field,
        suggestions,
        word,
        canEdit: Boolean(field && !field.readOnly && !field.disabled),
        hasSelection,
      });
    };
    const close = () => setMenu(null);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("contextmenu", onContext);
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!menu) return null;

  function run(action: () => void) {
    action();
    setMenu(null);
  }

  const itemClass = "flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2 disabled:opacity-40";

  return (
    <div
      role="menu"
      className="fixed z-50 w-56 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-2xl"
      style={{ left: menu.x, top: menu.y }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {menu.suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          role="menuitem"
          className={itemClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run(() => {
              const field = menu.field;
              const word = menu.word;
              if (!field || !word) return;
              const next = field.value.slice(0, word.start) + suggestion + field.value.slice(word.end);
              setFieldValue(field, next, word.start, word.start + suggestion.length);
            })
          }
        >
          {suggestion}
        </button>
      ))}
      {menu.suggestions.length ? <div className="my-1 border-t border-border" /> : null}
      <button
        type="button"
        role="menuitem"
        className={itemClass}
        disabled={!menu.canEdit || !menu.hasSelection}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => run(() => document.execCommand("cut"))}
      >
        Cut
      </button>
      <button
        type="button"
        role="menuitem"
        className={itemClass}
        disabled={!menu.hasSelection}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => run(() => document.execCommand("copy"))}
      >
        Copy
      </button>
      <button
        type="button"
        role="menuitem"
        className={itemClass}
        disabled={!menu.canEdit}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          run(() => {
            const field = menu.field;
            void navigator.clipboard
              .readText()
              .then((text) => {
                if (!field) return;
                const start = field.selectionStart ?? field.value.length;
                const end = field.selectionEnd ?? start;
                const next = field.value.slice(0, start) + text + field.value.slice(end);
                setFieldValue(field, next, start + text.length, start + text.length);
              })
              .catch(() => {
                field?.focus();
                document.execCommand("paste");
              });
          })
        }
      >
        Paste
      </button>
      <button
        type="button"
        role="menuitem"
        className={itemClass}
        disabled={!menu.field}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          run(() => {
            menu.field?.focus();
            menu.field?.select();
          })
        }
      >
        Select all
      </button>
    </div>
  );
}
