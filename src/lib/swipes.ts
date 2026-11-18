export type ChatSwipe = {
  text: string;
  image: string | null;
};

export type SwipeTurn = {
  text: string;
  image?: string | null;
  swipes?: ChatSwipe[] | null;
  swipe?: number;
};

export type SwipePatch = {
  text: string;
  image: string | null;
  swipes: ChatSwipe[];
  swipe: number;
};

export function greetingOptions(first: string, alternates: string[]): string[] {
  return [first, ...alternates].map((item) => item.trim()).filter(Boolean);
}

export function cleanImage(value: unknown): string | null {
  return typeof value === "string" && value.startsWith("data:image/") ? value : null;
}

export function swipeIndex(turn: { swipe?: number }, count: number): number {
  if (count <= 0) return 0;
  const index = turn.swipe ?? 0;
  if (!Number.isFinite(index) || index < 0) return 0;
  if (index >= count) return count - 1;
  return Math.floor(index);
}

export function swipesOf(turn: SwipeTurn): ChatSwipe[] {
  if (turn.swipes && turn.swipes.length) {
    return turn.swipes.map((swipe) => ({ text: swipe.text ?? "", image: cleanImage(swipe.image) }));
  }
  return [{ text: turn.text, image: cleanImage(turn.image) }];
}

export function syncActiveSwipe(turn: SwipeTurn): ChatSwipe[] {
  const swipes = swipesOf(turn);
  const index = swipeIndex(turn, swipes.length);
  swipes[index] = { text: turn.text, image: cleanImage(turn.image) };
  return swipes;
}

export function movedSwipe(turn: SwipeTurn, direction: -1 | 1): SwipePatch {
  const swipes = syncActiveSwipe(turn);
  const index = swipeIndex(turn, swipes.length);
  const next = (index + direction + swipes.length) % swipes.length;
  const active = swipes[next] ?? { text: turn.text, image: null };
  return { text: active.text, image: active.image, swipes, swipe: next };
}

export function addedSwipe(turn: SwipeTurn, text: string): SwipePatch {
  const swipes = syncActiveSwipe(turn);
  swipes.push({ text, image: null });
  return { text, image: null, swipes, swipe: swipes.length - 1 };
}

export function paintedImage(turn: SwipeTurn, image: string | null): SwipePatch {
  const cleaned = cleanImage(image);
  const swipes = syncActiveSwipe({ ...turn, image: cleaned });
  const index = swipeIndex(turn, swipes.length);
  return { text: turn.text, image: cleaned, swipes, swipe: index };
}

export function readTurnSwipes(
  rawSwipes: unknown,
  rawIndex: unknown,
  text: string,
  image: string | null,
): SwipePatch {
  const swipes: ChatSwipe[] = [];
  if (Array.isArray(rawSwipes)) {
    for (const entry of rawSwipes) {
      if (!entry || typeof entry !== "object") continue;
      const record = entry as Record<string, unknown>;
      if (typeof record.text !== "string") continue;
      swipes.push({ text: record.text, image: cleanImage(record.image) });
    }
  }
  if (!swipes.length) swipes.push({ text, image });
  const swipe = swipeIndex({ swipe: typeof rawIndex === "number" ? rawIndex : 0 }, swipes.length);
  const active = swipes[swipe] ?? swipes[0];
  return { swipes, swipe, text: active.text, image: active.image };
}
