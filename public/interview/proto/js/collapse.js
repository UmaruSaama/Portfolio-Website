/* Portfolio addition (not part of the tested build): collapsible sidebars.
   - Player: a toolbar button hides or shows the right-hand side panel (transcript, settings, explain).
     Opening a panel (Settings, Dictionary, Explain…) always brings the side panel back.
   - App screens (Today, Discover…): a round button on the nav edge shrinks the left nav to an icon rail.
   State is kept for this tab only (sessionStorage). */
(function () {
  const KS = 'il.sideOff', KN = 'il.navMini';
  const get = k => { try { return sessionStorage.getItem(k) === '1'; } catch (e) { return false; } };
  const set = (k, v) => { try { sessionStorage.setItem(k, v ? '1' : '0'); } catch (e) {} };
  const svg = d => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const PANEL_R = '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>';
  const CHEV_L = '<path d="M15 6l-6 6 6 6"/>', CHEV_R = '<path d="M9 6l6 6-6 6"/>';

  const css = document.createElement('style');
  css.textContent = `
#player.side-off .pside{display:none}
#sideBtn.on{background:var(--fill);color:var(--txt)}
#app{position:relative}
#app.nav-mini{grid-template-columns:72px 1fr}
#app.nav-mini .nav{padding:20px 10px;overflow:hidden}
#app.nav-mini .nav .brand{font-size:0;padding:4px 0 20px;justify-content:center}
#app.nav-mini .nav-i{font-size:0;justify-content:center;gap:0;padding:12px 0}
#app.nav-mini .nav-i .ic{width:22px;height:22px}
#app.nav-mini .help-card,#app.nav-mini .nav .eyebrow{display:none}
#navBtn{position:absolute;top:22px;left:234px;z-index:30;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;padding:0;
  background:var(--raised);color:var(--weak);border:1px solid var(--sweak);cursor:pointer}
#navBtn:hover{color:var(--txt);border-color:var(--sstrong)}
#navBtn .ic{width:16px;height:16px}
#app.nav-mini #navBtn{left:58px}
@media (max-width:900px){#navBtn{display:none}}`;
  document.head.appendChild(css);

  function init() {
    // Player side panel
    const player = document.getElementById('player'), bar = player && player.querySelector('.toolbar'), endBtn = document.getElementById('endBtn');
    if (bar && endBtn) {
      const b = document.createElement('button'); b.type = 'button'; b.id = 'sideBtn'; b.className = 'btn ghost small icon';
      const paint = () => { const off = player.classList.contains('side-off'); b.classList.toggle('on', !off);
        b.title = off ? 'Show side panel' : 'Hide side panel'; b.setAttribute('aria-label', b.title); b.setAttribute('aria-pressed', String(!off)); };
      b.innerHTML = svg(PANEL_R);
      b.onclick = () => { player.classList.toggle('side-off'); set(KS, player.classList.contains('side-off')); paint(); };
      bar.insertBefore(b, endBtn);
      if (get(KS)) player.classList.add('side-off'); paint();
      // Any panel opening brings the side panel back, so Settings / Explain / Dictionary never open into nothing.
      if (typeof window.panel === 'function') {
        const orig = window.panel;
        window.panel = function () { if (player.classList.contains('side-off')) { player.classList.remove('side-off'); set(KS, false); paint(); } return orig.apply(this, arguments); };
      }
    }
    // App left nav
    const app = document.getElementById('app');
    if (app) {
      const n = document.createElement('button'); n.type = 'button'; n.id = 'navBtn';
      const paint = () => { const mini = app.classList.contains('nav-mini'); n.innerHTML = svg(mini ? CHEV_R : CHEV_L);
        n.title = mini ? 'Expand menu' : 'Collapse menu'; n.setAttribute('aria-label', n.title); n.setAttribute('aria-expanded', String(!mini)); };
      n.onclick = () => { app.classList.toggle('nav-mini'); set(KN, app.classList.contains('nav-mini')); paint(); };
      app.appendChild(n);
      if (get(KN)) app.classList.add('nav-mini'); paint();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
