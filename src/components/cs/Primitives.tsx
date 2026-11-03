import type { CSSProperties, ReactNode } from "react";
import styles from "./Primitives.module.css";
import cs from "./cs.module.css";

/**
 * Shared building blocks for case-study chapters. Chapter files compose
 * these; anything chapter-specific lives next to the chapter.
 */

/** One chapter. `id` must match the project's chapter id (rail anchor). */
export function Chapter({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={`chapter-${id}`} aria-label={label} className={`${styles.chapter} ${className ?? ""}`}>
      {children}
    </section>
  );
}

/** Small uppercase label with the pink dot ("Eyebrow" in Figma). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className={styles.eyebrowRow}>
      <span className={styles.eyebrowDot} aria-hidden="true" />
      <span className={cs.eyebrow}>{children}</span>
    </p>
  );
}

/**
 * Chapter opener: divider, eyebrow, H1 statement (669 wide), optional
 * intro row (H3 on the left, body on the right).
 */
export function Opener({
  eyebrow,
  title,
  introTitle,
  intro,
  introTitleWidth,
  titleWidth = 669,
}: {
  eyebrow: string;
  title: ReactNode;
  introTitle?: ReactNode;
  intro?: ReactNode;
  /** Figma width of the intro title when it is wider than the default 292. */
  introTitleWidth?: number;
  /** Figma width of the H1 text box (669 by default; some chapters use 950). */
  titleWidth?: number;
}) {
  return (
    <header className={styles.opener}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={`${cs.h1} ${styles.openerTitle}`} style={titleWidth !== 669 ? { maxWidth: `calc(${titleWidth} * var(--v))` } : undefined}>
        {title}
      </h2>
      {(introTitle || intro) && (
        <div className={styles.introRow}>
          {introTitle && (
            <h3
              className={`${cs.h3} ${styles.introTitle}`}
              style={introTitleWidth ? ({ "--intro-w": `${introTitleWidth + 4}px` } as CSSProperties) : undefined}
            >
              {introTitle}
            </h3>
          )}
          {intro && <div className={styles.introBody}>{intro}</div>}
        </div>
      )}
    </header>
  );
}

/** Section heading inside a chapter: small label + H2, optional lead. */
export function SectionHead({
  label,
  title,
  lead,
}: {
  label?: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className={styles.sectionHead}>
      {label && <p className={cs.eyebrow}>{label}</p>}
      <h3 className={cs.h2}>{title}</h3>
      {lead && <div className={styles.lead}>{lead}</div>}
    </div>
  );
}

/** "Chapter end": pink bar + one line that bridges to the next chapter. */
export function ChapterEnd({ children }: { children: ReactNode }) {
  return (
    <p className={styles.chapterEnd}>
      <span className={styles.chapterEndBar} aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * Figure frame shared by every figure: toolbar (type tag + title, optional
 * controls on the right) over a stage. `stageHeight` is the Figma stage
 * height; the stage keeps its proportion via min-height in --v units, and
 * content inside should be laid out fluidly.
 */
export function Figure({
  type,
  title,
  controls,
  children,
  stageClassName,
  glow = false,
}: {
  type: string;
  title: string;
  controls?: ReactNode;
  children: ReactNode;
  stageClassName?: string;
  /** Figma stage "Glow" (the ch08 figures have one; most stages don't). */
  glow?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.toolbar}>
        <figcaption className={styles.figLabel}>
          <span className={styles.typeTag}>{type}</span>
          <span className={styles.figTitle}>{title}</span>
        </figcaption>
        {controls && <div className={styles.controls}>{controls}</div>}
      </div>
      <div className={`${styles.stage} ${stageClassName ?? ""}`}>
        {glow && <span className={styles.stageGlow} aria-hidden="true" />}
        {children}
      </div>
    </figure>
  );
}

/** Label/value pair ("Role · Product designer, solo"). */
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.fact}>
      <p className={cs.eyebrow}>{label}</p>
      <div className={styles.factValue}>{children}</div>
    </div>
  );
}

/** Pull quote with attribution. */
export function Quote({ children, by }: { children: ReactNode; by?: ReactNode }) {
  return (
    <blockquote className={styles.quote}>
      <p className={cs.h3}>{children}</p>
      {by && <footer className={cs.small}>{by}</footer>}
    </blockquote>
  );
}
