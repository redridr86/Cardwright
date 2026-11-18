import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, RotateCcw, Sparkles, Star, X } from "lucide-react";
import { onCommand } from "@/lib/commands";
import { fileToImage, loadJson, saveJson } from "@/lib/images";
import { vaultGet, vaultList, vaultPut } from "@/lib/vault";
import type { KoboldSettings } from "@/lib/kobold";
import {
  DEFAULT_NOVEL_GEN,
  NOVEL_MODELS,
  STYLE_PROFILES,
  dataUrlPayload,
  drawNovelPortrait,
  novelFailure,
  novelGenOf,
  pngDataUrl,
  styleProfile,
  type NovelGenSettings,
} from "@/lib/novelai";
import { savePngFile } from "@/lib/save-file";
import { useStudio } from "@/lib/studio-store";

const GALLERY_KEY = "novel-gallery";
const PLATE_KEY = "novel-style-plate";

type Shot = { id: string; name: string; prompt: string; dataUrl: string; updatedAt?: number };

function fileSlug(prompt: string): string {
  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${slug || "novelai"}.png`;
}

export function NovelTab({
  settings,
  onSettings,
  appearance,
  onUsePortrait,
}: {
  settings: KoboldSettings;
  onSettings: (patch: Partial<KoboldSettings>) => void;
  appearance: string;
  onUsePortrait: (dataUrl: string, name: string) => void | Promise<void>;
}) {
  const gen = novelGenOf(settings.novelGen);
  const prompt = useStudio((state) => state.novelPrompt);
  const setPrompt = useStudio((state) => state.setNovelPrompt);
  const plate = useStudio((state) => state.stylePlate);
  const setPlate = useStudio((state) => state.setStylePlate);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [ready, setReady] = useState(false);
  const [viewer, setViewer] = useState<Shot | null>(null);
  const locked = busy !== null;
  const profile = styleProfile(gen.styleProfile);
  const v5 = (settings.novelModel ?? NOVEL_MODELS[0].id).startsWith("nai-diffusion-5");

  useEffect(() => {
    let cancel = false;
    async function loadGallery() {
      const heads = await vaultList("gallery");
      if (heads.length === 0) {
        const legacy = await loadJson<Shot[]>(GALLERY_KEY);
        if (Array.isArray(legacy)) {
          for (const shot of legacy) {
            if (shot?.id && typeof shot.dataUrl === "string") await vaultPut("gallery", shot.id, { ...shot, updatedAt: shot.updatedAt ?? Date.now() });
          }
        }
      }
      const nextHeads = heads.length === 0 ? await vaultList("gallery") : heads;
      const loaded: Shot[] = [];
      for (const head of nextHeads) {
        const shot = await vaultGet<Shot>("gallery", head.id);
        if (shot && typeof shot.dataUrl === "string") loaded.push(shot);
      }
      loaded.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
      const style = await loadJson<string>(PLATE_KEY);
      if (cancel) return;
      setShots(loaded);
      if (!useStudio.getState().stylePlate && typeof style === "string" && style.startsWith("data:image/")) {
        useStudio.getState().setStylePlate(style);
      }
      setReady(true);
    }
    void loadGallery();
    const onVault = () => {
      void loadGallery();
    };
    window.addEventListener("cardwright-vault", onVault);
    return () => {
      cancel = true;
      window.removeEventListener("cardwright-vault", onVault);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void saveJson(PLATE_KEY, plate);
  }, [plate, ready]);

  function patchGen(patch: Partial<NovelGenSettings>) {
    onSettings({ novelGen: { ...gen, ...patch } });
  }

  async function onDraw(nextPrompt = prompt) {
    setBusy("Drawing…");
    setError(null);
    setNotice(null);
    setPrompt(nextPrompt);
    try {
      const png = await drawNovelPortrait(
        settings.novelToken ?? "",
        nextPrompt,
        settings.novelModel ?? "",
        gen,
        plate && !v5 ? dataUrlPayload(plate) : null,
      );
      const shot: Shot = {
        id: crypto.randomUUID(),
        name: fileSlug(nextPrompt),
        prompt: nextPrompt,
        dataUrl: pngDataUrl(png),
        updatedAt: Date.now(),
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

  async function onSave(shot: Shot) {
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

  const drawRef = useRef(onDraw);
  const appearanceRef = useRef(useAppearance);
  drawRef.current = onDraw;
  appearanceRef.current = useAppearance;

  useEffect(() => {
    const offDraw = onCommand("novel.draw", () => {
      void drawRef.current();
    });
    const offTest = onCommand("novel.test", () => {
      void drawRef.current("pepperoni pizza");
    });
    const offAppearance = onCommand("novel.appearance", () => appearanceRef.current());
    return () => {
      offDraw();
      offTest();
      offAppearance();
    };
  }, []);

  useEffect(() => {
    if (!viewer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer]);

  async function onPlate(file: File) {
    setError(null);
    try {
      const image = await fileToImage(file);
      setPlate(image.dataUrl);
      setNotice("Style plate set. It is sent with V4.5 draws.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That style plate could not be read.");
    }
  }

  async function putOnCard(shot: Shot) {
    try {
      await onUsePortrait(shot.dataUrl, shot.name);
      setViewer(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not put that picture on the card.");
    }
  }

  return (
    <>
    <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="flex flex-col gap-4">
        {error ? (
          <p role="alert" className="rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg">
            {error}
          </p>
        ) : null}
        {notice ? <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{notice}</p> : null}
        {busy ? <p className="text-sm text-gold">{busy}</p> : null}

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Prompt</h2>
          <label className="sr-only" htmlFor="drawPrompt">
            Prompt
          </label>
          <textarea
            id="drawPrompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={5}
            placeholder="Tags or a sentence. Test NovelAI draws a pepperoni pizza."
            className="mt-2 min-h-28 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={useAppearance}
              className="min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
            >
              Use appearance
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => void onDraw()}
              className="flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg disabled:opacity-60"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Draw
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => void onDraw("pepperoni pizza")}
              className="min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg disabled:opacity-60"
            >
              Test NovelAI
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Requested size is {gen.width}×{gen.height} unless character count changes it. A draw spends Anlas.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Picture</h2>
          {shots[0] ? (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setViewer(shots[0])}
                className="block w-full overflow-hidden rounded-md bg-black"
              >
                <img src={shots[0].dataUrl} alt={shots[0].prompt} className="mx-auto max-h-[70vh] w-full object-contain" />
              </button>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void onSave(shots[0])}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => void putOnCard(shots[0])}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
                >
                  <Star className="size-4 text-gold" aria-hidden="true" />
                  Use on card
                </button>
              </div>
              <p className="mt-2 text-xs text-muted">Click the picture for a full-window view. Save asks where to put a copy. Every drawing is also kept in the library, with no slot cap.</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">{ready ? "A drawing shows here at full size." : "Loading pictures…"}</p>
          )}
          {shots.length > 1 ? (
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {shots.slice(1, 13).map((shot) => (
                <li key={shot.id}>
                  <button type="button" onClick={() => setViewer(shot)} className="block w-full overflow-hidden rounded-md border border-border">
                    <img src={shot.dataUrl} alt="" className="aspect-square w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </section>

      <section className="flex max-h-none flex-col gap-4 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1">
        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="mb-2 font-display text-lg font-semibold text-fg">Account</h2>
          <label htmlFor="novelToken" className="text-xs font-semibold tracking-wide text-muted uppercase">
            Persistent token
          </label>
          <input
            id="novelToken"
            type="password"
            value={settings.novelToken ?? ""}
            onChange={(event) => onSettings({ novelToken: event.target.value })}
            className={inputClass}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="mt-1 text-xs text-muted">The pst- token stays on this computer and is sent only to NovelAI.</p>
          <label htmlFor="novelModel" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
            Model
          </label>
          <select
            id="novelModel"
            value={settings.novelModel ?? NOVEL_MODELS[0].id}
            onChange={(event) => onSettings({ novelModel: event.target.value })}
            className={inputClass}
          >
            {NOVEL_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
          </select>
        </section>

        <details open className="rounded-lg border border-border bg-surface p-3">
          <summary className="cursor-pointer font-display text-lg font-semibold text-fg">NovelAI generation setup</summary>
          <p className="mt-1 text-xs text-muted">Prompt prefixes, sampler, noise schedule, steps, guidance, and seed.</p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <p className="text-xs text-muted">Seed -1 keeps generation random. Any non-negative seed is reused exactly.</p>
            <button
              type="button"
              onClick={() => onSettings({ novelGen: { ...DEFAULT_NOVEL_GEN } })}
              className="flex min-h-11 shrink-0 items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-fg"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <NumberField id="novelSeed" label="Seed" value={gen.seed} min={-1} max={4294967295} onChange={(seed) => patchGen({ seed })} />
            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="styleProfile" className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Style profile
                </label>
                <button
                  type="button"
                  onClick={() =>
                    patchGen({
                      styleProfile: "anime",
                      promptPrefix: styleProfile("anime").prefix,
                      negativePrefix: styleProfile("anime").negative,
                    })
                  }
                  className="min-h-11 rounded-full border border-border px-3 text-xs font-semibold text-fg"
                >
                  Use Danbooru / Illustrious
                </button>
              </div>
              <select
                id="styleProfile"
                value={gen.styleProfile}
                onChange={(event) => patchGen({ styleProfile: event.target.value as NovelGenSettings["styleProfile"] })}
                className={inputClass}
              >
                {STYLE_PROFILES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted">Suggested from model/source: {profile.source}</p>
            </div>
            <NumberField id="novelSteps" label="Steps" value={gen.steps} min={1} max={50} onChange={(steps) => patchGen({ steps })} />
            <NumberField
              id="novelGuidance"
              label="Prompt guidance"
              value={gen.guidance}
              min={0}
              max={10}
              step={0.1}
              onChange={(guidance) => patchGen({ guidance })}
            />
            <NumberField
              id="novelRescale"
              label="Guidance rescale"
              value={gen.guidanceRescale}
              min={0}
              max={1}
              step={0.05}
              onChange={(guidanceRescale) => patchGen({ guidanceRescale })}
            />
            <NumberField id="novelUc" label="UC preset" value={gen.ucPreset} min={0} max={4} onChange={(ucPreset) => patchGen({ ucPreset })} />
          </div>
          <p className="mt-1 text-xs text-muted">UC preset: 0 heavy, 1 light, 2 human focus, 3 none, 4 as in your setup.</p>

          <label htmlFor="promptPrefix" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
            Prompt prefix
          </label>
          <textarea
            id="promptPrefix"
            value={gen.promptPrefix}
            onChange={(event) => patchGen({ promptPrefix: event.target.value })}
            rows={2}
            placeholder="e.g. masterpiece, best quality"
            className="mt-1 min-h-16 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
          />
          <label htmlFor="negativePrefix" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
            Negative prefix
          </label>
          <textarea
            id="negativePrefix"
            value={gen.negativePrefix}
            onChange={(event) => patchGen({ negativePrefix: event.target.value })}
            rows={2}
            placeholder="e.g. low quality, blurry"
            className="mt-1 min-h-16 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
          />

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <TextField id="novelSampler" label="Sampler" value={gen.sampler} onChange={(sampler) => patchGen({ sampler })} />
            <TextField
              id="novelSchedule"
              label="Noise schedule"
              value={gen.noiseSchedule}
              onChange={(noiseSchedule) => patchGen({ noiseSchedule })}
            />
          </div>

          <div className="mt-3 rounded-md border border-border p-3">
            <label className="flex min-h-11 items-start gap-2 text-sm text-fg">
              <input
                type="checkbox"
                checked={gen.sizeFromCount}
                onChange={(event) => patchGen({ sizeFromCount: event.target.checked })}
                className="mt-1 size-4 accent-primary"
              />
              <span>
                <span className="font-semibold">Choose resolution from character count</span>
                <span className="mt-1 block text-xs text-muted">
                  Uses portrait for one subject, square for two, and landscape for three or more. Free-form prompts without a detectable count keep the requested size.
                </span>
              </span>
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <NumberField id="novelWidth" label="Width" value={gen.width} min={64} max={1600} step={64} onChange={(width) => patchGen({ width })} />
              <NumberField
                id="novelHeight"
                label="Height"
                value={gen.height}
                min={64}
                max={1600}
                step={64}
                onChange={(height) => patchGen({ height })}
              />
            </div>
          </div>

          <div className="mt-3 rounded-md border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-fg">NovelAI V4.5 style plate</p>
                <p className="mt-1 text-xs text-muted">
                  A persistent style-only reference applied first to every V4.5 generation, including scenes without characters.
                </p>
              </div>
              <label className="flex min-h-11 shrink-0 cursor-pointer items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-fg">
                <ImagePlus className="size-3.5" aria-hidden="true" />
                Choose image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void onPlate(file);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
            {plate ? (
              <div className="relative mt-3 w-24">
                <img src={plate} alt="" className="aspect-square w-full rounded-md object-cover" />
                <button
                  type="button"
                  aria-label="Remove style plate"
                  onClick={() => setPlate(null)}
                  className="absolute top-1 right-1 flex size-11 items-center justify-center"
                >
                  <span className="flex size-6 items-center justify-center rounded-md bg-bg">
                    <X className="size-3.5" aria-hidden="true" />
                  </span>
                </button>
              </div>
            ) : null}
            {v5 ? <p className="mt-2 text-xs text-muted">V5 does not take a style plate. Switch to V4.5 to use it.</p> : null}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <NumberField
                id="styleStrength"
                label="Style strength"
                value={gen.styleStrength}
                min={0}
                max={1}
                step={0.05}
                onChange={(styleStrength) => patchGen({ styleStrength })}
              />
              <NumberField
                id="styleFidelity"
                label="Style fidelity"
                value={gen.styleFidelity}
                min={0}
                max={1}
                step={0.05}
                onChange={(styleFidelity) => patchGen({ styleFidelity })}
              />
            </div>
          </div>
        </details>
      </section>
    </main>
    {viewer ? (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-black/92"
        role="dialog"
        aria-modal="true"
        aria-label="Generated picture"
        onClick={() => setViewer(null)}
      >
        <div className="flex flex-wrap items-center justify-end gap-2 p-3" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={() => void onSave(viewer)}
            className="flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg"
          >
            <Download className="size-4" aria-hidden="true" />
            Save
          </button>
          <button
            type="button"
            onClick={() => void putOnCard(viewer)}
            className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-fg"
          >
            <Star className="size-4 text-gold" aria-hidden="true" />
            Use on card
          </button>
          <button
            type="button"
            onClick={() => setViewer(null)}
            className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-fg"
          >
            <X className="size-4" aria-hidden="true" />
            Close
          </button>
        </div>
        <img src={viewer.dataUrl} alt={viewer.prompt} className="min-h-0 w-full flex-1 object-contain" onClick={(event) => event.stopPropagation()} />
      </div>
    ) : null}
    </>
  );
}

const inputClass = "mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg";

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold tracking-wide text-muted uppercase">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(event.target.value === "" ? min : Number(event.target.value))}
        className={inputClass}
      />
    </div>
  );
}

function TextField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold tracking-wide text-muted uppercase">
        {label}
      </label>
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} className={inputClass} />
    </div>
  );
}
