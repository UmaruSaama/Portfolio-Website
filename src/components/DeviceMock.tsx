import type { Project } from "@/data/projects";
import styles from "./DeviceMock.module.css";

/**
 * iPad Pro 12.9 (landscape) from the Figma device bezel. The element's box
 * is the 883 × 662 screen; the bezel image overhangs it by 4.17% / 5.91%,
 * exactly as the Figma instance does. Everything inside scales with the
 * element's width (container query units), so the same component works in
 * the card preview and the case-study hero, which is what lets the
 * card → case-study transition move one device instead of swapping two.
 */
export function DeviceMock({ screen }: { screen?: Project["screen"] }) {
  return (
    <div className={styles.device} data-device>
      <div className={styles.screen}>
        {screen?.kind === "placeholder" && (
          <div className={styles.dropZone}>
            <span className={styles.tag}>{screen.tag}</span>
            <span className={styles.label}>{screen.label}</span>
            <span className={styles.spec}>{screen.spec}</span>
          </div>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative frame, sized by CSS */}
      <img
        className={styles.bezel}
        src="/images/ipad-bezel.png"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </div>
  );
}
