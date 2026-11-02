import { Chapter, ChapterEnd, Figure, Opener } from "../Primitives";
import styles from "./Ch03Problem.module.css";
import { AppendixPointer } from "../AppendixPointer";

type Avatar = "youtube" | "reddit" | "forum";
type Tier = "back" | "mid";
type Quote = { avatar: Avatar; author: string; sub?: string; text: string; count: string };

/* Comments from the Figma "Comment sea" (329:1564), deduplicated. */
const quotes: Quote[] = [
  { avatar: "youtube", author: "A YouTube commenter", text: "The app barely teaches grammar. You just repeat sentences without ever understanding why they’re structured that way.", count: "123" },
  { avatar: "youtube", author: "Why Duolingo Feels Useless", text: "It’s all translation drills and streaks. Fun at first, but after months I realized I was memorizing phrases, not learning how to speak.", count: "101" },
  { avatar: "reddit", author: "A Reddit User", sub: "r/German", text: "Avoid Duolingo, it's dreadful… it’s a gamification of language learning which hinders rather than helps IMO", count: "123" },
  { avatar: "forum", author: "Doume forum User", sub: "u/Doume", text: "Seems gamification is good to keep one involved... But it shifts the focus from learning the language to earning XP, crystals... Why I feel that I know almost nothing then", count: "456" },
  { avatar: "reddit", author: "A Reddit User", sub: "r/Unpopularopinion", text: "I detest Duolingo ... The actual level of language being taught even in longer courses is so basic as to be useless … reliance on translation as a teaching method which causes a LOT of problems…", count: "112" },
  { avatar: "reddit", author: "A Reddit User", sub: "r/LanguageLearningCirclejerk", text: "Avoid traditional language learning — endless grammar drills and word lists masquerade as progress, yet they kill motivation and never build real fluency.", count: "415" },
  { avatar: "reddit", author: "A Reddit User", sub: "r/Japanese Course", text: "I finished the entire Japanese course but couldn’t read a simple children’s book or understand basic spoken Japanese. I had to start almost from scratch with proper textbooks.", count: "789" },
];

/** [tier, x, y, height, quote] from the Figma "Comment sea" (stage px). */
const sea: [Tier, number, number, number, number][] = [
  ["back", -25, -60, 121.9, 0],
  ["back", -25, 83, 121.9, 1],
  ["back", -25, 225, 102.9, 2],
  ["back", -25, 349, 121.9, 3],
  ["back", -25, 492, 140.9, 4],
  ["back", -25, 654, 121.9, 5],
  ["back", 245, -10, 102.9, 2],
  ["back", 245, 114, 121.9, 3],
  ["back", 245, 256, 140.9, 4],
  ["back", 245, 418, 121.9, 5],
  ["back", 245, 561, 140.9, 6],
  ["back", 515, -90, 140.9, 4],
  ["back", 515, 72, 121.9, 5],
  ["back", 515, 214, 140.9, 6],
  ["back", 515, 376, 121.9, 0],
  ["back", 515, 519, 121.9, 1],
  ["back", 785, -35, 140.9, 6],
  ["back", 785, 127, 121.9, 0],
  ["back", 785, 269, 121.9, 1],
  ["back", 785, 412, 102.9, 2],
  ["back", 785, 536, 121.9, 3],
  ["mid", -40, 40, 151.4, 1],
  ["mid", 600, 20, 170.4, 4],
  ["mid", -70, 320, 151.4, 0],
  ["mid", 690, 290, 151.4, 3],
  ["mid", 150, 470, 170.4, 6],
  ["mid", 540, 490, 132.4, 2],
];

function AvatarMark({ kind }: { kind: Avatar }) {
  if (kind === "youtube") {
    return (
      <svg className={styles.avatar} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#f5f4f4" />
        <rect x="4.5" y="7" width="15" height="10.5" rx="3" fill="#f21d0d" />
        <path d="M10.5 9.8v4.9l4.2-2.45z" fill="#fff" />
      </svg>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny avatar, sized by CSS
    <img
      className={styles.avatar}
      src={`/cs/immerlingo/img/problem-avatar-${kind}.png`}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}

/* heroicons v1 outline: arrow-sm-up, arrow-sm-down, chat, dots-horizontal */
function Actions({ count }: { count: string }) {
  return (
    <div className={styles.actions}>
      <svg className={styles.vote} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
      <span className={styles.count}>{count}</span>
      <svg className={styles.vote} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
      <svg className={styles.tool} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg className={styles.tool} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    </div>
  );
}

function Comment({ tier, x, y, h, q }: { tier: Tier; x: number; y: number; h: number; q: Quote }) {
  return (
    <div
      className={`${styles.comment} ${styles[tier]}`}
      style={{
        left: `${(x / 1020) * 100}%`,
        top: `${(y / 640) * 100}%`,
        height: `calc(${h} * var(--v))`,
      }}
    >
      <div className={styles.who}>
        <AvatarMark kind={q.avatar} />
        <span className={styles.author}>{q.author}</span>
        {q.sub && (
          <>
            <span className={styles.subDot} />
            <span className={styles.sub}>{q.sub}</span>
          </>
        )}
      </div>
      <p className={styles.text}>{q.text}</p>
      <Actions count={q.count} />
    </div>
  );
}

/** 03 · The problem (Figma 329:1547) */
export function Ch03Problem() {
  return (
    <Chapter id="problem" label="The problem">
      <div className={styles.opener}>
        <Opener
          eyebrow="The problem"
          title="Learners quit because their apps ignore the shows that made them start."
        />
      </div>

      <Figure
        type="Image"
        title="Learners describe the same problem in their own words"
        glow={false}
        stageClassName={styles.stage}
      >
        <div className={styles.sea} aria-hidden="true">
          {sea.map(([tier, x, y, h, i]) => (
            <Comment key={`${x},${y}`} tier={tier} x={x} y={y} h={h} q={quotes[i]} />
          ))}
        </div>
        <span className={styles.vignette} aria-hidden="true" />
        <blockquote className={styles.highlight}>
          <div className={styles.hiWho}>
            <span className={styles.hiAvatar} aria-hidden="true" />
            <cite className={styles.hiAuthor}>A Reddit User</cite>
          </div>
          <p className={styles.hiText}>
            I started learning with the hope of watching my favorite shows without subtitles, but after
            months of drills and memorizing random phrases, I can barely follow anything. It feels
            pointless when I never learn the stuff actually used in real content.
          </p>
          <div className={styles.hiActions} aria-hidden="true">
            <Actions count="789" />
          </div>
        </blockquote>
      </Figure>

      <div className={styles.end}>
        <p className={styles.appendix}>
          <span>Full detail:</span>
          <span>5W1H breakdown, constraints and timeline</span>
          <AppendixPointer section="a" className={styles.appendixLink} />
        </p>
        <ChapterEnd>Two learners showed this most clearly.</ChapterEnd>
      </div>
    </Chapter>
  );
}
