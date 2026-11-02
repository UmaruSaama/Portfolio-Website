"use client";

/**
 * "→ Appendix X" pointers inside chapters. Clicking one asks the case
 * study's AppendixPanel (mounted once per case study) to open at that
 * section. A window event keeps chapters free of panel wiring.
 */

export const APPENDIX_EVENT = "cs:appendix";

export type AppendixRequest = { section: string };

export function openAppendix(section: string) {
  window.dispatchEvent(new CustomEvent<AppendixRequest>(APPENDIX_EVENT, { detail: { section } }));
}

export function AppendixPointer({ section, className }: { section: string; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => openAppendix(section)}
    >
      → Appendix {section.toUpperCase()}
    </button>
  );
}
