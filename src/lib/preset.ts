import type { CharacterCard } from "@/lib/card";

export type PromptRole = "system" | "user" | "assistant";

export type PromptMessage = {
  role: PromptRole;
  content: string;
};

export type MarkerType =
  | "lorebook"
  | "character"
  | "persona"
  | "dialogue_examples"
  | "chat_history"
  | "chat_summary"
  | null;

export type PresetSection = {
  id: string;
  name: string;
  content: string;
  role: PromptRole;
  enabled: boolean;
  isMarker: boolean;
  markerType: MarkerType;
  injectionPosition: "ordered" | "depth";
  injectionDepth: number;
  injectionOrder: number;
  groupId: string | null;
};

export type PresetGroup = {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
};

export type ChoiceOption = {
  id: string;
  label: string;
  value: string;
};

export type ChoiceBlock = {
  id: string;
  variableName: string;
  question: string;
  options: ChoiceOption[];
  multiSelect: boolean;
  separator: string;
};

export type MarinaraPreset = {
  id: string;
  name: string;
  description: string;
  author: string;
  sections: PresetSection[];
  sectionOrder: string[];
  groups: PresetGroup[];
  choices: ChoiceBlock[];
  values: Record<string, string | string[]>;
};

export type PromptExtras = {
  lore?: string;
  memory?: string;
};

export type PromptTurn = {
  role: "user" | "assistant";
  text: string;
  speakerName?: string | null;
};

type MacroContext = {
  vars: Record<string, string>;
  charName: string;
  userName: string;
  rng: () => number;
};

