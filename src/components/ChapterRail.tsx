"use client";

import { useEffect, useState } from "react";
import { chapterAnchor } from "@/data/projects";
import styles from "./ChapterRail.module.css";

type Chapter = { id: string; label: string };

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

  const go = (i: number) => {
    const el = document.getElementById(chapterAnchor(chapters[i].id));
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
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
                {c.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
