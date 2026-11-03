import type { CSSProperties } from "react";
import { Chapter, ChapterEnd } from "../Primitives";
import { PixelBox, Plate } from "./Pixel";
import { Opener } from "./Story";
import s from "./Ch08Shaping.module.css";

/**
 * 08 · Shaping the app (Figma 504:67387, 1020 × 2670): opener, the
 * information architecture tree (HTML/CSS, reflows to the column) and the
 * low-fidelity wireframes.
 */

const IMG = "/cs/alcheringa-25/img";

type Leaf = { n: string; label: string; sub?: Leaf[] };
type Level = {
  n: string;
  label: string;
  /** Figma: card 145 wide with centred content (else hugs) */
  wide?: boolean;
  /** Figma: 46 tall card (else 49) */
  short?: boolean;
  /** Figma height of the level band (top of this card to the next) */
  h: number;
  /** Figma y of the branch line below the card top */
  ly?: number;
  /** Row is wider than the column in Figma: tighten and spread */
  fill?: boolean;
  items?: Leaf[];
};

const onboarding: Level = {
  n: "0.0",
  label: "Onboarding",
  wide: true,
  short: true,
  h: 128,
  ly: 24,
  fill: true,
  items: [
    { n: "0.1", label: "Loading" },
    { n: "0.2", label: "Welcome" },
    { n: "0.3", label: "Meet Pixel" },
    { n: "0.4", label: "Earn XP" },
    { n: "0.5", label: "Notifications" },
    { n: "0.6", label: "Skip → Log in" },
  ],
};

/** Reached from Sign up / Log in (the sidebar). */
const account = [
  { n: "7.0", label: "Profile" },
  { n: "8.0", label: "Merch & cart" },
  { n: "9.0", label: "Passes" },
  { n: "10.0", label: "Settings" },
];

const levels: Level[] = [
  { n: "1.1", label: "Profile setup", wide: true, h: 129 },
  {
    n: "2.0",
    label: "Home",
    h: 161,
    ly: 19,
    fill: true,
    items: [
      { n: "2.1", label: "Lineup reveal" },
      { n: "2.2", label: "Merch drop" },
      { n: "2.3", label: "Alcher pass" },
      { n: "2.4", label: "Picked for you" },
      { n: "2.5", label: "Search", sub: [{ n: "2.5.1", label: "Filters" }] },
      { n: "2.6", label: "Notifications" },
    ],
  },
  {
    n: "3.0",
    label: "Activity",
    wide: true,
    short: true,
    h: 206,
    ly: 17,
    items: [
      {
        n: "3.1",
        label: "Events",
        sub: [
          { n: "3.1.1", label: "Artist detail" },
          { n: "3.1.2", label: "Event detail" },
          { n: "3.1.3", label: "Add to day" },
        ],
      },
      {
        n: "3.2",
        label: "Competitions",
        sub: [
          { n: "3.2.1", label: "Register team" },
          { n: "3.2.2", label: "Success" },
          { n: "3.2.3", label: "Leaderboard" },
        ],
      },
      { n: "3.3", label: "Stalls" },
      { n: "3.4", label: "Rate stall" },
    ],
  },
  {
    n: "4.0",
    label: "Schedule",
    h: 132,
    ly: 20,
    items: [
      { n: "4.1", label: "Your day" },
      { n: "4.2", label: "Reminders" },
    ],
  },
  {
    n: "5.0",
    label: "Map",
    h: 176,
    ly: 15,
    items: [
      { n: "5.1", label: "Campus map" },
      {
        n: "5.2",
        label: "Directions",
        sub: [
          { n: "5.2.1", label: "Location access" },
          { n: "5.2.2", label: "Walking route" },
        ],
      },
    ],
  },
  {
    n: "6.0",
    label: "Utility",
    h: 58,
    ly: 10,
    fill: true,
    items: [
      { n: "6.1", label: "Passes" },
      { n: "6.2", label: "Orders" },
      { n: "6.3", label: "Leaderboard" },
      { n: "6.4", label: "Sponsors" },
      { n: "6.5", label: "Help" },
    ],
  },
];

function Card({ n, label, wide, short, active }: { n: string; label: string; wide?: boolean; short?: boolean; active?: boolean }) {
  return (
    <span
      className={`${s.card} ${wide ? s.wide : ""} ${short ? s.short : ""} ${active ? s.active : ""}`}
    >
      <span className={s.num}>{n}</span>
      <span>{label}</span>
    </span>
  );
}

