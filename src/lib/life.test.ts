import assert from "node:assert/strict";
import test from "node:test";
import {
  FRONT_DESK,
  MODULES_OFF,
  RENT,
  START_MONEY,
  afterTalk,
  buyHome,
  canCourt,
  canWork,
  clockLabel,
  cook,
  createLife,
  eat,
  editResident,
  finishCourtship,
  guideFor,
  hire,
  localNpc,
  normalizeLife,
  parseNpc,
  peopleHere,
  sleep,
  takeJob,
  travel,
  weekday,
  workShift,
  type Life,
} from "./life.ts";

function life(patch: Partial<Life> = {}): Life {
  return {
    ...createLife({
      id: "life-test",
      title: "Millbrook",
      playerName: "Ivo",
      playerNote: "New in town.",
      cast: [
        { id: "ada", name: "Ada", summary: "Runs the counter.", personality: "Dry, kind.", description: "Apron, short hair." },
        { id: "ben", name: "Ben", summary: "Walks the pond.", personality: "Quiet.", description: "Tall, coat." },
      ],
      now: 1,
    }),
    ...patch,
  };
}

test("a new morning starts at home with rent a week out", () => {
  const started = life();
  assert.equal(started.minute, 8 * 60);
  assert.equal(started.place, "home");
  assert.equal(started.money, START_MONEY);
  assert.equal(started.rentDay, 8);
  assert.equal(started.cast[0]?.hangout, "cafe");
  assert.equal(started.cast[1]?.hangout, "park");
  assert.equal(clockLabel(0), "12:00 AM");
  assert.equal(clockLabel(15 * 60 + 5), "3:05 PM");
});

test("an hour costs energy and adds hunger", () => {
  const next = travel(life({ minute: 10 * 60 }), "cafe").life;
  assert.ok(next);
  assert.equal(next.place, "cafe");
  assert.equal(next.minute, 10 * 60 + 20);
  assert.equal(next.needs.energy, 78);
  assert.equal(next.needs.hunger, 28);
});

test("a closed door does not move you", () => {
  const step = travel(life({ minute: 6 * 60 }), "office");
  assert.equal(step.life, undefined);
  assert.match(step.error ?? "", /closed/);
});

test("people are only at their hangout while it is open", () => {
  const morning = life({ place: "cafe", minute: 10 * 60 });
  assert.deepEqual(peopleHere(morning).map((person) => person.name), ["Ada"]);
  assert.deepEqual(peopleHere({ ...morning, place: "park" }).map((person) => person.name), ["Ben"]);
  assert.deepEqual(peopleHere({ ...morning, minute: 21 * 60 }), []);
});

test("the cupboard is free and the cafe is not", () => {
  const home = eat(life()).life;
  assert.ok(home);
  assert.equal(home.money, START_MONEY);
  assert.equal(home.needs.hunger, 25 + 4 - 28);
  const broke = eat(life({ place: "cafe", money: 3, minute: 10 * 60 }));
  assert.match(broke.error ?? "", /\$8/);
});

test("sleep lands at 7:30 and rent comes out on the due morning", () => {
  const first = sleep(life({ day: 2, money: 50, needs: { energy: 10, hunger: 40 } }));
  assert.equal(first.day, 3);
  assert.equal(first.minute, 7 * 60 + 30);
  assert.equal(first.money, 50);
  assert.equal(first.needs.energy, 100);
  assert.equal(first.place, "home");
  const due = sleep(life({ day: 7, money: 50 }));
  assert.equal(due.day, 8);
  assert.equal(due.money, 50 - RENT);
  assert.equal(due.rentDay, 15);
  const short = sleep(life({ day: 7, money: 10 }));
  assert.equal(short.money, 0);
  assert.equal(short.debt, 30);
});

test("the front desk hires once and pays once a day", () => {
  const hired = hire(life({ place: "office", minute: 10 * 60 })).life;
  assert.ok(hired?.job);
  assert.equal(hired.job?.wage, FRONT_DESK.wage);
  assert.equal(hired.minute, 10 * 60 + 40);
  const shift = workShift({ ...hired, minute: 9 * 60, workedDay: 0, day: 2 }).life;
  assert.ok(shift);
  assert.equal(shift.money, hired.money + FRONT_DESK.wage);
  assert.equal(shift.minute, 17 * 60);
  assert.equal(shift.workedDay, 2);
  assert.equal(canWork(shift), false);
  assert.match(workShift(shift).error ?? "", /already/);
});

