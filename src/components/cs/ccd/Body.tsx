import type { ComponentType } from "react";
import "@fontsource-variable/inter/wght.css";
import "./ccd.css";
import "./tokens.css";
import { CcdShelves } from "./Shelf";

/**
 * CCD Placements v4 body: the chapters in Figma order, each a full-bleed
 * band (white / #fbfbfd) with the 1020 content column inside.
 * Chapters.tsx and tokens.css are generated from the Figma frame (834:33508)
 * by conv/convert.py; ccd.css holds the hand-written base and compact rules.
 */
export function CcdBody({ chapters }: { chapters: Record<string, ComponentType> }) {
  return (
    <div className="cs-ccd">
      {Object.entries(chapters).map(([id, C]) => (
        <C key={id} />
      ))}
      <CcdShelves />
    </div>
  );
}
