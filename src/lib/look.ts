import type { CSSProperties } from "react";

export type ChatLook = {
  nameColor: string;
  dialogueColor: string;
  boxColor: string;
};

export const EMPTY_LOOK: ChatLook = {
  nameColor: "",
  dialogueColor: "",
  boxColor: "",
};

export type AppTheme = {
  bg: string;
  surface: string;
  surface2: string;
  fg: string;
  muted: string;
  border: string;
  primary: string;
  primaryFg: string;
  paper: string;
  ink: string;
  inkSoft: string;
  gold: string;
  dialogueDefault: string;
  boldDialogue: boolean;
  chatTextSize: number;
};

export const DEFAULT_THEME: AppTheme = {
  bg: "#12100e",
  surface: "#1c1814",
  surface2: "#26211c",
  fg: "#f6f1ea",
  muted: "#a3988c",
  border: "#3a322b",
  primary: "#d4654a",
  primaryFg: "#1a0e0a",
  paper: "#f6f1ea",
  ink: "#231c16",
  inkSoft: "#5c5148",
  gold: "#e8b86d",
  dialogueDefault: "",
  boldDialogue: false,
  chatTextSize: 15,
};

const COLOR =
  /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.\s,%]+\s*\)|hsla?\(\s*[\d.\s,%deg]+\s*\)|[a-zA-Z]{3,24}|(?:linear|radial|conic)-gradient\([^;{}]{1,280}\))$/;

export function sanitizeColor(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > 300) return "";
  if (/url\(|expression|javascript:|;|\{|\}|@/i.test(trimmed)) return "";
  return COLOR.test(trimmed) ? trimmed : "";
}

export function isGradient(value: string): boolean {
  return /^(?:linear|radial|conic)-gradient\(/i.test(value);
}

export function lookOf(look?: Partial<ChatLook> | null): ChatLook {
  return {
    nameColor: sanitizeColor(look?.nameColor ?? ""),
    dialogueColor: sanitizeColor(look?.dialogueColor ?? ""),
    boxColor: sanitizeColor(look?.boxColor ?? ""),
  };
}

export function themeOf(theme?: Partial<AppTheme> | null): AppTheme {
  const next: AppTheme = { ...DEFAULT_THEME };
  if (!theme) return next;
  (Object.keys(DEFAULT_THEME) as (keyof AppTheme)[]).forEach((key) => {
    const value = theme[key];
    if (key === "boldDialogue") {
      if (typeof value === "boolean") next.boldDialogue = value;
      return;
    }
    if (key === "chatTextSize") {
      if (typeof value === "number" && value >= 12 && value <= 22) next.chatTextSize = Math.round(value);
      return;
    }
    if (typeof value === "string") {
      const safe = sanitizeColor(value);
      if (safe) next[key] = safe as never;
    }
  });
  return next;
}

export function textPaint(value: string, fallback = ""): CSSProperties {
  const color = sanitizeColor(value) || sanitizeColor(fallback);
  if (!color) return {};
  if (isGradient(color)) {
    return {
      backgroundImage: color,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    };
  }
  return { color };
}

export function boxPaint(value: string): CSSProperties {
  const color = sanitizeColor(value);
  if (!color) return {};
  if (isGradient(color)) return { backgroundImage: color };
  return { backgroundColor: color };
}

export type DialoguePart = { kind: "talk" | "act" | "plain"; text: string };

const DIALOGUE = /(\*[^*]*\*|“[^”]*”|"[^"\n]*"|«[^»]*»|「[^」]*」)/g;

export function splitDialogue(text: string): DialoguePart[] {
  const parts: DialoguePart[] = [];
  let last = 0;
  for (const match of text.matchAll(DIALOGUE)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: "plain", text: text.slice(last, index) });
    const token = match[0];
    parts.push({ kind: token.startsWith("*") ? "act" : "talk", text: token });
    last = index + token.length;
  }
  if (last < text.length) parts.push({ kind: "plain", text: text.slice(last) });
  if (parts.length === 0) parts.push({ kind: "plain", text });
  return parts;
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const map: Record<string, string> = {
    "--color-bg": theme.bg,
    "--color-surface": theme.surface,
    "--color-surface-2": theme.surface2,
    "--color-fg": theme.fg,
    "--color-muted": theme.muted,
    "--color-border": theme.border,
    "--color-primary": theme.primary,
    "--color-primary-fg": theme.primaryFg,
    "--color-paper": theme.paper,
    "--color-ink": theme.ink,
    "--color-ink-soft": theme.inkSoft,
    "--color-gold": theme.gold,
  };
  for (const [key, value] of Object.entries(map)) {
    const safe = sanitizeColor(value);
    if (safe) root.style.setProperty(key, safe);
  }
}
