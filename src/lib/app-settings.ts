import { cardFromUnknown, type CharacterCard } from "@/lib/card";
import { themeOf, type AppTheme } from "@/lib/look";
import { isDesktopHost, DEFAULT_SETTINGS, type KoboldSettings } from "@/lib/kobold";
import { novelGenOf, type NovelGenSettings } from "@/lib/novelai";
import { useStudio, type ChatTurn, type ShelfItem } from "@/lib/studio-store";
import { readTurnSwipes } from "@/lib/swipes";

export type SettingsFile = {
  version: 1;
  concept: string;
  card: CharacterCard;
  cardDraftId: string | null;
  settings: KoboldSettings;
  fillBlanks: boolean;
  shelf: ShelfItem[];
  novelPrompt: string;
  stylePlate: string | null;
  personaConcept: string;
  persona: CharacterCard;
  personaDraftId: string | null;
  personaFillBlanks: boolean;
  personas: ShelfItem[];
  chatCard: CharacterCard | null;
  chatPersona: CharacterCard | null;
  chatMessages: ChatTurn[];
  chatId: string | null;
  chatTitle: string;
  chatMemory: string;
  chatLoreIds: string[];
  chatWorldIds: string[];
  chatCardKey: string | null;
  theme: AppTheme;
  activePresetId: string | null;
};

const BACKUP_KEY = "cardwright-settings-file";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function settingsFrom(raw: unknown): KoboldSettings {
  const next: KoboldSettings = { ...DEFAULT_SETTINGS };
  if (!isRecord(raw)) return next;
  if (typeof raw.baseUrl === "string") next.baseUrl = raw.baseUrl;
  if (typeof raw.apiKey === "string") next.apiKey = raw.apiKey;
  if (typeof raw.model === "string") next.model = raw.model;
  if (typeof raw.temperature === "number" && Number.isFinite(raw.temperature)) next.temperature = raw.temperature;
  if (typeof raw.maxTokens === "number" && Number.isFinite(raw.maxTokens)) next.maxTokens = raw.maxTokens;
  if (typeof raw.useImages === "boolean") next.useImages = raw.useImages;
  if (typeof raw.novelToken === "string") next.novelToken = raw.novelToken;
  if (typeof raw.novelModel === "string") next.novelModel = raw.novelModel;
  if (isRecord(raw.novelGen)) next.novelGen = novelGenOf(raw.novelGen as Partial<NovelGenSettings>);
  return next;
}

function idList(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];
}

function turnsFrom(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const turns: ChatTurn[] = [];
  for (const entry of raw.slice(-200)) {
    if (!isRecord(entry) || (entry.role !== "user" && entry.role !== "assistant")) continue;
    if (typeof entry.text !== "string" || typeof entry.id !== "string") continue;
    const image = typeof entry.image === "string" && entry.image.startsWith("data:image/") ? entry.image : null;
    const swiped = readTurnSwipes(entry.swipes, entry.swipe, entry.text, image);
    turns.push({
      id: entry.id,
      role: entry.role,
      text: swiped.text,
      image: swiped.image,
      swipes: swiped.swipes,
      swipe: swiped.swipe,
      speakerId: typeof entry.speakerId === "string" ? entry.speakerId : null,
      speakerName: typeof entry.speakerName === "string" ? entry.speakerName : null,
    });
  }
  return turns;
}

function shelfFrom(raw: unknown): ShelfItem[] {
  if (!Array.isArray(raw)) return [];
  const items: ShelfItem[] = [];
  for (const entry of raw) {
    if (!isRecord(entry) || typeof entry.id !== "string") continue;
    items.push({
      id: entry.id,
      name: typeof entry.name === "string" && entry.name.trim() ? entry.name : "Untitled",
      updatedAt: typeof entry.updatedAt === "number" ? entry.updatedAt : Date.now(),
      card: cardFromUnknown(entry.card),
    });
  }
  return items;
}

