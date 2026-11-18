import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CharacterCard, EMPTY_CARD, cloneCard, mergeBlanks, nextCardVersion } from "@/lib/card";
import { DEFAULT_SETTINGS, type KoboldSettings } from "@/lib/kobold";
import { DEFAULT_THEME, type AppTheme } from "@/lib/look";
import type { Lorebook } from "@/lib/lore";
import type { ChatHead } from "@/lib/chats";
import { factsFromText, trackerRows, type KnowledgeMode, type MemoryFact, type ReplyMode, type TrackerRow } from "@/lib/chat";
import type { MarinaraPreset } from "@/lib/preset";
import { addedSwipe, greetingOptions, movedSwipe, paintedImage, swipeIndex, syncActiveSwipe, type ChatSwipe } from "@/lib/swipes";

export type CardRevision = {
  version: string;
  savedAt: number;
  card: CharacterCard;
};

export type ShelfItem = {
  id: string;
  name: string;
  updatedAt: number;
  card: CharacterCard;
  revisions?: CardRevision[];
};

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  image?: string | null;
  speakerId?: string | null;
  speakerName?: string | null;
  swipes?: ChatSwipe[];
  swipe?: number;
};

export type ChatMember = {
  id: string;
  card: CharacterCard;
};

type StudioState = {
  concept: string;
  card: CharacterCard;
  cardDraftId: string | null;
  settings: KoboldSettings;
  fillBlanks: boolean;
  shelf: ShelfItem[];
  novelPrompt: string;
  stylePlate: string | null;
  personaConcept: string;
  persona: CharacterCard;
  personaDraftId: string | null;
  personaFillBlanks: boolean;
  personas: ShelfItem[];
  chatCard: CharacterCard | null;
  chatPersona: CharacterCard | null;
  chatMessages: ChatTurn[];
  chatId: string | null;
  chatTitle: string;
  chatMemory: string;
  chatLoreIds: string[];
  chatWorldIds: string[];
  chatCardKey: string | null;
  chatCast: ChatMember[];
  chatSpeakerId: string | null;
  chatReplyMode: ReplyMode;
  chatFacts: MemoryFact[];
  chatLtm: boolean;
  chatTracker: TrackerRow[];
  chatTrack: boolean;
  chatKnowledge: KnowledgeMode;
  chatKnowledgeLimit: number;
  chatAuthorNote: string;
  chatAuthorDepth: number;
  chatIndex: ChatHead[];
  lorebooks: Lorebook[];
  worldbooks: Lorebook[];
  theme: AppTheme;
  presets: MarinaraPreset[];
  activePresetId: string | null;
  setConcept: (concept: string) => void;
  patchCard: (patch: Partial<CharacterCard>) => void;
  replaceCard: (card: CharacterCard) => void;
  applyGenerated: (card: CharacterCard) => void;
  patchSettings: (patch: Partial<KoboldSettings>) => void;
  setFillBlanks: (fillBlanks: boolean) => void;
  setNovelPrompt: (novelPrompt: string) => void;
  setStylePlate: (stylePlate: string | null) => void;
  saveToShelf: () => string;
  addToShelf: (card: CharacterCard) => string;
  loadFromShelf: (id: string) => void;
  removeFromShelf: (id: string) => void;
  newCard: () => void;
  setPersonaConcept: (personaConcept: string) => void;
  patchPersona: (patch: Partial<CharacterCard>) => void;
  applyGeneratedPersona: (card: CharacterCard) => void;
  setPersonaFillBlanks: (personaFillBlanks: boolean) => void;
  savePersona: () => string;
  addPersona: (card: CharacterCard) => string;
  loadPersona: (id: string) => void;
  removePersona: (id: string) => void;
  newPersona: () => void;
  startChat: (card: CharacterCard, persona: CharacterCard | null, cardKey?: string | null) => void;
  setChatPersona: (persona: CharacterCard | null) => void;
  pushChat: (turn: ChatTurn) => void;
  editChat: (id: string, text: string) => void;
  removeChat: (id: string) => void;
  setChatImage: (id: string, image: string | null) => void;
  swipeChat: (id: string, direction: -1 | 1) => void;
  appendChatSwipe: (id: string, text: string) => void;
  dropLastAssistant: () => void;
  clearChat: () => void;
  setChatTitle: (chatTitle: string) => void;
  setChatMemory: (chatMemory: string) => void;
  setChatBooks: (loreIds: string[], worldIds: string[]) => void;
  addChatMember: (id: string, card: CharacterCard) => void;
  removeChatMember: (id: string) => void;
  setChatSpeaker: (chatSpeakerId: string) => void;
  setChatReplyMode: (chatReplyMode: ReplyMode) => void;
  setChatFacts: (chatFacts: MemoryFact[]) => void;
  setChatLtm: (chatLtm: boolean) => void;
  setChatTracker: (chatTracker: TrackerRow[]) => void;
  setChatTrack: (chatTrack: boolean) => void;
  setChatKnowledge: (chatKnowledge: KnowledgeMode) => void;
  setChatKnowledgeLimit: (chatKnowledgeLimit: number) => void;
  setChatAuthorNote: (chatAuthorNote: string) => void;
  setChatAuthorDepth: (chatAuthorDepth: number) => void;
  keepFactsOnCard: () => void;
  setChatIndex: (chatIndex: ChatHead[]) => void;
  openSavedChat: (chat: {
    id: string;
    title: string;
    card: CharacterCard;
    persona: CharacterCard | null;
    messages: ChatTurn[];
    memory: string;
    loreIds: string[];
    worldIds: string[];
    cardKey: string | null;
    cast?: ChatMember[];
    speakerId?: string | null;
    replyMode?: ReplyMode;
    facts?: MemoryFact[];
    ltm?: boolean;
    tracker?: TrackerRow[];
    track?: boolean;
    knowledge?: KnowledgeMode;
    knowledgeLimit?: number;
    authorNote?: string;
    authorDepth?: number;
  }) => void;
  setLorebooks: (lorebooks: Lorebook[]) => void;
  upsertLore: (book: Lorebook) => void;
  removeLore: (id: string) => void;
  setWorldbooks: (worldbooks: Lorebook[]) => void;
  upsertWorld: (book: Lorebook) => void;
  removeWorld: (id: string) => void;
  setTheme: (theme: AppTheme) => void;
  patchChatLook: (look: CharacterCard["chatLook"]) => void;
  patchMemberLook: (id: string, look: CharacterCard["chatLook"]) => void;
  setPresets: (presets: MarinaraPreset[]) => void;
  upsertPreset: (preset: MarinaraPreset) => void;
  removePreset: (id: string) => void;
  setActivePreset: (id: string | null) => void;
};

