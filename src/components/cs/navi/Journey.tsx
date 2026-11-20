import cs from "../cs.module.css";
import { SectionHead } from "../Primitives";
import j from "./journey.module.css";

/*
  Meera's night, screen by screen: phones on a canvas with the reason for each screen
  beside it (the annotated-journey format). Two screens per row, notes on the outer sides,
  a hairline connector from each note to its phone. Stills are recorded from the live
  prototype in ?demo mode (public/navi/media).
*/

type Stop = { img: string; alt: string; time: string; title: string; why: string };

const ROWS: [Stop, Stop][] = [
  [
    {
      img: "j01-ramesh-yes", alt: "Ramesh's confirmation page in Hindi and English, after he tapped Yes", time: "8:40 PM · Ramesh’s phone",
      title: "The caretaker confirms from an SMS link",
      why: "No app and no login, Hindi first. He picks how late he’ll be awake, so the promise has an end time Airbnb can hold to.",
    },
    {
      img: "j02-board", alt: "Boarding screen: Ramesh hasn't confirmed; switch, go ahead or cancel", time: "9:15 PM · if no one confirms",
      title: "Meera decides while she still has signal",
      why: "Switching to a 24-hour desk is listed first: it’s the only option that guarantees a bed. Cancel says plainly she’ll need somewhere to sleep.",
    },
  ],
  [
    {
      img: "j03-arrival", alt: "Arrival screen offline at 6% battery, labelled Saved 9:12 PM", time: "1:45 AM · at the building",
      title: "Everything is saved, and it says so",
      why: "Airbnb’s app today shows a red “Error” over details that are fine offline. Here it says “Saved 9:12 PM”, and the battery banner says the group has it by SMS.",
    },
    {
      img: "j04-stuck", alt: "What's stopping you? Gate, door, no one here, money, safety", time: "1:46 AM",
      title: "Pick the barrier, not a person to call",
      why: "Each barrier has its own fix that works offline. “Someone wants money” and “I don’t feel safe” skip every question and timer.",
    },
  ],
  [
    {
      img: "j05-guard", alt: "Full-screen guard card in Assamese and Hindi with the society code", time: "At the gate",
      title: "Turn the phone round to the guard",
      why: "The host’s line in the guard’s language, the society code he can check, and a request in Hindi to ring G2. It never claims Airbnb authorises entry.",
    },
    {
      img: "j06-door", alt: "Door lock steps: PIN failed, power bank step, spare key with Ramesh", time: "At the door",
      title: "The host’s steps for this exact lock",
      why: "One step at a time; failed steps marked ✕. The dead-battery fix needs a power bank and cable, which the arrival details told them to carry.",
    },
  ],
  [
    {
      img: "j07-bell", alt: "No one is answering: did you ring Ramesh's bell?", time: "No one opens",
      title: "First: did you ring G2?",
      why: "The guest’s own statement starts the clock. It’s the cheapest fraud check, and it reminds a tired group of the obvious thing to try.",
    },
    {
      img: "j08-clock", alt: "30-minute clock running on the phone with no signal", time: "Waiting",
      title: "30 minutes, running on the phone",
      why: "It works with no signal, with location saved. Ramesh and the host can’t cancel it, and the group doesn’t have to wait outside.",
    },
  ],
  [
    {
      img: "j09-walk", alt: "You're covered tonight: walk to Orchid Inn, pay, repaid by 6 PM", time: "2:15 AM · no data",
      title: "A place, what you pay now, when it comes back",
      why: "With no data: walk 10 minutes to a 24-hour desk, pay, money back by 6 PM on 21 Nov. With data it’s one tap: book with ₹0 to pay. No night ends with “you’re on your own”.",
    },
    {
      img: "j10-priya-sms", alt: "Priya's SMS thread: HELP reply and the covered message", time: "If Meera’s phone dies",
      title: "Priya’s phone has everything too",
      why: "Her number opted in with YES and Meera confirmed it. She can reply HELP or CALL, never cancel, and the same clock and outcome reach her by plain SMS.",
    },
  ],
];

function Note({ stop, side }: { stop: Stop; side: "l" | "r" }) {
  return (
    <div className={`${j.note} ${side === "l" ? j.noteL : j.noteR}`}>
      <p className={j.time}>{stop.time}</p>
      <h4 className={cs.h3}>{stop.title}</h4>
      <p className={cs.small}>{stop.why}</p>
      <span className={j.line} aria-hidden="true" />
    </div>
  );
}

function Phone({ stop }: { stop: Stop }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static still, sized by CSS
    <img className={j.phone} src={`/navi/media/${stop.img}.webp`} alt={stop.alt} loading="lazy" decoding="async" />
  );
}

export function Journey() {
  return (
    <section className={j.journey} aria-label="Meera's night, screen by screen">
      <SectionHead
        label="The screens"
        title="Meera’s night, screen by screen"
        lead={<p className={cs.body}>Recorded from the live prototype. Each note is the reason that screen exists.</p>}
      />
      <div className={j.canvas}>
        {ROWS.map(([a, b]) => (
          <div className={j.row} key={a.img}>
            <Note stop={a} side="l" />
            <Phone stop={a} />
            <Phone stop={b} />
            <Note stop={b} side="r" />
          </div>
        ))}
      </div>
    </section>
  );
}