const MARKERS = new Set<string>(["lorebook", "character", "persona", "dialogue_examples", "chat_history", "chat_summary"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asBool(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

function asJson<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (value === undefined || value === null) return fallback;
  return value as T;
}

function asRole(value: unknown): PromptRole {
  if (value === "user" || value === "assistant" || value === "system") return value;
  return "system";
}

function asMarker(value: unknown): MarkerType {
  if (typeof value === "string" && MARKERS.has(value)) return value as MarkerType;
  return null;
}

function choiceValue(raw: unknown): string | string[] | undefined {
  if (typeof raw === "string" || Array.isArray(raw)) return raw as string | string[];
  return undefined;
}

export function starterPreset(): MarinaraPreset {
  const role = "sec-role";
  const character = "sec-character";
  const persona = "sec-persona";
  const examples = "sec-examples";
  const lore = "sec-lore";
  const memory = "sec-memory";
  const history = "sec-history";
  const closing = "sec-closing";
  return {
    id: "cardwright-simple",
    name: "Cardwright simple",
    description: "A small preset. Turn sections on or off, then mark it active for chat. Import a Marinara preset to replace it.",
    author: "Cardwright",
    sectionOrder: [role, character, persona, lore, memory, examples, history, closing],
    groups: [],
    values: {
      promptPOV: "3rd",
      promptTense: "past",
      promptLength: "between 150 and 300 words",
      promptTweaks: [],
    },
    choices: [
      {
        id: "choice-pov",
        variableName: "promptPOV",
        question: "Point of view",
        multiSelect: false,
        separator: ", ",
        options: [
          { id: "pov-1", label: "First person", value: "1st" },
          { id: "pov-2", label: "Second person", value: "2nd" },
          { id: "pov-3", label: "Third person", value: "3rd" },
        ],
      },
      {
        id: "choice-tense",
        variableName: "promptTense",
        question: "Tense",
        multiSelect: false,
        separator: ", ",
        options: [
          { id: "tense-past", label: "Past", value: "past" },
          { id: "tense-present", label: "Present", value: "present" },
        ],
      },
      {
        id: "choice-length",
        variableName: "promptLength",
        question: "Reply length",
        multiSelect: false,
        separator: ", ",
        options: [
          { id: "len-short", label: "Short", value: "under 120 words" },
          { id: "len-mid", label: "Moderate", value: "between 150 and 300 words" },
          { id: "len-long", label: "Long", value: "between 350 and 700 words" },
        ],
      },
      {
        id: "choice-tweaks",
        variableName: "promptTweaks",
        question: "Optional directions",
        multiSelect: true,
        separator: "\n\n",
        options: [
          {
            id: "tweak-armor",
            label: "No plot armor",
            value: "Do not protect anyone with plot armor. Setbacks and refusals are allowed when they fit the character.",
          },
          {
            id: "tweak-world",
            label: "The world keeps moving",
            value: "The world changes even when the user hesitates. Other people have plans of their own.",
          },
        ],
      },
    ],
    sections: [
      {
        id: role,
        name: "Role",
        role: "system",
        enabled: true,
        isMarker: false,
        markerType: null,
        injectionPosition: "ordered",
        injectionDepth: 0,
        injectionOrder: 0,
        groupId: null,
        content:
          "You are writing {{char}} in a story with {{user}}. Never speak, think, or act for {{user}}. Write in {{promptPOV}} person, {{promptTense}} tense. Length: {{promptLength}}.\n\n{{promptTweaks}}",
      },
      marker(character, "Character", "character", 100),
      marker(persona, "Persona", "persona", 200),
      marker(lore, "Lorebook", "lorebook", 250),
      marker(memory, "Memory", "chat_summary", 280),
      marker(examples, "Dialogue examples", "dialogue_examples", 300),
      marker(history, "Chat history", "chat_history", 400),
      {
        id: closing,
        name: "Your turn",
        role: "system",
        enabled: true,
        isMarker: false,
        markerType: null,
        injectionPosition: "ordered",
        injectionDepth: 0,
        injectionOrder: 500,
        groupId: null,
        content: "Continue as {{char}}. Leave room for {{user}} to answer.",
      },
    ],
  };
}

function marker(id: string, name: string, type: MarkerType, order: number): PresetSection {
  return {
    id,
    name,
    content: "",
    role: "system",
    enabled: true,
    isMarker: true,
    markerType: type,
    injectionPosition: "ordered",
    injectionDepth: 0,
    injectionOrder: order,
    groupId: null,
  };
}

export function parseMarinaraPreset(raw: unknown): MarinaraPreset {
  if (!isRecord(raw)) throw new Error("That file is not a Marinara preset.");
  const data = isRecord(raw.data) ? raw.data : raw;
  const preset = isRecord(data.preset) ? data.preset : isRecord(data) && typeof data.name === "string" ? data : null;
  if (!preset || typeof preset.name !== "string" || !preset.name.trim()) {
    throw new Error("That file is not a Marinara preset.");
  }
  const sectionOrder = asJson<unknown[]>(preset.sectionOrder, []);
  const defaults = asJson<Record<string, unknown>>(preset.defaultChoices, {});
  const sectionsRaw = Array.isArray(data.sections) ? data.sections : [];
  const groupsRaw = Array.isArray(data.groups) ? data.groups : [];
  const choicesRaw = Array.isArray(data.choiceBlocks) ? data.choiceBlocks : [];
  const sections = sectionsRaw.filter(isRecord).map((entry, index) => parseSection(entry, index));
  if (sections.length === 0 && !Array.isArray(data.sections)) {
    throw new Error("That preset has no sections.");
  }
  const orderIds = sectionOrder.filter((id): id is string => typeof id === "string");
  const values: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(defaults)) {
    const parsed = choiceValue(value);
    if (parsed !== undefined) values[key] = parsed;
  }
  return {
    id: typeof preset.id === "string" && preset.id.trim() ? preset.id : crypto.randomUUID(),
    name: preset.name.trim(),
    description: typeof preset.description === "string" ? preset.description : "",
    author: typeof preset.author === "string" ? preset.author : "",
    sections,
    sectionOrder: orderIds.length > 0 ? orderIds : sections.map((section) => section.id),
    groups: groupsRaw.filter(isRecord).map((entry, index) => ({
      id: typeof entry.id === "string" ? entry.id : `group-${index}`,
      name: typeof entry.name === "string" && entry.name.trim() ? entry.name : "Group",
      enabled: asBool(entry.enabled),
      order: typeof entry.order === "number" ? entry.order : index,
    })),
    choices: choicesRaw.filter(isRecord).map((entry, index) => parseChoice(entry, index)),
    values,
  };
}

function parseSection(entry: Record<string, unknown>, index: number): PresetSection {
  const markerConfig = asJson<Record<string, unknown> | null>(entry.markerConfig, null);
  const markerType = asMarker(isRecord(markerConfig) ? markerConfig.type : null);
  const position = entry.injectionPosition === "depth" ? "depth" : "ordered";
  return {
    id: typeof entry.id === "string" && entry.id.trim() ? entry.id : `section-${index}`,
    name: typeof entry.name === "string" && entry.name.trim() ? entry.name : "Section",
    content: typeof entry.content === "string" ? entry.content : "",
    role: asRole(entry.role),
    enabled: asBool(entry.enabled),
    isMarker: asBool(entry.isMarker) || markerType !== null,
    markerType,
    injectionPosition: position,
    injectionDepth: typeof entry.injectionDepth === "number" ? entry.injectionDepth : Number(entry.injectionDepth) || 0,
    injectionOrder: typeof entry.injectionOrder === "number" ? entry.injectionOrder : index,
    groupId: typeof entry.groupId === "string" ? entry.groupId : null,
  };
}

function parseChoice(entry: Record<string, unknown>, index: number): ChoiceBlock {
  const optionsRaw = asJson<unknown[]>(entry.options, []);
  const options = optionsRaw.filter(isRecord).map((option, optionIndex) => ({
    id: typeof option.id === "string" ? option.id : `opt-${index}-${optionIndex}`,
    label: typeof option.label === "string" ? option.label : "Option",
    value: typeof option.value === "string" ? option.value : "",
  }));
  return {
    id: typeof entry.id === "string" ? entry.id : `choice-${index}`,
    variableName: typeof entry.variableName === "string" && entry.variableName.trim() ? entry.variableName : `var${index}`,
    question: typeof entry.question === "string" && entry.question.trim() ? entry.question : "Choose",
    options,
    multiSelect: asBool(entry.multiSelect),
    separator: typeof entry.separator === "string" ? entry.separator : "\n\n",
  };
}

export function toMarinaraFile(preset: MarinaraPreset): unknown {
  return {
    type: "marinara_preset",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      preset: {
        id: preset.id,
        name: preset.name,
        description: preset.description,
        author: preset.author,
        sectionOrder: JSON.stringify(preset.sectionOrder),
        defaultChoices: JSON.stringify(preset.values),
      },
      sections: preset.sections.map((section) => ({
        id: section.id,
        name: section.name,
        content: section.content,
        role: section.role,
        enabled: section.enabled ? "true" : "false",
        isMarker: section.isMarker ? "true" : "false",
        markerConfig: section.markerType ? JSON.stringify({ type: section.markerType }) : null,
        injectionPosition: section.injectionPosition,
        injectionDepth: section.injectionDepth,
        injectionOrder: section.injectionOrder,
        groupId: section.groupId,
      })),
      groups: preset.groups.map((group) => ({
        id: group.id,
        name: group.name,
        enabled: group.enabled ? "true" : "false",
        order: group.order,
      })),
      choiceBlocks: preset.choices.map((choice) => ({
        id: choice.id,
        variableName: choice.variableName,
        question: choice.question,
        options: JSON.stringify(choice.options),
        multiSelect: choice.multiSelect ? "true" : "false",
        separator: choice.separator,
      })),
    },
  };
}

