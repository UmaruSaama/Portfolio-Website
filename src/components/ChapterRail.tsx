"use client";

import { useEffect, useState } from "react";
import { chapterAnchor } from "@/data/projects";
import { Sheet } from "./Sheet";
import styles from "./ChapterRail.module.css";

type Chapter = { id: string; label: string; short?: string };

/**
 * Left-hand chapter pagination for a case study: the home page's dot pill,
 * expanded into a table of contents. Every chapter name is always visible
 * next to its dot; the current chapter's dot stretches into a bar and its
 * name goes full white. Where the margin is too narrow for names
 * (1024-1359px) it falls back to dots only.
 *
 * Scroll-spy uses IntersectionObserver against the viewport, which works
 * both on the /work/<slug> page (window scrolls) and in the home page's
 * overlay (the overlay scrolls, but it fills the viewport).
 */
export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = chapters
      .map((c) => document.getElementById(chapterAnchor(c.id)))
      .filter((el): el is HTMLElement => !!el);
    // A chapter is "current" while it crosses the band just above the middle.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = els.indexOf(entry.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  // Reading progress for the phone pill: how far the nearest scrolling
  // ancestor (window, or the home overlay) is through the case study.
  useEffect(() => {
    const first = document.getElementById(chapterAnchor(chapters[0]?.id ?? ""));
    const scroller = first?.closest<HTMLElement>("[role='dialog']");
    const target: HTMLElement | Window = scroller ?? window;
    const read = () => {
      const top = scroller ? scroller.scrollTop : window.scrollY;
      const max = scroller
        ? scroller.scrollHeight - scroller.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, top / max)) : 0);
    };
    read();
    target.addEventListener("scroll", read, { passive: true });
    return () => target.removeEventListener("scroll", read);
  }, [chapters]);

  const go = (i: number) => {
    setOpen(false);
    const el = document.getElementById(chapterAnchor(chapters[i].id));
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const current = chapters[active];

  return (
    <>
      <nav className={styles.rail} aria-label="Case study chapters" data-rail>
        <ol className={styles.list}>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                className={styles.item}
                data-active={i === active ? "" : undefined}
                aria-current={i === active ? "step" : undefined}
                onClick={() => go(i)}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.label}>
                  <span className={styles.num}>{pad(i + 1)}</span>
                  {c.short ? (
                    <>
                      <span className={styles.full}>{c.label}</span>
                      <span className={styles.short} aria-hidden="true">
                        {c.short}
                      </span>
                    </>
                  ) : (
                    c.label
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Phone: a bottom pill with the current chapter and reading progress;
        tapping it opens the chapter list as a sheet. */}
      <div className={styles.pillWrap} data-rail>
        <button
          type="button"
          className={styles.pill}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className={styles.pillNum}>{pad(active + 1)}</span>
          <span className={styles.pillLabel}>{current?.label}</span>
          <span className={styles.pillChevron} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M2 7.5L6 3.5l4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.pillBar} aria-hidden="true">
            <span
              className={styles.pillFill}
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
        </button>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Chapters" dark>
        <ol className={styles.sheetList}>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                className={styles.sheetItem}
                data-active={i === active ? "" : undefined}
                aria-current={i === active ? "step" : undefined}
                onClick={() => go(i)}
              >
                <span className={styles.sheetNum}>{pad(i + 1)}</span>
                {c.label}
              </button>
            </li>
          ))}
        </ol>
      </Sheet>
    </>
  );
}
