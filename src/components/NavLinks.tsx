"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/data/site";
import { Sheet } from "./Sheet";
import action from "./Action.module.css";
import styles from "./SiteHeader.module.css";

/**
 * Main nav. On phones the row is replaced by a Menu action that opens a
 * bottom sheet with the same links (the row is display:none there, so it is
 * out of the tab order too).
 */
export function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (inSheet: boolean) =>
    nav.map((item) => {
      const active =
        !item.external &&
        (item.href === "/"
          ? pathname === "/" || pathname.startsWith("/work")
          : pathname === item.href);
      const opensNewTab = item.external && item.href.startsWith("http");
      const className = `${inSheet ? styles.sheetLink : styles.navLink} ${active ? styles.navActive : ""}`;

      if (item.soon)
        return (
          <span key={item.label} className={`${className} ${styles.navSoon}`} aria-disabled="true">
            {item.label}
            <span className={styles.soonTag}>Soon</span>
          </span>
        );

      return item.external ? (
        <a
          key={item.label}
          href={item.href}
          className={className}
          {...(opensNewTab ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {item.label}
          {opensNewTab && (
            <>
              <span aria-hidden="true" className={styles.ext}>
                ↗
              </span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </>
          )}
        </a>
      ) : (
        <Link
          key={item.label}
          href={item.href}
          className={className}
          aria-current={active ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      <nav className={styles.nav} aria-label="Main">
        {links(false)}
      </nav>
      <button
        type="button"
        className={`${action.action} ${styles.menuButton}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={action.disc} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M2 5h14M2 9h14M2 13h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className={styles.menuLabel}>Menu</span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu">
        <nav className={styles.sheetNav} aria-label="Main">
          {links(true)}
        </nav>
      </Sheet>
    </>
  );
}
