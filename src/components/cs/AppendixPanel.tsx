"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { CloseIcon } from "../icons";
import action from "../Action.module.css";
import { APPENDIX_EVENT, type AppendixRequest } from "./AppendixPointer";
import { appendixAnchor, type AppendixSection } from "./appendix";
import s from "./AppendixPanel.module.css";


/**
 * The case study's appendix as a modal panel that slides over the page.
 * Opened by AppendixPointer ("→ Appendix B") at the section it names;
 * closing (button, Escape, click outside) returns the reader to exactly
 * where they were, because the page underneath never moves.
 *
 * Native <dialog> + showModal(): focus is trapped, the page is inert and
 * Escape fires `cancel`, which we intercept to animate the exit.
 */
export function AppendixPanel({
  title,
  sections,
  children,
}: {
  title: string;
  sections: AppendixSection[];
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const prevOverflow = useRef("");
  const busy = useRef(false);
  const [current, setCurrent] = useState(sections[0]?.id ?? "");

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Scroll the panel (never the page) so a section sits under the header. */
  const jump = useCallback((id: string, smooth: boolean) => {
    const scroller = scrollerRef.current;
    const el = scroller?.querySelector<HTMLElement>(`#${appendixAnchor(id)}`);
    if (!scroller || !el) return;
    const offset = (headerRef.current?.offsetHeight ?? 0) + 24;
    const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - offset;
    scroller.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduced() ? "smooth" : "auto" });
    setCurrent(id);
  }, []);

  const close = useCallback(() => {
    const d = dialogRef.current;
    if (!d?.open || busy.current) return;
    busy.current = true;
    const done = () => {
      d.close();
      document.documentElement.style.overflow = prevOverflow.current;
      returnFocus.current?.focus({ preventScroll: true });
      busy.current = false;
    };
    if (reduced()) return done();
    gsap
      .timeline({ onComplete: done })
      .to(panelRef.current, { xPercent: 100, duration: 0.45, ease: "power3.in" }, 0)
      .to(scrimRef.current, { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.15);
  }, []);

  const open = useCallback(
    (section: string) => {
      const d = dialogRef.current;
      if (!d) return;
      if (d.open) {
        jump(section, true);
        return;
      }
      returnFocus.current = document.activeElement as HTMLElement | null;
      prevOverflow.current = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      d.showModal();
      jump(section, false);
      if (reduced()) {
        gsap.set(panelRef.current, { xPercent: 0 });
        gsap.set(scrimRef.current, { opacity: 1 });
        return;
      }
      gsap
        .timeline()
        .fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0)
        .fromTo(panelRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: "power3.out" }, 0);
    },
    [jump],
  );

  // Pointers anywhere in the case study open the panel.
  useEffect(() => {
    const onRequest = (e: Event) => open((e as CustomEvent<AppendixRequest>).detail.section);
    window.addEventListener(APPENDIX_EVENT, onRequest);
    return () => window.removeEventListener(APPENDIX_EVENT, onRequest);
  }, [open]);

  // Escape: animate out instead of the instant native close, and keep the
  // key from also closing the case study underneath.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.stopPropagation();
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("keydown", onKey);
    };
  }, [close]);

  // Scroll-spy for the section tabs.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) setCurrent(en.target.id.replace("appendix-", ""));
        }
      },
      { root: scroller, rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((sec) => {
      const el = scroller.querySelector(`#${appendixAnchor(sec.id)}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <dialog
      ref={dialogRef}
      className={s.dialog}
      aria-labelledby="appendix-title"
      onClick={(e) => {
        if (e.target === scrimRef.current) close();
      }}
    >
      <div ref={scrimRef} className={s.scrim} />
      <div ref={panelRef} className={s.panel}>
        <div ref={scrollerRef} className={s.scroller}>
          <div ref={headerRef} className={s.header}>
            <div className={s.headRow}>
              <h2 id="appendix-title" className={s.title}>
                {title}
              </h2>
              <button type="button" className={`${action.action} ${action.onDark} ${s.close}`} onClick={close}>
                <span className={`${action.disc} ${action.glass}`} aria-hidden="true">
                  <CloseIcon />
                </span>
                Close
              </button>
            </div>
            <nav aria-label="Appendix sections">
              <ul className={s.tabs}>
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      type="button"
                      className={s.tab}
                      aria-current={current === sec.id ? "true" : undefined}
                      onClick={() => jump(sec.id, true)}
                    >
                      <span className={s.tabLetter}>{sec.id.toUpperCase()}</span>
                      {sec.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className={s.body}>{children}</div>
        </div>
      </div>
    </dialog>
  );
}
