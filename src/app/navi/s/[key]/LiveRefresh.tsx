"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Re-fetches the server-rendered stats every few seconds while the tab is visible. */
export function LiveRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  const [at, setAt] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      router.refresh();
      setAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    const id = setInterval(tick, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return <span style={{ fontSize: 13, opacity: 0.6 }}>Live · refreshes every {seconds}s{at ? ` · last ${at}` : ""}</span>;
}
