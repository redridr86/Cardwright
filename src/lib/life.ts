export const DAY_MINUTES = 24 * 60;
export const RENT = 40;
export const START_MONEY = 120;

export type PlaceId = "home" | "cafe" | "park" | "market" | "office" | "diner" | "hillcrest" | "clinic" | "garage" | "library" | "venue";

export type Place = {
  id: PlaceId;
  name: string;
  blurb: string;
  open: number;
  close: number;
};

export const PLACES: Place[] = [
  { id: "home", name: "Your apartment", blurb: "A small place above the bakery. The kettle works.", open: 0, close: DAY_MINUTES },
  { id: "cafe", name: "Hearth Cafe", blurb: "Coffee, toast, and whoever got here first.", open: 7 * 60, close: 20 * 60 },
  { id: "park", name: "River Park", blurb: "A path, a bench, and the mill pond.", open: 6 * 60, close: 21 * 60 },
  { id: "market", name: "Corner Market", blurb: "Groceries, and a hot sandwich if you ask.", open: 8 * 60, close: 20 * 60 },
  { id: "office", name: "Millbrook Office", blurb: "The only place in town that posts a job.", open: 9 * 60, close: 17 * 60 },
  { id: "diner", name: "Night Diner", blurb: "Open late. The pie is honest.", open: 11 * 60, close: 23 * 60 },
];

const EXTRA_PLACES: Place[] = [
  { id: "hillcrest", name: "Hillcrest", blurb: "The hill where people buy a place of their own.", open: 8 * 60, close: 18 * 60 },
  { id: "clinic", name: "Clinic", blurb: "A quiet waiting room and a nurse who knows the town.", open: 8 * 60, close: 17 * 60 },
  { id: "garage", name: "Garage", blurb: "Bikes, a used car, and the smell of oil.", open: 9 * 60, close: 18 * 60 },
  { id: "library", name: "Library", blurb: "Stacks, a table by the window, and no one in a hurry.", open: 10 * 60, close: 19 * 60 },
  { id: "venue", name: "The Venue", blurb: "A small room with a stage and a sticky floor.", open: 16 * 60, close: 23 * 60 },
];

const ALL_PLACES = [...PLACES, ...EXTRA_PLACES];

const HANGOUTS: PlaceId[] = ["cafe", "park", "market", "diner", "office"];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export type Needs = { energy: number; hunger: number };

export type JobKind = "desk" | "shop" | "delivery" | "gig" | "home";

export type Job = { title: string; wage: number; start: number; end: number; kind: JobKind; place: PlaceId };

export const FRONT_DESK: Job = { title: "Front desk", wage: 64, start: 9 * 60, end: 17 * 60, kind: "desk", place: "office" };

export const JOB_LIST: Job[] = [
  FRONT_DESK,
  { title: "Shop clerk", wage: 52, start: 8 * 60, end: 16 * 60, kind: "shop", place: "market" },
  { title: "Deliveries", wage: 48, start: 10 * 60, end: 18 * 60, kind: "delivery", place: "diner" },
  { title: "Evening gig", wage: 70, start: 18 * 60, end: 22 * 60, kind: "gig", place: "diner" },
  { title: "Work from home", wage: 40, start: 9 * 60, end: 13 * 60, kind: "home", place: "home" },
];

export type CastRole = "town" | "friend" | "family" | "partner" | "ex" | "rival";
export type Trait = "jealous" | "faithful" | "shy" | "quick";
export type Vehicle = "walk" | "bike" | "car";
export type HomeKind = "apartment" | "cottage" | "townhouse";
export type Sky = "clear" | "cloudy" | "rain" | "wind" | "storm";

export type LifeModules = {
  weather: boolean;
  districts: boolean;
  calendar: boolean;
  birthdays: boolean;
  cooking: boolean;
  homes: boolean;
  opinions: boolean;
  npcs: boolean;
  jobs: boolean;
  bills: boolean;
};

export const MODULES_OFF: LifeModules = {
  weather: false,
  districts: false,
  calendar: false,
  birthdays: false,
  cooking: false,
  homes: false,
  opinions: false,
  npcs: false,
  jobs: false,
  bills: false,
};

export const MODULE_NOTES: { key: keyof LifeModules; label: string; detail: string }[] = [
  { key: "weather", label: "Weather", detail: "The sky changes the day, and a storm slows a walk." },
  { key: "districts", label: "Wider town", detail: "Hillcrest, the clinic, the garage, the library, and the venue." },
  { key: "calendar", label: "Calendar", detail: "Plans on the phone, and a longer outing when you mean to go." },
  { key: "birthdays", label: "Birthdays", detail: "The morning of their day, the town says something." },
  { key: "cooking", label: "Cooking", detail: "Groceries and a real meal at home." },
  { key: "homes", label: "Homes", detail: "Buy a cottage or a townhouse. Rent stops. People notice." },
  { key: "opinions", label: "Opinions", detail: "Friends text you about what they heard." },
  { key: "npcs", label: "New people", detail: "Meet someone the town hasn't introduced. Off unless you want it." },
  { key: "jobs", label: "More jobs", detail: "The shop, deliveries, a gig, or work from the kitchen table." },
  { key: "bills", label: "Bills", detail: "Utilities on top of rent. A high tab can keep you home." },
];

export const ROLE_OPTIONS: { id: CastRole; label: string }[] = [
  { id: "town", label: "In town" },
  { id: "friend", label: "Friend" },
  { id: "family", label: "Family" },
  { id: "partner", label: "Partner" },
  { id: "ex", label: "Ex" },
  { id: "rival", label: "Rival" },
];

export const TRAIT_OPTIONS: { id: Trait; label: string }[] = [
  { id: "jealous", label: "Jealous" },
  { id: "faithful", label: "Faithful" },
  { id: "shy", label: "Shy" },
  { id: "quick", label: "Quick-tempered" },
];

