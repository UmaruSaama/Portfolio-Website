import type { ComponentType } from "react";
import { Ch02Snapshot } from "./Ch02Snapshot";
import { Ch03Problem } from "./Ch03Problem";
import { Ch04Learners } from "./Ch04Learners";
import { Ch05Learned } from "./Ch05Learned";
import { Ch06Principles } from "./Ch06Principles";
import { Ch07Loop } from "./Ch07Loop";
import { Ch08Experience } from "./Ch08Experience";
import { Ch09System } from "./Ch09System";
import { Ch10Next } from "./Ch10Next";
import { Ch11Reflection } from "./Ch11Reflection";
import { Ch12Close } from "./Ch12Close";

/**
 * ImmerLingo chapters, keyed by the chapter ids in data/projects.ts.
 * Chapters not listed here render as placeholders ("intro" is the hero).
 */
export const immerlingoChapters: Record<string, ComponentType> = {
  snapshot: Ch02Snapshot,
  problem: Ch03Problem,
  learners: Ch04Learners,
  learned: Ch05Learned,
  principles: Ch06Principles,
  loop: Ch07Loop,
  experience: Ch08Experience,
  system: Ch09System,
  next: Ch10Next,
  reflection: Ch11Reflection,
  close: Ch12Close,
};
