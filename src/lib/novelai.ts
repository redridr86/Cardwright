export const NOVEL_MODELS = [
  { id: "nai-diffusion-5-full", label: "V5", paramsVersion: 4 },
  { id: "nai-diffusion-4-5-full", label: "V4.5", paramsVersion: 3 },
] as const;

export type NovelModelId = (typeof NOVEL_MODELS)[number]["id"];

export const STYLE_PROFILES = [
  { id: "anime", label: "Anime", source: "Danbooru / Illustrious", prefix: "masterpiece, best quality", negative: "low quality, blurry" },
  { id: "semi", label: "Semi-realistic", source: "illustration", prefix: "masterpiece, best quality, semi-realistic", negative: "low quality, blurry" },
  { id: "furry", label: "Furry", source: "fur dataset", prefix: "fur dataset, masterpiece, best quality", negative: "low quality, blurry" },
  { id: "none", label: "None", source: "no extra tags", prefix: "", negative: "" },
] as const;

export type StyleProfileId = (typeof STYLE_PROFILES)[number]["id"];

export type NovelGenSettings = {
  seed: number;
  styleProfile: StyleProfileId;
  steps: number;
  guidance: number;
  guidanceRescale: number;
  ucPreset: number;
  promptPrefix: string;
  negativePrefix: string;
  sampler: string;
  noiseSchedule: string;
  width: number;
  height: number;
  sizeFromCount: boolean;
  styleStrength: number;
  styleFidelity: number;
};

export const DEFAULT_NOVEL_GEN: NovelGenSettings = {
  seed: -1,
  styleProfile: "anime",
  steps: 25,
  guidance: 6,
  guidanceRescale: 0,
  ucPreset: 4,
  promptPrefix: "",
  negativePrefix: "",
  sampler: "k_euler_ancestral",
  noiseSchedule: "karras",
  width: 1024,
  height: 1024,
  sizeFromCount: false,
  styleStrength: 0.8,
  styleFidelity: 0.8,
};

export function novelGenOf(input?: Partial<NovelGenSettings> | null): NovelGenSettings {
  const next: NovelGenSettings = { ...DEFAULT_NOVEL_GEN };
  if (!input) return next;
  const source = input as Record<string, unknown>;
  (Object.keys(DEFAULT_NOVEL_GEN) as (keyof NovelGenSettings)[]).forEach((key) => {
    const value = source[key];
    if (value !== undefined && value !== null) (next as Record<string, unknown>)[key] = value;
  });
  if (!STYLE_PROFILES.some((profile) => profile.id === next.styleProfile)) next.styleProfile = "anime";
  return next;
}

export function styleProfile(id: string) {
  return STYLE_PROFILES.find((profile) => profile.id === id) ?? STYLE_PROFILES[0];
}

export function appearancePrompt(parts: { name: string; appearance: string; description: string; concept: string }): string {
  const chunks = [parts.appearance, parts.name, parts.description, parts.concept]
    .map((part) => part.trim())
    .filter(Boolean);
  if (chunks.length === 0) return "";
  return `${chunks.join(", ")}, portrait, upper body, looking at viewer`.slice(0, 2000);
}

export function snapSize(value: number): number {
  const number = Number.isFinite(value) ? value : 1024;
  const clamped = Math.min(1600, Math.max(64, number));
  return Math.round(clamped / 64) * 64;
}

export function characterCount(prompt: string): number | null {
  const pattern = /(\d+)\s*(girls?|boys?|others?|people|persons?|characters?)/gi;
  let total = 0;
  let found = false;
  for (const match of prompt.matchAll(pattern)) {
    found = true;
    total += Number(match[1]);
  }
  if (found) return Math.min(Math.max(total, 1), 12);
  if (/\bsolo\b/i.test(prompt)) return 1;
  return null;
}

