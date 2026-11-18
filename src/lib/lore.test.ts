import assert from "node:assert/strict";
import test from "node:test";
import { activateBooks, lorebookFromUnknown, type Lorebook } from "./lore.ts";
import { lookOf, sanitizeColor, splitDialogue } from "./look.ts";
import { cardFromUnknown, toCharacterCardV2 } from "./card.ts";

test("short lore keys do not match inside other words", () => {
  const book: Lorebook = {
    id: "b",
    name: "Harbor",
    kind: "lore",
    description: "",
    scanDepth: 2,
    updatedAt: 1,
    entries: [
      { id: "e1", name: "Cat", keys: "cat", content: "The cat is a rumor.", enabled: true, constant: false, order: 1 },
      { id: "e2", name: "Always", keys: "", content: "The lamps stay lit.", enabled: true, constant: true, order: 0 },
    ],
  };
  const missed = activateBooks([book], [{ text: "A catalog arrived." }]);
  assert.match(missed, /lamps stay lit/);
  assert.doesNotMatch(missed, /rumor/);
  const hit = activateBooks([book], [{ text: "A cat crossed the dock." }]);
  assert.match(hit, /rumor/);
});

test("marinara export keeps entries that sit beside the lorebook", () => {
  const book = lorebookFromUnknown({
    lorebook: { name: "Harbor", description: "A working port" },
    entries: [{ name: "Salt", keys: ["salt", "dock"], content: "The air tastes of salt.", constant: false, enabled: true }],
  });
  assert.equal(book?.name, "Harbor");
  assert.equal(book?.description, "A working port");
  assert.equal(book?.entries.length, 1);
  assert.equal(book?.entries[0]?.content, "The air tastes of salt.");
  assert.equal(book?.entries[0]?.keys, "salt, dock");
});

test("marinara native envelope keeps entries beside the lorebook", () => {
  const book = lorebookFromUnknown({
    type: "marinara_lorebook",
    version: 1,
    data: {
      lorebook: { name: "Harbor", description: "A working port", scanDepth: 6 },
      entries: [{ id: "salt", name: "Salt", keys: ["salt"], secondaryKeys: ["brine"], content: "The air tastes of salt.", enabled: true }],
      folders: [{ id: "places", name: "Places", entries: [{ name: "Lamp", keys: ["lamp"], content: "The lamps stay lit." }] }],
    },
  });
  assert.equal(book?.name, "Harbor");
  assert.equal(book?.description, "A working port");
  assert.equal(book?.scanDepth, 6);
  assert.equal(book?.entries.length, 2);
  assert.match(book?.entries.map((entry) => entry.content).join("\n") ?? "", /tastes of salt/);
  assert.match(book?.entries.map((entry) => entry.content).join("\n") ?? "", /lamps stay lit/);
  assert.match(book?.entries[0]?.keys ?? "", /brine/);
});

test("wrapped entry objects and empty sibling lists still import", () => {
  const book = lorebookFromUnknown({
    name: "City",
    description: "Streets",
    entries: [],
    lorebook: { name: "City", description: "Streets", entries: [] },
    folders: [{ name: "People", entries: [{ entry: { comment: "Guard", primaryKeys: ["guard"], content: "The guard knows the gate." } }] }],
  });
  assert.equal(book?.entries.length, 1);
  assert.equal(book?.entries[0]?.name, "Guard");
  assert.equal(book?.entries[0]?.content, "The guard knows the gate.");
});

test("sillytavern world info uses key and comment", () => {
  const book = lorebookFromUnknown({
    name: "City",
    description: "Streets",
    entries: { "0": { comment: "Lamp", key: ["lamp"], content: "The lamps stay lit.", disable: false } },
  });
  assert.equal(book?.entries[0]?.name, "Lamp");
  assert.match(book?.entries[0]?.content ?? "", /lamps stay lit/);
});
test("character book import becomes entries", () => {
  const book = lorebookFromUnknown({
    data: {
      character_book: {
        name: "Docks",
        entries: [{ keys: ["salt"], content: "The air tastes of salt.", enabled: true, insertion_order: 3 }],
      },
    },
  });
  assert.equal(book?.name, "Docks");
  assert.equal(book?.entries[0]?.keys, "salt");
  assert.equal(book?.entries[0]?.order, 3);
});

test("chat colors round-trip and reject unsafe values", () => {
  assert.equal(sanitizeColor("linear-gradient(90deg, #fff, #000)"), "linear-gradient(90deg, #fff, #000)");
  assert.equal(sanitizeColor("red; background: url(http://evil)"), "");
  const card = cardFromUnknown({
    data: { name: "Ivo", extensions: { chat_look: { nameColor: "#e8b86d", dialogue_color: "#ffffff", boxColor: "linear-gradient(90deg, #222, #444)" } } },
  });
  assert.equal(card.chatLook.nameColor, "#e8b86d");
  assert.equal(lookOf(card.chatLook).boxColor.startsWith("linear-gradient"), true);
  const again = cardFromUnknown(toCharacterCardV2(card));
  assert.equal(again.chatLook.nameColor, "#e8b86d");
  const parts = splitDialogue('She said "stay" and *waited*.');
  assert.deepEqual(parts.map((part) => part.kind), ["plain", "talk", "plain", "act", "plain"]);
});
