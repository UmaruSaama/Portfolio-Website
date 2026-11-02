import type { CSSProperties, ReactNode } from "react";
import { Opener } from "../Primitives";
import { appendixAnchor, type AppendixSection } from "../appendix";
import { Fig } from "./Ch05Learned";
import cs from "../cs.module.css";
import s from "./Appendix.module.css";

/*
  ImmerLingo appendix A–D (Figma "ImmerLingo – Appendix" 150:5006).
  Appendix E (design system, 156:6605) is left out on purpose: its tokens
  predate the round-2 Cinematic system shown in chapter 09.
*/

export const immerlingoAppendixSections: AppendixSection[] = [
  { id: "a", label: "Problem framing" },
  { id: "b", label: "Research detail" },
  { id: "c", label: "Insight detail" },
  { id: "d", label: "Journey detail" },
];

/* ---------- icons (Heroicons v1 outline, as on the Figma cards) ---------- */

const PATHS = {
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  translate:
    "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
  emojiSad: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  sparkles:
    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  bookOpen:
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  duplicate:
    "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  server:
    "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
  cube: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  trendingDown: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
  chartPie: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0120.488 9z",
  newspaper:
    "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  scissors:
    "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z",
  academicCap:
    "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
} as const;

type IconName = keyof typeof PATHS;

