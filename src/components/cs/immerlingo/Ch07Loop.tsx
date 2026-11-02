import { Chapter, ChapterEnd, Figure, Opener } from "../Primitives";
import cs from "../cs.module.css";
import s from "./Ch07Loop.module.css";

/* ---------- Information architecture data (Figma 415:6579) ---------- */

const firstSession: [string, string][] = [
  ["0.1", "Pick a show"],
  ["0.2", "Warm-up"],
  ["0.3", "First watch"],
  ["0.4", "Scene summary"],
  ["0.5", "Practise"],
  ["0.6", "Second watch"],
  ["0.7", "Day-1 home"],
];

type Item = { n: string; label: string; depth?: 1 | 2; hub?: boolean };
type Section = { n: string; label: string; items: Item[] };

const sections: Section[] = [
  {
    n: "1.0",
    label: "Today",
    items: [
      { n: "1.1", label: "Tonight's plan" },
      { n: "1.2", label: "Continue" },
      { n: "1.3", label: "This week" },
    ],
  },
  {
    n: "2.0",
    label: "Library",
    items: [
      { n: "2.1", label: "Show & episodes" },
      { n: "2.2", label: "Warm-up" },
      { n: "2.3", label: "Player", hub: true },
      { n: "2.3.1", label: "Word card", depth: 2 },
      { n: "2.3.2", label: "Card creator", depth: 2 },
      { n: "2.3.3", label: "Explain this line", depth: 2 },
      { n: "2.3.4", label: "Player settings", depth: 2 },
      { n: "2.3.5", label: "Episode end", depth: 2 },
    ],
  },
  {
    n: "3.0",
    label: "Read",
    items: [
      { n: "3.1", label: "Novel reader" },
      { n: "3.2", label: "Manga reader" },
    ],
  },
  {
    n: "4.0",
    label: "Learn",
    items: [
      { n: "4.1", label: "Courses" },
      { n: "4.1.1", label: "Grammar", depth: 2 },
      { n: "4.1.2", label: "Katakana", depth: 2 },
      { n: "4.2", label: "Lesson · 3 steps" },
      { n: "4.3", label: "Unit check" },
      { n: "4.4", label: "Reviews & decks" },
      { n: "4.4.1", label: "Review", depth: 2 },
    ],
  },
  {
    n: "5.0",
    label: "Dictionary",
    items: [
      { n: "5.1", label: "Search" },
      { n: "5.2", label: "Entry" },
    ],
  },
  {
    n: "6.0",
    label: "Stats",
    items: [
      { n: "6.1", label: "Progress by medium" },
      { n: "6.2", label: "Settings" },
      { n: "6.3", label: "Downloads" },
    ],
  },
];

const devices: { label: string; tabs: string[]; note: string }[] = [
  {
    label: "Desktop · sidebar",
    tabs: ["Today", "Library", "Read", "Learn", "Dictionary", "Stats"],
    note: "Settings in the footer",
  },
  {
    label: "Tablet · rail",
    tabs: ["Today", "Library", "Read", "Learn", "Dictionary", "Stats"],
    note: "Same six, icons only",
  },
  {
    label: "Phone · tab bar",
    tabs: ["Today", "Library + Read", "Learn", "Dictionary", "You · Stats + Settings"],
    note: "Five tabs",
  },
];

