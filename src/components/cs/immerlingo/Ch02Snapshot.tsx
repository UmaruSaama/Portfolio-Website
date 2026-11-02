import { Chapter, ChapterEnd, Fact } from "../Primitives";
import cs from "../cs.module.css";
import styles from "./Ch02Snapshot.module.css";

const scope = [
  "Core loop: watch → mine → review",
  "Progress tied to the media learners follow",
  "Out of scope: animation and micro-interactions, music and lyrics (60% of respondents were interested).",
];

const constraints = [
  "Solo and self-initiated, 6 weeks",
  "Japanese only (43% of learners are learning it)",
  "Dense by design for committed learners",
];

const process = [
  ["01", "Discovery & synthesis"],
  ["02", "Structure & visual direction"],
  ["03", "Design system"],
  ["04", "Hi-fi design"],
];

/** 02 · Snapshot (Figma 329:1505) */
export function Ch02Snapshot() {
  return (
    <Chapter id="snapshot" label="Snapshot">
      <h2 className="visually-hidden">Snapshot</h2>
      <div className={styles.overview}>
        <div className={styles.facts}>
          <Fact label="Role">Product designer, solo</Fact>
          <Fact label="Timeline">6 weeks, June–July 2025</Fact>
        </div>
        <div className={styles.summary}>
          <p className={cs.eyebrow}>Overview</p>
          <p className={cs.body}>
            ImmerLingo builds lessons into the shows, manga and games learners already enjoy. Watching
            and studying become the same thing.
          </p>
        </div>
      </div>

      <div className={`${cs.panel} ${styles.frame}`}>
        <section className={styles.col} aria-labelledby="snapshot-scope">
          <h3 id="snapshot-scope" className={styles.colHead}>
            Scope
          </h3>
          <ul className={styles.list}>
            {scope.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        <section className={styles.col} aria-labelledby="snapshot-constraints">
          <h3 id="snapshot-constraints" className={styles.colHead}>
            Constraints
          </h3>
          <ul className={styles.list}>
            {constraints.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        <section className={styles.col} aria-labelledby="snapshot-process">
          <h3 id="snapshot-process" className={styles.colHead}>
            Process
          </h3>
          <ol className={styles.list}>
            {process.map(([n, t]) => (
              <li key={n}>
                <span className={styles.num}>{n}</span>
                {t}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className={`${cs.card} ${styles.why}`}>
        <span className={styles.whyDivider} aria-hidden="true" />
        <div className={styles.whyHead}>
          <span className={styles.flag} aria-hidden="true">
            <span className={styles.flagDot} />
          </span>
          <h3 className={styles.whyLabel}>Why Japanese</h3>
        </div>
        <p className={`${cs.h2} ${styles.whyText}`}>
          43% of learners surveyed are learning Japanese, the most of any foreign language, so the
          concept starts there.
        </p>
      </div>

      <ChapterEnd>Here&apos;s the problem it started from.</ChapterEnd>
    </Chapter>
  );
}
