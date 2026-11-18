import { useEffect, useMemo, useState } from "react";
import { Bed, Briefcase, Camera, Clock, CookingPot, HandCoins, MapPin, MessageCircle, Moon, Pencil, Plus, Smartphone, Trash2, Utensils, UserPlus } from "lucide-react";
import { explainFetchError, askText } from "@/lib/kobold";
import { drawNovelPortrait, novelFailure, pngDataUrl } from "@/lib/novelai";
import { vaultDelete, vaultGet, vaultPut } from "@/lib/vault";
import { LifePhone } from "@/components/life-phone";
import {
  JOB_LIST,
  MODULE_NOTES,
  MODULES_OFF,
  ROLE_OPTIONS,
  addNpc,
  addShot,
  afterOuting,
  afterTalk,
  buyHome,
  buyRide,
  canCourt,
  canWork,
  clockLabel,
  cook,
  courtOffers,
  courtshipBrief,
  dateLabel,
  dismissScene,
  doFavour,
  eat,
  editScene,
  finishCourtship,
  hangoutFor,
  hoursLabel,
  localNpc,
  lookAround,
  needNote,
  normalizeLife,
  npcBrief,
  outingBrief,
  paperBrief,
  parseNpc,
  payDebt,
  peopleHere,
  picturePrompt,
  placeById,
  placesFor,
  plansToday,
  relationLabel,
  removeShot,
  replacePaper,
  rest,
  sceneBrief,
  seasonName,
  skyLabel,
  sleep,
  takeJob,
  travel,
  unreadCount,
  weekday,
  weeklyDue,
  workShift,
  type CardSketch,
  type CastRole,
  type Courtship,
  type JobKind,
  type Life,
  type LifeModules,
  type Resident,
} from "@/lib/life";
import { useLife } from "@/lib/life-store";
import { useStudio, type ShelfItem } from "@/lib/studio-store";

const primaryBtn =
  "flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60";
const quietBtn =
  "flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 text-sm font-semibold text-fg disabled:opacity-60";

