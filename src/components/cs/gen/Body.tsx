import type { ComponentType } from "react";
import "@fontsource-variable/inter/wght.css";
import "./base.css";
import { GenShelves } from "./Shelf";

/**
 * Body for the generated case studies (CCD Placements, Stag Fencing): the
 * chapters in Figma order, each a full-bleed band with the 1020 column
 * inside. Chapters.tsx + tokens.css per project come from
 * scripts/figma-convert; base.css is the hand-written base and compact layer.
 */
export function GenBody({ chapters }: { chapters: Record<string, ComponentType> }) {
  return (
    <div className="cs-gen">
      {Object.entries(chapters).map(([id, C]) => (
        <C key={id} />
      ))}
      <GenShelves />
    </div>
  );
}