export function resolutionFor(prompt: string, gen: NovelGenSettings): { width: number; height: number } {
  const requested = { width: snapSize(gen.width), height: snapSize(gen.height) };
  if (!gen.sizeFromCount) return requested;
  const count = characterCount(prompt);
  if (count === null) return requested;
  if (count <= 1) return { width: 832, height: 1216 };
  if (count === 2) return { width: 1024, height: 1024 };
  return { width: 1216, height: 832 };
}

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function composePrompt(prompt: string, gen: NovelGenSettings): { positive: string; negative: string } {
  const profile = styleProfile(gen.styleProfile);
  let body = prompt.trim();
  if (profile.id === "furry" && !/fur dataset/i.test(`${gen.promptPrefix} ${body}`)) {
    body = body ? `fur dataset, ${body}` : "fur dataset";
  }
  if (profile.id === "semi" && !/semi-realistic/i.test(`${gen.promptPrefix} ${body}`)) {
    body = body ? `semi-realistic, ${body}` : "semi-realistic";
  }
  const positive = [gen.promptPrefix, body]
    .map((part) => part.trim().replace(/^,+|,+$/g, ""))
    .filter(Boolean)
    .join(", ");
  const negative = gen.negativePrefix.trim();
  return { positive: positive.slice(0, 4000), negative: negative.slice(0, 2000) };
}

export function novelPayload(prompt: string, modelId: string, genInput?: Partial<NovelGenSettings> | null, stylePlate?: string | null) {
  const model = NOVEL_MODELS.find((item) => item.id === modelId) ?? NOVEL_MODELS[0];
  const gen = novelGenOf(genInput);
  const { positive, negative } = composePrompt(prompt, gen);
  const size = resolutionFor(positive, gen);
  const seed = gen.seed < 0 ? Math.floor(Math.random() * 4294967295) : Math.floor(gen.seed) >>> 0;
  const parameters: Record<string, unknown> = {
    params_version: model.paramsVersion,
    width: size.width,
    height: size.height,
    scale: clamp(gen.guidance, 0, 10, 6),
    sampler: gen.sampler.trim() || "k_euler_ancestral",
    steps: Math.round(clamp(gen.steps, 1, 50, 25)),
    seed,
    n_samples: 1,
    negative_prompt: negative,
    qualityToggle: true,
    ucPreset: Math.round(clamp(gen.ucPreset, 0, 4, 4)),
    cfg_rescale: clamp(gen.guidanceRescale, 0, 1, 0),
    noise_schedule: gen.noiseSchedule.trim() || "karras",
    skip_cfg_above_sigma: null,
    sm: false,
    sm_dyn: false,
    dynamic_thresholding: false,
    controlnet_strength: 1,
    legacy: false,
    add_original_image: true,
    uncond_scale: 1,
    deliberate_euler_ancestral_bug: false,
    prefer_brownian: true,
    v4_prompt: {
      caption: { base_caption: positive, char_captions: [] },
      use_coords: false,
      use_order: true,
    },
    v4_negative_prompt: {
      caption: { base_caption: negative, char_captions: [] },
      legacy_uc: false,
    },
  };
  const plate = stylePlate?.trim() ?? "";
  if (plate && !model.id.startsWith("nai-diffusion-5")) {
    parameters.reference_image_multiple = [plate];
    parameters.reference_strength_multiple = [clamp(gen.styleStrength, 0, 1, 0.8)];
    parameters.reference_information_extracted_multiple = [clamp(gen.styleFidelity, 0, 1, 0.8)];
  }
  return {
    input: positive,
    model: model.id,
    action: "generate",
    parameters,
  };
}

export function explainNovelError(status: number, body: string): string {
  let message = "";
  try {
    const parsed = JSON.parse(body) as { message?: unknown };
    if (typeof parsed.message === "string") message = parsed.message;
  } catch {
    message = body.replace(/\s+/g, " ").slice(0, 180);
  }
  if (status === 401 || status === 403) {
    return "NovelAI refused that token. Use the persistent API token from your NovelAI account settings, the one that starts with pst-.";
  }
  if (status === 402 || /anlas/i.test(message)) {
    return "NovelAI refused the draw. You are out of Anlas, or this model is not on your subscription.";
  }
  if (message && !message.startsWith("<")) return `NovelAI answered with HTTP ${status}. ${message}`;
  return `NovelAI answered with HTTP ${status}.`;
}