export function LifeTab() {
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
  const [ready, setReady] = useState(false);
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    let cancel = false;
    void Promise.resolve(useLife.persist.rehydrate()).then(() => {
      if (!cancel) setReady(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const active = lives.find((life) => life.id === activeId) ?? null;

  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-muted">Opening Millbrook…</p>
      </main>
    );
  }

  if (drafting || !active) {
    return (
      <TownDesk
        lives={lives}
        shelf={shelf}
        personas={personas}
        editor={editorPersona.name.trim() ? editorPersona : null}
        drafting={drafting}
        onDraft={() => {
          close();
          setDrafting(true);
        }}
        onCancel={() => setDrafting(false)}
        onOpen={(id) => {
          setDrafting(false);
          open(id);
        }}
        onRemove={remove}
        onStart={(input) => {
          start(input);
          setDrafting(false);
        }}
      />
    );
  }

  return <Town life={active} shelf={shelf} onChange={replace} onLeave={close} />;
}

function TownDesk({
  lives,
  shelf,
  personas,
  editor,
  drafting,
  onDraft,
  onCancel,
  onOpen,
  onRemove,
  onStart,
}: {
  lives: Life[];
  shelf: ShelfItem[];
  personas: ShelfItem[];
  editor: { name: string; summary: string } | null;
  drafting: boolean;
  onDraft: () => void;
  onCancel: () => void;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onStart: (input: {
    title: string;
    playerName: string;
    playerNote: string;
    cast: (CardSketch & { role?: CastRole })[];
    money?: number;
    energy?: number;
    hunger?: number;
    season?: "Spring" | "Summer" | "Autumn" | "Winter";
    startJob?: JobKind | null;
    modules?: Partial<LifeModules>;
  }) => void;
}) {
  const choices = useMemo(() => {
    const saved = personas
      .filter((item) => item.card.name.trim())
      .map((item) => ({ id: item.id, name: item.card.name.trim(), note: item.card.summary }));
    if (!editor) return saved;
    return [{ id: "editor", name: editor.name.trim(), note: editor.summary }, ...saved.filter((item) => item.name !== editor.name.trim())];
  }, [editor, personas]);
  const [title, setTitle] = useState("Millbrook");
  const [personaId, setPersonaId] = useState(choices[0]?.id ?? "");
  const [playerName, setPlayerName] = useState(choices[0]?.name ?? "");
  const [playerNote, setPlayerNote] = useState(choices[0]?.note ?? "");
  const [picked, setPicked] = useState<string[]>([]);
  const [roles, setRoles] = useState<Record<string, CastRole>>({});
  const [season, setSeason] = useState<"Spring" | "Summer" | "Autumn" | "Winter">("Spring");
  const [money, setMoney] = useState("120");
  const [energy, setEnergy] = useState("80");
  const [hunger, setHunger] = useState("25");
  const [startJob, setStartJob] = useState<JobKind | "">("");
  const [modules, setModules] = useState<LifeModules>({ ...MODULES_OFF });
  const [armed, setArmed] = useState<string | null>(null);

  function choosePersona(id: string) {
    setPersonaId(id);
    const found = choices.find((item) => item.id === id);
    if (!found) return;
    setPlayerName(found.name);
    setPlayerNote(found.note);
  }

  function toggle(id: string) {
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
      return [
        {
          id: item.id,
          name: item.card.name,
          summary: item.card.summary,
          personality: item.card.personality,
          description: item.card.description,
          role: roles[id] ?? "town",
        },
      ];
    });
    const job = startJob || null;
    const nextModules = { ...modules, jobs: modules.jobs || (!!job && job !== "desk") };
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
      modules: nextModules,
    });
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold text-fg">Life in Millbrook</p>
          <p className="mt-1 max-w-xl text-sm text-muted">
            One town on a clock. Set the season, the money, and who starts as a friend or a partner. Modules stay off until you turn them on.
          </p>
        </div>
        {drafting ? (
          <button type="button" className={quietBtn} onClick={onCancel}>
            Back to lives
          </button>
        ) : (
          <button type="button" className={primaryBtn} onClick={onDraft}>
            <Plus className="size-4" aria-hidden="true" />
            New life
          </button>
        )}
      </header>

      {drafting ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-title">
              Name this life
              <input
                id="life-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-name">
              What the town calls you
              <input
                id="life-name"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Your name"
                className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
              />
            </label>
            {choices.length ? (
              <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-persona">
                Fill from a persona
                <select
                  id="life-persona"
                  value={personaId}
                  onChange={(event) => choosePersona(event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
                >
                  {choices.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="text-sm text-muted">No persona yet. A name is enough to start.</p>
            )}
            <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-note">
              One line about you
              <textarea
                id="life-note"
                value={playerNote}
                onChange={(event) => setPlayerNote(event.target.value)}
                rows={3}
                className="resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-season">
                Season
                <select
                  id="life-season"
                  value={season}
                  onChange={(event) => setSeason(event.target.value as typeof season)}
                  className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Autumn">Autumn</option>
                  <option value="Winter">Winter</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-job">
                Starting job
                <select
                  id="life-job"
                  value={startJob}
                  onChange={(event) => setStartJob(event.target.value as JobKind | "")}
                  className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg"
                >
                  <option value="">None yet</option>
                  {JOB_LIST.map((job) => (
                    <option key={job.kind} value={job.kind}>
                      {job.title} · ${job.wage}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-money">
                Money
                <input id="life-money" inputMode="numeric" value={money} onChange={(event) => setMoney(event.target.value)} className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-energy">
                Energy
                <input id="life-energy" inputMode="numeric" value={energy} onChange={(event) => setEnergy(event.target.value)} className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-fg" htmlFor="life-hunger">
                Hunger
                <input id="life-hunger" inputMode="numeric" value={hunger} onChange={(event) => setHunger(event.target.value)} className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg" />
              </label>
            </div>
            {startJob && startJob !== "desk" ? <p className="text-sm text-muted">That job turns on More jobs, so the board stays open.</p> : null}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-semibold text-fg">Modules, off unless you want them</legend>
              {MODULE_NOTES.map((note) => (
                <label key={note.key} className="flex min-h-11 items-start gap-3 rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={modules[note.key]}
                    onChange={(event) => setModules((current) => ({ ...current, [note.key]: event.target.checked }))}
                  />
                  <span>
                    <span className="block font-semibold">{note.label}</span>
                    <span className="block text-muted">{note.detail}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <button type="button" className={primaryBtn} disabled={!playerName.trim()} onClick={begin}>
              Start this life
            </button>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="text-sm font-semibold text-fg">Who lives here</h2>
            <p className="mt-1 text-sm text-muted">Up to six cards. Each one keeps a spot in town.</p>
            {shelf.length === 0 ? (
              <p className="mt-3 text-sm text-muted">The library is empty. You can still live here alone, or save a card first.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {shelf.map((item) => {
                  const name = item.card.name.trim() || "Untitled";
                  const on = picked.includes(item.id);
                  const slot = on ? picked.indexOf(item.id) : picked.length;
                  const hangout = placeById(hangoutFor(slot));
                  return (
                    <li key={item.id} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg">
                      <label className="flex min-h-11 items-center gap-3">
                        <input
                          type="checkbox"
                          checked={on}
                          disabled={!on && picked.length >= 6}
                          onChange={() => toggle(item.id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{name}</span>
                          <span className="block truncate text-muted">{on ? hangout.name : "Not in this life yet"}</span>
                        </span>
                      </label>
                      {on ? (
                        <select
                          aria-label={`Role for ${name}`}
                          value={roles[item.id] ?? "town"}
                          onChange={(event) => setRoles((current) => ({ ...current, [item.id]: event.target.value as CastRole }))}
                          className="mb-1 min-h-11 w-full rounded-md border border-border bg-surface px-2 text-sm font-normal text-fg"
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      ) : lives.length === 0 ? (
        <section className="rounded-lg border border-border bg-surface p-6">
          <p className="font-display text-xl text-fg">No lives yet.</p>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Start one with the persona on the Persona tab and whoever you want walking around Millbrook.
          </p>
        </section>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lives.map((life) => (
            <li key={life.id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
              <div>
                <p className="font-display text-xl text-fg">{life.title}</p>
                <p className="mt-1 text-sm text-muted">{life.playerName}</p>
                <p className="mt-2 text-sm text-fg">{dateLabel(life)}</p>
                <p className="text-sm text-muted">
                  ${life.money}
                  {life.debt ? ` · $${life.debt} owed` : ""} · {life.cast.length} {life.cast.length === 1 ? "person" : "people"}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <button type="button" className={primaryBtn} onClick={() => onOpen(life.id)}>
                  Continue
                </button>
                {armed === life.id ? (
                  <button type="button" className={quietBtn} onClick={() => onRemove(life.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete this life
                  </button>
                ) : (
                  <button type="button" className={quietBtn} onClick={() => setArmed(life.id)}>
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function Town({
  life: raw,
  shelf,
  onChange,
  onLeave,
}: {
  life: Life;
  shelf: ShelfItem[];
  onChange: (life: Life) => void;
  onLeave: () => void;
}) {
  const life = normalizeLife(raw);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [saying, setSaying] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState<null | "contacts" | "edit">(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [sceneDraft, setSceneDraft] = useState<string | null>(null);
  const place = placesFor(life).find((spot) => spot.id === life.place) ?? placeById(life.place);
  const here = peopleHere(life);
  const note = needNote(life.needs);
  const unread = unreadCount(life);
  const today = plansToday(life);
  const due = weeklyDue(life);
  const jobs = JOB_LIST.filter((job) => life.modules.jobs || job.kind === "desk");
  const rideSpot = life.modules.districts ? "garage" : "market";

  useEffect(() => {
    let cancel = false;
    void (async () => {
      const next: Record<string, string> = {};
      for (const shot of life.shots) {
        const saved = await vaultGet<{ dataUrl?: string }>("gallery", shot.id);
        if (saved?.dataUrl) next[shot.id] = saved.dataUrl;
      }
      if (!cancel) setImages(next);
    })();
    return () => {
      cancel = true;
    };
  }, [life.shots]);

  function commit(step: { life?: Life; error?: string }) {
    if (!step.life) {
      setError(step.error ?? "That didn't happen.");
      return;
    }
    setError(null);
    onChange(step.life);
  }

  async function keepPicture(base: Life, withName: string | null, caption: string) {
    const made = addShot(base, caption, withName);
    const current = useLife.getState().lives.find((item) => item.id === base.id) ?? made.life;
    const merged = current.shots.some((shot) => shot.id === made.shot.id)
      ? current
      : { ...current, shots: [...current.shots, made.shot].slice(-24) };
    useLife.getState().replace(merged);
    const settings = useStudio.getState().settings;
    const token = settings.novelToken?.trim() ?? "";
    if (token.length < 8) return;
    try {
      const card = shelf.find((item) => item.card.name.trim() === withName);
      const appearance = card ? [card.card.appearance, card.card.description].filter(Boolean).join(", ") : "";
      const bytes = await drawNovelPortrait(
        token,
        picturePrompt(merged, made.shot, appearance),
        settings.novelModel || "nai-diffusion-4-5-full",
        settings.novelGen,
        useStudio.getState().stylePlate,
      );
      const dataUrl = pngDataUrl(bytes);
      await vaultPut("gallery", made.shot.id, { id: made.shot.id, name: made.shot.caption, prompt: caption, dataUrl, updatedAt: Date.now() });
      setImages((prev) => ({ ...prev, [made.shot.id]: dataUrl }));
    } catch (err) {
      setError(novelFailure(err));
    }
  }

  async function runScene(person: Resident, kind?: Courtship, outing = false) {
    const line = saying[person.id] ?? "";
    if (kind && canCourt(life, person.id, kind)) {
      setError(canCourt(life, person.id, kind));
      return;
    }
    setBusy(kind ? `${person.id}:${kind}` : outing ? `${person.id}:outing` : person.id);
    setError(null);
    try {
      const fresh = shelf.find((item) => item.id === person.id);
      const withCard: Resident = fresh
        ? {
            ...person,
            name: fresh.card.name.trim() || person.name,
            summary: fresh.card.summary || person.summary,
            personality: fresh.card.personality || person.personality,
            description: fresh.card.description || person.description,
          }
        : person;
      const brief = kind ? courtshipBrief(life, withCard, kind, line) : outing ? outingBrief(life, withCard, line) : sceneBrief(life, withCard, line);
      const text = await askText(useStudio.getState().settings, brief.system, brief.user, 380);
      const step = kind
        ? finishCourtship(life, person.id, kind, line, text)
        : { life: outing ? afterOuting(life, person.id, line, text) : afterTalk(life, person.id, line, text) };
      if (!step.life) {
        setError(step.error ?? "That didn't happen.");
        return;
      }
      onChange(step.life);
      setSaying((current) => ({ ...current, [person.id]: "" }));
      setSceneDraft(null);
      if (step.life.paintScenes && step.life.scene) void keepPicture(step.life, step.life.sceneWith, step.life.scene);
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
      let card: CardSketch | null = null;
      try {
        const brief = npcBrief(life);
        const text = await askText(useStudio.getState().settings, brief.system, brief.user, 120);
        card = parseNpc(text);
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

  async function rewritePaper(day: number) {
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

  return (
    <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="flex flex-col gap-4">
        <section className="rounded-lg border border-border bg-surface p-4">
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4 text-gold" aria-hidden="true" />
            {life.title}
          </p>
          <p className="mt-2 font-display text-3xl text-fg">{weekday(life.day)}</p>
          <p className="font-display text-xl text-gold">
            Day {life.day} · {seasonName(life.day)} · {clockLabel(life.minute)}
          </p>
          {life.modules.weather ? <p className="mt-1 text-sm text-fg">{skyLabel(life.day)}</p> : null}
          <p className="mt-3 text-sm text-fg">
            ${life.money}
            {life.debt ? <span className="text-primary"> · ${life.debt} owed</span> : null}
          </p>
          <p className="mt-1 text-sm text-muted">
            {life.job ? `${life.job.title} · $${life.job.wage} a shift` : "No job yet"}
            {life.job && life.workedDay === life.day ? " · done today" : ""}
          </p>
          <p className="mt-1 text-sm text-muted">
            {life.home === "apartment" ? "Apartment" : life.home === "cottage" ? "Cottage" : "Townhouse"}
            {" · "}
            {life.vehicle === "car" ? "Car" : life.vehicle === "bike" ? "Bike" : "On foot"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {due > 0 ? `The week takes $${due} on day ${life.rentDay}` : "You own the place. Rent has stopped."}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <button type="button" className={`${quietBtn} w-full`} onClick={() => setPhone("contacts")}>
              <Smartphone className="size-4" aria-hidden="true" />
              Phone{unread > 0 ? ` · ${unread}` : ""}
            </button>
            <button type="button" className={`${quietBtn} w-full`} onClick={() => setPhone("edit")}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit this life
            </button>
          </div>
        </section>
        <section className="rounded-lg border border-border bg-surface p-4">
          <Meter label="Energy" value={life.needs.energy} tone="gold" />
          <div className="mt-3">
            <Meter label="Hunger" value={life.needs.hunger} tone="primary" />
          </div>
          {note ? <p className="mt-3 text-sm text-primary">{note}</p> : null}
        </section>
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-fg">Town</h2>
          <div className="mt-3 flex flex-col gap-2">
            {placesFor(life).map((spot) => (
              <button
                key={spot.id}
                type="button"
                aria-pressed={spot.id === life.place}
                disabled={busy !== null}
                onClick={() => commit(travel(life, spot.id))}
                className={`flex min-h-11 items-center justify-between gap-2 rounded-md px-3 text-left text-sm ${
                  spot.id === life.place ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{spot.name}</span>
                </span>
                <span className={`shrink-0 text-xs ${spot.id === life.place ? "text-primary-fg" : "text-muted"}`}>{hoursLabel(spot)}</span>
              </button>
            ))}
          </div>
          <button type="button" className={`${quietBtn} mt-3 w-full`} onClick={onLeave}>
            Back to lives
          </button>
        </section>
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="font-display text-2xl text-fg">{place.name}</h2>
          <p className="mt-1 text-sm text-muted">{place.blurb}</p>
          {life.modules.calendar && today.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-1 text-sm text-fg">
              {today.map((plan) => {
                const who = life.cast.find((person) => person.id === plan.withId);
                return (
                  <li key={plan.id}>
                    Today · {placeById(plan.place).name}
                    {who ? ` with ${who.name}` : ""}
                    {plan.note ? ` · ${plan.note}` : ""}
                  </li>
                );
              })}
            </ul>
          ) : null}
          {error ? (
            <p className="mt-3 text-sm text-primary" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit({ life: lookAround(life) })}>
              Look around
            </button>
            {life.place === "home" || life.place === "cafe" || life.place === "market" || life.place === "diner" ? (
              <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(eat(life))}>
                <Utensils className="size-4" aria-hidden="true" />
                Eat
              </button>
            ) : null}
            {life.place === "home" && life.modules.cooking ? (
              <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(cook(life))}>
                <CookingPot className="size-4" aria-hidden="true" />
                Cook · $6
              </button>
            ) : null}
            {life.place === "home" && life.debt > 0 ? (
              <button
                type="button"
                className={quietBtn}
                disabled={busy !== null || life.money <= 0}
                onClick={() => commit(payDebt(life, Math.min(40, life.money, life.debt)))}
              >
                <HandCoins className="size-4" aria-hidden="true" />
                Pay ${Math.min(40, life.money, life.debt)} on the tab
              </button>
            ) : null}
            {life.place === "park" ? (
              <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(rest(life))}>
                <Moon className="size-4" aria-hidden="true" />
                Sit a while
              </button>
            ) : null}
            {life.place === "home" ? (
              <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit({ life: sleep(life) })}>
                <Bed className="size-4" aria-hidden="true" />
                Sleep
              </button>
            ) : null}
            {life.place === "office" ? (
              <div className="flex w-full flex-col gap-2">
                <p className="text-sm font-semibold text-fg">Job board</p>
                {jobs.map((job) => (
                  <button
                    key={job.kind}
                    type="button"
                    className={life.job?.kind === job.kind ? primaryBtn : quietBtn}
                    disabled={busy !== null || life.job?.kind === job.kind}
                    onClick={() => commit(takeJob(life, job.kind))}
                  >
                    <Briefcase className="size-4" aria-hidden="true" />
                    {life.job?.kind === job.kind ? `${job.title} · yours` : `${job.title} · $${job.wage}`}
                  </button>
                ))}
                {life.job ? (
                  <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(takeJob(life, null))}>
                    Quit
                  </button>
                ) : null}
              </div>
            ) : null}
            {life.place === rideSpot ? (
              <>
                {life.vehicle !== "bike" ? (
                  <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(buyRide(life, "bike"))}>
                    Buy a bike · $80
                  </button>
                ) : null}
                {life.vehicle !== "car" ? (
                  <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(buyRide(life, "car"))}>
                    Buy a used car · $400
                  </button>
                ) : null}
              </>
            ) : null}
            {life.modules.homes && (life.place === "hillcrest" || life.place === "home") ? (
              <>
                {life.home !== "cottage" ? (
                  <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(buyHome(life, "cottage"))}>
                    Buy a cottage · $800
                  </button>
                ) : null}
                {life.home !== "townhouse" ? (
                  <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => commit(buyHome(life, "townhouse"))}>
                    Buy a townhouse · $1400
                  </button>
                ) : null}
              </>
            ) : null}
            {canWork(life) ? (
              <button type="button" className={primaryBtn} disabled={busy !== null} onClick={() => commit(workShift(life))}>
                <Briefcase className="size-4" aria-hidden="true" />
                Work the shift
              </button>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-fg">Here now</h2>
            {life.modules.npcs && life.cast.length < 8 ? (
              <button type="button" className={quietBtn} disabled={busy !== null} onClick={() => void meetSomeone()}>
                <UserPlus className="size-4" aria-hidden="true" />
                {busy === "npc" ? "Someone is arriving…" : "Meet someone"}
              </button>
            ) : null}
          </div>
          {here.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              {life.cast.length === 0
                ? "Nobody from your library is in this life."
                : "None of your people are here. Check the town list, then walk to where they keep."}
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {here.map((person) => (
                <li key={person.id} className="rounded-md border border-border bg-bg p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-fg">{person.name}</p>
                    <p className="text-sm text-gold">{relationLabel(person)} · {person.bond}</p>
                  </div>
                  {person.summary ? <p className="mt-1 text-sm text-muted">{person.summary}</p> : null}
                  <label className="mt-3 flex flex-col gap-2 text-sm text-muted" htmlFor={`say-${person.id}`}>
                    What you do or say
                    <textarea
                      id={`say-${person.id}`}
                      value={saying[person.id] ?? ""}
                      onChange={(event) => setSaying((current) => ({ ...current, [person.id]: event.target.value }))}
                      rows={2}
                      placeholder="Leave this blank to just sit with them."
                      className="resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
                    />
                  </label>
                  <button
                    type="button"
                    className={`${primaryBtn} mt-3`}
                    disabled={busy !== null}
                    onClick={() => void runScene(person)}
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    {busy === person.id ? "Writing the scene…" : "Spend the scene"}
                  </button>
                  {life.modules.calendar ? (
                    <button type="button" className={`${quietBtn} mt-2`} disabled={busy !== null} onClick={() => void runScene(person, undefined, true)}>
                      {busy === `${person.id}:outing` ? "Writing the outing…" : "A longer outing"}
                    </button>
                  ) : null}
                  <button type="button" className={`${quietBtn} mt-2`} disabled={busy !== null} onClick={() => commit(doFavour(life, person.id))}>
                    Do a favour · $10
                  </button>
                  <div className="mt-2 flex flex-col gap-2">
                    {courtOffers(life, person).map((offer) =>
                      offer.blocked ? (
                        <p key={offer.kind} className="text-sm text-muted">
                          {offer.blocked}
                        </p>
                      ) : (
                        <button
                          key={offer.kind}
                          type="button"
                          className={quietBtn}
                          disabled={busy !== null}
                          onClick={() => void runScene(person, offer.kind)}
                        >
                          {busy === `${person.id}:${offer.kind}` ? "Writing the scene…" : offer.label}
                        </button>
                      ),
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {life.cast.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-1 text-sm text-muted">
              {life.cast.map((person) => (
                <li key={person.id}>
                  {person.name} keeps to {placeById(person.hangout).name}
                  {person.movedIn ? ", and lives with you" : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {life.scene ? (
          <section className="rounded-lg bg-paper p-5 text-ink" aria-live="polite">
            <p className="text-sm font-semibold text-ink-soft">{life.sceneWith ? `With ${life.sceneWith}` : "Scene"}</p>
            {sceneDraft === null ? <div className="mt-3 whitespace-pre-wrap font-display text-lg leading-relaxed">{life.scene}</div> : null}
            {sceneDraft !== null ? (
              <textarea
                aria-label="Scene text"
                value={sceneDraft}
                onChange={(event) => setSceneDraft(event.target.value)}
                rows={6}
                className="mt-3 w-full resize-y rounded-md border border-ink bg-paper px-3 py-2 text-sm text-ink"
              />
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-60"
                disabled={busy !== null}
                onClick={() => void keepPicture(life, life.sceneWith, life.scene ?? place.name)}
              >
                <Camera className="size-4" aria-hidden="true" />
                Take a picture
              </button>
              {sceneDraft === null ? (
                <button type="button" className="min-h-11 rounded-md border border-ink px-4 text-sm font-semibold text-ink" onClick={() => setSceneDraft(life.scene ?? "")}>
                  Edit the scene
                </button>
              ) : (
                <button
                  type="button"
                  className="min-h-11 rounded-md border border-ink px-4 text-sm font-semibold text-ink"
                  onClick={() => {
                    onChange(editScene(life, sceneDraft));
                    setSceneDraft(null);
                  }}
                >
                  Save the scene
                </button>
              )}
              <button type="button" className="min-h-11 rounded-md border border-ink px-4 text-sm font-semibold text-ink" onClick={() => onChange(dismissScene(life))}>
                Close the scene
              </button>
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold text-fg">Today so far</h2>
          <ol className="mt-3 flex flex-col gap-2">
            {[...life.log].reverse().slice(0, 8).map((entry, index) => (
              <li key={`${entry.day}-${entry.minute}-${index}`} className="text-sm text-muted">
                <span className="text-fg">Day {entry.day}</span> · {entry.text}
              </li>
            ))}
          </ol>
        </section>
      </div>
      {phone ? (
        <LifePhone
          life={life}
          images={images}
          cards={shelf.map((item) => ({ id: item.id, name: item.card.name, summary: item.card.summary, personality: item.card.personality }))}
          initial={phone}
          busy={busy !== null}
          onChange={(next) => {
            setSceneDraft(null);
            onChange(next);
          }}
          onClose={() => setPhone(null)}
          onDeleteShot={(id) => {
            onChange(removeShot(life, id));
            setImages((current) => {
              const next = { ...current };
              delete next[id];
              return next;
            });
            void vaultDelete("gallery", id);
          }}
          onRewrite={(day) => void rewritePaper(day)}
        />
      ) : null}
    </main>
  );
}

function Meter({ label, value, tone }: { label: string; value: number; tone: "gold" | "primary" }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="text-fg">{Math.round(width)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg">
        <div className={tone === "gold" ? "h-full bg-gold" : "h-full bg-primary"} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
