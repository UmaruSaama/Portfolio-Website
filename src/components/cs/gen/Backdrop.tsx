import type { CSSProperties } from "react";
import styles from "./light.module.css";

/** One hero colour field in Figma frame px: position, size, colour, opacity, CSS blur. */
export type Field = { x: number; y: number; s: number; c: string; o: number; b: number };

/** Hero colour fields for a generated case study; carries the morph's data-glow hook. */
export function makeBackdrop(fields: Field[]) {
  function Backdrop() {
    return (
      <span className={styles.backdrop} aria-hidden="true" data-glow>
        {fields.map((f, i) => (
          <span
            key={i}
            className={styles.field}
            style={{ "--x": f.x, "--y": f.y, "--s": f.s, "--c": f.c, "--o": f.o, "--b": f.b } as CSSProperties}
          />
        ))}
      </span>
    );
  }
  return Backdrop;
}
