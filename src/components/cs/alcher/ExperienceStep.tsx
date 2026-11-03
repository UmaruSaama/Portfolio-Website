"use client";

import { useState } from "react";
// cs.module.css before ./Pixel: keeps the CSS order (cs → Pixel → chapter)
// the same as everywhere else, so Pixel's rules never land after the chapter's.
import cs from "../cs.module.css";
import { PixelBox } from "./Pixel";
import { CursorIcon, Mascot } from "./ch09Art";
import { screens, type Screen, type Step } from "./ch09Data";
import s from "./Ch09Experience.module.css";

/**
 * One step of chapter 09 (Figma "Step – …"): label + title, the
 * interactive figure (toolbar with the Annotations switch over a dark stage
 * with two phones, the numbered story and a persona bubble) and the pink
 * design-decision panel. Annotations start off, as in the prototype; each
 * card's switch only drives its own pins and highlights.
 */
export function ExperienceStep({ step }: { step: Step }) {
  const [on, setOn] = useState(false);
  const titleId = `exp-step-${step.n}-title`;
  return (
    <section id={`exp-step-${step.n}`} className={s.step} aria-labelledby={titleId}>
      <header className={s.stepHead}>
        <p className={s.stepLabel} style={{ color: step.labelColor }}>
          Step {step.n} of 5
        </p>
        <h3 id={titleId} className={s.stepTitle}>
          {step.title}
        </h3>
      </header>

      <figure className={s.figure}>
        <PixelBox tone="blue" className={s.toolbar}>
          <figcaption className={s.figLabel}>
            <span className={s.typeTag}>Interactive</span>
            <span className={s.figTitle}>{step.figTitle}</span>
          </figcaption>
          <div className={s.controls}>
            <span className={s.hint}>
              <CursorIcon className={s.hintIcon} />
              <span className={s.hintText}>Scroll the screens</span>
            </span>
            <span className={s.ctrlDivider} aria-hidden="true" />
            <button
              type="button"
              className={s.toggle}
              aria-pressed={on}
              onClick={() => setOn((v) => !v)}
              title={on ? "Hide the pins and highlights on the screens" : "Show pins and highlights on the screens"}
            >
              <span className={s.switch} data-on={on ? "" : undefined} aria-hidden="true">
                <span className={s.knob} />
              </span>
              <span className={s.toggleLabel}>Annotations</span>
            </button>
          </div>
        </PixelBox>

        <PixelBox tone="dark" className={s.stage}>
          <p className={s.headline}>{step.headline}</p>
          <div className={s.stageRow}>
            <div className={`${s.phones} ${cs.strip}`}>
              {step.screens.map((id) => (
                <Phone key={id} screen={screens[id]} on={on} />
              ))}
            </div>
            <p className={`${cs.stripHint} ${s.stripHint}`} aria-hidden="true">
              Swipe →
            </p>
            <div className={s.story}>
              <ol className={s.storyList}>
                {step.story.map((it, i) => (
                  <li key={it.title} className={s.storyItem}>
                    <span className={s.storyPin} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className={s.storyText}>
                      <span className={s.storyTitle}>{it.title}</span>
                      <span className={s.storyBody}>{it.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <PixelBox tone="cream" small as="blockquote" className={s.persona}>
                <span className={s.avatar} aria-hidden="true">
                  <Mascot className={s.avatarArt} />
                </span>
                <p className={s.personaText}>{step.persona}</p>
              </PixelBox>
            </div>
          </div>
        </PixelBox>
      </figure>

      <PixelBox tone="pink" className={s.decision}>
        <div className={s.decisionHead}>
          <p className={s.miniLabel}>Design decision</p>
          <h4 className={s.decisionTitle}>{step.decision.title}</h4>
        </div>
        <dl className={s.rationale}>
          <div>
            <dt className={s.miniLabel}>Insight</dt>
            <dd>{step.decision.insight}</dd>
          </div>
          <div>
            <dt className={s.miniLabel}>Decision</dt>
            <dd>{step.decision.decision}</dd>
          </div>
          <div>
            <dt className={s.miniLabel}>Tradeoff</dt>
            <dd>{step.decision.tradeoff}</dd>
          </div>
        </dl>
      </PixelBox>
    </section>
  );
}

/**
 * iPhone (Figma "Device – iPhone", 255 × 525.6) with an app screen in its
 * 234 × 505.8 viewport. Scrolling screens are one tall image in a focusable
 * scroll area; the fixed chrome is layered on top. Pins and highlights sit
 * in the scrolling content, so they move with the screen.
 */
function Phone({ screen, on }: { screen: Screen; on: boolean }) {
  const [w, h] = screen.size;
  const content = (
    <div className={s.content}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={screen.src} alt={screen.alt} width={w} height={h} loading="lazy" decoding="async" className={s.shot} />
      <div className={s.ann} data-on={on ? "" : undefined} aria-hidden="true">
        {screen.ann.map(([n, l, t, bw, bh]) => (
          <span key={n}>
            <span className={s.hl} style={{ left: `${l}%`, top: `${t}%`, width: `${bw}%`, height: `${bh}%` }} />
            <span className={s.pin} style={{ left: `${l}%`, top: `${t}%` }}>
              {n}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <div className={s.phone}>
      <span className={s.frame} aria-hidden="true" />
      <span className={`${s.side} ${s.sideAction}`} aria-hidden="true" />
      <span className={`${s.side} ${s.sideVolUp}`} aria-hidden="true" />
      <span className={`${s.side} ${s.sideVolDown}`} aria-hidden="true" />
      <span className={`${s.side} ${s.sidePower}`} aria-hidden="true" />
      <div className={s.screen}>
        <div className={s.viewport}>
          {screen.scroll ? (
            // A scroll region must be reachable by keyboard.
            <div className={s.scroller} tabIndex={0} role="region" aria-label={`${screen.name} screen, scrollable`}>
              {content}
            </div>
          ) : (
            content
          )}
          {screen.overlays?.map((o, i) => {
            const style =
              o.at === "top"
                ? { top: 0, left: 0, width: "100%" }
                : o.at === "bottom"
                  ? { bottom: 0, left: 0, width: "100%" }
                  : { left: `${o.at.l}%`, top: `${o.at.t}%`, width: `${o.at.w}%` };
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={o.src}
                alt=""
                width={o.size[0]}
                height={o.size[1]}
                loading="lazy"
                decoding="async"
                className={s.fixed}
                style={style}
              />
            );
          })}
        </div>
      </div>
      <span className={s.island} aria-hidden="true" />
      <span className={s.indicator} aria-hidden="true" />
    </div>
  );
}
