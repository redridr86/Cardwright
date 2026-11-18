import assert from "node:assert/strict";
import test from "node:test";
import { spellSuggestions } from "./spell.ts";

test("spell check offers a common correction and leaves names alone", () => {
  assert.ok(spellSuggestions("recieve").includes("receive"));
  assert.ok(spellSuggestions("seperate").includes("separate"));
  assert.deepEqual(spellSuggestions("the"), []);
  assert.deepEqual(spellSuggestions("Ivo"), []);
  assert.deepEqual(spellSuggestions("KoboldCPP"), []);
});