test("a scene keeps the old bond and writes a memory", () => {
  const talked = afterTalk(life({ place: "cafe", minute: 10 * 60 }), "ada", "Morning.", "Ada slides a cup over.");
  const ada = talked.cast.find((person) => person.id === "ada");
  assert.equal(ada?.bond, 12);
  assert.match(ada?.memories[0] ?? "", /Morning/);
  assert.equal(talked.sceneWith, "Ada");
  assert.equal(talked.minute, 10 * 60 + 40);
  assert.equal(talked.cast.find((person) => person.id === "ben")?.bond, 8);
  assert.equal(talked.texts[0]?.from, "Ada");
});

test("asking someone out is a scene, and a partner who has not agreed gets jealous", () => {
  const started = life({ place: "cafe", minute: 10 * 60 });
  const cast = started.cast.map((person) =>
    person.id === "ada" ? { ...person, bond: 20 } : { ...person, relation: "dating" as const, bond: 30 },
  );
  const asked = finishCourtship({ ...started, cast }, "ada", "date", "Come with me.", "Ada says yes.");
  assert.equal(asked.error, undefined);
  assert.equal(asked.life?.cast.find((person) => person.id === "ada")?.relation, "dating");
  assert.equal(asked.life?.cast.find((person) => person.id === "ben")?.bond, 18);
  assert.match(asked.life?.rumors.join(" ") ?? "", /did not take it well/);
  assert.equal(canCourt({ ...started, cast }, "ada", "date"), null);
  const cold = canCourt(life(), "ada", "date");
  assert.match(cold ?? "", /isn't ready/);
});

test("a wedding waits until every partner has agreed, and moving in puts them home at night", () => {
  const started = life({ place: "park", minute: 11 * 60, money: 80 });
  const cast = started.cast.map((person) =>
    person.id === "ada"
      ? { ...person, relation: "engaged" as const, bond: 70 }
      : { ...person, relation: "dating" as const, bond: 40, open: false },
  );
  const blocked = finishCourtship({ ...started, cast }, "ada", "marry", "", "Vows.");
  assert.match(blocked.error ?? "", /hasn't agreed/);
  const opened = finishCourtship({ ...started, cast }, "ben", "open", "", "Ben shrugs.");
  assert.equal(opened.life?.cast.find((person) => person.id === "ben")?.open, true);
  const married = finishCourtship(opened.life ?? started, "ada", "marry", "", "They marry under the trees.");
  assert.equal(married.life?.cast.find((person) => person.id === "ada")?.relation, "married");
  assert.equal(married.life?.money, 40);
  const moving = finishCourtship(
    { ...started, cast: cast.map((person) => (person.id === "ada" ? { ...person, relation: "dating" as const, bond: 50 } : person)) },
    "ada",
    "movein",
    "",
    "Ada brings a bag.",
  );
  const ada = moving.life?.cast.find((person) => person.id === "ada");
  assert.equal(ada?.movedIn, true);
  assert.equal(peopleHere({ ...(moving.life as Life), place: "home", minute: 20 * 60 }).some((person) => person.id === "ada"), true);
  assert.equal(peopleHere({ ...(moving.life as Life), place: "home", minute: 12 * 60 }).some((person) => person.id === "ada"), false);
});

test("Monday's paper prints the rumors, and older saves still open", () => {
  const monday = sleep(life({ day: 7, money: 80, rumors: ["Ada was seen with Ivo at the cafe."] }));
  assert.equal(monday.day, 8);
  assert.equal(weekday(monday.day), "Monday");
  assert.match(monday.papers[0]?.headline ?? "", /Ada/);
  assert.equal(monday.rumors.length, 0);
  assert.equal(monday.texts.at(-1)?.from, "Millbrook News");
  const old = normalizeLife({ id: "old", title: "Old", playerName: "Ivo", day: 3, minute: 600 } as Life);
  assert.equal(old.rumors.length, 0);
  assert.equal(old.cast.length, 0);
  assert.equal(old.paintScenes, false);
  assert.equal(old.vehicle, "walk");
  assert.equal(old.home, "apartment");
  assert.equal(old.modules.jobs, false);
});

test("a bike is a shorter trip, and a tab only locks the door when bills are on", () => {
  const rode = travel(life({ minute: 10 * 60, vehicle: "bike" }), "cafe").life;
  assert.ok(rode);
  assert.equal(rode.minute, 10 * 60 + 12);
  const locked = travel(life({ debt: 120, modules: { ...MODULES_OFF, bills: true } }), "cafe");
  assert.match(locked.error ?? "", /eviction/);
  const free = travel(life({ debt: 120, minute: 10 * 60 }), "cafe");
  assert.equal(free.life?.place, "cafe");
});

test("shy people wait longer, and a faithful person will not open the relationship", () => {
  const started = life();
  const shy = {
    ...started,
    cast: started.cast.map((person) => (person.id === "ada" ? { ...person, bond: 20, traits: ["shy" as const] } : person)),
  };
  assert.match(canCourt(shy, "ada", "date") ?? "", /isn't ready/);
  const ready = {
    ...shy,
    cast: shy.cast.map((person) => (person.id === "ada" ? { ...person, bond: 24 } : person)),
  };
  assert.equal(canCourt(ready, "ada", "date"), null);
  const faithful = {
    ...started,
    cast: started.cast.map((person) => (person.id === "ada" ? { ...person, relation: "dating" as const, traits: ["faithful" as const] } : person)),
  };
  assert.match(canCourt(faithful, "ada", "open") ?? "", /between you/);
});

test("owning a home skips rent, bills add to the week, and a birthday is a text", () => {
  const owned = sleep(life({ day: 7, money: 50, home: "cottage" }));
  assert.equal(owned.money, 50);
  const billed = sleep(life({ day: 7, money: 80, modules: { ...MODULES_OFF, bills: true } }));
  assert.equal(billed.money, 80 - RENT - 15);
  const started = life();
  const morning = sleep({
    ...started,
    modules: { ...started.modules, birthdays: true },
    cast: started.cast.map((person) => (person.id === "ada" ? { ...person, birthday: 2 } : person)),
  });
  assert.equal(morning.texts.some((text) => text.from === "Ada" && /birthday/i.test(text.body)), true);
});

test("edits, cooking, and the job board change the life", () => {
  const renamed = editResident(life(), "ada", { name: "Adelaide", traits: ["shy"], outfit: "red coat" });
  assert.equal(renamed.cast[0]?.name, "Adelaide");
  assert.deepEqual(renamed.cast[0]?.traits, ["shy"]);
  assert.equal(renamed.cast[0]?.outfit, "red coat");
  assert.match(cook(life()).error ?? "", /cooking/i);
  const cooked = cook({ ...life(), modules: { ...MODULES_OFF, cooking: true } }).life;
  assert.ok(cooked);
  assert.equal(cooked.money, START_MONEY - 6);
  assert.equal(cooked.needs.hunger, 0);
  assert.match(takeJob(life({ place: "office", minute: 10 * 60 }), "shop").error ?? "", /more jobs/i);
  const desk = takeJob(life({ place: "office", minute: 10 * 60 }), "desk").life;
  assert.equal(desk?.job?.title, FRONT_DESK.title);
  const shop = takeJob(life({ place: "office", minute: 10 * 60, modules: { ...MODULES_OFF, jobs: true } }), "shop").life;
  assert.equal(shop?.job?.place, "market");
  const bought = buyHome(life({ place: "home", money: 900, modules: { ...MODULES_OFF, homes: true } }), "cottage").life;
  assert.equal(bought?.home, "cottage");
  assert.equal(bought?.money, 100);
  assert.equal(localNpc(life())?.name, "June Pell");
  assert.equal(parseNpc("Name: Tess Quinn\nPersonality: Dry.\nSummary: Sells pies.")?.name, "Tess Quinn");
  assert.equal(guideFor(life()).some((entry) => entry.title === "Cooking"), false);
  assert.equal(guideFor(life({ modules: { ...MODULES_OFF, cooking: true } })).some((entry) => entry.title === "Cooking"), true);
});

