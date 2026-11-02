import { Chapter, Opener } from "../Primitives";
import cs from "../cs.module.css";

export function Ch11Reflection() {
  return (
    <Chapter id="reflection" label="Reflection">
      <Opener
        eyebrow="Reflection"
        title="Six weeks, one designer, and what I'd do differently."
        introTitle="What I'd change"
        intro={
          <p className={cs.body}>
            I&apos;d test earlier: the lookup should have met five learners in week two. I&apos;d
            design desktop and touch together from day one, since every hover needs a tap
            equivalent. And I&apos;d cut harder for a first release: the watch → save → review loop
            first, every reader and course after.
          </p>
        }
      />
    </Chapter>
  );
}
