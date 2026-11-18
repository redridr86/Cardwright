import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { EMPTY_CARD } from "./card.ts";
import { buildPresetMessages, expandMacros, parseMarinaraPreset, starterPreset } from "./preset.ts";

test("starter preset keeps disabled sections out and fills the character marker", () => {
  const preset = starterPreset();
  preset.sections = preset.sections.map((section) => (section.name === "Your turn" ? { ...section, enabled: false } : section));
  const card = { ...EMPTY_CARD, name: "Ivo", description: "Keeps the night desk.", mes_example: "Ivo: The book is overdue." };
  const persona = { ...EMPTY_CARD, name: "Ada", description: "A regular." };
  const messages = buildPresetMessages(preset, card, persona, [{ role: "user", text: "Hello." }], () => 0);
  const joined = messages.map((message) => message.content).join("\n");
  assert.match(joined, /Keeps the night desk/);
  assert.match(joined, /Ada/);
  assert.match(joined, /overdue/);
  assert.match(joined, /Hello/);
  assert.doesNotMatch(joined, /Continue as Ivo/);
  assert.ok(messages.some((message) => message.role === "user" && message.content === "Hello."));
});

test("macros expand setvar before getvar and honor toggled choices", () => {
  const ctx = { vars: { promptAuthorStyle: "plain" }, charName: "Ivo", userName: "Ada", rng: () => 0 };
  const text = expandMacros("Style {{getvar::promptAuthorStyle}}. {{setvar::promptAuthorStyle::sharp}} Now {{promptAuthorStyle}}.", ctx);
  assert.match(text, /Style plain/);
  assert.match(text, /Now sharp/);
  assert.equal(ctx.vars.promptAuthorStyle, "sharp");
});

test("White Lotus import keeps disabled sections off and uses the character marker", () => {
  const raw = JSON.parse(readFileSync(new URL("../../attachments/White Lotus [4.1.0].marinara.json", import.meta.url), "utf8")) as unknown;
  const preset = parseMarinaraPreset(raw);
  const kimi = preset.sections.find((section) => section.name.includes("Kimi"));
  assert.equal(kimi?.enabled, false);
  const card = { ...EMPTY_CARD, name: "Ivo", description: "Night librarian of the unfinished stacks." };
  const messages = buildPresetMessages(preset, card, null, [{ role: "user", text: "I return the book." }], () => 0);
  const joined = messages.map((message) => message.content).join("\n");
  assert.match(joined, /Night librarian/);
  assert.match(joined, /I return the book/);
  assert.doesNotMatch(joined, /skip the excessively long/);
  assert.match(joined, /Jemisin|Berserk/);
});
