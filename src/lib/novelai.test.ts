import assert from "node:assert/strict";
import { deflateRawSync } from "node:zlib";
import test from "node:test";
import { appearancePrompt, characterCount, novelFailure, novelPayload, pngFromZip, resolutionFor, DEFAULT_NOVEL_GEN } from "./novelai.ts";

const PNG = Uint8Array.from(
  atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="),
  (char) => char.charCodeAt(0),
);

function zip(name: string, data: Uint8Array, method: 0 | 8, stored: Uint8Array, descriptor = false): Uint8Array {
  const nameBytes = new TextEncoder().encode(name);
  const localSize = descriptor ? 0 : stored.length;
  const rawSize = descriptor ? 0 : data.length;
  const flags = descriptor ? 8 : 0;
  const local = new Uint8Array(30 + nameBytes.length + stored.length + (descriptor ? 16 : 0));
  const view = new DataView(local.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(6, flags, true);
  view.setUint16(8, method, true);
  view.setUint32(18, localSize, true);
  view.setUint32(22, rawSize, true);
  view.setUint16(26, nameBytes.length, true);
  local.set(nameBytes, 30);
  local.set(stored, 30 + nameBytes.length);
  if (descriptor) {
    const mark = 30 + nameBytes.length + stored.length;
    view.setUint32(mark, 0x08074b50, true);
    view.setUint32(mark + 8, stored.length, true);
    view.setUint32(mark + 12, data.length, true);
  }
  const central = new Uint8Array(46 + nameBytes.length);
  const centralView = new DataView(central.buffer);
  centralView.setUint32(0, 0x02014b50, true);
  centralView.setUint16(8, flags, true);
  centralView.setUint16(10, method, true);
  centralView.setUint32(20, stored.length, true);
  centralView.setUint32(24, data.length, true);
  centralView.setUint16(28, nameBytes.length, true);
  central.set(nameBytes, 46);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, 1, true);
  endView.setUint16(10, 1, true);
  endView.setUint32(12, central.length, true);
  endView.setUint32(16, local.length, true);
  const out = new Uint8Array(local.length + central.length + end.length);
  out.set(local, 0);
  out.set(central, local.length);
  out.set(end, local.length + central.length);
  return out;
}

test("png is unpacked from a deflated NovelAI zip", async () => {
  const packed = zip("image_0.png", PNG, 8, deflateRawSync(PNG));
  const result = await pngFromZip(packed);
  assert.equal(result[0], 137);
  assert.equal(result.length, PNG.length);
});

test("png is unpacked when the zip sizes live in the directory", async () => {
  const stored = deflateRawSync(PNG);
  const packed = zip("image_0.png", PNG, 8, stored, true);
  const result = await pngFromZip(packed);
  assert.equal(result.length, PNG.length);
});

test("a broken picture is not reported as a network failure", async () => {
  const packed = zip("image_0.png", PNG, 8, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
  await assert.rejects(pngFromZip(packed), /could not unpack/i);
});

test("appearance prompt keeps the look and stays bounded", () => {
  const prompt = appearancePrompt({
    name: "Mara",
    appearance: "silver hair, green coat",
    description: "night clerk",
    concept: "",
  });
  assert.match(prompt, /silver hair/);
  assert.match(prompt, /portrait/);
});

test("a failed download is not blamed on Kobold", () => {
  const message = novelFailure(new TypeError("Failed to fetch"));
  assert.match(message, /NovelAI/);
  assert.doesNotMatch(message, /Kobold/);
});

test("character count picks portrait, square, or landscape", () => {
  assert.equal(characterCount("1girl, silver hair"), 1);
  assert.equal(characterCount("1girl, 1boy"), 2);
  assert.equal(characterCount("3girls"), 3);
  assert.equal(characterCount("a quiet street"), null);
  const one = resolutionFor("1girl", { ...DEFAULT_NOVEL_GEN, sizeFromCount: true });
  assert.deepEqual(one, { width: 832, height: 1216 });
  const two = resolutionFor("2girls", { ...DEFAULT_NOVEL_GEN, sizeFromCount: true });
  assert.deepEqual(two, { width: 1024, height: 1024 });
  const many = resolutionFor("3boys", { ...DEFAULT_NOVEL_GEN, sizeFromCount: true });
  assert.deepEqual(many, { width: 1216, height: 832 });
  const free = resolutionFor("pepperoni pizza", { ...DEFAULT_NOVEL_GEN, sizeFromCount: true });
  assert.deepEqual(free, { width: 1024, height: 1024 });
});

test("generation settings are sent and a fixed seed is reused", () => {
  const body = novelPayload("pepperoni pizza", "nai-diffusion-4-5-full", {
    ...DEFAULT_NOVEL_GEN,
    seed: 7,
    steps: 25,
    guidance: 6,
    ucPreset: 4,
    promptPrefix: "masterpiece",
    negativePrefix: "blurry",
    sampler: "k_euler_ancestral",
    noiseSchedule: "karras",
  });
  const parameters = body.parameters as {
    seed: number;
    steps: number;
    scale: number;
    ucPreset: number;
    sampler: string;
    noise_schedule: string;
    width: number;
    height: number;
    negative_prompt: string;
  };
  assert.equal(body.input, "masterpiece, pepperoni pizza");
  assert.equal(parameters.seed, 7);
  assert.equal(parameters.steps, 25);
  assert.equal(parameters.scale, 6);
  assert.equal(parameters.ucPreset, 4);
  assert.equal(parameters.sampler, "k_euler_ancestral");
  assert.equal(parameters.noise_schedule, "karras");
  assert.equal(parameters.width, 1024);
  assert.equal(parameters.height, 1024);
  assert.equal(parameters.negative_prompt, "blurry");
});

test("a style plate is sent only for V4.5", () => {
  const v45 = novelPayload("1girl", "nai-diffusion-4-5-full", DEFAULT_NOVEL_GEN, "abc");
  const parameters = v45.parameters as { reference_strength_multiple?: number[] };
  assert.deepEqual(parameters.reference_strength_multiple, [0.8]);
  const v5 = novelPayload("1girl", "nai-diffusion-5-full", DEFAULT_NOVEL_GEN, "abc");
  assert.equal("reference_image_multiple" in (v5.parameters as object), false);
});

test("seed -1 is replaced with a random seed", () => {
  const body = novelPayload("1girl", "nai-diffusion-5-full", { ...DEFAULT_NOVEL_GEN, seed: -1 });
  const seed = (body.parameters as { seed: number }).seed;
  assert.ok(seed >= 0);
});

