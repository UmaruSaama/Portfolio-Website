import { Chapter, ChapterEnd, Eyebrow, Opener } from "../Primitives";
import cs from "../cs.module.css";
import { AppendixLink, BlockHead, Fig, Icon, IconCard, type IconName } from "./Ch05Learned";
import l from "./Ch05Learned.module.css";
import s from "./Ch06Principles.module.css";

type Tone = "mint" | "pink" | "yellow";

const PRINCIPLE_TONE: Record<string, Tone> = {
  "Immersion First": "mint",
  "Active Recall": "pink",
  "Unified Experience": "yellow",
};

function Pill({ name, fixed }: { name: string; fixed?: boolean }) {
  const tone = PRINCIPLE_TONE[name];
  return (
    <span className={`${s.pill} ${s[`pill_${tone}`]} ${fixed ? s.pillFixed : ""}`}>
      <span className={`${s.pillDot} ${l[tone]}`} aria-hidden="true" />
      {name}
    </span>
  );
}

function Arrow() {
  return (
    <span className={s.arrow} aria-hidden="true">
      →
    </span>
  );
}

function Chip({ children }: { children: string }) {
  return <span className={s.chip}>{children}</span>;
}

const JTBD = [
  {
    label: "Functional Outcome",
    items: [
      "Tap-to-translate and context-aware explanations for any on-screen text or dialogue.",
      "Automatic vocabulary capture and review tied to specific scenes or gameplay.",
      "Grammar explained from the exact line on screen, with a five-minute lesson when the learner wants one.",
    ],
  },
  {
    label: "Emotional Outcome",
    items: [
      "Sustained flow state—no friction between “watch/read/play” and “learn.”",
      "Confidence that progress is meaningful (not just app streaks).",
      "Authentic connection to culture—feeling like a fan, traveller, or colleague rather than a student.",
    ],
  },
];

const HMW: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "bookmark",
    title: "Learn inside the media",
    body: "How might we turn watching, reading and playing into small learning moments, without breaking the flow?",
  },
  {
    icon: "film",
    title: "Progress you can feel",
    body: "How might we tie progress to episodes watched and chapters read, so milestones feel real?",
  },
  {
    icon: "fire",
    title: "Practice with others · after v1",
    body: "How might we fit low-pressure speaking practice into fans' routines? Parked: v1 covers listening and reading.",
  },
  {
    icon: "fire",
    title: "Keep the fandom fun",
    body: "How might we keep the joy of fandom, so learning feels like being in the know, not homework?",
  },
  {
    icon: "fire",
    title: "Help only when asked",
    body: "How might we show grammar tips only when learners want them, so help never feels like a lecture?",
  },
];

const PRINCIPLES: { icon: IconName; title: string; body: string; tone: Tone; drives: string }[] = [
  {
    icon: "bookmark",
    title: "Immersion First",
    body: "Learn from real shows, manga and games, not textbook dialogues.",
    tone: "mint",
    drives: "Library · comprehension % per show",
  },
  {
    icon: "film",
    title: "Active Recall",
    body: "Remember words by retrieving them on a schedule, not by re-reading.",
    tone: "pink",
    drives: "SRS deck · Scene-linked cards",
  },
  {
    icon: "fire",
    title: "Unified Experience",
    body: "One system, not scattered tools. Watch, look up, mine and review in one place.",
    tone: "yellow",
    drives: "Hover lookup · One watch → mine → review loop",
  },
];

const EVIDENCE = [
  {
    finding:
      "Spacing out repeated encounters with material produces superior long-term learning; retrieval beats re-reading.",
    source: "Kang (2016) · Karpicke & Roediger (2008)",
    principle: "Active Recall",
    feature: "SRS deck that resurfaces each mined word just before it's forgotten, graded Again / Hard / Good / Easy.",
  },
  {
    finding: "Authentic materials raised learners' observed motivation compared with artificial textbook materials.",
    source: "Peacock (1997)",
    principle: "Immersion First",
    feature: "A media library of anime, manga and novels as the curriculum, instead of scripted dialogues.",
  },
  {
    finding: "Learners acquire language through comprehensible input pitched just beyond their current level.",
    source: "Krashen (1982), Input Hypothesis",
    principle: "Immersion First",
    feature: "A comprehension score on every title, benchmarked against a recommended level before the learner commits.",
  },
  {
    finding: "Managing cognitive load and presenting information in small chunks improves second-language learning.",
    source: "Sweller (1988) · Mayer (2009)",
    principle: "Unified Experience",
    feature: "Hover lookup inside the player: meaning, reading and one-click mining without leaving the scene.",
  },
];

