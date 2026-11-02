// One entry per dot in the left rail. Order = dot order.

export type Project = {
  slug: string;
  tags: string[];
  /** Title split so the accent phrase can be coloured. */
  title: { accent: string; rest: string };
  summary: string;
  /** Hero render shown at the bottom of the card. */
  image?: { src: string; width: number; height: number; alt: string };
  /** Product video for the "Product video" button. */
  videoSrc?: string;
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    slug: "immerlingo",
    tags: ["Product Designer", "UX Research", "Design Systems"],
    title: {
      accent: "Immersive Japanese learning",
      rest: "inside the anime and manga you already enjoy",
    },
    summary:
      "A Japanese learning app where learners look up words while watching anime or reading manga, save them as scene-linked flashcards for spaced review, and choose content rated by how much of it they’ll understand.",
    image: {
      src: "/images/immerlingo-hero.png",
      width: 1097,
      height: 432,
      alt: "ImmerLingo Home on iPad: greeting, 3-day streak, Japanese level 1 progress and score breakdown.",
    },
  },
  ...[2, 3, 4, 5].map(
    (n): Project => ({
      slug: `project-0${n}`,
      tags: ["Case study"],
      title: { accent: `Project 0${n}`, rest: "coming soon" },
      summary: "Placeholder. Replace with the case study’s one-line summary.",
      placeholder: true,
    }),
  ),
];
