import type { ComponentType } from "react";
import { ActGroup, type Act } from "./Story";

/** Acts in order, each with the chapter ids it holds (Figma Content order). */
const acts: (Act & { chapters: string[] })[] = [
  { n: 1, title: "GATES OPEN", line: "The festival, the app, and why it needed a fifth rebuild.", chapters: ["snapshot", "context"] },
  { n: 2, title: "THE CROWD", line: "Who comes, what they said, and what the ’24 team already knew.", chapters: ["problem", "attendees", "learned"] },
  { n: 3, title: "SOUNDCHECK", line: "One rule, one idea cut, and the structure underneath.", chapters: ["changed", "shaping"] },
  { n: 4, title: "PRONITE", line: "Five moments of the fest, inside the app.", chapters: ["experience"] },
  { n: 5, title: "BACKSTAGE", line: "The type, colour and kit that hold it together.", chapters: ["system"] },
  { n: 6, title: "AFTER THE FEST", line: "What’s next, and what I’d keep.", chapters: ["next", "reflection", "close"] },
];

/** The Alcheringa '25 case-study body: six acts, twelve chapters. */
export function AlcherBody({ chapters }: { chapters: Record<string, ComponentType> }) {
  return (
    <>
      {acts.map((a) => (
        <ActGroup key={a.n} act={a} chapters={a.chapters.map((id) => ({ id, Component: chapters[id] }))} />
      ))}
    </>
  );
}