const DECISIONS = [
  {
    ids: ["W1", "W3", "S6"],
    finding: "They want words from shows and books; drills feel unengaging.",
    principle: "Immersion First",
    decision: "Start from a show, in a library rated by how much you'll follow",
    where: "Pick a show · Library · fit %",
  },
  {
    ids: ["W2"],
    finding: "Tap-to-translate was the most-wanted help while watching.",
    principle: "Unified Experience",
    decision: "Look up or explain a line without leaving the scene",
    where: "Word card · Explain this line",
  },
  {
    ids: ["S3", "Interviews"],
    finding: "Half forget what they learned. \"A week later, it's gone.\"",
    principle: "Active Recall",
    decision: "Saved words come back with the scene they came from",
    where: "Review · 10 new cards a day",
  },
  {
    ids: ["S2", "S5"],
    finding: "Many feel unsure, and lessons feel too grammar-heavy.",
    principle: "Immersion First",
    decision: "Grammar from the line you stopped on, in five-minute lessons",
    where: "Explain → Saved for later · Lesson",
  },
  {
    ids: ["S4", "S7"],
    finding: "Motivation fades and practice lapses.",
    principle: "Unified Experience",
    decision: "One small plan for tonight; progress without a streak to break",
    where: "Today · Stats",
  },
];

