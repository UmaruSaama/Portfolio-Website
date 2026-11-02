"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Case-study pages are full-bleed and carry their own back control. */
export function HeaderGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/work/") ? null : children;
}