function Leaves({ items, fill }: { items: Leaf[]; fill?: boolean }) {
  return (
    <ul className={`${s.branch} ${fill ? s.fill : ""}`}>
      {items.map((it) => (
        <li key={it.n} className={s.leaf}>
          <span className={s.num}>{it.n}</span>
          {it.label}
          {it.sub && (
            <ul className={s.sub}>
              {it.sub.map((c) => (
                <li key={c.n}>
                  <span className={s.num}>{c.n}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function LevelRow({ level, spine = true }: { level: Level; spine?: boolean }) {
  return (
    <li
      className={s.level}
      style={{ "--h": level.h, "--ly": `${level.ly ?? 0}px` } as CSSProperties}
    >
      <div className={`${s.node} ${spine ? s.onSpine : ""}`}>
        <Card n={level.n} label={level.label} wide={level.wide} short={level.short} />
      </div>
      {level.items && <Leaves items={level.items} fill={level.fill} />}
    </li>
  );
}

const wireframes = [
  {
    key: "a",
    badge: "A",
    title: "Map-first Home",
    body: "The campus map is the Home and events are pins. Good on fest day, empty the week before: nothing to come back to.",
    alt: "Grey-box wireframe A: the campus map fills the Home screen under a map search bar, with two event cards along the bottom and a tab bar.",
  },
  {
    key: "b",
    badge: "B",
    title: "Card-first Home",
    body: "A stack of cards: lineup reveal, your pass, merch. Something new each day, and the map still one tap away.",
    alt: "Grey-box wireframe B: a carousel of cards at the top of Home, a segmented control, and a row of content tiles below.",
    shipped: true,
  },
  {
    key: "c",
    badge: "C",
    title: "Card-first, main card open",
    body: "The main card expands in place, so the day’s headline act and your next event are the first things you read.",
    alt: "Grey-box wireframe C: the same card-first Home with the main card expanded in place, showing more detail beneath it.",
  },
];

export function Ch08Shaping() {
  return (
    <Chapter id="shaping" label="Shaping the app">
      <Opener
        eyebrow="Shaping the app"
        title="Same structure as ’24 underneath, so nobody had to relearn the app."
        introTitle="Information architecture"
        intro={
          <p>
            Five tabs with Home in the middle: Map, Schedule, Home, Activity and Utility. A sidebar holds passes,
            orders, the leaderboard, sponsors and settings. Gamification lives inside these sections (XP on Home and
            Profile, the leaderboard under Utility and Competitions), never as a tab of its own.
          </p>
        }
      />

      <figure className={s.ia} aria-label="Information architecture of the Alcheringa ’25 app">
        <ul className={s.levels}>
          <LevelRow level={onboarding} spine={false} />
        </ul>
        <ul className={`${s.levels} ${s.spine}`}>
          <li className={`${s.level} ${s.accountLevel}`} style={{ "--h": 140 } as CSSProperties}>
            <div className={`${s.node} ${s.onSpine}`}>
              <Card n="1.0" label="Sign up / Log in" wide active />
            </div>
            <ul className={s.cardsRow}>
              {account.map((c) => (
                <li key={c.n}>
                  <span className={s.arrow} aria-hidden="true" />
                  <Card n={c.n} label={c.label} />
                </li>
              ))}
            </ul>
          </li>
          {levels.map((l) => (
            <LevelRow key={l.n} level={l} />
          ))}
        </ul>
      </figure>

      <section className={s.wire} aria-labelledby="shaping-wireframes">
        <div className={s.wireHead}>
          <h3 id="shaping-wireframes" className={s.wireTitle}>
            Low-fidelity wireframes
          </h3>
          <p className={s.wireLead}>
            I wireframed the core screens before any pixel art, to make sure the utility worked at grey-box level.
            Gamification went only where a screen had already earned its place.
          </p>
        </div>
        <figure className={s.figure}>
          <Plate as="figcaption" className={s.plate}>
            LOW-FIDELITY WIREFRAMES: THE HOME DECISION
          </Plate>
          <PixelBox tone="dark" className={s.stage}>
            <p className={s.stageTitle}>
              Two Homes at grey-box: map-first and card-first. Card-first won; the map became a tab.
            </p>
            <ul className={s.frames}>
              {wireframes.map((w) => (
                <li key={w.key} className={s.frame}>
                  <h4 className={s.frameHead}>
                    <span className={`${s.badge} ${w.shipped ? s.badgeOn : ""}`} aria-hidden="true">
                      {w.badge}
                    </span>
                    <span className={s.srOnly}>{w.badge}: </span>
                    {w.title}
                  </h4>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={s.frameImg}
                    src={`${IMG}/shaping-wireframe-${w.key}.webp`}
                    alt={w.alt}
                    width={225}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                  <p className={s.frameBody}>{w.body}</p>
                </li>
              ))}
            </ul>
            <p className={s.source}>Three of the grey-box screens. B shipped; A became the Map tab.</p>
          </PixelBox>
        </figure>
      </section>

      <ChapterEnd>Then the pixels went on.</ChapterEnd>
    </Chapter>
  );
}
