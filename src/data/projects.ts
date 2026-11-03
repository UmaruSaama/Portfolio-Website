// One entry per dot in the left rail. Order = dot order.

/** DOM id of a case-study chapter (shared by the rail and the sections). */
export const chapterAnchor = (id: string) => `chapter-${id}`;

export type Project = {
  slug: string;
  /** Plain project name, used in labels (dots, player, live region). */
  name: string;
  tags: string[];
  /** Title split so the accent phrase can be coloured; `lead` comes before it. */
  title: { lead?: string; accent: string; rest?: string };
  summary: string;
  /** What the iPad screen shows (card preview and case-study hero). */
  screen?: { kind: "placeholder"; label: string; spec: string; tag: string };
  /** Card media as a still render instead of the iPad (e.g. a phone trio). */
  image?: { src: string; width: number; height: number; alt: string };
  /**
   * Case-study chapters, in order. `label` = the Figma chapter frame name
   * ("NN · Label"); `short` is shown in the rail where the full name would
   * reach the content column.
   */
  chapters?: { id: string; label: string; short?: string }[];
  /** Product video for the "Product video" button. */
  videoSrc?: string;
  /** Case-study page surface (the card morphs into this colour). */
  bg?: string;
  /** Hero text inks the morph lands on: [title, summary, tags]. */
  heroInk?: [string, string, string];
  /** No case study page yet: no CTA, no "view" cursor, no route. */
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    slug: "immerlingo",
    name: "ImmerLingo",
    tags: ["Product Designer", "UX Research", "Design Systems"],
    title: {
      accent: "Immersive Japanese learning",
      rest: "inside the anime and manga you already enjoy",
    },
    summary:
      "A Japanese learning app where learners look up words while watching anime or reading manga, save them as scene-linked flashcards for spaced review, and choose content rated by how much of it they’ll understand.",
    chapters: [
      { id: "intro", label: "Intro" },
      { id: "snapshot", label: "Snapshot" },
      { id: "problem", label: "The problem" },
      { id: "learners", label: "Meet the learners" },
      { id: "learned", label: "What I learned" },
      { id: "principles", label: "From insight to principle", short: "Principles" },
      { id: "loop", label: "Shaping the loop" },
      { id: "experience", label: "The experience" },
      { id: "system", label: "The system underneath", short: "The system" },
      { id: "next", label: "What’s next" },
      { id: "reflection", label: "Reflection" },
      { id: "close", label: "Close" },
    ],
    screen: {
      kind: "placeholder",
      tag: "GIF",
      label: "Hero walkthrough",
      spec: "883 × 662 · 4:3 landscape · loops, no sound",
    },
  },
  {
    slug: "alcheringa-25",
    name: "Alcheringa ’25",
    tags: ["Product Design", "Gamification", "Visual System"],
    title: {
      lead: "The Alcheringa app, rebuilt as an 8‑bit game you play by",
      accent: "showing up",
    },
    summary:
      "The official app of IIT Guwahati’s cultural festival. The ’24 revamp made events findable; ’25 keeps all of it and wraps it in a pixel-art world where showing up earns XP.",
    image: {
      src: "/work/alcheringa-25/hero-phones.webp",
      width: 1185,
      height: 880,
      alt: "Three phones showing the Alcheringa ’25 app: the activity log, the pixel-art home screen and the festival map.",
    },
    bg: "#111d35",
    heroInk: ["#fff1e8", "rgba(255,241,232,0.85)", "rgba(255,241,232,0.85)"],
    chapters: [
      { id: "intro", label: "Intro" },
      { id: "snapshot", label: "Snapshot" },
      { id: "context", label: "Context" },
      { id: "problem", label: "The problem" },
      { id: "attendees", label: "Meet the attendees", short: "Attendees" },
      { id: "learned", label: "What I learned" },
      { id: "changed", label: "What changed and why", short: "What changed" },
      { id: "shaping", label: "Shaping the app" },
      { id: "experience", label: "The experience" },
      { id: "system", label: "The system underneath", short: "The system" },
      { id: "next", label: "What’s next" },
      { id: "reflection", label: "Reflection" },
      { id: "close", label: "Close" },
    ],
  },
  ...[3, 4].map(
    (n): Project => ({
      slug: `project-0${n}`,
      name: `Project 0${n}`,
      tags: ["Case study"],
      title: { accent: `Project 0${n}`, rest: "coming soon" },
      summary: "Placeholder. Replace with the case study’s one-line summary.",
      placeholder: true,
    }),
  ),
];
