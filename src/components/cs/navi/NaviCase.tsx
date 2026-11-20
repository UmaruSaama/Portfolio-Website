import type { ReactNode } from "react";
import page from "../../CaseStudy.module.css";
import cs from "../cs.module.css";
import { Chapter, ChapterEnd, Fact, Figure, Opener, Quote, SectionHead } from "../Primitives";
import { AppendixPanel } from "../AppendixPanel";
import { ChapterRail } from "../../ChapterRail";
import { HeroVideo } from "../../HeroVideo";
import { Journey } from "./Journey";
import { LiveResults } from "./LiveResults";
import { NaviAppendix, naviAppendixSections } from "./NaviAppendix";
import { Pointer, Pointers } from "./Pointer";
import { ProtoEmbed } from "./ProtoEmbed";
import { RTable } from "./RTable";
import s from "./navi.module.css";

/*
  Navi take-home: Airbnb late-night check-in. Seven chapters, one per beat
  (Frame, Who, Why, What, Why AI, How + who acts, So what), each with a headline claim,
  a one-line takeaway and a bridge, so the headlines alone carry the argument.
  Copy: D:\Placement Task\Navi_CaseStudy_Copy_v2.md · appendix: Navi_Appendix_v2.md.
  C-numbers are verified claims from the research log (appendix A).
*/

const PROTO = "/navi/prototype/index.html";

/* Rail numbers match the chapter eyebrows (01 Frame … 07 So what); the intro is 00. */
const RAIL = [
  { id: "intro", label: "Intro", num: "00" },
  { id: "frame", label: "Frame" },
  { id: "who", label: "Who" },
  { id: "why", label: "Why" },
  { id: "what", label: "What" },
  { id: "why-ai", label: "Why AI?" },
  { id: "how", label: "How" },
  { id: "so-what", label: "So what" },
].map((c, i) => ({ ...c, num: c.num ?? String(i).padStart(2, "0") }));

function Cite({ c }: { c: string }) {
  return <span className={s.cite}>{c}</span>;
}

function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className={s.callout}>
      {title && <h4 className={cs.h3}>{title}</h4>}
      <div className={cs.body}>{children}</div>
    </div>
  );
}

