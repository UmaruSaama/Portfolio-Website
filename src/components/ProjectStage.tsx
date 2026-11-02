"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data/projects";
import { ProductVideo } from "./ProductVideo";
import styles from "./ProjectStage.module.css";

gsap.registerPlugin(useGSAP);

const WHEEL_THRESHOLD = 40; // px of accumulated delta before a step
const COOLDOWN_MS = 700; // ignore further wheel input after a step (trackpad inertia)
const SWIPE_THRESHOLD = 50;

export function ProjectStage({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const busy = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);

  const goToRef = useRef<(next: number) => void>(() => {});

  useGSAP(
    (_context, contextSafe) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      slides.current.forEach((el, i) => {
        if (el && i !== 0) gsap.set(el, { autoAlpha: 0 });
      });

      // Entrance: text lines rise in, then the device.
      const first = slides.current[0];
      if (first && !reduce) {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(first.querySelectorAll("[data-anim='text']"), {
            y: 24,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.08,
          })
          .from(first.querySelector("[data-anim='media']"), { y: 60, autoAlpha: 0, duration: 0.9 }, "-=0.45");
      }

      const goTo = contextSafe!((next: number) => {
        const current = activeRef.current;
        if (busy.current || next === current || next < 0 || next >= projects.length) return;

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
        const fromText = from.querySelectorAll("[data-anim='text']");
        const toText = to.querySelectorAll("[data-anim='text']");
        const fromMedia = from.querySelector("[data-anim='media']");
        const toMedia = to.querySelector("[data-anim='media']");

        gsap
          .timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
              gsap.set(from, { autoAlpha: 0 });
              gsap.set([fromText, fromMedia], { clearProps: "transform,opacity,visibility" });
              busy.current = false;
            },
          })
          .to(fromText, { y: -20 * dir, autoAlpha: 0, duration: 0.35, stagger: 0.03 }, 0)
          .to(fromMedia, { y: -40 * dir, autoAlpha: 0, duration: 0.45 }, 0)
          .set(to, { autoAlpha: 1 }, 0.3)
          .fromTo(
            toText,
            { y: 20 * dir, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
            0.3,
          )
          .fromTo(
            toMedia,
            { y: 60 * dir, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
            0.4,
          );
      });
      goToRef.current = goTo;

      // Wheel, keyboard and swipe all step one project at a time.
      let acc = 0;
      let lockedUntil = 0;
      let touchY: number | null = null;
      const dialogOpen = () => document.querySelector("dialog[open]") !== null;

      const onWheel = (e: WheelEvent) => {
        if (dialogOpen()) return;
        e.preventDefault();
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
        if (dialogOpen()) return;
        const t = e.target as HTMLElement | null;
        if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
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
        if (touchY === null) return;
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
                onClick={() => goToRef.current(i)}
              />
            </li>
          ))}
        </ol>
        <Image className={styles.sparkle} src="/images/sparkle.png" alt="" width={20} height={18} />
      </div>

      <section className={styles.card} aria-roledescription="carousel" aria-label="Selected work">
        <span className={styles.glow} aria-hidden="true" />
        <span className={styles.topLine} aria-hidden="true" />

        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              slides.current[i] = el;
            }}
            className={styles.slide}
            aria-hidden={i !== active}
            inert={i !== active}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}`}
          >
            <div className={styles.copy}>
              <ul className={styles.tags} data-anim="text">
                {p.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <h1 className={styles.title} data-anim="text">
                <span className={styles.accent}>{p.title.accent}</span> {p.title.rest}
              </h1>
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
      </section>

      <div className={styles.side}>
        <ProductVideo key={current.slug} title={current.title.accent} src={current.videoSrc} />
      </div>

      <span className={styles.chick} aria-hidden="true">
        🐤
      </span>

      <p className="visually-hidden" aria-live="polite">
        Project {active + 1} of {projects.length}: {current.title.accent}
      </p>
    </div>
  );
}
