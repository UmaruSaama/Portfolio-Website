/* Prototype state + small helpers. No build step, no framework.
   The state lives on every .device element as data-attributes, so CSS can
   react to it (offline greys out [data-needs="data"], the low-battery
   banner appears, and so on). Screens can listen for the "ds:change" event. */
(function () {
  const KEY = "navi-ds-state";
  const defaults = { net: "online", battery: 62, theme: "light", time: "01:45", live: "on" };
  let state = { ...defaults };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}

  /* Live clock + battery drain, modelled on an iPhone 17 with the screen on.
     Base rate: Tom's Guide's continuous web-browsing test over 5G at 150 nits ran an iPhone 17
     for 12 h 47 min, about 7.8% an hour. Weak or no signal makes the modem work harder, so it
     drains faster; those multipliers are assumptions, not measurements. */
  const DRAIN = { online: 7.8, sms: 7.8 * 1.2, offline: 7.8 * 1.3, weak: 7.8 * 1.5 };   // % per hour
  const toMin = t => { const [h, m] = String(t).split(":").map(Number); return (h < 12 ? h + 24 : h) * 60 + m; };
  const fromMin = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };

  const NET = {
    online:  { bars: 4, label: "4G",  wifi: false },
    weak:    { bars: 1, label: "E",   wifi: false },
    sms:     { bars: 2, label: "",    wifi: false },   // calls and SMS work, no mobile data
    offline: { bars: 0, label: "No service", wifi: false }
  };

  function statusBarHTML() {
    const n = NET[state.net] || NET.online;
    const bars = [1, 2, 3, 4].map(i => `<i class="${i <= n.bars ? "" : "off"}"></i>`).join("");
    const pct = Math.max(1, Math.min(100, Number(state.battery)));
    return `<span>${state.time}</span>
      <span class="c-status__right">
        <span class="c-signal" aria-hidden="true">${bars}</span>
        ${n.label ? `<span class="c-net-label">${n.label}</span>` : ""}
        <span class="c-battery" role="img" aria-label="Battery ${pct}%">
          <span class="c-battery__body"><span class="c-battery__num">${pct}</span><span class="c-battery__fill" style="width:${pct}%"><span class="c-battery__num">${pct}</span></span></span><span class="c-battery__cap"></span>
        </span>
      </span>`;
  }

  function apply() {
    const low = Number(state.battery) <= 20;
    document.querySelectorAll(".device").forEach(d => {
      d.dataset.net = state.net;
      d.dataset.battery = state.battery;
      d.dataset.lowbatt = String(low);
      d.dataset.theme = state.theme;
      d.querySelectorAll(".c-status").forEach(s => (s.innerHTML = statusBarHTML()));
      d.querySelectorAll("[data-bind='battery']").forEach(el => (el.textContent = state.battery + "%"));
      d.querySelectorAll("[data-bind='time']").forEach(el => (el.textContent = state.time));
    });
    document.querySelectorAll("[data-ds-control]").forEach(el => {
      const k = el.dataset.dsControl;
      if (el.type === "range") el.value = state[k];
      else if (el.tagName === "SELECT") {   // simulated time can land between presets: show it anyway
        if (![...el.options].some(o => o.value === String(state[k]))) { const o = document.createElement("option"); o.textContent = state[k]; el.appendChild(o); }
        el.value = state[k];
      }
      else el.setAttribute("aria-pressed", String(el.dataset.value === String(state[k])));
    });
    document.querySelectorAll("[data-ds-out]").forEach(el => (el.textContent = state[el.dataset.dsOut]));
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("ds:change", { detail: { ...state, lowBattery: low } }));
  }

  /* Moving the simulated clock forward drains the battery, when the live effect is on.
     Setting the battery directly (scenarios, the slider, Reset) or setting the time from the
     controls panel ({ drain: false }) never drains. */
  function set(patch, { drain = true } = {}) {
    const before = state.time;
    Object.assign(state, patch);
    if ("battery" in patch) state.batt = Number(patch.battery);
    else if (drain && "time" in patch && state.live === "on") {
      const mins = toMin(state.time) - toMin(before);
      if (mins > 0 && mins <= 720) {
        const from = typeof state.batt === "number" ? state.batt : Number(state.battery);
        state.batt = Math.max(1, from - (DRAIN[state.net] || DRAIN.online) * mins / 60);
        state.battery = Math.max(1, Math.round(state.batt));
      }
    }
    apply();
  }
  function get() { return { ...state, lowBattery: Number(state.battery) <= 20 }; }

  /* Controls panel (sits outside the phone). Put <div data-ds-panel></div> anywhere. */
  function panelHTML() {
    const seg = (key, opts) => `<div class="dsp-seg">${opts.map(([v, l]) =>
      `<button data-ds-control="${key}" data-value="${v}">${l}</button>`).join("")}</div>`;
    return `<div class="dsp">
      <div class="dsp-title">Prototype conditions</div>
      <label class="dsp-label">Network</label>
      ${seg("net", [["online", "Online"], ["weak", "Weak"], ["sms", "SMS only"], ["offline", "Offline"]])}
      <label class="dsp-label">Battery <b data-ds-out="battery"></b>%</label>
      <input type="range" min="1" max="100" data-ds-control="battery">
      <label class="dsp-label">Time</label>
      <select data-ds-control="time">${["22:30","23:50","01:45","02:30","05:40","07:10"].map(t => `<option>${t}</option>`).join("")}</select>
      <label class="dsp-label">Live clock + battery drain</label>
      ${seg("live", [["on", "On"], ["off", "Off"]])}
      <p class="dsp-note">On: the clock moves a minute every real minute, and the battery drains like an iPhone 17 with the screen on (about 8% an hour on data, faster on weak or no signal). Skipping a wait drains it too.</p>
      <label class="dsp-label">Theme</label>
      ${seg("theme", [["light", "Light"], ["dark", "Dark"]])}
      <button class="dsp-reset" data-ds-reset>Reset</button>
    </div>`;
  }
  const panelCSS = `.dsp{font:500 13px/1.3 var(--font, system-ui);color:#222;background:#fff;border:1px solid #ddd;border-radius:16px;padding:16px;width:240px;box-shadow:0 6px 16px rgba(0,0,0,.08)}
  .dsp-title{font-weight:700;font-size:15px;margin-bottom:8px}.dsp-label{display:block;margin:12px 0 6px;color:#6a6a6a}
  .dsp-seg{display:flex;flex-wrap:wrap;gap:6px}.dsp-seg button{border:1px solid #ddd;border-radius:999px;padding:6px 10px;background:#fff;cursor:pointer;font:inherit}
  .dsp-seg button[aria-pressed=true]{background:#222;color:#fff;border-color:#222}.dsp input[type=range]{width:100%}
  .dsp select{width:100%;padding:6px;border-radius:8px;border:1px solid #ddd;font:inherit}.dsp-reset{margin-top:14px;text-decoration:underline;cursor:pointer;background:none;border:0;font:inherit}
  .dsp-note{margin:6px 0 0;font-size:12px;line-height:1.35;color:#6a6a6a}`;

  function mountPanels() {
    const panels = document.querySelectorAll("[data-ds-panel]");
    if (!panels.length) return;
    const st = document.createElement("style"); st.textContent = panelCSS; document.head.appendChild(st);
    panels.forEach(p => (p.innerHTML = panelHTML()));
    document.addEventListener("click", e => {
      const b = e.target.closest("button[data-ds-control]");
      if (b) set({ [b.dataset.dsControl]: b.dataset.value });
      if (e.target.closest("[data-ds-reset]")) set({ ...defaults });
    });
    document.addEventListener("input", e => {
      const el = e.target.closest("[data-ds-control]");
      if (el && (el.type === "range" || el.tagName === "SELECT")) set({ [el.dataset.dsControl]: el.type === "range" ? Number(el.value) : el.value }, { drain: false });
    });
  }

  /* The live clock: one simulated minute per real minute, counted only while the page is visible. */
  let visibleMs = 0, lastTick = Date.now();
  setInterval(() => {
    const t = Date.now(), dt = t - lastTick; lastTick = t;
    if (state.live !== "on" || document.visibilityState !== "visible") return;
    visibleMs += Math.min(dt, 5000);
    if (visibleMs >= 60000) {
      const n = Math.floor(visibleMs / 60000); visibleMs -= n * 60000;
      set({ time: fromMin(toMin(state.time) + n) });
    }
  }, 1000);

  /* Sheets & toasts */
  function openSheet(id) { const w = document.getElementById(id); if (w) { w.classList.add("is-open"); w.querySelector("button, a")?.focus(); } }
  function closeSheet(id) { const w = id ? document.getElementById(id) : document.querySelector(".c-sheet-wrap.is-open"); if (w) w.classList.remove("is-open"); }
  let toastTimer;
  function toast(msg, root) {
    const host = root || document.querySelector(".device");
    let t = host.querySelector(".c-toast");
    if (!t) { t = document.createElement("div"); t.className = "c-toast"; t.setAttribute("role", "status"); host.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2600);
  }
  document.addEventListener("click", e => {
    const o = e.target.closest("[data-open-sheet]"); if (o) openSheet(o.dataset.openSheet);
    if (e.target.closest("[data-close-sheet]")) closeSheet();
    const w = e.target.classList?.contains("c-sheet-wrap") ? e.target : null; if (w) w.classList.remove("is-open");
    const t = e.target.closest("[data-toast]"); if (t) toast(t.dataset.toast, t.closest(".device"));
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

  function init() {
    mountPanels();
    apply();
    if (window.lucide) window.lucide.createIcons();
  }
  window.DS = { set, get, openSheet, closeSheet, toast, refreshIcons: () => window.lucide && window.lucide.createIcons() };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
