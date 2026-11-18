import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createLife, normalizeLife, type Life } from "@/lib/life";

type LifeState = {
  lives: Life[];
  activeId: string | null;
  start: (input: Parameters<typeof createLife>[0]) => string;
  open: (id: string) => void;
  close: () => void;
  remove: (id: string) => void;
  replace: (life: Life) => void;
};

export const useLife = create<LifeState>()(
  persist(
    (set, get) => ({
      lives: [],
      activeId: null,
      start: (input) => {
        const life = createLife(input);
        set({ lives: [life, ...get().lives.filter((item) => item.id !== life.id)], activeId: life.id });
        return life.id;
      },
      open: (id) => set({ activeId: id }),
      close: () => set({ activeId: null }),
      remove: (id) =>
        set({
          lives: get().lives.filter((item) => item.id !== id),
          activeId: get().activeId === id ? null : get().activeId,
        }),
      replace: (life) => set({ lives: get().lives.map((item) => (item.id === life.id ? normalizeLife(life) : item)) }),
    }),
    {
      name: "cardwright-life",
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<LifeState>;
        const lives = Array.isArray(saved.lives) ? saved.lives.map((item) => normalizeLife(item)) : [];
        return { ...current, ...saved, lives, activeId: saved.activeId ?? null };
      },
    },
  ),
);
