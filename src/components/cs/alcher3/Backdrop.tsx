/* eslint-disable @next/next/no-img-element -- static pixel art, sized in frame px */
import styles from "./theme.module.css";

/**
 * Alcheringa '25 v3 hero art (Figma 783:80929): the festoon lights along the
 * top (World art 783:80930) and the mascot waving at the bottom right
 * (Sprite 01 783:81202). Carries the morph's data-glow hook.
 */
export function AlcherBackdrop() {
  return (
    <span className={styles.backdrop} aria-hidden="true" data-glow>
      <img className={styles.festoon} src="/cs/alcher3/r/783-80930.webp" alt="" decoding="async" />
      <img className={styles.mascot} src="/cs/alcher3/r/783-81202.webp" alt="" decoding="async" />
    </span>
  );
}
