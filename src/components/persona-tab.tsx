import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Plus, RefreshCw, Save, Trash2, Upload } from "lucide-react";
import { ChatColors } from "@/components/chat-colors";
import { onCommand } from "@/lib/commands";
import { type StringField, slugName, tagsToText, textToTags, toCharacterCardV2, wordCount, cardFromUnknown } from "@/lib/card";
import { EMPTY_MEDIA, fileToImage, loadMedia, portraitOf, saveMedia, deleteMedia, type MediaRecord } from "@/lib/images";
import { DEFAULT_THEME } from "@/lib/look";
import { explainFetchError, generatePersona, rewriteField } from "@/lib/kobold";
import { buildCharacterPng, readCharacterPng } from "@/lib/png-card";
import { saveNamedFile } from "@/lib/save-file";
import { useStudio } from "@/lib/studio-store";

const FIELDS: { key: StringField; label: string; hint: string; rows: number }[] = [
  { key: "description", label: "Description", hint: "Who you are in the chat. Sent every turn.", rows: 6 },
  { key: "personality", label: "Personality", hint: "Temperament, habits, and how you speak.", rows: 4 },
  { key: "backstory", label: "Backstory", hint: "Origin and relationships that stay true.", rows: 4 },
  { key: "appearance", label: "Appearance", hint: "What the other character can see.", rows: 4 },
  { key: "scenario", label: "Scenario", hint: "The situation you usually walk into.", rows: 3 },
  { key: "mes_example", label: "Example dialogue", hint: "How you talk. Separate exchanges with <START>.", rows: 5 },
  { key: "creator_notes", label: "Creator notes", hint: "For you. Marinara does not send this.", rows: 3 },
];

const STARTERS = [
  { label: "Night nurse", text: "A night-shift nurse who still makes tea for whoever is awake, and never asks why they are." },
  { label: "Flood courier", text: "A courier in a flooded city who knows every shortcut and none of the headlines." },
  { label: "Quiet archivist", text: "A quiet archivist who answers questions with the exact page, and almost never with an opinion." },
];

function downloadBlob(filename: string, blob: Blob) {
  void saveNamedFile(filename, blob);
}

