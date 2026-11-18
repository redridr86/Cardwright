import type { CharacterCard } from "@/lib/card";
import type { ChatTurn } from "@/lib/studio-store";

export type RoleMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ReplyMode = "pick" | "named" | "round" | "everyone";

export function speakersForTurn(input: {
  mode: ReplyMode;
  cast: { id: string; name: string; aliases?: string }[];
  pickedId: string | null;
  lastSpeakerId: string | null;
  userText: string;
}): { id: string; name: string }[] {
  const cast = input.cast.filter((member) => member.name.trim());
  if (cast.length === 0) return [];
  const picked = cast.find((member) => member.id === input.pickedId) ?? cast[0];
  if (input.mode === "everyone") return cast;
  if (input.mode === "round") {
    const index = cast.findIndex((member) => member.id === input.lastSpeakerId);
    const start = index >= 0 ? index : -1;
    return [cast[(start + 1) % cast.length]];
  }
  if (input.mode === "named") {
    const named = cast.filter((member) => knownNames(member).some((name) => nameHits(input.userText, name)));
    return named.length ? named : [picked];
  }
  return [picked];
}

function knownNames(member: { name: string; aliases?: string }): string[] {
  const aliases = (member.aliases ?? "")
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter((name) => name.length >= 2);
  return [member.name, ...aliases];
}

function nameHits(text: string, name: string): boolean {
  const needle = name.trim();
  if (needle.length < 2) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
}

export function applyMacros(text: string, charName: string, userName: string): string {
  return text.replace(/\{\{\s*char\s*\}\}/gi, charName).replace(/\{\{\s*user\s*\}\}/gi, userName);
}

function cardBrief(card: CharacterCard): string {
  return [card.description, card.personality, card.appearance, card.backstory]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n");
}

export function buildRoleplayMessages(
  card: CharacterCard,
  persona: CharacterCard | null,
  history: ChatTurn[],
  extras?: { memory?: string; lore?: string },
  cast: CharacterCard[] = [],
): RoleMessage[] {
  const charName = card.name.trim() || "Character";
  const userName = persona?.name.trim() || "User";
  const fill = (text: string) => applyMacros(text, charName, userName);
  const others = cast.filter((member) => member.name.trim() && member.name.trim() !== charName);
  const personaText = persona ? cardBrief(persona) : "";
  const otherText = others
    .map((member) => {
      const brief = cardBrief(member);
      return brief ? `${member.name.trim()}:\n${fill(brief)}` : member.name.trim();
    })
    .join("\n\n");
  const lead = others.length
    ? `You are ${charName} in a roleplay with ${userName} and ${others.map((member) => member.name.trim()).join(", ")}. Write only ${charName}'s next reply. Do not speak, think, or act for ${userName} or the other characters. Put actions and narration in asterisks.`
    : `You are ${charName} in a roleplay. Write only ${charName}'s next reply. Do not speak, think, or act for ${userName}. Put actions and narration in asterisks. Match the card's voice.`;
  const blocks = [
    lead,
    card.description.trim() && `Description:\n${fill(card.description)}`,
    card.personality.trim() && `Personality:\n${fill(card.personality)}`,
    card.appearance.trim() && `Appearance:\n${fill(card.appearance)}`,
    card.backstory.trim() && `Backstory:\n${fill(card.backstory)}`,
    card.scenario.trim() && `Scenario:\n${fill(card.scenario)}`,
    card.mes_example.trim() && `Example dialogue:\n${fill(card.mes_example)}`,
    otherText && `Also in the scene:\n${otherText}`,
    extras?.lore?.trim() && `Lore that fits this moment:\n${fill(extras.lore.trim())}`,
    extras?.memory?.trim() && `Memory of the story so far:\n${fill(extras.memory.trim())}`,
    personaText && `${userName} is the person in the scene with ${charName}.\n${fill(personaText)}`,
    card.system_prompt.trim() && fill(card.system_prompt),
    card.post_history_instructions.trim() && `Keep this in mind after the chat so far:\n${fill(card.post_history_instructions)}`,
  ].filter((part): part is string => Boolean(part));

  const messages: RoleMessage[] = [{ role: "system", content: blocks.join("\n\n") }];
  const many = cast.filter((member) => member.name.trim()).length > 1;
  for (const turn of history.slice(-40)) {
    if (!turn.text.trim()) continue;
    const speaker = turn.speakerName?.trim();
    const content = many && turn.role === "assistant" && speaker ? `${speaker}: ${turn.text}` : turn.text;
    messages.push({ role: turn.role, content });
  }
  return messages;
}

