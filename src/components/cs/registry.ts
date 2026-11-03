import type { ComponentType } from "react";
import type { AppendixSection } from "./appendix";
import { immerlingoChapters } from "./immerlingo";
import { alcherChapters } from "./alcher";
import { AlcherBody } from "./alcher/Body";
import { AlcherSky } from "./alcher/Story";
import alcherTheme from "./alcher/theme.module.css";
import { ImmerlingoAppendix, immerlingoAppendixSections } from "./immerlingo/Appendix";

/** Built chapter components per project slug, keyed by chapter id. */
export const chapterComponents: Record<string, Record<string, ComponentType>> = {
  immerlingo: immerlingoChapters,
  "alcheringa-25": alcherChapters,
};

/**
 * Projects with their own page structure (e.g. acts around chapters) and
 * theme class. Default: chapters in order on the shared dark theme.
 */
export const caseLayouts: Record<
  string,
  {
    theme?: string;
    Body?: ComponentType<{ chapters: Record<string, ComponentType> }>;
    /** Replaces the hero's pink glow (keeps the data-glow morph hook). */
    Backdrop?: ComponentType;
  }
> = {
  "alcheringa-25": { theme: alcherTheme.theme, Body: AlcherBody, Backdrop: AlcherSky },
};

/** Appendix (opened from "→ Appendix X" pointers) per project slug. */
export const appendixComponents: Record<string, { title: string; sections: AppendixSection[]; Content: ComponentType }> = {
  immerlingo: { title: "ImmerLingo · Appendix", sections: immerlingoAppendixSections, Content: ImmerlingoAppendix },
};
