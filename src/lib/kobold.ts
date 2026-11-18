import {
  EMPTY_CARD,
  cardFromUnknown,
  extractJson,
  type CharacterCard,
  type StringField,
} from "@/lib/card";
import type { NovelGenSettings } from "@/lib/novelai";

export type KoboldSettings = {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  useImages?: boolean;
  novelToken?: string;
  novelModel?: string;
  novelGen?: Partial<NovelGenSettings>;
};

export const DEFAULT_SETTINGS: KoboldSettings = {
  baseUrl: "http://127.0.0.1:5001/v1",
  apiKey: "",
  model: "koboldcpp",
  temperature: 0.8,
  maxTokens: 2200,
  useImages: true,
  novelToken: "",
  novelModel: "nai-diffusion-5-full",
};

function v1Base(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  return /\/v1$/i.test(trimmed) ? trimmed : `${trimmed}/v1`;
}

function endpoint(baseUrl: string, path: "chat/completions" | "models"): string {
  return `${v1Base(baseUrl)}/${path}`;
}

function headers(apiKey: string): HeadersInit {
  const next: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey.trim()) next.Authorization = `Bearer ${apiKey.trim()}`;
  return next;
}

let desktopHost: boolean | null = null;

export async function isDesktopHost(): Promise<boolean> {
  if (desktopHost !== null) return desktopHost;
  try {
    const response = await fetch("/api/cardwright", {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) {
      desktopHost = false;
      return false;
    }
    const body = (await response.json()) as { desktop?: boolean };
    desktopHost = body.desktop === true;
  } catch {
    desktopHost = false;
  }
  return desktopHost;
}

export function explainFetchError(error: unknown, response?: Response, detail?: string): string {
  const extra = detail?.trim() ?? "";
  if (response) {
    if (/image|vision|multimodal|mmproj|unsupported content/i.test(extra)) {
      return "This model did not accept pictures. In KoboldCPP, load a vision model and its mmproj, or turn off “Send pictures to the model”.";
    }
    if (response.status === 401 || response.status === 403) {
      return "KoboldCPP refused the password. Put the same password you set with --password, or leave it blank.";
    }
    if (response.status === 404) {
      return "That address has no chat endpoint. Use the OpenAI base, usually http://127.0.0.1:5001/v1.";
    }
    if (extra && extra.length < 180 && !extra.startsWith("<")) {
      return `KoboldCPP answered with HTTP ${response.status}. ${extra}`;
    }
    return `KoboldCPP answered with HTTP ${response.status}.`;
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return "The model took too long. Try a shorter concept, or check that KoboldCPP is still generating.";
  }
  if (error instanceof Error && /failed to fetch|networkerror|load failed/i.test(error.message)) {
    return "Could not reach KoboldCPP. Start it on this computer, then use http://127.0.0.1:5001/v1. The Windows app reaches it directly. This preview only can if Kobold is running on the same machine.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong talking to KoboldCPP.";
}

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type ChatMessage = { role: "system" | "user" | "assistant"; content: string | ContentPart[] };

function withPictures(text: string, images: string[]): string | ContentPart[] {
  const pictures = images.filter((url) => url.startsWith("data:image/"));
  if (pictures.length === 0) return text;
  return [
    { type: "text", text },
    ...pictures.map((url) => ({ type: "image_url" as const, image_url: { url } })),
  ];
}

async function readDetail(response: Response): Promise<string> {
  try {
    return (await response.text()).replace(/\s+/g, " ").slice(0, 300);
  } catch {
    return "";
  }
}

async function request(
  settings: KoboldSettings,
  path: "chat/completions" | "models",
  init: RequestInit,
): Promise<Response> {
  const desktop = await isDesktopHost();
  const url = desktop ? `/proxy/${path}` : endpoint(settings.baseUrl, path);
  const reqHeaders = new Headers(init.headers);
  if (desktop) reqHeaders.set("X-Kobold-Base", v1Base(settings.baseUrl));
  try {
    return await fetch(url, { ...init, headers: reqHeaders });
  } catch (error) {
    throw new Error(explainFetchError(error));
  }
}

async function complete(settings: KoboldSettings, messages: ChatMessage[], maxTokens = settings.maxTokens): Promise<string> {
  const response = await request(settings, "chat/completions", {
    method: "POST",
    headers: headers(settings.apiKey),
    signal: AbortSignal.timeout(180_000),
    body: JSON.stringify({
      model: settings.model.trim() || "koboldcpp",
      messages,
      temperature: settings.temperature,
      max_tokens: maxTokens,
    }),
  });
  if (!response.ok) {
    const detail = await readDetail(response);
    throw new Error(explainFetchError(undefined, response, detail));
  }
  const payload = (await response.json()) as {
    choices?: { message?: { content?: unknown } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) return content;
  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("");
    if (text.trim()) return text;
  }
  throw new Error("KoboldCPP returned an empty reply.");
}

export async function askText(settings: KoboldSettings, system: string, user: string, maxTokens = 400): Promise<string> {
  return complete(settings, [
    { role: "system", content: system },
    { role: "user", content: user },
  ], maxTokens);
}

const SYSTEM = `You write character cards for Marinara Engine, which reads SillyTavern Character Card V2.
Return one JSON object and nothing else. No markdown fences. No commentary.
Use {{char}} for the character and {{user}} for the person they meet. Do not invent a name for {{user}}.
Write concrete facts, not adjective piles. first_mes is spoken in character, with actions in asterisks.
mes_example contains two or three exchanges, each block starting with <START>.
summary is one sentence for a library list and is not roleplay prose.
tags is an array of 3 to 6 short labels.
talkativeness is an integer from 0 to 100.
Leave system_prompt and post_history_instructions as empty strings unless the concept demands a hard rule.`;

const VISION = `Reference images are attached. They are the character, not a suggestion.
appearance must match what is visible: face, body, clothing, colors, and setting cues.
Do not invent a conflicting look. You may name them and write personality if the concept does not.`;

function cardSchemaHint(): string {
  return `JSON keys:
{
  "name": "",
  "summary": "",
  "description": "",
  "personality": "",
  "scenario": "",
  "first_mes": "",
  "mes_example": "",
  "creator_notes": "",
  "backstory": "",
  "appearance": "",
  "tags": [],
  "alternate_greetings": [],
  "talkativeness": 50,
  "system_prompt": "",
  "post_history_instructions": ""
}`;
}

export async function probeKobold(settings: KoboldSettings): Promise<string> {
  const response = await request(settings, "models", {
    headers: headers(settings.apiKey),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) {
    const detail = await readDetail(response);
    throw new Error(explainFetchError(undefined, response, detail));
  }
  const payload = (await response.json()) as { data?: { id?: string }[] };
  const id = payload.data?.find((item) => item.id)?.id;
  return id ? `Connected. Model: ${id}` : "Connected to KoboldCPP.";
}

export async function generateCard(
  settings: KoboldSettings,
  concept: string,
  images: string[] = [],
): Promise<CharacterCard> {
  const trimmed = concept.trim();
  const pictures = images.filter(Boolean);
  if (trimmed.length < 8 && pictures.length === 0) {
    throw new Error("Describe the character in a sentence or two, or add a reference picture.");
  }
  const conceptText =
    trimmed.length >= 8
      ? trimmed
      : "No written concept. Take the character's look from the reference pictures and build the rest to match.";
  const system = pictures.length ? `${SYSTEM}\n${VISION}` : SYSTEM;
  const messages: ChatMessage[] = [
    { role: "system", content: system },
    {
      role: "user",
      content: withPictures(`Write a full character card from this concept:\n${conceptText}\n\n${cardSchemaHint()}`, pictures),
    },
  ];
  let raw = await complete(settings, messages);
  try {
    return cardFromUnknown(extractJson(raw), EMPTY_CARD);
  } catch (error) {
    messages.push({ role: "assistant", content: raw });
    messages.push({
      role: "user",
      content: withPictures("That was not valid JSON. Reply again with only the JSON object, no fences.", pictures),
    });
    raw = await complete(settings, messages);
    try {
      return cardFromUnknown(extractJson(raw), EMPTY_CARD);
    } catch {
      throw error instanceof Error ? error : new Error("Could not read the card.");
    }
  }
}

const FIELD_GUIDE: Record<StringField, string> = {
  name: "A fitting proper name only.",
  summary: "One sentence for a library preview. Not roleplay prose.",
  description: "120 to 220 words. Who they are. Use {{char}} and {{user}}.",
  personality: "How they behave and speak. Concrete habits.",
  scenario: "The default opening situation. Use {{char}} and {{user}}.",
  first_mes: "80 to 180 words, in character, actions in asterisks. End on something {{user}} can answer.",
  mes_example: "Two exchanges. Each begins with <START> on its own line.",
  creator_notes: "A short note for the human, including tone or content if it matters.",
  system_prompt: "Only if a hard rule is required. Otherwise empty string.",
  post_history_instructions: "Only if a hard rule must sit after history. Otherwise empty string.",
  creator: "Keep Cardwright unless the concept names an author.",
  character_version: "A short version string, usually 1.0.",
  backstory: "Established past. Facts, not a scene.",
  appearance: "Visual specifics another artist could draw. Match any reference pictures exactly.",
};

export async function rewriteField(
  settings: KoboldSettings,
  concept: string,
  card: CharacterCard,
  field: StringField,
  images: string[] = [],
): Promise<string> {
  const pictures = field === "appearance" || field === "description" ? images : [];
  const system = pictures.length ? `${SYSTEM}\n${VISION}` : SYSTEM;
  const messages: ChatMessage[] = [
    { role: "system", content: system },
    {
      role: "user",
      content: withPictures(
        `Rewrite only the "${field}" field.
Guide: ${FIELD_GUIDE[field]}
Concept: ${concept.trim() || "(none — infer from the card and any pictures)"}
Current card JSON:
${JSON.stringify(card)}
Current ${field}:
${card[field]}

Return {"value":"..."} and nothing else.`,
        pictures,
      ),
    },
  ];
  const raw = await complete(settings, messages);
  const parsed = extractJson(raw);
  if (parsed && typeof parsed === "object" && "value" in parsed && typeof parsed.value === "string") {
    return parsed.value;
  }
  if (typeof parsed === "object" && parsed && field in parsed) {
    const value = (parsed as Record<string, unknown>)[field];
    if (typeof value === "string") return value;
  }
  throw new Error("The model did not return a value for that field.");
}

const PERSONA_SYSTEM = `You write a Marinara persona: the character card that stands for the human in a chat, not the character they talk to.
Return one JSON object and nothing else. No markdown fences. No commentary.
Use {{user}} for this persona and {{char}} for the other character. Do not invent a name for {{char}}.
Write concrete facts. first_mes must be an empty string. alternate_greetings must be an empty array.
mes_example shows how {{user}} speaks, two short exchanges, each block starting with <START>.
summary is one sentence for a library list.
tags is an array of 3 to 6 short labels.
Leave system_prompt and post_history_instructions as empty strings.`;

export async function generatePersona(settings: KoboldSettings, concept: string, images: string[] = []): Promise<CharacterCard> {
  const trimmed = concept.trim();
  const pictures = images.filter(Boolean);
  if (trimmed.length < 8 && pictures.length === 0) {
    throw new Error("Describe the persona in a sentence or two, or add a portrait.");
  }
  const conceptText =
    trimmed.length >= 8 ? trimmed : "No written concept. Take the look from the portrait and build a persona to match.";
  const system = pictures.length ? `${PERSONA_SYSTEM}\n${VISION}` : PERSONA_SYSTEM;
  const messages: ChatMessage[] = [
    { role: "system", content: system },
    {
      role: "user",
      content: withPictures(`Write a persona from this concept:\n${conceptText}\n\n${cardSchemaHint()}`, pictures),
    },
  ];
  const raw = await complete(settings, messages);
  try {
    const card = cardFromUnknown(extractJson(raw), EMPTY_CARD);
    return { ...card, first_mes: "", alternate_greetings: [] };
  } catch (error) {
    messages.push({ role: "assistant", content: raw });
    messages.push({ role: "user", content: "That was not valid JSON. Reply again with only the JSON object, no fences." });
    const again = await complete(settings, messages);
    try {
      const card = cardFromUnknown(extractJson(again), EMPTY_CARD);
      return { ...card, first_mes: "", alternate_greetings: [] };
    } catch {
      throw error instanceof Error ? error : new Error("Could not read the persona.");
    }
  }
}

export async function replyInCharacter(settings: KoboldSettings, messages: ChatMessage[]): Promise<string> {
  const limit = Math.min(Math.max(settings.maxTokens, 200), 800);
  const text = (await complete(settings, messages, limit)).trim();
  if (!text) throw new Error("KoboldCPP returned an empty reply.");
  return text;
}