export function sceneBrief(input: {
  cards: CharacterCard[];
  persona: CharacterCard | null;
  history: ChatTurn[];
  memory: string;
  lore: string;
}): string {
  const userName = input.persona?.name.trim() || "the other person";
  const people = input.cards
    .map((card) => {
      const lines = [
        card.name.trim() || "Character",
        card.appearance.trim() && `Appearance: ${card.appearance.trim()}`,
        card.description.trim() && `Description: ${card.description.trim()}`,
      ].filter((part): part is string => Boolean(part));
      return lines.join("\n");
    })
    .filter(Boolean);
  const personaLines = input.persona
    ? [
        `${userName} is in the scene.`,
        input.persona.appearance.trim() && `Appearance: ${input.persona.appearance.trim()}`,
        input.persona.description.trim() && `Description: ${input.persona.description.trim()}`,
      ].filter((part): part is string => Boolean(part))
    : [];
  const recent = input.history
    .slice(-8)
    .map((turn) => {
      const name = turn.role === "user" ? userName : turn.speakerName?.trim() || input.cards[0]?.name.trim() || "Character";
      return `${name}: ${turn.text}`;
    })
    .join("\n");
  return [
    people.length && `Characters:\n${people.join("\n\n")}`,
    personaLines.length && `Persona:\n${personaLines.join("\n")}`,
    input.memory.trim() && `Memory: ${input.memory.trim()}`,
    input.lore.trim() && `Lore and world facts: ${input.lore.trim()}`,
    recent && `Recent chat:\n${recent}`,
  ]
    .filter((part): part is string => Boolean(part))
    .join("\n\n")
    .slice(0, 4000);
}

export type MemoryFact = { id: string; text: string };

export type TrackerRow = {
  id: string;
  name: string;
  present: boolean;
  where: string;
  doing: string;
};

export type KnowledgeMode = "keywords" | "retrieval";

export type ChatGuides = {
  longMemory?: string;
  tracker?: string;
  authorNote?: string;
  authorDepth?: number;
};

export function factsFromText(text: string): MemoryFact[] {
  const seen = new Set<string>();
  const facts: MemoryFact[] = [];
  for (const line of text.split("\n")) {
    const fact = line.replace(/^[-*\d.)\s]+/, "").trim();
    const key = fact.toLowerCase();
    if (fact.length < 3 || seen.has(key) || /^none[.!]?$/i.test(fact)) continue;
    seen.add(key);
    facts.push({ id: crypto.randomUUID(), text: fact });
  }
  return facts;
}

export function factsFromReply(text: string, existing: MemoryFact[]): MemoryFact[] {
  const merged = factsFromText([...existing.map((fact) => fact.text), text].join("\n")).slice(-80);
  const byText = new Map(existing.map((fact) => [fact.text.trim().toLowerCase(), fact]));
  return merged.map((fact) => byText.get(fact.text.trim().toLowerCase()) ?? fact);
}

export function factsToPrompt(facts: MemoryFact[], historyText: string, limit = 12): string {
  if (!facts.length || limit <= 0) return "";
  const hay = historyText.toLowerCase();
  const picked: MemoryFact[] = [];
  const seen = new Set<string>();
  const push = (fact: MemoryFact) => {
    const key = fact.text.trim().toLowerCase();
    if (!key || seen.has(key) || picked.length >= limit) return;
    seen.add(key);
    picked.push(fact);
  };
  for (const fact of facts) {
    const words = fact.text.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 4);
    if (words.some((word) => hay.includes(word))) push(fact);
  }
  for (let index = facts.length - 1; index >= 0 && picked.length < limit; index -= 1) push(facts[index]);
  return picked.map((fact) => fact.text.trim()).join("\n");
}