export function expandMacros(text: string, ctx: MacroContext, depth = 0): string {
  if (depth > 8) return text;
  let output = "";
  let rest = text;
  let guard = 0;
  while (rest.includes("{{") && guard < 400) {
    guard += 1;
    const start = rest.indexOf("{{");
    const end = rest.indexOf("}}", start + 2);
    output += rest.slice(0, start);
    if (end < 0) {
      output += rest.slice(start);
      rest = "";
      break;
    }
    output += resolveToken(rest.slice(start + 2, end), ctx, depth);
    rest = rest.slice(end + 2);
  }
  return output + rest;
}

function resolveToken(token: string, ctx: MacroContext, depth: number): string {
  const trimmed = token.trim();
  if (/^char$/i.test(trimmed)) return ctx.charName;
  if (/^user$/i.test(trimmed)) return ctx.userName;
  if (trimmed.startsWith("setvar::")) {
    const parts = trimmed.slice("setvar::".length).split("::");
    const name = parts.shift()?.trim() ?? "";
    if (name) ctx.vars[name] = expandMacros(parts.join("::"), ctx, depth + 1);
    return "";
  }
  if (trimmed.startsWith("random::")) {
    const parts = trimmed
      .slice("random::".length)
      .split("::")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return "";
    const index = Math.min(parts.length - 1, Math.floor(ctx.rng() * parts.length));
    return expandMacros(parts[index] ?? "", ctx, depth + 1);
  }
  if (trimmed.startsWith("getvar::")) {
    const name = trimmed.slice("getvar::".length).trim();
    return ctx.vars[name] ?? "";
  }
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed) && trimmed in ctx.vars) {
    return expandMacros(ctx.vars[trimmed] ?? "", ctx, depth + 1);
  }
  return `{{${token}}}`;
}