export function NaviCase() {
  return (
    <div className={page.page}>
      {/* ---------------- hero ---------------- */}
      <header className={s.hero} id="chapter-intro">
        <div className={`${s.heroInner} ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className={cs.eyebrow}>Navi · product design take-home · option 2 · Airbnb</p>
            <h1 className={s.title}>Confirmed before you board</h1>
            <p className={`${cs.h3} ${s.heroSub}`}>
              Late-night check-in fails at the hour nobody is on duty, so I moved the fix to before boarding,
              while everyone is awake, and made the money move by rule when it still fails.
            </p>
            <div className={s.heroActions}>
              <a className={s.cta} href={PROTO} target="_blank" rel="noopener">Open the prototype</a>
              <a className={s.ctaGhost} href="#chapter-how">See how it works</a>
            </div>
            <div className={s.facts}>
              <Fact label="Role">Product designer, solo</Fact>
              <Fact label="Time">48 hours</Fact>
              <Fact label="Built">Coded prototype, 9 scenarios</Fact>
              <Fact label="Evidence">154 logged research claims · 1 device test · a live test running now</Fact>
            </div>
            <p className={s.fine}>Photos and the voice note are placeholders. <Pointer id="j" label="Tools and disclosures" /></p>
          </div>
          <div className={s.heroDemo}>
            <HeroVideo
              className={s.heroVideo}
              src="/navi/media/demo.mp4"
              poster="/navi/media/demo-poster.jpg"
              label="Product demo: Meera at the gate at 1:45 AM, offline at 6%, through to a bed for the night."
            />
            <p className={s.heroCaption}>1:45 AM, no data, 6% battery. Tap the film to pause.</p>
          </div>
        </div>
      </header>

      <div className={page.content}>
        {/* reading guide */}
        <nav className={s.guide} aria-label="How to read this">
          <div><b>5-minute read</b><span>The headlines and last lines tell the whole story.</span></div>
          <div><b>Rather try it?</b><span>Open the prototype and get Meera’s group of 4 into a bed.</span></div>
          <div><b>Want the proof?</b><span>Follow the appendix links in each chapter.</span></div>
        </nav>

        {/* ================= 1 · FRAME ================= */}
        <Chapter id="frame" label="Frame">
          <Opener
            eyebrow="01 · Frame"
            title="Meera wasn’t let down by a lock. She was let down at an hour nobody owns."
            introTitle="At 1:45 AM, everyone who could help is asleep, and Airbnb’s help comes tomorrow."
            intro={<p className={cs.body}>The lock, the details and the host all have owners by day; at 1:45 AM, none of them is awake. I went deep on this one flow, from the host’s approval to the morning after.</p>}
          />
          <Quote by="Meera, 22 · the complaint Airbnb’s guest experience team escalated">
            “Four of us just stood outside in the cold waiting for someone to wake up. Check-in
            shouldn’t fall apart when you arrive late with bad network.”
          </Quote>

          <SectionHead label="What the research found" title="Airbnb’s promises start after the night is lost" />
          <ul className={s.cards3}>
            <li className={cs.cardSmall}><h4 className={cs.h3}>Help comes later, as money</h4><p className={cs.small}>A refund or a similar place, which Airbnb “may, but is not obligated to” pay for. Most refunds arrive within 15 days. <Cite c="C350 C355 C386" /></p></li>
            <li className={cs.cardSmall}><h4 className={cs.h3}>There’s no clock at the door</h4><p className={cs.small}>Guests escalate after “a reasonable time”, with no number. Hosts reply within 1 hour, daytime only. <Cite c="C364 C434" /></p></li>
            <li className={cs.cardSmall}><h4 className={cs.h3}>In India, the door is often a person</h4><p className={cs.small}>Backup codes are US and Canada only. Homestays need a resident family; society gates run on a guard. <Cite c="C371 C421 C427" /></p></li>
          </ul>
          <Callout title="Device test">
            On a real phone in airplane mode (one past trip), the booking opened under a red <span className={cs.strong}>“Error · You’re offline right now”</span>. At 1:45 AM, that reads as “your details are wrong”. Upcoming trips are untested.
          </Callout>
          <Pointers items={[["a", "Research ledger"]]} />
          <ChapterEnd>So the question became: who can still act at 1:45 AM, and when?</ChapterEnd>
        </Chapter>

        {/* ================= 2 · WHO ================= */}
        <Chapter id="who" label="Who">
          <Opener
            eyebrow="02 · Who"
            title="Six parties are involved. At 1:45 AM the only ones awake are the guests, and a guard who can’t let them in."
            introTitle="The design has to connect people who are never awake at the same time."
            intro={<p className={cs.body}>The host is responsible, someone on site is available, Airbnb is accountable. I kept the three apart on purpose: each has a different job, at a different hour.</p>}
          />
          <RTable
            caption="Who can act at 1:45 AM"
            head={["Party", "Has the app?", "At 1:45 AM", "Owns"]}
            rows={[
              ["Meera, the booker", "Yes", "At the gate, 6%, no data", "Arrival time, the group’s numbers"],
              ["3 co-guests", <>Only if invited and logged in <Cite c="C367" /></>, "At the gate, phones alive", "Can carry the plan"],
              ["Rohan, the host", "Yes", <>Asleep; daytime replies only <Cite c="C434" /></>, "The arrival plan"],
              ["Ramesh, the caretaker", <>Usually no <Cite c="C482" /></>, "The only one who can open", "“I’ll be awake”"],
              ["Society guard", "No", <>Awake; society rules <Cite c="C427" /></>, "The gate"],
              ["Airbnb", "n/a", "Rules at night, people by day", "The night ending in a bed"],
            ]}
          />
          <SectionHead label="My bets, written before any research" title="I wrote six bets first. Three changed the design." />
          <ul className={s.cards3}>
            <li className={cs.cardSmall}><span className={`${s.pill} ${s.bad}`}>Overturned</span><h4 className={cs.h3}>I was wrong about the code</h4><p className={cs.small}>The barrier is often a person or a gate, not a code <Cite c="C421 C427" />. So I designed barrier by barrier.</p></li>
            <li className={cs.cardSmall}><span className={`${s.pill} ${s.warn}`}>Challenged</span><h4 className={cs.h3}>Blame turns on one question</h4><p className={cs.small}>A late arrival needs the host’s approval <Cite c="C370" />, so “was it agreed?” became my starting point.</p></li>
            <li className={cs.cardSmall}><span className={`${s.pill} ${s.open}`}>Open</span><h4 className={cs.h3}>The user is the group, not the booker</h4><p className={cs.small}>Co-guests see details only after logging in <Cite c="C362 C367" />, so the plan goes to every phone.</p></li>
          </ul>
          <Pointers items={[["b", "All six bets and their outcomes"]]} />
          <ChapterEnd>Then I needed one number that says whether her night ended in a bed.</ChapterEnd>
        </Chapter>

        {/* ================= 3 · WHY ================= */}
        <Chapter id="why" label="Why">
          <Opener
            eyebrow="03 · Why · goal and metric"
            title="I measure one thing: how every arrival between 10 PM and 8 AM ends, and how long it takes."
            introTitle="Silent give-ups count as failures, and guardrails keep fraud and host exits from hiding."
            intro={<p className={cs.body}>Guest goal: a bed tonight, without anyone having to wake up. Business goal: keep late bookings and the hosts who take them, without paying guests to claim. I dropped “no support ticket” as the metric: in the accounts I found, stranded guests pay their own way and claim later <Cite c="C445 C447" />.</p>}
          />
          <div className={s.metricGrid}>
            <div className={cs.card}><p className={cs.eyebrow}>Outcome 1</p><h4 className={cs.h3}>In at the listing</h4><p className={cs.small}>Minutes from the first sign they’re there to “All 4 in”. Median and 90th percentile.</p></div>
            <div className={cs.card}><p className={cs.eyebrow}>Outcome 2</p><h4 className={cs.h3}>Changed before boarding</h4><p className={cs.small}>Its own outcome, never counted as “0 minutes”.</p></div>
            <div className={cs.card}><p className={cs.eyebrow}>Outcome 3</p><h4 className={cs.h3}>Moved to another bed</h4><p className={cs.small}>Minutes to a confirmed bed. No end signal counts as a failure.</p></div>
          </div>
          <SectionHead label="Guardrails" title="What must not get worse" />
          <ul className={s.guards}>
            <li><span className={cs.strong}>Fraud:</span> a random audit of 1 in 10 claims, plus flags (claims at exactly minute 30, receipts near the cap, repeat claims).</li>
            <li><span className={cs.strong}>Supply:</span> late-arrival approvals and caretaker confirmations. My bet: hosts leave through silence, not by saying No.</li>
            <li><span className={cs.strong}>Host burden:</span> night contacts per host per late arrival <Cite c="C434" />.</li>
            <li><span className={cs.strong}>Also watched:</span> time to a person at night, false alarms, late arrivals nobody declared.</li>
          </ul>
          <Callout>No baseline exists, so every target is a hypothesis.</Callout>
          <Pointers items={[["c", "The metric and the economics"]]} />
          <ChapterEnd>So I judged every option by one question: what would Airbnb have to do at 2 AM?</ChapterEnd>
        </Chapter>

        {/* ================= 4 · WHAT ================= */}
        <Chapter id="what" label="What">
          <Opener
            eyebrow="04 · What · the options"
            title="I chose to settle who opens the door before the bus leaves, and cut my own idea that needed Airbnb awake at 2 AM."
            titleWidth={900}
            introTitle="Confirm before boarding, fix each barrier, and keep money by rule as the backstop."
            intro={<p className={cs.body}>My first direction ended with Airbnb booking a bed at the door. I tested it against four alternatives that disagreed with the bet, not the screens.</p>}
          />
          <div className={s.options}>
            <div className={`${cs.card} ${s.option}`}><span className={`${s.pill} ${s.ok}`}>Kept, moved earlier</span><h4 className={cs.h3}>A · Escalate on silence</h4><p className={cs.small}>Ask before boarding, the last moment she’s most likely online <Cite c="C483" />.</p></div>
            <div className={`${cs.card} ${s.option}`}><span className={`${s.pill} ${s.ok}`}>Kept</span><h4 className={cs.h3}>B · Unlock by barrier</h4><p className={cs.small}>A fix for each barrier that works offline.</p></div>
            <div className={`${cs.card} ${s.option}`}><span className={`${s.pill} ${s.warn}`}>Backstop</span><h4 className={cs.h3}>C · Money by rule</h4><p className={cs.small}>Kept, but rebuilt after the stress test.</p></div>
            <div className={`${cs.card} ${s.option}`}><span className={`${s.pill} ${s.open}`}>Folded in</span><h4 className={cs.h3}>D · Any phone, one number</h4><p className={cs.small}>It became the SMS pack to the group.</p></div>
          </div>
          <Callout title="What decided it: what does Airbnb have to do at 2 AM?">
            My own last step needed someone at Airbnb to book a bed for four at 2 AM. Nothing shows that happens: no response times are published <Cite c="C477" />, paying for a new bed is optional <Cite c="C355" />, and in the accounts I found, nobody was rehoused on the night <Cite c="C443 C458" />. So I cut it. Airbnb sends a destination and the money, not a person.
          </Callout>
          <SectionHead label="What else I said no to" title="Two more ideas I killed" />
          <ul className={s.killed}>
            <li><span className={cs.strong}>“Text PIN for the door code”.</span> Phone numbers can be faked, so no code is ever sent on request.</li>
            <li><span className={cs.strong}>“Reply BOOK” to book a hotel by SMS.</span> A text becomes a spending trigger. Kept as a next step.</li>
          </ul>
          <Pointers items={[["h", "How the design changed"]]} />
          <ChapterEnd>None of this needed AI. That was a decision too.</ChapterEnd>
        </Chapter>

        {/* ================= 5 · WHY AI ================= */}
        <Chapter id="why-ai" label="Why AI">
          <Opener
            eyebrow="05 · Why AI?"
            title="Not here. At 2 AM the system has to be predictable, cheap and work over plain SMS."
            introTitle="Every night-time decision is a rule the guest can predict and the host can dispute."
            intro={<p className={cs.body}>Each decision at night is a plain fact: was the plan confirmed, have 30 minutes passed, is it inside the caretaker’s hours? A rule can be disputed fairly next morning; a model’s judgement can’t.</p>}
          />
          <ul className={s.cards3}>
            <li className={cs.cardSmall}><h4 className={cs.h3}>Predictable</h4><p className={cs.small}>Meera knows before boarding what happens if no one opens.</p></li>
            <li className={cs.cardSmall}><h4 className={cs.h3}>Works with no data</h4><p className={cs.small}>The clock runs on the phone; the plan travels by SMS.</p></li>
            <li className={cs.cardSmall}><h4 className={cs.h3}>Fair the next morning</h4><p className={cs.small}>A host disputes a fact, not an opinion.</p></li>
          </ul>
          <Callout title="Later, by day">It could help sort flagged claims. Never the thing that decides at the gate.</Callout>
          <ChapterEnd>So the design is a chain of rules, each link owned by someone who can act at that moment.</ChapterEnd>
        </Chapter>

        {/* ================= 6 · HOW + WHO ACTS ================= */}
        <Chapter id="how" label="How and who acts">
          <Opener
            eyebrow="06 · How + who acts"
            title="One arrival plan, confirmed before boarding, used at four moments."
            introTitle="Each step has an owner who’s awake then, a deadline and a fallback."
            intro={<p className={cs.body}>The host fills in the plan once per booking. The screens below show each moment it’s used, and why.</p>}
          />
          <ol className={s.chain}>
            <li><span className={s.step}>1</span><h4 className={cs.h3}>Confirmed before you board</h4><p className={cs.small}>The host names who opens. Ramesh confirms from an SMS link, with no app. No Yes an hour before boarding? Meera decides at the station.</p></li>
            <li><span className={s.step}>2</span><h4 className={cs.h3}>Carried offline</h4><p className={cs.small}>Saved on her phone (“Saved 9:12 PM”, not “Error”) and sent by SMS to every co-guest she confirmed.</p></li>
            <li><span className={s.step}>3</span><h4 className={cs.h3}>“What’s stopping you?”</h4><p className={cs.small}>A fix for each barrier (gate, door, no one here). Each works offline.</p></li>
            <li><span className={s.step}>4</span><h4 className={cs.h3}>The money moves by rule</h4><p className={cs.small}>Every failed night ends at a named place, a cost now and a date money returns.</p></li>
          </ol>

          <Journey />

          <Figure type="Prototype" title="Live prototype · pick a scenario, then use the phone">
            <ProtoEmbed src={PROTO} poster="/navi/media/demo-poster.jpg" />
          </Figure>

          <Figure type="Audio" title="Rohan’s voice note for the guard · Assamese · plays offline">
            <div className={s.figPad}>
              <audio controls preload="none" src="/navi/prototype/assets/audio/rohan_note_as.mp3" className={s.audio} />
              <p className={cs.small}>Meera can’t read Assamese; the guard can’t read English. The host records 10 seconds once. Here the voice is a stand-in, and the Assamese needs a native speaker’s check.</p>
            </div>
          </Figure>

          <SectionHead label="Who acts" title="Who acts, and what happens if they don’t" />
          <RTable
            head={["Step", "Who, by when", "If nothing happens"]}
            rows={[
              ["Name who opens", "Host, 24 h before arrival", "Free change for Meera, recorded as host-caused"],
              ["Confirm “I’ll be awake”", "Ramesh, 1 h before boarding", "Meera decides at the station"],
              ["Wake-up call", "Automatic, 20 min before arrival", "Host called; group told on the bus"],
              ["Bus late past his hours", "Automatic re-check, before his “awake until”", "Group told on the bus; if no one opens, Airbnb moves the night"],
              ["No one opens", "The group, 30 min after ringing", "The night moves; top-up if a Yes failed"],
              ["Morning check", "Airbnb, by day", <>Host disputes with Airbnb <Cite c="C391" />; the guest’s money doesn’t wait</>],
            ]}
          />
          <Pointers items={[["d", "Full table and rules"], ["f", "Every failure under every network condition"]]} />

          <SectionHead label="Money, by fault" title="Nobody pays twice, nobody profits from claiming" />
          <RTable
            head={["Layer", "Who gets it", "Who pays", "How fast"]}
            rows={[
              ["1 · Your night moves with you (₹1,500)", "Anyone who rang the caretaker’s bell (flat G2), or had the guard ring it, waited 30 min and wasn’t let in. Confirmed or not.", <>Host’s payout when the host owns access <Cite c="C350 C393" />. Airbnb for a late bus nobody chose, if Ramesh doesn’t confirm the new time.</>, "Credit now with data. Paid at a desk: back by 6 PM next day*"],
              ["2 · Covered tonight (top-up to ₹3,000 in total, cab included)", "Only when a confirmed Yes failed inside Ramesh’s hours. A Yes before the group rings counts.", "Airbnb pays the gap", "Applied at booking, or against the receipt"],
            ]}
          />
          <p className={`${cs.small} ${s.note}`}>*Proposed policy. Today most refunds arrive within 15 days <Cite c="C386" />. The ₹3,000 cap, the 30 minutes and every timer are pilot hypotheses.</p>
          <Callout title="Why would a host say Yes?">
            A failed Yes costs a host at most that night’s payout, so the risk isn’t money, it’s inertia. So naming who opens is part of approving a late arrival, which hosts already do <Cite c="C370" />. I held back the cancellation fee (50%, $50 minimum <Cite c="C394" />): it’s more than a ₹1,500 night. It switches on only if under ~70% approve with a plan and declines stay flat.
          </Callout>

          <Figure type="Economics" title="What it costs Airbnb, per 1,000 late arrivals">
            <div className={s.figTable}>
              <RTable
                head={["Configuration", "Cost to Airbnb", "Read"]}
                rows={[
                  ["Prevention only: confirm, SMS pack, wake-up call", "₹5k–50k", "Avoiding 2–15 failed nights pays for it"],
                  ["+ payout on top of the refund (first version, 2–5% claims)", "₹40k–235k", "Rejected: pays guests to claim"],
                  ["+ payout that replaces the night (2–5% claims)", "₹15k–85k", "Chosen"],
                  ["+ late bus: Airbnb moves the night", "+₹7.5k–30k", "Assumes 0.5–2% of late arrivals"],
                ]}
              />
            </div>
            <p className={`${cs.small} ${s.protoNote}`}>At the same claim rates, paying on top of the refund costs up to nearly three times the chosen version.</p>
          </Figure>
          <Pointers items={[["c", "Assumptions behind the numbers"]]} />
          <ChapterEnd>Then I tried to break it.</ChapterEnd>
        </Chapter>

        {/* ================= 7 · SO WHAT ================= */}
        <Chapter id="so-what" label="So what">
          <Opener
            eyebrow="07 · So what"
            title="Prevention survived my stress test. My first payout didn’t, so now it replaces the night instead of adding to it."
            titleWidth={900}
            introTitle="Every night ends at a named place or a stated limit."
            intro={<p className={cs.body}>I ran a red team (six kinds of attacker, about 25 attacks), walked ten worst-case nights minute by minute, and modelled the economics at scale. My first payout paid guests to claim, was easy to stage, and was 60–85% of the cost.</p>}
          />
          <RTable
            caption="What broke, and what I changed"
            head={["What broke", "What I changed"]}
            strong={1}
            labelFirst
            rows={[
              ["The payout came on top of the refund", "It replaces the night: ₹3,000 in total, cab included"],
              [<>Money came back in up to 15 days <Cite c="C386" /></>, "Credit now with data; at a desk, back by 6 PM next day (proposed)"],
              ["A silent host triggered nothing", "Approving a late arrival means naming who opens"],
              ["A “coming in 10” call could stop the clock", "Only the guest stops it, with no pause; calls go through a logged, masked Airbnb line"],
              ["Anyone who replied YES got the address and PIN", "Meera confirms each number; co-guests can only send HELP and CALL"],
            ]}
          />
          <Pointers items={[["e", "Fraud and abuse register"], ["h", "Decision log"]]} />

          <SectionHead label="Judgement" title="Where I changed my mind, and where I held my ground" />
          <ul className={s.guards}>
            <li><span className={cs.strong}>I was wrong about the late bus.</span> I first decided a warning on the bus was protection enough, but it left them paying twice. Now Ramesh’s re-check decides who pays, and the night moves either way.</li>
            <li><span className={cs.strong}>A critique round proposed cutting the wait to 10 minutes after a missed wake-up call. I kept 30.</span> A missed 1:25 AM call is weak evidence that nobody will answer at 1:45, and a shorter wait raises the cost on thin evidence.</li>
            <li><span className={cs.strong}>I also turned down two other proposals:</span> charging hosts the cancellation fee straight away (it would push budget hosts to refuse late arrivals), and booking hotels by SMS reply (a text would become a spending trigger).</li>
          </ul>

          <SectionHead label="Where every night ends" title="A named place, or a stated limit" />
          <div className={s.endings}>
            <div className={`${cs.card} ${s.pad}`}><h4 className={cs.h3}>In the flat</h4><p className={cs.small}>The PIN works · the guard lets them through · a power bank wakes the lock · Ramesh opens.</p></div>
            <div className={`${cs.card} ${s.pad}`}><h4 className={cs.h3}>In another bed, by rule</h4><p className={cs.small}>Switched at boarding · no one opened · a confirmed Yes failed · the bus ran late. With data: book Orchid Inn in one tap. Without: walk 10 minutes, pay, back by 6 PM on 21 Nov.</p></div>
            <div className={`${cs.card} ${s.pad}`}><h4 className={cs.h3}>Without a bed, said plainly</h4><p className={cs.small}>Cancelled at boarding · no working phone in the group · nobody can open · no affordable bed nearby · a lawful society ban.</p></div>
          </div>
          <Pointers items={[["g", "Edge cases and honest limits"]]} />

          <SectionHead label="Validation" title="What I tested" />
          <ul className={s.guards}>
            <li>154 logged research claims, 120 of them verified against their sources.</li>
            <li>Five critique rounds on the design, each of which changed it, and some proposals I turned down (above).</li>
            <li>The stress test above, and one device test.</li>
            <li>An automated test of every scenario under every network condition, which caught eight bugs I then fixed.</li>
            <li>A live test with people on their own phones (below).</li>
          </ul>

          <Figure type="Live" title="Live test · get Meera’s group of 4 into a bed">
            <p className={`${cs.body} ${s.liveIntro}`}>
              Since 20 Nov, people have been trying the prototype on their own phones, with one job: get Meera’s group of 4 into a bed. It counts only the real path, refuses shortcuts like tapping “We’re in” before the door opens, and logs whether they got there, how long it took and a 1–5 ease rating. The numbers are live, small and informal: they show where people get stuck, not proof that the design works.
            </p>
            <LiveResults />
          </Figure>
          <Pointers items={[["i", "Testing method"]]} />

          <Callout title="What I haven’t proven">
            I didn’t talk to guests, hosts or caretakers before I locked the solution, and my guest-behaviour evidence is Western forum posts, not Indian guests. There was no real 2 AM and no real caretaker. What happened at the gate can’t be proven either, so fairness rests on a rule: the guest’s money stays separate from the host’s dispute.
          </Callout>

          <SectionHead label="First pilot" title="What I’d measure first, in one city" />
          <ul className={s.guards}>
            <li>Do hosts approve late arrivals with a named person, or start declining?</li>
            <li>Do caretakers confirm from an SMS link, and in which language?</li>
            <li>Is there a bed for 4 under ₹3,000 nearby at 2 AM? If not, the money layer becomes money only, and I’d say so.</li>
          </ul>
          <ChapterEnd>The bet: fix the night before it starts, and when it still fails, send a destination and the money, not a promise.</ChapterEnd>
        </Chapter>
        <div className={s.endSpace} aria-hidden="true" />
      </div>

      <ChapterRail chapters={RAIL} />
      <AppendixPanel title="Confirmed before you board · Appendix" sections={naviAppendixSections} scrollTabs>
        <NaviAppendix />
      </AppendixPanel>
    </div>
  );
}
