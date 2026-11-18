import { lookOf, type ChatLook } from "./look.ts";

export type CharacterCard = {
  name: string;
  summary: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  creator_notes: string;
  system_prompt: string;
  post_history_instructions: string;
  tags: string[];
  creator: string;
  character_version: string;
  alternate_greetings: string[];
  backstory: string;
  appearance: string;
  talkativeness: number;
  chatLook: ChatLook;
  lorebookId: string;
  aliases: string;
  longMemory: string;
};

export const EMPTY_CARD: CharacterCard = {
  name: "",
  summary: "",
  description: "",
  personality: "",
  scenario: "",
  first_mes: "",
  mes_example: "",
  creator_notes: "",
  system_prompt: "",
  post_history_instructions: "",
  tags: [],
  creator: "Cardwright",
  character_version: "1.0",
  alternate_greetings: [],
  backstory: "",
  appearance: "",
  talkativeness: 50,
  chatLook: { ...lookOf(null) },
  lorebookId: "",
  aliases: "",
  longMemory: "",
};

const STRING_KEYS = [
  "name",
  "summary",
  "description",
  "personality",
  "scenario",
  "first_mes",
  "mes_example",
  "creator_notes",
  "system_prompt",
  "post_history_instructions",
  "creator",
  "character_version",
  "backstory",
  "appearance",
] as const satisfies readonly (keyof CharacterCard)[];

export type StringField = (typeof STRING_KEYS)[number];

export const LONG_FIELDS: { key: StringField; label: string; hint: string }[] = [
  {
    key: "description",
    label: "Description",
    hint: "Identity and role. Marinara sends this every turn.",
  },
  {
    key: "personality",
    label: "Personality",
    hint: "Speech, temperament, and habits. Specific beats a pile of adjectives.",
  },
  {
    key: "backstory",
    label: "Backstory",
    hint: "Marinara extension. Origin, relationships, facts that stay true.",
  },
  {
    key: "appearance",
    label: "Appearance",
    hint: "Marinara extension. Face, build, clothes, and visual detail.",
  },
  {
    key: "scenario",
    label: "Scenario",
    hint: "The situation a new chat starts in.",
  },
  {
    key: "first_mes",
    label: "First message",
    hint: "The opening they actually say. Sets the voice.",
  },
  {
    key: "mes_example",
    label: "Example dialogue",
    hint: "Separate exchanges with <START>. Teaches the voice.",
  },
  {
    key: "creator_notes",
    label: "Creator notes",
    hint: "For people reading the card. Not sent to the model.",
  },
  {
    key: "system_prompt",
    label: "System prompt",
    hint: "Optional. Leave blank to keep Marinara’s own instructions.",
  },
  {
    key: "post_history_instructions",
    label: "After history",
    hint: "Optional instructions placed after the chat log.",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function lookFrom(data: Record<string, unknown>, extensions: Record<string, unknown>): ChatLook {
  const nested = isRecord(extensions.chat_look)
    ? extensions.chat_look
    : isRecord(extensions.chatLook)
      ? extensions.chatLook
      : isRecord(data.chat_look)
        ? data.chat_look
        : {};
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = nested[key] ?? extensions[key] ?? data[key];
      if (typeof value === "string") return value;
    }
    return "";
  };
  return lookOf({
    nameColor: pick("nameColor", "name_color"),
    dialogueColor: pick("dialogueColor", "dialogue_color"),
    boxColor: pick("boxColor", "box_color"),
  });
}

export function cloneCard(card: CharacterCard): CharacterCard {
  return {
    ...card,
    tags: [...card.tags],
    alternate_greetings: [...card.alternate_greetings],
    chatLook: lookOf(card.chatLook),
    aliases: card.aliases ?? "",
    longMemory: card.longMemory ?? "",
  };
}

