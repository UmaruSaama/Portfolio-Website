/**
 * Tiny Upstash Redis (REST) client for the Navi prototype test analytics.
 * No dependency: it calls the REST API with fetch. Works with the env vars Vercel adds
 * when an Upstash for Redis store is connected to the project (KV_REST_API_* or UPSTASH_REDIS_REST_*).
 */
// Any prefix works: Vercel names these <PREFIX>_REST_API_URL / <PREFIX>_REST_API_TOKEN (KV_ by default).
function envBySuffix(suffix: string, fallback: string) {
  if (process.env[fallback]) return process.env[fallback] as string;
  const k = Object.keys(process.env).find((n) => n.endsWith(suffix) && !n.includes("READ_ONLY"));
  return (k && process.env[k]) || "";
}
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || envBySuffix("_REST_API_URL", "KV_REST_API_URL");
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || envBySuffix("_REST_API_TOKEN", "KV_REST_API_TOKEN");

export const KEY_EVENTS = "navi:events";
export const MAX_EVENTS = 20000;

export const storeReady = () => Boolean(URL_ && TOKEN);

async function pipeline(cmds: (string | number)[][]): Promise<{ result?: unknown; error?: string }[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`store ${res.status}`);
  return res.json();
}

export async function pushEvents(events: object[]) {
  if (!events.length) return;
  await pipeline([["LPUSH", KEY_EVENTS, ...events.map((e) => JSON.stringify(e))], ["LTRIM", KEY_EVENTS, 0, MAX_EVENTS - 1]]);
}

export type NaviEvent = {
  event: string;
  ts: number;
  sid: string;
  t?: number;
  screen?: string;
  scenario?: string;
  net?: string;
  battery?: number;
  sim_time?: string;
  plan?: string;
  label?: string;
  pick?: string;
  how?: string;
  disabled?: boolean;
  country?: string;
  rating?: number;
  comment?: string;
};

/** Newest first. */
export async function readEvents(): Promise<NaviEvent[]> {
  const [r] = await pipeline([["LRANGE", KEY_EVENTS, 0, MAX_EVENTS - 1]]);
  const rows = (r?.result as string[] | undefined) ?? [];
  const out: NaviEvent[] = [];
  for (const s of rows) {
    try { out.push(JSON.parse(s)); } catch { /* skip malformed */ }
  }
  return out;
}
