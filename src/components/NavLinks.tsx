"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/site";
import styles from "./SiteHeader.module.css";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Main">
      {nav.map((item) => {
        const active =
          !item.external &&
          (item.href === "/" ? pathname === "/" || pathname.startsWith("/work") : pathname === item.href);
        const opensNewTab = item.external && item.href.startsWith("http");
        const className = `${styles.navLink} ${active ? styles.navActive : ""}`;

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
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
