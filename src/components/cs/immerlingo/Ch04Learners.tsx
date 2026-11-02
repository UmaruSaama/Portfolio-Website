import type { CSSProperties } from "react";
import { Chapter, ChapterEnd, Opener } from "../Primitives";
import cs from "../cs.module.css";
import styles from "./Ch04Learners.module.css";

type Persona = {
  key: string;
  name: string;
  role: string;
  facts: string[];
  quote: string;
  photo: { src: string; alt: string; tall?: boolean };
  traits: string[];
  need: string;
  answer: string;
  goals: string[];
  pains: string[];
  caption: string;
  /** Figma panel height */
  panelH: number;
};

const personas: Persona[] = [
  {
    key: "piyush",
    name: "Piyush Pahariya",
    role: "The starter · Beginner path",
    facts: ["24 Years old", "Pune, India", "Part-time Barista"],
    quote: "“I want to watch One Piece without subtitles, but I can't read hiragana yet.”",
    photo: {
      src: "/cs/immerlingo/img/learners-piyush.png",
      alt: "Piyush, a young man in round glasses wearing a paper crown, making a peace sign",
    },
    traits: ["Absolute beginner", "Tried apps, quit", "Can't read kana yet", "Planning a Japan trip"],
    need: "Needs to start from zero without feeling lost.",
    answer: "→ Start from a show he picked, with the scene's words taught first.",
    goals: [
      "Follow the anime he already loves, starting from zero: kana, basic words, then real episodes.",
      "Pick up casual, spoken Japanese for a future trip, not textbook phrases.",
    ],
    pains: [
      "Real content is too hard on day one, so he falls back to drills that feel pointless.",
      "Words learned yesterday vanish, because nothing brings them back in context.",
    ],
    caption: "Piyush, the starter: beginner path",
    panelH: 720,
  },
  {
    key: "orin",
    name: "Orin Tyagi",
    role: "The miner · Content-driven path",
    facts: ["18 Years old", "Bangalore, India", "Student with Tech Internship"],
    quote:
      "“I want to read all the untranslated light novels and play Japanese indie games without waiting for dub patches.”",
    photo: {
      src: "/cs/immerlingo/img/learners-orin.png",
      alt: "Orin, a smiling young man with curly hair, glasses and a beard, in a black jacket",
      tall: true,
    },
    traits: [
      "Knows kana",
      "Reads manga & light novels",
      "Plays JP indie games",
      "Self-directed",
      "Uses flashcards",
      "Learns by reading",
    ],
    need: "Needs to grow vocabulary from what he already reads.",
    answer: "→ One-tap mining from video and text, with cards that keep the scene.",
    goals: [
      "Read untranslated manga, light novels and Japanese games as they release.",
      "Turn every new word he meets into one he actually remembers.",
    ],
    pains: [
      "Hard to find content at his level: too easy is boring, too hard stalls him.",
      "Building flashcards by hand breaks the reading flow and loses the context.",
    ],
    caption: "Orin, the miner: content-driven path",
    panelH: 817,
  },
];

