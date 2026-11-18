import { useEffect, useRef, useState, type ReactNode } from "react";
import { BookOpen, Download, ImagePlus, Link2, Monitor, Plus, RefreshCw, Save, Shuffle, Star, Trash2, Upload, X } from "lucide-react";
import {
  LONG_FIELDS,
  type StringField,
  slugName,
  tagsToText,
  textToTags,
  toCharacterCardV2,
  wordCount,
  cardFromUnknown,
  creatorFromPersona,
} from "@/lib/card";
import {
  EMPTY_MEDIA,
  IMAGE_LIMIT,
  addImages,
  deleteMedia,
  fileToImage,
  loadMedia,
  migrateLegacyMedia,
  portraitOf,
  placePortrait,
  removeImage,
  saveMedia,
  type MediaRecord,
  type RefImage,
} from "@/lib/images";
import { explainFetchError, generateCard, isDesktopHost, probeKobold, rewriteField } from "@/lib/kobold";
import { appearancePrompt } from "@/lib/novelai";
import { DEFAULT_THEME } from "@/lib/look";
import { ChatColors } from "@/components/chat-colors";
import { ContextMenu } from "@/components/context-menu";
import { MenuBar } from "@/components/menu-bar";
import { NovelTab } from "@/components/novel-tab";
import { PersonaTab } from "@/components/persona-tab";
import { LibraryTab, type LibraryKind } from "@/components/library-tab";
import { ChatTab } from "@/components/chat-tab";
import { ColorsTab } from "@/components/colors-tab";
import { LoreTab } from "@/components/lore-tab";
import { LifeTab } from "@/components/life-tab";
import { PresetTab } from "@/components/preset-tab";
import {
  applySettings,
  captureSettings,
  openSettingsFile,
  parseSettingsFile,
  quitApp,
  readAutoSettings,
  saveSettingsFile,
  writeAutoSettings,
} from "@/lib/app-settings";
import { applyTheme } from "@/lib/look";
import { lorebookFromUnknown } from "@/lib/lore";
import { loadChat, loadChatHeads } from "@/lib/chats";
import { onCommand } from "@/lib/commands";
import { buildCharacterPng, readCharacterPng } from "@/lib/png-card";
import { chooseDownloadFolder, saveNamedFile } from "@/lib/save-file";
import { pickCardFile } from "@/lib/pick-file";
import { useStudio, type CardRevision } from "@/lib/studio-store";
import {
  armLibrarySync,
  chooseVaultFolder,
  disarmLibrarySync,
  importMissingShelf,
  loadPresetList,
  loadShelf,
  saveBook,
  loadBookList,
  syncShelf,
} from "@/lib/vault";

const CONCEPTS = [
  { label: "Night librarian", text: "A night librarian who lends unfinished novels and expects them returned with an ending." },
  { label: "Orbital welder", text: "A retired orbital welder who runs a tea stall under a station window." },
  { label: "Last dragon", text: "A polite city archivist who is also the last dragon, and would rather nobody make a fuss." },
  { label: "Dock rigger", text: "A dock rigger who knows every crane by the sound it makes when it is about to fail." },
  { label: "Flood courier", text: "A courier in a flooded city who knows every shortcut and none of the headlines." },
  { label: "Quiet archivist", text: "A quiet archivist who answers questions with the exact page, and almost never with an opinion." },
  { label: "Train cook", text: "A cook on a night train who serves soup to whoever is still awake at the last stop." },
  { label: "Lighthouse keeper", text: "A lighthouse keeper who talks to the weather and only sometimes to people." },
  { label: "Map mender", text: "A map mender who fixes streets that the city pretends were never moved." },
  { label: "Garden locksmith", text: "A locksmith who only opens garden gates, and only after hearing why you need the other side." },
];

const EMPTY_REVISIONS: CardRevision[] = [];

const CURRENT_MEDIA = "current";

async function saveBlob(filename: string, blob: Blob) {
  const saved = await saveNamedFile(filename, blob);
  if (!saved) return false;
  return true;
}

function withImportedLore(raw: unknown) {
  const next = cardFromUnknown(raw);
  const book = lorebookFromUnknown(raw, next.name.trim() || "Card lore");
  if (!book || book.entries.length === 0) return next;
  const stored = { ...book, id: crypto.randomUUID(), kind: "lore" as const, name: book.name.trim() || `${next.name || "Card"} lore` };
  useStudio.getState().upsertLore(stored);
  void saveBook(stored);
  return { ...next, lorebookId: stored.id };
}

