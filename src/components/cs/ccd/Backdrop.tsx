import type { CSSProperties } from "react";
import styles from "./theme.module.css";

/** CCD hero colour fields (Figma 834:33510–12); carries the morph's data-glow hook. */
export function CcdBackdrop() {
  return (
    <span className={styles.backdrop} aria-hidden="true" data-glow>
      <span className={styles.field} style={{ "--x": 760, "--y": 260, "--s": 760, "--c": "#923ef5", "--o": 0.22, "--b": 80 } as CSSProperties} />
      <span className={styles.field} style={{ "--x": -120, "--y": 520, "--s": 720, "--c": "#8e8cf2", "--o": 0.35, "--b": 80 } as CSSProperties} />
      <span className={styles.field} style={{ "--x": 980, "--y": 820, "--s": 520, "--c": "#2e42b8", "--o": 0.3, "--b": 60 } as CSSProperties} />
    </span>
  );
}
