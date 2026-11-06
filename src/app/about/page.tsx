import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Shivam",
  description: "Designer by degree, builder by habit, guitarist after dark.",
};

/* Figma: dev ready · "About – v1" (890:36228). Copy drafted from the CV
   and Shivam's own notes; he edits before it is final. */

const now = [
  {
    k: "Designing",
    t: "CCD’s placement portals and app",
    s: "Three portals and a mobile app for 3,200+ students and 450+ recruiters, live all season.",
  },
  {
    k: "Freelancing",
    t: "A fencing company’s website, in Perth",
    s: "Remote contract: 30+ pages, three quote calculators and a design system, handed to one developer.",
  },
  {
    k: "Learning",
    t: "AI as a real design tool, not a trick",
    s: "Context, evaluation and where it fails. This site, the case studies and their Figma files were all built that way.",
  },
];

const principles = [
  { n: "01", t: "Function first.", s: "Decoration has to earn its place. If a detail doesn’t help someone do the thing, it goes." },
  { n: "02", t: "One best version.", s: "Five variants usually mean I haven’t decided yet. I keep the original and the one I’d defend." },
  { n: "03", t: "Evidence over taste.", s: "If I can’t say why, it doesn’t ship. Assumptions get labelled as assumptions." },
];

const record = [
  {
    title: "Work",
    items: [
      ["Stag Fencing, Perth", "Product Designer (contract, remote)", "Jul 2026 – now"],
      ["CCD, IIT Guwahati", "Product Designer (student role)", "Mar 2026 – now"],
      ["Alcheringa ’25 app", "Sole UX/UI designer", "Nov 2024 – Jan 2025"],
    ],
  },
  {
    title: "Roles",
    items: [
      ["Lead Student Coordinator", "Centre for Career Development, IITG", "2025 – now"],
      ["Inter-IIT Cup Mentor", "White Space Design Society", "2025"],
      ["Cultural Secretary", "Dihing Hostel", "2025"],
    ],
  },
  {
    title: "School",
    items: [
      ["B.Des, Department of Design", "Indian Institute of Technology Guwahati", "2023 – now"],
      ["Core team, Creatives", "Alcheringa", "2025"],
    ],
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.face}>
          <Image src="/images/avatar.png" alt="Illustrated portrait of Shivam" width={176} height={176} priority />
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>About me</p>
          <h1 id="about-title" className={styles.h1}>
            Designer by degree.
            <br />
            Builder by habit.
            <br />
            <span className={styles.accent}>Guitarist after dark.</span>
          </h1>
          <p className={styles.lede}>
            I’m Shivam, a fourth-year B.Des student at IIT Guwahati. I design products end to end, from the first
            interview to the last redline, and lately I build them too: this site is Next.js and GSAP, made with
            Claude Code. Outside the file I play lead guitar, paint walls, and build systems for things that probably
            don’t need one.
          </p>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="now-h">
        <h2 id="now-h" className={styles.eyebrow}>
          Right now
        </h2>
        <div className={styles.grid3}>
          {now.map((c) => (
            <article key={c.k} className={styles.card}>
              <p className={styles.kicker}>{c.k}</p>
              <h3 className={styles.cardTitle}>{c.t}</h3>
              <p className={styles.cardBody}>{c.s}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.block} aria-labelledby="off-h">
        <p className={styles.eyebrow}>Off the clock</p>
        <h2 id="off-h" className={styles.h2}>
          The rest of me shows up in the work anyway.
        </h2>
        <div className={styles.bento}>
          <article className={`${styles.card} ${styles.dark} ${styles.music}`}>
            <p className={styles.kicker}>Music</p>
            <h3 className={styles.bigTitle}>Lead guitar, and a soundtrack that made the top 7%.</h3>
            <p className={styles.cardBody}>
              I play lead in the Dihing Manthan band, live for 200+ people. For Brackeys Game Jam 2024.2 I composed the
              game’s soundtrack; it ranked 100 of 1,484 entries. Next up: game OSTs, with Genshin-sized ambition and a
              Cubase-sized budget.
            </p>
          </article>
          <article className={`${styles.card} ${styles.systems}`}>
            <p className={styles.kicker}>Systems</p>
            <h3 className={styles.cardTitle}>I once built a six-axis taxonomy for perfume.</h3>
            <p className={styles.cardBody}>
              Olfactory class, use, climate, season, effect, performance. Assam’s humidity rules out the heavy
              gourmands. It’s a research base, not a collection.
            </p>
          </article>
          <article className={`${styles.card} ${styles.walls}`}>
            <p className={styles.kicker}>Walls</p>
            <h3 className={styles.cardTitle}>Two golds in paint.</h3>
            <p className={styles.cardBody}>
              Graffiti Battle at Manthan ’25 and Art for Wellness at Sahyog ’25, both against 13 hostels.
            </p>
          </article>
          <article className={`${styles.card} ${styles.making}`}>
            <p className={styles.kicker}>Making</p>
            <h3 className={styles.cardTitle}>3D prints, motion and reading.</h3>
            <p className={styles.cardBody}>Mostly about systems: how things fit, and why they break.</p>
          </article>
          <article className={`${styles.card} ${styles.people}`}>
            <p className={styles.kicker}>People</p>
            <h3 className={styles.cardTitle}>The bit with the most stakeholders.</h3>
            <p className={styles.cardBody}>
              Co-led a 150-member outreach team that onboarded 300+ companies for placements. Mentored our Inter-IIT
              design team to 2 Golds and a Bronze. Ran 8+ cultural nights for 350 hostel residents.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="how-h">
        <h2 id="how-h" className={styles.eyebrow}>
          How I work
        </h2>
        <div className={styles.grid3}>
          {principles.map((p) => (
            <article key={p.n} className={styles.principle}>
              <p className={styles.num}>{p.n}</p>
              <h3 className={styles.cardTitle}>{p.t}</h3>
              <p className={styles.cardBody}>{p.s}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.block} aria-labelledby="rec-h">
        <h2 id="rec-h" className={styles.eyebrow}>
          The record
        </h2>
        <div className={styles.grid3}>
          {record.map((col) => (
            <div key={col.title} className={styles.recCol}>
              <h3 className={styles.recTitle}>{col.title}</h3>
              <ul className={styles.recList}>
                {col.items.map(([a, b, c]) => (
                  <li key={a}>
                    <p className={styles.recRole}>{a}</p>
                    <p className={styles.recOrg}>{b}</p>
                    <p className={styles.recDate}>{c}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.hi} aria-labelledby="hi-h">
        <p className={styles.kicker}>Say hi</p>
        <h2 id="hi-h" className={styles.hiTitle}>
          Hiring, collaborating, or want to talk about game soundtracks?
        </h2>
        <div className={styles.actions}>
          <a className={`${styles.pill} ${styles.primary}`} href={site.contact}>
            shivam.bdes@iitg.ac.in
          </a>
          <a className={styles.pill} href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
    </main>
  );
}