function resolveVars(preset: MarinaraPreset): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const choice of preset.choices) {
    const raw = preset.values[choice.variableName];
    if (choice.multiSelect) {
      const selected = Array.isArray(raw) ? raw : typeof raw === "string" && raw ? [raw] : [];
      const texts = selected
        .map((item) => choice.options.find((option) => option.value === item || option.id === item || option.label === item)?.value ?? item)
        .map((item) => item.trim())
        .filter((item) => item && !/^none specified$/i.test(item));
      const separator = texts.some((item) => item.includes("\n")) ? "\n\n" : choice.separator || "\n\n";
      vars[choice.variableName] = texts.join(separator);
      continue;
    }
    const picked = Array.isArray(raw) ? raw[0] : raw;
    const match = choice.options.find((option) => option.value === picked || option.id === picked || option.label === picked);
    vars[choice.variableName] = match?.value ?? (typeof picked === "string" ? picked : (choice.options[0]?.value ?? ""));
  }
  return vars;
}

function orderedSections(preset: MarinaraPreset): PresetSection[] {
  const rank = new Map(preset.sectionOrder.map((id, index) => [id, index]));
  return [...preset.sections].sort((a, b) => {
    const ar = rank.has(a.id) ? (rank.get(a.id) as number) : preset.sectionOrder.length + a.injectionOrder;
    const br = rank.has(b.id) ? (rank.get(b.id) as number) : preset.sectionOrder.length + b.injectionOrder;
    return ar - br || a.injectionOrder - b.injectionOrder;
  });
}

function groupOn(preset: MarinaraPreset, section: PresetSection): boolean {
  if (!section.groupId) return true;
  const group = preset.groups.find((entry) => entry.id === section.groupId);
  return !group || group.enabled;
}

function fillCard(card: CharacterCard, expand: (text: string) => string): string {
  const parts = [
    card.name.trim() && `Name: ${expand(card.name)}`,
    card.description.trim() && expand(card.description),
    card.personality.trim() && `Personality:\n${expand(card.personality)}`,
    card.appearance.trim() && `Appearance:\n${expand(card.appearance)}`,
    card.backstory.trim() && `Backstory:\n${expand(card.backstory)}`,
    card.scenario.trim() && `Scenario:\n${expand(card.scenario)}`,
    card.system_prompt.trim() && expand(card.system_prompt),
    card.post_history_instructions.trim() && expand(card.post_history_instructions),
  ].filter((part): part is string => Boolean(part));
  return parts.join("\n\n");
}

