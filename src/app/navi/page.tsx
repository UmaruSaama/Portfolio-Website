import type { Metadata } from "next";
import { NaviCase } from "@/components/cs/navi/NaviCase";

/* Unlisted: not in data/projects.ts, not linked from the home page, not indexed. */
export const metadata: Metadata = {
  title: "Confirmed before you board · Airbnb late-night check-in",
  description: "Navi product design take-home: Airbnb late-night arrivals.",
  robots: { index: false, follow: false },
};

export default function NaviPage() {
  return (
    <main>
      <NaviCase />
    </main>
  );
}
