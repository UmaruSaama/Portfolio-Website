import type { ComponentType } from "react";
import { Ch02Snapshot } from "./Ch02Snapshot";
import { Ch03Context } from "./Ch03Context";
import { Ch04Problem } from "./Ch04Problem";
import { Ch05Attendees } from "./Ch05Attendees";
import { Ch06Learned } from "./Ch06Learned";
import { Ch07Changed } from "./Ch07Changed";
import { Ch08Shaping } from "./Ch08Shaping";
import { Ch09Experience } from "./Ch09Experience";
import { Ch10System } from "./Ch10System";
import { Ch11Next } from "./Ch11Next";
import { Ch12Reflection } from "./Ch12Reflection";
import { Ch13Close } from "./Ch13Close";

/** Built Alcheringa '25 chapters, keyed by chapter id (see projects.ts). */
export const alcherChapters: Record<string, ComponentType> = {
  snapshot: Ch02Snapshot,
  context: Ch03Context,
  problem: Ch04Problem,
  attendees: Ch05Attendees,
  learned: Ch06Learned,
  changed: Ch07Changed,
  shaping: Ch08Shaping,
  experience: Ch09Experience,
  system: Ch10System,
  next: Ch11Next,
  reflection: Ch12Reflection,
  close: Ch13Close,
};