export async function pngFromZip(bytes: Uint8Array): Promise<Uint8Array> {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50) return bytes;
  const entry = zipEntry(bytes);
  if (!entry) throw new Error("NovelAI did not return a picture.");
  if (entry.method === 0) return entry.data;
  if (entry.method !== 8) throw new Error("NovelAI returned a picture this app could not unpack.");
  return inflateRaw(entry.data);
}

function zipEntry(bytes: Uint8Array): { method: number; data: Uint8Array } | null {
  const eocd = findEocd(bytes);
  if (eocd < 0) return null;
  const count = u16(bytes, eocd + 10);
  let offset = u32(bytes, eocd + 16);
  for (let index = 0; index < count; index += 1) {
    if (u32(bytes, offset) !== 0x02014b50) return null;
    const method = u16(bytes, offset + 10);
    const compSize = u32(bytes, offset + 20);
    const nameLen = u16(bytes, offset + 28);
    const extraLen = u16(bytes, offset + 30);
    const commentLen = u16(bytes, offset + 32);
    const localOffset = u32(bytes, offset + 42);
    const name = new TextDecoder().decode(bytes.subarray(offset + 46, offset + 46 + nameLen));
    offset += 46 + nameLen + extraLen + commentLen;
    if (!name.toLowerCase().endsWith(".png")) continue;
    if (compSize === 0xffffffff || localOffset === 0xffffffff) {
      throw new Error("NovelAI returned a picture this app could not unpack.");
    }
    const localName = u16(bytes, localOffset + 26);
    const localExtra = u16(bytes, localOffset + 28);
    const dataStart = localOffset + 30 + localName + localExtra;
    const dataEnd = dataStart + compSize;
    if (dataEnd > bytes.length) return null;
    return { method, data: bytes.subarray(dataStart, dataEnd) };
  }
  return null;
}

function findEocd(bytes: Uint8Array): number {
  const start = Math.max(0, bytes.length - 22 - 65535);
  for (let index = bytes.length - 22; index >= start; index -= 1) {
    if (u32(bytes, index) === 0x06054b50) return index;
  }
  return -1;
}

function u16(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function u32(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  try {
    const bytes = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    throw new Error("NovelAI returned a picture this app could not unpack.");
  }
}

export function pngDataUrl(bytes: Uint8Array): string {
  let binary = "";
  const step = 0x8000;
  for (let index = 0; index < bytes.length; index += step) {
    binary += String.fromCharCode(...bytes.subarray(index, index + step));
  }
  return `data:image/png;base64,${btoa(binary)}`;
}

export function dataUrlPayload(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

export async function drawNovelPortrait(
  token: string,
  prompt: string,
  modelId: string,
  gen?: Partial<NovelGenSettings> | null,
  stylePlate?: string | null,
): Promise<Uint8Array> {
  const trimmed = token.trim();
  if (trimmed.length < 8) {
    throw new Error("Paste your NovelAI persistent token first. It starts with pst- and is not your password.");
  }
  if (prompt.trim().length < 3 && novelGenOf(gen).promptPrefix.trim().length < 3) {
    throw new Error("Write a prompt, or use the appearance, before drawing.");
  }
  let response: Response;
  try {
    response = await fetch("/api/novelai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${trimmed}`,
      },
      body: JSON.stringify(novelPayload(prompt, modelId, gen, stylePlate)),
      signal: AbortSignal.timeout(180_000),
    });
  } catch {
    throw new Error("Could not reach NovelAI. In the Windows app this goes out from your PC. Check the connection and try again.");
  }
  if (!response.ok) {
    throw new Error(explainNovelError(response.status, await response.text()));
  }
  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await response.arrayBuffer());
  } catch {
    throw new Error("The picture download from NovelAI was interrupted. Try again.");
  }
  return pngFromZip(bytes);
}

export function novelFailure(error: unknown): string {
  if (error instanceof Error && error.message && !/failed to fetch|networkerror|load failed/i.test(error.message)) {
    return error.message;
  }
  return "Could not reach NovelAI. Check the token and your connection, then try the draw again.";
}
