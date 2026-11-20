import page from "../../CaseStudy.module.css";
import cs from "../cs.module.css";
import { Chapter, ChapterEnd, Fact, Figure, Opener, Quote, SectionHead } from "../Primitives";
import s from "./navi.module.css";
import { HeroVideo } from "../../HeroVideo";
import { Journey } from "./Journey";

/*
  Navi take-home: Airbnb late-night check-in. One page, seven chapters, one per beat
  (Frame, Who, Why, What, Why AI, How + who acts, So what). Built from the working
  files in D:\Placement Task (Navi_*.md). C-numbers are verified claims from the
  research ledger (Research OS, project P13).
*/

const PROTO = "/navi/prototype/index.html";

/* Peer tests: fill in after they run. Empty = the page says plainly that none were run. */
const PEER_TESTS: { who: string; result: string; change: string }[] = [];

function Cite({ c }: { c: string }) {
  return <span className={s.cite}>{c}</span>;
}

function Pill({ tone, children }: { tone: "ok" | "warn" | "bad" | "open"; children: string }) {
  return <span className={`${s.pill} ${s[tone]}`}>{children}</span>;
}

export function NaviCase() {
  return (
    <div className={page.page}>
      {/* ---------------- hero ---------------- */}
      <header className={s.hero}>
        <div className={`${s.heroInner} ${s.heroGrid}`}>
          <div className={s.heroText}>
          <p className={cs.eyebrow}>Navi · product design take-home · option 2 · Airbnb</p>
          <h1 className={s.title}>Confirmed before you board</h1>
          <p className={`${cs.h3} ${s.heroSub}`}>
            Late-night check-in fails at the one hour no one is on duty. So the fix happens earlier,
            while everyone is still awake, and Airbnb stays accountable after.
          </p>
          <div className={s.heroActions}>
            <a className={s.cta} href={PROTO} target="_blank" rel="noopener">Open the prototype</a>
            <a className={s.ctaGhost} href="#chapter-how">See how it works</a>
          </div>
          <div className={s.facts}>
            <Fact label="Role">Product designer, solo</Fact>
            <Fact label="Time">48 hours</Fact>
            <Fact label="Built">Coded prototype, 9 scenarios</Fact>
            <Fact label="Evidence">154 research claims, 1 device test</Fact>
          </div>
          </div>
          <div className={s.heroDemo}>
            <HeroVideo
              className={s.heroVideo}
              src="/navi/media/demo.mp4"
              poster="/navi/media/demo-poster.jpg"
              label="Product demo: Meera at the gate at 1:45 AM, offline at 6%, through to a bed for the night."
            />
            <p className={s.heroCaption}>1:45 AM, offline, 6% battery. Tap the film to pause.</p>
          </div>
        </div>
      </header>

      <div className={page.content}>
        {/* ================= 1 · FRAME ================= */}
        <Chapter id="frame" label="Frame">
          <Opener
            eyebrow="01 · Frame"
            title="Meera wasn’t let down by a lock. She was let down at an hour nobody owns."
            introTitle="The complaint"
            intro={
              <p className={cs.body}>
                Four people outside a gate at 1:45 AM, 6% battery, no data, details buried in email,
                a lock that didn’t work and a host who didn’t pick up. Every piece has an owner in the
                daytime. At 1:45 AM, none of them is awake.
              </p>
            }
          />
          <Quote by="Meera, 22 · the complaint escalated by Airbnb’s guest experience team">
            “Four of us just stood outside in the cold waiting for someone to wake up. Check-in
            shouldn’t fall apart when you arrive late with bad network.”
          </Quote>

          <SectionHead
            label="What the research found"
            title="Airbnb’s promises start after the night is already lost"
            lead={<p className={cs.body}>Desk research, logged as claims and checked by a second pass. 154 claims: 120 supported. Airbnb pages captured 19 Nov 2026, airbnb.co.in.</p>}
          />
          <ul className={s.findings}>
            <li className={cs.cardSmall}>
              <h4 className={cs.h3}>Help comes as a refund, later</h4>
              <p className={cs.small}>A host who fails to give access is covered, but the remedy is a refund or help finding a similar place, and Airbnb “may, but is not obligated to” pay. Report within 72 hours, with evidence. <Cite c="C350 C354 C355" /></p>
            </li>
            <li className={cs.cardSmall}>
              <h4 className={cs.h3}>“A reasonable time” has no number</h4>
              <p className={cs.small}>Guests escalate after the host hasn’t replied “within a reasonable time”. Hosts are expected to reply within 1 hour, in daytime only. <Cite c="C364 C434" /></p>
            </li>
            <li className={cs.cardSmall}>
              <h4 className={cs.h3}>In India the door is often a person</h4>
              <p className={cs.small}>Airbnb’s backup-code feature is US and Canada only. Homestays need a resident family or manager, and society gates run on a guard checking a pre-approval code. <Cite c="C371 C421 C427" /></p>
            </li>
            <li className={cs.cardSmall}>
              <h4 className={cs.h3}>Refunds take up to 15 days</h4>
              <p className={cs.small}>“Issued almost immediately”, but most arrive within 15 days. A group stranded at 2 AM pays for a second bed first. <Cite c="C386" /></p>
            </li>
          </ul>

          <Figure type="Device test" title="Airplane mode on a real phone (Android, a past trip, 20 Nov)">
            <div className={s.figPad}>
              <div className={s.twoCol}>
                <div>
                  <h4 className={cs.h3}>What stayed</h4>
                  <p className={cs.small}>The reservation page opened offline even after a force stop: dates, map pin, guests, “Message your Host”.</p>
                </div>
                <div>
                  <h4 className={cs.h3}>What it said</h4>
                  <p className={cs.small}>A red toast: <span className={cs.strong}>“Error · You’re offline right now”</span> over details that were fine. At 1:45 AM, “Error” reads as “your details are wrong”.</p>
                </div>
              </div>
              <p className={`${cs.small} ${s.note}`}>Limit: a past trip. The address, door code and host number were missing even online, which may only mean Airbnb hides them after checkout. One device, not a sample.</p>
            </div>
          </Figure>

          <SectionHead label="Problem statement" title="When a late arrival goes wrong, the people who could fix it are asleep, the guest’s phone is dying, and Airbnb’s help arrives tomorrow." />
          <ChapterEnd>The question became who can still act, and when.</ChapterEnd>
        </Chapter>

        {/* ================= 2 · WHO ================= */}
        <Chapter id="who" label="Who">
          <Opener
            eyebrow="02 · Who"
            title="Six parties, and only one of them is reliably awake at 1:45 AM: the guest."
            introTitle="Responsibility, availability, accountability"
            intro={
              <p className={cs.body}>
                Three different parties. The host is responsible for access. Someone on site is the
                only one available at night. Airbnb is accountable for the guest ending the night in a
                bed. Most failures come from treating these as one person.
              </p>
            }
          />
          <div className={cs.strip}>
            <table className={s.table}>
              <thead>
                <tr><th>Party</th><th>Has the app?</th><th>At 1:45 AM</th><th>What they own</th></tr>
              </thead>
              <tbody>
                <tr><td className={cs.strong}>Meera, the booker</td><td>Yes</td><td>At the gate, 6%, no data</td><td>Arrival time, the group’s numbers</td></tr>
                <tr><td className={cs.strong}>3 co-guests</td><td>Often not logged in <Cite c="C367" /></td><td>At the gate, phones alive</td><td>Nothing, but they can carry the plan</td></tr>
                <tr><td className={cs.strong}>Host (Rohan)</td><td>Yes</td><td>Asleep; daytime replies only <Cite c="C434" /></td><td>The arrival plan</td></tr>
                <tr><td className={cs.strong}>Person on site (Ramesh, caretaker)</td><td>Usually no</td><td>The only one who can open</td><td>Saying “I’ll be awake”</td></tr>
                <tr><td className={cs.strong}>Society guard</td><td>No</td><td>Awake, follows society rules <Cite c="C427" /></td><td>The gate</td></tr>
                <tr><td className={cs.strong}>Airbnb</td><td>n/a</td><td>Rules engine; people by day</td><td>Making sure the night ends in a bed</td></tr>
              </tbody>
            </table>
          </div>

          <SectionHead
            label="My bets before any research, and what happened to them"
            title="I wrote six bets first, so the research could prove me wrong"
          />
          <ol className={s.forks}>
            <li><Pill tone="open">Open</Pill><div><p className={cs.strong}>The real pain is after midnight, not early morning.</p><p className={cs.small}>No source compares them. A 6 AM arrival is also outside the 3 PM check-in window and needs approval too. <Cite c="C370 C442" /></p></div></li>
            <li><Pill tone="warn">Challenged</Pill><div><p className={cs.strong}>Neither host nor guest is simply to blame.</p><p className={cs.small}>By Airbnb’s rules the deciding question is whether the late arrival was agreed. That became the design’s starting point. <Cite c="C370" /></p></div></li>
            <li><Pill tone="ok">Half confirmed</Pill><div><p className={cs.strong}>The failure is recovery, not finding information.</p><p className={cs.small}>Recovery is the well-supported gap. Information is open: a 2017 offline promise vs today’s “take a screenshot”. <Cite c="C355 C358 C461" /></p></div></li>
            <li><Pill tone="bad">Overturned</Pill><div><p className={cs.strong}>The barrier is a door code.</p><p className={cs.small}>Often it’s a person or a gate layer, not a code. So the design works barrier by barrier. <Cite c="C421 C427" /></p></div></li>
            <li><Pill tone="open">Open</Pill><div><p className={cs.strong}>The primary user is the booker.</p><p className={cs.small}>Co-guests get details only after logging in online. The design treats the group as the user. <Cite c="C362 C367" /></p></div></li>
            <li><Pill tone="ok">Confirmed</Pill><div><p className={cs.strong}>The host side is in scope.</p><p className={cs.small}>But recovery must never depend on the host replying at night. <Cite c="C436" /></p></div></li>
          </ol>
          <ChapterEnd>So the design needed a way to measure “ended the night in a bed”.</ChapterEnd>
        </Chapter>

        {/* ================= 3 · WHY ================= */}
        <Chapter id="why" label="Why">
          <Opener
            eyebrow="03 · Why · goal and metric"
            title="One metric: how late arrivals end, measured for every arrival between 22:00 and 08:00."
            introTitle="Goal"
            intro={<p className={cs.body}>Guest: get into a bed tonight without needing anyone to wake up. Business: keep late-arrival bookings, and keep hosts accepting them, without paying guests to claim.</p>}
          />
          <div className={s.metricGrid}>
            <div className={cs.card}>
              <p className={cs.eyebrow}>Outcome 1</p>
              <h4 className={cs.h3}>In at the listing</h4>
              <p className={cs.small}>Minutes from the first sign the group is there (location, “What’s stopping you?”, HELP) to “all 4 in”. Median and 90th percentile.</p>
            </div>
            <div className={cs.card}>
              <p className={cs.eyebrow}>Outcome 2</p>
              <h4 className={cs.h3}>Changed before boarding</h4>
              <p className={cs.small}>Cancelled or switched because no one confirmed. Its own outcome, never counted as “0 minutes”.</p>
            </div>
            <div className={cs.card}>
              <p className={cs.eyebrow}>Outcome 3</p>
              <h4 className={cs.h3}>Moved to another bed</h4>
              <p className={cs.small}>Minutes from arrival to a confirmed alternative bed. A night with no stop event counts as a failure.</p>
            </div>
          </div>

          <SectionHead label="Guardrails" title="What must not get worse" />
          <ul className={s.guards}>
            <li><span className={cs.strong}>Fraud:</span> a random audit of 1 in 10 claims, plus flags for claims at exactly minute 30, receipts near the cap and repeat claims. Disputes alone measure host behaviour, not fraud.</li>
            <li><span className={cs.strong}>Supply:</span> the named person’s confirmation rate and hosts’ late-arrival acceptance. Hosts leave through silence, not by saying No.</li>
            <li><span className={cs.strong}>Host burden:</span> night contacts per host per late arrival. <Cite c="C434" /></li>
            <li><span className={cs.strong}>False alarms:</span> “not confirmed” trips where the group went ahead and got in fine.</li>
            <li><span className={cs.strong}>Undeclared late arrivals:</span> if this rises, guests are skipping the plan.</li>
          </ul>

          <Figure type="Economics" title="Cost per 1,000 late arrivals (no baseline exists, so every figure is a hypothesis)">
            <div className={cs.strip}>
              <table className={s.table}>
                <thead><tr><th>Configuration</th><th>Cost to Airbnb</th><th>Read</th></tr></thead>
                <tbody>
                  <tr><td className={cs.strong}>Prevention only (confirm, SMS pack, wake-up call)</td><td>₹5k–50k</td><td>Avoiding 2–15 failed nights pays for it</td></tr>
                  <tr><td className={cs.strong}>Guarantee paid on top of the refund</td><td>₹90k–235k</td><td>Rejected: pays guests to claim</td></tr>
                  <tr><td className={cs.strong}>Guarantee as a substitute for the night</td><td>₹15k–85k</td><td>Chosen</td></tr>
                  <tr><td className={cs.strong}>+ late bus: Airbnb moves the night</td><td>+₹7.5k–30k</td><td>Assumption: 0.5–2% of late arrivals</td></tr>
                </tbody>
              </table>
            </div>
          </Figure>
          <ChapterEnd>Then the question was which kind of solution moves that number.</ChapterEnd>
        </Chapter>

        {/* ================= 4 · WHAT ================= */}
        <Chapter id="what" label="What">
          <Opener
            eyebrow="04 · What · the options"
            title="Four different bets. I combined two, kept a third as a backstop, and killed one."
            introTitle="My first direction"
            intro={<p className={cs.body}>“No one owns 1:45 AM, so the booking does”: an arrival agreement made in the evening. Then I tested it against four alternatives that disagreed with it at the level of the bet, not the UI.</p>}
          />
          <div className={s.options}>
            <div className={`${cs.card} ${s.option}`}><Pill tone="ok">Kept, moved earlier</Pill><h4 className={cs.h3}>A · Escalate on silence, not on failure</h4><p className={cs.small}>Ask before arrival who will open. Silence is a signal hours before the gate.</p><p className={cs.small}><span className={cs.strong}>Changed:</span> the deadline moved from evening to boarding time, the last moment the guest is reliably online.</p></div>
            <div className={`${cs.card} ${s.option}`}><Pill tone="ok">Kept</Pill><h4 className={cs.h3}>B · Unlock by barrier, not by contact</h4><p className={cs.small}>A kit for each barrier (gate, door, no one here) that works offline. Survives every call outcome.</p></div>
            <div className={`${cs.card} ${s.option}`}><Pill tone="warn">Backstop</Pill><h4 className={cs.h3}>C · Money by rule, no person at night</h4><p className={cs.small}>A pre-agreed payout when a confirmed plan fails. Kept, but reshaped after a stress test (chapter 6).</p></div>
            <div className={`${cs.card} ${s.option}`}><Pill tone="open">Folded in</Pill><h4 className={cs.h3}>D · Any phone, one number</h4><p className={cs.small}>Work outside the app. Became the SMS pack to the whole group, not a separate channel.</p></div>
          </div>
          <SectionHead label="What I said no to" title="Killed ideas, and why" />
          <ul className={s.killed}>
            <li><span className={cs.strong}>“Airbnb takes over” at night.</span> Needs a person answering at 2 AM. Nothing in the research shows that exists today <Cite c="C359 C363" />, and the brief rules out unrealistic operations.</li>
            <li><span className={cs.strong}>A backup-person feature.</span> The real gap was one line of SMS text, not a feature. It also broke my own rule on sharing codes.</li>
            <li><span className={cs.strong}>“Text PIN to get the door code”.</span> Anyone can spoof a number. No code is ever sent on request.</li>
            <li><span className={cs.strong}>“Reply BOOK” and Airbnb books a hotel by SMS.</span> It turns SMS into a spending trigger, and nobody knows if rooms exist at 2 AM. Kept as a next step.</li>
          </ul>
          <ChapterEnd>None of these needed AI, which was a decision too.</ChapterEnd>
        </Chapter>

        {/* ================= 5 · WHY AI ================= */}
        <Chapter id="why-ai" label="Why AI">
          <Opener
            eyebrow="05 · Why AI?"
            title="Not here. At 1:45 AM the system has to be predictable, cheap and work over plain SMS."
            introTitle="Why not"
            intro={
              <p className={cs.body}>
                Every decision at night is a rule: was the plan confirmed, did 30 minutes pass, is it inside
                the caretaker’s hours. A rule can be disputed fairly the next morning; a model’s judgement
                can’t. And Meera has no data, so anything that needs a server conversation is out.
              </p>
            }
          />
          <div className={s.twoCol}>
            <div className={cs.cardSmall + " " + s.pad}>
              <h4 className={cs.h3}>Where AI would make sense later</h4>
              <p className={cs.small}>By day: reviewing flagged claims, and suggesting which 24h stays to save into the plan. Never as the thing that decides at the gate.</p>
            </div>
            <div className={cs.cardSmall + " " + s.pad}>
              <h4 className={cs.h3}>How I used AI to make this</h4>
              <p className={cs.small}>Research agents with a claim ledger, critique and stress-test agents, the coded prototype, placeholder photos and a synthetic voice. Every bet, choice and trade-off on this page is mine.</p>
            </div>
          </div>
        </Chapter>

        {/* ================= 6 · HOW + WHO ACTS ================= */}
        <Chapter id="how" label="How and who acts">
          <Opener
            eyebrow="06 · How + who acts"
            title="One arrival plan, used at four moments."
            introTitle="The chain"
            intro={<p className={cs.body}>The host’s late-arrival approval names who opens the door. That person confirms before the guest boards. The plan travels offline to the whole group. At the door it works barrier by barrier. If a confirmed plan fails, the money moves by rule.</p>}
          />
          <ol className={s.chain}>
            <li><span className={s.step}>1</span><h4 className={cs.h3}>Confirmed before you board</h4><p className={cs.small}>Approving a 01:45 arrival means naming who opens. Ramesh confirms from an SMS link, no app, in his language. Nothing by boarding? Meera decides at the station, with signal: switch to a 24h stay, go ahead, or cancel.</p></li>
            <li><span className={s.step}>2</span><h4 className={cs.h3}>Carried offline</h4><p className={cs.small}>Saved on the phone, labelled “Saved 9:12 PM”, not “Error”. Sent by SMS to every co-guest number Meera confirmed after it replied YES. The PIN goes only if the host opts in.</p></li>
            <li><span className={s.step}>3</span><h4 className={cs.h3}>“What’s stopping you?”</h4><p className={cs.small}>Gate: a full-screen card for the guard, with the host’s line in the guard’s language and a request in Hindi to ring G2. Door: the host’s steps for that lock. No one here: ring G2, then a 30-minute clock that runs on the phone even offline.</p></li>
            <li><span className={s.step}>4</span><h4 className={cs.h3}>The money moves by rule</h4><p className={cs.small}>Every failed night ends at a named place, with what you pay now and when money comes back. No person needed at 2 AM.</p></li>
          </ol>

          <Journey />

          <Figure type="Prototype" title="Live prototype · pick a scenario on the left, then use the phone">
            <div className={s.protoWrap}>
              <iframe className={s.proto} src={PROTO} title="Confirmed before you board: interactive prototype" loading="lazy" />
            </div>
            <p className={`${cs.small} ${s.protoNote}`}>
              <a className={s.link} href={PROTO} target="_blank" rel="noopener">Open full screen ↗</a> · Coded, not Figma: the conditions (signal, battery, time) are real states, not pictures. Photos are AI placeholders; Rohan’s Assamese note is a synthetic sample voice.
            </p>
          </Figure>

          <Figure type="Audio" title="Rohan’s voice note for the guard · Assamese · plays offline">
            <div className={s.figPad}>
              <audio controls preload="none" src="/navi/prototype/assets/audio/rohan_note_as.mp3" className={s.audio} />
              <p className={cs.small}>Meera can’t read Assamese and the guard can’t read English. The host records 10 seconds once; it works at any gate, any night. (Synthetic sample voice for the prototype.)</p>
            </div>
          </Figure>

          <SectionHead label="Money, by fault" title="Two layers, so a guest never pays twice and nobody profits from claiming" />
          <div className={cs.strip}>
            <table className={s.table}>
              <thead><tr><th>Layer</th><th>Who gets it</th><th>Who pays</th><th>How fast</th></tr></thead>
              <tbody>
                <tr><td className={cs.strong}>1 · Your night moves with you (₹1,500)</td><td>Anyone who rang G2, waited 30 min and wasn’t let in. Confirmed or not.</td><td>Host’s payout when the host owns access <Cite c="C350 C393" />. Airbnb for a late bus nobody chose.</td><td>Credit now. Paid at a desk: back by 6 PM next day*</td></tr>
                <tr><td className={cs.strong}>2 · Covered tonight (top-up to ₹3,000)</td><td>Only when a confirmed Yes failed, inside the caretaker’s hours. A Yes counts if it comes before the group rings, even after boarding.</td><td>Airbnb pays the gap</td><td>Applied at booking, or against the receipt</td></tr>
              </tbody>
            </table>
          </div>
          <p className={`${cs.small} ${s.note}`}>*Proposed policy. Today most refunds take up to 15 days <Cite c="C386" />. The cap, the 30 minutes and every timer are hypotheses for a pilot.</p>

          <SectionHead label="Who acts" title="Every step has an owner, a timeout and a fallback" />
          <div className={cs.strip}>
            <table className={`${s.table} ${s.tableSmall}`}>
              <thead><tr><th>Step</th><th>Actor</th><th>Timeout</th><th>If nothing happens</th><th>Abuse it invites → control</th></tr></thead>
              <tbody>
                <tr><td>Host approves late arrival + names who opens</td><td>Host</td><td>24h before</td><td>Guest gets a free change, recorded as host-caused (no fee in the pilot)</td><td>Host names someone absent → the Yes carries the cost</td></tr>
                <tr><td>Named person confirms</td><td>Ramesh (no account)</td><td>Boarding −1h</td><td>Meera decides at the station</td><td>Host taps Yes for him → host carries it</td></tr>
                <tr><td>Plan to the group</td><td>Rules engine</td><td>Re-sent on any change</td><td>Saved on Meera’s phone</td><td>Wrong number → YES opt-in + Meera confirms each number</td></tr>
                <tr><td>Wake-up call</td><td>Rules engine → Ramesh</td><td>5 min</td><td>Host called, group told by SMS on the bus</td><td>Low; costs telephony</td></tr>
                <tr><td>Bus late past his hours</td><td>Rules engine → Ramesh</td><td>Before “awake until”</td><td>Group told on the bus; Airbnb moves the night</td><td>Fake delay → declared earlier, location in transit, once a year</td></tr>
                <tr><td>No one opens</td><td>Group</td><td>30 min from ringing</td><td>Night moves; top-up if confirmed</td><td>Staged claim → bell statement first, masked-line logs, 1-in-10 audit</td></tr>
                <tr><td>Morning check</td><td>Airbnb, by day</td><td>72h dispute <Cite c="C354" /></td><td>Guest’s money doesn’t wait on the host</td><td>Inflated receipt → total cap</td></tr>
              </tbody>
            </table>
          </div>
          <ChapterEnd>Then I tried to break it.</ChapterEnd>
        </Chapter>

        {/* ================= 7 · SO WHAT ================= */}
        <Chapter id="so-what" label="So what">
          <Opener
            eyebrow="07 · So what"
            title="I stress-tested it before anyone could use it. The first guarantee failed, and that changed the design."
            introTitle="What the stress test broke"
            intro={<p className={cs.body}>Three independent passes: a red team (6 adversaries, about 25 attacks), ten worst-case nights walked minute by minute, and the economics at scale. The original guarantee paid the night back <em>and</em> ₹3,000. It paid guests to claim, was easy to stage, and silent hosts never triggered it.</p>}
          />
          <div className={s.changes}>
            <div className={cs.cardSmall + " " + s.pad}><p className={cs.eyebrow}>Before</p><p className={cs.small}>Refund + up to ₹3,000 on top, receipt next morning, 15-day wait.</p></div>
            <span className={s.arrow} aria-hidden="true">→</span>
            <div className={cs.cardSmall + " " + s.pad}><p className={cs.eyebrow}>After</p><p className={cs.small}>The guarantee replaces the night, up to ₹3,000 in total, credit now, claim window, bell question first, only the guest can stop the clock.</p></div>
          </div>

          <SectionHead label="Where every night ends" title="No path ends with “you’re on your own”" />
          <div className={s.endings}>
            <div className={cs.card + " " + s.pad}><h4 className={cs.h3}>In the flat</h4><p className={cs.small}>PIN works · guard lets them in · lock fixed with a cable · switched to a 24h stay at boarding</p></div>
            <div className={cs.card + " " + s.pad}><h4 className={cs.h3}>In a bed, paid by rule</h4><p className={cs.small}>Confirmed and no one opens · late bus · not confirmed and no one opens: the night moves; walk 10 min to Orchid Inn</p></div>
            <div className={cs.card + " " + s.pad}><h4 className={cs.h3}>Honest limits</h4><p className={cs.small}>No working phone in the group · nobody can open and no self-entry · no affordable bed nearby · a lawful society ban · what happened at the gate can’t be proven</p></div>
          </div>

          <SectionHead label="Validation" title="What was tested, and what wasn’t" />
          <ul className={s.guards}>
            <li><span className={cs.strong}>Tested:</span> 1 device test in airplane mode (Android, a past trip). 3 independent critique passes and a 3-part stress test, each of which changed the design.</li>
            {PEER_TESTS.length > 0 ? (
              PEER_TESTS.map((t) => (
                <li key={t.who}><span className={cs.strong}>Peer test · {t.who}:</span> {t.result} <span className={cs.strong}>Changed:</span> {t.change}</li>
              ))
            ) : (
              <li><span className={cs.strong}>Not yet:</span> peer tests of the prototype.</li>
            )}
            <li><span className={cs.strong}>Not validated:</span> no user interviews before the solution was locked; the guest-behaviour evidence is Western forum posts, not Indian guests. No real 2 AM, no real caretaker, no live support test.</li>
          </ul>

          <SectionHead label="First pilot" title="What I’d measure first, in one city" />
          <ul className={s.guards}>
            <li>Do hosts approve late arrivals <em>with</em> a named person, or start declining? (the fee stays switched off unless fewer than ~70% approve with a plan)</li>
            <li>Do caretakers confirm from an SMS link, and in which language?</li>
            <li>Is there a bed under ₹3,000 within 15 minutes at 2 AM? If not, the money layer becomes money only, and I’d say so.</li>
          </ul>
          <ChapterEnd>The bet: fix the night before it starts, and when it still fails, send a destination and the money, not a promise.</ChapterEnd>
        </Chapter>
      </div>
    </div>
  );
}
