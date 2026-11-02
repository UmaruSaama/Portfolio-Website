import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Chapter, ChapterEnd, Figure, Opener } from "../Primitives";
import cs from "../cs.module.css";
import s from "./Ch09System.module.css";

/* ---------- small inline icons (Phosphor-style, drawn locally) ---------- */

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M155.51 24.81a8 8 0 0 0-8.42.88L77.25 80H32a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h45.25l69.84 54.31A8 8 0 0 0 160 224V32a8 8 0 0 0-4.49-7.19ZM32 96h40v64H32Zm112 111.64-56-43.55V91.91l56-43.55Zm54-106.08a40 40 0 0 1 0 52.88 8 8 0 0 1-12-10.58 24 24 0 0 0 0-31.72 8 8 0 0 1 12-10.58ZM248 128a79.9 79.9 0 0 1-20.37 53.34 8 8 0 0 1-11.92-10.67 64 64 0 0 0 0-85.33 8 8 0 1 1 11.92-10.67A79.83 79.83 0 0 1 248 128Z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M197.58 129.06 146 110.08l-19-51.65a15.92 15.92 0 0 0-29.88 0L78.07 110l-51.65 19a15.92 15.92 0 0 0 0 29.88L78 178l19 51.62a15.92 15.92 0 0 0 29.88 0l19-51.61 51.65-19a15.92 15.92 0 0 0 0-29.88ZM140.39 163a15.87 15.87 0 0 0-9.43 9.43l-19 51.46L93 172.39a15.87 15.87 0 0 0-9.39-9.39l-51.46-19 51.46-19a15.87 15.87 0 0 0 9.39-9.39l19-51.46 19 51.46a15.87 15.87 0 0 0 9.43 9.43l51.46 19ZM144 40a8 8 0 0 1 8-8h16V16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0V48h-16a8 8 0 0 1-8-8Zm104 48a8 8 0 0 1-8 8h-8v8a8 8 0 0 1-16 0v-8h-8a8 8 0 0 1 0-16h8v-8a8 8 0 0 1 16 0v8h8a8 8 0 0 1 8 8Z" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="2.4" />
      <path d="M6.9 1.8h2.2l.4 1.7 1.2.7 1.7-.5 1.1 1.9-1.3 1.2v1.4l1.3 1.2-1.1 1.9-1.7-.5-1.2.7-.4 1.7H6.9l-.4-1.7-1.2-.7-1.7.5-1.1-1.9 1.3-1.2V7.3L2.5 6.1l1.1-1.9 1.7.5 1.2-.7Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

