/* "Confirmed before you board": prototype logic.
   Simulated: time (DS time), network and battery (DS), plan status, whose phone.
   Rules mirror Navi_Define.md / Navi_Direction.md (Fri 20 Nov ~12:00):
   - ONE 30-min clock, started by the guest's statement (rang G2 / the guard rang G2), running on the phone with or without signal;
   - two money layers, by fault:
       1 "your night moves with you" (Rs 1,500): anyone who rang, waited and wasn't let in, confirmed or not.
         Host-funded when the host owns access; Airbnb-funded for a declared late bus after a failed re-ping.
       2 "Covered tonight": top-up to Rs 3,000 in total with the cab, only after a confirmed Yes failed inside the window;
   - every last screen names a place, what you pay now, and when money comes back. */
(function () {
  const WAIT = 30;
  const AWAKE_UNTIL = "03:00";
  const SCEN = [
    { id: "ramesh", label: "Ramesh confirms (his phone)", cap: "20:40. Ramesh opens the SMS link. No app, no account. Hindi first, English under it.", stack: ["ramesh"], ds: { time: "20:40", net: "online", battery: 71 } },
    { id: "board", label: "Not confirmed at boarding", cap: "21:15 at the bus station, with signal. Ramesh hasn't said yes. Meera decides now, not at the gate.", stack: ["board"], plan: "unconfirmed", ds: { time: "21:15", net: "online", battery: 48 } },
    { id: "pack", label: "At the building, details saved", cap: "01:45, 6% battery, no signal. Ramesh confirmed. Everything needed is saved on the phone.", stack: ["pack"] },
    { id: "gate", label: "The guard won't open", cap: "Show the guard card: Rohan's line in the guard's language, the society code, and a request to ring Ramesh.", stack: ["pack", "stuck", "gate"] },
    { id: "door", label: "The lock is dead", cap: "The host's steps for this lock, one at a time. Each ends in \"Still locked\".", stack: ["pack", "stuck", "door"] },
    { id: "asleep", label: "Ramesh is asleep: covered", cap: "Answer the bell question, then press +30 min. Try going offline: the clock keeps running and the screen gives a walking route.", stack: ["pack", "stuck", "noone"], ds: { net: "sms" } },
    { id: "late", label: "The bus is 90 min late", cap: "03:15, after Ramesh's 3 AM, and he didn't answer the re-check. Nobody's fault: Airbnb moves the night, with no top-up.", stack: ["pack", "stuck", "noone"], late: true, ds: { time: "03:15", net: "sms" } },
    { id: "unconf", label: "Not confirmed, no one opens", cap: "Meera went ahead without a Yes. The night still moves with her (host's payout, existing policy); the extra (up to ₹1,500) for a bed and cab doesn't apply.", stack: ["pack", "stuck", "noone"], plan: "unconfirmed", ds: { net: "sms" } },
    { id: "coguest", label: "Meera's phone is dead: co-guest SMS", cap: "What Priya's phone got: an opt-in with no address, then the arrival details, then the guard line. She can reply HELP or CALL.", stack: ["sms"] }
  ];
  const fresh = () => ({ stack: ["pack"], scen: "pack", plan: "confirmed", pinShare: "yes", late: false, t0: null, layer: null, offStart: false, log: [], lockStep: 0, bell: null, from: null, reason: "noone", allIn: false, ramesh: "ask", until: "03:00" });
  let S = fresh();

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const toMin = t => { const [h, m] = t.split(":").map(Number); return (h < 12 ? h + 24 : h) * 60 + m; };
  const fromMin = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  // display only: "01:45" -> "1:45 AM" (Airbnb shows 12-hour times; logic keeps 24-hour strings)
  const hm = t => { const [h, m] = t.split(":").map(Number); return (h % 12 || 12) + ":" + String(m).padStart(2, "0") + (h < 12 ? " AM" : " PM"); };
  const arrival = () => (S.late ? "03:15" : "01:45");
  const now = () => DS.get().time;
  const net = () => DS.get().net;
  const canCall = () => net() !== "offline";
  const noData = () => net() === "offline" || net() === "sms";
  const cur = () => S.stack[S.stack.length - 1];
  const inWindow = () => toMin(now()) >= toMin(arrival()) - 30 && toMin(now()) <= toMin(AWAKE_UNTIL);
  const fullLayer = () => S.plan === "confirmed" && inWindow();          // layer 2 possible
  const layerNow = () => S.layer || (fullLayer() ? "full" : "night");
  // who funds layer 1 when layer 2 doesn't apply
  const funder = () => S.plan !== "confirmed" ? "host" : S.late ? "airbnb" : "review";

  function go(id) { if (cur() !== id) S.stack.push(id); onEnter(id); render(); $("#screens").scrollTop = 0; }
  function back() { if (S.stack.length > 1) S.stack.pop(); render(); }
  function addLog(who, what, icon = "phone-missed") { S.log.push({ t: now(), who, what, icon }); }

  function startClock(why) {
    if (S.t0 !== null || !(S.bell === "yes" || S.reason === "money")) return;
    S.t0 = now(); S.layer = fullLayer() ? "full" : "night"; S.offStart = !canCall();
    if (why) addLog("Group", why, "flag");
    if (S.offStart) addLog("Your phone", "No signal: timer started on this phone, location saved. Sent when signal returns", "map-pin");
  }

  function onEnter(id) {
    if (id === "noone") startClock(S.reason === "money" ? "Reported someone asking for money at the door" : null);
    if (id === "in") S.allIn = false;
  }

  /* ---------- the fallback stays (chosen at boarding, saved on the phone) ---------- */
  const STAY_LIST = [
    { name: "Orchid Inn", walk: "10 min walk", addr: "100 Feet Rd, next to metro pillar 118", price: "from ₹2,200 for 4", tel: "080 4123 XXXX" },
    { name: "Stayz Residency", walk: "18 min walk", addr: "12th Main, HAL 2nd Stage", price: "from ₹2,600 for 4", tel: "080 4567 XXXX" }
  ];
  const staysHTML = () => STAY_LIST.map((s, i) => `<div class="person${i ? " mt-16" : ""}"><span class="stay__ic"><i data-lucide="building-2"></i></span><div class="person__body"><div class="step-row__t">${s.name} · ${s.walk}</div><div class="step-row__s">${s.addr} · 24-hour desk · ${s.price}</div></div><button class="c-iconbtn c-iconbtn--outline" aria-label="Call ${s.name}" data-needs="cell" data-toast="Calling ${s.name}'s 24-hour desk…"><i data-lucide="phone"></i></button></div>`).join("");
  const WALK = "Out of the gate, turn left, then straight for 800 m. It's next to metro pillar 118 on 100 Feet Rd.";

  /* ---------- renderers ---------- */
  function renderPlanStatus() {
    $("#planStatus").innerHTML = S.plan === "confirmed"
      ? `<div class="c-callout"><span class="c-callout__icon c-callout__icon--ok"><i data-lucide="check"></i></span><div><div class="c-callout__title">Ramesh confirmed at 9:10 PM. He's awake until 3 AM</div><div class="c-callout__text">Rohan approved your 1:45 AM arrival and chose Ramesh, the caretaker, to let you in. If no one opens within 30 minutes of ringing G2, before 3 AM, you're covered tonight.</div></div></div>`
      : `<div class="c-callout"><span class="c-callout__icon c-callout__icon--warn"><i data-lucide="alert-triangle"></i></span><div><div class="c-callout__title">Ramesh hadn't confirmed when you boarded</div><div class="c-callout__text">You chose to go ahead. If no one opens within 30 minutes of ringing G2, your night moves with you: your ₹1,500 goes to a hotel nearby that's open all night. The extra (up to ₹1,500) for a bed and cab doesn't apply.</div></div></div>`;
  }

  const LOCK = [
    { title: "Enter the PIN, then #", body: `<div class="pin"><div class="pin__label">Door PIN</div><div class="pin__value">4819 #</div><div class="pin__meta">Your host resets it after your stay</div></div>`, ask: true },
    { title: "Keypad dark, or a red light?", body: `<p class="p">The lock's battery is dead. Connect a power bank to the <b>USB-C port under the keypad</b> with a cable. Keep it connected while you enter the PIN.</p><p class="fine mt-8">Keypad lit but nothing happens? It may be in privacy mode: press <b>✱</b> for 3 seconds first.</p><p class="warnline" data-lowbatt-warn>Your phone is at <span data-bind="battery"></span>. Use a co-guest's power bank, not your phone.</p>`, ask: true },
    { title: "Spare key with Ramesh", body: `<p class="p">Ground floor, flat G2. Ring once and wait a minute.</p>`, ask: false }
  ];
  function renderLock() {
    const low = DS.get().lowBattery;
    $("#lockSteps").innerHTML = `<h2 class="h2">Steps from your host</h2>` + LOCK.map((st, i) => {
      if (i < S.lockStep) return `<div class="lock__done"><span class="numlist__n numlist__n--done"><i data-lucide="check"></i></span><span>${st.title}</span><span class="lock__tag">Didn't work</span></div>`;
      if (i > S.lockStep) return "";
      const actions = st.ask
        ? `<div class="btn-row mt-16"><button class="c-btn c-btn--primary" data-go="in">It opened</button><button class="c-btn c-btn--outline" data-lock-next>Still locked</button></div>`
        : `<div class="btn-row mt-16"><button class="c-btn c-btn--primary" data-needs="cell" data-call="Ramesh"><i data-lucide="phone"></i>Call Ramesh</button><button class="c-btn c-btn--outline" data-go="noone">No answer</button></div><p class="c-needs-note c-needs-note--cell">No signal. Calls can't go out.</p>`;
      return `<div class="lock__card"><div class="lock__head"><span class="numlist__n numlist__n--on">${i + 1}</span><span class="step-row__t">${st.title}</span></div><div class="lock__body">${st.body}${actions}</div></div>`;
    }).join("") + `<button class="c-btn c-btn--text mt-8" data-go="in">We're in</button>`;
    $$("[data-lowbatt-warn]").forEach(e => (e.style.display = low ? "block" : "none"));
  }

  function logHTML() {
    const a = toMin(arrival());
    const prior = S.plan === "confirmed" ? [
      ...(S.late ? [{ t: "02:40", who: "Airbnb", what: "Bus late: asked Ramesh to stay up until 3:15 AM. No reply", icon: "phone-missed" }] : []),
      { t: fromMin(a - 20), who: "Airbnb", what: "Wake-up call to Ramesh: no answer", icon: "phone-missed" },
      { t: fromMin(a - 15), who: "Airbnb", what: "Called host Rohan: no answer, group told by SMS", icon: "phone-missed" }
    ] : [];
    const rows = [...prior, ...S.log];
    if (!rows.length) return "";
    return `<h2 class="h2">Logged attempts</h2><p class="fine" style="margin:-8px 0 12px">Your host sees these too. Calls go through Airbnb's line.</p>
      <ul class="log">${rows.map(r => `<li><span class="log__ic"><i data-lucide="${r.icon || "phone-missed"}"></i></span><div><div class="log__t">${r.what}</div><div class="log__m">${hm(r.t)} · ${r.who}</div></div></li>`).join("")}</ul>`;
  }

  function renderNoone() {
    const el = $("#nooneBody");
    const money = S.reason === "money", gate = S.from === "gate";
    const layer = layerNow();
    const callRows = `<section class="sec"><h2 class="h2">Keep trying</h2>
      <div class="btn-row"><button class="c-btn c-btn--primary" data-needs="cell" data-call="Ramesh"><i data-lucide="phone"></i>Ramesh</button><button class="c-btn c-btn--outline" data-needs="cell" data-call="Host Rohan"><i data-lucide="phone"></i>Host</button></div>
      <p class="fine mt-8">Through Airbnb's line, so every call is logged.</p>
      <p class="c-needs-note c-needs-note--cell">No signal. Calls can't go out.</p></section>`;
    const support = `<section class="sec sec--list"><button class="c-row" data-needs="cell" data-toast="Calling Airbnb support (000 800 4405 103)…"><i data-lucide="headphones"></i><span class="c-row__body"><span class="c-row__title">Call Airbnb Support</span><span class="c-row__sub">24 hours · they already have your call log</span></span><i data-lucide="chevron-right" class="c-row__chev"></i></button>
      <button class="c-row" data-open-sheet="safety"><img class="icon3d icon3d--row" src="assets/icons3d/safety.png" alt=""><span class="c-row__body"><span class="c-row__title">I don't feel safe</span><span class="c-row__sub">No waiting</span></span><i data-lucide="chevron-right" class="c-row__chev"></i></button></section>`;
    const staysSec = `<hr class="sep"><section class="sec"><h2 class="h2">Open all night, nearby</h2>${staysHTML()}<p class="fine mt-12">Once you've rung G2, you can go: the 30 minutes keep running on this phone.</p></section>`;
    const head = (title, sub) => `<div class="head-row"><div><h1 class="h1">${title}</h1><p class="sub">${sub}</p></div><img class="icon3d icon3d--head" src="assets/icons3d/noone.png" alt=""></div>`;
    const log = logHTML();
    const logSec = log ? `<hr class="sep"><section class="sec">${log}</section>` : "";

    // headline and context for each situation
    let title = money ? "Someone wants money" : "No one is answering";
    let sub = S.plan !== "confirmed" ? "Ramesh didn't confirm before you boarded."
      : !inWindow() && S.t0 === null ? "Ramesh's hours ended at 3 AM."
      : "Ramesh confirmed he'd be awake until 3 AM.";
    let context = "";
    if (S.plan !== "confirmed") {
      context = `<div class="c-callout mt-24"><span class="c-callout__icon"><i data-lucide="arrow-right-left"></i></span><div><div class="c-callout__title">Your ₹1,500 night still moves with you</div><div class="c-callout__text">Ring G2 and wait 30 minutes. If no one opens, your ₹1,500 goes to a hotel nearby that's open all night; you pay any difference. The extra (up to ₹1,500) for a bed and cab doesn't apply, since Ramesh didn't confirm.</div></div></div>`;
    } else if (layer === "night" && S.t0 === null) {
      if (S.late && !money) { title = "Ring G2 once. He may still open"; sub = "Your bus ran late. Ramesh didn't reply when we checked at 2:40 AM, and he's only awake until 3 AM."; }
      context = `<div class="c-callout mt-24"><span class="c-callout__icon"><i data-lucide="arrow-right-left"></i></span><div><div class="c-callout__title">If no one opens in 30 minutes, your night moves with you</div><div class="c-callout__text">${S.late
        ? "Nobody chose the delay, so Airbnb moves your ₹1,500 to Orchid Inn (10 min walk). You pay the rest, from ₹700. The extra (up to ₹1,500) for a bed and cab only applies during Ramesh's hours."
        : "Your ₹1,500 goes to a hotel nearby that's open all night. We check the call log in the morning. The extra (up to ₹1,500) for a bed and cab only applies during Ramesh's hours."}</div></div></div>`;
    }

    // 1) the guest's own statement comes first (not needed when someone is demanding money)
    if (!money && S.bell !== "yes") {
      const q = gate ? "Did the guard ring G2 on the intercom?" : "Did you ring Ramesh's bell?";
      const qs = gate ? "Ramesh, the caretaker, is in G2. The guard card asks the guard to ring him." : "Ground floor, flat G2, next to the lift. He may just be asleep.";
      const wait = gate ? "Show the guard card. It asks him to ring G2." : "Ring once and wait a minute. Then come back here.";
      el.innerHTML = head(title, sub) + context +
        `<div class="status-card mt-16"><div class="step-row__t">${q}</div><div class="step-row__s">${qs}</div>
          ${S.bell === "notyet" ? `<p class="p mt-12">${wait}</p>` : ""}
          <div class="btn-row mt-16"><button class="c-btn c-btn--primary" data-bell="yes">${S.bell === "notyet" ? "Done, no answer" : "Yes, no answer"}</button><button class="c-btn c-btn--outline" data-bell="notyet">Not yet</button></div></div>
        ${layer === "night" ? staysSec : ""}<hr class="sep mt-24">${callRows}${logSec}<hr class="sep">${support}`;
      return;
    }

    // 2) the clock is running (on the phone, signal or not)
    const elapsed = Math.max(0, toMin(now()) - toMin(S.t0));
    const left = Math.max(0, WAIT - elapsed);
    const pct = Math.min(100, Math.round(100 * elapsed / WAIT));
    const at = fromMin(toMin(S.t0) + WAIT);
    const low = DS.get().lowBattery;
    const full = layer === "full";
    const subRang = money ? "Don't pay. Your stay is already paid." : gate ? "The guard rang G2. Ramesh isn't answering." : "You rang G2. Ramesh isn't answering.";
    el.innerHTML = head(money ? "Someone wants money" : "No one is answering", subRang) +
      `<div class="status-card mt-24">
        ${left > 0
          ? (full ? `<div class="step-row__t">Covered tonight from ${hm(at)} if no one lets you in</div><div class="step-row__s">Up to ₹3,000 in total with the cab · ${left} min to go</div>`
                  : `<div class="step-row__t">Your night moves with you from ${hm(at)}</div><div class="step-row__s">₹1,500 toward a hotel nearby, open all night · ${left} min to go</div>`)
          : (full ? `<div class="step-row__t">You're covered tonight</div><div class="step-row__s">30 minutes and no one let you in</div>`
                  : `<div class="step-row__t">Your ₹1,500 night has moved</div><div class="step-row__s">30 minutes and no one let you in</div>`)}
        <div class="meter mt-12" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Time waited"><div class="meter__fill" style="width:${Math.max(pct, 3)}%"></div></div>
        ${left > 0 ? `<p class="fine mt-12">You don't have to wait outside. We'll keep calling Ramesh, and your report is saved: Ramesh and Rohan can't cancel it.</p>` : ""}
        ${left === 0 ? `<button class="c-btn c-btn--brand c-btn--block c-btn--lg mt-16" data-go="covered">See where to go</button>` : ""}
      </div>
      ${!canCall() ? `<div class="c-callout mt-12"><span class="c-callout__icon"><i data-lucide="wifi-off"></i></span><div><div class="c-callout__title">No signal. The timer still runs on this phone</div><div class="c-callout__text">Your location is saved here. If the 30 minutes end before you get signal, it still counts. We check your saved location in the morning, then pay you back.</div></div></div>` : ""}
      <div class="btn-row mt-12"><button class="c-btn c-btn--outline" data-knock><i data-lucide="door-closed"></i>Knocked at G2</button><button class="c-btn c-btn--outline" data-go="in">Ramesh is here</button></div>
      ${low ? `<div class="c-callout mt-12"><span class="c-callout__icon c-callout__icon--err"><i data-lucide="battery-low"></i></span><div><div class="c-callout__title">Save your battery</div><div class="c-callout__text">Priya, Arjun or Kabir can reply CALL to the SMS. Their calls count too.</div></div></div>` : ""}
      ${staysSec}<hr class="sep">${callRows}${logSec}<hr class="sep">${support}`;
  }

  function renderCovered() {
    const full = layerNow() === "full";
    const later = S.offStart;
    const f = funder();
    $("#coveredTitle").textContent = full ? "You're covered tonight" : "Your night moves with you";
    $("#coveredSub").textContent = full ? "Ramesh said he'd be here, so this one isn't on you."
      : f === "airbnb" ? "Nobody chose the bus delay, so Airbnb covers your ₹1,500 night."
      : f === "host" ? "No one let you in, so your ₹1,500 comes from the host's payout, under Airbnb's existing rules."
      : "Your ₹1,500 moves now. We check the call log in the morning.";
    const repay = full ? "up to ₹3,000 in total with the cab," : "your ₹1,500";
    let hero;
    if (!noData() && !later) {
      hero = full
        ? `<div class="c-callout"><span class="c-callout__icon c-callout__icon--ok"><i data-lucide="check"></i></span><div><div class="c-callout__title">Book Orchid Inn · you pay ₹0</div><div class="c-callout__text">Rooms for 4, ₹2,200. Your ₹1,500 night plus ₹700 extra are applied when you book. 10 min walk. Taking a cab? Keep the receipt: up to ₹3,000 in total with the cab, back by 6 PM on 21 Nov.</div>
            <button class="c-btn c-btn--brand c-btn--block mt-12" data-toast="Opens Orchid Inn with ₹2,200 applied: you pay ₹0">Book Orchid Inn</button></div></div>`
        : `<div class="c-callout"><span class="c-callout__icon c-callout__icon--ok"><i data-lucide="check"></i></span><div><div class="c-callout__title">Book Orchid Inn with your ₹1,500</div><div class="c-callout__text">Rooms for 4 from ₹2,200, 10 min walk. Your night's ₹1,500 is applied; you pay the rest, from ₹700.</div>
            <button class="c-btn c-btn--brand c-btn--block mt-12" data-toast="Opens Orchid Inn with ₹1,500 applied">Book Orchid Inn</button></div></div>`;
    } else {
      hero = `<div class="c-callout"><span class="c-callout__icon c-callout__icon--ok"><i data-lucide="footprints"></i></span><div><div class="c-callout__title">Walk to Orchid Inn now · 10 min</div><div class="c-callout__text">${WALK} Ask the 24-hour desk for rooms for 4. Pay there and keep the receipts: ${repay} back by 6 PM on 21 Nov${later ? ", after we check your saved location" : ""}.</div>
          ${canCall() ? `<button class="c-btn c-btn--primary c-btn--block mt-12" data-toast="Calling Orchid Inn's 24-hour desk…"><i data-lucide="phone"></i>Call the desk first</button>` : ""}</div></div>`;
    }
    $("#coveredHero").innerHTML = hero;
    $("#coveredAmount").innerHTML = full
      ? `<div class="amount__row"><span>Tonight's stay, moved</span><span>₹1,500</span></div><div class="amount__row"><span>Extra for a bed and cab nearby</span><span>up to ₹1,500</span></div><div class="amount__row amount__row--total"><span>Covered tonight, in total with the cab</span><span>up to ₹3,000</span></div>`
      : `<div class="amount__row"><span>Tonight's stay, moved</span><span>₹1,500</span></div><div class="amount__row"><span>Orchid Inn, rooms for 4</span><span>from ₹2,200</span></div><div class="amount__row amount__row--total"><span>You pay the difference</span><span>from ₹700</span></div>`;
    $("#coveredStays").innerHTML = staysHTML();
    $("#coveredLog").innerHTML = logHTML();
  }

  function renderSMS() {
    const t0 = S.t0, at = t0 ? fromMin(toMin(t0) + WAIT) : null;
    const covered = t0 && toMin(now()) - toMin(t0) >= WAIT;
    const full = layerNow() === "full";
    const msgs = [
      ["in", "20:05", "Meera added this number to her Airbnb trip. Reply YES to get the arrival details, or STOP."],
      ["out", "20:06", "YES"],
      ["in", "20:06", "Thanks. Meera will confirm it's you in her app."],
      ["in", "21:12", `Your Airbnb trip tonight: arrival details, check-in about 1:45 AM\nLakeview Residency, Flat 3B, Indiranagar. Opposite metro pillar 112\nGate: Block B, guard cabin on the right. Code 482913\n${S.pinShare === "yes"
        ? "Door: 3rd floor, 2nd door. PIN 4819# (Rohan shared it with your group)"
        : "Door: 3rd floor, 2nd door. Ramesh opens it for you"}\nBackup: Ramesh (caretaker, flat G2). Reply CALL to ring him\nCarry ID for all 4. Your stay is paid: no one should ask you for money\nIf no one opens: Orchid Inn, 24-hour desk, 10 min walk, 100 Feet Rd by metro pillar 118 (080 4123 XXXX). Stayz, 18 min (080 4567 XXXX)\nStuck? Reply HELP or open <a href="#" data-toast="Opens the light help page (needs data)">abnb.me/x7Q2</a>`],
      ["in", "21:12", `For the guard: <span lang="as" style="font-family:'Noto Sans Bengali',sans-serif">এওঁলোক ফ্লেট 3B ৰ অতিথি। অনুগ্ৰহ কৰি সোমাবলৈ দিয়ক।</span> Please ring G2 (Ramesh) on the intercom.`],
      ...(S.plan === "confirmed"
        ? [["in", "21:13", "Ramesh confirmed he'll be awake until 3 AM."],
           ...(S.late ? [["in", "02:40", "Your bus is running late (now about 3:15 AM). We've asked Ramesh to stay up."], ["in", "02:50", "Ramesh hasn't replied, and he's only awake until 3 AM. When you arrive, ring G2 once. If no one opens in 30 minutes, Meera's Rs 1,500 goes to Orchid Inn, 10 min walk from the gate. You pay the rest, from Rs 700. Once you've rung, you can walk there while the 30 minutes run."]] : []),
           ["in", fromMin(toMin(arrival()) - 15), "Ramesh didn't answer our wake-up call. We're calling host Rohan."]]
        : [["in", "21:15", "Ramesh hasn't confirmed. Meera chose to go ahead. If no one opens within 30 minutes of ringing G2, her Rs 1,500 goes to a hotel nearby that's open all night. You pay any difference. No extra money for a bed and cab."]]),
      ...(t0 ? [["out", t0, "HELP"], ["in", t0, `Got it. Keep ringing G2, or ask the guard to. Calls are logged. If no one lets you in by ${hm(at)}, ${full ? "you're all covered tonight: up to Rs 3,000 in total with the cab" : "Meera's Rs 1,500 goes to a hotel nearby that's open all night; you pay any difference"}. Reply CALL to ring Ramesh.`]] : []),
      ...(covered ? [["in", at, `${full ? "You're all covered tonight: up to Rs 3,000 in total with the cab." : "Meera's Rs 1,500 night has moved."} Walk to Orchid Inn: out of the gate, left, 800 m, next to metro pillar 118. Pay at the 24-hour desk and keep the receipt. ${full ? "Meera gets up to Rs 3,000 in total with the cab back by 6 PM on 21 Nov." : "Meera gets Rs 1,500 back by 6 PM on 21 Nov. You pay the rest, from Rs 700."}`]] : [])
    ];
    $("#smsThread").innerHTML = `<div class="c-chat__day">Today</div>` + msgs.map(([d, t, x]) =>
      `<span class="c-msg__meta ${d === "out" ? "c-msg__meta--out" : ""}">${hm(t)}</span><div class="sms ${d === "out" ? "sms--out" : ""}">${x}</div>`).join("") +
      `<p class="fine center mt-12" style="padding:0 16px">This number can reply HELP or CALL. Only Meera can cancel or change times.</p>`;
  }

  function renderRamesh() {
    const chips = ["02:00", "03:00", "04:00"].map(u => `<button class="chip" aria-pressed="${S.until === u}" data-until="${u}">${u.replace(/^0/, "")} AM</button>`).join("");
    const states = {
      ask: `<h2 class="h2 mt-24" lang="hi" style="font-family:'Noto Sans Devanagari',var(--font)">क्या आप उन्हें अंदर आने देने के लिए जागे रहेंगे?</h2>
        <p class="sub" style="margin-top:-8px">Will you be awake to let them in?</p>
        <p class="fine mt-16">जागे रहेंगे · Awake until</p><div class="chips mt-8">${chips}</div>
        <div class="stack-sm mt-24">
          <button class="c-btn c-btn--primary c-btn--block c-btn--lg" data-ramesh="yes"><span lang="hi">हाँ</span> · Yes, I'll be awake</button>
          <button class="c-btn c-btn--outline c-btn--block" data-ramesh="else"><span lang="hi">कोई और</span> · Someone else will</button>
          <button class="c-btn c-btn--outline c-btn--block" data-ramesh="no"><span lang="hi">नहीं</span> · I can't</button>
        </div>
        <p class="fine mt-16"><span lang="hi">आने से 20 मिनट पहले Airbnb आपको 080 4718 XXXX से कॉल करेगा।</span> About 20 minutes before they arrive, Airbnb will call you from 080 4718 XXXX. Save this number. Press 1 to say you're awake.</p>
        <p class="fine mt-8">No app or account needed.</p>`,
      yes: `<div class="center mt-24"><span class="done-tick"><i data-lucide="check"></i></span><h2 class="h2" lang="hi" style="font-family:'Noto Sans Devanagari',var(--font)">धन्यवाद, रमेश</h2><p class="sub" style="margin-top:-8px">Thanks, Ramesh. We've told Meera and Rohan.</p></div>
        <div class="web__card mt-24"><div class="step-row__t">Awake until ${S.until.replace(/^0/, "")} AM</div><div class="step-row__s">We'll call you from 080 4718 XXXX at about 1:25 AM. If their bus runs late, we'll text you to check you're still OK.</div></div>
        <button class="c-btn c-btn--outline c-btn--block mt-16" data-ramesh="no">Plans changed? I can't anymore</button>`,
      else: `<div class="web__card mt-24"><div class="step-row__t">Thanks. We've asked Rohan to choose someone else</div><div class="step-row__s">You won't get any more messages about tonight.</div></div>`,
      no: `<div class="web__card mt-24"><div class="step-row__t">Thanks for telling us</div><div class="step-row__s">We've let Rohan and Meera know now, so they can plan before the bus leaves.</div></div>`
    };
    $("#rameshBody").innerHTML = states[S.ramesh];
  }

  function renderIn() { $("#inAsk").hidden = S.allIn; $("#inDone").hidden = !S.allIn; }

  function renderHarness() {
    $$("[data-hx]").forEach(g => $$("button", g).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === S[g.dataset.hx]))));
    $("#jump").innerHTML = SCEN.map((s, i) => `<button data-scen="${s.id}" aria-current="${S.scen === s.id}"><b>${i + 1}</b> ${s.label}</button>`).join("");
    const sc = SCEN.find(s => s.id === S.scen); $("#caption").textContent = sc ? sc.cap : "";
  }

  function render() {
    const id = cur();
    if (id !== "gate") $("#guardMode").hidden = true;
    $$(".screen").forEach(s => s.classList.toggle("is-active", s.dataset.screen === id));
    $("#phone").dataset.app = id === "sms" ? "sms" : id === "ramesh" ? "web" : "airbnb";
    renderPlanStatus(); renderLock(); renderNoone(); renderSMS(); renderCovered(); renderRamesh(); renderIn(); renderHarness();
    document.dispatchEvent(new Event("app:rendered"));
    DS.refreshIcons();
    const st = DS.get(); $$("[data-bind='battery']").forEach(e => (e.textContent = st.battery + "%")); $$("[data-bind='time']").forEach(e => (e.textContent = hm(st.time)));
  }

  function runScenario(id) {
    const sc = SCEN.find(s => s.id === id); if (!sc) return;
    const pin = S.pinShare;
    S = fresh(); S.pinShare = pin; S.scen = id; S.stack = [...sc.stack];
    if (sc.plan) S.plan = sc.plan;
    if (sc.late) S.late = true;
    DS.set({ time: "01:45", net: "offline", battery: 6, ...(sc.ds || {}) });
    onEnter(cur()); render(); $("#screens").scrollTop = 0;
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a"); if (!t) return;
    if (t.dataset.reason) S.reason = t.dataset.reason;
    if (t.dataset.from) S.from = t.dataset.from;
    if (t.dataset.go) { e.preventDefault(); go(t.dataset.go); }
    if (t.hasAttribute("data-back")) { if (cur() === "noone") { S.reason = "noone"; S.from = null; } back(); }
    if (t.hasAttribute("data-open-guard")) { const g = $("#guardMode"); g.hidden = false; $("[data-close-guard]", g).focus(); }
    if (t.hasAttribute("data-close-guard")) $("#guardMode").hidden = true;
    if (t.hasAttribute("data-voice-note")) {
      const label = t.querySelector("span"); if (t.dataset.playing) return;
      const idle = label.dataset.idle || (label.dataset.idle = label.textContent);
      t.dataset.playing = "1"; label.textContent = "Playing… 0:09";
      const done = () => { delete t.dataset.playing; label.textContent = idle; };
      const a = new Audio("assets/audio/rohan_note_as.mp3");   // prototype: ElevenLabs Assamese sample voice
      a.addEventListener("ended", done); a.addEventListener("error", done);
      a.play().catch(done);
    }
    if (t.hasAttribute("data-lock-next")) { S.lockStep = Math.min(LOCK.length - 1, S.lockStep + 1); render(); }
    if (t.dataset.bell) {
      S.bell = t.dataset.bell;
      if (S.bell === "yes") { addLog("You", S.from === "gate" ? "Guard rang G2 on the intercom: no answer" : "Rang Ramesh's bell at G2: no answer", "bell"); startClock(); }
      render();
    }
    if (t.hasAttribute("data-knock")) { addLog("You", "Knocked at G2: no answer", "door-closed"); DS.toast("Logged: knocked at G2", $("#phone")); render(); }
    if (t.dataset.call) {
      if (!canCall()) return;
      addLog("You", `Called ${t.dataset.call} (Airbnb line): no answer`);
      DS.toast(`Calling ${t.dataset.call} through Airbnb's line… (Prototype: no answer, logged)`, $("#phone"));
      render();
    }
    if (t.dataset.allIn) {
      if (t.dataset.allIn === "yes") { S.allIn = true; render(); }
      else { DS.toast("Tap We're in again when everyone is inside.", $("#phone")); back(); }
    }
    if (t.dataset.board) {
      if (t.dataset.board === "go") {
        S.plan = "unconfirmed"; S.stack = ["pack"]; S.scen = "pack";
        DS.set({ time: "01:45", net: "offline", battery: 6 });
        DS.toast("Prototype: skipping ahead to 1:45 AM, at the building", $("#phone"));
      } else DS.toast(t.dataset.board === "cancel"
        ? "Cancelled. ₹1,500 back to your card. You have no stay booked for tonight."
        : "Switched to Orchid Inn (24-hour desk); your ₹1,500 went toward it. (Prototype: this path ends here.)", $("#phone"));
      render();
    }
    if (t.dataset.until) { S.until = t.dataset.until; render(); }
    if (t.dataset.ramesh) { S.ramesh = t.dataset.ramesh; render(); }
    if (t.dataset.scen) runScenario(t.dataset.scen);
    const hx = t.closest("[data-hx]");
    if (hx && t.dataset.v) {
      S[hx.dataset.hx] = t.dataset.v;
      if (hx.dataset.hx === "plan") { S.t0 = null; S.layer = null; S.log = []; S.bell = null; }
      render();
    }
    if (t.dataset.advance) { DS.set({ time: fromMin(toMin(now()) + Number(t.dataset.advance)) }); }
    if (t.hasAttribute("data-reset-demo")) runScenario("pack");
  });
  document.addEventListener("ds:change", () => { if (document.readyState !== "loading") render(); });

  function init() {
    let first = true;
    try { first = !localStorage.getItem("navi-proto-started-v6"); localStorage.setItem("navi-proto-started-v6", "1"); } catch (e) {}
    if (first) { runScenario("pack"); return; }
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