export function parseSettingsFile(raw: unknown): SettingsFile | null {
  if (!isRecord(raw)) return null;
  if (raw.version !== undefined && raw.version !== 1) return null;
  if (!isRecord(raw.settings) && typeof raw.concept !== "string" && !isRecord(raw.card)) return null;
  const stylePlate = typeof raw.stylePlate === "string" && raw.stylePlate.startsWith("data:image/") ? raw.stylePlate : null;
  return {
    version: 1,
    concept: typeof raw.concept === "string" ? raw.concept : "",
    card: cardFromUnknown(raw.card),
    settings: settingsFrom(raw.settings),
    fillBlanks: raw.fillBlanks === true,
    shelf: shelfFrom(raw.shelf),
    novelPrompt: typeof raw.novelPrompt === "string" ? raw.novelPrompt : "",
    stylePlate,
    cardDraftId: typeof raw.cardDraftId === "string" ? raw.cardDraftId : null,
    personaConcept: typeof raw.personaConcept === "string" ? raw.personaConcept : "",
    persona: raw.persona ? cardFromUnknown(raw.persona) : cardFromUnknown({}),
    personaDraftId: typeof raw.personaDraftId === "string" ? raw.personaDraftId : null,
    personaFillBlanks: raw.personaFillBlanks === true,
    personas: shelfFrom(raw.personas),
    chatCard: raw.chatCard ? cardFromUnknown(raw.chatCard) : null,
    chatPersona: raw.chatPersona ? cardFromUnknown(raw.chatPersona) : null,
    chatMessages: turnsFrom(raw.chatMessages),
    chatId: typeof raw.chatId === "string" ? raw.chatId : null,
    chatTitle: typeof raw.chatTitle === "string" ? raw.chatTitle : "",
    chatMemory: typeof raw.chatMemory === "string" ? raw.chatMemory : "",
    chatLoreIds: idList(raw.chatLoreIds),
    chatWorldIds: idList(raw.chatWorldIds),
    chatCardKey: typeof raw.chatCardKey === "string" ? raw.chatCardKey : null,
    theme: themeOf(isRecord(raw.theme) ? (raw.theme as Partial<AppTheme>) : null),
    activePresetId: typeof raw.activePresetId === "string" ? raw.activePresetId : null,
  };
}

export function captureSettings(): SettingsFile {
  const state = useStudio.getState();
  const file: SettingsFile = {
    version: 1,
    concept: state.concept,
    card: state.card,
    settings: state.settings,
    fillBlanks: state.fillBlanks,
    shelf: state.shelf,
    novelPrompt: state.novelPrompt,
    stylePlate: state.stylePlate,
    cardDraftId: state.cardDraftId,
    personaConcept: state.personaConcept,
    persona: state.persona,
    personaDraftId: state.personaDraftId,
    personaFillBlanks: state.personaFillBlanks,
    personas: state.personas,
    chatCard: state.chatCard,
    chatPersona: state.chatPersona,
    chatMessages: state.chatMessages.map((turn) => ({
      id: turn.id,
      role: turn.role,
      text: turn.text,
      speakerId: turn.speakerId ?? null,
      speakerName: turn.speakerName ?? null,
      swipe: turn.swipe ?? 0,
      swipes: (turn.swipes ?? []).map((swipe) => ({ text: swipe.text, image: null })),
    })),
    chatId: state.chatId,
    chatTitle: state.chatTitle,
    chatMemory: state.chatMemory,
    chatLoreIds: state.chatLoreIds,
    chatWorldIds: state.chatWorldIds,
    chatCardKey: state.chatCardKey,
    theme: state.theme,
    activePresetId: state.activePresetId,
  };
  if (JSON.stringify(file).length > 1_200_000) {
    return { ...file, shelf: [], personas: [] };
  }
  return file;
}

