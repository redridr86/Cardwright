import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Pencil, Plus, RefreshCw, Save, Send, Trash2, Upload, X } from "lucide-react";
import { ChatColors } from "@/components/chat-colors";
import {
  sceneBrief,
  buildRoleplayMessages,
  speakersForTurn,
  factsToPrompt,
  factsFromReply,
  trackerPrompt,
  applyTrackerText,
  withChatGuides,
  type ReplyMode,
  type KnowledgeMode,
  type TrackerRow,
} from "@/lib/chat";
import { deleteChatRecord, loadChat, loadChatHeads, saveChat, savedChatFrom, type SavedChat } from "@/lib/chats";
import { appearancePrompt, drawNovelPortrait, novelFailure, pngDataUrl } from "@/lib/novelai";
import { savePngFile, saveNamedFile } from "@/lib/save-file";
import { askText, explainFetchError, replyInCharacter } from "@/lib/kobold";
import { loadMedia, portraitOf } from "@/lib/images";
import { activateBooks, loreCatalog } from "@/lib/lore";
import { boxPaint, lookOf, splitDialogue, textPaint, DEFAULT_THEME } from "@/lib/look";
import { buildPresetMessages } from "@/lib/preset";
import { useStudio, type ChatMember, type ChatTurn, type ShelfItem } from "@/lib/studio-store";

const MEMORY_SYSTEM =
  "You maintain the memory of a roleplay. Rewrite it so later replies stay consistent. Keep facts, relationships, promises, injuries, and unresolved events. Drop small talk. 150 words or fewer. Plain prose. Do not write the next line of dialogue.";

const FACT_SYSTEM =
  "You keep long-term memory for a roleplay. List only durable facts: names, relationships, promises, injuries, secrets, and unresolved events. One fact per line. Do not repeat facts already listed. If nothing new, reply none.";

const TRACKER_SYSTEM =
  "You update a character tracker. Reply with one line per character, exactly: Name | yes or no | where they are | what they are doing. Use only the names given.";

const RETRIEVAL_SYSTEM =
  "You retrieve lore for a roleplay. Return only facts from the catalog that matter to the recent chat. One fact per line. If none matter, reply none.";

const PICTURE_SYSTEM =
  "You write one NovelAI image prompt. Output only comma-separated visual tags. No sentences and no speech balloons. Include every character's appearance and the persona's appearance. Include what is happening in the recent chat. Use lore and world facts when they change the place, clothing, or objects.";

function snapshotChat(): SavedChat | null {
  const state = useStudio.getState();
  if (!state.chatCard || !state.chatId) return null;
  return {
    id: state.chatId,
    title: state.chatTitle.trim() || state.chatCard.name.trim() || "Chat",
    cardName: state.chatCard.name.trim() || "Character",
    updatedAt: Date.now(),
    card: state.chatCard,
    persona: state.chatPersona,
    messages: state.chatMessages,
    memory: state.chatMemory,
    loreIds: state.chatLoreIds,
    worldIds: state.chatWorldIds,
    cardKey: state.chatCardKey,
    cast: state.chatCast,
    speakerId: state.chatSpeakerId,
    replyMode: state.chatReplyMode,
    facts: state.chatFacts,
    ltm: state.chatLtm,
    tracker: state.chatTracker,
    track: state.chatTrack,
    knowledge: state.chatKnowledge,
    knowledgeLimit: state.chatKnowledgeLimit,
    authorNote: state.chatAuthorNote,
    authorDepth: state.chatAuthorDepth,
  };
}

function downloadText(filename: string, text: string) {
  return saveNamedFile(filename, new Blob([text], { type: "application/json" }));
}

