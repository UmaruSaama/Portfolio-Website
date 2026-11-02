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

// Player reveal: grows out of the card's centre into the full card.
const CLIP_CLOSED = "inset(46% 46% 46% 46% round 20px)";
const CLIP_OPEN = "inset(0% 0% 0% 0% round 20px)";

type Actions = {
  goTo: (next: number) => void;
  openVideo: () => void;
  closeVideo: (then?: () => void) => void;
  cursorMove: (e: React.PointerEvent) => void;
  cursorShow: (e: React.PointerEvent) => void;
  cursorHide: () => void;
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
    cursorMove: noop,
    cursorShow: noop,
    cursorHide: noop,
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
      const cursorEl = cursor.current;
      const moveX = cursorEl ? gsap.quickTo(cursorEl, "x", { duration: 0.35, ease: "power3.out" }) : null;
      const moveY = cursorEl ? gsap.quickTo(cursorEl, "y", { duration: 0.35, ease: "power3.out" }) : null;
      let cursorVisible = false;

      const cursorHide = safe(() => {
        if (!cursorEl || !cursorVisible) return;
        cursorVisible = false;
        gsap.to(cursorEl, { scale: 0.4, autoAlpha: 0, duration: 0.2, ease: "power2.in", overwrite: "auto" });
      });

      const cursorShow = safe((e: React.PointerEvent) => {
        if (!cursorEl || !finePointer || videoOpenRef.current || e.pointerType !== "mouse") return;
        if (!cursorVisible) {
          // Jump to the pointer first so it doesn't fly in from the last spot.
          gsap.set(cursorEl, { x: e.clientX, y: e.clientY });
          cursorVisible = true;
          gsap.to(cursorEl, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)", overwrite: "auto" });
        }
      });

      const cursorMove = safe((e: React.PointerEvent) => {
        if (!cursorVisible) {
          cursorShow(e);
          return;
        }
        moveX?.(e.clientX);
        moveY?.(e.clientY);
      });

      // ---------- slides ----------
      const goTo = safe((next: number) => {
        const current = activeRef.current;
        if (busy.current || next === current || next < 0 || next >= projects.length) return;
        if (videoOpenRef.current) {
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
          .fromTo(b.media, { y: 60 * dir, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0.4);
      });

      // ---------- card ⇄ video player ----------
      const openVideo = safe(() => {
        if (busy.current || videoOpenRef.current) return;
        const slide = slides.current[activeRef.current];
        if (!slide || !player.current) return;

        busy.current = true;
        videoOpenRef.current = true;
        setVideoOpen(true);
        cursorHide();

        const { text, media } = parts(slide);
        const done = () => {
          busy.current = false;
          player.current?.querySelector<HTMLElement>("[data-player-focus]")?.focus();
          video.current?.play().catch(() => {});
        };

        if (reduce) {
          gsap.set([text, media], { autoAlpha: 0 });
          gsap.set(player.current, { autoAlpha: 1, clipPath: CLIP_OPEN });
          done();
          return;
        }

        gsap
          .timeline({ onComplete: done })
          .to(text, { y: -16, autoAlpha: 0, duration: 0.3, stagger: 0.03, ease: "power2.in" }, 0)
          .to(media, { y: 40, scale: 0.96, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0)
          .set(player.current, { autoAlpha: 1 }, 0.15)
          // fromTo with both strings: the browser shortens the computed inset(),
          // which would make GSAP interpolate mismatched numbers.
          .fromTo(
            player.current,
            { clipPath: CLIP_CLOSED },
            { clipPath: CLIP_OPEN, duration: 0.7, ease: "expo.inOut" },
            0.15,
          );
      });

      const closeVideo = safe((then?: () => void) => {
        if (busy.current || !videoOpenRef.current) return;
        const slide = slides.current[activeRef.current];
        if (!slide || !player.current) return;

        busy.current = true;
        video.current?.pause();
        setVideoOpen(false);

        const { text, media } = parts(slide);
        const done = () => {
          gsap.set([text, media], { clearProps: "transform,opacity,visibility" });
          videoOpenRef.current = false;
          busy.current = false;
          then?.();
        };

        if (reduce) {
          gsap.set(player.current, { autoAlpha: 0, clipPath: CLIP_CLOSED });
          done();
          return;
        }

        gsap
          .timeline({ onComplete: done })
          .fromTo(
            player.current,
            { clipPath: CLIP_OPEN },
            { clipPath: CLIP_CLOSED, duration: 0.55, ease: "expo.inOut" },
            0,
          )
          .set(player.current, { autoAlpha: 0 })
          .to(text, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.05, ease: "power3.out" }, 0.35)
          .to(media, { y: 0, scale: 1, autoAlpha: 1, duration: 0.55, ease: "power3.out" }, 0.4);
      });

      actions.current = { goTo, openVideo, closeVideo, cursorMove, cursorShow, cursorHide };

      // ---------- input: wheel, keys, swipe ----------
      let acc = 0;
      let lockedUntil = 0;
      let touchY: number | null = null;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (videoOpenRef.current) return; // scrolling inside the player shouldn't change project
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
