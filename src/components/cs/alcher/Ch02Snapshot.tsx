import { Chapter, ChapterEnd } from "../Primitives";
import { PixelBox, PixelText, Slot, Tick } from "./Pixel";
import s from "./Ch02Snapshot.module.css";

/** 02 · Snapshot (Figma 504:66848): role / timeline / overview, the
 *  briefing panel (scope · constraints · process) and the "why redesign"
 *  dialogue card. */

const scope = [
  "Attendee app: schedule, venues, artists, passes and merch",
  "Every screen redesigned in an 8-bit system, plus gamification on top: a progression system (XP and levels), achievements and a fest-wide leaderboard",
  "Out of scope: organiser tools, the ticketing backend and the website.",
];

const constraints = [
  "Hard deadline: live on the stores before Day 1",
  "One designer and a student dev team, shipping to Android and iOS",
  "’24’s structure, backend and data carried over; the new UI had to fit them",
];

const process = [
  "Audit the ’22–’24 apps",
  "Re-read the ’24 team’s research and the store reviews",
  "Concept: the fest as a game, checked with the dev team",
  "8-bit system, iterations with mentors, handoff",
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className={s.bullets}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function Ch02Snapshot() {
  return (
    <Chapter id="snapshot" label="Snapshot" className={s.chapter}>
      <dl className={s.overview}>
        <div className={s.role}>
          <dt className={s.label}>Role</dt>
          <dd className={s.value}>Product designer, the only designer on the Alcheringa ’25 team</dd>
        </div>
        <div className={s.timeline}>
          <dt className={s.label}>Timeline</dt>
          <dd className={s.value}>Android and iOS · live 20 days before Day 1</dd>
        </div>
        <div className={s.summary}>
          <dt className={s.label}>Overview</dt>
          <dd className={s.body}>
            Every year a new student team rebuilds the Alcheringa app. ’24 fixed finding things. In ’25 I kept all of
            it and gave the app a game’s logic and an 8-bit skin, so showing up became playing.
          </dd>
        </div>
      </dl>

      <PixelBox tone="blue" as="section" className={s.brief} aria-label="Project brief">
        <div className={s.col}>
          <PixelText as="h3" className={s.colTitle}>
            SCOPE
          </PixelText>
          <Bullets items={scope} />
        </div>
        <span className={s.rule} aria-hidden="true" />
        <div className={`${s.col} ${s.col2}`}>
          <PixelText as="h3" className={s.colTitle}>
            CONSTRAINTS
          </PixelText>
          <Bullets items={constraints} />
        </div>
        <span className={s.rule} aria-hidden="true" />
        <div className={`${s.col} ${s.col3}`}>
          <PixelText as="h3" className={s.colTitle}>
            PROCESS
          </PixelText>
          <ol className={s.steps}>
            {process.map((t, i) => (
              <Slot as="li" key={t} className={s.step}>
                <span className={s.stepNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{t}</span>
                <Tick className={s.stepTick} />
              </Slot>
            ))}
          </ol>
        </div>
      </PixelBox>

      <PixelBox tone="pink" as="section" className={s.why} aria-labelledby="alcher-why-redesign">
        <Slot className={s.whyIcon} aria-hidden="true">
          <PixelText>!</PixelText>
        </Slot>
        <PixelText as="h3" id="alcher-why-redesign" className={s.whyTitle}>
          WHY REDESIGN
        </PixelText>
        <p className={s.whyBody}>
          ’24 reached 2.5K+ downloads, about 50% more than ’23. The number it had no way to move was how often people
          came back: nothing in the app changed after you went to an event. That became the ’25 brief.
        </p>
        <span className={s.whyMore} aria-hidden="true">
          ▼
        </span>
      </PixelBox>

      <ChapterEnd>Here’s the festival it had to run.</ChapterEnd>
    </Chapter>
  );
}