export function applySettings(file: SettingsFile) {
  const state = useStudio.getState();
  useStudio.setState({
    concept: file.concept,
    card: file.card,
    settings: file.settings,
    fillBlanks: file.fillBlanks,
    shelf: file.shelf.length > 0 ? mergeById(state.shelf, file.shelf) : state.shelf,
    novelPrompt: file.novelPrompt,
    stylePlate: file.stylePlate,
    cardDraftId: file.cardDraftId,
    personaConcept: file.personaConcept,
    persona: file.persona,
    personaDraftId: file.personaDraftId,
    personaFillBlanks: file.personaFillBlanks,
    personas: file.personas.length > 0 ? mergeById(state.personas, file.personas) : state.personas,
    chatCard: file.chatCard,
    chatPersona: file.chatPersona,
    chatMessages: file.chatMessages,
    chatId: file.chatId,
    chatTitle: file.chatTitle,
    chatMemory: file.chatMemory,
    chatLoreIds: file.chatLoreIds,
    chatWorldIds: file.chatWorldIds,
    chatCardKey: file.chatCardKey,
    theme: file.theme,
    activePresetId: file.activePresetId ?? state.activePresetId,
  });
}

function mergeById(current: ShelfItem[], incoming: ShelfItem[]): ShelfItem[] {
  const map = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) map.set(item.id, item);
  return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function readAutoSettings(): Promise<SettingsFile | null> {
  try {
    if (await isDesktopHost()) {
      const response = await fetch("/__app-settings", { headers: { Accept: "application/json" } });
      if (!response.ok) return null;
      const body = (await response.json()) as unknown;
      if (isRecord(body) && body.empty === true) return null;
      return parseSettingsFile(body);
    }
  } catch {
    return readBackup();
  }
  return readBackup();
}

function readBackup(): SettingsFile | null {
  try {
    const stored = localStorage.getItem(BACKUP_KEY);
    if (!stored) return null;
    return parseSettingsFile(JSON.parse(stored) as unknown);
  } catch {
    return null;
  }
}

export async function writeAutoSettings(file: SettingsFile): Promise<void> {
  const body = JSON.stringify(file);
  try {
    localStorage.setItem(BACKUP_KEY, body);
  } catch {
    // The desktop file is the copy that survives a full window restart.
  }
  if (!(await isDesktopHost())) return;
  await fetch("/__app-settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

type SaveHandle = {
  createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }>;
};

export async function saveSettingsFile(file: SettingsFile): Promise<string> {
  const body = JSON.stringify(file, null, 2);
  if (await isDesktopHost()) {
    const response = await fetch("/__app-settings/save-as", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const payload = (await response.json().catch(() => ({}))) as { cancelled?: boolean; path?: string; message?: string };
    if (!response.ok) throw new Error(payload.message || "Could not save settings.");
    if (payload.cancelled) return "";
    return payload.path || "cardwright-settings.json";
  }
  const blob = new Blob([body], { type: "application/json" });
  const choose = (window as Window & { showSaveFilePicker?: (options: unknown) => Promise<SaveHandle> }).showSaveFilePicker;
  if (typeof choose === "function") {
    try {
      const handle = await choose({
        suggestedName: "cardwright-settings.json",
        types: [{ description: "Cardwright settings", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return "cardwright-settings.json";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "";
    }
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cardwright-settings.json";
  anchor.click();
  URL.revokeObjectURL(url);
  return "cardwright-settings.json";
}

export async function openSettingsFile(): Promise<SettingsFile | null> {
  if (!(await isDesktopHost())) return null;
  const response = await fetch("/__app-settings/open", { method: "POST" });
  const payload = (await response.json().catch(() => ({}))) as { cancelled?: boolean; message?: string; file?: unknown };
  if (!response.ok) throw new Error(payload.message || "Could not open that settings file.");
  if (payload.cancelled) return null;
  const parsed = parseSettingsFile(payload.file);
  if (!parsed) throw new Error("That file is not a Cardwright settings file.");
  return parsed;
}

export async function quitApp(): Promise<void> {
  if (!(await isDesktopHost())) return;
  await fetch("/__quit", { method: "POST" });
}