export const RELATION_OPTIONS: { id: Relation; label: string }[] = [
  { id: "single", label: "Single" },
  { id: "dating", label: "Dating" },
  { id: "engaged", label: "Engaged" },
  { id: "married", label: "Married" },
  { id: "ex", label: "Ex" },
];

export type Relation = "single" | "dating" | "engaged" | "married" | "ex";

export type Resident = {
  id: string;
  name: string;
  summary: string;
  personality: string;
  description: string;
  hangout: PlaceId;
  bond: number;
  memories: string[];
  relation: Relation;
  open: boolean;
  movedIn: boolean;
  role: CastRole;
  traits: Trait[];
  secret: string;
  outfit: string;
  birthday: number;
};

export type LifeLog = { day: number; minute: number; text: string };

export type Paper = { day: number; headline: string; body: string; read: boolean };

export type PhoneText = { id: string; from: string; day: number; body: string; read: boolean };

export type Plan = { id: string; day: number; place: PlaceId; withId: string; note: string };

export type LifeShot = {
  id: string;
  day: number;
  minute: number;
  place: PlaceId;
  caption: string;
  with: string | null;
};

export type Life = {
  id: string;
  title: string;
  playerName: string;
  playerNote: string;
  day: number;
  minute: number;
  money: number;
  debt: number;
  needs: Needs;
  place: PlaceId;
  job: Job | null;
  workedDay: number;
  rentDay: number;
  cast: Resident[];
  log: LifeLog[];
  scene: string | null;
  sceneWith: string | null;
  rumors: string[];
  papers: Paper[];
  texts: PhoneText[];
  shots: LifeShot[];
  paintScenes: boolean;
  modules: LifeModules;
  vehicle: Vehicle;
  home: HomeKind;
  plans: Plan[];
  createdAt: number;
};

export type CardSketch = {
  id: string;
  name: string;
  summary: string;
  personality: string;
  description: string;
};

type Step = { life?: Life; error?: string };

function clamp(value: number, low: number, high: number) {
  return Math.min(high, Math.max(low, value));
}

export function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function placeById(id: PlaceId) {
  return ALL_PLACES.find((place) => place.id === id) ?? PLACES[0];
}

export function skyFor(day: number): Sky {
  const skies: Sky[] = ["clear", "cloudy", "rain", "wind", "storm"];
  return skies[Math.abs(day * 3) % skies.length] ?? "clear";
}

export function skyLabel(day: number) {
  const sky = skyFor(day);
  if (sky === "clear") return "Clear";
  if (sky === "cloudy") return "Cloudy";
  if (sky === "rain") return "Rain";
  if (sky === "wind") return "Wind";
  return "Storm";
}

export function weeklyDue(life: Pick<Life, "home" | "modules">) {
  return (life.home === "apartment" ? RENT : 0) + (life.modules?.bills ? 15 : 0);
}

export function placesFor(life: Life): Place[] {
  const list = life.modules?.districts ? ALL_PLACES : PLACES;
  return list.map((place) => (place.id === "home" ? homePlace(life) : place));
}

export function homePlace(life: Pick<Life, "home">): Place {
  const home = PLACES[0];
  if (life.home === "cottage") return { ...home, name: "Your cottage", blurb: "A small place in Hillcrest. The kettle still works." };
  if (life.home === "townhouse") return { ...home, name: "Your townhouse", blurb: "Two floors, and a door people actually knock on." };
  return home;
}

export function tripMinutes(life: Life) {
  let minutes = life.vehicle === "car" ? 8 : life.vehicle === "bike" ? 12 : 20;
  if (life.modules?.weather && skyFor(life.day) === "storm" && life.vehicle !== "car") minutes += 10;
  return minutes;
}

