import { Chapter, ChapterEnd, Opener } from "../Primitives";
import cs from "../cs.module.css";
import { experienceFigures } from "./ch08Figures";
import { DeviceViewProvider } from "./DeviceView";
import { ExperienceFigure } from "./ExperienceFigure";
import styles from "./Ch08Experience.module.css";

const decisions = {
  show: {
    title: "Start from a show, not a test",
    insight:
      "A level test up front asked people to judge themselves before seeing anything, with two setup steps before any content.",
    decision:
      "Onboarding starts with a show, warms up on six words, plays the scene, practises, then rewatches in Japanese only. Placement comes from behaviour.",
    tradeoff:
      "No placement result up front, so the first scene must suit a beginner; the easiest show is suggested first.",
  },
  help: {
    title: "Help fades by itself",
    insight:
      "Fixed help keeps learners on English subtitles, and about 20 playback settings gave no sensible defaults.",
    decision:
      "Help is set from behaviour (lookups, coverage, review results) and changes between sessions, never mid-scene.",
    tradeoff:
      "Thresholds are working defaults. They need tuning in testing, and a more-help control must always be in reach.",
  },
};

function Decision({ d }: { d: (typeof decisions)["show"] }) {
  return (
    <aside className={`${cs.panel} ${styles.decision}`} aria-label={`Design decision: ${d.title}`}>
      <div className={styles.decisionTitle}>
        <p className={cs.eyebrow}>Design decision</p>
        <h4 className={cs.h3}>{d.title}</h4>
      </div>
      <dl className={styles.rationale}>
        {(
          [
            ["Insight", d.insight],
            ["Decision", d.decision],
            ["Tradeoff", d.tradeoff],
          ] as const
        ).map(([k, v]) => (
          <div key={k}>
            <dt className={cs.eyebrow}>{k}</dt>
            <dd className={cs.body}>{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function Part({ n, title }: { n: number; title: string }) {
  return (
    <header className={styles.part}>
      <p className={cs.eyebrow}>Part {n}</p>
      <h3 className={styles.partTitle}>{title}</h3>
    </header>
  );
}

/** 08 · The experience — Figma 153:8386. */
export function Ch08Experience() {
  const part1 = experienceFigures.filter((f) => f.part === 1);
  const part2 = experienceFigures.filter((f) => f.part === 2);
  return (
    <Chapter id="experience" label="The experience" className={styles.chapter}>
      <Opener
        eyebrow="The experience"
        title="One evening, two learners: Piyush starting out, Orin going deeper."
        introTitle="First session, then every evening"
        intro={
          <p className={cs.body}>
            Both start the same way, then come back every evening. Piyush leans on warm-ups and the rewatch; Orin on
            mining and help that fades.
          </p>
        }
      />
      <DeviceViewProvider>
        <Part n={1} title="The first ten minutes" />
        {part1.map((f) => (
          <ExperienceFigure key={f.slug} fig={f} />
        ))}
        <Decision d={decisions.show} />
        <Part n={2} title="Every evening after" />
        {part2.map((f) => (
          <ExperienceFigure key={f.slug} fig={f} />
        ))}
        <Decision d={decisions.help} />
      </DeviceViewProvider>
      <ChapterEnd>Behind every screen is a small system that keeps it consistent.</ChapterEnd>
    </Chapter>
  );
}