export function Ch06Principles() {
  return (
    <Chapter id="principles" label="From insight to principle">
      {/* 329:2374 */}
      <Opener
        eyebrow="From insight to principle"
        title="Three insights became one question and three principles."
        introTitle="The job, the question, the filter"
        intro={
          <p className={cs.body}>
            Jobs to be done framed what learners want. One question framed the challenge. Three principles decided
            what made the cut.
          </p>
        }
      />

      {/* 329:2386 — JTBD */}
      <section className={l.block}>
        <BlockHead title="The job learners hire ImmerLingo for">
          Learners don&apos;t hire a language app to conjugate verbs. They hire it to understand the drama, manga or
          game they already love.
        </BlockHead>
        <Fig caption="Jobs to be done: what learners hire ImmerLingo for" className={`${l.panel} ${s.jtbd}`}>
          <div className={s.jtbdCards}>
            {JTBD.map((j) => (
              <div key={j.label} className={s.jtbdCard}>
                <h4 className={s.jtbdLabel}>{j.label}</h4>
                <ul className={s.jtbdList}>
                  {j.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Fig>
        <AppendixLink what="Full friction list and complete JTBD" target="Appendix C" />
      </section>

      {/* 329:2414 — Design challenge */}
      <section className={s.challenge} aria-labelledby="principles-challenge">
        <span className={s.challengeLine} aria-hidden="true" />
        <span className={s.challengeGlow} aria-hidden="true" />
        <div className={s.challengeHead}>
          <span className={s.challengeBadge} aria-hidden="true">
            <Icon name="exclamation" size={24} className={s.challengeIcon} />
          </span>
          <p className={s.challengeLabel}>The design challenge</p>
        </div>
        <h3 id="principles-challenge" className={`${cs.h2} ${s.challengeQ}`}>
          How do you show detailed progress without clutter, and match every learner to content at their level?
        </h3>
      </section>

      {/* 329:2423 — How might we */}
      <section className={l.split}>
        <div className={l.splitLead}>
          <h3 className={cs.h2}>How might we…</h3>
          <p className={cs.body}>Each insight, reframed as a question to design against.</p>
        </div>
        <ul className={l.cardStack}>
          {HMW.map((h) => (
            <IconCard key={h.title} icon={h.icon} title={h.title}>
              <p className={cs.body}>{h.body}</p>
            </IconCard>
          ))}
        </ul>
      </section>

      {/* 329:2458 — Core principles */}
      <section className={s.principles}>
        <div className={s.principlesHead}>
          <Eyebrow>Core principles</Eyebrow>
          <h3 className={cs.h2}>Three principles filtered every feature.</h3>
        </div>
        <div className={s.filterRow}>
          <p className={`${cs.h3} ${s.filterTitle}`}>The filter</p>
          <div className={s.filterBody}>
            <p className={`${cs.body} ${s.filterLead}`}>
              Any feature that didn&apos;t serve at least one principle was cut.
            </p>
            <ul className={l.cardStack}>
              {PRINCIPLES.map((p) => (
                <IconCard key={p.title} icon={p.icon} title={p.title}>
                  <p className={cs.body}>{p.body}</p>
                  <p className={s.drives}>
                    <span className={`${s.drivesLabel} ${l[`text_${p.tone}`]}`}>Drives</span>
                    <span className={s.drivesText}>{p.drives}</span>
                  </p>
                </IconCard>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 329:2497 — Desk research */}
      <section className={l.block}>
        <BlockHead title="The evidence behind the principles" bodyWidth={494}>
          Each published finding below maps to a principle and the feature it shaped.
        </BlockHead>
        <Fig
          caption="Each finding, the principle it supports and the feature it shaped"
          className={`${l.panel} ${s.chainPanel} ${s.evidencePanel}`}
        >
          <table className={`${s.chain} ${s.evidence}`}>
            <colgroup>
              <col className={s.cEvidence} />
              <col className={s.cArrow} />
              <col className={s.cPrinciple} />
              <col className={s.cArrow} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Evidence</th>
                <td aria-hidden="true" />
                <th scope="col">Principle</th>
                <td aria-hidden="true" />
                <th scope="col">In ImmerLingo</th>
              </tr>
            </thead>
            <tbody>
              {EVIDENCE.map((e) => (
                <tr key={e.source}>
                  <td>
                    <p className={s.evFinding}>{e.finding}</p>
                    <p className={s.evSource}>{e.source}</p>
                  </td>
                  <td className={s.arrowCell}>
                    <Arrow />
                  </td>
                  <td>
                    <Pill name={e.principle} fixed />
                  </td>
                  <td className={s.arrowCell}>
                    <Arrow />
                  </td>
                  <td>
                    <p className={s.evFeature}>{e.feature}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fig>
      </section>

      {/* 444:7750 — From insight to decision */}
      <section className={l.block}>
        <BlockHead title="From insight to decision" bodyWidth={494}>
          Each v1 decision cites the findings it rests on, from the survey (W, S) and the interviews. The most-cited
          blocker was left out of v1 on purpose, and the table says why.
        </BlockHead>
        <Fig caption="Each v1 decision and the findings behind it" className={`${l.panel} ${s.chainPanel}`}>
          <table className={`${s.chain} ${s.decisions}`}>
            <colgroup>
              <col className={s.cEvidence} />
              <col className={s.cArrow} />
              <col className={s.cPrinciple} />
              <col className={s.cArrow} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Evidence</th>
                <td aria-hidden="true" />
                <th scope="col">Principle</th>
                <td aria-hidden="true" />
                <th scope="col">v1 decision</th>
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map((d) => (
                <tr key={d.decision}>
                  <td>
                    <span className={s.chips}>
                      {d.ids.map((id) => (
                        <Chip key={id}>{id}</Chip>
                      ))}
                    </span>
                    <p className={s.decFinding}>{d.finding}</p>
                  </td>
                  <td className={s.arrowCell}>
                    <Arrow />
                  </td>
                  <td>
                    <Pill name={d.principle} />
                  </td>
                  <td className={s.arrowCell}>
                    <Arrow />
                  </td>
                  <td>
                    <p className={s.decTitle}>{d.decision}</p>
                    <p className={`${l.mono} ${s.decWhere}`}>{d.where}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={s.notInV1}>
            <p className={s.notHead}>
              <Chip>S1</Chip>
              <span className={s.notTitle}>No one to practise with · 26 of 38, the most-cited blocker</span>
              <span className={s.notTag}>Not in v1</span>
            </p>
            <dl className={s.notCols}>
              <div>
                <dt>WHY</dt>
                <dd>
                  Real conversation needs other people: a user base and moderation a first release won&apos;t have.
                  v1 tests first whether watching and review alone build retention.
                </dd>
              </div>
              <div>
                <dt>MEANWHILE</dt>
                <dd>Listen-first lesson steps and native audio on every card keep listening and speaking in reach.</dd>
              </div>
              <div>
                <dt>REVISIT WHEN</dt>
                <dd>Solo retention holds at D30, and practice is still the top blocker in follow-up surveys.</dd>
              </div>
            </dl>
          </div>
        </Fig>
      </section>

      {/* 329:2553 */}
      <ChapterEnd>With the principles set, I mapped the app around one loop.</ChapterEnd>
    </Chapter>
  );
}