function Icon({ name, size = 32, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ---------- shared pieces ---------- */

function Section({
  id,
  title,
  introTitle,
  intro,
  children,
}: {
  id: string;
  title: string;
  introTitle: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section id={appendixAnchor(id)} className={s.section} aria-label={`Appendix ${id.toUpperCase()}: ${title}`}>
      <Opener
        eyebrow={`Appendix ${id.toUpperCase()}`}
        title={`${title}.`}
        introTitle={introTitle}
        introTitleWidth={400}
        intro={<p className={cs.body}>{intro}</p>}
      />
      {children}
    </section>
  );
}

/** Two-column row card: label on the left, one or more lines on the right. */
function RowCards({ rows }: { rows: { label: string; lines: string[] }[] }) {
  return (
    <dl className={s.rows}>
      {rows.map((r) => (
        <div key={r.label} className={s.rowCard}>
          <dt className={cs.body}>{r.label}</dt>
          <dd className={s.rowLines}>
            {r.lines.map((l) => (
              <p key={l} className={cs.body}>
                {l}
              </p>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Grouped list of small icon cards (Figma: 16px group radius, 4px gaps). */
function IconList({ items, tone }: { items: { icon: IconName; text: string }[]; tone: string }) {
  return (
    <ul className={s.iconList}>
      {items.map((it) => (
        <li key={it.text} className={s.iconItem}>
          <Icon name={it.icon} className={`${s.icon} ${tone}`} />
          <p className={cs.body}>{it.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Quote cards: three columns, each holding one or two cited passages. */
function CitationCards({ columns }: { columns: { text: string; by: string }[][] }) {
  return (
    <div className={s.citeRow}>
      {columns.map((col, i) => (
        <div key={i} className={s.citeCard}>
          {col.map((c) => (
            <blockquote key={c.by} className={s.cite}>
              <p className={cs.body}>{c.text}</p>
              <footer className={`${cs.body} ${s.citeBy}`}>– {c.by}</footer>
            </blockquote>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- A · Problem framing ---------- */

const FIVE_W: { label: string; lines: string[] }[] = [
  {
    label: "Who is affected?",
    lines: [
      "Language enthusiasts and self-motivated learners (primarily 15–30 years old) who want to learn through authentic content consumption.",
    ],
  },
  {
    label: "What is the problem?",
    lines: [
      "They lose motivation and often quit because the learning experience feels disconnected from the content that inspired them.",
    ],
  },
  {
    label: "When does it occur?",
    lines: [
      "After the initial excitement of learning fades and they realize language apps don't relate to authentic content. Usually a few weeks or months into self-learning.",
    ],
  },
  {
    label: "Where does it occur?",
    lines: [
      "On mobile and web platforms—mainly inside generic language apps, outside the context of authentic content viewing.",
    ],
  },
  {
    label: "Why does it happen?",
    lines: [
      "Because current tools are too generic, academic, or gamified without reflecting the media users want to understand (anime, manga, fan culture).",
    ],
  },
  {
    label: "How does it affect users?",
    lines: [
      "They become disengaged, progress slows, they forget what they learn, and many eventually give up on their goal. Some even feel guilt or frustration for “failing.”",
    ],
  },
];

const CONSTRAINTS: { icon: IconName; text: string }[] = [
  { icon: "clock", text: "Six-week, self-directed timeline during summer break." },
  { icon: "translate", text: "Content discovery was scoped out to focus on the core watch → mine → review loop." },
  {
    icon: "emojiSad",
    text: "Dense by design: committed learners need progress data at a glance, so information density took priority over strict Hick's-law minimalism.",
  },
  {
    icon: "sparkles",
    text: "Micro-interactions were out of scope within six weeks; motion is planned for the next iteration.",
  },
];

/** Phases on a six-week track: start and length in weeks. */
const PHASES: { icon: IconName; title: string; sub: string; start: number; weeks: number }[] = [
  { icon: "bookOpen", title: "Discovery & Synthesis", sub: "User Needs to Actionable Frameworks", start: 0, weeks: 2.52 },
  { icon: "duplicate", title: "Structure & Visual Direction", sub: "Design Flows and Visual Direction", start: 1.49, weeks: 2.05 },
  { icon: "server", title: "Design System + Components", sub: "Reusable Systems with Visual Polish", start: 3, weeks: 2.25 },
  { icon: "cube", title: "Hi-Fi Design", sub: "Polished Design Delivery", start: 4.46, weeks: 1.54 },
];

function Timeline() {
  const pct = (w: number) => `${(w / 6) * 100}%`;
  return (
    <div className={s.timeline}>
      <ol className={s.weeks} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>Week {i + 1}</li>
        ))}
      </ol>
      <ol className={s.phases}>
        {PHASES.map((p, i) => {
          const next = PHASES[i + 1];
          // Hatched tail = the weeks this phase overlaps the next one.
          const overlap = next ? Math.max(0, p.start + p.weeks - next.start) / p.weeks : 0;
          return (
            <li
              key={p.title}
              className={s.phase}
              style={
                {
                  "--left": pct(p.start),
                  "--width": pct(p.weeks),
                  "--overlap": `${overlap * 100}%`,
                } as CSSProperties
              }
            >
              <span className={s.phaseIcon}>
                <Icon name={p.icon} size={16} />
              </span>
              <span className={s.phaseTitle}>{p.title}</span>
              <span className={s.phaseSub}>
                {p.sub}
                <span className={s.srOnly}>
                  {" "}
                  (weeks {Math.floor(p.start) + 1}–{Math.ceil(p.start + p.weeks)})
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function AppendixA() {
  return (
    <Section
      id="a"
      title="Problem framing"
      introTitle="Full 5W1H, constraints and timeline"
      intro="Condensed in the case study into the problem statement and the project frame."
    >
      <Fig caption="5W1H problem framing">
        <div className={`${s.panel} ${s.fiveW}`}>
          <RowCards rows={FIVE_W} />
        </div>
      </Fig>

      <div className={s.split}>
        <h3 className={`${cs.h3} ${s.splitTitle}`}>Constraints that shaped scope</h3>
        <div className={s.splitBody}>
          <p className={cs.body}>
            Four constraints shaped the scope. Each one forced a prioritization call that kept the concept
            focused on the core learning loop.
          </p>
          <IconList items={CONSTRAINTS} tone={s.yellow} />
        </div>
      </div>

      <Fig caption="Six-week timeline">
        <div className={`${s.panel} ${s.timelinePanel}`}>
          <Timeline />
        </div>
      </Fig>
    </Section>
  );
}

/* ---------- B · Research detail ---------- */

const SWOT: { title: string; points: string[] }[] = [
  {
    title: "Strengths",
    points: [
      "Covers diverse formats: gamification, immersion, live tutors, flashcards, and audio learning.",
      "Highly accessible across web, mobile, and desktop, supporting many learning needs.",
      "Personalization options—adaptive review and community feedback improve learning outcomes.",
    ],
  },
  {
    title: "Weaknesses",
    points: [
      "No single app provides conversational, immersive, grammar, and vocab tools in one place.",
      "Many tools lack strong real-world immersion beyond scripted activities.",
      "Community and peer practice features are limited or fragmented across platforms.",
    ],
  },
  {
    title: "Opportunities",
    points: [
      "Combine media immersion, live practice, and adaptive learning into one seamless platform.",
      "Use AI for hyper-personalized lesson suggestions and feedback at scale.",
      "Build low-pressure, social speaking practice and peer review features directly into the tool.",
    ],
  },
  {
    title: "Threats",
    points: [
      "Over-gamification may lead to mindless repetition and streak chasing, not real language mastery.",
      "Lack of real conversation and context leaves users unprepared for spontaneous, real-world situations.",
      "Isolated skills practice (grammar, vocab) risks passive learning and low confidence in natural communication.",
    ],
  },
];

const SOURCE_QUOTES = [
  [
    {
      text: "“Hundreds of studies in cognitive and educational psychology have demonstrated that spacing out repeated encounters with the material over time produces superior long-term learning, compared with repetitions that are massed together.”",
      by: "Kang (2016)",
    },
    {
      text: "Retrieval Practice Study Found that spaced retrieval practice produced significantly better long-term retention than repeated study sessions, with effects lasting weeks to months.",
      by: "Karpicke & Roediger (2008)",
    },
  ],
  [
    {
      text: "Authentic Materials Study Found that authentic materials significantly increased learners' observed motivation compared with artificial textbook materials, even at beginner level.",
      by: "Peacock (1997)",
    },
  ],
  [
    {
      text: "Cognitive Load Theory Foundation Studies show that managing cognitive load through proper design of multimedia interfaces is crucial for second language acquisition, with segmentation reducing cognitive overload.",
      by: "Sweller (1988)",
    },
    {
      text: "Multimedia Learning Principles Found that learners perform better when information is presented in manageable chunks with visual and auditory channels working together, rather than overwhelming single-mode presentation.",
      by: "Mayer (2009)",
    },
  ],
];

const STUDIES = [
  [
    {
      text: "Such platforms lead to improved language proficiency compared to traditional methods. This is because, the immersive nature of gamification, facilitated by storytelling and narrative-driven scenarios, enhances comprehension and retention. Immersion-based approaches showed superior long-term retention over point-based gamification.",
      by: "Frontiers Research (2024)",
    },
  ],
  [
    {
      text: "More than seven in ten people in India (72%) prefer watching content in languages other than the ones they speak or understand with subtitles. South India has the highest preference for subtitles while North and East India are more likely than South to favour dubbing. More people are interested in Korean and Japan these days because of Kpop and anime",
      by: "YouGov India Research (2019)",
    },
  ],
  [
    {
      text: "Self-directed learning gives students the freedom to decide what they learn, when they learn it, and how they learn it. However, studies consistently identify time management and resource quality as primary challenges.",
      by: "ResearchGate Review (2024)",
    },
  ],
];

function AppendixB() {
  return (
    <Section
      id="b"
      title="Research detail"
      introTitle="SWOT, source quotes and published studies"
      intro="Condensed in the case study into the competitor table and the evidence chain."
    >
      <Fig caption="SWOT of the language-learning market">
        <div className={`${s.panel} ${s.swotPanel}`}>
          <div className={s.logos}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cs/immerlingo/img/appendix-market-logos.png"
              alt="Logos of the language-learning apps reviewed, including Duolingo, Rosetta Stone, italki, Mondly, Anki, Memrise, Babbel, Busuu and Quizlet"
              width={775}
              height={40}
              loading="lazy"
              decoding="async"
            />
            <p className={s.more}>And many more...</p>
          </div>
          <div className={s.swot}>
            {SWOT.map((q) => (
              <section key={q.title} className={s.swotCard} aria-label={q.title}>
                <h4 className={cs.h3}>{q.title}</h4>
                {q.points.map((p) => (
                  <p key={p} className={cs.body}>
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Fig>

      <Fig caption="Source quotes from published research">
        <div className={`${s.panel} ${s.citePanel}`}>
          <CitationCards columns={SOURCE_QUOTES} />
        </div>
      </Fig>

      <Fig caption="Published studies, full text">
        <div className={`${s.panel} ${s.citePanel}`}>
          <CitationCards columns={STUDIES} />
        </div>
      </Fig>
    </Section>
  );
}

/* ---------- C · Insight detail ---------- */

const FRICTIONS_LEFT: { icon: IconName; text: string }[] = [
  {
    icon: "trendingDown",
    text: "Learners resist pausing content to look up words, leading to missed learning moments and passive consumption.",
  },
  {
    icon: "chartPie",
    text: "Limited access to polished, user-friendly apps—especially for nuanced learning—frustrates users used to global standards.",
  },
];

const FRICTIONS_RIGHT: { icon: IconName; text: string }[] = [
  {
    icon: "newspaper",
    text: "Vocabulary learned yesterday vanishes today, creating hopelessness and questioning learning ability.",
  },
  {
    icon: "scissors",
    text: "Interrupting shows/movies to look up words breaks flow and emotional engagement, reducing learning effectiveness.",
  },
  {
    icon: "academicCap",
    text: "Heavy grammar focus and repetitive drills make learning feel like tedious homework, killing enthusiasm.",
  },
  {
    icon: "sparkles",
    text: "Lack of engaging, integrated content—especially authentic media—reduces sustained motivation and practice.",
  },
];

const JTBD: { label: string; lines: string[] }[] = [
  {
    label: "Functional Outcome",
    lines: [
      "Tap-to-translate and context-aware explanations for any on-screen text or dialogue.",
      "Automatic vocabulary capture and review tied to specific scenes or gameplay.",
      "Role-play scenarios for conversational practice in context (gaming menus, café orders, office meetings).",
    ],
  },
  {
    label: "Emotional Outcome",
    lines: [
      "Sustained flow state—no friction between “watch/read/play” and “learn.”",
      "Confidence that progress is meaningful (not just app streaks).",
      "Authentic connection to culture—feeling like a fan, traveller, or colleague rather than a student.",
    ],
  },
  {
    label: "Struggling Moments",
    lines: [
      "Pausing or switching away from content to look up words breaks immersion.",
      "Retention loss: words encountered in media vanish without spaced repetition tied to context.",
      "Feeling isolated: lack of practice partners, or tools that only teach “school-style” phrases.",
    ],
  },
];

function AppendixC() {
  return (
    <Section
      id="c"
      title="Insight detail"
      introTitle="Frictions and the full JTBD"
      intro="Condensed in the case study into the affinity map."
    >
      <div className={s.block}>
        <div className={s.split}>
          <h3 className={`${cs.h2} ${s.splitTitle}`}>Frictions learners described</h3>
          <p className={`${cs.body} ${s.splitBody}`}>
            Recurring frustrations that compound until learners stop practising and fall back to passive
            scrolling.
          </p>
        </div>
        <div className={s.split}>
          <div className={s.splitHalf}>
            <IconList items={FRICTIONS_LEFT} tone={s.muted} />
          </div>
          <div className={s.splitHalf}>
            <IconList items={FRICTIONS_RIGHT} tone={s.pink} />
          </div>
        </div>
      </div>

      <Fig caption="Full jobs to be done, including struggling moments">
        <div className={`${s.panel} ${s.jtbdPanel}`}>
          <RowCards rows={JTBD} />
        </div>
      </Fig>
    </Section>
  );
}

/* ---------- D · Journey detail ---------- */

const STAGES: { n: string; name: [string, string]; actions: string[] }[] = [
  {
    n: "0.0",
    name: ["Motivation", "& Discovery"],
    actions: [
      "Browses anime/manga/game forums for untranslated content",
      "Reads online reviews of untranslated content in English",
    ],
  },
  {
    n: "1.0",
    name: ["Setup", "& Onboarding"],
    actions: ["Installs learning-through-media app", "Links streaming accounts and e-manga reader"],
  },
  {
    n: "2.0",
    name: ["Consumption", "& Lookup"],
    actions: [
      "Watches anime episode with interactive subtitles",
      "Taps unknown words in scene",
      "Continues episode without pausing",
    ],
  },
  {
    n: "3.0",
    name: ["Deferred", "review"],
    actions: ["Receives flashcard reminders tied to saved scene context", "Reviews key phrases during commute"],
  },
  {
    n: "4.0",
    name: ["Practice", "& Social"],
    actions: [
      "Joins community challenge to use learned phrases in role-play",
      "Chats with AI Otaku profile in Japanese",
    ],
  },
  {
    n: "5.0",
    name: ["Mastery", "& Share"],
    actions: ["Posts clip of himself reading a light-novel in Japanese", "Recommends tool to friends"],
  },
];

function Journey() {
  return (
    <ol className={s.journey}>
      {STAGES.map((st, i) => (
        <li key={st.n} className={s.stage}>
          <div className={s.stageCol}>
            <p className={s.pill}>
              <span>{st.n}</span>
              <span>
                {st.name[0]}
                <br />
                {st.name[1]}
              </span>
            </p>
            {i < STAGES.length - 1 && (
              <svg className={s.arrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 1v13M3 9l5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div className={s.lane}>
            <span className={s.laneLine} aria-hidden="true" />
            <ol className={s.actions}>
              {st.actions.map((a, j) => (
                <li key={a} className={s.action}>
                  <span className={s.dot} aria-hidden="true" />
                  <span className={s.actionNum}>
                    {st.n.split(".")[0]}.{j + 1}
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ol>
          </div>
        </li>
      ))}
    </ol>
  );
}

function AppendixD() {
  return (
    <Section
      id="d"
      title="Journey detail"
      introTitle="Stage-by-stage experience flow"
      intro="Condensed in the case study into the annotated emotion curve."
    >
      <Fig caption="Journey stages and actions">
        <div className={`${s.panel} ${s.journeyPanel}`}>
          <Journey />
        </div>
      </Fig>
    </Section>
  );
}

export function ImmerlingoAppendix() {
  return (
    <div className={s.appendix}>
      <AppendixA />
      <AppendixB />
      <AppendixC />
      <AppendixD />
    </div>
  );
}
