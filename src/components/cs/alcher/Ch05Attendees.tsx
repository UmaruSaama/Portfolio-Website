import type { CSSProperties } from "react";
import { ChapterEnd, Chapter } from "../Primitives";
import { Opener } from "./Story";
import { PixelBox, Plate } from "./Pixel";
import s from "./Ch05Attendees.module.css";

/**
 * 05 · Meet the attendees (Figma 504:67030). Two persona "character
 * select" panels: portrait card, name card + quote bubble, traits card,
 * then goals and pain points.
 */

/* ---------- pixel portrait (Figma "Portrait – P1 · COMPETES" etc.) ---------- */

/** Sprites: 12 × 14 cells of 14px, one letter per colour ("." = empty). */
type Sprite = { palette: Record<string, string>; rows: string[] };

const competes: Sprite = {
  palette: { a: "#49333b", b: "#ffccaa", c: "#1d2b53", d: "#be1250", e: "#ff77a8", f: "#ffec27" },
  rows: [
    ".....aa.....",
    "....aaaa....",
    "...aaaaaa...",
    "..aaaaaaaa..",
    "..abbbbbba..",
    "..abcbbcba..",
    "..abbbbbba..",
    "...bbddbb...",
    "....bbbb....",
    "..eeeeeeee..",
    ".eeeeffeeee.",
    "eeeeeffeeeee",
    "eeeeeeeeeeee",
    "eeeeeeeeeeee",
  ],
};

const explores: Sprite = {
  palette: { a: "#49333b", b: "#29adff", c: "#ffccaa", d: "#1d2b53", e: "#be1250", f: "#ffa300" },
  rows: [
    "...aaaaaa...",
    "..aaaaaaaa..",
    ".aaaaaaaaaa.",
    "baccccccccab",
    "baccdccdccab",
    "baccccccccab",
    ".accceeccca.",
    ".aaccccccaa.",
    ".aa.cccc.aa.",
    "..ffffffff..",
    ".ffffffffff.",
    "ffffffffffff",
    "ffffffffffff",
    "ffffffffffff",
  ],
};

/** Horizontal runs of one colour → one rect each. */
function spriteRects({ palette, rows }: Sprite) {
  const rects: { x: number; y: number; w: number; fill: string }[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      if (ch !== ".") rects.push({ x, y, w, fill: palette[ch] });
      x += w;
    }
  });
  return rects;
}

/** Star specks (4 × 4, cream @ 0.7) at the same spots in both portraits. */
const stars = [
  [20, 24],
  [200, 40],
  [150, 16],
  [60, 90],
  [220, 110],
  [30, 150],
];

