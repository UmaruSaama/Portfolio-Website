import type { ComponentType, ReactNode } from "react";
import { chapterAnchor, type Project } from "@/data/projects";
import { DeviceMock } from "./DeviceMock";
import styles from "./CaseStudyHero.module.css";

/**
 * Case-study hero, from Figma "ImmerLingo – Case study D" (153:5016), the
 * top 1291px of the 1440 frame: glow, tags/title/summary at y 128, iPad at
 * y 477 (screen box). Shared by the /work/[slug] route and the in-page
 * overlay the home card morphs into, so both render the same layout.
 *
 * `back` is the control in the top bar (a Link on the route, a button in
 * the overlay). data-copy / data-device / data-glow are the hooks the
 * morph animates.
 */
export function CaseStudyHero({
  project,
  back,
  Backdrop,
  className,
}: {
  project: Project;
  back: ReactNode;
  /** Project backdrop in place of the pink glow (must carry data-glow). */
  Backdrop?: ComponentType;
  /** Project hero restyle (theme module class). */
  className?: string;
}) {
  const img = project.image;
  return (
    <section
      className={`${styles.hero} ${img ? styles.heroImage : ""} ${className ?? ""}`}
      id={chapterAnchor("intro")}
      aria-label="Intro"
    >
      {Backdrop ? <Backdrop /> : <span className={styles.glow} aria-hidden="true" data-glow />}
      <div className={styles.bar} data-bar>
        {back}
      </div>

      <header className={styles.copy} data-copy>
        {project.badge && (
          <p className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            {project.badge}
          </p>
        )}
        <ul className={styles.tags}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <h1 className={styles.title}>
          {project.title.lead && (
                    <>
                      {project.title.lead}
                      {project.title.breakAfterLead ? <br /> : " "}
                    </>
                  )}
          <span className={styles.accent}>{project.title.accent}</span>
          {project.title.rest && <> {project.title.rest}</>}
        </h1>
        <p className={styles.summary}>{project.summary}</p>
      </header>

      {img ? (
        // Still render (e.g. the Alcheringa phone trio) in place of the iPad.
        // eslint-disable-next-line @next/next/no-img-element -- same file as the card's next/image; the morph measures this box
        <img
          className={styles.still}
          src={img.src}
          width={img.width}
          height={img.height}
          alt={img.alt}
          data-device
          decoding="async"
        />
      ) : (
        <div className={styles.device}>
          <DeviceMock screen={project.screen} play />
        </div>
      )}
    </section>
  );
}
