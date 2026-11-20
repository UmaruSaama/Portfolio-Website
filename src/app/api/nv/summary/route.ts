import { connection } from "next/server";
import { readEvents, storeReady } from "@/lib/naviStore";
import { summarise } from "@/lib/naviSummary";

/* Public aggregate numbers for the case study's live-results section. No personal or per-session data. */
export async function GET() {
  await connection();
  if (!storeReady()) return Response.json(null, { headers: { "Cache-Control": "no-store" } });
  try {
    const s = summarise(await readEvents());
    return Response.json(s, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
  } catch {
    return Response.json(null, { status: 502 });
  }
}
