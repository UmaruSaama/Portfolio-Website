import type { CSSProperties, ReactNode } from "react";
import { Chapter, ChapterEnd } from "../Primitives";
import cs from "../cs.module.css";
import { PixelBox, Plate } from "./Pixel";
import { Opener } from "./Story";
import s from "./Ch08Shaping.module.css";

/**
 * 08 · Shaping the app (Figma 504:67387, 1020 × 2670): opener, the
 * information architecture tree (HTML/CSS, reflows to the column) and the
 * low-fidelity wireframes.
 */

const IMG = "/cs/alcheringa-25/img";

/*
 * IA geometry is Figma's (frame "Information architecture", 1121 × 1160,
 * runs 101px past the column at 1440). x values are Figma x inside the
 * column and scale with --v; y values are px. Each level is a band from its
 * card's top to the next card's top. Leaf rows keep Figma's leaf boxes, dot
 * positions and line spans at 1440 and wrap when a narrower viewport can't
 * fit them.
 */
type Sub = { n: string; label: string };
type Leaf = {
  n: string;
  label: string;
  /** Figma leaf box x (column coords) and width */
  x: number;
  w: number;
  /** Figma dot x (outer edge incl. stroke) and top relative to the line */
  dot: number;
  dy?: number;
  /** label gap after the number (Figma 10, "5.1" uses 3) */
  gap?: number;
  sub?: Sub[];
};
type Branch = {
  /** line top within the band, line end x (it always starts at x 161) */
  top: number;
  end: number;
  /** text top below the line top */
  text: number;
  leaves: Leaf[];
};
type Level = {
  n: string;
  label: string;
  /** card width, height, text left and top (Figma) */
  w: number;
  h: number;
  pl: number;
  pt: number;
  /** band height (to the next card) and spine dot top within the band */
  band: number;
  dot?: number;
  branch?: Branch;
};

const onboarding: Level = {
  n: "0.0",
  label: "Onboarding",
  w: 145,
  h: 46,
  pl: 27,
  pt: 15,
  band: 158,
  branch: {
    top: 22,
    end: 1020,
    text: 16,
    leaves: [
      { n: "0.1", label: "Loading", x: 201, w: 127, dot: 224 },
      { n: "0.2", label: "Welcome", x: 328, w: 137, dot: 348 },
      { n: "0.3", label: "Meet Pixel", x: 465, w: 143, dot: 461 },
      { n: "0.4", label: "Earn XP", x: 608, w: 128, dot: 601 },
      { n: "0.5", label: "Notifications", x: 736, w: 157, dot: 742 },
      { n: "0.6", label: "Skip → Log in", x: 893, w: 165, dot: 867 },
    ],
  },
};

const signup: Level = { n: "1.0", label: "Sign up / Log in", w: 145, h: 60, pl: 18, pt: 22, band: 140, dot: 26 };

/** Reached from Sign up / Log in (the sidebar): Figma card widths. */
const account = [
  { n: "7.0", label: "Profile", w: 110 },
  { n: "8.0", label: "Merch & cart", w: 146 },
  { n: "9.0", label: "Passes", w: 112 },
  { n: "10.0", label: "Settings", w: 125 },
];

const levels: Level[] = [
  { n: "1.1", label: "Profile setup", w: 145, h: 48, pl: 25, pt: 16, band: 129, dot: 17 },
  {
    n: "2.0",
    label: "Home",
    w: 107,
    h: 48,
    pl: 24,
    pt: 16,
    band: 161,
    dot: 14,
    branch: {
      top: 17,
      end: 1066,
      text: 17,
      leaves: [
        { n: "2.1", label: "Lineup reveal", x: 201, w: 162, dot: 224 },
        { n: "2.2", label: "Merch drop", x: 363, w: 152, dot: 368 },
        { n: "2.3", label: "Alcher pass", x: 515, w: 152, dot: 482 },
        { n: "2.4", label: "Picked for you", x: 667, w: 168, dot: 647 },
        { n: "2.5", label: "Search", x: 835, w: 129, dot: 785, sub: [{ n: "2.5.1", label: "Filters" }] },
        { n: "2.6", label: "Notifications", x: 964, w: 157, dot: 925 },
      ],
    },
  },
  {
    n: "3.0",
    label: "Activity",
    w: 145,
    h: 46,
    pl: 39,
    pt: 15,
    band: 206,
    dot: 11,
    branch: {
      top: 15,
      end: 833,
      text: 21,
      leaves: [
        {
          n: "3.1",
          label: "Events",
          x: 201,
          w: 164,
          dot: 224,
          sub: [
            { n: "3.1.1", label: "Artist detail" },
            { n: "3.1.2", label: "Event detail" },
            { n: "3.1.3", label: "Add to day" },
          ],
        },
        {
          n: "3.2",
          label: "Competitions",
          x: 365,
          w: 176,
          dot: 381,
          sub: [
            { n: "3.2.1", label: "Register team" },
            { n: "3.2.2", label: "Success" },
            { n: "3.2.3", label: "Leaderboard" },
          ],
        },
        { n: "3.3", label: "Stalls", x: 541, w: 113, dot: 515 },
        { n: "3.4", label: "Rate stall", x: 654, w: 137, dot: 641 },
      ],
    },
  },
  {
    n: "4.0",
    label: "Schedule",
    w: 125,
    h: 48,
    pl: 24,
    pt: 16,
    band: 132,
    dot: 11,
    branch: {
      top: 18,
      end: 455,
      text: 21,
      leaves: [
        { n: "4.1", label: "Your day", x: 201, w: 134, dot: 224 },
        { n: "4.2", label: "Reminders", x: 335, w: 145, dot: 355, dy: -7 },
      ],
    },
  },
  {
    n: "5.0",
    label: "Map",
    w: 99,
    h: 48,
    pl: 24,
    pt: 16,
    band: 176,
    dot: 8,
    branch: {
      top: 13,
      end: 559,
      text: 21,
      leaves: [
        { n: "5.1", label: "Campus map", x: 201, w: 125, dot: 224, gap: 3 },
        {
          n: "5.2",
          label: "Directions",
          x: 326,
          w: 190,
          dot: 353,
          dy: -4,
          sub: [
            { n: "5.2.1", label: "Location access" },
            { n: "5.2.2", label: "Walking route" },
          ],
        },
      ],
    },
  },
  {
    n: "6.0",
    label: "Utility",
    w: 107,
    h: 48,
    pl: 24,
    pt: 16,
    band: 58,
    dot: 5,
    branch: {
      top: 8,
      end: 1066,
      text: 21,
      leaves: [
        { n: "6.1", label: "Passes", x: 201, w: 121, dot: 224 },
        { n: "6.2", label: "Orders", x: 322, w: 122, dot: 362 },
        { n: "6.3", label: "Leaderboard", x: 444, w: 159, dot: 515 },
        { n: "6.4", label: "Sponsors", x: 603, w: 137, dot: 682 },
        { n: "6.5", label: "Help", x: 740, w: 108, dot: 855 },
      ],
    },
  },
];

