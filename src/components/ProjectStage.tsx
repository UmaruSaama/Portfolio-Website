"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { VideoToggle } from "./VideoToggle";
import styles from "./ProjectStage.module.css";

gsap.registerPlugin(useGSAP);

const WHEEL_THRESHOLD = 40; // px of accumulated delta before a step
const COOLDOWN_MS = 700; // ignore further wheel input after a step (trackpad inertia)
const SWIPE_THRESHOLD = 50;
const PLAYER_ID = "project-video-player";

// Player reveal: wipes in from the card's right edge (next to the video button).
const CLIP_CLOSED = "inset(0% 0% 0% 100% round 20px)";
const CLIP_OPEN = "inset(0% 0% 0% 0% round 20px)";

type Actions = {
  goTo: (next: number) => void;
  openVideo: () => void;
  closeVideo: (then?: () => void) => void;
  videoActive: () => boolean;
  cursorMove: (e: React.PointerEvent) => void;
  cursorShow: (e: React.PointerEvent) => void;
  cursorHide: () => void;
  cursorPress: (down: boolean) => void;
};

const noop = () => {};
const IN_ARTIFACT = process.env.NEXT_PUBLIC_ARTIFACT === "1";

export function ProjectStage({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const activeRef = useRef(0);
  const videoOpenRef = useRef(false);
  const busy = useRef(false);

  const root = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const player = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  const actions = useRef<Actions>({
    goTo: noop,
    openVideo: noop,
    closeVideo: noop,
    videoActive: () => false,
    cursorMove: noop,
    cursorShow: noop,
    cursorHide: noop,
    cursorPress: noop,
  });

  useGSAP(
    (_context, contextSafe) => {
      const safe = contextSafe!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const parts = (slide: HTMLElement) => ({
        text: slide.querySelectorAll("[data-anim='text']"),
        media: slide.querySelector("[data-anim='media']"),
      });

      slides.current.forEach((el, i) => {
        if (el && i !== 0) gsap.set(el, { autoAlpha: 0 });
      });
      gsap.set(player.current, { autoAlpha: 0, clipPath: CLIP_CLOSED });

      // ---------- entrance ----------
      const first = slides.current[0];
      if (first && !reduce) {
        const { text, media } = parts(first);
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(text, { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08 })
          .from(media, { y: 60, autoAlpha: 0, duration: 0.9 }, "-=0.45");
      }

      // ---------- custom cursor ----------
      // Centred on the pointer with xPercent/yPercent (GSAP owns the transform,
      // so a CSS translate would be overwritten). quickTo reuses one tween per
      // axis instead of creating a tween on every pointermove.
      const cursorEl = cursor.current;
      if (cursorEl) gsap.set(cursorEl, { xPercent: -50, yPercent: -50, scale: 0.5, autoAlpha: 0 });
      const moveX = cursorEl ? gsap.quickTo(cursorEl, "x", { duration: 0.18, ease: "power3.out" }) : null;
      const moveY = cursorEl ? gsap.quickTo(cursorEl, "y", { duration: 0.18, ease: "power3.out" }) : null;
      let cursorVisible = false;

      const cursorHide = safe(() => {
        if (!cursorEl || !cursorVisible) return;
        cursorVisible = false;
        gsap.to(cursorEl, { scale: 0.5, autoAlpha: 0, duration: 0.18, ease: "power2.in", overwrite: "auto" });
      });

      const cursorShow = safe((e: React.PointerEvent) => {
        if (!cursorEl || !finePointer || videoOpenRef.current || e.pointerType !== "mouse") return;
        if (cursorVisible) return;
        cursorVisible = true;
        // Jump to the pointer first (and reset the quickTo targets) so it
        // doesn't fly in from where it was last hidden.
        gsap.set(cursorEl, { x: e.clientX, y: e.clientY });
        moveX?.tween.invalidate();
        moveY?.tween.invalidate();
        gsap.to(cursorEl, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(2)", overwrite: "auto" });
      });

      const cursorMove = safe((e: React.PointerEvent) => {
        if (!cursorVisible) {
          cursorShow(e);
          return;
        }
        moveX?.(e.clientX);
        moveY?.(e.clientY);
      });

      const cursorPress = safe((down: boolean) => {
        if (!cursorEl || !cursorVisible) return;
        gsap.to(cursorEl, { scale: down ? 0.9 : 1, duration: 0.15, ease: "power2.out", overwrite: "auto" });
      });

      // ---------- slides ----------
      const goTo = safe((next: number) => {
        const current = activeRef.current;
        if (busy.current || next === current || next < 0 || next >= projects.length) return;
        if (videoOpenRef.current || actions.current.videoActive()) {
          actions.current.closeVideo(() => goTo(next));
          return;
        }

        const from = slides.current[current];
        const to = slides.current[next];
        if (!from || !to) return;

        busy.current = true;
        activeRef.current = next;
        setActive(next);

        if (reduce) {
          gsap.set(from, { autoAlpha: 0 });
          gsap.set(to, { autoAlpha: 1 });
          busy.current = false;
          return;
        }

        const dir = next > current ? 1 : -1;
        const a = parts(from);
        const b = parts(to);

        gsap
          .timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
              gsap.set(from, { autoAlpha: 0 });
              gsap.set([a.text, a.media], { clearProps: "transform,opacity,visibility" });
              busy.current = false;
            },
          })
          .to(a.text, { y: -20 * dir, autoAlpha: 0, duration: 0.35, stagger: 0.03 }, 0)
          .to(a.media, { y: -40 * dir, autoAlpha: 0, duration: 0.45 }, 0)
          .set(to, { autoAlpha: 1 }, 0.3)
          .fromTo(
            b.text,
            { y: 20 * dir, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
            0.3,
          )
          .fromTo(
            b.media,
            { y: 60 * dir, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
            0.4,
          );
      });

      // ---------- card ⇄ video player ----------
      // One timeline per opening, played forward to open and reversed to
      // close, so toggling mid-transition turns around smoothly from wherever
      // it is instead of jumping. The player wipes in from the right edge
      // while the card content drifts left and fades: one continuous push.
      let videoTl: gsap.core.Timeline | null = null;
      let afterClose: (() => void) | null = null;

      const onOpened = () => {
        player.current?.querySelector<HTMLElement>("[data-player-focus]")?.focus({ preventScroll: true });
        video.current?.play().catch(() => {});
      };

      const onClosed = () => {
        const slide = slides.current[activeRef.current];
        if (slide) {
          const { text, media } = parts(slide);
          gsap.set([text, media], { clearProps: "transform,opacity,visibility" });
        }
        videoTl?.kill();
        videoTl = null;
        const then = afterClose;
        afterClose = null;
        then?.();
      };

      const buildVideoTl = (slide: HTMLElement) => {
        const { text, media } = parts(slide);
        const inner = player.current?.querySelector("[data-player-inner]") ?? [];
        return gsap
          .timeline({ paused: true, onComplete: onOpened, onReverseComplete: onClosed })
          .set(player.current, { autoAlpha: 1 }, 0)
          .fromTo(
            player.current,
            { clipPath: CLIP_CLOSED },
            { clipPath: CLIP_OPEN, duration: 0.95, ease: "power3.inOut" },
            0,
          )
          .fromTo(inner, { xPercent: 12 }, { xPercent: 0, duration: 0.95, ease: "power3.inOut" }, 0)
          .to(media, { xPercent: -8, autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 0.05)
          .to(text, { x: -60, autoAlpha: 0, duration: 0.7, stagger: 0.04, ease: "power2.inOut" }, 0.1);
      };

      const openVideo = safe(() => {
        if (busy.current || videoOpenRef.current) return;
        const slide = slides.current[activeRef.current];
        if (!slide || !player.current) return;

        videoOpenRef.current = true;
        setVideoOpen(true);
        cursorHide();
        afterClose = null;

        if (!videoTl) videoTl = buildVideoTl(slide);
        if (reduce) {
          videoTl.progress(1).pause();
          onOpened();
          return;
        }
        videoTl.timeScale(1).play();
      });

      const closeVideo = safe((then?: () => void) => {
        if (!videoTl) return;
        if (then) afterClose = then;
        if (!videoOpenRef.current) return; // already closing; `then` will run when it finishes

        videoOpenRef.current = false;
        setVideoOpen(false);
        video.current?.pause();

        if (reduce) {
          videoTl.progress(0).pause();
          onClosed();
          return;
        }
        videoTl.timeScale(1.2).reverse();
      });

      const videoActive = () => videoTl !== null;

      actions.current = {
        goTo,
        openVideo,
        closeVideo,
        videoActive,
        cursorMove,
        cursorShow,
        cursorHide,
        cursorPress,
      };

      // ---------- input: wheel, keys, swipe ----------
      let acc = 0;
      let lockedUntil = 0;
      let touchY: number | null = null;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (videoOpenRef.current || videoActive()) return; // no project changes while the player is up
        const now = performance.now();
        if (now < lockedUntil) return;
        acc += e.deltaY;
        if (Math.abs(acc) >= WHEEL_THRESHOLD) {
          goTo(activeRef.current + Math.sign(acc));
          acc = 0;
          lockedUntil = now + COOLDOWN_MS;
        }
      };

      const onKey = (e: KeyboardEvent) => {
        const t = e.target as HTMLElement | null;
        if (t && /^(INPUT|TEXTAREA|SELECT|VIDEO)$/.test(t.tagName)) return;
        if (e.key === "Escape" && videoOpenRef.current) {
          closeVideo();
          return;
        }
        if (videoOpenRef.current) return;
        if (["ArrowDown", "PageDown", "j"].includes(e.key)) {
          e.preventDefault();
          goTo(activeRef.current + 1);
        } else if (["ArrowUp", "PageUp", "k"].includes(e.key)) {
          e.preventDefault();
          goTo(activeRef.current - 1);
        } else if (e.key === "Home") {
          goTo(0);
        } else if (e.key === "End") {
          goTo(projects.length - 1);
        }
      };

      const onTouchStart = (e: TouchEvent) => {
        touchY = e.touches[0]?.clientY ?? null;
      };
      const onTouchEnd = (e: TouchEvent) => {
        if (touchY === null || videoOpenRef.current) return;
        const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
        if (Math.abs(dy) > SWIPE_THRESHOLD) goTo(activeRef.current + Math.sign(dy));
        touchY = null;
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
      return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
      };
    },
    { scope: root, dependencies: [projects.length] },
  );

  const current = projects[active];
  const cursorLabel = current.placeholder ? "Coming soon" : "View case study";

  return (
    <div className={styles.stage} ref={root}>
      <div className={styles.rail}>
        <ol className={styles.dots} aria-label="Projects">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <button
                type="button"
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                aria-label={`${i + 1}. ${p.title.accent}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => actions.current.goTo(i)}
              />
            </li>
          ))}
        </ol>
        <Image className={styles.sparkle} src="/images/sparkle.png" alt="" width={20} height={18} />
      </div>

      <section
        className={styles.card}
        data-video={videoOpen ? "open" : undefined}
        aria-roledescription="carousel"
        aria-label="Selected work"
        onPointerEnter={(e) => actions.current.cursorShow(e)}
        onPointerMove={(e) => actions.current.cursorMove(e)}
        onPointerLeave={() => actions.current.cursorHide()}
        onPointerDown={() => actions.current.cursorPress(true)}
        onPointerUp={() => actions.current.cursorPress(false)}
      >
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.topLine} aria-hidden="true" />

        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              slides.current[i] = el;
            }}
            className={styles.slide}
            aria-hidden={i !== active || videoOpen}
            inert={i !== active || videoOpen}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}`}
          >
            {/* Whole card is the link; it sits under nothing interactive. */}
            {!p.placeholder && (
              <Link
                href={`/work/${p.slug}`}
                className={styles.cardLink}
                prefetch={!IN_ARTIFACT}
                onClick={IN_ARTIFACT ? (e) => e.preventDefault() : undefined}
              >
                <span className="visually-hidden">View case study: {p.title.accent}</span>
              </Link>
            )}

            <div className={styles.copy}>
              <ul className={styles.tags} data-anim="text">
                {p.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <h2 className={styles.title} data-anim="text">
                <span className={styles.accent}>{p.title.accent}</span> {p.title.rest}
              </h2>
              <p className={styles.summary} data-anim="text">
                {p.summary}
              </p>
            </div>

            <div className={styles.media} data-anim="media">
              {p.image ? (
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={p.image.width}
                  height={p.image.height}
                  priority={i === 0}
                  sizes="(max-width: 767px) 100vw, 1097px"
                />
              ) : (
                <div className={styles.mediaEmpty}>Hero render goes here</div>
              )}
            </div>
          </div>
        ))}

        <div
          id={PLAYER_ID}
          ref={player}
          className={styles.player}
          role="region"
          aria-label={`${current.title.accent} product video`}
          aria-hidden={!videoOpen}
          inert={!videoOpen}
        >
          <div className={styles.playerInner} data-player-inner>
            {current.videoSrc ? (
              <video
                key={current.slug}
                ref={video}
                className={styles.video}
                src={current.videoSrc}
                controls
                playsInline
                preload="metadata"
                data-player-focus
              />
            ) : (
              <p className={styles.playerEmpty} tabIndex={-1} data-player-focus>
                The product video for {current.title.accent} isn&rsquo;t added yet.
              </p>
            )}
          </div>
          <button type="button" className={styles.playerClose} onClick={() => actions.current.closeVideo()}>
            Close
          </button>
        </div>
      </section>

      <div className={styles.side}>
        <VideoToggle
          open={videoOpen}
          controls={PLAYER_ID}
          onToggle={() => (videoOpen ? actions.current.closeVideo() : actions.current.openVideo())}
        />
      </div>

      <div ref={cursor} className={styles.cursor} aria-hidden="true">
        {cursorLabel}
      </div>

      <span className={styles.chick} aria-hidden="true">
        🐤
      </span>

      <p className="visually-hidden" aria-live="polite">
        {videoOpen
          ? `Playing ${current.title.accent} product video`
          : `Project ${active + 1} of ${projects.length}: ${current.title.accent}`}
      </p>
    </div>
  );
}
