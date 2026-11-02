// Generated from the Figma "08 · The experience" figures (Placement-Portfolio,
// 153:8386): headline, steps, persona moment, and desktop annotation boxes/pins
// as % of the MacBook frame. Screens: public/cs/immerlingo/screens/<slug>-{d,tl,tp,m}.png

export type Annot = {
  left: number;
  top: number;
  width?: number;
  height?: number;
};

export type ExperienceFigure = {
  slug: string;
  title: string;
  /** Title on touch devices (tablet/phone), when it differs (Figma case study T/M). */
  touchTitle?: string;
  part: 1 | 2;
  headline: string;
  steps: { title: string; body: string }[];
  highlights: Annot[];
  pins: Annot[];
  persona?: "Piyush" | "Orin";
  quote?: string;
};

export const experienceFigures: ExperienceFigure[] = [
  {
    slug: "pick-a-show",
    title: "Pick a show",
    part: 1,
    headline: "Start from a show, not a level test.",
    steps: [
      {
        title: "Taste first",
        body: "Learners pick what they want to watch; that ownership carries them through a hard first scene.",
      },
      {
        title: "Difficulty in plain words",
        body: "Each show says how it sounds (everyday, fast, wordplay), so beginners choose by ear.",
      },
      {
        title: "A small first commitment",
        body: "Selecting a show sets expectations: six words, a 40-second scene, about three minutes.",
      },
    ],
    highlights: [
      {
        left: 11.83,
        top: 17.78,
        width: 42.67,
        height: 10.03,
      },
      {
        left: 12.5,
        top: 54.25,
        width: 75.17,
        height: 8.89,
      },
      {
        left: 11.83,
        top: 65.87,
        width: 73.17,
        height: 4.33,
      },
    ],
    pins: [
      {
        left: 8.83,
        top: 15.27,
      },
      {
        left: 9.62,
        top: 51.74,
      },
      {
        left: 10.0,
        top: 63.37,
      },
    ],
    persona: "Piyush",
    quote: "“I don't know my level. I know what I want to watch.” — Piyush",
  },
  {
    slug: "warm-up-cards",
    title: "Warm-up cards",
    part: 1,
    headline: "Learn the scene's words before the scene.",
    steps: [
      {
        title: "Six words first",
        body: "So the very first watch is one a beginner can follow.",
      },
      {
        title: "The word in its line",
        body: "The answer shows the exact line it's spoken in, so it's remembered with its moment.",
      },
      {
        title: "Anki-style grading",
        body: "Again, Hard, Good, Easy and the same keys, so Anki users have nothing new to learn.",
      },
    ],
    highlights: [
      {
        left: 31.67,
        top: 22.34,
        width: 18.67,
        height: 4.1,
      },
      {
        left: 44.0,
        top: 45.51,
        width: 12.17,
        height: 7.81,
      },
      {
        left: 36.17,
        top: 61.09,
        width: 27.67,
        height: 8.89,
      },
    ],
    pins: [
      {
        left: 29.24,
        top: 19.2,
      },
      {
        left: 41.03,
        top: 44.99,
      },
      {
        left: 34.33,
        top: 58.58,
      },
    ],
  },
  {
    slug: "hover-lookup",
    title: "Hover lookup",
    touchTitle: "Tap to look up",
    part: 1,
    headline: "Look up a word without stopping the story.",
    steps: [
      {
        title: "Hover, don't click",
        body: "Resting on a word opens its meaning above the subtitle.",
      },
      {
        title: "Pauses only while you read",
        body: "Moving away resumes the scene, without replaying the line.",
      },
      {
        title: "Every lookup ends in a choice",
        body: "Save, explain, mark as known or ignore.",
      },
    ],
    highlights: [
      {
        left: 42.5,
        top: 70.89,
        width: 12.67,
        height: 7.75,
      },
      {
        left: 84.5,
        top: 87.95,
        width: 9.67,
        height: 3.37,
      },
      {
        left: 36.59,
        top: 62.0,
        width: 16.74,
        height: 8.43,
      },
    ],
    pins: [
      {
        left: 53.33,
        top: 68.38,
      },
      {
        left: 81.83,
        top: 85.25,
      },
      {
        left: 33.83,
        top: 59.49,
      },
    ],
    persona: "Piyush",
    quote:
      "“I was pausing every three seconds. I just want to hover and keep watching.” — Piyush",
  },
  {
    slug: "scene-summary",
    title: "Scene summary",
    part: 1,
    headline: "See what you understood, then practise what you didn't.",
    steps: [
      {
        title: "A score without a quiz",
        body: "57% is worked out from what you looked up while watching.",
      },
      {
        title: "Every shaky word",
        body: "Lookups plus warm-up words still settling, so nothing slips through.",
      },
      {
        title: "Practise, then rewatch",
        body: "The deck ends when each word sticks, then the scene plays again.",
      },
    ],
    highlights: [
      {
        left: 32.5,
        top: 25.99,
        width: 35.0,
        height: 5.25,
      },
      {
        left: 32.5,
        top: 47.2,
        width: 35.0,
        height: 22.35,
      },
      {
        left: 32.87,
        top: 70.03,
        width: 25.46,
        height: 5.29,
      },
    ],
    pins: [
      {
        left: 29.66,
        top: 23.6,
      },
      {
        left: 29.75,
        top: 44.33,
      },
      {
        left: 30.83,
        top: 72.4,
      },
    ],
  },
  {
    slug: "japanese-only-rewatch",
    title: "Japanese-only rewatch",
    part: 1,
    headline: "Watch it again, in Japanese only.",
    steps: [
      {
        title: "No English this time",
        body: "No translation line and no fallback.",
      },
      {
        title: "The scene is the test",
        body: "Following it without English shows the practised words landed.",
      },
      {
        title: "Readings only where needed",
        body: "Furigana stays only on words you saved.",
      },
    ],
    highlights: [
      {
        left: 85.58,
        top: 5.7,
        width: 8.69,
        height: 4.1,
      },
      {
        left: 40.33,
        top: 75.68,
        width: 19.33,
        height: 6.69,
      },
      {
        left: 53.26,
        top: 73.25,
        width: 6.22,
        height: 2.31,
      },
    ],
    pins: [
      {
        left: 82.52,
        top: 4.17,
      },
      {
        left: 38.5,
        top: 73.17,
      },
      {
        left: 51.33,
        top: 70.09,
      },
    ],
  },
  {
    slug: "second-watch-summary",
    title: "Second-watch summary",
    part: 1,
    headline: "Show the progress, then ask for the habit.",
    steps: [
      {
        title: "57% → 100% of the scene's words",
        body: "The same scene, before and after practice.",
      },
      {
        title: "Next time adjusts",
        body: "It starts in Japanese, with readings only on saved words.",
      },
      {
        title: "Ask at the high point",
        body: "Daily time is asked after the win, never up front.",
      },
    ],
    highlights: [
      {
        left: 32.5,
        top: 35.08,
        width: 35.0,
        height: 5.01,
      },
      {
        left: 33.57,
        top: 44.22,
        width: 32.93,
        height: 6.38,
      },
      {
        left: 32.5,
        top: 51.51,
        width: 35.0,
        height: 8.59,
      },
    ],
    pins: [
      {
        left: 29.66,
        top: 33.26,
      },
      {
        left: 31.74,
        top: 42.04,
      },
      {
        left: 29.66,
        top: 49.29,
      },
    ],
  },
  {
    slug: "today",
    title: "Today",
    part: 2,
    headline: "Open the app and know what to do tonight.",
    steps: [
      {
        title: "One episode, ready",
        body: "Tonight's episode on top, with how much of it you'll understand.",
      },
      {
        title: "A plan that fits the evening",
        body: "A saved lesson, warm-up, watch and review, sized to the time you set.",
      },
      {
        title: "Help level, explained",
        body: "Shown with a Why?, so changes never feel arbitrary.",
      },
    ],
    highlights: [
      {
        left: 24.5,
        top: 16.87,
        width: 21.67,
        height: 8.21,
      },
      {
        left: 39.06,
        top: 25.46,
        width: 26.48,
        height: 28.34,
      },
      {
        left: 54.5,
        top: 21.43,
        width: 11.33,
        height: 3.65,
      },
    ],
    pins: [
      {
        left: 21.64,
        top: 14.36,
      },
      {
        left: 37.17,
        top: 44.74,
      },
      {
        left: 52.65,
        top: 17.9,
      },
    ],
    persona: "Orin",
    quote: "“Tell me what to do tonight. I'll say if I disagree.” — Orin",
  },
  {
    slug: "media-detail",
    title: "Media detail",
    part: 2,
    headline: "Know how much you'll follow before you press play.",
    steps: [
      {
        title: "An honest number",
        body: "82% of this show's words, labelled a stretch fit, with the bands shown.",
      },
      {
        title: "Every episode rated",
        body: "Each episode shows the share of words you know; red marks a tough one to warm up for.",
      },
      {
        title: "A short warm-up",
        body: "The 8 most repeated new words, about two minutes. All 18 is a choice, not the default.",
      },
    ],
    highlights: [
      {
        left: 67.83,
        top: 15.04,
        width: 23.17,
        height: 12.76,
      },
      {
        left: 13.5,
        top: 47.18,
        width: 51.34,
        height: 22.79,
      },
      {
        left: 67.67,
        top: 67.24,
        width: 23.17,
        height: 15.57,
      },
    ],
    pins: [
      {
        left: 64.83,
        top: 12.66,
      },
      {
        left: 10.83,
        top: 44.68,
      },
      {
        left: 65.37,
        top: 64.74,
      },
    ],
  },
  {
    slug: "warm-up",
    title: "Warm-up",
    part: 2,
    headline: "Learn the episode's key words before pressing play.",
    steps: [
      {
        title: "Words from this episode",
        body: "Each with how often it's said and the clip it's said in.",
      },
      {
        title: "Progress you can see",
        body: "Every word learned raises how much you'll follow: 82% → 85% so far.",
      },
      {
        title: "Never in the way",
        body: "Mark known words in one tap, or skip to the episode.",
      },
    ],
    highlights: [
      {
        left: 43.67,
        top: 18.46,
        width: 14.17,
        height: 29.18,
      },
      {
        left: 74.0,
        top: 7.75,
        width: 18.17,
        height: 3.65,
      },
      {
        left: 38.0,
        top: 72.26,
        width: 24.0,
        height: 5.7,
      },
    ],
    pins: [
      {
        left: 41.83,
        top: 15.96,
      },
      {
        left: 71.33,
        top: 5.24,
      },
      {
        left: 36.17,
        top: 69.75,
      },
    ],
  },
  {
    slug: "player",
    title: "Player",
    part: 2,
    headline: "Subtitles that show what you know.",
    steps: [
      {
        title: "Colour shows status",
        body: "New words blue, learning amber, known plain, so attention goes where it's needed.",
      },
      {
        title: "English only when needed",
        body: "English appears only when you know less than 80% of a line's words, a second after the Japanese.",
      },
      {
        title: "Progress in view",
        body: "Known words, comprehension and help level stay in the top bar.",
      },
    ],
    highlights: [
      {
        left: 25.17,
        top: 70.21,
        width: 26.5,
        height: 5.93,
      },
      {
        left: 21.5,
        top: 77.04,
        width: 33.33,
        height: 4.33,
      },
      {
        left: 5.5,
        top: 9.12,
        width: 63.67,
        height: 3.87,
      },
    ],
    pins: [
      {
        left: 23.33,
        top: 67.7,
      },
      {
        left: 19.67,
        top: 74.54,
      },
      {
        left: 3.67,
        top: 6.61,
      },
    ],
  },
  {
    slug: "card-creator",
    title: "Card creator",
    part: 2,
    headline: "Save a word without leaving the scene.",
    steps: [
      {
        title: "Filled from the scene",
        body: "Word, sentence, translation and definition arrive filled in; change only what you want.",
      },
      {
        title: "The moment comes with it",
        body: "Line audio and a frame from 04:27 are attached, so reviews bring the scene back.",
      },
      {
        title: "A cap you can see",
        body: "7 of 10 new cards today, so tomorrow's reviews stay manageable.",
      },
    ],
    highlights: [
      {
        left: 65.83,
        top: 27.35,
        width: 28.17,
        height: 28.04,
      },
      {
        left: 65.83,
        top: 56.3,
        width: 16.0,
        height: 21.65,
      },
      {
        left: 65.83,
        top: 84.11,
        width: 28.17,
        height: 5.24,
      },
    ],
    pins: [
      {
        left: 64.0,
        top: 24.85,
      },
      {
        left: 64.0,
        top: 53.79,
      },
      {
        left: 64.0,
        top: 81.6,
      },
    ],
  },
  {
    slug: "explain-this-line",
    title: "Explain this line",
    part: 2,
    headline: "When the whole line is confusing, explain the line.",
    steps: [
      {
        title: "Worth stopping for",
        body: "The one action that pauses the scene, because a breakdown needs full attention.",
      },
      {
        title: "Piece by piece",
        body: "Grammar and nuance in plain English.",
      },
      {
        title: "Checked and labelled",
        body: "Marked as AI, checked against a dictionary, with a way to report mistakes.",
      },
    ],
    highlights: [
      {
        left: 30.83,
        top: 15.27,
        width: 12.33,
        height: 3.87,
      },
      {
        left: 68.33,
        top: 29.18,
        width: 25.67,
        height: 29.63,
      },
      {
        left: 68.33,
        top: 83.88,
        width: 25.67,
        height: 8.21,
      },
    ],
    pins: [
      {
        left: 29.0,
        top: 12.76,
      },
      {
        left: 66.5,
        top: 26.67,
      },
      {
        left: 66.5,
        top: 81.37,
      },
    ],
    persona: "Orin",
    quote: "“I know every word, but not why she said it that way.” — Orin",
  },
  {
    slug: "saved-for-later",
    title: "Saved for later",
    part: 2,
    headline: "Save the grammar for later. Keep the story going.",
    steps: [
      {
        title: "Saved by default",
        body: "One click files ～ちゃう for later, up to three per episode, so the list at the end stays short.",
      },
      {
        title: "The story keeps going",
        body: "The scene is one key from playing again, and the lesson waits at the episode's end.",
      },
      {
        title: "Open now, if you'd rather",
        body: "Anyone who wants the lesson straight away is still one click from it.",
      },
    ],
    highlights: [
      {
        left: 69.33,
        top: 40.8,
        width: 23.5,
        height: 5.24,
      },
      {
        left: 30.83,
        top: 15.27,
        width: 21.67,
        height: 3.87,
      },
      {
        left: 69.33,
        top: 46.73,
        width: 10.33,
        height: 2.74,
      },
    ],
    pins: [
      {
        left: 91.0,
        top: 38.29,
      },
      {
        left: 29.0,
        top: 12.76,
      },
      {
        left: 77.83,
        top: 46.96,
      },
    ],
  },
  {
    slug: "episode-end",
    title: "Episode end",
    part: 2,
    headline: "End each episode with progress, and a little less help.",
    steps: [
      {
        title: "Progress in the show's terms",
        body: "84% of episode 3, up 8 points since episode 1.",
      },
      {
        title: "Help steps back, with a reason",
        body: "Episode 4 shows English on fewer lines, because you looked up fewer words this time.",
      },
      {
        title: "The learner decides",
        body: "Keep the current help in one click, or see why it changed.",
      },
    ],
    highlights: [
      {
        left: 29.0,
        top: 25.98,
        width: 21.67,
        height: 12.08,
      },
      {
        left: 29.0,
        top: 79.32,
        width: 32.33,
        height: 3.65,
      },
      {
        left: 62.0,
        top: 79.32,
        width: 9.0,
        height: 3.65,
      },
    ],
    pins: [
      {
        left: 27.17,
        top: 23.48,
      },
      {
        left: 27.17,
        top: 76.82,
      },
      {
        left: 60.17,
        top: 76.82,
      },
    ],
  },
  {
    slug: "lesson-the-pattern",
    title: "Lesson · the pattern",
    part: 2,
    headline: "Five minutes on the grammar you stopped on.",
    steps: [
      {
        title: "The pattern, then every form",
        body: "～ちゃう built from its parts, with every form in one table and native audio for each row.",
      },
      {
        title: "Two meanings, two lines",
        body: "Done completely, or didn't mean to: each with its own example.",
      },
      {
        title: "Heard in the show",
        body: "A clip from Kissaten no Yoru, picked because it gives nothing away about the story.",
      },
    ],
    highlights: [
      {
        left: 9.33,
        top: 17.1,
        width: 50.33,
        height: 33.74,
      },
      {
        left: 63.83,
        top: 16.41,
        width: 27.5,
        height: 25.3,
      },
      {
        left: 63.83,
        top: 44.45,
        width: 27.5,
        height: 25.07,
      },
    ],
    pins: [
      {
        left: 7.5,
        top: 14.59,
      },
      {
        left: 62.0,
        top: 13.9,
      },
      {
        left: 62.0,
        top: 41.94,
      },
    ],
  },
  {
    slug: "lesson-listen-first",
    title: "Lesson · listen first",
    part: 2,
    headline: "Hear it before you read it.",
    steps: [
      {
        title: "Subtitles hidden",
        body: "A scene from episode 2 plays with no text, so the ear does the work.",
      },
      {
        title: "Slow it down",
        body: "Replay, or drop to 0.75×, before choosing what she said.",
      },
      {
        title: "Feedback that teaches",
        body: "The answer explains why 食べちゃった fits and the other two don't.",
      },
    ],
    highlights: [
      {
        left: 24.67,
        top: 16.41,
        width: 13.17,
        height: 3.65,
      },
      {
        left: 22.67,
        top: 49.01,
        width: 14.33,
        height: 3.65,
      },
      {
        left: 26.5,
        top: 77.04,
        width: 49.17,
        height: 5.93,
      },
    ],
    pins: [
      {
        left: 22.83,
        top: 13.9,
      },
      {
        left: 20.83,
        top: 46.5,
      },
      {
        left: 24.67,
        top: 74.54,
      },
    ],
  },
  {
    slug: "back-from-the-lesson",
    title: "Back from the lesson",
    part: 2,
    headline: "Back to the episode, one line early.",
    steps: [
      {
        title: "A line of run-up",
        body: "Opened mid-episode, the lesson returns you to the line before, so the scene is back in your ear.",
      },
      {
        title: "The pattern, in place",
        body: "～ちゃう is outlined in the subtitle: what you just learned, where you met it.",
      },
      {
        title: "Logged where it started",
        body: "The panel marks the lesson done, with 4 cards added to reviews.",
      },
    ],
    highlights: [
      {
        left: 30.83,
        top: 15.27,
        width: 31.17,
        height: 3.87,
      },
      {
        left: 36.0,
        top: 67.01,
        width: 14.33,
        height: 9.35,
      },
      {
        left: 70.67,
        top: 40.35,
        width: 22.5,
        height: 3.65,
      },
    ],
    pins: [
      {
        left: 29.0,
        top: 12.76,
      },
      {
        left: 34.17,
        top: 64.51,
      },
      {
        left: 68.83,
        top: 37.84,
      },
    ],
  },
  {
    slug: "review",
    title: "Review",
    part: 2,
    headline: "Review words inside the scene they came from.",
    steps: [
      {
        title: "The scene comes back",
        body: "Each card shows the frame and line it was saved from, with the audio one key away.",
      },
      {
        title: "One click to the episode",
        body: "Open this scene in episode 3 jumps straight back to 04:27.",
      },
      {
        title: "Every grade explained",
        body: "The next interval sits under each button, from under a minute to 8 days.",
      },
    ],
    highlights: [
      {
        left: 27.67,
        top: 17.1,
        width: 26.5,
        height: 25.53,
      },
      {
        left: 42.5,
        top: 56.53,
        width: 13.5,
        height: 3.65,
      },
      {
        left: 31.67,
        top: 64.96,
        width: 38.0,
        height: 7.29,
      },
    ],
    pins: [
      {
        left: 25.83,
        top: 14.59,
      },
      {
        left: 40.67,
        top: 54.02,
      },
      {
        left: 29.83,
        top: 62.46,
      },
    ],
  },
  {
    slug: "manga-reader",
    title: "Manga reader",
    part: 2,
    headline: "Read manga with the same tools as video.",
    steps: [
      {
        title: "Every bubble is readable",
        body: "Text detection finds each speech bubble; tap one to look it up.",
      },
      {
        title: "Same lookup",
        body: "The word card works exactly like the player's.",
      },
      {
        title: "Words follow you",
        body: "A word met in manga links back to the scene where you saved it.",
      },
    ],
    highlights: [
      {
        left: 25.17,
        top: 20.29,
        width: 6.5,
        height: 15.73,
      },
      {
        left: 68.83,
        top: 36.01,
        width: 22.33,
        height: 16.18,
      },
      {
        left: 69.33,
        top: 52.43,
        width: 21.0,
        height: 5.01,
      },
    ],
    pins: [
      {
        left: 23.33,
        top: 17.78,
      },
      {
        left: 67.0,
        top: 33.51,
      },
      {
        left: 67.5,
        top: 54.93,
      },
    ],
  },
];
