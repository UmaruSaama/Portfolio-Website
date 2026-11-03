import type { ReactNode } from "react";
import { chapterAnchor, type Project } from "@/data/projects";
import { CaseStudyHero } from "./CaseStudyHero";
import { ChapterRail } from "./ChapterRail";
import {
  appendixComponents,
  caseLayouts,
  chapterComponents,
} from "./cs/registry";
import { AppendixPanel } from "./cs/AppendixPanel";
import styles from "./CaseStudy.module.css";

/**
 * A whole case study: hero, chapters, and the chapter rail. Used by the
 * /work/<slug> route and by the home page's overlay (the morph target).
 *
 * Chapters other than the intro are placeholders until each section is
 * built from its Figma frame; they exist so the rail has real anchors.
 */
export function CaseStudy({
  project,
  back,
}: {
  project: Project;
  back: ReactNode;
}) {
  const chapters = project.chapters ?? [];
  const pad = (n: number) => String(n).padStart(2, "0");
  const appendix = appendixComponents[project.slug];
  const layout = caseLayouts[project.slug];
  const Body = layout?.Body;

  return (
    <div className={`${styles.page} ${layout?.theme ?? ""}`}>
      <CaseStudyHero project={project} back={back} Backdrop={layout?.Backdrop} />

      <div className={styles.content}>
        {Body ? (
          <Body chapters={chapterComponents[project.slug] ?? {}} />
        ) : (
          chapters.slice(1).map((c, i) => {
            const Built = chapterComponents[project.slug]?.[c.id];
            if (Built) return <Built key={c.id} />;
            return (
              <section
                key={c.id}
                id={chapterAnchor(c.id)}
                className={styles.chapter}
                aria-labelledby={`${c.id}-h`}
              >
                <p className={styles.num}>{pad(i + 2)}</p>
                <h2 id={`${c.id}-h`} className={styles.heading}>
                  {c.label}
                </h2>
                <div className={styles.placeholder}>Section in progress</div>
              </section>
            );
          })
        )}
      </div>

      {chapters.length > 1 && <ChapterRail chapters={chapters} />}

      {appendix && (
        <AppendixPanel title={appendix.title} sections={appendix.sections}>
          <appendix.Content />
        </AppendixPanel>
      )}
    </div>
  );
}
