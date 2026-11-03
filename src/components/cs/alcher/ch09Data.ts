// Chapter 09 (The experience) data, from Figma 504:67642.
//
// Screens: the app screens are exported at 1× from their source frames on
// the "Alcher App Screen" page (390 wide, full scroll length), shown at 234
// Figma px like the case-study copies (which are the same frames ×0.6). The
// fixed chrome (top bar, nav bar, action bar, page header, Leaderboard's
// "You" row) is layered over the scrolling image, as in the prototype.
//
// Annotations: [pin number, left, top, width, height] of the highlight box,
// in % of the full-length screen (so they scroll with it). The pin sits
// centred on the box's top-left corner, as in Figma (pin 22, box +11).

export type Box = [n: number, l: number, t: number, w: number, h: number];

export type Overlay = {
  src: string;
  /** "top" / "bottom" = full-width bar pinned to that edge; or a box in %. */
  at: "top" | "bottom" | { l: number; t: number; w: number };
  /** Intrinsic size of the overlay image (px). */
  size: [number, number];
};

export type Screen = {
  id: string;
  name: string;
  alt: string;
  src: string;
  /** Intrinsic size (px) of the full-length image. */
  size: [number, number];
  scroll: boolean;
  overlays?: Overlay[];
  ann: Box[];
};

const IMG = "/cs/alcheringa-25/img";
const img = (n: string) => `${IMG}/experience-${n}.webp`;

const top: Overlay = { src: img("home-top"), at: "top", size: [390, 72] };
const nav = (n: string): Overlay => ({ src: img(`${n}-nav`), at: "bottom", size: [390, 111] });

export const screens: Record<string, Screen> = {
  home: {
    id: "home",
    name: "Home",
    alt: "Home before the fest: a mystery lineup card with “Who’s headlining?” and a 12-day countdown, a merch drop (Crazy Eyes hoodie, ₹850), the Alcher pass card to claim, and picks based on your interests.",
    src: img("home"),
    size: [390, 2413],
    scroll: true,
    overlays: [top, nav("home")],
    ann: [
      [1, 36.92, 4.7, 26.07, 1.38],
      [3, 2.82, 29.2, 47.01, 1.93],
    ],
  },
  reveal: {
    id: "reveal",
    name: "Lineup reveal",
    alt: "Lineup reveal: “Day 2 headliner revealed!” The Local Train card, a “+50 XP for being here first!” reward and Share and Add to day buttons.",
    src: img("reveal"),
    size: [390, 843],
    scroll: false,
    ann: [[2, 19.74, 62.55, 72.82, 5.14]],
  },
  activity: {
    id: "activity",
    name: "Activity",
    alt: "Activity, “What’s on”: Events, Competitions and Stalls tabs, day tabs with Day 1 selected, Pronites led by a LIVE Armaan Malik card, then Proshows and today’s competitions.",
    src: img("activity"),
    size: [390, 1773],
    scroll: true,
    overlays: [top, nav("activity")],
    ann: [
      [1, 8.33, 14.68, 14.1, 1.88],
      [2, 2.82, 21.13, 29.06, 2.63],
    ],
  },
  event: {
    id: "event",
    name: "Event detail",
    alt: "Event detail for Battle of the Bands: live now, ₹15,000 prize pool; when, where, team size and entry fee; three rules; and Share and Register buttons pinned at the bottom.",
    src: img("event"),
    size: [390, 1272],
    scroll: true,
    overlays: [{ src: img("event-bar"), at: "bottom", size: [390, 102] }],
    ann: [[3, 22.05, 37.04, 71.28, 2.62]],
  },
  map: {
    id: "map",
    name: "Map",
    alt: "Campus map with All, Stages, Food and Help filter chips and a venue card: “Athletic Field · Main stage, next to SAC · 6 min from Main Gate” with a Directions button.",
    src: img("map"),
    size: [390, 843],
    scroll: false,
    ann: [
      [1, 22.65, 9.87, 15.38, 3.95],
      [2, 24.36, 69.06, 64.1, 4.55],
    ],
  },
  directions: {
    id: "directions",
    name: "Directions",
    alt: "Directions from Guest House to Athletic Field, 340 m · 4 min walk, in three lines: head south on the main road, turn left at the sports complex, Athletic Field is on your right. A Start walking button.",
    src: img("directions"),
    size: [390, 843],
    scroll: false,
    ann: [[3, 31.03, 77.03, 44.87, 3.95]],
  },
  passes: {
    id: "passes",
    name: "My passes",
    alt: "My passes: tonight’s Night 1 pronite pass first with a Show at gate button, Night 2 and Night 3 below, and a note that passes work offline and screenshots don’t scan.",
    src: img("passes"),
    size: [390, 909],
    scroll: true,
    overlays: [{ src: img("passes-header"), at: "top", size: [390, 69] }],
    ann: [
      [1, 3.59, 9.83, 16.24, 3.67],
      [3, 19.74, 86.07, 72.82, 8.07],
    ],
  },
  gate: {
    id: "gate",
    name: "Gate entry",
    alt: "Gate entry for Night 1, Gate 2: a large black-on-white QR code, “Turn your brightness up”, holder Riya Das and pass ID AL-N1-0042.",
    src: img("gate"),
    size: [390, 843],
    scroll: false,
    ann: [[2, 29.74, 54.01, 42.31, 3.95]],
  },
  profile: {
    id: "profile",
    name: "Profile",
    alt: "Profile as a player card: Riya Das, level 3, 300 of 1000 XP; 12 events joined, 3 passes, rank #4; 3 of 12 achievements; then account details and settings.",
    src: img("profile"),
    size: [390, 1707],
    scroll: true,
    overlays: [top, nav("profile")],
    ann: [
      [1, 6.79, 22.48, 25.64, 1.95],
      [2, 2.82, 27.57, 47.44, 2.73],
    ],
  },
  leaderboard: {
    id: "leaderboard",
    name: "Leaderboard",
    alt: "Leaderboard, fest-wide: a podium of Night Owls, Pixel Pushers and Team Momo; Teams, Players and Hostels tabs; ranks 4 to 7; and your own row, 42nd with 300 XP, pinned at the bottom.",
    src: img("leaderboard"),
    size: [390, 1311],
    scroll: true,
    overlays: [
      { src: img("leaderboard-you"), at: { l: 6.15, t: 70.46, w: 89.49 }, size: [349, 129] },
      top,
      nav("profile"),
    ],
    ann: [[3, 58.72, 37.69, 16.24, 2.54]],
  },
};