export function ChatTab({ cards, personas, onOpenLibrary }: { cards: ShelfItem[]; personas: ShelfItem[]; onOpenLibrary: () => void }) {
  const settings = useStudio((state) => state.settings);
  const theme = { ...DEFAULT_THEME, ...useStudio((state) => state.theme) };
  const editorCard = useStudio((state) => state.card);
  const editorPersona = useStudio((state) => state.persona);
  const chatCard = useStudio((state) => state.chatCard);
  const chatPersona = useStudio((state) => state.chatPersona);
  const messages = useStudio((state) => state.chatMessages);
  const chatId = useStudio((state) => state.chatId);
  const chatTitle = useStudio((state) => state.chatTitle);
  const memory = useStudio((state) => state.chatMemory);
  const loreIds = useStudio((state) => state.chatLoreIds);
  const worldIds = useStudio((state) => state.chatWorldIds);
  const lorebooks = useStudio((state) => state.lorebooks);
  const worldbooks = useStudio((state) => state.worldbooks);
  const chatCardKey = useStudio((state) => state.chatCardKey);
  const chatCast = useStudio((state) => state.chatCast);
  const chatSpeakerId = useStudio((state) => state.chatSpeakerId);
  const chatReplyMode = useStudio((state) => state.chatReplyMode);
  const chatFacts = useStudio((state) => state.chatFacts);
  const chatLtm = useStudio((state) => state.chatLtm);
  const chatTracker = useStudio((state) => state.chatTracker);
  const chatTrack = useStudio((state) => state.chatTrack);
  const chatKnowledge = useStudio((state) => state.chatKnowledge);
  const chatKnowledgeLimit = useStudio((state) => state.chatKnowledgeLimit);
  const chatAuthorNote = useStudio((state) => state.chatAuthorNote);
  const chatAuthorDepth = useStudio((state) => state.chatAuthorDepth);
  const chatIndex = useStudio((state) => state.chatIndex);
  const stylePlate = useStudio((state) => state.stylePlate);
  const activePreset = useStudio((state) => state.presets.find((preset) => preset.id === state.activePresetId) ?? null);
  const startChat = useStudio((state) => state.startChat);
  const setChatPersona = useStudio((state) => state.setChatPersona);
  const pushChat = useStudio((state) => state.pushChat);
  const editChat = useStudio((state) => state.editChat);
  const removeChat = useStudio((state) => state.removeChat);
  const setChatImage = useStudio((state) => state.setChatImage);
  const swipeChat = useStudio((state) => state.swipeChat);
  const appendChatSwipe = useStudio((state) => state.appendChatSwipe);
  const setChatTitle = useStudio((state) => state.setChatTitle);
  const setChatMemory = useStudio((state) => state.setChatMemory);
  const setChatBooks = useStudio((state) => state.setChatBooks);
  const setChatIndex = useStudio((state) => state.setChatIndex);
  const openSavedChat = useStudio((state) => state.openSavedChat);
  const clearChat = useStudio((state) => state.clearChat);
  const patchChatLook = useStudio((state) => state.patchChatLook);
  const addChatMember = useStudio((state) => state.addChatMember);
  const removeChatMember = useStudio((state) => state.removeChatMember);
  const setChatSpeaker = useStudio((state) => state.setChatSpeaker);
  const setChatReplyMode = useStudio((state) => state.setChatReplyMode);
  const patchMemberLook = useStudio((state) => state.patchMemberLook);
  const setChatFacts = useStudio((state) => state.setChatFacts);
  const setChatLtm = useStudio((state) => state.setChatLtm);
  const setChatTracker = useStudio((state) => state.setChatTracker);
  const setChatTrack = useStudio((state) => state.setChatTrack);
  const setChatKnowledge = useStudio((state) => state.setChatKnowledge);
  const setChatKnowledgeLimit = useStudio((state) => state.setChatKnowledgeLimit);
  const setChatAuthorNote = useStudio((state) => state.setChatAuthorNote);
  const setChatAuthorDepth = useStudio((state) => state.setChatAuthorDepth);
  const keepFactsOnCard = useStudio((state) => state.keepFactsOnCard);
  const [cardPick, setCardPick] = useState("editor");
  const [personaPick, setPersonaPick] = useState("editor");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portrait, setPortrait] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [zoom, setZoom] = useState<{ id: string; src: string } | null>(null);
  const [drawPrompt, setDrawPrompt] = useState("");
  const [drawOpen, setDrawOpen] = useState(false);
  const [drawBusy, setDrawBusy] = useState(false);
  const [drawTarget, setDrawTarget] = useState<string | null>(null);
  const [addPick, setAddPick] = useState("editor");
  const [colorFor, setColorFor] = useState<string | null>(null);
  const [replyingName, setReplyingName] = useState("");
  const [factDraft, setFactDraft] = useState("");
  const [factEditId, setFactEditId] = useState<string | null>(null);
  const [factEdit, setFactEdit] = useState("");
  const importChatRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages.length, busy]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoom(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  useEffect(() => {
    if (!chatCard || !chatId) return;
    const handle = window.setTimeout(() => {
      const state = useStudio.getState();
      if (!state.chatCard || !state.chatId) return;
      const saved = snapshotChat();
      if (!saved) return;
      void saveChat(saved)
        .then(() => {
          const rest = useStudio.getState().chatIndex.filter((item) => item.id !== saved.id);
          setChatIndex([{ id: saved.id, title: saved.title, cardName: saved.cardName, updatedAt: saved.updatedAt }, ...rest]);
        })
        .catch(() => undefined);
    }, 600);
    return () => window.clearTimeout(handle);
  }, [
    chatCard,
    chatId,
    chatTitle,
    messages,
    memory,
    loreIds,
    worldIds,
    chatPersona,
    chatCast,
    chatSpeakerId,
    chatReplyMode,
    chatFacts,
    chatLtm,
    chatTracker,
    chatTrack,
    chatKnowledge,
    chatKnowledgeLimit,
    chatAuthorNote,
    chatAuthorDepth,
    setChatIndex,
  ]);

  useEffect(() => {
    if (!chatCard) {
      setPortrait(null);
      return;
    }
    const match = cards.find((item) => item.card.name === chatCard.name && item.card.first_mes === chatCard.first_mes);
    if (!match) {
      setPortrait(null);
      return;
    }
    let cancel = false;
    void loadMedia(match.id).then((record) => {
      if (!cancel) setPortrait(portraitOf(record)?.dataUrl ?? null);
    });
    return () => {
      cancel = true;
    };
  }, [chatCard, cards]);

  function chosenCard() {
    if (cardPick === "editor") return editorCard;
    return cards.find((item) => item.id === cardPick)?.card ?? null;
  }

  function chosenPersona() {
    if (personaPick === "none") return null;
    if (personaPick === "editor") return editorPersona.name.trim() ? editorPersona : null;
    return personas.find((item) => item.id === personaPick)?.card ?? null;
  }

  function loreText(history: ChatTurn[]) {
    const books = [
      ...lorebooks.filter((book) => loreIds.includes(book.id)),
      ...worldbooks.filter((book) => worldIds.includes(book.id)),
    ];
    return activateBooks(books, history);
  }

  async function resolveLore(history: ChatTurn[]) {
    const state = useStudio.getState();
    const books = [
      ...state.lorebooks.filter((book) => state.chatLoreIds.includes(book.id)),
      ...state.worldbooks.filter((book) => state.chatWorldIds.includes(book.id)),
    ];
    const keywords = activateBooks(books, history);
    if (state.chatKnowledge !== "retrieval") return keywords;
    const catalog = loreCatalog(books, state.chatKnowledgeLimit);
    if (!catalog.trim()) return keywords;
    const recent = history
      .slice(-8)
      .map((turn) => `${turn.speakerName?.trim() || turn.role}: ${turn.text}`)
      .join("\n");
    try {
      const picked = await askText(settings, RETRIEVAL_SYSTEM, `Recent chat:\n${recent || "(empty)"}\n\nCatalog:\n${catalog}`, 500);
      const text = picked.trim();
      if (!text || /^none[.!]?$/i.test(text)) return "";
      return text;
    } catch {
      return keywords;
    }
  }

  function liveCast(): ChatMember[] {
    const state = useStudio.getState();
    if (state.chatCast.length) return state.chatCast;
    if (state.chatCard) return [{ id: state.chatCardKey || "primary", card: state.chatCard }];
    return [];
  }

  async function promptMessages(history: ChatTurn[], speaker = chatCard, lore?: string) {
    const state = useStudio.getState();
    const persona = state.chatPersona;
    const preset = state.presets.find((item) => item.id === state.activePresetId) ?? null;
    if (!speaker) return [];
    const cast = liveCast();
    const cards = cast.map((member) => member.card);
    const extras = { memory: state.chatMemory, lore: lore ?? activateBooks(
      [
        ...state.lorebooks.filter((book) => state.chatLoreIds.includes(book.id)),
        ...state.worldbooks.filter((book) => state.chatWorldIds.includes(book.id)),
      ],
      history,
    ) };
    const many = cards.filter((card) => card.name.trim()).length > 1;
    const base = !preset
      ? buildRoleplayMessages(speaker, persona, history, extras, cards)
      : (() => {
          const labeled = many
            ? history.map((turn) => (turn.role === "assistant" && turn.speakerName?.trim() ? { ...turn, speakerName: turn.speakerName } : { ...turn, speakerName: null }))
            : history.map((turn) => ({ ...turn, speakerName: null }));
          const built = buildPresetMessages(preset, speaker, persona, labeled, Math.random, extras);
          if (!many) return built;
          const others = cards.filter((card) => card.name.trim() && card.name.trim() !== speaker.name.trim());
          const note = [
            `You are ${speaker.name.trim()}. Write only ${speaker.name.trim()}'s next reply. Do not speak for anyone else.`,
            others.length &&
              `Also in the scene:\n${others
                .map((card) => [card.name.trim(), card.appearance.trim() && `Appearance: ${card.appearance.trim()}`, card.description.trim()].filter(Boolean).join("\n"))
                .join("\n\n")}`,
            persona?.appearance.trim() && `${persona.name.trim() || "User"} appearance: ${persona.appearance.trim()}`,
          ]
            .filter((part): part is string => Boolean(part))
            .join("\n\n");
          return note ? [{ role: "system" as const, content: note }, ...built] : built;
        })();
    const historyText = history.map((turn) => turn.text).join("\n");
    return withChatGuides(base, {
      longMemory: state.chatLtm ? factsToPrompt(state.chatFacts, historyText) : "",
      tracker: state.chatTrack ? trackerPrompt(state.chatTracker) : "",
      authorNote: state.chatAuthorNote,
      authorDepth: state.chatAuthorDepth,
    });
  }

  function onStart() {
    const card = chosenCard();
    if (!card || !card.name.trim()) {
      setError("Pick a card with a name, or write one on the Card tab.");
      return;
    }
    if (!card.description.trim() && !card.personality.trim() && !card.first_mes.trim() && !(card.alternate_greetings ?? []).some((greeting) => greeting.trim())) {
      setError("That card is empty. Write a description or a first message first.");
      return;
    }
    setError(null);
    setDrawOpen(false);
    startChat(card, chosenPersona(), cardPick === "editor" ? "editor" : cardPick);
  }

  async function send(text: string) {
    if (!chatCard || busy) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    setDraft("");
    setError(null);
    setBusy(true);
    pushChat({ id: crypto.randomUUID(), role: "user", text: trimmed });
    const cast = liveCast();
    const lastAssistant = [...useStudio.getState().chatMessages].reverse().find((turn) => turn.role === "assistant");
    const speakers = speakersForTurn({
      mode: useStudio.getState().chatReplyMode,
      cast: cast.map((member) => ({ id: member.id, name: member.card.name, aliases: member.card.aliases })),
      pickedId: useStudio.getState().chatSpeakerId,
      lastSpeakerId: lastAssistant?.speakerId ?? null,
      userText: trimmed,
    });
    try {
      const lore = await resolveLore(useStudio.getState().chatMessages);
      for (const speaker of speakers) {
        const member = cast.find((item) => item.id === speaker.id) ?? cast[0];
        if (!member) continue;
        setReplyingName(member.card.name.trim() || "Character");
        const history = useStudio.getState().chatMessages;
        const reply = await replyInCharacter(settings, await promptMessages(history, member.card, lore));
        pushChat({ id: crypto.randomUUID(), role: "assistant", text: reply, speakerId: member.id, speakerName: member.card.name.trim() });
      }
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setReplyingName("");
      setBusy(false);
    }
  }

  async function onRegenerate(messageId?: string) {
    if (!chatCard || busy) return;
    const current = useStudio.getState().chatMessages;
    const index = messageId ? current.findIndex((turn) => turn.id === messageId) : current.length - 1;
    const target = index >= 0 ? current[index] : undefined;
    if (!target || target.role !== "assistant") return;
    const history = current.slice(0, index);
    const cast = liveCast();
    const member = cast.find((item) => item.id === target.speakerId) ?? cast.find((item) => item.id === useStudio.getState().chatSpeakerId) ?? cast[0];
    setBusy(true);
    setError(null);
    setReplyingName(member?.card.name.trim() || chatCard.name);
    try {
      const lore = await resolveLore(history);
      const reply = await replyInCharacter(settings, await promptMessages(history, member?.card ?? chatCard, lore));
      appendChatSwipe(target.id, reply);
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setReplyingName("");
      setBusy(false);
    }
  }

  async function onRemember() {
    if (!chatCard || busy) return;
    setBusy(true);
    setError(null);
    const personaName = useStudio.getState().chatPersona?.name.trim() || "User";
    try {
      const history = useStudio
        .getState()
        .chatMessages.slice(-16)
        .map((turn) => `${turn.role === "user" ? personaName : turn.speakerName?.trim() || chatCard.name}: ${turn.text}`)
        .join("\n");
      const next = await askText(
        settings,
        MEMORY_SYSTEM,
        `Current memory:\n${memory.trim() || "(empty)"}\n\nChat:\n${history}`,
        500,
      );
      setChatMemory(next.trim());
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onPullFacts() {
    if (!chatCard || busy) return;
    setBusy(true);
    setError(null);
    const state = useStudio.getState();
    const personaName = state.chatPersona?.name.trim() || "User";
    try {
      const history = state.chatMessages
        .slice(-24)
        .map((turn) => `${turn.role === "user" ? personaName : turn.speakerName?.trim() || chatCard.name}: ${turn.text}`)
        .join("\n");
      const known = state.chatFacts.map((fact) => fact.text).join("\n") || "(none)";
      const next = await askText(settings, FACT_SYSTEM, `Known facts:\n${known}\n\nChat:\n${history || "(empty)"}`, 500);
      setChatFacts(factsFromReply(next, useStudio.getState().chatFacts));
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onUpdateTracker() {
    if (!chatCard || busy) return;
    const rows = useStudio.getState().chatTracker;
    if (!rows.length) return;
    setBusy(true);
    setError(null);
    const state = useStudio.getState();
    const personaName = state.chatPersona?.name.trim() || "User";
    try {
      const history = state.chatMessages
        .slice(-16)
        .map((turn) => `${turn.role === "user" ? personaName : turn.speakerName?.trim() || chatCard.name}: ${turn.text}`)
        .join("\n");
      const next = await askText(settings, TRACKER_SYSTEM, `Characters: ${rows.map((row) => row.name).join(", ")}\n\nChat:\n${history || "(empty)"}`, 400);
      setChatTracker(applyTrackerText(useStudio.getState().chatTracker, next));
    } catch (err) {
      setError(explainFetchError(err));
    } finally {
      setBusy(false);
    }
  }

  function patchTracker(id: string, patch: Partial<TrackerRow>) {
    setChatTracker(useStudio.getState().chatTracker.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  async function onSaveChatFile() {
    const saved = snapshotChat();
    if (!saved) {
      setError("Start a chat before saving.");
      return;
    }
    try {
      await saveChat(saved);
      const rest = useStudio.getState().chatIndex.filter((item) => item.id !== saved.id);
      setChatIndex([{ id: saved.id, title: saved.title, cardName: saved.cardName, updatedAt: saved.updatedAt }, ...rest]);
      const portable = { ...saved, messages: saved.messages.map((turn) => ({ ...turn, image: null })) };
      const slug = saved.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "chat";
      downloadText(`${slug}.json`, JSON.stringify(portable, null, 2));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that chat.");
    }
  }

  async function onImportChat(file: File) {
    try {
      const parsed = savedChatFrom(JSON.parse(await file.text()) as unknown, crypto.randomUUID());
      if (!parsed) {
        setError("That file is not a Cardwright chat.");
        return;
      }
      const next = { ...parsed, id: crypto.randomUUID(), updatedAt: Date.now() };
      await saveChat(next);
      openSavedChat(next);
      const rest = useStudio.getState().chatIndex.filter((item) => item.id !== next.id);
      setChatIndex([{ id: next.id, title: next.title, cardName: next.cardName, updatedAt: next.updatedAt }, ...rest]);
      setDrawOpen(false);
      setError(null);
    } catch {
      setError("Could not read that chat file.");
    }
  }

  async function onPrepareDraw(messageId: string | null) {
    if (!chatCard) return;
    setDrawTarget(messageId);
    setDrawOpen(true);
    setDrawBusy(true);
    setError(null);
    const state = useStudio.getState();
    const history = state.chatMessages;
    const cast = liveCast().map((member) => member.card);
    const persona = state.chatPersona;
    const historyText = history.map((turn) => turn.text).join("\n");
    const guideMemory = [
      memory,
      state.chatLtm ? factsToPrompt(state.chatFacts, historyText) : "",
      state.chatTrack ? trackerPrompt(state.chatTracker) : "",
      state.chatAuthorNote.trim() && `Author note: ${state.chatAuthorNote.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    const brief = sceneBrief({
      cards: cast.length ? cast : [chatCard],
      persona,
      history,
      memory: guideMemory,
      lore: loreText(history),
    });
    const appearances = [
      ...cast.map((card) => [card.name.trim(), card.appearance.trim()].filter(Boolean).join(", ")),
      persona ? [persona.name.trim(), persona.appearance.trim()].filter(Boolean).join(", ") : "",
    ]
      .filter(Boolean)
      .join(", ");
    try {
      const prompt = await askText(settings, PICTURE_SYSTEM, brief, 280);
      setDrawPrompt(prompt.trim());
    } catch {
      setDrawPrompt(
        appearancePrompt({
          name: cast.map((card) => card.name.trim()).filter(Boolean).join(", "),
          appearance: appearances,
          description: history.slice(-2).map((turn) => turn.text).join(", "),
          concept: memory,
        }),
      );
    } finally {
      setDrawBusy(false);
    }
  }

  async function onDraw() {
    if (!chatCard || drawBusy) return;
    setDrawBusy(true);
    setError(null);
    try {
      const bytes = await drawNovelPortrait(settings.novelToken ?? "", drawPrompt, settings.novelModel ?? "", settings.novelGen, stylePlate);
      const url = pngDataUrl(bytes);
      const target = drawTarget ?? messages[messages.length - 1]?.id;
      if (target) setChatImage(target, url);
      else pushChat({ id: crypto.randomUUID(), role: "assistant", text: "", image: url });
      setDrawOpen(false);
    } catch (err) {
      setError(novelFailure(err));
    } finally {
      setDrawBusy(false);
    }
  }

  async function onSaveImage(dataUrl: string) {
    try {
      const payload = dataUrl.slice(dataUrl.indexOf(",") + 1);
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
      const saved = await savePngFile(`${(chatCard?.name || "scene").replace(/[^a-z0-9]+/gi, "-")}.png`, bytes);
      if (saved) setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that picture.");
    }
  }

  async function onOpenSaved(id: string) {
    setError(null);
    const saved = await loadChat(id);
    if (!saved) {
      setChatIndex(await loadChatHeads());
      setError("That chat is no longer in the library.");
      return;
    }
    openSavedChat(saved);
    setDrawOpen(false);
  }

  async function onDeleteSaved(id: string) {
    await deleteChatRecord(id);
    setChatIndex(useStudio.getState().chatIndex.filter((item) => item.id !== id));
    if (chatId === id) clearChat();
  }

  function toggleBook(kind: "lore" | "world", id: string) {
    if (kind === "lore") setChatBooks(loreIds.includes(id) ? loreIds.filter((item) => item !== id) : [...loreIds, id], worldIds);
    else setChatBooks(loreIds, worldIds.includes(id) ? worldIds.filter((item) => item !== id) : [...worldIds, id]);
  }

  const charName = chatCard?.name.trim() || "Character";
  const userName = chatPersona?.name.trim() || "You";
  const presetLabel = activePreset ? activePreset.name : "Simple prompt";
  const displayCast = chatCast.length ? chatCast : chatCard ? [{ id: chatCardKey || "primary", card: chatCard }] : [];
  const colorMember = displayCast.find((member) => member.id === colorFor) ?? displayCast.find((member) => member.id === chatSpeakerId) ?? displayCast[0] ?? null;
  const colorLook = lookOf(colorMember?.card.chatLook ?? chatCard?.chatLook);
  const headerMember = displayCast.find((member) => member.id === chatSpeakerId) ?? displayCast[0];
  const headerLook = lookOf(headerMember?.card.chatLook ?? chatCard?.chatLook);
  const userLook = lookOf(chatPersona?.chatLook);
  const lastSpeakerId = [...messages].reverse().find((turn) => turn.role === "assistant")?.speakerId ?? null;
  const nextSpeakers = speakersForTurn({
    mode: chatReplyMode,
    cast: displayCast.map((member) => ({ id: member.id, name: member.card.name, aliases: member.card.aliases })),
    pickedId: chatSpeakerId,
    lastSpeakerId,
    userText: draft,
  });
  const castLabel = displayCast.map((member) => member.card.name.trim()).filter(Boolean).join(", ");

  return (
    <main className="mx-auto grid h-full max-w-6xl grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 overflow-hidden px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-1">
      <section className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain pr-1">
        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Who is in the scene</h2>
          <p className="mt-1 text-xs text-muted">Preset: {presetLabel}</p>
          <label htmlFor="chatCard" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
            Character
          </label>
          <select id="chatCard" value={cardPick} onChange={(event) => setCardPick(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg">
            <option value="editor">Card in the editor{editorCard.name.trim() ? ` · ${editorCard.name.trim()}` : ""}</option>
            {cards.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <label htmlFor="chatPersona" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
            Persona
          </label>
          <select
            id="chatPersona"
            value={personaPick}
            onChange={(event) => {
              setPersonaPick(event.target.value);
              if (chatCard) {
                const next = event.target.value === "none" ? null : event.target.value === "editor" ? editorPersona : (personas.find((item) => item.id === event.target.value)?.card ?? null);
                setChatPersona(next);
              }
            }}
            className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
          >
            <option value="none">None</option>
            <option value="editor">Persona in the editor{editorPersona.name.trim() ? ` · ${editorPersona.name.trim()}` : ""}</option>
            {personas.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <button type="button" onClick={onStart} className="mt-3 flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg">
            Start chat
          </button>
          <p className="mt-2 text-xs text-muted">Start chat opens a new saved chat. Add more characters after it starts.</p>
        </section>

        {chatCard ? (
          <section className="rounded-lg border border-border bg-surface p-3">
            <h2 className="font-display text-lg font-semibold">Who answers</h2>
            <p className="mt-1 text-xs text-muted">
              {nextSpeakers.length ? `Next: ${nextSpeakers.map((speaker) => speaker.name).join(", ")}` : "Add a character with a name."}
            </p>
            <ul className="mt-2">
              {displayCast.map((member) => (
                <li key={member.id} className="flex items-center gap-1">
                  <span className="min-w-0 flex-1 truncate text-sm">{member.card.name.trim() || "Unnamed"}</span>
                  <button
                    type="button"
                    disabled={displayCast.length < 2}
                    aria-label={`Remove ${member.card.name.trim() || "character"}`}
                    onClick={() => removeChatMember(member.id)}
                    className="flex size-11 items-center justify-center rounded-md text-primary disabled:opacity-30"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <label htmlFor="chatSpeaker" className="mt-2 block text-xs font-semibold tracking-wide text-muted uppercase">
              Picked character
            </label>
            <select id="chatSpeaker" value={chatSpeakerId || displayCast[0]?.id || ""} onChange={(event) => setChatSpeaker(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg">
              {displayCast.map((member) => (
                <option key={member.id} value={member.id}>{member.card.name.trim() || "Unnamed"}</option>
              ))}
            </select>
            <label htmlFor="replyWhen" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
              When
            </label>
            <select id="replyWhen" value={chatReplyMode} onChange={(event) => setChatReplyMode(event.target.value as ReplyMode)} className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg">
              <option value="pick">Only the one I pick</option>
              <option value="named">When I write their name</option>
              <option value="round">Take turns</option>
              <option value="everyone">Everyone replies</option>
            </select>
            <label htmlFor="addCast" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
              Add a character
            </label>
            <div className="mt-1 flex gap-2">
              <select id="addCast" value={addPick} onChange={(event) => setAddPick(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg">
                <option value="editor">Card in the editor{editorCard.name.trim() ? ` · ${editorCard.name.trim()}` : ""}</option>
                {cards.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (addPick === "editor") {
                    if (!editorCard.name.trim()) {
                      setError("Write a name on the Card tab before adding that character.");
                      return;
                    }
                    addChatMember(chatCardKey === "editor" ? `editor-${crypto.randomUUID()}` : "editor", editorCard);
                    return;
                  }
                  const item = cards.find((entry) => entry.id === addPick);
                  if (item) addChatMember(item.id, item.card);
                }}
                className="flex min-h-11 items-center gap-1 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add
              </button>
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold">Memory</h2>
          <textarea
            value={memory}
            disabled={!chatCard}
            rows={5}
            onChange={(event) => setChatMemory(event.target.value)}
            placeholder="Facts the story should keep."
            className="mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm"
          />
          <button type="button" disabled={!chatCard || busy} onClick={() => void onRemember()} className="mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40">
            Update memory from this chat
          </button>
        </section>

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold">Long-term memory</h2>
          <p className="mt-1 text-xs text-muted">Durable facts. Matching ones are sent with each reply. A new chat with this card can start from facts you keep on the card.</p>
          <label className="mt-2 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={chatLtm} disabled={!chatCard} onChange={(event) => setChatLtm(event.target.checked)} className="size-4 accent-primary" />
            Use long-term memory
          </label>
          <ul className="mt-1">
            {chatFacts.length === 0 ? <li className="text-xs text-muted">No facts yet.</li> : null}
            {chatFacts.map((fact) => (
              <li key={fact.id} className="mt-1 flex items-start gap-1">
                {factEditId === fact.id ? (
                  <>
                    <input value={factEdit} onChange={(event) => setFactEdit(event.target.value)} aria-label="Edit fact" className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-2 text-sm" />
                    <button
                      type="button"
                      onClick={() => {
                        const text = factEdit.trim();
                        if (text) setChatFacts(chatFacts.map((item) => (item.id === fact.id ? { ...item, text } : item)));
                        setFactEditId(null);
                      }}
                      className="min-h-11 rounded-md px-2 text-xs font-semibold text-gold"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p className="min-w-0 flex-1 py-2 text-sm">{fact.text}</p>
                    <button type="button" aria-label="Edit fact" onClick={() => { setFactEditId(fact.id); setFactEdit(fact.text); }} className="flex size-11 items-center justify-center text-muted">
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Remove fact" onClick={() => setChatFacts(chatFacts.filter((item) => item.id !== fact.id))} className="flex size-11 items-center justify-center text-primary">
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              value={factDraft}
              disabled={!chatCard}
              placeholder="Add a fact"
              onChange={(event) => setFactDraft(event.target.value)}
              className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm"
            />
            <button
              type="button"
              disabled={!chatCard || !factDraft.trim()}
              onClick={() => {
                setChatFacts([...chatFacts, { id: crypto.randomUUID(), text: factDraft.trim() }]);
                setFactDraft("");
              }}
              className="min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40"
            >
              Add
            </button>
          </div>
          <button type="button" disabled={!chatCard || busy} onClick={() => void onPullFacts()} className="mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40">
            Pull facts from this chat
          </button>
          <button type="button" disabled={!chatCard || chatFacts.length === 0} onClick={keepFactsOnCard} className="mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40">
            Keep on this card
          </button>
        </section>

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold">Character tracker</h2>
          <p className="mt-1 text-xs text-muted">Who is in the scene, where, and what they are doing.</p>
          <label className="mt-2 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={chatTrack} disabled={!chatCard} onChange={(event) => setChatTrack(event.target.checked)} className="size-4 accent-primary" />
            Send the tracker with each reply
          </label>
          {chatTracker.map((row) => (
            <div key={row.id} className="mt-2 rounded-md border border-border p-2">
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input type="checkbox" checked={row.present} disabled={!chatCard} onChange={(event) => patchTracker(row.id, { present: event.target.checked })} className="size-4 accent-primary" />
                {row.name} is here
              </label>
              <input
                aria-label={`${row.name} location`}
                value={row.where}
                disabled={!chatCard}
                placeholder="Where"
                onChange={(event) => patchTracker(row.id, { where: event.target.value })}
                className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
              />
              <input
                aria-label={`${row.name} activity`}
                value={row.doing}
                disabled={!chatCard}
                placeholder="Doing"
                onChange={(event) => patchTracker(row.id, { doing: event.target.value })}
                className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
              />
            </div>
          ))}
          <button type="button" disabled={!chatCard || busy || chatTracker.length === 0} onClick={() => void onUpdateTracker()} className="mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40">
            Update from chat
          </button>
        </section>

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold">Author’s notes</h2>
          <p className="mt-1 text-xs text-muted">Instructions for this chat only. The model reads them every turn.</p>
          <textarea
            value={chatAuthorNote}
            disabled={!chatCard}
            rows={4}
            placeholder="Keep the dock cold. Do not resolve the missing crate yet."
            onChange={(event) => setChatAuthorNote(event.target.value)}
            className="mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm"
          />
          <label className="mt-2 block text-xs font-semibold tracking-wide text-muted uppercase">
            Depth {chatAuthorDepth === 0 ? "· after the newest message" : `· ${chatAuthorDepth} before the end`}
            <input
              type="range"
              min={0}
              max={12}
              disabled={!chatCard}
              value={chatAuthorDepth}
              onChange={(event) => setChatAuthorDepth(Number(event.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </label>
        </section>

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold">Books in this chat</h2>
          <label htmlFor="chatKnowledge" className="mt-2 block text-xs font-semibold tracking-wide text-muted uppercase">
            Knowledge
            <select
              id="chatKnowledge"
              value={chatKnowledge}
              disabled={!chatCard}
              onChange={(event) => setChatKnowledge(event.target.value as KnowledgeMode)}
              className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm font-normal normal-case text-fg"
            >
              <option value="keywords">Keywords</option>
              <option value="retrieval">Knowledge retrieval</option>
            </select>
          </label>
          {chatKnowledge === "retrieval" ? (
            <label className="mt-2 block text-xs font-semibold tracking-wide text-muted uppercase">
              Entries considered {chatKnowledgeLimit}
              <input
                type="range"
                min={5}
                max={80}
                disabled={!chatCard}
                value={chatKnowledgeLimit}
                onChange={(event) => setChatKnowledgeLimit(Number(event.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </label>
          ) : (
            <p className="mt-2 text-xs text-muted">An entry turns on when the recent chat mentions one of its keys.</p>
          )}
          <p className="mt-1 text-xs text-muted">
            {chatKnowledge === "retrieval"
              ? "Retrieval asks Kobold which catalog facts fit this moment. If that call fails, keywords are used."
              : "Checked books are scanned with the history when you send or draw."}
          </p>
          <BookList title="Lorebooks" books={lorebooks} picked={loreIds} onToggle={(id) => toggleBook("lore", id)} disabled={!chatCard} />
          <BookList title="World books" books={worldbooks} picked={worldIds} onToggle={(id) => toggleBook("world", id)} disabled={!chatCard} />
        </section>

        {chatCard ? (
          <section className="rounded-lg border border-border bg-surface p-3">
            <h2 className="font-display text-lg font-semibold">Colors in this chat</h2>
            {displayCast.length > 1 ? (
              <label htmlFor="colorFor" className="mt-2 block text-xs font-semibold tracking-wide text-muted uppercase">
                Character
                <select id="colorFor" value={colorMember?.id || ""} onChange={(event) => setColorFor(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm font-normal normal-case text-fg">
                  {displayCast.map((member) => (
                    <option key={member.id} value={member.id}>{member.card.name.trim() || "Unnamed"}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <div className="mt-2">
              <ChatColors
                look={colorLook}
                theme={theme}
                name={colorMember?.card.name.trim() || charName}
                onChange={(look) => {
                  if (colorMember && chatCast.some((member) => member.id === colorMember.id)) patchMemberLook(colorMember.id, look);
                  else patchChatLook(look);
                }}
              />
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold">Chat history</h2>
          <div className="mt-2 flex gap-2">
            <button type="button" disabled={!chatCard} onClick={() => void onSaveChatFile()} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40">
              <Save className="size-4" aria-hidden="true" />
              Save chat
            </button>
            <button type="button" onClick={() => importChatRef.current?.click()} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold">
              <Upload className="size-4" aria-hidden="true" />
              Import
            </button>
          </div>
          <button type="button" onClick={onOpenLibrary} className="mt-2 flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg">
            Chat library
          </button>
          <input
            ref={importChatRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onImportChat(file);
              event.target.value = "";
            }}
          />
          <p className="mt-2 text-xs text-muted">Chats also save themselves. Save chat downloads a copy without pictures.</p>
          <ul className="mt-2 flex flex-col gap-1">
            {chatIndex.length === 0 ? <li className="px-1 py-2 text-sm text-muted">Saved chats show up here.</li> : null}
            {chatIndex.map((item) => (
              <li key={item.id} className="flex items-center gap-1">
                <button type="button" onClick={() => void onOpenSaved(item.id)} className={`min-h-11 flex-1 rounded-md px-2 text-left text-sm ${item.id === chatId ? "bg-surface-2" : ""}`}>
                  <span className="block truncate">{item.title}</span>
                  <span className="block truncate text-xs text-muted">{item.cardName || "Chat"}</span>
                </button>
                <button type="button" aria-label={`Delete ${item.title}`} onClick={() => void onDeleteSaved(item.id)} className="flex size-11 items-center justify-center rounded-md text-primary">
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section className="flex min-h-0 flex-col overflow-hidden rounded-lg bg-paper text-ink shadow-2xl">
        <header className="flex shrink-0 items-center gap-3 border-b border-ink/15 px-4 py-3">
          {portrait ? <img src={portrait} alt="" className="size-12 rounded-md object-cover" /> : null}
          <div className="min-w-0 flex-1">
            {chatCard ? (
              <input value={chatTitle} onChange={(event) => setChatTitle(event.target.value)} aria-label="Chat title" className="w-full bg-transparent font-display text-xl font-semibold outline-none" style={textPaint(headerLook.nameColor, theme.ink)} />
            ) : (
              <p className="font-display text-xl font-semibold">No chat yet</p>
            )}
            <p className="text-xs text-ink-soft">{chatCard ? (displayCast.length > 1 ? castLabel : `Talking with ${userName}`) : "Pick a card and start."}</p>
          </div>
        </header>
        <div ref={logRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-4">
          {error ? <p role="alert" className="rounded-md border border-primary bg-paper px-3 py-2 text-sm">{error}</p> : null}
          {!chatCard ? (
            <p className="text-sm text-ink-soft">A chat uses the card you write here, plus memory, lore, and world books you turn on.</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-ink-soft">This card has no first message. Say something to begin.</p>
          ) : (
            messages.map((turn) => {
              const mine = turn.role === "user";
              const speaker = displayCast.find((member) => member.id === turn.speakerId) ?? displayCast.find((member) => member.card.name.trim() === turn.speakerName?.trim()) ?? displayCast[0];
              const look = mine ? userLook : lookOf(speaker?.card.chatLook ?? chatCard?.chatLook);
              const dialogue = look.dialogueColor || theme.dialogueDefault;
              const speakerName = mine ? userName : turn.speakerName?.trim() || speaker?.card.name.trim() || charName;
              return (
                <article key={turn.id} className={mine ? "border-l-4 border-gold pl-3" : "rounded-md px-3 py-2"} style={mine ? undefined : boxPaint(look.boxColor)}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold tracking-wide uppercase" style={textPaint(look.nameColor, theme.inkSoft)}>
                      {speakerName}
                    </p>
                    <div className="flex">
                      <button type="button" aria-label="Edit message" onClick={() => { setEditing(turn.id); setEditText(turn.text); }} className="flex size-11 items-center justify-center text-ink-soft">
                        <Pencil className="size-4" aria-hidden="true" />
                      </button>
                      {!mine ? (
                        <button type="button" aria-label="Regenerate message" disabled={busy} onClick={() => void onRegenerate(turn.id)} className="flex size-11 items-center justify-center text-ink-soft disabled:opacity-40">
                          <RefreshCw className="size-4" aria-hidden="true" />
                        </button>
                      ) : null}
                      <button type="button" aria-label="Draw this moment" onClick={() => void onPrepareDraw(turn.id)} className="flex size-11 items-center justify-center text-ink-soft">
                        <ImagePlus className="size-4" aria-hidden="true" />
                      </button>
                      <button type="button" aria-label="Remove message" onClick={() => removeChat(turn.id)} className="flex size-11 items-center justify-center text-ink-soft">
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {editing === turn.id ? (
                    <div className="mt-1">
                      <textarea value={editText} rows={4} onChange={(event) => setEditText(event.target.value)} className="min-h-20 w-full resize-y rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink" />
                      <div className="mt-2 flex gap-2">
                        <button type="button" onClick={() => { editChat(turn.id, editText); setEditing(null); }} className="min-h-11 rounded-md bg-ink px-3 text-sm font-semibold text-paper">Save edit</button>
                        <button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-md border border-ink/20 px-3 text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 whitespace-pre-wrap" style={{ color: theme.ink, fontSize: theme.chatTextSize }}>
                      {splitDialogue(turn.text).map((part, index) =>
                        part.kind === "talk" ? (
                          <span key={index} style={{ ...textPaint(dialogue, theme.ink), fontWeight: theme.boldDialogue ? 700 : 400 }}>{part.text}</span>
                        ) : (
                          <span key={index} className={part.kind === "act" ? "italic" : undefined}>{part.text}</span>
                        ),
                      )}
                    </p>
                  )}
                  {!mine && (turn.swipes?.length ?? 0) > 1 ? (
                    <div className="mt-2 flex items-center gap-1">
                      <button type="button" aria-label="Previous greeting" onClick={() => swipeChat(turn.id, -1)} className="flex size-11 items-center justify-center rounded-md text-ink-soft">
                        <ChevronLeft className="size-4" aria-hidden="true" />
                      </button>
                      <span className="min-w-12 text-center text-xs text-ink-soft">
                        {(turn.swipe ?? 0) + 1} / {turn.swipes?.length}
                      </span>
                      <button type="button" aria-label="Next greeting" onClick={() => swipeChat(turn.id, 1)} className="flex size-11 items-center justify-center rounded-md text-ink-soft">
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : null}
                  {turn.image ? (
                    <figure className="mt-2">
                      <button type="button" onClick={() => setZoom({ id: turn.id, src: turn.image || "" })} className="block w-full">
                        <img src={turn.image} alt="" className="max-h-80 w-full rounded-md object-contain" />
                        <span className="sr-only">Open picture larger</span>
                      </button>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => void onSaveImage(turn.image || "")} className="flex min-h-11 items-center gap-2 text-sm font-semibold text-ink">
                          <Save className="size-4" aria-hidden="true" />
                          Save picture
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setChatImage(turn.id, null);
                            setZoom((current) => (current?.id === turn.id ? null : current));
                          }}
                          className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          Delete picture
                        </button>
                      </div>
                    </figure>
                  ) : null}
                </article>
              );
            })
          )}
          {busy ? <p className="text-sm text-ink-soft">{replyingName || charName} is writing…</p> : null}
        </div>
        {drawOpen ? (
          <div className="shrink-0 border-t border-ink/15 px-3 py-3">
            <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Scene prompt</p>
            <textarea value={drawPrompt} rows={4} disabled={drawBusy} onChange={(event) => setDrawPrompt(event.target.value)} className="mt-1 min-h-20 w-full resize-y rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink" />
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" disabled={drawBusy || drawPrompt.trim().length < 3} onClick={() => void onDraw()} className="min-h-11 rounded-md bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-40">
                {drawBusy ? "Working…" : "Draw with NovelAI"}
              </button>
              <button type="button" onClick={() => setDrawOpen(false)} className="min-h-11 rounded-md border border-ink/20 px-3 text-sm">Close</button>
            </div>
          </div>
        ) : null}
        <form
          className="flex shrink-0 items-end gap-2 border-t border-ink/15 p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void send(draft);
          }}
        >
          <label className="sr-only" htmlFor="chatDraft">Your message</label>
          <textarea
            id="chatDraft"
            value={draft}
            disabled={!chatCard || busy}
            rows={2}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(draft);
              }
            }}
            placeholder={chatCard ? `Write as ${userName}` : "Start a chat first"}
            style={{ fontSize: theme.chatTextSize }}
            className="min-h-11 flex-1 resize-y rounded-md border border-ink/20 bg-paper px-3 py-2 text-ink"
          />
          <button type="button" aria-label="Draw the scene" disabled={!chatCard || busy} onClick={() => void onPrepareDraw(messages[messages.length - 1]?.id ?? null)} className="flex size-11 items-center justify-center rounded-md border border-ink/20 text-ink disabled:opacity-40">
            <ImagePlus className="size-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Rewrite the last reply" disabled={!chatCard || busy || messages[messages.length - 1]?.role !== "assistant"} onClick={() => void onRegenerate()} className="flex size-11 items-center justify-center rounded-md border border-ink/20 text-ink disabled:opacity-40">
            <RefreshCw className="size-4" aria-hidden="true" />
          </button>
          <button type="submit" disabled={!chatCard || busy || !draft.trim()} className="flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-40">
            <Send className="size-4" aria-hidden="true" />
            Send
          </button>
        </form>
      </section>
      {zoom ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Picture"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          onClick={() => setZoom(null)}
        >
          <img src={zoom.src} alt="" className="max-h-[85dvh] max-w-full rounded-md object-contain" onClick={(event) => event.stopPropagation()} />
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setChatImage(zoom.id, null);
                setZoom(null);
              }}
              className="flex min-h-11 items-center gap-2 rounded-md bg-paper px-3 text-sm font-semibold text-primary"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setZoom(null);
              }}
              className="flex min-h-11 items-center gap-2 rounded-md bg-paper px-3 text-sm font-semibold text-ink"
            >
              <X className="size-4" aria-hidden="true" />
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function BookList({
  title,
  books,
  picked,
  onToggle,
  disabled,
}: {
  title: string;
  books: { id: string; name: string }[];
  picked: string[];
  onToggle: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
      {books.length === 0 ? <p className="mt-1 text-xs text-muted">None yet. Make them on the Lore tab.</p> : null}
      <ul className="mt-1">
        {books.map((book) => (
          <li key={book.id}>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" disabled={disabled} checked={picked.includes(book.id)} onChange={() => onToggle(book.id)} className="size-4 accent-primary" />
              <span className="truncate">{book.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
