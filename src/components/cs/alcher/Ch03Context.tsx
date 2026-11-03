import { Chapter, ChapterEnd } from "../Primitives";
import { Opener } from "./Story";
import { PixelBox, PixelText, Plate, Slot, Tick } from "./Pixel";
import s from "./Ch03Context.module.css";

/** 03 · Context (Figma 504:66888): opener, the festival / why an app / brief
 *  panel, and the "Four editions, four teams" figure. */

const columns = [
  {
    title: "The festival",
    items: [
      "Day 0 to Day 3: an inauguration and a classical night, then three days of 80+ events and competitions across the IIT Guwahati campus",
      "10,000+ footfall: campus residents, the city, and teams from 500+ colleges",
      "A pronite every night — Blitzkrieg, Juggernaut, Crescendo — and competitions all day",
    ],
  },
  {
    title: "Why an app",
    items: [
      "Schedules shift by the hour; posters and Instagram can’t keep up",
      "Venues are spread across a large campus most visitors don’t know",
      "Passes, merch and entry all run through the same four days",
    ],
  },
  {
    title: "The brief for ’25",
    items: [
      "01 Keep: everything ’24 shipped — search, schedule, map, passes, merch",
      "02 Fix: late alerts, and a campus nobody can picture",
      "03 Add: a reason to open it between events",
      "04 Ship before Day 1, in the ’25 theme",
    ],
  },
];

const levels = [
  {
    year: "’22",
    title: "Set the template",
    body: "Schedule, pronites and passes in one app. The shape every edition since has kept.",
  },
  {
    year: "’23",
    title: "The information existed",
    body: "Uncategorised and hard to find: no search, nothing on stalls or transport. The baseline ’24 audited.",
  },
  {
    year: "’24",
    title: "Made events findable",
    body: "Search and filters, categorised explore, liked events with reminders, directions in every sheet, merch checkout. 2.5K+ downloads.",
  },
  {
    year: "’25",
    title: "Gave people a reason to come back",
    body: "Every ’24 feature, in an 8-bit system with XP, levels, achievements and a leaderboard on top.",
  },
];

const kept = ["Search and filters", "Liked events with reminders", "Directions in every event sheet", "Merch checkout", "Passes"];
const added = [
  "8-bit system",
  "XP for showing up",
  "Levels",
  "12 achievements",
  "Fest-wide leaderboard",
  "Lineup reveal",
  "Front-row passes",
];

/** ’ inside Brick Pixel text. Brick Pixel has no curly quotes; Figma draws
 *  them with its fallback face (a slanted wedge, 0.175em advance). Draw that
 *  wedge so the pixel digits/letters land where Figma puts them. */
function Apos() {
  return (
    <>
      <span className={s.apos} aria-hidden="true">
        <svg viewBox="0 0 175 750" preserveAspectRatio="none">
          <path fill="currentColor" d="M69 33H153L86 281H14Z" />
        </svg>
      </span>
      <span className="visually-hidden">’</span>
    </>
  );
}

/** Red pixel flag on the ’25 card (28 × 36). */
function Flag() {
  return (
    <svg className={s.flag} width="28" height="36" viewBox="0 0 28 36" aria-hidden="true">
      <path fill="#1d2b53" d="M0 0h4v36H0z" />
      <path fill="#ff004d" d="M4 0h24v8H4zM4 8h16v8H4zM4 16h8v8H4z" />
    </svg>
  );
}

function Inventory({ title, items, kind }: { title: string; items: string[]; kind: "kept" | "added" }) {
  const edge = kind === "kept" ? "dim" : "blue";
  return (
    <PixelBox tone="blue" className={`${s.inventory} ${kind === "added" ? s.added : ""}`}>
      <h4 className={s.invTitle}>{title}</h4>
      <ul className={s.invList}>
        {items.map((t) => (
          <Slot as="li" key={t} edge={edge} className={s.invSlot}>
            {t}
          </Slot>
        ))}
        <Slot as="li" edge="dim" className={`${s.invSlot} ${s.invEmpty}`} aria-hidden="true">
          —
        </Slot>
      </ul>
    </PixelBox>
  );
}

export function Ch03Context() {
  return (
    <Chapter id="context" label="Context" className={s.chapter}>
      <Opener eyebrow="Context" title="A four-day festival, rebuilt as an app every year by a new team." />

      <PixelBox tone="blue" as="section" className={s.facts} aria-label="The festival, the app, the brief">
        {columns.map((c) => (
          <div key={c.title} className={s.factCol}>
            <h3 className={s.factTitle}>{c.title}</h3>
            <ul className={s.factList}>
              {c.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </PixelBox>

      <figure className={s.figure} aria-labelledby="alcher-editions-title">
        <PixelBox tone="dark" className={s.stage}>
          <div className={s.plateWrap}>
            <Plate as="h3">
              <span id="alcher-editions-title">FOUR EDITIONS, FOUR TEAMS</span>
            </Plate>
          </div>
          <p className={s.caption}>Each one kept the template and fixed the thing the last one couldn’t.</p>

          <ol className={s.levels}>
            {levels.map((l, i) => {
              const now = i === levels.length - 1;
              return (
                <PixelBox as="li" key={l.year} tone={now ? "gold" : "blue"} className={`${s.level} ${now ? s.now : ""}`}>
                  <span className={s.node} aria-hidden="true" />
                  <div className={s.levelHead}>
                    <PixelText as="h4" className={s.year}>
                      <Apos />
                      {l.year.slice(1)}
                    </PixelText>
                    {now ? (
                      <Flag />
                    ) : (
                      <Slot className={s.done}>
                        <Tick className={s.doneTick} />
                        <span className="visually-hidden">Shipped</span>
                      </Slot>
                    )}
                  </div>
                  <p className={s.levelTitle}>{l.title}</p>
                  <p className={s.levelBody}>{l.body}</p>
                </PixelBox>
              );
            })}
          </ol>

          <div className={s.inventories}>
            <Inventory title="KEPT FROM ’24" items={kept} kind="kept" />
            <Inventory title="ADDED IN ’25" items={added} kind="added" />
          </div>

          <p className={s.source}>Source: my audit of the ’22–’24 apps, and the ’24 Play Store listing.</p>
        </PixelBox>
      </figure>

      <ChapterEnd>Here’s what the ’24 app got wrong.</ChapterEnd>
    </Chapter>
  );
}
