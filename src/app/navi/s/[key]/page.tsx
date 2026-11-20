import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { readEvents, storeReady, type NaviEvent } from "@/lib/naviStore";
import { LiveRefresh } from "./LiveRefresh";
import { ClearData } from "./ClearData";
import st from "./stats.module.css";

/*
  Private live stats for the Navi prototype test. The address is /navi/s/<secret>, where the
  secret lives only in the NAVI_STATS_KEY environment variable (the repo is public, so it is never
  in code). Any other key is a 404. Not indexed, not linked anywhere.
*/
export const metadata: Metadata = { title: "Not found", robots: { index: false, follow: false } };
// Rendered per request: the key is only known at runtime, and the root layout reads the pathname.
export const instant = false;

const SCREEN_NAMES: Record<string, string> = {
  pack: "Arrival details", stuck: "What's stopping you?", gate: "Gate", door: "Door", noone: "No one is answering",
  covered: "Where to go (covered / night moves)", in: "We're in", sms: "Priya's SMS", board: "Boarding decision", ramesh: "Ramesh's page",
};

type Session = { sid: string; first: number; last: number; dur: number; screens: Set<string>; taps: number; dead: number; picks: string[]; country: string; lastScreen: string; rang: boolean; allIn: boolean; done: string; secs: number };

function summarise(evs: NaviEvent[]) {
  const asc = [...evs].reverse();
  const sessions = new Map<string, Session>();
  const screenViews = new Map<string, number>();
  const deadTaps = new Map<string, number>();
  const feedback: NaviEvent[] = [];
  const blockedMap = new Map<string, number>();
  for (const e of asc) {
    let s = sessions.get(e.sid);
    if (!s) { s = { sid: e.sid, first: e.ts, last: e.ts, dur: 0, screens: new Set(), taps: 0, dead: 0, picks: [], country: e.country || "", lastScreen: "", rang: false, allIn: false, done: "", secs: 0 }; sessions.set(e.sid, s); }
    s.last = e.ts; s.dur = Math.max(s.dur, e.t ?? 0);
    if (e.screen) { s.screens.add(e.screen); s.lastScreen = e.screen; }
    if (e.event === "screen_view" && e.screen) screenViews.set(e.screen, (screenViews.get(e.screen) ?? 0) + 1);
    if (e.event === "tap") {
      s.taps++;
      if (e.disabled) { s.dead++; const k = `${e.label || "?"} · ${e.screen} · ${e.net}`; deadTaps.set(k, (deadTaps.get(k) ?? 0) + 1); }
      if (/no answer|Done, no answer/i.test(e.label || "")) s.rang = true;
      if (/All 4 are in/i.test(e.label || "")) s.allIn = true;
    }
    if (e.event === "scenario_pick" && e.pick) s.picks.push(e.pick);
    if (e.event === "task_complete" && !s.done) { s.done = e.how || "done"; s.secs = Number(e.label) || 0; }
    if (e.event === "feedback") feedback.push(e);
    if (e.event === "blocked") { const k = `“${e.label || "?"}” → ${e.how || ""}`; blockedMap.set(k, (blockedMap.get(k) ?? 0) + 1); }
  }
  const list = [...sessions.values()].sort((a, b) => b.last - a.last);
  const n = list.length || 1;
  const reached = (f: (s: Session) => boolean) => list.filter(f).length;
  const funnel: [string, number][] = [
    ["Opened the prototype", list.length],
    ["Saw “What’s stopping you?”", reached((s) => s.screens.has("stuck"))],
    ["Chose a barrier (gate, door or no one)", reached((s) => s.screens.has("gate") || s.screens.has("door") || s.screens.has("noone"))],
    ["Rang G2 / guard rang (started the 30 min)", reached((s) => s.rang)],
    ["Reached “where to go”", reached((s) => s.screens.has("covered"))],
    ["Got everyone in (“All 4 are in”)", reached((s) => s.allIn)],
    ["Finished: reached a bed (in, where-to-go or switched)", reached((s) => !!s.done)],
  ];
  const rated = feedback.filter((f) => f.rating);
  const avg = rated.length ? rated.reduce((a, f) => a + (f.rating || 0), 0) / rated.length : 0;
  const doneTimes = list.filter((s) => s.done && s.secs).map((s) => s.secs).sort((a, b) => a - b);
  const median = doneTimes.length ? doneTimes[Math.floor(doneTimes.length / 2)] : 0;
  const live = list.filter((s) => Date.now() - s.last < 5 * 60_000).length;
  return { blocked: [...blockedMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12), live, list, n, funnel, feedback: [...feedback].reverse(), avg, rated: rated.length, median, screenViews: [...screenViews.entries()].sort((a, b) => b[1] - a[1]), deadTaps: [...deadTaps.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12) };
}

