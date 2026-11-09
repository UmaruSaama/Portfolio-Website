// One entry per dot in the left rail. Order = dot order.
import type { FilmMatch } from "@/components/filmMatch";

/** DOM id of a case-study chapter (shared by the rail and the sections). */
export const chapterAnchor = (id: string) => `chapter-${id}`;

export type Project = {
  slug: string;
  /** Plain project name, used in labels (dots, player, live region). */
  name: string;
  tags: string[];
  /** Title split so the accent phrase can be coloured; `lead` comes before it. */
  title: { lead?: string; accent: string; rest?: string; /** Line break after the lead (Figma has one). */ breakAfterLead?: boolean };
  summary: string;
  /** What the iPad screen shows (card preview and case-study hero). */
  screen?:
    | { kind: "placeholder"; label: string; spec: string; tag: string }
    /** Looping walkthrough: the card shows the poster (paused first frame), the hero plays it. */
    | { kind: "video"; src: string; poster: string; label: string };
  /** Card media as a still render instead of the iPad (e.g. a phone trio). */
  image?: { src: string; width: number; height: number; alt: string };
  /**
   * Case-study chapters, in order. `label` = the Figma chapter frame name
   * ("NN · Label"); `short` is shown in the rail where the full name would
   * reach the content column.
   */
  chapters?: { id: string; label: string; short?: string }[];
  /**
   * Product film for the "Product video" button. It should open on this card's
   * exact frame and end on it: the player dissolves over the card (match cut)
   * and dissolves back when the film ends.
   */
  videoSrc?: string;
  /** First frame of the film (shown until it plays). */
  videoPoster?: string;
  /** Camera of the film's opening push and closing pull, so the live card can play them (see filmMatch.ts). */
  film?: FilmMatch;
  /** This project will never have a product film: no "Product video" button. */
  noVideo?: boolean;
  /** Case-study page surface (the card morphs into this colour). */
  bg?: string;
  /** Hero text inks the morph lands on: [title, summary, tags]. */
  heroInk?: [string, string, string];
  /** Project accent (title phrase, tag dots, card glow). Default: site pink. */
  accent?: string;
  /** Status pill above the tags, on the card and the hero (e.g. NDA). */
  badge?: string;
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
      { id: "testing", label: "Putting it in front of people", short: "User testing" },
      { id: "next", label: "What’s next" },
      { id: "reflection", label: "Reflection" },
      { id: "close", label: "Close" },
    ],
    screen: {
      kind: "video",
      src: "/work/immerlingo/hero-walkthrough.mp4",
      poster: "/work/immerlingo/hero-walkthrough-poster.jpg",
      label:
        "ImmerLingo on an iPad: tonight’s plan, a warm-up word, tapping a word in a scene and saving it, the episode summary, then reviewing the card.",
    },
    videoSrc: "/work/immerlingo/film.mp4",
    videoPoster: "/work/immerlingo/film-poster.jpg",
    // From the film source (film4.js): screen = the card iPad's poster box, land = K2c,
    // end = S10A. Re-derive if the film's opening or closing shot changes.
    film: {
      fps: 60,
      screen: { x: 235.853, y: 660.06, w: 1450.265 },
      plate: { src: "/work/immerlingo/film-plate.jpg", w: 1194, h: 834, pad: 31, posterW: 1194, fade: [1.2, 2.2] },
      open: { from: 0.4, to: 3.3, land: { L: 241.487, T: 724.925, W: 979.868 }, reveal: [2.9, 3.2] },
      end: { from: 65.1, to: 66.55, scale: 2.2, cx: 960.985, cy: 888.636, release: [64.8, 65.1] },
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
      src: "/work/alcheringa-25/hero-phones-v3.webp",
      width: 2080,
      height: 1280,
      alt: "Three phones showing the Alcheringa ’25 app: the activity log, the pixel-art home screen and the festival map.",
    },
    bg: "#141318",
    heroInk: ["#f4f1ea", "rgba(244,241,234,0.72)", "rgba(244,241,234,0.72)"],
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
  {
    slug: "ccd-placements",
    name: "CCD Placements",
    tags: ["Product Design", "Service Design", "Live Product"],
    title: {
      lead: "CCD Placements.",
      accent: "Every job, from form to result.",
      breakAfterLead: true,
    },
    summary:
      "IIT Guwahati’s placement and internship system: redesigned portals for coordinators, recruiters and students, and a new student app. Built around the life of one job, so a small CCD team can run a season and every student sees where they stand.",
    image: {
      src: "/work/ccd/showcase.webp",
      width: 1164,
      height: 912,
      alt: "The CCD internship portal in a browser window, with the CCD app’s Home on a phone in front of it: next online assessment, applications left and application updates.",
    },
    accent: "#2e42b8",
    badge: "Under NDA · Confidential",
    bg: "#fbfbfd",
    heroInk: ["#1d1d1f", "#6e6e73", "#6e6e73"],
    chapters: [
      { id: "intro", label: "Intro" },
      { id: "overview", label: "Overview" },
      { id: "role", label: "My role in the loop", short: "My role" },
      { id: "season", label: "How a season runs", short: "A season" },
      { id: "job", label: "The life of one job", short: "One job" },
      { id: "problem", label: "Problem and principles", short: "Problem" },
      { id: "decisions", label: "Key decisions" },
      { id: "screens", label: "Student-side screens", short: "Screens" },
      { id: "iterate", label: "Ship and iterate" },
      { id: "devs", label: "Working with developers and CCD", short: "Developers" },
      { id: "challenges", label: "Challenges" },
      { id: "evidence", label: "Impact and evidence", short: "Evidence" },
      { id: "learnings", label: "Learnings" },
      { id: "close", label: "Close" },
    ],
  },
  {
    slug: "stag-fencing",
    name: "Stag Fencing",
    tags: ["UX Research", "UX/UI Design", "Developer Handoff"],
    title: {
      lead: "Stag Fencing.",
      accent: "A website that earns trust before the phone rings.",
      breakAfterLead: true,
    },
    summary:
      "A new website for a Perth fencing contractor, designed so homeowners can understand their options, feel confident in the team and ask for a quote with less effort.",
    image: {
      src: "/work/stag-fencing/showcase.webp",
      width: 1100,
      height: 677,
      alt: "The Stag Fencing homepage in a browser window: a fenced garden, the headline, rating and project counts, and the free-quote form.",
    },
    accent: "#b83a31",
    noVideo: true, // no product film for Stag: the case study is the whole story
    badge: "Under NDA · Confidential",
    bg: "#fbfbfd",
    heroInk: ["#1d1d1f", "#6e6e73", "#6e6e73"],
    chapters: [
      { id: "intro", label: "Intro" },
      { id: "overview", label: "Overview" },
      { id: "role", label: "Role and responsibilities", short: "My role" },
      { id: "approach", label: "Design approach", short: "Approach" },
      { id: "skills", label: "Skills used", short: "Skills" },
      { id: "challenges", label: "Challenges faced", short: "Challenges" },
      { id: "learnings", label: "Learnings" },
      { id: "close", label: "Close" },
    ],
  },
];