function InformationArchitecture() {
  return (
    <Figure type="Image" title="Information architecture" glow={false} stageClassName={s.iaStage}>
      <div className={s.flowBlock}>
        <p className={s.caption}>First session · no level test, straight into a show</p>
        <ol className={s.flow}>
          {firstSession.map(([n, label]) => (
            <li key={n} className={s.flowStep}>
              <span className={s.pill}>
                <span className={s.num}>{n}</span>
                <span>{label}</span>
              </span>
              <span className={s.dash} aria-hidden="true" />
            </li>
          ))}
          <li className={s.flowEnd}>Today</li>
        </ol>
      </div>

      <div className={s.tree}>
        <p className={s.root}>ImmerLingo</p>
        <div className={s.connectors} aria-hidden="true">
          <span className={s.stem} />
          <span className={s.rail} />
        </div>
        <ul className={s.sections}>
          {sections.map((sec) => (
            <li key={sec.n} className={s.section}>
              <span className={s.drop} aria-hidden="true" />
              <h4 className={s.sectionNode}>
                <span className={s.sectionNum}>{sec.n}</span>
                <span>{sec.label}</span>
              </h4>
              <ul className={s.items}>
                {sec.items.map((it) =>
                  it.hub ? (
                    <li key={it.n} className={s.hubItem}>
                      <span className={`${s.pill} ${s.pillHub}`}>
                        <span className={s.num}>{it.n}</span>
                        <span className={s.hubLabel}>{it.label}</span>
                      </span>
                    </li>
                  ) : (
                    <li key={it.n} className={it.depth === 2 ? `${s.item} ${s.sub}` : s.item}>
                      <span className={s.itemNum}>{it.n}</span>
                      <span className={s.itemLabel}>{it.label}</span>
                    </li>
                  ),
                )}
              </ul>
            </li>
          ))}
        </ul>
        <p className={s.hubNote}>
          <span className={s.hubDot} aria-hidden="true" />
          The player is the hub of the loop: Today, Library, Learn&apos;s lesson clips and Review all
          open into it.
        </p>
      </div>

      <div className={s.devices}>
        <p className={s.caption}>How the top level shows up on each device</p>
        {devices.map((d) => (
          <div key={d.label} className={s.deviceRow}>
            <p className={s.deviceLabel}>{d.label}</p>
            <ul className={s.tabs}>
              {d.tabs.map((t) => (
                <li key={t} className={s.pill}>
                  {t}
                </li>
              ))}
            </ul>
            <p className={s.deviceNote}>{d.note}</p>
          </div>
        ))}
      </div>
    </Figure>
  );
}

function SplitHead({ title, children }: { title: string; children: string }) {
  return (
    <div className={s.splitHead}>
      <h3 className={`${cs.h2} ${s.splitTitle}`}>{title}</h3>
      <p className={`${cs.body} ${s.splitBody}`}>{children}</p>
    </div>
  );
}

export function Ch07Loop() {
  return (
    <Chapter id="loop" label="Shaping the loop">
      <Opener
        eyebrow="Shaping the loop"
        title="One loop structures the app: watch, mine, review."
        introTitle="Information architecture"
        intro={
          <p className={cs.body}>
            I organised the app around the core loop. Learning tools sit next to the content, not in
            separate menus.
          </p>
        }
      />

      <InformationArchitecture />

      <section className={s.block} aria-label="Sketches">
        <SplitHead title="Sketches">
          Quick iPad sketches to test layouts and interactions before committing to a structure.
        </SplitHead>
        <Figure type="Image" title="Early sketches" glow={false} stageClassName={s.sketchStage}>
          {/* eslint-disable-next-line @next/next/no-img-element -- plain img per CONVENTIONS.md */}
          <img
            className={s.sketches}
            src="/cs/immerlingo/img/loop-sketches.png"
            alt="Six hand-drawn iPad layout sketches: a progress dashboard with level bars and a study streak, an empty player with controls, a media library with level filters, a dictionary with a card creator panel, a player with SRS and course shortcuts, and a dictionary settings list."
            loading="lazy"
            decoding="async"
          />
        </Figure>
      </section>

      <section className={s.block} aria-label="Wireframes">
        <SplitHead title="Wireframes">
          Low-fidelity wireframes to check flow and hierarchy before any visual decisions.
        </SplitHead>
        <Figure
          type="Image"
          title="Low-fidelity wireframes"
          glow={false}
          stageClassName={s.wireStage}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- plain img per CONVENTIONS.md */}
          <img
            className={s.wireframes}
            src="/cs/immerlingo/img/loop-wireframes.png"
            alt="Grid of greyscale low-fidelity wireframes: a dashboard with stats, a Today list of episode cards, a library grid filtered by medium and level, a dictionary search beside a card creator form, and a reading view."
            loading="lazy"
            decoding="async"
          />
        </Figure>
      </section>

      <ChapterEnd>Here&apos;s that loop, through one evening with Piyush and Orin.</ChapterEnd>
    </Chapter>
  );
}