const ago = (ts: number) => {
  const s = Math.round((Date.now() - ts) / 1000);
  return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.round(s / 60)}m ago` : `${Math.round(s / 3600)}h ago`;
};
const ist = (ts: number) => new Date(ts).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

async function Stats({ params }: { params: Promise<{ key: string }> }) {
  await connection();
  const { key } = await params;
  const secret = process.env.NAVI_STATS_KEY || "";
  if (!secret || key !== secret) notFound();
  const head = (
    <header className={st.head}>
      <h1>Navi prototype · live test</h1>
      <span style={{ display: "flex", gap: 12, alignItems: "center" }}><LiveRefresh seconds={10} /><ClearData secret={secret} /></span>
    </header>
  );
  if (!storeReady()) return <>{head}<p className={st.warn}>No store connected yet. In Vercel: Storage → Upstash for Redis → Connect to this project, then redeploy.</p></>;

  const evs = await readEvents();
  const { blocked, live, list, n, funnel, feedback, avg, rated, median, screenViews, deadTaps } = summarise(evs);

  return (
    <>
      {head}
      <div className={st.kpis}>
        <div><b>{list.length}</b><span>testers (sessions)</span></div>
        <div><b>{live}</b><span>active in the last 5 min</span></div>
        <div><b>{evs.length}</b><span>events</span></div>
        <div><b>{evs[0] ? ago(evs[0].ts) : "–"}</b><span>last event</span></div>
        <div><b>{list.filter((s) => s.done).length}</b><span>finished the task</span></div>
        <div><b>{median ? `${Math.floor(median / 60)}m ${median % 60}s` : "–"}</b><span>median time to finish</span></div>
        <div><b>{rated ? avg.toFixed(1) : "–"}</b><span>ease rating (1–5), {rated} answers</span></div>
      </div>

      <section className={st.card}>
        <h2>What testers said</h2>
        {feedback.length ? (
          <ul className={st.list}>
            {feedback.slice(0, 40).map((f, i) => (
              <li key={i}><span>{f.comment ? `“${f.comment}”` : <em>No comment</em>} <small>· {ist(f.ts)} · <code>{f.sid}</code></small></span><b>{f.rating ? `${f.rating}/5` : "–"}</b></li>
            ))}
          </ul>
        ) : <p className={st.note}>No answers yet. Testers see one question when they reach a bed.</p>}
      </section>

      <section className={st.card}>
        <h2>Funnel: Meera’s night</h2>
        <ol className={st.funnel}>
          {funnel.map(([label, v]) => (
            <li key={label}>
              <span className={st.fLabel}>{label}</span>
              <span className={st.bar}><span style={{ width: `${Math.round((100 * v) / n)}%` }} /></span>
              <span className={st.fVal}>{v} <small>({Math.round((100 * v) / n)}%)</small></span>
            </li>
          ))}
        </ol>
      </section>

      <div className={st.two}>
        <section className={st.card}>
          <h2>Taps on greyed-out buttons</h2>
          <p className={st.note}>Where testers tried something the network didn’t allow. High counts mean the disabled state isn’t clear.</p>
          {deadTaps.length ? <ul className={st.list}>{deadTaps.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}</ul> : <p className={st.note}>None yet.</p>}
          <h2 style={{ marginTop: 20 }}>Shortcuts the night refused</h2>
          <p className={st.note}>Times a tester claimed success (“We’re in”, “It opened”, “Ramesh is here”) before the scenario allowed it.</p>
          {blocked.length ? <ul className={st.list}>{blocked.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}</ul> : <p className={st.note}>None yet.</p>}
        </section>
        <section className={st.card}>
          <h2>Screen views</h2>
          <ul className={st.list}>{screenViews.map(([k, v]) => <li key={k}><span>{SCREEN_NAMES[k] || k}</span><b>{v}</b></li>)}</ul>
        </section>
      </div>

      <section className={st.card}>
        <h2>Testers</h2>
        <div className={st.scroll}>
          <table className={st.table}>
            <thead><tr><th>Session</th><th>Started (IST)</th><th>Time in test</th><th>Last screen</th><th>Finished</th><th>Taps (greyed)</th><th>Scenarios tried</th><th>Country</th></tr></thead>
            <tbody>
              {list.slice(0, 100).map((s) => (
                <tr key={s.sid}>
                  <td><code>{s.sid}</code></td><td>{ist(s.first)}</td><td>{Math.floor(s.dur / 60)}m {s.dur % 60}s</td>
                  <td>{SCREEN_NAMES[s.lastScreen] || s.lastScreen}</td><td>{s.done ? `${s.done} · ${Math.floor(s.secs / 60)}m ${s.secs % 60}s` : "No"}</td>
                  <td>{s.taps} ({s.dead})</td><td>{[...new Set(s.picks)].join(", ") || "default only"}</td><td>{s.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={st.card}>
        <h2>Live feed</h2>
        <ul className={st.feed}>
          {evs.slice(0, 60).map((e, i) => (
            <li key={i}>
              <span className={st.when}>{ago(e.ts)}</span>
              <code>{e.sid}</code>
              <b>{e.event}</b>
              <span>{[e.label && `“${e.label}”`, e.screen && (SCREEN_NAMES[e.screen] || e.screen), e.pick, e.net, e.battery != null && `${e.battery}%`, e.sim_time].filter(Boolean).join(" · ")}{e.disabled ? " · greyed out" : ""}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function NaviStatsPage({ params }: { params: Promise<{ key: string }> }) {
  return (
    <main className={st.page}>
      <Suspense fallback={null}>
        <Stats params={params} />
      </Suspense>
    </main>
  );
}
