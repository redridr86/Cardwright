import { useRef, useState } from "react";
import { Check, Download, Star, Trash2, Upload } from "lucide-react";
import { LibraryLocation } from "@/components/library-location";
import { parseMarinaraPreset, starterPreset, toMarinaraFile, type MarinaraPreset, type PresetSection } from "@/lib/preset";
import { useStudio } from "@/lib/studio-store";
import { deletePresetRecord, savePresetRecord } from "@/lib/vault";

export function PresetTab() {
  const presets = useStudio((state) => state.presets);
  const activePresetId = useStudio((state) => state.activePresetId);
  const upsertPreset = useStudio((state) => state.upsertPreset);
  const removePreset = useStudio((state) => state.removePreset);
  const setActivePreset = useStudio((state) => state.setActivePreset);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const selected = presets.find((preset) => preset.id === (selectedId ?? activePresetId ?? presets[0]?.id)) ?? null;

  async function persist(next: MarinaraPreset) {
    upsertPreset(next);
    setSelectedId(next.id);
    await savePresetRecord(next);
  }

  async function onImport(file: File) {
    setError(null);
    try {
      const preset = parseMarinaraPreset(JSON.parse(await file.text()) as unknown);
      const unique = presets.some((item) => item.id === preset.id) ? { ...preset, id: crypto.randomUUID() } : preset;
      await persist(unique);
      setActivePreset(unique.id);
      setNotice(`${unique.name} is imported and active for chat. Disabled sections stay off.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That file is not a Marinara preset.");
    }
  }

  function patch(preset: MarinaraPreset, recipe: (current: MarinaraPreset) => MarinaraPreset) {
    const next = recipe(preset);
    void persist(next).catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not save that preset."));
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
      <LibraryLocation />
      {error ? (
        <p role="alert" className="rounded-md border border-primary bg-surface px-3 py-2 text-sm text-fg">
          {error}
        </p>
      ) : null}
      {notice ? <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{notice}</p> : null}
      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <section className="rounded-lg border border-border bg-surface p-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg"
            >
              <Upload className="size-4" aria-hidden="true" />
              Import
            </button>
            <button
              type="button"
              onClick={() => {
                const preset = { ...starterPreset(), id: crypto.randomUUID(), name: "New preset" };
                void persist(preset);
                setNotice("New preset saved. It is not active until you use it in chat.");
              }}
              className="min-h-11 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
            >
              New
            </button>
          </div>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json,.marinara.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onImport(file);
              event.target.value = "";
            }}
          />
          <ul className="mt-3 flex flex-col gap-2">
            {presets.map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  aria-pressed={selected?.id === preset.id}
                  onClick={() => setSelectedId(preset.id)}
                  className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-3 text-left text-sm ${selected?.id === preset.id ? "bg-surface-2 text-fg" : "text-fg hover:bg-surface-2"}`}
                >
                  <span className="truncate">{preset.name}</span>
                  {activePresetId === preset.id ? <Star className="size-4 shrink-0 text-gold" aria-label="Active" /> : null}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Chat keeps the simple prompt until a preset is marked active.</p>
        </section>
        {selected ? (
          <PresetEditor
            preset={selected}
            active={activePresetId === selected.id}
            onChange={(recipe) => patch(selected, recipe)}
            onActive={(active) => {
              setActivePreset(active ? selected.id : null);
              setNotice(active ? `${selected.name} is the chat preset.` : "Chat is back on the simple prompt.");
            }}
            onDelete={() => {
              void deletePresetRecord(selected.id);
              removePreset(selected.id);
              setSelectedId(null);
              setNotice("Preset removed from the library.");
            }}
          />
        ) : (
          <p className="rounded-lg border border-border bg-surface px-4 py-8 text-sm text-muted">Import a Marinara preset, or start a new one.</p>
        )}
      </div>
    </main>
  );
}

function PresetEditor({
  preset,
  active,
  onChange,
  onActive,
  onDelete,
}: {
  preset: MarinaraPreset;
  active: boolean;
  onChange: (recipe: (current: MarinaraPreset) => MarinaraPreset) => void;
  onActive: (active: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <section className="rounded-lg border border-border bg-surface p-3">
        <label htmlFor="presetName" className="text-xs font-semibold tracking-wide text-muted uppercase">
          Name
        </label>
        <input
          id="presetName"
          value={preset.name}
          onChange={(event) => onChange((current) => ({ ...current, name: event.target.value }))}
          className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
        />
        <label htmlFor="presetDescription" className="mt-3 block text-xs font-semibold tracking-wide text-muted uppercase">
          Notes
        </label>
        <textarea
          id="presetDescription"
          value={preset.description}
          onChange={(event) => onChange((current) => ({ ...current, description: event.target.value }))}
          rows={3}
          className="mt-1 min-h-20 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={active}
            onClick={() => onActive(!active)}
            className={`flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold ${active ? "bg-primary text-primary-fg" : "border border-border bg-surface-2 text-fg"}`}
          >
            <Check className="size-4" aria-hidden="true" />
            {active ? "Active for chat" : "Use for chat"}
          </button>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(toMarinaraFile(preset), null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = `${preset.name.replace(/[^\w.-]+/g, "-").replace(/^-|-$/g, "") || "preset"}.marinara.json`;
              anchor.click();
              URL.revokeObjectURL(url);
            }}
            className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
          >
            <Download className="size-4" aria-hidden="true" />
            Export
          </button>
          <button type="button" onClick={onDelete} className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-muted">
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      </section>
      {preset.choices.length > 0 ? (
        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Choices</h2>
          <div className="mt-3 flex flex-col gap-4">
            {preset.choices.map((choice) => (
              <fieldset key={choice.id} className="min-w-0">
                <legend className="text-xs font-semibold tracking-wide text-muted uppercase">{choice.question}</legend>
                {choice.multiSelect ? (
                  <div className="mt-2 flex flex-col gap-2">
                    {choice.options.map((option) => {
                      const selected = Array.isArray(preset.values[choice.variableName])
                        ? (preset.values[choice.variableName] as string[])
                        : [];
                      const on = selected.includes(option.value) || selected.includes(option.id);
                      return (
                        <label key={option.id} className="flex min-h-11 items-start gap-2 text-sm text-fg">
                          <input
                            type="checkbox"
                            className="mt-1 size-4"
                            checked={on}
                            onChange={() =>
                              onChange((current) => {
                                const previous = Array.isArray(current.values[choice.variableName])
                                  ? [...(current.values[choice.variableName] as string[])]
                                  : [];
                                const values = on ? previous.filter((item) => item !== option.value && item !== option.id) : [...previous, option.value];
                                return { ...current, values: { ...current.values, [choice.variableName]: values } };
                              })
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <select
                    value={typeof preset.values[choice.variableName] === "string" ? (preset.values[choice.variableName] as string) : (choice.options[0]?.value ?? "")}
                    onChange={(event) =>
                      onChange((current) => ({ ...current, values: { ...current.values, [choice.variableName]: event.target.value } }))
                    }
                    className="mt-2 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
                  >
                    {choice.options.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </fieldset>
            ))}
          </div>
        </section>
      ) : null}
      {preset.groups.length > 0 ? (
        <section className="rounded-lg border border-border bg-surface p-3">
          <h2 className="font-display text-lg font-semibold text-fg">Groups</h2>
          <div className="mt-2 flex flex-col gap-2">
            {preset.groups.map((group) => (
              <label key={group.id} className="flex min-h-11 items-center gap-2 text-sm text-fg">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={group.enabled}
                  onChange={() =>
                    onChange((current) => ({
                      ...current,
                      groups: current.groups.map((item) => (item.id === group.id ? { ...item, enabled: !item.enabled } : item)),
                    }))
                  }
                />
                {group.name}
              </label>
            ))}
          </div>
        </section>
      ) : null}
      <section className="rounded-lg border border-border bg-surface p-3">
        <h2 className="font-display text-lg font-semibold text-fg">Sections</h2>
        <p className="mt-1 text-sm text-muted">Off sections are left out of the prompt, including markers for the card, persona, and chat.</p>
        <ul className="mt-3 flex flex-col gap-3">
          {preset.sections.map((section) => (
            <SectionRow key={section.id} section={section} onChange={onChange} />
          ))}
        </ul>
      </section>
    </section>
  );
}

function SectionRow({ section, onChange }: { section: PresetSection; onChange: (recipe: (current: MarinaraPreset) => MarinaraPreset) => void }) {
  function update(patch: Partial<PresetSection>) {
    onChange((current) => ({
      ...current,
      sections: current.sections.map((item) => (item.id === section.id ? { ...item, ...patch } : item)),
    }));
  }

  return (
    <li className="rounded-md border border-border bg-bg p-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-fg">
          <input type="checkbox" className="size-4" checked={section.enabled} onChange={() => update({ enabled: !section.enabled })} />
          {section.name}
        </label>
        <span className="text-xs text-muted">
          {section.markerType ? section.markerType.replaceAll("_", " ") : section.role}
          {section.injectionPosition === "depth" ? ` · depth ${section.injectionDepth}` : ""}
        </span>
      </div>
      {section.isMarker ? (
        <p className="mt-1 text-xs text-muted">Filled from the card, persona, or chat when this section is on.</p>
      ) : (
        <textarea
          value={section.content}
          onChange={(event) => update({ content: event.target.value })}
          rows={4}
          aria-label={`${section.name} text`}
          className="mt-2 min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
        />
      )}
    </li>
  );
}
