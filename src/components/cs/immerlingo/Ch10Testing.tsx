import { Chapter, ChapterEnd, Figure, Opener } from "../Primitives";
import cs from "../cs.module.css";
import s from "./Ch10Testing.module.css";

/* 10 · Putting it in front of people (Figma dev ready 856:36228) */

const stats = [
  { value: "12", body: "people across three groups, one session each" },
  { value: "12 of 12", body: "finished onboarding; first-timers needed a nudge at the same few points" },
  { value: "v1 → v2", body: "the guided first run, rebuilt from what I saw" },
];

const groups = [
  {
    label: "Japanese learners",
    title: "In a Japanese class",
    body: "Students in IIT Guwahati’s Japanese course, taught by a native speaker. The only group who could judge comprehension.",
  },
  {
    label: "Engineering students",
    title: "No Japanese",
    body: "The closest thing to a true first-time user: no Japanese and no flashcard habit.",
  },
  {
    label: "Design peers",
    title: "No Japanese",
    body: "Used it, then pushed on flow, hierarchy and motion as designers.",
  },
];

type Status = "Changed" | "Recommended" | "Held" | "Open" | "Limit";

const findings: { n: string; title: string; body: string; status: Status; response: string }[] = [
  {
    n: "01",
    title: "First-time users needed guiding",
    body: "Everyone finished onboarding, but people new to the idea got stuck at the same few points, and I stepped in each time.",
    status: "Changed",
    response: "Version 2 adds a guided first run: short step-by-step pop-ups with motion explainers at exactly those points.",
  },
  {
    n: "02",
    title: "Flashcards needed explaining",
    body: "Spaced repetition wasn’t obvious. I had to explain how reviewing a word over days and weeks is what makes it stick.",
    status: "Recommended",
    response: "Show the schedule instead of explaining it, and pay it off with a rewatch. Design below; it goes into the prototype next.",
  },
  {
    n: "03",
    title: "Lookups still interrupt",
    body: "Even hovering over a word to look it up broke the flow of the scene.",
    status: "Open",
    response: "Cheaper than pausing, but not free. The next round measures lookups in fast dialogue, where they’ll cost the most.",
  },
  {
    n: "04",
    title: "The rewatch landed",
    body: "The moment people liked most: watching a scene again after practising, with no English subtitles, and following it.",
    status: "Held",
    response: "That’s the core loop working: watch, save, review, watch again.",
  },
  {
    n: "05",
    title: "Familiar shows first",
    body: "People said they’d use it on shows they’d already seen, not on a new favourite they wanted to simply enjoy.",
    status: "Open",
    response:
      "It fits the promise, learning inside shows you already love, but questions the % known ratings for finding new shows. Whether learners move on as vocabulary grows needs a long-term test.",
  },
  {
    n: "06",
    title: "The test episode was too slow",
    body: "The AI-generated test episode has slow, clear dialogue. People wanted to try something fast-paced.",
    status: "Limit",
    response: "A limit of the prototype, not the product. The next round uses fast, real scenes, where the help thresholds get stressed.",
  },
];

export function Ch10Testing() {
  return (
    <Chapter id="testing" label="Putting it in front of people">
      <Opener
        eyebrow="User testing"
        title="Twelve people, one prototype."
        introTitle="What held, and what didn’t."
        intro={
          <p className={cs.body}>
            I put the prototype in front of 12 people: engineering students, design peers, and learners
            from the Japanese course at IIT Guwahati, taught by a teacher from Japan. They drove; I stepped
            in only when someone was stuck. The sessions weren’t recorded or scripted, so these are early
            signals, not usability metrics.
          </p>
        }
      />

      <ul className={s.stats}>
        {stats.map((st) => (
          <li key={st.value} className={`${cs.panel} ${s.stat}`}>
            <p className={s.statValue}>{st.value}</p>
            <p className={cs.body}>{st.body}</p>
          </li>
        ))}
      </ul>

      <section className={s.split} aria-labelledby="testing-who">
        <h3 id="testing-who" className={`${cs.h2} ${s.splitTitle}`}>
          Who tried it
        </h3>
        <ul className={s.groups}>
          {groups.map((g) => (
            <li key={g.label} className={`${cs.panel} ${s.group}`}>
              <p className={s.groupLabel}>{g.label}</p>
              <h4 className={cs.h3}>{g.title}</h4>
              <p className={cs.body}>{g.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <Figure type="Table" title="Six findings, and the response to each" stageClassName={s.tableStage}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col" className={s.colN}>
                #
              </th>
              <th scope="col">What I saw</th>
              <th scope="col" className={s.colResponse}>
                Response
              </th>
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <tr key={f.n}>
                <td className={s.n}>{f.n}</td>
                <td>
                  <p className={s.findingTitle}>{f.title}</p>
                  <p className={s.findingBody}>{f.body}</p>
                </td>
                <td>
                  <span className={s.status} data-status={f.status}>
                    {f.status}
                  </span>
                  <p className={s.response}>{f.response}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Figure>

      <section className={s.split} aria-labelledby="testing-rec">
        <h3 id="testing-rec" className={`${cs.h2} ${s.splitTitle}`}>
          Recommended: show the schedule, don’t explain it
        </h3>
        <p className={`${cs.body} ${s.splitBody}`}>
          People got the rewatch instantly and needed the flashcards explained. So the flashcards borrow the
          rewatch: the schedule appears as real dates the moment it starts, the first review points at the
          intervals the grade buttons already show, and a week of reviews ends in a scene you can now follow.
        </p>
      </section>

      <Figure type="Recommended" title="Flashcards in three moments: first save, first review, a week later">
        {/* eslint-disable-next-line @next/next/no-img-element -- static figure render */}
        <img
          className={s.figureImg}
          src="/cs/immerlingo/img/testing-flashcards.png"
          width={1018}
          height={418}
          alt="Three moments. On the first save: “Saved. You’ll see it again tomorrow” with a timeline of widening gaps, today, 1 day, 3 days, 1 week, 1 month. In the first review: the word card with Again, Good and Easy buttons showing under 1 minute, 4 days and 8 days. A week later: “You now know 23 more words in this episode”, about 76% to 84% of words known, and a Rewatch without subtitles button."
          loading="lazy"
          decoding="async"
        />
      </Figure>

      <div className={`${cs.panel} ${s.limits}`}>
        <p className={s.groupLabel}>Limits</p>
        <p className={s.limitsText}>
          Unrecorded and unscripted. Most people didn’t know Japanese, I was in the room, and each person had
          one session. The guidance findings hold for anyone new to the product; the comprehension findings
          need real learners, over weeks. That’s the next round.
        </p>
      </div>

      <ChapterEnd>Twelve sessions aren’t proof of learning. Here’s what would be.</ChapterEnd>
    </Chapter>
  );
}
