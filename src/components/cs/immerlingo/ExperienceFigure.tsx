"use client";

import { Figure } from "../Primitives";
import type { ExperienceFigure as Data } from "./ch08Figures";
import { useDeviceView, type Device } from "./DeviceView";
import {
  IconCursor,
  IconDesktop,
  IconFilm,
  IconLandscape,
  IconMobile,
  IconPortrait,
  IconTablet,
} from "./figIcons";
import styles from "./ExperienceFigure.module.css";

const SCREENS = "/cs/immerlingo/screens";

const DEVICES: { id: Device; label: string; Icon: () => React.JSX.Element }[] = [
  { id: "d", label: "Desktop", Icon: IconDesktop },
  { id: "t", label: "Tablet", Icon: IconTablet },
  { id: "m", label: "Phone", Icon: IconMobile },
];

/**
 * "Interactive" figure from chapter 08: toolbar (annotations, device,
 * tablet orientation, mode) over a stage with the headline, the app on the
 * chosen device, and the numbered steps. Device/orientation/annotations come
 * from the chapter-wide DeviceView, so every card switches together.
 *
 * The stage keeps one height for every device so switching never shifts
 * the page; each device is sized to fit the same box.
 */
export function ExperienceFigure({ fig }: { fig: Data }) {
  const view = useDeviceView();
  const variant = view.device === "t" ? `t${view.orientation}` : view.device; // d | tl | tp | m
  const title = view.device !== "d" && fig.touchTitle ? fig.touchTitle : fig.title;
  const pinsOn = view.annotations && view.device === "d" && fig.highlights.length > 0;
  const deviceLabel =
    view.device === "d"
      ? "desktop"
      : view.device === "m"
        ? "phone"
        : `tablet, ${view.orientation === "l" ? "landscape" : "portrait"}`;

  const controls = (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={view.annotations}
        className={styles.switchRow}
        onClick={() => view.setAnnotations(!view.annotations)}
        disabled={view.device !== "d"}
        title={view.device === "d" ? undefined : "Annotations are drawn on the desktop screens"}
      >
        <span className={styles.switch} data-on={view.annotations ? "" : undefined} aria-hidden="true">
          <span className={styles.knob} />
        </span>
        <span className={styles.ctrlLabel}>Annotations</span>
      </button>

      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.segment} role="radiogroup" aria-label="Device">
        {DEVICES.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={view.device === id}
            aria-label={label}
            title={label}
            className={styles.segBtn}
            onClick={() => view.setDevice(id)}
          >
            <Icon />
          </button>
        ))}
      </div>

      {view.device === "t" && (
        <div className={styles.segment} role="radiogroup" aria-label="Tablet orientation">
          <button
            type="button"
            role="radio"
            aria-checked={view.orientation === "l"}
            aria-label="Landscape"
            title="Landscape"
            className={styles.segBtn}
            onClick={() => view.setOrientation("l")}
          >
            <IconLandscape />
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={view.orientation === "p"}
            aria-label="Portrait"
            title="Portrait"
            className={styles.segBtn}
            onClick={() => view.setOrientation("p")}
          >
            <IconPortrait />
          </button>
        </div>
      )}

      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.segment} aria-label="Mode">
        <span className={`${styles.segBtn} ${styles.modeBtn}`} aria-current="true">
          <IconCursor />
          Interactive
        </span>
        <button
          type="button"
          className={`${styles.segBtn} ${styles.modeBtn}`}
          disabled
          aria-describedby={`${fig.slug}-soon`}
        >
          <IconFilm />
          Video
          <span id={`${fig.slug}-soon`} className={styles.soon}>
            Soon
          </span>
        </button>
      </div>
    </>
  );

  return (
    <Figure type="Interactive" title={title} controls={controls} stageClassName={styles.stage} glow>
      <p className={styles.headline}>{fig.headline}</p>

      <div className={styles.deviceArea}>
        <div key={variant} className={styles.device} data-variant={variant}>
          {variant === "d" ? (
            <div className={styles.macbook}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, sized by CSS */}
              <img
                src={`${SCREENS}/${fig.slug}-d.webp`}
                alt={`${title}, ${deviceLabel} screen`}
                width={600}
                height={445}
                loading="lazy"
                decoding="async"
              />
              {pinsOn && (
                <div className={styles.annotations} aria-hidden="true">
                  {fig.highlights.map((h, i) => (
                    <span
                      key={`h${i}`}
                      className={styles.highlight}
                      style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.width}%`, height: `${h.height}%` }}
                    />
                  ))}
                  {fig.pins.map((p, i) => (
                    <span key={`p${i}`} className={styles.pin} style={{ left: `${p.left}%`, top: `${p.top}%` }}>
                      {i + 1}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.frame} data-kind={view.device === "m" ? "phone" : "tablet"}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, sized by CSS */}
              <img
                src={`${SCREENS}/${fig.slug}-${variant}.webp`}
                alt={`${title}, ${deviceLabel} screen`}
                width={variant === "tl" ? 1194 : variant === "tp" ? 834 : 390}
                height={variant === "tl" ? 834 : variant === "tp" ? 1194 : 844}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.side}>
        <ol className={styles.steps}>
          {fig.steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.stepPin} aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        {fig.quote && fig.persona && (
          <figure className={styles.persona}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 32px avatar */}
            <img
              src={`/cs/immerlingo/img/avatar-${fig.persona.toLowerCase()}.png`}
              alt=""
              width={32}
              height={32}
              loading="lazy"
              className={styles.avatar}
            />
            <blockquote className={styles.personaQuote}>{fig.quote}</blockquote>
          </figure>
        )}
      </div>
    </Figure>
  );
}
