import assert from "node:assert/strict";
import test from "node:test";
import { injectTextChunk, readTextChunk } from "./png-chunks.ts";

const TINY_PNG = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  ),
  (char) => char.charCodeAt(0),
);

test("chara text chunk round-trips through a PNG", () => {
  const next = injectTextChunk(TINY_PNG, "chara", "eyJoZWxsbyI6MX0=");
  assert.equal(readTextChunk(next, "chara"), "eyJoZWxsbyI6MX0=");
  assert.equal(next[0], 137);
});
