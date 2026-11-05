"use client";

import { useEffect } from "react";

/**
 * Wires the generated "Shelf · bleeds right" rows (.cs-shelf) to their
 * arrow buttons (.cs-shelf-ctl [data-shelf]): one card per click, buttons
 * disabled at either end. The shelf itself scrolls (touch, trackpad,
 * shift+wheel) without this.
 */
export function CcdShelves() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>(".cs-ccd .cs-shelf").forEach((shelf) => {
      const ctl = shelf.nextElementSibling?.classList.contains("cs-shelf-ctl")
        ? (shelf.nextElementSibling as HTMLElement)
        : null;
      if (!ctl) return;
      const prev = ctl.querySelector<HTMLButtonElement>('[data-shelf="prev"]');
      const next = ctl.querySelector<HTMLButtonElement>('[data-shelf="next"]');
      const step = () => {
        const [a, b] = Array.from(shelf.children) as HTMLElement[];
        return b ? b.offsetLeft - a.offsetLeft : shelf.clientWidth;
      };
      const sync = () => {
        const max = shelf.scrollWidth - shelf.clientWidth - 2;
        if (prev) prev.disabled = shelf.scrollLeft <= 2;
        if (next) next.disabled = shelf.scrollLeft >= max;
      };
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const go = (dir: number) => () =>
        shelf.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
      const onPrev = go(-1);
      const onNext = go(1);
      prev?.addEventListener("click", onPrev);
      next?.addEventListener("click", onNext);
      shelf.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);
      sync();
      cleanups.push(() => {
        prev?.removeEventListener("click", onPrev);
        next?.removeEventListener("click", onNext);
        shelf.removeEventListener("scroll", sync);
        window.removeEventListener("resize", sync);
      });
    });
    return () => cleanups.forEach((f) => f());
  }, []);
  return null;
}
