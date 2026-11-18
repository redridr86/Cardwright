import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, _ as createFileRoute, b as require_jsx_runtime, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bi-sOyNV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-Dl8M9bAZ.css";
var APP_NAME = "Cardwright";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Write Marinara Engine character cards with a local KoboldCPP model."
			},
			{
				name: "theme-color",
				content: "#12100e"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,560;9..144,650&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter = () => import("./routes-CSBd47bc.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$1 = createFileRoute("/api/cardwright")({ server: { handlers: { GET: () => Response.json({ desktop: false }) } } });
var NOVEL_MODELS = [{
	id: "nai-diffusion-5-full",
	label: "V5",
	paramsVersion: 4
}, {
	id: "nai-diffusion-4-5-full",
	label: "V4.5",
	paramsVersion: 3
}];
var STYLE_PROFILES = [
	{
		id: "anime",
		label: "Anime",
		source: "Danbooru / Illustrious",
		prefix: "masterpiece, best quality",
		negative: "low quality, blurry"
	},
	{
		id: "semi",
		label: "Semi-realistic",
		source: "illustration",
		prefix: "masterpiece, best quality, semi-realistic",
		negative: "low quality, blurry"
	},
	{
		id: "furry",
		label: "Furry",
		source: "fur dataset",
		prefix: "fur dataset, masterpiece, best quality",
		negative: "low quality, blurry"
	},
	{
		id: "none",
		label: "None",
		source: "no extra tags",
		prefix: "",
		negative: ""
	}
];
var DEFAULT_NOVEL_GEN = {
	seed: -1,
	styleProfile: "anime",
	steps: 25,
	guidance: 6,
	guidanceRescale: 0,
	ucPreset: 4,
	promptPrefix: "",
	negativePrefix: "",
	sampler: "k_euler_ancestral",
	noiseSchedule: "karras",
	width: 1024,
	height: 1024,
	sizeFromCount: false,
	styleStrength: .8,
	styleFidelity: .8
};
function novelGenOf(input) {
	const next = { ...DEFAULT_NOVEL_GEN };
	if (!input) return next;
	const source = input;
	Object.keys(DEFAULT_NOVEL_GEN).forEach((key) => {
		const value = source[key];
		if (value !== void 0 && value !== null) next[key] = value;
	});
	if (!STYLE_PROFILES.some((profile) => profile.id === next.styleProfile)) next.styleProfile = "anime";
	return next;
}
function styleProfile(id) {
	return STYLE_PROFILES.find((profile) => profile.id === id) ?? STYLE_PROFILES[0];
}
function appearancePrompt(parts) {
	const chunks = [
		parts.appearance,
		parts.name,
		parts.description,
		parts.concept
	].map((part) => part.trim()).filter(Boolean);
	if (chunks.length === 0) return "";
	return `${chunks.join(", ")}, portrait, upper body, looking at viewer`.slice(0, 2e3);
}
function snapSize(value) {
	return Math.round(Math.min(1600, Math.max(64, Number.isFinite(value) ? value : 1024)) / 64) * 64;
}
function characterCount(prompt) {
	const pattern = /(\d+)\s*(girls?|boys?|others?|people|persons?|characters?)/gi;
	let total = 0;
	let found = false;
	for (const match of prompt.matchAll(pattern)) {
		found = true;
		total += Number(match[1]);
	}
	if (found) return Math.min(Math.max(total, 1), 12);
	if (/\bsolo\b/i.test(prompt)) return 1;
	return null;
}
function resolutionFor(prompt, gen) {
	const requested = {
		width: snapSize(gen.width),
		height: snapSize(gen.height)
	};
	if (!gen.sizeFromCount) return requested;
	const count = characterCount(prompt);
	if (count === null) return requested;
	if (count <= 1) return {
		width: 832,
		height: 1216
	};
	if (count === 2) return {
		width: 1024,
		height: 1024
	};
	return {
		width: 1216,
		height: 832
	};
}
function clamp(value, min, max, fallback) {
	if (!Number.isFinite(value)) return fallback;
	return Math.min(max, Math.max(min, value));
}
function composePrompt(prompt, gen) {
	const profile = styleProfile(gen.styleProfile);
	let body = prompt.trim();
	if (profile.id === "furry" && !/fur dataset/i.test(`${gen.promptPrefix} ${body}`)) body = body ? `fur dataset, ${body}` : "fur dataset";
	if (profile.id === "semi" && !/semi-realistic/i.test(`${gen.promptPrefix} ${body}`)) body = body ? `semi-realistic, ${body}` : "semi-realistic";
	const positive = [gen.promptPrefix, body].map((part) => part.trim().replace(/^,+|,+$/g, "")).filter(Boolean).join(", ");
	const negative = gen.negativePrefix.trim();
	return {
		positive: positive.slice(0, 4e3),
		negative: negative.slice(0, 2e3)
	};
}
function novelPayload(prompt, modelId, genInput, stylePlate) {
	const model = NOVEL_MODELS.find((item) => item.id === modelId) ?? NOVEL_MODELS[0];
	const gen = novelGenOf(genInput);
	const { positive, negative } = composePrompt(prompt, gen);
	const size = resolutionFor(positive, gen);
	const seed = gen.seed < 0 ? Math.floor(Math.random() * 4294967295) : Math.floor(gen.seed) >>> 0;
	const parameters = {
		params_version: model.paramsVersion,
		width: size.width,
		height: size.height,
		scale: clamp(gen.guidance, 0, 10, 6),
		sampler: gen.sampler.trim() || "k_euler_ancestral",
		steps: Math.round(clamp(gen.steps, 1, 50, 25)),
		seed,
		n_samples: 1,
		negative_prompt: negative,
		qualityToggle: true,
		ucPreset: Math.round(clamp(gen.ucPreset, 0, 4, 4)),
		cfg_rescale: clamp(gen.guidanceRescale, 0, 1, 0),
		noise_schedule: gen.noiseSchedule.trim() || "karras",
		skip_cfg_above_sigma: null,
		sm: false,
		sm_dyn: false,
		dynamic_thresholding: false,
		controlnet_strength: 1,
		legacy: false,
		add_original_image: true,
		uncond_scale: 1,
		deliberate_euler_ancestral_bug: false,
		prefer_brownian: true,
		v4_prompt: {
			caption: {
				base_caption: positive,
				char_captions: []
			},
			use_coords: false,
			use_order: true
		},
		v4_negative_prompt: {
			caption: {
				base_caption: negative,
				char_captions: []
			},
			legacy_uc: false
		}
	};
	const plate = stylePlate?.trim() ?? "";
	if (plate && !model.id.startsWith("nai-diffusion-5")) {
		parameters.reference_image_multiple = [plate];
		parameters.reference_strength_multiple = [clamp(gen.styleStrength, 0, 1, .8)];
		parameters.reference_information_extracted_multiple = [clamp(gen.styleFidelity, 0, 1, .8)];
	}
	return {
		input: positive,
		model: model.id,
		action: "generate",
		parameters
	};
}
function explainNovelError(status, body) {
	let message = "";
	try {
		const parsed = JSON.parse(body);
		if (typeof parsed.message === "string") message = parsed.message;
	} catch {
		message = body.replace(/\s+/g, " ").slice(0, 180);
	}
	if (status === 401 || status === 403) return "NovelAI refused that token. Use the persistent API token from your NovelAI account settings, the one that starts with pst-.";
	if (status === 402 || /anlas/i.test(message)) return "NovelAI refused the draw. You are out of Anlas, or this model is not on your subscription.";
	if (message && !message.startsWith("<")) return `NovelAI answered with HTTP ${status}. ${message}`;
	return `NovelAI answered with HTTP ${status}.`;
}
async function pngFromZip(bytes) {
	if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80) return bytes;
	const entry = zipEntry(bytes);
	if (!entry) throw new Error("NovelAI did not return a picture.");
	if (entry.method === 0) return entry.data;
	if (entry.method !== 8) throw new Error("NovelAI returned a picture this app could not unpack.");
	return inflateRaw(entry.data);
}
function zipEntry(bytes) {
	const eocd = findEocd(bytes);
	if (eocd < 0) return null;
	const count = u16(bytes, eocd + 10);
	let offset = u32(bytes, eocd + 16);
	for (let index = 0; index < count; index += 1) {
		if (u32(bytes, offset) !== 33639248) return null;
		const method = u16(bytes, offset + 10);
		const compSize = u32(bytes, offset + 20);
		const nameLen = u16(bytes, offset + 28);
		const extraLen = u16(bytes, offset + 30);
		const commentLen = u16(bytes, offset + 32);
		const localOffset = u32(bytes, offset + 42);
		const name = new TextDecoder().decode(bytes.subarray(offset + 46, offset + 46 + nameLen));
		offset += 46 + nameLen + extraLen + commentLen;
		if (!name.toLowerCase().endsWith(".png")) continue;
		if (compSize === 4294967295 || localOffset === 4294967295) throw new Error("NovelAI returned a picture this app could not unpack.");
		const localName = u16(bytes, localOffset + 26);
		const localExtra = u16(bytes, localOffset + 28);
		const dataStart = localOffset + 30 + localName + localExtra;
		const dataEnd = dataStart + compSize;
		if (dataEnd > bytes.length) return null;
		return {
			method,
			data: bytes.subarray(dataStart, dataEnd)
		};
	}
	return null;
}
function findEocd(bytes) {
	const start = Math.max(0, bytes.length - 22 - 65535);
	for (let index = bytes.length - 22; index >= start; index -= 1) if (u32(bytes, index) === 101010256) return index;
	return -1;
}
function u16(bytes, offset) {
	return bytes[offset] | bytes[offset + 1] << 8;
}
function u32(bytes, offset) {
	return (bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16 | bytes[offset + 3] << 24) >>> 0;
}
async function inflateRaw(data) {
	try {
		const bytes = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
		const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
		return new Uint8Array(await new Response(stream).arrayBuffer());
	} catch {
		throw new Error("NovelAI returned a picture this app could not unpack.");
	}
}
function pngDataUrl(bytes) {
	let binary = "";
	const step = 32768;
	for (let index = 0; index < bytes.length; index += step) binary += String.fromCharCode(...bytes.subarray(index, index + step));
	return `data:image/png;base64,${btoa(binary)}`;
}
function dataUrlPayload(dataUrl) {
	const comma = dataUrl.indexOf(",");
	return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}
async function drawNovelPortrait(token, prompt, modelId, gen, stylePlate) {
	const trimmed = token.trim();
	if (trimmed.length < 8) throw new Error("Paste your NovelAI persistent token first. It starts with pst- and is not your password.");
	if (prompt.trim().length < 3 && novelGenOf(gen).promptPrefix.trim().length < 3) throw new Error("Write a prompt, or use the appearance, before drawing.");
	let response;
	try {
		response = await fetch("/api/novelai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${trimmed}`
			},
			body: JSON.stringify(novelPayload(prompt, modelId, gen, stylePlate)),
			signal: AbortSignal.timeout(18e4)
		});
	} catch {
		throw new Error("Could not reach NovelAI. In the Windows app this goes out from your PC. Check the connection and try again.");
	}
	if (!response.ok) throw new Error(explainNovelError(response.status, await response.text()));
	let bytes;
	try {
		bytes = new Uint8Array(await response.arrayBuffer());
	} catch {
		throw new Error("The picture download from NovelAI was interrupted. Try again.");
	}
	return pngFromZip(bytes);
}
function novelFailure(error) {
	if (error instanceof Error && error.message && !/failed to fetch|networkerror|load failed/i.test(error.message)) return error.message;
	return "Could not reach NovelAI. Check the token and your connection, then try the draw again.";
}
var ENDPOINT = "https://image.novelai.net/ai/generate-image";
var Route = createFileRoute("/api/novelai")({ server: { handlers: { POST: async ({ request }) => {
	const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
	if (token.length < 8) return Response.json({ message: "Add your NovelAI persistent token." }, { status: 401 });
	const body = await request.text();
	if (body.length > 8e6) return Response.json({ message: "That draw, including the style plate, is too large." }, { status: 413 });
	try {
		const upstream = await fetch(ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body,
			signal: AbortSignal.timeout(18e4)
		});
		const bytes = new Uint8Array(await upstream.arrayBuffer());
		if (!upstream.ok) {
			const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
			return new Response(copy, {
				status: upstream.status,
				headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" }
			});
		}
		const png = await pngFromZip(bytes);
		const picture = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength);
		return new Response(picture, { headers: { "Content-Type": "image/png" } });
	} catch (error) {
		const message = error instanceof Error && error.message ? error.message : "Could not reach NovelAI.";
		return Response.json({ message }, { status: 502 });
	}
} } } });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	ApiCardwrightRoute: Route$1.update({
		id: "/api/cardwright",
		path: "/api/cardwright",
		getParentRoute: () => Route$3
	}),
	ApiNovelaiRoute: Route.update({
		id: "/api/novelai",
		path: "/api/novelai",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { appearancePrompt as a, novelFailure as c, styleProfile as d, STYLE_PROFILES as i, novelGenOf as l, DEFAULT_NOVEL_GEN as n, dataUrlPayload as o, NOVEL_MODELS as r, drawNovelPortrait as s, router_exports as t, pngDataUrl as u };
