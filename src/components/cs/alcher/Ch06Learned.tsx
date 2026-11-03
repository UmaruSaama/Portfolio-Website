import { ChapterEnd, Chapter } from "../Primitives";
import { Opener } from "./Story";
import { PixelBox, Plate } from "./Pixel";
import s from "./Ch06Learned.module.css";

/**
 * 06 · What I learned (Figma 504:67158): research opener, the previous
 * apps table and three findings, then the insights opener and the
 * clustered interview findings.
 */

const apps = [
  {
    app: "Alcheringa ’24",
    well: "A full revamp: search and filters, categorised explore, liked events with reminders, guest mode, a schedule grid by venue, directions in every event sheet, merch checkout. 2.5K+ downloads.",
    change: "Keeps all of it. Changes how it looks, and why you’d open it a second time.",
  },
  {
    app: "Alcheringa ’23",
    well: "The information existed but was uncategorised and hard to find; no search, nothing on stalls or transport.",
    change: "Two editions later, findability is solved. ’25 spends its effort on engagement instead.",
  },
  {
    app: "Alcheringa ’22",
    well: "Set the template: schedule, pronites and passes in one app.",
    change: "’25 keeps the template, so the structure attendees already know stays.",
  },
  {
    app: "Mood Indigo, Antaragni, Ziro",
    well: "’24’s SWOT: instinctive navigation and categorised information, but forced sign-in, no delay alerts, information scattered across platforms.",
    change: "Still utilities. None make the fest itself feel like play; that gap is the ’25 bet.",
  },
];

const findings = [
  {
    head: "None",
    big: true,
    body: "of the previous editions gave attendees a reason to open the app between events.",
    source: "Reviews and audit",
  },
  {
    head: "Same template",
    body: "Home, Activity, Schedule, Map and a toolbox; an event sheet; passes and merch. ’24 set the shape, attendees know it, ’25 keeps it.",
    source: "Audit of ’22–’24",
  },
  {
    head: "Parked in ’24",
    body: "’24’s brainstorm had the engagement ideas (personal highlights, coupons, prop scanning, winners’ lists) and parked them for feasibility. ’25 picks up the thread.",
    source: "’24 brainstorm",
  },
];

const clusters = [
  {
    title: "Too much, no path",
    dot: "var(--al-green)",
    notes: [
      "First-timers are overwhelmed by the number of events",
      "“I was so confused about what event to attend”",
      "Search and categories help you find, not choose",
      "Pronites are the one thing everyone plans around",
    ],
  },
  {
    title: "Where, from here",
    dot: "var(--al-pink)",
    notes: [
      "“Mini Auditorium” means nothing to an outsider",
      "Directions exist; a sense of the campus doesn’t",
      "Volunteers still do the wayfinding",
      "Delays move people between venues at short notice",
      "Groups split up and can’t regroup",
    ],
  },
  {
    title: "A reason to come back",
    dot: "var(--al-yellow)",
    notes: [
      "Nothing changes after you attend something",
      "Liked events and merch are the only ‘mine’ things",
      "People screenshot the schedule, then close the app",
      "’24 parked its engagement ideas for feasibility",
    ],
  },
];

export function Ch06Learned() {
  return (
    <Chapter id="learned" label="What I learned">
      <Opener
        eyebrow="Research"
        title="Attendees don’t want more information. They want the next hour, the way there, and a reason to come back."
        introTitle="Where it came from"
        intro={
          <p>
            Attendees don’t change much between editions, so I didn’t redo the interviews. I re-read the ’24 team’s
            interviews and SWOT, read the Play Store reviews of the ’24 app, and audited the ’22, ’23 and ’24 apps
            alongside other fest apps myself. Where a finding is the ’24 team’s, it says so.
          </p>
        }
      />

      <section className={s.block} aria-labelledby="learned-previous">
        <div className={s.blockHead}>
          <h3 id="learned-previous" className={s.h2}>
            Previous apps
          </h3>
          <p className={s.blockLead}>What each edition did well, and what attendees still lacked.</p>
        </div>

        <div className={s.figures}>
          <figure className={s.figure}>
            <Plate as="p" className={s.plate}>
              HOW THE OTHER FESTS HANDLE IT
            </Plate>
            <PixelBox tone="dark" className={s.tablePanel}>
              <table className={s.table}>
                <colgroup>
                  <col className={s.colApp} />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">App</th>
                    <th scope="col">What it does well</th>
                    <th scope="col">What ’25 changes</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((r) => (
                    <tr key={r.app}>
                      <th scope="row">{r.app}</th>
                      <td>{r.well}</td>
                      <td>{r.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PixelBox>
            <figcaption className={s.caption}>Four apps, one template, and the gap ’25 fills</figcaption>
          </figure>

          <figure className={s.figure} data-plain>
            <ul className={s.findings}>
              {findings.map((f) => (
                <PixelBox key={f.head} tone="pink" as="li" className={s.finding}>
                  <h4 className={f.big ? s.findingBig : s.findingHead}>{f.head}</h4>
                  <p className={s.findingBody}>{f.body}</p>
                  <p className={s.findingSource}>{f.source}</p>
                </PixelBox>
              ))}
            </ul>
            <figcaption className={s.caption}>What the audit and the reviews added up to</figcaption>
          </figure>
        </div>
      </section>

      <Opener
        eyebrow="Insights"
        title="Three insights, and one gamification system that answers all of them."
        introTitle="Clustered findings"
        intro={
          <p>
            I clustered the ’24 team’s findings and the ’24 reviews by what they would change. Three clusters held almost
            everything.
          </p>
        }
      />

      <figure className={s.figure}>
        <Plate as="p" className={s.plate}>
          INTERVIEW FINDINGS
        </Plate>
        <PixelBox tone="dark" className={s.clusterPanel}>
          <div className={s.clusters}>
            {clusters.map((c) => (
              <section key={c.title} className={s.cluster} aria-label={c.title}>
                <h4 className={s.clusterHead}>
                  <span className={s.dot} style={{ background: c.dot }} aria-hidden="true" />
                  <span className={s.clusterTitle}>{c.title}</span>
                  <span className={s.count}>
                    {c.notes.length}
                    <span className={s.srOnly}> findings</span>
                  </span>
                </h4>
                <ul className={s.notes}>
                  {c.notes.map((n) => (
                    <li key={n} className={s.note}>
                      {n}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </PixelBox>
        <figcaption className={s.caption}>
          Findings clustered by what they would change · ’24 team’s interviews and ’24 app reviews
        </figcaption>
      </figure>

      <ChapterEnd>Each cluster became a change. Gamification tied them together.</ChapterEnd>
    </Chapter>
  );
}
