import type { NaviEvent } from "./naviStore";

/**
 * Public, aggregate-only view of the prototype test for the case study.
 * No comments, session ids, countries or timestamps leave this function.
 */
export type NaviSummary = {
  testers: number;            // sessions that actually started (closed the intro or tapped in the app)
  finished: number;           // reached the scenario's real ending
  medianSecs: number;         // median time to finish
  rating: number;             // average 1–5 ease rating
  ratings: number;            // how many answered
  funnel: { label: string; n: number }[];
  refused: number;            // shortcuts the test refused ("We're in" before it was true, etc.)
  topRefused: { label: string; n: number }[];
  greyedTaps: number;         // taps on buttons the network didn't allow
  lastActivity: number | null;
};

export function summarise(evs: NaviEvent[]): NaviSummary {
  type S = { started: boolean; screens: Set<string>; rang: boolean; done: boolean; secs: number };
  const by = new Map<string, S>();
  const refusedBy = new Map<string, number>();
  let refused = 0, greyed = 0, ratingSum = 0, ratings = 0;
  for (const e of [...evs].reverse()) {
    let s = by.get(e.sid);
    if (!s) { s = { started: false, screens: new Set(), rang: false, done: false, secs: 0 }; by.set(e.sid, s); }
    if (e.event === "intro_close" || e.event === "tap") s.started = true;
    if (e.screen) s.screens.add(e.screen);
    if (e.event === "tap") {
      if (e.disabled) greyed++;
      if (/no answer/i.test(e.label || "")) s.rang = true;
    }
    if (e.event === "task_complete" && !s.done) { s.done = true; s.secs = Number(e.label) || 0; }
    if (e.event === "feedback" && e.rating) { ratingSum += e.rating; ratings++; }
    if (e.event === "blocked") { refused++; const k = (e.label || "").slice(0, 40) || "?"; refusedBy.set(k, (refusedBy.get(k) ?? 0) + 1); }
  }
  const started = [...by.values()].filter((s) => s.started);
  const done = started.filter((s) => s.done);
  const times = done.map((s) => s.secs).filter(Boolean).sort((a, b) => a - b);
  return {
    testers: started.length,
    finished: done.length,
    medianSecs: times.length ? times[Math.floor(times.length / 2)] : 0,
    rating: ratings ? Math.round((ratingSum / ratings) * 10) / 10 : 0,
    ratings,
    funnel: [
      { label: "Started the night", n: started.length },
      { label: "Opened “What’s stopping you?”", n: started.filter((s) => s.screens.has("stuck")).length },
      { label: "Rang G2 (started the 30 minutes)", n: started.filter((s) => s.rang).length },
      { label: "Reached a bed by the real path", n: done.length },
    ],
    refused,
    topRefused: [...refusedBy.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([label, n]) => ({ label, n })),
    greyedTaps: greyed,
    lastActivity: evs[0]?.ts ?? null,
  };
}
