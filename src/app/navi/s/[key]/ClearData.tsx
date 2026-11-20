"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Owner-only reset before a test round: deletes every stored event after a confirm. */
export function ClearData({ secret }: { secret: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const clear = async () => {
    if (!window.confirm("Delete ALL test data (every session, tap and answer)? This can't be undone.")) return;
    setBusy(true);
    const res = await fetch("/api/nv", { method: "DELETE", headers: { "x-navi-key": secret } });
    setBusy(false);
    if (res.ok) router.refresh(); else window.alert("Couldn't clear the data (" + res.status + ").");
  };
  return (
    <button onClick={clear} disabled={busy} style={{ border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#ff9db1", borderRadius: 999, padding: "8px 14px", font: "inherit", fontSize: 13, cursor: "pointer" }}>
      {busy ? "Clearing…" : "Clear all test data"}
    </button>
  );
}
