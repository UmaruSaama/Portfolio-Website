import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.intro}>
        <span className={styles.avatar}>
          <Image src="/images/avatar.png" alt="" width={44} height={44} priority />
        </span>
        <span className={styles.introText}>
          <span className={styles.hello}>
            Hey, I&rsquo;m {site.name} <span aria-hidden="true">👋</span>
          </span>
          <span className={styles.tagline}>
            {site.tagline}
            <span className={styles.period}>.</span>
          </span>
        </span>
      </Link>

      <NavLinks />

      <p className={styles.credit}>
        Developed with <span className={styles.claude}>Claude Code</span>.
      </p>
    </header>
  );
}
