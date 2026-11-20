"use client";

import { useEffect, useState } from "react";
import type { NaviSummary } from "@/lib/naviSummary";
import cs from "../cs.module.css";
import l from "./live.module.css";

/** Live, aggregate results of the prototype test. Refreshes every 30 s while visible. */
export function LiveResults() {
  const [d, setD] = useState<NaviSummary | null | undefined>(undefined);
  const [at, setAt] = useState("");
  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/nv/summary", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j: NaviSummary | null) => { if (alive) { setD(j); setAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })); } })
        .catch(() => alive && setD(null));
    };
    load();
    const id = setInterval(load, 30_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  if (d === undefined) return <p className={cs.small}>Loading live results…</p>;
  if (!d || d.testers === 0) return <p className={cs.small}>The test is open now. Results appear here as testers finish.</p>;

  const pct = (n: number) => (d.testers ? Math.round((100 * n) / d.testers) : 0);
  const mmss = (s: number) => (s ? `${Math.floor(s / 60)}m ${s % 60}s` : "–");
  return (
    <div className={l.wrap}>
      <div className={l.liveRow}><span className={l.dot} aria-hidden="true" /> Live · {d.testers} tester{d.testers === 1 ? "" : "s"} so far · updated {at}</div>
      <div className={l.kpis}>
        <div><b>{pct(d.finished)}%</b><span>reached a bed by the real path ({d.finished} of {d.testers})</span></div>
        <div><b>{mmss(d.medianSecs)}</b><span>median time to a bed</span></div>
        <div><b>{d.ratings ? `${d.rating}/5` : "–"}</b><span>ease rating{d.ratings ? ` (${d.ratings} answers)` : ""}</span></div>
        <div><b>{d.refused}</b><span>shortcuts the night refused</span></div>
      </div>
      <ol className={l.funnel} aria-label="Where testers got to">
        {d.funnel.map((f) => (
          <li key={f.label}>
            <span className={l.fLabel}>{f.label}</span>
            <span className={l.bar}><span style={{ width: `${Math.max(pct(f.n), 2)}%` }} /></span>
            <span className={l.fVal}>{pct(f.n)}%</span>
          </li>
        ))}
      </ol>
      {d.topRefused.length > 0 && (
        <p className={cs.small}>Most-tried shortcuts: {d.topRefused.map((r) => `“${r.label}” (${r.n})`).join(" · ")}. Each is a tap that claimed success before the scenario allowed it.</p>
      )}
    </div>
  );
}
