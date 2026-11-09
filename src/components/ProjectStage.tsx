"use client";

import { flushSync } from "react-dom";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { VideoToggle } from "./VideoToggle";
import { chromeAlpha, fitsFilm, liveCam, liveIdentity, liveMatrix, plateAlpha, playerAlpha, type Cam, type FilmMatch } from "./filmMatch";
import { FilmControls } from "./FilmControls";
import { ArrowIcon, ArrowLeftIcon, CloseIcon } from "./icons";
import Image from "next/image";
import { DeviceMock } from "./DeviceMock";
import { CaseStudy } from "./CaseStudy";
import action from "./Action.module.css";
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
  tiltMove: (e: React.PointerEvent) => void;
  tiltReset: () => void;
  openCase: (slug: string) => void;
  requestCloseCase: () => void;
};

const noop = () => {};
const IN_ARTIFACT = process.env.NEXT_PUBLIC_ARTIFACT === "1";
// Inside the artifact only "/" exists, so internal links do nothing there.
const artifactGuard = IN_ARTIFACT ? (e: React.MouseEvent) => e.preventDefault() : undefined;
// Let cmd/ctrl/shift/middle clicks open the real page in a new tab.
const isPlainClick = (e: React.MouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export function ProjectStage({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [caseSlug, setCaseSlug] = useState<string | null>(null);
  // Film chrome (controls, close) rests out of the way while the film plays
  // and the pointer is still; any movement, tap or focus brings it back.
  const [filmIdle, setFilmIdle] = useState(false);
  const idleTimer = useRef<number | undefined>(undefined);
  const wakeFilm = useCallback(() => {
    setFilmIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      const v = video.current;
      if (v && !v.paused && videoOpenRef.current) setFilmIdle(true);
    }, 2400);
  }, []);
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);
  const getVideo = useCallback(() => video.current, []);

  const activeRef = useRef(0);
  const videoOpenRef = useRef(false);
  const caseOpenRef = useRef(false);
  const busy = useRef(false);

  const root = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const player = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const caseOverlay = useRef<HTMLDivElement>(null);

  const actions = useRef<Actions>({
    goTo: noop,
    openVideo: noop,
    closeVideo: noop,
    videoActive: () => false,
    cursorMove: noop,
    cursorShow: noop,
    cursorHide: noop,
    cursorPress: noop,
    tiltMove: noop,
    tiltReset: noop,
    openCase: noop,
    requestCloseCase: noop,
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
      // Outer element: position (quickTo per axis, centred with x/yPercent
      // because GSAP owns the transform) and show/hide scale.
      // Inner disc: squash-and-stretch along the direction of travel, so the
      // cursor reads as a soft object being dragged, then springs round when
      // the pointer stops. The label stays upright and unstretched.
      const cursorEl = cursor.current;
      const discEl = cursorEl?.querySelector<HTMLElement>("[data-cursor-disc]") ?? null;
      if (cursorEl) gsap.set(cursorEl, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      const moveX = cursorEl ? gsap.quickTo(cursorEl, "x", { duration: 0.22, ease: "power3.out" }) : null;
      const moveY = cursorEl ? gsap.quickTo(cursorEl, "y", { duration: 0.22, ease: "power3.out" }) : null;
      const stretchTo = discEl
        ? gsap.quickTo(discEl, "scaleX", { duration: 0.25, ease: "power2.out" })
        : null;
      const squashTo = discEl ? gsap.quickTo(discEl, "scaleY", { duration: 0.25, ease: "power2.out" }) : null;
      // Rotation is set instantly: tweening it would spin the disc whenever
      // the angle wraps. The stretch is symmetric, so -90..90 covers it.
      const setAngle = discEl ? gsap.quickSetter(discEl, "rotation", "deg") : null;
      let cursorVisible = false;
      let last = { x: 0, y: 0, t: 0 };
      let settle: gsap.core.Tween | null = null;

      const relax = () => {
        stretchTo?.(1);
        squashTo?.(1);
      };

      const cursorHide = safe(() => {
        if (!cursorEl || !cursorVisible) return;
        cursorVisible = false;
        settle?.kill();
        relax();
        gsap.to(cursorEl, { scale: 0, autoAlpha: 0, duration: 0.2, ease: "power2.in", overwrite: "auto" });
      });

      const cursorShow = safe((e: React.PointerEvent) => {
        if (!cursorEl || !finePointer || videoOpenRef.current || e.pointerType !== "mouse") return;
        // Nothing to open on a placeholder, so no "view" cursor there.
        if (projects[activeRef.current]?.placeholder) return;
        if (cursorVisible) return;
        cursorVisible = true;
        // Start the follow tweens at the pointer so it grows in place
        // instead of flying in from where it was last hidden.
        moveX?.(e.clientX, e.clientX);
        moveY?.(e.clientY, e.clientY);
        last = { x: e.clientX, y: e.clientY, t: performance.now() };
        gsap.to(cursorEl, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.45,
          ease: "elastic.out(1, 0.6)",
          overwrite: "auto",
        });
      });

      const cursorMove = safe((e: React.PointerEvent) => {
        if (!cursorVisible) {
          cursorShow(e);
          return;
        }
        moveX?.(e.clientX);
        moveY?.(e.clientY);
        if (reduce || !discEl) return;

        const now = performance.now();
        const dt = Math.max(now - last.t, 8);
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        last = { x: e.clientX, y: e.clientY, t: now };

        const speed = Math.hypot(dx, dy) / dt; // px per ms
        const stretch = Math.min(speed * 0.12, 0.35);
        if (stretch > 0.02) {
          let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (angle > 90) angle -= 180;
          if (angle < -90) angle += 180;
          setAngle?.(angle);
          stretchTo?.(1 + stretch);
          squashTo?.(1 - stretch * 0.6);
        }
        settle?.kill();
        settle = gsap.delayedCall(0.08, relax);
      });

      const cursorPress = safe((down: boolean) => {
        if (!cursorEl || !cursorVisible) return;
        gsap.to(cursorEl, {
          scale: down ? 0.86 : 1,
          duration: 0.2,
          ease: down ? "power2.out" : "back.out(3)",
          overwrite: "auto",
        });
      });

      // ---------- card tilt ----------
      // The card leans towards the pointer (max 3°, like a print under a
      // light), and the render inside it drifts the other way by a few px so
      // the device reads as sitting behind the card's surface. Smoothed with
      // quickTo so it trails the pointer instead of snapping. Off for touch,
      // reduced motion, and while the video is up (flat for watching).
      const TILT = 3; // degrees at the card's edge
      const DRIFT = 10; // px the render moves at the edge
      const cardEl = card.current;
      const tiltOn = !!cardEl && finePointer && !reduce;
      if (cardEl) gsap.set(cardEl, { transformPerspective: 1800, transformOrigin: "50% 50%" });
      const tiltX = tiltOn ? gsap.quickTo(cardEl, "rotationX", { duration: 0.7, ease: "power3.out" }) : null;
      const tiltY = tiltOn ? gsap.quickTo(cardEl, "rotationY", { duration: 0.7, ease: "power3.out" }) : null;
      // Drift targets: the render inside each slide's media box (not the box
      // itself, which the slide and video timelines animate). One quickTo
      // pair per element, reused on every pointermove.
      const drift = tiltOn
        ? slides.current
            .map((sl) => sl?.querySelector("[data-anim='media'] > *"))
            .filter((el): el is Element => !!el)
            .map((el) => ({
              x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
              y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
            }))
        : [];
      let cardRect: DOMRect | null = null;

      const tiltMove = safe((e: React.PointerEvent) => {
        if (!tiltOn || !cardEl || videoOpenRef.current || e.pointerType !== "mouse") return;
        cardRect ??= cardEl.getBoundingClientRect();
        const nx = (e.clientX - cardRect.left) / cardRect.width - 0.5; // -0.5..0.5
        const ny = (e.clientY - cardRect.top) / cardRect.height - 0.5;
        tiltY?.(nx * 2 * TILT);
        tiltX?.(-ny * 2 * TILT * 0.8);
        for (const d of drift) {
          d.x(-nx * 2 * DRIFT);
          d.y(-ny * 2 * DRIFT * 0.6);
        }
      });

      const tiltReset = safe(() => {
        cardRect = null; // re-measure next time (resize, scroll)
        if (!tiltOn) return;
        tiltX?.(0);
        tiltY?.(0);
        for (const d of drift) {
          d.x(0);
          d.y(0);
        }
      });

      // ---------- slides ----------
      const goTo = safe((next: number) => {
        const current = activeRef.current;
        if (busy.current || caseOpenRef.current || next === current || next < 0 || next >= projects.length)
          return;
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
        if (projects[next]?.placeholder) cursorHide();

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
      // it is instead of jumping.
      //
      // Two openings:
      // - A film: its first and last frames ARE this card (it opens on the
      //   card and ends by pulling back to it), so the player simply
      //   dissolves over the card: a match cut, nothing moves. When the film
      //   ends it dissolves back the same way, landing on the identical frame.
      // - No film yet (empty state): the player wipes in from the right edge
      //   while the card content drifts left: one continuous push.
      let videoTl: gsap.core.Timeline | null = null;
      let afterClose: (() => void) | null = null;
      let fadeAudio: gsap.core.Tween | null = null;

      // Match mode (film + desktop card shape + motion allowed): the film's
      // clock drives the live card, the player's opacity and the hand-offs.
      type Match = {
        m: FilmMatch;
        slide: HTMLElement;
        plate: HTMLElement | null;
        /** Plate's own top-left in card px (its transform origin). */
        plateAt: { x: number; y: number };
        chrome: HTMLElement[];
        scr: { x: number; y: number; w: number };
        cardW: number;
        id: Cam;
        phase: "open" | "tail" | "closing";
        raf: number;
        moved: boolean;
      };
      let match: Match | null = null;

      const setLive = (mt: Match, c: Cam | null) => {
        if (!c) {
          if (mt.moved) {
            gsap.set(mt.slide, { clearProps: "transform,transformOrigin" });
            if (mt.plate) gsap.set(mt.plate, { clearProps: "transform,transformOrigin" });
            mt.moved = false;
          }
          return;
        }
        const { a, bx, by } = liveMatrix(mt.m, c, mt.scr, mt.cardW);
        const tf = `matrix(${a},0,0,${a},${bx},${by})`;
        mt.slide.style.transformOrigin = "0 0";
        mt.slide.style.transform = tf;
        if (mt.plate) {
          // Same camera, but the plate's transform origin is its own corner:
          // p' = a·p + b in card px  ⇒  for a box at o, translate by b + (a − 1)·o.
          const o = mt.plateAt;
          mt.plate.style.transformOrigin = "0 0";
          mt.plate.style.transform = `matrix(${a},0,0,${a},${bx + (a - 1) * o.x},${by + (a - 1) * o.y})`;
        }
        mt.moved = true;
      };

      const endMatch = () => {
        const mt = match;
        if (!mt) return;
        cancelAnimationFrame(mt.raf);
        setLive(mt, null);
        gsap.set(mt.chrome, { clearProps: "opacity" });
        if (mt.plate) gsap.set(mt.plate, { autoAlpha: 0 });
        gsap.set(player.current, { autoAlpha: 0 });
        match = null;
        const v = video.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
          v.volume = 1;
        }
        const then = afterClose;
        afterClose = null;
        then?.();
      };

      const tickMatch = () => {
        const mt = match;
        const v = video.current;
        if (!mt || !v) return;
        // On the film's frame grid: the picture shows frame ⌊t·fps⌋, so the
        // live card must too, or the two drift apart mid-move during a dissolve.
        const t = Math.floor(v.currentTime * mt.m.fps + 1e-4) / mt.m.fps;
        if (mt.phase !== "closing") {
          setLive(mt, liveCam(mt.m, t, mt.id));
          gsap.set(player.current, { autoAlpha: playerAlpha(mt.m, t) });
          gsap.set(mt.chrome, { opacity: chromeAlpha(mt.m, t) });
          if (mt.plate) gsap.set(mt.plate, { autoAlpha: plateAlpha(mt.m, t) });
          // The film is handing back: the card is the card again (interactive,
          // button says "Product video") while the pull-back and the music finish.
          if (mt.phase === "open" && v.currentTime >= mt.m.end.release[0]) {
            mt.phase = "tail";
            videoOpenRef.current = false;
            setVideoOpen(false);
          }
        }
        mt.raf = requestAnimationFrame(tickMatch);
      };

      const startMatch = (m: FilmMatch, slide: HTMLElement): boolean => {
        const cardEl = card.current;
        const screen = slide.querySelector<HTMLElement>("[data-film-screen]");
        if (!cardEl || !screen) return false;
        const cardW = cardEl.offsetWidth;
        if (!fitsFilm(cardW, cardEl.offsetHeight)) return false;
        // Measure the card at rest: no tilt, no drift.
        gsap.killTweensOf(cardEl, "rotationX,rotationY");
        gsap.set(cardEl, { rotationX: 0, rotationY: 0 });
        slide.querySelectorAll("[data-anim='media'] > *").forEach((el) => {
          gsap.killTweensOf(el, "x,y");
          gsap.set(el, { x: 0, y: 0 });
        });
        const c = cardEl.getBoundingClientRect();
        const r = screen.getBoundingClientRect();
        const k = cardW / c.width; // client → card px (the card may be scaled by its perspective)
        const scr = { x: (r.left - c.left) * k, y: (r.top - c.top) * k, w: r.width * k };
        // Card chrome outside the slides (glow, top line) leaves with the push.
        const chrome = Array.from(cardEl.children).filter(
          (el): el is HTMLElement => el instanceof HTMLElement && el.tagName === "SPAN",
        );
        // The plate sits exactly on the live screen's image area, untransformed;
        // the camera matrix then moves it with the slide.
        const plate = cardEl.querySelector<HTMLElement>("[data-film-plate]");
        const u = scr.w / m.plate.posterW; // card px per screen-image px
        const plateAt = { x: scr.x, y: scr.y + m.plate.pad * u };
        if (plate) {
          gsap.set(plate, {
            left: plateAt.x,
            top: plateAt.y,
            width: m.plate.w * u,
            height: m.plate.h * u,
            autoAlpha: 0,
          });
        }
        match = {
          m,
          slide,
          plate,
          plateAt,
          chrome,
          scr,
          cardW,
          id: liveIdentity(m, scr, cardW),
          phase: "open",
          raf: 0,
          moved: false,
        };
        gsap.set(player.current, { clipPath: CLIP_OPEN, autoAlpha: 0 });
        match.raf = requestAnimationFrame(tickMatch);
        return true;
      };

      const onOpened = () => {
        player.current?.querySelector<HTMLElement>("[data-player-focus]")?.focus({ preventScroll: true });
      };

      const onClosed = () => {
        const slide = slides.current[activeRef.current];
        if (slide) {
          const { text, media } = parts(slide);
          gsap.set([text, media], { clearProps: "transform,opacity,visibility" });
        }
        const v = video.current;
        if (v) {
          v.pause();
          v.currentTime = 0; // next opening starts on the card frame again
          v.volume = 1;
        }
        videoTl?.kill();
        videoTl = null;
        const then = afterClose;
        afterClose = null;
        then?.();
      };

      const buildVideoTl = (slide: HTMLElement, film: boolean) => {
        const { text, media } = parts(slide);
        const inner = player.current?.querySelector("[data-player-inner]") ?? [];
        const tl = gsap.timeline({ paused: true, onComplete: onOpened, onReverseComplete: onClosed });
        if (film) {
          // Fallback for a film when the card isn't the film's shape (compact
          // layouts) or motion is reduced: a plain dissolve.
          return tl
            .set(player.current, { clipPath: CLIP_OPEN }, 0)
            .fromTo(player.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" }, 0);
        }
        return tl
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
        const v = video.current;
        const m = projects[activeRef.current].film;

        if (match) endMatch(); // reopened during the hand-back tail: start over
        videoOpenRef.current = true;
        setVideoOpen(true);
        cursorHide();
        afterClose = null;
        fadeAudio?.kill();

        // Start the film inside the click itself: browsers only allow sound
        // when play() runs in the user's gesture, not after a transition.
        if (v) {
          v.currentTime = 0;
          v.volume = 1;
          v.play().catch(() => {
            // Sound refused (strict autoplay policy): play muted instead; the
            // mute button shows it and one tap brings the sound back.
            v.muted = true;
            v.play().catch(() => {});
          });
        }

        if (v && m && !reduce && !videoTl && startMatch(m, slide)) {
          onOpened();
          return;
        }

        tiltReset();
        if (!videoTl) videoTl = buildVideoTl(slide, Boolean(v));
        if (reduce) {
          videoTl.progress(1).pause();
          onOpened();
          return;
        }
        videoTl.timeScale(1).play();
      });

      const closeVideo = safe((then?: () => void) => {
        // Match mode: fade picture and sound, and ease the live card home from
        // wherever the camera is.
        if (match) {
          const mt = match;
          if (then) afterClose = then;
          if (mt.phase === "closing") return;
          mt.phase = "closing";
          cancelAnimationFrame(mt.raf);
          videoOpenRef.current = false;
          setVideoOpen(false);
          const v = video.current;
          const from = liveCam(mt.m, v?.currentTime ?? 0, mt.id);
          const q = { p: 0 };
          const tl = gsap.timeline({ onComplete: endMatch });
          // Backstop: GSAP runs on animation frames, which a hidden tab pauses;
          // the film must stop on close regardless.
          window.setTimeout(() => {
            if (match === mt) endMatch();
          }, 1000);
          tl.to(player.current, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, 0);
          tl.to(mt.chrome, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);
          if (mt.plate) tl.to(mt.plate, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, 0);
          if (v && !v.paused) tl.to(v, { volume: 0, duration: 0.45, ease: "power1.in" }, 0);
          if (from) {
            const id = mt.id;
            tl.to(
              q,
              {
                p: 1,
                duration: 0.7,
                ease: "power3.inOut",
                onUpdate: () =>
                  setLive(mt, {
                    L: from.L + (id.L - from.L) * q.p,
                    T: from.T + (id.T - from.T) * q.p,
                    W: from.W * Math.pow(id.W / from.W, q.p),
                  }),
              },
              0,
            );
          }
          return;
        }

        if (!videoTl) return;
        if (then) afterClose = then;
        if (!videoOpenRef.current) return; // already closing; `then` will run when it finishes

        videoOpenRef.current = false;
        setVideoOpen(false);

        // Sound fades with the picture instead of cutting off.
        const v = video.current;
        if (v && !v.paused) {
          fadeAudio?.kill();
          fadeAudio = gsap.to(v, { volume: 0, duration: reduce ? 0 : 0.45, ease: "power1.in" });
        }

        if (reduce) {
          videoTl.progress(0).pause();
          onClosed();
          return;
        }
        videoTl.timeScale(1.2).reverse();
        // Same backstop for the dissolve: never leave the film playing after close.
        window.setTimeout(() => {
          if (!videoOpenRef.current) video.current?.pause();
        }, 1000);
      });

      // End of the film. Match mode: the hand-back already happened; finish
      // once the music has resolved. Dissolve mode: the film ends on the card
      // frame, so dissolve back to the live card.
      const onFilmEnded = () => {
        if (match && match.phase === "tail") endMatch();
        else if (videoOpenRef.current) closeVideo();
      };
      const rootEl = root.current;
      rootEl?.addEventListener("ended", onFilmEnded, true);

      const videoActive = () => videoTl !== null || match !== null;

      actions.current = {
        ...actions.current,
        goTo,
        openVideo,
        closeVideo,
        videoActive,
        cursorMove,
        cursorShow,
        cursorHide,
        cursorPress,
        tiltMove,
        tiltReset,
      };

      // ---------- card -> case study (shared-element morph) ----------
      // The case-study hero is mounted in a fixed overlay that starts as an
      // exact copy of the card: clipped to the card's rect, card grey, copy
      // and iPad sitting where the card's are, text inks dark. One timeline
      // then grows the clip to the viewport, darkens the surface, glides the
      // copy and the device to their hero positions and turns the inks light.
      // Reversing the same timeline is the way back. Only after it finishes
      // does the URL change (/work/<slug>, or #<slug> inside the artifact).
      let caseTl: gsap.core.Timeline | null = null;
      let caseOpen = false;
      let urlPushed = false;
      const W = () => document.documentElement.clientWidth;
      const H = () => window.innerHeight;
      const rectClip = (r: DOMRect, radius: number) =>
        `inset(${r.top}px ${W() - r.right}px ${H() - r.bottom}px ${r.left}px round ${radius}px)`;
      const FULL_CLIP = "inset(0px 0px 0px 0px round 0px)";

      const pushUrl = (slug: string) => {
        if (IN_ARTIFACT) {
          if (location.hash !== `#${slug}`) location.hash = slug;
        } else {
          window.history.pushState({ caseStudy: slug }, "", `/work/${slug}`);
        }
        urlPushed = true;
      };

      const finishClose = () => {
        caseTl?.kill();
        caseTl = null;
        caseOpen = false;
        caseOpenRef.current = false;
        setCaseSlug(null);
        card.current?.querySelector<HTMLElement>("a[data-cta]")?.focus({ preventScroll: true });
      };

      const openCase = safe((slug: string, instant = false) => {
        if (caseOpen || busy.current || videoOpenRef.current || videoActive()) return;
        const slide = slides.current[activeRef.current];
        const cardEl = card.current;
        if (!slide || !cardEl) return;
        // Settle the card: no tilt, no drift, no cursor.
        cursorHide();
        gsap.killTweensOf(cardEl); // the tilt quickTo tweens are the only ones on the card
        gsap.set(cardEl, { rotationX: 0, rotationY: 0 });
        const cardDevice = slide.querySelector<HTMLElement>("[data-device]");
        const driftEl = slide.querySelector("[data-anim='media'] > *");
        if (driftEl) {
          gsap.killTweensOf(driftEl);
          gsap.set(driftEl, { x: 0, y: 0 });
        }

        // Mount the overlay synchronously so it can be measured now.
        flushSync(() => setCaseSlug(slug));
        const overlay = caseOverlay.current;
        if (!overlay) return; // not mounted (e.g. called during a render): nothing changed, still clickable
        caseOpen = true;
        caseOpenRef.current = true;
        const hero = overlay.querySelector<HTMLElement>("[data-hero]")!;
        const heroCopy = overlay.querySelector<HTMLElement>("[data-copy]")!;
        const heroDevice = overlay.querySelector<HTMLElement>("[data-device]")!;
        const heroGlow = overlay.querySelector<HTMLElement>("[data-glow]");
        // Pinned chrome (Work button, chapter rail) arrives after the morph.
        const heroBar = overlay.querySelectorAll<HTMLElement>("[data-bar], [data-rail]");
        const cardGlowCopy = overlay.querySelector<HTMLElement>("[data-card-glow]");
        overlay.scrollTop = 0;

        const cardRect = cardEl.getBoundingClientRect();
        const cTags = slide.querySelector("ul")!.getBoundingClientRect();
        const cTitle = slide.querySelector("h2")!.getBoundingClientRect();
        const hTags = heroCopy.querySelector("ul")!.getBoundingClientRect();
        const hTitle = heroCopy.querySelector("h1")!.getBoundingClientRect();
        const hCopy = heroCopy.getBoundingClientRect();
        const cDev = cardDevice?.getBoundingClientRect();
        const hDev = heroDevice.getBoundingClientRect();
        const cardGlow = cardEl.querySelector<HTMLElement>("[data-card-glow-src]")?.getBoundingClientRect();

        // Copy: scale about the tags' top centre so they land on each other.
        const copyScale = cTitle.width / hTitle.width;
        const originY = hTags.top - hCopy.top;
        const copyFrom = {
          x: cTitle.left + cTitle.width / 2 - (hTitle.left + hTitle.width / 2),
          y: cTags.top - hTags.top,
          scale: copyScale,
          transformOrigin: `50% ${originY}px`,
        };
        const devFrom = cDev
          ? {
              x: cDev.left - hDev.left,
              y: cDev.top - hDev.top,
              scale: cDev.width / hDev.width,
              transformOrigin: "0 0",
            }
          : { autoAlpha: 0 };
        if (cardGlowCopy && cardGlow) {
          gsap.set(cardGlowCopy, {
            left: cardGlow.left,
            top: cardGlow.top,
            width: cardGlow.width,
            height: cardGlow.height,
          });
        }

        const caseP = projects.find((p) => p.slug === slug);
        const inks = caseP?.heroInk ?? ["rgba(255,255,255,0.88)", "rgba(255,255,255,0.64)", "rgba(255,255,255,1)"];
        const fadeOut = root.current?.querySelectorAll("[data-case-fade]") ?? [];
        const cta = slide.querySelector("[data-cta]");

        caseTl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            overlay.style.clipPath = "none"; // let the hero scroll unclipped
            if (!urlPushed) pushUrl(slug);
            // Move focus into the case study after a click; not on a deep link
            // (no one has interacted yet, so a focus ring would look stray).
            if (!instant)
              overlay.querySelector<HTMLElement>("[data-bar] button")?.focus({ preventScroll: true });
          },
          onReverseComplete: finishClose,
        });
        caseTl
          // Phase 1: things that only exist on the home page step aside.
          .to([...fadeOut, cta].filter(Boolean), { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0)
          // Phase 2: the overlay, identical to the card, takes over and grows.
          .set(overlay, { autoAlpha: 1 }, 0.16)
          .fromTo(
            overlay,
            { clipPath: rectClip(cardRect, 20), backgroundColor: "#f2f2f2" },
            { clipPath: FULL_CLIP, backgroundColor: caseP?.bg ?? "#0f0f0f", duration: 0.95 },
            0.16,
          )
          .fromTo(heroCopy, copyFrom, { x: 0, y: 0, scale: 1, duration: 0.95 }, 0.16)
          .fromTo(
            hero,
            {
              "--hero-ink": "rgba(0,0,0,0.85)",
              "--hero-ink-2": "rgba(0,0,0,0.6)",
              "--hero-ink-tags": "rgba(0,0,0,0.85)",
            },
            {
              "--hero-ink": inks[0],
              "--hero-ink-2": inks[1],
              "--hero-ink-tags": inks[2],
              duration: 0.7,
              ease: "power2.inOut",
            },
            0.36,
          )
          .fromTo(heroDevice, devFrom, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.95 }, 0.16)
          .fromTo(cardGlowCopy, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 0.16)
          .fromTo(heroGlow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0.5)
          .fromTo(
            heroBar,
            { autoAlpha: 0, x: -8 },
            { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out" },
            0.95,
          );

        if (instant || reduce) caseTl.progress(1);
        else caseTl.play();
      });

      // Reverse the morph. Called when the URL goes back (button, browser
      // back, Escape), or directly if the URL was never changed.
      const closeCase = safe(() => {
        if (!caseTl || !caseOpen) return;
        urlPushed = false;
        const overlay = caseOverlay.current;
        const run = () => {
          if (reduce) {
            caseTl?.progress(0);
            finishClose();
          } else {
            caseTl?.timeScale(1.15).reverse();
          }
        };
        if (overlay && overlay.scrollTop > 0) {
          gsap.to(overlay, { scrollTop: 0, duration: 0.35, ease: "power2.inOut", onComplete: run });
        } else run();
      });

      const requestCloseCase = safe(() => {
        if (!caseOpen) return;
        if (urlPushed && !IN_ARTIFACT)
          window.history.back(); // popstate runs closeCase
        else if (urlPushed && IN_ARTIFACT)
          location.hash = ""; // hashchange runs closeCase
        else closeCase();
      });

      const onPopState = () => {
        // Hash changes fire popstate too; inside the artifact hashchange owns it.
        if (IN_ARTIFACT) return;
        if (caseOpen && !location.pathname.startsWith("/work/")) closeCase();
      };
      const onHashChange = () => {
        if (!IN_ARTIFACT) return;
        const slug = location.hash.slice(1);
        if (!slug && caseOpen) closeCase();
        else if (slug && !caseOpen && projects.some((p) => p.slug === slug && !p.placeholder)) {
          const idx = projects.findIndex((p) => p.slug === slug);
          if (idx === activeRef.current) openCase(slug);
        }
      };
      window.addEventListener("popstate", onPopState);
      window.addEventListener("hashchange", onHashChange);

      // Deep link inside the artifact: #<slug> opens straight into the hero.
      if (IN_ARTIFACT) {
        const slug = location.hash.slice(1);
        if (slug && projects[0]?.slug === slug) {
          // After this effect: flushSync can't mount the overlay mid-render.
          requestAnimationFrame(() => {
            urlPushed = true;
            openCase(slug, true);
          });
        }
      }

      actions.current.openCase = openCase;
      actions.current.requestCloseCase = requestCloseCase;

      // ---------- input: wheel, keys, swipe ----------
      let acc = 0;
      let lockedUntil = 0;
      let touchY: number | null = null;
      let touchX: number | null = null;

      const onWheel = (e: WheelEvent) => {
        if (caseOpenRef.current) return; // the case study scrolls normally
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
        if (caseOpenRef.current) {
          if (e.key === "Escape") requestCloseCase();
          return;
        }
        if (e.key === "Escape" && videoOpenRef.current) {
          closeVideo();
          return;
        }
        if (videoOpenRef.current) {
          const v = video.current;
          if (!v || (t && /^(BUTTON|A)$/.test(t.tagName) && e.key === " ")) return; // a focused button handles its own Space
          if (e.key === " " || e.key === "k") {
            e.preventDefault();
            if (v.paused) v.play().catch(() => {});
            else v.pause();
          } else if (e.key === "m") {
            v.muted = !v.muted;
          }
          return;
        }
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

      // Swipe in either axis: vertical mirrors the wheel; horizontal is the
      // phone carousel gesture (the dots are a row there). Whichever axis
      // moved more wins, so a diagonal flick doesn't skip two cards.
      const onTouchStart = (e: TouchEvent) => {
        touchY = e.touches[0]?.clientY ?? null;
        touchX = e.touches[0]?.clientX ?? null;
      };
      const onTouchEnd = (e: TouchEvent) => {
        if (touchY === null || touchX === null || videoOpenRef.current || caseOpenRef.current) return;
        const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
        const dx = touchX - (e.changedTouches[0]?.clientX ?? touchX);
        const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        if (Math.abs(d) > SWIPE_THRESHOLD) goTo(activeRef.current + Math.sign(d));
        touchY = touchX = null;
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
      return () => {
        window.removeEventListener("popstate", onPopState);
        window.removeEventListener("hashchange", onHashChange);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        rootEl?.removeEventListener("ended", onFilmEnded, true);
      };
    },
    { scope: root, dependencies: [projects.length] },
  );

  const current = projects[active];
  const caseProject = caseSlug ? projects.find((p) => p.slug === caseSlug) : undefined;

  return (
    <div className={styles.stage} ref={root} data-case-open={caseSlug ? "" : undefined}>
      <div className={styles.rail} data-case-fade>
        <ol className={styles.dots} aria-label="Projects">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <button
                type="button"
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                aria-label={`${i + 1}. ${p.name}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => actions.current.goTo(i)}
              />
            </li>
          ))}
        </ol>
      </div>

      <section
        ref={card}
        className={styles.card}
        style={current.accent ? ({ "--accent": current.accent } as CSSProperties) : undefined}
        data-video={videoOpen ? "open" : undefined}
        data-placeholder={current.placeholder ? "" : undefined}
        aria-roledescription="carousel"
        aria-label="Selected work"
        onPointerEnter={(e) => actions.current.cursorShow(e)}
        onPointerMove={(e) => {
          actions.current.cursorMove(e);
          actions.current.tiltMove(e);
        }}
        onPointerLeave={() => {
          actions.current.cursorHide();
          actions.current.tiltReset();
        }}
        onPointerDown={() => actions.current.cursorPress(true)}
        onPointerUp={() => actions.current.cursorPress(false)}
      >
        <span className={styles.glow} aria-hidden="true" data-card-glow-src />
        <span className={styles.topLine} aria-hidden="true" data-case-fade />

        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              slides.current[i] = el;
            }}
            className={styles.slide}
            style={p.accent ? ({ "--accent": p.accent } as CSSProperties) : undefined}
            aria-hidden={i !== active || videoOpen}
            inert={i !== active || videoOpen}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}`}
          >
            {/* Click-anywhere layer for mouse users. Hidden from keyboard and
                screen readers: the visible "Read case study" button below is
                the real, focusable link to the same page. */}
            {!p.placeholder && (
              <Link
                href={`/work/${p.slug}`}
                className={styles.cardLink}
                prefetch={false}
                onClick={(e) => {
                  if (!IN_ARTIFACT && !isPlainClick(e)) return;
                  e.preventDefault();
                  actions.current.openCase(p.slug);
                }}
                tabIndex={-1}
                aria-hidden="true"
              />
            )}

            <div className={styles.copy}>
              <div className={styles.copyText} data-copy>
                {p.badge && (
                  <p className={styles.badge} data-anim="text">
                    <span className={styles.badgeDot} aria-hidden="true" />
                    {p.badge}
                  </p>
                )}
                <ul className={styles.tags} data-anim="text">
                  {p.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <h2 className={styles.title} data-anim="text">
                  {p.title.lead && (
                    <>
                      {p.title.lead}
                      {p.title.breakAfterLead ? <br /> : " "}
                    </>
                  )}
                  <span className={styles.accent}>{p.title.accent}</span>
                  {p.title.rest && <> {p.title.rest}</>}
                </h2>
                <p className={styles.summary} data-anim="text">
                  {p.summary}
                </p>
              </div>
              {!p.placeholder && (
                <Link
                  href={`/work/${p.slug}`}
                  className={`${action.action} ${action.inCard} ${styles.cta}`}
                  data-anim="text"
                  data-cta
                  prefetch={false}
                  onClick={(e) => {
                    if (!IN_ARTIFACT && !isPlainClick(e)) return;
                    e.preventDefault();
                    actions.current.openCase(p.slug);
                  }}
                >
                  <span className={`${action.disc} ${action.accent} ${styles.ctaDisc}`} aria-hidden="true">
                    <ArrowIcon />
                  </span>
                  Read case study
                </Link>
              )}
            </div>

            <div className={styles.media} data-anim="media">
              {p.screen ? (
                <div className={styles.mediaDevice}>
                  <DeviceMock screen={p.screen} />
                </div>
              ) : p.image ? (
                <Image
                  className={styles.mediaImage}
                  src={p.image.src}
                  width={p.image.width}
                  height={p.image.height}
                  alt={p.image.alt}
                  sizes="(max-width: 900px) 92vw, 960px"
                  draggable={false}
                  data-device
                />
              ) : (
                <div className={styles.mediaEmpty}>
                  <span className={styles.mediaEmptyScreen}>Case study in progress</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {current.film && (
          // eslint-disable-next-line @next/next/no-img-element -- positioned and moved by the film controller
          <img
            key={current.slug}
            className={styles.filmPlate}
            src={current.film.plate.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            data-film-plate
          />
        )}

        <div
          id={PLAYER_ID}
          ref={player}
          className={styles.player}
          role="region"
          aria-label={`${current.name} product video`}
          aria-hidden={!videoOpen}
          inert={!videoOpen}
          data-idle={videoOpen && filmIdle ? "" : undefined}
          onPointerMove={wakeFilm}
          onPointerDown={wakeFilm}
          onFocus={wakeFilm}
        >
          <div className={styles.playerInner} data-player-inner>
            {current.videoSrc ? (
              <video
                key={current.slug}
                ref={video}
                className={styles.video}
                src={current.videoSrc}
                poster={current.videoPoster}
                playsInline
                preload="metadata"
                tabIndex={-1}
                data-player-focus
                aria-label={`${current.name} product film`}
                onPlay={wakeFilm}
                onPause={() => setFilmIdle(false)}
                onClick={(e) => {
                  const v = e.currentTarget;
                  if (v.paused) v.play().catch(() => {});
                  else v.pause();
                }}
              />
            ) : (
              <div className={styles.playerEmpty} tabIndex={-1} data-player-focus>
                <p className={styles.playerEmptyTitle}>The product video is still being edited.</p>
                <p className={styles.playerEmptyBody}>
                  The case study walks through the same flows, screen by screen.
                </p>
                {!current.placeholder && (
                  <Link
                    href={`/work/${current.slug}`}
                    className={`${action.action} ${action.onDark}`}
                    prefetch={!IN_ARTIFACT}
                    onClick={artifactGuard}
                  >
                    <span className={`${action.disc} ${action.accent}`} aria-hidden="true">
                      <ArrowIcon />
                    </span>
                    Read case study
                  </Link>
                )}
              </div>
            )}
          </div>
          {current.videoSrc && (
            // The open timeline fades this wrapper in; the idle state fades the
            // controls inside it, so the two never fight over one opacity.
            <div className={styles.filmChrome} data-film-chrome>
              <FilmControls getVideo={getVideo} slug={current.slug} />
            </div>
          )}
          <button
            type="button"
            className={`${action.disc} ${action.glass} ${styles.playerClose}`}
            aria-label="Close video"
            onClick={() => actions.current.closeVideo()}
          >
            <CloseIcon />
          </button>
        </div>
      </section>

      {/* Only projects that have (or will have) a product video get the button. */}
      <div
        className={styles.side}
        data-case-fade
        data-hidden={current.placeholder || current.noVideo ? "" : undefined}
        inert={current.placeholder || current.noVideo}
        // Warm the film when the pointer heads for the button, not on page load
        // (it's ~15 MB): the opening push runs on the film's clock.
        onPointerEnter={() => {
          const v = getVideo();
          if (v && v.preload !== "auto") v.preload = "auto";
        }}
        onFocus={() => {
          const v = getVideo();
          if (v && v.preload !== "auto") v.preload = "auto";
        }}
      >
        <VideoToggle
          open={videoOpen}
          controls={PLAYER_ID}
          onToggle={() => {
            if (videoOpen) actions.current.closeVideo();
            else {
              actions.current.openVideo();
              wakeFilm(); // chrome visible on open, then rests once the film plays
            }
          }}
        />
      </div>

      <div
        ref={cursor}
        className={styles.cursor}
        style={current.accent ? ({ "--accent": current.accent } as CSSProperties) : undefined}
        aria-hidden="true"
      >
        <span className={styles.cursorDisc} data-cursor-disc />
        <span className={styles.cursorLabel}>
          View
          <br />
          case study
        </span>
      </div>

      {caseProject && (
        <div
          ref={caseOverlay}
          className={styles.caseOverlay}
          style={caseProject.accent ? ({ "--accent": caseProject.accent } as CSSProperties) : undefined}
          role="dialog"
          aria-modal="true"
          aria-label={`${caseProject.name}: case study`}
        >
          {/* Stand-in for the card's own glow, faded out as the surface darkens. */}
          <span className={styles.caseCardGlow} aria-hidden="true" data-card-glow />
          <div data-hero className={styles.caseHero}>
            <CaseStudy
              project={caseProject}
              back={
                <button
                  type="button"
                  className={`${action.action} ${action.onDark}`}
                  onClick={() => actions.current.requestCloseCase()}
                >
                  <span className={`${action.disc} ${action.glass}`} aria-hidden="true">
                    <ArrowLeftIcon />
                  </span>
                  Work
                </button>
              }
            />
          </div>
        </div>
      )}

      {/* The chick is the way to the About page: personality with a job. */}
      <Link
        href="/about"
        data-case-fade
        className={styles.chick}
        onClick={artifactGuard}
        prefetch={!IN_ARTIFACT}
      >
        <span aria-hidden="true">🐤</span>
        <span className={styles.chickTip}>About me</span>
      </Link>

      <p className="visually-hidden" aria-live="polite">
        {videoOpen
          ? `Playing ${current.name} product video`
          : `Project ${active + 1} of ${projects.length}: ${current.name}`}
      </p>
    </div>
  );
}
