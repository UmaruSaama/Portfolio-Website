import { Chapter, ChapterEnd } from "../Primitives";
import { PixelBox, Plate } from "./Pixel";
import { Eyebrow, Opener } from "./Story";
import s from "./Ch07Changed.module.css";

/**
 * 07 · What changed and why (Figma 504:67286, 1020 × 2840): opener, the
 * design challenge, the concept board (MoSCoW, Idea 1, verdict) and the
 * three UX changes.
 */

const IMG = "/cs/alcheringa-25/img";

const moscow = [
  { title: "Must have", body: "A gamified app, with gameplay an immersive part of the experience." },
  { title: "Should have", body: "Fun gameplay and gamified UI interaction, but up to the user’s choice." },
  { title: "Could have", body: "A progression system: points for playing, tied in with the physical event." },
  { title: "Won’t have", body: "Gameplay elements interfering with the UI or normal functionality.", wont: true },
];

/* Heroicons v1 outline paths (24 grid), drawn at 32 */
const icons = {
  bookmark: ["M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"],
  film: [
    "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
  ],
  fire: [
    "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
    "M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z",
  ],
};

const changes: { n: string; title: string; body: string; drives: string; tone: string; icon: keyof typeof icons }[] = [
  {
    n: "01",
    title: "Activity by day, not a list",
    body: "Events, competitions and stalls split by day, today selected, the night’s pronite on top. Saving one puts it in Your day with a reminder 30 minutes before. The job is choosing now, not finding.",
    drives: "Too much, no path",
    tone: "#00e436",
    icon: "bookmark",
  },
  {
    n: "02",
    title: "A map you can read, directions you can follow",
    body: "Stages, food and help as filters on one campus map, a card for the nearest landmark (‘next to SAC · 6 min from Main Gate’), and walking directions in three lines. Every venue name comes with a place.",
    drives: "Where, from here",
    tone: "#ffa8c2",
    icon: "film",
  },
  {
    n: "03",
    title: "XP for showing up",
    body: "Check in at an event, rate a stall, be first to a lineup reveal: each earns XP. XP levels you up, unlocks achievements, and ranks you, your team and your hostel. Top players win front-row passes.",
    drives: "A reason to come back",
    tone: "#ffec27",
    icon: "fire",
  },
];

export function Ch07Changed() {
  return (
    <Chapter id="changed" label="What changed and why">
      {/* Figma hides this opener's divider, so it starts at the eyebrow */}
      <div className={s.opener}>
        <Opener
          eyebrow="What changed and why"
          title="The fest as a game: showing up is the score."
          introTitle="The idea"
          intro={
            <p>
              A festival already has levels (days), checkpoints (events), a map and loot (merch). The app only had to
              admit it. 8-bit was the honest skin for that: cheap to build, instantly readable as play.
            </p>
          }
        />
      </div>

      <PixelBox tone="cream" as="section" className={s.challenge} aria-labelledby="changed-challenge">
        <span className={s.challengeRule} aria-hidden="true" />
        <div className={s.challengeHead}>
          <span className={s.challengeIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                stroke="#1d2b53"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 id="changed-challenge" className={s.challengeLabel}>
            The design challenge
          </h3>
        </div>
        <p className={s.challengeQ}>
          How might the app make four days of a festival feel like a game worth playing, without ever getting in the
          way of the schedule?
        </p>
      </PixelBox>

      <figure className={s.figure}>
        <Plate as="figcaption" className={s.plate}>
          CONCEPT BOARD: WHAT SURVIVED
        </Plate>
        <PixelBox tone="dark" className={s.stage}>
          <p className={s.stageTitle}>The team’s MoSCoW board set one rule. The first idea broke it.</p>
          <div className={s.board}>
            <div className={s.col}>
              <p className={s.label}>The board</p>
              <ul className={s.moscow}>
                {moscow.map((m) => (
                  <PixelBox
                    key={m.title}
                    as="li"
                    tone={m.wont ? "pink" : "blue"}
                    className={`${s.mcard} ${m.wont ? s.wont : ""}`}
                  >
                    <h4 className={s.mtitle}>{m.title}</h4>
                    <p className={s.mbody}>{m.body}</p>
                  </PixelBox>
                ))}
              </ul>
              <p className={`${s.label} ${s.ruleLabel}`}>The rule it produced</p>
              <p className={s.rule}>Play sits on top of the utility, never in its way.</p>
              <p className={s.ruleBody}>
                XP, levels and the leaderboard are optional. Ignore all of them and you still get to your event.
              </p>
            </div>
            <div className={s.col}>
              <p className={s.label}>Idea 1</p>
              <p className={s.idea}>
                Every UI element is a game object: press one and a character shoots it. A ‘game mode’ toggle turns the
                whole interface into a top-down RPG or platformer map.
              </p>
              <div className={s.sketches}>
                <div className={s.sketch}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${IMG}/changed-sketch-app-mode.webp`}
                    alt="Wireframe sketch of app mode: ALCHER header, a banner, a row of tiles and two cards, with a character dot over the UI."
                    width={195}
                    height={296}
                    loading="lazy"
                    decoding="async"
                  />
                  <p className={s.sketchCap}>App mode</p>
                </div>
                <div className={s.sketch}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${IMG}/changed-sketch-game-mode.webp`}
                    alt="Wireframe sketch of game mode: the same screen as a top-down map, with a character walking a path between blocks."
                    width={195}
                    height={296}
                    loading="lazy"
                    decoding="async"
                  />
                  <p className={s.sketchCap}>Game mode</p>
                </div>
              </div>
              <PixelBox tone="pink" className={s.verdict}>
                <p className={s.cut}>Cut.</p>
                <p className={s.verdictBody}>
                  A second mode that takes over the interface is exactly the Won’t-have. What survived is the
                  Could-have: XP for showing up, on top of the utility.
                </p>
              </PixelBox>
            </div>
          </div>
          <p className={s.source}>
            Source: the ’25 team’s concept board. MoSCoW and Idea 1 are quoted from it, lightly condensed.
          </p>
        </PixelBox>
      </figure>

      <section className={s.ux} aria-labelledby="changed-ux">
        <header className={s.uxHead}>
          <Eyebrow>What changed in ’25</Eyebrow>
          <h3 id="changed-ux" className={s.uxTitle}>
            Three changes, one rule. The 8-bit system carries all of them.
          </h3>
        </header>
        <div className={s.uxRow}>
          <p className={s.uxRule}>The rule</p>
          <div className={s.uxBody}>
            <p className={s.uxLead}>
              Play never costs a tap. XP, levels and the leaderboard sit on top of the utility: ignore all of them and
              you still get to your event.
            </p>
            <ul className={s.cards}>
              {changes.map((c) => (
                <PixelBox key={c.n} as="li" tone="pink" className={s.card}>
                  <svg className={s.cardIcon} viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
                    {icons[c.icon].map((d) => (
                      <path
                        key={d}
                        d={d}
                        fill="rgb(0 228 54 / 0.1)"
                        stroke="rgb(0 228 54 / 0.8)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>
                  <h4 className={s.cardTitle}>
                    {c.n} {c.title}
                  </h4>
                  <p className={s.cardBody}>{c.body}</p>
                  <p className={s.drives}>
                    <span className={s.drivesLabel} style={{ color: c.tone }}>
                      Drives
                    </span>
                    <span>{c.drives}</span>
                  </p>
                </PixelBox>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={s.end}>
        <ChapterEnd>With the changes set, I had to make them fit the structure attendees already knew.</ChapterEnd>
      </div>
    </Chapter>
  );
}