export function PersonaTab() {
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

  const [media, setMedia] = useState<MediaRecord>(EMPTY_MEDIA);
  const [mediaReady, setMediaReady] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const booted = useRef(false);
  const portrait = portraitOf(media);
  const locked = busy !== null;

  useEffect(() => {
    let cancel = false;
    const key = !booted.current ? (draftId ? `persona:${draftId}` : "persona-current") : draftId ? `persona:${draftId}` : null;
    booted.current = true;
    if (!key) {
      setMediaReady(true);
      return;
    }
    setMediaReady(false);
    void loadMedia(key).then((record) => {
      if (cancel) return;
      setMedia(record);
      setMediaReady(true);
    });
    return () => {
      cancel = true;
    };
  }, [draftId]);

  useEffect(() => {
    if (!mediaReady) return;
    void saveMedia("persona-current", media);
    if (draftId) void saveMedia(`persona:${draftId}`, media);
  }, [media, mediaReady, draftId]);

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

  async function onRewrite(field: StringField) {
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
    const id = savePersona();
    void saveMedia(`persona:${id}`, media);
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
    downloadBlob(
      `${slugName(persona.name)}-persona.json`,
      new Blob([JSON.stringify(toCharacterCardV2(persona), null, 2)], { type: "application/json" }),
    );
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

  function onImport(file: File) {
    const reader = new FileReader();
    const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    reader.onload = () => {
      try {
        if (isPng) {
          const parsed = readCharacterPng(new Uint8Array(reader.result as ArrayBuffer));
          useStudio.setState({ persona: cardFromUnknown(parsed), personaDraftId: null });
          void fileToImage(new File([file], file.name, { type: "image/png" })).then((image) => {
            setMedia({ images: [image], portraitId: image.id });
          });
        } else {
          useStudio.setState({
            persona: cardFromUnknown(JSON.parse(String(reader.result)) as unknown),
            personaDraftId: null,
          });
        }
        setNotice(`Loaded ${file.name}.`);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "That file is not a persona card.");
      }
    };
    if (isPng) reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  }

  const writeRef = useRef(onWrite);
  const keepRef = useRef(onKeep);
  const newRef = useRef(onNew);
  writeRef.current = onWrite;
  keepRef.current = onKeep;
  newRef.current = onNew;
  useEffect(() => {
    const stops = [
      onCommand("persona.write", () => void writeRef.current()),
      onCommand("persona.keep", () => keepRef.current()),
      onCommand("persona.new", () => newRef.current()),
    ];
    return () => stops.forEach((stop) => stop());
  }, []);

  return (
    <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
      <section className="flex flex-col gap-4">
        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Who you are</h2>
          <label className="sr-only" htmlFor="personaConcept">
            Persona concept
          </label>
          <textarea
            id="personaConcept"
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            rows={4}
            placeholder="A sentence about the person you play. Not the character you talk to."
            className="mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
          />
          <button
            type="button"
            disabled={locked}
            onClick={() => void onWrite()}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Write the persona
          </button>
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={fillBlanks}
              onChange={(event) => setFillBlanks(event.target.checked)}
              className="size-4 accent-primary"
            />
            Fill empty fields only
          </label>
          <div className="mt-3 flex flex-col gap-2">
            {STARTERS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => setConcept(sample.text)}
                className="min-h-11 rounded-md border border-border bg-surface-2 px-3 text-left text-sm text-fg"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Portrait</h2>
          <label className="mt-2 flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-bg px-3 py-3 text-center text-sm text-muted">
            <ImagePlus className="size-5 text-gold" aria-hidden="true" />
            <span>{portrait ? "Replace portrait" : "Add a portrait"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                void fileToImage(file)
                  .then((image) => setMedia({ images: [image], portraitId: image.id }))
                  .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not read that picture."));
              }}
            />
          </label>
          {portrait ? <img src={portrait.dataUrl} alt="" className="mt-3 aspect-square w-full rounded-md object-cover" /> : null}
        </section>

        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Saved personas</h2>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onKeep}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
            >
              <Save className="size-4" aria-hidden="true" />
              Keep
            </button>
            <button
              type="button"
              onClick={onNew}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
            >
              <Plus className="size-4" aria-hidden="true" />
              New
            </button>
          </div>
          {personas.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Kept personas stay on this computer.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {personas.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadPersona(item.id)}
                    className="min-h-11 flex-1 truncate rounded-md px-2 text-left text-sm text-fg"
                  >
                    {item.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => {
                      removePersona(item.id);
                      void deleteMedia(`persona:${item.id}`);
                    }}
                    className="flex size-11 items-center justify-center rounded-md text-muted"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <section className="flex flex-col gap-3">
        {error ? (
          <p role="alert" className="rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg">
            {error}
          </p>
        ) : null}
        {notice ? <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{notice}</p> : null}
        {busy ? <p className="text-sm text-gold">{busy}</p> : null}
        <div>
          <label htmlFor="personaName" className="text-xs font-semibold tracking-wide text-muted uppercase">
            Name
          </label>
          <input
            id="personaName"
            value={persona.name}
            onChange={(event) => patchPersona({ name: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg"
          />
        </div>
        <div>
          <label htmlFor="personaSummary" className="text-xs font-semibold tracking-wide text-muted uppercase">
            Summary
          </label>
          <input
            id="personaSummary"
            value={persona.summary}
            onChange={(event) => patchPersona({ summary: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg"
          />
        </div>
        <section className="rounded-lg border border-border bg-bg p-3">
          <h3 className="font-display text-lg font-semibold">Chat colors</h3>
          <p className="mt-1 text-xs text-muted">These colors travel with the persona and color your messages.</p>
          <div className="mt-3">
            <ChatColors look={persona.chatLook} theme={{ ...DEFAULT_THEME, ...theme }} name={persona.name} onChange={(chatLook) => patchPersona({ chatLook })} />
          </div>
          <label htmlFor="personaAliases" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
            Aliases
            <textarea
              id="personaAliases"
              value={persona.aliases ?? ""}
              rows={3}
              placeholder="Other names, one per line."
              onChange={(event) => patchPersona({ aliases: event.target.value })}
              className="mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg normal-case"
            />
          </label>
        </section>
        {FIELDS.map((field) => (
          <div key={field.key}>
            <div className="mb-1 flex items-end justify-between gap-2">
              <label htmlFor={`persona-${field.key}`} className="text-xs font-semibold tracking-wide text-muted uppercase">
                {field.label}
              </label>
              <button
                type="button"
                disabled={locked}
                onClick={() => void onRewrite(field.key)}
                className="min-h-11 shrink-0 rounded-md px-2 text-xs font-semibold text-gold disabled:opacity-60"
              >
                Rewrite
              </button>
            </div>
            <textarea
              id={`persona-${field.key}`}
              value={persona[field.key]}
              onChange={(event) => patchPersona({ [field.key]: event.target.value })}
              rows={field.rows}
              className="min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
            />
            <p className="mt-1 text-xs text-muted">
              {field.hint} · {wordCount(persona[field.key])} words
            </p>
          </div>
        ))}
        <div>
          <label htmlFor="personaTags" className="text-xs font-semibold tracking-wide text-muted uppercase">
            Tags
          </label>
          <input
            id="personaTags"
            value={tagsToText(persona.tags)}
            onChange={(event) => patchPersona({ tags: textToTags(event.target.value) })}
            className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg"
            placeholder="original, quiet, city"
          />
        </div>
        <div className="flex flex-wrap gap-2 pb-8">
          <button
            type="button"
            onClick={onExport}
            className="flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg"
          >
            <Download className="size-4" aria-hidden="true" />
            Download JSON
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={() => void onExportPng()}
            className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60"
          >
            <Download className="size-4" aria-hidden="true" />
            Download PNG
          </button>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg">
            <Upload className="size-4" aria-hidden="true" />
            Import
            <input
              type="file"
              accept="application/json,.json,image/png,.png"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImport(file);
                event.target.value = "";
              }}
            />
          </label>
        </div>
      </section>

      <aside className="lg:sticky lg:top-4 lg:self-start">
        <article className="rounded-lg bg-paper p-5 text-ink shadow-2xl">
          <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Persona</p>
          {portrait ? <img src={portrait.dataUrl} alt="" className="mt-3 aspect-square w-full rounded-md object-cover" /> : null}
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{persona.name.trim() || "Unnamed"}</h1>
          <p className="mt-2 text-sm text-ink-soft">{persona.summary.trim() || "No summary yet."}</p>
          <hr className="my-4 border-gold" />
          {persona.description.trim() ? <p className="text-sm whitespace-pre-wrap text-ink">{persona.description}</p> : null}
          {persona.tags.length > 0 ? <p className="mt-4 text-xs text-ink-soft">{persona.tags.join(" · ")}</p> : null}
        </article>
        <p className="mt-3 text-xs text-muted">
          A persona is the card for you. Marinara sends it so the other character knows who they are talking to. Use {"{{user}}"} for this name.
        </p>
      </aside>
    </main>
  );
}
