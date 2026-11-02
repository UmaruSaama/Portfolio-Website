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
        const active = !item.external && pathname === item.href;
        const className = `${styles.navLink} ${active ? styles.navActive : ""}`;

        return item.external ? (
          <a
            key={item.label}
            href={item.href}
            className={className}
            {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {item.label}
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
