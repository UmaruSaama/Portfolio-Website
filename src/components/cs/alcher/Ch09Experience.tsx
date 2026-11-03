import type { CSSProperties } from "react";
import { Chapter, ChapterEnd } from "../Primitives";
import { PixelBox } from "./Pixel";
import { Opener } from "./Story";
import { GoalPass, Mascot, StartFlag } from "./ch09Art";
import { onboardingNode, pathDots, steps, worlds, type MapNode } from "./ch09Data";
import { ExperienceStep } from "./ExperienceStep";
import s from "./Ch09Experience.module.css";

/** Figma px → layout length (scales with the 1020 column). */
const v = (n: number) => `calc(${n} * var(--v))`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** 09 · The experience (Figma 504:67642). */
export function Ch09Experience() {
  return (
    <Chapter id="experience" label="The experience">
      {/* Figma hides this chapter's opener divider (it follows the act). */}
      <div className={s.opener}>
        <Opener
          eyebrow="The experience"
          title="Five moments, not five features: before the fest, the day, the way there, the night, and what you keep."
          introTitle="How to read this"
          intro={
            <p className={s.introText}>
              Each step is one moment in an attendee’s fest, the screens that serve it, and the decision behind
              them.
            </p>
          }
        />
      </div>

      <OverworldMap />

      {steps.map((st) => (
        <ExperienceStep key={st.n} step={st} />
      ))}

      <div className={s.end}>
        <ChapterEnd>Underneath the screens is a system built for pixels.</ChapterEnd>
      </div>
    </Chapter>
  );
}

/* ---------- Figure – Overworld map (519:46288, 1020 × 1260) ---------- */

function Thumb({ node, ox = 0, oy = 0 }: { node: MapNode; ox?: number; oy?: number }) {
  // Figma offsets as custom properties: the CSS places them (and ignores them on phones).
  const style = { "--x": v(node.x - ox), "--y": v(node.y - oy) } as Vars;
  return (
    <span className={s.node} style={style}>
      <span className={s.thumb}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${node.src}.png`}
          srcSet={node.hd ? `${node.src}.png 1x, ${node.src}@2x.webp 2x` : undefined}
          alt=""
          width={104}
          height={225}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className={s.nodeLabel}>{node.label}</span>
    </span>
  );
}

function OverworldMap() {
  const dots = pathDots.map(([x, y]) => `M${x} ${y}h8v8h-8z`).join("");
  return (
    <figure className={s.map} aria-labelledby="exp-map-title">
      <div className={s.mapHead}>
        <p id="exp-map-title" className={s.mapTitle}>
          THE WHOLE MAP
        </p>
        <figcaption className={s.mapCaption}>
          13 screens, one attendee, one path from install to the front row. Click a world to jump to its step.
        </figcaption>
      </div>

      <div className={s.canvas}>
        <p className={s.start} aria-hidden="true">
          START
        </p>
        <StartFlag className={s.flag} />

        <ol className={s.worlds}>
          {worlds.map((w) => (
            <li key={w.n} className={s.worldItem} style={{ "--x": v(w.x), "--y": v(w.y), "--w": v(w.w) } as Vars}>
              <a
                href={`#exp-step-${w.step}`}
                className={s.world}
                aria-label={`World ${w.n}, ${w.title.toLowerCase()}: ${w.nodes.map((n) => n.label).join(", ")}. Jump to step ${w.step}.`}
              >
                <PixelBox tone="blue" className={s.worldBox} />
                <span className={s.worldHead}>
                  <span className={s.worldNum}>WORLD {w.n}</span>
                  <span className={s.worldTitle}>{w.title}</span>
                </span>
                {w.nodes.map((n) => (
                  <Thumb key={n.label} node={n} ox={w.x} oy={w.y} />
                ))}
              </a>
            </li>
          ))}
        </ol>

        <svg className={s.path} viewBox="0 0 1020 1136" shapeRendering="crispEdges" aria-hidden="true">
          <path d={dots} />
        </svg>

        <div aria-hidden="true">
          <Thumb node={onboardingNode} />
        </div>
        <Mascot className={s.player} />

        <p className={s.goalLabel} aria-hidden="true">
          GOAL
        </p>
        <GoalPass className={s.goal} textClassName={s.goalText} />
        <p className={s.goalCaption}>Top players win front-row passes.</p>
      </div>
    </figure>
  );
}
