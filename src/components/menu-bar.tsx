import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { runCommand } from "@/lib/commands";
import { isDesktopHost } from "@/lib/kobold";
import { useStudio } from "@/lib/studio-store";

export function MenuBar() {
  const [open, setOpen] = useState<string | null>(null);
  const [desktop, setDesktop] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const fillBlanks = useStudio((state) => state.fillBlanks);
  const useImages = useStudio((state) => state.settings.useImages !== false);
  const setFillBlanks = useStudio((state) => state.setFillBlanks);
  const patchSettings = useStudio((state) => state.patchSettings);

  useEffect(() => {
    void isDesktopHost().then(setDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(name: string | null) {
    setOpen(name);
  }

  function item(label: string, command: string) {
    return (
      <button
        type="button"
        role="menuitem"
        className="flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2"
        onClick={() => {
          setOpen(null);
          runCommand(command);
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div ref={barRef} role="menubar" className="flex min-h-11 flex-wrap items-stretch border-b border-border bg-surface text-sm">
      <Menu label="File" open={open === "file"} onOpen={() => choose(open === "file" ? null : "file")} onHover={() => open && choose("file")}>
        {item("New card", "file.new")}
        {item("Import card…", "file.import")}
        {item("Export JSON", "file.exportJson")}
        {item("Export PNG card", "file.exportPng")}
        <Divider />
        {item("Library folder…", "file.libraryFolder")}
        {item("Download folder…", "file.downloadFolder")}
        {item("Save settings…", "file.saveSettings")}
        {item("Load settings…", "file.loadSettings")}
        {desktop ? (
          <>
            <Divider />
            {item("Exit", "file.exit")}
          </>
        ) : null}
      </Menu>
      <Menu label="Card" open={open === "card"} onOpen={() => choose(open === "card" ? null : "card")} onHover={() => open && choose("card")}>
        {item("Write the card", "card.write")}
        {item("Keep draft", "card.keep")}
        {item("Copy JSON", "card.copy")}
        {item("Show card", "nav.card")}
      </Menu>
      <Menu
        label="Persona"
        open={open === "persona"}
        onOpen={() => choose(open === "persona" ? null : "persona")}
        onHover={() => open && choose("persona")}
      >
        {item("Show persona", "nav.persona")}
        <button
          type="button"
          role="menuitem"
          className="flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2"
          onClick={() => {
            setOpen(null);
            runCommand("nav.persona");
            window.setTimeout(() => runCommand("persona.write"), 60);
          }}
        >
          Write the persona
        </button>
        <button
          type="button"
          role="menuitem"
          className="flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2"
          onClick={() => {
            setOpen(null);
            runCommand("nav.persona");
            window.setTimeout(() => runCommand("persona.keep"), 60);
          }}
        >
          Keep persona
        </button>
        <button
          type="button"
          role="menuitem"
          className="flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2"
          onClick={() => {
            setOpen(null);
            runCommand("nav.persona");
            window.setTimeout(() => runCommand("persona.new"), 60);
          }}
        >
          New persona
        </button>
      </Menu>
      <Menu label="Library" open={open === "library"} onOpen={() => choose(open === "library" ? null : "library")} onHover={() => open && choose("library")}>
        {item("Show library", "nav.library")}
        {item("Chat library", "nav.chats")}
        {item("Import card…", "file.import")}
      </Menu>
      <Menu label="Chat" open={open === "chat"} onOpen={() => choose(open === "chat" ? null : "chat")} onHover={() => open && choose("chat")}>
        {item("Show chat", "nav.chat")}
        {item("Chat library", "nav.chats")}
      </Menu>
      <Menu label="Life" open={open === "life"} onOpen={() => choose(open === "life" ? null : "life")} onHover={() => open && choose("life")}>
        {item("Show Life", "nav.life")}
      </Menu>
      <Menu label="Lore" open={open === "lore"} onOpen={() => choose(open === "lore" ? null : "lore")} onHover={() => open && choose("lore")}>
        {item("Lorebooks and world books", "nav.lore")}
      </Menu>
      <Menu label="Presets" open={open === "preset"} onOpen={() => choose(open === "preset" ? null : "preset")} onHover={() => open && choose("preset")}>
        {item("Show presets", "nav.preset")}
      </Menu>
      <Menu label="NovelAI" open={open === "novel"} onOpen={() => choose(open === "novel" ? null : "novel")} onHover={() => open && choose("novel")}>
        {item("Draw", "novel.draw")}
        {item("Test NovelAI", "novel.test")}
        {item("Use appearance", "novel.appearance")}
        {item("Show NovelAI", "nav.novel")}
      </Menu>
      <Menu
        label="Settings"
        open={open === "settings"}
        onOpen={() => choose(open === "settings" ? null : "settings")}
        onHover={() => open && choose("settings")}
      >
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={fillBlanks}
          className="flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm text-fg hover:bg-surface-2"
          onClick={() => setFillBlanks(!fillBlanks)}
        >
          <Check className={`size-4 ${fillBlanks ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
          Fill empty fields only
        </button>
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={useImages}
          className="flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm text-fg hover:bg-surface-2"
          onClick={() => patchSettings({ useImages: !useImages })}
        >
          <Check className={`size-4 ${useImages ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
          Send pictures to the model
        </button>
        <Divider />
        {item("KoboldCPP…", "nav.card")}
        {item("Appearance…", "nav.colors")}
        {item("Lorebooks…", "nav.lore")}
        {item("NovelAI generation…", "nav.novel")}
        {item("Presets…", "nav.preset")}
        {item("Library folder…", "file.libraryFolder")}
        {item("Download folder…", "file.downloadFolder")}
        <Divider />
        {item("Save settings…", "file.saveSettings")}
        {item("Load settings…", "file.loadSettings")}
      </Menu>
    </div>
  );
}

function Menu({
  label,
  open,
  onOpen,
  onHover,
  children,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onHover: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={onHover}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onOpen}
        className={`min-h-11 px-3 ${open ? "bg-surface-2 text-fg" : "text-fg"}`}
      >
        {label}
      </button>
      {open ? (
        <div role="menu" aria-label={label} className="absolute top-full left-0 z-40 min-w-56 border border-border bg-surface py-1 shadow-xl">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-border" role="separator" />;
}
