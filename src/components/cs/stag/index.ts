import "./tokens.css";
import { makeBackdrop } from "../gen/Backdrop";

export { chapters as stagChapters } from "./Chapters";

/** Figma 807:33071–73 (hero colour fields; blur = Figma layer blur / 2). */
export const StagBackdrop = makeBackdrop([
  { x: 760, y: 260, s: 760, c: "#b83a31", o: 0.28, b: 121 },
  { x: -120, y: 520, s: 720, c: "#f2a68e", o: 0.45, b: 115 },
  { x: 980, y: 820, s: 520, c: "#f5c542", o: 0.35, b: 83 },
]);
