/* Prototype state + small helpers. No build step, no framework.
   The state lives on every .device element as data-attributes, so CSS can
   react to it (offline greys out [data-needs="data"], the low-battery
   banner appears, and so on). Screens can listen for the "ds:change" event. */
(function () {
  const KEY = "navi-ds-state";
  const defaults = { net: "online", battery: 62, theme: "light", time: "01:45" };
  let state = { ...defaults };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}

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
        <span class="c-battery" aria-label="Battery ${pct}%">${pct}%
          <span class="c-battery__body"><span class="c-battery__fill" style="width:${pct}%"></span></span>
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

  function set(patch) { Object.assign(state, patch); apply(); }
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
      <label class="dsp-label">Theme</label>
      ${seg("theme", [["light", "Light"], ["dark", "Dark"]])}
      <button class="dsp-reset" data-ds-reset>Reset</button>
    </div>`;
  }
  const panelCSS = `.dsp{font:500 13px/1.3 var(--font, system-ui);color:#222;background:#fff;border:1px solid #ddd;border-radius:16px;padding:16px;width:240px;box-shadow:0 6px 16px rgba(0,0,0,.08)}
  .dsp-title{font-weight:700;font-size:15px;margin-bottom:8px}.dsp-label{display:block;margin:12px 0 6px;color:#6a6a6a}
  .dsp-seg{display:flex;flex-wrap:wrap;gap:6px}.dsp-seg button{border:1px solid #ddd;border-radius:999px;padding:6px 10px;background:#fff;cursor:pointer;font:inherit}
  .dsp-seg button[aria-pressed=true]{background:#222;color:#fff;border-color:#222}.dsp input[type=range]{width:100%}
  .dsp select{width:100%;padding:6px;border-radius:8px;border:1px solid #ddd;font:inherit}.dsp-reset{margin-top:14px;text-decoration:underline;cursor:pointer;background:none;border:0;font:inherit}`;

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
      if (el && (el.type === "range" || el.tagName === "SELECT")) set({ [el.dataset.dsControl]: el.type === "range" ? Number(el.value) : el.value });
    });
  }

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