export function cardFromUnknown(raw: unknown, fallback: CharacterCard = EMPTY_CARD): CharacterCard {
  const root = isRecord(raw) ? raw : {};
  const data = isRecord(root.data) ? root.data : root;
  const extensions = isRecord(data.extensions) ? data.extensions : {};
  const talk = extensions.talkativeness ?? data.talkativeness;
  const next = cloneCard(fallback);

  for (const key of STRING_KEYS) {
    const fromExt = key === "backstory" || key === "appearance" ? extensions[key] : undefined;
    const value = data[key] ?? fromExt;
    if (typeof value === "string") next[key] = value;
  }

  const tags = asStringList(data.tags);
  if (tags.length) next.tags = tags;
  const greetings = asStringList(data.alternate_greetings);
  if (greetings.length) next.alternate_greetings = greetings;
  if (typeof talk === "number" && Number.isFinite(talk)) {
    next.talkativeness = Math.max(0, Math.min(100, Math.round(talk)));
  }
  next.chatLook = lookFrom(data, extensions);
  const aliases = aliasText(data.aliases, extensions.aliases, extensions.nicknames, data.nickname, data.nicknames);
  if (aliases) next.aliases = aliases;
  const memory = asString(extensions.long_memory ?? extensions.longMemory ?? data.long_memory ?? data.longMemory);
  if (memory.trim()) next.longMemory = memory.trim();
  const loreId = extensions.cardwright_lorebook ?? extensions.lorebookId ?? data.lorebookId;
  if (typeof loreId === "string") next.lorebookId = loreId;
  if (!next.creator) next.creator = "Cardwright";
  if (!next.character_version) next.character_version = "1.0";
  return next;
}

export function mergeBlanks(current: CharacterCard, incoming: CharacterCard): CharacterCard {
  const next = cloneCard(current);
  for (const key of STRING_KEYS) {
    if (!next[key].trim() && incoming[key].trim()) next[key] = incoming[key];
  }
  if (next.tags.length === 0 && incoming.tags.length) next.tags = [...incoming.tags];
  if (next.alternate_greetings.length === 0 && incoming.alternate_greetings.length) {
    next.alternate_greetings = [...incoming.alternate_greetings];
  }
  if (!next.aliases.trim() && incoming.aliases.trim()) next.aliases = incoming.aliases;
  if (!next.longMemory.trim() && incoming.longMemory.trim()) next.longMemory = incoming.longMemory;
  return next;
}

export function toCharacterCardV2(card: CharacterCard) {
  return {
    spec: "chara_card_v2" as const,
    spec_version: "2.0" as const,
    data: {
      name: card.name.trim() || "Unnamed",
      summary: card.summary,
      description: card.description,
      personality: card.personality,
      scenario: card.scenario,
      first_mes: card.first_mes,
      mes_example: card.mes_example,
      creator_notes: card.creator_notes,
      system_prompt: card.system_prompt,
      post_history_instructions: card.post_history_instructions,
      tags: card.tags,
      creator: card.creator.trim() || "Cardwright",
      character_version: card.character_version.trim() || "1.0",
      alternate_greetings: card.alternate_greetings.map((greeting) => greeting.trim()).filter(Boolean),
      character_book: null,
      extensions: {
        talkativeness: card.talkativeness,
        fav: false,
        backstory: card.backstory,
        appearance: card.appearance,
        chat_look: card.chatLook,
        aliases: card.aliases ?? "",
        long_memory: card.longMemory ?? "",
        cardwright_lorebook: card.lorebookId,
      },
    },
  };
}

function aliasText(...values: unknown[]): string {
  const names = values.flatMap((value) => asStringList(value));
  return [...new Set(names)].join("\n");
}

export function nextCardVersion(current: string): string {
  const match = current.trim().match(/^(\d+)(?:\.(\d+))?/);
  if (!match) return "1.1";
  const major = Number(match[1]);
  if (match[2] === undefined) return String(major + 1);
  return `${major}.${Number(match[2]) + 1}`;
}

export function creatorFromPersona(card: Pick<CharacterCard, "name" | "summary">): string {
  const name = card.name.trim();
  const summary = card.summary.trim().replace(/\s+/g, " ");
  const line = summary.length > 160 ? `${summary.slice(0, 157)}…` : summary;
  if (name && line) return `${name} — ${line}`;
  return name || line;
}

export function slugName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "character";
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = (fenced?.[1] ?? text).trim();
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("The model did not return a JSON object.");
  }
  try {
    return JSON.parse(source.slice(start, end + 1)) as unknown;
  } catch {
    throw new Error("The model returned JSON that could not be parsed. Try again, or lower the temperature.");
  }
}

export function tagsToText(tags: string[]): string {
  return tags.join(", ");
}

export function textToTags(text: string): string[] {
  return asStringList(text);
}

export function greetingsToText(greetings: string[]): string {
  return greetings.join("\n\n");
}

export function textToGreetings(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function fieldValue(card: CharacterCard, key: StringField): string {
  return asString(card[key]);
}
