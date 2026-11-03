import { Chapter, ChapterEnd } from "../Primitives";
import { Opener } from "./Story";
import { PixelBox, PixelText, Plate, Slot } from "./Pixel";
import s from "./Ch04Problem.module.css";

/** 04 · The problem (Figma 504:66979): opener (no divider: it opens Act 02)
 *  and the "Attendees describe the same problem" figure — a lead quote,
 *  the verdict plate and three findings from the ’24 team's research. */

const findings = [
  {
    title: "‘Mini Auditorium’ means nothing to an outsider.",
    body: "Directions existed in every event sheet. A route to a name you can’t picture isn’t orientation, so volunteers still did the wayfinding.",
    source: "’24 team interviews",
  },
  {
    title: "People screenshot the schedule, then close the app.",
    body: "Liked events and reminders were the right mechanic with no visible payoff, so the app lost to a screenshot.",
    source: "’24 team interviews",
  },
  {
    title: "Nothing changes after you attend something.",
    body: "The only ‘mine’ things were liked events and merch orders. The ’24 brainstorm had engagement ideas and parked them for feasibility.",
    source: "’24 app reviews and the ’24 brainstorm",
  },
];

/** Speech-bubble tail under the lead quote (24 × 20, Figma "tail"). */
function Tail() {
  return (
    <svg className={s.tail} width="24" height="20" viewBox="0 0 24 20" aria-hidden="true">
      <path fill="#fff1e8" d="M0 0h20v4H0zM4 4h12v4H4zM8 8h4v4H8zM16 8h4v4h-4zM12 12h8v4h-8z" />
      <path fill="#000" d="M20 0h4v4h-4zM16 4h4v4h-4zM12 8h4v4h-4zM8 12h4v4H8zM0 16h4v4H0z" />
    </svg>
  );
}

export function Ch04Problem() {
  return (
    <Chapter id="problem" label="The problem">
      <div className={s.opener}>
        <Opener
          eyebrow="The problem"
          title="’24 fixed finding things: search, filters, liked events, directions. People still opened the app only when they needed something, then closed it."
        />
      </div>

      <figure className={s.figure} aria-labelledby="alcher-problem-title">
        <Plate as="h3" className={s.plate}>
          <span id="alcher-problem-title">ATTENDEES DESCRIBE THE SAME PROBLEM IN THEIR OWN WORDS</span>
        </Plate>

        <div className={s.body}>
          <div className={s.left}>
            <figure className={s.quote}>
              <PixelBox tone="cream" className={s.bubble}>
                {/* Opening quote mark, drawn (the pixel stand-in font's “ is tiny) */}
                <span className={s.mark} aria-hidden="true">
                  <svg width="18" height="14" viewBox="0 0 18 14">
                    <path fill="#ff004d" d="M4 0h4L5 14H0zM14 0h4l-3 14h-5z" />
                  </svg>
                </span>
                <blockquote className={s.quoteText}>
                  <p>I was so confused about what event to attend.</p>
                </blockquote>
                <Tail />
              </PixelBox>
              <figcaption className={s.cite}>First-time visitor · ’24 team interviews</figcaption>
            </figure>

            <PixelBox tone="pink" className={s.verdict}>
              <PixelText as="p" className={s.verdictTitle}>
                Finding wasn’t the problem.
              </PixelText>
              <p className={s.verdictSub}>Choosing was.</p>
            </PixelBox>
          </div>

          <ol className={s.findings}>
            {findings.map((f, i) => (
              <PixelBox as="li" tone="pink" key={f.title} className={s.finding}>
                <Slot className={s.num} aria-hidden="true">
                  {i + 1}
                </Slot>
                <h4 className={s.findingTitle}>{f.title}</h4>
                <p className={s.findingBody}>{f.body}</p>
                <p className={s.findingSource}>{f.source}</p>
              </PixelBox>
            ))}
          </ol>
        </div>

        <p className={s.note}>Findings reused from the ’24 team’s research, credited where used.</p>
      </figure>

      <ChapterEnd>Two attendees showed this most clearly.</ChapterEnd>
    </Chapter>
  );
}
