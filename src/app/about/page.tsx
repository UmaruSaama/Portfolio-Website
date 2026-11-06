import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Shivam",
  description: "More interests than I know what to do with.",
};

/* Figma: dev ready · "About – v2" (894:36228). Copy is Shivam's own. */
export default function AboutPage() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>About</p>
        <h1 className={styles.h1}>More interests than I know what to do with.</h1>
      </header>

      <section className={styles.bio} aria-label="About Shivam">
        <div className={styles.portrait}>
          <Image
            src="/images/about-portrait.webp"
            alt="Portrait of Shivam"
            width={640}
            height={800}
            sizes="(max-width: 700px) 60vw, 300px"
            priority
          />
        </div>
        <div className={styles.prose}>
          <p>
            I play guitar, listen to a lot of music (especially game soundtracks), read, learn languages, and enjoy
            making things simply for the satisfaction of bringing an idea to life.
          </p>
          <p>
            I often find myself exploring things beyond their surface, whether it’s understanding how a piece of music
            comes together, organising my rather extensive perfume collection, or figuring out how something works. I
            enjoy moving between different interests and finding new things to learn along the way.
          </p>
          <p>
            There’s still a long list of things I’d like to try. Cooking is high on that list. I like having something
            to look forward to: learning, making, or getting a little better at.
          </p>
        </div>
      </section>

      <section className={styles.contact} aria-labelledby="hi-h">
        <h2 id="hi-h" className={styles.eyebrow}>
          Say hi
        </h2>
        <a className={styles.email} href={site.contact}>
          shivam.bdes@iitg.ac.in <span aria-hidden="true">↗</span>
        </a>
        <a className={styles.link} href={site.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <span aria-hidden="true">↗</span>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </section>
    </main>
  );
}
