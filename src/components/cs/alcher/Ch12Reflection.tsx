import { Chapter } from "../Primitives";
import { Opener } from "./Story";

/** 12 · Reflection (Figma 504:68856): the opener and "What I learned". */
export function Ch12Reflection() {
  return (
    <Chapter id="reflection" label="Reflection">
      <Opener
        eyebrow="Reflection"
        title="Skinning a utility as a game is the easy part. Making the game serve the utility is the work."
        introTitle="What I learned"
        intro={
          <p>
            The 8-bit look got the attention; the schedule had to keep it. Every time gamification made a job slower,
            the job won, so the rule became: play never costs a tap. I’d carry that into anything with a theme on top
            of a tool.
          </p>
        }
      />
    </Chapter>
  );
}