function CaretIcon({ className, up = false }: { className?: string; up?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={up ? "M3.5 10 8 5.5l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} />
    </svg>
  );
}

/* ---------- word card (shared by the anatomy and core-components figures) ---------- */

/** The app's word card. `k` scales it: 1.1 in the anatomy, 0.8 in the components sheet. */
function WordCard({ k, className }: { k: number; className?: string }) {
  return (
    <div className={`${s.wordCard} ${className ?? ""}`} style={{ "--k": k } as CSSProperties}>
      <div className={s.wcHead}>
        <span className={s.wcWord} lang="ja">
          閉める
        </span>
        <span className={s.wcReading} lang="ja">
          しめる
        </span>
        <SpeakerIcon className={s.wcSpeaker} />
        <span className={s.wcSpacer} />
        <span className={s.badge}>New</span>
      </div>
      <div className={s.wcTags}>
        <span className={s.badge}>Common in anime</span>
        <span className={s.badge}>Common in drama</span>
        <span className={s.badge}>JLPT N3</span>
      </div>
      <p className={s.wcMeanings}>1. to close, to shut&nbsp;&nbsp; 2. to tighten&nbsp;&nbsp; 3. to total (up)</p>
      <p className={s.wcHere}>
        Here: <span lang="ja">閉めちゃった</span> — closed it (already)
      </p>
      <div className={s.wcActions}>
        <span className={`${s.btn} ${s.btnPrimary}`}>
          Save card
          <PlusIcon className={s.btnIcon} />
        </span>
        <span className={`${s.btn} ${s.btnSecondary}`}>Edit card</span>
        <span className={`${s.btn} ${s.btnSecondary}`}>
          Explain line
          <SparkleIcon className={s.btnIcon} />
        </span>
      </div>
      <div className={s.wcMore}>
        <span className={`${s.btn} ${s.btnLink}`}>Mark as known</span>
        <span className={`${s.btn} ${s.btnLink}`}>Ignore word</span>
        <span className={`${s.btn} ${s.btnLink}`}>Sentence card</span>
      </div>
    </div>
  );
}

/* ---------- colour mood (Figma 329:3422) ---------- */

type Swatch = { name: string; hsba: string; hex: string; note: ReactNode };

const aa = (grade: string, rest: string) => (
  <>
    <b>{grade}</b>
    {rest}
  </>
);

const dark: { group: string; swatches: Swatch[] }[] = [
  {
    group: "Accent",
    swatches: [
      { name: "Accent/Primary", hsba: "hsba(351, 70%, 76%, 1)", hex: "#C23A4F", note: aa("AA", " · UI · 3.7:1") },
      { name: "Accent/Text", hsba: "hsba(353, 44%, 91%, 1)", hex: "#E8838F", note: aa("AAA", " · 7.4:1") },
      { name: "Accent/On-accent", hsba: "hsba(0, 0%, 100%, 1)", hex: "#FFFFFF", note: aa("AA", " · 5.2:1") },
    ],
  },
  {
    group: "Neutral",
    swatches: [
      { name: "Background/Base", hsba: "hsba(240, 13%, 6%, 1)", hex: "#0E0E10", note: "Surface" },
      { name: "Background/Raised", hsba: "hsba(240, 11%, 11%, 1)", hex: "#18181B", note: "Surface" },
      { name: "Neutral/Text-strong", hsba: "hsba(240, 2%, 92%, 1)", hex: "#E6E6EA", note: aa("AAA", " · 15.5:1") },
    ],
  },
  {
    group: "Levels",
    swatches: [
      { name: "Levels/L0/Text", hsba: "hsba(205, 49%, 89%, 1)", hex: "#73B4E2", note: aa("AAA", " · 8.6:1") },
      { name: "Levels/L1/Text", hsba: "hsba(139, 52%, 77%, 1)", hex: "#5FC57F", note: aa("AAA", " · 9.0:1") },
      { name: "Levels/L2/Text", hsba: "hsba(221, 56%, 81%, 1)", hex: "#5B80CE", note: aa("AA", " · 5.0:1") },
      { name: "Levels/L3/Text", hsba: "hsba(46, 72%, 93%, 1)", hex: "#EEC542", note: aa("AAA", " · 11.7:1") },
      { name: "Levels/L4/Text", hsba: "hsba(23, 70%, 97%, 1)", hex: "#F78C49", note: aa("AAA", " · 8.1:1") },
      { name: "Levels/L5/Text", hsba: "hsba(346, 64%, 87%, 1)", hex: "#DD4F71", note: aa("AA", " · 5.0:1") },
    ],
  },
];

const light: { group: string; swatches: Swatch[] }[] = [
  {
    group: "Accent",
    swatches: [
      { name: "Accent/Primary", hsba: "hsba(351, 70%, 76%, 1)", hex: "#C23A4F", note: aa("AA", " · UI · 4.8:1") },
      { name: "Accent/Text", hsba: "hsba(350, 75%, 68%, 1)", hex: "#AD2C42", note: aa("AA", " · 5.9:1") },
      { name: "Accent/On-accent", hsba: "hsba(0, 0%, 100%, 1)", hex: "#FFFFFF", note: aa("AA", " · 5.2:1") },
    ],
  },
  {
    group: "Neutral",
    swatches: [
      { name: "Background/Base", hsba: "hsba(240, 1%, 96%, 1)", hex: "#F4F4F6", note: "Surface" },
      { name: "Background/Raised", hsba: "hsba(0, 0%, 100%, 1)", hex: "#FFFFFF", note: "Surface" },
      { name: "Neutral/Text-strong", hsba: "hsba(240, 15%, 10%, 1)", hex: "#16161A", note: aa("AAA", " · 16.4:1") },
    ],
  },
  {
    group: "Levels",
    swatches: [
      { name: "Levels/L0/Text", hsba: "hsba(205, 67%, 60%, 1)", hex: "#336E99", note: aa("AA", " · 5.0:1") },
      { name: "Levels/L1/Text", hsba: "hsba(137, 84%, 47%, 1)", hex: "#13782F", note: aa("AA", " · 5.1:1") },
      { name: "Levels/L2/Text", hsba: "hsba(222, 71%, 69%, 1)", hex: "#3358B0", note: aa("AA", " · 6.0:1") },
      { name: "Levels/L3/Text", hsba: "hsba(45, 100%, 50%, 1)", hex: "#806100", note: aa("AA", " · 5.3:1") },
      { name: "Levels/L4/Text", hsba: "hsba(30, 100%, 64%, 1)", hex: "#A35200", note: aa("AA", " · 5.1:1") },
      { name: "Levels/L5/Text", hsba: "hsba(342, 74%, 77%, 1)", hex: "#C4325F", note: aa("AA", " · 4.8:1") },
    ],
  },
];

function Palette({ theme, groups }: { theme: string; groups: typeof dark }) {
  return (
    <div className={s.palette}>
      {groups.map((g) => (
        <div key={g.group} className={s.paletteGroup}>
          <h4 className={s.paletteTitle}>{g.group}</h4>
          <ul className={s.swatches} aria-label={`${theme} ${g.group} colours`}>
            {g.swatches.map((sw) => (
              <li key={sw.name} className={s.swatch}>
                <span className={s.chip} style={{ background: sw.hex }} aria-hidden="true" />
                <span className={s.swName}>{sw.name}</span>
                <span>{sw.hsba}</span>
                <span>{sw.hex}</span>
                <span className={typeof sw.note === "string" ? s.swName : s.swGrade}>{sw.note}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------- word card anatomy specs (Figma 406:6530) ---------- */

const outlines = [
  { name: "head", top: 155, h: 40 },
  { name: "frequency-tags", top: 208, h: 73 },
  { name: "meanings", top: 294, h: 27 },
  { name: "in-this-line", top: 334, h: 22 },
  { name: "actions.primary", top: 370, h: 42 },
  { name: "actions.secondary", top: 425, h: 40 },
];

const gaps = [195.1, 280.9, 321.1, 356.3, 411.3];

const parts = [
  { part: "head", purpose: "word, reading, audio, status", top: 161, dot: 173 },
  { part: "frequency-tags", purpose: "where it is common, JLPT level", top: 231, dot: 243 },
  { part: "meanings", purpose: "numbered senses", top: 294, dot: 306 },
  { part: "in-this-line", purpose: "meaning in this scene", top: 331, dot: 343 },
  { part: "actions.primary", purpose: "save, edit, explain", top: 376, dot: 388 },
  { part: "actions.secondary", purpose: "known, ignore, sentence card", top: 430, dot: 442.5 },
];

const tokens = [
  { name: "Neutral/Text-strong", left: 89, top: 163, sw: s.tkStrong, leader: 63, dot: 300 },
  { name: "Neutral/Fill", left: 131, top: 213, sw: s.tkFill, leader: 63, dot: 300 },
  { name: "Neutral/Text-weak", left: 101, top: 333, sw: s.tkWeak, leader: 63, dot: 300 },
  { name: "Accent/Primary", left: 119, top: 377, sw: s.tkAccent, leader: 63, dot: 300 },
  { name: "Background/Overlay", left: 95, top: 432, sw: s.tkOverlay, leader: 40, dot: 277 },
];

const px = (n: number) => `calc(${n} * var(--v))`;

function AnatomySpecs() {
  return (
    <div className={s.specs} aria-hidden="true">
      <span className={s.pad} style={{ left: px(301), top: px(132), width: px(418), height: px(22) }} />
      <span className={s.pad} style={{ left: px(279), top: px(154), width: px(22), height: px(311.2) }} />
      {gaps.map((t) => (
        <span key={t} className={s.pad} style={{ left: px(301), top: px(t), width: px(418), height: px(13.2) }} />
      ))}
      {outlines.map((o) => (
        <span key={o.name} className={s.outline} style={{ left: px(302), top: px(o.top), width: px(416), height: px(o.h) }} />
      ))}
      <span className={s.value} style={{ left: px(505), top: px(137) }}>20</span>
      <span className={s.value} style={{ left: px(285), top: px(304) }}>20</span>
      {[196, 282, 322, 357, 412].map((t) => (
        <span key={t} className={s.value} style={{ left: px(702), top: px(t) }}>12</span>
      ))}
      <span className={s.measure} style={{ left: px(747), top: px(124) }}>r 20</span>
      <svg className={s.arc} style={{ left: px(719), top: px(132), width: px(22), height: px(22) }} viewBox="0 0 22 22" fill="none">
        <path d="M0 .5A21.5 21.5 0 0 1 21.5 22" stroke="#d74387" />
      </svg>
      <span className={s.dim} style={{ left: px(279), top: px(505), width: px(462), height: px(1) }} />
      <span className={s.dim} style={{ left: px(279), top: px(501), width: px(1), height: px(9) }} />
      <span className={s.dim} style={{ left: px(740), top: px(501), width: px(1), height: px(9) }} />
      <span className={s.measure} style={{ left: px(483), top: px(513) }}>420 × hug</span>

      {parts.map((p) => (
        <Fragment key={p.part}>
          <span className={s.dot} style={{ left: px(715), top: px(p.dot) }} />
          <span className={s.leader} style={{ left: px(718), top: px(p.dot + 2), width: px(53) }} />
          <span className={s.partName} style={{ left: px(781), top: px(p.top) }}>{p.part}</span>
          <span className={s.partPurpose} style={{ left: px(781), top: px(p.top + 15) }}>{p.purpose}</span>
        </Fragment>
      ))}

      {tokens.map((t) => (
        <Fragment key={t.name}>
          <span className={s.token} style={{ left: px(t.left), top: px(t.top) }}>
            <span className={`${s.tokenSwatch} ${t.sw}`} />
            {t.name}
          </span>
          <span className={s.leader} style={{ left: px(239), top: px(t.top + 12), width: px(t.leader) }} />
          <span className={s.dot} style={{ left: px(t.dot), top: px(t.top + 10) }} />
        </Fragment>
      ))}
    </div>
  );
}

/* ---------- player settings panel (Figma 406:6841) ---------- */

function SettingsPanel() {
  return (
    <div className={s.settingsCard}>
      <div className={s.settings}>
        <div className={s.stHead}>
          <GearIcon className={s.icon16} />
          <div className={s.stTitles}>
            <span className={s.stTitle}>Settings for this episode</span>
            <span className={s.stSub}>Carries over to the next one unless you change it</span>
          </div>
          <XIcon className={s.icon16} />
        </div>

        <div className={s.helpLevel}>
          <span className={s.rowTitle}>Help level</span>
          <span className={s.segments}>
            <span className={s.segment}>Less</span>
            <span className={`${s.segment} ${s.segmentOn}`}>Auto</span>
            <span className={s.segment}>More</span>
          </span>
          <span className={s.stSub}>Settings below follow your level unless you lock them.</span>
        </div>

        <div className={s.stGroup}>
          <span>Learning mode</span>
          <CaretIcon up className={s.icon13} />
        </div>
        <div className={`${s.radioRow} ${s.radioRowOn}`}>
          <span className={`${s.radio} ${s.radioOn}`} />
          <span className={s.radioText}>
            <span className={s.rowTitle}>Default</span>
            <span className={s.rowHint}>Subtitles as your help level sets them</span>
          </span>
        </div>
        <div className={s.radioRow}>
          <span className={s.radio} />
          <span className={s.radioText}>
            <span className={s.rowTitle}>Warm-up listening</span>
            <span className={s.rowHint}>Preview the line’s new words, then hear it</span>
          </span>
        </div>
        <span className={s.moreModes}>6 more modes — reading, hybrid, pause on line…</span>

        <div className={s.stGroup}>
          <span>Subtitles</span>
          <CaretIcon up className={s.icon13} />
        </div>
        {[
          ["Japanese subtitles", "Japanese [CC]"],
          ["English subtitles", "Lines under 80% known"],
          ["Furigana", "Unknown kanji"],
        ].map(([label, value]) => (
          <div key={label} className={s.settingRow}>
            <span className={s.rowTitle}>{label}</span>
            <span className={s.settingValue}>
              {value}
              <CaretIcon className={s.icon14} />
            </span>
          </div>
        ))}
        <span className={s.stDivider} />
        {[
          ["Playback", "Pause on lookup off · resume replays the line · 1.0× · skip silence off"],
          ["Display", "Status underlines on · pitch colours off · size 100%"],
          ["Keyboard shortcuts", "Look up Alt+T · replay R · prev/next A / D · save S"],
        ].map(([label, hint]) => (
          <div key={label} className={s.linkRow}>
            <span className={s.radioText}>
              <span className={s.rowTitle}>{label}</span>
              <span className={s.stSub}>{hint}</span>
            </span>
            <CaretIcon className={s.icon16} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitHead({ title, children, className }: { title: string; children: string; className?: string }) {
  return (
    <div className={`${s.splitHead} ${className ?? ""}`}>
      <h3 className={`${cs.h2} ${s.splitTitle}`}>{title}</h3>
      <p className={`${cs.body} ${s.splitBody}`}>{children}</p>
    </div>
  );
}

export function Ch09System() {
  return (
    <Chapter id="system" label="The system underneath">
      <Opener
        eyebrow="The system underneath"
        titleWidth={950}
        title="A small system keeps every screen consistent."
        introTitle="Typography"
        intro={
          <p className={cs.body}>
            The typeface had to render Latin and Japanese scripts with equal clarity, down to small
            subtitle sizes.
          </p>
        }
      />

      <Figure
        type="Image"
        title="Typography: Noto Sans and Noto Sans JP"
        glow={false}
        stageClassName={s.typeStage}
      >
        <p className={`${s.specimen} ${s.specLatin}`}>Noto Sans</p>
        <p className={s.specBody}>
          Google created Noto Sans to eliminate &quot;tofu&quot; boxes - those empty rectangles
          appearing when fonts lack specific characters, aiming to support every writing system
          worldwide.
        </p>
        <p className={s.specAlphabet}>
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
        </p>
        <p className={`${s.specimen} ${s.specJp}`}>Noto Sans JP</p>
        <p className={s.specKana} lang="ja">
          あ ア, い イ, う ウ, え エ, お オ<br />
          か カ, き キ, く ク, け ケ, こ コ<br />
          さ サ, し シ, す ス, せ セ, そ ソ<br />
          た タ, ち チ, つ ツ, て テ, と ト<br />
          な ナ, に ニ, ぬ ヌ, ね ネ, の ノ<br />
          は ハ, ひ ヒ, ふ フ, へ ヘ, ほ ホ<br />
          ま マ, み ミ, む ム, め メ, も モ<br />
          や ヤ, ゆ ユ, よ ヨ<br />
          ら ラ, り リ, る ル, れ レ, ろ ロ<br />
          わ ワ, を ヲ<br />
          ん ン
        </p>
      </Figure>

      <section className={s.block} aria-label="Colour">
        <SplitHead title="Colour" className={s.colourHead}>
          Colours are defined in HSBA with transparency layers, so surfaces and states stay
          consistent in dark and light themes.
        </SplitHead>
        <Figure type="Image" title="Colour mood" glow={false} stageClassName={s.colourStage}>
          <div className={s.themeDark}>
            <Palette theme="Dark theme" groups={dark} />
          </div>
          <div className={s.themeLight}>
            <Palette theme="Light theme" groups={light} />
          </div>
        </Figure>
      </section>

      <section className={s.block} aria-label="Components">
        <SplitHead title="Components">
          Reusable cards, buttons and inputs with defined states. Every screen is built from one set.
        </SplitHead>
        <div className={s.anatomy}>
          <Figure
            type="Interactive"
            title="Word card anatomy"
            glow={false}
            stageClassName={s.anatomyStage}
            controls={
              <label className={s.toggle}>
                <input type="checkbox" role="switch" className={s.toggleInput} defaultChecked />
                <span className={s.switch} aria-hidden="true" />
                <span className={s.toggleLabel}>Specs</span>
              </label>
            }
          >
            <WordCard k={1.1} className={s.anatomyCard} />
            <AnatomySpecs />
          </Figure>
        </div>
      </section>

      <Figure
        type="Image"
        title="Core components: word card and player settings"
        glow={false}
        stageClassName={s.coreStage}
      >
        <div className={s.core}>
          <div className={s.coreParts}>
            <div className={s.coreGroup}>
              <p className={s.caption}>WORD CARD</p>
              <WordCard k={0.8} />
            </div>
            <div className={s.coreGroup}>
              <p className={s.caption}>BUTTONS · PRIMARY, SECONDARY, TERTIARY, LINK</p>
              <div className={s.coreRow} style={{ "--k": 0.8 } as CSSProperties}>
                <span className={`${s.btn} ${s.btnPrimary}`}>Save card</span>
                <span className={`${s.btn} ${s.btnSecondary}`}>Edit card</span>
                <span className={`${s.btn} ${s.btnTertiary}`}>Skip</span>
                <span className={`${s.btn} ${s.btnLink} ${s.btnAccent}`}>Mark as known</span>
              </div>
            </div>
            <div className={s.coreGroup}>
              <p className={s.caption}>BADGES · FIT AND TONE</p>
              <div className={s.badgeRow} style={{ "--k": 0.8 } as CSSProperties}>
                <span className={`${s.badge} ${s.fit}`}>
                  <span className={s.fitDot} />
                  82% for you
                </span>
                <span className={s.badge}>New</span>
                <span className={`${s.badge} ${s.toneAccent}`}>Best for learning</span>
                <span className={`${s.badge} ${s.toneSuccess}`}>Known</span>
                <span className={`${s.badge} ${s.toneWarning}`}>Learning</span>
                <span className={`${s.badge} ${s.toneDanger}`}>Tough</span>
              </div>
            </div>
          </div>
          <div className={s.coreGroup}>
            <p className={s.caption}>SETTINGS PANEL</p>
            <SettingsPanel />
          </div>
        </div>
      </Figure>

      <ChapterEnd>None of this has met a real learner yet. Here&apos;s how it would.</ChapterEnd>
    </Chapter>
  );
}
