import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as CookingPot, C as MapPin, D as HandCoins, E as ImagePlus, F as Camera, I as CalendarDays, L as Briefcase, M as ChevronRight, N as ChevronLeft, O as FolderOpen, P as Check, R as BookOpen, S as MessageCircle, T as Image$1, _ as Plus, a as Upload, b as Moon, c as Star, d as Shuffle, f as Send, g as RefreshCw, h as RotateCcw, i as UserPlus, j as Clock, k as Download, l as Sparkles, m as Save, n as Utensils, p as Search, r as Users, s as Trash2, t as X, u as Smartphone, v as Pencil, w as Link2, x as Monitor, y as Newspaper, z as Bed } from "../_libs/lucide-react.mjs";
import { a as appearancePrompt, c as novelFailure, d as styleProfile, i as STYLE_PROFILES, l as novelGenOf, n as DEFAULT_NOVEL_GEN, o as dataUrlPayload, r as NOVEL_MODELS, s as drawNovelPortrait, u as pngDataUrl } from "./router-Bi-sOyNV.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSBd47bc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_THEME = {
	bg: "#12100e",
	surface: "#1c1814",
	surface2: "#26211c",
	fg: "#f6f1ea",
	muted: "#a3988c",
	border: "#3a322b",
	primary: "#d4654a",
	primaryFg: "#1a0e0a",
	paper: "#f6f1ea",
	ink: "#231c16",
	inkSoft: "#5c5148",
	gold: "#e8b86d",
	dialogueDefault: "",
	boldDialogue: false,
	chatTextSize: 15
};
var COLOR = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.\s,%]+\s*\)|hsla?\(\s*[\d.\s,%deg]+\s*\)|[a-zA-Z]{3,24}|(?:linear|radial|conic)-gradient\([^;{}]{1,280}\))$/;
function sanitizeColor(value) {
	const trimmed = value.trim().replace(/\s+/g, " ");
	if (!trimmed || trimmed.length > 300) return "";
	if (/url\(|expression|javascript:|;|\{|\}|@/i.test(trimmed)) return "";
	return COLOR.test(trimmed) ? trimmed : "";
}
function isGradient(value) {
	return /^(?:linear|radial|conic)-gradient\(/i.test(value);
}
function lookOf(look) {
	return {
		nameColor: sanitizeColor(look?.nameColor ?? ""),
		dialogueColor: sanitizeColor(look?.dialogueColor ?? ""),
		boxColor: sanitizeColor(look?.boxColor ?? "")
	};
}
function themeOf(theme) {
	const next = { ...DEFAULT_THEME };
	if (!theme) return next;
	Object.keys(DEFAULT_THEME).forEach((key) => {
		const value = theme[key];
		if (key === "boldDialogue") {
			if (typeof value === "boolean") next.boldDialogue = value;
			return;
		}
		if (key === "chatTextSize") {
			if (typeof value === "number" && value >= 12 && value <= 22) next.chatTextSize = Math.round(value);
			return;
		}
		if (typeof value === "string") {
			const safe = sanitizeColor(value);
			if (safe) next[key] = safe;
		}
	});
	return next;
}
function textPaint(value, fallback = "") {
	const color = sanitizeColor(value) || sanitizeColor(fallback);
	if (!color) return {};
	if (isGradient(color)) return {
		backgroundImage: color,
		WebkitBackgroundClip: "text",
		backgroundClip: "text",
		color: "transparent"
	};
	return { color };
}
function boxPaint(value) {
	const color = sanitizeColor(value);
	if (!color) return {};
	if (isGradient(color)) return { backgroundImage: color };
	return { backgroundColor: color };
}
var DIALOGUE = /(\*[^*]*\*|“[^”]*”|"[^"\n]*"|«[^»]*»|「[^」]*」)/g;
function splitDialogue(text) {
	const parts = [];
	let last = 0;
	for (const match of text.matchAll(DIALOGUE)) {
		const index = match.index ?? 0;
		if (index > last) parts.push({
			kind: "plain",
			text: text.slice(last, index)
		});
		const token = match[0];
		parts.push({
			kind: token.startsWith("*") ? "act" : "talk",
			text: token
		});
		last = index + token.length;
	}
	if (last < text.length) parts.push({
		kind: "plain",
		text: text.slice(last)
	});
	if (parts.length === 0) parts.push({
		kind: "plain",
		text
	});
	return parts;
}
function applyTheme(theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const map = {
		"--color-bg": theme.bg,
		"--color-surface": theme.surface,
		"--color-surface-2": theme.surface2,
		"--color-fg": theme.fg,
		"--color-muted": theme.muted,
		"--color-border": theme.border,
		"--color-primary": theme.primary,
		"--color-primary-fg": theme.primaryFg,
		"--color-paper": theme.paper,
		"--color-ink": theme.ink,
		"--color-ink-soft": theme.inkSoft,
		"--color-gold": theme.gold
	};
	for (const [key, value] of Object.entries(map)) {
		const safe = sanitizeColor(value);
		if (safe) root.style.setProperty(key, safe);
	}
}
var EMPTY_CARD = {
	name: "",
	summary: "",
	description: "",
	personality: "",
	scenario: "",
	first_mes: "",
	mes_example: "",
	creator_notes: "",
	system_prompt: "",
	post_history_instructions: "",
	tags: [],
	creator: "Cardwright",
	character_version: "1.0",
	alternate_greetings: [],
	backstory: "",
	appearance: "",
	talkativeness: 50,
	chatLook: { ...lookOf(null) },
	lorebookId: "",
	aliases: "",
	longMemory: ""
};
var STRING_KEYS = [
	"name",
	"summary",
	"description",
	"personality",
	"scenario",
	"first_mes",
	"mes_example",
	"creator_notes",
	"system_prompt",
	"post_history_instructions",
	"creator",
	"character_version",
	"backstory",
	"appearance"
];
var LONG_FIELDS = [
	{
		key: "description",
		label: "Description",
		hint: "Identity and role. Marinara sends this every turn."
	},
	{
		key: "personality",
		label: "Personality",
		hint: "Speech, temperament, and habits. Specific beats a pile of adjectives."
	},
	{
		key: "backstory",
		label: "Backstory",
		hint: "Marinara extension. Origin, relationships, facts that stay true."
	},
	{
		key: "appearance",
		label: "Appearance",
		hint: "Marinara extension. Face, build, clothes, and visual detail."
	},
	{
		key: "scenario",
		label: "Scenario",
		hint: "The situation a new chat starts in."
	},
	{
		key: "first_mes",
		label: "First message",
		hint: "The opening they actually say. Sets the voice."
	},
	{
		key: "mes_example",
		label: "Example dialogue",
		hint: "Separate exchanges with <START>. Teaches the voice."
	},
	{
		key: "creator_notes",
		label: "Creator notes",
		hint: "For people reading the card. Not sent to the model."
	},
	{
		key: "system_prompt",
		label: "System prompt",
		hint: "Optional. Leave blank to keep Marinara’s own instructions."
	},
	{
		key: "post_history_instructions",
		label: "After history",
		hint: "Optional instructions placed after the chat log."
	}
];
function isRecord$6(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function asString$1(value, fallback = "") {
	return typeof value === "string" ? value : fallback;
}
function asStringList(value) {
	if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item.trim().length > 0);
	if (typeof value === "string") return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
	return [];
}
function lookFrom(data, extensions) {
	const nested = isRecord$6(extensions.chat_look) ? extensions.chat_look : isRecord$6(extensions.chatLook) ? extensions.chatLook : isRecord$6(data.chat_look) ? data.chat_look : {};
	const pick = (...keys) => {
		for (const key of keys) {
			const value = nested[key] ?? extensions[key] ?? data[key];
			if (typeof value === "string") return value;
		}
		return "";
	};
	return lookOf({
		nameColor: pick("nameColor", "name_color"),
		dialogueColor: pick("dialogueColor", "dialogue_color"),
		boxColor: pick("boxColor", "box_color")
	});
}
function cloneCard(card) {
	return {
		...card,
		tags: [...card.tags],
		alternate_greetings: [...card.alternate_greetings],
		chatLook: lookOf(card.chatLook),
		aliases: card.aliases ?? "",
		longMemory: card.longMemory ?? ""
	};
}
function cardFromUnknown(raw, fallback = EMPTY_CARD) {
	const root = isRecord$6(raw) ? raw : {};
	const data = isRecord$6(root.data) ? root.data : root;
	const extensions = isRecord$6(data.extensions) ? data.extensions : {};
	const talk = extensions.talkativeness ?? data.talkativeness;
	const next = cloneCard(fallback);
	for (const key of STRING_KEYS) {
		const fromExt = key === "backstory" || key === "appearance" ? extensions[key] : void 0;
		const value = data[key] ?? fromExt;
		if (typeof value === "string") next[key] = value;
	}
	const tags = asStringList(data.tags);
	if (tags.length) next.tags = tags;
	const greetings = asStringList(data.alternate_greetings);
	if (greetings.length) next.alternate_greetings = greetings;
	if (typeof talk === "number" && Number.isFinite(talk)) next.talkativeness = Math.max(0, Math.min(100, Math.round(talk)));
	next.chatLook = lookFrom(data, extensions);
	const aliases = aliasText(data.aliases, extensions.aliases, extensions.nicknames, data.nickname, data.nicknames);
	if (aliases) next.aliases = aliases;
	const memory = asString$1(extensions.long_memory ?? extensions.longMemory ?? data.long_memory ?? data.longMemory);
	if (memory.trim()) next.longMemory = memory.trim();
	const loreId = extensions.cardwright_lorebook ?? extensions.lorebookId ?? data.lorebookId;
	if (typeof loreId === "string") next.lorebookId = loreId;
	if (!next.creator) next.creator = "Cardwright";
	if (!next.character_version) next.character_version = "1.0";
	return next;
}
function mergeBlanks(current, incoming) {
	const next = cloneCard(current);
	for (const key of STRING_KEYS) if (!next[key].trim() && incoming[key].trim()) next[key] = incoming[key];
	if (next.tags.length === 0 && incoming.tags.length) next.tags = [...incoming.tags];
	if (next.alternate_greetings.length === 0 && incoming.alternate_greetings.length) next.alternate_greetings = [...incoming.alternate_greetings];
	if (!next.aliases.trim() && incoming.aliases.trim()) next.aliases = incoming.aliases;
	if (!next.longMemory.trim() && incoming.longMemory.trim()) next.longMemory = incoming.longMemory;
	return next;
}
function toCharacterCardV2(card) {
	return {
		spec: "chara_card_v2",
		spec_version: "2.0",
		data: {
			name: card.name.trim() || "Unnamed",
			summary: card.summary,
			description: card.description,
			personality: card.personality,
			scenario: card.scenario,
			first_mes: card.first_mes,
			mes_example: card.mes_example,
			creator_notes: card.creator_notes,
			system_prompt: card.system_prompt,
			post_history_instructions: card.post_history_instructions,
			tags: card.tags,
			creator: card.creator.trim() || "Cardwright",
			character_version: card.character_version.trim() || "1.0",
			alternate_greetings: card.alternate_greetings.map((greeting) => greeting.trim()).filter(Boolean),
			character_book: null,
			extensions: {
				talkativeness: card.talkativeness,
				fav: false,
				backstory: card.backstory,
				appearance: card.appearance,
				chat_look: card.chatLook,
				aliases: card.aliases ?? "",
				long_memory: card.longMemory ?? "",
				cardwright_lorebook: card.lorebookId
			}
		}
	};
}
function aliasText(...values) {
	const names = values.flatMap((value) => asStringList(value));
	return [...new Set(names)].join("\n");
}
function nextCardVersion(current) {
	const match = current.trim().match(/^(\d+)(?:\.(\d+))?/);
	if (!match) return "1.1";
	const major = Number(match[1]);
	if (match[2] === void 0) return String(major + 1);
	return `${major}.${Number(match[2]) + 1}`;
}
function creatorFromPersona(card) {
	const name = card.name.trim();
	const summary = card.summary.trim().replace(/\s+/g, " ");
	const line = summary.length > 160 ? `${summary.slice(0, 157)}…` : summary;
	if (name && line) return `${name} — ${line}`;
	return name || line;
}
function slugName(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "character";
}
function wordCount(text) {
	const trimmed = text.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).length;
}
function extractJson(text) {
	const source = (text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? text).trim();
	const start = source.indexOf("{");
	const end = source.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("The model did not return a JSON object.");
	try {
		return JSON.parse(source.slice(start, end + 1));
	} catch {
		throw new Error("The model returned JSON that could not be parsed. Try again, or lower the temperature.");
	}
}
function tagsToText(tags) {
	return tags.join(", ");
}
function textToTags(text) {
	return asStringList(text);
}
function emptyBook(kind) {
	return {
		id: crypto.randomUUID(),
		name: kind === "world" ? "New world book" : "New lorebook",
		kind,
		description: "",
		scanDepth: 4,
		entries: [],
		updatedAt: Date.now()
	};
}
function emptyEntry() {
	return {
		id: crypto.randomUUID(),
		name: "",
		keys: "",
		content: "",
		enabled: true,
		constant: false,
		order: 100
	};
}
function isRecord$5(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function asString(value) {
	return typeof value === "string" ? value : "";
}
function asBool$1(value, fallback) {
	if (typeof value === "boolean") return value;
	if (value === 1 || value === "true") return true;
	if (value === 0 || value === "false") return false;
	return fallback;
}
function keysToText(value) {
	if (Array.isArray(value)) return value.map((item) => {
		if (typeof item === "string") return item;
		if (isRecord$5(item)) return asString(item.key ?? item.text ?? item.name ?? item.value);
		return "";
	}).filter(Boolean).join(", ");
	if (isRecord$5(value)) return Object.values(value).map((item) => typeof item === "string" ? item : isRecord$5(item) ? asString(item.key ?? item.text ?? item.name ?? item.value) : "").filter(Boolean).join(", ");
	return asString(value);
}
function entryContent(raw) {
	const extensions = isRecord$5(raw.extensions) ? raw.extensions : {};
	return asString(raw.content ?? raw.text ?? raw.entry ?? raw.body ?? raw.value ?? extensions.content ?? extensions.text ?? extensions.entry);
}
function unwrapEntry(raw) {
	const nested = [
		raw.entry,
		raw.data,
		raw.fields
	].find((item) => isRecord$5(item) && (entryContent(item) || keysToText(item.keys ?? item.key ?? item.keywords ?? item.primaryKeys ?? item.primary_keys)));
	if (!isRecord$5(nested)) return raw;
	return {
		...raw,
		...nested,
		name: nested.name ?? nested.comment ?? nested.title ?? raw.name ?? raw.comment,
		extensions: isRecord$5(nested.extensions) ? nested.extensions : raw.extensions
	};
}
function entryFrom(raw, index) {
	if (!isRecord$5(raw)) return null;
	const source = unwrapEntry(raw);
	const content = entryContent(source) || asString(source.description);
	const keys = [keysToText(source.keys ?? source.key ?? source.keywords ?? source.primaryKeys ?? source.primary_keys ?? source.triggers), keysToText(source.secondaryKeys ?? source.secondary_keys ?? source.keysecondary)].filter(Boolean).join(", ");
	if (!content.trim() && !keys.trim()) return null;
	const order = source.order ?? source.insertion_order ?? source.priority ?? source.displayIndex;
	const disabled = source.disable === true || source.disabled === true || source.enabled === false || source.enabled === 0 || source.enabled === "false";
	return {
		id: typeof source.id === "string" ? source.id : typeof source.uid === "number" ? `uid-${source.uid}` : typeof source.id === "number" ? `id-${source.id}` : crypto.randomUUID(),
		name: asString(source.name ?? source.comment ?? source.title ?? source.displayName),
		keys,
		content,
		enabled: disabled ? false : asBool$1(source.enabled, true),
		constant: asBool$1(source.constant, source.forceActivation === true || source.alwaysActive === true || source.always_active === true),
		order: typeof order === "number" && Number.isFinite(order) ? order : index
	};
}
function entriesFrom(raw) {
	const parsed = typeof raw === "string" ? parseJson(raw) : raw;
	return (Array.isArray(parsed) ? parsed : isRecord$5(parsed) ? Object.values(parsed) : []).map(entryFrom).filter((entry) => entry !== null);
}
function parseJson(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
	try {
		return JSON.parse(trimmed);
	} catch {
		return value;
	}
}
function firstText(...values) {
	for (const value of values) if (typeof value === "string" && value.trim()) return value.trim();
	return "";
}
function firstEntries(...candidates) {
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of candidates) for (const entry of entriesFrom(candidate)) {
		const key = `${entry.name}\n${entry.keys}\n${entry.content}`;
		if (seen.has(key)) continue;
		seen.add(key);
		if (merged.some((item) => item.id === entry.id)) entry.id = crypto.randomUUID();
		merged.push(entry);
	}
	return merged;
}
function folderEntries(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((folder) => isRecord$5(folder) ? [folder.entries] : []);
}
function nestedBookEntries(value) {
	if (!Array.isArray(value)) return [];
	const buckets = [];
	for (const item of value) {
		if (!isRecord$5(item)) continue;
		buckets.push(item.entries);
		if (isRecord$5(item.lorebook)) buckets.push(item.lorebook.entries);
		if (isRecord$5(item.character_book)) buckets.push(item.character_book.entries);
		if (isRecord$5(item.data)) {
			buckets.push(item.data.entries);
			if (isRecord$5(item.data.lorebook)) buckets.push(item.data.lorebook.entries);
			if (isRecord$5(item.data.character_book)) buckets.push(item.data.character_book.entries);
		}
	}
	return buckets;
}
function originalEntries(value) {
	if (!isRecord$5(value)) return [];
	return [value.entries, isRecord$5(value.character_book) ? value.character_book.entries : void 0];
}
function lorebookFromUnknown(raw, fallbackName = "Imported book") {
	if (typeof raw === "string") {
		const parsed = parseJson(raw);
		return parsed === raw ? null : lorebookFromUnknown(parsed, fallbackName);
	}
	if (!isRecord$5(raw)) return null;
	const data = isRecord$5(raw.data) ? raw.data : null;
	const inner = data && isRecord$5(data.data) ? data.data : null;
	const lore = isRecord$5(raw.lorebook) ? raw.lorebook : isRecord$5(data?.lorebook) ? data.lorebook : isRecord$5(inner?.lorebook) ? inner.lorebook : null;
	const book = isRecord$5(raw.character_book) ? raw.character_book : isRecord$5(data?.character_book) ? data.character_book : isRecord$5(data?.characterBook) ? data.characterBook : isRecord$5(inner?.character_book) ? inner.character_book : null;
	const character = isRecord$5(raw.character) ? raw.character : isRecord$5(data?.character) ? data.character : null;
	const characterData = character && isRecord$5(character.data) ? character.data : null;
	const characterBook = character && isRecord$5(character.character_book) ? character.character_book : characterData && isRecord$5(characterData.character_book) ? characterData.character_book : null;
	const entries = firstEntries(raw.entries, data?.entries, inner?.entries, lore?.entries, book?.entries, characterBook?.entries, raw.loreEntries, data?.loreEntries, inner?.loreEntries, ...folderEntries(raw.folders), ...folderEntries(data?.folders), ...folderEntries(inner?.folders), ...folderEntries(lore?.folders), ...nestedBookEntries(raw.lorebooks), ...nestedBookEntries(data?.lorebooks), ...nestedBookEntries(inner?.lorebooks), ...originalEntries(raw.originalData), ...originalEntries(data?.originalData));
	const name = firstText(lore?.name, book?.name, characterBook?.name, raw.name, data?.name, inner?.name, raw.title, data?.title);
	const description = firstText(lore?.description, book?.description, characterBook?.description, raw.description, data?.description, inner?.description);
	if (!name && entries.length === 0 && !description) return null;
	const depth = lore?.scan_depth ?? lore?.scanDepth ?? book?.scan_depth ?? book?.scanDepth ?? raw.scan_depth ?? raw.scanDepth ?? data?.scanDepth ?? inner?.scanDepth;
	const kind = lore?.category === "world" || lore?.kind === "world" || raw.kind === "world" || book?.kind === "world" ? "world" : "lore";
	return {
		id: firstText(lore?.id, book?.id, raw.id) || crypto.randomUUID(),
		name: name || fallbackName,
		kind,
		description,
		scanDepth: typeof depth === "number" && depth > 0 ? Math.min(50, Math.round(depth)) : 4,
		entries,
		updatedAt: Date.now()
	};
}
function bookToFile(book) {
	return {
		name: book.name,
		kind: book.kind,
		description: book.description,
		scan_depth: book.scanDepth,
		entries: book.entries.map((entry) => ({
			id: entry.id,
			name: entry.name,
			keys: entry.keys.split(/[,\n]/).map((key) => key.trim()).filter(Boolean),
			content: entry.content,
			enabled: entry.enabled,
			constant: entry.constant,
			insertion_order: entry.order
		}))
	};
}
function escapeKey(key) {
	return key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function keyHits(haystack, key) {
	const needle = key.trim().toLowerCase();
	if (!needle) return false;
	if (needle.length <= 3) return new RegExp(`(^|[^a-z0-9])${escapeKey(needle)}([^a-z0-9]|$)`, "i").test(haystack);
	return haystack.toLowerCase().includes(needle);
}
function activateBooks(books, history) {
	const hits = [];
	for (const book of books) {
		const depth = Math.max(1, book.scanDepth || 4);
		const window = history.slice(-depth).map((turn) => turn.text).join("\n");
		for (const entry of book.entries) {
			if (!entry.enabled || !entry.content.trim()) continue;
			const keys = entry.keys.split(/[,\n]/).map((key) => key.trim()).filter(Boolean);
			if (entry.constant || keys.some((key) => keyHits(window, key))) hits.push(entry);
		}
	}
	hits.sort((a, b) => a.order - b.order);
	const seen = /* @__PURE__ */ new Set();
	const lines = [];
	for (const entry of hits) {
		const content = entry.content.trim();
		if (seen.has(content)) continue;
		seen.add(content);
		const title = entry.name.trim();
		lines.push(title ? `${title}: ${content}` : content);
	}
	return lines.join("\n\n").slice(0, 6e3);
}
function loreCatalog(books, limit = 30) {
	const lines = [];
	const cap = Math.max(5, Math.min(80, limit));
	for (const book of books) for (const entry of book.entries) {
		if (!entry.enabled || !entry.content.trim()) continue;
		const title = entry.name.trim() || "Entry";
		const keys = entry.keys.trim();
		const blurb = entry.content.trim().replace(/\s+/g, " ").slice(0, 240);
		lines.push(keys ? `${title} (${keys}): ${blurb}` : `${title}: ${blurb}`);
		if (lines.length >= cap) return lines.join("\n");
	}
	return lines.join("\n");
}
var MARKERS = /* @__PURE__ */ new Set([
	"lorebook",
	"character",
	"persona",
	"dialogue_examples",
	"chat_history",
	"chat_summary"
]);
function isRecord$4(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function asBool(value) {
	return value === true || value === "true" || value === 1;
}
function asJson(value, fallback) {
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
	if (value === void 0 || value === null) return fallback;
	return value;
}
function asRole(value) {
	if (value === "user" || value === "assistant" || value === "system") return value;
	return "system";
}
function asMarker(value) {
	if (typeof value === "string" && MARKERS.has(value)) return value;
	return null;
}
function choiceValue(raw) {
	if (typeof raw === "string" || Array.isArray(raw)) return raw;
}
function starterPreset() {
	const role = "sec-role";
	const character = "sec-character";
	const persona = "sec-persona";
	const examples = "sec-examples";
	const lore = "sec-lore";
	const memory = "sec-memory";
	const history = "sec-history";
	const closing = "sec-closing";
	return {
		id: "cardwright-simple",
		name: "Cardwright simple",
		description: "A small preset. Turn sections on or off, then mark it active for chat. Import a Marinara preset to replace it.",
		author: "Cardwright",
		sectionOrder: [
			role,
			character,
			persona,
			lore,
			memory,
			examples,
			history,
			closing
		],
		groups: [],
		values: {
			promptPOV: "3rd",
			promptTense: "past",
			promptLength: "between 150 and 300 words",
			promptTweaks: []
		},
		choices: [
			{
				id: "choice-pov",
				variableName: "promptPOV",
				question: "Point of view",
				multiSelect: false,
				separator: ", ",
				options: [
					{
						id: "pov-1",
						label: "First person",
						value: "1st"
					},
					{
						id: "pov-2",
						label: "Second person",
						value: "2nd"
					},
					{
						id: "pov-3",
						label: "Third person",
						value: "3rd"
					}
				]
			},
			{
				id: "choice-tense",
				variableName: "promptTense",
				question: "Tense",
				multiSelect: false,
				separator: ", ",
				options: [{
					id: "tense-past",
					label: "Past",
					value: "past"
				}, {
					id: "tense-present",
					label: "Present",
					value: "present"
				}]
			},
			{
				id: "choice-length",
				variableName: "promptLength",
				question: "Reply length",
				multiSelect: false,
				separator: ", ",
				options: [
					{
						id: "len-short",
						label: "Short",
						value: "under 120 words"
					},
					{
						id: "len-mid",
						label: "Moderate",
						value: "between 150 and 300 words"
					},
					{
						id: "len-long",
						label: "Long",
						value: "between 350 and 700 words"
					}
				]
			},
			{
				id: "choice-tweaks",
				variableName: "promptTweaks",
				question: "Optional directions",
				multiSelect: true,
				separator: "\n\n",
				options: [{
					id: "tweak-armor",
					label: "No plot armor",
					value: "Do not protect anyone with plot armor. Setbacks and refusals are allowed when they fit the character."
				}, {
					id: "tweak-world",
					label: "The world keeps moving",
					value: "The world changes even when the user hesitates. Other people have plans of their own."
				}]
			}
		],
		sections: [
			{
				id: role,
				name: "Role",
				role: "system",
				enabled: true,
				isMarker: false,
				markerType: null,
				injectionPosition: "ordered",
				injectionDepth: 0,
				injectionOrder: 0,
				groupId: null,
				content: "You are writing {{char}} in a story with {{user}}. Never speak, think, or act for {{user}}. Write in {{promptPOV}} person, {{promptTense}} tense. Length: {{promptLength}}.\n\n{{promptTweaks}}"
			},
			marker(character, "Character", "character", 100),
			marker(persona, "Persona", "persona", 200),
			marker(lore, "Lorebook", "lorebook", 250),
			marker(memory, "Memory", "chat_summary", 280),
			marker(examples, "Dialogue examples", "dialogue_examples", 300),
			marker(history, "Chat history", "chat_history", 400),
			{
				id: closing,
				name: "Your turn",
				role: "system",
				enabled: true,
				isMarker: false,
				markerType: null,
				injectionPosition: "ordered",
				injectionDepth: 0,
				injectionOrder: 500,
				groupId: null,
				content: "Continue as {{char}}. Leave room for {{user}} to answer."
			}
		]
	};
}
function marker(id, name, type, order) {
	return {
		id,
		name,
		content: "",
		role: "system",
		enabled: true,
		isMarker: true,
		markerType: type,
		injectionPosition: "ordered",
		injectionDepth: 0,
		injectionOrder: order,
		groupId: null
	};
}
function parseMarinaraPreset(raw) {
	if (!isRecord$4(raw)) throw new Error("That file is not a Marinara preset.");
	const data = isRecord$4(raw.data) ? raw.data : raw;
	const preset = isRecord$4(data.preset) ? data.preset : isRecord$4(data) && typeof data.name === "string" ? data : null;
	if (!preset || typeof preset.name !== "string" || !preset.name.trim()) throw new Error("That file is not a Marinara preset.");
	const sectionOrder = asJson(preset.sectionOrder, []);
	const defaults = asJson(preset.defaultChoices, {});
	const sectionsRaw = Array.isArray(data.sections) ? data.sections : [];
	const groupsRaw = Array.isArray(data.groups) ? data.groups : [];
	const choicesRaw = Array.isArray(data.choiceBlocks) ? data.choiceBlocks : [];
	const sections = sectionsRaw.filter(isRecord$4).map((entry, index) => parseSection(entry, index));
	if (sections.length === 0 && !Array.isArray(data.sections)) throw new Error("That preset has no sections.");
	const orderIds = sectionOrder.filter((id) => typeof id === "string");
	const values = {};
	for (const [key, value] of Object.entries(defaults)) {
		const parsed = choiceValue(value);
		if (parsed !== void 0) values[key] = parsed;
	}
	return {
		id: typeof preset.id === "string" && preset.id.trim() ? preset.id : crypto.randomUUID(),
		name: preset.name.trim(),
		description: typeof preset.description === "string" ? preset.description : "",
		author: typeof preset.author === "string" ? preset.author : "",
		sections,
		sectionOrder: orderIds.length > 0 ? orderIds : sections.map((section) => section.id),
		groups: groupsRaw.filter(isRecord$4).map((entry, index) => ({
			id: typeof entry.id === "string" ? entry.id : `group-${index}`,
			name: typeof entry.name === "string" && entry.name.trim() ? entry.name : "Group",
			enabled: asBool(entry.enabled),
			order: typeof entry.order === "number" ? entry.order : index
		})),
		choices: choicesRaw.filter(isRecord$4).map((entry, index) => parseChoice(entry, index)),
		values
	};
}
function parseSection(entry, index) {
	const markerConfig = asJson(entry.markerConfig, null);
	const markerType = asMarker(isRecord$4(markerConfig) ? markerConfig.type : null);
	const position = entry.injectionPosition === "depth" ? "depth" : "ordered";
	return {
		id: typeof entry.id === "string" && entry.id.trim() ? entry.id : `section-${index}`,
		name: typeof entry.name === "string" && entry.name.trim() ? entry.name : "Section",
		content: typeof entry.content === "string" ? entry.content : "",
		role: asRole(entry.role),
		enabled: asBool(entry.enabled),
		isMarker: asBool(entry.isMarker) || markerType !== null,
		markerType,
		injectionPosition: position,
		injectionDepth: typeof entry.injectionDepth === "number" ? entry.injectionDepth : Number(entry.injectionDepth) || 0,
		injectionOrder: typeof entry.injectionOrder === "number" ? entry.injectionOrder : index,
		groupId: typeof entry.groupId === "string" ? entry.groupId : null
	};
}
function parseChoice(entry, index) {
	const options = asJson(entry.options, []).filter(isRecord$4).map((option, optionIndex) => ({
		id: typeof option.id === "string" ? option.id : `opt-${index}-${optionIndex}`,
		label: typeof option.label === "string" ? option.label : "Option",
		value: typeof option.value === "string" ? option.value : ""
	}));
	return {
		id: typeof entry.id === "string" ? entry.id : `choice-${index}`,
		variableName: typeof entry.variableName === "string" && entry.variableName.trim() ? entry.variableName : `var${index}`,
		question: typeof entry.question === "string" && entry.question.trim() ? entry.question : "Choose",
		options,
		multiSelect: asBool(entry.multiSelect),
		separator: typeof entry.separator === "string" ? entry.separator : "\n\n"
	};
}
function toMarinaraFile(preset) {
	return {
		type: "marinara_preset",
		version: 1,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		data: {
			preset: {
				id: preset.id,
				name: preset.name,
				description: preset.description,
				author: preset.author,
				sectionOrder: JSON.stringify(preset.sectionOrder),
				defaultChoices: JSON.stringify(preset.values)
			},
			sections: preset.sections.map((section) => ({
				id: section.id,
				name: section.name,
				content: section.content,
				role: section.role,
				enabled: section.enabled ? "true" : "false",
				isMarker: section.isMarker ? "true" : "false",
				markerConfig: section.markerType ? JSON.stringify({ type: section.markerType }) : null,
				injectionPosition: section.injectionPosition,
				injectionDepth: section.injectionDepth,
				injectionOrder: section.injectionOrder,
				groupId: section.groupId
			})),
			groups: preset.groups.map((group) => ({
				id: group.id,
				name: group.name,
				enabled: group.enabled ? "true" : "false",
				order: group.order
			})),
			choiceBlocks: preset.choices.map((choice) => ({
				id: choice.id,
				variableName: choice.variableName,
				question: choice.question,
				options: JSON.stringify(choice.options),
				multiSelect: choice.multiSelect ? "true" : "false",
				separator: choice.separator
			}))
		}
	};
}
function expandMacros(text, ctx, depth = 0) {
	if (depth > 8) return text;
	let output = "";
	let rest = text;
	let guard = 0;
	while (rest.includes("{{") && guard < 400) {
		guard += 1;
		const start = rest.indexOf("{{");
		const end = rest.indexOf("}}", start + 2);
		output += rest.slice(0, start);
		if (end < 0) {
			output += rest.slice(start);
			rest = "";
			break;
		}
		output += resolveToken(rest.slice(start + 2, end), ctx, depth);
		rest = rest.slice(end + 2);
	}
	return output + rest;
}
function resolveToken(token, ctx, depth) {
	const trimmed = token.trim();
	if (/^char$/i.test(trimmed)) return ctx.charName;
	if (/^user$/i.test(trimmed)) return ctx.userName;
	if (trimmed.startsWith("setvar::")) {
		const parts = trimmed.slice(8).split("::");
		const name = parts.shift()?.trim() ?? "";
		if (name) ctx.vars[name] = expandMacros(parts.join("::"), ctx, depth + 1);
		return "";
	}
	if (trimmed.startsWith("random::")) {
		const parts = trimmed.slice(8).split("::").map((part) => part.trim()).filter(Boolean);
		if (parts.length === 0) return "";
		return expandMacros(parts[Math.min(parts.length - 1, Math.floor(ctx.rng() * parts.length))] ?? "", ctx, depth + 1);
	}
	if (trimmed.startsWith("getvar::")) {
		const name = trimmed.slice(8).trim();
		return ctx.vars[name] ?? "";
	}
	if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed) && trimmed in ctx.vars) return expandMacros(ctx.vars[trimmed] ?? "", ctx, depth + 1);
	return `{{${token}}}`;
}
function resolveVars(preset) {
	const vars = {};
	for (const choice of preset.choices) {
		const raw = preset.values[choice.variableName];
		if (choice.multiSelect) {
			const texts = (Array.isArray(raw) ? raw : typeof raw === "string" && raw ? [raw] : []).map((item) => choice.options.find((option) => option.value === item || option.id === item || option.label === item)?.value ?? item).map((item) => item.trim()).filter((item) => item && !/^none specified$/i.test(item));
			const separator = texts.some((item) => item.includes("\n")) ? "\n\n" : choice.separator || "\n\n";
			vars[choice.variableName] = texts.join(separator);
			continue;
		}
		const picked = Array.isArray(raw) ? raw[0] : raw;
		const match = choice.options.find((option) => option.value === picked || option.id === picked || option.label === picked);
		vars[choice.variableName] = match?.value ?? (typeof picked === "string" ? picked : choice.options[0]?.value ?? "");
	}
	return vars;
}
function orderedSections(preset) {
	const rank = new Map(preset.sectionOrder.map((id, index) => [id, index]));
	return [...preset.sections].sort((a, b) => {
		return (rank.has(a.id) ? rank.get(a.id) : preset.sectionOrder.length + a.injectionOrder) - (rank.has(b.id) ? rank.get(b.id) : preset.sectionOrder.length + b.injectionOrder) || a.injectionOrder - b.injectionOrder;
	});
}
function groupOn(preset, section) {
	if (!section.groupId) return true;
	const group = preset.groups.find((entry) => entry.id === section.groupId);
	return !group || group.enabled;
}
function fillCard(card, expand) {
	return [
		card.name.trim() && `Name: ${expand(card.name)}`,
		card.description.trim() && expand(card.description),
		card.personality.trim() && `Personality:\n${expand(card.personality)}`,
		card.appearance.trim() && `Appearance:\n${expand(card.appearance)}`,
		card.backstory.trim() && `Backstory:\n${expand(card.backstory)}`,
		card.scenario.trim() && `Scenario:\n${expand(card.scenario)}`,
		card.system_prompt.trim() && expand(card.system_prompt),
		card.post_history_instructions.trim() && expand(card.post_history_instructions)
	].filter((part) => Boolean(part)).join("\n\n");
}
function sectionText(section, card, persona, expand, extras) {
	if (section.markerType === "chat_history") return "";
	if (section.markerType === "lorebook") return extras?.lore?.trim() ? expand(`Lore that fits this moment:\n${extras.lore.trim()}`) : "";
	if (section.markerType === "chat_summary") return extras?.memory?.trim() ? expand(`Memory of the story so far:\n${extras.memory.trim()}`) : "";
	if (section.markerType === "character") return fillCard(card, expand);
	if (section.markerType === "persona") return persona ? fillCard(persona, expand) : "";
	if (section.markerType === "dialogue_examples") return expand(card.mes_example.trim());
	return expand(section.content).trim();
}
function buildPresetMessages(preset, card, persona, history, rng = Math.random, extras) {
	const charName = card.name.trim() || "Character";
	const userName = persona?.name.trim() || "User";
	const ctx = {
		vars: resolveVars(preset),
		charName,
		userName,
		rng
	};
	for (const key of Object.keys(ctx.vars)) ctx.vars[key] = expandMacros(ctx.vars[key], ctx);
	const expand = (text) => expandMacros(text, ctx);
	const before = [];
	const after = [];
	const depthBits = [];
	let seenHistory = false;
	for (const section of orderedSections(preset)) {
		if (!section.enabled || !groupOn(preset, section)) continue;
		if (section.markerType === "chat_history") {
			seenHistory = true;
			continue;
		}
		const content = sectionText(section, card, persona, expand, extras).trim();
		if (!content) continue;
		if (section.injectionPosition === "depth") {
			depthBits.push({
				depth: Math.max(0, section.injectionDepth),
				order: section.injectionOrder,
				role: section.role,
				content
			});
			continue;
		}
		(seenHistory ? after : before).push({
			role: section.role,
			content
		});
	}
	const hasLore = preset.sections.some((section) => section.enabled && section.markerType === "lorebook");
	const hasMemory = preset.sections.some((section) => section.enabled && section.markerType === "chat_summary");
	if (!hasLore && extras?.lore?.trim()) before.push({
		role: "system",
		content: expand(`Lore that fits this moment:\n${extras.lore.trim()}`)
	});
	if (!hasMemory && extras?.memory?.trim()) before.push({
		role: "system",
		content: expand(`Memory of the story so far:\n${extras.memory.trim()}`)
	});
	const transcript = history.filter((turn) => turn.text.trim()).slice(-40).map((turn) => ({
		role: turn.role,
		content: turn.role === "assistant" && turn.speakerName?.trim() ? `${turn.speakerName.trim()}: ${turn.text}` : turn.text
	}));
	const grouped = /* @__PURE__ */ new Map();
	for (const bit of depthBits) {
		const list = grouped.get(bit.depth) ?? [];
		list.push(bit);
		grouped.set(bit.depth, list);
	}
	const merged = [...transcript];
	for (const depth of [...grouped.keys()].sort((a, b) => b - a)) {
		const list = (grouped.get(depth) ?? []).sort((a, b) => a.order - b.order);
		const index = Math.max(0, merged.length - depth);
		merged.splice(index, 0, ...list.map((bit) => ({
			role: bit.role,
			content: bit.content
		})));
	}
	return squash(seenHistory ? [
		...before,
		...merged,
		...after
	] : [
		...before,
		...after,
		...merged
	]);
}
function squash(messages) {
	const out = [];
	for (const message of messages) {
		const last = out[out.length - 1];
		if (last && last.role === "system" && message.role === "system") last.content = `${last.content}\n\n${message.content}`;
		else out.push({ ...message });
	}
	return out.filter((message) => message.content.trim());
}
var DEFAULT_SETTINGS = {
	baseUrl: "http://127.0.0.1:5001/v1",
	apiKey: "",
	model: "koboldcpp",
	temperature: .8,
	maxTokens: 2200,
	useImages: true,
	novelToken: "",
	novelModel: "nai-diffusion-5-full"
};
function v1Base(baseUrl) {
	const trimmed = baseUrl.trim().replace(/\/+$/, "");
	return /\/v1$/i.test(trimmed) ? trimmed : `${trimmed}/v1`;
}
function endpoint(baseUrl, path) {
	return `${v1Base(baseUrl)}/${path}`;
}
function headers(apiKey) {
	const next = { "Content-Type": "application/json" };
	if (apiKey.trim()) next.Authorization = `Bearer ${apiKey.trim()}`;
	return next;
}
var desktopHost = null;
async function isDesktopHost() {
	if (desktopHost !== null) return desktopHost;
	try {
		const response = await fetch("/api/cardwright", {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(1500)
		});
		if (!response.ok) {
			desktopHost = false;
			return false;
		}
		desktopHost = (await response.json()).desktop === true;
	} catch {
		desktopHost = false;
	}
	return desktopHost;
}
function explainFetchError(error, response, detail) {
	const extra = detail?.trim() ?? "";
	if (response) {
		if (/image|vision|multimodal|mmproj|unsupported content/i.test(extra)) return "This model did not accept pictures. In KoboldCPP, load a vision model and its mmproj, or turn off “Send pictures to the model”.";
		if (response.status === 401 || response.status === 403) return "KoboldCPP refused the password. Put the same password you set with --password, or leave it blank.";
		if (response.status === 404) return "That address has no chat endpoint. Use the OpenAI base, usually http://127.0.0.1:5001/v1.";
		if (extra && extra.length < 180 && !extra.startsWith("<")) return `KoboldCPP answered with HTTP ${response.status}. ${extra}`;
		return `KoboldCPP answered with HTTP ${response.status}.`;
	}
	if (error instanceof DOMException && error.name === "AbortError") return "The model took too long. Try a shorter concept, or check that KoboldCPP is still generating.";
	if (error instanceof Error && /failed to fetch|networkerror|load failed/i.test(error.message)) return "Could not reach KoboldCPP. Start it on this computer, then use http://127.0.0.1:5001/v1. The Windows app reaches it directly. This preview only can if Kobold is running on the same machine.";
	if (error instanceof Error && error.message) return error.message;
	return "Something went wrong talking to KoboldCPP.";
}
function withPictures(text, images) {
	const pictures = images.filter((url) => url.startsWith("data:image/"));
	if (pictures.length === 0) return text;
	return [{
		type: "text",
		text
	}, ...pictures.map((url) => ({
		type: "image_url",
		image_url: { url }
	}))];
}
async function readDetail(response) {
	try {
		return (await response.text()).replace(/\s+/g, " ").slice(0, 300);
	} catch {
		return "";
	}
}
async function request(settings, path, init) {
	const desktop = await isDesktopHost();
	const url = desktop ? `/proxy/${path}` : endpoint(settings.baseUrl, path);
	const reqHeaders = new Headers(init.headers);
	if (desktop) reqHeaders.set("X-Kobold-Base", v1Base(settings.baseUrl));
	try {
		return await fetch(url, {
			...init,
			headers: reqHeaders
		});
	} catch (error) {
		throw new Error(explainFetchError(error));
	}
}
async function complete(settings, messages, maxTokens = settings.maxTokens) {
	const response = await request(settings, "chat/completions", {
		method: "POST",
		headers: headers(settings.apiKey),
		signal: AbortSignal.timeout(18e4),
		body: JSON.stringify({
			model: settings.model.trim() || "koboldcpp",
			messages,
			temperature: settings.temperature,
			max_tokens: maxTokens
		})
	});
	if (!response.ok) {
		const detail = await readDetail(response);
		throw new Error(explainFetchError(void 0, response, detail));
	}
	const content = (await response.json()).choices?.[0]?.message?.content;
	if (typeof content === "string" && content.trim()) return content;
	if (Array.isArray(content)) {
		const text = content.map((part) => {
			if (typeof part === "string") return part;
			if (part && typeof part === "object" && "text" in part && typeof part.text === "string") return part.text;
			return "";
		}).join("");
		if (text.trim()) return text;
	}
	throw new Error("KoboldCPP returned an empty reply.");
}
async function askText(settings, system, user, maxTokens = 400) {
	return complete(settings, [{
		role: "system",
		content: system
	}, {
		role: "user",
		content: user
	}], maxTokens);
}
var SYSTEM = `You write character cards for Marinara Engine, which reads SillyTavern Character Card V2.
Return one JSON object and nothing else. No markdown fences. No commentary.
Use {{char}} for the character and {{user}} for the person they meet. Do not invent a name for {{user}}.
Write concrete facts, not adjective piles. first_mes is spoken in character, with actions in asterisks.
mes_example contains two or three exchanges, each block starting with <START>.
summary is one sentence for a library list and is not roleplay prose.
tags is an array of 3 to 6 short labels.
talkativeness is an integer from 0 to 100.
Leave system_prompt and post_history_instructions as empty strings unless the concept demands a hard rule.`;
var VISION = `Reference images are attached. They are the character, not a suggestion.
appearance must match what is visible: face, body, clothing, colors, and setting cues.
Do not invent a conflicting look. You may name them and write personality if the concept does not.`;
function cardSchemaHint() {
	return `JSON keys:
{
  "name": "",
  "summary": "",
  "description": "",
  "personality": "",
  "scenario": "",
  "first_mes": "",
  "mes_example": "",
  "creator_notes": "",
  "backstory": "",
  "appearance": "",
  "tags": [],
  "alternate_greetings": [],
  "talkativeness": 50,
  "system_prompt": "",
  "post_history_instructions": ""
}`;
}
async function probeKobold(settings) {
	const response = await request(settings, "models", {
		headers: headers(settings.apiKey),
		signal: AbortSignal.timeout(8e3)
	});
	if (!response.ok) {
		const detail = await readDetail(response);
		throw new Error(explainFetchError(void 0, response, detail));
	}
	const id = (await response.json()).data?.find((item) => item.id)?.id;
	return id ? `Connected. Model: ${id}` : "Connected to KoboldCPP.";
}
async function generateCard(settings, concept, images = []) {
	const trimmed = concept.trim();
	const pictures = images.filter(Boolean);
	if (trimmed.length < 8 && pictures.length === 0) throw new Error("Describe the character in a sentence or two, or add a reference picture.");
	const conceptText = trimmed.length >= 8 ? trimmed : "No written concept. Take the character's look from the reference pictures and build the rest to match.";
	const messages = [{
		role: "system",
		content: pictures.length ? `${SYSTEM}\n${VISION}` : SYSTEM
	}, {
		role: "user",
		content: withPictures(`Write a full character card from this concept:\n${conceptText}\n\n${cardSchemaHint()}`, pictures)
	}];
	let raw = await complete(settings, messages);
	try {
		return cardFromUnknown(extractJson(raw), EMPTY_CARD);
	} catch (error) {
		messages.push({
			role: "assistant",
			content: raw
		});
		messages.push({
			role: "user",
			content: withPictures("That was not valid JSON. Reply again with only the JSON object, no fences.", pictures)
		});
		raw = await complete(settings, messages);
		try {
			return cardFromUnknown(extractJson(raw), EMPTY_CARD);
		} catch {
			throw error instanceof Error ? error : /* @__PURE__ */ new Error("Could not read the card.");
		}
	}
}
var FIELD_GUIDE = {
	name: "A fitting proper name only.",
	summary: "One sentence for a library preview. Not roleplay prose.",
	description: "120 to 220 words. Who they are. Use {{char}} and {{user}}.",
	personality: "How they behave and speak. Concrete habits.",
	scenario: "The default opening situation. Use {{char}} and {{user}}.",
	first_mes: "80 to 180 words, in character, actions in asterisks. End on something {{user}} can answer.",
	mes_example: "Two exchanges. Each begins with <START> on its own line.",
	creator_notes: "A short note for the human, including tone or content if it matters.",
	system_prompt: "Only if a hard rule is required. Otherwise empty string.",
	post_history_instructions: "Only if a hard rule must sit after history. Otherwise empty string.",
	creator: "Keep Cardwright unless the concept names an author.",
	character_version: "A short version string, usually 1.0.",
	backstory: "Established past. Facts, not a scene.",
	appearance: "Visual specifics another artist could draw. Match any reference pictures exactly."
};
async function rewriteField(settings, concept, card, field, images = []) {
	const pictures = field === "appearance" || field === "description" ? images : [];
	const parsed = extractJson(await complete(settings, [{
		role: "system",
		content: pictures.length ? `${SYSTEM}\n${VISION}` : SYSTEM
	}, {
		role: "user",
		content: withPictures(`Rewrite only the "${field}" field.
Guide: ${FIELD_GUIDE[field]}
Concept: ${concept.trim() || "(none — infer from the card and any pictures)"}
Current card JSON:
${JSON.stringify(card)}
Current ${field}:
${card[field]}

Return {"value":"..."} and nothing else.`, pictures)
	}]));
	if (parsed && typeof parsed === "object" && "value" in parsed && typeof parsed.value === "string") return parsed.value;
	if (typeof parsed === "object" && parsed && field in parsed) {
		const value = parsed[field];
		if (typeof value === "string") return value;
	}
	throw new Error("The model did not return a value for that field.");
}
var PERSONA_SYSTEM = `You write a Marinara persona: the character card that stands for the human in a chat, not the character they talk to.
Return one JSON object and nothing else. No markdown fences. No commentary.
Use {{user}} for this persona and {{char}} for the other character. Do not invent a name for {{char}}.
Write concrete facts. first_mes must be an empty string. alternate_greetings must be an empty array.
mes_example shows how {{user}} speaks, two short exchanges, each block starting with <START>.
summary is one sentence for a library list.
tags is an array of 3 to 6 short labels.
Leave system_prompt and post_history_instructions as empty strings.`;
async function generatePersona(settings, concept, images = []) {
	const trimmed = concept.trim();
	const pictures = images.filter(Boolean);
	if (trimmed.length < 8 && pictures.length === 0) throw new Error("Describe the persona in a sentence or two, or add a portrait.");
	const conceptText = trimmed.length >= 8 ? trimmed : "No written concept. Take the look from the portrait and build a persona to match.";
	const messages = [{
		role: "system",
		content: pictures.length ? `${PERSONA_SYSTEM}\n${VISION}` : PERSONA_SYSTEM
	}, {
		role: "user",
		content: withPictures(`Write a persona from this concept:\n${conceptText}\n\n${cardSchemaHint()}`, pictures)
	}];
	const raw = await complete(settings, messages);
	try {
		return {
			...cardFromUnknown(extractJson(raw), EMPTY_CARD),
			first_mes: "",
			alternate_greetings: []
		};
	} catch (error) {
		messages.push({
			role: "assistant",
			content: raw
		});
		messages.push({
			role: "user",
			content: "That was not valid JSON. Reply again with only the JSON object, no fences."
		});
		const again = await complete(settings, messages);
		try {
			return {
				...cardFromUnknown(extractJson(again), EMPTY_CARD),
				first_mes: "",
				alternate_greetings: []
			};
		} catch {
			throw error instanceof Error ? error : /* @__PURE__ */ new Error("Could not read the persona.");
		}
	}
}
async function replyInCharacter(settings, messages) {
	const text = (await complete(settings, messages, Math.min(Math.max(settings.maxTokens, 200), 800))).trim();
	if (!text) throw new Error("KoboldCPP returned an empty reply.");
	return text;
}
var BUCKETS = /* @__PURE__ */ new Set([
	"cards",
	"personas",
	"presets",
	"media",
	"gallery",
	"lore",
	"world",
	"chats"
]);
var DB_NAME$2 = "cardwright-vault";
var STORE$2 = "records";
var mode = null;
var folderHandle$1 = null;
var desktopPath = "";
var allowLibrarySync = false;
function isRecord$3(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function vaultKey(raw) {
	const key = raw.trim().replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 120);
	if (/^[A-Za-z0-9]/.test(key)) return key;
	return `k${key || "item"}`.slice(0, 120);
}
function armLibrarySync() {
	allowLibrarySync = true;
}
function disarmLibrarySync() {
	allowLibrarySync = false;
}
function openDb$2() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME$2, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE$2)) db.createObjectStore(STORE$2);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not open the library."));
	});
}
function withStore$1(access, run) {
	return openDb$2().then((db) => new Promise((resolve, reject) => {
		const tx = db.transaction(STORE$2, access);
		const result = run(tx.objectStore(STORE$2));
		if (result instanceof Promise) {
			result.then(resolve, reject);
			tx.oncomplete = () => db.close();
			tx.onerror = () => {
				db.close();
				reject(tx.error ?? /* @__PURE__ */ new Error("Could not update the library."));
			};
			return;
		}
		result.onsuccess = () => resolve(result.result);
		result.onerror = () => reject(result.error ?? /* @__PURE__ */ new Error("Could not update the library."));
		tx.oncomplete = () => db.close();
		tx.onerror = () => {
			db.close();
			reject(tx.error ?? /* @__PURE__ */ new Error("Could not update the library."));
		};
	}));
}
function recordKey(bucket, id) {
	return `${bucket}/${vaultKey(id)}`;
}
function envelopeOf(id, value) {
	const record = isRecord$3(value) ? value : {};
	const name = typeof record.name === "string" && record.name.trim() ? record.name.trim() : id;
	const updatedAt = typeof record.updatedAt === "number" ? record.updatedAt : Date.now();
	return {
		id: vaultKey(id),
		name,
		updatedAt,
		body: value
	};
}
async function idbPut(bucket, id, value) {
	const envelope = envelopeOf(id, value);
	await withStore$1("readwrite", (store) => store.put(envelope, recordKey(bucket, id)));
}
async function idbGet(bucket, id) {
	const value = await withStore$1("readonly", (store) => store.get(recordKey(bucket, id)));
	if (!value || !isRecord$3(value) || !("body" in value)) return value ?? null;
	return value.body ?? null;
}
async function idbDelete(bucket, id) {
	await withStore$1("readwrite", (store) => store.delete(recordKey(bucket, id)));
}
async function idbList(bucket) {
	const db = await openDb$2();
	const prefix = `${bucket}/`;
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE$2, "readonly");
		const request = tx.objectStore(STORE$2).openCursor();
		const heads = [];
		request.onsuccess = () => {
			const cursor = request.result;
			if (!cursor) return;
			if (typeof cursor.key === "string" && cursor.key.startsWith(prefix)) {
				const envelope = cursor.value;
				heads.push({
					id: envelope?.id || cursor.key.slice(prefix.length),
					name: envelope?.name || cursor.key.slice(prefix.length),
					updatedAt: envelope?.updatedAt || 0
				});
			}
			cursor.continue();
		};
		request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not read the library."));
		tx.oncomplete = () => {
			db.close();
			resolve(heads.sort((a, b) => b.updatedAt - a.updatedAt));
		};
		tx.onerror = () => {
			db.close();
			reject(tx.error ?? /* @__PURE__ */ new Error("Could not read the library."));
		};
	});
}
async function desktopSend(path, init) {
	const response = await fetch(path, init);
	const text = await response.text();
	const payload = text ? JSON.parse(text) : {};
	if (!response.ok) {
		const message = isRecord$3(payload) && typeof payload.message === "string" ? payload.message : "Could not update the library folder.";
		throw new Error(message);
	}
	return payload;
}
async function ensureMode() {
	if (mode) return mode;
	return (await vaultInfo()).mode;
}
async function vaultInfo() {
	if (await isDesktopHost()) {
		desktopPath = (await desktopSend("/__vault/info")).path || "Cardwright library";
		mode = "desktop";
		folderHandle$1 = null;
		return {
			mode: "desktop",
			label: desktopPath,
			detail: "Cards, personas, presets, and pictures are files in this folder."
		};
	}
	const saved = await withStore$1("readonly", (store) => store.get("meta/dir")).catch(() => void 0);
	if (saved && typeof saved.queryPermission === "function") {
		if (await saved.queryPermission({ mode: "readwrite" }).catch(() => "prompt") === "granted") {
			folderHandle$1 = saved;
			mode = "folder";
			return {
				mode: "folder",
				label: saved.name,
				detail: "Cards and pictures are files in the folder you chose."
			};
		}
	}
	mode = "idb";
	folderHandle$1 = null;
	return {
		mode: "idb",
		label: "This browser",
		detail: "This preview keeps the library in the browser. The Windows app can save it in a folder you choose."
	};
}
async function chooseVaultFolder() {
	if (await isDesktopHost()) {
		const payload = await desktopSend("/__vault/choose", { method: "POST" });
		if (payload.cancelled || !payload.path) return null;
		desktopPath = payload.path;
		mode = "desktop";
		return {
			mode: "desktop",
			label: payload.path,
			detail: "Cards, personas, presets, and pictures are files in this folder."
		};
	}
	const choose = window.showDirectoryPicker;
	if (typeof choose !== "function") throw new Error("Choosing a folder is in the Windows app. This preview keeps cards and pictures in the browser.");
	try {
		const handle = await choose({ mode: "readwrite" });
		await copyIdbIntoFolder(handle);
		await withStore$1("readwrite", (store) => store.put(handle, "meta/dir"));
		folderHandle$1 = handle;
		mode = "folder";
		return {
			mode: "folder",
			label: handle.name,
			detail: "Cards and pictures are files in the folder you chose."
		};
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") return null;
		throw error instanceof Error ? error : /* @__PURE__ */ new Error("Could not use that folder.");
	}
}
async function bucketDir(bucket) {
	if (!folderHandle$1) throw new Error("No library folder is open.");
	return folderHandle$1.getDirectoryHandle(bucket, { create: true });
}
async function folderPut(bucket, id, value) {
	const writable = await (await (await bucketDir(bucket)).getFileHandle(`${vaultKey(id)}.json`, { create: true })).createWritable();
	await writable.write(JSON.stringify(envelopeOf(id, value)));
	await writable.close();
}
async function folderGet(bucket, id) {
	try {
		const file = await (await (await bucketDir(bucket)).getFileHandle(`${vaultKey(id)}.json`)).getFile();
		return JSON.parse(await file.text()).body ?? null;
	} catch {
		return null;
	}
}
async function folderDelete(bucket, id) {
	await (await bucketDir(bucket)).removeEntry?.(`${vaultKey(id)}.json`);
}
async function folderList(bucket) {
	const heads = [];
	try {
		const dir = await bucketDir(bucket);
		for await (const entry of dir.values()) {
			if (entry.kind !== "file" || !entry.name.endsWith(".json")) continue;
			try {
				if (!entry.getFile) continue;
				const file = await entry.getFile();
				const parsed = JSON.parse(await file.text());
				heads.push({
					id: parsed.id || entry.name.replace(/\.json$/, ""),
					name: parsed.name || entry.name,
					updatedAt: parsed.updatedAt || 0
				});
			} catch {}
		}
	} catch {
		return [];
	}
	return heads.sort((a, b) => b.updatedAt - a.updatedAt);
}
async function copyIdbIntoFolder(handle) {
	const previous = folderHandle$1;
	folderHandle$1 = handle;
	try {
		for (const bucket of BUCKETS) {
			const heads = await idbList(bucket);
			for (const head of heads) {
				const body = await idbGet(bucket, head.id);
				if (body !== null) await folderPut(bucket, head.id, body);
			}
		}
	} finally {
		folderHandle$1 = previous;
	}
}
function assertBucket(bucket) {
	if (!BUCKETS.has(bucket)) throw new Error("Unknown library.");
}
async function vaultPut(bucket, id, value) {
	assertBucket(bucket);
	const current = await ensureMode();
	if (current === "desktop") {
		await desktopSend(`/__vault/entry?bucket=${bucket}&id=${encodeURIComponent(vaultKey(id))}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(envelopeOf(id, value))
		});
		return;
	}
	if (current === "folder") {
		await folderPut(bucket, id, value);
		return;
	}
	await idbPut(bucket, id, value);
}
async function vaultGet(bucket, id) {
	assertBucket(bucket);
	const current = await ensureMode();
	if (current === "desktop") {
		const payload = await desktopSend(`/__vault/entry?bucket=${bucket}&id=${encodeURIComponent(vaultKey(id))}`);
		if (payload.missing) return null;
		return payload.body ?? null;
	}
	if (current === "folder") return folderGet(bucket, id);
	return idbGet(bucket, id);
}
async function vaultDelete(bucket, id) {
	assertBucket(bucket);
	const current = await ensureMode();
	if (current === "desktop") {
		await desktopSend(`/__vault/entry?bucket=${bucket}&id=${encodeURIComponent(vaultKey(id))}`, { method: "DELETE" });
		return;
	}
	if (current === "folder") {
		await folderDelete(bucket, id);
		return;
	}
	await idbDelete(bucket, id);
}
async function vaultList(bucket) {
	assertBucket(bucket);
	const current = await ensureMode();
	if (current === "desktop") {
		const payload = await desktopSend(`/__vault/entries?bucket=${bucket}`);
		return Array.isArray(payload.entries) ? payload.entries : [];
	}
	if (current === "folder") return folderList(bucket);
	return idbList(bucket);
}
function asShelf(value, id) {
	if (!isRecord$3(value) || !isRecord$3(value.card)) return null;
	return {
		id: typeof value.id === "string" ? value.id : id,
		name: typeof value.name === "string" && value.name.trim() ? value.name : "Untitled",
		updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
		card: cardFromUnknown(value.card),
		revisions: revisionsFrom(value.revisions)
	};
}
function revisionsFrom(raw) {
	if (!Array.isArray(raw)) return [];
	const revisions = [];
	for (const entry of raw) {
		if (!isRecord$3(entry) || !isRecord$3(entry.card)) continue;
		revisions.push({
			version: typeof entry.version === "string" && entry.version.trim() ? entry.version.trim() : "1.0",
			savedAt: typeof entry.savedAt === "number" ? entry.savedAt : 0,
			card: cardFromUnknown(entry.card)
		});
	}
	return revisions.slice(-40);
}
async function loadShelf(bucket) {
	const heads = await vaultList(bucket);
	const items = [];
	for (const head of heads) {
		const item = asShelf(await vaultGet(bucket, head.id), head.id);
		if (item) items.push(item);
	}
	return items.sort((a, b) => b.updatedAt - a.updatedAt);
}
async function importMissingShelf(bucket, items) {
	if (items.length === 0) return;
	const heads = await vaultList(bucket);
	const have = new Set(heads.map((head) => head.id));
	for (const item of items) {
		if (have.has(item.id) || have.has(vaultKey(item.id))) continue;
		await vaultPut(bucket, item.id, item);
	}
}
async function syncShelf(bucket, items) {
	if (!allowLibrarySync) return;
	const heads = await vaultList(bucket);
	const ids = new Set(items.map((item) => item.id));
	for (const head of heads) if (!ids.has(head.id)) await vaultDelete(bucket, head.id);
	for (const item of items) await vaultPut(bucket, item.id, {
		...item,
		updatedAt: item.updatedAt || Date.now()
	});
}
function asPreset(value) {
	if (!isRecord$3(value) || typeof value.name !== "string" || !Array.isArray(value.sections)) return null;
	return value;
}
async function loadPresetList() {
	const heads = await vaultList("presets");
	const presets = [];
	for (const head of heads) {
		const body = asPreset(await vaultGet("presets", head.id));
		if (body) presets.push(body);
	}
	if (presets.length > 0) return presets.sort((a, b) => a.name.localeCompare(b.name));
	const starter = starterPreset();
	await vaultPut("presets", starter.id, {
		...starter,
		updatedAt: Date.now()
	});
	return [starter];
}
async function savePresetRecord(preset) {
	await vaultPut("presets", preset.id, {
		...preset,
		name: preset.name,
		updatedAt: Date.now()
	});
}
async function deletePresetRecord(id) {
	await vaultDelete("presets", id);
}
async function loadBookList(kind) {
	const bucket = kind === "world" ? "world" : "lore";
	const heads = await vaultList(bucket);
	const books = [];
	for (const head of heads) {
		const body = lorebookFromUnknown(await vaultGet(bucket, head.id), head.name);
		if (body) books.push({
			...body,
			id: body.id || head.id,
			kind
		});
	}
	return books.sort((a, b) => b.updatedAt - a.updatedAt);
}
async function saveBook(book) {
	await vaultPut(book.kind === "world" ? "world" : "lore", book.id, {
		...book,
		name: book.name,
		updatedAt: Date.now()
	});
}
async function deleteBook(kind, id) {
	await vaultDelete(kind === "world" ? "world" : "lore", id);
}
var EMPTY_MEDIA = {
	images: [],
	portraitId: null
};
var DB_NAME$1 = "cardwright-media";
var STORE$1 = "drafts";
var MAX_EDGE = 1024;
var MAX_FILES = 200;
var MAX_BYTES = 20971520;
function openDb$1() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME$1, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE$1)) db.createObjectStore(STORE$1);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not open picture storage."));
	});
}
function withStore(mode, run) {
	return openDb$1().then((db) => new Promise((resolve, reject) => {
		const tx = db.transaction(STORE$1, mode);
		const request = run(tx.objectStore(STORE$1));
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not save pictures."));
		tx.oncomplete = () => db.close();
		tx.onerror = () => {
			db.close();
			reject(tx.error ?? /* @__PURE__ */ new Error("Could not save pictures."));
		};
	}));
}
function normalizeMedia(value) {
	const images = value.images.filter((item) => item && typeof item.id === "string" && typeof item.dataUrl === "string").slice(0, MAX_FILES);
	return {
		images,
		portraitId: images.some((item) => item.id === value.portraitId) ? value.portraitId : images[0]?.id ?? null
	};
}
async function loadMedia(key) {
	try {
		const stored = await vaultGet("media", key);
		if (stored && Array.isArray(stored.images)) return normalizeMedia(stored);
	} catch {}
	try {
		const value = await withStore("readonly", (store) => store.get(key));
		if (!value || !Array.isArray(value.images)) return { ...EMPTY_MEDIA };
		const record = normalizeMedia(value);
		if (record.images.length > 0) vaultPut("media", key, record).catch(() => void 0);
		return record;
	} catch {
		return { ...EMPTY_MEDIA };
	}
}
async function saveMedia(key, media) {
	await vaultPut("media", key, normalizeMedia(media));
}
async function deleteMedia(key) {
	try {
		await vaultDelete("media", key);
	} catch {}
	try {
		await withStore("readwrite", (store) => store.delete(key));
	} catch {}
}
async function migrateLegacyMedia() {
	try {
		const keys = await withStore("readonly", (store) => store.getAllKeys());
		for (const key of keys) {
			if (typeof key !== "string") continue;
			const value = await withStore("readonly", (store) => store.get(key));
			if (!value || !Array.isArray(value.images) || value.images.length === 0) continue;
			const existing = await vaultGet("media", key).catch(() => null);
			if (existing && Array.isArray(existing.images) && existing.images.length > 0) continue;
			await vaultPut("media", key, normalizeMedia(value));
		}
	} catch {}
}
function loadHtmlImage$1(src) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that picture."));
		image.src = src;
	});
}
async function downscale(file) {
	const objectUrl = URL.createObjectURL(file);
	try {
		const image = await loadHtmlImage$1(objectUrl);
		const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
		const width = Math.max(1, Math.round(image.naturalWidth * scale));
		const height = Math.max(1, Math.round(image.naturalHeight * scale));
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Could not prepare that picture.");
		ctx.drawImage(image, 0, 0, width, height);
		const dataUrl = await blobToDataUrl(await new Promise((resolve, reject) => {
			canvas.toBlob((result) => result ? resolve(result) : reject(/* @__PURE__ */ new Error("Could not prepare that picture.")), "image/jpeg", .82);
		}));
		if (!dataUrl.startsWith("data:image/")) throw new Error("Could not prepare that picture.");
		return dataUrl;
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}
function blobToDataUrl(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not prepare that picture."));
		reader.readAsDataURL(blob);
	});
}
async function loadJson(key) {
	try {
		return await withStore("readonly", (store) => store.get(key)) ?? null;
	} catch {
		return null;
	}
}
async function saveJson(key, value) {
	await withStore("readwrite", (store) => store.put(value, key));
}
async function fileToImage(file) {
	if (!file.type.startsWith("image/")) throw new Error(`${file.name || "That file"} is not a picture.`);
	if (file.size > MAX_BYTES) throw new Error(`${file.name || "That picture"} is over 20 MB.`);
	return {
		id: crypto.randomUUID(),
		name: file.name || "reference",
		dataUrl: await downscale(file)
	};
}
function addImages(current, incoming) {
	const images = [...current.images];
	for (const image of incoming) {
		if (images.length >= MAX_FILES) break;
		images.push(image);
	}
	return {
		images,
		portraitId: current.portraitId && images.some((item) => item.id === current.portraitId) ? current.portraitId : images[0]?.id ?? null
	};
}
function removeImage(current, id) {
	const images = current.images.filter((item) => item.id !== id);
	return {
		images,
		portraitId: current.portraitId === id ? images[0]?.id ?? null : current.portraitId
	};
}
function placePortrait(current, image) {
	if (current.images.length < MAX_FILES) return {
		images: [...current.images, image],
		portraitId: image.id
	};
	return {
		images: [...current.portraitId ? current.images.filter((item) => item.id !== current.portraitId) : current.images.slice(1), image].slice(0, MAX_FILES),
		portraitId: image.id
	};
}
function portraitOf(media) {
	return media.images.find((item) => item.id === media.portraitId) ?? media.images[0] ?? null;
}
function ChatColors({ look, theme, name, onChange }) {
	const raw = {
		nameColor: look?.nameColor ?? "",
		dialogueColor: look?.dialogueColor ?? "",
		boxColor: look?.boxColor ?? ""
	};
	const current = lookOf(raw);
	const dialogue = current.dialogueColor || theme.dialogueDefault;
	function patch(key, value) {
		onChange({
			...raw,
			[key]: value
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Name color is the display name. Dialogue color is the text inside quotation marks. Box color is the message bubble. Gradients use CSS linear-gradient. Empty dialogue uses the default under Colors. Other empty fields use the theme."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
				label: "Name color",
				value: raw.nameColor,
				onChange: (value) => patch("nameColor", value),
				placeholder: "#e8b86d or linear-gradient(90deg, #e8b86d, #d4654a)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
				label: "Dialogue color",
				value: raw.dialogueColor,
				onChange: (value) => patch("dialogueColor", value),
				placeholder: "Empty uses the Colors default"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
				label: "Box color",
				value: raw.boxColor,
				onChange: (value) => patch("boxColor", value),
				placeholder: "Empty uses the chat paper"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-md bg-paper p-3 text-ink",
				style: boxPaint(current.boxColor),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					style: textPaint(current.nameColor, theme.ink),
					children: name.trim() || "Character"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm whitespace-pre-wrap",
					style: { color: theme.ink },
					children: splitDialogue("They look over. \"Stay close.\" *A lamp flickers.*").map((part, index) => part.kind === "talk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							...textPaint(dialogue, theme.ink),
							fontWeight: theme.boldDialogue ? 700 : 400
						},
						children: part.text
					}, index) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: part.kind === "act" ? "italic" : void 0,
						children: part.text
					}, index))
				})]
			})
		]
	});
}
function ColorRow({ label, value, placeholder, onChange }) {
	const hex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#d4654a";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-xs font-semibold tracking-wide text-muted uppercase",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mt-1 flex min-w-0 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				value: hex,
				"aria-label": `${label} swatch`,
				onChange: (event) => onChange(event.target.value),
				className: "size-11 shrink-0 rounded-md border border-border bg-bg"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value,
				placeholder,
				onChange: (event) => onChange(event.target.value),
				className: "min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg"
			})]
		})]
	});
}
var ENGLISH_WORDS = "the\nof\nand\nto\na\nin\nfor\nis\non\nthat\nby\nthis\nwith\ni\nyou\nit\nnot\nor\nbe\nare\nfrom\nat\nas\nyour\nall\nhave\nnew\nmore\nan\nwas\nwe\nwill\nhome\ncan\nus\nabout\nif\npage\nmy\nhas\nsearch\nfree\nbut\nour\none\nother\ndo\nno\ninformation\ntime\nthey\nsite\nhe\nup\nmay\nwhat\nwhich\ntheir\nnews\nout\nuse\nany\nthere\nsee\nonly\nso\nhis\nwhen\ncontact\nhere\nbusiness\nwho\nweb\nalso\nnow\nhelp\nget\npm\nview\nonline\nc\ne\nfirst\nam\nbeen\nwould\nhow\nwere\nme\ns\nservices\nsome\nthese\nclick\nits\nlike\nservice\nx\nthan\nfind\nprice\ndate\nback\ntop\npeople\nhad\nlist\nname\njust\nover\nstate\nyear\nday\ninto\nemail\ntwo\nhealth\nn\nworld\nre\nnext\nused\ngo\nb\nwork\nlast\nmost\nproducts\nmusic\nbuy\ndata\nmake\nthem\nshould\nproduct\nsystem\npost\nher\ncity\nt\nadd\npolicy\nnumber\nsuch\nplease\navailable\ncopyright\nsupport\nmessage\nafter\nbest\nsoftware\nthen\njan\ngood\nvideo\nwell\nd\nwhere\ninfo\nrights\npublic\nbooks\nhigh\nschool\nthrough\nm\neach\nlinks\nshe\nreview\nyears\norder\nvery\nprivacy\nbook\nitems\ncompany\nr\nread\ngroup\nneed\nmany\nuser\nsaid\nde\ndoes\nset\nunder\ngeneral\nresearch\nuniversity\njanuary\nmail\nfull\nmap\nreviews\nprogram\nlife\nknow\ngames\nway\ndays\nmanagement\np\npart\ncould\ngreat\nunited\nhotel\nreal\nf\nitem\ninternational\ncenter\nebay\nmust\nstore\ntravel\ncomments\nmade\ndevelopment\nreport\noff\nmember\ndetails\nline\nterms\nbefore\nhotels\ndid\nsend\nright\ntype\nbecause\nlocal\nthose\nusing\nresults\noffice\neducation\nnational\ncar\ndesign\ntake\nposted\ninternet\naddress\ncommunity\nwithin\nstates\narea\nwant\nphone\ndvd\nshipping\nreserved\nsubject\nbetween\nforum\nfamily\nl\nlong\nbased\nw\ncode\nshow\no\neven\nblack\ncheck\nspecial\nprices\nwebsite\nindex\nbeing\nwomen\nmuch\nsign\nfile\nlink\nopen\ntoday\ntechnology\nsouth\ncase\nproject\nsame\npages\nuk\nversion\nsection\nown\nfound\nsports\nhouse\nrelated\nsecurity\nboth\ng\ncounty\namerican\nphoto\ngame\nmembers\npower\nwhile\ncare\nnetwork\ndown\ncomputer\nsystems\nthree\ntotal\nplace\nend\nfollowing\ndownload\nh\nhim\nwithout\nper\naccess\nthink\nnorth\nresources\ncurrent\nposts\nbig\nmedia\nlaw\ncontrol\nwater\nhistory\npictures\nsize\nart\npersonal\nsince\nincluding\nguide\nshop\ndirectory\nboard\nlocation\nchange\nwhite\ntext\nsmall\nrating\nrate\ngovernment\nchildren\nduring\nusa\nreturn\nstudents\nv\nshopping\naccount\ntimes\nsites\nlevel\ndigital\nprofile\nprevious\nform\nevents\nlove\nold\njohn\nmain\ncall\nhours\nimage\ndepartment\ntitle\ndescription\nnon\nk\ny\ninsurance\nanother\nwhy\nshall\nproperty\nclass\ncd\nstill\nmoney\nquality\nevery\nlisting\ncontent\ncountry\nprivate\nlittle\nvisit\nsave\ntools\nlow\nreply\ncustomer\ndecember\ncompare\nmovies\ninclude\ncollege\nvalue\narticle\nyork\nman\ncard\njobs\nprovide\nj\nfood\nsource\nauthor\ndifferent\npress\nu\nlearn\nsale\naround\nprint\ncourse\njob\ncanada\nprocess\nteen\nroom\nstock\ntraining\ntoo\ncredit\npoint\njoin\nscience\nmen\ncategories\nadvanced\nwest\nsales\nlook\nenglish\nleft\nteam\nestate\nbox\nconditions\nselect\nwindows\nphotos\ngay\nthread\nweek\ncategory\nnote\nlive\nlarge\ngallery\ntable\nregister\nhowever\njune\noctober\nnovember\nmarket\nlibrary\nreally\naction\nstart\nseries\nmodel\nfeatures\nair\nindustry\nplan\nhuman\nprovided\ntv\nyes\nrequired\nsecond\nhot\naccessories\ncost\nmovie\nforums\nmarch\nla\nseptember\nbetter\nsay\nquestions\njuly\nyahoo\ngoing\nmedical\ntest\nfriend\ncome\ndec\nserver\npc\nstudy\napplication\ncart\nstaff\narticles\nsan\nfeedback\nagain\nplay\nlooking\nissues\napril\nnever\nusers\ncomplete\nstreet\ntopic\ncomment\nfinancial\nthings\nworking\nagainst\nstandard\ntax\nperson\nbelow\nmobile\nless\ngot\nblog\nparty\npayment\nequipment\nlogin\nstudent\nlet\nprograms\noffers\nlegal\nabove\nrecent\npark\nstores\nside\nact\nproblem\nred\ngive\nmemory\nperformance\nsocial\nq\naugust\nquote\nlanguage\nstory\nsell\noptions\nexperience\nrates\ncreate\nkey\nbody\nyoung\namerica\nimportant\nfield\nfew\neast\npaper\nsingle\nii\nage\nactivities\nclub\nexample\ngirls\nadditional\npassword\nz\nlatest\nsomething\nroad\ngift\nquestion\nchanges\nnight\nca\nhard\ntexas\noct\npay\nfour\npoker\nstatus\nbrowse\nissue\nrange\nbuilding\nseller\ncourt\nfebruary\nalways\nresult\naudio\nlight\nwrite\nwar\nnov\noffer\nblue\ngroups\nal\neasy\ngiven\nfiles\nevent\nrelease\nanalysis\nrequest\nfax\nchina\nmaking\npicture\nneeds\npossible\nmight\nprofessional\nyet\nmonth\nmajor\nstar\nareas\nfuture\nspace\ncommittee\nhand\nsun\ncards\nproblems\nlondon\nwashington\nmeeting\nrss\nbecome\ninterest\nid\nchild\nkeep\nenter\ncalifornia\nshare\nsimilar\ngarden\nschools\nmillion\nadded\nreference\ncompanies\nlisted\nbaby\nlearning\nenergy\nrun\ndelivery\nnet\npopular\nterm\nfilm\nstories\nput\ncomputers\njournal\nreports\nco\ntry\nwelcome\ncentral\nimages\npresident\nnotice\noriginal\nhead\nradio\nuntil\ncell\ncolor\nself\ncouncil\naway\nincludes\ntrack\naustralia\ndiscussion\narchive\nonce\nothers\nentertainment\nagreement\nformat\nleast\nsociety\nmonths\nlog\nsafety\nfriends\nsure\nfaq\ntrade\nedition\ncars\nmessages\nmarketing\ntell\nfurther\nupdated\nassociation\nable\nhaving\nprovides\ndavid\nfun\nalready\ngreen\nstudies\nclose\ncommon\ndrive\nspecific\nseveral\ngold\nfeb\nliving\nsep\ncollection\ncalled\nshort\narts\nlot\nask\ndisplay\nlimited\npowered\nsolutions\nmeans\ndirector\ndaily\nbeach\npast\nnatural\nwhether\ndue\net\nelectronics\nfive\nupon\nperiod\nplanning\ndatabase\nsays\nofficial\nweather\nmar\nland\naverage\ndone\ntechnical\nwindow\nfrance\npro\nregion\nisland\nrecord\ndirect\nmicrosoft\nconference\nenvironment\nrecords\nst\ndistrict\ncalendar\ncosts\nstyle\nurl\nfront\nstatement\nupdate\nparts\naug\never\ndownloads\nearly\nmiles\nsound\nresource\npresent\napplications\neither\nago\ndocument\nword\nworks\nmaterial\nbill\napr\nwritten\ntalk\nfederal\nhosting\nrules\nfinal\nadult\ntickets\nthing\ncentre\nrequirements\nvia\ncheap\nkids\nfinance\ntrue\nminutes\nelse\nmark\nthird\nrock\ngifts\neurope\nreading\ntopics\nbad\nindividual\ntips\nplus\nauto\ncover\nusually\nedit\ntogether\nvideos\npercent\nfast\nfunction\nfact\nunit\ngetting\nglobal\ntech\nmeet\nfar\neconomic\nen\nplayer\nprojects\nlyrics\noften\nsubscribe\nsubmit\ngermany\namount\nwatch\nincluded\nfeel\nthough\nbank\nrisk\nthanks\neverything\ndeals\nvarious\nwords\nlinux\njul\nproduction\ncommercial\njames\nweight\ntown\nheart\nadvertising\nreceived\nchoose\ntreatment\nnewsletter\narchives\npoints\nknowledge\nmagazine\nerror\ncamera\njun\ngirl\ncurrently\nconstruction\ntoys\nregistered\nclear\ngolf\nreceive\ndomain\nmethods\nchapter\nmakes\nprotection\npolicies\nloan\nwide\nbeauty\nmanager\nindia\nposition\ntaken\nsort\nlistings\nmodels\nmichael\nknown\nhalf\ncases\nstep\nengineering\nflorida\nsimple\nquick\nnone\nwireless\nlicense\npaul\nfriday\nlake\nwhole\nannual\npublished\nlater\nbasic\nsony\nshows\ncorporate\ngoogle\nchurch\nmethod\npurchase\ncustomers\nactive\nresponse\npractice\nhardware\nfigure\nmaterials\nfire\nholiday\nchat\nenough\ndesigned\nalong\namong\ndeath\nwriting\nspeed\nhtml\ncountries\nloss\nface\nbrand\ndiscount\nhigher\neffects\ncreated\nremember\nstandards\noil\nbit\nyellow\npolitical\nincrease\nadvertise\nkingdom\nbase\nnear\nenvironmental\nthought\nstuff\nfrench\nstorage\noh\njapan\ndoing\nloans\nshoes\nentry\nstay\nnature\norders\navailability\nafrica\nsummary\nturn\nmean\ngrowth\nnotes\nagency\nking\nmonday\neuropean\nactivity\ncopy\nalthough\ndrug\npics\nwestern\nincome\nforce\ncash\nemployment\noverall\nbay\nriver\ncommission\nad\npackage\ncontents\nseen\nplayers\nengine\nport\nalbum\nregional\nstop\nsupplies\nstarted\nadministration\nbar\ninstitute\nviews\nplans\ndouble\ndog\nbuild\nscreen\nexchange\ntypes\nsoon\nsponsored\nlines\nelectronic\ncontinue\nacross\nbenefits\nneeded\nseason\napply\nsomeone\nheld\nny\nanything\nprinter\ncondition\neffective\nbelieve\norganization\neffect\nasked\neur\nmind\nsunday\nselection\ncasino\npdf\nlost\ntour\nmenu\nvolume\ncross\nanyone\nmortgage\nhope\nsilver\ncorporation\nwish\ninside\nsolution\nmature\nrole\nrather\nweeks\naddition\ncame\nsupply\nnothing\ncertain\nusr\nexecutive\nrunning\nlower\nnecessary\nunion\njewelry\naccording\ndc\nclothing\nmon\ncom\nparticular\nfine\nnames\nrobert\nhomepage\nhour\ngas\nskills\nsix\nbush\nislands\nadvice\ncareer\nmilitary\nrental\ndecision\nleave\nbritish\nteens\npre\nhuge\nsat\nwoman\nfacilities\nzip\nbid\nkind\nsellers\nmiddle\nmove\ncable\nopportunities\ntaking\nvalues\ndivision\ncoming\ntuesday\nobject\nlesbian\nappropriate\nmachine\nlogo\nlength\nactually\nnice\nscore\nstatistics\nclient\nok\nreturns\ncapital\nfollow\nsample\ninvestment\nsent\nshown\nsaturday\nchristmas\nengland\nculture\nband\nflash\nms\nlead\ngeorge\nchoice\nwent\nstarting\nregistration\nfri\nthursday\ncourses\nconsumer\nhi\nairport\nforeign\nartist\noutside\nfurniture\nlevels\nchannel\nletter\nmode\nphones\nideas\nwednesday\nstructure\nfund\nsummer\nallow\ndegree\ncontract\nbutton\nreleases\nwed\nhomes\nsuper\nmale\nmatter\ncustom\nvirginia\nalmost\ntook\nlocated\nmultiple\nasian\ndistribution\neditor\ninn\nindustrial\ncause\npotential\nsong\ncnet\nltd\nlos\nhp\nfocus\nlate\nfall\nfeatured\nidea\nrooms\nfemale\nresponsible\ninc\ncommunications\nwin\nassociated\nthomas\nprimary\ncancer\nnumbers\nreason\ntool\nbrowser\nspring\nfoundation\nanswer\nvoice\neg\nfriendly\nschedule\ndocuments\ncommunication\npurpose\nfeature\nbed\ncomes\npolice\neveryone\nindependent\nip\napproach\ncameras\nbrown\nphysical\noperating\nhill\nmaps\nmedicine\ndeal\nhold\nratings\nchicago\nforms\nglass\nhappy\ntue\nsmith\nwanted\ndeveloped\nthank\nsafe\nunique\nsurvey\nprior\ntelephone\nsport\nready\nfeed\nanimal\nsources\nmexico\npopulation\npa\nregular\nsecure\nnavigation\noperations\ntherefore\nsimply\nevidence\nstation\nchristian\nround\npaypal\nfavorite\nunderstand\noption\nmaster\nvalley\nrecently\nprobably\nthu\nrentals\nsea\nbuilt\npublications\nblood\ncut\nworldwide\nimprove\nconnection\npublisher\nhall\nlarger\nanti\nnetworks\nearth\nparents\nnokia\nimpact\ntransfer\nintroduction\nkitchen\nstrong\ntel\ncarolina\nwedding\nproperties\nhospital\nground\noverview\nship\naccommodation\nowners\ndisease\ntx\nexcellent\npaid\nitaly\nperfect\nhair\nopportunity\nkit\nclassic\nbasis\ncommand\ncities\nwilliam\nexpress\naward\ndistance\ntree\npeter\nassessment\nensure\nthus\nwall\nie\ninvolved\nel\nextra\nespecially\ninterface\npartners\nbudget\nrated\nguides\nsuccess\nmaximum\nma\noperation\nexisting\nquite\nselected\nboy\namazon\npatients\nrestaurants\nbeautiful\nwarning\nwine\nlocations\nhorse\nvote\nforward\nflowers\nstars\nsignificant\nlists\ntechnologies\nowner\nretail\nanimals\nuseful\ndirectly\nmanufacturer\nways\nest\nson\nproviding\nrule\nmac\nhousing\ntakes\niii\ngmt\nbring\ncatalog\nsearches\nmax\ntrying\nmother\nauthority\nconsidered\ntold\nxml\ntraffic\nprogramme\njoined\ninput\nstrategy\nfeet\nagent\nvalid\nbin\nmodern\nsenior\nireland\nteaching\ndoor\ngrand\ntesting\ntrial\ncharge\nunits\ninstead\ncanadian\ncool\nnormal\nwrote\nenterprise\nships\nentire\neducational\nmd\nleading\nmetal\npositive\nfl\nfitness\nchinese\nopinion\nmb\nasia\nfootball\nabstract\nuses\noutput\nfunds\nmr\ngreater\nlikely\ndevelop\nemployees\nartists\nalternative\nprocessing\nresponsibility\nresolution\njava\nguest\nseems\npublication\npass\nrelations\ntrust\nvan\ncontains\nsession\nmulti\nphotography\nrepublic\nfees\ncomponents\nvacation\ncentury\nacademic\nassistance\ncompleted\nskin\ngraphics\nindian\nprev\nads\nmary\nil\nexpected\nring\ngrade\ndating\npacific\nmountain\norganizations\npop\nfilter\nmailing\nvehicle\nlonger\nconsider\nint\nnorthern\nbehind\npanel\nfloor\ngerman\nbuying\nmatch\nproposed\ndefault\nrequire\niraq\nboys\noutdoor\ndeep\nmorning\notherwise\nallows\nrest\nprotein\nplant\nreported\nhit\ntransportation\nmm\npool\nmini\npolitics\npartner\ndisclaimer\nauthors\nboards\nfaculty\nparties\nfish\nmembership\nmission\neye\nstring\nsense\nmodified\npack\nreleased\nstage\ninternal\ngoods\nrecommended\nborn\nunless\nrichard\ndetailed\njapanese\nrace\napproved\nbackground\ntarget\nexcept\ncharacter\nusb\nmaintenance\nability\nmaybe\nfunctions\ned\nmoving\nbrands\nplaces\nphp\npretty\ntrademarks\nphentermine\nspain\nsouthern\nyourself\netc\nwinter\nbattery\nyouth\npressure\nsubmitted\nboston\ndebt\nkeywords\nmedium\ntelevision\ninterested\ncore\nbreak\npurposes\nthroughout\nsets\ndance\nwood\nmsn\nitself\ndefined\npapers\nplaying\nawards\nfee\nstudio\nreader\nvirtual\ndevice\nestablished\nanswers\nrent\nlas\nremote\ndark\nprogramming\nexternal\napple\nle\nregarding\ninstructions\nmin\noffered\ntheory\nenjoy\nremove\naid\nsurface\nminimum\nvisual\nhost\nvariety\nteachers\nisbn\nmartin\nmanual\nblock\nsubjects\nagents\nincreased\nrepair\nfair\ncivil\nsteel\nunderstanding\nsongs\nfixed\nwrong\nbeginning\nhands\nassociates\nfinally\naz\nupdates\ndesktop\nclasses\nparis\nohio\ngets\nsector\ncapacity\nrequires\njersey\nun\nfat\nfully\nfather\nelectric\nsaw\ninstruments\nquotes\nofficer\ndriver\nbusinesses\ndead\nrespect\nunknown\nspecified\nrestaurant\nmike\ntrip\npst\nworth\nmi\nprocedures\npoor\nteacher\neyes\nrelationship\nworkers\nfarm\ngeorgia\npeace\ntraditional\ncampus\ntom\nshowing\ncreative\ncoast\nbenefit\nprogress\nfunding\ndevices\nlord\ngrant\nsub\nagree\nfiction\nhear\nsometimes\nwatches\ncareers\nbeyond\ngoes\nfamilies\nled\nmuseum\nthemselves\nfan\ntransport\ninteresting\nblogs\nwife\nevaluation\naccepted\nformer\nimplementation\nten\nhits\nzone\ncomplex\nth\ncat\ngalleries\nreferences\ndie\npresented\njack\nflat\nflow\nagencies\nliterature\nrespective\nparent\nspanish\nmichigan\ncolumbia\nsetting\ndr\nscale\nstand\neconomy\nhighest\nhelpful\nmonthly\ncritical\nframe\nmusical\ndefinition\nsecretary\nangeles\nnetworking\npath\naustralian\nemployee\nchief\ngives\nkb\nbottom\nmagazines\npackages\ndetail\nfrancisco\nlaws\nchanged\npet\nheard\nbegin\nindividuals\ncolorado\nroyal\nclean\nswitch\nrussian\nlargest\nafrican\nguy\ntitles\nrelevant\nguidelines\njustice\nconnect\nbible\ndev\ncup\nbasket\napplied\nweekly\nvol\ninstallation\ndescribed\ndemand\npp\nsuite\nvegas\nna\nsquare\nchris\nattention\nadvance\nskip\ndiet\narmy\nauction\ngear\nlee\nos\ndifference\nallowed\ncorrect\ncharles\nnation\nselling\nlots\npiece\nsheet\nfirm\nseven\nolder\nillinois\nregulations\nelements\nspecies\njump\ncells\nmodule\nresort\nfacility\nrandom\npricing\ndvds\ncertificate\nminister\nmotion\nlooks\nfashion\ndirections\nvisitors\ndocumentation\nmonitor\ntrading\nforest\ncalls\nwhose\ncoverage\ncouple\ngiving\nchance\nvision\nball\nending\nclients\nactions\nlisten\ndiscuss\naccept\nautomotive\nnaked\ngoal\nsuccessful\nsold\nwind\ncommunities\nclinical\nsituation\nsciences\nmarkets\nlowest\nhighly\npublishing\nappear\nemergency\ndeveloping\nlives\ncurrency\nleather\ndetermine\ntemperature\npalm\nannouncements\npatient\nactual\nhistorical\nstone\nbob\ncommerce\nringtones\nperhaps\npersons\ndifficult\nscientific\nsatellite\nfit\ntests\nvillage\naccounts\namateur\nex\nmet\npain\nxbox\nparticularly\nfactors\ncoffee\nwww\nsettings\nbuyer\ncultural\nsteve\neasily\noral\nford\nposter\nedge\nfunctional\nroot\nau\nfi\nclosed\nholidays\nice\npink\nzealand\nbalance\nmonitoring\ngraduate\nreplies\nshot\nnc\narchitecture\ninitial\nlabel\nthinking\nscott\nllc\nsec\nrecommend\ncanon\nleague\nwaste\nminute\nbus\nprovider\noptional\ndictionary\ncold\naccounting\nmanufacturing\nsections\nchair\nfishing\neffort\nphase\nfields\nbag\nfantasy\npo\nletters\nmotor\nva\nprofessor\ncontext\ninstall\nshirt\napparel\ngenerally\ncontinued\nfoot\nmass\ncrime\ncount\nbreast\ntechniques\nibm\nrd\njohnson\nsc\nquickly\ndollars\nwebsites\nreligion\nclaim\ndriving\npermission\nsurgery\npatch\nheat\nwild\nmeasures\ngeneration\nkansas\nmiss\nchemical\ndoctor\ntask\nreduce\nbrought\nhimself\nnor\ncomponent\nenable\nexercise\nbug\nsanta\nmid\nguarantee\nleader\ndiamond\nisrael\nse\nprocesses\nsoft\nservers\nalone\nmeetings\nseconds\njones\narizona\nkeyword\ninterests\nflight\ncongress\nfuel\nusername\nwalk\nproduced\nitalian\npaperback\nclassifieds\nwait\nsupported\npocket\nsaint\nrose\nfreedom\nargument\ncompetition\ncreating\njim\ndrugs\njoint\npremium\nproviders\nfresh\ncharacters\nattorney\nupgrade\ndi\nfactor\ngrowing\nthousands\nkm\nstream\napartments\npick\nhearing\neastern\nauctions\ntherapy\nentries\ndates\ngenerated\nsigned\nupper\nadministrative\nserious\nprime\nsamsung\nlimit\nbegan\nlouis\nsteps\nerrors\nshops\ndel\nefforts\ninformed\nga\nac\nthoughts\ncreek\nft\nworked\nquantity\nurban\npractices\nsorted\nreporting\nessential\nmyself\ntours\nplatform\nload\naffiliate\nlabor\nimmediately\nadmin\nnursing\ndefense\nmachines\ndesignated\ntags\nheavy\ncovered\nrecovery\njoe\nguys\nintegrated\nconfiguration\nmerchant\ncomprehensive\nexpert\nuniversal\nprotect\ndrop\nsolid\ncds\npresentation\nlanguages\nbecame\norange\ncompliance\nvehicles\nprevent\ntheme\nrich\nim\ncampaign\nmarine\nimprovement\nvs\nguitar\nfinding\npennsylvania\nexamples\nipod\nsaying\nspirit\nar\nclaims\nchallenge\nmotorola\nacceptance\nstrategies\nmo\nseem\naffairs\ntouch\nintended\ntowards\nsa\ngoals\nhire\nelection\nsuggest\nbranch\ncharges\nserve\naffiliates\nreasons\nmagic\nmount\nsmart\ntalking\ngave\nones\nlatin\nmultimedia\nxp\navoid\ncertified\nmanage\ncorner\nrank\ncomputing\noregon\nelement\nbirth\nvirus\nabuse\ninteractive\nrequests\nseparate\nquarter\nprocedure\nleadership\ntables\ndefine\nracing\nreligious\nfacts\nbreakfast\nkong\ncolumn\nplants\nfaith\nchain\ndeveloper\nidentify\navenue\nmissing\ndied\napproximately\ndomestic\nsitemap\nrecommendations\nmoved\nhouston\nreach\ncomparison\nmental\nviewed\nmoment\nextended\nsequence\ninch\nattack\nsorry\ncenters\nopening\ndamage\nlab\nreserve\nrecipes\ncvs\ngamma\nplastic\nproduce\nsnow\nplaced\ntruth\ncounter\nfailure\nfollows\neu\nweekend\ndollar\ncamp\nontario\nautomatically\ndes\nminnesota\nfilms\nbridge\nnative\nfill\nwilliams\nmovement\nprinting\nbaseball\nowned\napproval\ndraft\nchart\nplayed\ncontacts\ncc\njesus\nreaders\nclubs\nlcd\nwa\njackson\nequal\nadventure\nmatching\noffering\nshirts\nprofit\nleaders\nposters\ninstitutions\nassistant\nvariable\nave\ndj\nadvertisement\nexpect\nparking\nheadlines\nyesterday\ncompared\ndetermined\nwholesale\nworkshop\nrussia\ngone\ncodes\nkinds\nextension\nseattle\nstatements\ngolden\ncompletely\nteams\nfort\ncm\nwi\nlighting\nsenate\nforces\nfunny\nbrother\ngene\nturned\nportable\ntried\nelectrical\napplicable\ndisc\nreturned\npattern\nct\nboat\nnamed\ntheatre\nlaser\nearlier\nmanufacturers\nsponsor\nclassical\nicon\nwarranty\ndedicated\nindiana\ndirection\nharry\nbasketball\nobjects\nends\ndelete\nevening\nassembly\nnuclear\ntaxes\nmouse\nsignal\ncriminal\nissued\nbrain\nsexual\nwisconsin\npowerful\ndream\nobtained\nfalse\nda\ncast\nflower\nfelt\npersonnel\npassed\nsupplied\nidentified\nfalls\npic\nsoul\naids\nopinions\npromote\nstated\nstats\nhawaii\nprofessionals\nappears\ncarry\nflag\ndecided\nnj\ncovers\nhr\nem\nadvantage\nhello\ndesigns\nmaintain\ntourism\npriority\nnewsletters\nadults\nclips\nsavings\niv\ngraphic\natom\npayments\nrw\nestimated\nbinding\nbrief\nended\nwinning\neight\nanonymous\niron\nstraight\nscript\nserved\nwants\nmiscellaneous\nprepared\nvoid\ndining\nalert\nintegration\natlanta\ndakota\ntag\ninterview\nmix\nframework\ndisk\ninstalled\nqueen\nvhs\ncredits\nclearly\nfix\nhandle\nsweet\ndesk\ncriteria\npubmed\ndave\nmassachusetts\ndiego\nhong\nvice\nassociate\nne\ntruck\nbehavior\nenlarge\nray\nfrequently\nrevenue\nmeasure\nchanging\nvotes\ndu\nduty\nlooked\ndiscussions\nbear\ngain\nfestival\nlaboratory\nocean\nflights\nexperts\nsigns\nlack\ndepth\niowa\nwhatever\nlogged\nlaptop\nvintage\ntrain\nexactly\ndry\nexplore\nmaryland\nspa\nconcept\nnearly\neligible\ncheckout\nreality\nforgot\nhandling\norigin\nknew\ngaming\nfeeds\nbillion\ndestination\nscotland\nfaster\nintelligence\ndallas\nbought\ncon\nups\nnations\nroute\nfollowed\nspecifications\nbroken\ntripadvisor\nfrank\nalaska\nzoom\nblow\nbattle\nresidential\nanime\nspeak\ndecisions\nindustries\nprotocol\nquery\nclip\npartnership\neditorial\nnt\nexpression\nes\nequity\nprovisions\nspeech\nwire\nprinciples\nsuggestions\nrural\nshared\nsounds\nreplacement\ntape\nstrategic\njudge\nspam\neconomics\nacid\nbytes\ncent\nforced\ncompatible\nfight\napartment\nheight\nnull\nzero\nspeaker\nfiled\ngb\nnetherlands\nobtain\nbc\nconsulting\nrecreation\noffices\ndesigner\nremain\nmanaged\npr\nfailed\nmarriage\nroll\nkorea\nbanks\nfr\nparticipants\nsecret\nbath\naa\nkelly\nleads\nnegative\naustin\nfavorites\ntoronto\ntheater\nsprings\nmissouri\nandrew\nvar\nperform\nhealthy\ntranslation\nestimates\nfont\nassets\ninjury\nmt\njoseph\nministry\ndrivers\nlawyer\nfigures\nmarried\nprotected\nproposal\nsharing\nphiladelphia\nportal\nwaiting\nbirthday\nbeta\nfail\ngratis\nbanking\nofficials\nbrian\ntoward\nwon\nslightly\nassist\nconduct\ncontained\nlingerie\nlegislation\ncalling\nparameters\njazz\nserving\nbags\nprofiles\nmiami\ncomics\nmatters\nhouses\ndoc\npostal\nrelationships\ntennessee\nwear\ncontrols\nbreaking\ncombined\nultimate\nwales\nrepresentative\nfrequency\nintroduced\nminor\nfinish\ndepartments\nresidents\nnoted\ndisplayed\nmom\nreduced\nphysics\nrare\nspent\nperformed\nextreme\nsamples\ndavis\ndaniel\nbars\nreviewed\nrow\noz\nforecast\nremoved\nhelps\nsingles\nadministrator\ncycle\namounts\ncontain\naccuracy\ndual\nrise\nusd\nsleep\nmg\nbird\npharmacy\nbrazil\ncreation\nstatic\nscene\nhunter\naddresses\nlady\ncrystal\nfamous\nwriter\nchairman\nviolence\nfans\noklahoma\nspeakers\ndrink\nacademy\ndynamic\ngender\neat\npermanent\nagriculture\ndell\ncleaning\nconstitutes\nportfolio\npractical\ndelivered\ncollectibles\ninfrastructure\nexclusive\nseat\nconcerns\nvendor\noriginally\nintel\nutilities\nphilosophy\nregulation\nofficers\nreduction\naim\nbids\nreferred\nsupports\nnutrition\nrecording\nregions\njunior\ntoll\nles\ncape\nann\nrings\nmeaning\ntip\nsecondary\nwonderful\nmine\nladies\nhenry\nticket\nannounced\nguess\nagreed\nprevention\nwhom\nski\nsoccer\nmath\nimport\nposting\npresence\ninstant\nmentioned\nautomatic\nhealthcare\nviewing\nmaintained\nch\nincreasing\nmajority\nconnected\nchrist\ndan\ndogs\nsd\ndirectors\naspects\naustria\nahead\nmoon\nparticipation\nscheme\nutility\npreview\nfly\nmanner\nmatrix\ncontaining\ncombination\ndevel\namendment\ndespite\nstrength\nguaranteed\nturkey\nlibraries\nproper\ndistributed\ndegrees\nsingapore\nenterprises\ndelta\nfear\nseeking\ninches\nphoenix\nrs\nconvention\nshares\nprincipal\ndaughter\nstanding\ncomfort\ncolors\nwars\ncisco\nordering\nkept\nalpha\nappeal\ncruise\nbonus\ncertification\npreviously\nhey\nbookmark\nbuildings\nspecials\nbeat\ndisney\nhousehold\nbatteries\nadobe\nsmoking\nbbc\nbecomes\ndrives\narms\nalabama\ntea\nimproved\ntrees\navg\nachieve\npositions\ndress\nsubscription\ndealer\ncontemporary\nsky\nutah\nnearby\nrom\ncarried\nhappen\nexposure\npanasonic\nhide\npermalink\nsignature\ngambling\nrefer\nmiller\nprovision\noutdoors\nclothes\ncaused\nluxury\nbabes\nframes\ncertainly\nindeed\nnewspaper\ntoy\ncircuit\nlayer\nprinted\nslow\nremoval\neasier\nsrc\nliability\ntrademark\nhip\nprinters\nfaqs\nnine\nadding\nkentucky\nmostly\neric\nspot\ntaylor\ntrackback\nprints\nspend\nfactory\ninterior\nrevised\ngrow\namericans\noptical\npromotion\nrelative\namazing\nclock\ndot\nhiv\nidentity\nsuites\nconversion\nfeeling\nhidden\nreasonable\nvictoria\nserial\nrelief\nrevision\nbroadband\ninfluence\nratio\npda\nimportance\nrain\nonto\ndsl\nplanet\nwebmaster\ncopies\nrecipe\nzum\npermit\nseeing\nproof\ndna\ndiff\ntennis\nbass\nprescription\nbedroom\nempty\ninstance\nhole\npets\nride\nlicensed\norlando\nspecifically\ntim\nbureau\nmaine\nsql\nrepresent\nconservation\npair\nideal\nspecs\nrecorded\ndon\npieces\nfinished\nparks\ndinner\nlawyers\nsydney\nstress\ncream\nss\nruns\ntrends\nyeah\ndiscover\nap\npatterns\nboxes\nlouisiana\nhills\njavascript\nfourth\nnm\nadvisor\nmn\nmarketplace\nnd\nevil\naware\nwilson\nshape\nevolution\nirish\ncertificates\nobjectives\nstations\nsuggested\ngps\nop\nremains\nacc\ngreatest\nfirms\nconcerned\neuro\noperator\nstructures\ngeneric\nencyclopedia\nusage\ncap\nink\ncharts\ncontinuing\nmixed\ncensus\ninterracial\npeak\ntn\ncompetitive\nexist\nwheel\ntransit\nsuppliers\nsalt\ncompact\npoetry\nlights\ntracking\nangel\nbell\nkeeping\npreparation\nattempt\nreceiving\nmatches\naccordance\nwidth\nnoise\nengines\nforget\narray\ndiscussed\naccurate\nstephen\nelizabeth\nclimate\nreservations\npin\nplaystation\nalcohol\ngreek\ninstruction\nmanaging\nannotation\nsister\nraw\ndifferences\nwalking\nexplain\nsmaller\nnewest\nestablish\ngnu\nhappened\nexpressed\njeff\nextent\nsharp\nlesbians\nben\nlane\nparagraph\nkill\nmathematics\naol\ncompensation\nce\nexport\nmanagers\naircraft\nmodules\nsweden\nconflict\nconducted\nversions\nemployer\noccur\npercentage\nknows\nmississippi\ndescribe\nconcern\nbackup\nrequested\ncitizens\nconnecticut\nheritage\npersonals\nimmediate\nholding\ntrouble\nspread\ncoach\nkevin\nagricultural\nexpand\nsupporting\naudience\nassigned\njordan\ncollections\nages\nparticipate\nplug\nspecialist\ncook\naffect\nvirgin\nexperienced\ninvestigation\nraised\nhat\ninstitution\ndirected\ndealers\nsearching\nsporting\nhelping\nperl\naffected\nlib\nbike\ntotally\nplate\nexpenses\nindicate\nblonde\nab\nproceedings\ntransmission\nanderson\nutc\ncharacteristics\nder\nlose\norganic\nseek\nexperiences\nalbums\ncheats\nextremely\nverzeichnis\ncontracts\nguests\nhosted\ndiseases\nconcerning\ndevelopers\nequivalent\nchemistry\ntony\nneighborhood\nnevada\nkits\nthailand\nvariables\nagenda\nanyway\ncontinues\ntracks\nadvisory\ncam\ncurriculum\nlogic\ntemplate\nprince\ncircle\nsoil\ngrants\nanywhere\npsychology\nresponses\natlantic\nwet\ncircumstances\nedward\ninvestor\nidentification\nram\nleaving\nwildlife\nappliances\nmatt\nelementary\ncooking\nspeaking\nsponsors\nfox\nunlimited\nrespond\nsizes\nplain\nexit\nentered\niran\narm\nkeys\nlaunch\nwave\nchecking\ncosta\nbelgium\nprintable\nholy\nacts\nguidance\nmesh\ntrail\nenforcement\nsymbol\ncrafts\nhighway\nbuddy\nhardcover\nobserved\ndean\nsetup\npoll\nbooking\nglossary\nfiscal\ncelebrity\nstyles\ndenver\nunix\nfilled\nbond\nchannels\nericsson\nappendix\nnotify\nblues\nchocolate\npub\nportion\nscope\nhampshire\nsupplier\ncables\ncotton\nbluetooth\ncontrolled\nrequirement\nauthorities\nbiology\ndental\nkilled\nborder\nancient\ndebate\nrepresentatives\nstarts\npregnancy\ncauses\narkansas\nbiography\nleisure\nattractions\nlearned\ntransactions\nnotebook\nexplorer\nhistoric\nattached\nopened\ntm\nhusband\ndisabled\nauthorized\ncrazy\nupcoming\nbritain\nconcert\nretirement\nscores\nfinancing\nefficiency\nsp\ncomedy\nadopted\nefficient\nweblog\nlinear\ncommitment\nspecialty\nbears\njean\nhop\ncarrier\nedited\nconstant\nvisa\nmouth\njewish\nmeter\nlinked\nportland\ninterviews\nconcepts\nnh\ngun\nreflect\npure\ndeliver\nwonder\nlessons\nfruit\nbegins\nqualified\nreform\nlens\nalerts\ntreated\ndiscovery\ndraw\nmysql\nclassified\nrelating\nassume\nconfidence\nalliance\nfm\nconfirm\nwarm\nneither\nlewis\nhoward\noffline\nleaves\nengineer\nlifestyle\nconsistent\nreplace\nclearance\nconnections\ninventory\nconverter\norganisation\nbabe\nchecks\nreached\nbecoming\nsafari\nobjective\nindicated\nsugar\ncrew\nlegs\nsam\nstick\nsecurities\nallen\npdt\nrelation\nenabled\ngenre\nslide\nmontana\nvolunteer\ntested\nrear\ndemocratic\nenhance\nswitzerland\nexact\nbound\nparameter\nadapter\nprocessor\nnode\nformal\ndimensions\ncontribute\nlock\nhockey\nstorm\nmicro\ncolleges\nlaptops\nmile\nshowed\nchallenges\neditors\nmens\nthreads\nbowl\nsupreme\nbrothers\nrecognition\npresents\nref\ntank\nsubmission\ndolls\nestimate\nencourage\nnavy\nkid\nregulatory\ninspection\nconsumers\ncancel\nlimits\nterritory\ntransaction\nmanchester\nweapons\npaint\ndelay\npilot\noutlet\ncontributions\ncontinuous\ndb\nczech\nresulting\ncambridge\ninitiative\nnovel\npan\nexecution\ndisability\nincreases\nultra\nwinner\nidaho\ncontractor\nph\nepisode\nexamination\npotter\ndish\nplays\nbulletin\nia\npt\nindicates\nmodify\noxford\nadam\ntruly\nepinions\npainting\ncommitted\nextensive\naffordable\nuniverse\ncandidate\ndatabases\npatent\nslot\npsp\noutstanding\nha\neating\nperspective\nplanned\nwatching\nlodge\nmessenger\nmirror\ntournament\nconsideration\nds\ndiscounts\nsterling\nsessions\nkernel\nstocks\nbuyers\njournals\ngray\ncatalogue\nea\njennifer\nantonio\ncharged\nbroad\ntaiwan\nund\nchosen\ndemo\ngreece\nlg\nswiss\nsarah\nclark\nhate\nterminal\npublishers\nnights\nbehalf\ncaribbean\nliquid\nrice\nnebraska\nloop\nsalary\nreservation\nfoods\ngourmet\nguard\nproperly\norleans\nsaving\nnfl\nremaining\nempire\nresume\ntwenty\nnewly\nraise\nprepare\navatar\ngary\ndepending\nillegal\nexpansion\nvary\nhundreds\nrome\narab\nlincoln\nhelped\npremier\ntomorrow\npurchased\nmilk\ndecide\nconsent\ndrama\nvisiting\nperforming\ndowntown\nkeyboard\ncontest\ncollected\nnw\nbands\nboot\nsuitable\nff\nabsolutely\nmillions\nlunch\naudit\npush\nchamber\nguinea\nfindings\nmuscle\nfeaturing\niso\nimplement\nclicking\nscheduled\npolls\ntypical\ntower\nyours\nsum\nmisc\ncalculator\nsignificantly\nchicken\ntemporary\nattend\nshower\nalan\nsending\njason\ntonight\ndear\nsufficient\nholdem\nshell\nprovince\ncatholic\noak\nvat\nawareness\nvancouver\ngovernor\nbeer\nseemed\ncontribution\nmeasurement\nswimming\nspyware\nformula\nconstitution\npackaging\nsolar\njose\ncatch\njane\npakistan\nps\nreliable\nconsultation\nnorthwest\nsir\ndoubt\nearn\nfinder\nunable\nperiods\nclassroom\ntasks\ndemocracy\nattacks\nkim\nwallpaper\nmerchandise\nconst\nresistance\ndoors\nsymptoms\nresorts\nbiggest\nmemorial\nvisitor\ntwin\nforth\ninsert\nbaltimore\ngateway\nky\ndont\nalumni\ndrawing\ncandidates\ncharlotte\nordered\nbiological\nfighting\ntransition\nhappens\npreferences\nspy\nromance\ninstrument\nbruce\nsplit\nthemes\npowers\nheaven\nbr\nbits\npregnant\ntwice\nclassification\nfocused\negypt\nphysician\nhollywood\nbargain\nwikipedia\ncellular\nnorway\nvermont\nasking\nblocks\nnormally\nlo\nspiritual\nhunting\ndiabetes\nsuit\nml\nshift\nchip\nres\nsit\nbodies\nphotographs\ncutting\nwow\nsimon\nwriters\nmarks\nflexible\nloved\nmapping\nnumerous\nrelatively\nbirds\nsatisfaction\nrepresents\nchar\nindexed\npittsburgh\nsuperior\npreferred\nsaved\npaying\ncartoon\nshots\nintellectual\nmoore\ngranted\nchoices\ncarbon\nspending\ncomfortable\nmagnetic\ninteraction\nlistening\neffectively\nregistry\ncrisis\noutlook\nmassive\ndenmark\nemployed\nbright\ntreat\nheader\ncs\npoverty\nformed\npiano\necho\nque\ngrid\nsheets\npatrick\nexperimental\npuerto\nrevolution\nconsolidation\ndisplays\nplasma\nallowing\nearnings\nvoip\nmystery\nlandscape\ndependent\nmechanical\njourney\ndelaware\nbidding\nconsultants\nrisks\nbanner\napplicant\ncharter\nfig\nbarbara\ncooperation\ncounties\nacquisition\nports\nimplemented\nsf\ndirectories\nrecognized\ndreams\nblogger\nnotification\nkg\nlicensing\nstands\nteach\noccurred\ntextbooks\nrapid\npull\nhairy\ndiversity\ncleveland\nut\nreverse\ndeposit\nseminar\ninvestments\nlatina\nnasa\nwheels\nspecify\naccessibility\ndutch\nsensitive\ntemplates\nformats\ntab\ndepends\nboots\nholds\nrouter\nconcrete\nsi\nediting\npoland\nfolder\nwomens\ncss\ncompletion\nupload\npulse\nuniversities\ntechnique\ncontractors\nvoting\ncourts\nnotices\nsubscriptions\ncalculate\nmc\ndetroit\nalexander\nbroadcast\nconverted\nmetro\ntoshiba\nanniversary\nimprovements\nstrip\nspecification\npearl\naccident\nnick\naccessible\naccessory\nresident\nplot\nqty\npossibly\nairline\ntypically\nrepresentation\nregard\npump\nexists\narrangements\nsmooth\nconferences\nuniprotkb\nstrike\nconsumption\nbirmingham\nflashing\nlp\nnarrow\nafternoon\nthreat\nsurveys\nsitting\nputting\nconsultant\ncontroller\nownership\ncommittees\nlegislative\nresearchers\nvietnam\ntrailer\nanne\ncastle\ngardens\nmissed\nmalaysia\nunsubscribe\nantique\nlabels\nwilling\nbio\nmolecular\nacting\nheads\nstored\nexam\nlogos\nresidence\nattorneys\nantiques\ndensity\nhundred\nryan\noperators\nstrange\nsustainable\nphilippines\nstatistical\nbeds\nmention\ninnovation\npcs\nemployers\ngrey\nparallel\nhonda\namended\noperate\nbills\nbold\nbathroom\nstable\nopera\ndefinitions\nvon\ndoctors\nlesson\ncinema\nasset\nag\nscan\nelections\ndrinking\nreaction\nblank\nenhanced\nentitled\nsevere\ngenerate\nstainless\nnewspapers\nhospitals\nvi\ndeluxe\nhumor\naged\nmonitors\nexception\nlived\nduration\nbulk\nsuccessfully\nindonesia\npursuant\nsci\nfabric\nedt\nvisits\nprimarily\ntight\ndomains\ncapabilities\npmid\ncontrast\nrecommendation\nflying\nrecruitment\nsin\nberlin\ncute\norganized\nba\npara\nsiemens\nadoption\nimproving\ncr\nexpensive\nmeant\ncapture\npounds\nbuffalo\norganisations\nplane\npg\nexplained\nseed\nprogrammes\ndesire\nexpertise\nmechanism\ncamping\nee\njewellery\nmeets\nwelfare\npeer\ncaught\neventually\nmarked\ndriven\nmeasured\nmedline\nbottle\nagreements\nconsidering\ninnovative\nmarshall\nmassage\nrubber\nconclusion\nclosing\ntampa\nthousand\nmeat\nlegend\ngrace\nsusan\ning\nks\nadams\npython\nmonster\nalex\nbang\nvilla\nbone\ncolumns\ndisorders\nbugs\ncollaboration\nhamilton\ndetection\nftp\ncookies\ninner\nformation\ntutorial\nmed\nengineers\nentity\ncruises\ngate\nholder\nproposals\nmoderator\nsw\ntutorials\nsettlement\nportugal\nlawrence\nroman\nduties\nvaluable\ntone\ncollectables\nethics\nforever\ndragon\nbusy\ncaptain\nfantastic\nimagine\nbrings\nheating\nleg\nneck\nhd\nwing\ngovernments\npurchasing\nscripts\nabc\nstereo\nappointed\ntaste\ndealing\ncommit\ntiny\noperational\nrail\nairlines\nliberal\nlivecam\njay\ntrips\ngap\nsides\ntube\nturns\ncorresponding\ndescriptions\ncache\nbelt\njacket\ndetermination\nanimation\noracle\ner\nmatthew\nlease\nproductions\naviation\nhobbies\nproud\nexcess\ndisaster\nconsole\ncommands\njr\ntelecommunications\ninstructor\ngiant\nachieved\ninjuries\nshipped\nseats\napproaches\nbiz\nalarm\nvoltage\nanthony\nnintendo\nusual\nloading\nstamps\nappeared\nfranklin\nangle\nrob\nvinyl\nhighlights\nmining\ndesigners\nmelbourne\nongoing\nworst\nimaging\nbetting\nscientists\nliberty\nwyoming\nblackjack\nargentina\nera\nconvert\npossibility\nanalyst\ncommissioner\ndangerous\ngarage\nexciting\nreliability\nthongs\ngcc\nunfortunately\nrespectively\nvolunteers\nattachment\nringtone\nfinland\nmorgan\nderived\npleasure\nhonor\nasp\noriented\neagle\ndesktops\npants\ncolumbus\nnurse\nprayer\nappointment\nworkshops\nhurricane\nquiet\nluck\npostage\nproducer\nrepresented\nmortgages\ndial\nresponsibilities\ncheese\ncomic\ncarefully\njet\nproductivity\ninvestors\ncrown\npar\nunderground\ndiagnosis\nmaker\ncrack\nprinciple\npicks\nvacations\ngang\nsemester\ncalculated\nfetish\napplies\ncasinos\nappearance\nsmoke\napache\nfilters\nincorporated\nnv\ncraft\ncake\nnotebooks\napart\nfellow\nblind\nlounge\nmad\nalgorithm\nsemi\ncoins\nandy\ngross\nstrongly\ncafe\nvalentine\nhilton\nken\nproteins\nhorror\nsu\nexp\nfamiliar\ncapable\ndouglas\ndebian\ntill\ninvolving\npen\ninvesting\nchristopher\nadmission\nepson\nshoe\nelected\ncarrying\nvictory\nsand\nmadison\nterrorism\njoy\neditions\ncpu\nmainly\nethnic\nran\nparliament\nactor\nfinds\nseal\nsituations\nfifth\nallocated\ncitizen\nvertical\ncorrections\nstructural\nmunicipal\ndescribes\nprize\nsr\noccurs\njon\nabsolute\ndisabilities\nconsists\nanytime\nsubstance\nprohibited\naddressed\nlies\npipe\nsoldiers\nnr\nguardian\nlecture\nsimulation\nlayout\ninitiatives\nill\nconcentration\nclassics\nlbs\nlay\ninterpretation\nhorses\nlol\ndirty\ndeck\nwayne\ndonate\ntaught\nbankruptcy\nmp\nworker\noptimization\nalive\ntemple\nsubstances\nprove\ndiscovered\nwings\nbreaks\ngenetic\nrestrictions\nparticipating\nwaters\npromise\nthin\nexhibition\nprefer\nridge\ncabinet\nmodem\nharris\nmph\nbringing\nsick\ndose\nevaluate\ntiffany\ntropical\ncollect\nbet\ncomposition\ntoyota\nstreets\nnationwide\nvector\ndefinitely\nshaved\nturning\nbuffer\npurple\nexistence\ncommentary\nlarry\nlimousines\ndevelopments\ndef\nimmigration\ndestinations\nlets\nmutual\npipeline\nnecessarily\nsyntax\nli\nattribute\nprison\nskill\nchairs\nnl\neveryday\napparently\nsurrounding\nmountains\nmoves\npopularity\ninquiry\nethernet\nchecked\nexhibit\nthrow\ntrend\nsierra\nvisible\ncats\ndesert\npostposted\nya\noldest\nrhode\nnba\ncoordinator\nobviously\nmercury\nsteven\nhandbook\ngreg\nnavigate\nworse\nsummit\nvictims\nepa\nspaces\nfundamental\nburning\nescape\ncoupons\nsomewhat\nreceiver\nsubstantial\ntr\nprogressive\ncialis\nbb\nboats\nglance\nscottish\nchampionship\narcade\nrichmond\nsacramento\nimpossible\nron\nrussell\ntells\nobvious\nfiber\ndepression\ngraph\ncovering\nplatinum\njudgment\nbedrooms\ntalks\nfiling\nfoster\nmodeling\npassing\nawarded\ntestimonials\ntrials\ntissue\nnz\nmemorabilia\nclinton\nmasters\nbonds\ncartridge\nalberta\nexplanation\nfolk\norg\ncommons\ncincinnati\nsubsection\nfraud\nelectricity\npermitted\nspectrum\narrival\nokay\npottery\nemphasis\nroger\naspect\nworkplace\nawesome\nmexican\nconfirmed\ncounts\npriced\nwallpapers\nhist\ncrash\nlift\ndesired\ninter\ncloser\nassumes\nheights\nshadow\nriding\ninfection\nfirefox\nlisa\nexpense\ngrove\neligibility\nventure\nclinic\nkorean\nhealing\nprincess\nmall\nentering\npacket\nspray\nstudios\ninvolvement\ndad\nbuttons\nplacement\nobservations\nvbulletin\nfunded\nthompson\nwinners\nextend\nroads\nsubsequent\npat\ndublin\nrolling\nfell\nmotorcycle\nyard\ndisclosure\nestablishment\nmemories\nnelson\nte\narrived\ncreates\nfaces\ntourist\nav\nmayor\nmurder\nsean\nadequate\nsenator\nyield\npresentations\ngrades\ncartoons\npour\ndigest\nreg\nlodging\ntion\ndust\nhence\nwiki\nentirely\nreplaced\nradar\nrescue\nundergraduate\nlosses\ncombat\nreducing\nstopped\noccupation\nlakes\ndonations\nassociations\ncitysearch\nclosely\nradiation\ndiary\nseriously\nkings\nshooting\nkent\nadds\nnsw\near\nflags\npci\nbaker\nlaunched\nelsewhere\npollution\nconservative\nguestbook\nshock\neffectiveness\nwalls\nabroad\nebony\ntie\nward\ndrawn\narthur\nian\nvisited\nroof\nwalker\ndemonstrate\natmosphere\nsuggests\nkiss\nbeast\nra\noperated\nexperiment\ntargets\noverseas\npurchases\ndodge\ncounsel\nfederation\npizza\ninvited\nyards\nassignment\nchemicals\ngordon\nmod\nfarmers\nrc\nqueries\nbmw\nrush\nukraine\nabsence\nnearest\ncluster\nvendors\nmpeg\nwhereas\nyoga\nserves\nwoods\nsurprise\nlamp\nrico\npartial\nshoppers\nphil\neverybody\ncouples\nnashville\nranking\njokes\ncst\nhttp\nceo\nsimpson\ntwiki\nsublime\ncounseling\npalace\nacceptable\nsatisfied\nglad\nwins\nmeasurements\nverify\nglobe\ntrusted\ncopper\nmilwaukee\nrack\nmedication\nwarehouse\nshareware\nec\nrep\ndicke\nkerry\nreceipt\nsupposed\nordinary\nnobody\nghost\nviolation\nconfigure\nstability\nmit\napplying\nsouthwest\nboss\npride\ninstitutional\nexpectations\nindependence\nknowing\nreporter\nmetabolism\nkeith\nchampion\ncloudy\nlinda\nross\npersonally\nchile\nanna\nplenty\nsolo\nsentence\nthroat\nignore\nmaria\nuniform\nexcellence\nwealth\ntall\nrm\nsomewhere\nvacuum\ndancing\nattributes\nrecognize\nbrass\nwrites\nplaza\npdas\noutcomes\nsurvival\nquest\npublish\nsri\nscreening\ntoe\nthumbnail\ntrans\njonathan\nwhenever\nnova\nlifetime\napi\npioneer\nbooty\nforgotten\nacrobat\nplates\nacres\nvenue\nathletic\nthermal\nessays\nvital\ntelling\nfairly\ncoastal\nconfig\ncf\ncharity\nintelligent\nedinburgh\nvt\nexcel\nmodes\nobligation\ncampbell\nwake\nstupid\nharbor\nhungary\ntraveler\nurw\nsegment\nrealize\nregardless\nlan\nenemy\npuzzle\nrising\naluminum\nwells\nwishlist\nopens\ninsight\nsms\nrestricted\nrepublican\nsecrets\nlucky\nlatter\nmerchants\nthick\ntrailers\nrepeat\nsyndrome\nphilips\nattendance\npenalty\ndrum\nglasses\nenables\nnec\niraqi\nbuilder\nvista\njessica\nchips\nterry\nflood\nfoto\nease\narguments\namsterdam\narena\nadventures\npupils\nstewart\nannouncement\ntabs\noutcome\nappreciate\nexpanded\ncasual\ngrown\npolish\nlovely\nextras\ngm\ncentres\njerry\nclause\nsmile\nlands\nri\ntroops\nindoor\nbulgaria\narmed\nbroker\ncharger\nregularly\nbelieved\npine\ncooling\ntend\ngulf\nrt\nrick\ntrucks\ncp\nmechanisms\ndivorce\nlaura\nshopper\ntokyo\npartly\nnikon\ncustomize\ntradition\ncandy\npills\ntiger\ndonald\nfolks\nsensor\nexposed\ntelecom\nhunt\nangels\ndeputy\nindicators\nsealed\nthai\nemissions\nphysicians\nloaded\nfred\ncomplaint\nscenes\nexperiments\nafghanistan\ndd\nboost\nspanking\nscholarship\ngovernance\nmill\nfounded\nsupplements\nchronic\nicons\nmoral\nden\ncatering\naud\nfinger\nkeeps\npound\nlocate\ncamcorder\npl\ntrained\nburn\nimplementing\nroses\nlabs\nourselves\nbread\ntobacco\nwooden\nmotors\ntough\nroberts\nincident\ngonna\ndynamics\nlie\ncrm\nrf\nconversation\ndecrease\nchest\npension\nbilly\nrevenues\nemerging\nworship\ncapability\nak\nfe\ncraig\nherself\nproducing\nchurches\nprecision\ndamages\nreserves\ncontributed\nsolve\nshorts\nreproduction\nminority\ntd\ndiverse\namp\ningredients\nsb\nah\njohnny\nsole\nfranchise\nrecorder\ncomplaints\nfacing\nsm\nnancy\npromotions\ntones\npassion\nrehabilitation\nmaintaining\nsight\nlaid\nclay\ndefence\npatches\nweak\nrefund\nusc\ntowns\nenvironments\ntrembl\ndivided\nblvd\nreception\namd\nwise\nemails\ncyprus\nwv\nodds\ncorrectly\ninsider\nseminars\nconsequences\nmakers\nhearts\ngeography\nappearing\nintegrity\nworry\nns\ndiscrimination\neve\ncarter\nlegacy\nmarc\npleased\ndanger\nvitamin\nwidely\nprocessed\nphrase\ngenuine\nraising\nimplications\nfunctionality\nparadise\nhybrid\nreads\nroles\nintermediate\nemotional\nsons\nleaf\npad\nglory\nplatforms\nja\nbigger\nbilling\ndiesel\nversus\ncombine\novernight\ngeographic\nexceed\nbs\nrod\nsaudi\nfault\ncuba\nhrs\npreliminary\ndistricts\nintroduce\nsilk\npromotional\nkate\nchevrolet\nbabies\nbi\nkaren\ncompiled\nromantic\nrevealed\nspecialists\ngenerator\nalbert\nexamine\njimmy\ngraham\nsuspension\nbristol\nmargaret\ncompaq\nsad\ncorrection\nwolf\nslowly\nauthentication\ncommunicate\nrugby\nsupplement\nshowtimes\ncal\nportions\ninfant\npromoting\nsectors\nsamuel\nfluid\ngrounds\nfits\nkick\nregards\nmeal\nta\nhurt\nmachinery\nbandwidth\nunlike\nequation\nbaskets\nprobability\npot\ndimension\nwright\nimg\nbarry\nproven\nschedules\nadmissions\ncached\nwarren\nslip\nstudied\nreviewer\ninvolves\nquarterly\nrpm\nprofits\ndevil\ngrass\ncomply\nmarie\nflorist\nillustrated\ncherry\ncontinental\nalternate\ndeutsch\nachievement\nlimitations\nkenya\nwebcam\ncuts\nfuneral\nnutten\nearrings\nenjoyed\nautomated\nchapters\npee\ncharlie\nquebec\npassenger\nconvenient\ndennis\nmars\nfrancis\ntvs\nsized\nmanga\nnoticed\nsocket\nsilent\nliterary\negg\nmhz\nsignals\ncaps\norientation\npill\ntheft\nchildhood\nswing\nsymbols\nlat\nmeta\nhumans\nanalog\nfacial\nchoosing\ntalent\ndated\nflexibility\nseeker\nwisdom\nshoot\nboundary\nmint\npackard\noffset\npayday\nphilip\nelite\ngi\nspin\nholders\nbelieves\nswedish\npoems\ndeadline\njurisdiction\nrobot\ndisplaying\nwitness\ncollins\nequipped\nstages\nencouraged\nsur\nwinds\npowder\nbroadway\nacquired\nassess\nwash\ncartridges\nstones\nentrance\ngnome\nroots\ndeclaration\nlosing\nattempts\ngadgets\nnoble\nglasgow\nautomation\nimpacts\nrev\ngospel\nadvantages\nshore\nloves\ninduced\nll\nknight\npreparing\nloose\naims\nrecipient\nlinking\nextensions\nappeals\ncl\nearned\nillness\nislamic\nathletics\nsoutheast\nieee\nho\nalternatives\npending\nparker\ndetermining\nlebanon\ncorp\npersonalized\nkennedy\ngt\nsh\nconditioning\nteenage\nsoap\nae\ntriple\ncooper\nnyc\nvincent\njam\nsecured\nunusual\nanswered\npartnerships\ndestruction\nslots\nincreasingly\nmigration\ndisorder\nroutine\ntoolbar\nbasically\nrocks\nconventional\ntitans\napplicants\nwearing\naxis\nsought\ngenes\nmounted\nhabitat\nfirewall\nmedian\nguns\nscanner\nherein\noccupational\nanimated\njudicial\nrio\nhs\nadjustment\nhero\ninteger\ntreatments\nbachelor\nattitude\ncamcorders\nengaged\nfalling\nbasics\nmontreal\ncarpet\nrv\nstruct\nlenses\nbinary\ngenetics\nattended\ndifficulty\npunk\ncollective\ncoalition\npi\ndropped\nenrollment\nduke\nwalter\nai\npace\nbesides\nwage\nproducers\not\ncollector\narc\nhosts\ninterfaces\nadvertisers\nmoments\natlas\nstrings\ndawn\nrepresenting\nobservation\nfeels\ntorture\ncarl\ndeleted\ncoat\nmitchell\nmrs\nrica\nrestoration\nconvenience\nreturning\nralph\nopposition\ncontainer\nyr\ndefendant\nwarner\nconfirmation\napp\nembedded\ninkjet\nsupervisor\nwizard\ncorps\nactors\nliver\nperipherals\nliable\nbrochure\nmorris\nbestsellers\npetition\neminem\nrecall\nantenna\npicked\nassumed\ndeparture\nminneapolis\nbelief\nkilling\nbikini\nmemphis\nshoulder\ndecor\nlookup\ntexts\nharvard\nbrokers\nroy\nion\ndiameter\nottawa\ndoll\nic\npodcast\nseasons\nperu\ninteractions\nrefine\nbidder\nsinger\nevans\nherald\nliteracy\nfails\naging\nnike\nintervention\nfed\nplugin\nattraction\ndiving\ninvite\nmodification\nalice\nlatinas\nsuppose\ncustomized\nreed\ninvolve\nmoderate\nterror\nyounger\nthirty\nmice\nopposite\nunderstood\nrapidly\ndealtime\nban\ntemp\nintro\nmercedes\nzus\nassurance\nclerk\nhappening\nvast\nmills\noutline\namendments\ntramadol\nholland\nreceives\njeans\nmetropolitan\ncompilation\nverification\nfonts\nent\nodd\nwrap\nrefers\nmood\nfavor\nveterans\nquiz\nmx\nsigma\ngr\nattractive\nxhtml\noccasion\nrecordings\njefferson\nvictim\ndemands\nsleeping\ncareful\next\nbeam\ngardening\nobligations\narrive\norchestra\nsunset\ntracked\nmoreover\nminimal\npolyphonic\nlottery\ntops\nframed\naside\noutsourcing\nlicence\nadjustable\nallocation\nmichelle\nessay\ndiscipline\namy\nts\ndemonstrated\ndialogue\nidentifying\nalphabetical\ncamps\ndeclared\ndispatched\naaron\nhandheld\ntrace\ndisposal\nshut\nflorists\npacks\nge\ninstalling\nswitches\nromania\nvoluntary\nncaa\nthou\nconsult\nphd\ngreatly\nblogging\nmask\ncycling\nmidnight\nng\ncommonly\npe\nphotographer\ninform\nturkish\ncoal\ncry\nmessaging\npentium\nquantum\nmurray\nintent\ntt\nzoo\nlargely\npleasant\nannounce\nconstructed\nadditions\nrequiring\nspoke\naka\narrow\nengagement\nsampling\nrough\nweird\ntee\nrefinance\nlion\ninspired\nholes\nweddings\nblade\nsuddenly\noxygen\ncookie\nmeals\ncanyon\ngoto\nmeters\nmerely\ncalendars\narrangement\nconclusions\npasses\nbibliography\npointer\ncompatibility\nstretch\ndurham\nfurthermore\npermits\ncooperative\nmuslim\nxl\nneil\nsleeve\nnetscape\ncleaner\ncricket\nbeef\nfeeding\nstroke\ntownship\nrankings\nmeasuring\ncad\nhats\nrobin\nrobinson\njacksonville\nstrap\nheadquarters\nsharon\ncrowd\ntcp\ntransfers\nsurf\nolympic\ntransformation\nremained\nattachments\ndv\ndir\nentities\ncustoms\nadministrators\npersonality\nrainbow\nhook\nroulette\ndecline\ngloves\nisraeli\nmedicare\ncord\nskiing\ncloud\nfacilitate\nsubscriber\nvalve\nval\nhewlett\nexplains\nproceed\nflickr\nfeelings\nknife\njamaica\npriorities\nshelf\nbookstore\ntiming\nliked\nparenting\nadopt\ndenied\nfotos\nincredible\nbritney\nfreeware\ndonation\nouter\ncrop\ndeaths\nrivers\ncommonwealth\npharmaceutical\nmanhattan\ntales\nkatrina\nworkforce\nislam\nnodes\ntu\nfy\nthumbs\nseeds\ncited\nlite\nghz\nhub\ntargeted\norganizational\nskype\nrealized\ntwelve\nfounder\ndecade\ngamecube\nrr\ndispute\nportuguese\ntired\ntitten\nadverse\neverywhere\nexcerpt\neng\nsteam\ndischarge\nef\ndrinks\nace\nvoices\nacute\nhalloween\nclimbing\nstood\nsing\ntons\nperfume\ncarol\nhonest\nalbany\nhazardous\nrestore\nstack\nmethodology\nsomebody\nsue\nep\nhousewares\nreputation\nresistant\ndemocrats\nrecycling\nhang\ngbp\ncurve\ncreator\namber\nqualifications\nmuseums\ncoding\nslideshow\ntracker\nvariation\npassage\ntransferred\ntrunk\nhiking\nlb\npierre\njelsoft\nheadset\nphotograph\noakland\ncolombia\nwaves\ncamel\ndistributor\nlamps\nunderlying\nhood\nwrestling\nsuicide\narchived\nphotoshop\njp\nchi\nbt\narabia\ngathering\nprojection\njuice\nchase\nmathematical\nlogical\nsauce\nfame\nextract\nspecialized\ndiagnostic\npanama\nindianapolis\naf\npayable\ncorporations\ncourtesy\ncriticism\nautomobile\nconfidential\nrfc\nstatutory\naccommodations\nathens\nnortheast\ndownloaded\njudges\nsl\nseo\nretired\nisp\nremarks\ndetected\ndecades\npaintings\nwalked\narising\nnissan\nbracelet\nins\neggs\njuvenile\ninjection\nyorkshire\npopulations\nprotective\nafraid\nacoustic\nrailway\ncassette\ninitially\nindicator\npointed\nhb\njpg\ncausing\nmistake\nnorton\nlocked\neliminate\ntc\nfusion\nmineral\nsunglasses\nruby\nsteering\nbeads\nfortune\npreference\ncanvas\nthreshold\nparish\nclaimed\nscreens\ncemetery\nplanner\ncroatia\nflows\nstadium\nvenezuela\nexploration\nmins\nfewer\nsequences\ncoupon\nnurses\nssl\nstem\nproxy\nastronomy\nlanka\nopt\nedwards\ndrew\ncontests\nflu\ntranslate\nannounces\nmlb\ncostume\ntagged\nberkeley\nvoted\nkiller\nbikes\ngates\nadjusted\nrap\ntune\nbishop\npulled\ncorn\ngp\nshaped\ncompression\nseasonal\nestablishing\nfarmer\ncounters\nputs\nconstitutional\ngrew\nperfectly\ntin\nslave\ninstantly\ncultures\nnorfolk\ncoaching\nexamined\ntrek\nencoding\nlitigation\nsubmissions\noem\nheroes\npainted\nlycos\nir\nzdnet\nbroadcasting\nhorizontal\nartwork\ncosmetic\nresulted\nportrait\nterrorist\ninformational\nethical\ncarriers\necommerce\nmobility\nfloral\nbuilders\nties\nstruggle\nschemes\nsuffering\nneutral\nfisher\nrat\nspears\nprospective\nbedding\nultimately\njoining\nheading\nequally\nartificial\nbearing\nspectacular\ncoordination\nconnector\nbrad\ncombo\nseniors\nworlds\nguilty\naffiliated\nactivation\nnaturally\nhaven\ntablet\njury\ndos\ntail\nsubscribers\ncharm\nlawn\nviolent\nmitsubishi\nunderwear\nbasin\nsoup\npotentially\nranch\nconstraints\ncrossing\ninclusive\ndimensional\ncottage\ndrunk\nconsiderable\ncrimes\nresolved\nmozilla\nbyte\ntoner\nnose\nlatex\nbranches\nanymore\noclc\ndelhi\nholdings\nalien\nlocator\nselecting\nprocessors\npantyhose\nplc\nbroke\nnepal\nzimbabwe\ndifficulties\njuan\ncomplexity\nmsg\nconstantly\nbrowsing\nresolve\nbarcelona\npresidential\ndocumentary\ncod\nterritories\nmelissa\nmoscow\nthesis\nthru\njews\nnylon\npalestinian\ndiscs\nrocky\nbargains\nfrequent\ntrim\nnigeria\nceiling\npixels\nensuring\nhispanic\ncv\ncb\nlegislature\nhospitality\ngen\nanybody\nprocurement\ndiamonds\nespn\nfleet\nuntitled\nbunch\ntotals\nmarriott\nsinging\ntheoretical\nafford\nexercises\nstarring\nreferral\nnhl\nsurveillance\noptimal\nquit\ndistinct\nprotocols\nlung\nhighlight\nsubstitute\ninclusion\nhopefully\nbrilliant\nturner\nsucking\ncents\nreuters\nti\nfc\ngel\ntodd\nspoken\nomega\nevaluated\nstayed\ncivic\nassignments\nfw\nmanuals\ndoug\nsees\ntermination\nwatched\nsaver\nthereof\ngrill\nhouseholds\ngs\nredeem\nrogers\ngrain\naaa\nauthentic\nregime\nwanna\nwishes\nbull\nmontgomery\narchitectural\nlouisville\ndepend\ndiffer\nmacintosh\nmovements\nranging\nmonica\nrepairs\nbreath\namenities\nvirtually\ncole\nmart\ncandle\nhanging\ncolored\nauthorization\ntale\nverified\nlynn\nformerly\nprojector\nbp\nsituated\ncomparative\nstd\nseeks\nherbal\nloving\nstrictly\nrouting\ndocs\nstanley\npsychological\nsurprised\nretailer\nvitamins\nelegant\ngains\nrenewal\nvid\ngenealogy\nopposed\ndeemed\nscoring\nexpenditure\nbrooklyn\nliverpool\nsisters\ncritics\nconnectivity\nspots\noo\nalgorithms\nhacker\nmadrid\nsimilarly\nmargin\ncoin\nsolely\nfake\nsalon\ncollaborative\nnorman\nfda\nexcluding\nturbo\nheaded\nvoters\ncure\nmadonna\ncommander\narch\nni\nmurphy\nthinks\nthats\nsuggestion\nhdtv\nsoldier\nphillips\nasin\naimed\njustin\nbomb\nharm\ninterval\nmirrors\nspotlight\ntricks\nreset\nbrush\ninvestigate\nthy\nexpansys\npanels\nrepeated\nassault\nconnecting\nspare\nlogistics\ndeer\nkodak\ntongue\nbowling\ntri\ndanish\npal\nmonkey\nproportion\nfilename\nskirt\nflorence\ninvest\nhoney\num\nanalyzes\ndrawings\nsignificance\nscenario\nye\nfs\nlovers\natomic\napprox\nsymposium\narabic\ngauge\nessentials\njunction\nprotecting\nnn\nfaced\nmat\nrachel\nsolving\ntransmitted\nweekends\nscreenshots\nproduces\noven\nted\nintensive\nchains\nkingston\nsixth\nengage\ndeviant\nnoon\nswitching\nquoted\nadapters\ncorrespondence\nfarms\nimports\nsupervision\ncheat\nbronze\nexpenditures\nsandy\nseparation\ntestimony\nsuspect\ncelebrities\nmacro\nsender\nmandatory\nboundaries\ncrucial\nsyndication\ngym\ncelebration\nkde\nadjacent\nfiltering\ntuition\nspouse\nexotic\nviewer\nsignup\nthreats\nluxembourg\npuzzles\nreaching\nvb\ndamaged\ncams\nreceptor\nlaugh\njoel\nsurgical\ndestroy\ncitation\npitch\nautos\nyo\npremises\nperry\nproved\noffensive\nimperial\ndozen\nbenjamin\ndeployment\nteeth\ncloth\nstudying\ncolleagues\nstamp\nlotus\nsalmon\nolympus\nseparated\nproc\ncargo\ntan\ndirective\nfx\nsalem\nmate\ndl\nstarter\nupgrades\nlikes\nbutter\npepper\nweapon\nluggage\nburden\nchef\ntapes\nzones\nraces\nisle\nstylish\nslim\nmaple\nluke\ngrocery\noffshore\ngoverning\nretailers\ndepot\nkenneth\ncomp\nalt\npie\nblend\nharrison\nls\njulie\noccasionally\ncbs\nattending\nemission\npete\nspec\nfinest\nrealty\njanet\nbow\npenn\nrecruiting\napparent\ninstructional\nphpbb\nautumn\ntraveling\nprobe\nmidi\npermissions\nbiotechnology\ntoilet\nranked\njackets\nroutes\npacked\nexcited\noutreach\nhelen\nmounting\nrecover\ntied\nlopez\nbalanced\nprescribed\ncatherine\ntimely\ntalked\ndebug\ndelayed\nchuck\nreproduced\nhon\ndale\nexplicit\ncalculation\nvillas\nebook\nconsolidated\nexclude\npeeing\noccasions\nbrooks\nequations\nnewton\noils\nsept\nexceptional\nanxiety\nbingo\nwhilst\nspatial\nrespondents\nunto\nlt\nceramic\nprompt\nprecious\nminds\nannually\nconsiderations\nscanners\natm\nxanax\neq\npays\nfingers\nsunny\nebooks\ndelivers\nje\nqueensland\nnecklace\nmusicians\nleeds\ncomposite\nunavailable\ncedar\narranged\nlang\ntheaters\nadvocacy\nraleigh\nstud\nfold\nessentially\ndesigning\nthreaded\nuv\nqualify\nblair\nhopes\nassessments\ncms\nmason\ndiagram\nburns\npumps\nfootwear\nsg\nvic\nbeijing\npeoples\nvictor\nmario\npos\nattach\nlicenses\nutils\nremoving\nadvised\nbrunswick\nspider\nphys\nranges\npairs\nsensitivity\ntrails\npreservation\nhudson\nisolated\ncalgary\ninterim\nassisted\ndivine\nstreaming\napprove\nchose\ncompound\nintensity\ntechnological\nsyndicate\nabortion\ndialog\nvenues\nblast\nwellness\ncalcium\nnewport\nantivirus\naddressing\npole\ndiscounted\nindians\nshield\nharvest\nmembrane\nprague\npreviews\nbangladesh\nconstitute\nlocally\nconcluded\npickup\ndesperate\nmothers\nnascar\niceland\ndemonstration\ngovernmental\nmanufactured\ncandles\ngraduation\nmega\nbend\nsailing\nvariations\nmoms\nsacred\naddiction\nmorocco\nchrome\ntommy\nspringfield\nrefused\nbrake\nexterior\ngreeting\necology\noliver\ncongo\nglen\nbotswana\nnav\ndelays\nsynthesis\nolive\nundefined\nunemployment\ncyber\nverizon\nscored\nenhancement\nnewcastle\nclone\nvelocity\nlambda\nrelay\ncomposed\ntears\nperformances\noasis\nbaseline\ncab\nangry\nfa\nsocieties\nsilicon\nbrazilian\nidentical\npetroleum\ncompete\nist\nnorwegian\nlover\nbelong\nhonolulu\nbeatles\nlips\nretention\nexchanges\npond\nrolls\nthomson\nbarnes\nsoundtrack\nwondering\nmalta\ndaddy\nlc\nferry\nrabbit\nprofession\nseating\ndam\ncnn\nseparately\nphysiology\nlil\ncollecting\ndas\nexports\nomaha\ntire\nparticipant\nscholarships\nrecreational\ndominican\nchad\nelectron\nloads\nfriendship\nheather\npassport\nmotel\nunions\ntreasury\nwarrant\nsys\nsolaris\nfrozen\noccupied\njosh\nroyalty\nscales\nrally\nobserver\nsunshine\nstrain\ndrag\nceremony\nsomehow\narrested\nexpanding\nprovincial\ninvestigations\nicq\nripe\nyamaha\nrely\nmedications\nhebrew\ngained\nrochester\ndying\nlaundry\nstuck\nsolomon\nplacing\nstops\nhomework\nadjust\nassessed\nadvertiser\nenabling\nencryption\nfilling\ndownloadable\nsophisticated\nimposed\nsilence\nscsi\nfocuses\nsoviet\npossession\ncu\nlaboratories\ntreaty\nvocal\ntrainer\norgan\nstronger\nvolumes\nadvances\nvegetables\nlemon\ntoxic\ndns\nthumbnails\ndarkness\npty\nws\nnuts\nnail\nbizrate\nvienna\nimplied\nspan\nstanford\nsox\nstockings\njoke\nrespondent\npacking\nstatute\nrejected\nsatisfy\ndestroyed\nshelter\nchapel\ngamespot\nmanufacture\nlayers\nwordpress\nguided\nvulnerability\naccountability\ncelebrate\naccredited\nappliance\ncompressed\nbahamas\npowell\nmixture\nbench\nuniv\ntub\nrider\nscheduling\nradius\nperspectives\nmortality\nlogging\nhampton\nchristians\nborders\ntherapeutic\npads\nbutts\ninns\nbobby\nimpressive\nsheep\naccordingly\narchitect\nrailroad\nlectures\nchallenging\nwines\nnursery\nharder\ncups\nash\nmicrowave\ncheapest\naccidents\ntravesti\nrelocation\nstuart\ncontributors\nsalvador\nali\nsalad\nnp\nmonroe\ntender\nviolations\nfoam\ntemperatures\npaste\nclouds\ncompetitions\ndiscretion\ntft\ntanzania\npreserve\njvc\npoem\nunsigned\nstaying\ncosmetics\neaster\ntheories\nrepository\npraise\njeremy\nvenice\nconcentrations\nestonia\nchristianity\nveteran\nstreams\nlanding\nsigning\nexecuted\nkatie\nnegotiations\nrealistic\ndt\ncgi\nshowcase\nintegral\nasks\nrelax\nnamibia\ngenerating\nchristina\ncongressional\nsynopsis\nhardly\nprairie\nreunion\ncomposer\nbean\nsword\nabsent\nphotographic\nsells\necuador\nhoping\naccessed\nspirits\nmodifications\ncoral\npixel\nfloat\ncolin\nbias\nimported\npaths\nbubble\npor\nacquire\ncontrary\nmillennium\ntribune\nvessel\nacids\nfocusing\nviruses\ncheaper\nadmitted\ndairy\nadmit\nmem\nfancy\nequality\nsamoa\ngc\nachieving\ntap\nstickers\nfisheries\nexceptions\nreactions\nleasing\nlauren\nbeliefs\nci\nmacromedia\ncompanion\nsquad\nanalyze\nashley\nscroll\nrelate\ndivisions\nswim\nwages\nadditionally\nsuffer\nforests\nfellowship\nnano\ninvalid\nconcerts\nmartial\nmales\nvictorian\nretain\nexecute\ntunnel\ngenres\ncambodia\npatents\ncopyrights\nyn\nchaos\nlithuania\nmastercard\nwheat\nchronicles\nobtaining\nbeaver\nupdating\ndistribute\nreadings\ndecorative\nkijiji\nconfused\ncompiler\nenlargement\neagles\nbases\nvii\naccused\nbee\ncampaigns\nunity\nloud\nconjunction\nbride\nrats\ndefines\nairports\ninstances\nindigenous\nbegun\ncfr\nbrunette\npackets\nanchor\nsocks\nvalidation\nparade\ncorruption\nstat\ntrigger\nincentives\ncholesterol\ngathered\nessex\nslovenia\nnotified\ndifferential\nbeaches\nfolders\ndramatic\nsurfaces\nterrible\nrouters\ncruz\npendant\ndresses\nbaptist\nscientist\nstarsmerchant\nhiring\nclocks\narthritis\nbios\nfemales\nwallace\nnevertheless\nreflects\ntaxation\nfever\npmc\ncuisine\nsurely\npractitioners\ntranscript\nmyspace\ntheorem\ninflation\nthee\nnb\nruth\npray\nstylus\ncompounds\npope\ndrums\ncontracting\narnold\nstructured\nreasonably\njeep\nchicks\nbare\nhung\ncattle\nmba\nradical\ngraduates\nrover\nrecommends\ncontrolling\ntreasure\nreload\ndistributors\nflame\nlevitra\ntanks\nassuming\nmonetary\nelderly\npit\narlington\nmono\nparticles\nfloating\nextraordinary\ntile\nindicating\nbolivia\nspell\nhottest\nstevens\ncoordinate\nkuwait\nexclusively\nemily\nalleged\nlimitation\nwidescreen\ncompile\nwebster\nstruck\nrx\nillustration\nplymouth\nwarnings\nconstruct\napps\ninquiries\nbridal\nannex\nmag\ngsm\ninspiration\ntribal\ncurious\naffecting\nfreight\nrebate\nmeetup\neclipse\nsudan\nddr\ndownloading\nrec\nshuttle\naggregate\nstunning\ncycles\naffects\nforecasts\ndetect\nactively\nciao\nampland\nknee\nprep\npb\ncomplicated\nchem\nfastest\nbutler\nshopzilla\ninjured\ndecorating\npayroll\ncookbook\nexpressions\nton\ncourier\nuploaded\nshakespeare\nhints\ncollapse\namericas\nconnectors\nunlikely\noe\ngif\npros\nconflicts\ntechno\nbeverage\ntribute\nwired\nelvis\nimmune\nlatvia\ntravelers\nforestry\nbarriers\ncant\njd\nrarely\ngpl\ninfected\nofferings\nmartha\ngenesis\nbarrier\nargue\nincorrect\ntrains\nmetals\nbicycle\nfurnishings\nletting\narise\nguatemala\nceltic\nthereby\nirc\njamie\nparticle\nperception\nminerals\nadvise\nhumidity\nbottles\nboxing\nwy\ndm\nbangkok\nrenaissance\npathology\nsara\nbra\nordinance\nhughes\nphotographers\ninfections\njeffrey\nchess\noperates\nbrisbane\nconfigured\nsurvive\noscar\nfestivals\nmenus\njoan\npossibilities\nduck\nreveal\ncanal\namino\nphi\ncontributing\nherbs\nclinics\nmls\ncow\nmanitoba\nanalytical\nmissions\nwatson\nlying\ncostumes\nstrict\ndive\nsaddam\ncirculation\ndrill\noffense\nbryan\ncet\nprotest\nassumption\njerusalem\nhobby\ntries\ntransexuales\ninvention\nnickname\nfiji\ntechnician\ninline\nexecutives\nenquiries\nwashing\naudi\nstaffing\ncognitive\nexploring\ntrick\nenquiry\nclosure\nraid\nppc\ntimber\nvolt\nintense\ndiv\nplaylist\nregistrar\nshowers\nsupporters\nruling\nsteady\ndirt\nstatutes\nwithdrawal\nmyers\ndrops\npredicted\nwider\nsaskatchewan\njc\ncancellation\nplugins\nenrolled\nsensors\nscrew\nministers\npublicly\nhourly\nblame\ngeneva\nfreebsd\nveterinary\nacer\nprostores\nreseller\ndist\nhanded\nsuffered\nintake\ninformal\nrelevance\nincentive\nbutterfly\ntucson\nmechanics\nheavily\nswingers\nfifty\nheaders\nmistakes\nnumerical\nons\ngeek\nuncle\ndefining\ncounting\nreflection\nsink\naccompanied\nassure\ninvitation\ndevoted\nprinceton\njacob\nsodium\nrandy\nspirituality\nhormone\nmeanwhile\nproprietary\ntimothy\nchildrens\nbrick\ngrip\nnaval\nthumbzilla\nmedieval\nporcelain\navi\nbridges\npichunter\ncaptured\nwatt\nthehun\ndecent\ncasting\ndayton\ntranslated\nshortly\ncameron\ncolumnists\npins\ncarlos\nreno\ndonna\nandreas\nwarrior\ndiploma\ncabin\ninnocent\nscanning\nide\nconsensus\npolo\nvalium\ncopying\nrpg\ndelivering\ncordless\npatricia\nhorn\neddie\nuganda\nfired\njournalism\npd\nprot\ntrivia\nadidas\nperth\nfrog\ngrammar\nintention\nsyria\ndisagree\nklein\nharvey\ntires\nlogs\nundertaken\ntgp\nhazard\nretro\nleo\nstatewide\nsemiconductor\ngregory\nepisodes\nboolean\ncircular\nanger\ndiy\nmainland\nillustrations\nsuits\nchances\ninteract\nsnap\nhappiness\narg\nsubstantially\nbizarre\nglenn\nur\nauckland\nolympics\nfruits\nidentifier\ngeo\nribbon\ncalculations\ndoe\njpeg\nconducting\nstartup\nsuzuki\ntrinidad\nati\nkissing\nwal\nhandy\nswap\nexempt\ncrops\nreduces\naccomplished\ncalculators\ngeometry\nimpression\nabs\nslovakia\nflip\nguild\ncorrelation\ngorgeous\ncapitol\nsim\ndishes\nrna\nbarbados\nchrysler\nnervous\nrefuse\nextends\nfragrance\nmcdonald\nreplica\nplumbing\nbrussels\ntribe\nneighbors\ntrades\nsuperb\nbuzz\ntransparent\nnuke\nrid\ntrinity\ncharleston\nhandled\nlegends\nboom\ncalm\nchampions\nfloors\nselections\nprojectors\ninappropriate\nexhaust\ncomparing\nshanghai\nspeaks\nburton\nvocational\ndavidson\ncopied\nscotia\nfarming\ngibson\npharmacies\nfork\ntroy\nln\nroller\nintroducing\nbatch\norganize\nappreciated\nalter\nnicole\nlatino\nghana\nedges\nuc\nmixing\nhandles\nskilled\nfitted\nalbuquerque\nharmony\ndistinguished\nasthma\nprojected\nassumptions\nshareholders\ntwins\ndevelopmental\nrip\nzope\nregulated\ntriangle\namend\nanticipated\noriental\nreward\nwindsor\nzambia\ncompleting\ngmbh\nbuf\nld\nhydrogen\nwebshots\nsprint\ncomparable\nchick\nadvocate\nsims\nconfusion\ncopyrighted\ntray\ninputs\nwarranties\ngenome\nescorts\ndocumented\nthong\nmedal\npaperbacks\ncoaches\nvessels\nwalks\nsol\nkeyboards\nsage\nknives\neco\nvulnerable\narrange\nartistic\nbat\nhonors\nbooth\nindie\nreflected\nunified\nbones\nbreed\ndetector\nignored\npolar\nfallen\nprecise\nsussex\nrespiratory\nnotifications\nmsgid\ntransexual\nmainstream\ninvoice\nevaluating\nlip\nsubcommittee\nsap\ngather\nsuse\nmaternity\nbacked\nalfred\ncolonial\nmf\ncarey\nmotels\nforming\nembassy\ncave\njournalists\ndanny\nrebecca\nslight\nproceeds\nindirect\namongst\nwool\nfoundations\nmsgstr\narrest\nvolleyball\nmw\nadipex\nhorizon\nnu\ndeeply\ntoolbox\nict\nmarina\nliabilities\nprizes\nbosnia\nbrowsers\ndecreased\npatio\ndp\ntolerance\nsurfing\ncreativity\nlloyd\ndescribing\noptics\npursue\nlightning\novercome\neyed\nou\nquotations\ngrab\ninspector\nattract\nbrighton\nbeans\nbookmarks\nellis\ndisable\nsnake\nsucceed\nleonard\nlending\noops\nreminder\nxi\nsearched\nbehavioral\nriverside\nbathrooms\nplains\nsku\nht\nraymond\ninsights\nabilities\ninitiated\nsullivan\nza\nmidwest\nkaraoke\ntrap\nlonely\nfool\nve\nnonprofit\nlancaster\nsuspended\nhereby\nobserve\njulia\ncontainers\nattitudes\nkarl\nberry\ncollar\nsimultaneously\nracial\nintegrate\nbermuda\namanda\nsociology\nmobiles\nscreenshot\nexhibitions\nkelkoo\nconfident\nretrieved\nexhibits\nofficially\nconsortium\ndies\nterrace\nbacteria\npts\nreplied\nseafood\nnovels\nrh\nrrp\nrecipients\nought\ndelicious\ntraditions\nfg\njail\nsafely\nfinite\nkidney\nperiodically\nfixes\nsends\ndurable\nmazda\nallied\nthrows\nmoisture\nhungarian\nroster\nreferring\nsymantec\nspencer\nwichita\nnasdaq\nuruguay\nooo\nhz\ntransform\ntimer\ntablets\ntuning\ngotten\neducators\ntyler\nfutures\nvegetable\nverse\nhighs\nhumanities\nindependently\nwanting\ncustody\nscratch\nlaunches\nipaq\nalignment\nhenderson\nbk\nbritannica\ncomm\nellen\ncompetitors\nnhs\nrocket\naye\nbullet\ntowers\nracks\nlace\nnasty\nvisibility\nlatitude\nconsciousness\nste\ntumor\nugly\ndeposits\nbeverly\nmistress\nencounter\ntrustees\nwatts\nduncan\nreprints\nhart\nbernard\nresolutions\nment\naccessing\nforty\ntubes\nattempted\ncol\nmidlands\npriest\nfloyd\nronald\nanalysts\nqueue\ndx\nsk\ntrance\nlocale\nnicholas\nbiol\nyu\nbundle\nhammer\ninvasion\nwitnesses\nrunner\nrows\nadministered\nnotion\nsq\nskins\nmailed\noc\nfujitsu\nspelling\narctic\nexams\nrewards\nbeneath\nstrengthen\ndefend\naj\nfrederick\nmedicaid\ntreo\ninfrared\nseventh\ngods\nune\nwelsh\nbelly\naggressive\ntex\nadvertisements\nquarters\nstolen\ncia\nsublimedirectory\nsoonest\nhaiti\ndisturbed\ndetermines\nsculpture\npoly\nears\ndod\nwp\nfist\nnaturals\nneo\nmotivation\nlenders\npharmacology\nfitting\nfixtures\nbloggers\nmere\nagrees\npassengers\nquantities\npetersburg\nconsistently\npowerpoint\ncons\nsurplus\nelder\nsonic\nobituaries\ncheers\ndig\ntaxi\npunishment\nappreciation\nsubsequently\nom\nbelarus\nnat\nzoning\ngravity\nprovidence\nthumb\nrestriction\nincorporate\nbackgrounds\ntreasurer\nguitars\nessence\nflooring\nlightweight\nethiopia\ntp\nmighty\nathletes\nhumanity\ntranscription\njm\nholmes\ncomplications\nscholars\ndpi\nscripting\ngis\nremembered\ngalaxy\nchester\nsnapshot\ncaring\nloc\nworn\nsynthetic\nshaw\nvp\nsegments\ntestament\nexpo\ndominant\ntwist\nspecifics\nitunes\nstomach\npartially\nburied\ncn\nnewbie\nminimize\ndarwin\nranks\nwilderness\ndebut\ngenerations\ntournaments\nbradley\ndeny\nanatomy\nbali\njudy\nsponsorship\nheadphones\nfraction\ntrio\nproceeding\ncube\ndefects\nvolkswagen\nuncertainty\nbreakdown\nmilton\nmarker\nreconstruction\nsubsidiary\nstrengths\nclarity\nrugs\nsandra\nadelaide\nencouraging\nfurnished\nmonaco\nsettled\nfolding\nemirates\nterrorists\nairfare\ncomparisons\nbeneficial\ndistributions\nvaccine\nbelize\nfate\nviewpicture\npromised\nvolvo\npenny\nrobust\nbookings\nthreatened\nminolta\nrepublicans\ndiscusses\ngui\nporter\ngras\njungle\nver\nrn\nresponded\nrim\nabstracts\nzen\nivory\nalpine\ndis\nprediction\npharmaceuticals\nandale\nfabulous\nremix\nalias\nthesaurus\nindividually\nbattlefield\nliterally\nnewer\nkay\necological\nspice\noval\nimplies\ncg\nsoma\nser\ncooler\nappraisal\nconsisting\nmaritime\nperiodic\nsubmitting\noverhead\nascii\nprospect\nshipment\nbreeding\ncitations\ngeographical\ndonor\nmozambique\ntension\nhref\nbenz\ntrash\nshapes\nwifi\ntier\nfwd\nearl\nmanor\nenvelope\ndiane\nhomeland\ndisclaimers\nchampionships\nexcluded\nandrea\nbreeds\nrapids\ndisco\nsheffield\nbailey\naus\nendif\nfinishing\nemotions\nwellington\nincoming\nprospects\nlexmark\ncleaners\nbulgarian\nhwy\neternal\ncashiers\nguam\ncite\naboriginal\nremarkable\nrotation\nnam\npreventing\nproductive\nboulevard\neugene\nix\ngdp\npig\nmetric\ncompliant\nminus\npenalties\nbennett\nimagination\nhotmail\nrefurbished\njoshua\narmenia\nvaried\ngrande\nclosest\nactivated\nactress\nmess\nconferencing\nassign\narmstrong\npoliticians\ntrackbacks\nlit\naccommodate\ntigers\naurora\nuna\nslides\nmilan\npremiere\nlender\nvillages\nshade\nchorus\nchristine\nrhythm\ndigit\nargued\ndietary\nsymphony\nclarke\nsudden\naccepting\nprecipitation\nmarilyn\nlions\nfindlaw\nada\npools\ntb\nlyric\nclaire\nisolation\nspeeds\nsustained\nmatched\napproximate\nrope\ncarroll\nrational\nprogrammer\nfighters\nchambers\ndump\ngreetings\ninherited\nwarming\nincomplete\nvocals\nchronicle\nfountain\nchubby\ngrave\nlegitimate\nbiographies\nburner\nyrs\nfoo\ninvestigator\ngba\nplaintiff\nfinnish\ngentle\nbm\nprisoners\ndeeper\nmuslims\nhose\nmediterranean\nnightlife\nfootage\nhowto\nworthy\nreveals\narchitects\nsaints\nentrepreneur\ncarries\nsig\nfreelance\nduo\nexcessive\ndevon\nscreensaver\nhelena\nsaves\nregarded\nvaluation\nunexpected\ncigarette\nfog\ncharacteristic\nmarion\nlobby\negyptian\ntunisia\nmetallica\noutlined\nconsequently\nheadline\ntreating\npunch\nappointments\nstr\ngotta\ncowboy\nnarrative\nbahrain\nenormous\nkarma\nconsist\nbetty\nqueens\nacademics\npubs\nquantitative\nlucas\nscreensavers\nsubdivision\ntribes\nvip\ndefeat\nclicks\ndistinction\nhonduras\nnaughty\nhazards\ninsured\nharper\nlivestock\nmardi\nexemption\ntenant\nsustainability\ncabinets\ntattoo\nshake\nalgebra\nshadows\nholly\nformatting\nsilly\nnutritional\nyea\nmercy\nhartford\nfreely\nmarcus\nsunrise\nwrapping\nmild\nfur\nnicaragua\nweblogs\ntimeline\ntar\nbelongs\nrj\nreadily\naffiliation\nsoc\nfence\nnudist\ninfinite\ndiana\nensures\nrelatives\nlindsay\nclan\nlegally\nshame\nsatisfactory\nrevolutionary\nbracelets\nsync\ncivilian\ntelephony\nmesa\nfatal\nremedy\nrealtors\nbreathing\nbriefly\nthickness\nadjustments\ngraphical\ngenius\ndiscussing\naerospace\nfighter\nmeaningful\nflesh\nretreat\nadapted\nbarely\nwherever\nestates\nrug\ndemocrat\nborough\nmaintains\nfailing\nshortcuts\nka\nretained\nvoyeurweb\npamela\nandrews\nmarble\nextending\njesse\nspecifies\nhull\nlogitech\nsurrey\nbriefing\nbelkin\ndem\naccreditation\nwav\nblackberry\nhighland\nmeditation\nmodular\nmicrophone\nmacedonia\ncombining\nbrandon\ninstrumental\ngiants\norganizing\nshed\nballoon\nmoderators\nwinston\nmemo\nham\nsolved\ntide\nkazakhstan\nhawaiian\nstandings\npartition\ninvisible\ngratuit\nconsoles\nfunk\nfbi\nqatar\nmagnet\ntranslations\nporsche\ncayman\njaguar\nreel\nsheer\ncommodity\nposing\nkilometers\nrp\nbind\nthanksgiving\nrand\nhopkins\nurgent\nguarantees\ninfants\ngothic\ncylinder\nwitch\nbuck\nindication\neh\ncongratulations\ntba\ncohen\nsie\nusgs\npuppy\nkathy\nacre\ngraphs\nsurround\ncigarettes\nrevenge\nexpires\nenemies\nlows\ncontrollers\naqua\nchen\nemma\nconsultancy\nfinances\naccepts\nenjoying\nconventions\neva\npatrol\nsmell\npest\nhc\nitaliano\ncoordinates\nrca\nfp\ncarnival\nroughly\nsticker\npromises\nresponding\nreef\nphysically\ndivide\nstakeholders\nhydrocodone\ngst\nconsecutive\ncornell\nsatin\nbon\ndeserve\nattempting\nmailto\npromo\njj\nrepresentations\nchan\nworried\ntunes\ngarbage\ncompeting\ncombines\nmas\nbeth\nbradford\nlen\nphrases\nkai\npeninsula\nchelsea\nboring\nreynolds\ndom\njill\naccurately\nspeeches\nreaches\nschema\nconsiders\nsofa\ncatalogs\nministries\nvacancies\nquizzes\nparliamentary\nobj\nprefix\nlucia\nsavannah\nbarrel\ntyping\nnerve\ndans\nplanets\ndeficit\nboulder\npointing\nrenew\ncoupled\nviii\nmyanmar\nmetadata\nharold\ncircuits\nfloppy\ntexture\nhandbags\njar\nev\nsomerset\nincurred\nacknowledge\nthoroughly\nantigua\nnottingham\nthunder\ntent\ncaution\nidentifies\nquestionnaire\nqualification\nlocks\nmodelling\nnamely\nminiature\ndept\nhack\ndare\neuros\ninterstate\npirates\naerial\nhawk\nconsequence\nrebel\nsystematic\nperceived\norigins\nhired\nmakeup\ntextile\nlamb\nmadagascar\nnathan\ntobago\npresenting\ncos\ntroubleshooting\nuzbekistan\nindexes\npac\nrl\nerp\ncenturies\ngl\nmagnitude\nui\nrichardson\nhindu\ndh\nfragrances\nvocabulary\nlicking\nearthquake\nvpn\nfundraising\nfcc\nmarkers\nweights\nalbania\ngeological\nassessing\nlasting\nwicked\neds\nintroduces\nkills\nroommate\nwebcams\npushed\nwebmasters\nro\ndf\ncomputational\nacdbentity\nparticipated\njunk\nhandhelds\nwax\nlucy\nanswering\nhans\nimpressed\nslope\nreggae\nfailures\npoet\nconspiracy\nsurname\ntheology\nnails\nevident\nwhats\nrides\nrehab\nepic\nsaturn\norganizer\nnut\nallergy\nsake\ntwisted\ncombinations\npreceding\nmerit\nenzyme\ncumulative\nzshops\nplanes\nedmonton\ntackle\ndisks\ncondo\npokemon\namplifier\nambien\narbitrary\nprominent\nretrieve\nlexington\nvernon\nsans\nworldcat\ntitanium\nirs\nfairy\nbuilds\ncontacted\nshaft\nlean\nbye\ncdt\nrecorders\noccasional\nleslie\ncasio\ndeutsche\nana\npostings\ninnovations\nkitty\npostcards\ndude\ndrain\nmonte\nfires\nalgeria\nblessed\nluis\nreviewing\ncardiff\ncornwall\nfavors\npotato\npanic\nexplicitly\nsticks\nleone\ntranssexual\nez\ncitizenship\nexcuse\nreforms\nbasement\nonion\nstrand\npf\nsandwich\nuw\nlawsuit\nalto\ninformative\ngirlfriend\nbloomberg\ncheque\nhierarchy\ninfluenced\nbanners\nreject\neau\nabandoned\nbd\ncircles\nitalic\nbeats\nmerry\nmil\nscuba\ngore\ncomplement\ncult\ndash\npassive\nmauritius\nvalued\ncage\nchecklist\nrequesting\ncourage\nverde\nlauderdale\nscenarios\ngazette\nhitachi\ndivx\nextraction\nbatman\nelevation\nhearings\ncoleman\nhugh\nlap\nutilization\nbeverages\ncalibration\njake\neval\nefficiently\nanaheim\nping\ntextbook\ndried\nentertaining\nprerequisite\nluther\nfrontier\nsettle\nstopping\nrefugees\nknights\nhypothesis\npalmer\nmedicines\nflux\nderby\nsao\npeaceful\naltered\npontiac\nregression\ndoctrine\nscenic\ntrainers\nmuze\nenhancements\nrenewable\nintersection\npasswords\nsewing\nconsistency\ncollectors\nconclude\nmunich\noman\ncelebs\ngmc\npropose\nhh\nazerbaijan\nlighter\nrage\nadsl\nuh\nprix\nastrology\nadvisors\npavilion\ntactics\ntrusts\noccurring\nsupplemental\ntravelling\ntalented\nannie\npillow\ninduction\nderek\nprecisely\nshorter\nharley\nspreading\nprovinces\nrelying\nfinals\nparaguay\nsteal\nparcel\nrefined\nfd\nbo\nfifteen\nwidespread\nincidence\nfears\npredict\nboutique\nacrylic\nrolled\ntuner\navon\nincidents\npeterson\nrays\nasn\nshannon\ntoddler\nenhancing\nflavor\nalike\nwalt\nhomeless\nhorrible\nhungry\nmetallic\nacne\nblocked\ninterference\nwarriors\npalestine\nlistprice\nlibs\nundo\ncadillac\natmospheric\nmalawi\nwm\npk\nsagem\nknowledgestorm\ndana\nhalo\nppm\ncurtis\nparental\nreferenced\nstrikes\nlesser\npublicity\nmarathon\nant\nproposition\ngays\npressing\ngasoline\napt\ndressed\nscout\nbelfast\nexec\ndealt\nniagara\ninf\neos\nwarcraft\ncharms\ncatalyst\ntrader\nbucks\nallowance\nvcr\ndenial\nuri\ndesignation\nthrown\nprepaid\nraises\ngem\nduplicate\nelectro\ncriterion\nbadge\nwrist\ncivilization\nanalyzed\nvietnamese\nheath\ntremendous\nballot\nlexus\nvarying\nremedies\nvalidity\ntrustee\nmaui\nweighted\nangola\nperforms\nplastics\nrealm\ncorrected\njenny\nhelmet\nsalaries\npostcard\nelephant\nyemen\nencountered\ntsunami\nscholar\nnickel\ninternationally\nsurrounded\npsi\nbuses\nexpedia\ngeology\npct\nwb\ncreatures\ncoating\ncommented\nwallet\ncleared\nsmilies\nvids\naccomplish\nboating\ndrainage\nshakira\ncorners\nbroader\nvegetarian\nrouge\nyeast\nyale\nnewfoundland\nsn\nqld\npas\nclearing\ninvestigated\ndk\nambassador\ncoated\nintend\nstephanie\ncontacting\nvegetation\ndoom\nfindarticles\nlouise\nkenny\nspecially\nowen\nroutines\nhitting\nyukon\nbeings\nbite\nissn\naquatic\nreliance\nhabits\nstriking\nmyth\ninfectious\npodcasts\nsingh\ngig\ngilbert\nsas\nferrari\ncontinuity\nbrook\nfu\noutputs\nphenomenon\nensemble\ninsulin\nassured\nbiblical\nweed\nconscious\naccent\nmysimon\neleven\nwives\nambient\nutilize\nmileage\noecd\nprostate\nadaptor\nauburn\nunlock\nhyundai\npledge\nvampire\nangela\nrelates\nnitrogen\nxerox\ndice\nmerger\nsoftball\nreferrals\nquad\ndock\ndifferently\nfirewire\nmods\nnextel\nframing\nmusician\nblocking\nrwanda\nsorts\nintegrating\nvsnet\nlimiting\ndispatch\nrevisions\npapua\nrestored\nhint\narmor\nriders\nchargers\nremark\ndozens\nvaries\nmsie\nreasoning\nwn\nliz\nrendered\npicking\ncharitable\nguards\nannotated\nccd\nsv\nconvinced\nopenings\nbuys\nburlington\nreplacing\nresearcher\nwatershed\ncouncils\noccupations\nacknowledged\nkruger\npockets\ngranny\npork\nzu\nequilibrium\nviral\ninquire\npipes\ncharacterized\nladen\naruba\ncottages\nrealtor\nmerge\nprivilege\nedgar\ndevelops\nqualifying\nchassis\ndubai\nestimation\nbarn\npushing\nllp\nfleece\npediatric\nboc\nfare\ndg\nasus\npierce\nallan\ndressing\ntechrepublic\nsperm\nvg\nbald\nfilme\ncraps\nfuji\nfrost\nleon\ninstitutes\nmold\ndame\nfo\nsally\nyacht\ntracy\nprefers\ndrilling\nbrochures\nherb\ntmp\nalot\nate\nbreach\nwhale\ntraveller\nappropriations\nsuspected\ntomatoes\nbenchmark\nbeginners\ninstructors\nhighlighted\nbedford\nstationery\nidle\nmustang\nunauthorized\nclusters\nantibody\ncompetent\nmomentum\nfin\nwiring\nio\npastor\nmud\ncalvin\nuni\nshark\ncontributor\ndemonstrates\nphases\ngrateful\nemerald\ngradually\nlaughing\ngrows\ncliff\ndesirable\ntract\nul\nballet\nol\njournalist\nabraham\njs\nbumper\nafterwards\nwebpage\nreligions\ngarlic\nhostels\nshine\nsenegal\nexplosion\npn\nbanned\nwendy\nbriefs\nsignatures\ndiffs\ncove\nmumbai\nozone\ndisciplines\ncasa\nmu\ndaughters\nconversations\nradios\ntariff\nnvidia\nopponent\npasta\nsimplified\nmuscles\nserum\nwrapped\nswift\nmotherboard\nruntime\ninbox\nfocal\nbibliographic\neden\ndistant\nincl\nchampagne\nala\ndecimal\nhq\ndeviation\nsuperintendent\npropecia\ndip\nnbc\nsamba\nhostel\nhousewives\nemploy\nmongolia\npenguin\nmagical\ninfluences\ninspections\nirrigation\nmiracle\nmanually\nreprint\nreid\nwt\nhydraulic\ncentered\nrobertson\nflex\nyearly\npenetration\nwound\nbelle\nrosa\nconviction\nhash\nomissions\nwritings\nhamburg\nlazy\nmv\nmpg\nretrieval\nqualities\ncindy\nfathers\ncarb\ncharging\ncas\nmarvel\nlined\ncio\ndow\nprototype\nimportantly\nrb\npetite\napparatus\nupc\nterrain\ndui\npens\nexplaining\nyen\nstrips\ngossip\nrangers\nnomination\nempirical\nmh\nrotary\nworm\ndependence\ndiscrete\nbeginner\nboxed\nlid\nsexuality\npolyester\ncubic\ndeaf\ncommitments\nsuggesting\nsapphire\nkinase\nskirts\nmats\nremainder\ncrawford\nlabeled\nprivileges\ntelevisions\nspecializing\nmarking\ncommodities\npvc\nserbia\nsheriff\ngriffin\ndeclined\nguyana\nspies\nblah\nmime\nneighbor\nmotorcycles\nelect\nhighways\nthinkpad\nconcentrate\nintimate\nreproductive\npreston\ndeadly\nfeof\nbunny\nchevy\nmolecules\nrounds\nlongest\nrefrigerator\ntions\nintervals\nsentences\ndentists\nusda\nexclusion\nworkstation\nholocaust\nkeen\nflyer\npeas\ndosage\nreceivers\nurls\ndisposition\nvariance\nnavigator\ninvestigators\ncameroon\nbaking\nmarijuana\nadaptive\ncomputed\nneedle\nbaths\nenb\ngg\ncathedral\nbrakes\nog\nnirvana\nko\nfairfield\nowns\ntil\ninvision\nsticky\ndestiny\ngenerous\nmadness\nemacs\nclimb\nblowing\nfascinating\nlandscapes\nheated\nlafayette\njackie\nwto\ncomputation\nhay\ncardiovascular\nww\nsparc\ncardiac\nsalvation\ndover\nadrian\npredictions\naccompanying\nvatican\nbrutal\nlearners\ngd\nselective\narbitration\nconfiguring\ntoken\neditorials\nzinc\nsacrifice\nseekers\nguru\nisa\nremovable\nconvergence\nyields\ngibraltar\nlevy\nsuited\nnumeric\nanthropology\nskating\nkinda\naberdeen\nemperor\ngrad\nmalpractice\ndylan\nbras\nbelts\nblacks\neducated\nrebates\nreporters\nburke\nproudly\npix\nnecessity\nrendering\nmic\ninserted\npulling\nbasename\nkyle\nobesity\ncurves\nsuburban\ntouring\nclara\nvertex\nbw\nhepatitis\nnationally\ntomato\nandorra\nwaterproof\nexpired\nmj\ntravels\nflush\nwaiver\npale\nspecialties\nhayes\nhumanitarian\ninvitations\nfunctioning\ndelight\nsurvivor\ngarcia\ncingular\neconomies\nalexandria\nbacterial\nmoses\ncounted\nundertake\ndeclare\ncontinuously\njohns\nvalves\ngaps\nimpaired\nachievements\ndonors\ntear\njewel\nteddy\nlf\nconvertible\nata\nteaches\nventures\nnil\nbufing\nstranger\ntragedy\njulian\nnest\npam\ndryer\npainful\nvelvet\ntribunal\nruled\nnato\npensions\nprayers\nfunky\nsecretariat\nnowhere\ncop\nparagraphs\ngale\njoins\nadolescent\nnominations\nwesley\ndim\nlately\ncancelled\nscary\nmattress\nmpegs\nbrunei\nlikewise\nbanana\nintroductory\nslovak\ncakes\nstan\nreservoir\noccurrence\nidol\nmixer\nremind\nwc\nworcester\nsbjct\ndemographic\ncharming\nmai\ntooth\ndisciplinary\nannoying\nrespected\nstays\ndisclose\naffair\ndrove\nwasher\nupset\nrestrict\nspringer\nbeside\nmines\nportraits\nrebound\nlogan\nmentor\ninterpreted\nevaluations\nfought\nbaghdad\nelimination\nmetres\nhypothetical\nimmigrants\ncomplimentary\nhelicopter\npencil\nfreeze\nhk\nperformer\nabu\ntitled\ncommissions\nsphere\npowerseller\nmoss\nratios\nconcord\ngraduated\nendorsed\nty\nsurprising\nwalnut\nlance\nladder\nitalia\nunnecessary\ndramatically\nliberia\nsherman\ncork\nmaximize\ncj\nhansen\nsenators\nworkout\nmali\nyugoslavia\nbleeding\ncharacterization\ncolon\nlikelihood\nlanes\npurse\nfundamentals\ncontamination\nmtv\nendangered\ncompromise\noptimize\nstating\ndome\ncaroline\nleu\nexpiration\nnamespace\nalign\nperipheral\nbless\nengaging\nnegotiation\ncrest\nopponents\ntriumph\nnominated\nconfidentiality\nelectoral\nchangelog\nwelding\ndeferred\nalternatively\nheel\nalloy\ncondos\nplots\npolished\nyang\ngently\ngreensboro\ntulsa\nlocking\ncasey\ncontroversial\ndraws\nfridge\nblanket\nbloom\nqc\nsimpsons\nlou\nelliott\nrecovered\nfraser\njustify\nupgrading\nblades\npgp\nloops\nsurge\nfrontpage\ntrauma\naw\ntahoe\nadvert\npossess\ndemanding\ndefensive\nsip\nflashers\nsubaru\nforbidden\ntf\nvanilla\nprogrammers\npj\nmonitored\ninstallations\ndeutschland\npicnic\nsouls\narrivals\nspank\ncw\npractitioner\nmotivated\nwr\ndumb\nsmithsonian\nhollow\nvault\nsecurely\nexamining\nfioricet\ngroove\nrevelation\nrg\npursuit\ndelegation\nwires\nbl\ndictionaries\nmails\nbacking\ngreenhouse\nsleeps\nvc\nblake\ntransparency\ndee\ntravis\nwx\nendless\nfigured\norbit\ncurrencies\nniger\nbacon\nsurvivors\npositioning\nheater\ncolony\ncannon\ncircus\npromoted\nforbes\nmae\nmoldova\nmel\ndescending\npaxil\nspine\ntrout\nenclosed\nfeat\ntemporarily\nntsc\ncooked\nthriller\ntransmit\napnic\nfatty\ngerald\npressed\nfrequencies\nscanned\nreflections\nhunger\nmariah\nsic\nmunicipality\nusps\njoyce\ndetective\nsurgeon\ncement\nexperiencing\nfireplace\nendorsement\nbg\nplanners\ndisputes\ntextiles\nmissile\nintranet\ncloses\nseq\npsychiatry\npersistent\ndeborah\nconf\nmarco\nassists\nsummaries\nglow\ngabriel\nauditor\nwma\naquarium\nviolin\nprophet\ncir\nbracket\nlooksmart\nisaac\noxide\noaks\nmagnificent\nerik\ncolleague\nnaples\npromptly\nmodems\nadaptation\nhu\nharmful\npaintball\nprozac\nsexually\nenclosure\nacm\ndividend\nnewark\nkw\npaso\nglucose\nphantom\nnorm\nplayback\nsupervisors\nwestminster\nturtle\nips\ndistances\nabsorption\ntreasures\ndsc\nwarned\nneural\nware\nfossil\nmia\nhometown\nbadly\ntranscripts\napollo\nwan\ndisappointed\npersian\ncontinually\ncommunist\ncollectible\nhandmade\ngreene\nentrepreneurs\nrobots\ngrenada\ncreations\njade\nscoop\nacquisitions\nfoul\nkeno\ngtk\nearning\nmailman\nsanyo\nnested\nbiodiversity\nexcitement\nsomalia\nmovers\nverbal\nblink\npresently\nseas\ncarlo\nworkflow\nmysterious\nnovelty\nbryant\ntiles\nvoyuer\nlibrarian\nsubsidiaries\nswitched\nstockholm\ntamil\ngarmin\nru\npose\nfuzzy\nindonesian\ngrams\ntherapist\nrichards\nmrna\nbudgets\ntoolkit\npromising\nrelaxation\ngoat\nrender\ncarmen\nira\nsen\nthereafter\nhardwood\nerotica\ntemporal\nsail\nforge\ncommissioners\ndense\ndts\nbrave\nforwarding\nqt\nawful\nnightmare\nairplane\nreductions\nsouthampton\nistanbul\nimpose\norganisms\nsega\ntelescope\nviewers\nasbestos\nportsmouth\ncdna\nmeyer\nenters\npod\nsavage\nadvancement\nwu\nharassment\nwillow\nresumes\nbolt\ngage\nthrowing\nexisted\ngenerators\nlu\nwagon\nbarbie\ndat\nsoa\nknock\nurge\nsmtp\ngenerates\npotatoes\nthorough\nreplication\ninexpensive\nkurt\nreceptors\npeers\nroland\noptimum\nneon\ninterventions\nquilt\nhuntington\ncreature\nours\nmounts\nsyracuse\ninternship\nlone\nrefresh\naluminium\nsnowboard\nbeastality\nwebcast\nmichel\nevanescence\nsubtle\ncoordinated\nnotre\nshipments\nmaldives\nstripes\nfirmware\nantarctica\ncope\nshepherd\nlm\ncanberra\ncradle\nchancellor\nmambo\nlime\nkirk\nflour\ncontroversy\nlegendary\nbool\nsympathy\nchoir\navoiding\nbeautifully\nblond\nexpects\ncho\njumping\nfabrics\nantibodies\npolymer\nhygiene\nwit\npoultry\nvirtue\nburst\nexaminations\nsurgeons\nbouquet\nimmunology\npromotes\nmandate\nwiley\ndepartmental\nbbs\nspas\nind\ncorpus\njohnston\nterminology\ngentleman\nfibre\nreproduce\nconvicted\nshades\njets\nindices\nroommates\nadware\nqui\nintl\nthreatening\nspokesman\nzoloft\nactivists\nfrankfurt\nprisoner\ndaisy\nhalifax\nencourages\nultram\ncursor\nassembled\nearliest\ndonated\nstuffed\nrestructuring\ninsects\nterminals\ncrude\nmorrison\nmaiden\nsimulations\ncz\nsufficiently\nexamines\nviking\nmyrtle\nbored\ncleanup\nyarn\nknit\nconditional\nmug\ncrossword\nbother\nbudapest\nconceptual\nknitting\nattacked\nhl\nbhutan\nliechtenstein\nmating\ncompute\nredhead\narrives\ntranslator\nautomobiles\ntractor\nallah\ncontinent\nob\nunwrap\nfares\nlongitude\nresist\nchallenged\ntelecharger\nhoped\npike\nsafer\ninsertion\ninstrumentation\nids\nhugo\nwagner\nconstraint\ngroundwater\ntouched\nstrengthening\ncologne\ngzip\nwishing\nranger\nsmallest\ninsulation\nnewman\nmarsh\nricky\nctrl\nscared\ntheta\ninfringement\nbent\nlaos\nsubjective\nmonsters\nasylum\nlightbox\nrobbie\nstake\ncocktail\noutlets\nswaziland\nvarieties\narbor\nmediawiki\nconfigurations\npoison";
var dictionary = null;
function words() {
	if (dictionary) return dictionary;
	const next = /* @__PURE__ */ new Map();
	ENGLISH_WORDS.split("\n").forEach((word, index) => {
		if (word) next.set(word, index);
	});
	dictionary = next;
	return next;
}
var LETTERS = "abcdefghijklmnopqrstuvwxyz";
function edits(word) {
	const list = [];
	for (let index = 0; index < word.length; index += 1) {
		list.push(word.slice(0, index) + word.slice(index + 1));
		if (index < word.length - 1) list.push(word.slice(0, index) + word[index + 1] + word[index] + word.slice(index + 2));
	}
	for (let index = 0; index < word.length; index += 1) for (const letter of LETTERS) list.push(word.slice(0, index) + letter + word.slice(index + 1));
	for (let index = 0; index <= word.length; index += 1) for (const letter of LETTERS) list.push(word.slice(0, index) + letter + word.slice(index));
	return list;
}
function spellSuggestions(raw) {
	const word = raw.trim();
	if (!/^[A-Za-z][A-Za-z']*$/.test(word) || word.length < 4 || word.length > 24) return [];
	if (word.length > 1 && word === word.toUpperCase()) return [];
	const lower = word.toLowerCase().replace(/'/g, "");
	const known = words();
	if (!lower || known.has(lower)) return [];
	const ranked = [];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of edits(lower)) {
		const rank = known.get(candidate);
		if (rank === void 0 || rank >= 8e3 || candidate.length < 4 || seen.has(candidate)) continue;
		seen.add(candidate);
		ranked.push({
			word: candidate,
			rank
		});
	}
	ranked.sort((a, b) => a.rank - b.rank);
	const best = ranked.slice(0, 5);
	if (!best.length) return [];
	const capital = word[0] === word[0].toUpperCase();
	return best.map((item) => capital ? item.word[0].toUpperCase() + item.word.slice(1) : item.word);
}
function isTextField(target) {
	if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return false;
	const type = target instanceof HTMLInputElement ? target.type : "text";
	return ![
		"password",
		"file",
		"checkbox",
		"radio",
		"range",
		"color",
		"button",
		"submit"
	].includes(type);
}
function wordRange(value, index) {
	let start = Math.max(0, Math.min(index, value.length));
	let end = start;
	while (start > 0 && /[A-Za-z']/.test(value[start - 1] || "")) start -= 1;
	while (end < value.length && /[A-Za-z']/.test(value[end] || "")) end += 1;
	return {
		start,
		end,
		word: value.slice(start, end)
	};
}
function setFieldValue(field, value, from, to) {
	const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
	(Object.getOwnPropertyDescriptor(prototype, "value")?.set)?.call(field, value);
	field.dispatchEvent(new Event("input", { bubbles: true }));
	field.focus();
	field.setSelectionRange(from, to);
}
function ContextMenu() {
	const [menu, setMenu] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const onContext = (event) => {
			const field = isTextField(event.target) ? event.target : null;
			const selected = window.getSelection()?.toString() ?? "";
			if (!field && !selected.trim()) return;
			event.preventDefault();
			let suggestions = [];
			let word = null;
			let hasSelection = selected.trim().length > 0;
			if (field && !field.readOnly && !field.disabled && field.spellcheck !== false) {
				const cursor = field.selectionStart ?? 0;
				const end = field.selectionEnd ?? cursor;
				hasSelection = end !== cursor || hasSelection;
				const range = wordRange(field.value, end === cursor ? cursor : end);
				if (range.word) {
					suggestions = spellSuggestions(range.word);
					if (suggestions.length) word = {
						start: range.start,
						end: range.end
					};
				}
			}
			const width = 220;
			const height = 48 * (suggestions.length + 4) + 16;
			setMenu({
				x: Math.max(8, Math.min(event.clientX, window.innerWidth - width - 8)),
				y: Math.max(8, Math.min(event.clientY, window.innerHeight - Math.min(height, window.innerHeight - 16))),
				field,
				suggestions,
				word,
				canEdit: Boolean(field && !field.readOnly && !field.disabled),
				hasSelection
			});
		};
		const close = () => setMenu(null);
		const onKey = (event) => {
			if (event.key === "Escape") close();
		};
		window.addEventListener("contextmenu", onContext);
		window.addEventListener("mousedown", close);
		window.addEventListener("scroll", close, true);
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("contextmenu", onContext);
			window.removeEventListener("mousedown", close);
			window.removeEventListener("scroll", close, true);
			window.removeEventListener("keydown", onKey);
		};
	}, []);
	if (!menu) return null;
	function run(action) {
		action();
		setMenu(null);
	}
	const itemClass = "flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2 disabled:opacity-40";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "menu",
		className: "fixed z-50 w-56 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-2xl",
		style: {
			left: menu.x,
			top: menu.y
		},
		onMouseDown: (event) => event.stopPropagation(),
		children: [
			menu.suggestions.map((suggestion) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "menuitem",
				className: itemClass,
				onMouseDown: (event) => event.preventDefault(),
				onClick: () => run(() => {
					const field = menu.field;
					const word = menu.word;
					if (!field || !word) return;
					setFieldValue(field, field.value.slice(0, word.start) + suggestion + field.value.slice(word.end), word.start, word.start + suggestion.length);
				}),
				children: suggestion
			}, suggestion)),
			menu.suggestions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 border-t border-border" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "menuitem",
				className: itemClass,
				disabled: !menu.canEdit || !menu.hasSelection,
				onMouseDown: (event) => event.preventDefault(),
				onClick: () => run(() => document.execCommand("cut")),
				children: "Cut"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "menuitem",
				className: itemClass,
				disabled: !menu.hasSelection,
				onMouseDown: (event) => event.preventDefault(),
				onClick: () => run(() => document.execCommand("copy")),
				children: "Copy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "menuitem",
				className: itemClass,
				disabled: !menu.canEdit,
				onMouseDown: (event) => event.preventDefault(),
				onClick: () => run(() => {
					const field = menu.field;
					navigator.clipboard.readText().then((text) => {
						if (!field) return;
						const start = field.selectionStart ?? field.value.length;
						const end = field.selectionEnd ?? start;
						const next = field.value.slice(0, start) + text + field.value.slice(end);
						setFieldValue(field, next, start + text.length, start + text.length);
					}).catch(() => {
						field?.focus();
						document.execCommand("paste");
					});
				}),
				children: "Paste"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "menuitem",
				className: itemClass,
				disabled: !menu.field,
				onMouseDown: (event) => event.preventDefault(),
				onClick: () => run(() => {
					menu.field?.focus();
					menu.field?.select();
				}),
				children: "Select all"
			})
		]
	});
}
var registry = /* @__PURE__ */ new Map();
function onCommand(name, run) {
	registry.set(name, run);
	return () => {
		if (registry.get(name) === run) registry.delete(name);
	};
}
function runCommand(name) {
	registry.get(name)?.();
}
function speakersForTurn(input) {
	const cast = input.cast.filter((member) => member.name.trim());
	if (cast.length === 0) return [];
	const picked = cast.find((member) => member.id === input.pickedId) ?? cast[0];
	if (input.mode === "everyone") return cast;
	if (input.mode === "round") {
		const index = cast.findIndex((member) => member.id === input.lastSpeakerId);
		return [cast[((index >= 0 ? index : -1) + 1) % cast.length]];
	}
	if (input.mode === "named") {
		const named = cast.filter((member) => knownNames(member).some((name) => nameHits(input.userText, name)));
		return named.length ? named : [picked];
	}
	return [picked];
}
function knownNames(member) {
	const aliases = (member.aliases ?? "").split(/[,\n]/).map((name) => name.trim()).filter((name) => name.length >= 2);
	return [member.name, ...aliases];
}
function nameHits(text, name) {
	const needle = name.trim();
	if (needle.length < 2) return false;
	const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
}
function applyMacros(text, charName, userName) {
	return text.replace(/\{\{\s*char\s*\}\}/gi, charName).replace(/\{\{\s*user\s*\}\}/gi, userName);
}
function cardBrief(card) {
	return [
		card.description,
		card.personality,
		card.appearance,
		card.backstory
	].map((part) => part.trim()).filter(Boolean).join("\n");
}
function buildRoleplayMessages(card, persona, history, extras, cast = []) {
	const charName = card.name.trim() || "Character";
	const userName = persona?.name.trim() || "User";
	const fill = (text) => applyMacros(text, charName, userName);
	const others = cast.filter((member) => member.name.trim() && member.name.trim() !== charName);
	const personaText = persona ? cardBrief(persona) : "";
	const otherText = others.map((member) => {
		const brief = cardBrief(member);
		return brief ? `${member.name.trim()}:\n${fill(brief)}` : member.name.trim();
	}).join("\n\n");
	const messages = [{
		role: "system",
		content: [
			others.length ? `You are ${charName} in a roleplay with ${userName} and ${others.map((member) => member.name.trim()).join(", ")}. Write only ${charName}'s next reply. Do not speak, think, or act for ${userName} or the other characters. Put actions and narration in asterisks.` : `You are ${charName} in a roleplay. Write only ${charName}'s next reply. Do not speak, think, or act for ${userName}. Put actions and narration in asterisks. Match the card's voice.`,
			card.description.trim() && `Description:\n${fill(card.description)}`,
			card.personality.trim() && `Personality:\n${fill(card.personality)}`,
			card.appearance.trim() && `Appearance:\n${fill(card.appearance)}`,
			card.backstory.trim() && `Backstory:\n${fill(card.backstory)}`,
			card.scenario.trim() && `Scenario:\n${fill(card.scenario)}`,
			card.mes_example.trim() && `Example dialogue:\n${fill(card.mes_example)}`,
			otherText && `Also in the scene:\n${otherText}`,
			extras?.lore?.trim() && `Lore that fits this moment:\n${fill(extras.lore.trim())}`,
			extras?.memory?.trim() && `Memory of the story so far:\n${fill(extras.memory.trim())}`,
			personaText && `${userName} is the person in the scene with ${charName}.\n${fill(personaText)}`,
			card.system_prompt.trim() && fill(card.system_prompt),
			card.post_history_instructions.trim() && `Keep this in mind after the chat so far:\n${fill(card.post_history_instructions)}`
		].filter((part) => Boolean(part)).join("\n\n")
	}];
	const many = cast.filter((member) => member.name.trim()).length > 1;
	for (const turn of history.slice(-40)) {
		if (!turn.text.trim()) continue;
		const speaker = turn.speakerName?.trim();
		const content = many && turn.role === "assistant" && speaker ? `${speaker}: ${turn.text}` : turn.text;
		messages.push({
			role: turn.role,
			content
		});
	}
	return messages;
}
function sceneBrief$1(input) {
	const userName = input.persona?.name.trim() || "the other person";
	const people = input.cards.map((card) => {
		return [
			card.name.trim() || "Character",
			card.appearance.trim() && `Appearance: ${card.appearance.trim()}`,
			card.description.trim() && `Description: ${card.description.trim()}`
		].filter((part) => Boolean(part)).join("\n");
	}).filter(Boolean);
	const personaLines = input.persona ? [
		`${userName} is in the scene.`,
		input.persona.appearance.trim() && `Appearance: ${input.persona.appearance.trim()}`,
		input.persona.description.trim() && `Description: ${input.persona.description.trim()}`
	].filter((part) => Boolean(part)) : [];
	const recent = input.history.slice(-8).map((turn) => {
		return `${turn.role === "user" ? userName : turn.speakerName?.trim() || input.cards[0]?.name.trim() || "Character"}: ${turn.text}`;
	}).join("\n");
	return [
		people.length && `Characters:\n${people.join("\n\n")}`,
		personaLines.length && `Persona:\n${personaLines.join("\n")}`,
		input.memory.trim() && `Memory: ${input.memory.trim()}`,
		input.lore.trim() && `Lore and world facts: ${input.lore.trim()}`,
		recent && `Recent chat:\n${recent}`
	].filter((part) => Boolean(part)).join("\n\n").slice(0, 4e3);
}
function factsFromText(text) {
	const seen = /* @__PURE__ */ new Set();
	const facts = [];
	for (const line of text.split("\n")) {
		const fact = line.replace(/^[-*\d.)\s]+/, "").trim();
		const key = fact.toLowerCase();
		if (fact.length < 3 || seen.has(key) || /^none[.!]?$/i.test(fact)) continue;
		seen.add(key);
		facts.push({
			id: crypto.randomUUID(),
			text: fact
		});
	}
	return facts;
}
function factsFromReply(text, existing) {
	const merged = factsFromText([...existing.map((fact) => fact.text), text].join("\n")).slice(-80);
	const byText = new Map(existing.map((fact) => [fact.text.trim().toLowerCase(), fact]));
	return merged.map((fact) => byText.get(fact.text.trim().toLowerCase()) ?? fact);
}
function factsToPrompt(facts, historyText, limit = 12) {
	if (!facts.length || limit <= 0) return "";
	const hay = historyText.toLowerCase();
	const picked = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (fact) => {
		const key = fact.text.trim().toLowerCase();
		if (!key || seen.has(key) || picked.length >= limit) return;
		seen.add(key);
		picked.push(fact);
	};
	for (const fact of facts) if (fact.text.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 4).some((word) => hay.includes(word))) push(fact);
	for (let index = facts.length - 1; index >= 0 && picked.length < limit; index -= 1) push(facts[index]);
	return picked.map((fact) => fact.text.trim()).join("\n");
}
function trackerRows(cast, existing = []) {
	return cast.map((member) => {
		const name = member.name.trim() || "Character";
		const found = existing.find((row) => row.id === member.id || row.name.trim().toLowerCase() === name.toLowerCase());
		if (!found) return {
			id: member.id,
			name,
			present: true,
			where: "",
			doing: ""
		};
		return {
			...found,
			id: member.id,
			name
		};
	});
}
function trackerPrompt(rows) {
	return rows.map((row) => {
		const place = [
			row.present ? "in the scene" : "not in the scene",
			row.where.trim(),
			row.doing.trim()
		].filter(Boolean);
		return `${row.name}: ${place.join(", ")}`;
	}).join("\n");
}
function applyTrackerText(current, text) {
	const next = current.map((row) => ({ ...row }));
	for (const line of text.split("\n")) {
		const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
		if (parts.length < 2) continue;
		const [name, presentRaw, where = "", doing = ""] = parts;
		const row = next.find((item) => item.name.toLowerCase() === name.toLowerCase());
		if (!row) continue;
		row.present = !/^(no|n|false|out|absent)$/i.test(presentRaw);
		row.where = where;
		row.doing = doing;
	}
	return next;
}
function injectAuthorNote(messages, note, depth) {
	const text = note.trim();
	if (!text) return messages;
	const clamped = Math.max(0, Math.min(20, Math.round(depth) || 0));
	const next = [...messages];
	next.splice(Math.max(0, next.length - clamped), 0, {
		role: "system",
		content: `Author's note: ${text}`
	});
	return next;
}
function withChatGuides(messages, guides) {
	const blocks = [guides.longMemory?.trim() && `Long-term memory:\n${guides.longMemory.trim()}`, guides.tracker?.trim() && `Character tracker:\n${guides.tracker.trim()}`].filter((part) => Boolean(part));
	const next = messages.map((message) => ({ ...message }));
	if (blocks.length) {
		const block = blocks.join("\n\n");
		if (next[0]?.role === "system") next[0] = {
			...next[0],
			content: `${next[0].content}\n\n${block}`
		};
		else next.unshift({
			role: "system",
			content: block
		});
	}
	return injectAuthorNote(next, guides.authorNote ?? "", guides.authorDepth ?? 2);
}
function isRecord$2(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function chatSummaryFrom(raw, id) {
	if (!isRecord$2(raw) || !isRecord$2(raw.card)) return null;
	const names = [];
	if (Array.isArray(raw.cast)) for (const member of raw.cast) {
		if (!isRecord$2(member) || !isRecord$2(member.card)) continue;
		const name = typeof member.card.name === "string" ? member.card.name.trim() : "";
		if (name && !names.includes(name)) names.push(name);
	}
	if (!names.length) {
		const fallback = typeof raw.cardName === "string" && raw.cardName.trim() ? raw.cardName.trim() : typeof raw.card.name === "string" ? raw.card.name.trim() : "";
		if (fallback) names.push(fallback);
	}
	let messages = 0;
	let snippet = "";
	if (Array.isArray(raw.messages)) for (const entry of raw.messages) {
		if (!isRecord$2(entry) || entry.role !== "user" && entry.role !== "assistant") continue;
		messages += 1;
		if (typeof entry.text === "string" && entry.text.trim()) snippet = entry.text.trim().replace(/\s+/g, " ");
	}
	const title = typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : names[0] || "Untitled chat";
	return {
		id: typeof raw.id === "string" ? raw.id : id,
		title,
		cardName: names.join(", ") || "Chat",
		updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
		messages,
		snippet: snippet.slice(0, 160),
		cardKey: typeof raw.cardKey === "string" ? raw.cardKey : ""
	};
}
function greetingOptions(first, alternates) {
	return [first, ...alternates].map((item) => item.trim()).filter(Boolean);
}
function cleanImage(value) {
	return typeof value === "string" && value.startsWith("data:image/") ? value : null;
}
function swipeIndex(turn, count) {
	if (count <= 0) return 0;
	const index = turn.swipe ?? 0;
	if (!Number.isFinite(index) || index < 0) return 0;
	if (index >= count) return count - 1;
	return Math.floor(index);
}
function swipesOf(turn) {
	if (turn.swipes && turn.swipes.length) return turn.swipes.map((swipe) => ({
		text: swipe.text ?? "",
		image: cleanImage(swipe.image)
	}));
	return [{
		text: turn.text,
		image: cleanImage(turn.image)
	}];
}
function syncActiveSwipe(turn) {
	const swipes = swipesOf(turn);
	const index = swipeIndex(turn, swipes.length);
	swipes[index] = {
		text: turn.text,
		image: cleanImage(turn.image)
	};
	return swipes;
}
function movedSwipe(turn, direction) {
	const swipes = syncActiveSwipe(turn);
	const next = (swipeIndex(turn, swipes.length) + direction + swipes.length) % swipes.length;
	const active = swipes[next] ?? {
		text: turn.text,
		image: null
	};
	return {
		text: active.text,
		image: active.image,
		swipes,
		swipe: next
	};
}
function addedSwipe(turn, text) {
	const swipes = syncActiveSwipe(turn);
	swipes.push({
		text,
		image: null
	});
	return {
		text,
		image: null,
		swipes,
		swipe: swipes.length - 1
	};
}
function paintedImage(turn, image) {
	const cleaned = cleanImage(image);
	const swipes = syncActiveSwipe({
		...turn,
		image: cleaned
	});
	const index = swipeIndex(turn, swipes.length);
	return {
		text: turn.text,
		image: cleaned,
		swipes,
		swipe: index
	};
}
function readTurnSwipes(rawSwipes, rawIndex, text, image) {
	const swipes = [];
	if (Array.isArray(rawSwipes)) for (const entry of rawSwipes) {
		if (!entry || typeof entry !== "object") continue;
		const record = entry;
		if (typeof record.text !== "string") continue;
		swipes.push({
			text: record.text,
			image: cleanImage(record.image)
		});
	}
	if (!swipes.length) swipes.push({
		text,
		image
	});
	const swipe = swipeIndex({ swipe: typeof rawIndex === "number" ? rawIndex : 0 }, swipes.length);
	const active = swipes[swipe] ?? swipes[0];
	return {
		swipes,
		swipe,
		text: active.text,
		image: active.image
	};
}
function versionRank(value) {
	const match = value.trim().match(/^(\d+)(?:\.(\d+))?/);
	if (!match) return 0;
	return Number(match[1]) * 1e3 + Number(match[2] ?? 0);
}
function highestVersion(item) {
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
function upsert(list, id, card, revisions) {
	const name = card.name.trim() || "Untitled";
	const nextCard = cloneCard(card);
	if (id && list.some((item) => item.id === id)) return {
		id,
		list: list.map((item) => item.id === id ? {
			...item,
			name,
			updatedAt: Date.now(),
			card: nextCard,
			revisions: revisions ?? item.revisions ?? []
		} : item)
	};
	const created = crypto.randomUUID();
	return {
		id: created,
		list: [{
			id: created,
			name,
			updatedAt: Date.now(),
			card: nextCard,
			revisions: revisions ?? []
		}, ...list]
	};
}
var useStudio = create()(persist((set, get) => ({
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
		const card = {
			...get().card,
			...patch
		};
		const draftId = get().cardDraftId;
		if (!("aliases" in patch || "chatLook" in patch || "longMemory" in patch || "name" in patch)) {
			set({ card });
			return;
		}
		const matches = (id) => id === "editor" || draftId !== null && id === draftId;
		const chatCast = get().chatCast.map((member) => matches(member.id) ? {
			...member,
			card: cloneCard({
				...member.card,
				...patch
			})
		} : member);
		const primary = chatCast[0];
		const currentChat = get().chatCard;
		set({
			card,
			chatCast,
			chatCard: currentChat && primary && matches(primary.id) ? cloneCard({
				...currentChat,
				...patch
			}) : currentChat
		});
	},
	replaceCard: (card) => set({ card: cloneCard(card) }),
	applyGenerated: (card) => {
		const current = get().card;
		set({ card: get().fillBlanks ? mergeBlanks(current, card) : cloneCard(card) });
	},
	patchSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	setFillBlanks: (fillBlanks) => set({ fillBlanks }),
	setNovelPrompt: (novelPrompt) => set({ novelPrompt }),
	setStylePlate: (stylePlate) => set({ stylePlate }),
	saveToShelf: () => {
		const id = get().cardDraftId;
		const existing = id ? get().shelf.find((item) => item.id === id) : void 0;
		let card = get().card;
		let revisions = existing?.revisions ?? [];
		if (existing) {
			revisions = [...revisions, {
				version: existing.card.character_version.trim() || "1.0",
				savedAt: existing.updatedAt || Date.now(),
				card: cloneCard(existing.card)
			}].slice(-40);
			card = cloneCard({
				...card,
				character_version: nextCardVersion(highestVersion(existing))
			});
		} else if (!card.character_version.trim()) card = cloneCard({
			...card,
			character_version: "1.0"
		});
		const saved = upsert(get().shelf, id, card, revisions);
		set({
			shelf: saved.list,
			cardDraftId: saved.id,
			card
		});
		return saved.id;
	},
	addToShelf: (card) => {
		const saved = upsert(get().shelf, null, card);
		set({ shelf: saved.list });
		return saved.id;
	},
	loadFromShelf: (id) => {
		const item = get().shelf.find((entry) => entry.id === id);
		if (item) set({
			card: cloneCard(item.card),
			cardDraftId: id
		});
	},
	removeFromShelf: (id) => set({
		shelf: get().shelf.filter((entry) => entry.id !== id),
		cardDraftId: get().cardDraftId === id ? null : get().cardDraftId
	}),
	newCard: () => set({
		card: cloneCard(EMPTY_CARD),
		concept: "",
		cardDraftId: null
	}),
	setPersonaConcept: (personaConcept) => set({ personaConcept }),
	patchPersona: (patch) => {
		const previous = get().persona;
		const persona = {
			...previous,
			...patch
		};
		const live = get().chatPersona;
		set({
			persona,
			chatPersona: live && live.name === previous.name ? cloneCard({
				...live,
				...patch
			}) : live
		});
	},
	applyGeneratedPersona: (card) => {
		const current = get().persona;
		set({ persona: get().personaFillBlanks ? mergeBlanks(current, card) : cloneCard(card) });
	},
	setPersonaFillBlanks: (personaFillBlanks) => set({ personaFillBlanks }),
	savePersona: () => {
		const saved = upsert(get().personas, get().personaDraftId, get().persona);
		set({
			personas: saved.list,
			personaDraftId: saved.id
		});
		return saved.id;
	},
	addPersona: (card) => {
		const saved = upsert(get().personas, null, card);
		set({ personas: saved.list });
		return saved.id;
	},
	loadPersona: (id) => {
		const item = get().personas.find((entry) => entry.id === id);
		if (item) set({
			persona: cloneCard(item.card),
			personaDraftId: id
		});
	},
	removePersona: (id) => set({
		personas: get().personas.filter((entry) => entry.id !== id),
		personaDraftId: get().personaDraftId === id ? null : get().personaDraftId
	}),
	newPersona: () => set({
		persona: cloneCard(EMPTY_CARD),
		personaConcept: "",
		personaDraftId: null
	}),
	startChat: (card, persona, cardKey = null) => {
		const named = card.name.trim() || "Character";
		const memberId = cardKey || crypto.randomUUID();
		const swipes = greetingOptions(card.first_mes, card.alternate_greetings ?? []).map((text) => ({
			text,
			image: null
		}));
		set({
			chatId: crypto.randomUUID(),
			chatTitle: named,
			chatCard: cloneCard(card),
			chatPersona: persona && persona.name.trim() ? cloneCard(persona) : null,
			chatMessages: swipes.length ? [{
				id: crypto.randomUUID(),
				role: "assistant",
				text: swipes[0].text,
				image: null,
				speakerId: memberId,
				speakerName: named,
				swipes,
				swipe: 0
			}] : [],
			chatMemory: "",
			chatLoreIds: card.lorebookId ? [card.lorebookId] : [],
			chatWorldIds: [],
			chatCardKey: cardKey,
			chatCast: [{
				id: memberId,
				card: cloneCard(card)
			}],
			chatSpeakerId: memberId,
			chatReplyMode: "pick",
			chatFacts: factsFromText(card.longMemory ?? ""),
			chatLtm: true,
			chatTracker: trackerRows([{
				id: memberId,
				name: named
			}]),
			chatTrack: true,
			chatKnowledge: "keywords",
			chatKnowledgeLimit: 30,
			chatAuthorNote: "",
			chatAuthorDepth: 2
		});
	},
	setChatPersona: (persona) => set({ chatPersona: persona && persona.name.trim() ? cloneCard(persona) : null }),
	pushChat: (turn) => set({ chatMessages: [...get().chatMessages, turn] }),
	editChat: (id, text) => set({ chatMessages: get().chatMessages.map((turn) => {
		if (turn.id !== id) return turn;
		const next = {
			...turn,
			text
		};
		const swipes = syncActiveSwipe(next);
		return {
			...next,
			swipes,
			swipe: swipeIndex(next, swipes.length)
		};
	}) }),
	removeChat: (id) => set({ chatMessages: get().chatMessages.filter((turn) => turn.id !== id) }),
	setChatImage: (id, image) => set({ chatMessages: get().chatMessages.map((turn) => turn.id === id ? {
		...turn,
		...paintedImage(turn, image)
	} : turn) }),
	swipeChat: (id, direction) => set({ chatMessages: get().chatMessages.map((turn) => turn.id === id ? {
		...turn,
		...movedSwipe(turn, direction)
	} : turn) }),
	appendChatSwipe: (id, text) => set({ chatMessages: get().chatMessages.map((turn) => turn.id === id ? {
		...turn,
		...addedSwipe(turn, text)
	} : turn) }),
	dropLastAssistant: () => {
		const messages = get().chatMessages;
		if (messages[messages.length - 1]?.role === "assistant") set({ chatMessages: messages.slice(0, -1) });
	},
	clearChat: () => set({
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
		chatAuthorDepth: 2
	}),
	setChatTitle: (chatTitle) => set({ chatTitle }),
	setChatMemory: (chatMemory) => set({ chatMemory }),
	setChatBooks: (chatLoreIds, chatWorldIds) => set({
		chatLoreIds,
		chatWorldIds
	}),
	addChatMember: (id, card) => {
		const name = card.name.trim();
		if (!name) return;
		const existingCard = get().chatCard;
		const seeded = get().chatCast.length ? get().chatCast : existingCard ? [{
			id: get().chatCardKey || "primary",
			card: existingCard
		}] : [];
		if (seeded.some((member) => member.id === id || member.card.name.trim() === name)) {
			if (!get().chatCast.length && seeded.length) set({
				chatCast: seeded,
				chatSpeakerId: get().chatSpeakerId || seeded[0].id,
				chatTracker: trackerRows(seeded.map((member) => ({
					id: member.id,
					name: member.card.name
				})), get().chatTracker)
			});
			return;
		}
		const next = [...seeded, {
			id,
			card: cloneCard(card)
		}];
		set({
			chatCast: next,
			chatSpeakerId: get().chatSpeakerId || next[0]?.id || null,
			chatTracker: trackerRows(next.map((member) => ({
				id: member.id,
				name: member.card.name
			})), get().chatTracker)
		});
	},
	removeChatMember: (id) => {
		const next = get().chatCast.filter((member) => member.id !== id);
		if (next.length === 0) return;
		set({
			chatCast: next,
			chatSpeakerId: get().chatSpeakerId === id ? next[0].id : get().chatSpeakerId,
			chatCard: next[0].card,
			chatTracker: trackerRows(next.map((member) => ({
				id: member.id,
				name: member.card.name
			})), get().chatTracker)
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
		const card = cloneCard({
			...primary.card,
			longMemory: facts
		});
		const id = primary.id;
		set({
			chatCast: get().chatCast.map((member, index) => index === 0 ? {
				...member,
				card
			} : member),
			chatCard: get().chatCard ? card : get().chatCard,
			card: id === "editor" || get().cardDraftId === id ? {
				...get().card,
				longMemory: facts
			} : get().card,
			shelf: get().shelf.some((item) => item.id === id) ? get().shelf.map((item) => item.id === id ? {
				...item,
				card: cloneCard({
					...item.card,
					longMemory: facts
				}),
				updatedAt: Date.now()
			} : item) : get().shelf
		});
	},
	setChatIndex: (chatIndex) => set({ chatIndex }),
	openSavedChat: (chat) => {
		const cast = chat.cast?.length ? chat.cast.map((member) => ({
			id: member.id,
			card: cloneCard(member.card)
		})) : [{
			id: chat.cardKey || "primary",
			card: cloneCard(chat.card)
		}];
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
			chatTracker: trackerRows(cast.map((member) => ({
				id: member.id,
				name: member.card.name
			})), chat.tracker ?? []),
			chatTrack: chat.track !== false,
			chatKnowledge: chat.knowledge === "retrieval" ? "retrieval" : "keywords",
			chatKnowledgeLimit: limit,
			chatAuthorNote: chat.authorNote ?? "",
			chatAuthorDepth: typeof chat.authorDepth === "number" ? chat.authorDepth : 2
		});
	},
	setLorebooks: (lorebooks) => set({ lorebooks }),
	upsertLore: (book) => {
		set({ lorebooks: get().lorebooks.some((item) => item.id === book.id) ? get().lorebooks.map((item) => item.id === book.id ? book : item) : [book, ...get().lorebooks] });
	},
	removeLore: (id) => set({ lorebooks: get().lorebooks.filter((item) => item.id !== id) }),
	setWorldbooks: (worldbooks) => set({ worldbooks }),
	upsertWorld: (book) => {
		set({ worldbooks: get().worldbooks.some((item) => item.id === book.id) ? get().worldbooks.map((item) => item.id === book.id ? book : item) : [book, ...get().worldbooks] });
	},
	removeWorld: (id) => set({ worldbooks: get().worldbooks.filter((item) => item.id !== id) }),
	setTheme: (theme) => set({ theme: {
		...DEFAULT_THEME,
		...get().theme,
		...theme
	} }),
	patchChatLook: (look) => {
		const chatCard = get().chatCard;
		if (!chatCard) return;
		const next = cloneCard({
			...chatCard,
			chatLook: look
		});
		const key = get().chatCardKey;
		set({
			chatCard: next,
			card: key === "editor" || get().card.name === chatCard.name ? {
				...get().card,
				chatLook: look
			} : get().card,
			shelf: key && key !== "editor" ? get().shelf.map((item) => item.id === key ? {
				...item,
				card: cloneCard({
					...item.card,
					chatLook: look
				}),
				updatedAt: Date.now()
			} : item) : get().shelf,
			chatCast: get().chatCast.map((member, index) => index === 0 || member.id === key ? {
				...member,
				card: cloneCard({
					...member.card,
					chatLook: look
				})
			} : member)
		});
	},
	patchMemberLook: (id, look) => {
		const state = get();
		const chatCast = state.chatCast.map((member) => member.id === id ? {
			...member,
			card: cloneCard({
				...member.card,
				chatLook: look
			})
		} : member);
		const isPrimary = id === chatCast[0]?.id;
		const shelfHit = state.shelf.some((item) => item.id === id);
		const personaHit = state.personas.some((item) => item.id === id);
		set({
			chatCast,
			chatCard: state.chatCard && isPrimary ? cloneCard({
				...state.chatCard,
				chatLook: look
			}) : state.chatCard,
			card: id === "editor" || state.cardDraftId === id ? {
				...state.card,
				chatLook: look
			} : state.card,
			shelf: shelfHit ? state.shelf.map((item) => item.id === id ? {
				...item,
				card: cloneCard({
					...item.card,
					chatLook: look
				}),
				updatedAt: Date.now()
			} : item) : state.shelf,
			personas: personaHit ? state.personas.map((item) => item.id === id ? {
				...item,
				card: cloneCard({
					...item.card,
					chatLook: look
				}),
				updatedAt: Date.now()
			} : item) : state.personas
		});
	},
	setPresets: (presets) => set({ presets }),
	upsertPreset: (preset) => {
		set({ presets: get().presets.some((item) => item.id === preset.id) ? get().presets.map((item) => item.id === preset.id ? preset : item) : [preset, ...get().presets] });
	},
	removePreset: (id) => set({
		presets: get().presets.filter((item) => item.id !== id),
		activePresetId: get().activePresetId === id ? null : get().activePresetId
	}),
	setActivePreset: (activePresetId) => set({ activePresetId })
}), {
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
			swipes: (turn.swipes ?? []).map((swipe) => ({
				text: swipe.text,
				image: null
			}))
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
		activePresetId: state.activePresetId
	})
}));
function MenuBar() {
	const [open, setOpen] = (0, import_react.useState)(null);
	const [desktop, setDesktop] = (0, import_react.useState)(false);
	const barRef = (0, import_react.useRef)(null);
	const fillBlanks = useStudio((state) => state.fillBlanks);
	const useImages = useStudio((state) => state.settings.useImages !== false);
	const setFillBlanks = useStudio((state) => state.setFillBlanks);
	const patchSettings = useStudio((state) => state.patchSettings);
	(0, import_react.useEffect)(() => {
		isDesktopHost().then(setDesktop);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onPointer = (event) => {
			if (!barRef.current?.contains(event.target)) setOpen(null);
		};
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(null);
		};
		document.addEventListener("mousedown", onPointer);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onPointer);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);
	function choose(name) {
		setOpen(name);
	}
	function item(label, command) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "menuitem",
			className: "flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2",
			onClick: () => {
				setOpen(null);
				runCommand(command);
			},
			children: label
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: barRef,
		role: "menubar",
		className: "flex min-h-11 flex-wrap items-stretch border-b border-border bg-surface text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
				label: "File",
				open: open === "file",
				onOpen: () => choose(open === "file" ? null : "file"),
				onHover: () => open && choose("file"),
				children: [
					item("New card", "file.new"),
					item("Import card…", "file.import"),
					item("Export JSON", "file.exportJson"),
					item("Export PNG card", "file.exportPng"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
					item("Library folder…", "file.libraryFolder"),
					item("Download folder…", "file.downloadFolder"),
					item("Save settings…", "file.saveSettings"),
					item("Load settings…", "file.loadSettings"),
					desktop ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}), item("Exit", "file.exit")] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
				label: "Card",
				open: open === "card",
				onOpen: () => choose(open === "card" ? null : "card"),
				onHover: () => open && choose("card"),
				children: [
					item("Write the card", "card.write"),
					item("Keep draft", "card.keep"),
					item("Copy JSON", "card.copy"),
					item("Show card", "nav.card")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
				label: "Persona",
				open: open === "persona",
				onOpen: () => choose(open === "persona" ? null : "persona"),
				onHover: () => open && choose("persona"),
				children: [
					item("Show persona", "nav.persona"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "menuitem",
						className: "flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => {
							setOpen(null);
							runCommand("nav.persona");
							window.setTimeout(() => runCommand("persona.write"), 60);
						},
						children: "Write the persona"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "menuitem",
						className: "flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => {
							setOpen(null);
							runCommand("nav.persona");
							window.setTimeout(() => runCommand("persona.keep"), 60);
						},
						children: "Keep persona"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "menuitem",
						className: "flex min-h-11 w-full items-center px-3 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => {
							setOpen(null);
							runCommand("nav.persona");
							window.setTimeout(() => runCommand("persona.new"), 60);
						},
						children: "New persona"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
				label: "Library",
				open: open === "library",
				onOpen: () => choose(open === "library" ? null : "library"),
				onHover: () => open && choose("library"),
				children: [
					item("Show library", "nav.library"),
					item("Chat library", "nav.chats"),
					item("Import card…", "file.import")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
				label: "Chat",
				open: open === "chat",
				onOpen: () => choose(open === "chat" ? null : "chat"),
				onHover: () => open && choose("chat"),
				children: [item("Show chat", "nav.chat"), item("Chat library", "nav.chats")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				label: "Life",
				open: open === "life",
				onOpen: () => choose(open === "life" ? null : "life"),
				onHover: () => open && choose("life"),
				children: item("Show Life", "nav.life")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				label: "Lore",
				open: open === "lore",
				onOpen: () => choose(open === "lore" ? null : "lore"),
				onHover: () => open && choose("lore"),
				children: item("Lorebooks and world books", "nav.lore")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				label: "Presets",
				open: open === "preset",
				onOpen: () => choose(open === "preset" ? null : "preset"),
				onHover: () => open && choose("preset"),
				children: item("Show presets", "nav.preset")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
				label: "NovelAI",
				open: open === "novel",
				onOpen: () => choose(open === "novel" ? null : "novel"),
				onHover: () => open && choose("novel"),
				children: [
					item("Draw", "novel.draw"),
					item("Test NovelAI", "novel.test"),
					item("Use appearance", "novel.appearance"),
					item("Show NovelAI", "nav.novel")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
				label: "Settings",
				open: open === "settings",
				onOpen: () => choose(open === "settings" ? null : "settings"),
				onHover: () => open && choose("settings"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "menuitemcheckbox",
						"aria-checked": fillBlanks,
						className: "flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => setFillBlanks(!fillBlanks),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: `size-4 ${fillBlanks ? "opacity-100" : "opacity-0"}`,
							"aria-hidden": "true"
						}), "Fill empty fields only"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "menuitemcheckbox",
						"aria-checked": useImages,
						className: "flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => patchSettings({ useImages: !useImages }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: `size-4 ${useImages ? "opacity-100" : "opacity-0"}`,
							"aria-hidden": "true"
						}), "Send pictures to the model"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
					item("KoboldCPP…", "nav.card"),
					item("Appearance…", "nav.colors"),
					item("Lorebooks…", "nav.lore"),
					item("NovelAI generation…", "nav.novel"),
					item("Presets…", "nav.preset"),
					item("Library folder…", "file.libraryFolder"),
					item("Download folder…", "file.downloadFolder"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
					item("Save settings…", "file.saveSettings"),
					item("Load settings…", "file.loadSettings")
				]
			})
		]
	});
}
function Menu({ label, open, onOpen, onHover, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		onMouseEnter: onHover,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-haspopup": "menu",
			"aria-expanded": open,
			onClick: onOpen,
			className: `min-h-11 px-3 ${open ? "bg-surface-2 text-fg" : "text-fg"}`,
			children: label
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "menu",
			"aria-label": label,
			className: "absolute top-full left-0 z-40 min-w-56 border border-border bg-surface py-1 shadow-xl",
			children
		}) : null]
	});
}
function Divider() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-1 h-px bg-border",
		role: "separator"
	});
}
var DB_NAME = "cardwright-downloads";
var STORE = "meta";
var folderHandle = null;
var folderLabel = "";
function picker() {
	const candidate = window.showSaveFilePicker;
	if (typeof candidate !== "function") return null;
	return candidate;
}
function directoryPicker() {
	const candidate = window.showDirectoryPicker;
	if (typeof candidate !== "function") return null;
	return candidate;
}
function openDb() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => request.result.createObjectStore(STORE);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not open downloads."));
	});
}
async function storedFolder() {
	if (typeof indexedDB === "undefined") return null;
	try {
		const db = await openDb();
		const handle = await new Promise((resolve, reject) => {
			const request = db.transaction(STORE, "readonly").objectStore(STORE).get("folder");
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
		db.close();
		return handle ?? null;
	} catch {
		return null;
	}
}
async function rememberFolder(handle) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(handle, "folder");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}
function safeDownloadName(name) {
	return ((name.trim().split(/[\\/]/).pop() || "download").replace(/[<>:"|?*\u0000-\u001f]/g, "-").replace(/^\.+$/, "").trim() || "download").slice(0, 180);
}
async function downloadFolderLabel() {
	if (await isDesktopHost()) {
		folderLabel = (await (await fetch("/__downloads")).json().catch(() => ({}))).path || "";
		return folderLabel;
	}
	const handle = folderHandle ?? await storedFolder();
	if (!handle) return "";
	const permission = await handle.queryPermission?.({ mode: "readwrite" }).catch(() => "prompt");
	if (permission && permission !== "granted") return "";
	folderHandle = handle;
	folderLabel = handle.name;
	return handle.name;
}
async function chooseDownloadFolder() {
	if (await isDesktopHost()) {
		const response = await fetch("/__downloads/choose", { method: "POST" });
		const payload = await response.json().catch(() => ({}));
		if (!response.ok) throw new Error(payload.message || "Could not choose that folder.");
		if (payload.cancelled || !payload.path) return null;
		folderLabel = payload.path;
		return payload.path;
	}
	const choose = directoryPicker();
	if (!choose) throw new Error("Choosing a download folder is in the Windows app. This preview saves files with the browser download.");
	try {
		const handle = await choose({ mode: "readwrite" });
		await rememberFolder(handle);
		folderHandle = handle;
		folderLabel = handle.name;
		return handle.name;
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") return null;
		throw error instanceof Error ? error : /* @__PURE__ */ new Error("Could not use that folder.");
	}
}
async function writeToFolder(name, blob) {
	const safe = safeDownloadName(name);
	if (await isDesktopHost()) {
		const response = await fetch("/__downloads/file", {
			method: "POST",
			headers: {
				"Content-Type": blob.type || "application/octet-stream",
				"X-Filename": safe
			},
			body: blob
		});
		const payload = await response.json().catch(() => ({}));
		if (payload.missing) return false;
		if (!response.ok) throw new Error(payload.message || "Could not save that file.");
		return true;
	}
	const handle = folderHandle ?? await storedFolder();
	if (!handle) return false;
	const permission = await handle.queryPermission?.({ mode: "readwrite" }).catch(() => "prompt");
	if (permission && permission !== "granted") return false;
	folderHandle = handle;
	const writable = await (await handle.getFileHandle(safe, { create: true })).createWritable();
	await writable.write(blob);
	await writable.close();
	return true;
}
function anchorDownload(name, blob) {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = safeDownloadName(name);
	anchor.click();
	URL.revokeObjectURL(url);
}
async function saveNamedFile(name, blob) {
	const safe = safeDownloadName(name);
	if (await writeToFolder(safe, blob)) return safe;
	const choose = picker();
	if (choose) try {
		const writable = await (await choose({ suggestedName: safe })).createWritable();
		await writable.write(blob);
		await writable.close();
		return safe;
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") return "";
	}
	anchorDownload(safe, blob);
	return safe;
}
async function savePngFile(name, bytes) {
	const safe = safeDownloadName(name.toLowerCase().endsWith(".png") ? name : `${name}.png`);
	const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
	const blob = new Blob([copy], { type: "image/png" });
	if (await writeToFolder(safe, blob)) return safe;
	if (await isDesktopHost()) {
		const response = await fetch("/__save-png", {
			method: "POST",
			headers: {
				"Content-Type": "image/png",
				"X-Filename": safe
			},
			body: blob
		});
		const payload = await response.json().catch(() => ({}));
		if (response.ok) {
			if (payload.cancelled) return "";
			return payload.path || safe;
		}
		if (response.status !== 501) throw new Error(payload.message || "Could not save that file.");
	}
	return saveNamedFile(safe, blob);
}
var GALLERY_KEY = "novel-gallery";
var PLATE_KEY = "novel-style-plate";
function fileSlug(prompt) {
	return `${prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "novelai"}.png`;
}
function NovelTab({ settings, onSettings, appearance, onUsePortrait }) {
	const gen = novelGenOf(settings.novelGen);
	const prompt = useStudio((state) => state.novelPrompt);
	const setPrompt = useStudio((state) => state.setNovelPrompt);
	const plate = useStudio((state) => state.stylePlate);
	const setPlate = useStudio((state) => state.setStylePlate);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [shots, setShots] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [viewer, setViewer] = (0, import_react.useState)(null);
	const locked = busy !== null;
	const profile = styleProfile(gen.styleProfile);
	const v5 = (settings.novelModel ?? NOVEL_MODELS[0].id).startsWith("nai-diffusion-5");
	(0, import_react.useEffect)(() => {
		let cancel = false;
		async function loadGallery() {
			const heads = await vaultList("gallery");
			if (heads.length === 0) {
				const legacy = await loadJson(GALLERY_KEY);
				if (Array.isArray(legacy)) {
					for (const shot of legacy) if (shot?.id && typeof shot.dataUrl === "string") await vaultPut("gallery", shot.id, {
						...shot,
						updatedAt: shot.updatedAt ?? Date.now()
					});
				}
			}
			const nextHeads = heads.length === 0 ? await vaultList("gallery") : heads;
			const loaded = [];
			for (const head of nextHeads) {
				const shot = await vaultGet("gallery", head.id);
				if (shot && typeof shot.dataUrl === "string") loaded.push(shot);
			}
			loaded.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
			const style = await loadJson(PLATE_KEY);
			if (cancel) return;
			setShots(loaded);
			if (!useStudio.getState().stylePlate && typeof style === "string" && style.startsWith("data:image/")) useStudio.getState().setStylePlate(style);
			setReady(true);
		}
		loadGallery();
		const onVault = () => {
			loadGallery();
		};
		window.addEventListener("cardwright-vault", onVault);
		return () => {
			cancel = true;
			window.removeEventListener("cardwright-vault", onVault);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		saveJson(PLATE_KEY, plate);
	}, [plate, ready]);
	function patchGen(patch) {
		onSettings({ novelGen: {
			...gen,
			...patch
		} });
	}
	async function onDraw(nextPrompt = prompt) {
		setBusy("Drawing…");
		setError(null);
		setNotice(null);
		setPrompt(nextPrompt);
		try {
			const png = await drawNovelPortrait(settings.novelToken ?? "", nextPrompt, settings.novelModel ?? "", gen, plate && !v5 ? dataUrlPayload(plate) : null);
			const shot = {
				id: crypto.randomUUID(),
				name: fileSlug(nextPrompt),
				prompt: nextPrompt,
				dataUrl: pngDataUrl(png),
				updatedAt: Date.now()
			};
			await vaultPut("gallery", shot.id, shot);
			setShots((current) => [shot, ...current]);
			setViewer(shot);
			setNotice("Picture ready. It is full size here. Save it, or put it on the card.");
		} catch (err) {
			setError(novelFailure(err));
		} finally {
			setBusy(null);
		}
	}
	async function onSave(shot) {
		setError(null);
		try {
			const bytes = new Uint8Array(await (await fetch(shot.dataUrl)).arrayBuffer());
			const saved = await savePngFile(shot.name, bytes);
			setNotice(saved ? `Saved ${saved}.` : "Save cancelled.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save that picture.");
		}
	}
	function useAppearance() {
		if (!appearance) {
			setError("Write an appearance on the card, or type a prompt.");
			return;
		}
		setPrompt(appearance);
		setError(null);
	}
	const drawRef = (0, import_react.useRef)(onDraw);
	const appearanceRef = (0, import_react.useRef)(useAppearance);
	drawRef.current = onDraw;
	appearanceRef.current = useAppearance;
	(0, import_react.useEffect)(() => {
		const offDraw = onCommand("novel.draw", () => {
			drawRef.current();
		});
		const offTest = onCommand("novel.test", () => {
			drawRef.current("pepperoni pizza");
		});
		const offAppearance = onCommand("novel.appearance", () => appearanceRef.current());
		return () => {
			offDraw();
			offTest();
			offAppearance();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!viewer) return;
		const onKey = (event) => {
			if (event.key === "Escape") setViewer(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [viewer]);
	async function onPlate(file) {
		setError(null);
		try {
			const image = await fileToImage(file);
			setPlate(image.dataUrl);
			setNotice("Style plate set. It is sent with V4.5 draws.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "That style plate could not be read.");
		}
	}
	async function putOnCard(shot) {
		try {
			await onUsePortrait(shot.dataUrl, shot.name);
			setViewer(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not put that picture on the card.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_22rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex flex-col gap-4",
			children: [
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg",
					children: error
				}) : null,
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
					children: notice
				}) : null,
				busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: busy
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold text-fg",
							children: "Prompt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "drawPrompt",
							children: "Prompt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "drawPrompt",
							value: prompt,
							onChange: (event) => setPrompt(event.target.value),
							rows: 5,
							placeholder: "Tags or a sentence. Test NovelAI draws a pepperoni pizza.",
							className: "mt-2 min-h-28 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: useAppearance,
									className: "min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
									children: "Use appearance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: locked,
									onClick: () => void onDraw(),
									className: "flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg disabled:opacity-60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Draw"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: locked,
									onClick: () => void onDraw("pepperoni pizza"),
									className: "min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg disabled:opacity-60",
									children: "Test NovelAI"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: [
								"Requested size is ",
								gen.width,
								"×",
								gen.height,
								" unless character count changes it. A draw spends Anlas."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold text-fg",
							children: "Picture"
						}),
						shots[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setViewer(shots[0]),
									className: "block w-full overflow-hidden rounded-md bg-black",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: shots[0].dataUrl,
										alt: shots[0].prompt,
										className: "mx-auto max-h-[70vh] w-full object-contain"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void onSave(shots[0]),
										className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Save"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void putOnCard(shots[0]),
										className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
											className: "size-4 text-gold",
											"aria-hidden": "true"
										}), "Use on card"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted",
									children: "Click the picture for a full-window view. Save asks where to put a copy. Every drawing is also kept in the library, with no slot cap."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: ready ? "A drawing shows here at full size." : "Loading pictures…"
						}),
						shots.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 grid grid-cols-4 gap-2",
							children: shots.slice(1, 13).map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setViewer(shot),
								className: "block w-full overflow-hidden rounded-md border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: shot.dataUrl,
									alt: "",
									className: "aspect-square w-full object-cover"
								})
							}) }, shot.id))
						}) : null
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex max-h-none flex-col gap-4 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 font-display text-lg font-semibold text-fg",
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "novelToken",
						className: "text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Persistent token"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "novelToken",
						type: "password",
						value: settings.novelToken ?? "",
						onChange: (event) => onSettings({ novelToken: event.target.value }),
						className: inputClass$1,
						autoComplete: "off",
						spellCheck: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "The pst- token stays on this computer and is sent only to NovelAI."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "novelModel",
						className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Model"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "novelModel",
						value: settings.novelModel ?? NOVEL_MODELS[0].id,
						onChange: (event) => onSettings({ novelModel: event.target.value }),
						className: inputClass$1,
						children: NOVEL_MODELS.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: model.id,
							children: model.label
						}, model.id))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				open: true,
				className: "rounded-lg border border-border bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer font-display text-lg font-semibold text-fg",
						children: "NovelAI generation setup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Prompt prefixes, sampler, noise schedule, steps, guidance, and seed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Seed -1 keeps generation random. Any non-negative seed is reused exactly."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSettings({ novelGen: { ...DEFAULT_NOVEL_GEN } }),
							className: "flex min-h-11 shrink-0 items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
								className: "size-3.5",
								"aria-hidden": "true"
							}), "Reset"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
								id: "novelSeed",
								label: "Seed",
								value: gen.seed,
								min: -1,
								max: 4294967295,
								onChange: (seed) => patchGen({ seed })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "styleProfile",
										className: "text-xs font-semibold tracking-wide text-muted uppercase",
										children: "Style profile"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => patchGen({
											styleProfile: "anime",
											promptPrefix: styleProfile("anime").prefix,
											negativePrefix: styleProfile("anime").negative
										}),
										className: "min-h-11 rounded-full border border-border px-3 text-xs font-semibold text-fg",
										children: "Use Danbooru / Illustrious"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "styleProfile",
									value: gen.styleProfile,
									onChange: (event) => patchGen({ styleProfile: event.target.value }),
									className: inputClass$1,
									children: STYLE_PROFILES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.label
									}, item.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted",
									children: ["Suggested from model/source: ", profile.source]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
								id: "novelSteps",
								label: "Steps",
								value: gen.steps,
								min: 1,
								max: 50,
								onChange: (steps) => patchGen({ steps })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
								id: "novelGuidance",
								label: "Prompt guidance",
								value: gen.guidance,
								min: 0,
								max: 10,
								step: .1,
								onChange: (guidance) => patchGen({ guidance })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
								id: "novelRescale",
								label: "Guidance rescale",
								value: gen.guidanceRescale,
								min: 0,
								max: 1,
								step: .05,
								onChange: (guidanceRescale) => patchGen({ guidanceRescale })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
								id: "novelUc",
								label: "UC preset",
								value: gen.ucPreset,
								min: 0,
								max: 4,
								onChange: (ucPreset) => patchGen({ ucPreset })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "UC preset: 0 heavy, 1 light, 2 human focus, 3 none, 4 as in your setup."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "promptPrefix",
						className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Prompt prefix"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "promptPrefix",
						value: gen.promptPrefix,
						onChange: (event) => patchGen({ promptPrefix: event.target.value }),
						rows: 2,
						placeholder: "e.g. masterpiece, best quality",
						className: "mt-1 min-h-16 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "negativePrefix",
						className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Negative prefix"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "negativePrefix",
						value: gen.negativePrefix,
						onChange: (event) => patchGen({ negativePrefix: event.target.value }),
						rows: 2,
						placeholder: "e.g. low quality, blurry",
						className: "mt-1 min-h-16 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							id: "novelSampler",
							label: "Sampler",
							value: gen.sampler,
							onChange: (sampler) => patchGen({ sampler })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							id: "novelSchedule",
							label: "Noise schedule",
							value: gen.noiseSchedule,
							onChange: (noiseSchedule) => patchGen({ noiseSchedule })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-md border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-start gap-2 text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: gen.sizeFromCount,
								onChange: (event) => patchGen({ sizeFromCount: event.target.checked }),
								className: "mt-1 size-4 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "Choose resolution from character count"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted",
								children: "Uses portrait for one subject, square for two, and landscape for three or more. Free-form prompts without a detectable count keep the requested size."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
								id: "novelWidth",
								label: "Width",
								value: gen.width,
								min: 64,
								max: 1600,
								step: 64,
								onChange: (width) => patchGen({ width })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
								id: "novelHeight",
								label: "Height",
								value: gen.height,
								min: 64,
								max: 1600,
								step: 64,
								onChange: (height) => patchGen({ height })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-md border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-fg",
									children: "NovelAI V4.5 style plate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: "A persistent style-only reference applied first to every V4.5 generation, including scenes without characters."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-h-11 shrink-0 cursor-pointer items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-fg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
											className: "size-3.5",
											"aria-hidden": "true"
										}),
										"Choose image",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/png,image/jpeg,image/webp",
											className: "sr-only",
											onChange: (event) => {
												const file = event.target.files?.[0];
												if (file) onPlate(file);
												event.target.value = "";
											}
										})
									]
								})]
							}),
							plate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-3 w-24",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: plate,
									alt: "",
									className: "aspect-square w-full rounded-md object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Remove style plate",
									onClick: () => setPlate(null),
									className: "absolute top-1 right-1 flex size-11 items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-6 items-center justify-center rounded-md bg-bg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
											className: "size-3.5",
											"aria-hidden": "true"
										})
									})
								})]
							}) : null,
							v5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "V5 does not take a style plate. Switch to V4.5 to use it."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
									id: "styleStrength",
									label: "Style strength",
									value: gen.styleStrength,
									min: 0,
									max: 1,
									step: .05,
									onChange: (styleStrength) => patchGen({ styleStrength })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
									id: "styleFidelity",
									label: "Style fidelity",
									value: gen.styleFidelity,
									min: 0,
									max: 1,
									step: .05,
									onChange: (styleFidelity) => patchGen({ styleFidelity })
								})]
							})
						]
					})
				]
			})]
		})]
	}), viewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-black/92",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Generated picture",
		onClick: () => setViewer(null),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-end gap-2 p-3",
			onClick: (event) => event.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void onSave(viewer),
					className: "flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "size-4",
						"aria-hidden": "true"
					}), "Save"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void putOnCard(viewer),
					className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
						className: "size-4 text-gold",
						"aria-hidden": "true"
					}), "Use on card"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setViewer(null),
					className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-4",
						"aria-hidden": "true"
					}), "Close"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: viewer.dataUrl,
			alt: viewer.prompt,
			className: "min-h-0 w-full flex-1 object-contain",
			onClick: (event) => event.stopPropagation()
		})]
	}) : null] });
}
var inputClass$1 = "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg";
function NumberField({ id, label, value, min, max, step = 1, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "text-xs font-semibold tracking-wide text-muted uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		type: "number",
		min,
		max,
		step,
		value: Number.isFinite(value) ? value : 0,
		onChange: (event) => onChange(event.target.value === "" ? min : Number(event.target.value)),
		className: inputClass$1
	})] });
}
function TextField({ id, label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "text-xs font-semibold tracking-wide text-muted uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		value,
		onChange: (event) => onChange(event.target.value),
		spellCheck: false,
		className: inputClass$1
	})] });
}
var PNG_SIGNATURE = [
	137,
	80,
	78,
	71,
	13,
	10,
	26,
	10
];
function crc32(bytes) {
	let crc = 4294967295;
	for (const byte of bytes) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit += 1) crc = crc >>> 1 ^ 3988292384 & -(crc & 1);
	}
	return ~crc >>> 0;
}
function chunk(type, data) {
	const out = new Uint8Array(12 + data.length);
	const view = new DataView(out.buffer);
	view.setUint32(0, data.length);
	out.set(new TextEncoder().encode(type), 4);
	out.set(data, 8);
	view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
	return out;
}
function isPng(bytes) {
	return PNG_SIGNATURE.every((value, index) => bytes[index] === value);
}
function findChunk(bytes, type) {
	if (!isPng(bytes)) throw new Error("That file is not a PNG.");
	let offset = 8;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	while (offset + 8 <= bytes.length) {
		const length = view.getUint32(offset);
		if (String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]) === type) return offset;
		offset += 12 + length;
	}
	throw new Error("That PNG is missing its ending.");
}
function injectTextChunk(png, keyword, text) {
	const start = findChunk(png, "IEND");
	const payload = new Uint8Array(keyword.length + 1 + text.length);
	payload.set(new TextEncoder().encode(keyword), 0);
	payload.set(new TextEncoder().encode(text), keyword.length + 1);
	const extra = chunk("tEXt", payload);
	const out = new Uint8Array(png.length + extra.length);
	out.set(png.subarray(0, start), 0);
	out.set(extra, start);
	out.set(png.subarray(start), start + extra.length);
	return out;
}
function readTextChunk(png, keyword) {
	if (!isPng(png)) return null;
	const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
	let offset = 8;
	while (offset + 12 <= png.length) {
		const length = view.getUint32(offset);
		const name = String.fromCharCode(png[offset + 4], png[offset + 5], png[offset + 6], png[offset + 7]);
		const dataStart = offset + 8;
		const dataEnd = dataStart + length;
		if (dataEnd + 4 > png.length) return null;
		if (name === "tEXt") {
			const data = png.subarray(dataStart, dataEnd);
			const split = data.indexOf(0);
			if (new TextDecoder().decode(split >= 0 ? data.subarray(0, split) : data) === keyword) return new TextDecoder().decode(split >= 0 ? data.subarray(split + 1) : /* @__PURE__ */ new Uint8Array());
		}
		offset = dataEnd + 4;
	}
	return null;
}
function encodeBase64(bytes) {
	let binary = "";
	const step = 32768;
	for (let index = 0; index < bytes.length; index += step) binary += String.fromCharCode(...bytes.subarray(index, index + step));
	return btoa(binary);
}
function decodeBase64(value) {
	const binary = atob(value);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}
function loadHtmlImage(src) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(/* @__PURE__ */ new Error("Could not draw the reference picture."));
		image.src = src;
	});
}
async function canvasPng(width, height, draw) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not draw the card.");
	draw(ctx);
	const blob = await new Promise((resolve, reject) => {
		canvas.toBlob((result) => result ? resolve(result) : reject(/* @__PURE__ */ new Error("Could not encode the card PNG.")), "image/png");
	});
	return new Uint8Array(await blob.arrayBuffer());
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
	const words = text.split(/\s+/);
	let line = "";
	let cursor = y;
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (ctx.measureText(next).width > maxWidth && line) {
			ctx.fillText(line, x, cursor);
			line = word;
			cursor += lineHeight;
		} else line = next;
	}
	if (line) ctx.fillText(line, x, cursor);
}
async function renderCardArt(card, portrait) {
	if (portrait) {
		const image = await loadHtmlImage(portrait);
		const scale = Math.min(1, 1024 / Math.max(image.naturalWidth, image.naturalHeight));
		const width = Math.max(1, Math.round(image.naturalWidth * scale));
		const height = Math.max(1, Math.round(image.naturalHeight * scale));
		return canvasPng(width, height, (ctx) => {
			ctx.drawImage(image, 0, 0, width, height);
			const band = Math.max(48, Math.round(height * .12));
			const fade = ctx.createLinearGradient(0, height - band, 0, height);
			fade.addColorStop(0, "rgba(18, 16, 14, 0)");
			fade.addColorStop(1, "rgba(18, 16, 14, 0.82)");
			ctx.fillStyle = fade;
			ctx.fillRect(0, height - band, width, band);
			ctx.fillStyle = "#f6f1ea";
			ctx.font = `600 ${Math.max(18, Math.round(width / 18))}px Georgia, serif`;
			ctx.fillText(card.name.trim() || "Unnamed", 16, height - 18);
		});
	}
	return canvasPng(768, 1024, (ctx) => {
		ctx.fillStyle = "#f6f1ea";
		ctx.fillRect(0, 0, 768, 1024);
		ctx.fillStyle = "#d4654a";
		ctx.fillRect(48, 64, 72, 6);
		ctx.fillStyle = "#231c16";
		ctx.font = "600 54px Georgia, serif";
		wrapText(ctx, card.name.trim() || "Unnamed", 48, 140, 670, 64);
		ctx.font = "28px Georgia, serif";
		ctx.fillStyle = "#5c5148";
		wrapText(ctx, card.summary.trim() || "Character card", 48, 280, 670, 40);
	});
}
async function buildCharacterPng(card, portrait) {
	const png = injectTextChunk(await renderCardArt(card, portrait), "chara", encodeBase64(new TextEncoder().encode(JSON.stringify(toCharacterCardV2(card)))));
	const bytes = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength);
	return new Blob([bytes], { type: "image/png" });
}
function readCharacterPng(bytes) {
	const payload = readTextChunk(bytes, "chara");
	if (!payload) throw new Error("That PNG does not contain a character card.");
	try {
		return JSON.parse(decodeBase64(payload));
	} catch {
		throw new Error("The card hidden in that PNG could not be read.");
	}
}
var FIELDS$1 = [
	{
		key: "description",
		label: "Description",
		hint: "Who you are in the chat. Sent every turn.",
		rows: 6
	},
	{
		key: "personality",
		label: "Personality",
		hint: "Temperament, habits, and how you speak.",
		rows: 4
	},
	{
		key: "backstory",
		label: "Backstory",
		hint: "Origin and relationships that stay true.",
		rows: 4
	},
	{
		key: "appearance",
		label: "Appearance",
		hint: "What the other character can see.",
		rows: 4
	},
	{
		key: "scenario",
		label: "Scenario",
		hint: "The situation you usually walk into.",
		rows: 3
	},
	{
		key: "mes_example",
		label: "Example dialogue",
		hint: "How you talk. Separate exchanges with <START>.",
		rows: 5
	},
	{
		key: "creator_notes",
		label: "Creator notes",
		hint: "For you. Marinara does not send this.",
		rows: 3
	}
];
var STARTERS = [
	{
		label: "Night nurse",
		text: "A night-shift nurse who still makes tea for whoever is awake, and never asks why they are."
	},
	{
		label: "Flood courier",
		text: "A courier in a flooded city who knows every shortcut and none of the headlines."
	},
	{
		label: "Quiet archivist",
		text: "A quiet archivist who answers questions with the exact page, and almost never with an opinion."
	}
];
function downloadBlob(filename, blob) {
	saveNamedFile(filename, blob);
}
function PersonaTab() {
	const persona = useStudio((state) => state.persona);
	const concept = useStudio((state) => state.personaConcept);
	const fillBlanks = useStudio((state) => state.personaFillBlanks);
	const personas = useStudio((state) => state.personas);
	const draftId = useStudio((state) => state.personaDraftId);
	const settings = useStudio((state) => state.settings);
	const theme = useStudio((state) => state.theme);
	const setConcept = useStudio((state) => state.setPersonaConcept);
	const patchPersona = useStudio((state) => state.patchPersona);
	const applyGenerated = useStudio((state) => state.applyGeneratedPersona);
	const setFillBlanks = useStudio((state) => state.setPersonaFillBlanks);
	const savePersona = useStudio((state) => state.savePersona);
	const loadPersona = useStudio((state) => state.loadPersona);
	const removePersona = useStudio((state) => state.removePersona);
	const newPersona = useStudio((state) => state.newPersona);
	const [media, setMedia] = (0, import_react.useState)(EMPTY_MEDIA);
	const [mediaReady, setMediaReady] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const booted = (0, import_react.useRef)(false);
	const portrait = portraitOf(media);
	const locked = busy !== null;
	(0, import_react.useEffect)(() => {
		let cancel = false;
		const key = !booted.current ? draftId ? `persona:${draftId}` : "persona-current" : draftId ? `persona:${draftId}` : null;
		booted.current = true;
		if (!key) {
			setMediaReady(true);
			return;
		}
		setMediaReady(false);
		loadMedia(key).then((record) => {
			if (cancel) return;
			setMedia(record);
			setMediaReady(true);
		});
		return () => {
			cancel = true;
		};
	}, [draftId]);
	(0, import_react.useEffect)(() => {
		if (!mediaReady) return;
		saveMedia("persona-current", media);
		if (draftId) saveMedia(`persona:${draftId}`, media);
	}, [
		media,
		mediaReady,
		draftId
	]);
	async function onWrite() {
		setBusy("Writing the persona…");
		setError(null);
		setNotice(null);
		try {
			const pictures = settings.useImages === false ? [] : media.images.map((image) => image.dataUrl);
			const next = await generatePersona(settings, concept, pictures);
			applyGenerated(next);
			setNotice(fillBlanks ? "Filled the empty persona fields." : "Replaced the persona with a new draft.");
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	async function onRewrite(field) {
		setBusy("Rewriting…");
		setError(null);
		try {
			const pictures = field === "appearance" || field === "description" ? media.images.map((image) => image.dataUrl) : [];
			const value = await rewriteField(settings, `User persona. ${concept}`, persona, field, pictures);
			patchPersona({ [field]: value });
			setNotice("Updated that field.");
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	function onKeep() {
		saveMedia(`persona:${savePersona()}`, media);
		setNotice("Kept this persona.");
		setError(null);
	}
	function onNew() {
		newPersona();
		setMedia(EMPTY_MEDIA);
		setNotice(null);
		setError(null);
	}
	function onExport() {
		downloadBlob(`${slugName(persona.name)}-persona.json`, new Blob([JSON.stringify(toCharacterCardV2(persona), null, 2)], { type: "application/json" }));
		setNotice("Downloaded a persona JSON. Marinara imports it from the Personas panel.");
	}
	async function onExportPng() {
		setBusy("Packing the PNG…");
		setError(null);
		try {
			const blob = await buildCharacterPng(persona, portrait?.dataUrl ?? null);
			downloadBlob(`${slugName(persona.name)}-persona.png`, blob);
			setNotice("Downloaded a PNG with the persona stored inside.");
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	function onImport(file) {
		const reader = new FileReader();
		const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
		reader.onload = () => {
			try {
				if (isPng) {
					const parsed = readCharacterPng(new Uint8Array(reader.result));
					useStudio.setState({
						persona: cardFromUnknown(parsed),
						personaDraftId: null
					});
					fileToImage(new File([file], file.name, { type: "image/png" })).then((image) => {
						setMedia({
							images: [image],
							portraitId: image.id
						});
					});
				} else useStudio.setState({
					persona: cardFromUnknown(JSON.parse(String(reader.result))),
					personaDraftId: null
				});
				setNotice(`Loaded ${file.name}.`);
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : "That file is not a persona card.");
			}
		};
		if (isPng) reader.readAsArrayBuffer(file);
		else reader.readAsText(file);
	}
	const writeRef = (0, import_react.useRef)(onWrite);
	const keepRef = (0, import_react.useRef)(onKeep);
	const newRef = (0, import_react.useRef)(onNew);
	writeRef.current = onWrite;
	keepRef.current = onKeep;
	newRef.current = onNew;
	(0, import_react.useEffect)(() => {
		const stops = [
			onCommand("persona.write", () => void writeRef.current()),
			onCommand("persona.keep", () => keepRef.current()),
			onCommand("persona.new", () => newRef.current())
		];
		return () => stops.forEach((stop) => stop());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold text-fg",
								children: "Who you are"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "personaConcept",
								children: "Persona concept"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "personaConcept",
								value: concept,
								onChange: (event) => setConcept(event.target.value),
								rows: 4,
								placeholder: "A sentence about the person you play. Not the character you talk to.",
								className: "mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: locked,
								onClick: () => void onWrite(),
								className: "mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Write the persona"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex min-h-11 items-center gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: fillBlanks,
									onChange: (event) => setFillBlanks(event.target.checked),
									className: "size-4 accent-primary"
								}), "Fill empty fields only"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-col gap-2",
								children: STARTERS.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setConcept(sample.text),
									className: "min-h-11 rounded-md border border-border bg-surface-2 px-3 text-left text-sm text-fg",
									children: sample.label
								}, sample.label))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold text-fg",
								children: "Portrait"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-bg px-3 py-3 text-center text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
										className: "size-5 text-gold",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: portrait ? "Replace portrait" : "Add a portrait" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/png,image/jpeg,image/webp",
										className: "sr-only",
										onChange: (event) => {
											const file = event.target.files?.[0];
											event.target.value = "";
											if (!file) return;
											fileToImage(file).then((image) => setMedia({
												images: [image],
												portraitId: image.id
											})).catch((err) => setError(err instanceof Error ? err.message : "Could not read that picture."));
										}
									})
								]
							}),
							portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: portrait.dataUrl,
								alt: "",
								className: "mt-3 aspect-square w-full rounded-md object-cover"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold text-fg",
								children: "Saved personas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: onKeep,
									className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Keep"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: onNew,
									className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										className: "size-4",
										"aria-hidden": "true"
									}), "New"]
								})]
							}),
							personas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: "Kept personas stay on this computer."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 flex flex-col gap-2",
								children: personas.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => loadPersona(item.id),
										className: "min-h-11 flex-1 truncate rounded-md px-2 text-left text-sm text-fg",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Remove ${item.name}`,
										onClick: () => {
											removePersona(item.id);
											deleteMedia(`persona:${item.id}`);
										},
										className: "flex size-11 items-center justify-center rounded-md text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "size-4",
											"aria-hidden": "true"
										})
									})]
								}, item.id))
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg",
						children: error
					}) : null,
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
						children: notice
					}) : null,
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: busy
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "personaName",
						className: "text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "personaName",
						value: persona.name,
						onChange: (event) => patchPersona({ name: event.target.value }),
						className: "mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "personaSummary",
						className: "text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "personaSummary",
						value: persona.summary,
						onChange: (event) => patchPersona({ summary: event.target.value }),
						className: "mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-semibold",
								children: "Chat colors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "These colors travel with the persona and color your messages."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatColors, {
									look: persona.chatLook,
									theme: {
										...DEFAULT_THEME,
										...theme
									},
									name: persona.name,
									onChange: (chatLook) => patchPersona({ chatLook })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "personaAliases",
								className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: ["Aliases", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "personaAliases",
									value: persona.aliases ?? "",
									rows: 3,
									placeholder: "Other names, one per line.",
									onChange: (event) => patchPersona({ aliases: event.target.value }),
									className: "mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg normal-case"
								})]
							})
						]
					}),
					FIELDS$1.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-end justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: `persona-${field.key}`,
								className: "text-xs font-semibold tracking-wide text-muted uppercase",
								children: field.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: locked,
								onClick: () => void onRewrite(field.key),
								className: "min-h-11 shrink-0 rounded-md px-2 text-xs font-semibold text-gold disabled:opacity-60",
								children: "Rewrite"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: `persona-${field.key}`,
							value: persona[field.key],
							onChange: (event) => patchPersona({ [field.key]: event.target.value }),
							rows: field.rows,
							className: "min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								field.hint,
								" · ",
								wordCount(persona[field.key]),
								" words"
							]
						})
					] }, field.key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "personaTags",
						className: "text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Tags"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "personaTags",
						value: tagsToText(persona.tags),
						onChange: (event) => patchPersona({ tags: textToTags(event.target.value) }),
						className: "mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg",
						placeholder: "original, quiet, city"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 pb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onExport,
								className: "flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Download JSON"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: locked,
								onClick: () => void onExportPng(),
								className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Download PNG"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										className: "size-4",
										"aria-hidden": "true"
									}),
									"Import",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "application/json,.json,image/png,.png",
										className: "sr-only",
										onChange: (event) => {
											const file = event.target.files?.[0];
											if (file) onImport(file);
											event.target.value = "";
										}
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "lg:sticky lg:top-4 lg:self-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg bg-paper p-5 text-ink shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-wide text-ink-soft uppercase",
							children: "Persona"
						}),
						portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: portrait.dataUrl,
							alt: "",
							className: "mt-3 aspect-square w-full rounded-md object-cover"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-semibold text-ink",
							children: persona.name.trim() || "Unnamed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink-soft",
							children: persona.summary.trim() || "No summary yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-4 border-gold" }),
						persona.description.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm whitespace-pre-wrap text-ink",
							children: persona.description
						}) : null,
						persona.tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-ink-soft",
							children: persona.tags.join(" · ")
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted",
					children: [
						"A persona is the card for you. Marinara sends it so the other character knows who they are talking to. Use ",
						"{{user}}",
						" for this name."
					]
				})]
			})
		]
	});
}
function LibraryLocation() {
	const [info, setInfo] = (0, import_react.useState)(null);
	const [downloads, setDownloads] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const refresh = () => {
			vaultInfo().then(setInfo);
			downloadFolderLabel().then(setDownloads).catch(() => setDownloads(""));
		};
		refresh();
		window.addEventListener("cardwright-vault", refresh);
		window.addEventListener("cardwright-downloads", refresh);
		return () => {
			window.removeEventListener("cardwright-vault", refresh);
			window.removeEventListener("cardwright-downloads", refresh);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3 rounded-lg border border-border bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold text-fg",
						children: "Where cards and pictures are saved"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-gold",
						children: info?.label ?? "Checking…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: info?.detail ?? "There is no slot limit. Each card and picture is its own file."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => runCommand("file.libraryFolder"),
				className: "flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, {
					className: "size-4",
					"aria-hidden": "true"
				}), "Choose folder"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold text-fg",
						children: "Download folder"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-gold",
						children: downloads || "Not chosen yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "JSON cards, PNG cards, and pictures are written here when a folder is set."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => runCommand("file.downloadFolder"),
				className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, {
					className: "size-4",
					"aria-hidden": "true"
				}), "Choose folder"]
			})]
		})]
	});
}
function isRecord$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function turnsFrom$1(raw) {
	if (!Array.isArray(raw)) return [];
	const turns = [];
	for (const entry of raw) {
		if (!isRecord$1(entry) || entry.role !== "user" && entry.role !== "assistant") continue;
		if (typeof entry.text !== "string" || typeof entry.id !== "string") continue;
		const image = typeof entry.image === "string" && entry.image.startsWith("data:image/") ? entry.image : null;
		const swiped = readTurnSwipes(entry.swipes, entry.swipe, entry.text, image);
		turns.push({
			id: entry.id,
			role: entry.role,
			text: swiped.text,
			image: swiped.image,
			swipes: swiped.swipes,
			swipe: swiped.swipe,
			speakerId: typeof entry.speakerId === "string" ? entry.speakerId : null,
			speakerName: typeof entry.speakerName === "string" ? entry.speakerName : null
		});
	}
	return turns;
}
function savedChatFrom(raw, id) {
	if (!isRecord$1(raw) || !isRecord$1(raw.card)) return null;
	const ids = (value) => Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
	const card = cardFromUnknown(raw.card);
	const cardKey = typeof raw.cardKey === "string" ? raw.cardKey : null;
	const mode = raw.replyMode === "named" || raw.replyMode === "round" || raw.replyMode === "everyone" || raw.replyMode === "pick" ? raw.replyMode : "pick";
	return {
		id: typeof raw.id === "string" ? raw.id : id,
		title: typeof raw.title === "string" && raw.title.trim() ? raw.title : "Untitled chat",
		cardName: typeof raw.cardName === "string" ? raw.cardName : "Character",
		updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
		card,
		persona: raw.persona ? cardFromUnknown(raw.persona) : null,
		messages: turnsFrom$1(raw.messages),
		memory: typeof raw.memory === "string" ? raw.memory : "",
		loreIds: ids(raw.loreIds),
		worldIds: ids(raw.worldIds),
		cardKey,
		cast: castFrom(raw.cast, card, cardKey),
		speakerId: typeof raw.speakerId === "string" ? raw.speakerId : cardKey,
		replyMode: mode,
		facts: factsFrom(raw.facts),
		ltm: raw.ltm !== false,
		tracker: trackerFrom(raw.tracker),
		track: raw.track !== false,
		knowledge: raw.knowledge === "retrieval" ? "retrieval" : "keywords",
		knowledgeLimit: typeof raw.knowledgeLimit === "number" ? Math.max(5, Math.min(80, Math.round(raw.knowledgeLimit))) : 30,
		authorNote: typeof raw.authorNote === "string" ? raw.authorNote : "",
		authorDepth: typeof raw.authorDepth === "number" ? Math.max(0, Math.min(12, Math.round(raw.authorDepth))) : 2
	};
}
function factsFrom(raw) {
	if (!Array.isArray(raw)) return [];
	const facts = [];
	for (const entry of raw) {
		if (!isRecord$1(entry) || typeof entry.text !== "string" || !entry.text.trim()) continue;
		facts.push({
			id: typeof entry.id === "string" ? entry.id : crypto.randomUUID(),
			text: entry.text.trim()
		});
	}
	return facts;
}
function trackerFrom(raw) {
	if (!Array.isArray(raw)) return [];
	const rows = [];
	for (const entry of raw) {
		if (!isRecord$1(entry) || typeof entry.name !== "string") continue;
		rows.push({
			id: typeof entry.id === "string" ? entry.id : crypto.randomUUID(),
			name: entry.name,
			present: entry.present !== false,
			where: typeof entry.where === "string" ? entry.where : "",
			doing: typeof entry.doing === "string" ? entry.doing : ""
		});
	}
	return rows;
}
function castFrom(raw, card, cardKey) {
	if (!Array.isArray(raw)) return [{
		id: cardKey || "primary",
		card
	}];
	const members = [];
	for (const entry of raw) {
		if (!isRecord$1(entry) || !entry.card) continue;
		members.push({
			id: typeof entry.id === "string" ? entry.id : crypto.randomUUID(),
			card: cardFromUnknown(entry.card)
		});
	}
	return members.length ? members : [{
		id: cardKey || "primary",
		card
	}];
}
async function loadChatHeads() {
	return (await vaultList("chats")).map((head) => ({
		id: head.id,
		title: head.name || "Untitled chat",
		cardName: "",
		updatedAt: head.updatedAt
	})).sort((a, b) => b.updatedAt - a.updatedAt);
}
async function loadChatSummaries() {
	const heads = await vaultList("chats");
	const items = [];
	for (const head of heads) {
		const summary = chatSummaryFrom(await vaultGet("chats", head.id), head.id);
		if (summary) items.push(summary);
	}
	return items.sort((a, b) => b.updatedAt - a.updatedAt);
}
async function loadChat(id) {
	return savedChatFrom(await vaultGet("chats", id), id);
}
async function saveChat(chat) {
	const next = {
		...chat,
		card: cloneCard(chat.card),
		persona: chat.persona ? cloneCard(chat.persona) : null,
		name: chat.title,
		updatedAt: Date.now()
	};
	await vaultPut("chats", chat.id, next);
}
async function deleteChatRecord(id) {
	await vaultDelete("chats", id);
}
var CARD_ACCEPT = "application/json,.json,image/png,.png";
function settleView() {
	window.scrollTo(0, 0);
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}
function pickBrowserFile(accept) {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = accept;
		input.tabIndex = -1;
		input.setAttribute("aria-hidden", "true");
		input.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;margin:0;padding:0;opacity:0;overflow:hidden;";
		let done = false;
		const finish = (file) => {
			if (done) return;
			done = true;
			input.remove();
			settleView();
			resolve(file);
		};
		input.addEventListener("change", () => finish(input.files?.[0] ?? null));
		input.addEventListener("cancel", () => finish(null));
		document.body.appendChild(input);
		input.click();
	});
}
async function pickCardFile() {
	settleView();
	if (await isDesktopHost()) {
		const response = await fetch("/__pick-card", { method: "POST" });
		const payload = await response.json().catch(() => ({}));
		settleView();
		if (!response.ok) throw new Error(payload.message || "Could not open that card.");
		if (payload.cancelled || !payload.data) return null;
		const binary = atob(payload.data);
		const bytes = new Uint8Array(binary.length);
		for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
		return new File([bytes], payload.name || "card.json", { type: payload.type || "application/octet-stream" });
	}
	return pickBrowserFile(CARD_ACCEPT);
}
function LibraryTab({ cards, personas, kind, onKind, onOpenCard, onOpenPersona, onChatCard, onChatPersona, onDeleteCard, onDeletePersona, onImportCard, onContinueChat }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [importError, setImportError] = (0, import_react.useState)(null);
	const source = kind === "cards" ? cards : personas;
	const needle = query.trim().toLowerCase();
	const items = source.filter((item) => {
		if (!needle) return true;
		return [
			item.name,
			item.card.summary,
			item.card.description,
			item.card.tags.join(" ")
		].join(" ").toLowerCase().includes(needle);
	});
	const kindClass = (selected) => `min-h-11 rounded-md px-4 text-sm font-semibold ${selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryLocation, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold text-fg",
					children: "Library"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: kind === "chats" ? "No slot limit. Saved chats stay in the folder above." : "No slot limit. Cards, personas, pictures, and chats stay in the folder above."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": kind === "cards",
							onClick: () => onKind("cards"),
							className: kindClass(kind === "cards"),
							children: "Cards"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": kind === "personas",
							onClick: () => onKind("personas"),
							className: kindClass(kind === "personas"),
							children: "Personas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": kind === "chats",
							onClick: () => onKind("chats"),
							className: kindClass(kind === "chats"),
							children: "Chats"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": kind === "pictures",
							onClick: () => onKind("pictures"),
							className: kindClass(kind === "pictures"),
							children: "Pictures"
						}),
						kind === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setImportError(null);
								pickCardFile().then((file) => {
									if (file) onImportCard(file);
								}).catch((err) => setImportError(err instanceof Error ? err.message : "Could not open that card."));
							},
							className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Import"]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "relative block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "Search the library"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: kind === "cards" ? "Search cards" : kind === "personas" ? "Search personas" : kind === "chats" ? "Search chats" : "Search pictures",
						className: "min-h-11 w-full rounded-md border border-border bg-surface pr-3 pl-10 text-sm text-fg"
					})
				]
			}),
			importError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-md border border-primary bg-surface px-3 py-2 text-sm",
				children: importError
			}) : null,
			kind === "pictures" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureGrid, { query: needle }) : kind === "chats" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatLibrary, {
				query: needle,
				onContinue: onContinueChat
			}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted",
				children: source.length === 0 ? kind === "cards" ? "Keep a card from the Card tab and it will show up here." : "Keep a persona from the Persona tab and it will show up here." : "Nothing matches that search."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex h-full flex-col rounded-lg bg-paper p-4 text-ink shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { mediaKey: kind === "cards" ? item.id : `persona:${item.id}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-2xl font-semibold text-ink",
							children: item.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-3 text-sm text-ink-soft",
							children: item.card.summary.trim() || "No summary."
						}),
						item.card.tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-ink-soft",
							children: item.card.tags.slice(0, 4).join(" · ")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => kind === "cards" ? onOpenCard(item.id) : onOpenPersona(item.id),
									className: "min-h-11 rounded-md bg-ink px-3 text-sm font-semibold text-paper",
									children: "Open"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => kind === "cards" ? onChatCard(item) : onChatPersona(item),
									className: "flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Chat"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										const blob = new Blob([JSON.stringify(toCharacterCardV2(item.card), null, 2)], { type: "application/json" });
										saveNamedFile(`${slugName(item.name)}.json`, blob);
									},
									className: "flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
										className: "size-4",
										"aria-hidden": "true"
									}), "JSON"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Delete ${item.name}`,
									onClick: () => kind === "cards" ? onDeleteCard(item.id) : onDeletePersona(item.id),
									className: "flex size-11 items-center justify-center rounded-md text-ink-soft",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-4",
										"aria-hidden": "true"
									})
								})
							]
						})
					]
				}) }, item.id))
			})
		]
	});
}
function ChatLibrary({ query, onContinue }) {
	const chatIndex = useStudio((state) => state.chatIndex);
	const setChatIndex = useStudio((state) => state.setChatIndex);
	const activeId = useStudio((state) => state.chatId);
	const activeTitle = useStudio((state) => state.chatTitle);
	const activeCard = useStudio((state) => state.chatCard);
	const activeCast = useStudio((state) => state.chatCast);
	const activeMessages = useStudio((state) => state.chatMessages);
	const activeKey = useStudio((state) => state.chatCardKey);
	const [loaded, setLoaded] = (0, import_react.useState)([]);
	const [tick, setTick] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const bump = () => setTick((value) => value + 1);
		window.addEventListener("cardwright-vault", bump);
		return () => window.removeEventListener("cardwright-vault", bump);
	}, []);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		loadChatSummaries().then((list) => {
			if (cancel) return;
			setLoaded(list);
			const current = useStudio.getState().chatIndex;
			const heads = list.map((item) => {
				const live = current.find((chat) => chat.id === item.id);
				if (live && live.updatedAt > item.updatedAt) return live;
				return {
					id: item.id,
					title: item.title,
					cardName: item.cardName,
					updatedAt: item.updatedAt
				};
			});
			for (const live of current) if (!heads.some((item) => item.id === live.id)) heads.push(live);
			setChatIndex(heads.sort((a, b) => b.updatedAt - a.updatedAt));
		});
		return () => {
			cancel = true;
		};
	}, [tick, setChatIndex]);
	const listed = chatIndex.map((head) => {
		const known = loaded.find((item) => item.id === head.id);
		return {
			id: head.id,
			title: head.title || known?.title || "Untitled chat",
			cardName: head.cardName || known?.cardName || "Chat",
			updatedAt: head.updatedAt,
			messages: known?.messages ?? 0,
			snippet: known?.snippet || "",
			cardKey: known?.cardKey || ""
		};
	});
	if (activeId && activeCard && !listed.some((item) => item.id === activeId)) {
		const names = (activeCast.length ? activeCast : [{ card: activeCard }]).map((member) => member.card.name.trim()).filter(Boolean);
		const last = [...activeMessages].reverse().find((turn) => turn.text.trim());
		listed.unshift({
			id: activeId,
			title: activeTitle.trim() || activeCard.name.trim() || "Untitled chat",
			cardName: names.join(", ") || "Chat",
			updatedAt: Date.now(),
			messages: activeMessages.length,
			snippet: (last?.text || "").trim().replace(/\s+/g, " ").slice(0, 160),
			cardKey: activeKey || ""
		});
	}
	const rows = listed.filter((item) => {
		if (!query) return true;
		return `${item.title} ${item.cardName} ${item.snippet}`.toLowerCase().includes(query);
	});
	async function onOpen(id) {
		setError(null);
		const saved = await loadChat(id);
		if (!saved) {
			setError("That chat is no longer in the library.");
			setTick((value) => value + 1);
			return;
		}
		useStudio.getState().openSavedChat(saved);
		onContinue();
	}
	async function onDelete(id) {
		await deleteChatRecord(id);
		setLoaded((current) => current.filter((item) => item.id !== id));
		setChatIndex(useStudio.getState().chatIndex.filter((item) => item.id !== id));
		if (useStudio.getState().chatId === id) useStudio.getState().clearChat();
	}
	async function onDownload(item) {
		setBusyId(item.id);
		setError(null);
		try {
			const saved = await loadChat(item.id);
			if (!saved) {
				setError("That chat is no longer in the library.");
				setTick((value) => value + 1);
				return;
			}
			const portable = {
				...saved,
				messages: saved.messages.map((turn) => ({
					...turn,
					image: null
				}))
			};
			const blob = new Blob([JSON.stringify(portable, null, 2)], { type: "application/json" });
			await saveNamedFile(`${slugName(item.title)}.json`, blob);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save that chat.");
		} finally {
			setBusyId(null);
		}
	}
	async function onImport(file) {
		setError(null);
		try {
			const parsed = savedChatFrom(JSON.parse(await file.text()), crypto.randomUUID());
			if (!parsed) {
				setError("That file is not a Cardwright chat.");
				return;
			}
			const next = {
				...parsed,
				id: crypto.randomUUID(),
				updatedAt: Date.now()
			};
			await saveChat(next);
			useStudio.getState().openSavedChat(next);
			const rest = useStudio.getState().chatIndex.filter((item) => item.id !== next.id);
			setChatIndex([{
				id: next.id,
				title: next.title,
				cardName: next.cardName,
				updatedAt: next.updatedAt
			}, ...rest]);
			onContinue();
		} catch {
			setError("Could not read that chat file.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
						className: "size-4",
						"aria-hidden": "true"
					}),
					"Import chat",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "application/json,.json",
						className: "sr-only",
						onChange: (event) => {
							const file = event.target.files?.[0];
							if (file) onImport(file);
							event.target.value = "";
						}
					})
				]
			})
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg",
			children: error
		}) : null,
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted",
			children: query ? "Nothing matches that search." : "Start a chat and it will show up here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex h-full flex-col rounded-lg bg-paper p-4 text-ink shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { mediaKey: item.cardKey && item.cardKey !== "editor" ? item.cardKey : `chat:${item.id}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-2xl font-semibold text-ink",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: item.cardName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-3 text-sm text-ink-soft",
						children: item.snippet || "No messages yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-ink-soft",
						children: [
							item.messages,
							" ",
							item.messages === 1 ? "message" : "messages",
							" · ",
							when(item.updatedAt)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void onOpen(item.id),
								className: "min-h-11 rounded-md bg-ink px-3 text-sm font-semibold text-paper",
								children: "Open"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busyId === item.id,
								onClick: () => void onDownload(item),
								className: "flex min-h-11 items-center gap-2 rounded-md border border-ink/20 px-3 text-sm font-semibold text-ink disabled:opacity-40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									className: "size-4",
									"aria-hidden": "true"
								}), "JSON"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Delete ${item.title}`,
								onClick: () => void onDelete(item.id),
								className: "flex size-11 items-center justify-center rounded-md text-ink-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-4",
									"aria-hidden": "true"
								})
							})
						]
					})
				]
			}) }, item.id))
		})
	] });
}
function when(time) {
	if (!time) return "";
	return new Date(time).toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function PictureGrid({ query }) {
	const [shots, setShots] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		const load = () => {
			(async () => {
				const heads = await vaultList("gallery");
				const loaded = [];
				for (const head of heads) {
					const shot = await vaultGet("gallery", head.id);
					if (shot?.dataUrl) loaded.push(shot);
				}
				if (!cancel) setShots(loaded);
			})();
		};
		load();
		window.addEventListener("cardwright-vault", load);
		return () => {
			cancel = true;
			window.removeEventListener("cardwright-vault", load);
		};
	}, []);
	const visible = shots.filter((shot) => {
		if (!query) return true;
		return `${shot.name} ${shot.prompt}`.toLowerCase().includes(query);
	});
	if (visible.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted",
		children: "Draw on the NovelAI tab and the pictures are kept here."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: error
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: visible.map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "overflow-hidden rounded-lg bg-paper text-ink shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: shot.dataUrl,
				alt: shot.prompt || shot.name,
				className: "aspect-square w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						(async () => {
							try {
								const bytes = new Uint8Array(await (await fetch(shot.dataUrl)).arrayBuffer());
								await savePngFile(shot.name || "picture.png", bytes);
							} catch (err) {
								setError(err instanceof Error ? err.message : "Could not save that picture.");
							}
						})();
					},
					className: "flex min-h-11 items-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-paper",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "size-4",
						"aria-hidden": "true"
					}), "Save as"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Delete ${shot.name || "picture"}`,
					onClick: () => {
						vaultDelete("gallery", shot.id);
						setShots((current) => current.filter((item) => item.id !== shot.id));
					},
					className: "flex size-11 items-center justify-center rounded-md text-ink-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
						className: "size-4",
						"aria-hidden": "true"
					})
				})]
			})]
		}, shot.id))
	})] });
}
function Thumb({ mediaKey }) {
	const [src, setSrc] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		loadMedia(mediaKey).then((record) => {
			if (!cancel) setSrc(portraitOf(record)?.dataUrl ?? null);
		});
		return () => {
			cancel = true;
		};
	}, [mediaKey]);
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[4/3] w-full rounded-md bg-[#e7e0d6]" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: "aspect-[4/3] w-full rounded-md object-cover"
	});
}
var MEMORY_SYSTEM = "You maintain the memory of a roleplay. Rewrite it so later replies stay consistent. Keep facts, relationships, promises, injuries, and unresolved events. Drop small talk. 150 words or fewer. Plain prose. Do not write the next line of dialogue.";
var FACT_SYSTEM = "You keep long-term memory for a roleplay. List only durable facts: names, relationships, promises, injuries, secrets, and unresolved events. One fact per line. Do not repeat facts already listed. If nothing new, reply none.";
var TRACKER_SYSTEM = "You update a character tracker. Reply with one line per character, exactly: Name | yes or no | where they are | what they are doing. Use only the names given.";
var RETRIEVAL_SYSTEM = "You retrieve lore for a roleplay. Return only facts from the catalog that matter to the recent chat. One fact per line. If none matter, reply none.";
var PICTURE_SYSTEM = "You write one NovelAI image prompt. Output only comma-separated visual tags. No sentences and no speech balloons. Include every character's appearance and the persona's appearance. Include what is happening in the recent chat. Use lore and world facts when they change the place, clothing, or objects.";
function snapshotChat() {
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
		authorDepth: state.chatAuthorDepth
	};
}
function downloadText(filename, text) {
	return saveNamedFile(filename, new Blob([text], { type: "application/json" }));
}
function ChatTab({ cards, personas, onOpenLibrary }) {
	const settings = useStudio((state) => state.settings);
	const theme = {
		...DEFAULT_THEME,
		...useStudio((state) => state.theme)
	};
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
	const [cardPick, setCardPick] = (0, import_react.useState)("editor");
	const [personaPick, setPersonaPick] = (0, import_react.useState)("editor");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [portrait, setPortrait] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editText, setEditText] = (0, import_react.useState)("");
	const [zoom, setZoom] = (0, import_react.useState)(null);
	const [drawPrompt, setDrawPrompt] = (0, import_react.useState)("");
	const [drawOpen, setDrawOpen] = (0, import_react.useState)(false);
	const [drawBusy, setDrawBusy] = (0, import_react.useState)(false);
	const [drawTarget, setDrawTarget] = (0, import_react.useState)(null);
	const [addPick, setAddPick] = (0, import_react.useState)("editor");
	const [colorFor, setColorFor] = (0, import_react.useState)(null);
	const [replyingName, setReplyingName] = (0, import_react.useState)("");
	const [factDraft, setFactDraft] = (0, import_react.useState)("");
	const [factEditId, setFactEditId] = (0, import_react.useState)(null);
	const [factEdit, setFactEdit] = (0, import_react.useState)("");
	const importChatRef = (0, import_react.useRef)(null);
	const logRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
	}, [messages.length, busy]);
	(0, import_react.useEffect)(() => {
		if (!zoom) return;
		const onKey = (event) => {
			if (event.key === "Escape") setZoom(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [zoom]);
	(0, import_react.useEffect)(() => {
		if (!chatCard || !chatId) return;
		const handle = window.setTimeout(() => {
			const state = useStudio.getState();
			if (!state.chatCard || !state.chatId) return;
			const saved = snapshotChat();
			if (!saved) return;
			saveChat(saved).then(() => {
				const rest = useStudio.getState().chatIndex.filter((item) => item.id !== saved.id);
				setChatIndex([{
					id: saved.id,
					title: saved.title,
					cardName: saved.cardName,
					updatedAt: saved.updatedAt
				}, ...rest]);
			}).catch(() => void 0);
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
		setChatIndex
	]);
	(0, import_react.useEffect)(() => {
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
		loadMedia(match.id).then((record) => {
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
	function loreText(history) {
		return activateBooks([...lorebooks.filter((book) => loreIds.includes(book.id)), ...worldbooks.filter((book) => worldIds.includes(book.id))], history);
	}
	async function resolveLore(history) {
		const state = useStudio.getState();
		const books = [...state.lorebooks.filter((book) => state.chatLoreIds.includes(book.id)), ...state.worldbooks.filter((book) => state.chatWorldIds.includes(book.id))];
		const keywords = activateBooks(books, history);
		if (state.chatKnowledge !== "retrieval") return keywords;
		const catalog = loreCatalog(books, state.chatKnowledgeLimit);
		if (!catalog.trim()) return keywords;
		const recent = history.slice(-8).map((turn) => `${turn.speakerName?.trim() || turn.role}: ${turn.text}`).join("\n");
		try {
			const text = (await askText(settings, RETRIEVAL_SYSTEM, `Recent chat:\n${recent || "(empty)"}\n\nCatalog:\n${catalog}`, 500)).trim();
			if (!text || /^none[.!]?$/i.test(text)) return "";
			return text;
		} catch {
			return keywords;
		}
	}
	function liveCast() {
		const state = useStudio.getState();
		if (state.chatCast.length) return state.chatCast;
		if (state.chatCard) return [{
			id: state.chatCardKey || "primary",
			card: state.chatCard
		}];
		return [];
	}
	async function promptMessages(history, speaker = chatCard, lore) {
		const state = useStudio.getState();
		const persona = state.chatPersona;
		const preset = state.presets.find((item) => item.id === state.activePresetId) ?? null;
		if (!speaker) return [];
		const cards = liveCast().map((member) => member.card);
		const extras = {
			memory: state.chatMemory,
			lore: lore ?? activateBooks([...state.lorebooks.filter((book) => state.chatLoreIds.includes(book.id)), ...state.worldbooks.filter((book) => state.chatWorldIds.includes(book.id))], history)
		};
		const many = cards.filter((card) => card.name.trim()).length > 1;
		const base = !preset ? buildRoleplayMessages(speaker, persona, history, extras, cards) : (() => {
			const labeled = many ? history.map((turn) => turn.role === "assistant" && turn.speakerName?.trim() ? {
				...turn,
				speakerName: turn.speakerName
			} : {
				...turn,
				speakerName: null
			}) : history.map((turn) => ({
				...turn,
				speakerName: null
			}));
			const built = buildPresetMessages(preset, speaker, persona, labeled, Math.random, extras);
			if (!many) return built;
			const others = cards.filter((card) => card.name.trim() && card.name.trim() !== speaker.name.trim());
			const note = [
				`You are ${speaker.name.trim()}. Write only ${speaker.name.trim()}'s next reply. Do not speak for anyone else.`,
				others.length && `Also in the scene:\n${others.map((card) => [
					card.name.trim(),
					card.appearance.trim() && `Appearance: ${card.appearance.trim()}`,
					card.description.trim()
				].filter(Boolean).join("\n")).join("\n\n")}`,
				persona?.appearance.trim() && `${persona.name.trim() || "User"} appearance: ${persona.appearance.trim()}`
			].filter((part) => Boolean(part)).join("\n\n");
			return note ? [{
				role: "system",
				content: note
			}, ...built] : built;
		})();
		const historyText = history.map((turn) => turn.text).join("\n");
		return withChatGuides(base, {
			longMemory: state.chatLtm ? factsToPrompt(state.chatFacts, historyText) : "",
			tracker: state.chatTrack ? trackerPrompt(state.chatTracker) : "",
			authorNote: state.chatAuthorNote,
			authorDepth: state.chatAuthorDepth
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
	async function send(text) {
		if (!chatCard || busy) return;
		const trimmed = text.trim();
		if (!trimmed) return;
		setDraft("");
		setError(null);
		setBusy(true);
		pushChat({
			id: crypto.randomUUID(),
			role: "user",
			text: trimmed
		});
		const cast = liveCast();
		const lastAssistant = [...useStudio.getState().chatMessages].reverse().find((turn) => turn.role === "assistant");
		const speakers = speakersForTurn({
			mode: useStudio.getState().chatReplyMode,
			cast: cast.map((member) => ({
				id: member.id,
				name: member.card.name,
				aliases: member.card.aliases
			})),
			pickedId: useStudio.getState().chatSpeakerId,
			lastSpeakerId: lastAssistant?.speakerId ?? null,
			userText: trimmed
		});
		try {
			const lore = await resolveLore(useStudio.getState().chatMessages);
			for (const speaker of speakers) {
				const member = cast.find((item) => item.id === speaker.id) ?? cast[0];
				if (!member) continue;
				setReplyingName(member.card.name.trim() || "Character");
				const history = useStudio.getState().chatMessages;
				const reply = await replyInCharacter(settings, await promptMessages(history, member.card, lore));
				pushChat({
					id: crypto.randomUUID(),
					role: "assistant",
					text: reply,
					speakerId: member.id,
					speakerName: member.card.name.trim()
				});
			}
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setReplyingName("");
			setBusy(false);
		}
	}
	async function onRegenerate(messageId) {
		if (!chatCard || busy) return;
		const current = useStudio.getState().chatMessages;
		const index = messageId ? current.findIndex((turn) => turn.id === messageId) : current.length - 1;
		const target = index >= 0 ? current[index] : void 0;
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
			const history = useStudio.getState().chatMessages.slice(-16).map((turn) => `${turn.role === "user" ? personaName : turn.speakerName?.trim() || chatCard.name}: ${turn.text}`).join("\n");
			const next = await askText(settings, MEMORY_SYSTEM, `Current memory:\n${memory.trim() || "(empty)"}\n\nChat:\n${history}`, 500);
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
			const history = state.chatMessages.slice(-24).map((turn) => `${turn.role === "user" ? personaName : turn.speakerName?.trim() || chatCard.name}: ${turn.text}`).join("\n");
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
			const history = state.chatMessages.slice(-16).map((turn) => `${turn.role === "user" ? personaName : turn.speakerName?.trim() || chatCard.name}: ${turn.text}`).join("\n");
			const next = await askText(settings, TRACKER_SYSTEM, `Characters: ${rows.map((row) => row.name).join(", ")}\n\nChat:\n${history || "(empty)"}`, 400);
			setChatTracker(applyTrackerText(useStudio.getState().chatTracker, next));
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(false);
		}
	}
	function patchTracker(id, patch) {
		setChatTracker(useStudio.getState().chatTracker.map((row) => row.id === id ? {
			...row,
			...patch
		} : row));
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
			setChatIndex([{
				id: saved.id,
				title: saved.title,
				cardName: saved.cardName,
				updatedAt: saved.updatedAt
			}, ...rest]);
			const portable = {
				...saved,
				messages: saved.messages.map((turn) => ({
					...turn,
					image: null
				}))
			};
			downloadText(`${saved.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "chat"}.json`, JSON.stringify(portable, null, 2));
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save that chat.");
		}
	}
	async function onImportChat(file) {
		try {
			const parsed = savedChatFrom(JSON.parse(await file.text()), crypto.randomUUID());
			if (!parsed) {
				setError("That file is not a Cardwright chat.");
				return;
			}
			const next = {
				...parsed,
				id: crypto.randomUUID(),
				updatedAt: Date.now()
			};
			await saveChat(next);
			openSavedChat(next);
			const rest = useStudio.getState().chatIndex.filter((item) => item.id !== next.id);
			setChatIndex([{
				id: next.id,
				title: next.title,
				cardName: next.cardName,
				updatedAt: next.updatedAt
			}, ...rest]);
			setDrawOpen(false);
			setError(null);
		} catch {
			setError("Could not read that chat file.");
		}
	}
	async function onPrepareDraw(messageId) {
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
			state.chatAuthorNote.trim() && `Author note: ${state.chatAuthorNote.trim()}`
		].filter(Boolean).join("\n");
		const brief = sceneBrief$1({
			cards: cast.length ? cast : [chatCard],
			persona,
			history,
			memory: guideMemory,
			lore: loreText(history)
		});
		const appearances = [...cast.map((card) => [card.name.trim(), card.appearance.trim()].filter(Boolean).join(", ")), persona ? [persona.name.trim(), persona.appearance.trim()].filter(Boolean).join(", ") : ""].filter(Boolean).join(", ");
		try {
			const prompt = await askText(settings, PICTURE_SYSTEM, brief, 280);
			setDrawPrompt(prompt.trim());
		} catch {
			setDrawPrompt(appearancePrompt({
				name: cast.map((card) => card.name.trim()).filter(Boolean).join(", "),
				appearance: appearances,
				description: history.slice(-2).map((turn) => turn.text).join(", "),
				concept: memory
			}));
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
			else pushChat({
				id: crypto.randomUUID(),
				role: "assistant",
				text: "",
				image: url
			});
			setDrawOpen(false);
		} catch (err) {
			setError(novelFailure(err));
		} finally {
			setDrawBusy(false);
		}
	}
	async function onSaveImage(dataUrl) {
		try {
			const payload = dataUrl.slice(dataUrl.indexOf(",") + 1);
			const binary = atob(payload);
			const bytes = new Uint8Array(binary.length);
			for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
			if (await savePngFile(`${(chatCard?.name || "scene").replace(/[^a-z0-9]+/gi, "-")}.png`, bytes)) setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save that picture.");
		}
	}
	async function onOpenSaved(id) {
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
	async function onDeleteSaved(id) {
		await deleteChatRecord(id);
		setChatIndex(useStudio.getState().chatIndex.filter((item) => item.id !== id));
		if (chatId === id) clearChat();
	}
	function toggleBook(kind, id) {
		if (kind === "lore") setChatBooks(loreIds.includes(id) ? loreIds.filter((item) => item !== id) : [...loreIds, id], worldIds);
		else setChatBooks(loreIds, worldIds.includes(id) ? worldIds.filter((item) => item !== id) : [...worldIds, id]);
	}
	const charName = chatCard?.name.trim() || "Character";
	const userName = chatPersona?.name.trim() || "You";
	const presetLabel = activePreset ? activePreset.name : "Simple prompt";
	const displayCast = chatCast.length ? chatCast : chatCard ? [{
		id: chatCardKey || "primary",
		card: chatCard
	}] : [];
	const colorMember = displayCast.find((member) => member.id === colorFor) ?? displayCast.find((member) => member.id === chatSpeakerId) ?? displayCast[0] ?? null;
	const colorLook = lookOf(colorMember?.card.chatLook ?? chatCard?.chatLook);
	const headerLook = lookOf((displayCast.find((member) => member.id === chatSpeakerId) ?? displayCast[0])?.card.chatLook ?? chatCard?.chatLook);
	const userLook = lookOf(chatPersona?.chatLook);
	const lastSpeakerId = [...messages].reverse().find((turn) => turn.role === "assistant")?.speakerId ?? null;
	const nextSpeakers = speakersForTurn({
		mode: chatReplyMode,
		cast: displayCast.map((member) => ({
			id: member.id,
			name: member.card.name,
			aliases: member.card.aliases
		})),
		pickedId: chatSpeakerId,
		lastSpeakerId,
		userText: draft
	});
	const castLabel = displayCast.map((member) => member.card.name.trim()).filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid h-full max-w-6xl grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 overflow-hidden px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain pr-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold text-fg",
								children: "Who is in the scene"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: ["Preset: ", presetLabel]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "chatCard",
								className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: "Character"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "chatCard",
								value: cardPick,
								onChange: (event) => setCardPick(event.target.value),
								className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: "editor",
									children: ["Card in the editor", editorCard.name.trim() ? ` · ${editorCard.name.trim()}` : ""]
								}), cards.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.id,
									children: item.name
								}, item.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "chatPersona",
								className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: "Persona"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "chatPersona",
								value: personaPick,
								onChange: (event) => {
									setPersonaPick(event.target.value);
									if (chatCard) {
										const next = event.target.value === "none" ? null : event.target.value === "editor" ? editorPersona : personas.find((item) => item.id === event.target.value)?.card ?? null;
										setChatPersona(next);
									}
								},
								className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "none",
										children: "None"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "editor",
										children: ["Persona in the editor", editorPersona.name.trim() ? ` · ${editorPersona.name.trim()}` : ""]
									}),
									personas.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.name
									}, item.id))
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onStart,
								className: "mt-3 flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg",
								children: "Start chat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "Start chat opens a new saved chat. Add more characters after it starts."
							})
						]
					}),
					chatCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Who answers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: nextSpeakers.length ? `Next: ${nextSpeakers.map((speaker) => speaker.name).join(", ")}` : "Add a character with a name."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2",
								children: displayCast.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate text-sm",
										children: member.card.name.trim() || "Unnamed"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: displayCast.length < 2,
										"aria-label": `Remove ${member.card.name.trim() || "character"}`,
										onClick: () => removeChatMember(member.id),
										className: "flex size-11 items-center justify-center rounded-md text-primary disabled:opacity-30",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "size-4",
											"aria-hidden": "true"
										})
									})]
								}, member.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "chatSpeaker",
								className: "mt-2 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: "Picked character"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "chatSpeaker",
								value: chatSpeakerId || displayCast[0]?.id || "",
								onChange: (event) => setChatSpeaker(event.target.value),
								className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
								children: displayCast.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: member.id,
									children: member.card.name.trim() || "Unnamed"
								}, member.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "replyWhen",
								className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: "When"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "replyWhen",
								value: chatReplyMode,
								onChange: (event) => setChatReplyMode(event.target.value),
								className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pick",
										children: "Only the one I pick"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "named",
										children: "When I write their name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "round",
										children: "Take turns"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "everyone",
										children: "Everyone replies"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "addCast",
								className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: "Add a character"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "addCast",
									value: addPick,
									onChange: (event) => setAddPick(event.target.value),
									className: "min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "editor",
										children: ["Card in the editor", editorCard.name.trim() ? ` · ${editorCard.name.trim()}` : ""]
									}), cards.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.name
									}, item.id))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
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
									},
									className: "flex min-h-11 items-center gap-1 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Add"]
								})]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Memory"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: memory,
								disabled: !chatCard,
								rows: 5,
								onChange: (event) => setChatMemory(event.target.value),
								placeholder: "Facts the story should keep.",
								className: "mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !chatCard || busy,
								onClick: () => void onRemember(),
								className: "mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40",
								children: "Update memory from this chat"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Long-term memory"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Durable facts. Matching ones are sent with each reply. A new chat with this card can start from facts you keep on the card."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 flex min-h-11 items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: chatLtm,
									disabled: !chatCard,
									onChange: (event) => setChatLtm(event.target.checked),
									className: "size-4 accent-primary"
								}), "Use long-term memory"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-1",
								children: [chatFacts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-xs text-muted",
									children: "No facts yet."
								}) : null, chatFacts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "mt-1 flex items-start gap-1",
									children: factEditId === fact.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: factEdit,
										onChange: (event) => setFactEdit(event.target.value),
										"aria-label": "Edit fact",
										className: "min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-2 text-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											const text = factEdit.trim();
											if (text) setChatFacts(chatFacts.map((item) => item.id === fact.id ? {
												...item,
												text
											} : item));
											setFactEditId(null);
										},
										className: "min-h-11 rounded-md px-2 text-xs font-semibold text-gold",
										children: "Save"
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "min-w-0 flex-1 py-2 text-sm",
											children: fact.text
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Edit fact",
											onClick: () => {
												setFactEditId(fact.id);
												setFactEdit(fact.text);
											},
											className: "flex size-11 items-center justify-center text-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
												className: "size-4",
												"aria-hidden": "true"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Remove fact",
											onClick: () => setChatFacts(chatFacts.filter((item) => item.id !== fact.id)),
											className: "flex size-11 items-center justify-center text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
												className: "size-4",
												"aria-hidden": "true"
											})
										})
									] })
								}, fact.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: factDraft,
									disabled: !chatCard,
									placeholder: "Add a fact",
									onChange: (event) => setFactDraft(event.target.value),
									className: "min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !chatCard || !factDraft.trim(),
									onClick: () => {
										setChatFacts([...chatFacts, {
											id: crypto.randomUUID(),
											text: factDraft.trim()
										}]);
										setFactDraft("");
									},
									className: "min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40",
									children: "Add"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !chatCard || busy,
								onClick: () => void onPullFacts(),
								className: "mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40",
								children: "Pull facts from this chat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !chatCard || chatFacts.length === 0,
								onClick: keepFactsOnCard,
								className: "mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40",
								children: "Keep on this card"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Character tracker"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Who is in the scene, where, and what they are doing."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 flex min-h-11 items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: chatTrack,
									disabled: !chatCard,
									onChange: (event) => setChatTrack(event.target.checked),
									className: "size-4 accent-primary"
								}), "Send the tracker with each reply"]
							}),
							chatTracker.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 rounded-md border border-border p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex min-h-11 items-center gap-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: row.present,
												disabled: !chatCard,
												onChange: (event) => patchTracker(row.id, { present: event.target.checked }),
												className: "size-4 accent-primary"
											}),
											row.name,
											" is here"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": `${row.name} location`,
										value: row.where,
										disabled: !chatCard,
										placeholder: "Where",
										onChange: (event) => patchTracker(row.id, { where: event.target.value }),
										className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": `${row.name} activity`,
										value: row.doing,
										disabled: !chatCard,
										placeholder: "Doing",
										onChange: (event) => patchTracker(row.id, { doing: event.target.value }),
										className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm"
									})
								]
							}, row.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !chatCard || busy || chatTracker.length === 0,
								onClick: () => void onUpdateTracker(),
								className: "mt-2 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40",
								children: "Update from chat"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Author’s notes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Instructions for this chat only. The model reads them every turn."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: chatAuthorNote,
								disabled: !chatCard,
								rows: 4,
								placeholder: "Keep the dock cold. Do not resolve the missing crate yet.",
								onChange: (event) => setChatAuthorNote(event.target.value),
								className: "mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: [
									"Depth ",
									chatAuthorDepth === 0 ? "· after the newest message" : `· ${chatAuthorDepth} before the end`,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 12,
										disabled: !chatCard,
										value: chatAuthorDepth,
										onChange: (event) => setChatAuthorDepth(Number(event.target.value)),
										className: "mt-2 w-full accent-primary"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Books in this chat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "chatKnowledge",
								className: "mt-2 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: ["Knowledge", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "chatKnowledge",
									value: chatKnowledge,
									disabled: !chatCard,
									onChange: (event) => setChatKnowledge(event.target.value),
									className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm font-normal normal-case text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "keywords",
										children: "Keywords"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "retrieval",
										children: "Knowledge retrieval"
									})]
								})]
							}),
							chatKnowledge === "retrieval" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: [
									"Entries considered ",
									chatKnowledgeLimit,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 5,
										max: 80,
										disabled: !chatCard,
										value: chatKnowledgeLimit,
										onChange: (event) => setChatKnowledgeLimit(Number(event.target.value)),
										className: "mt-2 w-full accent-primary"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "An entry turns on when the recent chat mentions one of its keys."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: chatKnowledge === "retrieval" ? "Retrieval asks Kobold which catalog facts fit this moment. If that call fails, keywords are used." : "Checked books are scanned with the history when you send or draw."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookList, {
								title: "Lorebooks",
								books: lorebooks,
								picked: loreIds,
								onToggle: (id) => toggleBook("lore", id),
								disabled: !chatCard
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookList, {
								title: "World books",
								books: worldbooks,
								picked: worldIds,
								onToggle: (id) => toggleBook("world", id),
								disabled: !chatCard
							})
						]
					}),
					chatCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Colors in this chat"
							}),
							displayCast.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "colorFor",
								className: "mt-2 block text-xs font-semibold tracking-wide text-muted uppercase",
								children: ["Character", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "colorFor",
									value: colorMember?.id || "",
									onChange: (event) => setColorFor(event.target.value),
									className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm font-normal normal-case text-fg",
									children: displayCast.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: member.id,
										children: member.card.name.trim() || "Unnamed"
									}, member.id))
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatColors, {
									look: colorLook,
									theme,
									name: colorMember?.card.name.trim() || charName,
									onChange: (look) => {
										if (colorMember && chatCast.some((member) => member.id === colorMember.id)) patchMemberLook(colorMember.id, look);
										else patchChatLook(look);
									}
								})
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Chat history"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: !chatCard,
									onClick: () => void onSaveChatFile(),
									className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Save chat"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => importChatRef.current?.click(),
									className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Import"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onOpenLibrary,
								className: "mt-2 flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg",
								children: "Chat library"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: importChatRef,
								type: "file",
								accept: "application/json,.json",
								className: "sr-only",
								onChange: (event) => {
									const file = event.target.files?.[0];
									if (file) onImportChat(file);
									event.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "Chats also save themselves. Save chat downloads a copy without pictures."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-2 flex flex-col gap-1",
								children: [chatIndex.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "px-1 py-2 text-sm text-muted",
									children: "Saved chats show up here."
								}) : null, chatIndex.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void onOpenSaved(item.id),
										className: `min-h-11 flex-1 rounded-md px-2 text-left text-sm ${item.id === chatId ? "bg-surface-2" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-xs text-muted",
											children: item.cardName || "Chat"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Delete ${item.title}`,
										onClick: () => void onDeleteSaved(item.id),
										className: "flex size-11 items-center justify-center rounded-md text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "size-4",
											"aria-hidden": "true"
										})
									})]
								}, item.id))]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-h-0 flex-col overflow-hidden rounded-lg bg-paper text-ink shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex shrink-0 items-center gap-3 border-b border-ink/15 px-4 py-3",
						children: [portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: portrait,
							alt: "",
							className: "size-12 rounded-md object-cover"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [chatCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: chatTitle,
								onChange: (event) => setChatTitle(event.target.value),
								"aria-label": "Chat title",
								className: "w-full bg-transparent font-display text-xl font-semibold outline-none",
								style: textPaint(headerLook.nameColor, theme.ink)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl font-semibold",
								children: "No chat yet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-ink-soft",
								children: chatCard ? displayCast.length > 1 ? castLabel : `Talking with ${userName}` : "Pick a card and start."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: logRef,
						className: "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-4",
						children: [
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "rounded-md border border-primary bg-paper px-3 py-2 text-sm",
								children: error
							}) : null,
							!chatCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-ink-soft",
								children: "A chat uses the card you write here, plus memory, lore, and world books you turn on."
							}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-ink-soft",
								children: "This card has no first message. Say something to begin."
							}) : messages.map((turn) => {
								const mine = turn.role === "user";
								const speaker = displayCast.find((member) => member.id === turn.speakerId) ?? displayCast.find((member) => member.card.name.trim() === turn.speakerName?.trim()) ?? displayCast[0];
								const look = mine ? userLook : lookOf(speaker?.card.chatLook ?? chatCard?.chatLook);
								const dialogue = look.dialogueColor || theme.dialogueDefault;
								const speakerName = mine ? userName : turn.speakerName?.trim() || speaker?.card.name.trim() || charName;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: mine ? "border-l-4 border-gold pl-3" : "rounded-md px-3 py-2",
									style: mine ? void 0 : boxPaint(look.boxColor),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold tracking-wide uppercase",
												style: textPaint(look.nameColor, theme.inkSoft),
												children: speakerName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Edit message",
														onClick: () => {
															setEditing(turn.id);
															setEditText(turn.text);
														},
														className: "flex size-11 items-center justify-center text-ink-soft",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
															className: "size-4",
															"aria-hidden": "true"
														})
													}),
													!mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Regenerate message",
														disabled: busy,
														onClick: () => void onRegenerate(turn.id),
														className: "flex size-11 items-center justify-center text-ink-soft disabled:opacity-40",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
															className: "size-4",
															"aria-hidden": "true"
														})
													}) : null,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Draw this moment",
														onClick: () => void onPrepareDraw(turn.id),
														className: "flex size-11 items-center justify-center text-ink-soft",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
															className: "size-4",
															"aria-hidden": "true"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Remove message",
														onClick: () => removeChat(turn.id),
														className: "flex size-11 items-center justify-center text-ink-soft",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
															className: "size-4",
															"aria-hidden": "true"
														})
													})
												]
											})]
										}),
										editing === turn.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												value: editText,
												rows: 4,
												onChange: (event) => setEditText(event.target.value),
												className: "min-h-20 w-full resize-y rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														editChat(turn.id, editText);
														setEditing(null);
													},
													className: "min-h-11 rounded-md bg-ink px-3 text-sm font-semibold text-paper",
													children: "Save edit"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setEditing(null),
													className: "min-h-11 rounded-md border border-ink/20 px-3 text-sm",
													children: "Cancel"
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 whitespace-pre-wrap",
											style: {
												color: theme.ink,
												fontSize: theme.chatTextSize
											},
											children: splitDialogue(turn.text).map((part, index) => part.kind === "talk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													...textPaint(dialogue, theme.ink),
													fontWeight: theme.boldDialogue ? 700 : 400
												},
												children: part.text
											}, index) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: part.kind === "act" ? "italic" : void 0,
												children: part.text
											}, index))
										}),
										!mine && (turn.swipes?.length ?? 0) > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Previous greeting",
													onClick: () => swipeChat(turn.id, -1),
													className: "flex size-11 items-center justify-center rounded-md text-ink-soft",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
														className: "size-4",
														"aria-hidden": "true"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "min-w-12 text-center text-xs text-ink-soft",
													children: [
														(turn.swipe ?? 0) + 1,
														" / ",
														turn.swipes?.length
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Next greeting",
													onClick: () => swipeChat(turn.id, 1),
													className: "flex size-11 items-center justify-center rounded-md text-ink-soft",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
														className: "size-4",
														"aria-hidden": "true"
													})
												})
											]
										}) : null,
										turn.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
											className: "mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setZoom({
													id: turn.id,
													src: turn.image || ""
												}),
												className: "block w-full",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: turn.image,
													alt: "",
													className: "max-h-80 w-full rounded-md object-contain"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "sr-only",
													children: "Open picture larger"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => void onSaveImage(turn.image || ""),
													className: "flex min-h-11 items-center gap-2 text-sm font-semibold text-ink",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
														className: "size-4",
														"aria-hidden": "true"
													}), "Save picture"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														setChatImage(turn.id, null);
														setZoom((current) => current?.id === turn.id ? null : current);
													},
													className: "flex min-h-11 items-center gap-2 text-sm font-semibold text-primary",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
														className: "size-4",
														"aria-hidden": "true"
													}), "Delete picture"]
												})]
											})]
										}) : null
									]
								}, turn.id);
							}),
							busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-ink-soft",
								children: [replyingName || charName, " is writing…"]
							}) : null
						]
					}),
					drawOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 border-t border-ink/15 px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-wide text-ink-soft uppercase",
								children: "Scene prompt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: drawPrompt,
								rows: 4,
								disabled: drawBusy,
								onChange: (event) => setDrawPrompt(event.target.value),
								className: "mt-1 min-h-20 w-full resize-y rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: drawBusy || drawPrompt.trim().length < 3,
									onClick: () => void onDraw(),
									className: "min-h-11 rounded-md bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-40",
									children: drawBusy ? "Working…" : "Draw with NovelAI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDrawOpen(false),
									className: "min-h-11 rounded-md border border-ink/20 px-3 text-sm",
									children: "Close"
								})]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex shrink-0 items-end gap-2 border-t border-ink/15 p-3",
						onSubmit: (event) => {
							event.preventDefault();
							send(draft);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "chatDraft",
								children: "Your message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "chatDraft",
								value: draft,
								disabled: !chatCard || busy,
								rows: 2,
								onChange: (event) => setDraft(event.target.value),
								onKeyDown: (event) => {
									if (event.key === "Enter" && !event.shiftKey) {
										event.preventDefault();
										send(draft);
									}
								},
								placeholder: chatCard ? `Write as ${userName}` : "Start a chat first",
								style: { fontSize: theme.chatTextSize },
								className: "min-h-11 flex-1 resize-y rounded-md border border-ink/20 bg-paper px-3 py-2 text-ink"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Draw the scene",
								disabled: !chatCard || busy,
								onClick: () => void onPrepareDraw(messages[messages.length - 1]?.id ?? null),
								className: "flex size-11 items-center justify-center rounded-md border border-ink/20 text-ink disabled:opacity-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
									className: "size-4",
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Rewrite the last reply",
								disabled: !chatCard || busy || messages[messages.length - 1]?.role !== "assistant",
								onClick: () => void onRegenerate(),
								className: "flex size-11 items-center justify-center rounded-md border border-ink/20 text-ink disabled:opacity-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
									className: "size-4",
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: !chatCard || busy || !draft.trim(),
								className: "flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Send"]
							})
						]
					})
				]
			}),
			zoom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Picture",
				className: "fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4",
				onClick: () => setZoom(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: zoom.src,
					alt: "",
					className: "max-h-[85dvh] max-w-full rounded-md object-contain",
					onClick: (event) => event.stopPropagation()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-4 bottom-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: (event) => {
							event.stopPropagation();
							setChatImage(zoom.id, null);
							setZoom(null);
						},
						className: "flex min-h-11 items-center gap-2 rounded-md bg-paper px-3 text-sm font-semibold text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Delete"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: (event) => {
							event.stopPropagation();
							setZoom(null);
						},
						className: "flex min-h-11 items-center gap-2 rounded-md bg-paper px-3 text-sm font-semibold text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Close"]
					})]
				})]
			}) : null
		]
	});
}
function BookList({ title, books, picked, onToggle, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-muted uppercase",
				children: title
			}),
			books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "None yet. Make them on the Lore tab."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1",
				children: books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						disabled,
						checked: picked.includes(book.id),
						onChange: () => onToggle(book.id),
						className: "size-4 accent-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: book.name
					})]
				}) }, book.id))
			})
		]
	});
}
var FIELDS = [
	{
		key: "bg",
		label: "Background",
		hint: "The app behind the panels"
	},
	{
		key: "surface",
		label: "Panels",
		hint: "Cards, menus, and sidebars"
	},
	{
		key: "surface2",
		label: "Raised",
		hint: "Buttons and inputs on panels"
	},
	{
		key: "fg",
		label: "Text",
		hint: "Writing on the dark panels"
	},
	{
		key: "muted",
		label: "Muted",
		hint: "Hints and labels"
	},
	{
		key: "border",
		label: "Lines",
		hint: "Borders and dividers"
	},
	{
		key: "primary",
		label: "Accent",
		hint: "The main action color"
	},
	{
		key: "primaryFg",
		label: "Accent text",
		hint: "Writing on the accent"
	},
	{
		key: "paper",
		label: "Chat paper",
		hint: "The page behind messages"
	},
	{
		key: "ink",
		label: "Chat text",
		hint: "Narration on the paper"
	},
	{
		key: "inkSoft",
		label: "Chat secondary",
		hint: "Small notes in a chat"
	},
	{
		key: "gold",
		label: "Your mark",
		hint: "The bar beside your messages"
	}
];
function ColorsTab() {
	const theme = {
		...DEFAULT_THEME,
		...useStudio((state) => state.theme)
	};
	const setTheme = useStudio((state) => state.setTheme);
	const card = useStudio((state) => state.card);
	const patchCard = useStudio((state) => state.patchCard);
	function setField(key, value) {
		setTheme({
			...theme,
			[key]: value
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "App colors"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTheme(DEFAULT_THEME),
						className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Reset"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "These colors are saved with the app. Character colors stay on each card."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold tracking-wide text-muted uppercase",
						children: [
							field.label,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 flex min-w-0 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: /^#[0-9a-fA-F]{6}$/.test(String(theme[field.key])) ? String(theme[field.key]) : "#12100e",
									"aria-label": field.label,
									onChange: (event) => setField(field.key, event.target.value),
									className: "size-11 shrink-0 rounded-md border border-border bg-bg"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: String(theme[field.key]),
									onChange: (event) => setField(field.key, event.target.value),
									className: "min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg normal-case"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs font-normal tracking-normal text-muted normal-case",
								children: field.hint
							})
						]
					}, field.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-xs font-semibold tracking-wide text-muted uppercase",
					children: ["Default dialogue color", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: theme.dialogueDefault,
						placeholder: "Used when a character’s dialogue color is empty",
						onChange: (event) => setField("dialogueDefault", event.target.value),
						className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg normal-case"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex min-h-11 items-center gap-2 text-sm text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: theme.boldDialogue,
						onChange: (event) => setTheme({
							...theme,
							boldDialogue: event.target.checked
						}),
						className: "size-4 accent-primary"
					}), "Bold text inside quotation marks"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
					children: [
						"Chat text size ",
						theme.chatTextSize,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 12,
							max: 22,
							value: theme.chatTextSize,
							onChange: (event) => setTheme({
								...theme,
								chatTextSize: Number(event.target.value)
							}),
							className: "mt-2 w-full accent-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs font-normal tracking-normal text-muted normal-case",
							children: "Size of the writing in a chat."
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "This character"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Saved on the card in the editor. A running chat keeps its own copy until you change it there."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatColors, {
						look: card.chatLook,
						theme,
						name: card.name,
						onChange: (chatLook) => patchCard({ chatLook })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					htmlFor: "cardAliases",
					className: "mt-4 block text-xs font-semibold tracking-wide text-muted uppercase",
					children: ["Aliases", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "cardAliases",
						value: card.aliases ?? "",
						rows: 3,
						placeholder: "Nicknames, one per line. A group chat answers when you write one.",
						onChange: (event) => patchCard({ aliases: event.target.value }),
						className: "mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg normal-case"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "Aliases are saved on this card and exported with it."
				})
			]
		})]
	});
}
function LoreTab() {
	const lorebooks = useStudio((state) => state.lorebooks);
	const worldbooks = useStudio((state) => state.worldbooks);
	const upsertLore = useStudio((state) => state.upsertLore);
	const upsertWorld = useStudio((state) => state.upsertWorld);
	const removeLore = useStudio((state) => state.removeLore);
	const removeWorld = useStudio((state) => state.removeWorld);
	const card = useStudio((state) => state.card);
	const patchCard = useStudio((state) => state.patchCard);
	const [kind, setKind] = (0, import_react.useState)("lore");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const importRef = (0, import_react.useRef)(null);
	const books = kind === "world" ? worldbooks : lorebooks;
	const selected = books.find((book) => book.id === (selectedId ?? books[0]?.id)) ?? null;
	async function persist(book) {
		const next = {
			...book,
			kind,
			updatedAt: Date.now()
		};
		if (kind === "world") upsertWorld(next);
		else upsertLore(next);
		setSelectedId(next.id);
		await saveBook(next);
	}
	function change(book, recipe) {
		persist(recipe(book)).catch((err) => {
			setError(err instanceof Error ? err.message : "Could not save that book.");
		});
	}
	async function onImport(file) {
		setError(null);
		try {
			const parsed = lorebookFromUnknown(JSON.parse(await file.text()), file.name.replace(/\.marinara\.json$/i, "").replace(/\.json$/i, ""));
			if (!parsed) {
				setError("That file has no lore entries. Use a character book or a world book JSON.");
				return;
			}
			const next = {
				...parsed,
				id: crypto.randomUUID(),
				kind
			};
			await persist(next);
			setNotice(next.entries.length ? `Imported ${next.name} with ${next.entries.length} entries.` : `Imported ${next.name}, but that file had no entries.`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "That file could not be read.");
		}
	}
	async function onDownload(book) {
		const saved = await saveNamedFile(`${book.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "lorebook"}.json`, new Blob([JSON.stringify(bookToFile(book), null, 2)], { type: "application/json" }));
		if (saved) setNotice(`Saved ${saved}.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryLocation, {}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-md border border-primary bg-surface px-3 py-2 text-sm",
				children: error
			}) : null,
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
				children: notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": kind === "lore",
								onClick: () => {
									setKind("lore");
									setSelectedId(null);
								},
								className: kindButton(kind === "lore"),
								children: "Lorebooks"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": kind === "world",
								onClick: () => {
									setKind("world");
									setSelectedId(null);
								},
								className: kindButton(kind === "world"),
								children: "World books"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									const book = emptyBook(kind);
									persist(book).then(() => setNotice(`${book.name} is ready.`));
								},
								className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									"aria-hidden": "true"
								}), "New"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => importRef.current?.click(),
								className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Import"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: importRef,
							type: "file",
							accept: "application/json,.json,.marinara.json",
							className: "sr-only",
							onChange: (event) => {
								const file = event.target.files?.[0];
								if (file) onImport(file);
								event.target.value = "";
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 flex flex-col gap-1",
							children: [books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "px-2 py-3 text-sm text-muted",
								children: [
									"No ",
									kind === "world" ? "world books" : "lorebooks",
									" yet."
								]
							}) : null, books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedId(book.id),
								className: `min-h-11 w-full rounded-md px-3 text-left text-sm ${selected?.id === book.id ? "bg-surface-2 text-fg" : "text-muted"}`,
								children: [book.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 block text-xs",
									children: [book.entries.length, " entries"]
								})]
							}) }, book.id))]
						})
					]
				}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookEditor, {
					book: selected,
					linked: card.lorebookId === selected.id,
					onLink: () => {
						const linked = card.lorebookId === selected.id;
						patchCard({ lorebookId: linked ? "" : selected.id });
						setNotice(linked ? "Unlinked from the card in the editor." : "New chats with the card in the editor include this lorebook.");
					},
					onChange: (recipe) => change(selected, recipe),
					onDownload: () => void onDownload(selected),
					onDelete: () => {
						const id = selected.id;
						if (kind === "world") removeWorld(id);
						else removeLore(id);
						if (card.lorebookId === id) patchCard({ lorebookId: "" });
						deleteBook(kind, id);
						setSelectedId(null);
						setNotice("Deleted.");
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-lg border border-border bg-surface p-4 text-sm text-muted",
					children: "Lorebooks belong to a character and fire when a keyword shows up in the chat. World books are the same idea for a place or a cast, and you turn them on per chat."
				})]
			})
		]
	});
}
function kindButton(selected) {
	return `min-h-11 flex-1 rounded-md px-2 text-sm font-semibold ${selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`;
}
function BookEditor({ book, linked, onLink, onChange, onDownload, onDelete }) {
	function patchEntry(id, patch) {
		onChange((current) => ({
			...current,
			entries: current.entries.map((entry) => entry.id === id ? {
				...entry,
				...patch
			} : entry)
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onDownload,
						className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Export"]
					}),
					book.kind === "lore" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onLink,
						className: "min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold",
						children: linked ? "Linked to this card" : "Link to the card"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onDelete,
						className: "flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Delete"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs font-semibold tracking-wide text-muted uppercase",
				children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: book.name,
					onChange: (event) => onChange((current) => ({
						...current,
						name: event.target.value
					})),
					className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg normal-case"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs font-semibold tracking-wide text-muted uppercase",
				children: ["Description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: book.description,
					rows: 2,
					onChange: (event) => onChange((current) => ({
						...current,
						description: event.target.value
					})),
					className: "mt-1 min-h-16 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg normal-case"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs font-semibold tracking-wide text-muted uppercase",
				children: [
					"Scan depth ",
					book.scanDepth,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 1,
						max: 20,
						value: book.scanDepth,
						onChange: (event) => onChange((current) => ({
							...current,
							scanDepth: Number(event.target.value)
						})),
						className: "mt-2 w-full accent-primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold",
					children: "Entries"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange((current) => ({
						...current,
						entries: [...current.entries, emptyEntry()]
					})),
					className: "flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "size-4",
						"aria-hidden": "true"
					}), "Entry"]
				})]
			}),
			book.entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Add an entry with keywords. Constant entries are always included."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: book.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-md border border-border bg-bg p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: entry.name,
								placeholder: "Entry name",
								onChange: (event) => patchEntry(entry.id, { name: event.target.value }),
								className: "min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: entry.order,
								"aria-label": "Order",
								onChange: (event) => patchEntry(entry.id, { order: Number(event.target.value) }),
								className: "min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: entry.keys,
							placeholder: "Keywords, separated by commas",
							onChange: (event) => patchEntry(entry.id, { keys: event.target.value }),
							className: "mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: entry.content,
							rows: 4,
							placeholder: "What the model should know when this entry is active",
							onChange: (event) => patchEntry(entry.id, { content: event.target.value }),
							className: "mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-h-11 items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: entry.enabled,
										onChange: (event) => patchEntry(entry.id, { enabled: event.target.checked }),
										className: "size-4 accent-primary"
									}), "On"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-h-11 items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: entry.constant,
										onChange: (event) => patchEntry(entry.id, { constant: event.target.checked }),
										className: "size-4 accent-primary"
									}), "Always"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => onChange((current) => ({
										...current,
										entries: current.entries.filter((item) => item.id !== entry.id)
									})),
									className: "ml-auto flex size-11 items-center justify-center rounded-md text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-4",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: "Remove entry"
									})]
								})
							]
						})
					]
				}, entry.id))
			})
		]
	});
}
var DAY_MINUTES = 1440;
var PLACES = [
	{
		id: "home",
		name: "Your apartment",
		blurb: "A small place above the bakery. The kettle works.",
		open: 0,
		close: DAY_MINUTES
	},
	{
		id: "cafe",
		name: "Hearth Cafe",
		blurb: "Coffee, toast, and whoever got here first.",
		open: 420,
		close: 1200
	},
	{
		id: "park",
		name: "River Park",
		blurb: "A path, a bench, and the mill pond.",
		open: 360,
		close: 1260
	},
	{
		id: "market",
		name: "Corner Market",
		blurb: "Groceries, and a hot sandwich if you ask.",
		open: 480,
		close: 1200
	},
	{
		id: "office",
		name: "Millbrook Office",
		blurb: "The only place in town that posts a job.",
		open: 540,
		close: 1020
	},
	{
		id: "diner",
		name: "Night Diner",
		blurb: "Open late. The pie is honest.",
		open: 660,
		close: 1380
	}
];
var EXTRA_PLACES = [
	{
		id: "hillcrest",
		name: "Hillcrest",
		blurb: "The hill where people buy a place of their own.",
		open: 480,
		close: 1080
	},
	{
		id: "clinic",
		name: "Clinic",
		blurb: "A quiet waiting room and a nurse who knows the town.",
		open: 480,
		close: 1020
	},
	{
		id: "garage",
		name: "Garage",
		blurb: "Bikes, a used car, and the smell of oil.",
		open: 540,
		close: 1080
	},
	{
		id: "library",
		name: "Library",
		blurb: "Stacks, a table by the window, and no one in a hurry.",
		open: 600,
		close: 1140
	},
	{
		id: "venue",
		name: "The Venue",
		blurb: "A small room with a stage and a sticky floor.",
		open: 960,
		close: 1380
	}
];
var ALL_PLACES = [...PLACES, ...EXTRA_PLACES];
var HANGOUTS = [
	"cafe",
	"park",
	"market",
	"diner",
	"office"
];
var WEEKDAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];
var SEASONS = [
	"Spring",
	"Summer",
	"Autumn",
	"Winter"
];
var FRONT_DESK = {
	title: "Front desk",
	wage: 64,
	start: 540,
	end: 1020,
	kind: "desk",
	place: "office"
};
var JOB_LIST = [
	FRONT_DESK,
	{
		title: "Shop clerk",
		wage: 52,
		start: 480,
		end: 960,
		kind: "shop",
		place: "market"
	},
	{
		title: "Deliveries",
		wage: 48,
		start: 600,
		end: 1080,
		kind: "delivery",
		place: "diner"
	},
	{
		title: "Evening gig",
		wage: 70,
		start: 1080,
		end: 1320,
		kind: "gig",
		place: "diner"
	},
	{
		title: "Work from home",
		wage: 40,
		start: 540,
		end: 780,
		kind: "home",
		place: "home"
	}
];
var MODULES_OFF = {
	weather: false,
	districts: false,
	calendar: false,
	birthdays: false,
	cooking: false,
	homes: false,
	opinions: false,
	npcs: false,
	jobs: false,
	bills: false
};
var MODULE_NOTES = [
	{
		key: "weather",
		label: "Weather",
		detail: "The sky changes the day, and a storm slows a walk."
	},
	{
		key: "districts",
		label: "Wider town",
		detail: "Hillcrest, the clinic, the garage, the library, and the venue."
	},
	{
		key: "calendar",
		label: "Calendar",
		detail: "Plans on the phone, and a longer outing when you mean to go."
	},
	{
		key: "birthdays",
		label: "Birthdays",
		detail: "The morning of their day, the town says something."
	},
	{
		key: "cooking",
		label: "Cooking",
		detail: "Groceries and a real meal at home."
	},
	{
		key: "homes",
		label: "Homes",
		detail: "Buy a cottage or a townhouse. Rent stops. People notice."
	},
	{
		key: "opinions",
		label: "Opinions",
		detail: "Friends text you about what they heard."
	},
	{
		key: "npcs",
		label: "New people",
		detail: "Meet someone the town hasn't introduced. Off unless you want it."
	},
	{
		key: "jobs",
		label: "More jobs",
		detail: "The shop, deliveries, a gig, or work from the kitchen table."
	},
	{
		key: "bills",
		label: "Bills",
		detail: "Utilities on top of rent. A high tab can keep you home."
	}
];
var ROLE_OPTIONS = [
	{
		id: "town",
		label: "In town"
	},
	{
		id: "friend",
		label: "Friend"
	},
	{
		id: "family",
		label: "Family"
	},
	{
		id: "partner",
		label: "Partner"
	},
	{
		id: "ex",
		label: "Ex"
	},
	{
		id: "rival",
		label: "Rival"
	}
];
var TRAIT_OPTIONS = [
	{
		id: "jealous",
		label: "Jealous"
	},
	{
		id: "faithful",
		label: "Faithful"
	},
	{
		id: "shy",
		label: "Shy"
	},
	{
		id: "quick",
		label: "Quick-tempered"
	}
];
var RELATION_OPTIONS = [
	{
		id: "single",
		label: "Single"
	},
	{
		id: "dating",
		label: "Dating"
	},
	{
		id: "engaged",
		label: "Engaged"
	},
	{
		id: "married",
		label: "Married"
	},
	{
		id: "ex",
		label: "Ex"
	}
];
function clamp(value, low, high) {
	return Math.min(high, Math.max(low, value));
}
function clip(text, max) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (clean.length <= max) return clean;
	return `${clean.slice(0, max - 1).trimEnd()}…`;
}
function placeById(id) {
	return ALL_PLACES.find((place) => place.id === id) ?? PLACES[0];
}
function skyFor(day) {
	const skies = [
		"clear",
		"cloudy",
		"rain",
		"wind",
		"storm"
	];
	return skies[Math.abs(day * 3) % skies.length] ?? "clear";
}
function skyLabel(day) {
	const sky = skyFor(day);
	if (sky === "clear") return "Clear";
	if (sky === "cloudy") return "Cloudy";
	if (sky === "rain") return "Rain";
	if (sky === "wind") return "Wind";
	return "Storm";
}
function weeklyDue(life) {
	return (life.home === "apartment" ? 40 : 0) + (life.modules?.bills ? 15 : 0);
}
function placesFor(life) {
	return (life.modules?.districts ? ALL_PLACES : PLACES).map((place) => place.id === "home" ? homePlace(life) : place);
}
function homePlace(life) {
	const home = PLACES[0];
	if (life.home === "cottage") return {
		...home,
		name: "Your cottage",
		blurb: "A small place in Hillcrest. The kettle still works."
	};
	if (life.home === "townhouse") return {
		...home,
		name: "Your townhouse",
		blurb: "Two floors, and a door people actually knock on."
	};
	return home;
}
function tripMinutes(life) {
	let minutes = life.vehicle === "car" ? 8 : life.vehicle === "bike" ? 12 : 20;
	if (life.modules?.weather && skyFor(life.day) === "storm" && life.vehicle !== "car") minutes += 10;
	return minutes;
}
function isOpen(place, minute) {
	const clock = (minute % DAY_MINUTES + DAY_MINUTES) % DAY_MINUTES;
	return clock >= place.open && clock < place.close;
}
function clockLabel(minute) {
	const clock = (minute % DAY_MINUTES + DAY_MINUTES) % DAY_MINUTES;
	const hour = Math.floor(clock / 60);
	const mins = clock % 60;
	const suffix = hour >= 12 ? "PM" : "AM";
	return `${hour % 12 === 0 ? 12 : hour % 12}:${String(mins).padStart(2, "0")} ${suffix}`;
}
function hoursLabel(place) {
	if (place.id === "home") return "Always open";
	return `${clockLabel(place.open)} – ${clockLabel(place.close)}`;
}
function weekday(day) {
	return WEEKDAYS[((Math.max(1, day) - 1) % 7 + 7) % 7] ?? "Monday";
}
function seasonName(day) {
	return SEASONS[Math.floor((Math.max(1, day) - 1) % 120 / 30)] ?? "Spring";
}
function dateLabel(life) {
	return `${weekday(life.day)} · Day ${life.day} · ${seasonName(life.day)} · ${clockLabel(life.minute)}`;
}
function bondLabel(bond) {
	if (bond < 20) return "Acquaintance";
	if (bond < 45) return "Familiar";
	if (bond < 70) return "Friend";
	return "Close";
}
function needNote(needs) {
	const parts = [];
	if (needs.hunger >= 75) parts.push("You need to eat");
	else if (needs.hunger >= 50) parts.push("You're getting hungry");
	if (needs.energy <= 20) parts.push("You need to sleep");
	else if (needs.energy <= 40) parts.push("You're wearing thin");
	return parts.length ? `${parts.join(". ")}.` : null;
}
function hangoutFor(index) {
	return HANGOUTS[index % HANGOUTS.length] ?? "cafe";
}
function sketchResident(card, index) {
	const name = clip(card.name, 80) || "Someone";
	return {
		id: card.id,
		name,
		summary: clip(card.summary, 240),
		personality: clip(card.personality, 500),
		description: clip(card.description, 700),
		hangout: hangoutFor(index),
		bond: 8,
		memories: [],
		relation: "single",
		open: false,
		movedIn: false,
		role: "town",
		traits: [],
		secret: "",
		outfit: "",
		birthday: 8 + index % 12 * 9
	};
}
function withRole(person, role) {
	if (role === "friend") return {
		...person,
		role,
		bond: 30
	};
	if (role === "family") return {
		...person,
		role,
		bond: 55
	};
	if (role === "partner") return {
		...person,
		role,
		relation: "dating",
		bond: 42
	};
	if (role === "ex") return {
		...person,
		role,
		relation: "ex",
		bond: 18
	};
	if (role === "rival") return {
		...person,
		role,
		bond: 4,
		traits: ["quick"],
		secret: "You got off on the wrong foot."
	};
	return {
		...person,
		role: role ?? "town"
	};
}
function pushLog(life, text, scene, sceneWith) {
	return {
		...life,
		scene: scene === void 0 ? null : scene,
		sceneWith: scene === void 0 ? null : sceneWith ?? null,
		log: [...life.log, {
			day: life.day,
			minute: life.minute,
			text
		}].slice(-24)
	};
}
function passTime(life, minutes) {
	let minute = life.minute + minutes;
	let day = life.day;
	while (minute >= DAY_MINUTES) {
		minute -= DAY_MINUTES;
		day += 1;
	}
	return {
		...life,
		day,
		minute,
		needs: {
			energy: clamp(life.needs.energy - Math.round(minutes * .1), 0, 100),
			hunger: clamp(life.needs.hunger + Math.round(minutes * 8 / 60), 0, 100)
		}
	};
}
function createLife(input) {
	const title = clip(input.title, 60) || "Millbrook";
	const playerName = clip(input.playerName, 60) || "You";
	const season = input.season ?? "Spring";
	const day = season === "Summer" ? 31 : season === "Autumn" ? 61 : season === "Winter" ? 91 : 1;
	const money = clamp(Math.round(input.money ?? 120), 0, 99999);
	const job = input.startJob ? JOB_LIST.find((item) => item.kind === input.startJob) ?? null : null;
	return {
		id: input.id ?? `life-${crypto.randomUUID()}`,
		title,
		playerName,
		playerNote: clip(input.playerNote, 280),
		day,
		minute: 480,
		money,
		debt: 0,
		needs: {
			energy: clamp(Math.round(input.energy ?? 80), 0, 100),
			hunger: clamp(Math.round(input.hunger ?? 25), 0, 100)
		},
		place: "home",
		job: job ? { ...job } : null,
		workedDay: 0,
		rentDay: day + 7,
		cast: input.cast.slice(0, 6).map((card, index) => withRole(sketchResident(card, index), card.role)),
		log: [{
			day,
			minute: 480,
			text: `${playerName} wakes up in Millbrook with $${money} and a week until rent.`
		}],
		scene: null,
		sceneWith: null,
		rumors: [],
		papers: [],
		texts: [],
		shots: [],
		paintScenes: false,
		modules: {
			...MODULES_OFF,
			...input.modules
		},
		vehicle: input.vehicle ?? "walk",
		home: "apartment",
		plans: [],
		createdAt: input.now ?? Date.now()
	};
}
function peopleHere(life) {
	if (!isOpen(placeById(life.place), life.minute)) return [];
	return life.cast.filter((person) => {
		if (person.hangout === life.place) return true;
		return life.place === "home" && person.movedIn && (life.minute < 540 || life.minute >= 1080);
	});
}
function travel(life, placeId) {
	if (placeId === life.place) return { life };
	if (life.modules?.bills && life.debt >= 120 && life.place === "home") return { error: "The tab is high enough that they're talking about eviction. Pay some of it before you leave." };
	const dest = placeById(placeId);
	const riding = life.vehicle === "car" ? "drove" : life.vehicle === "bike" ? "rode" : "walked";
	const next = passTime(life.vehicle === "car" ? {
		...life,
		money: Math.max(0, life.money - 2)
	} : life, tripMinutes(life));
	if (!isOpen(dest, next.minute)) return { error: `${dest.name} is closed. Hours are ${hoursLabel(dest)}.` };
	const sky = life.modules?.weather && skyFor(life.day) === "storm" ? " The storm came with you." : "";
	return { life: pushLog({
		...next,
		place: placeId
	}, `You ${riding} to ${dest.name}.${sky}`) };
}
var MEALS = {
	home: {
		cost: 0,
		label: "something from the cupboard",
		fill: 28
	},
	cafe: {
		cost: 8,
		label: "coffee and toast",
		fill: 36
	},
	market: {
		cost: 10,
		label: "a hot sandwich",
		fill: 40
	},
	diner: {
		cost: 14,
		label: "a plate at the diner",
		fill: 48
	}
};
function eat(life) {
	const meal = MEALS[life.place];
	if (!meal) return { error: "Nothing to eat here." };
	if (life.money < meal.cost) return { error: `That costs $${meal.cost}. You have $${life.money}.` };
	const next = passTime({
		...life,
		money: life.money - meal.cost
	}, 30);
	return { life: pushLog({
		...next,
		needs: {
			...next.needs,
			hunger: clamp(next.needs.hunger - meal.fill, 0, 100)
		}
	}, `You had ${meal.label}.`) };
}
function rest(life) {
	if (life.place !== "park") return { error: "The bench is at River Park." };
	const next = passTime(life, 30);
	return { life: pushLog({
		...next,
		needs: {
			...next.needs,
			energy: clamp(next.needs.energy + 12, 0, 100)
		}
	}, "You sat by the mill pond until your shoulders dropped.") };
}
function lookAround(life) {
	const place = placeById(life.place);
	const names = peopleHere(life).map((person) => person.name);
	const company = names.length ? ` ${names.join(" and ")} ${names.length === 1 ? "is" : "are"} here.` : " You have the place mostly to yourself.";
	return pushLog(passTime(life, 15), `${place.blurb}${company}`);
}
function sleep(life) {
	const day = life.day + 1;
	let money = life.money;
	let debt = life.debt;
	let rentDay = life.rentDay;
	let note = "You slept. Morning came in through the bakery vent.";
	if (day >= rentDay) {
		const due = weeklyDue(life);
		if (due > 0) {
			if (money >= due) {
				money -= due;
				note = life.home === "apartment" ? `You slept. The week took $${due} from the drawer.` : `You slept. Utilities took $${due}.`;
			} else {
				const short = due - money;
				debt += short;
				money = 0;
				note = `You slept. The bill was short, so $${short} went on the tab.`;
			}
			rentDay = day + 7;
		}
	}
	let woken = publishMonday(pushLog({
		...life,
		day,
		minute: 450,
		money,
		debt,
		rentDay,
		place: "home",
		needs: {
			energy: 100,
			hunger: clamp(life.needs.hunger + 18, 0, 100)
		}
	}, note));
	if (woken.modules?.birthdays) {
		for (const person of woken.cast) if ((woken.day - 1) % 120 + 1 === person.birthday) {
			woken = addText(woken, person.name, "It's my birthday. Don't make it weird.");
			woken = addRumor(woken, `${person.name} has a birthday today.`);
		}
	}
	return woken;
}
function canWork(life) {
	if (!life.job || life.workedDay === life.day) return false;
	const where = life.job.place || "office";
	if (life.place !== where) return false;
	return life.minute >= life.job.start && life.minute < life.job.end;
}
function workShift(life) {
	if (!life.job) return { error: "You don't have a job yet." };
	const where = life.job.place || "office";
	if (life.place !== where) return { error: `The shift is at ${placeById(where).name}.` };
	if (life.workedDay === life.day) return { error: "You already worked today." };
	if (life.minute < life.job.start || life.minute >= life.job.end) return { error: `The shift is ${clockLabel(life.job.start)} to ${clockLabel(life.job.end)}.` };
	const next = passTime(life, Math.max(30, life.job.end - life.minute));
	return { life: pushLog({
		...next,
		money: life.money + life.job.wage,
		workedDay: life.day,
		needs: {
			energy: clamp(next.needs.energy - 18, 0, 100),
			hunger: clamp(next.needs.hunger + 10, 0, 100)
		}
	}, `You finished the ${life.job.title.toLowerCase()} shift and took home $${life.job.wage}.`) };
}
function afterTalk(life, residentId, playerLine, sceneText) {
	const next = passTime(life, 40);
	const line = clip(playerLine, 180) || "a quiet visit";
	const place = placeById(life.place).name;
	const cast = next.cast.map((person) => {
		if (person.id !== residentId) return person;
		const memory = clip(`Day ${life.day} at ${place}: ${line}`, 180);
		return {
			...person,
			bond: clamp(person.bond + 4, 0, 100),
			memories: [...person.memories, memory].slice(-5)
		};
	});
	const name = cast.find((person) => person.id === residentId)?.name ?? "them";
	const scene = clip(sceneText, 2e3);
	let withText = addText({
		...next,
		cast
	}, name, scene.split("\n").map((line) => line.trim()).find(Boolean) || "I liked seeing you.");
	if (withText.modules?.opinions) {
		const friend = withText.cast.find((person) => person.id !== residentId && person.bond >= 20 && person.relation !== "ex");
		if (friend) withText = addText(withText, friend.name, `I heard you were at ${place}.`);
	}
	return pushLog(withText, `You spent time with ${name}.`, scene, name);
}
function afterOuting(life, residentId, playerLine, sceneText) {
	const talked = afterTalk(life, residentId, playerLine, sceneText);
	const extra = passTime(talked, 40);
	return {
		...talked,
		day: extra.day,
		minute: extra.minute,
		needs: extra.needs
	};
}
function dismissScene(life) {
	return {
		...life,
		scene: null,
		sceneWith: null
	};
}
function outingBrief(life, person, playerLine) {
	const brief = sceneBrief(life, person, playerLine);
	return {
		system: `${brief.system} This is a longer outing, not a short visit. Let the afternoon pass.`,
		user: brief.user
	};
}
function sceneBrief(life, person, playerLine) {
	const place = placeById(life.place);
	const needs = needNote(life.needs);
	const memories = person.memories.length ? person.memories.join(" | ") : "Nothing yet.";
	return {
		system: [
			"You narrate one short scene in a modern small-town life sim called Millbrook.",
			"Write in present tense. Call the player 'you'.",
			"The other person speaks in their own voice and stays consistent with the notes.",
			"Two to four short paragraphs. No lists, no stats, no markdown, no menu of choices.",
			"End on a beat. Do not ask the player what they want to do next."
		].join(" "),
		user: [
			`Time: ${dateLabel(life)}.`,
			`Place: ${place.name}. ${place.blurb}`,
			`Player: ${life.playerName}. ${life.playerNote}`.trim(),
			needs ? `How the player feels: ${needs}` : "The player is basically all right.",
			`With: ${person.name}. ${relationLabel(person)}. Bond ${person.bond}. Role: ${person.role}.`,
			person.traits?.length ? `Traits: ${person.traits.join(", ")}.` : "",
			person.outfit ? `Clothes: ${person.outfit}.` : "",
			person.secret ? `Private, only for this scene: ${person.secret}` : "",
			life.modules?.weather ? `Sky: ${skyFor(life.day)}.` : "",
			life.home !== "apartment" ? `The player lives in a ${life.home}.` : "",
			person.summary ? `Summary: ${person.summary}` : "",
			person.personality ? `Personality: ${person.personality}` : "",
			person.description ? `About them: ${person.description}` : "",
			`They remember: ${memories}`,
			playerLine.trim() ? `The player does or says: ${clip(playerLine, 400)}` : "The player sits with them and lets the moment happen."
		].filter(Boolean).join("\n")
	};
}
var TOGETHER = [
	"dating",
	"engaged",
	"married"
];
function isTogether(person) {
	return TOGETHER.includes(person.relation);
}
function relationLabel(person) {
	if (person.relation === "dating") return person.open ? "Dating · open" : "Dating";
	if (person.relation === "engaged") return person.movedIn ? "Engaged · lives here" : "Engaged";
	if (person.relation === "married") return person.movedIn ? "Married · lives here" : "Married";
	if (person.relation === "ex") return "Ex";
	return bondLabel(person.bond);
}
function unreadCount(life) {
	return life.texts.filter((item) => !item.read).length + life.papers.filter((item) => !item.read).length;
}
function addText(life, from, body) {
	const text = {
		id: `txt-${life.day}-${life.minute}-${life.texts.length}`,
		from,
		day: life.day,
		body: clip(body, 180),
		read: false
	};
	return {
		...life,
		texts: [...life.texts, text].slice(-30)
	};
}
function addRumor(life, rumor) {
	return {
		...life,
		rumors: [...life.rumors, clip(rumor, 160)].slice(-8)
	};
}
function canCourt(life, residentId, kind) {
	const person = life.cast.find((item) => item.id === residentId);
	if (!person) return "They're not in this life.";
	if (kind === "date") {
		if (isTogether(person)) return `You and ${person.name} are already together.`;
		const need = person.traits?.includes("shy") ? 24 : 16;
		if (person.bond < need) return `${person.name} isn't ready to be asked out. Spend more time first.`;
		return null;
	}
	if (kind === "movein") {
		if (!isTogether(person)) return "Ask them out before they move in.";
		if (person.movedIn) return `${person.name} already lives here.`;
		if (person.bond < 40) return `${person.name} isn't ready to move in.`;
		return null;
	}
	if (kind === "propose") {
		if (person.relation !== "dating") return person.relation === "engaged" || person.relation === "married" ? "You already asked." : "Date first.";
		if (person.bond < 55) return "Stay closer before you propose.";
		return null;
	}
	if (kind === "marry") {
		if (person.relation !== "engaged") return "Propose first.";
		if (life.place !== "home" && life.place !== "park") return "A wedding fits at home or in the park.";
		if (life.money < 40) return "A small wedding costs $40.";
		const blocking = life.cast.find((other) => other.id !== person.id && isTogether(other) && !other.open);
		if (blocking) return `${blocking.name} hasn't agreed this can be open.`;
		return null;
	}
	if (kind === "open") {
		if (!isTogether(person)) return "You're not together.";
		if (person.open) return `${person.name} already agreed this is open.`;
		if (person.traits?.includes("faithful")) return `${person.name} wants this to stay between you.`;
		return null;
	}
	if (kind === "stay") {
		if (!isTogether(person)) return "Stay the night once you're dating.";
		if (life.minute < 1080 && !person.movedIn && life.place !== person.hangout) return "Ask later, or go where they keep.";
		return null;
	}
	if (!isTogether(person)) return "You're not together.";
	return null;
}
function courtOffers(life, person) {
	const options = [];
	if (!isTogether(person)) options.push({
		kind: "date",
		label: "Ask them out"
	});
	else {
		if (!person.movedIn) options.push({
			kind: "movein",
			label: "Ask them to move in"
		});
		if (person.relation === "dating") options.push({
			kind: "propose",
			label: "Propose"
		});
		if (person.relation === "engaged") options.push({
			kind: "marry",
			label: "Marry"
		});
		if (!person.open) options.push({
			kind: "open",
			label: "Ask if this can be open"
		});
		options.push({
			kind: "stay",
			label: "Stay the night"
		});
		options.push({
			kind: "breakup",
			label: "Break up"
		});
	}
	return options.map((option) => ({
		...option,
		blocked: canCourt(life, person.id, option.kind)
	})).filter((option) => option.kind !== "stay" || !option.blocked);
}
var COURT_BEAT = {
	date: "The player asks them out. They agree, in their own voice. Write the moment they say yes.",
	movein: "The player asks them to move into the apartment. They agree and mean it.",
	propose: "The player proposes. They say yes. Keep it specific to these two people.",
	marry: "This is their wedding, small and in town. They are married by the end of the scene.",
	open: "The player asks if the relationship can be open. They agree, with whatever reluctance or ease fits them.",
	breakup: "The relationship ends in this scene. They are hurt, relieved, or both, in character.",
	stay: "They spend the night together. Keep it tender and ordinary. By morning they are still themselves."
};
function courtshipBrief(life, person, kind, playerLine) {
	const brief = sceneBrief(life, person, playerLine);
	return {
		system: `${brief.system} ${COURT_BEAT[kind]} Do not have them refuse.`,
		user: brief.user
	};
}
function finishCourtship(life, residentId, kind, playerLine, sceneText) {
	const blocked = canCourt(life, residentId, kind);
	if (blocked) return { error: blocked };
	const person = life.cast.find((item) => item.id === residentId);
	if (!person) return { error: "They're not in this life." };
	if (kind === "stay") {
		const slept = sleep(life);
		const cast = slept.cast.map((item) => item.id === residentId ? {
			...item,
			bond: clamp(item.bond + 3, 0, 100),
			memories: [...item.memories, clip(`Stayed the night, day ${life.day}`, 180)].slice(-5)
		} : item);
		let updated = addRumor({
			...slept,
			cast
		}, `${person.name} and ${life.playerName} stayed the night.`);
		updated = addText(updated, person.name, "Last night was good.");
		return { life: pushLog(updated, `You stayed the night with ${person.name}.`, clip(sceneText, 2e3), person.name) };
	}
	let next = passTime(life, 40);
	if (kind === "marry") next = {
		...next,
		money: life.money - 40
	};
	const jealous = kind === "date" ? life.cast.filter((other) => other.id !== person.id && isTogether(other) && !other.open) : [];
	const place = placeById(life.place).name;
	const memory = clip(`Day ${life.day} at ${place}: ${clip(playerLine, 80) || kind}`, 180);
	const cast = next.cast.map((item) => {
		if (jealous.some((other) => other.id === item.id)) return {
			...item,
			bond: clamp(item.bond - ((item.traits ?? []).includes("jealous") ? 20 : 12), 0, 100),
			memories: [...item.memories, clip(`Heard you were with ${person.name}.`, 180)].slice(-5)
		};
		if (item.id !== residentId) return item;
		const memories = [...item.memories, memory].slice(-5);
		if (kind === "date") return {
			...item,
			relation: "dating",
			bond: clamp(item.bond + 8, 0, 100),
			memories
		};
		if (kind === "movein") return {
			...item,
			movedIn: true,
			bond: clamp(item.bond + 6, 0, 100),
			memories
		};
		if (kind === "propose") return {
			...item,
			relation: "engaged",
			bond: clamp(item.bond + 8, 0, 100),
			memories
		};
		if (kind === "marry") return {
			...item,
			relation: "married",
			bond: clamp(item.bond + 10, 0, 100),
			memories
		};
		if (kind === "open") return {
			...item,
			open: true,
			memories
		};
		return {
			...item,
			relation: "ex",
			open: false,
			movedIn: false,
			bond: Math.min(item.bond, (item.traits ?? []).includes("quick") ? 10 : 24),
			memories
		};
	});
	const rumor = kind === "date" ? `${person.name} was seen with ${life.playerName} at ${place}.` : kind === "movein" ? `${person.name} moved in with ${life.playerName}.` : kind === "propose" ? `${life.playerName} and ${person.name} are engaged.` : kind === "marry" ? `${life.playerName} and ${person.name} married in Millbrook.` : kind === "open" ? `${person.name} and ${life.playerName} agreed to see other people.` : `${life.playerName} and ${person.name} are no longer together.`;
	let updated = addRumor({
		...next,
		cast
	}, rumor);
	updated = addText(updated, person.name, kind === "breakup" ? "So that's that." : "I'm glad you asked.");
	for (const other of jealous) {
		updated = addRumor(updated, `${other.name} heard about ${person.name} and did not take it well.`);
		updated = addText(updated, other.name, `I heard about you and ${person.name}.`);
	}
	const scene = clip(sceneText, 2e3);
	const jealousNote = jealous.length ? ` ${jealous.map((other) => other.name).join(" and ")} heard.` : "";
	const verb = kind === "date" ? `You asked ${person.name} out.` : kind === "movein" ? `${person.name} is moving in.` : kind === "propose" ? `You proposed to ${person.name}.` : kind === "marry" ? `You married ${person.name}.` : kind === "open" ? `${person.name} agreed this can be open.` : `You and ${person.name} broke up.`;
	return { life: pushLog(updated, `${verb}${jealousNote}`, scene, person.name) };
}
function publishMonday(life) {
	if (life.day <= 1 || weekday(life.day) !== "Monday") return life;
	if (life.papers.some((paper) => paper.day === life.day)) return life;
	const rumors = life.rumors.slice(-4);
	const happened = life.log.slice(-6).map((entry) => entry.text);
	const headline = rumors[0] ? clip(rumors[0], 72) : "A quiet week in Millbrook";
	const body = clip([rumors.length ? rumors.join(" ") : "Nobody had much to pass along.", happened.length ? `The week left these traces: ${happened.join(" ")}` : ""].filter(Boolean).join("\n\n"), 700);
	const paper = {
		day: life.day,
		headline,
		body,
		read: false
	};
	return addText({
		...life,
		papers: [...life.papers, paper].slice(-8),
		rumors: []
	}, "Millbrook News", headline);
}
function paperBrief(paper) {
	return {
		system: "You write the Monday edition of a small-town paper called the Millbrook News. First line is a headline of at most twelve words. Then two short paragraphs. No markdown.",
		user: `Facts to use, and not invent past:\n${paper.headline}\n${paper.body}`
	};
}
function replacePaper(life, day, headline, body) {
	return {
		...life,
		papers: life.papers.map((paper) => paper.day === day ? {
			...paper,
			headline: clip(headline, 80),
			body: clip(body, 700),
			read: true
		} : paper)
	};
}
function markNewsRead(life) {
	return {
		...life,
		papers: life.papers.map((paper) => ({
			...paper,
			read: true
		}))
	};
}
function markTextsRead(life) {
	return {
		...life,
		texts: life.texts.map((text) => ({
			...text,
			read: true
		}))
	};
}
function setPaintScenes(life, paintScenes) {
	return {
		...life,
		paintScenes
	};
}
function addShot(life, caption, withName) {
	const shot = {
		id: `lifeimg-${crypto.randomUUID()}`,
		day: life.day,
		minute: life.minute,
		place: life.place,
		caption: clip(caption, 140) || placeById(life.place).name,
		with: withName
	};
	return {
		shot,
		life: {
			...life,
			shots: [...life.shots, shot].slice(-24)
		}
	};
}
function removeShot(life, id) {
	return {
		...life,
		shots: life.shots.filter((shot) => shot.id !== id)
	};
}
function picturePrompt(life, shot, appearance) {
	const place = placeById(shot.place);
	return [
		appearance,
		life.cast.find((item) => item.name === shot.with)?.outfit ?? "",
		place.name,
		place.blurb,
		`${seasonName(shot.day)} clothes`,
		shot.with ? `with ${shot.with}` : "",
		shot.caption,
		"single scene, no text, no watermark"
	].map((part) => part.trim()).filter(Boolean).join(", ").slice(0, 1500);
}
function editLife(life, patch) {
	const day = patch.day === void 0 ? life.day : clamp(Math.round(patch.day), 1, 9999);
	const minute = patch.minute === void 0 ? life.minute : clamp(Math.round(patch.minute), 0, 1439);
	return {
		...life,
		title: patch.title === void 0 ? life.title : clip(patch.title, 60) || life.title,
		playerName: patch.playerName === void 0 ? life.playerName : clip(patch.playerName, 60) || life.playerName,
		playerNote: patch.playerNote === void 0 ? life.playerNote : clip(patch.playerNote, 280),
		money: patch.money === void 0 ? life.money : clamp(Math.round(patch.money), 0, 99999),
		debt: patch.debt === void 0 ? life.debt : clamp(Math.round(patch.debt), 0, 99999),
		day,
		minute,
		vehicle: patch.vehicle ?? life.vehicle,
		home: patch.home ?? life.home,
		place: patch.place ?? life.place,
		paintScenes: patch.paintScenes ?? life.paintScenes,
		modules: patch.modules ? {
			...life.modules,
			...patch.modules
		} : life.modules,
		needs: {
			energy: patch.energy === void 0 ? life.needs.energy : clamp(Math.round(patch.energy), 0, 100),
			hunger: patch.hunger === void 0 ? life.needs.hunger : clamp(Math.round(patch.hunger), 0, 100)
		}
	};
}
function editResident(life, id, patch) {
	return {
		...life,
		cast: life.cast.map((person) => {
			if (person.id !== id) return person;
			return {
				...person,
				...patch,
				name: patch.name === void 0 ? person.name : clip(patch.name, 80) || person.name,
				personality: patch.personality === void 0 ? person.personality : clip(patch.personality, 500),
				summary: patch.summary === void 0 ? person.summary : clip(patch.summary, 240),
				secret: patch.secret === void 0 ? person.secret : clip(patch.secret, 240),
				outfit: patch.outfit === void 0 ? person.outfit : clip(patch.outfit, 160),
				bond: patch.bond === void 0 ? person.bond : clamp(Math.round(patch.bond), 0, 100),
				birthday: patch.birthday === void 0 ? person.birthday : clamp(Math.round(patch.birthday), 1, 120),
				traits: patch.traits ?? person.traits
			};
		})
	};
}
function editScene(life, text) {
	const scene = text.trim();
	return {
		...life,
		scene: scene ? clip(scene, 2e3) : null
	};
}
function takeJob(life, kind) {
	if (life.place !== "office") return { error: "The board is at Millbrook Office." };
	if (!isOpen(placeById("office"), life.minute)) return { error: "The office is closed." };
	if (kind === null) {
		if (!life.job) return { error: "You don't have a job to quit." };
		return { life: pushLog({
			...passTime(life, 15),
			job: null,
			workedDay: 0
		}, "You quit.") };
	}
	const job = JOB_LIST.find((item) => item.kind === kind);
	if (!job) return { error: "That job isn't posted." };
	if (!life.modules?.jobs && kind !== "desk") return { error: "Turn on more jobs if you want that posting." };
	return { life: pushLog({
		...passTime(life, 30),
		job: { ...job },
		workedDay: 0
	}, `You took ${job.title}. A shift pays $${job.wage}.`) };
}
function buyRide(life, vehicle) {
	const price = vehicle === "bike" ? 80 : 400;
	const where = life.modules?.districts ? "garage" : "market";
	if (life.place !== where) return { error: `They sell that at ${placeById(where).name}.` };
	if (life.vehicle === vehicle) return { error: "You already have that." };
	if (life.money < price) return { error: `That costs $${price}.` };
	return { life: pushLog(passTime({
		...life,
		money: life.money - price,
		vehicle
	}, 20), vehicle === "bike" ? "You bought a bike." : "You bought a used car.") };
}
function buyHome(life, home) {
	if (!life.modules?.homes) return { error: "Turn on homes first." };
	if (life.place !== "hillcrest" && life.place !== "home") return { error: "Look at places in Hillcrest, or decide at home." };
	const price = home === "cottage" ? 800 : 1400;
	if (life.home === home) return { error: "You already live there." };
	if (life.money < price) return { error: `That costs $${price}.` };
	return { life: addRumor(pushLog(passTime({
		...life,
		money: life.money - price,
		home
	}, 60), `You bought a ${home}. Rent stops.`), `${life.playerName} moved into a ${home}.`) };
}
function cook(life) {
	if (!life.modules?.cooking) return { error: "Turn on cooking first." };
	if (life.place !== "home") return { error: "The kitchen is at home." };
	if (life.money < 6) return { error: "Groceries cost $6." };
	const next = passTime({
		...life,
		money: life.money - 6
	}, 45);
	return { life: pushLog({
		...next,
		needs: {
			...next.needs,
			hunger: clamp(next.needs.hunger - 50, 0, 100)
		}
	}, "You cooked. It smells like a real meal.") };
}
function payDebt(life, amount) {
	const pay = clamp(Math.round(amount), 1, life.money);
	if (life.debt <= 0) return { error: "You don't owe anything." };
	if (life.money <= 0) return { error: "You have nothing to put toward the tab." };
	const paid = Math.min(pay, life.debt);
	return { life: pushLog({
		...life,
		money: life.money - paid,
		debt: life.debt - paid
	}, `You paid $${paid} on the tab.`) };
}
function doFavour(life, residentId) {
	const person = life.cast.find((item) => item.id === residentId);
	if (!person) return { error: "They're not here." };
	if (life.money < 10) return { error: "A favour costs $10." };
	const next = passTime({
		...life,
		money: life.money - 10
	}, 20);
	const cast = next.cast.map((item) => item.id === residentId ? {
		...item,
		bond: clamp(item.bond + 4, 0, 100)
	} : item);
	return { life: pushLog({
		...next,
		cast
	}, `You did ${person.name} a favour.`) };
}
function addPlan(life, plan) {
	const next = {
		id: `plan-${life.plans.length}-${plan.day}`,
		day: clamp(Math.round(plan.day), life.day, life.day + 30),
		place: plan.place,
		withId: plan.withId,
		note: clip(plan.note, 120)
	};
	return {
		...life,
		plans: [...life.plans, next].slice(-12)
	};
}
function removePlan(life, id) {
	return {
		...life,
		plans: life.plans.filter((plan) => plan.id !== id)
	};
}
function plansToday(life) {
	return (life.plans ?? []).filter((plan) => plan.day === life.day);
}
function addNpc(life, card) {
	if (!life.modules?.npcs) return life;
	if (life.cast.length >= 8) return life;
	const person = sketchResident(card, life.cast.length);
	return pushLog({
		...life,
		cast: [...life.cast, person]
	}, `${person.name} is new around Millbrook.`);
}
var LOCAL_NPCS = [
	{
		name: "June Pell",
		summary: "Keeps the clinic calendar.",
		personality: "Practical. Talks with her hands.",
		description: "Cardigan, reading glasses."
	},
	{
		name: "Marcus Hale",
		summary: "Fixes bikes behind the market.",
		personality: "Patient, a little sarcastic.",
		description: "Grease on one cuff."
	},
	{
		name: "Lila Cho",
		summary: "Shelves the returns at the library.",
		personality: "Soft voice, sharp memory.",
		description: "Ink on her thumb."
	},
	{
		name: "Owen Briggs",
		summary: "Plays the late set when the diner allows it.",
		personality: "Easy grin, restless.",
		description: "Worn jacket."
	},
	{
		name: "Rita Sol",
		summary: "Knows who owes what at the market.",
		personality: "Direct, fair.",
		description: "Apron over a dark dress."
	},
	{
		name: "Ned Park",
		summary: "Walks the same loop every morning.",
		personality: "Quiet, notices the weather.",
		description: "Cap, old boots."
	}
];
function localNpc(life) {
	const taken = new Set(life.cast.map((person) => person.name.toLowerCase()));
	const found = LOCAL_NPCS.find((item) => !taken.has(item.name.toLowerCase()));
	if (!found) return null;
	const slug = found.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
	return {
		...found,
		id: `npc-${slug}`
	};
}
function npcBrief(life) {
	return {
		system: "Invent one original resident of a modern small town called Millbrook. Reply with exactly three lines: Name: ... Personality: ... Summary: ... No markdown.",
		user: `People already here: ${life.cast.map((person) => person.name).join(", ") || "none yet"}. Do not reuse a name.`
	};
}
function parseNpc(text) {
	const name = text.match(/Name:\s*(.+)/i)?.[1]?.split(/[.\n]/)[0]?.trim() ?? "";
	if (name.length < 2) return null;
	const personality = text.match(/Personality:\s*(.+)/i)?.[1]?.trim() ?? "";
	const summary = text.match(/Summary:\s*(.+)/i)?.[1]?.trim() ?? "";
	return {
		id: `npc-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "someone"}`,
		name: clip(name, 80),
		summary: clip(summary, 240),
		personality: clip(personality, 500),
		description: ""
	};
}
function guideFor(life) {
	const entries = [
		{
			title: "Clock",
			body: "Walking, eating, work, and scenes move the clock. Places keep hours. Sleep at home jumps you to 7:30."
		},
		{
			title: "Needs",
			body: "Hunger rises and energy falls as time passes. Eat in town or at home. Sit at the park. Sleep fills you back up."
		},
		{
			title: "Edit",
			body: "The Edit app changes your name, the clock, money, needs, job, home, modules, and each person. Rename someone by hand, or copy the name from their card."
		},
		{
			title: "Job and rent",
			body: "Ask at Millbrook Office. One shift a day, at that job's place. Rent leaves the drawer every week unless you own the place. If you are short, it goes on a tab."
		},
		{
			title: "Dating",
			body: "Ask someone out once they know you. Shy people need longer. Moving in, a proposal, a wedding, and staying the night happen in a scene. A wedding needs your home or the park, and $40. A faithful person will not open the relationship. A jealous one takes a second date harder."
		},
		{
			title: "News",
			body: "The paper comes out Monday morning. It prints what the town passed along."
		},
		{
			title: "Pictures",
			body: "Take a picture of a scene, or turn on Paint scenes. Outfits you write in Edit are part of the picture. Without a NovelAI token, the moment stays a printed card."
		}
	];
	if (life.modules?.jobs) entries.push({
		title: "More jobs",
		body: "At the office you can take the shop, deliveries, an evening gig at the diner, or work from home. Quit from the same board."
	});
	if (life.modules?.weather) entries.push({
		title: "Weather",
		body: "The sky is on the clock. A storm makes a walk or a bike ride slower. A car ignores it and costs $2 a trip."
	});
	if (life.modules?.districts) entries.push({
		title: "Wider town",
		body: "Hillcrest, the clinic, the garage, the library, and the venue keep their own hours."
	});
	if (life.modules?.calendar) entries.push({
		title: "Calendar",
		body: "Put a plan on the phone. An outing is a longer scene than a visit."
	});
	if (life.modules?.birthdays) entries.push({
		title: "Birthdays",
		body: "Each person has a day in the year. Edit can move it. That morning they text you."
	});
	if (life.modules?.cooking) entries.push({
		title: "Cooking",
		body: "At home, Cook spends $6 and fills you more than the cupboard."
	});
	if (life.modules?.homes) entries.push({
		title: "Homes",
		body: "Buy a cottage for $800 or a townhouse for $1400. Rent stops. The town hears about it."
	});
	if (life.modules?.opinions) entries.push({
		title: "Opinions",
		body: "After a scene, someone who knows you may text about it."
	});
	if (life.modules?.npcs) entries.push({
		title: "New people",
		body: "Meet someone new adds a person the model invents, up to eight in town. Edit them like anyone else."
	});
	if (life.modules?.bills) entries.push({
		title: "Bills",
		body: "Utilities add $15 to the weekly bill. If the tab reaches $120, you pay some of it before leaving home."
	});
	if (life.vehicle !== "walk") entries.push({
		title: "Getting around",
		body: life.vehicle === "bike" ? "The bike shortens a trip." : "The car is the short trip, and costs $2 in gas."
	});
	return entries;
}
function normalizeLife(input) {
	const blank = createLife({
		id: input.id,
		title: input.title || "Millbrook",
		playerName: input.playerName || "You",
		playerNote: input.playerNote || "",
		cast: [],
		now: input.createdAt
	});
	const cast = (input.cast ?? []).map((person, index) => ({
		...sketchResident({
			id: person.id,
			name: person.name,
			summary: person.summary ?? "",
			personality: person.personality ?? "",
			description: person.description ?? ""
		}, index),
		...person,
		hangout: person.hangout || hangoutFor(index),
		memories: person.memories ?? [],
		relation: person.relation ?? "single",
		open: person.open === true,
		movedIn: person.movedIn === true,
		role: person.role ?? "town",
		traits: Array.isArray(person.traits) ? person.traits : [],
		secret: person.secret ?? "",
		outfit: person.outfit ?? "",
		birthday: typeof person.birthday === "number" ? person.birthday : 8 + index % 12 * 9,
		bond: typeof person.bond === "number" ? person.bond : 8
	}));
	const job = input.job ? {
		...FRONT_DESK,
		...input.job,
		kind: input.job.kind || "desk",
		place: input.job.place || "office"
	} : null;
	return {
		...blank,
		...input,
		cast,
		job,
		rumors: input.rumors ?? [],
		papers: input.papers ?? [],
		texts: input.texts ?? [],
		shots: input.shots ?? [],
		plans: input.plans ?? [],
		modules: {
			...MODULES_OFF,
			...input.modules
		},
		vehicle: input.vehicle ?? "walk",
		home: input.home ?? "apartment",
		paintScenes: input.paintScenes === true,
		log: input.log ?? blank.log,
		needs: input.needs ?? blank.needs
	};
}
var quietBtn$1 = "flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg disabled:opacity-60";
var primaryBtn$1 = "flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60";
var field = "min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg";
function LifePhone({ life, images, busy, cards, initial = "contacts", onChange, onClose, onDeleteShot, onRewrite }) {
	const [app, setApp] = (0, import_react.useState)(initial);
	const [query, setQuery] = (0, import_react.useState)("");
	const [zoom, setZoom] = (0, import_react.useState)(null);
	const paper = life.papers[life.papers.length - 1] ?? null;
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "Escape") {
				if (zoom) setZoom(null);
				else onClose();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose, zoom]);
	function openApp(next) {
		setApp(next);
		if (next === "news") onChange(markNewsRead(life));
		if (next === "contacts") onChange(markTextsRead(life));
	}
	const guide = guideFor(life).filter((entry) => `${entry.title} ${entry.body}`.toLowerCase().includes(query.trim().toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-30 flex items-end justify-center bg-bg/80 p-3 sm:items-center",
		role: "presentation",
		onMouseDown: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Phone",
			className: "flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-surface text-fg",
			onMouseDown: (event) => event.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 font-display text-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
							className: "size-5 text-gold",
							"aria-hidden": "true"
						}), "Phone"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: quietBtn$1,
						onClick: onClose,
						"aria-label": "Close phone",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Close"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 px-4 pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppButton, {
							current: app,
							id: "contacts",
							label: "Contacts",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							onOpen: openApp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppButton, {
							current: app,
							id: "news",
							label: "News",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							onOpen: openApp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppButton, {
							current: app,
							id: "guide",
							label: "Guide",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							onOpen: openApp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppButton, {
							current: app,
							id: "pictures",
							label: "Pictures",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							onOpen: openApp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppButton, {
							current: app,
							id: "edit",
							label: "Edit",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							onOpen: openApp
						}),
						life.modules.calendar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppButton, {
							current: app,
							id: "calendar",
							label: "Calendar",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							onOpen: openApp
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
					children: [
						app === "contacts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contacts, { life }) : null,
						app === "news" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(News, {
							life,
							paper,
							busy,
							onRewrite: () => paper && onRewrite(paper.day)
						}) : null,
						app === "guide" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "sr-only",
									htmlFor: "life-guide",
									children: "Search the guide"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "life-guide",
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "Search the guide",
									className: field
								}),
								guide.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-md border border-border bg-bg p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold",
										children: entry.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: entry.body
									})]
								}, entry.title)),
								guide.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Nothing in the guide matches that."
								}) : null
							]
						}) : null,
						app === "pictures" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pictures, {
							life,
							images,
							busy,
							onPaint: (paint) => onChange(setPaintScenes(life, paint)),
							onZoom: setZoom,
							onDelete: onDeleteShot
						}) : null,
						app === "edit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditApp, {
							life,
							cards,
							onChange
						}) : null,
						app === "calendar" && life.modules.calendar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarApp, {
							life,
							onChange
						}) : null
					]
				})
			]
		}), zoom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/90 p-4",
			role: "presentation",
			onMouseDown: (event) => {
				event.stopPropagation();
				setZoom(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "max-h-full max-w-3xl",
				onMouseDown: (event) => event.stopPropagation(),
				children: [images[zoom.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: images[zoom.id],
					alt: zoom.caption,
					className: "max-h-[75dvh] w-full rounded-md object-contain"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printed, { shot: zoom }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Day ",
						zoom.day,
						" · ",
						zoom.caption
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: quietBtn$1,
						onClick: () => setZoom(null),
						children: "Close picture"
					})]
				})]
			})
		}) : null]
	});
}
function AppButton({ current, id, label, icon, onOpen }) {
	const on = current === id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": on,
		className: `flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold ${on ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`,
		onClick: () => onOpen(id),
		children: [icon, label]
	});
}
function EditApp({ life, cards, onChange }) {
	const [personId, setPersonId] = (0, import_react.useState)(life.cast[0]?.id ?? "");
	const person = life.cast.find((item) => item.id === personId) ?? life.cast[0] ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Edits apply to this life. Buying a home or a ride in town is separate, and costs money."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouFields, {
				life,
				onChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockFields, {
				life,
				onChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeFields, {
				life,
				onChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "flex flex-col gap-2 rounded-md border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "px-1 text-sm font-semibold",
					children: "Modules"
				}), MODULE_NOTES.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-start gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "mt-1",
						checked: life.modules[note.key],
						onChange: (event) => onChange(editLife(life, { modules: { [note.key]: event.target.checked } }))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold",
						children: note.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-muted",
						children: note.detail
					})] })]
				}, note.key))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3 rounded-md border border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "People"
					}),
					life.cast.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nobody to edit yet."
					}) : null,
					life.cast.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-sm font-semibold",
						htmlFor: "life-edit-person",
						children: ["Who", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "life-edit-person",
							className: field,
							value: person?.id ?? "",
							onChange: (event) => setPersonId(event.target.value),
							children: life.cast.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.id,
								children: item.name
							}, item.id))
						})]
					}) : null,
					person ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonFields, {
						person,
						card: cards.find((item) => item.id === person.id) ?? null,
						places: placesFor(life),
						onSave: (patch) => onChange(editResident(life, person.id, patch))
					}, person.id) : null
				]
			}),
			life.scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneFields, {
				life,
				onChange
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "An open scene can be rewritten here, or on the page."
			})
		]
	});
}
function YouFields({ life, onChange }) {
	const [title, setTitle] = (0, import_react.useState)(life.title);
	const [playerName, setPlayerName] = (0, import_react.useState)(life.playerName);
	const [playerNote, setPlayerNote] = (0, import_react.useState)(life.playerNote);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3 rounded-md border border-border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "You"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-edit-title",
				children: ["Life name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "life-edit-title",
					className: field,
					value: title,
					onChange: (event) => setTitle(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-edit-name",
				children: ["What the town calls you", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "life-edit-name",
					className: field,
					value: playerName,
					onChange: (event) => setPlayerName(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-edit-note",
				children: ["One line about you", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "life-edit-note",
					rows: 3,
					className: "w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg",
					value: playerNote,
					onChange: (event) => setPlayerNote(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: primaryBtn$1,
				onClick: () => onChange(editLife(life, {
					title,
					playerName,
					playerNote
				})),
				children: "Save you"
			})
		]
	});
}
function ClockFields({ life, onChange }) {
	const [day, setDay] = (0, import_react.useState)(String(life.day));
	const [hour, setHour] = (0, import_react.useState)(String(Math.floor(life.minute / 60)));
	const [mins, setMins] = (0, import_react.useState)(String(life.minute % 60));
	const [money, setMoney] = (0, import_react.useState)(String(life.money));
	const [debt, setDebt] = (0, import_react.useState)(String(life.debt));
	const [energy, setEnergy] = (0, import_react.useState)(String(life.needs.energy));
	const [hunger, setHunger] = (0, import_react.useState)(String(life.needs.hunger));
	const [place, setPlace] = (0, import_react.useState)(life.place);
	const places = placesFor(life);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3 rounded-md border border-border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Clock, money, needs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Day",
						id: "life-edit-day",
						value: day,
						onChange: setDay
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Hour",
						id: "life-edit-hour",
						value: hour,
						onChange: setHour
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Minute",
						id: "life-edit-min",
						value: mins,
						onChange: setMins
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Money",
						id: "life-edit-money",
						value: money,
						onChange: setMoney
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Tab",
						id: "life-edit-debt",
						value: debt,
						onChange: setDebt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Energy",
						id: "life-edit-energy",
						value: energy,
						onChange: setEnergy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Hunger",
						id: "life-edit-hunger",
						value: hunger,
						onChange: setHunger
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-edit-place",
				children: ["Where you are", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "life-edit-place",
					className: field,
					value: place,
					onChange: (event) => setPlace(event.target.value),
					children: (places.some((spot) => spot.id === place) ? places : [...places, placeById(place)]).map((spot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: spot.id,
						children: spot.name
					}, spot.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: primaryBtn$1,
				onClick: () => onChange(editLife(life, {
					day: Number(day),
					minute: Math.min(23, Math.max(0, Math.round(Number(hour) || 0))) * 60 + Math.min(59, Math.max(0, Math.round(Number(mins) || 0))),
					money: Number(money),
					debt: Number(debt),
					energy: Number(energy),
					hunger: Number(hunger),
					place
				})),
				children: "Save the clock"
			})
		]
	});
}
function HomeFields({ life, onChange }) {
	const [vehicle, setVehicle] = (0, import_react.useState)(life.vehicle);
	const [home, setHome] = (0, import_react.useState)(life.home);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3 rounded-md border border-border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Home and getting around"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "This sets them without a purchase. The market, the garage, and Hillcrest still charge."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-edit-ride",
				children: ["Ride", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "life-edit-ride",
					className: field,
					value: vehicle,
					onChange: (event) => setVehicle(event.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "walk",
							children: "On foot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "bike",
							children: "Bike"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "car",
							children: "Car"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-edit-home",
				children: ["Home", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "life-edit-home",
					className: field,
					value: home,
					onChange: (event) => setHome(event.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "apartment",
							children: "Apartment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "cottage",
							children: "Cottage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "townhouse",
							children: "Townhouse"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: primaryBtn$1,
				onClick: () => onChange(editLife(life, {
					vehicle,
					home
				})),
				children: "Save home"
			})
		]
	});
}
function PersonFields({ person, card, places, onSave }) {
	const [name, setName] = (0, import_react.useState)(person.name);
	const [personality, setPersonality] = (0, import_react.useState)(person.personality);
	const [summary, setSummary] = (0, import_react.useState)(person.summary);
	const [bond, setBond] = (0, import_react.useState)(String(person.bond));
	const [relation, setRelation] = (0, import_react.useState)(person.relation);
	const [open, setOpen] = (0, import_react.useState)(person.open);
	const [movedIn, setMovedIn] = (0, import_react.useState)(person.movedIn);
	const [hangout, setHangout] = (0, import_react.useState)(person.hangout);
	const [secret, setSecret] = (0, import_react.useState)(person.secret);
	const [outfit, setOutfit] = (0, import_react.useState)(person.outfit);
	const [birthday, setBirthday] = (0, import_react.useState)(String(person.birthday));
	const [role, setRole] = (0, import_react.useState)(person.role);
	const [traits, setTraits] = (0, import_react.useState)(person.traits);
	function toggleTrait(trait) {
		setTraits((current) => current.includes(trait) ? current.filter((item) => item !== trait) : [...current, trait]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-name",
				children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "life-person-name",
					className: field,
					value: name,
					onChange: (event) => setName(event.target.value)
				})]
			}),
			card ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: quietBtn$1,
				onClick: () => {
					setName(card.name.trim() || name);
					setSummary(card.summary);
					setPersonality(card.personality);
				},
				children: "Use the name on their card"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-role",
				children: ["Role from day one", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "life-person-role",
					className: field,
					value: role,
					onChange: (event) => setRole(event.target.value),
					children: ROLE_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: option.id,
						children: option.label
					}, option.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-relation",
				children: ["Relationship", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "life-person-relation",
					className: field,
					value: relation,
					onChange: (event) => setRelation(event.target.value),
					children: RELATION_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: option.id,
						children: option.label
					}, option.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Bond",
					id: "life-person-bond",
					value: bond,
					onChange: setBond
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Birthday day",
					id: "life-person-day",
					value: birthday,
					onChange: setBirthday
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Birthday lands on day ",
					Math.max(1, Math.round(Number(birthday) || 1)),
					" · ",
					seasonName(Math.max(1, Math.round(Number(birthday) || 1))),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-hangout",
				children: ["Where they keep", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "life-person-hangout",
					className: field,
					value: hangout,
					onChange: (event) => setHangout(event.target.value),
					children: (places.some((spot) => spot.id === hangout) ? places : [...places, placeById(hangout)]).filter((spot) => spot.id !== "home").map((spot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: spot.id,
						children: spot.name
					}, spot.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-sm font-semibold",
					children: "Traits"
				}), TRAIT_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: traits.includes(option.id),
						onChange: () => toggleTrait(option.id)
					}), option.label]
				}, option.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-3 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: open,
					onChange: (event) => setOpen(event.target.checked)
				}), "This can be open"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-3 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: movedIn,
					onChange: (event) => setMovedIn(event.target.checked)
				}), "Lives with you"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-personality",
				children: ["Personality", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "life-person-personality",
					rows: 3,
					className: "w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg",
					value: personality,
					onChange: (event) => setPersonality(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-summary",
				children: ["Summary", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "life-person-summary",
					rows: 2,
					className: "w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg",
					value: summary,
					onChange: (event) => setSummary(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-outfit",
				children: ["Outfit, for pictures", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "life-person-outfit",
					className: field,
					value: outfit,
					onChange: (event) => setOutfit(event.target.value),
					placeholder: "Red coat, scuffed boots"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm font-semibold",
				htmlFor: "life-person-secret",
				children: ["Secret, only the scene knows", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "life-person-secret",
					rows: 2,
					className: "w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg",
					value: secret,
					onChange: (event) => setSecret(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: primaryBtn$1,
				onClick: () => onSave({
					name,
					personality,
					summary,
					bond: Number(bond),
					relation,
					open,
					movedIn,
					hangout,
					secret,
					outfit,
					birthday: Number(birthday),
					role,
					traits
				}),
				children: ["Save ", person.name]
			})
		]
	});
}
function SceneFields({ life, onChange }) {
	const [text, setText] = (0, import_react.useState)(life.scene ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3 rounded-md border border-border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Open scene"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "sr-only",
				htmlFor: "life-edit-scene",
				children: "Scene text"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "life-edit-scene",
				rows: 6,
				className: "w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg",
				value: text,
				onChange: (event) => setText(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: primaryBtn$1,
				onClick: () => onChange(editScene(life, text)),
				children: "Save the scene"
			})
		]
	});
}
function CalendarApp({ life, onChange }) {
	const places = placesFor(life).filter((spot) => spot.id !== "home");
	const [day, setDay] = (0, import_react.useState)(String(life.day));
	const [place, setPlace] = (0, import_react.useState)(places[0]?.id ?? "cafe");
	const [withId, setWithId] = (0, import_react.useState)(life.cast[0]?.id ?? "");
	const [note, setNote] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "A plan shows on that morning. An outing, in town, runs longer than a visit."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					onChange(addPlan(life, {
						day: Number(day),
						place,
						withId,
						note
					}));
					setNote("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Day",
						id: "life-plan-day",
						value: day,
						onChange: setDay
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm font-semibold",
						htmlFor: "life-plan-place",
						children: ["Place", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "life-plan-place",
							className: field,
							value: place,
							onChange: (event) => setPlace(event.target.value),
							children: places.map((spot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: spot.id,
								children: spot.name
							}, spot.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm font-semibold",
						htmlFor: "life-plan-who",
						children: ["With", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "life-plan-who",
							className: field,
							value: withId,
							onChange: (event) => setWithId(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Just you"
							}), life.cast.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: person.id,
								children: person.name
							}, person.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm font-semibold",
						htmlFor: "life-plan-note",
						children: ["Note", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "life-plan-note",
							className: field,
							value: note,
							onChange: (event) => setNote(event.target.value),
							placeholder: "Coffee, if they're there"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: primaryBtn$1,
						children: "Add the plan"
					})
				]
			}),
			life.plans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nothing on the calendar."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: life.plans.map((plan) => {
					const who = life.cast.find((person) => person.id === plan.withId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2 rounded-md border border-border bg-bg p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Day ",
							plan.day,
							" · ",
							placeById(plan.place).name,
							who ? ` · ${who.name}` : "",
							plan.note ? ` · ${plan.note}` : ""
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 shrink-0 text-muted",
							onClick: () => onChange(removePlan(life, plan.id)),
							children: "Drop"
						})]
					}, plan.id);
				})
			})
		]
	});
}
function Num({ label, id, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1 text-sm font-semibold",
		htmlFor: id,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			inputMode: "numeric",
			className: field,
			value,
			onChange: (event) => onChange(event.target.value)
		})]
	});
}
function Contacts({ life }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "You, and how the town sits with you."
			}),
			life.cast.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nobody from your library is in this life."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: life.cast.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md border border-border bg-bg p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: person.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-gold",
								children: relationLabel(person)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								ROLE_OPTIONS.find((option) => option.id === person.role)?.label ?? "In town",
								" · Bond ",
								person.bond,
								" ·",
								" ",
								person.movedIn ? "Lives with you" : placeById(person.hangout).name
							]
						}),
						person.traits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: person.traits.map((trait) => TRAIT_OPTIONS.find((option) => option.id === trait)?.label ?? trait).join(", ")
						}) : null,
						person.memories[person.memories.length - 1] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fg",
							children: person.memories[person.memories.length - 1]
						}) : null
					]
				}, person.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Messages"
			}),
			life.texts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No messages yet."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: [...life.texts].reverse().map((text) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md bg-bg px-3 py-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-fg",
							children: text.from
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · Day ", text.day]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-fg",
							children: text.body
						})
					]
				}, text.id))
			})
		]
	});
}
function News({ life, paper, busy, onRewrite }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "The Millbrook News prints on Monday mornings."
			}),
			paper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-md bg-paper p-4 text-ink",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-ink-soft",
						children: [
							weekday(paper.day),
							" · Day ",
							paper.day
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-display text-2xl",
						children: paper.headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed",
						children: paper.body
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: "No edition yet. Sleep through to a Monday."
			}),
			paper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: quietBtn$1,
				disabled: busy,
				onClick: onRewrite,
				children: busy ? "Writing the edition…" : "Rewrite this edition"
			}) : null,
			life.rumors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "The town is already talking. It lands in Monday's paper."
			}) : null
		]
	});
}
function Pictures({ life, images, busy, onPaint, onZoom, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": life.paintScenes,
				className: quietBtn$1,
				disabled: busy,
				onClick: () => onPaint(!life.paintScenes),
				children: life.paintScenes ? "Paint scenes is on" : "Paint scenes is off"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "On, each scene keeps a picture. A NovelAI token paints it. Otherwise you get a printed card."
			}),
			life.shots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No pictures yet. Take one from a scene."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-2 gap-2",
				children: [...life.shots].reverse().map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "overflow-hidden rounded-md text-left",
						onClick: () => onZoom(shot),
						"aria-label": `Open picture ${shot.caption}`,
						children: images[shot.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: images[shot.id],
							alt: "",
							className: "aspect-square w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printed, { shot })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm text-muted",
						onClick: () => onDelete(shot.id),
						children: "Delete"
					})]
				}, shot.id))
			})
		]
	});
}
function Printed({ shot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex aspect-square flex-col justify-between bg-paper p-3 text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-ink-soft",
				children: [
					seasonName(shot.day),
					" · ",
					placeById(shot.place).name
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg leading-snug",
				children: shot.caption
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-ink-soft",
				children: [
					shot.with ? `With ${shot.with}` : "Millbrook",
					" · ",
					clockLabel(shot.minute)
				]
			})
		]
	});
}
var useLife = create()(persist((set, get) => ({
	lives: [],
	activeId: null,
	start: (input) => {
		const life = createLife(input);
		set({
			lives: [life, ...get().lives.filter((item) => item.id !== life.id)],
			activeId: life.id
		});
		return life.id;
	},
	open: (id) => set({ activeId: id }),
	close: () => set({ activeId: null }),
	remove: (id) => set({
		lives: get().lives.filter((item) => item.id !== id),
		activeId: get().activeId === id ? null : get().activeId
	}),
	replace: (life) => set({ lives: get().lives.map((item) => item.id === life.id ? normalizeLife(life) : item) })
}), {
	name: "cardwright-life",
	skipHydration: true,
	merge: (persisted, current) => {
		const saved = persisted ?? {};
		const lives = Array.isArray(saved.lives) ? saved.lives.map((item) => normalizeLife(item)) : [];
		return {
			...current,
			...saved,
			lives,
			activeId: saved.activeId ?? null
		};
	}
}));
var primaryBtn = "flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60";
var quietBtn = "flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60";
function LifeTab() {
	const shelf = useStudio((state) => state.shelf);
	const personas = useStudio((state) => state.personas);
	const editorPersona = useStudio((state) => state.persona);
	const lives = useLife((state) => state.lives);
	const activeId = useLife((state) => state.activeId);
	const start = useLife((state) => state.start);
	const open = useLife((state) => state.open);
	const close = useLife((state) => state.close);
	const remove = useLife((state) => state.remove);
	const replace = useLife((state) => state.replace);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [drafting, setDrafting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		Promise.resolve(useLife.persist.rehydrate()).then(() => {
			if (!cancel) setReady(true);
		});
		return () => {
			cancel = true;
		};
	}, []);
	const active = lives.find((life) => life.id === activeId) ?? null;
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Opening Millbrook…"
		})
	});
	if (drafting || !active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TownDesk, {
		lives,
		shelf,
		personas,
		editor: editorPersona.name.trim() ? editorPersona : null,
		drafting,
		onDraft: () => {
			close();
			setDrafting(true);
		},
		onCancel: () => setDrafting(false),
		onOpen: (id) => {
			setDrafting(false);
			open(id);
		},
		onRemove: remove,
		onStart: (input) => {
			start(input);
			setDrafting(false);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Town, {
		life: active,
		shelf,
		onChange: replace,
		onLeave: close
	});
}
function TownDesk({ lives, shelf, personas, editor, drafting, onDraft, onCancel, onOpen, onRemove, onStart }) {
	const choices = (0, import_react.useMemo)(() => {
		const saved = personas.filter((item) => item.card.name.trim()).map((item) => ({
			id: item.id,
			name: item.card.name.trim(),
			note: item.card.summary
		}));
		if (!editor) return saved;
		return [{
			id: "editor",
			name: editor.name.trim(),
			note: editor.summary
		}, ...saved.filter((item) => item.name !== editor.name.trim())];
	}, [editor, personas]);
	const [title, setTitle] = (0, import_react.useState)("Millbrook");
	const [personaId, setPersonaId] = (0, import_react.useState)(choices[0]?.id ?? "");
	const [playerName, setPlayerName] = (0, import_react.useState)(choices[0]?.name ?? "");
	const [playerNote, setPlayerNote] = (0, import_react.useState)(choices[0]?.note ?? "");
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [roles, setRoles] = (0, import_react.useState)({});
	const [season, setSeason] = (0, import_react.useState)("Spring");
	const [money, setMoney] = (0, import_react.useState)("120");
	const [energy, setEnergy] = (0, import_react.useState)("80");
	const [hunger, setHunger] = (0, import_react.useState)("25");
	const [startJob, setStartJob] = (0, import_react.useState)("");
	const [modules, setModules] = (0, import_react.useState)({ ...MODULES_OFF });
	const [armed, setArmed] = (0, import_react.useState)(null);
	function choosePersona(id) {
		setPersonaId(id);
		const found = choices.find((item) => item.id === id);
		if (!found) return;
		setPlayerName(found.name);
		setPlayerNote(found.note);
	}
	function toggle(id) {
		setPicked((current) => {
			if (current.includes(id)) return current.filter((item) => item !== id);
			if (current.length >= 6) return current;
			return [...current, id];
		});
	}
	function begin() {
		const cast = picked.flatMap((id) => {
			const item = shelf.find((card) => card.id === id);
			if (!item || !item.card.name.trim()) return [];
			return [{
				id: item.id,
				name: item.card.name,
				summary: item.card.summary,
				personality: item.card.personality,
				description: item.card.description,
				role: roles[id] ?? "town"
			}];
		});
		const job = startJob || null;
		const nextModules = {
			...modules,
			jobs: modules.jobs || !!job && job !== "desk"
		};
		onStart({
			title,
			playerName,
			playerNote,
			cast,
			season,
			money: Number(money),
			energy: Number(energy),
			hunger: Number(hunger),
			startJob: job,
			modules: nextModules
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl font-semibold text-fg",
				children: "Life in Millbrook"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: "One town on a clock. Set the season, the money, and who starts as a friend or a partner. Modules stay off until you turn them on."
			})] }), drafting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: quietBtn,
				onClick: onCancel,
				children: "Back to lives"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: primaryBtn,
				onClick: onDraft,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "size-4",
					"aria-hidden": "true"
				}), "New life"]
			})]
		}), drafting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-sm font-semibold text-fg",
						htmlFor: "life-title",
						children: ["Name this life", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "life-title",
							value: title,
							onChange: (event) => setTitle(event.target.value),
							className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-sm font-semibold text-fg",
						htmlFor: "life-name",
						children: ["What the town calls you", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "life-name",
							value: playerName,
							onChange: (event) => setPlayerName(event.target.value),
							placeholder: "Your name",
							className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
						})]
					}),
					choices.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-sm font-semibold text-fg",
						htmlFor: "life-persona",
						children: ["Fill from a persona", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "life-persona",
							value: personaId,
							onChange: (event) => choosePersona(event.target.value),
							className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg",
							children: choices.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.id,
								children: item.name
							}, item.id))
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No persona yet. A name is enough to start."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-sm font-semibold text-fg",
						htmlFor: "life-note",
						children: ["One line about you", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "life-note",
							value: playerNote,
							onChange: (event) => setPlayerNote(event.target.value),
							rows: 3,
							className: "resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm font-semibold text-fg",
								htmlFor: "life-season",
								children: ["Season", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "life-season",
									value: season,
									onChange: (event) => setSeason(event.target.value),
									className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Spring",
											children: "Spring"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Summer",
											children: "Summer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Autumn",
											children: "Autumn"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Winter",
											children: "Winter"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm font-semibold text-fg",
								htmlFor: "life-job",
								children: ["Starting job", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "life-job",
									value: startJob,
									onChange: (event) => setStartJob(event.target.value),
									className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "None yet"
									}), JOB_LIST.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: job.kind,
										children: [
											job.title,
											" · $",
											job.wage
										]
									}, job.kind))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm font-semibold text-fg",
								htmlFor: "life-money",
								children: ["Money", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "life-money",
									inputMode: "numeric",
									value: money,
									onChange: (event) => setMoney(event.target.value),
									className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm font-semibold text-fg",
								htmlFor: "life-energy",
								children: ["Energy", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "life-energy",
									inputMode: "numeric",
									value: energy,
									onChange: (event) => setEnergy(event.target.value),
									className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm font-semibold text-fg",
								htmlFor: "life-hunger",
								children: ["Hunger", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "life-hunger",
									inputMode: "numeric",
									value: hunger,
									onChange: (event) => setHunger(event.target.value),
									className: "min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
								})]
							})
						]
					}),
					startJob && startJob !== "desk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "That job turns on More jobs, so the board stays open."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-sm font-semibold text-fg",
							children: "Modules, off unless you want them"
						}), MODULE_NOTES.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-start gap-3 rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1",
								checked: modules[note.key],
								onChange: (event) => setModules((current) => ({
									...current,
									[note.key]: event.target.checked
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: note.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-muted",
								children: note.detail
							})] })]
						}, note.key))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: primaryBtn,
						disabled: !playerName.trim(),
						onClick: begin,
						children: "Start this life"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-fg",
						children: "Who lives here"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Up to six cards. Each one keeps a spot in town."
					}),
					shelf.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "The library is empty. You can still live here alone, or save a card first."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-2",
						children: shelf.map((item) => {
							const name = item.card.name.trim() || "Untitled";
							const on = picked.includes(item.id);
							const hangout = placeById(hangoutFor(on ? picked.indexOf(item.id) : picked.length));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-h-11 items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: on,
										disabled: !on && picked.length >= 6,
										onChange: () => toggle(item.id)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate font-semibold",
											children: name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-muted",
											children: on ? hangout.name : "Not in this life yet"
										})]
									})]
								}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									"aria-label": `Role for ${name}`,
									value: roles[item.id] ?? "town",
									onChange: (event) => setRoles((current) => ({
										...current,
										[item.id]: event.target.value
									})),
									className: "mb-1 min-h-11 w-full rounded-md border border-border bg-surface px-2 text-sm font-normal text-fg",
									children: ROLE_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: option.id,
										children: option.label
									}, option.id))
								}) : null]
							}, item.id);
						})
					})
				]
			})]
		}) : lives.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-surface p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl text-fg",
				children: "No lives yet."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-lg text-sm text-muted",
				children: "Start one with the persona on the Persona tab and whoever you want walking around Millbrook."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: lives.map((life) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl text-fg",
						children: life.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: life.playerName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg",
						children: dateLabel(life)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"$",
							life.money,
							life.debt ? ` · $${life.debt} owed` : "",
							" · ",
							life.cast.length,
							" ",
							life.cast.length === 1 ? "person" : "people"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: primaryBtn,
						onClick: () => onOpen(life.id),
						children: "Continue"
					}), armed === life.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: quietBtn,
						onClick: () => onRemove(life.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Delete this life"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: quietBtn,
						onClick: () => setArmed(life.id),
						children: "Delete"
					})]
				})]
			}, life.id))
		})]
	});
}
function Town({ life: raw, shelf, onChange, onLeave }) {
	const life = normalizeLife(raw);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [saying, setSaying] = (0, import_react.useState)({});
	const [phone, setPhone] = (0, import_react.useState)(null);
	const [images, setImages] = (0, import_react.useState)({});
	const [sceneDraft, setSceneDraft] = (0, import_react.useState)(null);
	const place = placesFor(life).find((spot) => spot.id === life.place) ?? placeById(life.place);
	const here = peopleHere(life);
	const note = needNote(life.needs);
	const unread = unreadCount(life);
	const today = plansToday(life);
	const due = weeklyDue(life);
	const jobs = JOB_LIST.filter((job) => life.modules.jobs || job.kind === "desk");
	const rideSpot = life.modules.districts ? "garage" : "market";
	(0, import_react.useEffect)(() => {
		let cancel = false;
		(async () => {
			const next = {};
			for (const shot of life.shots) {
				const saved = await vaultGet("gallery", shot.id);
				if (saved?.dataUrl) next[shot.id] = saved.dataUrl;
			}
			if (!cancel) setImages(next);
		})();
		return () => {
			cancel = true;
		};
	}, [life.shots]);
	function commit(step) {
		if (!step.life) {
			setError(step.error ?? "That didn't happen.");
			return;
		}
		setError(null);
		onChange(step.life);
	}
	async function keepPicture(base, withName, caption) {
		const made = addShot(base, caption, withName);
		const current = useLife.getState().lives.find((item) => item.id === base.id) ?? made.life;
		const merged = current.shots.some((shot) => shot.id === made.shot.id) ? current : {
			...current,
			shots: [...current.shots, made.shot].slice(-24)
		};
		useLife.getState().replace(merged);
		const settings = useStudio.getState().settings;
		const token = settings.novelToken?.trim() ?? "";
		if (token.length < 8) return;
		try {
			const card = shelf.find((item) => item.card.name.trim() === withName);
			const appearance = card ? [card.card.appearance, card.card.description].filter(Boolean).join(", ") : "";
			const bytes = await drawNovelPortrait(token, picturePrompt(merged, made.shot, appearance), settings.novelModel || "nai-diffusion-4-5-full", settings.novelGen, useStudio.getState().stylePlate);
			const dataUrl = pngDataUrl(bytes);
			await vaultPut("gallery", made.shot.id, {
				id: made.shot.id,
				name: made.shot.caption,
				prompt: caption,
				dataUrl,
				updatedAt: Date.now()
			});
			setImages((prev) => ({
				...prev,
				[made.shot.id]: dataUrl
			}));
		} catch (err) {
			setError(novelFailure(err));
		}
	}
	async function runScene(person, kind, outing = false) {
		const line = saying[person.id] ?? "";
		if (kind && canCourt(life, person.id, kind)) {
			setError(canCourt(life, person.id, kind));
			return;
		}
		setBusy(kind ? `${person.id}:${kind}` : outing ? `${person.id}:outing` : person.id);
		setError(null);
		try {
			const fresh = shelf.find((item) => item.id === person.id);
			const withCard = fresh ? {
				...person,
				name: fresh.card.name.trim() || person.name,
				summary: fresh.card.summary || person.summary,
				personality: fresh.card.personality || person.personality,
				description: fresh.card.description || person.description
			} : person;
			const brief = kind ? courtshipBrief(life, withCard, kind, line) : outing ? outingBrief(life, withCard, line) : sceneBrief(life, withCard, line);
			const text = await askText(useStudio.getState().settings, brief.system, brief.user, 380);
			const step = kind ? finishCourtship(life, person.id, kind, line, text) : { life: outing ? afterOuting(life, person.id, line, text) : afterTalk(life, person.id, line, text) };
			if (!step.life) {
				setError(step.error ?? "That didn't happen.");
				return;
			}
			onChange(step.life);
			setSaying((current) => ({
				...current,
				[person.id]: ""
			}));
			setSceneDraft(null);
			if (step.life.paintScenes && step.life.scene) keepPicture(step.life, step.life.sceneWith, step.life.scene);
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	async function meetSomeone() {
		if (!life.modules.npcs || life.cast.length >= 8) return;
		setBusy("npc");
		setError(null);
		try {
			let card = null;
			try {
				const brief = npcBrief(life);
				card = parseNpc(await askText(useStudio.getState().settings, brief.system, brief.user, 120));
			} catch {
				card = null;
			}
			if (!card || life.cast.some((person) => person.name.toLowerCase() === card?.name.toLowerCase())) card = localNpc(life);
			if (!card) {
				setError("Nobody new turned up.");
				return;
			}
			onChange(addNpc(life, card));
		} finally {
			setBusy(null);
		}
	}
	async function rewritePaper(day) {
		const edition = life.papers.find((item) => item.day === day);
		if (!edition) return;
		setBusy("paper");
		setError(null);
		try {
			const brief = paperBrief(edition);
			const text = (await askText(useStudio.getState().settings, brief.system, brief.user, 280)).trim();
			const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
			onChange(replacePaper(life, day, lines[0] || edition.headline, lines.slice(1).join("\n") || text));
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									className: "size-4 text-gold",
									"aria-hidden": "true"
								}), life.title]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl text-fg",
								children: weekday(life.day)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-xl text-gold",
								children: [
									"Day ",
									life.day,
									" · ",
									seasonName(life.day),
									" · ",
									clockLabel(life.minute)
								]
							}),
							life.modules.weather ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-fg",
								children: skyLabel(life.day)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-fg",
								children: [
									"$",
									life.money,
									life.debt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-primary",
										children: [
											" · $",
											life.debt,
											" owed"
										]
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [life.job ? `${life.job.title} · $${life.job.wage} a shift` : "No job yet", life.job && life.workedDay === life.day ? " · done today" : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									life.home === "apartment" ? "Apartment" : life.home === "cottage" ? "Cottage" : "Townhouse",
									" · ",
									life.vehicle === "car" ? "Car" : life.vehicle === "bike" ? "Bike" : "On foot"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: due > 0 ? `The week takes $${due} on day ${life.rentDay}` : "You own the place. Rent has stopped."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `${quietBtn} w-full`,
									onClick: () => setPhone("contacts"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
											className: "size-4",
											"aria-hidden": "true"
										}),
										"Phone",
										unread > 0 ? ` · ${unread}` : ""
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `${quietBtn} w-full`,
									onClick: () => setPhone("edit"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "size-4",
										"aria-hidden": "true"
									}), "Edit this life"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
								label: "Energy",
								value: life.needs.energy,
								tone: "gold"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									label: "Hunger",
									value: life.needs.hunger,
									tone: "primary"
								})
							}),
							note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-primary",
								children: note
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-fg",
								children: "Town"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-col gap-2",
								children: placesFor(life).map((spot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": spot.id === life.place,
									disabled: busy !== null,
									onClick: () => commit(travel(life, spot.id)),
									className: `flex min-h-11 items-center justify-between gap-2 rounded-md px-3 text-left text-sm ${spot.id === life.place ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex min-w-0 items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
											className: "size-4 shrink-0",
											"aria-hidden": "true"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: spot.name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `shrink-0 text-xs ${spot.id === life.place ? "text-primary-fg" : "text-muted"}`,
										children: hoursLabel(spot)
									})]
								}, spot.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${quietBtn} mt-3 w-full`,
								onClick: onLeave,
								children: "Back to lives"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-fg",
								children: place.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: place.blurb
							}),
							life.modules.calendar && today.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 flex flex-col gap-1 text-sm text-fg",
								children: today.map((plan) => {
									const who = life.cast.find((person) => person.id === plan.withId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Today · ",
										placeById(plan.place).name,
										who ? ` with ${who.name}` : "",
										plan.note ? ` · ${plan.note}` : ""
									] }, plan.id);
								})
							}) : null,
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-primary",
								role: "alert",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit({ life: lookAround(life) }),
										children: "Look around"
									}),
									life.place === "home" || life.place === "cafe" || life.place === "market" || life.place === "diner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit(eat(life)),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Eat"]
									}) : null,
									life.place === "home" && life.modules.cooking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit(cook(life)),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookingPot, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Cook · $6"]
									}) : null,
									life.place === "home" && life.debt > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null || life.money <= 0,
										onClick: () => commit(payDebt(life, Math.min(40, life.money, life.debt))),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, {
												className: "size-4",
												"aria-hidden": "true"
											}),
											"Pay $",
											Math.min(40, life.money, life.debt),
											" on the tab"
										]
									}) : null,
									life.place === "park" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit(rest(life)),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Sit a while"]
									}) : null,
									life.place === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit({ life: sleep(life) }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bed, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Sleep"]
									}) : null,
									life.place === "office" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex w-full flex-col gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-semibold text-fg",
												children: "Job board"
											}),
											jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: life.job?.kind === job.kind ? primaryBtn : quietBtn,
												disabled: busy !== null || life.job?.kind === job.kind,
												onClick: () => commit(takeJob(life, job.kind)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, {
													className: "size-4",
													"aria-hidden": "true"
												}), life.job?.kind === job.kind ? `${job.title} · yours` : `${job.title} · $${job.wage}`]
											}, job.kind)),
											life.job ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: quietBtn,
												disabled: busy !== null,
												onClick: () => commit(takeJob(life, null)),
												children: "Quit"
											}) : null
										]
									}) : null,
									life.place === rideSpot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [life.vehicle !== "bike" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit(buyRide(life, "bike")),
										children: "Buy a bike · $80"
									}) : null, life.vehicle !== "car" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit(buyRide(life, "car")),
										children: "Buy a used car · $400"
									}) : null] }) : null,
									life.modules.homes && (life.place === "hillcrest" || life.place === "home") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [life.home !== "cottage" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit(buyHome(life, "cottage")),
										children: "Buy a cottage · $800"
									}) : null, life.home !== "townhouse" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: quietBtn,
										disabled: busy !== null,
										onClick: () => commit(buyHome(life, "townhouse")),
										children: "Buy a townhouse · $1400"
									}) : null] }) : null,
									canWork(life) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: primaryBtn,
										disabled: busy !== null,
										onClick: () => commit(workShift(life)),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Work the shift"]
									}) : null
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold text-fg",
									children: "Here now"
								}), life.modules.npcs && life.cast.length < 8 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: quietBtn,
									disabled: busy !== null,
									onClick: () => void meetSomeone(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
										className: "size-4",
										"aria-hidden": "true"
									}), busy === "npc" ? "Someone is arriving…" : "Meet someone"]
								}) : null]
							}),
							here.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: life.cast.length === 0 ? "Nobody from your library is in this life." : "None of your people are here. Check the town list, then walk to where they keep."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 flex flex-col gap-3",
								children: here.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md border border-border bg-bg p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-baseline justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-fg",
												children: person.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-gold",
												children: [
													relationLabel(person),
													" · ",
													person.bond
												]
											})]
										}),
										person.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted",
											children: person.summary
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-3 flex flex-col gap-2 text-sm text-muted",
											htmlFor: `say-${person.id}`,
											children: ["What you do or say", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												id: `say-${person.id}`,
												value: saying[person.id] ?? "",
												onChange: (event) => setSaying((current) => ({
													...current,
													[person.id]: event.target.value
												})),
												rows: 2,
												placeholder: "Leave this blank to just sit with them.",
												className: "resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: `${primaryBtn} mt-3`,
											disabled: busy !== null,
											onClick: () => void runScene(person),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "size-4",
												"aria-hidden": "true"
											}), busy === person.id ? "Writing the scene…" : "Spend the scene"]
										}),
										life.modules.calendar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: `${quietBtn} mt-2`,
											disabled: busy !== null,
											onClick: () => void runScene(person, void 0, true),
											children: busy === `${person.id}:outing` ? "Writing the outing…" : "A longer outing"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: `${quietBtn} mt-2`,
											disabled: busy !== null,
											onClick: () => commit(doFavour(life, person.id)),
											children: "Do a favour · $10"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-col gap-2",
											children: courtOffers(life, person).map((offer) => offer.blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted",
												children: offer.blocked
											}, offer.kind) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: quietBtn,
												disabled: busy !== null,
												onClick: () => void runScene(person, offer.kind),
												children: busy === `${person.id}:${offer.kind}` ? "Writing the scene…" : offer.label
											}, offer.kind))
										})
									]
								}, person.id))
							}),
							life.cast.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 flex flex-col gap-1 text-sm text-muted",
								children: life.cast.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									person.name,
									" keeps to ",
									placeById(person.hangout).name,
									person.movedIn ? ", and lives with you" : ""
								] }, person.id))
							}) : null
						]
					}),
					life.scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg bg-paper p-5 text-ink",
						"aria-live": "polite",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink-soft",
								children: life.sceneWith ? `With ${life.sceneWith}` : "Scene"
							}),
							sceneDraft === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 whitespace-pre-wrap font-display text-lg leading-relaxed",
								children: life.scene
							}) : null,
							sceneDraft !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								"aria-label": "Scene text",
								value: sceneDraft,
								onChange: (event) => setSceneDraft(event.target.value),
								rows: 6,
								className: "mt-3 w-full resize-y rounded-md border border-ink bg-paper px-3 py-2 text-sm text-ink"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-60",
										disabled: busy !== null,
										onClick: () => void keepPicture(life, life.sceneWith, life.scene ?? place.name),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Take a picture"]
									}),
									sceneDraft === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-md border border-ink px-4 text-sm font-semibold text-ink",
										onClick: () => setSceneDraft(life.scene ?? ""),
										children: "Edit the scene"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-md border border-ink px-4 text-sm font-semibold text-ink",
										onClick: () => {
											onChange(editScene(life, sceneDraft));
											setSceneDraft(null);
										},
										children: "Save the scene"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-md border border-ink px-4 text-sm font-semibold text-ink",
										onClick: () => onChange(dismissScene(life)),
										children: "Close the scene"
									})
								]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-fg",
							children: "Today so far"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 flex flex-col gap-2",
							children: [...life.log].reverse().slice(0, 8).map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-fg",
										children: ["Day ", entry.day]
									}),
									" · ",
									entry.text
								]
							}, `${entry.day}-${entry.minute}-${index}`))
						})]
					})
				]
			}),
			phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifePhone, {
				life,
				images,
				cards: shelf.map((item) => ({
					id: item.id,
					name: item.card.name,
					summary: item.card.summary,
					personality: item.card.personality
				})),
				initial: phone,
				busy: busy !== null,
				onChange: (next) => {
					setSceneDraft(null);
					onChange(next);
				},
				onClose: () => setPhone(null),
				onDeleteShot: (id) => {
					onChange(removeShot(life, id));
					setImages((current) => {
						const next = { ...current };
						delete next[id];
						return next;
					});
					vaultDelete("gallery", id);
				},
				onRewrite: (day) => void rewritePaper(day)
			}) : null
		]
	});
}
function Meter({ label, value, tone }) {
	const width = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-center justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg",
			children: Math.round(width)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: tone === "gold" ? "h-full bg-gold" : "h-full bg-primary",
			style: { width: `${width}%` }
		})
	})] });
}
function PresetTab() {
	const presets = useStudio((state) => state.presets);
	const activePresetId = useStudio((state) => state.activePresetId);
	const upsertPreset = useStudio((state) => state.upsertPreset);
	const removePreset = useStudio((state) => state.removePreset);
	const setActivePreset = useStudio((state) => state.setActivePreset);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const importRef = (0, import_react.useRef)(null);
	const selected = presets.find((preset) => preset.id === (selectedId ?? activePresetId ?? presets[0]?.id)) ?? null;
	async function persist(next) {
		upsertPreset(next);
		setSelectedId(next.id);
		await savePresetRecord(next);
	}
	async function onImport(file) {
		setError(null);
		try {
			const preset = parseMarinaraPreset(JSON.parse(await file.text()));
			const unique = presets.some((item) => item.id === preset.id) ? {
				...preset,
				id: crypto.randomUUID()
			} : preset;
			await persist(unique);
			setActivePreset(unique.id);
			setNotice(`${unique.name} is imported and active for chat. Disabled sections stay off.`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "That file is not a Marinara preset.");
		}
	}
	function patch(preset, recipe) {
		persist(recipe(preset)).catch((err) => setError(err instanceof Error ? err.message : "Could not save that preset."));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryLocation, {}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg",
				children: error
			}) : null,
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
				children: notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => importRef.current?.click(),
								className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Import"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									persist({
										...starterPreset(),
										id: crypto.randomUUID(),
										name: "New preset"
									});
									setNotice("New preset saved. It is not active until you use it in chat.");
								},
								className: "min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
								children: "New"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: importRef,
							type: "file",
							accept: "application/json,.json,.marinara.json",
							className: "sr-only",
							onChange: (event) => {
								const file = event.target.files?.[0];
								if (file) onImport(file);
								event.target.value = "";
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-col gap-2",
							children: presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": selected?.id === preset.id,
								onClick: () => setSelectedId(preset.id),
								className: `flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-3 text-left text-sm ${selected?.id === preset.id ? "bg-surface-2 text-fg" : "text-fg hover:bg-surface-2"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: preset.name
								}), activePresetId === preset.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: "size-4 shrink-0 text-gold",
									"aria-label": "Active"
								}) : null]
							}) }, preset.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: "Chat keeps the simple prompt until a preset is marked active."
						})
					]
				}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetEditor, {
					preset: selected,
					active: activePresetId === selected.id,
					onChange: (recipe) => patch(selected, recipe),
					onActive: (active) => {
						setActivePreset(active ? selected.id : null);
						setNotice(active ? `${selected.name} is the chat preset.` : "Chat is back on the simple prompt.");
					},
					onDelete: () => {
						deletePresetRecord(selected.id);
						removePreset(selected.id);
						setSelectedId(null);
						setNotice("Preset removed from the library.");
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted",
					children: "Import a Marinara preset, or start a new one."
				})]
			})
		]
	});
}
function PresetEditor({ preset, active, onChange, onActive, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "presetName",
						className: "text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "presetName",
						value: preset.name,
						onChange: (event) => onChange((current) => ({
							...current,
							name: event.target.value
						})),
						className: "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "presetDescription",
						className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "presetDescription",
						value: preset.description,
						onChange: (event) => onChange((current) => ({
							...current,
							description: event.target.value
						})),
						rows: 3,
						className: "mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": active,
								onClick: () => onActive(!active),
								className: `flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold ${active ? "bg-primary text-primary-fg" : "border border-border bg-surface-2 text-fg"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-4",
									"aria-hidden": "true"
								}), active ? "Active for chat" : "Use for chat"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									const blob = new Blob([JSON.stringify(toMarinaraFile(preset), null, 2)], { type: "application/json" });
									const url = URL.createObjectURL(blob);
									const anchor = document.createElement("a");
									anchor.href = url;
									anchor.download = `${preset.name.replace(/[^\w.-]+/g, "-").replace(/^-|-$/g, "") || "preset"}.marinara.json`;
									anchor.click();
									URL.revokeObjectURL(url);
								},
								className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Export"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onDelete,
								className: "flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Delete"]
							})
						]
					})
				]
			}),
			preset.choices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-fg",
					children: "Choices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-col gap-4",
					children: preset.choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-xs font-semibold tracking-wide text-muted uppercase",
							children: choice.question
						}), choice.multiSelect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-col gap-2",
							children: choice.options.map((option) => {
								const selected = Array.isArray(preset.values[choice.variableName]) ? preset.values[choice.variableName] : [];
								const on = selected.includes(option.value) || selected.includes(option.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-h-11 items-start gap-2 text-sm text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "mt-1 size-4",
										checked: on,
										onChange: () => onChange((current) => {
											const previous = Array.isArray(current.values[choice.variableName]) ? [...current.values[choice.variableName]] : [];
											const values = on ? previous.filter((item) => item !== option.value && item !== option.id) : [...previous, option.value];
											return {
												...current,
												values: {
													...current.values,
													[choice.variableName]: values
												}
											};
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: option.label })]
								}, option.id);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: typeof preset.values[choice.variableName] === "string" ? preset.values[choice.variableName] : choice.options[0]?.value ?? "",
							onChange: (event) => onChange((current) => ({
								...current,
								values: {
									...current.values,
									[choice.variableName]: event.target.value
								}
							})),
							className: "mt-2 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
							children: choice.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: option.value,
								children: option.label
							}, option.id))
						})]
					}, choice.id))
				})]
			}) : null,
			preset.groups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-fg",
					children: "Groups"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-2",
					children: preset.groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-4",
							checked: group.enabled,
							onChange: () => onChange((current) => ({
								...current,
								groups: current.groups.map((item) => item.id === group.id ? {
									...item,
									enabled: !item.enabled
								} : item)
							}))
						}), group.name]
					}, group.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold text-fg",
						children: "Sections"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Off sections are left out of the prompt, including markers for the card, persona, and chat."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-3",
						children: preset.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionRow, {
							section,
							onChange
						}, section.id))
					})
				]
			})
		]
	});
}
function SectionRow({ section, onChange }) {
	function update(patch) {
		onChange((current) => ({
			...current,
			sections: current.sections.map((item) => item.id === section.id ? {
				...item,
				...patch
			} : item)
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-md border border-border bg-bg p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-2 text-sm font-semibold text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "size-4",
					checked: section.enabled,
					onChange: () => update({ enabled: !section.enabled })
				}), section.name]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted",
				children: [section.markerType ? section.markerType.replaceAll("_", " ") : section.role, section.injectionPosition === "depth" ? ` · depth ${section.injectionDepth}` : ""]
			})]
		}), section.isMarker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: "Filled from the card, persona, or chat when this section is on."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value: section.content,
			onChange: (event) => update({ content: event.target.value }),
			rows: 4,
			"aria-label": `${section.name} text`,
			className: "mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
		})]
	});
}
var BACKUP_KEY = "cardwright-settings-file";
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function settingsFrom(raw) {
	const next = { ...DEFAULT_SETTINGS };
	if (!isRecord(raw)) return next;
	if (typeof raw.baseUrl === "string") next.baseUrl = raw.baseUrl;
	if (typeof raw.apiKey === "string") next.apiKey = raw.apiKey;
	if (typeof raw.model === "string") next.model = raw.model;
	if (typeof raw.temperature === "number" && Number.isFinite(raw.temperature)) next.temperature = raw.temperature;
	if (typeof raw.maxTokens === "number" && Number.isFinite(raw.maxTokens)) next.maxTokens = raw.maxTokens;
	if (typeof raw.useImages === "boolean") next.useImages = raw.useImages;
	if (typeof raw.novelToken === "string") next.novelToken = raw.novelToken;
	if (typeof raw.novelModel === "string") next.novelModel = raw.novelModel;
	if (isRecord(raw.novelGen)) next.novelGen = novelGenOf(raw.novelGen);
	return next;
}
function idList(raw) {
	return Array.isArray(raw) ? raw.filter((item) => typeof item === "string") : [];
}
function turnsFrom(raw) {
	if (!Array.isArray(raw)) return [];
	const turns = [];
	for (const entry of raw.slice(-200)) {
		if (!isRecord(entry) || entry.role !== "user" && entry.role !== "assistant") continue;
		if (typeof entry.text !== "string" || typeof entry.id !== "string") continue;
		const image = typeof entry.image === "string" && entry.image.startsWith("data:image/") ? entry.image : null;
		const swiped = readTurnSwipes(entry.swipes, entry.swipe, entry.text, image);
		turns.push({
			id: entry.id,
			role: entry.role,
			text: swiped.text,
			image: swiped.image,
			swipes: swiped.swipes,
			swipe: swiped.swipe,
			speakerId: typeof entry.speakerId === "string" ? entry.speakerId : null,
			speakerName: typeof entry.speakerName === "string" ? entry.speakerName : null
		});
	}
	return turns;
}
function shelfFrom(raw) {
	if (!Array.isArray(raw)) return [];
	const items = [];
	for (const entry of raw) {
		if (!isRecord(entry) || typeof entry.id !== "string") continue;
		items.push({
			id: entry.id,
			name: typeof entry.name === "string" && entry.name.trim() ? entry.name : "Untitled",
			updatedAt: typeof entry.updatedAt === "number" ? entry.updatedAt : Date.now(),
			card: cardFromUnknown(entry.card)
		});
	}
	return items;
}
function parseSettingsFile(raw) {
	if (!isRecord(raw)) return null;
	if (raw.version !== void 0 && raw.version !== 1) return null;
	if (!isRecord(raw.settings) && typeof raw.concept !== "string" && !isRecord(raw.card)) return null;
	const stylePlate = typeof raw.stylePlate === "string" && raw.stylePlate.startsWith("data:image/") ? raw.stylePlate : null;
	return {
		version: 1,
		concept: typeof raw.concept === "string" ? raw.concept : "",
		card: cardFromUnknown(raw.card),
		settings: settingsFrom(raw.settings),
		fillBlanks: raw.fillBlanks === true,
		shelf: shelfFrom(raw.shelf),
		novelPrompt: typeof raw.novelPrompt === "string" ? raw.novelPrompt : "",
		stylePlate,
		cardDraftId: typeof raw.cardDraftId === "string" ? raw.cardDraftId : null,
		personaConcept: typeof raw.personaConcept === "string" ? raw.personaConcept : "",
		persona: raw.persona ? cardFromUnknown(raw.persona) : cardFromUnknown({}),
		personaDraftId: typeof raw.personaDraftId === "string" ? raw.personaDraftId : null,
		personaFillBlanks: raw.personaFillBlanks === true,
		personas: shelfFrom(raw.personas),
		chatCard: raw.chatCard ? cardFromUnknown(raw.chatCard) : null,
		chatPersona: raw.chatPersona ? cardFromUnknown(raw.chatPersona) : null,
		chatMessages: turnsFrom(raw.chatMessages),
		chatId: typeof raw.chatId === "string" ? raw.chatId : null,
		chatTitle: typeof raw.chatTitle === "string" ? raw.chatTitle : "",
		chatMemory: typeof raw.chatMemory === "string" ? raw.chatMemory : "",
		chatLoreIds: idList(raw.chatLoreIds),
		chatWorldIds: idList(raw.chatWorldIds),
		chatCardKey: typeof raw.chatCardKey === "string" ? raw.chatCardKey : null,
		theme: themeOf(isRecord(raw.theme) ? raw.theme : null),
		activePresetId: typeof raw.activePresetId === "string" ? raw.activePresetId : null
	};
}
function captureSettings() {
	const state = useStudio.getState();
	const file = {
		version: 1,
		concept: state.concept,
		card: state.card,
		settings: state.settings,
		fillBlanks: state.fillBlanks,
		shelf: state.shelf,
		novelPrompt: state.novelPrompt,
		stylePlate: state.stylePlate,
		cardDraftId: state.cardDraftId,
		personaConcept: state.personaConcept,
		persona: state.persona,
		personaDraftId: state.personaDraftId,
		personaFillBlanks: state.personaFillBlanks,
		personas: state.personas,
		chatCard: state.chatCard,
		chatPersona: state.chatPersona,
		chatMessages: state.chatMessages.map((turn) => ({
			id: turn.id,
			role: turn.role,
			text: turn.text,
			speakerId: turn.speakerId ?? null,
			speakerName: turn.speakerName ?? null,
			swipe: turn.swipe ?? 0,
			swipes: (turn.swipes ?? []).map((swipe) => ({
				text: swipe.text,
				image: null
			}))
		})),
		chatId: state.chatId,
		chatTitle: state.chatTitle,
		chatMemory: state.chatMemory,
		chatLoreIds: state.chatLoreIds,
		chatWorldIds: state.chatWorldIds,
		chatCardKey: state.chatCardKey,
		theme: state.theme,
		activePresetId: state.activePresetId
	};
	if (JSON.stringify(file).length > 12e5) return {
		...file,
		shelf: [],
		personas: []
	};
	return file;
}
function applySettings(file) {
	const state = useStudio.getState();
	useStudio.setState({
		concept: file.concept,
		card: file.card,
		settings: file.settings,
		fillBlanks: file.fillBlanks,
		shelf: file.shelf.length > 0 ? mergeById(state.shelf, file.shelf) : state.shelf,
		novelPrompt: file.novelPrompt,
		stylePlate: file.stylePlate,
		cardDraftId: file.cardDraftId,
		personaConcept: file.personaConcept,
		persona: file.persona,
		personaDraftId: file.personaDraftId,
		personaFillBlanks: file.personaFillBlanks,
		personas: file.personas.length > 0 ? mergeById(state.personas, file.personas) : state.personas,
		chatCard: file.chatCard,
		chatPersona: file.chatPersona,
		chatMessages: file.chatMessages,
		chatId: file.chatId,
		chatTitle: file.chatTitle,
		chatMemory: file.chatMemory,
		chatLoreIds: file.chatLoreIds,
		chatWorldIds: file.chatWorldIds,
		chatCardKey: file.chatCardKey,
		theme: file.theme,
		activePresetId: file.activePresetId ?? state.activePresetId
	});
}
function mergeById(current, incoming) {
	const map = new Map(current.map((item) => [item.id, item]));
	for (const item of incoming) map.set(item.id, item);
	return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}
async function readAutoSettings() {
	try {
		if (await isDesktopHost()) {
			const response = await fetch("/__app-settings", { headers: { Accept: "application/json" } });
			if (!response.ok) return null;
			const body = await response.json();
			if (isRecord(body) && body.empty === true) return null;
			return parseSettingsFile(body);
		}
	} catch {
		return readBackup();
	}
	return readBackup();
}
function readBackup() {
	try {
		const stored = localStorage.getItem(BACKUP_KEY);
		if (!stored) return null;
		return parseSettingsFile(JSON.parse(stored));
	} catch {
		return null;
	}
}
async function writeAutoSettings(file) {
	const body = JSON.stringify(file);
	try {
		localStorage.setItem(BACKUP_KEY, body);
	} catch {}
	if (!await isDesktopHost()) return;
	await fetch("/__app-settings", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body
	});
}
async function saveSettingsFile(file) {
	const body = JSON.stringify(file, null, 2);
	if (await isDesktopHost()) {
		const response = await fetch("/__app-settings/save-as", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body
		});
		const payload = await response.json().catch(() => ({}));
		if (!response.ok) throw new Error(payload.message || "Could not save settings.");
		if (payload.cancelled) return "";
		return payload.path || "cardwright-settings.json";
	}
	const blob = new Blob([body], { type: "application/json" });
	const choose = window.showSaveFilePicker;
	if (typeof choose === "function") try {
		const writable = await (await choose({
			suggestedName: "cardwright-settings.json",
			types: [{
				description: "Cardwright settings",
				accept: { "application/json": [".json"] }
			}]
		})).createWritable();
		await writable.write(blob);
		await writable.close();
		return "cardwright-settings.json";
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") return "";
	}
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = "cardwright-settings.json";
	anchor.click();
	URL.revokeObjectURL(url);
	return "cardwright-settings.json";
}
async function openSettingsFile() {
	if (!await isDesktopHost()) return null;
	const response = await fetch("/__app-settings/open", { method: "POST" });
	const payload = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(payload.message || "Could not open that settings file.");
	if (payload.cancelled) return null;
	const parsed = parseSettingsFile(payload.file);
	if (!parsed) throw new Error("That file is not a Cardwright settings file.");
	return parsed;
}
async function quitApp() {
	if (!await isDesktopHost()) return;
	await fetch("/__quit", { method: "POST" });
}
var CONCEPTS = [
	{
		label: "Night librarian",
		text: "A night librarian who lends unfinished novels and expects them returned with an ending."
	},
	{
		label: "Orbital welder",
		text: "A retired orbital welder who runs a tea stall under a station window."
	},
	{
		label: "Last dragon",
		text: "A polite city archivist who is also the last dragon, and would rather nobody make a fuss."
	},
	{
		label: "Dock rigger",
		text: "A dock rigger who knows every crane by the sound it makes when it is about to fail."
	},
	{
		label: "Flood courier",
		text: "A courier in a flooded city who knows every shortcut and none of the headlines."
	},
	{
		label: "Quiet archivist",
		text: "A quiet archivist who answers questions with the exact page, and almost never with an opinion."
	},
	{
		label: "Train cook",
		text: "A cook on a night train who serves soup to whoever is still awake at the last stop."
	},
	{
		label: "Lighthouse keeper",
		text: "A lighthouse keeper who talks to the weather and only sometimes to people."
	},
	{
		label: "Map mender",
		text: "A map mender who fixes streets that the city pretends were never moved."
	},
	{
		label: "Garden locksmith",
		text: "A locksmith who only opens garden gates, and only after hearing why you need the other side."
	}
];
var EMPTY_REVISIONS = [];
var CURRENT_MEDIA = "current";
async function saveBlob(filename, blob) {
	if (!await saveNamedFile(filename, blob)) return false;
	return true;
}
function withImportedLore(raw) {
	const next = cardFromUnknown(raw);
	const book = lorebookFromUnknown(raw, next.name.trim() || "Card lore");
	if (!book || book.entries.length === 0) return next;
	const stored = {
		...book,
		id: crypto.randomUUID(),
		kind: "lore",
		name: book.name.trim() || `${next.name || "Card"} lore`
	};
	useStudio.getState().upsertLore(stored);
	saveBook(stored);
	return {
		...next,
		lorebookId: stored.id
	};
}
function Studio() {
	const concept = useStudio((s) => s.concept);
	const card = useStudio((s) => s.card);
	const cardDraftId = useStudio((s) => s.cardDraftId);
	const revisions = useStudio((s) => s.shelf.find((item) => item.id === s.cardDraftId)?.revisions ?? EMPTY_REVISIONS);
	const settings = useStudio((s) => s.settings);
	const fillBlanks = useStudio((s) => s.fillBlanks);
	const shelf = useStudio((s) => s.shelf);
	const novelPrompt = useStudio((s) => s.novelPrompt);
	const stylePlate = useStudio((s) => s.stylePlate);
	const persona = useStudio((s) => s.persona);
	const personaConcept = useStudio((s) => s.personaConcept);
	const personaFillBlanks = useStudio((s) => s.personaFillBlanks);
	const personas = useStudio((s) => s.personas);
	const chatCard = useStudio((s) => s.chatCard);
	const chatPersona = useStudio((s) => s.chatPersona);
	const chatMessages = useStudio((s) => s.chatMessages);
	const chatMemory = useStudio((s) => s.chatMemory);
	const chatTitle = useStudio((s) => s.chatTitle);
	const chatId = useStudio((s) => s.chatId);
	const chatLoreIds = useStudio((s) => s.chatLoreIds);
	const chatWorldIds = useStudio((s) => s.chatWorldIds);
	const lorebooks = useStudio((s) => s.lorebooks);
	const theme = useStudio((s) => s.theme);
	const activePresetId = useStudio((s) => s.activePresetId);
	const setConcept = useStudio((s) => s.setConcept);
	const patchCard = useStudio((s) => s.patchCard);
	const replaceCard = useStudio((s) => s.replaceCard);
	const applyGenerated = useStudio((s) => s.applyGenerated);
	const patchSettings = useStudio((s) => s.patchSettings);
	const setFillBlanks = useStudio((s) => s.setFillBlanks);
	const saveToShelf = useStudio((s) => s.saveToShelf);
	const loadFromShelf = useStudio((s) => s.loadFromShelf);
	const removeFromShelf = useStudio((s) => s.removeFromShelf);
	const newCard = useStudio((s) => s.newCard);
	const loadPersona = useStudio((s) => s.loadPersona);
	const removePersona = useStudio((s) => s.removePersona);
	const startChat = useStudio((s) => s.startChat);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [settingsReady, setSettingsReady] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [linkNote, setLinkNote] = (0, import_react.useState)("Not checked");
	const [media, setMedia] = (0, import_react.useState)(EMPTY_MEDIA);
	const [mediaReady, setMediaReady] = (0, import_react.useState)(false);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("card");
	const [libraryKind, setLibraryKind] = (0, import_react.useState)("cards");
	const [versionPick, setVersionPick] = (0, import_react.useState)("current");
	const [creatorPick, setCreatorPick] = (0, import_react.useState)("editor");
	const versionBackup = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setVersionPick("current");
		versionBackup.current = null;
	}, [cardDraftId]);
	const settingsRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		(async () => {
			await useStudio.persist.rehydrate();
			const saved = await readAutoSettings();
			if (cancel) return;
			const memoryCards = saved?.shelf?.length ? saved.shelf : useStudio.getState().shelf;
			const memoryPersonas = saved?.personas?.length ? saved.personas : useStudio.getState().personas;
			if (saved) useStudio.setState({
				concept: saved.concept,
				card: saved.card,
				settings: saved.settings,
				fillBlanks: saved.fillBlanks,
				novelPrompt: saved.novelPrompt,
				stylePlate: saved.stylePlate,
				cardDraftId: saved.cardDraftId,
				personaConcept: saved.personaConcept,
				persona: saved.persona,
				personaDraftId: saved.personaDraftId,
				personaFillBlanks: saved.personaFillBlanks,
				chatCard: saved.chatCard,
				chatPersona: saved.chatPersona,
				chatMessages: saved.chatMessages,
				activePresetId: saved.activePresetId
			});
			await migrateLegacyMedia();
			await importMissingShelf("cards", memoryCards);
			await importMissingShelf("personas", memoryPersonas);
			const shelf = await loadShelf("cards");
			const personas = await loadShelf("personas");
			const presets = await loadPresetList();
			const lorebooks = await loadBookList("lore");
			const worldbooks = await loadBookList("world");
			const chatIndex = await loadChatHeads();
			if (cancel) return;
			const active = useStudio.getState().activePresetId;
			armLibrarySync();
			useStudio.setState({
				shelf: shelf.length > 0 ? shelf : memoryCards,
				personas: personas.length > 0 ? personas : memoryPersonas,
				presets,
				lorebooks,
				worldbooks,
				chatIndex,
				activePresetId: active
			});
			const currentId = useStudio.getState().chatId;
			if (currentId) {
				const saved = await loadChat(currentId);
				if (!cancel && saved) useStudio.getState().openSavedChat(saved);
			}
			setHydrated(true);
			setSettingsReady(true);
		})().catch(() => {
			if (cancel) return;
			armLibrarySync();
			setHydrated(true);
			setSettingsReady(true);
		});
		loadMedia(CURRENT_MEDIA).then((record) => {
			if (cancel) return;
			setMedia(record);
			setMediaReady(true);
		});
		return () => {
			cancel = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!mediaReady) return;
		saveMedia(CURRENT_MEDIA, media);
	}, [media, mediaReady]);
	(0, import_react.useEffect)(() => {
		if (!settingsReady) return;
		const timer = window.setTimeout(() => {
			writeAutoSettings(captureSettings());
		}, 400);
		return () => window.clearTimeout(timer);
	}, [
		settingsReady,
		settings,
		card,
		concept,
		fillBlanks,
		novelPrompt,
		stylePlate,
		persona,
		personaConcept,
		personaFillBlanks,
		chatCard,
		chatPersona,
		chatMessages,
		chatMemory,
		chatTitle,
		chatId,
		chatLoreIds,
		chatWorldIds,
		theme,
		activePresetId
	]);
	(0, import_react.useEffect)(() => {
		applyTheme({ ...theme });
	}, [theme]);
	(0, import_react.useEffect)(() => {
		if (!settingsReady) return;
		const timer = window.setTimeout(() => {
			syncShelf("cards", useStudio.getState().shelf);
			syncShelf("personas", useStudio.getState().personas);
		}, 500);
		return () => window.clearTimeout(timer);
	}, [
		settingsReady,
		shelf,
		personas
	]);
	const useImages = settings.useImages !== false;
	const portrait = portraitOf(media);
	const pictureUrls = useImages ? media.images.map((image) => image.dataUrl) : [];
	async function onAddFiles(list) {
		const files = [...list];
		if (files.length === 0) return;
		setError(null);
		setNotice(null);
		const room = 200 - media.images.length;
		if (room <= 0) {
			setError("This card already has 200 reference pictures. Remove one to add another. Saved pictures in the library are not capped.");
			return;
		}
		try {
			const incoming = [];
			for (const file of files.slice(0, room)) incoming.push(await fileToImage(file));
			setMedia((current) => addImages(current, incoming));
			const skipped = files.length - incoming.length;
			setNotice(skipped > 0 ? `Added ${incoming.length}. The rest were skipped because this card is at 200 pictures.` : incoming.length === 1 ? "Added a reference picture." : `Added ${incoming.length} reference pictures.`);
		} catch (err) {
			setError(explainFetchError(err));
		}
	}
	async function onProbe() {
		setBusy("Checking KoboldCPP…");
		setError(null);
		setNotice(null);
		try {
			const message = await probeKobold(settings);
			setLinkNote(message);
			setNotice(message);
		} catch (err) {
			const message = explainFetchError(err);
			setLinkNote("Unreachable");
			setError(message);
		} finally {
			setBusy(null);
		}
	}
	async function onGenerate() {
		setBusy("Writing the card…");
		setError(null);
		setNotice(null);
		setTab("card");
		try {
			const next = await generateCard(settings, concept, pictureUrls);
			applyGenerated(next);
			const pictured = pictureUrls.length > 0 ? " Pictures were sent with the prompt." : "";
			setNotice((fillBlanks ? "Filled the empty fields." : "Replaced the card with a new draft.") + pictured);
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	async function onRewrite(field) {
		setBusy(`Rewriting ${field}…`);
		setError(null);
		setNotice(null);
		try {
			const value = await rewriteField(settings, concept, card, field, pictureUrls);
			patchCard({ [field]: value });
			setNotice("Updated that field.");
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	function onExport() {
		const blob = new Blob([JSON.stringify(toCharacterCardV2(card), null, 2)], { type: "application/json" });
		saveBlob(`${slugName(card.name)}.json`, blob).then((saved) => {
			if (saved) setNotice("Saved a Character Card V2 file. Marinara imports it as JSON.");
			setError(null);
		}).catch((err) => setError(err instanceof Error ? err.message : "Could not save that file."));
	}
	async function onExportPng() {
		setBusy("Packing the PNG card…");
		setError(null);
		setNotice(null);
		try {
			const blob = await buildCharacterPng(card, portrait?.dataUrl ?? null);
			if (await saveBlob(`${slugName(card.name)}.png`, blob)) setNotice("Saved a PNG card. The picture is the portrait, and the card JSON is stored inside the file.");
		} catch (err) {
			setError(explainFetchError(err));
		} finally {
			setBusy(null);
		}
	}
	async function onCopy() {
		try {
			await navigator.clipboard.writeText(JSON.stringify(toCharacterCardV2(card), null, 2));
			setNotice("Copied the card JSON.");
			setError(null);
		} catch {
			setError("The browser blocked clipboard access. Use Download instead.");
		}
	}
	function onImport(file) {
		const reader = new FileReader();
		const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
		reader.onload = () => {
			try {
				if (isPng) {
					const parsed = readCharacterPng(new Uint8Array(reader.result));
					useStudio.setState({ card: withImportedLore(parsed) });
					fileToImage(new File([file], file.name, { type: "image/png" })).then((image) => {
						setMedia({
							images: [image],
							portraitId: image.id
						});
					});
					setNotice(`Loaded the card inside ${file.name}.`);
				} else {
					const parsed = JSON.parse(String(reader.result));
					useStudio.setState({ card: withImportedLore(parsed) });
					setNotice(`Loaded ${file.name}.`);
				}
				setTab("card");
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : "That file is not a character card.");
			}
		};
		if (isPng) reader.readAsArrayBuffer(file);
		else reader.readAsText(file);
	}
	function onKeep() {
		const before = card.character_version.trim() || "1.0";
		saveMedia(saveToShelf(), media);
		const version = useStudio.getState().card.character_version.trim() || before;
		setVersionPick("current");
		versionBackup.current = null;
		setNotice(version !== before ? `Kept this card as version ${version}. The previous copy is in the version list.` : "Kept this card in the library.");
		setError(null);
	}
	function onNew() {
		newCard();
		setMedia(EMPTY_MEDIA);
		setTab("card");
		setNotice(null);
		setError(null);
	}
	async function onLoadShelf(id) {
		loadFromShelf(id);
		setMedia(await loadMedia(id));
		setNotice(null);
		setError(null);
	}
	async function onSaveSettings() {
		try {
			const saved = await saveSettingsFile(captureSettings());
			setError(null);
			setNotice(saved ? `Saved settings to ${saved}. They come back the next time you open Cardwright.` : "Save cancelled.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save settings.");
		}
	}
	async function onLoadSettings() {
		try {
			if (await isDesktopHost()) {
				const file = await openSettingsFile();
				if (!file) {
					setNotice("Load cancelled.");
					return;
				}
				applySettings(file);
				await writeAutoSettings(captureSettings());
				setNotice("Loaded settings. Cards in that file were added to the library.");
				setError(null);
				return;
			}
			settingsRef.current?.click();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not load settings.");
		}
	}
	function onSettingsPicked(file) {
		file.text().then((text) => {
			try {
				const parsed = parseSettingsFile(JSON.parse(text));
				if (!parsed) {
					setError("That file is not a Cardwright settings file.");
					return;
				}
				applySettings(parsed);
				writeAutoSettings(captureSettings());
				setNotice(`Loaded settings from ${file.name}. Cards in that file were added to the library.`);
				setError(null);
			} catch {
				setError("That file is not a Cardwright settings file.");
			}
		});
	}
	const locked = busy !== null;
	async function onUseGenerated(dataUrl, name) {
		const blob = await (await fetch(dataUrl)).blob();
		const image = await fileToImage(new File([blob], name, { type: "image/png" }));
		setMedia((current) => placePortrait(current, image));
		setNotice("That picture is now the card portrait.");
		setError(null);
		setTab("card");
	}
	const menu = (0, import_react.useRef)({
		onNew,
		onExport,
		onExportPng,
		onGenerate,
		onKeep,
		onCopy,
		onImport,
		onSaveSettings,
		onLoadSettings,
		setTab,
		setLibraryKind
	});
	menu.current = {
		onNew,
		onExport,
		onExportPng,
		onGenerate,
		onKeep,
		onCopy,
		onImport,
		onSaveSettings,
		onLoadSettings,
		setTab,
		setLibraryKind
	};
	(0, import_react.useEffect)(() => {
		const stops = [
			onCommand("file.new", () => menu.current.onNew()),
			onCommand("file.import", () => {
				pickCardFile().then((file) => {
					if (file) menu.current.onImport(file);
				}).catch((err) => {
					setError(err instanceof Error ? err.message : "Could not open that card.");
				});
			}),
			onCommand("file.exportJson", () => menu.current.onExport()),
			onCommand("file.exportPng", () => void menu.current.onExportPng()),
			onCommand("file.saveSettings", () => void menu.current.onSaveSettings()),
			onCommand("file.loadSettings", () => void menu.current.onLoadSettings()),
			onCommand("file.exit", () => void quitApp()),
			onCommand("card.write", () => void menu.current.onGenerate()),
			onCommand("card.keep", () => menu.current.onKeep()),
			onCommand("card.copy", () => void menu.current.onCopy()),
			onCommand("nav.card", () => menu.current.setTab("card")),
			onCommand("nav.novel", () => menu.current.setTab("novel")),
			onCommand("nav.persona", () => menu.current.setTab("persona")),
			onCommand("nav.library", () => menu.current.setTab("library")),
			onCommand("nav.chats", () => {
				menu.current.setLibraryKind("chats");
				menu.current.setTab("library");
			}),
			onCommand("nav.preset", () => menu.current.setTab("preset")),
			onCommand("nav.chat", () => menu.current.setTab("chat")),
			onCommand("nav.life", () => menu.current.setTab("life")),
			onCommand("nav.lore", () => menu.current.setTab("lore")),
			onCommand("nav.colors", () => menu.current.setTab("colors")),
			onCommand("file.downloadFolder", () => {
				(async () => {
					try {
						const next = await chooseDownloadFolder();
						if (!next) {
							setNotice("Download folder choice cancelled.");
							return;
						}
						window.dispatchEvent(new Event("cardwright-downloads"));
						setError(null);
						setNotice(`Downloads now go to ${next}.`);
					} catch (err) {
						setError(err instanceof Error ? err.message : "Could not choose a download folder.");
					}
				})();
			}),
			onCommand("file.libraryFolder", () => {
				(async () => {
					try {
						await syncShelf("cards", useStudio.getState().shelf);
						await syncShelf("personas", useStudio.getState().personas);
						const next = await chooseVaultFolder();
						if (!next) {
							setNotice("Folder choice cancelled.");
							return;
						}
						disarmLibrarySync();
						const nextShelf = await loadShelf("cards");
						const nextPersonas = await loadShelf("personas");
						const presets = await loadPresetList();
						armLibrarySync();
						useStudio.setState({
							shelf: nextShelf,
							personas: nextPersonas,
							presets
						});
						window.dispatchEvent(new Event("cardwright-vault"));
						setError(null);
						setNotice(`Cards and pictures now save in ${next.label}.`);
					} catch (err) {
						setError(err instanceof Error ? err.message : "Could not change the library folder.");
					}
				})();
			})
		];
		return () => stops.forEach((stop) => stop());
	}, []);
	const tabClass = (selected) => `min-h-11 rounded-md px-4 text-sm font-semibold ${selected ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextMenu, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-semibold tracking-tight text-fg",
							children: "Cardwright"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Marinara character cards, from a concept or a reference picture."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/Cardwright.exe",
								download: "Cardwright.exe",
								className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, {
									className: "size-4 text-gold",
									"aria-hidden": "true"
								}), "Windows app"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
									className: "size-4 text-gold",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: linkNote })]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "card",
								onClick: () => setTab("card"),
								className: tabClass(tab === "card"),
								children: "Card"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "persona",
								onClick: () => setTab("persona"),
								className: tabClass(tab === "persona"),
								children: "Persona"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "library",
								onClick: () => setTab("library"),
								className: tabClass(tab === "library"),
								children: "Library"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "chat",
								onClick: () => setTab("chat"),
								className: tabClass(tab === "chat"),
								children: "Chat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "life",
								onClick: () => setTab("life"),
								className: tabClass(tab === "life"),
								children: "Life"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "lore",
								onClick: () => setTab("lore"),
								className: tabClass(tab === "lore"),
								children: "Lore"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "preset",
								onClick: () => setTab("preset"),
								className: tabClass(tab === "preset"),
								children: "Presets"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "novel",
								onClick: () => setTab("novel"),
								className: tabClass(tab === "novel"),
								children: "NovelAI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": tab === "colors",
								onClick: () => setTab("colors"),
								className: tabClass(tab === "colors"),
								children: "Colors"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: tab === "chat" ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: settingsRef,
					type: "file",
					accept: "application/json,.json",
					className: "sr-only",
					onChange: (event) => {
						const file = event.target.files?.[0];
						if (file) onSettingsPicked(file);
						event.target.value = "";
					}
				}), tab === "novel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NovelTab, {
					settings,
					onSettings: patchSettings,
					appearance: appearancePrompt({
						name: card.name,
						appearance: card.appearance,
						description: card.description,
						concept
					}),
					onUsePortrait: (dataUrl, name) => onUseGenerated(dataUrl, name)
				}) : tab === "persona" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonaTab, {}) : tab === "library" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryTab, {
					cards: shelf,
					personas,
					kind: libraryKind,
					onKind: setLibraryKind,
					onOpenCard: (id) => {
						onLoadShelf(id);
						setTab("card");
					},
					onOpenPersona: (id) => {
						loadPersona(id);
						setTab("persona");
					},
					onChatCard: (item) => {
						startChat(item.card, persona.name.trim() ? persona : null, item.id);
						setTab("chat");
					},
					onChatPersona: (item) => {
						if (!card.name.trim()) {
							setError("Write a character on the Card tab before chatting as this persona.");
							setTab("card");
							return;
						}
						startChat(card, item.card, useStudio.getState().cardDraftId ?? "editor");
						setTab("chat");
					},
					onDeleteCard: (id) => {
						removeFromShelf(id);
						deleteMedia(id);
					},
					onDeletePersona: (id) => {
						removePersona(id);
						deleteMedia(`persona:${id}`);
					},
					onImportCard: (file) => {
						onImport(file);
						setTab("card");
					},
					onContinueChat: () => setTab("chat")
				}) : tab === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatTab, {
					cards: shelf,
					personas,
					onOpenLibrary: () => {
						setLibraryKind("chats");
						setTab("library");
					}
				}) : tab === "life" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeTab, {}) : tab === "lore" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoreTab, {}) : tab === "colors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorsTab, {}) : tab === "preset" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetTab, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)_20rem]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Concept",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "sr-only",
											htmlFor: "concept",
											children: "Character concept"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											id: "concept",
											value: hydrated ? concept : "",
											onChange: (event) => setConcept(event.target.value),
											rows: 4,
											placeholder: "Who are they, where are they, and what should a chat feel like?",
											className: "min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: locked,
											onClick: () => void onGenerate(),
											className: "mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
												className: "size-4",
												"aria-hidden": "true"
											}), busy && busy.startsWith("Writing") ? busy : "Write the card"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-3 flex min-h-11 items-center gap-2 text-sm text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: fillBlanks,
												onChange: (event) => setFillBlanks(event.target.checked),
												className: "size-4 accent-primary"
											}), "Fill empty fields only"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-xs font-semibold tracking-wide text-muted uppercase",
											children: "Starters"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												const pick = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
												if (pick) setConcept(pick.text);
											},
											className: "mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, {
												className: "size-4",
												"aria-hidden": "true"
											}), "Randomize starters"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-col gap-2",
											children: CONCEPTS.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setConcept(sample.text),
												className: "min-h-11 rounded-md border border-border bg-surface-2 px-3 text-left text-sm text-fg",
												children: sample.label
											}, sample.label))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "References",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											onDragOver: (event) => {
												event.preventDefault();
												setDragging(true);
											},
											onDragLeave: () => setDragging(false),
											onDrop: (event) => {
												event.preventDefault();
												setDragging(false);
												onAddFiles(event.dataTransfer.files);
											},
											className: `flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-3 py-3 text-center text-sm ${dragging ? "border-gold bg-surface-2 text-fg" : "border-border bg-bg text-muted"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
													className: "size-5 text-gold",
													"aria-hidden": "true"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Drop pictures, or click to upload" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/png,image/jpeg,image/webp,image/gif",
													multiple: true,
													className: "sr-only",
													onChange: (event) => {
														if (event.target.files) onAddFiles(event.target.files);
														event.target.value = "";
													}
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted",
											children: "Up to 200. They stay with this card. A vision model can read them when you write the card. The starred one is the portrait. Saved pictures in the library are not capped."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-2 flex min-h-11 items-center gap-2 text-sm text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: useImages,
												onChange: (event) => patchSettings({ useImages: event.target.checked }),
												className: "size-4 accent-primary"
											}), "Send pictures to the model"]
										}),
										media.images.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-3 grid grid-cols-2 gap-2",
											children: media.images.map((image) => {
												const selected = image.id === portrait?.id;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "relative",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															"aria-pressed": selected,
															"aria-label": selected ? `${image.name} is the portrait` : `Use ${image.name} as the portrait`,
															onClick: () => setMedia((current) => ({
																...current,
																portraitId: image.id
															})),
															className: `block w-full overflow-hidden rounded-md border-2 ${selected ? "border-gold" : "border-transparent"}`,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: image.dataUrl,
																alt: "",
																className: "aspect-square w-full object-cover"
															})
														}),
														selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
															className: "absolute top-2 left-2 size-4 fill-gold text-gold",
															"aria-hidden": "true"
														}) : null,
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															"aria-label": `Remove ${image.name}`,
															onClick: () => setMedia((current) => removeImage(current, image.id)),
															className: "absolute top-1 right-1 flex size-11 items-center justify-center text-fg",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "flex size-6 items-center justify-center rounded-md bg-bg",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
																	className: "size-3.5",
																	"aria-hidden": "true"
																})
															})
														})
													]
												}, image.id);
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm text-muted",
											children: mediaReady ? "No reference pictures yet." : "Loading pictures…"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "KoboldCPP",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
											htmlFor: "baseUrl",
											children: "OpenAI endpoint"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "baseUrl",
											value: settings.baseUrl,
											onChange: (event) => patchSettings({ baseUrl: event.target.value }),
											className: inputClass,
											spellCheck: false,
											autoCapitalize: "off"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: "Usually http://127.0.0.1:5001/v1. The Windows app talks to Kobold on your PC. This preview can only reach it when Kobold is running on the same computer."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
											htmlFor: "apiKey",
											children: "Password, if you set one"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "apiKey",
											type: "password",
											value: settings.apiKey,
											onChange: (event) => patchSettings({ apiKey: event.target.value }),
											className: inputClass,
											autoComplete: "off"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldLabel, {
											htmlFor: "temperature",
											children: ["Temperature ", settings.temperature.toFixed(2)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "temperature",
											type: "range",
											min: .1,
											max: 1.4,
											step: .05,
											value: settings.temperature,
											onChange: (event) => patchSettings({ temperature: Number(event.target.value) }),
											className: "w-full accent-primary"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
											htmlFor: "maxTokens",
											children: "Max tokens"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "maxTokens",
											type: "number",
											min: 256,
											max: 8192,
											value: settings.maxTokens,
											onChange: (event) => patchSettings({ maxTokens: Number(event.target.value) || 2200 }),
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: locked,
											onClick: () => void onProbe(),
											className: "mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60",
											children: "Test connection"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
									title: "Library",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: onKeep,
											className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
												className: "size-4",
												"aria-hidden": "true"
											}), "Keep"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: onNew,
											className: "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
												className: "size-4",
												"aria-hidden": "true"
											}), "New"]
										})]
									}), shelf.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-muted",
										children: "Kept cards also show on the Library tab."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 flex flex-col gap-2",
										children: shelf.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => void onLoadShelf(item.id),
												className: "min-h-11 flex-1 truncate rounded-md px-2 text-left text-sm text-fg",
												children: item.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `Remove ${item.name}`,
												onClick: () => {
													removeFromShelf(item.id);
													deleteMedia(item.id);
												},
												className: "flex size-11 items-center justify-center rounded-md text-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
													className: "size-4",
													"aria-hidden": "true"
												})
											})]
										}, item.id))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-3",
							children: [
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									role: "alert",
									className: "rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg",
									children: error
								}) : null,
								notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
									children: notice
								}) : null,
								busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-gold",
									children: busy
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
										htmlFor: "name",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "name",
										value: card.name,
										onChange: (event) => patchCard({ name: event.target.value }),
										className: inputClass
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
										htmlFor: "summary",
										children: "Summary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "summary",
										value: card.summary,
										onChange: (event) => patchCard({ summary: event.target.value }),
										className: inputClass
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "rounded-lg border border-border bg-bg p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-semibold",
											children: "Version"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: "Keeping this card again saves the previous copy and raises the version."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: "cardVersion",
											className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
											children: ["Saved copies", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												id: "cardVersion",
												value: versionPick,
												onChange: (event) => {
													const next = event.target.value;
													if (next === "current") {
														if (versionBackup.current) replaceCard(versionBackup.current);
														versionBackup.current = null;
														setVersionPick("current");
														return;
													}
													const revision = revisions[Number(next)];
													if (!revision) return;
													if (versionPick === "current") versionBackup.current = card;
													replaceCard(revision.card);
													setVersionPick(next);
												},
												className: "mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm font-normal tracking-normal text-fg normal-case",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "current",
													children: versionPick === "current" ? `This card · ${card.character_version.trim() || "1.0"}` : "Back to the unsaved card"
												}), [...revisions].reverse().map((revision, index) => {
													const value = String(revisions.length - 1 - index);
													const when = revision.savedAt ? new Date(revision.savedAt).toLocaleString(void 0, {
														month: "short",
														day: "numeric",
														hour: "numeric",
														minute: "2-digit"
													}) : "saved";
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value,
														children: [
															revision.version,
															" · ",
															when
														]
													}, `${revision.version}-${revision.savedAt}-${value}`);
												})]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "rounded-lg border border-border bg-bg p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-semibold",
											children: "Creator"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: "Who made this card. You can type a name, or use a persona."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: "creator",
											className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
											children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "creator",
												value: card.creator,
												onChange: (event) => patchCard({ creator: event.target.value }),
												className: "mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm font-normal tracking-normal text-fg normal-case"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: "creatorPersona",
											className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
											children: ["Persona", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												id: "creatorPersona",
												value: creatorPick,
												onChange: (event) => setCreatorPick(event.target.value),
												className: "mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm font-normal tracking-normal text-fg normal-case",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: "editor",
													children: ["Persona in the editor", persona.name.trim() ? ` · ${persona.name.trim()}` : ""]
												}), personas.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: item.id,
													children: item.name
												}, item.id))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												const source = creatorPick === "editor" ? persona : personas.find((item) => item.id === creatorPick)?.card;
												const credit = source ? creatorFromPersona(source) : "";
												if (!credit) {
													setError("That persona needs a name or a summary first.");
													return;
												}
												patchCard({ creator: credit });
												setNotice("Creator now uses that persona.");
												setError(null);
											},
											className: "mt-3 flex min-h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg",
											children: "Use this persona"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "rounded-lg border border-border bg-bg p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-semibold",
											children: "Chat colors"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: "These colors travel with the card and color this character’s messages."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatColors, {
												look: card.chatLook,
												theme: {
													...DEFAULT_THEME,
													...theme
												},
												name: card.name,
												onChange: (chatLook) => patchCard({ chatLook })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: "aliases",
											className: "mt-3 block text-xs font-semibold tracking-wide text-muted uppercase",
											children: ["Aliases", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												id: "aliases",
												value: card.aliases ?? "",
												rows: 3,
												placeholder: "Other names, one per line. Used when you write who should answer.",
												onChange: (event) => patchCard({ aliases: event.target.value }),
												className: "mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg normal-case"
											})]
										})
									]
								}),
								LONG_FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-end justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
											htmlFor: field.key,
											children: field.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: locked,
											onClick: () => void onRewrite(field.key),
											className: "min-h-11 shrink-0 rounded-md px-2 text-xs font-semibold text-gold disabled:opacity-60",
											children: "Rewrite"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: field.key,
										value: card[field.key],
										onChange: (event) => patchCard({ [field.key]: event.target.value }),
										rows: field.key === "first_mes" || field.key === "description" ? 7 : 4,
										className: "min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted",
										children: [
											field.hint,
											" · ",
											wordCount(card[field.key]),
											" words"
										]
									})
								] }, field.key)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
									htmlFor: "tags",
									children: "Tags"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "tags",
									value: tagsToText(card.tags),
									onChange: (event) => patchCard({ tags: textToTags(event.target.value) }),
									className: inputClass,
									placeholder: "original, slow-burn, city"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold tracking-wide text-muted uppercase",
											children: "Alternate greetings"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Add greeting",
											onClick: () => patchCard({ alternate_greetings: [...card.alternate_greetings ?? [], ""] }),
											className: "flex size-11 items-center justify-center rounded-md border border-border bg-surface-2 text-fg",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
												className: "size-4",
												"aria-hidden": "true"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "The first message is greeting 1. Each box is another opening you can swipe to in chat."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-col gap-3",
										children: (card.alternate_greetings ?? []).map((greeting, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-1 flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: `greeting-${index}`,
												className: "text-xs font-semibold tracking-wide text-muted uppercase",
												children: ["Greeting ", index + 2]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": `Remove greeting ${index + 2}`,
												onClick: () => patchCard({ alternate_greetings: card.alternate_greetings.filter((_, item) => item !== index) }),
												className: "flex size-11 items-center justify-center rounded-md text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
													className: "size-4",
													"aria-hidden": "true"
												})
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											id: `greeting-${index}`,
											value: greeting,
											rows: 5,
											placeholder: "Another way this character can open a chat.",
											onChange: (event) => {
												const next = [...card.alternate_greetings];
												next[index] = event.target.value;
												patchCard({ alternate_greetings: next });
											},
											className: "min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
										})] }, `greeting-${index}`))
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldLabel, {
									htmlFor: "talk",
									children: ["Talkativeness ", card.talkativeness]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "talk",
									type: "range",
									min: 0,
									max: 100,
									value: card.talkativeness,
									onChange: (event) => patchCard({ talkativeness: Number(event.target.value) }),
									className: "w-full accent-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
										htmlFor: "lorebook",
										children: "Linked lorebook"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "lorebook",
										value: card.lorebookId || "",
										onChange: (event) => patchCard({ lorebookId: event.target.value }),
										className: inputClass,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "None"
										}), lorebooks.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: book.id,
											children: book.name
										}, book.id))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: "New chats with this card include that lorebook. World books are chosen inside the chat."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 pb-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: onExport,
											className: "flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
												className: "size-4",
												"aria-hidden": "true"
											}), "Download JSON"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: locked,
											onClick: () => void onExportPng(),
											className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
												className: "size-4",
												"aria-hidden": "true"
											}), "Download PNG"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => void onCopy(),
											className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg",
											children: "Copy JSON"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												pickCardFile().then((file) => {
													if (file) onImport(file);
												}).catch((err) => setError(err instanceof Error ? err.message : "Could not open that card."));
											},
											className: "flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
												className: "size-4",
												"aria-hidden": "true"
											}), "Import"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "lg:sticky lg:top-4 lg:self-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-lg bg-paper p-5 text-ink shadow-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-soft uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
											className: "size-4",
											"aria-hidden": "true"
										}), "Character sheet"]
									}),
									portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: portrait.dataUrl,
										alt: "",
										className: "mt-3 aspect-square w-full rounded-md object-cover"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-2 font-display text-3xl font-semibold text-ink",
										children: card.name.trim() || "Unnamed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-ink-soft",
										children: card.summary.trim() || "No summary yet."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-4 border-gold" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetBlock, {
										title: "Description",
										text: card.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetBlock, {
										title: "Personality",
										text: card.personality
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetBlock, {
										title: "Appearance",
										text: card.appearance
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetBlock, {
										title: "Opening",
										text: card.first_mes
									}),
									card.tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-xs text-ink-soft",
										children: card.tags.join(" · ")
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "Backstory and appearance live in Marinara’s extensions. A PNG download uses the portrait and hides the same card inside the file."
							})]
						})
					]
				})]
			})
		]
	});
}
var inputClass = "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg";
function Panel({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 font-display text-lg font-semibold text-fg",
			children: title
		}), children]
	});
}
function FieldLabel({ htmlFor, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor,
		className: "text-xs font-semibold tracking-wide text-muted uppercase",
		children
	});
}
function SheetBlock({ title, text }) {
	if (!text.trim()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xs font-semibold tracking-wide text-ink-soft uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm whitespace-pre-wrap text-ink",
			children: text
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