export function isOpen(place: Place, minute: number) {
  const clock = ((minute % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  return clock >= place.open && clock < place.close;
}

export function clockLabel(minute: number) {
  const clock = ((minute % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  const hour = Math.floor(clock / 60);
  const mins = clock % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(mins).padStart(2, "0")} ${suffix}`;
}

export function hoursLabel(place: Place) {
  if (place.id === "home") return "Always open";
  return `${clockLabel(place.open)} – ${clockLabel(place.close)}`;
}

export function weekday(day: number) {
  const index = (((Math.max(1, day) - 1) % 7) + 7) % 7;
  return WEEKDAYS[index] ?? "Monday";
}

export function seasonName(day: number) {
  const index = Math.floor(((Math.max(1, day) - 1) % 120) / 30);
  return SEASONS[index] ?? "Spring";
}

export function dateLabel(life: Pick<Life, "day" | "minute">) {
  return `${weekday(life.day)} · Day ${life.day} · ${seasonName(life.day)} · ${clockLabel(life.minute)}`;
}

export function bondLabel(bond: number) {
  if (bond < 20) return "Acquaintance";
  if (bond < 45) return "Familiar";
  if (bond < 70) return "Friend";
  return "Close";
}

export function needNote(needs: Needs) {
  const parts: string[] = [];
  if (needs.hunger >= 75) parts.push("You need to eat");
  else if (needs.hunger >= 50) parts.push("You're getting hungry");
  if (needs.energy <= 20) parts.push("You need to sleep");
  else if (needs.energy <= 40) parts.push("You're wearing thin");
  return parts.length ? `${parts.join(". ")}.` : null;
}

export function hangoutFor(index: number): PlaceId {
  return HANGOUTS[index % HANGOUTS.length] ?? "cafe";
}

export function sketchResident(card: CardSketch, index: number): Resident {
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
    birthday: 8 + (index % 12) * 9,
  };
}

function withRole(person: Resident, role: CastRole | undefined): Resident {
  if (role === "friend") return { ...person, role, bond: 30 };
  if (role === "family") return { ...person, role, bond: 55 };
  if (role === "partner") return { ...person, role, relation: "dating", bond: 42 };
  if (role === "ex") return { ...person, role, relation: "ex", bond: 18 };
  if (role === "rival") return { ...person, role, bond: 4, traits: ["quick"], secret: "You got off on the wrong foot." };
  return { ...person, role: role ?? "town" };
}

function pushLog(life: Life, text: string, scene?: string | null, sceneWith?: string | null): Life {
  return {
    ...life,
    scene: scene === undefined ? null : scene,
    sceneWith: scene === undefined ? null : (sceneWith ?? null),
    log: [...life.log, { day: life.day, minute: life.minute, text }].slice(-24),
  };
}

function passTime(life: Life, minutes: number): Life {
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
      energy: clamp(life.needs.energy - Math.round(minutes * 0.1), 0, 100),
      hunger: clamp(life.needs.hunger + Math.round((minutes * 8) / 60), 0, 100),
    },
  };
}

export function createLife(input: {
  id?: string;
  title: string;
  playerName: string;
  playerNote: string;
  cast: (CardSketch & { role?: CastRole })[];
  now?: number;
  money?: number;
  energy?: number;
  hunger?: number;
  season?: "Spring" | "Summer" | "Autumn" | "Winter";
  startJob?: JobKind | null;
  modules?: Partial<LifeModules>;
  vehicle?: Vehicle;
}): Life {
  const title = clip(input.title, 60) || "Millbrook";
  const playerName = clip(input.playerName, 60) || "You";
  const season = input.season ?? "Spring";
  const day = season === "Summer" ? 31 : season === "Autumn" ? 61 : season === "Winter" ? 91 : 1;
  const money = clamp(Math.round(input.money ?? START_MONEY), 0, 99999);
  const job = input.startJob ? JOB_LIST.find((item) => item.kind === input.startJob) ?? null : null;
  return {
    id: input.id ?? `life-${crypto.randomUUID()}`,
    title,
    playerName,
    playerNote: clip(input.playerNote, 280),
    day,
    minute: 8 * 60,
    money,
    debt: 0,
    needs: { energy: clamp(Math.round(input.energy ?? 80), 0, 100), hunger: clamp(Math.round(input.hunger ?? 25), 0, 100) },
    place: "home",
    job: job ? { ...job } : null,
    workedDay: 0,
    rentDay: day + 7,
    cast: input.cast.slice(0, 6).map((card, index) => withRole(sketchResident(card, index), card.role)),
    log: [{ day, minute: 8 * 60, text: `${playerName} wakes up in Millbrook with $${money} and a week until rent.` }],
    scene: null,
    sceneWith: null,
    rumors: [],
    papers: [],
    texts: [],
    shots: [],
    paintScenes: false,
    modules: { ...MODULES_OFF, ...input.modules },
    vehicle: input.vehicle ?? "walk",
    home: "apartment",
    plans: [],
    createdAt: input.now ?? Date.now(),
  };
}

export function peopleHere(life: Life) {
  const place = placeById(life.place);
  if (!isOpen(place, life.minute)) return [];
  return life.cast.filter((person) => {
    if (person.hangout === life.place) return true;
    return life.place === "home" && person.movedIn && (life.minute < 9 * 60 || life.minute >= 18 * 60);
  });
}

export function travel(life: Life, placeId: PlaceId): Step {
  if (placeId === life.place) return { life };
  if (life.modules?.bills && life.debt >= 120 && life.place === "home") {
    return { error: "The tab is high enough that they're talking about eviction. Pay some of it before you leave." };
  }
  const dest = placeById(placeId);
  const riding = life.vehicle === "car" ? "drove" : life.vehicle === "bike" ? "rode" : "walked";
  const next = passTime(life.vehicle === "car" ? { ...life, money: Math.max(0, life.money - 2) } : life, tripMinutes(life));
  if (!isOpen(dest, next.minute)) {
    return { error: `${dest.name} is closed. Hours are ${hoursLabel(dest)}.` };
  }
  const sky = life.modules?.weather && skyFor(life.day) === "storm" ? " The storm came with you." : "";
  return { life: pushLog({ ...next, place: placeId }, `You ${riding} to ${dest.name}.${sky}`) };
}

const MEALS: Partial<Record<PlaceId, { cost: number; label: string; fill: number }>> = {
  home: { cost: 0, label: "something from the cupboard", fill: 28 },
  cafe: { cost: 8, label: "coffee and toast", fill: 36 },
  market: { cost: 10, label: "a hot sandwich", fill: 40 },
  diner: { cost: 14, label: "a plate at the diner", fill: 48 },
};

export function eat(life: Life): Step {
  const meal = MEALS[life.place];
  if (!meal) return { error: "Nothing to eat here." };
  if (life.money < meal.cost) return { error: `That costs $${meal.cost}. You have $${life.money}.` };
  const next = passTime({ ...life, money: life.money - meal.cost }, 30);
  return {
    life: pushLog(
      { ...next, needs: { ...next.needs, hunger: clamp(next.needs.hunger - meal.fill, 0, 100) } },
      `You had ${meal.label}.`,
    ),
  };
}

export function rest(life: Life): Step {
  if (life.place !== "park") return { error: "The bench is at River Park." };
  const next = passTime(life, 30);
  return {
    life: pushLog(
      { ...next, needs: { ...next.needs, energy: clamp(next.needs.energy + 12, 0, 100) } },
      "You sat by the mill pond until your shoulders dropped.",
    ),
  };
}

export function lookAround(life: Life): Life {
  const place = placeById(life.place);
  const names = peopleHere(life).map((person) => person.name);
  const company = names.length ? ` ${names.join(" and ")} ${names.length === 1 ? "is" : "are"} here.` : " You have the place mostly to yourself.";
  const next = passTime(life, 15);
  return pushLog(next, `${place.blurb}${company}`);
}

export function sleep(life: Life): Life {
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
  let woken = publishMonday(
    pushLog(
      {
        ...life,
        day,
        minute: 7 * 60 + 30,
        money,
        debt,
        rentDay,
        place: "home",
        needs: { energy: 100, hunger: clamp(life.needs.hunger + 18, 0, 100) },
      },
      note,
    ),
  );
  if (woken.modules?.birthdays) {
    for (const person of woken.cast) {
      if (((woken.day - 1) % 120) + 1 === person.birthday) {
        woken = addText(woken, person.name, "It's my birthday. Don't make it weird.");
        woken = addRumor(woken, `${person.name} has a birthday today.`);
      }
    }
  }
  return woken;
}

export function hire(life: Life): Step {
  if (life.job) return { error: "You already have the front desk." };
  if (life.place !== "office") return { error: "Ask at Millbrook Office." };
  if (!isOpen(placeById("office"), life.minute)) return { error: "The office is closed." };
  const next = passTime(life, 40);
  return {
    life: pushLog(
      { ...next, job: { ...FRONT_DESK } },
      `They needed someone at the front desk. A shift pays $${FRONT_DESK.wage}.`,
    ),
  };
}

export function canWork(life: Life) {
  if (!life.job || life.workedDay === life.day) return false;
  const where = life.job.place || "office";
  if (life.place !== where) return false;
  return life.minute >= life.job.start && life.minute < life.job.end;
}

export function workShift(life: Life): Step {
  if (!life.job) return { error: "You don't have a job yet." };
  const where = life.job.place || "office";
  if (life.place !== where) return { error: `The shift is at ${placeById(where).name}.` };
  if (life.workedDay === life.day) return { error: "You already worked today." };
  if (life.minute < life.job.start || life.minute >= life.job.end) return { error: `The shift is ${clockLabel(life.job.start)} to ${clockLabel(life.job.end)}.` };
  const remain = Math.max(30, life.job.end - life.minute);
  const next = passTime(life, remain);
  return {
    life: pushLog(
      {
        ...next,
        money: life.money + life.job.wage,
        workedDay: life.day,
        needs: {
          energy: clamp(next.needs.energy - 18, 0, 100),
          hunger: clamp(next.needs.hunger + 10, 0, 100),
        },
      },
      `You finished the ${life.job.title.toLowerCase()} shift and took home $${life.job.wage}.`,
    ),
  };
}

export function afterTalk(life: Life, residentId: string, playerLine: string, sceneText: string): Life {
  const next = passTime(life, 40);
  const line = clip(playerLine, 180) || "a quiet visit";
  const place = placeById(life.place).name;
  const cast = next.cast.map((person) => {
    if (person.id !== residentId) return person;
    const memory = clip(`Day ${life.day} at ${place}: ${line}`, 180);
    return { ...person, bond: clamp(person.bond + 4, 0, 100), memories: [...person.memories, memory].slice(-5) };
  });
  const name = cast.find((person) => person.id === residentId)?.name ?? "them";
  const scene = clip(sceneText, 2000);
  let withText = addText({ ...next, cast }, name, scene.split("\n").map((line) => line.trim()).find(Boolean) || "I liked seeing you.");
  if (withText.modules?.opinions) {
    const friend = withText.cast.find((person) => person.id !== residentId && person.bond >= 20 && person.relation !== "ex");
    if (friend) withText = addText(withText, friend.name, `I heard you were at ${place}.`);
  }
  return pushLog(withText, `You spent time with ${name}.`, scene, name);
}

export function afterOuting(life: Life, residentId: string, playerLine: string, sceneText: string): Life {
  const talked = afterTalk(life, residentId, playerLine, sceneText);
  const extra = passTime(talked, 40);
  return { ...talked, day: extra.day, minute: extra.minute, needs: extra.needs };
}

export function dismissScene(life: Life): Life {
  return { ...life, scene: null, sceneWith: null };
}

export function outingBrief(life: Life, person: Resident, playerLine: string) {
  const brief = sceneBrief(life, person, playerLine);
  return {
    system: `${brief.system} This is a longer outing, not a short visit. Let the afternoon pass.`,
    user: brief.user,
  };
}

export function sceneBrief(life: Life, person: Resident, playerLine: string) {
  const place = placeById(life.place);
  const needs = needNote(life.needs);
  const memories = person.memories.length ? person.memories.join(" | ") : "Nothing yet.";
  const system = [
    "You narrate one short scene in a modern small-town life sim called Millbrook.",
    "Write in present tense. Call the player 'you'.",
    "The other person speaks in their own voice and stays consistent with the notes.",
    "Two to four short paragraphs. No lists, no stats, no markdown, no menu of choices.",
    "End on a beat. Do not ask the player what they want to do next.",
  ].join(" ");
  const user = [
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
    playerLine.trim() ? `The player does or says: ${clip(playerLine, 400)}` : "The player sits with them and lets the moment happen.",
  ]
    .filter(Boolean)
    .join("\n");
  return { system, user };
}

const TOGETHER: Relation[] = ["dating", "engaged", "married"];

export type Courtship = "date" | "movein" | "propose" | "marry" | "open" | "breakup" | "stay";

export function isTogether(person: Resident) {
  return TOGETHER.includes(person.relation);
}

export function relationLabel(person: Resident) {
  if (person.relation === "dating") return person.open ? "Dating · open" : "Dating";
  if (person.relation === "engaged") return person.movedIn ? "Engaged · lives here" : "Engaged";
  if (person.relation === "married") return person.movedIn ? "Married · lives here" : "Married";
  if (person.relation === "ex") return "Ex";
  return bondLabel(person.bond);
}

export function unreadCount(life: Life) {
  return life.texts.filter((item) => !item.read).length + life.papers.filter((item) => !item.read).length;
}

function addText(life: Life, from: string, body: string): Life {
  const text: PhoneText = {
    id: `txt-${life.day}-${life.minute}-${life.texts.length}`,
    from,
    day: life.day,
    body: clip(body, 180),
    read: false,
  };
  return { ...life, texts: [...life.texts, text].slice(-30) };
}

function addRumor(life: Life, rumor: string): Life {
  return { ...life, rumors: [...life.rumors, clip(rumor, 160)].slice(-8) };
}

export function canCourt(life: Life, residentId: string, kind: Courtship): string | null {
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
    if (life.minute < 18 * 60 && !person.movedIn && life.place !== person.hangout) return "Ask later, or go where they keep.";
    return null;
  }
  if (!isTogether(person)) return "You're not together.";
  return null;
}

export function courtOffers(life: Life, person: Resident): { kind: Courtship; label: string; blocked: string | null }[] {
  const options: { kind: Courtship; label: string }[] = [];
  if (!isTogether(person)) options.push({ kind: "date", label: "Ask them out" });
  else {
    if (!person.movedIn) options.push({ kind: "movein", label: "Ask them to move in" });
    if (person.relation === "dating") options.push({ kind: "propose", label: "Propose" });
    if (person.relation === "engaged") options.push({ kind: "marry", label: "Marry" });
    if (!person.open) options.push({ kind: "open", label: "Ask if this can be open" });
    options.push({ kind: "stay", label: "Stay the night" });
    options.push({ kind: "breakup", label: "Break up" });
  }
  return options
    .map((option) => ({ ...option, blocked: canCourt(life, person.id, option.kind) }))
    .filter((option) => option.kind !== "stay" || !option.blocked);
}

const COURT_BEAT: Record<Courtship, string> = {
  date: "The player asks them out. They agree, in their own voice. Write the moment they say yes.",
  movein: "The player asks them to move into the apartment. They agree and mean it.",
  propose: "The player proposes. They say yes. Keep it specific to these two people.",
  marry: "This is their wedding, small and in town. They are married by the end of the scene.",
  open: "The player asks if the relationship can be open. They agree, with whatever reluctance or ease fits them.",
  breakup: "The relationship ends in this scene. They are hurt, relieved, or both, in character.",
  stay: "They spend the night together. Keep it tender and ordinary. By morning they are still themselves.",
};

export function courtshipBrief(life: Life, person: Resident, kind: Courtship, playerLine: string) {
  const brief = sceneBrief(life, person, playerLine);
  return {
    system: `${brief.system} ${COURT_BEAT[kind]} Do not have them refuse.`,
    user: brief.user,
  };
}

export function finishCourtship(life: Life, residentId: string, kind: Courtship, playerLine: string, sceneText: string): Step {
  const blocked = canCourt(life, residentId, kind);
  if (blocked) return { error: blocked };
  const person = life.cast.find((item) => item.id === residentId);
  if (!person) return { error: "They're not in this life." };
  if (kind === "stay") {
    const slept = sleep(life);
    const cast = slept.cast.map((item) =>
      item.id === residentId
        ? { ...item, bond: clamp(item.bond + 3, 0, 100), memories: [...item.memories, clip(`Stayed the night, day ${life.day}`, 180)].slice(-5) }
        : item,
    );
    let updated = addRumor({ ...slept, cast }, `${person.name} and ${life.playerName} stayed the night.`);
    updated = addText(updated, person.name, "Last night was good.");
    return { life: pushLog(updated, `You stayed the night with ${person.name}.`, clip(sceneText, 2000), person.name) };
  }
  let next = passTime(life, 40);
  if (kind === "marry") next = { ...next, money: life.money - 40 };
  const jealous = kind === "date" ? life.cast.filter((other) => other.id !== person.id && isTogether(other) && !other.open) : [];
  const place = placeById(life.place).name;
  const memory = clip(`Day ${life.day} at ${place}: ${clip(playerLine, 80) || kind}`, 180);
  const cast = next.cast.map((item) => {
    if (jealous.some((other) => other.id === item.id)) {
      return {
        ...item,
        bond: clamp(item.bond - ((item.traits ?? []).includes("jealous") ? 20 : 12), 0, 100),
        memories: [...item.memories, clip(`Heard you were with ${person.name}.`, 180)].slice(-5),
      };
    }
    if (item.id !== residentId) return item;
    const memories = [...item.memories, memory].slice(-5);
    if (kind === "date") return { ...item, relation: "dating" as const, bond: clamp(item.bond + 8, 0, 100), memories };
    if (kind === "movein") return { ...item, movedIn: true, bond: clamp(item.bond + 6, 0, 100), memories };
    if (kind === "propose") return { ...item, relation: "engaged" as const, bond: clamp(item.bond + 8, 0, 100), memories };
    if (kind === "marry") return { ...item, relation: "married" as const, bond: clamp(item.bond + 10, 0, 100), memories };
    if (kind === "open") return { ...item, open: true, memories };
    return { ...item, relation: "ex" as const, open: false, movedIn: false, bond: Math.min(item.bond, (item.traits ?? []).includes("quick") ? 10 : 24), memories };
  });
  const rumor =
    kind === "date"
      ? `${person.name} was seen with ${life.playerName} at ${place}.`
      : kind === "movein"
        ? `${person.name} moved in with ${life.playerName}.`
        : kind === "propose"
          ? `${life.playerName} and ${person.name} are engaged.`
          : kind === "marry"
            ? `${life.playerName} and ${person.name} married in Millbrook.`
            : kind === "open"
              ? `${person.name} and ${life.playerName} agreed to see other people.`
              : `${life.playerName} and ${person.name} are no longer together.`;
  let updated = addRumor({ ...next, cast }, rumor);
  updated = addText(updated, person.name, kind === "breakup" ? "So that's that." : "I'm glad you asked.");
  for (const other of jealous) {
    updated = addRumor(updated, `${other.name} heard about ${person.name} and did not take it well.`);
    updated = addText(updated, other.name, `I heard about you and ${person.name}.`);
  }
  const scene = clip(sceneText, 2000);
  const jealousNote = jealous.length ? ` ${jealous.map((other) => other.name).join(" and ")} heard.` : "";
  const verb =
    kind === "date"
      ? `You asked ${person.name} out.`
      : kind === "movein"
        ? `${person.name} is moving in.`
        : kind === "propose"
          ? `You proposed to ${person.name}.`
          : kind === "marry"
            ? `You married ${person.name}.`
            : kind === "open"
              ? `${person.name} agreed this can be open.`
              : `You and ${person.name} broke up.`;
  return { life: pushLog(updated, `${verb}${jealousNote}`, scene, person.name) };
}

export function publishMonday(life: Life): Life {
  if (life.day <= 1 || weekday(life.day) !== "Monday") return life;
  if (life.papers.some((paper) => paper.day === life.day)) return life;
  const rumors = life.rumors.slice(-4);
  const happened = life.log.slice(-6).map((entry) => entry.text);
  const headline = rumors[0] ? clip(rumors[0], 72) : "A quiet week in Millbrook";
  const body = clip(
    [rumors.length ? rumors.join(" ") : "Nobody had much to pass along.", happened.length ? `The week left these traces: ${happened.join(" ")}` : ""]
      .filter(Boolean)
      .join("\n\n"),
    700,
  );
  const paper: Paper = { day: life.day, headline, body, read: false };
  return addText({ ...life, papers: [...life.papers, paper].slice(-8), rumors: [] }, "Millbrook News", headline);
}

export function paperBrief(paper: Paper) {
  return {
    system:
      "You write the Monday edition of a small-town paper called the Millbrook News. First line is a headline of at most twelve words. Then two short paragraphs. No markdown.",
    user: `Facts to use, and not invent past:\n${paper.headline}\n${paper.body}`,
  };
}

export function replacePaper(life: Life, day: number, headline: string, body: string): Life {
  return {
    ...life,
    papers: life.papers.map((paper) => (paper.day === day ? { ...paper, headline: clip(headline, 80), body: clip(body, 700), read: true } : paper)),
  };
}

export function markNewsRead(life: Life): Life {
  return { ...life, papers: life.papers.map((paper) => ({ ...paper, read: true })) };
}

export function markTextsRead(life: Life): Life {
  return { ...life, texts: life.texts.map((text) => ({ ...text, read: true })) };
}

export function setPaintScenes(life: Life, paintScenes: boolean): Life {
  return { ...life, paintScenes };
}

export function addShot(life: Life, caption: string, withName: string | null): { life: Life; shot: LifeShot } {
  const shot: LifeShot = {
    id: `lifeimg-${crypto.randomUUID()}`,
    day: life.day,
    minute: life.minute,
    place: life.place,
    caption: clip(caption, 140) || placeById(life.place).name,
    with: withName,
  };
  return { shot, life: { ...life, shots: [...life.shots, shot].slice(-24) } };
}

export function removeShot(life: Life, id: string): Life {
  return { ...life, shots: life.shots.filter((shot) => shot.id !== id) };
}

export function picturePrompt(life: Life, shot: LifeShot, appearance: string) {
  const place = placeById(shot.place);
  const person = life.cast.find((item) => item.name === shot.with);
  return [appearance, person?.outfit ?? "", place.name, place.blurb, `${seasonName(shot.day)} clothes`, shot.with ? `with ${shot.with}` : "", shot.caption, "single scene, no text, no watermark"]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ")
    .slice(0, 1500);
}

export function editLife(
  life: Life,
  patch: Partial<Pick<Life, "title" | "playerName" | "playerNote" | "money" | "debt" | "day" | "minute" | "vehicle" | "home" | "paintScenes" | "place">> & {
    energy?: number;
    hunger?: number;
    modules?: Partial<LifeModules>;
  },
): Life {
  const day = patch.day === undefined ? life.day : clamp(Math.round(patch.day), 1, 9999);
  const minute = patch.minute === undefined ? life.minute : clamp(Math.round(patch.minute), 0, DAY_MINUTES - 1);
  return {
    ...life,
    title: patch.title === undefined ? life.title : clip(patch.title, 60) || life.title,
    playerName: patch.playerName === undefined ? life.playerName : clip(patch.playerName, 60) || life.playerName,
    playerNote: patch.playerNote === undefined ? life.playerNote : clip(patch.playerNote, 280),
    money: patch.money === undefined ? life.money : clamp(Math.round(patch.money), 0, 99999),
    debt: patch.debt === undefined ? life.debt : clamp(Math.round(patch.debt), 0, 99999),
    day,
    minute,
    vehicle: patch.vehicle ?? life.vehicle,
    home: patch.home ?? life.home,
    place: patch.place ?? life.place,
    paintScenes: patch.paintScenes ?? life.paintScenes,
    modules: patch.modules ? { ...life.modules, ...patch.modules } : life.modules,
    needs: {
      energy: patch.energy === undefined ? life.needs.energy : clamp(Math.round(patch.energy), 0, 100),
      hunger: patch.hunger === undefined ? life.needs.hunger : clamp(Math.round(patch.hunger), 0, 100),
    },
  };
}

export function editResident(
  life: Life,
  id: string,
  patch: Partial<Pick<Resident, "name" | "personality" | "summary" | "bond" | "relation" | "open" | "movedIn" | "hangout" | "secret" | "outfit" | "birthday" | "role" | "traits">>,
): Life {
  return {
    ...life,
    cast: life.cast.map((person) => {
      if (person.id !== id) return person;
      return {
        ...person,
        ...patch,
        name: patch.name === undefined ? person.name : clip(patch.name, 80) || person.name,
        personality: patch.personality === undefined ? person.personality : clip(patch.personality, 500),
        summary: patch.summary === undefined ? person.summary : clip(patch.summary, 240),
        secret: patch.secret === undefined ? person.secret : clip(patch.secret, 240),
        outfit: patch.outfit === undefined ? person.outfit : clip(patch.outfit, 160),
        bond: patch.bond === undefined ? person.bond : clamp(Math.round(patch.bond), 0, 100),
        birthday: patch.birthday === undefined ? person.birthday : clamp(Math.round(patch.birthday), 1, 120),
        traits: patch.traits ?? person.traits,
      };
    }),
  };
}

export function editScene(life: Life, text: string): Life {
  const scene = text.trim();
  return { ...life, scene: scene ? clip(scene, 2000) : null };
}

export function takeJob(life: Life, kind: JobKind | null): Step {
  if (life.place !== "office") return { error: "The board is at Millbrook Office." };
  if (!isOpen(placeById("office"), life.minute)) return { error: "The office is closed." };
  if (kind === null) {
    if (!life.job) return { error: "You don't have a job to quit." };
    const next = passTime(life, 15);
    return { life: pushLog({ ...next, job: null, workedDay: 0 }, "You quit.") };
  }
  const job = JOB_LIST.find((item) => item.kind === kind);
  if (!job) return { error: "That job isn't posted." };
  if (!life.modules?.jobs && kind !== "desk") return { error: "Turn on more jobs if you want that posting." };
  const next = passTime(life, 30);
  return { life: pushLog({ ...next, job: { ...job }, workedDay: 0 }, `You took ${job.title}. A shift pays $${job.wage}.`) };
}

export function buyRide(life: Life, vehicle: Exclude<Vehicle, "walk">): Step {
  const price = vehicle === "bike" ? 80 : 400;
  const where = life.modules?.districts ? "garage" : "market";
  if (life.place !== where) return { error: `They sell that at ${placeById(where).name}.` };
  if (life.vehicle === vehicle) return { error: "You already have that." };
  if (life.money < price) return { error: `That costs $${price}.` };
  const next = passTime({ ...life, money: life.money - price, vehicle }, 20);
  return { life: pushLog(next, vehicle === "bike" ? "You bought a bike." : "You bought a used car.") };
}

export function buyHome(life: Life, home: Exclude<HomeKind, "apartment">): Step {
  if (!life.modules?.homes) return { error: "Turn on homes first." };
  if (life.place !== "hillcrest" && life.place !== "home") return { error: "Look at places in Hillcrest, or decide at home." };
  const price = home === "cottage" ? 800 : 1400;
  if (life.home === home) return { error: "You already live there." };
  if (life.money < price) return { error: `That costs $${price}.` };
  const next = passTime({ ...life, money: life.money - price, home }, 60);
  return { life: addRumor(pushLog(next, `You bought a ${home}. Rent stops.`), `${life.playerName} moved into a ${home}.`) };
}

export function cook(life: Life): Step {
  if (!life.modules?.cooking) return { error: "Turn on cooking first." };
  if (life.place !== "home") return { error: "The kitchen is at home." };
  if (life.money < 6) return { error: "Groceries cost $6." };
  const next = passTime({ ...life, money: life.money - 6 }, 45);
  return {
    life: pushLog(
      { ...next, needs: { ...next.needs, hunger: clamp(next.needs.hunger - 50, 0, 100) } },
      "You cooked. It smells like a real meal.",
    ),
  };
}

export function payDebt(life: Life, amount: number): Step {
  const pay = clamp(Math.round(amount), 1, life.money);
  if (life.debt <= 0) return { error: "You don't owe anything." };
  if (life.money <= 0) return { error: "You have nothing to put toward the tab." };
  const paid = Math.min(pay, life.debt);
  const next = { ...life, money: life.money - paid, debt: life.debt - paid };
  return { life: pushLog(next, `You paid $${paid} on the tab.`) };
}

export function doFavour(life: Life, residentId: string): Step {
  const person = life.cast.find((item) => item.id === residentId);
  if (!person) return { error: "They're not here." };
  if (life.money < 10) return { error: "A favour costs $10." };
  const next = passTime({ ...life, money: life.money - 10 }, 20);
  const cast = next.cast.map((item) => (item.id === residentId ? { ...item, bond: clamp(item.bond + 4, 0, 100) } : item));
  return { life: pushLog({ ...next, cast }, `You did ${person.name} a favour.`) };
}

export function addPlan(life: Life, plan: { day: number; place: PlaceId; withId: string; note: string }): Life {
  const next: Plan = {
    id: `plan-${life.plans.length}-${plan.day}`,
    day: clamp(Math.round(plan.day), life.day, life.day + 30),
    place: plan.place,
    withId: plan.withId,
    note: clip(plan.note, 120),
  };
  return { ...life, plans: [...life.plans, next].slice(-12) };
}

export function removePlan(life: Life, id: string): Life {
  return { ...life, plans: life.plans.filter((plan) => plan.id !== id) };
}

export function plansToday(life: Life) {
  return (life.plans ?? []).filter((plan) => plan.day === life.day);
}

export function addNpc(life: Life, card: CardSketch): Life {
  if (!life.modules?.npcs) return life;
  if (life.cast.length >= 8) return life;
  const person = sketchResident(card, life.cast.length);
  return pushLog({ ...life, cast: [...life.cast, person] }, `${person.name} is new around Millbrook.`);
}

const LOCAL_NPCS: Omit<CardSketch, "id">[] = [
  { name: "June Pell", summary: "Keeps the clinic calendar.", personality: "Practical. Talks with her hands.", description: "Cardigan, reading glasses." },
  { name: "Marcus Hale", summary: "Fixes bikes behind the market.", personality: "Patient, a little sarcastic.", description: "Grease on one cuff." },
  { name: "Lila Cho", summary: "Shelves the returns at the library.", personality: "Soft voice, sharp memory.", description: "Ink on her thumb." },
  { name: "Owen Briggs", summary: "Plays the late set when the diner allows it.", personality: "Easy grin, restless.", description: "Worn jacket." },
  { name: "Rita Sol", summary: "Knows who owes what at the market.", personality: "Direct, fair.", description: "Apron over a dark dress." },
  { name: "Ned Park", summary: "Walks the same loop every morning.", personality: "Quiet, notices the weather.", description: "Cap, old boots." },
];

export function localNpc(life: Life): CardSketch | null {
  const taken = new Set(life.cast.map((person) => person.name.toLowerCase()));
  const found = LOCAL_NPCS.find((item) => !taken.has(item.name.toLowerCase()));
  if (!found) return null;
  const slug = found.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { ...found, id: `npc-${slug}` };
}

export function npcBrief(life: Life) {
  const names = life.cast.map((person) => person.name).join(", ") || "none yet";
  return {
    system: "Invent one original resident of a modern small town called Millbrook. Reply with exactly three lines: Name: ... Personality: ... Summary: ... No markdown.",
    user: `People already here: ${names}. Do not reuse a name.`,
  };
}

export function parseNpc(text: string): CardSketch | null {
  const name = text.match(/Name:\s*(.+)/i)?.[1]?.split(/[.\n]/)[0]?.trim() ?? "";
  if (name.length < 2) return null;
  const personality = text.match(/Personality:\s*(.+)/i)?.[1]?.trim() ?? "";
  const summary = text.match(/Summary:\s*(.+)/i)?.[1]?.trim() ?? "";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "someone";
  return { id: `npc-${slug}`, name: clip(name, 80), summary: clip(summary, 240), personality: clip(personality, 500), description: "" };
}

export function guideFor(life: Life) {
  const entries = [
    { title: "Clock", body: "Walking, eating, work, and scenes move the clock. Places keep hours. Sleep at home jumps you to 7:30." },
    { title: "Needs", body: "Hunger rises and energy falls as time passes. Eat in town or at home. Sit at the park. Sleep fills you back up." },
    { title: "Edit", body: "The Edit app changes your name, the clock, money, needs, job, home, modules, and each person. Rename someone by hand, or copy the name from their card." },
    { title: "Job and rent", body: "Ask at Millbrook Office. One shift a day, at that job's place. Rent leaves the drawer every week unless you own the place. If you are short, it goes on a tab." },
    { title: "Dating", body: "Ask someone out once they know you. Shy people need longer. Moving in, a proposal, a wedding, and staying the night happen in a scene. A wedding needs your home or the park, and $40. A faithful person will not open the relationship. A jealous one takes a second date harder." },
    { title: "News", body: "The paper comes out Monday morning. It prints what the town passed along." },
    { title: "Pictures", body: "Take a picture of a scene, or turn on Paint scenes. Outfits you write in Edit are part of the picture. Without a NovelAI token, the moment stays a printed card." },
  ];
  if (life.modules?.jobs) entries.push({ title: "More jobs", body: "At the office you can take the shop, deliveries, an evening gig at the diner, or work from home. Quit from the same board." });
  if (life.modules?.weather) entries.push({ title: "Weather", body: "The sky is on the clock. A storm makes a walk or a bike ride slower. A car ignores it and costs $2 a trip." });
  if (life.modules?.districts) entries.push({ title: "Wider town", body: "Hillcrest, the clinic, the garage, the library, and the venue keep their own hours." });
  if (life.modules?.calendar) entries.push({ title: "Calendar", body: "Put a plan on the phone. An outing is a longer scene than a visit." });
  if (life.modules?.birthdays) entries.push({ title: "Birthdays", body: "Each person has a day in the year. Edit can move it. That morning they text you." });
  if (life.modules?.cooking) entries.push({ title: "Cooking", body: "At home, Cook spends $6 and fills you more than the cupboard." });
  if (life.modules?.homes) entries.push({ title: "Homes", body: "Buy a cottage for $800 or a townhouse for $1400. Rent stops. The town hears about it." });
  if (life.modules?.opinions) entries.push({ title: "Opinions", body: "After a scene, someone who knows you may text about it." });
  if (life.modules?.npcs) entries.push({ title: "New people", body: "Meet someone new adds a person the model invents, up to eight in town. Edit them like anyone else." });
  if (life.modules?.bills) entries.push({ title: "Bills", body: "Utilities add $15 to the weekly bill. If the tab reaches $120, you pay some of it before leaving home." });
  if (life.vehicle !== "walk") entries.push({ title: "Getting around", body: life.vehicle === "bike" ? "The bike shortens a trip." : "The car is the short trip, and costs $2 in gas." });
  return entries;
}

export function normalizeLife(input: Life): Life {
  const blank = createLife({ id: input.id, title: input.title || "Millbrook", playerName: input.playerName || "You", playerNote: input.playerNote || "", cast: [], now: input.createdAt });
  const cast = (input.cast ?? []).map((person, index) => ({
    ...sketchResident(
      { id: person.id, name: person.name, summary: person.summary ?? "", personality: person.personality ?? "", description: person.description ?? "" },
      index,
    ),
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
    birthday: typeof person.birthday === "number" ? person.birthday : 8 + (index % 12) * 9,
    bond: typeof person.bond === "number" ? person.bond : 8,
  }));
  const job = input.job ? { ...FRONT_DESK, ...input.job, kind: input.job.kind || "desk", place: input.job.place || "office" } : null;
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
    modules: { ...MODULES_OFF, ...input.modules },
    vehicle: input.vehicle ?? "walk",
    home: input.home ?? "apartment",
    paintScenes: input.paintScenes === true,
    log: input.log ?? blank.log,
    needs: input.needs ?? blank.needs,
  };
}
