import type { ComponentType } from "react";
import type { AppendixSection } from "./appendix";
import { immerlingoChapters } from "./immerlingo";
import { alcherChapters, AlcherBackdrop } from "./alcher3";
import alcherTheme from "./alcher3/theme.module.css";
import { GenBody } from "./gen/Body";
import light from "./gen/light.module.css";
import { ccdChapters, CcdBackdrop } from "./ccd";
import ccdTheme from "./ccd/theme.module.css";
import { stagChapters, StagBackdrop } from "./stag";
import stagTheme from "./stag/theme.module.css";
import { ImmerlingoAppendix, immerlingoAppendixSections } from "./immerlingo/Appendix";

/** Built chapter components per project slug, keyed by chapter id. */
export const chapterComponents: Record<string, Record<string, ComponentType>> = {
  immerlingo: immerlingoChapters,
  "alcheringa-25": alcherChapters,
  "ccd-placements": ccdChapters,
  "stag-fencing": stagChapters,
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
    /** Extra class on the hero section (restyles it per project). */
    heroClass?: string;
  }
> = {
  "alcheringa-25": { theme: alcherTheme.theme, Body: GenBody, Backdrop: AlcherBackdrop, heroClass: alcherTheme.hero },
  "ccd-placements": { theme: `${light.theme} ${ccdTheme.theme}`, Body: GenBody, Backdrop: CcdBackdrop, heroClass: light.hero },
  "stag-fencing": { theme: `${light.theme} ${stagTheme.theme}`, Body: GenBody, Backdrop: StagBackdrop, heroClass: light.hero },
};

/** Appendix (opened from "→ Appendix X" pointers) per project slug. */
export const appendixComponents: Record<string, { title: string; sections: AppendixSection[]; Content: ComponentType }> = {
  immerlingo: { title: "ImmerLingo · Appendix", sections: immerlingoAppendixSections, Content: ImmerlingoAppendix },
};
