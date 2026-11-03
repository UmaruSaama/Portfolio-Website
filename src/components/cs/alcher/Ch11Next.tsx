import { ChapterEnd, Chapter } from "../Primitives";
import { Opener } from "./Story";
import { PixelBox } from "./Pixel";
import s from "./Ch11Next.module.css";

/** 11 · What's next (Figma 504:68826): three hand-on cards. */

const cards = [
  {
    label: "Biggest risk",
    title: "Novelty wears off",
    body: "If XP and the leaderboard don’t change what people do by Day 2, the gamification is decoration. Day-2 open rate against ’24’s is the test.",
  },
  {
    label: "Success metrics",
    title: "Opens between events",
    body: "Opens per attendee between events, check-ins per attendee, and the share of saved events actually reached. XP from ratings against XP from check-ins shows whether people are farming.",
  },
  {
    label: "Usability test",
    title: "The map, with outsiders",
    body: "Test the pixel map with people who’ve never seen the campus, at night, in the real pronite crowd. Orientation, not aesthetics, is the question.",
  },
];

export function Ch11Next() {
  return (
    <Chapter id="next" label="What’s next" className={s.root}>
      <div className={s.bare}>
        <Opener
          eyebrow="What’s next"
          title="How it ended, and what I’d hand on."
          introTitle="After Day 3"
          intro={
            <p className={s.regular}>
              The app went live 20 days before Day 1. The next step is the one every team faces: make it easy for
              the ’26 team to keep what worked, and find out whether gamification changed behaviour.
            </p>
          }
        />
      </div>
      <ul className={s.cards}>
        {cards.map((c) => (
          <PixelBox key={c.label} as="li" tone="blue" className={s.card}>
            <p className={s.label}>{c.label}</p>
            <h3 className={s.title}>{c.title}</h3>
            <p className={s.body}>{c.body}</p>
          </PixelBox>
        ))}
      </ul>
      <ChapterEnd>One thing I’d tell the ’26 team.</ChapterEnd>
    </Chapter>
  );
}
