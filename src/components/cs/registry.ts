import type { ComponentType } from "react";
import { immerlingoChapters } from "./immerlingo";

/** Built chapter components per project slug, keyed by chapter id. */
export const chapterComponents: Record<string, Record<string, ComponentType>> = {
  immerlingo: immerlingoChapters,
};