export type Step = {
  n: number;
  /** Figma's step-label colour (steps 1–2 #ff8fb5, 3–5 #ff77a8). */
  labelColor: string;
  title: string;
  figTitle: string;
  headline: string;
  screens: [string, string];
  story: { title: string; body: string }[];
  persona: string;
  decision: { title: string; insight: string; decision: string; tradeoff: string };
};

export const steps: Step[] = [
  {
    n: 1,
    labelColor: "#ff8fb5",
    title: "Have a reason to open it before Day 1",
    figTitle: "Home: lineup reveal, pass and merch",
    headline: "Start the game before the fest.",
    screens: ["home", "reveal"],
    story: [
      {
        title: "Lineup reveal on a countdown",
        body: "One mystery card per headliner, unlocked when the timer hits zero. Home has a reason to be opened a month before Day 1.",
      },
      {
        title: "Being there first earns XP",
        body: "The reveal screen pays 50 XP to whoever opens it first. The pass, claimed from the same Home, puts that XP on the leaderboard.",
      },
      {
        title: "Merch drops land on Home",
        body: "Real product photos inside pixel chrome. A drop is one more reason to come back before the fest starts.",
      },
    ],
    persona: "“I'm excited about everything and I have no idea what to go to first.” — Riya",
    decision: {
      title: "Start the game before the fest",
      insight:
        "'24's Home led with the headline act and explore chips: complete, and the same every day. Nobody opened it until the schedule was out, and the '24 research found first-timers overwhelmed when they finally did.",
      decision:
        "Home opens a month out. The lineup is revealed one mystery card at a time on a countdown, being there for a reveal earns XP, and claiming your pass puts you on the leaderboard. Merch drops land here too. By Day 1 the app is already a habit.",
      tradeoff:
        "A pre-fest Home depends on the organisers feeding it reveals on schedule. If a reveal slips, the countdown lies, so the card falls back to 'revealing soon' with no date rather than a wrong one.",
    },
  },
  {
    n: 2,
    labelColor: "#ff8fb5",
    title: "Choose the day, then the event",
    figTitle: "Activity → Event detail → Your day",
    headline: "Split by day, pronites first.",
    screens: ["activity", "event"],
    story: [
      {
        title: "Day tabs, today selected",
        body: "Four days, one tap each. The list is today's; tomorrow is a tab, not a scroll.",
      },
      {
        title: "Pronite on top, live first",
        body: "Tonight's headliner leads the day and a LIVE tag marks what is on right now, so choosing starts from the thing everyone plans around.",
      },
      {
        title: "Register from the sheet",
        body: "When, where, team size, fee and rules on one sheet. Register puts it in Your day with a reminder 30 minutes before.",
      },
    ],
    persona: "“Eighty events is a list, not a plan.” — Riya",
    decision: {
      title: "Split by day, pronites first",
      insight:
        "'24's categorised explore and search let people find anything, and its research found first-timers overwhelmed anyway. Finding wasn't the problem; choosing was.",
      decision:
        "Activity is one tab with three rails (Events, Competitions, Stalls) split by day, today selected, the night's pronite on top. An event sheet shows when, where, team size and rules; saving it or registering puts it in Your day with a reminder 30 minutes before.",
      tradeoff:
        "Day tabs hide tomorrow. For someone planning a whole trip, Day 2 is a tap away rather than on screen, which is the price of a short list for today.",
    },
  },
  {
    n: 3,
    labelColor: "#ff77a8",
    title: "Get to the venue",
    figTitle: "Map and directions",
    headline: "A name needs a place.",
    screens: ["map", "directions"],
    story: [
      {
        title: "Filters, not a legend",
        body: "Stages, food and help as chips on one campus map. Thirty-two stalls collapse to a single tap.",
      },
      {
        title: "A card with a landmark",
        body: "“Athletic Field · next to SAC · 6 min from Main Gate.” The name comes with a place you can picture and a time you can plan around.",
      },
      {
        title: "Three lines to walk",
        body: "Head south, turn left at the sports complex, it is on your right. Directions you can remember with the phone in your pocket.",
      },
    ],
    persona: "“I don't care about the line-up if I can't find the stage.” — Ananya",
    decision: {
      title: "A name needs a place",
      insight:
        "'24 put directions in every event sheet, and outsiders still asked volunteers. A route to a name you can't picture isn't orientation.",
      decision:
        "The Map tab filters the campus into stages, food and help, and every venue card carries a landmark and a walk time: 'next to SAC · 6 min from Main Gate'. Directions are three plain lines, not a turn-by-turn feed.",
      tradeoff:
        "The map is its own tab, so getting from an event sheet to its venue takes two taps. 'Find on map' exists on stalls; putting it on every event is the first thing I'd add.",
    },
  },
  {
    n: 4,
    labelColor: "#ff77a8",
    title: "The night: pass, gate, level up",
    figTitle: "Artist detail → My passes → Gate entry → Level up",
    headline: "Plain where it has to scan.",
    screens: ["passes", "gate"],
    story: [
      {
        title: "Tonight's pass first",
        body: "My passes leads with tonight and keeps the other nights below. It works offline, because the gate is where the signal dies.",
      },
      {
        title: "The QR drops the skin",
        body: "Gate entry is black on white at full brightness with the pass ID underneath. The one screen that must scan gets no pixel treatment.",
      },
      {
        title: "Getting in levels you up",
        body: "A scanned pass is a check-in: XP lands, the night's badge unlocks, and the leaderboard moves. Showing up is the score.",
      },
    ],
    persona: "“One pronite, no missed call times.” — Ananya",
    decision: {
      title: "Plain where it has to scan",
      insight:
        "Pronites are why most people come. In '24 the pass lived in a screenshot, and the gate was the slowest minute of the night.",
      decision:
        "Each night gets its own artist screen with gates and timings. My passes shows tonight's first and works offline; gate entry drops the 8-bit treatment entirely: black QR on white, brightness up. Getting in levels you up and unlocks the night's badge.",
      tradeoff:
        "Passes are personal and screenshots don't scan, which stops sharing but means a dead phone is a dead pass. The fallback is the pass ID printed under the QR, which the gate can look up.",
    },
  },
  {
    n: 5,
    labelColor: "#ff77a8",
    title: "What you keep",
    figTitle: "Profile, achievements, leaderboard",
    headline: "Showing up is the score.",
    screens: ["profile", "leaderboard"],
    story: [
      {
        title: "A player card, not a settings page",
        body: "Level, XP, events joined and rank sit above the account details. What you did at the fest comes before who you are.",
      },
      {
        title: "Locked badges are named",
        body: "3 of 12 unlocked, and the other nine say what earns them: visit five stalls, rate ten, all four days. Something to aim at, not a grid of question marks.",
      },
      {
        title: "Teams, players, hostels",
        body: "The leaderboard ranks all three fest-wide and keeps your own row pinned at the bottom, so rank 42 still has a next step.",
      },
    ],
    persona: "“Come out with something to show for it.” — Riya",
    decision: {
      title: "Showing up is the score",
      insight:
        "In '24, your pass, your liked events and your merch orders sat in three places, and nothing in the app recorded that you had been anywhere.",
      decision:
        "Profile is a player card: level, XP, events joined, rank, and 3 of 12 achievements with the locked ones named so there's something to aim at. The leaderboard ranks teams, players and hostels fest-wide; the Utility toolbox holds passes, orders and everything else.",
      tradeoff:
        "Ratings earn XP, so they can be farmed. The terms say accounts that game check-ins or ratings get reset; a per-day cap is the next thing to design, because front-row passes as the prize make this worth policing.",
    },
  },
];

