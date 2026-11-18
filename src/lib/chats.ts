import { cardFromUnknown, cloneCard, type CharacterCard } from "@/lib/card";
import { chatSummaryFrom, type ChatSummary, type KnowledgeMode, type MemoryFact, type ReplyMode, type TrackerRow } from "@/lib/chat";
import { readTurnSwipes } from "@/lib/swipes";
import type { ChatMember, ChatTurn } from "@/lib/studio-store";
import { vaultDelete, vaultGet, vaultList, vaultPut } from "@/lib/vault";

export type ChatHead = {
  id: string;
  title: string;
  cardName: string;
  updatedAt: number;
};

export type SavedChat = ChatHead & {
  card: CharacterCard;
  persona: CharacterCard | null;
  messages: ChatTurn[];
  memory: string;
  loreIds: string[];
  worldIds: string[];
  cardKey: string | null;
  cast: ChatMember[];
  speakerId: string | null;
  replyMode: ReplyMode;
  facts: MemoryFact[];
  ltm: boolean;
  tracker: TrackerRow[];
  track: boolean;
  knowledge: KnowledgeMode;
  knowledgeLimit: number;
  authorNote: string;
  authorDepth: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function turnsFrom(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const turns: ChatTurn[] = [];
  for (const entry of raw) {
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

export function savedChatFrom(raw: unknown, id: string): SavedChat | null {
  if (!isRecord(raw) || !isRecord(raw.card)) return null;
  const ids = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
  const card = cardFromUnknown(raw.card);
  const cardKey = typeof raw.cardKey === "string" ? raw.cardKey : null;
  const mode = raw.replyMode === "named" || raw.replyMode === "round" || raw.replyMode === "everyone" || raw.replyMode === "pick" ? raw.replyMode : "pick";
  return {
    id: typeof raw.id === "string" ? raw.id : id,
    title: typeof raw.title === "string" && raw.title.trim() ? raw.title : "Untitled chat",
    cardName: typeof raw.cardName === "string" ? raw.cardName : "Character",
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
    card,
    persona: raw.persona ? cardFromUnknown(raw.persona) : null,
    messages: turnsFrom(raw.messages),
    memory: typeof raw.memory === "string" ? raw.memory : "",
    loreIds: ids(raw.loreIds),
    worldIds: ids(raw.worldIds),
    cardKey,
    cast: castFrom(raw.cast, card, cardKey),
    speakerId: typeof raw.speakerId === "string" ? raw.speakerId : cardKey,
    replyMode: mode,
    facts: factsFrom(raw.facts),
    ltm: raw.ltm !== false,
    tracker: trackerFrom(raw.tracker),
    track: raw.track !== false,
    knowledge: raw.knowledge === "retrieval" ? "retrieval" : "keywords",
    knowledgeLimit: typeof raw.knowledgeLimit === "number" ? Math.max(5, Math.min(80, Math.round(raw.knowledgeLimit))) : 30,
    authorNote: typeof raw.authorNote === "string" ? raw.authorNote : "",
    authorDepth: typeof raw.authorDepth === "number" ? Math.max(0, Math.min(12, Math.round(raw.authorDepth))) : 2,
  };
}

function factsFrom(raw: unknown): MemoryFact[] {
  if (!Array.isArray(raw)) return [];
  const facts: MemoryFact[] = [];
  for (const entry of raw) {
    if (!isRecord(entry) || typeof entry.text !== "string" || !entry.text.trim()) continue;
    facts.push({ id: typeof entry.id === "string" ? entry.id : crypto.randomUUID(), text: entry.text.trim() });
  }
  return facts;
}

function trackerFrom(raw: unknown): TrackerRow[] {
  if (!Array.isArray(raw)) return [];
  const rows: TrackerRow[] = [];
  for (const entry of raw) {
    if (!isRecord(entry) || typeof entry.name !== "string") continue;
    rows.push({
      id: typeof entry.id === "string" ? entry.id : crypto.randomUUID(),
      name: entry.name,
      present: entry.present !== false,
      where: typeof entry.where === "string" ? entry.where : "",
      doing: typeof entry.doing === "string" ? entry.doing : "",
    });
  }
  return rows;
}

function castFrom(raw: unknown, card: CharacterCard, cardKey: string | null): ChatMember[] {
  if (!Array.isArray(raw)) return [{ id: cardKey || "primary", card }];
  const members: ChatMember[] = [];
  for (const entry of raw) {
    if (!isRecord(entry) || !entry.card) continue;
    members.push({
      id: typeof entry.id === "string" ? entry.id : crypto.randomUUID(),
      card: cardFromUnknown(entry.card),
    });
  }
  return members.length ? members : [{ id: cardKey || "primary", card }];
}

export function chatHead(chat: SavedChat): ChatHead {
  return { id: chat.id, title: chat.title, cardName: chat.cardName, updatedAt: chat.updatedAt };
}

export async function loadChatHeads(): Promise<ChatHead[]> {
  const heads = await vaultList("chats");
  return heads
    .map((head) => ({
      id: head.id,
      title: head.name || "Untitled chat",
      cardName: "",
      updatedAt: head.updatedAt,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function loadChatSummaries(): Promise<ChatSummary[]> {
  const heads = await vaultList("chats");
  const items: ChatSummary[] = [];
  for (const head of heads) {
    const summary = chatSummaryFrom(await vaultGet("chats", head.id), head.id);
    if (summary) items.push(summary);
  }
  return items.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function loadChat(id: string): Promise<SavedChat | null> {
  return savedChatFrom(await vaultGet("chats", id), id);
}

export async function saveChat(chat: SavedChat): Promise<void> {
  const next = {
    ...chat,
    card: cloneCard(chat.card),
    persona: chat.persona ? cloneCard(chat.persona) : null,
    name: chat.title,
    updatedAt: Date.now(),
  };
  await vaultPut("chats", chat.id, next);
}

export async function deleteChatRecord(id: string): Promise<void> {
  await vaultDelete("chats", id);
}
