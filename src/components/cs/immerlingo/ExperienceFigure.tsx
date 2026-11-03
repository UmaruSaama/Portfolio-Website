"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Figure } from "../Primitives";
import {
  experienceFigures,
  type ExperienceFigure as Data,
} from "./ch08Figures";
import { touchAnnotations } from "./ch08TouchAnnotations";
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

const DEVICES: { id: Device; label: string; Icon: () => React.JSX.Element }[] =
  [
    { id: "d", label: "Desktop", Icon: IconDesktop },
    { id: "t", label: "Tablet", Icon: IconTablet },
    { id: "m", label: "Phone", Icon: IconMobile },
  ];

const ORIENTATIONS = [
  { o: "l", name: "landscape", OIcon: IconLandscape },
  { o: "p", name: "portrait", OIcon: IconPortrait },
] as const;

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
  // The tablet button unmounts when it expands; keep keyboard focus on the
  // orientation that replaced it (only in the figure that was clicked).
  const focusOrientation = useRef(false);
  const activeOrientation = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (view.device === "t" && focusOrientation.current) {
      focusOrientation.current = false;
      activeOrientation.current?.focus({ preventScroll: true });
    }
  }, [view.device]);
  // Mode is per figure: each card can show its own (placeholder) video.
  const [mode, setMode] = useState<"interactive" | "video">("interactive");
  const video = mode === "video";

  // Annotations off = clean view: the notes fade and the screen grows to
  // fill the card. The device box keeps its layout slot (nothing reflows);
  // a measured translate + scale moves it, so the change is one smooth
  // transform. Re-measured on resize.
  const full = !view.annotations;
  const areaRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<React.CSSProperties | null>(null);
  useLayoutEffect(() => {
    const area = areaRef.current;
    const stage = area?.parentElement;
    if (!area || !stage) return;
    const measure = () => {
      // Stage padding (40 Figma px on desktop, 16px on phones).
      const cs = getComputedStyle(stage);
      const padX = parseFloat(cs.paddingLeft) || 0;
      const padY = parseFloat(cs.paddingTop) || 0;
      const w = area.offsetWidth;
      const h = area.offsetHeight;
      const sc = Math.min(
        (stage.clientHeight - 2 * padY) / h,
        (stage.clientWidth - 2 * padX) / w,
      );
      const x = (stage.clientWidth - w * sc) / 2 - area.offsetLeft;
      const y = (stage.clientHeight - h * sc) / 2 - area.offsetTop;
      setFit({
        "--fx": `${x}px`,
        "--fy": `${y}px`,
        "--fs": sc,
      } as React.CSSProperties);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Sliding thumb under the active mode button.
  const modeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const b = modeRefs.current[mode];
      if (b) setThumb({ x: b.offsetLeft, w: b.offsetWidth });
    };
    measure();
    // Fonts can load after first paint and change the button widths.
    document.fonts?.ready.then(measure);
  }, [mode]);

  const variant = view.device === "t" ? `t${view.orientation}` : view.device; // d | tl | tp | m
  const title =
    view.device !== "d" && fig.touchTitle ? fig.touchTitle : fig.title;
  const pinsOn =
    !video &&
    view.annotations &&
    view.device === "d" &&
    fig.highlights.length > 0;
  // Tablet and phone annotations (Figma T/M; portrait derived from 03b).
  const figIndex = experienceFigures.findIndex((f) => f.slug === fig.slug);
  const touch =
    variant === "tl" || variant === "tp" || variant === "m"
      ? touchAnnotations(figIndex, variant)
      : undefined;
  const touchOn = !video && view.annotations;
  const deviceLabel =
    view.device === "d"
      ? "desktop"
      : view.device === "m"
        ? "phone"
        : `tablet, ${view.orientation === "l" ? "landscape" : "portrait"}`;

  const controls = (
    <div className={styles.controlsRow}>
      {/* Annotations + device switch fold away in video mode (width and
          opacity animate together; inert so they leave the tab order). */}
      <div
        className={styles.fold}
        data-folded={video ? "" : undefined}
        inert={video}
      >
        <div className={styles.foldInner}>
          <div className={styles.foldContent}>
            <button
              type="button"
              role="switch"
              aria-checked={view.annotations}
              className={styles.switchRow}
              onClick={() => view.setAnnotations(!view.annotations)}
              title="Off: hide the notes and show the screen across the whole card"
            >
              <span
                className={styles.switch}
                data-on={view.annotations ? "" : undefined}
                aria-hidden="true"
              >
                <span className={styles.knob} />
              </span>
              <span className={styles.ctrlLabel}>Annotations</span>
            </button>

            <span className={styles.divider} aria-hidden="true" />

            {/* Device switch. Tablet expands in place into a nested orientation
          switch (a box within the selected box) instead of a second toggle.
          Hidden on phones, where the device is pinned to the phone screen. */}
            {!view.phone && (
            <div className={styles.segment} role="group" aria-label="Device">
              {DEVICES.map(({ id, label, Icon }) =>
                id === "t" && view.device === "t" ? (
                  <span
                    key={id}
                    className={styles.nested}
                    role="group"
                    aria-label="Tablet orientation"
                  >
                    {ORIENTATIONS.map(({ o, name, OIcon }) => (
                      <button
                        key={o}
                        ref={
                          view.orientation === o ? activeOrientation : undefined
                        }
                        type="button"
                        aria-pressed={view.orientation === o}
                        aria-label={`Tablet, ${name}`}
                        title={`Tablet, ${name}`}
                        className={styles.innerBtn}
                        onClick={() => view.setOrientation(o)}
                      >
                        <OIcon />
                      </button>
                    ))}
                  </span>
                ) : (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={view.device === id}
                    aria-label={label}
                    title={label}
                    className={styles.segBtn}
                    onClick={() => {
                      if (id === "t") focusOrientation.current = true;
                      view.setDevice(id);
                    }}
                  >
                    <Icon />
                  </button>
                ),
              )}
            </div>
            )}

            {!view.phone && <span className={styles.divider} aria-hidden="true" />}
          </div>
        </div>
      </div>

      <div
        className={`${styles.segment} ${styles.modeSeg}`}
        role="group"
        aria-label="Mode"
      >
        {thumb && (
          <span
            className={styles.modeThumb}
            style={{ transform: `translateX(${thumb.x}px)`, width: thumb.w }}
            aria-hidden="true"
          />
        )}
        {(
          [
            ["interactive", "Interactive", IconCursor],
            ["video", "Video", IconFilm],
          ] as const
        ).map(([m, label, MIcon]) => (
          <button
            key={m}
            ref={(el) => {
              modeRefs.current[m] = el;
            }}
            type="button"
            aria-pressed={mode === m}
            className={`${styles.segBtn} ${styles.modeBtn}`}
            data-thumb={thumb ? "" : undefined}
            onClick={() => setMode(m)}
          >
            <MIcon />
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Figure
      type={video ? "Video" : "Interactive"}
      title={title}
      controls={controls}
      stageClassName={styles.stage}
      glow
    >
      <p
        className={styles.headline}
        data-hidden={full ? "" : undefined}
        inert={video || full}
      >
        {fig.headline}
      </p>

      <div
        ref={areaRef}
        className={styles.deviceArea}
        data-full={full ? "" : undefined}
        style={fit ?? undefined}
        inert={video}
      >
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
                      style={{
                        left: `${h.left}%`,
                        top: `${h.top}%`,
                        width: `${h.width}%`,
                        height: `${h.height}%`,
                      }}
                    />
                  ))}
                  {fig.pins.map((p, i) => (
                    <span
                      key={`p${i}`}
                      className={styles.pin}
                      style={{ left: `${p.left}%`, top: `${p.top}%` }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              className={styles.frame}
              data-kind={view.device === "m" ? "phone" : "tablet"}
            >
              <div className={styles.screen}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, sized by CSS */}
                <img
                  src={`${SCREENS}/${fig.slug}-${variant}.webp`}
                  alt={`${title}, ${deviceLabel} screen`}
                  width={variant === "tl" ? 1194 : variant === "tp" ? 834 : 390}
                  height={
                    variant === "tl" ? 834 : variant === "tp" ? 1194 : 844
                  }
                  loading="lazy"
                  decoding="async"
                />
                {touchOn && touch && (
                  <div className={styles.screenAnnotations} aria-hidden="true">
                    {touch.hs.map(
                      (b, i) =>
                        b && (
                          <span
                            key={`h${i}`}
                            className={styles.highlight}
                            style={{
                              left: `${b[0]}%`,
                              top: `${b[1]}%`,
                              width: `${b[2]}%`,
                              height: `${b[3]}%`,
                            }}
                          />
                        ),
                    )}
                    {touch.ps.map(
                      (pt, i) =>
                        pt && (
                          <span
                            key={`p${i}`}
                            className={styles.pin}
                            style={{ left: `${pt[0]}%`, top: `${pt[1]}%` }}
                          >
                            {i + 1}
                          </span>
                        ),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={styles.side}
        data-hidden={full ? "" : undefined}
        inert={video || full}
      >
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

      {/* Video mode: the whole card becomes a player, wiping in from the
          right edge (next to the mode switch), like the home card's player. */}
      <div
        className={styles.player}
        data-on={video ? "" : undefined}
        aria-hidden={!video}
        inert={!video}
      >
        <div className={styles.playerEmpty}>
          <span className={styles.playDisc} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
            </svg>
          </span>
          <p className={styles.playerTitle}>{title} · walkthrough</p>
          <p className={styles.playerBody}>
            Video coming soon. Switch to Interactive to explore the screens.
          </p>
        </div>
        <div className={styles.playerBar} aria-hidden="true">
          <span className={styles.playerTime}>0:00</span>
          <span className={styles.playerTrack} />
          <span className={styles.playerTime}>0:00</span>
        </div>
      </div>
    </Figure>
  );
}