export function trackerRows(cast: { id: string; name: string }[], existing: TrackerRow[] = []): TrackerRow[] {
  return cast.map((member) => {
    const name = member.name.trim() || "Character";
    const found = existing.find((row) => row.id === member.id || row.name.trim().toLowerCase() === name.toLowerCase());
    if (!found) return { id: member.id, name, present: true, where: "", doing: "" };
    return { ...found, id: member.id, name };
  });
}

export function trackerPrompt(rows: TrackerRow[]): string {
  return rows
    .map((row) => {
      const place = [row.present ? "in the scene" : "not in the scene", row.where.trim(), row.doing.trim()].filter(Boolean);
      return `${row.name}: ${place.join(", ")}`;
    })
    .join("\n");
}

export function applyTrackerText(current: TrackerRow[], text: string): TrackerRow[] {
  const next = current.map((row) => ({ ...row }));
  for (const line of text.split("\n")) {
    const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) continue;
    const [name, presentRaw, where = "", doing = ""] = parts;
    const row = next.find((item) => item.name.toLowerCase() === name.toLowerCase());
    if (!row) continue;
    row.present = !/^(no|n|false|out|absent)$/i.test(presentRaw);
    row.where = where;
    row.doing = doing;
  }
  return next;
}

export function injectAuthorNote(messages: RoleMessage[], note: string, depth: number): RoleMessage[] {
  const text = note.trim();
  if (!text) return messages;
  const clamped = Math.max(0, Math.min(20, Math.round(depth) || 0));
  const next = [...messages];
  next.splice(Math.max(0, next.length - clamped), 0, { role: "system", content: `Author's note: ${text}` });
  return next;
}

export function withChatGuides(messages: RoleMessage[], guides: ChatGuides): RoleMessage[] {
  const blocks = [
    guides.longMemory?.trim() && `Long-term memory:\n${guides.longMemory.trim()}`,
    guides.tracker?.trim() && `Character tracker:\n${guides.tracker.trim()}`,
  ].filter((part): part is string => Boolean(part));
  const next = messages.map((message) => ({ ...message }));
  if (blocks.length) {
    const block = blocks.join("\n\n");
    if (next[0]?.role === "system") next[0] = { ...next[0], content: `${next[0].content}\n\n${block}` };
    else next.unshift({ role: "system", content: block });
  }
  return injectAuthorNote(next, guides.authorNote ?? "", guides.authorDepth ?? 2);
}

export type ChatSummary = {
  id: string;
  title: string;
  cardName: string;
  updatedAt: number;
  messages: number;
  snippet: string;
  cardKey: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function chatSummaryFrom(raw: unknown, id: string): ChatSummary | null {
  if (!isRecord(raw) || !isRecord(raw.card)) return null;
  const names: string[] = [];
  if (Array.isArray(raw.cast)) {
    for (const member of raw.cast) {
      if (!isRecord(member) || !isRecord(member.card)) continue;
      const name = typeof member.card.name === "string" ? member.card.name.trim() : "";
      if (name && !names.includes(name)) names.push(name);
    }
  }
  if (!names.length) {
    const fallback =
      typeof raw.cardName === "string" && raw.cardName.trim()
        ? raw.cardName.trim()
        : typeof raw.card.name === "string"
          ? raw.card.name.trim()
          : "";
    if (fallback) names.push(fallback);
  }
  let messages = 0;
  let snippet = "";
  if (Array.isArray(raw.messages)) {
    for (const entry of raw.messages) {
      if (!isRecord(entry) || (entry.role !== "user" && entry.role !== "assistant")) continue;
      messages += 1;
      if (typeof entry.text === "string" && entry.text.trim()) snippet = entry.text.trim().replace(/\s+/g, " ");
    }
  }
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : typeof raw.name === "string" && raw.name.trim()
        ? raw.name.trim()
        : names[0] || "Untitled chat";
  return {
    id: typeof raw.id === "string" ? raw.id : id,
    title,
    cardName: names.join(", ") || "Chat",
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
    messages,
    snippet: snippet.slice(0, 160),
    cardKey: typeof raw.cardKey === "string" ? raw.cardKey : "",
  };
}
