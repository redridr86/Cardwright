import assert from "node:assert/strict";
import test from "node:test";
import { creatorFromPersona, nextCardVersion } from "./card.ts";

test("saving over a card raises the version", () => {
  assert.equal(nextCardVersion("1.0"), "1.1");
  assert.equal(nextCardVersion("1.9"), "1.10");
  assert.equal(nextCardVersion("3"), "4");
  assert.equal(nextCardVersion("draft"), "1.1");
});

test("a persona can fill the creator line", () => {
  assert.equal(creatorFromPersona({ name: "Alex", summary: "Night nurse" }), "Alex — Night nurse");
  assert.equal(creatorFromPersona({ name: "Alex", summary: "" }), "Alex");
  assert.equal(creatorFromPersona({ name: "  ", summary: "  " }), "");
});
