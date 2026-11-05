import type { Project } from "@/data/projects";
import styles from "./DeviceMock.module.css";
import { HeroVideo } from "./HeroVideo";

/**
 * iPad Pro 12.9 (landscape) from the Figma device bezel. The element's box
 * is the 883 × 662 screen; the bezel image overhangs it by 4.17% / 5.91%,
 * exactly as the Figma instance does. Everything inside scales with the
 * element's width (container query units), so the same component works in
 * the card preview and the case-study hero, which is what lets the
 * card → case-study transition move one device instead of swapping two.
 */
export function DeviceMock({
  screen,
  play = false,
}: {
  screen?: Project["screen"];
  /** Play a video screen (case-study hero). Off in the card: the card shows
   *  the poster, which is the video's first frame, so the hand-off is seamless. */
  play?: boolean;
}) {
  return (
    <div className={styles.device} data-device>
      <div className={styles.screen}>
        {screen?.kind === "video" &&
          (play ? (
            <HeroVideo className={styles.media} src={screen.src} poster={screen.poster} label={screen.label} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- poster frame, sized by CSS
            <img className={styles.media} src={screen.poster} alt={screen.label} draggable={false} />
          ))}
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
