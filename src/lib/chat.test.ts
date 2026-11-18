import assert from "node:assert/strict";
import test from "node:test";
import { chatSummaryFrom, factsToPrompt, injectAuthorNote, sceneBrief, speakersForTurn } from "./chat.ts";
import { themeOf } from "./look.ts";

test("reply mode chooses who speaks", () => {
  const cast = [
    { id: "a", name: "Ivo" },
    { id: "b", name: "Nia" },
  ];
  assert.deepEqual(
    speakersForTurn({ mode: "named", cast, pickedId: "a", lastSpeakerId: null, userText: "Nia, the dock is quiet." }).map((speaker) => speaker.id),
    ["b"],
  );
  assert.deepEqual(
    speakersForTurn({ mode: "named", cast, pickedId: "a", lastSpeakerId: null, userText: "What now?" }).map((speaker) => speaker.id),
    ["a"],
  );
  assert.equal(speakersForTurn({ mode: "round", cast, pickedId: "a", lastSpeakerId: "a", userText: "" })[0]?.id, "b");
  assert.equal(speakersForTurn({ mode: "everyone", cast, pickedId: "a", lastSpeakerId: null, userText: "" }).length, 2);
  assert.equal(speakersForTurn({ mode: "pick", cast, pickedId: "b", lastSpeakerId: "a", userText: "Ivo" })[0]?.id, "b");
});

test("scene brief keeps every appearance", () => {
  const brief = sceneBrief({
    cards: [
      { name: "Ivo", appearance: "scarred hands", description: "" } as never,
      { name: "Nia", appearance: "green coat", description: "tall" } as never,
    ],
    persona: { name: "Alex", appearance: "red scarf", description: "" } as never,
    history: [{ id: "1", role: "assistant", text: "The lamp flickers.", speakerName: "Ivo" }],
    memory: "",
    lore: "",
  });
  assert.match(brief, /scarred hands/);
  assert.match(brief, /green coat/);
  assert.match(brief, /red scarf/);
  assert.match(brief, /Ivo: The lamp flickers/);
});

test("aliases count as a name", () => {
  const cast = [
    { id: "a", name: "Ivo", aliases: "Skipper\nDock rat" },
    { id: "b", name: "Nia" },
  ];
  assert.equal(
    speakersForTurn({ mode: "named", cast, pickedId: "b", lastSpeakerId: null, userText: "Skipper, the lamp is out." })[0]?.id,
    "a",
  );
});

test("author note sits at the requested depth", () => {
  const messages = [
    { role: "system" as const, content: "sys" },
    { role: "user" as const, content: "one" },
    { role: "assistant" as const, content: "two" },
    { role: "user" as const, content: "three" },
  ];
  const mid = injectAuthorNote(messages, "keep it cold", 1);
  assert.equal(mid.at(-2)?.content, "Author's note: keep it cold");
  assert.equal(mid.at(-1)?.content, "three");
  const end = injectAuthorNote(messages, "keep it cold", 0);
  assert.equal(end.at(-1)?.content, "Author's note: keep it cold");
});

test("long-term memory prefers a fact the chat mentions", () => {
  const facts = [
    { id: "1", text: "The crate is still missing." },
    { id: "2", text: "Nia owes Ivo a lantern." },
  ];
  const prompt = factsToPrompt(facts, "Where is the lantern?", 1);
  assert.match(prompt, /lantern/);
  assert.doesNotMatch(prompt, /crate/);
});

test("theme keeps a chat text size inside the slider", () => {
  assert.equal(themeOf({ chatTextSize: 18 }).chatTextSize, 18);
  assert.equal(themeOf({ chatTextSize: 99 }).chatTextSize, 15);
});

test("chat summary keeps the cast and the last line", () => {
  const summary = chatSummaryFrom(
    {
      id: "c1",
      title: "Dock night",
      updatedAt: 10,
      card: { name: "Ivo" },
      cardKey: "card-1",
      cast: [
        { id: "a", card: { name: "Ivo" } },
        { id: "b", card: { name: "Nia" } },
      ],
      messages: [
        { role: "assistant", text: "The lamp flickers.", image: "data:image/png;base64,AAAA" },
        { role: "user", text: "Stay close.\nPlease." },
      ],
    },
    "c1",
  );
  assert.equal(summary?.title, "Dock night");
  assert.equal(summary?.cardName, "Ivo, Nia");
  assert.equal(summary?.messages, 2);
  assert.equal(summary?.snippet, "Stay close. Please.");
  assert.equal(summary?.cardKey, "card-1");
  assert.equal(JSON.stringify(summary).includes("data:image"), false);
  assert.equal(chatSummaryFrom({ title: "missing card" }, "nope"), null);
});
