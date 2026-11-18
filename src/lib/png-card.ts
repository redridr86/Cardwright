import { toCharacterCardV2, type CharacterCard } from "@/lib/card";
import { injectTextChunk, readTextChunk } from "@/lib/png-chunks";

function encodeBase64(bytes: Uint8Array): string {
  let binary = "";
  const step = 0x8000;
  for (let index = 0; index < bytes.length; index += step) {
    binary += String.fromCharCode(...bytes.subarray(index, index + step));
  }
  return btoa(binary);
}

function decodeBase64(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not draw the reference picture."));
    image.src = src;
  });
}

async function canvasPng(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): Promise<Uint8Array> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the card.");
  draw(ctx);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Could not encode the card PNG."))), "image/png");
  });
  return new Uint8Array(await blob.arrayBuffer());
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(/\s+/);
  let line = "";
  let cursor = y;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) ctx.fillText(line, x, cursor);
}

async function renderCardArt(card: CharacterCard, portrait: string | null): Promise<Uint8Array> {
  if (portrait) {
    const image = await loadHtmlImage(portrait);
    const scale = Math.min(1, 1024 / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    return canvasPng(width, height, (ctx) => {
      ctx.drawImage(image, 0, 0, width, height);
      const band = Math.max(48, Math.round(height * 0.12));
      const fade = ctx.createLinearGradient(0, height - band, 0, height);
      fade.addColorStop(0, "rgba(18, 16, 14, 0)");
      fade.addColorStop(1, "rgba(18, 16, 14, 0.82)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, height - band, width, band);
      ctx.fillStyle = "#f6f1ea";
      ctx.font = `600 ${Math.max(18, Math.round(width / 18))}px Georgia, serif`;
      ctx.fillText(card.name.trim() || "Unnamed", 16, height - 18);
    });
  }

  return canvasPng(768, 1024, (ctx) => {
    ctx.fillStyle = "#f6f1ea";
    ctx.fillRect(0, 0, 768, 1024);
    ctx.fillStyle = "#d4654a";
    ctx.fillRect(48, 64, 72, 6);
    ctx.fillStyle = "#231c16";
    ctx.font = "600 54px Georgia, serif";
    wrapText(ctx, card.name.trim() || "Unnamed", 48, 140, 670, 64);
    ctx.font = "28px Georgia, serif";
    ctx.fillStyle = "#5c5148";
    wrapText(ctx, card.summary.trim() || "Character card", 48, 280, 670, 40);
  });
}

export async function buildCharacterPng(card: CharacterCard, portrait: string | null): Promise<Blob> {
  const art = await renderCardArt(card, portrait);
  const encoded = encodeBase64(new TextEncoder().encode(JSON.stringify(toCharacterCardV2(card))));
  const png = injectTextChunk(art, "chara", encoded);
  const bytes = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) as ArrayBuffer;
  return new Blob([bytes], { type: "image/png" });
}

export function readCharacterPng(bytes: Uint8Array): unknown {
  const payload = readTextChunk(bytes, "chara");
  if (!payload) throw new Error("That PNG does not contain a character card.");
  try {
    return JSON.parse(decodeBase64(payload)) as unknown;
  } catch {
    throw new Error("The card hidden in that PNG could not be read.");
  }
}