function sectionText(
  section: PresetSection,
  card: CharacterCard,
  persona: CharacterCard | null,
  expand: (text: string) => string,
  extras?: PromptExtras,
): string {
  if (section.markerType === "chat_history") return "";
  if (section.markerType === "lorebook") return extras?.lore?.trim() ? expand(`Lore that fits this moment:\n${extras.lore.trim()}`) : "";
  if (section.markerType === "chat_summary") return extras?.memory?.trim() ? expand(`Memory of the story so far:\n${extras.memory.trim()}`) : "";
  if (section.markerType === "character") return fillCard(card, expand);
  if (section.markerType === "persona") return persona ? fillCard(persona, expand) : "";
  if (section.markerType === "dialogue_examples") return expand(card.mes_example.trim());
  return expand(section.content).trim();
}

export function buildPresetMessages(
  preset: MarinaraPreset,
  card: CharacterCard,
  persona: CharacterCard | null,
  history: PromptTurn[],
  rng: () => number = Math.random,
  extras?: PromptExtras,
): PromptMessage[] {
  const charName = card.name.trim() || "Character";
  const userName = persona?.name.trim() || "User";
  const ctx: MacroContext = { vars: resolveVars(preset), charName, userName, rng };
  for (const key of Object.keys(ctx.vars)) ctx.vars[key] = expandMacros(ctx.vars[key], ctx);
  const expand = (text: string) => expandMacros(text, ctx);
  const before: PromptMessage[] = [];
  const after: PromptMessage[] = [];
  const depthBits: { depth: number; order: number; role: PromptRole; content: string }[] = [];
  let seenHistory = false;

  for (const section of orderedSections(preset)) {
    if (!section.enabled || !groupOn(preset, section)) continue;
    if (section.markerType === "chat_history") {
      seenHistory = true;
      continue;
    }
    const content = sectionText(section, card, persona, expand, extras).trim();
    if (!content) continue;
    if (section.injectionPosition === "depth") {
      depthBits.push({ depth: Math.max(0, section.injectionDepth), order: section.injectionOrder, role: section.role, content });
      continue;
    }
    (seenHistory ? after : before).push({ role: section.role, content });
  }

  const hasLore = preset.sections.some((section) => section.enabled && section.markerType === "lorebook");
  const hasMemory = preset.sections.some((section) => section.enabled && section.markerType === "chat_summary");
  if (!hasLore && extras?.lore?.trim()) before.push({ role: "system", content: expand(`Lore that fits this moment:\n${extras.lore.trim()}`) });
  if (!hasMemory && extras?.memory?.trim()) before.push({ role: "system", content: expand(`Memory of the story so far:\n${extras.memory.trim()}`) });

  const transcript: PromptMessage[] = history
    .filter((turn) => turn.text.trim())
    .slice(-40)
    .map((turn) => ({
      role: turn.role,
      content: turn.role === "assistant" && turn.speakerName?.trim() ? `${turn.speakerName.trim()}: ${turn.text}` : turn.text,
    }));
  const grouped = new Map<number, typeof depthBits>();
  for (const bit of depthBits) {
    const list = grouped.get(bit.depth) ?? [];
    list.push(bit);
    grouped.set(bit.depth, list);
  }
  const merged = [...transcript];
  for (const depth of [...grouped.keys()].sort((a, b) => b - a)) {
    const list = (grouped.get(depth) ?? []).sort((a, b) => a.order - b.order);
    const index = Math.max(0, merged.length - depth);
    merged.splice(index, 0, ...list.map((bit) => ({ role: bit.role, content: bit.content })));
  }
  const messages = seenHistory ? [...before, ...merged, ...after] : [...before, ...after, ...merged];
  return squash(messages);
}

function squash(messages: PromptMessage[]): PromptMessage[] {
  const out: PromptMessage[] = [];
  for (const message of messages) {
    const last = out[out.length - 1];
    if (last && last.role === "system" && message.role === "system") last.content = `${last.content}\n\n${message.content}`;
    else out.push({ ...message });
  }
  return out.filter((message) => message.content.trim());
}
