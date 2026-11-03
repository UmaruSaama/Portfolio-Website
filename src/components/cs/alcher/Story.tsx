import type { ComponentType, CSSProperties, ReactNode } from "react";
import { PixelDivider, PixelText } from "./Pixel";
import st from "./Story.module.css";

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
 * The pixel world (Figma "World", 4px cells) is exported at one pixel per
 * cell and scaled ×4 with nearest-neighbour sampling. It is cut into
 * segments that each hang from the act that starts them, so the art stays
 * on its act even when the chapters above run longer or shorter than in
 * Figma. `top` = where the segment starts relative to the act's top (Figma
 * px); `cells` = segment height in cells. Below a segment the group keeps
 * the segment's last band colour. The scene is drawn once, 1440 wide and
 * centred, as in Figma; past 1440 each side continues with a one-cell
 * edge strip (<seg>-l/-r.png: the row's edge colour where it runs on, e.g.
 * ground lines, else the row's band colour), never a repeat of the scene.
 */
type Segment = { src: string; top: number; cells: number; after: string };

const W = "/cs/alcheringa-25/world";
export const worldSky: Segment = { src: `${W}/sky.png`, top: 0, cells: 336, after: "#1d2b53" };
export const worldDawn: Segment = { src: `${W}/dawn.png`, top: 0, cells: 351, after: "#000000" };
const segments: Record<number, Segment> = {
  1: { src: `${W}/a1.png`, top: -2, cells: 878, after: "#111d35" },
  2: { src: `${W}/a2.png`, top: 0, cells: 1749, after: "#1d2b53" },
  3: { src: `${W}/a3.png`, top: -72, cells: 1597, after: "#111d35" },
  4: { src: `${W}/a4.png`, top: -2, cells: 2226, after: "#111d35" },
  5: { src: `${W}/a5.png`, top: -182, cells: 1489, after: "#111d35" },
};

/** Inline style that paints a segment on a full-bleed layer. */
export function worldStyle(seg: Segment) {
  return {
    "--seg": `url(${seg.src})`,
    "--seg-l": `url(${seg.src.replace(".png", "-l.png")})`,
    "--seg-r": `url(${seg.src.replace(".png", "-r.png")})`,
    "--seg-top": `calc(${seg.top} * var(--v))`,
    "--seg-h": `calc(${seg.cells * 4} * var(--v))`,
    "--seg-after": seg.after,
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
          dawn art bottom 64 above the frame bottom, 520 below Close). */}
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
