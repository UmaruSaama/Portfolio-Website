import type { CSSProperties, ReactNode } from "react";
import { Chapter, ChapterEnd, Opener } from "../Primitives";
import cs from "../cs.module.css";
import s from "./Ch05Learned.module.css";

/* ------------------------------------------------------------------ */
/* Pieces shared by chapters 05 and 06 (same Figma components).        */
/* ------------------------------------------------------------------ */

/** Heroicons v1 outline paths used by the Figma cards. */
const ICONS = {
  shieldCheck:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  userRemove: "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6",
  clipboardList:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  bookmark: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  film: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
  fire: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657zM9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z",
  exclamation:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 32, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className ?? s.icon}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

/** Block header: H2-styled title (500 wide) with a body paragraph on the right. */
export function BlockHead({ title, children, bodyWidth = 500 }: { title: ReactNode; children: ReactNode; bodyWidth?: number }) {
  return (
    <div className={s.blockHead}>
      <h3 className={`${cs.h2} ${s.blockTitle}`}>{title}</h3>
      <p className={`${cs.body} ${s.blockBody}`} style={{ "--bw": bodyWidth } as CSSProperties}>
        {children}
      </p>
    </div>
  );
}

/** Figma "Figure": a stage (panel or inline) with a right-aligned caption under it. */
export function Fig({ caption, children, className }: { caption: string; children: ReactNode; className?: string }) {
  return (
    <figure className={s.fig}>
      <div className={className}>{children}</div>
      <figcaption className={s.caption}>{caption}</figcaption>
    </figure>
  );
}

/** "Card – …": outlined card with an icon, H4 title and body (501 wide stack in Figma). */
export function IconCard({ icon, title, children }: { icon: IconName; title: ReactNode; children: ReactNode }) {
  return (
    <li className={s.iconCard}>
      <Icon name={icon} />
      <div className={s.iconCardText}>
        <h4 className={cs.h3}>{title}</h4>
        {children}
      </div>
    </li>
  );
}

