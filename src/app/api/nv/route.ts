import { clearEvents, pushEvents, storeReady } from "@/lib/naviStore";

/*
  Collector for the Navi prototype's test events (sent with navigator.sendBeacon from
  /navi/prototype). Anonymous: no IP is stored, only the country Vercel derives from it.
  Whitelisted fields, short strings, small batches, so junk can't grow the store much.
*/
const EVENTS = new Set(["open", "intro_open", "intro_close", "screen_view", "tap", "scenario_pick", "harness", "harness_open", "leave", "task_complete", "feedback", "thanks_close", "blocked"]);
const STR = ["event", "sid", "screen", "scenario", "net", "sim_time", "plan", "label", "pick", "how"] as const;

function clean(raw: unknown, country: string) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.event !== "string" || !EVENTS.has(r.event)) return null;
  if (typeof r.sid !== "string" || !/^[a-z0-9]{4,16}$/.test(r.sid)) return null;
  const e: Record<string, unknown> = { ts: Date.now(), country };
  for (const k of STR) if (typeof r[k] === "string") e[k] = (r[k] as string).slice(0, 80);
  if (typeof r.t === "number" && r.t >= 0 && r.t < 86400) e.t = Math.round(r.t);
  if (typeof r.battery === "number") e.battery = Math.round(r.battery);
  if (typeof r.disabled === "boolean") e.disabled = r.disabled;
  if (typeof r.rating === "number" && r.rating >= 1 && r.rating <= 5) e.rating = Math.round(r.rating);
  if (typeof r.comment === "string" && r.comment.trim()) e.comment = r.comment.trim().slice(0, 280);
  return e;
}

export async function POST(req: Request) {
  if (!storeReady()) return new Response(null, { status: 204 });
  const text = await req.text();
  if (text.length > 16_000) return new Response(null, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return new Response(null, { status: 400 }); }
  const country = req.headers.get("x-vercel-ip-country") || "";
  const list = (Array.isArray(body) ? body : [body]).slice(0, 50).map((x) => clean(x, country)).filter(Boolean) as object[];
  try { await pushEvents(list); } catch { return new Response(null, { status: 502 }); }
  return new Response(null, { status: 204 });
}

/** Owner only: wipe all test events. Needs the stats secret in the x-navi-key header. */
export async function DELETE(req: Request) {
  const secret = process.env.NAVI_STATS_KEY || "";
  if (!secret || req.headers.get("x-navi-key") !== secret) return new Response(null, { status: 404 });
  if (!storeReady()) return new Response(null, { status: 204 });
  try { await clearEvents(); } catch { return new Response(null, { status: 502 }); }
  return new Response(null, { status: 204 });
}