/* heroicons v1 outline book-open */
function BookIcon() {
  return (
    <span className={styles.factIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </span>
  );
}

function PersonaFigure({ p }: { p: Persona }) {
  return (
    <figure className={styles.figure}>
      <div
        className={`${styles.panel} ${styles.persona}`}
        style={{ minHeight: `calc(${p.panelH} * var(--v))` }}
      >
        <div className={styles.top}>
          <div className={`${styles.card} ${styles.photo} ${p.photo.tall ? styles.photoTall : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- persona photo, sized by CSS */}
            <img src={p.photo.src} alt={p.photo.alt} loading="lazy" decoding="async" />
          </div>

          <div className={styles.idCol}>
            <div className={`${styles.card} ${styles.id}`}>
              <h4 className={cs.h3}>{p.name}</h4>
              <p className={cs.body}>{p.role}</p>
              <ul className={styles.facts}>
                {p.facts.map((f) => (
                  <li key={f}>
                    <BookIcon />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <blockquote className={`${styles.card} ${styles.quote}`}>
              <p className={cs.small}>{p.quote}</p>
            </blockquote>
          </div>

          <div className={`${styles.card} ${styles.traits}`}>
            <ul className={styles.chips} aria-label="Traits">
              {p.traits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className={styles.implication}>
              <h5 className={styles.implLabel}>Design implication</h5>
              <p className={styles.need}>{p.need}</p>
              <p className={styles.answer}>{p.answer}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={`${styles.card} ${styles.list}`}>
            <h4 className={cs.h3}>Goals</h4>
            <ul>
              {p.goals.map((g) => (
                <li key={g} className={cs.body}>
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.card} ${styles.list}`}>
            <h4 className={cs.h3}>Pain Points</h4>
            <ul>
              {p.pains.map((g) => (
                <li key={g} className={cs.body}>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>{p.caption}</figcaption>
    </figure>
  );
}

/* ---------- journey ---------- */

type Stage = {
  name: string;
  doing: string;
  thinking: string;
  feeling: string;
  face: string;
  /** face centre in the feeling row (Figma px, row origin = 40, 207) */
  at: [number, number];
  low?: boolean;
  help?: { text: string; where: string };
};

const stages: Stage[] = [
  {
    name: "Starts",
    doing: "Downloads anime and manga enthusiastically",
    thinking: "\"I'm going to learn the natural way!\"",
    feeling: "Excited",
    face: "😊",
    at: [185, 89],
  },
  {
    name: "Collects",
    doing: "Curates an immersion library by content type",
    thinking: "\"So much authentic content to explore!\"",
    feeling: "Inspired",
    face: "😄",
    at: [351, 62],
  },
  {
    name: "First episode",
    doing: "Opens the first episode, understands nothing, tries another",
    thinking: "\"Wait… I don't understand anything at all\"",
    feeling: "Confused",
    face: "😕",
    at: [517, 138],
    low: true,
    help: { text: "Know how much you'll follow before pressing play", where: "Media detail · fit %" },
  },
  {
    name: "Grinds",
    doing: "Pauses every three seconds to look up words",
    thinking: "\"My brain hurts from all this effort\"",
    feeling: "Drained",
    face: "😮‍💨",
    at: [683, 166],
    low: true,
    help: { text: "Look up a word without leaving the scene", where: "Player · word card" },
  },
  {
    name: "Doubts",
    doing: "Compares progress to others, considers quitting",
    thinking: "\"Maybe I'm just not good at languages\"",
    feeling: "Defeated",
    face: "😖",
    at: [849, 191],
    low: true,
    help: { text: "See your own gain: 76% → 84% by episode 3", where: "Episode end" },
  },
];

/** Feeling row box: 923 x 252 Figma px. */
const fx = (x: number) => `${(x / 923) * 100}%`;
const fy = (y: number) => `${(y / 252) * 100}%`;

const curve =
  "M185 89C195.8 86 231.2 75.5 250 71C268.8 66.5 284.7 63.8 298 62C311.3 60.2 321.2 60 330 60C338.8 60 340.3 59.5 351 62C361.7 64.5 378.8 68.5 394 75C409.2 81.5 426 92.2 442 101C458 109.8 477.5 121.8 490 128C502.5 134.2 501 134 517 138C533 142 563.8 148.3 586 152C608.2 155.7 633.8 157.7 650 160C666.2 162.3 667 163.5 683 166C699 168.5 724.8 172 746 175C767.2 178 792.8 181.3 810 184C827.2 186.7 842.5 189.8 849 191";

function Journey() {
  return (
    <figure className={styles.figure}>
      <div className={`${styles.panel} ${styles.journey}`}>
        <span className={`${styles.lane} ${styles.laneDoing}`} aria-hidden="true">
          Doing
        </span>
        <span className={`${styles.lane} ${styles.laneThinking}`} aria-hidden="true">
          Thinking
        </span>
        <span className={`${styles.lane} ${styles.laneHelp}`} aria-hidden="true">
          ImmerLingo
        </span>

        <ol className={styles.stages}>
          {stages.map((s, i) => (
            <li key={s.name} className={styles.stage} style={{ "--col": i + 2 } as CSSProperties}>
              <h4 className={styles.stageHead}>
                <span className={styles.stageNo}>{String(i + 1).padStart(2, "0")}</span>
                {s.name}
              </h4>
              <p className={styles.doing}>
                <span className="visually-hidden">Doing: </span>
                {s.doing}
              </p>
              <p className={styles.thinking}>
                <span className="visually-hidden">Thinking: </span>
                {s.thinking}
              </p>
              <p className="visually-hidden">Feeling: {s.feeling}</p>
              {s.help ? (
                <div className={styles.help}>
                  <p className={styles.helpText}>
                    <span className="visually-hidden">ImmerLingo: </span>
                    {s.help.text}
                  </p>
                  <p className={styles.helpWhere}>{s.help.where}</p>
                </div>
              ) : (
                <p className={styles.noHelp}>
                  <span className="visually-hidden">ImmerLingo: </span>No help needed yet
                </p>
              )}
            </li>
          ))}
        </ol>

        <div className={styles.feeling} aria-hidden="true">
          <span className={`${styles.lane} ${styles.laneFeeling}`}>Feeling</span>
          <span className={styles.sign} style={{ left: fx(93), top: fy(38) }}>
            +
          </span>
          <span className={styles.sign} style={{ left: fx(93), top: fy(194) }}>
            −
          </span>
          <span className={styles.axis} />
          <svg className={styles.curve} viewBox="0 0 923 252" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ch04-feeling" gradientUnits="userSpaceOnUse" x1="185" y1="0" x2="849" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0.72" />
                <stop offset="0.36" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="0.5" stopColor="#ff385e" stopOpacity="0.68" />
                <stop offset="1" stopColor="#ff385e" />
              </linearGradient>
            </defs>
            <path d={curve} fill="none" stroke="url(#ch04-feeling)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
          {stages.map((s) => (
            <div
              key={s.name}
              className={`${styles.mood} ${s.low ? styles.moodLow : ""}`}
              style={{ left: fx(s.at[0]), top: fy(s.at[1]) }}
            >
              <span className={styles.face}>{s.face}</span>
              <span className={styles.word}>{s.feeling}</span>
              {s.low && (
                <span className={styles.link} style={{ height: `calc(${252 - s.at[1]} * var(--v) - 46px)` }} />
              )}
            </div>
          ))}
        </div>
      </div>
      <figcaption className={styles.caption}>
        Piyush&apos;s emotional journey, and where ImmerLingo steps in
      </figcaption>
    </figure>
  );
}

/** 04 · Meet the learners (Figma 329:1976) */
export function Ch04Learners() {
  return (
    <Chapter id="learners" label="Meet the learners">
      <div className={styles.opener}>
        <Opener
          eyebrow="The learners"
          title="Two learners, two levels, one need: real content they can follow."
          introTitle="Who I designed for"
          intro={
            <p className={cs.body}>
              Composites of 52 survey responses and 5 interviews. Split by level: 53% of learners feel
              unsure, like Piyush; 18% feel confident, like Orin.
            </p>
          }
        />
      </div>

      {personas.map((p) => (
        <PersonaFigure key={p.key} p={p} />
      ))}

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <h3 className={cs.h2}>Where Piyush&apos;s motivation drops, and where ImmerLingo steps in</h3>
          <p className={cs.body}>
            Piyush starts excited, then stalls on content he can&apos;t follow. Each dip marks where the
            product has to help.
          </p>
        </div>
        <Journey />
      </div>

      <div className={styles.end}>
        <p className={styles.appendix}>
          <span>Full detail:</span>
          <span>Stage-by-stage experience flow</span>
          <span className={styles.appendixLink}>→ Appendix D</span>
        </p>
        <ChapterEnd>I needed to know how common their story was.</ChapterEnd>
      </div>
    </Chapter>
  );
}
