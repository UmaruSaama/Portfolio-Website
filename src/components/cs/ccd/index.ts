import "./tokens.css";
import { makeBackdrop } from "../gen/Backdrop";

export { chapters as ccdChapters } from "./Chapters";

/** Figma 834:33510–12 (hero colour fields). */
export const CcdBackdrop = makeBackdrop([
  { x: 760, y: 260, s: 760, c: "#923ef5", o: 0.22, b: 80 },
  { x: -120, y: 520, s: 720, c: "#8e8cf2", o: 0.35, b: 80 },
  { x: 980, y: 820, s: 520, c: "#2e42b8", o: 0.3, b: 60 },
]);
