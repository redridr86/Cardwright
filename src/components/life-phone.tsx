import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, CalendarDays, ImageIcon, Newspaper, Pencil, Smartphone, Users, X } from "lucide-react";
import {
  addPlan,
  clockLabel,
  editLife,
  editResident,
  editScene,
  guideFor,
  markNewsRead,
  markTextsRead,
  placeById,
  placesFor,
  RELATION_OPTIONS,
  relationLabel,
  removePlan,
  ROLE_OPTIONS,
  seasonName,
  setPaintScenes,
  TRAIT_OPTIONS,
  weekday,
  type CastRole,
  type HomeKind,
  type Life,
  type LifeShot,
  type Place,
  type PlaceId,
  type Relation,
  type Resident,
  type Trait,
  type Vehicle,
  MODULE_NOTES,
} from "@/lib/life";

const quietBtn =
  "flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg disabled:opacity-60";
const primaryBtn =
  "flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60";
const field = "min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm font-normal text-fg";

type AppId = "contacts" | "news" | "guide" | "pictures" | "edit" | "calendar";

export type LifeCardRef = { id: string; name: string; summary: string; personality: string };

export function LifePhone({
  life,
  images,
  busy,
  cards,
  initial = "contacts",
  onChange,
  onClose,
  onDeleteShot,
  onRewrite,
}: {
  life: Life;
  images: Record<string, string>;
  busy: boolean;
  cards: LifeCardRef[];
  initial?: AppId;
  onChange: (life: Life) => void;
  onClose: () => void;
  onDeleteShot: (id: string) => void;
  onRewrite: (day: number) => void;
}) {
  const [app, setApp] = useState<AppId>(initial);
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState<LifeShot | null>(null);
  const paper = life.papers[life.papers.length - 1] ?? null;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (zoom) setZoom(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, zoom]);

  function openApp(next: AppId) {
    setApp(next);
    if (next === "news") onChange(markNewsRead(life));
    if (next === "contacts") onChange(markTextsRead(life));
  }

  const guide = guideFor(life).filter((entry) => `${entry.title} ${entry.body}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-bg/80 p-3 sm:items-center" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Phone"
        className="flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-surface text-fg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="flex items-center gap-2 font-display text-xl">
            <Smartphone className="size-5 text-gold" aria-hidden="true" />
            Phone
          </p>
          <button type="button" className={quietBtn} onClick={onClose} aria-label="Close phone">
            <X className="size-4" aria-hidden="true" />
            Close
          </button>
        </header>
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          <AppButton current={app} id="contacts" label="Contacts" icon={<Users className="size-4" aria-hidden="true" />} onOpen={openApp} />
          <AppButton current={app} id="news" label="News" icon={<Newspaper className="size-4" aria-hidden="true" />} onOpen={openApp} />
          <AppButton current={app} id="guide" label="Guide" icon={<BookOpen className="size-4" aria-hidden="true" />} onOpen={openApp} />
          <AppButton current={app} id="pictures" label="Pictures" icon={<ImageIcon className="size-4" aria-hidden="true" />} onOpen={openApp} />
          <AppButton current={app} id="edit" label="Edit" icon={<Pencil className="size-4" aria-hidden="true" />} onOpen={openApp} />
          {life.modules.calendar ? (
            <AppButton current={app} id="calendar" label="Calendar" icon={<CalendarDays className="size-4" aria-hidden="true" />} onOpen={openApp} />
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {app === "contacts" ? <Contacts life={life} /> : null}
          {app === "news" ? <News life={life} paper={paper} busy={busy} onRewrite={() => paper && onRewrite(paper.day)} /> : null}
          {app === "guide" ? (
            <div className="flex flex-col gap-3">
              <label className="sr-only" htmlFor="life-guide">
                Search the guide
              </label>
              <input
                id="life-guide"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the guide"
                className={field}
              />
              {guide.map((entry) => (
                <article key={entry.title} className="rounded-md border border-border bg-bg p-3">
                  <h3 className="text-sm font-semibold">{entry.title}</h3>
                  <p className="mt-1 text-sm text-muted">{entry.body}</p>
                </article>
              ))}
              {guide.length === 0 ? <p className="text-sm text-muted">Nothing in the guide matches that.</p> : null}
            </div>
          ) : null}
          {app === "pictures" ? (
            <Pictures
              life={life}
              images={images}
              busy={busy}
              onPaint={(paint) => onChange(setPaintScenes(life, paint))}
              onZoom={setZoom}
              onDelete={onDeleteShot}
            />
          ) : null}
          {app === "edit" ? <EditApp life={life} cards={cards} onChange={onChange} /> : null}
          {app === "calendar" && life.modules.calendar ? <CalendarApp life={life} onChange={onChange} /> : null}
        </div>
      </section>
      {zoom ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-bg/90 p-4"
          role="presentation"
          onMouseDown={(event) => {
            event.stopPropagation();
            setZoom(null);
          }}
        >
          <figure className="max-h-full max-w-3xl" onMouseDown={(event) => event.stopPropagation()}>
            {images[zoom.id] ? (
              <img src={images[zoom.id]} alt={zoom.caption} className="max-h-[75dvh] w-full rounded-md object-contain" />
            ) : (
              <Printed shot={zoom} />
            )}
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-fg">
              <span>
                Day {zoom.day} · {zoom.caption}
              </span>
              <button type="button" className={quietBtn} onClick={() => setZoom(null)}>
                Close picture
              </button>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}

function AppButton({
  current,
  id,
  label,
  icon,
  onOpen,
}: {
  current: AppId;
  id: AppId;
  label: string;
  icon: ReactNode;
  onOpen: (id: AppId) => void;
}) {
  const on = current === id;
  return (
    <button
      type="button"
      aria-pressed={on}
      className={`flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold ${on ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"}`}
      onClick={() => onOpen(id)}
    >
      {icon}
      {label}
    </button>
  );
}