function versionRank(value: string): number {
  const match = value.trim().match(/^(\d+)(?:\.(\d+))?/);
  if (!match) return 0;
  return Number(match[1]) * 1000 + Number(match[2] ?? 0);
}

function highestVersion(item: ShelfItem): string {
  let best = item.card.character_version.trim() || "1.0";
  let rank = versionRank(best);
  for (const revision of item.revisions ?? []) {
    const next = versionRank(revision.version);
    if (next > rank) {
      rank = next;
      best = revision.version;
    }
  }
  return best;
}

function upsert(list: ShelfItem[], id: string | null, card: CharacterCard, revisions?: CardRevision[]): { list: ShelfItem[]; id: string } {
  const name = card.name.trim() || "Untitled";
  const nextCard = cloneCard(card);
  if (id && list.some((item) => item.id === id)) {
    return {
      id,
      list: list.map((item) =>
        item.id === id ? { ...item, name, updatedAt: Date.now(), card: nextCard, revisions: revisions ?? item.revisions ?? [] } : item,
      ),
    };
  }
  const created = crypto.randomUUID();
  return {
    id: created,
    list: [{ id: created, name, updatedAt: Date.now(), card: nextCard, revisions: revisions ?? [] }, ...list],
  };
}

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      concept: "",
      card: cloneCard(EMPTY_CARD),
      cardDraftId: null,
      settings: { ...DEFAULT_SETTINGS },
      fillBlanks: false,
      shelf: [],
      novelPrompt: "",
      stylePlate: null,
      personaConcept: "",
      persona: cloneCard(EMPTY_CARD),
      personaDraftId: null,
      personaFillBlanks: false,
      personas: [],
      chatCard: null,
      chatPersona: null,
      chatMessages: [],
      chatId: null,
      chatTitle: "",
      chatMemory: "",
      chatLoreIds: [],
      chatWorldIds: [],
      chatCardKey: null,
      chatCast: [],
      chatSpeakerId: null,
      chatReplyMode: "pick",
      chatFacts: [],
      chatLtm: true,
      chatTracker: [],
      chatTrack: true,
      chatKnowledge: "keywords",
      chatKnowledgeLimit: 30,
      chatAuthorNote: "",
      chatAuthorDepth: 2,
      chatIndex: [],
      lorebooks: [],
      worldbooks: [],
      theme: { ...DEFAULT_THEME },
      presets: [],
      activePresetId: null,
      setConcept: (concept) => set({ concept }),
      patchCard: (patch) => {
        const card = { ...get().card, ...patch };
        const draftId = get().cardDraftId;
        const touchChat = "aliases" in patch || "chatLook" in patch || "longMemory" in patch || "name" in patch;
        if (!touchChat) {
          set({ card });
          return;
        }
        const matches = (id: string) => id === "editor" || (draftId !== null && id === draftId);
        const chatCast = get().chatCast.map((member) => (matches(member.id) ? { ...member, card: cloneCard({ ...member.card, ...patch }) } : member));
        const primary = chatCast[0];
        const currentChat = get().chatCard;
        const chatCard = currentChat && primary && matches(primary.id) ? cloneCard({ ...currentChat, ...patch }) : currentChat;
        set({ card, chatCast, chatCard });
      },
      replaceCard: (card) => set({ card: cloneCard(card) }),
      applyGenerated: (card) => {
        const current = get().card;
        set({ card: get().fillBlanks ? mergeBlanks(current, card) : cloneCard(card) });
      },
      patchSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      setFillBlanks: (fillBlanks) => set({ fillBlanks }),
      setNovelPrompt: (novelPrompt) => set({ novelPrompt }),
      setStylePlate: (stylePlate) => set({ stylePlate }),
      saveToShelf: () => {
        const id = get().cardDraftId;
        const existing = id ? get().shelf.find((item) => item.id === id) : undefined;
        let card = get().card;
        let revisions = existing?.revisions ?? [];
        if (existing) {
          revisions = [
            ...revisions,
            {
              version: existing.card.character_version.trim() || "1.0",
              savedAt: existing.updatedAt || Date.now(),
              card: cloneCard(existing.card),
            },
          ].slice(-40);
          card = cloneCard({ ...card, character_version: nextCardVersion(highestVersion(existing)) });
        } else if (!card.character_version.trim()) {
          card = cloneCard({ ...card, character_version: "1.0" });
        }
        const saved = upsert(get().shelf, id, card, revisions);
        set({ shelf: saved.list, cardDraftId: saved.id, card });
        return saved.id;
      },
      addToShelf: (card) => {
        const saved = upsert(get().shelf, null, card);
        set({ shelf: saved.list });
        return saved.id;
      },
      loadFromShelf: (id) => {
        const item = get().shelf.find((entry) => entry.id === id);
        if (item) set({ card: cloneCard(item.card), cardDraftId: id });
      },
      removeFromShelf: (id) =>
        set({
          shelf: get().shelf.filter((entry) => entry.id !== id),
          cardDraftId: get().cardDraftId === id ? null : get().cardDraftId,
        }),
      newCard: () => set({ card: cloneCard(EMPTY_CARD), concept: "", cardDraftId: null }),
      setPersonaConcept: (personaConcept) => set({ personaConcept }),
      patchPersona: (patch) => {
        const previous = get().persona;
        const persona = { ...previous, ...patch };
        const live = get().chatPersona;
        const chatPersona = live && live.name === previous.name ? cloneCard({ ...live, ...patch }) : live;
        set({ persona, chatPersona });
      },
      applyGeneratedPersona: (card) => {
        const current = get().persona;
        set({ persona: get().personaFillBlanks ? mergeBlanks(current, card) : cloneCard(card) });
      },
      setPersonaFillBlanks: (personaFillBlanks) => set({ personaFillBlanks }),
      savePersona: () => {
        const saved = upsert(get().personas, get().personaDraftId, get().persona);
        set({ personas: saved.list, personaDraftId: saved.id });
        return saved.id;
      },
      addPersona: (card) => {
        const saved = upsert(get().personas, null, card);
        set({ personas: saved.list });
        return saved.id;
      },
      loadPersona: (id) => {
        const item = get().personas.find((entry) => entry.id === id);
        if (item) set({ persona: cloneCard(item.card), personaDraftId: id });
      },
      removePersona: (id) =>
        set({
          personas: get().personas.filter((entry) => entry.id !== id),
          personaDraftId: get().personaDraftId === id ? null : get().personaDraftId,
        }),
      newPersona: () => set({ persona: cloneCard(EMPTY_CARD), personaConcept: "", personaDraftId: null }),
      startChat: (card, persona, cardKey = null) => {
        const named = card.name.trim() || "Character";
        const memberId = cardKey || crypto.randomUUID();
        const openings = greetingOptions(card.first_mes, card.alternate_greetings ?? []);
        const swipes = openings.map((text) => ({ text, image: null }));
        set({
          chatId: crypto.randomUUID(),
          chatTitle: named,
          chatCard: cloneCard(card),
          chatPersona: persona && persona.name.trim() ? cloneCard(persona) : null,
          chatMessages: swipes.length
            ? [{ id: crypto.randomUUID(), role: "assistant", text: swipes[0].text, image: null, speakerId: memberId, speakerName: named, swipes, swipe: 0 }]
            : [],
          chatMemory: "",
          chatLoreIds: card.lorebookId ? [card.lorebookId] : [],
          chatWorldIds: [],
          chatCardKey: cardKey,
          chatCast: [{ id: memberId, card: cloneCard(card) }],
          chatSpeakerId: memberId,
          chatReplyMode: "pick",
          chatFacts: factsFromText(card.longMemory ?? ""),
          chatLtm: true,
          chatTracker: trackerRows([{ id: memberId, name: named }]),
          chatTrack: true,
          chatKnowledge: "keywords",
          chatKnowledgeLimit: 30,
          chatAuthorNote: "",
          chatAuthorDepth: 2,
        });
      },
      setChatPersona: (persona) => set({ chatPersona: persona && persona.name.trim() ? cloneCard(persona) : null }),
      pushChat: (turn) => set({ chatMessages: [...get().chatMessages, turn] }),
      editChat: (id, text) =>
        set({
          chatMessages: get().chatMessages.map((turn) => {
            if (turn.id !== id) return turn;
            const next = { ...turn, text };
            const swipes = syncActiveSwipe(next);
            return { ...next, swipes, swipe: swipeIndex(next, swipes.length) };
          }),
        }),
      removeChat: (id) => set({ chatMessages: get().chatMessages.filter((turn) => turn.id !== id) }),
      setChatImage: (id, image) =>
        set({
          chatMessages: get().chatMessages.map((turn) => (turn.id === id ? { ...turn, ...paintedImage(turn, image) } : turn)),
        }),
      swipeChat: (id, direction) =>
        set({
          chatMessages: get().chatMessages.map((turn) => (turn.id === id ? { ...turn, ...movedSwipe(turn, direction) } : turn)),
        }),
      appendChatSwipe: (id, text) =>
        set({
          chatMessages: get().chatMessages.map((turn) => (turn.id === id ? { ...turn, ...addedSwipe(turn, text) } : turn)),
        }),
      dropLastAssistant: () => {
        const messages = get().chatMessages;
        const last = messages[messages.length - 1];
        if (last?.role === "assistant") set({ chatMessages: messages.slice(0, -1) });
      },
      clearChat: () =>
        set({
          chatMessages: [],
          chatCard: null,
          chatPersona: null,
          chatId: null,
          chatTitle: "",
          chatMemory: "",
          chatLoreIds: [],
          chatWorldIds: [],
          chatCardKey: null,
          chatCast: [],
          chatSpeakerId: null,
          chatReplyMode: "pick",
          chatFacts: [],
          chatLtm: true,
          chatTracker: [],
          chatTrack: true,
          chatKnowledge: "keywords",
          chatKnowledgeLimit: 30,
          chatAuthorNote: "",
          chatAuthorDepth: 2,
        }),
      setChatTitle: (chatTitle) => set({ chatTitle }),
      setChatMemory: (chatMemory) => set({ chatMemory }),
      setChatBooks: (chatLoreIds, chatWorldIds) => set({ chatLoreIds, chatWorldIds }),
      addChatMember: (id, card) => {
        const name = card.name.trim();
        if (!name) return;
        const existingCard = get().chatCard;
        const seeded = get().chatCast.length ? get().chatCast : existingCard ? [{ id: get().chatCardKey || "primary", card: existingCard }] : [];
        if (seeded.some((member) => member.id === id || member.card.name.trim() === name)) {
          if (!get().chatCast.length && seeded.length) {
            set({
              chatCast: seeded,
              chatSpeakerId: get().chatSpeakerId || seeded[0].id,
              chatTracker: trackerRows(seeded.map((member) => ({ id: member.id, name: member.card.name })), get().chatTracker),
            });
          }
          return;
        }
        const next = [...seeded, { id, card: cloneCard(card) }];
        set({
          chatCast: next,
          chatSpeakerId: get().chatSpeakerId || next[0]?.id || null,
          chatTracker: trackerRows(next.map((member) => ({ id: member.id, name: member.card.name })), get().chatTracker),
        });
      },
      removeChatMember: (id) => {
        const next = get().chatCast.filter((member) => member.id !== id);
        if (next.length === 0) return;
        set({
          chatCast: next,
          chatSpeakerId: get().chatSpeakerId === id ? next[0].id : get().chatSpeakerId,
          chatCard: next[0].card,
          chatTracker: trackerRows(next.map((member) => ({ id: member.id, name: member.card.name })), get().chatTracker),
        });
      },
      setChatSpeaker: (chatSpeakerId) => set({ chatSpeakerId }),
      setChatReplyMode: (chatReplyMode) => set({ chatReplyMode }),
      setChatFacts: (chatFacts) => set({ chatFacts }),
      setChatLtm: (chatLtm) => set({ chatLtm }),
      setChatTracker: (chatTracker) => set({ chatTracker }),
      setChatTrack: (chatTrack) => set({ chatTrack }),
      setChatKnowledge: (chatKnowledge) => set({ chatKnowledge }),
      setChatKnowledgeLimit: (chatKnowledgeLimit) => set({ chatKnowledgeLimit }),
      setChatAuthorNote: (chatAuthorNote) => set({ chatAuthorNote }),
      setChatAuthorDepth: (chatAuthorDepth) => set({ chatAuthorDepth: Math.max(0, Math.min(12, Math.round(chatAuthorDepth))) }),
      keepFactsOnCard: () => {
        const facts = get().chatFacts.map((fact) => fact.text.trim()).filter(Boolean).join("\n");
        const primary = get().chatCast[0];
        if (!primary) return;
        const card = cloneCard({ ...primary.card, longMemory: facts });
        const id = primary.id;
        set({
          chatCast: get().chatCast.map((member, index) => (index === 0 ? { ...member, card } : member)),
          chatCard: get().chatCard ? card : get().chatCard,
          card: id === "editor" || get().cardDraftId === id ? { ...get().card, longMemory: facts } : get().card,
          shelf: get().shelf.some((item) => item.id === id)
            ? get().shelf.map((item) => (item.id === id ? { ...item, card: cloneCard({ ...item.card, longMemory: facts }), updatedAt: Date.now() } : item))
            : get().shelf,
        });
      },
      setChatIndex: (chatIndex) => set({ chatIndex }),
      openSavedChat: (chat) => {
        const cast = chat.cast?.length ? chat.cast.map((member) => ({ id: member.id, card: cloneCard(member.card) })) : [{ id: chat.cardKey || "primary", card: cloneCard(chat.card) }];
        const limit = typeof chat.knowledgeLimit === "number" ? Math.max(5, Math.min(80, Math.round(chat.knowledgeLimit))) : 30;
        set({
          chatId: chat.id,
          chatTitle: chat.title,
          chatCard: cloneCard(chat.card),
          chatPersona: chat.persona && chat.persona.name.trim() ? cloneCard(chat.persona) : null,
          chatMessages: chat.messages,
          chatMemory: chat.memory,
          chatLoreIds: chat.loreIds,
          chatWorldIds: chat.worldIds,
          chatCardKey: chat.cardKey,
          chatCast: cast,
          chatSpeakerId: chat.speakerId || cast[0]?.id || chat.cardKey || "primary",
          chatReplyMode: chat.replyMode || "pick",
          chatFacts: chat.facts?.length ? chat.facts : factsFromText(chat.card.longMemory ?? ""),
          chatLtm: chat.ltm !== false,
          chatTracker: trackerRows(cast.map((member) => ({ id: member.id, name: member.card.name })), chat.tracker ?? []),
          chatTrack: chat.track !== false,
          chatKnowledge: chat.knowledge === "retrieval" ? "retrieval" : "keywords",
          chatKnowledgeLimit: limit,
          chatAuthorNote: chat.authorNote ?? "",
          chatAuthorDepth: typeof chat.authorDepth === "number" ? chat.authorDepth : 2,
        });
      },
      setLorebooks: (lorebooks) => set({ lorebooks }),
      upsertLore: (book) => {
        const lorebooks = get().lorebooks.some((item) => item.id === book.id)
          ? get().lorebooks.map((item) => (item.id === book.id ? book : item))
          : [book, ...get().lorebooks];
        set({ lorebooks });
      },
      removeLore: (id) => set({ lorebooks: get().lorebooks.filter((item) => item.id !== id) }),
      setWorldbooks: (worldbooks) => set({ worldbooks }),
      upsertWorld: (book) => {
        const worldbooks = get().worldbooks.some((item) => item.id === book.id)
          ? get().worldbooks.map((item) => (item.id === book.id ? book : item))
          : [book, ...get().worldbooks];
        set({ worldbooks });
      },
      removeWorld: (id) => set({ worldbooks: get().worldbooks.filter((item) => item.id !== id) }),
      setTheme: (theme) => set({ theme: { ...DEFAULT_THEME, ...get().theme, ...theme } }),
      patchChatLook: (look) => {
        const chatCard = get().chatCard;
        if (!chatCard) return;
        const next = cloneCard({ ...chatCard, chatLook: look });
        const key = get().chatCardKey;
        set({
          chatCard: next,
          card: key === "editor" || get().card.name === chatCard.name ? { ...get().card, chatLook: look } : get().card,
          shelf:
            key && key !== "editor"
              ? get().shelf.map((item) => (item.id === key ? { ...item, card: cloneCard({ ...item.card, chatLook: look }), updatedAt: Date.now() } : item))
              : get().shelf,
          chatCast: get().chatCast.map((member, index) => (index === 0 || member.id === key ? { ...member, card: cloneCard({ ...member.card, chatLook: look }) } : member)),
        });
      },
      patchMemberLook: (id, look) => {
        const state = get();
        const chatCast = state.chatCast.map((member) => (member.id === id ? { ...member, card: cloneCard({ ...member.card, chatLook: look }) } : member));
        const isPrimary = id === chatCast[0]?.id;
        const shelfHit = state.shelf.some((item) => item.id === id);
        const personaHit = state.personas.some((item) => item.id === id);
        set({
          chatCast,
          chatCard: state.chatCard && isPrimary ? cloneCard({ ...state.chatCard, chatLook: look }) : state.chatCard,
          card: id === "editor" || state.cardDraftId === id ? { ...state.card, chatLook: look } : state.card,
          shelf: shelfHit ? state.shelf.map((item) => (item.id === id ? { ...item, card: cloneCard({ ...item.card, chatLook: look }), updatedAt: Date.now() } : item)) : state.shelf,
          personas: personaHit ? state.personas.map((item) => (item.id === id ? { ...item, card: cloneCard({ ...item.card, chatLook: look }), updatedAt: Date.now() } : item)) : state.personas,
        });
      },
      setPresets: (presets) => set({ presets }),
      upsertPreset: (preset) => {
        const presets = get().presets.some((item) => item.id === preset.id)
          ? get().presets.map((item) => (item.id === preset.id ? preset : item))
          : [preset, ...get().presets];
        set({ presets });
      },
      removePreset: (id) =>
        set({
          presets: get().presets.filter((item) => item.id !== id),
          activePresetId: get().activePresetId === id ? null : get().activePresetId,
        }),
      setActivePreset: (activePresetId) => set({ activePresetId }),
    }),
    {
      name: "cardwright",
      skipHydration: true,
      partialize: (state) => ({
        concept: state.concept,
        card: state.card,
        cardDraftId: state.cardDraftId,
        settings: state.settings,
        fillBlanks: state.fillBlanks,
        novelPrompt: state.novelPrompt,
        stylePlate: state.stylePlate,
        personaConcept: state.personaConcept,
        persona: state.persona,
        personaDraftId: state.personaDraftId,
        personaFillBlanks: state.personaFillBlanks,
        chatCard: state.chatCard,
        chatPersona: state.chatPersona,
        chatMessages: state.chatMessages.map((turn) => ({
          id: turn.id,
          role: turn.role,
          text: turn.text,
          speakerId: turn.speakerId ?? null,
          speakerName: turn.speakerName ?? null,
          swipe: turn.swipe ?? 0,
          swipes: (turn.swipes ?? []).map((swipe) => ({ text: swipe.text, image: null })),
        })),
        chatId: state.chatId,
        chatTitle: state.chatTitle,
        chatMemory: state.chatMemory,
        chatLoreIds: state.chatLoreIds,
        chatWorldIds: state.chatWorldIds,
        chatCardKey: state.chatCardKey,
        chatCast: state.chatCast,
        chatSpeakerId: state.chatSpeakerId,
        chatReplyMode: state.chatReplyMode,
        chatFacts: state.chatFacts,
        chatLtm: state.chatLtm,
        chatTracker: state.chatTracker,
        chatTrack: state.chatTrack,
        chatKnowledge: state.chatKnowledge,
        chatKnowledgeLimit: state.chatKnowledgeLimit,
        chatAuthorNote: state.chatAuthorNote,
        chatAuthorDepth: state.chatAuthorDepth,
        theme: state.theme,
        activePresetId: state.activePresetId,
      }),
    },
  ),
);
