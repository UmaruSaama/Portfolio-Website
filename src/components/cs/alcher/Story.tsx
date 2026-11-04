import type { ComponentType, CSSProperties, ReactNode } from "react";
import { PixelDivider, PixelText } from "./Pixel";
import st from "./Story.module.css";
import { worldData } from "./worldData";

/**
 * Narrative pieces of the Alcheringa '25 case study: chapter opener, the
 * six act interludes and the world (pixel-art background) they carry.
 */

/** Eyebrow: 10px cream pixel square + uppercase label (Figma "Eyebrow"). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className={st.eyebrow}>
      <span className={st.eyebrowMark} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Chapter opener (Figma "The context" etc.): divider, eyebrow, H1 (760
 * wide), optional intro row (title left, body at x 520).
 */
export function Opener({
  eyebrow,
  title,
  introTitle,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  introTitle?: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <header className={st.opener}>
      <div className={st.openerHead}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className={st.h1}>{title}</h2>
      </div>
      {(introTitle || intro) && (
        <div className={st.intro}>
          {introTitle && <h3 className={st.introTitle}>{introTitle}</h3>}
          {intro && <div className={st.introBody}>{intro}</div>}
        </div>
      )}
    </header>
  );
}

/* ---------- world ---------- */

/**
 * The pixel world (Figma "World" 521:53391, the v3 kit: skyline, festoon,
 * crowd, stage band, mascot) is cut into segments that each hang from the
 * act that starts them, so the art stays on its act even when the chapters
 * above run longer or shorter than in Figma (and on the compact layout).
 * `top` = where the segment starts relative to the act's top (Figma px).
 * Each segment paints its colour bands as one hard-stop gradient (the last
 * band runs on to the end of the group) and its art rows as images at one
 * pixel per 2px cell, scaled with nearest-neighbour sampling. The scene is
 * drawn once, 1440 wide and centred, as in Figma; past 1440 each side
 * continues with a one-cell edge strip (<piece>-l/-r.png: the row's edge
 * colour where it runs on, e.g. ground lines, else the row's band colour),
 * never a repeat of the scene. Data: worldData.ts (generated).
 */
type Segment = { key: keyof typeof worldData; top: number };

const W = "/cs/alcheringa-25/world3";
export const worldSky: Segment = { key: "sky", top: 0 };
/** Hangs from the end of the last act: Figma frame bottom = Close + 520. */
export const worldDawn: Segment = { key: "dawn", top: 0 };
const segments: Record<number, Segment> = {
  1: { key: "a1", top: -178 },
  2: { key: "a2", top: 0 },
  3: { key: "a3", top: -100 },
  4: { key: "a4", top: -100 },
  5: { key: "a5", top: -28 },
  6: { key: "a6", top: -28 },
};

const px = (n: number) => `calc(${n} * var(--v))`;

/** Inline style that paints a segment on a full-bleed layer. */
export function worldStyle(seg: Segment) {
  const d = worldData[seg.key];
  const layers: string[] = [];
  for (const p of d.pieces) {
    const at = `${px(p.y)} / `;
    const size = `${px(p.h)} no-repeat`;
    layers.push(`url(${W}/${p.src}.png) center ${at}${px(1440)} ${size}`);
    layers.push(`url(${W}/${p.src}-l.png) left ${at}var(--side) ${size}`);
    layers.push(`url(${W}/${p.src}-r.png) right ${at}var(--side) ${size}`);
  }
  const stops = d.stops
    .map(([y, c], i) => {
      const next = d.stops[i + 1];
      return next ? `${c} ${px(y)} ${px(next[0])}` : `${c} ${px(y)}`;
    })
    .join(", ");
  layers.push(d.stops.length > 1 ? `linear-gradient(${stops})` : `linear-gradient(${d.stops[0][1]}, ${d.stops[0][1]})`);
  return {
    background: layers.join(", "),
    "--seg-top": px(seg.top),
    "--seg-h": px(d.h),
  } as CSSProperties;
}

/** Hero backdrop: the night sky with festoons, moon and stars (the morph's
 *  data-glow hook, so it fades in as the card becomes the page). */
export function AlcherSky() {
  return <span className={st.sky} style={worldStyle(worldSky)} aria-hidden="true" data-glow />;
}

/* ---------- acts ---------- */

export type Act = { n: number; title: string; line: string };

/** Act interlude (Figma "Act NN – TITLE", 1020 × 520). */
function ActHead({ act }: { act: Act }) {
  const num = String(act.n).padStart(2, "0");
  return (
    <header className={st.act} aria-label={`Act ${num}: ${act.title}`}>
      <p className={st.actNum}>ACT {num}</p>
      <PixelText as="p" className={st.actTitle}>
        {act.title}
      </PixelText>
      <PixelDivider className={st.actDivider} />
      <p className={st.actLine}>{act.line}</p>
    </header>
  );
}

/**
 * One act: its interlude and the chapters it holds, over the act's world
 * segment. The segment layer sits behind every chapter of the group (and
 * can start a little above the act, where Figma's art does).
 */
export function ActGroup({
  act,
  chapters,
}: {
  act: Act;
  chapters: { id: string; Component?: ComponentType }[];
}) {
  const seg = segments[act.n];
  return (
    <div className={st.group}>
      {seg && <span className={st.world} style={worldStyle(seg)} aria-hidden="true" />}
      {/* The last act ends on the dawn, hung from the page's end (Figma:
          the dawn ends at the frame bottom, 520 below Close). */}
      {act.n === 6 && <span className={st.worldTail} style={worldStyle(worldDawn)} aria-hidden="true" />}
      <ActHead act={act} />
      {chapters.map(({ id, Component }) =>
        Component ? (
          <Component key={id} />
        ) : (
          <section key={id} id={`chapter-${id}`} className={st.pending} aria-label={id}>
            Section in progress
          </section>
        ),
      )}
    </div>
  );
}
