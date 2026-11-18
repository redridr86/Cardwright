import { ENGLISH_WORDS } from "./english-words.ts";

let dictionary: Map<string, number> | null = null;

function words(): Map<string, number> {
  if (dictionary) return dictionary;
  const next = new Map<string, number>();
  ENGLISH_WORDS.split("\n").forEach((word, index) => {
    if (word) next.set(word, index);
  });
  dictionary = next;
  return next;
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

function edits(word: string): string[] {
  const list: string[] = [];
  for (let index = 0; index < word.length; index += 1) {
    list.push(word.slice(0, index) + word.slice(index + 1));
    if (index < word.length - 1) {
      list.push(word.slice(0, index) + word[index + 1] + word[index] + word.slice(index + 2));
    }
  }
  for (let index = 0; index < word.length; index += 1) {
    for (const letter of LETTERS) list.push(word.slice(0, index) + letter + word.slice(index + 1));
  }
  for (let index = 0; index <= word.length; index += 1) {
    for (const letter of LETTERS) list.push(word.slice(0, index) + letter + word.slice(index));
  }
  return list;
}

export function spellSuggestions(raw: string): string[] {
  const word = raw.trim();
  if (!/^[A-Za-z][A-Za-z']*$/.test(word) || word.length < 4 || word.length > 24) return [];
  if (word.length > 1 && word === word.toUpperCase()) return [];
  const lower = word.toLowerCase().replace(/'/g, "");
  const known = words();
  if (!lower || known.has(lower)) return [];
  const ranked: { word: string; rank: number }[] = [];
  const seen = new Set<string>();
  for (const candidate of edits(lower)) {
    const rank = known.get(candidate);
    if (rank === undefined || rank >= 8000 || candidate.length < 4 || seen.has(candidate)) continue;
    seen.add(candidate);
    ranked.push({ word: candidate, rank });
  }
  ranked.sort((a, b) => a.rank - b.rank);
  const best = ranked.slice(0, 5);
  if (!best.length) return [];
  const capital = word[0] === word[0].toUpperCase();
  return best.map((item) => (capital ? item.word[0].toUpperCase() + item.word.slice(1) : item.word));
}