/* ---------- overworld map (Figma 519:46288, positions in Figma px) ---------- */

export type MapNode = { label: string; src: string; x: number; y: number };
export type World = {
  n: number;
  title: string;
  step: number;
  x: number;
  y: number;
  w: number;
  nodes: MapNode[];
};

/** Thumbnail frames (104 × 225, clipped top of the screen). y is from the
 *  top of the map canvas, which starts 124 below the figure's top. */
export const onboardingNode: MapNode = { label: "Onboarding", src: img("onboarding"), x: 114, y: 44 };

export const worlds: World[] = [
  {
    n: 1,
    title: "BEFORE THE FEST",
    step: 1,
    x: 294,
    y: 0,
    w: 288,
    nodes: [
      { label: "Home", src: img("home"), x: 314, y: 44 },
      { label: "Lineup reveal", src: img("reveal"), x: 458, y: 44 },
    ],
  },
  {
    n: 2,
    title: "THE DAY",
    step: 2,
    x: 638,
    y: 0,
    w: 288,
    nodes: [
      { label: "Activity", src: img("activity"), x: 658, y: 44 },
      { label: "Event detail", src: img("event"), x: 802, y: 44 },
    ],
  },
  {
    n: 3,
    title: "THE WAY THERE",
    step: 3,
    x: 610,
    y: 400,
    w: 288,
    nodes: [
      { label: "Directions", src: img("directions"), x: 630, y: 444 },
      { label: "Map", src: img("map"), x: 774, y: 444 },
    ],
  },
  {
    n: 4,
    title: "THE NIGHT",
    step: 4,
    x: 122,
    y: 400,
    w: 432,
    nodes: [
      { label: "Level up", src: img("levelup"), x: 142, y: 444 },
      { label: "Gate entry", src: img("gate"), x: 286, y: 444 },
      { label: "My passes", src: img("passes"), x: 430, y: 444 },
    ],
  },
  {
    n: 5,
    title: "WHAT YOU KEEP",
    step: 5,
    x: 166,
    y: 800,
    w: 432,
    nodes: [
      { label: "Profile", src: img("profile"), x: 186, y: 844 },
      { label: "Achievements", src: img("achievements"), x: 330, y: 844 },
      { label: "Leaderboard", src: img("leaderboard"), x: 474, y: 844 },
    ],
  },
];

/** "Path" (519:46427): 8 × 8 dots, cream @ 0.55, in canvas coordinates. */
const row = (y: number, xs: number[]) => xs.map((x) => [x, y] as const);
const col = (x: number, y0: number, y1: number) => {
  const out: (readonly [number, number])[] = [];
  for (let y = y0; y <= y1; y += 16) out.push([x, y]);
  return out;
};
export const pathDots = [
  ...row(153, [20, 40, 59, 79, 98, 226, 244, 262, 280, 298, 426, 442, 570, 588, 606, 624, 642, 770, 786, 914, 931, 947, 964]),
  ...col(980, 153, 553),
  ...row(553, [961, 942, 924, 905, 886, 758, 742, 614, 596, 578, 560, 542, 414, 398, 270, 254, 126, 110, 93, 77, 60]),
  ...col(44, 553, 953),
  ...row(953, [62, 80, 98, 116, 134, 152, 170, 298, 314, 442, 458, 586, 602, 618, 634, 650]),
];