/** "Appendix link": hairline, label, description and pink pointer. */
export function AppendixLink({ what, target }: { what: string; target: string }) {
  return (
    <p className={s.appendix}>
      <span>Full detail:</span>
      <span>{what}</span>
      <span className={s.appendixTarget}>→ {target}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Survey chart data (Figma 329:2194). Positions are Figma px on a     */
/* 346px track; rendered as % so the chart stays fluid.                */
/* ------------------------------------------------------------------ */

type Row = { id: string; count: number; base: number; label: string; pct: number; bar: number; lo: number; hi: number };

const WANTS: Row[] = [
  { id: "W1", count: 27, base: 37, label: "Words in context, from shows and books", pct: 73, bar: 252, lo: 197, hi: 292 },
  { id: "W2", count: 27, base: 38, label: "Tap-to-translate subtitles", pct: 71, bar: 246, lo: 191, hi: 286 },
  { id: "W3", count: 32, base: 52, label: "Learning through anime and TV", pct: 62, bar: 213, lo: 166, hi: 253 },
];

const STOPS: Row[] = [
  { id: "S1", count: 26, base: 38, label: "No one to practise with · most-cited", pct: 68, bar: 237, lo: 182, hi: 279 },
  { id: "S2", count: 20, base: 38, label: "Feel unsure using the language", pct: 53, bar: 182, lo: 129, hi: 233 },
  { id: "S3", count: 19, base: 38, label: "Forget what they learned", pct: 50, bar: 173, lo: 121, hi: 224 },
  { id: "S4", count: 17, base: 38, label: "Lose motivation", pct: 45, bar: 155, lo: 104, hi: 208 },
  { id: "S5", count: 17, base: 38, label: "Lessons too grammar-heavy", pct: 45, bar: 155, lo: 104, hi: 208 },
  { id: "S6", count: 17, base: 38, label: "Not engaging enough", pct: 45, bar: 155, lo: 104, hi: 208 },
  { id: "S7", count: 11, base: 38, label: "Rarely or never practise", pct: 29, bar: 100, lo: 59, hi: 154 },
];

const TRACK = 346;

function Bar({ bar, lo, hi, tone, track = TRACK }: { bar: number; lo: number; hi: number; tone: string; track?: number }) {
  const p = (n: number) => `${(n / track) * 100}%`;
  return (
    <span className={s.track} aria-hidden="true">
      <span className={`${s.bar} ${tone}`} style={{ width: p(bar) }} />
      <span className={s.range} style={{ left: p(lo), width: p(hi - lo + 1) }} />
    </span>
  );
}

function SurveyRows({ rows, tone }: { rows: Row[]; tone: (i: number) => string }) {
  return (
    <ol className={s.rows}>
      {rows.map((r, i) => (
        <li key={r.id} className={s.row}>
          <p className={s.count}>
            <span className={s.countNum}>{r.count}</span>
            <span className={s.countBase}>of {r.base}</span>
          </p>
          <div className={s.rowMain}>
            <p className={s.rowLine}>
              <span className={s.mono}>{r.id}</span>
              <span className={s.rowLabel}>{r.label}</span>
              <span className={`${s.mono} ${s.pct}`}>{r.pct}%</span>
            </p>
            <Bar bar={r.bar} lo={r.lo} hi={r.hi} tone={tone(i)} />
            <span className={s.srOnly}>
              , 95% range {Math.round((r.lo / TRACK) * 100)}–{Math.round((r.hi / TRACK) * 100)}%
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Interview clusters and insight → screen pairs.                       */
/* ------------------------------------------------------------------ */

type Tone = "mint" | "pink" | "yellow";

const CLUSTERS: { title: string; tone: Tone; notes: string[] }[] = [
  {
    title: "Context beats drills",
    tone: "mint",
    notes: [
      "Vocabulary sticks better in shows and books than in drills",
      "Pop culture is the main reason they're learning",
      "Familiar scenes make words easier to recall",
      "Tools work best when they live inside the media",
    ],
  },
  {
    title: "Motivation fades fast",
    tone: "pink",
    notes: [
      "45% lose motivation along the way",
      "Grammar-heavy lessons feel like homework",
      "Streaks build habit, not proof of progress",
      "Yesterday's words are gone today",
      "No one to practise with: the #1 challenge (68%)",
    ],
  },
  {
    title: "Learning and watching are split",
    tone: "yellow",
    notes: [
      "Apps force a choice: fun or learning",
      "Pausing to look up words breaks immersion",
      "Saving words and reviews should happen inside the media",
      "Casual and professional learners need different content",
    ],
  },
];

const PAIRS: {
  cluster: string;
  tone: Tone;
  title: string;
  body: string;
  img: string;
  w: number;
  h: number;
  alt: string;
  shadow: "left" | "right";
  flip?: boolean;
}[] = [
  {
    cluster: "Context beats drills",
    tone: "mint",
    title: "A library of the content they already love",
    body: "Learners said vocabulary sticks in shows and books, not drills. So the curriculum is anime, manga and novels, each rated by how much of it you'll follow.",
    img: "/cs/immerlingo/img/learned-screen-library.png",
    w: 608,
    h: 298,
    alt: "ImmerLingo library screen, “Shows you can follow tonight”: media-type tabs, fit filters such as Stretch 80–94% and Comfortable 95%+, and a “Right for you” row of anime titles.",
    shadow: "left",
  },
  {
    cluster: "Motivation fades fast",
    tone: "pink",
    title: "Progress that means something",
    body: "Streaks kept learners consistent but didn't prove progress. Stats tracks known words, minutes of Japanese and active days a week, with no streak to break.",
    img: "/cs/immerlingo/img/learned-screen-stats.png",
    w: 608,
    h: 304,
    alt: "ImmerLingo stats screen, “October so far”: 2,398 known words, 268 minutes of Japanese, 214 words saved, 87% remembered in review, a known-words line chart and a 5-days-a-week goal grid.",
    shadow: "right",
    flip: true,
  },
  {
    cluster: "Learning and watching are split",
    tone: "yellow",
    title: "Look up words without leaving the scene",
    body: "Pausing to look things up broke immersion. A hover lookup sits on the subtitle and resumes playback the moment you move on.",
    img: "/cs/immerlingo/img/learned-screen-player.png",
    w: 608,
    h: 452,
    alt: "ImmerLingo player: a hover word card for 閉める (to close) over an anime scene, with tags, meanings, and Save card, Edit card and Explain line actions above the subtitle.",
    shadow: "left",
  },
];

const FINDINGS = [
  {
    head: "72%",
    big: true,
    body: "of people in India prefer watching content in other languages with subtitles.",
    by: "— YouGov India (2019)",
  },
  {
    head: "Immersion > points",
    body: "Immersion-based approaches retained better long-term than point-based gamification.",
    by: "— Frontiers (2024)",
  },
  {
    head: "Time & resources",
    body: "Self-directed learners struggle most with time management and finding good material.",
    by: "— ResearchGate review (2024)",
  },
];

const COMPETITORS = [
  {
    tool: "Duolingo",
    well: "Strong daily habit loop and polished onboarding for beginners.",
    pos: "Learners in my research said drills don't transfer to real content. ImmerLingo builds practice on the shows and books they already follow.",
  },
  {
    tool: "Anki",
    well: "Flexible, powerful spaced-repetition engine.",
    pos: "Cards are built and maintained by hand. ImmerLingo creates cards at the moment of discovery, with the original sentence and scene.",
  },
  {
    tool: "Language Reactor",
    well: "Dual subtitles and word lookup on Netflix and YouTube.",
    pos: "Deeper review typically relies on exporting to Anki. ImmerLingo keeps lookup, mining and review in one loop.",
  },
  {
    tool: "Migaku",
    well: "Closest competitor: subtitle lookup, context-rich flashcards, known-word tracking and comprehension stats.",
    pos: "Overlaps on the core loop. ImmerLingo's bet: a guided start for beginners, and progress framed around the series a learner follows.",
  },
];

/* ------------------------------------------------------------------ */

export function Ch05Learned() {
  return (
    <Chapter id="learned" label="What I learned">
      {/* 329:2155 */}
      <Opener
        eyebrow="Research"
        title="Learners want to learn through media, and the research backs them."
        introTitle="Four methods"
        intro={
          <p className={cs.body}>
            A survey of 52 people, 5 interviews, a competitive audit and desk research. Each one fed the principles
            that follow.
          </p>
        }
      />

      {/* 329:2167 — Interviews */}
      <section className={s.split}>
        <div className={s.splitLead}>
          <h3 className={cs.h2}>Interviews</h3>
          <p className={cs.body}>
            I interviewed 5 learners across Bangalore, Guwahati, Delhi, Pune and Gwalior. I asked how they practise,
            what frustrates them and why they quit.
          </p>
        </div>
        <ul className={s.cardStack}>
          <IconCard icon="shieldCheck" title="Explain the numbers">
            <p className={cs.body}>Find the reasons and feelings behind the survey answers.</p>
          </IconCard>
          <IconCard icon="userRemove" title="Find the friction">
            <p className={cs.body}>Spot the moments learners drop out of content-based learning, and why.</p>
          </IconCard>
          <IconCard icon="clipboardList" title="Test the idea">
            <p className={cs.body}>
              See how learners react to learning inside entertainment, and what would stop them using it.
            </p>
          </IconCard>
        </ul>
      </section>

      {/* 329:2190 — Survey */}
      <section className={s.block}>
        <BlockHead title="Survey" bodyWidth={482}>
          A survey with branching logic reached 52 people across India, 38 of them active learners. It tested my
          assumptions and sized their needs.
        </BlockHead>
        <Fig caption="Survey of 52 people across India, 38 of them active learners" className={`${s.panel} ${s.survey}`}>
          <p className={s.surveyTitle}>The want is there. The follow-through isn&apos;t.</p>
          <div className={s.surveyCols}>
            <div className={s.surveyCol}>
              <h4 className={s.surveyHead}>
                <span className={`${s.dot} ${s.dotWhite}`} aria-hidden="true" />
                <span className={s.surveyHeadLabel}>What they say they want</span>
                <span className={s.surveyBase}>stated preferences · base varies</span>
              </h4>
              <SurveyRows rows={WANTS} tone={() => s.barWhite} />
              <div className={s.howTo}>
                <p className={s.howToTitle}>How to read this</p>
                <div className={s.howToKey}>
                  <span className={s.keyTrack}>
                    <Bar bar={36} lo={22} hi={51} tone={s.barWhite} track={64} />
                  </span>
                  <p className={s.howToText}>
                    Line = 95% range. Where lines overlap, the gap isn&apos;t meaningful: S1 leads but overlaps S2–S3,
                    and S2–S6 are effectively tied.
                  </p>
                </div>
                <p className={s.howToText}>
                  52 responses, 6–15 June 2025. Only the 38 who had tried learning a language saw the challenge
                  questions. Multi-select, so rows don&apos;t add to 100%. Self-selected and small: directional, not
                  representative.
                </p>
              </div>
            </div>
            <div className={s.surveyCol}>
              <h4 className={s.surveyHead}>
                <span className={`${s.dot} ${s.dotPink}`} aria-hidden="true" />
                <span className={s.surveyHeadLabel}>What stops them</span>
                <span className={s.surveyBase}>of 38 who have tried learning</span>
              </h4>
              <SurveyRows rows={STOPS} tone={(i) => (i === 0 ? s.barPink : s.barPinkSoft)} />
            </div>
          </div>
        </Fig>
      </section>

      {/* 329:2228 — Competitors */}
      <section className={s.block}>
        <BlockHead title="Competitors" bodyWidth={490}>
          I audited apps, browser extensions and SRS tools: what each does well, and what learners still lack.
        </BlockHead>
        <div className={s.figures}>
          <Fig caption="How ImmerLingo sits against existing tools" className={`${s.panel} ${s.tablePanel}`}>
            <table className={s.compTable}>
              <thead>
                <tr>
                  <th scope="col">Tool</th>
                  <th scope="col">What it does well</th>
                  <th scope="col">Where ImmerLingo is positioned</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c) => (
                  <tr key={c.tool}>
                    <th scope="row">{c.tool}</th>
                    <td className={s.compWell}>{c.well}</td>
                    <td>{c.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fig>
          <Fig caption="Three findings from published studies" className={s.findings}>
            <ul className={s.findingRow}>
              {FINDINGS.map((f) => (
                <li key={f.by} className={s.finding}>
                  <p className={f.big ? s.findingBig : `${cs.h2} ${s.findingHead}`}>{f.head}</p>
                  <p className={cs.body}>{f.body}</p>
                  <p className={s.findingBy}>{f.by}</p>
                </li>
              ))}
            </ul>
          </Fig>
        </div>
        <AppendixLink what="SWOT, full source quotes and published studies" target="Appendix B" />
      </section>

      {/* 329:2280 — Insights opener */}
      <Opener
        eyebrow="Insights"
        title="Motivation dies where study and entertainment split apart."
        introTitle="What interviews added"
        intro={
          <p className={cs.body}>“I&apos;ll see a word, and then a week later, it&apos;s gone.” — Interviewee, Bangalore</p>
        }
      />

      {/* 329:2292 — Interview findings, clustered */}
      <Fig caption="Interview findings, clustered" className={`${s.panel} ${s.affinity}`}>
        <div className={s.clusters}>
          {CLUSTERS.map((c) => (
            <div key={c.title} className={s.cluster}>
              <h3 className={s.clusterHead}>
                <span className={`${s.dot} ${s[c.tone]}`} aria-hidden="true" />
                <span className={s.clusterTitle}>{c.title}</span>
                <span className={s.clusterCount}>
                  {c.notes.length}
                  <span className={s.srOnly}> notes</span>
                </span>
              </h3>
              <ul className={s.notes}>
                {c.notes.map((n) => (
                  <li key={n} className={`${s.note} ${s[`note_${c.tone}`]}`}>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Fig>

      {/* 329:2339 — Each insight and the screen it led to */}
      <Fig caption="Each insight and the screen it led to" className={s.pairsStage}>
        <ul className={s.pairs}>
          {PAIRS.map((p) => (
            <li key={p.title} className={`${s.pair} ${p.flip ? s.pairFlip : ""}`}>
              <div className={s.insight}>
                <p className={`${s.insightCluster} ${s[`text_${p.tone}`]}`}>
                  <span className={`${s.dot} ${s[p.tone]}`} aria-hidden="true" />
                  {p.cluster}
                </p>
                <h3 className={cs.h3}>{p.title}</h3>
                <p className={cs.small}>{p.body}</p>
              </div>
              <div className={`${s.screen} ${p.shadow === "left" ? s.shadowLeft : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" />
              </div>
            </li>
          ))}
        </ul>
      </Fig>

      {/* 329:2369 */}
      <ChapterEnd>Three insights, three questions to answer.</ChapterEnd>
    </Chapter>
  );
}