type Vars = CSSProperties & Record<`--${string}`, string | number>;

function Card({
  n,
  label,
  w,
  h,
  pl,
  pt,
  active,
}: {
  n: string;
  label: string;
  w: number;
  h: number;
  pl: number;
  pt: number;
  active?: boolean;
}) {
  return (
    <span
      className={`${s.card} ${active ? s.active : ""}`}
      style={{ "--w": `${w}px`, "--h": `${h}px`, "--pl": `${pl}px`, "--pt": `${pt}px` } as Vars}
    >
      {/* Figma number boxes: 17 wide ("10.0": 24), label 10 after */}
      <span className={s.num} style={{ width: n.length > 3 ? 24 : 17 }}>
        {n}
      </span>
      <span>{label}</span>
    </span>
  );
}

function Branch({ b }: { b: Branch }) {
  const first = b.leaves[0];
  const last = b.leaves[b.leaves.length - 1];
  return (
    <ul
      className={s.branch}
      style={{ "--top": `${b.top}px`, "--text": `${b.text}px`, "--len": b.end - 161 } as Vars}
    >
      {b.leaves.map((it) => (
        <li
          key={it.n}
          className={s.leaf}
          style={
            {
              "--lw": it.w,
              "--lx": it === first ? 0 : it.x - 161,
              "--dx": it.dot - it.x,
              "--dy": `${it.dy ?? -5}px`,
              "--gap": `${it.gap ?? 10}px`,
              "--lr": it === last ? it.x + it.w - b.end : 0,
            } as Vars
          }
        >
          <span className={s.num}>{it.n}</span>
          <span className={s.label}>{it.label}</span>
          {it.sub && (
            <ul className={s.sub}>
              {it.sub.map((c) => (
                <li key={c.n}>
                  <span className={`${s.num} ${s.num3}`}>{c.n}</span>
                  <span className={s.label}>{c.label}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function LevelRow({ level, active, children }: { level: Level; active?: boolean; children?: ReactNode }) {
  return (
    <li
      className={s.level}
      style={{ "--band": `${level.band}px`, "--sd": `${level.dot ?? 0}px` } as Vars}
    >
      <div className={s.node}>
        <Card {...level} active={active} />
      </div>
      {level.branch && <Branch b={level.branch} />}
      {children}
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
      <div className={s.opener}>
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
      </div>

      <figure className={s.ia} aria-label="Information architecture of the Alcheringa ’25 app">
        <ul className={`${s.levels} ${s.top}`}>
          <LevelRow level={onboarding} />
        </ul>
        <ul className={`${s.levels} ${s.spine}`}>
          <LevelRow level={signup} active>
            <ul className={s.cardsRow}>
              {account.map((c) => (
                <li key={c.n}>
                  <span className={s.arrow} aria-hidden="true" />
                  <Card n={c.n} label={c.label} w={c.w} h={48} pl={24} pt={16} />
                </li>
              ))}
            </ul>
          </LevelRow>
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
            <ul className={`${s.frames} ${cs.strip}`}>
              {wireframes.map((w) => (
                <li key={w.key} className={`${s.frame} ${cs.stripItem}`}>
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
            <p className={`${cs.stripHint} ${s.stripHint}`} aria-hidden="true">
              Swipe →
            </p>
            <p className={s.source}>Three of the grey-box screens. B shipped; A became the Map tab.</p>
          </PixelBox>
        </figure>
      </section>

      <div className={s.end}>
        <ChapterEnd>Then the pixels went on.</ChapterEnd>
      </div>
    </Chapter>
  );
}
