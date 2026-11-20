/* Generated from D:\Placement Task\Navi_Appendix_v2.md by md2appendix.py. Edit the markdown, then regenerate. */
import type { AppendixSection } from "../appendix";

export type Block =
  | { t: "h3" | "p"; text: string }
  | { t: "ul" | "ol"; items: { text: string; sub?: string[] }[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "kv"; rows: string[][] };

export const naviAppendixIntro: Block[] = [
 {
  "t": "p",
  "text": "The evidence and the detail behind the main page. C-numbers are claims from my desk-research log (section A). All times are IST, Fri 20 Nov 2026. Every threshold (the 30-minute clock, the ₹3,000 cap, the 20-minute ping, the claim window) is a hypothesis to test in a pilot, not a target. The money rules are a proposed policy change, not current Airbnb policy."
 }
];

export const naviAppendixSections: AppendixSection[] = [{"id": "a", "label": "Research ledger"}, {"id": "b", "label": "Bets vs outcomes"}, {"id": "c", "label": "The metric and the economics"}, {"id": "d", "label": "Who acts, and the rules"}, {"id": "e", "label": "Fraud and abuse register"}, {"id": "f", "label": "Failure × condition matrix"}, {"id": "g", "label": "Edge cases and honest limits"}, {"id": "h", "label": "How the design changed"}, {"id": "i", "label": "Testing method"}, {"id": "j", "label": "Tools and disclosures"}];

export const naviAppendixBlocks: Record<string, Block[]> = {
 "a": [
  {
   "t": "h3",
   "text": "How I did the desk research"
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "I wrote my six bets first (section B), then researched. The research finished at about 03:00."
    },
    {
     "text": "I logged every finding as one claim, with its source, its capture date and a verification status. A separate pass checked each claim against the source text before it could count as supported."
    },
    {
     "text": "**Methods:** a teardown of logged-out airbnb.co.in help pages (captured 19 Nov 2026) and Wayback snapshots; a step-by-step walkthrough of the 01:30 lockout path; coding of three Hacker News threads on failed arrivals; domain research on Indian homestay rules, society gates, lock makers and highway network tests."
    },
    {
     "text": "**Not used:** app-store reviews, Reddit and YouTube, because their terms bar it."
    },
    {
     "text": "**Totals: 154 claims, 120 supported.** The rest: 17 drafts (hypotheses for interviews, not evidence), 8 rejected, 5 evidenced, 1 disputed, 1 escalated, 1 unverifiable, 1 withdrawn. I cite only supported claims."
    }
   ]
  },
  {
   "t": "h3",
   "text": "The claims the design rests on"
  },
  {
   "t": "p",
   "text": "**Airbnb's rules**"
  },
  {
   "t": "table",
   "head": [
    "ID",
    "Claim",
    "Why it matters to the design"
   ],
   "rows": [
    [
     "C350",
     "\"Host fails to provide access\" is a covered reservation issue.",
     "The night can move at the host's cost under existing policy."
    ],
    [
     "C393",
     "When that happens, the host's payout is cut by the amount refunded.",
     "It funds the night; it caps a host's exposure at that night."
    ],
    [
     "C355",
     "The remedy is a refund or help finding a similar place. Airbnb \"may, but is not obligated to\" pay for a new one.",
     "No bed is promised today, so I set an explicit cap."
    ],
    [
     "C364",
     "Guests escalate after \"a reasonable time\"; no number is given.",
     "I replaced it with a stated 30-minute clock."
    ],
    [
     "C386",
     "Most refunds arrive within 15 days.",
     "Why money moves at once, or by 6 PM the next day."
    ],
    [
     "C370",
     "Arriving outside the check-in window needs the host's prior approval.",
     "Where \"who opens the door\" attaches (Decision B)."
    ],
    [
     "C394",
     "A late host cancellation costs 50%, with a $50 minimum.",
     "More than a ₹1,500 night, so I held the fee back."
    ]
   ]
  },
  {
   "t": "p",
   "text": "**Night support**"
  },
  {
   "t": "table",
   "head": [
    "ID",
    "Claim",
    "Why it matters to the design"
   ],
   "rows": [
    [
     "C363",
     "Calls to support may be answered by an AI assistant first; a person on request.",
     "I don't promise a human at 2 AM."
    ],
    [
     "C477",
     "The help pages give no response time for the lockout path.",
     "I killed \"Airbnb takes over\"; time to a human is a guardrail."
    ],
    [
     "C373",
     "A 24-hour safety line with priority access exists.",
     "Safety skips every timer and every question."
    ],
    [
     "C396",
     "A \"press 8\" filter on India's 112 line rejected 96% of calls.",
     "No hurdle in front of urgent help; per-account limits instead (C397)."
    ]
   ]
  },
  {
   "t": "p",
   "text": "**Offline and co-guests**"
  },
  {
   "t": "table",
   "head": [
    "ID",
    "Claim",
    "Why it matters to the design"
   ],
   "rows": [
    [
     "C358 · C461",
     "2017: check-in instructions work offline. Today: \"screenshot them\".",
     "Offline access was an open question, so I tested it (section I)."
    ],
    [
     "C367",
     "Co-guests must log in or create an account to accept an invite.",
     "The pack goes by SMS to group numbers, no login."
    ],
    [
     "C407 · C408 · C415",
     "About 1,750 km of national highway lacks mobile coverage; 9–38% of voice samples had poor signal on one tested highway and in one district.",
     "The clock runs on the phone; decisions happen before boarding."
    ],
    [
     "C483",
     "Before departure is when the guest is most reliably online (an inference).",
     "The deadline is boarding, not arrival."
    ]
   ]
  },
  {
   "t": "p",
   "text": "**Host duties**"
  },
  {
   "t": "table",
   "head": [
    "ID",
    "Claim",
    "Why it matters to the design"
   ],
   "rows": [
    [
     "C434",
     "Hosts are expected to reply within 1 hour, in local daytime only. Airbnb \"may\" step in after that, with no time set (C436).",
     "Recovery can't depend on the host replying at night."
    ]
   ]
  },
  {
   "t": "p",
   "text": "**Indian entry: homestays, societies, locks**"
  },
  {
   "t": "table",
   "head": [
    "ID",
    "Claim",
    "Why it matters to the design"
   ],
   "rows": [
    [
     "C421 · C423",
     "Registered homestays in Goa and Uttarakhand need the family living on site; Kerala villas need a resident manager.",
     "A person, not a code, often opens the door."
    ],
    [
     "C427",
     "MyGate: a resident pre-approves a number, and the guard checks a 6-digit passcode.",
     "The guard card leads with what a guard can check."
    ],
    [
     "C428",
     "A Mumbai co-operative court held that short-term rentals need the society's approval.",
     "The card never claims Airbnb authorises entry."
    ],
    [
     "C371",
     "Airbnb's smart-lock backup code works only in the US and Canada.",
     "I can't lean on it in India."
    ],
    [
     "C347",
     "A common Indian keypad lock has no app link: 1 master PIN, 20 others, 2 keys.",
     "Guest PIN slot only; a code can't be revoked remotely."
    ],
    [
     "C379",
     "Dead battery: a power bank into the USB port, then the PIN, or the mechanical key.",
     "The door steps: cable and power bank, then PIN, then the key."
    ],
    [
     "C482",
     "The person who opens at night often has no Airbnb account (no prevalence data).",
     "The caretaker confirms by SMS link or reply, no account."
    ]
   ]
  },
  {
   "t": "p",
   "text": "**Guest accounts (Western)**"
  },
  {
   "t": "table",
   "head": [
    "ID",
    "Claim",
    "Why it matters to the design"
   ],
   "rows": [
    [
     "C447",
     "Guests get themselves out at their own cost, then claim.",
     "The metric counts silent give-ups as failures."
    ],
    [
     "C458 · C443",
     "In the accounts found, no one was rehoused on the night.",
     "Airbnb sends a destination and money, not a person."
    ]
   ]
  },
  {
   "t": "h3",
   "text": "Limits"
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "**Guest behaviour is Western.** It comes from self-selected Hacker News posts, not Indian guests."
    },
    {
     "text": "**No interviews before the lock.** I locked the direction without talking to Indian guests, hosts or caretakers. Whether a caretaker would tap an SMS link is untested."
    },
    {
     "text": "**No prevalence data** on caretakers, gates or keypad locks, and none on signal inside a moving bus at night."
    },
    {
     "text": "**No live night-support test.** I didn't want to tie up real support or safety capacity without a real trip."
    },
    {
     "text": "Two legal sources (C404 and a third-party copy of the E-Commerce Rules) still need checking. The design doesn't rest on them."
    }
   ]
  }
 ],
 "b": [
  {
   "t": "p",
   "text": "I wrote these before reading any research and didn't change them afterwards."
  },
  {
   "t": "table",
   "head": [
    "Fork",
    "My bet",
    "What would flip it",
    "Outcome",
    "What it changed"
   ],
   "rows": [
    [
     "1. Midnight or early morning?",
     "Midnight",
     "Evidence on alternatives at both times",
     "**Open.** No source compares them. A 5–8 AM arrival is also outside the window (C370, C442)",
     "Metric covers 22:00–08:00; early arrivals count from check-in"
    ],
    [
     "2. Did the host fail, or was it never agreed?",
     "Neither, by default",
     "If blame must be assigned: the host",
     "**Challenged.** The deciding question is whether the arrival was agreed (C370, C442). Host replies are daytime-only (C434)",
     "\"Who opens\" is settled before boarding. My responsibility / availability / accountability split became the frame"
    ],
    [
     "3. Finding the info, or recovering?",
     "Recovering",
     "Guests losing battery or info before trying entry",
     "**Half confirmed.** The recovery gap is well supported (C355, C364, C447, C458). The info side is open (C358 vs C461)",
     "Metric is minutes to resolution; a stated 30-min clock; the pack is still carried offline"
    ],
    [
     "4. What blocks entry in India?",
     "A code",
     "Data on how Indian stays are entered",
     "**Overturned** for homestays, mixed for flats (C371, C421, C427, C379)",
     "The barrier is the unit: Gate / Door / No one here"
    ],
    [
     "5. Primary user?",
     "The booker",
     "The group being better placed (battery, signal)",
     "**Open.** Co-guests see details only after logging in (C362, C367)",
     "SMS pack to every group number; the booker activates each"
    ],
    [
     "6. Is the host side in scope?",
     "Partly",
     "If the host can't be relied on, work without them",
     "**Confirmed** (my flip). Daytime-only replies (C434); an undefined \"may\" (C436)",
     "The host acts only before arrival; rules act at night"
    ]
   ]
  }
 ],
 "c": [
  {
   "t": "h3",
   "text": "Outcome metric: late-arrival resolution"
  },
  {
   "t": "p",
   "text": "Every arrival between 22:00 and 08:00, with three outcomes:"
  },
  {
   "t": "table",
   "head": [
    "Outcome",
    "How it's measured"
   ],
   "rows": [
    [
     "At the listing",
     "Minutes from start to stop: median and 90th percentile"
    ],
    [
     "Changed before boarding",
     "Its own outcome (switch or cancel). Never counted as 0 minutes"
    ],
    [
     "Bed elsewhere at night",
     "Minutes from start to the new bed confirmed (booked, or a receipt)"
    ]
   ]
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "**Start:** the first sign the group is there in person: location within 200 m, \"What's stopping you?\" opened, or HELP from an activated number. No such sign: reported separately, not scored in minutes. Early arrivals count from booked check-in."
    },
    {
     "text": "**Stop:** \"All 4 in?\" answered Yes (\"in and staying\"; \"Something's wrong inside\" reopens it), or a new bed confirmed."
    },
    {
     "text": "**No stop event:** unresolved, counted as a failure, never dropped. The morning \"How did last night end?\" and any access refund within 72h can reclassify a night. A host who cancels after boarding is its own outcome, and a failure."
    },
    {
     "text": "**Diagnostics:** time from each barrier branch to \"I'm in\"; the named person's confirmation rate and channel."
    }
   ]
  },
  {
   "t": "h3",
   "text": "Guardrails (final)"
  },
  {
   "t": "table",
   "head": [
    "#",
    "Guardrail",
    "What it catches"
   ],
   "rows": [
    [
     "1",
     "**Fraud:** a random audit of 1 in 10 claims, plus three flags: claims at exactly minute 30, receipts near the cap, repeat claims per account or phone",
     "Fraud a dispute count can't see"
    ],
    [
     "2",
     "**Time to a human at night:** median minutes from \"I need help\" to a person, and the share who reach one",
     "Deflection hiding stranded guests"
    ],
    [
     "3",
     "**Host burden:** night contacts per host per late arrival",
     "A 24/7 host promise creeping in"
    ],
    [
     "4",
     "**Supply:** the named person's confirmation rate",
     "Hosts leaving through silence, not refusal"
    ],
    [
     "5",
     "**False alarms:** \"not confirmed\" bookings that went ahead and got in fine",
     "A confirm step that cries wolf"
    ],
    [
     "6",
     "**Undeclared late arrivals** at the listing",
     "Guests skipping the plan"
    ]
   ]
  },
  {
   "t": "h3",
   "text": "How the metric changed"
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "**v1 (~04:15):** unassisted check-in success, 10 PM–6 AM, scored as \"no support ticket\". Prevention only."
    },
    {
     "text": "**v2 (~04:30):** minutes stranded, median and 90th percentile, 22:00–08:00; silent give-ups count as failures. Stranded guests often don't file a ticket at the door (C445, C447)."
    },
    {
     "text": "**v3 (~06:00):** prevention and recovery, three outcomes; \"changed before boarding\" isn't 0 minutes; supply and false-alarm guardrails added after critique round 1."
    },
    {
     "text": "**v3.1 (~09:30):** start at the first in-person sign; \"All 4 in?\"; post-boarding cancels counted; fraud measured by audit; undeclared arrivals tracked. The stress test showed v3 recording a 3-hour delay as 375 minutes instead of 60–150, and a split group as a success."
    }
   ]
  },
  {
   "t": "h3",
   "text": "Economics (cost to Airbnb per 1,000 late arrivals)"
  },
  {
   "t": "table",
   "head": [
    "Configuration",
    "Cost",
    "My call"
   ],
   "rows": [
    [
     "Prevention only: confirm, pack, wake-up ping, SMS and calls",
     "₹5k–50k",
     "**Likely worth it.** About 2–15 avoided failures pay for it"
    ],
    [
     "+ guarantee **on top of** the refund, at 2% / 5% / 10% claims",
     "₹40k–125k / ₹90k–235k / ₹180k–420k",
     "**Rejected.** It pays guests to claim; the guarantee is 60–85% of the cost"
    ],
    [
     "+ guarantee **as a substitute**, instant, 2–5% claims",
     "₹15k–85k",
     "**Adopted.** Plausible"
    ],
    [
     "+ late-bus night move (Airbnb pays, no top-up), if 0.5–2% of arrivals hit it",
     "+₹7.5k–30k",
     "Assumption, no data"
    ],
    [
     "Night move when nothing was confirmed",
     "About ₹0",
     "The host's payout, under existing policy (C350, C393)"
    ]
   ]
  },
  {
   "t": "p",
   "text": "**Value of avoided failures** = 1,000 × today's failure rate × share prevented × value per failure. At 5% × 40% × ₹3,000 that is about ₹60k per 1,000 (range ₹6k–200k)."
  },
  {
   "t": "p",
   "text": "**Assumptions** (mine; there is no baseline):"
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "Nights: budget ₹1,500, mid ₹3,500, premium ₹8,000 (anchored on Bengaluru listing data, median ₹2,470). Host payout ≈ the nightly price."
    },
    {
     "text": "A bed for 4 nearby: ₹1,500–3,000 (two budget rooms ₹1,488–2,742 with tax, plus a ₹300–600 cab)."
    },
    {
     "text": "A plan fails 5% of the time; 3% of unconfirmed guests cancel; 2 nights per booking."
    },
    {
     "text": "Today 3–8% of late arrivals fail; prevention stops 20–50%; one avoided failure is worth ₹1,000–5,000."
    },
    {
     "text": "SMS costs ₹0.12–0.30 a segment all-in, about 18–118 segments per arrival. \"₹\" forces Unicode, so the SMS writes \"Rs\"."
    },
    {
     "text": "Support costs ₹8–15 a minute; a claim review takes 15–25 minutes."
    },
    {
     "text": "5–20% of paid claims are fraudulent or inflated."
    },
    {
     "text": "Airbnb's take is about 13.4% of booking value (FY2025); ₹93.8 per US$."
    },
    {
     "text": "Why the host incentive needed fixing: as first written, a Yes on a ₹1,500 night risked ₹4,500, while silence cost only the few guests who cancelled."
    }
   ]
  }
 ],
 "d": [
  {
   "t": "h3",
   "text": "Who acts"
  },
  {
   "t": "table",
   "head": [
    "#",
    "Step",
    "Actor",
    "Timeout",
    "If nothing happens",
    "Abuse → control"
   ],
   "rows": [
    [
     "1",
     "States the late arrival",
     "Booker",
     "24h before arrival, for the free-change right",
     "The plan still runs; no free change",
     "Fake 3 AM arrival to escape a non-refundable stay → only ≥24h ahead, only if the host stays silent, once per account per year"
    ],
    [
     "2",
     "Approves the arrival by naming who opens the door (or self entry), plus gate and door \"if this fails\", a guard line and an optional 10-second voice note",
     "Host",
     "24h before arrival",
     "Free change for the guest, recorded as host-caused; no fee in the pilot",
     "Names someone who won't be there → a Yes makes the host pay the night. Self entry counts as the host's own Yes"
    ],
    [
     "3",
     "Confirms \"I'll be awake\" and an \"awake until\" time, by link, SMS reply 1/2/3, or via the host",
     "Named person (Ramesh)",
     "Boarding −1h (sent at −4h)",
     "Host alerted at −2h",
     "Host taps Yes without checking → the host pays the night. A missed confirmation carries no penalty by itself"
    ],
    [
     "4",
     "Not confirmed: Switch to a 24h desk / Go ahead / Cancel free",
     "Booker, at the station",
     "Boarding",
     "Keep the booking, send the pack. The night still moves if no one opens; no top-up",
     "Switch is offered only to stays with a 24h desk or self entry"
    ],
    [
     "5",
     "Sends the pack: opt-in first, then the details and two 24h stays nearby",
     "Rules",
     "On confirmation and at boarding −1h; again on any change",
     "Saved on the booker's phone; SMS to every activated number",
     "Wrong number → the opt-in has no place or time; the booker activates each number; PIN only if the host opts in; masked line"
    ],
    [
     "6",
     "Late bus: \"Now ~03:15. Still OK? 1/2\"",
     "Rules → named person",
     "Not set (pilot value; the prototype tells the group 10 min later)",
     "Group told on the bus; the top-up ends at the old \"awake until\"; Airbnb moves the night",
     "\"Bus late\" to escape a booking → declared before \"awake until\", in transit at the re-ping, ≤200 m at the claim, once per account per year"
    ],
    [
     "7",
     "Wake-up ping: \"Press 1 if you're up\", at arrival −20 min or \"~20 min away\"",
     "Rules → named person",
     "5 min",
     "Automated call to the host; SMS to the group",
     "Pressing 1 half asleep → a reminder, never evidence"
    ],
    [
     "8",
     "\"What's stopping you?\" Gate / Door / No one here / Someone wants money",
     "Anyone in the group",
     "None",
     "Every branch ends in \"Still stuck?\" → No one here",
     "The guard card shows only what a guard can check and asks him to ring G2 on the intercom"
    ],
    [
     "9",
     "The 30-minute clock, from \"We rang G2\" or \"The guard rang G2\"",
     "Group states it; rules keep calling Ramesh and the host",
     "30 min, on the phone, with or without signal",
     "The night moves; the top-up too if a confirmed Yes failed inside the window",
     "Staged claim → bell statement first, ≤200 m or HELP from an activated number, masked-line logs, claim window, 1-in-10 audit, flags, per-account limit (C397), termination (C392)"
    ],
    [
     "10",
     "Morning: \"How did last night end?\" plus the receipt for any top-up",
     "Booker; Airbnb reviews by day",
     "72h for the host to dispute (proposed; C391)",
     "No receipt → the night still stands; only the top-up is held",
     "Inflated receipt → ₹3,000 total cap. The host disputes with Airbnb, not the guest"
    ],
    [
     "Any",
     "Safety",
     "Guest → 24h safety line (C373)",
     "None",
     "(n/a)",
     "No timers or questions in front of it"
    ]
   ]
  },
  {
   "t": "h3",
   "text": "Business rules (latest)"
  },
  {
   "t": "ol",
   "items": [
    {
     "text": "**Approving a late arrival means naming who opens the door**, or self entry, which counts as the host's own Yes (C370). No approval or decline by 24h ahead: the guest gets a free change, recorded as host-caused, with no fee in the pilot. The C394 fee is held back. It switches on only if approval-with-plan stays below about 70% after the pilot while declines stay flat."
    },
    {
     "text": "**Who pays depends on fault.**",
     "sub": [
      "A Yes, then failure inside the window: the host pays the night; Airbnb pays the top-up.",
      "No Yes, and the host still failed access: the host pays the night (C350, C393), now instantly. No top-up.",
      "A declared late bus past \"awake until\", after a failed re-ping: Airbnb moves the night. Nobody chose the delay. No top-up.",
      "An undeclared late arrival: decided by day, from the logs."
     ]
    },
    {
     "text": "**The cover replaces the night; it doesn't add to it.** Layer 1 moves the ₹1,500 night. Layer 2 tops it up to ₹3,000 in total, cab included. A host's exposure is capped at that night's payout."
    },
    {
     "text": "**Money is fast.** With data, the money is applied when they book (with the top-up: \"you pay ₹0\"). Without data, they pay at the desk and are repaid by 6 PM on 21 Nov, a proposed commitment (refunds today take up to 15 days, C386). If the 30 minutes ended offline, payment follows a daytime check."
    },
    {
     "text": "**One clock: 30 minutes.** It starts at the guest's statement and runs on the phone. The group can leave at once; Airbnb keeps calling through the masked line. Only a guest action stops it; nothing pauses it."
    },
    {
     "text": "**A late Yes:** a Yes that lands before the group rings counts as confirmed, whenever it comes. After the ring it changes nothing."
    },
    {
     "text": "**Claim window for the top-up:** stated arrival −30 min to \"awake until\". On a late bus, the re-ping decides."
    },
    {
     "text": "**Ramesh turns up.** Before the group has booked or paid elsewhere: go in, nothing moves. After: they keep it. \"Covered, then in within N minutes\" is an audit signal."
    },
    {
     "text": "**Guest repayment is separate from the host's dispute.** The host disputes with Airbnb within 72h (a proposed window; hosts can dispute today, C391). The guest repays only if the logs show the named person answered and offered entry."
    },
    {
     "text": "**\"Someone wants money\"** skips the bell question, not the claim window."
    },
    {
     "text": "**Codes.** The door PIN goes by SMS only if the host opts in, and only from a guest PIN slot, never the master. No PIN on request. Codes are hidden in the app after checkout. Remaining risk: on locks with no remote control the PIN outlives the stay (C347); per-booking PINs that expire are the target (C401)."
    },
    {
     "text": "**The SMS channel.** The opt-in carries no place or time. The booker activates each number. Co-guest numbers can send only HELP and CALL; only the booker cancels or changes times, in the app. Ramesh and the host are reached through a masked line, so calls are logged."
    },
    {
     "text": "**All phones dead:** a next-morning claim. A 24h-desk receipt near the listing within 2h of arrival, plus the system's own logs, reviewed by day."
    },
    {
     "text": "**Safety beats everything.** Any safety option goes straight to the 24-hour safety line (C373)."
    },
    {
     "text": "**Housing societies:** the plan works there without endorsing anything. The guard card never claims Airbnb authorises entry. A listing's legality is the host's responsibility at listing time."
    }
   ]
  }
 ],
 "e": [
  {
   "t": "table",
   "head": [
    "Who",
    "Abuse",
    "Control"
   ],
   "rows": [
    [
     "Guest",
     "States a fake late arrival to get a free cancel",
     "Only ≥24h ahead; counts only if the host stays silent; once per account per year; host deadlines never fall 22:00–08:00 host time"
    ],
    [
     "Guest",
     "Fakes \"no one here\" to upgrade to a hotel",
     "No profit: the cover replaces the night, ₹3,000 in total; the top-up needs a confirmed Yes"
    ],
    [
     "Guest",
     "Stages it: doesn't ring, claims from elsewhere, pays Ramesh not to answer",
     "Bell statement first; ≤200 m or HELP from an activated number; masked-line logs; claim window; 1-in-10 audit; flags for minute-30 claims, near-cap receipts and repeat claims"
    ],
    [
     "Guest",
     "Uses \"bus late\" to escape a non-refundable booking",
     "Delay declared before \"awake until\"; in transit at the re-ping; ≤200 m at the claim; bell statement; once per account per year"
    ],
    [
     "Guest",
     "Inflates the receipt",
     "₹3,000 total cap; a receipt only for the top-up; daytime review"
    ],
    [
     "Guest",
     "Uses \"someone wants money\" to skip the bell question",
     "It skips the bell, not the claim window"
    ],
    [
     "Guest",
     "Takes the cover, then walks in",
     "Nothing moves if they go in before booking or paying elsewhere; audit signal"
    ],
    [
     "Host or Ramesh",
     "Stops the clock with a \"coming in 10\" call, or by marking \"they're in\"",
     "Only a guest action stops it; no pause"
    ],
    [
     "Host",
     "Stays silent to avoid liability",
     "Approving means naming who opens; no decision by 24h → host-caused free change; the fee is held back with a trigger"
    ],
    [
     "Host",
     "Taps Yes without checking",
     "The host pays the night"
    ],
    [
     "Host",
     "Declares \"self entry\" to dodge liability",
     "Self entry counts as the host's own Yes"
    ],
    [
     "Host",
     "Disputes every claim",
     "Disputes are with Airbnb, not the guest; fraud is measured by audit, not disputes"
    ],
    [
     "Host",
     "Stops accepting late arrivals",
     "Supply guardrail: the named person's confirmation rate"
    ],
    [
     "Named person",
     "Presses 1 half asleep",
     "\"Pressed 1\" is a reminder, never evidence"
    ],
    [
     "Co-guest",
     "Cancels, moves timers or answers for Ramesh by SMS",
     "Co-guest numbers send only HELP and CALL; only the booker changes things, in the app"
    ],
    [
     "Co-guest",
     "Shares the PIN outside the group",
     "PIN by SMS only with host opt-in; guest PIN slot, never master; the booker is responsible for people she adds (C392)"
    ],
    [
     "Wrong number",
     "Replies YES and gets the address and codes",
     "The opt-in has no place or time; the booker activates each number"
    ],
    [
     "Anyone",
     "Spoofs a group number to ask for the PIN",
     "No PIN-on-request channel exists"
    ],
    [
     "Anyone",
     "Floods an urgent channel",
     "No new urgent channel; the safety line is unchanged; the cover is a rule, not a queue"
    ]
   ]
  }
 ],
 "f": [
  {
   "t": "table",
   "head": [
    "Failure",
    "Online",
    "SMS only",
    "Offline",
    "Low battery",
    "Booker's phone dead"
   ],
   "rows": [
    [
     "Host hasn't named anyone (24h out)",
     "\"Waiting for Rohan\" + free change",
     "Status SMS; change in the app",
     "Saved card: last status, time saved",
     "Same + \"Plan saved on this phone\"",
     "Co-guest SMS: status only"
    ],
    [
     "Named person says No",
     "\"Ramesh can't. Rohan asked to name someone else\"",
     "SMS update",
     "Last known status",
     "Same",
     "SMS update"
    ],
    [
     "No Yes at boarding −1h",
     "Switch / Go ahead / Cancel free",
     "Status SMS; default is go ahead",
     "Default: keep it; night still moves; no top-up",
     "Same + \"Decide before you board\"",
     "Status only; can't cancel"
    ],
    [
     "Bus late past \"awake until\"",
     "Booker edits arrival; Ramesh re-pinged",
     "Group SMS: ring G2, then Orchid Inn",
     "Ping fires at the old time; tap \"~20 min away\" later",
     "Same",
     "Group SMS carries the re-ping result"
    ],
    [
     "Can't find the details",
     "Pack at the top of the trip",
     "Short SMS pack",
     "Saved pack, \"saved 21:10\"",
     "Saved pack + battery banner",
     "Co-guest's SMS pack"
    ],
    [
     "Guard won't open",
     "Guard card: his language, society code, \"ring G2\"",
     "Gate step + guard line by SMS",
     "Saved guard card, full screen",
     "Same",
     "Co-guest shows the SMS line (no voice note)"
    ],
    [
     "Lock fails",
     "Steps for this lock → \"Still locked\"",
     "Short steps by SMS",
     "Saved steps",
     "Same",
     "PIN line if the host opted in; else \"Ramesh opens it\""
    ],
    [
     "Confirmed, then slept",
     "Ping → host → bell question → 30 min → night + top-up, \"you pay ₹0\"",
     "Clock runs; walk or call Orchid Inn; repaid by 6 PM 21 Nov",
     "Clock runs on the phone; walking route; paid after a daytime check",
     "Same",
     "HELP from an activated number starts it; route by SMS"
    ],
    [
     "Not confirmed, no one opens",
     "Same clock; night moves (host pays); no top-up",
     "Same; pay at the desk, repaid",
     "Same; after a daytime check",
     "Same",
     "HELP starts it"
    ],
    [
     "Code released late",
     "Push when it arrives",
     "SMS when it arrives",
     "\"Code pending: ask Ramesh at the gate\"",
     "Same",
     "SMS when it arrives"
    ],
    [
     "Safety",
     "Safety line, one tap, no timers (C373)",
     "Call 112 or the safety line",
     "Dial 112",
     "Same",
     "Any phone"
    ]
   ]
  },
  {
   "t": "p",
   "text": "**Gaps I state openly:**"
  },
  {
   "t": "ol",
   "items": [
    {
     "text": "Fully offline and confirmed-then-slept: the clock now runs, but the money waits for a daytime check. *(Earlier the clock waited for signal; that gap is closed.)*"
    },
    {
     "text": "A code released late can't be saved in advance."
    },
    {
     "text": "The booker's phone dies and no group numbers were entered: nothing on another phone; only the next-morning claim."
    }
   ]
  }
 ],
 "g": [
  {
   "t": "h3",
   "text": "Edge cases handled"
  },
  {
   "t": "table",
   "head": [
    "Edge case",
    "How it's handled"
   ],
   "rows": [
    [
     "The guard refuses, or the lock fails, after a Yes",
     "Every \"Still stuck?\" leads to No one here. The trigger is failed escalation (30 min of attempts), not the type of barrier"
    ],
    [
     "Arriving the night before the booking",
     "A date check when the arrival is stated: \"Your booking starts Sat 3 PM; you arrive Sat 01:45, the night before.\" Designed, not in the prototype"
    ],
    [
     "\"We're in, but…\"",
     "\"Something's wrong inside\": gas or unsafe → safety; occupied, no power or water → reservation issue (C350). It reopens the night"
    ],
    [
     "ID checked at the door",
     "\"Keep ID ready for all 4\" in the pack and SMS (C424 is a North Goa order)"
    ],
    [
     "Dead keypad",
     "\"Carry a power bank and USB-C cable\"; a privacy-mode step; the spare key with Ramesh"
    ],
    [
     "Booked after boarding",
     "No free-change right. A Yes that lands before the ring still counts; the night moves either way"
    ],
    [
     "Bus later than \"awake until\"",
     "The re-ping decides. No answer → Airbnb moves the night, no top-up"
    ],
    [
     "Ramesh turns up late",
     "Before the group books or pays elsewhere: go in, nothing moves. After: they keep it"
    ],
    [
     "The guest can't pay first",
     "With data: applied at booking, \"you pay ₹0\". Without: pay at the desk, repaid by 6 PM on 21 Nov"
    ],
    [
     "Getting to the new bed at 2 AM",
     "The cap includes the cab; the walking route is saved; safety stays on the 24h line"
    ],
    [
     "Host disputes and wins",
     "The guest repays only if logs show Ramesh answered and offered entry"
    ],
    [
     "Someone asks for money",
     "Its own option: \"Your stay is paid.\" It starts the clock without the bell question"
    ],
    [
     "Booker's phone dies",
     "Co-guest SMS: opt-in, activation, pack, guard line, PIN only if the host opted in; HELP and CALL"
    ],
    [
     "Deaf guest, or calls silenced",
     "Partly: the clock starts from a tap, \"Knocked at G2\" is logged, and Airbnb makes the calls. Safety is still voice-first"
    ],
    [
     "A co-guest arrives alone, earlier",
     "Limit: they have their own pack, but the ping and clock follow one arrival time"
    ]
   ]
  },
  {
   "t": "h3",
   "text": "Conditions the design cannot recover from"
  },
  {
   "t": "table",
   "head": [
    "#",
    "Condition",
    "What happens that night",
    "The next morning"
   ],
   "rows": [
    [
     "1",
     "No working phone anywhere in the group",
     "Nothing to read; only people on site can help",
     "A claim with a 24h-desk receipt near the listing (within 2h of arrival) plus the system's logs, reviewed by day"
    ],
    [
     "2",
     "No one on site can or will open, and there's no self entry (including keyless locks with a dead battery, C346)",
     "The design can pay, not open the door",
     "The night moves (plus the top-up if a Yes failed); without data, repaid by 6 PM on 21 Nov"
    ],
    [
     "3",
     "No affordable bed nearby at that hour",
     "The group pays above the cap, or waits",
     "Repaid up to the layer that applies (the ₹1,500 night, or ₹3,000 with the top-up); the rest is theirs"
    ],
    [
     "4",
     "A guard enforcing a lawful society ban (C428, C429)",
     "The design doesn't override him",
     "Proposed: the host pays all of it and Airbnb no gap, because legality is the host's responsibility at listing time"
    ],
    [
     "5",
     "Delays or changes the system can't learn about with no coverage (C407, C408, C415)",
     "Timers fire late; a pack can go stale",
     "An undeclared late arrival is decided by day, from the logs"
    ],
    [
     "6",
     "What happened at the gate can't be proven",
     "Logs show a call connected, not what was said",
     "Guest repayment stays separate; the host disputes with Airbnb within 72h; the 1-in-10 audit"
    ]
   ]
  }
 ],
 "h": [
  {
   "t": "p",
   "text": "Decision log, Fri 20 Nov."
  },
  {
   "t": "table",
   "head": [
    "Time",
    "Decision",
    "Trigger",
    "What it replaced"
   ],
   "rows": [
    [
     "~04:45",
     "I bet on recovery: v1, \"No one owns 1:45 AM, so the booking does\". An arrival pact, then a timed ladder at the door ending with Airbnb taking over.",
     "**Evidence** + my forks 2, 3 and 6 (C364, C434)",
     "Nothing; first direction"
    ],
    [
     "~05:10",
     "I moved the agreement earlier: v2, \"…so the evening does\". An evening readiness check plus a barrier kit at the door.",
     "**Evidence**, weighed across four alternative directions on one question: what must Airbnb do at 2 AM?",
     "v1's ladder"
    ],
    [
     "~05:10",
     "I killed \"Airbnb takes over\".",
     "**Evidence:** no published response times (C477); \"may, not obligated\" (C355); AI may answer first (C363); no one rehoused on the night (C443, C454, C458)",
     "v1's last step: Airbnb confirms and pays a bed at 2 AM"
    ],
    [
     "~05:40",
     "I locked v3, \"Confirmed before you board\": one host plan, confirmed before boarding, carried offline, used at the door, with money if a confirmed plan fails.",
     "**Critique** round 1: the \"evening\" check fired near midnight on a bus, and the worst night stayed on today's path (C483)",
     "v2's arrival-based deadlines; \"No one here → today's path\""
    ],
    [
     "~08:10",
     "I cut the backup person and put the door path in the group SMS: a YES opt-in first, the PIN line only if the host opts in, the guard line in his language.",
     "**Evidence:** highway signal gaps (C407, C408, C415); offline codes can't be revoked (C399, C400, C347); co-traveller misuse isn't covered (C392). **Critique:** it broke my own code rule",
     "A hand-over at 15% battery, then a \"backup person\" chosen at boarding"
    ],
    [
     "~08:10",
     "I cut PIN-on-request. Nobody can text for the PIN; the fallback is calling Ramesh or the host, who can judge who's asking.",
     "**Critique:** spoofable from any number",
     "\"Reply PIN\" from a group number"
    ],
    [
     "~09:30",
     "I made the guarantee a substitute: the night's money back at once, topped up to ₹3,000 in total with the cab, inside a claim window, after a bell statement, with calls on a masked line.",
     "**Stress test:** read literally, it paid the night plus ₹3,000, made claiming profitable, and was 60–85% of the cost",
     "Up to ₹3,000 after 30 min, receipt next morning, on top of the refund"
    ],
    [
     "~10:20",
     "Decision B: I made approving a late arrival mean naming who opens. No decision by 24h → host-caused free change; the fee is held back (C394).",
     "**Stress test:** once a Yes is capped at the night, the money is neutral, so inertia decides. **Critique** on the fee",
     "A separate Yes hosts could ignore. Rejected: counting a missed plan as a host cancellation ($50 minimum > a ₹1,500 night)"
    ],
    [
     "~11:00",
     "I made offline time count: the clock runs on the phone from \"We rang G2\". At the gate, the question is \"Did the guard ring G2?\".",
     "**Critique:** in Meera's own conditions the clock never started, and gate guests had to claim a bell they couldn't reach",
     "A clock that waited for signal"
    ],
    [
     "~11:00",
     "I rejected cutting the wait to 10 minutes after a missed wake-up call.",
     "**Critique** proposed it. I judged a missed 01:25 call weak evidence that no one opens at 01:45, and the cost would rise on thin evidence",
     "Nothing; 30 minutes stays"
    ],
    [
     "~11:15",
     "Late bus: I let the re-ping decide. A Yes extends the window; silence ends the top-up at \"awake until\".",
     "**Critique:** a late bus silently cancelled cover at the gate",
     "Cover lapsing without warning"
    ],
    [
     "~12:00",
     "Two money layers, by fault. The night moves for anyone who rang, waited and wasn't let in; the top-up only after a confirmed Yes failed. Airbnb funds the late-bus night.",
     "**Critique** of the endings: late-bus and unconfirmed groups paid twice; \"covered\" offline gave no address",
     "\"Protection is knowing, not money\"; \"ask for a refund under the usual policy\""
    ],
    [
     "~12:00",
     "I cut \"Reply BOOK\" (Airbnb books and pays the hotel by SMS) and kept it as a next step.",
     "**Stress test:** SMS is a control surface anyone can reach; 2 AM room availability is unverified",
     "The critique's proposal"
    ],
    [
     "~13:50",
     "One clock: \"On my way\" no longer pauses it.",
     "**My rule:** one clock everywhere, from the two layers",
     "A one-time 15-minute pause"
    ],
    [
     "~13:55",
     "A Yes before the group rings counts, whenever it comes; after the ring it changes nothing.",
     "**Critique**",
     "Only a Yes by the boarding deadline counted"
    ],
    [
     "Afternoon",
     "Test world: the scenario decides what works, not the tester. Success counts only through the real path.",
     "**Testing:** the live test needed honest finishes",
     "A demo where the tester decided what worked"
    ]
   ]
  }
 ],
 "i": [
  {
   "t": "h3",
   "text": "Airplane-mode device test (11:35–11:43)"
  },
  {
   "t": "kv",
   "rows": [
    [
     "**Setup**",
     "One Android phone (a friend's, with permission, read only). The booker's own account. A **past** 1-night stay in India, checked out about 5 weeks earlier. Battery 18% → 16%. Order: online → airplane mode with the app open → swiped closed → force-stopped. 13 screenshots."
    ],
    [
     "**Results**",
     "The trip and reservation pages opened offline every time, even after a force stop, under an \"Error · You're offline right now\" toast. Address text, door code, check-in steps and the host's number didn't show, even online, probably because the trip had ended."
    ],
    [
     "**What it changed**",
     "I can't say \"the app fails offline\". The pack's case is narrower: the door details are on the phone before boarding, a \"saved\" label replaces an error, and co-guests get SMS."
    ],
    [
     "**Limits**",
     "A past trip only, one device. Not tested: iOS, an upcoming trip, a co-guest, a cache older than a few minutes."
    ]
   ]
  },
  {
   "t": "h3",
   "text": "Automated scenario test"
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "**Coverage:** every scenario (9) × network (4: online, weak, SMS only, offline) × battery (2) × plan (confirmed / flipped) × PIN line (on / off): 288 condition combinations, each walked through every path in its scenario, including going offline mid-clock and signal coming back."
    },
    {
     "text": "**Result:** 704 runs, 3,456 screen states, 0 errors after fixes."
    },
    {
     "text": "**What it caught, and I fixed:**",
     "sub": [
      "the daytime check now follows whether the 30 minutes *ended* offline, not how they started;",
      "Priya's SMS can be viewed while the clock runs (before, it couldn't be seen);",
      "a plan change can't rewrite a running clock;",
      "\"Switch\" and \"Cancel\" at boarding need data and end in a final state;",
      "offline copy no longer claims things were sent;",
      "the 112 button's contrast in dark mode;",
      "toasts no longer cover the main actions;",
      "the guard card opens full screen."
     ]
    }
   ]
  },
  {
   "t": "h3",
   "text": "Live test setup"
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "Anyone with the link plays a named scenario. The night plays out as that scenario's worst case: a tap that claims something the scenario doesn't allow gets an in-world reply (\"The door's still locked\") and doesn't finish it. Success counts only through the real path."
    },
    {
     "text": "**It records:** screens, taps, finishes, time to finish, a 1–5 ease rating (\"How easy was that?\") with an optional comment, and refused shortcuts."
    },
    {
     "text": "**It doesn't record:** IPs, cookies or names. The comment box asks for no names or numbers."
    }
   ]
  },
  {
   "t": "h3",
   "text": "Peer-test kit (2 × 10 minutes)"
  },
  {
   "t": "kv",
   "rows": [
    [
     "**Who**",
     "2 peers, ideally one who has taken an overnight bus to a homestay; not designers if possible. Consent said aloud; notes, no recording."
    ],
    [
     "**Setup**",
     "A frozen copy of the door flow, reset to 01:45, offline, 6% battery, plan confirmed. The control panel hidden."
    ],
    [
     "**Task**",
     "Read word for word: 1:45 AM, three friends, 6%, no data, nobody answering: \"get your group into a bed for the night. Think out loud.\""
    ],
    [
     "**During**",
     "At \"No one is answering\" I switch to SMS only; once the clock runs I press +30 min. No help. Stuck for 30 seconds → \"What would you do now?\""
    ],
    [
     "**After**",
     "Did you know who was supposed to let you in? What did \"covered\" mean, and would you pay anything? Anything you'd be scared to tap at 2 AM?"
    ],
    [
     "**What each finding changes**",
     "Bell question not understood → \"Ring G2 once, then tap here\". \"Covered\" read as a free hotel → lead with \"pay at the desk, repaid\". PIN vs Ramesh unclear → one line on who opens. Straight to support → rework the first screen."
    ]
   ]
  }
 ],
 "j": [
  {
   "t": "p",
   "text": "The brief allows any tool, so here is exactly what I used. AI assisted the desk research (every claim tied to a quoted source), the critique rounds and the stress test. I treated all of it as input to argue with: the bets, the direction and every decision in section H are mine, including the advice I rejected (the 10-minute wait, the host fee now, \"Reply BOOK\")."
  },
  {
   "t": "ul",
   "items": [
    {
     "text": "The placeholder photos and 3D icons are AI-generated. They stand in for what a host would upload."
    },
    {
     "text": "The Assamese voice note is a synthetic sample voice, not a real host."
    },
    {
     "text": "The Hindi and Assamese strings are not yet checked by native speakers."
    },
    {
     "text": "The prototype is coded (HTML/JS), not built in Figma."
    },
    {
     "text": "Fonts and icons are substitutes for Airbnb's own: Figtree for Airbnb Cereal, Lucide for Airbnb's icon set, Noto Sans for Devanagari and Bengali script. I matched the visual values by eye to Airbnb iOS screens; this isn't Airbnb's design system."
    }
   ]
  }
 ]
};