export function Studio() {
  const concept = useStudio((s) => s.concept);
  const card = useStudio((s) => s.card);
  const cardDraftId = useStudio((s) => s.cardDraftId);
  const revisions = useStudio((s) => s.shelf.find((item) => item.id === s.cardDraftId)?.revisions ?? EMPTY_REVISIONS);
  const settings = useStudio((s) => s.settings);
  const fillBlanks = useStudio((s) => s.fillBlanks);
  const shelf = useStudio((s) => s.shelf);
  const novelPrompt = useStudio((s) => s.novelPrompt);
  const stylePlate = useStudio((s) => s.stylePlate);
  const persona = useStudio((s) => s.persona);
  const personaConcept = useStudio((s) => s.personaConcept);
  const personaFillBlanks = useStudio((s) => s.personaFillBlanks);
  const personas = useStudio((s) => s.personas);
  const chatCard = useStudio((s) => s.chatCard);
  const chatPersona = useStudio((s) => s.chatPersona);
  const chatMessages = useStudio((s) => s.chatMessages);
  const chatMemory = useStudio((s) => s.chatMemory);
  const chatTitle = useStudio((s) => s.chatTitle);
  const chatId = useStudio((s) => s.chatId);
  const chatLoreIds = useStudio((s) => s.chatLoreIds);
  const chatWorldIds = useStudio((s) => s.chatWorldIds);
  const lorebooks = useStudio((s) => s.lorebooks);
  const theme = useStudio((s) => s.theme);
  const activePresetId = useStudio((s) => s.activePresetId);
  const setConcept = useStudio((s) => s.setConcept);
  const patchCard = useStudio((s) => s.patchCard);
  const replaceCard = useStudio((s) => s.replaceCard);
  const applyGenerated = useStudio((s) => s.applyGenerated);
  const patchSettings = useStudio((s) => s.patchSettings);
  const setFillBlanks = useStudio((s) => s.setFillBlanks);
  const saveToShelf = useStudio((s) => s.saveToShelf);
  const loadFromShelf = useStudio((s) => s.loadFromShelf);
  const removeFromShelf = useStudio((s) => s.removeFromShelf);
  const newCard = useStudio((s) => s.newCard);
  const loadPersona = useStudio((s) => s.loadPersona);
  const removePersona = useStudio((s) => s.removePersona);
  const startChat = useStudio((s) => s.startChat);

  const [hydrated, setHydrated] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkNote, setLinkNote] = useState("Not checked");
  const [media, setMedia] = useState<MediaRecord>(EMPTY_MEDIA);
  const [mediaReady, setMediaReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<"card" | "persona" | "library" | "chat" | "life" | "lore" | "preset" | "novel" | "colors">("card");
  const [libraryKind, setLibraryKind] = useState<LibraryKind>("cards");
  const [versionPick, setVersionPick] = useState("current");
  const [creatorPick, setCreatorPick] = useState("editor");
  const versionBackup = useRef<typeof card | null>(null);
  useEffect(() => {
    setVersionPick("current");
    versionBackup.current = null;
  }, [cardDraftId]);
  const settingsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      await useStudio.persist.rehydrate();
      const saved = await readAutoSettings();
      if (cancel) return;
      const memoryCards = saved?.shelf?.length ? saved.shelf : useStudio.getState().shelf;
      const memoryPersonas = saved?.personas?.length ? saved.personas : useStudio.getState().personas;
      if (saved) {
        useStudio.setState({
          concept: saved.concept,
          card: saved.card,
          settings: saved.settings,
          fillBlanks: saved.fillBlanks,
          novelPrompt: saved.novelPrompt,
          stylePlate: saved.stylePlate,
          cardDraftId: saved.cardDraftId,
          personaConcept: saved.personaConcept,
          persona: saved.persona,
          personaDraftId: saved.personaDraftId,
          personaFillBlanks: saved.personaFillBlanks,
          chatCard: saved.chatCard,
          chatPersona: saved.chatPersona,
          chatMessages: saved.chatMessages,
          activePresetId: saved.activePresetId,
        });
      }
      await migrateLegacyMedia();
      await importMissingShelf("cards", memoryCards);
      await importMissingShelf("personas", memoryPersonas);
      const shelf = await loadShelf("cards");
      const personas = await loadShelf("personas");
      const presets = await loadPresetList();
      const lorebooks = await loadBookList("lore");
      const worldbooks = await loadBookList("world");
      const chatIndex = await loadChatHeads();
      if (cancel) return;
      const active = useStudio.getState().activePresetId;
      armLibrarySync();
      useStudio.setState({
        shelf: shelf.length > 0 ? shelf : memoryCards,
        personas: personas.length > 0 ? personas : memoryPersonas,
        presets,
        lorebooks,
        worldbooks,
        chatIndex,
        activePresetId: active,
      });
      const currentId = useStudio.getState().chatId;
      if (currentId) {
        const saved = await loadChat(currentId);
        if (!cancel && saved) useStudio.getState().openSavedChat(saved);
      }
      setHydrated(true);
      setSettingsReady(true);
    })().catch(() => {
      if (cancel) return;
      armLibrarySync();
      setHydrated(true);
      setSettingsReady(true);
    });
    void loadMedia(CURRENT_MEDIA).then((record) => {
      if (cancel) return;
      setMedia(record);
      setMediaReady(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!mediaReady) return;
    void saveMedia(CURRENT_MEDIA, media);
  }, [media, mediaReady]);

  useEffect(() => {
    if (!settingsReady) return;
    const timer = window.setTimeout(() => {
      void writeAutoSettings(captureSettings());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [settingsReady, settings, card, concept, fillBlanks, novelPrompt, stylePlate, persona, personaConcept, personaFillBlanks, chatCard, chatPersona, chatMessages, chatMemory, chatTitle, chatId, chatLoreIds, chatWorldIds, theme, activePresetId]);

  useEffect(() => {
    applyTheme({ ...theme });
  }, [theme]);

  useEffect(() => {
    if (!settingsReady) return;
    const timer = window.setTimeout(() => {
      void syncShelf("cards", useStudio.getState().shelf);
      void syncShelf("personas", useStudio.getState().personas);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [settingsReady, shelf, personas]);

  const useImages = settings.useImages !== false;
  const portrait = portraitOf(media);
  const pictureUrls = useImages ? media.images.map((image) => image.dataUrl) : [];

  async function onAddFiles(list: FileList | File[]) {
    const files = [...list];
    if (files.length === 0) return;
    setError(null);
    setNotice(null);
    const room = IMAGE_LIMIT - media.images.length;
    if (room <= 0) {
      setError("This card already has 200 reference pictures. Remove one to add another. Saved pictures in the library are not capped.");
      return;
    }
    try {
      const incoming: RefImage[] = [];
      for (const file of files.slice(0, room)) incoming.push(await fileToImage(file));
      setMedia((current) => addImages(current, incoming));
      const skipped = files.length - incoming.length;
      setNotice(
        skipped > 0
          ? `Added ${incoming.length}. The rest were skipped because this card is at 200 pictures.`
          : incoming.length === 1
            ? "Added a reference picture."
            : `Added ${incoming.length} reference pictures.`,
      );
    } catch (err) {
      setError(explainFetchError(err));
    }
  }

  async function onProbe() {
    setBusy("Checking KoboldCPP…");
    setError(null);
    setNotice(null);
    try {
      const message = await probeKobold(settings);
      setLinkNote(message);
      setNotice(message);
    } catch (err) {
      const message = explainFetchError(err);
      setLinkNote("Unreachable");
      setError(message);
    } finally {
      setBusy(null);
    }
  }

  async function onGenerate() {
    setBusy("Writing the card…");
    setError(null);
    setNotice(null);
    setTab("card");
    try {
      const next = await generateCard(settings, concept, pictureUrls);
      applyGenerated(next);
      const pictured = pictureUrls.length > 0 ? " Pictures were sent with the prompt." : "";
      setNotice((fillBlanks ? "Filled the empty fields." : "Replaced the card with a new draft.") + pictured);
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setBusy(null);
    }
  }

  async function onRewrite(field: StringField) {
    setBusy(`Rewriting ${field}…`);
    setError(null);
    setNotice(null);
    try {
      const value = await rewriteField(settings, concept, card, field, pictureUrls);
      patchCard({ [field]: value });
      setNotice("Updated that field.");
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setBusy(null);
    }
  }

  function onExport() {
    const blob = new Blob([JSON.stringify(toCharacterCardV2(card), null, 2)], { type: "application/json" });
    void saveBlob(`${slugName(card.name)}.json`, blob)
      .then((saved) => {
        if (saved) setNotice("Saved a Character Card V2 file. Marinara imports it as JSON.");
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not save that file."));
  }

  async function onExportPng() {
    setBusy("Packing the PNG card…");
    setError(null);
    setNotice(null);
    try {
      const blob = await buildCharacterPng(card, portrait?.dataUrl ?? null);
      const saved = await saveBlob(`${slugName(card.name)}.png`, blob);
      if (saved) setNotice("Saved a PNG card. The picture is the portrait, and the card JSON is stored inside the file.");
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setBusy(null);
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(toCharacterCardV2(card), null, 2));
      setNotice("Copied the card JSON.");
      setError(null);
    } catch {
      setError("The browser blocked clipboard access. Use Download instead.");
    }
  }

  function onImport(file: File) {
    const reader = new FileReader();
    const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    reader.onload = () => {
      try {
        if (isPng) {
          const bytes = new Uint8Array(reader.result as ArrayBuffer);
          const parsed = readCharacterPng(bytes);
          useStudio.setState({ card: withImportedLore(parsed) });
          void fileToImage(new File([file], file.name, { type: "image/png" })).then((image) => {
            setMedia({ images: [image], portraitId: image.id });
          });
          setNotice(`Loaded the card inside ${file.name}.`);
        } else {
          const parsed = JSON.parse(String(reader.result)) as unknown;
          useStudio.setState({ card: withImportedLore(parsed) });
          setNotice(`Loaded ${file.name}.`);
        }
        setTab("card");
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "That file is not a character card.");
      }
    };
    if (isPng) reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  }

  function onKeep() {
    const before = card.character_version.trim() || "1.0";
    const id = saveToShelf();
    void saveMedia(id, media);
    const version = useStudio.getState().card.character_version.trim() || before;
    setVersionPick("current");
    versionBackup.current = null;
    setNotice(version !== before ? `Kept this card as version ${version}. The previous copy is in the version list.` : "Kept this card in the library.");
    setError(null);
  }

  function onNew() {
    newCard();
    setMedia(EMPTY_MEDIA);
    setTab("card");
    setNotice(null);
    setError(null);
  }

  async function onLoadShelf(id: string) {
    loadFromShelf(id);
    setMedia(await loadMedia(id));
    setNotice(null);
    setError(null);
  }

  async function onSaveSettings() {
    try {
      const saved = await saveSettingsFile(captureSettings());
      setError(null);
      setNotice(saved ? `Saved settings to ${saved}. They come back the next time you open Cardwright.` : "Save cancelled.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
    }
  }

  async function onLoadSettings() {
    try {
      if (await isDesktopHost()) {
        const file = await openSettingsFile();
        if (!file) {
          setNotice("Load cancelled.");
          return;
        }
        applySettings(file);
        await writeAutoSettings(captureSettings());
        setNotice("Loaded settings. Cards in that file were added to the library.");
        setError(null);
        return;
      }
      settingsRef.current?.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load settings.");
    }
  }

  function onSettingsPicked(file: File) {
    void file.text().then((text) => {
      try {
        const parsed = parseSettingsFile(JSON.parse(text) as unknown);
        if (!parsed) {
          setError("That file is not a Cardwright settings file.");
          return;
        }
        applySettings(parsed);
        void writeAutoSettings(captureSettings());
        setNotice(`Loaded settings from ${file.name}. Cards in that file were added to the library.`);
        setError(null);
      } catch {
        setError("That file is not a Cardwright settings file.");
      }
    });
  }

  const locked = busy !== null;

  async function onUseGenerated(dataUrl: string, name: string) {
    const blob = await (await fetch(dataUrl)).blob();
    const image = await fileToImage(new File([blob], name, { type: "image/png" }));
    setMedia((current) => placePortrait(current, image));
    setNotice("That picture is now the card portrait.");
    setError(null);
    setTab("card");
  }

  const menu = useRef({
    onNew,
    onExport,
    onExportPng,
    onGenerate,
    onKeep,
    onCopy,
    onImport,
    onSaveSettings,
    onLoadSettings,
    setTab,
    setLibraryKind,
  });
  menu.current = { onNew, onExport, onExportPng, onGenerate, onKeep, onCopy, onImport, onSaveSettings, onLoadSettings, setTab, setLibraryKind };

  useEffect(() => {
    const stops = [
      onCommand("file.new", () => menu.current.onNew()),
      onCommand("file.import", () => {
        void pickCardFile()
          .then((file) => {
            if (file) menu.current.onImport(file);
          })
          .catch((err) => {
            setError(err instanceof Error ? err.message : "Could not open that card.");
          });
      }),
      onCommand("file.exportJson", () => menu.current.onExport()),
      onCommand("file.exportPng", () => void menu.current.onExportPng()),
      onCommand("file.saveSettings", () => void menu.current.onSaveSettings()),
      onCommand("file.loadSettings", () => void menu.current.onLoadSettings()),
      onCommand("file.exit", () => void quitApp()),
      onCommand("card.write", () => void menu.current.onGenerate()),
      onCommand("card.keep", () => menu.current.onKeep()),
      onCommand("card.copy", () => void menu.current.onCopy()),
      onCommand("nav.card", () => menu.current.setTab("card")),
      onCommand("nav.novel", () => menu.current.setTab("novel")),
      onCommand("nav.persona", () => menu.current.setTab("persona")),
      onCommand("nav.library", () => menu.current.setTab("library")),
      onCommand("nav.chats", () => {
        menu.current.setLibraryKind("chats");
        menu.current.setTab("library");
      }),
      onCommand("nav.preset", () => menu.current.setTab("preset")),
      onCommand("nav.chat", () => menu.current.setTab("chat")),
      onCommand("nav.life", () => menu.current.setTab("life")),
      onCommand("nav.lore", () => menu.current.setTab("lore")),
      onCommand("nav.colors", () => menu.current.setTab("colors")),
      onCommand("file.downloadFolder", () => {
        void (async () => {
          try {
            const next = await chooseDownloadFolder();
            if (!next) {
              setNotice("Download folder choice cancelled.");
              return;
            }
            window.dispatchEvent(new Event("cardwright-downloads"));
            setError(null);
            setNotice(`Downloads now go to ${next}.`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not choose a download folder.");
          }
        })();
      }),
      onCommand("file.libraryFolder", () => {
        void (async () => {
          try {
            await syncShelf("cards", useStudio.getState().shelf);
            await syncShelf("personas", useStudio.getState().personas);
            const next = await chooseVaultFolder();
            if (!next) {
              setNotice("Folder choice cancelled.");
              return;
            }
            disarmLibrarySync();
            const nextShelf = await loadShelf("cards");
            const nextPersonas = await loadShelf("personas");
            const presets = await loadPresetList();
            armLibrarySync();
            useStudio.setState({ shelf: nextShelf, personas: nextPersonas, presets });
            window.dispatchEvent(new Event("cardwright-vault"));
            setError(null);
            setNotice(`Cards and pictures now save in ${next.label}.`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not change the library folder.");
          }
        })();
      }),
    ];
    return () => stops.forEach((stop) => stop());
  }, []);

  const tabClass = (selected: boolean) =>
    `min-h-11 rounded-md px-4 text-sm font-semibold ${selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <ContextMenu />
      <div className="shrink-0">
        <MenuBar />
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight text-fg">Cardwright</p>
              <p className="text-sm text-muted">Marinara character cards, from a concept or a reference picture.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/Cardwright.exe"
                download="Cardwright.exe"
                className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
              >
                <Monitor className="size-4 text-gold" aria-hidden="true" />
                Windows app
              </a>
              <p className="flex items-center gap-2 text-sm text-muted">
                <Link2 className="size-4 text-gold" aria-hidden="true" />
                <span>{linkNote}</span>
              </p>
            </div>
          </div>
          <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4">
            <button type="button" aria-pressed={tab === "card"} onClick={() => setTab("card")} className={tabClass(tab === "card")}>
              Card
            </button>
            <button type="button" aria-pressed={tab === "persona"} onClick={() => setTab("persona")} className={tabClass(tab === "persona")}>
              Persona
            </button>
            <button type="button" aria-pressed={tab === "library"} onClick={() => setTab("library")} className={tabClass(tab === "library")}>
              Library
            </button>
            <button type="button" aria-pressed={tab === "chat"} onClick={() => setTab("chat")} className={tabClass(tab === "chat")}>
              Chat
            </button>
            <button type="button" aria-pressed={tab === "life"} onClick={() => setTab("life")} className={tabClass(tab === "life")}>
              Life
            </button>
            <button type="button" aria-pressed={tab === "lore"} onClick={() => setTab("lore")} className={tabClass(tab === "lore")}>
              Lore
            </button>
            <button type="button" aria-pressed={tab === "preset"} onClick={() => setTab("preset")} className={tabClass(tab === "preset")}>
              Presets
            </button>
            <button type="button" aria-pressed={tab === "novel"} onClick={() => setTab("novel")} className={tabClass(tab === "novel")}>
              NovelAI
            </button>
            <button type="button" aria-pressed={tab === "colors"} onClick={() => setTab("colors")} className={tabClass(tab === "colors")}>
              Colors
            </button>
          </nav>
        </header>
      </div>
      <div className={tab === "chat" ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto"}>
      <input
        ref={settingsRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSettingsPicked(file);
          event.target.value = "";
        }}
      />

      {tab === "novel" ? (
        <NovelTab
          settings={settings}
          onSettings={patchSettings}
          appearance={appearancePrompt({
            name: card.name,
            appearance: card.appearance,
            description: card.description,
            concept,
          })}
          onUsePortrait={(dataUrl, name) => onUseGenerated(dataUrl, name)}
        />
      ) : tab === "persona" ? (
        <PersonaTab />
      ) : tab === "library" ? (
        <LibraryTab
          cards={shelf}
          personas={personas}
          kind={libraryKind}
          onKind={setLibraryKind}
          onOpenCard={(id) => {
            void onLoadShelf(id);
            setTab("card");
          }}
          onOpenPersona={(id) => {
            loadPersona(id);
            setTab("persona");
          }}
          onChatCard={(item) => {
            startChat(item.card, persona.name.trim() ? persona : null, item.id);
            setTab("chat");
          }}
          onChatPersona={(item) => {
            if (!card.name.trim()) {
              setError("Write a character on the Card tab before chatting as this persona.");
              setTab("card");
              return;
            }
            startChat(card, item.card, useStudio.getState().cardDraftId ?? "editor");
            setTab("chat");
          }}
          onDeleteCard={(id) => {
            removeFromShelf(id);
            void deleteMedia(id);
          }}
          onDeletePersona={(id) => {
            removePersona(id);
            void deleteMedia(`persona:${id}`);
          }}
          onImportCard={(file) => {
            onImport(file);
            setTab("card");
          }}
          onContinueChat={() => setTab("chat")}
        />
      ) : tab === "chat" ? (
        <ChatTab
          cards={shelf}
          personas={personas}
          onOpenLibrary={() => {
            setLibraryKind("chats");
            setTab("library");
          }}
        />
      ) : tab === "life" ? (
        <LifeTab />
      ) : tab === "lore" ? (
        <LoreTab />
      ) : tab === "colors" ? (
        <ColorsTab />
      ) : tab === "preset" ? (
        <PresetTab />
      ) : (
        <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)_20rem]">
          <section className="flex flex-col gap-4">
            <Panel title="Concept">
              <label className="sr-only" htmlFor="concept">
                Character concept
              </label>
              <textarea
                id="concept"
                value={hydrated ? concept : ""}
                onChange={(event) => setConcept(event.target.value)}
                rows={4}
                placeholder="Who are they, where are they, and what should a chat feel like?"
                className="min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
              />
              <button
                type="button"
                disabled={locked}
                onClick={() => void onGenerate()}
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                {busy && busy.startsWith("Writing") ? busy : "Write the card"}
              </button>
              <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={fillBlanks}
                  onChange={(event) => setFillBlanks(event.target.checked)}
                  className="size-4 accent-primary"
                />
                Fill empty fields only
              </label>
              <p className="mt-3 text-xs font-semibold tracking-wide text-muted uppercase">Starters</p>
              <button
                type="button"
                onClick={() => {
                  const pick = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
                  if (pick) setConcept(pick.text);
                }}
                className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
              >
                <Shuffle className="size-4" aria-hidden="true" />
                Randomize starters
              </button>
              <div className="mt-2 flex flex-col gap-2">
                {CONCEPTS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setConcept(sample.text)}
                    className="min-h-11 rounded-md border border-border bg-surface-2 px-3 text-left text-sm text-fg"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="References">
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  void onAddFiles(event.dataTransfer.files);
                }}
                className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-3 py-3 text-center text-sm ${dragging ? "border-gold bg-surface-2 text-fg" : "border-border bg-bg text-muted"}`}
              >
                <ImagePlus className="size-5 text-gold" aria-hidden="true" />
                <span>Drop pictures, or click to upload</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    if (event.target.files) void onAddFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-muted">
                Up to 200. They stay with this card. A vision model can read them when you write the card. The starred one is the portrait. Saved pictures in the library are not capped.
              </p>
              <label className="mt-2 flex min-h-11 items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={useImages}
                  onChange={(event) => patchSettings({ useImages: event.target.checked })}
                  className="size-4 accent-primary"
                />
                Send pictures to the model
              </label>
              {media.images.length > 0 ? (
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {media.images.map((image) => {
                    const selected = image.id === portrait?.id;
                    return (
                      <li key={image.id} className="relative">
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={selected ? `${image.name} is the portrait` : `Use ${image.name} as the portrait`}
                          onClick={() => setMedia((current) => ({ ...current, portraitId: image.id }))}
                          className={`block w-full overflow-hidden rounded-md border-2 ${selected ? "border-gold" : "border-transparent"}`}
                        >
                          <img src={image.dataUrl} alt="" className="aspect-square w-full object-cover" />
                        </button>
                        {selected ? <Star className="absolute top-2 left-2 size-4 fill-gold text-gold" aria-hidden="true" /> : null}
                        <button
                          type="button"
                          aria-label={`Remove ${image.name}`}
                          onClick={() => setMedia((current) => removeImage(current, image.id))}
                          className="absolute top-1 right-1 flex size-11 items-center justify-center text-fg"
                        >
                          <span className="flex size-6 items-center justify-center rounded-md bg-bg">
                            <X className="size-3.5" aria-hidden="true" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">{mediaReady ? "No reference pictures yet." : "Loading pictures…"}</p>
              )}
            </Panel>

            <Panel title="KoboldCPP">
              <FieldLabel htmlFor="baseUrl">OpenAI endpoint</FieldLabel>
              <input
                id="baseUrl"
                value={settings.baseUrl}
                onChange={(event) => patchSettings({ baseUrl: event.target.value })}
                className={inputClass}
                spellCheck={false}
                autoCapitalize="off"
              />
              <p className="mt-1 text-xs text-muted">
                Usually http://127.0.0.1:5001/v1. The Windows app talks to Kobold on your PC. This preview can only reach it when Kobold is running on the same computer.
              </p>
              <FieldLabel htmlFor="apiKey">Password, if you set one</FieldLabel>
              <input
                id="apiKey"
                type="password"
                value={settings.apiKey}
                onChange={(event) => patchSettings({ apiKey: event.target.value })}
                className={inputClass}
                autoComplete="off"
              />
              <FieldLabel htmlFor="temperature">Temperature {settings.temperature.toFixed(2)}</FieldLabel>
              <input
                id="temperature"
                type="range"
                min={0.1}
                max={1.4}
                step={0.05}
                value={settings.temperature}
                onChange={(event) => patchSettings({ temperature: Number(event.target.value) })}
                className="w-full accent-primary"
              />
              <FieldLabel htmlFor="maxTokens">Max tokens</FieldLabel>
              <input
                id="maxTokens"
                type="number"
                min={256}
                max={8192}
                value={settings.maxTokens}
                onChange={(event) => patchSettings({ maxTokens: Number(event.target.value) || 2200 })}
                className={inputClass}
              />
              <button
                type="button"
                disabled={locked}
                onClick={() => void onProbe()}
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60"
              >
                Test connection
              </button>
            </Panel>

            <Panel title="Library">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onKeep}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
                >
                  <Save className="size-4" aria-hidden="true" />
                  Keep
                </button>
                <button
                  type="button"
                  onClick={onNew}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  New
                </button>
              </div>
              {shelf.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Kept cards also show on the Library tab.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {shelf.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void onLoadShelf(item.id)}
                        className="min-h-11 flex-1 truncate rounded-md px-2 text-left text-sm text-fg"
                      >
                        {item.name}
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => {
                          removeFromShelf(item.id);
                          void deleteMedia(item.id);
                        }}
                        className="flex size-11 items-center justify-center rounded-md text-muted"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </section>

          <section className="flex flex-col gap-3">
            {error ? (
              <p role="alert" className="rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg">
                {error}
              </p>
            ) : null}
            {notice ? <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{notice}</p> : null}
            {busy ? <p className="text-sm text-gold">{busy}</p> : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <input id="name" value={card.name} onChange={(event) => patchCard({ name: event.target.value })} className={inputClass} />
              </div>
              <div>
                <FieldLabel htmlFor="summary">Summary</FieldLabel>
                <input
                  id="summary"
                  value={card.summary}
                  onChange={(event) => patchCard({ summary: event.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <section className="rounded-lg border border-border bg-bg p-3">
              <h3 className="font-display text-lg font-semibold">Version</h3>
              <p className="mt-1 text-xs text-muted">Keeping this card again saves the previous copy and raises the version.</p>
              <label htmlFor="cardVersion" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
                Saved copies
                <select
                  id="cardVersion"
                  value={versionPick}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (next === "current") {
                      if (versionBackup.current) replaceCard(versionBackup.current);
                      versionBackup.current = null;
                      setVersionPick("current");
                      return;
                    }
                    const revision = revisions[Number(next)];
                    if (!revision) return;
                    if (versionPick === "current") versionBackup.current = card;
                    replaceCard(revision.card);
                    setVersionPick(next);
                  }}
                  className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm font-normal tracking-normal text-fg normal-case"
                >
                  <option value="current">
                    {versionPick === "current" ? `This card · ${card.character_version.trim() || "1.0"}` : "Back to the unsaved card"}
                  </option>
                  {[...revisions].reverse().map((revision, index) => {
                    const value = String(revisions.length - 1 - index);
                    const when = revision.savedAt
                      ? new Date(revision.savedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                      : "saved";
                    return (
                      <option key={`${revision.version}-${revision.savedAt}-${value}`} value={value}>
                        {revision.version} · {when}
                      </option>
                    );
                  })}
                </select>
              </label>
            </section>
            <section className="rounded-lg border border-border bg-bg p-3">
              <h3 className="font-display text-lg font-semibold">Creator</h3>
              <p className="mt-1 text-xs text-muted">Who made this card. You can type a name, or use a persona.</p>
              <label htmlFor="creator" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
                Name
                <input
                  id="creator"
                  value={card.creator}
                  onChange={(event) => patchCard({ creator: event.target.value })}
                  className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm font-normal tracking-normal text-fg normal-case"
                />
              </label>
              <label htmlFor="creatorPersona" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
                Persona
                <select
                  id="creatorPersona"
                  value={creatorPick}
                  onChange={(event) => setCreatorPick(event.target.value)}
                  className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm font-normal tracking-normal text-fg normal-case"
                >
                  <option value="editor">Persona in the editor{persona.name.trim() ? ` · ${persona.name.trim()}` : ""}</option>
                  {personas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => {
                  const source = creatorPick === "editor" ? persona : personas.find((item) => item.id === creatorPick)?.card;
                  const credit = source ? creatorFromPersona(source) : "";
                  if (!credit) {
                    setError("That persona needs a name or a summary first.");
                    return;
                  }
                  patchCard({ creator: credit });
                  setNotice("Creator now uses that persona.");
                  setError(null);
                }}
                className="mt-3 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
              >
                Use this persona
              </button>
            </section>
            <section className="rounded-lg border border-border bg-bg p-3">
              <h3 className="font-display text-lg font-semibold">Chat colors</h3>
              <p className="mt-1 text-xs text-muted">These colors travel with the card and color this character’s messages.</p>
              <div className="mt-3">
                <ChatColors look={card.chatLook} theme={{ ...DEFAULT_THEME, ...theme }} name={card.name} onChange={(chatLook) => patchCard({ chatLook })} />
              </div>
              <label htmlFor="aliases" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
                Aliases
                <textarea
                  id="aliases"
                  value={card.aliases ?? ""}
                  rows={3}
                  placeholder="Other names, one per line. Used when you write who should answer."
                  onChange={(event) => patchCard({ aliases: event.target.value })}
                  className="mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg normal-case"
                />
              </label>
            </section>

            {LONG_FIELDS.map((field) => (
              <div key={field.key}>
                <div className="mb-1 flex items-end justify-between gap-2">
                  <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => void onRewrite(field.key)}
                    className="min-h-11 shrink-0 rounded-md px-2 text-xs font-semibold text-gold disabled:opacity-60"
                  >
                    Rewrite
                  </button>
                </div>
                <textarea
                  id={field.key}
                  value={card[field.key]}
                  onChange={(event) => patchCard({ [field.key]: event.target.value })}
                  rows={field.key === "first_mes" || field.key === "description" ? 7 : 4}
                  className="min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
                />
                <p className="mt-1 text-xs text-muted">
                  {field.hint} · {wordCount(card[field.key])} words
                </p>
              </div>
            ))}

            <div>
              <FieldLabel htmlFor="tags">Tags</FieldLabel>
              <input
                id="tags"
                value={tagsToText(card.tags)}
                onChange={(event) => patchCard({ tags: textToTags(event.target.value) })}
                className={inputClass}
                placeholder="original, slow-burn, city"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Alternate greetings</p>
                <button
                  type="button"
                  aria-label="Add greeting"
                  onClick={() => patchCard({ alternate_greetings: [...(card.alternate_greetings ?? []), ""] })}
                  className="flex size-11 items-center justify-center rounded-md border border-border bg-surface-2 text-fg"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs text-muted">The first message is greeting 1. Each box is another opening you can swipe to in chat.</p>
              <div className="mt-2 flex flex-col gap-3">
                {(card.alternate_greetings ?? []).map((greeting, index) => (
                  <div key={`greeting-${index}`}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <label htmlFor={`greeting-${index}`} className="text-xs font-semibold tracking-wide text-muted uppercase">
                        Greeting {index + 2}
                      </label>
                      <button
                        type="button"
                        aria-label={`Remove greeting ${index + 2}`}
                        onClick={() =>
                          patchCard({
                            alternate_greetings: card.alternate_greetings.filter((_, item) => item !== index),
                          })
                        }
                        className="flex size-11 items-center justify-center rounded-md text-primary"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <textarea
                      id={`greeting-${index}`}
                      value={greeting}
                      rows={5}
                      placeholder="Another way this character can open a chat."
                      onChange={(event) => {
                        const next = [...card.alternate_greetings];
                        next[index] = event.target.value;
                        patchCard({ alternate_greetings: next });
                      }}
                      className="min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="talk">Talkativeness {card.talkativeness}</FieldLabel>
              <input
                id="talk"
                type="range"
                min={0}
                max={100}
                value={card.talkativeness}
                onChange={(event) => patchCard({ talkativeness: Number(event.target.value) })}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <FieldLabel htmlFor="lorebook">Linked lorebook</FieldLabel>
              <select
                id="lorebook"
                value={card.lorebookId || ""}
                onChange={(event) => patchCard({ lorebookId: event.target.value })}
                className={inputClass}
              >
                <option value="">None</option>
                {lorebooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted">New chats with this card include that lorebook. World books are chosen inside the chat.</p>
            </div>

            <div className="flex flex-wrap gap-2 pb-8">
              <button
                type="button"
                onClick={onExport}
                className="flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg"
              >
                <Download className="size-4" aria-hidden="true" />
                Download JSON
              </button>
              <button
                type="button"
                disabled={locked}
                onClick={() => void onExportPng()}
                className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60"
              >
                <Download className="size-4" aria-hidden="true" />
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => void onCopy()}
                className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg"
              >
                Copy JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  void pickCardFile()
                    .then((file) => {
                      if (file) onImport(file);
                    })
                    .catch((err) => setError(err instanceof Error ? err.message : "Could not open that card."));
                }}
                className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg"
              >
                <Upload className="size-4" aria-hidden="true" />
                Import
              </button>
            </div>
          </section>

          <aside className="lg:sticky lg:top-4 lg:self-start">
            <article className="rounded-lg bg-paper p-5 text-ink shadow-2xl">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
                <BookOpen className="size-4" aria-hidden="true" />
                Character sheet
              </p>
              {portrait ? <img src={portrait.dataUrl} alt="" className="mt-3 aspect-square w-full rounded-md object-cover" /> : null}
              <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{card.name.trim() || "Unnamed"}</h1>
              <p className="mt-2 text-sm text-ink-soft">{card.summary.trim() || "No summary yet."}</p>
              <hr className="my-4 border-gold" />
              <SheetBlock title="Description" text={card.description} />
              <SheetBlock title="Personality" text={card.personality} />
              <SheetBlock title="Appearance" text={card.appearance} />
              <SheetBlock title="Opening" text={card.first_mes} />
              {card.tags.length > 0 ? <p className="mt-4 text-xs text-ink-soft">{card.tags.join(" · ")}</p> : null}
            </article>
            <p className="mt-3 text-xs text-muted">
              Backstory and appearance live in Marinara’s extensions. A PNG download uses the portrait and hides the same card inside the file.
            </p>
          </aside>
        </main>
      )}
      </div>
    </div>
  );
}

const inputClass = "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-3">
      <h2 className="mb-2 font-display text-lg font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold tracking-wide text-muted uppercase">
      {children}
    </label>
  );
}

function SheetBlock({ title, text }: { title: string; text: string }) {
  if (!text.trim()) return null;
  return (
    <div className="mt-3">
      <h2 className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{title}</h2>
      <p className="mt-1 text-sm whitespace-pre-wrap text-ink">{text}</p>
    </div>
  );
}