function Portrait({ sprite, label, height }: { sprite: Sprite; label: string; height: number }) {
  return (
    <div className={s.portrait} style={{ height } as CSSProperties}>
      {stars.map(([x, y]) => (
        <span key={`${x}-${y}`} className={s.star} style={{ left: `${(x / 257) * 100}%`, top: y }} aria-hidden="true" />
      ))}
      <svg className={s.sprite} viewBox="0 0 12 14" aria-hidden="true">
        {spriteRects(sprite).map((r) => (
          <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
      </svg>
      <p className={s.ground}>{label}</p>
    </div>
  );
}

/* ---------- cards ---------- */

function BookIcon() {
  return (
    <span className={s.factIcon} aria-hidden="true">
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path
          d="M3 0C1.84 0 .78.33 0 .88V10c.78-.54 1.84-.88 3-.88s2.22.33 3 .88c.78-.54 1.84-.88 3-.88s2.22.33 3 .88V.88C11.22.33 10.16 0 9 0S6.78.33 6 .88C5.22.33 4.16 0 3 0Z"
          stroke="#fff1e8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M6 .88V10" stroke="#fff1e8" strokeWidth="2" />
      </svg>
    </span>
  );
}

/** "→" as Figma draws it (full Hanken Grotesk; the web subset lacks
 *  U+2192 and the fallback arrow is narrower, which changes line breaks). */
function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 15 21" aria-hidden="true">
      <path d="M0.5 10.5H14M8 7l6 3.5-6 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

type Persona = {
  key: string;
  plate: string;
  name: string;
  role: string;
  facts: string[];
  quote: string;
  /** Trait chips, one array per Figma line (wraps further when narrow). */
  chips: string[][];
  need: string;
  answer: string;
  goals: string[];
  pains: string[];
  sprite: Sprite;
  tag: string;
  portraitHeight: number;
};

const personas: Persona[] = [
  {
    key: "a",
    plate: "PERSONA A: THE OUTSTATION PARTICIPANT",
    name: "Ananya Sen",
    role: "Persona A · The outstation participant",
    facts: ["21 years old", "Delhi, India", "Captain of her college dance team"],
    quote: "“We came for Electric Heels. I don’t care about the lineup if I can’t find the stage.”",
    chips: [["Outstation", "Competing"], ["First time on campus"], ["Travels in a team"]],
    need: "Needs the venue and the clock before anything else.",
    answer: "Activity split by day with the venue on every card, and walking directions in the Map tab.",
    goals: [
      "Reach her team’s competition venue on time, every round, on a campus she has never seen.",
      "Catch at least one pronite without missing a call time.",
    ],
    pains: [
      "The venue names mean nothing to her. ’24’s directions get her there; the campus still never makes sense.",
      "A round gets delayed. ’24 sends the alert; nothing helps her re-plan the hour she just got back.",
    ],
    sprite: competes,
    tag: "P1 · COMPETES",
    portraitHeight: 362,
  },
  {
    key: "b",
    plate: "PERSONA B: THE CAMPUS EXPLORER",
    name: "Riya Das",
    role: "Persona B · The campus explorer",
    facts: ["20 years old", "Guwahati, Assam", "Second-year B.Des, IIT Guwahati"],
    quote: "“I’m excited about everything and I have no idea what to go to first.”",
    chips: [["Lives on campus"], ["Here for the nights", "In a group"], ["Phone-first", "Buys merch"], ["Explores everything"]],
    need: "Needs a reason to open the app between events.",
    answer: "A Home that gives her something to do before Day 1, and XP for showing up once it starts.",
    goals: [
      "Explore everything, with friends, and come out with something to show for it.",
      "Know where to start: eighty events is a list, not a plan.",
    ],
    pains: [
      "Overwhelmed by the number of events; ’24’s categories and search helped her find, not choose.",
      "The app never noticed she’d been anywhere, so she stopped opening it.",
    ],
    sprite: explores,
    tag: "P2 · EXPLORES",
    portraitHeight: 491,
  },
];

function PersonaFigure({ p }: { p: Persona }) {
  return (
    <figure className={s.figure} data-persona={p.key}>
      <Plate as="figcaption" className={s.plate}>
        {p.plate}
      </Plate>
      <PixelBox tone="dark" className={s.panel}>

        <div className={s.top}>
          <PixelBox tone="blue" className={s.stack}>
            <Portrait sprite={p.sprite} label={p.tag} height={p.portraitHeight} />
          </PixelBox>

          <div className={s.who}>
            <PixelBox tone="pink" className={s.nameCard}>
              <h3 className={s.name}>{p.name}</h3>
              <p className={s.role}>{p.role}</p>
              <ul className={s.facts}>
                {p.facts.map((f) => (
                  <li key={f}>
                    <BookIcon />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </PixelBox>
            <PixelBox tone="cream" as="blockquote" className={s.quote}>
              <p>{p.quote}</p>
            </PixelBox>
          </div>

          <PixelBox tone="blue" className={s.traits}>
            <ul className={s.chips} aria-label="Traits">
              {p.chips.flatMap((line, l) => [
                ...(l > 0 ? [<li key={`br-${l}`} className={s.break} aria-hidden="true" />] : []),
                ...line.map((c, i) => (
                  <li key={c} className={s.chip} data-first={(l === 0 && i === 0) || undefined}>
                    {c}
                  </li>
                )),
              ])}
            </ul>
            <div className={s.implication}>
              <h4 className={s.label}>Design implication</h4>
              <p className={s.need}>{p.need}</p>
              <p className={s.answer}>
                <Arrow /> {p.answer}
              </p>
            </div>
          </PixelBox>
        </div>

        <div className={s.bottom}>
          <PixelBox tone="blue" className={s.listCard}>
            <h4 className={s.cardTitle}>Goals</h4>
            <ul className={s.list}>
              {p.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </PixelBox>
          <PixelBox tone="blue" className={s.listCard}>
            <h4 className={s.cardTitle}>Pain Points</h4>
            <ul className={s.list}>
              {p.pains.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </PixelBox>
        </div>
      </PixelBox>
    </figure>
  );
}

export function Ch05Attendees() {
  return (
    <Chapter id="attendees" label="Meet the attendees" className={s.chapter}>
      <Opener
        eyebrow="The attendees"
        title="Two attendees, one need: get through four days without missing the thing they came for."
        introTitle="Who I designed for"
        intro={
          <p>
            The ’24 team’s personas and interviews, re-read and extended rather than redone. Split by why they come: to
            compete, like Ananya, or to explore, like Riya.
          </p>
        }
      />
      {personas.map((p) => (
        <PersonaFigure key={p.key} p={p} />
      ))}
      <ChapterEnd>Their story was already in the ’24 team’s research.</ChapterEnd>
    </Chapter>
  );
}
