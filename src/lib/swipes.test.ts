import assert from "node:assert/strict";
import test from "node:test";
import { addedSwipe, greetingOptions, movedSwipe, paintedImage } from "./swipes.ts";

test("each greeting is kept and blank boxes are skipped", () => {
  assert.deepEqual(greetingOptions("Hello there", ["", "  ", "A second opening"]), ["Hello there", "A second opening"]);
  assert.deepEqual(greetingOptions("  ", ["Only extra"]), ["Only extra"]);
});

test("regenerate keeps the previous line as a swipe", () => {
  const first = { text: "Hello", image: null, swipes: [{ text: "Hello", image: null }], swipe: 0 };
  const next = addedSwipe(first, "Hi again");
  assert.equal(next.text, "Hi again");
  assert.equal(next.swipe, 1);
  assert.equal(next.swipes[0]?.text, "Hello");
  const back = movedSwipe(next, -1);
  assert.equal(back.text, "Hello");
  assert.equal(back.swipe, 0);
  assert.equal(movedSwipe(back, 1).text, "Hi again");
});

test("editing a swipe is kept when you move to another greeting", () => {
  const turn = {
    text: "Changed",
    image: "data:image/png;base64,aa",
    swipes: [
      { text: "Hello", image: null },
      { text: "Hi", image: null },
    ],
    swipe: 0,
  };
  const next = movedSwipe(turn, 1);
  assert.equal(next.swipes[0]?.text, "Changed");
  assert.equal(next.swipes[0]?.image, "data:image/png;base64,aa");
  assert.equal(next.text, "Hi");
  assert.equal(next.image, null);
});

test("a picture stays on the swipe that was showing", () => {
  const turn = { text: "Hello", image: null, swipes: [{ text: "Hello", image: null }], swipe: 0 };
  const drawn = paintedImage(turn, "data:image/png;base64,bb");
  assert.equal(drawn.image, "data:image/png;base64,bb");
  assert.equal(drawn.swipes[0]?.image, "data:image/png;base64,bb");
  const cleared = paintedImage(drawn, null);
  assert.equal(cleared.image, null);
  assert.equal(cleared.swipes[0]?.image, null);
});