function EditApp({ life, cards, onChange }: { life: Life; cards: LifeCardRef[]; onChange: (life: Life) => void }) {
  const [personId, setPersonId] = useState(life.cast[0]?.id ?? "");
  const person = life.cast.find((item) => item.id === personId) ?? life.cast[0] ?? null;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">Edits apply to this life. Buying a home or a ride in town is separate, and costs money.</p>
      <YouFields life={life} onChange={onChange} />
      <ClockFields life={life} onChange={onChange} />
      <HomeFields life={life} onChange={onChange} />
      <fieldset className="flex flex-col gap-2 rounded-md border border-border p-3">
        <legend className="px-1 text-sm font-semibold">Modules</legend>
        {MODULE_NOTES.map((note) => (
          <label key={note.key} className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={life.modules[note.key]}
              onChange={(event) => onChange(editLife(life, { modules: { [note.key]: event.target.checked } }))}
            />
            <span>
              <span className="block font-semibold">{note.label}</span>
              <span className="block text-muted">{note.detail}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <section className="flex flex-col gap-3 rounded-md border border-border p-3">
        <h3 className="text-sm font-semibold">People</h3>
        {life.cast.length === 0 ? <p className="text-sm text-muted">Nobody to edit yet.</p> : null}
        {life.cast.length > 0 ? (
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="life-edit-person">
            Who
            <select id="life-edit-person" className={field} value={person?.id ?? ""} onChange={(event) => setPersonId(event.target.value)}>
              {life.cast.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {person ? (
          <PersonFields
            key={person.id}
            person={person}
            card={cards.find((item) => item.id === person.id) ?? null}
            places={placesFor(life)}
            onSave={(patch) => onChange(editResident(life, person.id, patch))}
          />
        ) : null}
      </section>
      {life.scene ? (
        <SceneFields life={life} onChange={onChange} />
      ) : (
        <p className="text-sm text-muted">An open scene can be rewritten here, or on the page.</p>
      )}
    </div>
  );
}

function YouFields({ life, onChange }: { life: Life; onChange: (life: Life) => void }) {
  const [title, setTitle] = useState(life.title);
  const [playerName, setPlayerName] = useState(life.playerName);
  const [playerNote, setPlayerNote] = useState(life.playerNote);
  return (
    <section className="flex flex-col gap-3 rounded-md border border-border p-3">
      <h3 className="text-sm font-semibold">You</h3>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-edit-title">
        Life name
        <input id="life-edit-title" className={field} value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-edit-name">
        What the town calls you
        <input id="life-edit-name" className={field} value={playerName} onChange={(event) => setPlayerName(event.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-edit-note">
        One line about you
        <textarea id="life-edit-note" rows={3} className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg" value={playerNote} onChange={(event) => setPlayerNote(event.target.value)} />
      </label>
      <button type="button" className={primaryBtn} onClick={() => onChange(editLife(life, { title, playerName, playerNote }))}>
        Save you
      </button>
    </section>
  );
}

function ClockFields({ life, onChange }: { life: Life; onChange: (life: Life) => void }) {
  const [day, setDay] = useState(String(life.day));
  const [hour, setHour] = useState(String(Math.floor(life.minute / 60)));
  const [mins, setMins] = useState(String(life.minute % 60));
  const [money, setMoney] = useState(String(life.money));
  const [debt, setDebt] = useState(String(life.debt));
  const [energy, setEnergy] = useState(String(life.needs.energy));
  const [hunger, setHunger] = useState(String(life.needs.hunger));
  const [place, setPlace] = useState<PlaceId>(life.place);
  const places = placesFor(life);
  return (
    <section className="flex flex-col gap-3 rounded-md border border-border p-3">
      <h3 className="text-sm font-semibold">Clock, money, needs</h3>
      <div className="grid grid-cols-3 gap-2">
        <Num label="Day" id="life-edit-day" value={day} onChange={setDay} />
        <Num label="Hour" id="life-edit-hour" value={hour} onChange={setHour} />
        <Num label="Minute" id="life-edit-min" value={mins} onChange={setMins} />
        <Num label="Money" id="life-edit-money" value={money} onChange={setMoney} />
        <Num label="Tab" id="life-edit-debt" value={debt} onChange={setDebt} />
        <Num label="Energy" id="life-edit-energy" value={energy} onChange={setEnergy} />
        <Num label="Hunger" id="life-edit-hunger" value={hunger} onChange={setHunger} />
      </div>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-edit-place">
        Where you are
        <select id="life-edit-place" className={field} value={place} onChange={(event) => setPlace(event.target.value as PlaceId)}>
          {(places.some((spot) => spot.id === place) ? places : [...places, placeById(place)]).map((spot) => (
            <option key={spot.id} value={spot.id}>
              {spot.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className={primaryBtn}
        onClick={() =>
          onChange(
            editLife(life, {
              day: Number(day),
              minute: Math.min(23, Math.max(0, Math.round(Number(hour) || 0))) * 60 + Math.min(59, Math.max(0, Math.round(Number(mins) || 0))),
              money: Number(money),
              debt: Number(debt),
              energy: Number(energy),
              hunger: Number(hunger),
              place,
            }),
          )
        }
      >
        Save the clock
      </button>
    </section>
  );
}

function HomeFields({ life, onChange }: { life: Life; onChange: (life: Life) => void }) {
  const [vehicle, setVehicle] = useState<Vehicle>(life.vehicle);
  const [home, setHome] = useState<HomeKind>(life.home);
  return (
    <section className="flex flex-col gap-3 rounded-md border border-border p-3">
      <h3 className="text-sm font-semibold">Home and getting around</h3>
      <p className="text-sm text-muted">This sets them without a purchase. The market, the garage, and Hillcrest still charge.</p>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-edit-ride">
        Ride
        <select id="life-edit-ride" className={field} value={vehicle} onChange={(event) => setVehicle(event.target.value as Vehicle)}>
          <option value="walk">On foot</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-edit-home">
        Home
        <select id="life-edit-home" className={field} value={home} onChange={(event) => setHome(event.target.value as HomeKind)}>
          <option value="apartment">Apartment</option>
          <option value="cottage">Cottage</option>
          <option value="townhouse">Townhouse</option>
        </select>
      </label>
      <button type="button" className={primaryBtn} onClick={() => onChange(editLife(life, { vehicle, home }))}>
        Save home
      </button>
    </section>
  );
}

function PersonFields({
  person,
  card,
  places,
  onSave,
}: {
  person: Resident;
  card: { name: string; summary: string; personality: string } | null;
  places: Place[];
  onSave: (patch: Partial<Pick<Resident, "name" | "personality" | "summary" | "bond" | "relation" | "open" | "movedIn" | "hangout" | "secret" | "outfit" | "birthday" | "role" | "traits">>) => void;
}) {
  const [name, setName] = useState(person.name);
  const [personality, setPersonality] = useState(person.personality);
  const [summary, setSummary] = useState(person.summary);
  const [bond, setBond] = useState(String(person.bond));
  const [relation, setRelation] = useState<Relation>(person.relation);
  const [open, setOpen] = useState(person.open);
  const [movedIn, setMovedIn] = useState(person.movedIn);
  const [hangout, setHangout] = useState<PlaceId>(person.hangout);
  const [secret, setSecret] = useState(person.secret);
  const [outfit, setOutfit] = useState(person.outfit);
  const [birthday, setBirthday] = useState(String(person.birthday));
  const [role, setRole] = useState<CastRole>(person.role);
  const [traits, setTraits] = useState<Trait[]>(person.traits);

  function toggleTrait(trait: Trait) {
    setTraits((current) => (current.includes(trait) ? current.filter((item) => item !== trait) : [...current, trait]));
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-name">
        Name
        <input id="life-person-name" className={field} value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      {card ? (
        <button
          type="button"
          className={quietBtn}
          onClick={() => {
            setName(card.name.trim() || name);
            setSummary(card.summary);
            setPersonality(card.personality);
          }}
        >
          Use the name on their card
        </button>
      ) : null}
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-role">
        Role from day one
        <select id="life-person-role" className={field} value={role} onChange={(event) => setRole(event.target.value as CastRole)}>
          {ROLE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-relation">
        Relationship
        <select id="life-person-relation" className={field} value={relation} onChange={(event) => setRelation(event.target.value as Relation)}>
          {RELATION_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <Num label="Bond" id="life-person-bond" value={bond} onChange={setBond} />
        <Num label="Birthday day" id="life-person-day" value={birthday} onChange={setBirthday} />
      </div>
      <p className="text-sm text-muted">
        Birthday lands on day {Math.max(1, Math.round(Number(birthday) || 1))} · {seasonName(Math.max(1, Math.round(Number(birthday) || 1)))}.
      </p>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-hangout">
        Where they keep
        <select id="life-person-hangout" className={field} value={hangout} onChange={(event) => setHangout(event.target.value as PlaceId)}>
          {(places.some((spot) => spot.id === hangout) ? places : [...places, placeById(hangout)])
            .filter((spot) => spot.id !== "home")
            .map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.name}
              </option>
            ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold">Traits</legend>
        {TRAIT_OPTIONS.map((option) => (
          <label key={option.id} className="flex min-h-11 items-center gap-3 text-sm">
            <input type="checkbox" checked={traits.includes(option.id)} onChange={() => toggleTrait(option.id)} />
            {option.label}
          </label>
        ))}
      </fieldset>
      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={open} onChange={(event) => setOpen(event.target.checked)} />
        This can be open
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={movedIn} onChange={(event) => setMovedIn(event.target.checked)} />
        Lives with you
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-personality">
        Personality
        <textarea id="life-person-personality" rows={3} className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg" value={personality} onChange={(event) => setPersonality(event.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-summary">
        Summary
        <textarea id="life-person-summary" rows={2} className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg" value={summary} onChange={(event) => setSummary(event.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-outfit">
        Outfit, for pictures
        <input id="life-person-outfit" className={field} value={outfit} onChange={(event) => setOutfit(event.target.value)} placeholder="Red coat, scuffed boots" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-person-secret">
        Secret, only the scene knows
        <textarea id="life-person-secret" rows={2} className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm font-normal text-fg" value={secret} onChange={(event) => setSecret(event.target.value)} />
      </label>
      <button
        type="button"
        className={primaryBtn}
        onClick={() =>
          onSave({
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
            traits,
          })
        }
      >
        Save {person.name}
      </button>
    </div>
  );
}

function SceneFields({ life, onChange }: { life: Life; onChange: (life: Life) => void }) {
  const [text, setText] = useState(life.scene ?? "");
  return (
    <section className="flex flex-col gap-3 rounded-md border border-border p-3">
      <h3 className="text-sm font-semibold">Open scene</h3>
      <label className="sr-only" htmlFor="life-edit-scene">
        Scene text
      </label>
      <textarea id="life-edit-scene" rows={6} className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg" value={text} onChange={(event) => setText(event.target.value)} />
      <button type="button" className={primaryBtn} onClick={() => onChange(editScene(life, text))}>
        Save the scene
      </button>
    </section>
  );
}

function CalendarApp({ life, onChange }: { life: Life; onChange: (life: Life) => void }) {
  const places = placesFor(life).filter((spot) => spot.id !== "home");
  const [day, setDay] = useState(String(life.day));
  const [place, setPlace] = useState<PlaceId>(places[0]?.id ?? "cafe");
  const [withId, setWithId] = useState(life.cast[0]?.id ?? "");
  const [note, setNote] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">A plan shows on that morning. An outing, in town, runs longer than a visit.</p>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onChange(addPlan(life, { day: Number(day), place, withId, note }));
          setNote("");
        }}
      >
        <Num label="Day" id="life-plan-day" value={day} onChange={setDay} />
        <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-plan-place">
          Place
          <select id="life-plan-place" className={field} value={place} onChange={(event) => setPlace(event.target.value as PlaceId)}>
            {places.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-plan-who">
          With
          <select id="life-plan-who" className={field} value={withId} onChange={(event) => setWithId(event.target.value)}>
            <option value="">Just you</option>
            {life.cast.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor="life-plan-note">
          Note
          <input id="life-plan-note" className={field} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Coffee, if they're there" />
        </label>
        <button type="submit" className={primaryBtn}>
          Add the plan
        </button>
      </form>
      {life.plans.length === 0 ? <p className="text-sm text-muted">Nothing on the calendar.</p> : null}
      <ul className="flex flex-col gap-2">
        {life.plans.map((plan) => {
          const who = life.cast.find((person) => person.id === plan.withId);
          return (
            <li key={plan.id} className="flex items-center justify-between gap-2 rounded-md border border-border bg-bg p-3 text-sm">
              <span>
                Day {plan.day} · {placeById(plan.place).name}
                {who ? ` · ${who.name}` : ""}
                {plan.note ? ` · ${plan.note}` : ""}
              </span>
              <button type="button" className="min-h-11 shrink-0 text-muted" onClick={() => onChange(removePlan(life, plan.id))}>
                Drop
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Num({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold" htmlFor={id}>
      {label}
      <input id={id} inputMode="numeric" className={field} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Contacts({ life }: { life: Life }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">You, and how the town sits with you.</p>
      {life.cast.length === 0 ? <p className="text-sm text-muted">Nobody from your library is in this life.</p> : null}
      <ul className="flex flex-col gap-2">
        {life.cast.map((person) => (
          <li key={person.id} className="rounded-md border border-border bg-bg p-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-semibold">{person.name}</p>
              <p className="text-sm text-gold">{relationLabel(person)}</p>
            </div>
            <p className="mt-1 text-sm text-muted">
              {ROLE_OPTIONS.find((option) => option.id === person.role)?.label ?? "In town"} · Bond {person.bond} ·{" "}
              {person.movedIn ? "Lives with you" : placeById(person.hangout).name}
            </p>
            {person.traits.length ? <p className="mt-1 text-sm text-muted">{person.traits.map((trait) => TRAIT_OPTIONS.find((option) => option.id === trait)?.label ?? trait).join(", ")}</p> : null}
            {person.memories[person.memories.length - 1] ? <p className="mt-2 text-sm text-fg">{person.memories[person.memories.length - 1]}</p> : null}
          </li>
        ))}
      </ul>
      <h3 className="text-sm font-semibold">Messages</h3>
      {life.texts.length === 0 ? <p className="text-sm text-muted">No messages yet.</p> : null}
      <ul className="flex flex-col gap-2">
        {[...life.texts].reverse().map((text) => (
          <li key={text.id} className="rounded-md bg-bg px-3 py-2 text-sm">
            <span className="font-semibold text-fg">{text.from}</span>
            <span className="text-muted"> · Day {text.day}</span>
            <p className="mt-1 text-fg">{text.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function News({
  life,
  paper,
  busy,
  onRewrite,
}: {
  life: Life;
  paper: Life["papers"][number] | null;
  busy: boolean;
  onRewrite: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">The Millbrook News prints on Monday mornings.</p>
      {paper ? (
        <article className="rounded-md bg-paper p-4 text-ink">
          <p className="text-sm text-ink-soft">
            {weekday(paper.day)} · Day {paper.day}
          </p>
          <h3 className="mt-2 font-display text-2xl">{paper.headline}</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{paper.body}</p>
        </article>
      ) : (
        <p className="text-sm text-fg">No edition yet. Sleep through to a Monday.</p>
      )}
      {paper ? (
        <button type="button" className={quietBtn} disabled={busy} onClick={onRewrite}>
          {busy ? "Writing the edition…" : "Rewrite this edition"}
        </button>
      ) : null}
      {life.rumors.length > 0 ? <p className="text-sm text-muted">The town is already talking. It lands in Monday's paper.</p> : null}
    </div>
  );
}

function Pictures({
  life,
  images,
  busy,
  onPaint,
  onZoom,
  onDelete,
}: {
  life: Life;
  images: Record<string, string>;
  busy: boolean;
  onPaint: (paint: boolean) => void;
  onZoom: (shot: LifeShot) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <button type="button" aria-pressed={life.paintScenes} className={quietBtn} disabled={busy} onClick={() => onPaint(!life.paintScenes)}>
        {life.paintScenes ? "Paint scenes is on" : "Paint scenes is off"}
      </button>
      <p className="text-sm text-muted">On, each scene keeps a picture. A NovelAI token paints it. Otherwise you get a printed card.</p>
      {life.shots.length === 0 ? <p className="text-sm text-muted">No pictures yet. Take one from a scene.</p> : null}
      <ul className="grid grid-cols-2 gap-2">
        {[...life.shots].reverse().map((shot) => (
          <li key={shot.id} className="flex flex-col gap-2">
            <button type="button" className="overflow-hidden rounded-md text-left" onClick={() => onZoom(shot)} aria-label={`Open picture ${shot.caption}`}>
              {images[shot.id] ? <img src={images[shot.id]} alt="" className="aspect-square w-full object-cover" /> : <Printed shot={shot} />}
            </button>
            <button type="button" className="min-h-11 text-sm text-muted" onClick={() => onDelete(shot.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Printed({ shot }: { shot: LifeShot }) {
  return (
    <div className="flex aspect-square flex-col justify-between bg-paper p-3 text-ink">
      <p className="text-xs text-ink-soft">
        {seasonName(shot.day)} · {placeById(shot.place).name}
      </p>
      <p className="font-display text-lg leading-snug">{shot.caption}</p>
      <p className="text-xs text-ink-soft">
        {shot.with ? `With ${shot.with}` : "Millbrook"} · {clockLabel(shot.minute)}
      </p>
    </div>
  );
}
