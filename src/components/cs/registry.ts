import type { ComponentType } from "react";
import type { AppendixSection } from "./appendix";
import { immerlingoChapters } from "./immerlingo";
import { ImmerlingoAppendix, immerlingoAppendixSections } from "./immerlingo/Appendix";

/** Built chapter components per project slug, keyed by chapter id. */
export const chapterComponents: Record<string, Record<string, ComponentType>> = {
  immerlingo: immerlingoChapters,
};

/** Appendix (opened from "→ Appendix X" pointers) per project slug. */
export const appendixComponents: Record<string, { title: string; sections: AppendixSection[]; Content: ComponentType }> = {
  immerlingo: { title: "ImmerLingo · Appendix", sections: immerlingoAppendixSections, Content: ImmerlingoAppendix },
};
