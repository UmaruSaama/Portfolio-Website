import type { ReactNode } from "react";
import { Chapter, ChapterEnd, Opener } from "../Primitives";
import cs from "../cs.module.css";
import s from "./Ch10Next.module.css";

const steps = [
  {
    label: "Biggest risk",
    title: "Content rights",
    body: "Shows play inside ImmerLingo, so every title needs licensing. Rights holders may price anime and drama out of reach for a learning product.",
  },
  {
    label: "Success metrics",
    title: "What I'd track",
    body: "Activation: first word mined in the first session. Retention: D7 and D30 return rate. Learning: cards reviewed per week and comprehension gained per series.",
  },
  {
    label: "Usability test",
    title: "First round",
    body: "Five moderated sessions with survey respondents. Tasks: find a show at the right level, mine three words without leaving playback, and finish a review session.",
  },
];

/* Heroicons outline (24 × 24, 1.5 stroke) */
const BookmarkIcon = (
  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
);

const FilmIcon = (
  <>
    <rect x="2.25" y="4.5" width="19.5" height="15" rx="1.125" />
    <path d="M6 4.5v15M18 4.5v15M6 12h12M2.25 8.25H6M2.25 12H6M2.25 15.75H6M18 8.25h3.75M18 12h3.75M18 15.75h3.75" />
  </>
);

const FireIcon = (
  <>
    <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    <path d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
  </>
);

const assumptions: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: BookmarkIcon,
    title: "Licensed content",
    body: "Anime and drama can be licensed at a cost a learning product can carry.",
  },
  {
    icon: FilmIcon,
    title: "Entertainment preference",
    body: "Learners would choose authentic native content over traditional educational materials when given tools.",
  },
  {
    icon: FireIcon,
    title: "Learning commitment",
    body: "Learners would put time into richer features rather than wanting a simpler tool.",
  },
];

export function Ch10Next() {
  return (
    <Chapter id="next" label="What’s next">
      <Opener
        eyebrow="What's next"
        title="From concept to evidence."
        introTitle={<span className={s.nowrap}>What would decide whether this ships.</span>}
        intro={
          <p className={cs.body}>
            ImmerLingo hasn&apos;t been tested with learners yet. Here is the biggest risk, what
            I&apos;d measure and the first test I&apos;d run.
          </p>
        }
      />

      <ul className={s.steps}>
        {steps.map((st) => (
          <li key={st.label} className={`${cs.panel} ${s.step}`}>
            <p className={s.stepLabel}>{st.label}</p>
            <h4 className={cs.h3}>{st.title}</h4>
            <p className={cs.body}>{st.body}</p>
          </li>
        ))}
      </ul>

      <section className={s.assumptions} aria-labelledby="next-assumptions">
        <h3 id="next-assumptions" className={`${cs.h2} ${s.assumptionsTitle}`}>
          Assumptions to validate
        </h3>
        <ul className={s.assumptionList}>
          {assumptions.map((a) => (
            <li key={a.title} className={`${cs.panel} ${s.assumption}`}>
              <svg
                className={s.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {a.icon}
              </svg>
              <div className={s.assumptionText}>
                <h4 className={cs.h3}>{a.title}</h4>
                <p className={cs.body}>{a.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ChapterEnd>Six weeks taught me a few things.</ChapterEnd>
    </Chapter>
  );
}
