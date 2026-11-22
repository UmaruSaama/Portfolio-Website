/* Portfolio guide (not part of the product): a step-by-step walkthrough for the decision views,
   styled like the onboarding build's guide. Starts when the URL has ?tour=d2|d3|d4. "Guide on/off" in the
   corner pill turns it off or back on; "Restart" runs it again. Content only describes what is on screen. */
(function () {
  const q = new URLSearchParams(location.search), tour = q.get('tour');
  if (!tour) return;
  const KEY = 'il.portfolioGuide';
  let off = false; try { off = sessionStorage.getItem(KEY) === 'off'; } catch (e) {}

  const $ = s => document.querySelector(s);
  const byText = (sel, re) => [...document.querySelectorAll(sel)].find(e => re.test(e.textContent) && e.offsetParent);
  const T = {
    d2: [
      { el: () => $('#turn:not(.hidden)') || $('#subs'), title: 'The scene waits for you', body: 'After each line with new words, the video pauses so you can read it. Continue (or Space) plays on.' },
      { el: () => $('#jpLine'), title: 'Tap a word you don’t know', body: 'Its card shows the meaning, the reading and how it’s used in this line. Words you don’t tap count as known.' },
      { el: () => byText('#drawer *', /^\s*Learning mode\s*$/i) || $('#drawer'), title: 'Three ways to watch', body: 'Pause on new words is the default. Just watch never stops. Primed listening shows a line’s new words before you hear it.' },
      { el: () => $('#helpBox'), title: 'How much help you see', body: 'Less or more help changes where readings and English appear.' },
    ],
    d3: [
      { el: () => $('#drawer'), title: 'Explain this line', body: 'The line, broken into pieces, then said in plain English.' },
      { el: () => byText('#drawer p, #drawer div, #drawer small, #drawer span', /^\s*\S*\s*Written for this prototype/) , title: 'It says what it is', body: 'This label says where the explanation comes from: written for this prototype; in the product, AI with grammar checked against a dictionary.' },
      { el: () => byText('#drawer button, #drawer a', /Report a mistake/), title: 'Correct it', body: 'If an explanation is wrong, report it from here.' },
      { el: () => byText('#drawer button', /^\s*Resume/), title: 'Back to the scene', body: 'Resume picks up where the scene paused.' },
    ],
    d4: [
      { el: () => byText('#view *', /^\s*\d+% for you\s*$/), title: 'How much you’ll follow', body: 'Each show is rated by the share of its words you already know. These numbers are sample data in the prototype.' },
      { el: () => byText('#view button, #view .chip, #view span', /^\s*✓?\s*Ideal 85–90%/)?.parentElement, title: 'Pick your fit', body: '85–90% known is enough to follow and still teaches you something. Easy, Stretch and Hard show the rest.' },
      { el: () => byText('#view *', /^\s*Bentō Days\s*$/)?.closest('a,button,[onclick],.card,.media,div'), title: 'Open a show', body: 'Next opens its page.', next: () => { location.hash = '#/show/bento'; } },
      { el: () => byText('#view *', /^\s*Will I understand it\?\s*$/)?.parentElement, title: 'Will I understand it?', body: 'The number against the ideal band, the words behind it, and how many sentences you’d fully know.' },
      { el: () => byText('#view *', /^\s*Episodes\s*$/)?.parentElement?.parentElement, title: 'Every episode has its own number', body: 'The share of words you know, episode by episode. The legend under the grid explains the marks.' },
    ],
  }[tour];
  if (!T) return;

  const css = document.createElement('style');
  css.textContent = `
#pg-pop{position:fixed;z-index:9999;width:340px;border-radius:18px;background:#2b2b2b;color:#f2f2f2;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),0 20px 48px rgba(0,0,0,.55);padding:18px 18px 14px;font:400 14px/1.45 "Noto Sans",system-ui,sans-serif;transition:left .35s ease,top .35s ease,opacity .2s}
#pg-pop .st{font:700 11px/1 "Noto Sans",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#e8838f;margin-bottom:8px}
#pg-pop h4{margin:0 0 6px;font:700 16px/1.3 "Noto Sans",system-ui,sans-serif;color:#fff}
#pg-pop p{margin:0;color:#cfcfd4}
#pg-pop .r{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
#pg-pop button{border:0;border-radius:999px;padding:7px 14px;font:600 13px/1 "Noto Sans",system-ui,sans-serif;cursor:pointer;background:transparent;color:#bdbdc4}
#pg-pop button.go{background:#c23a4f;color:#fff}
#pg-ring{position:fixed;z-index:9998;border-radius:14px;box-shadow:0 0 0 3px #e8838f,0 0 0 9999px rgba(0,0,0,.35);pointer-events:none;transition:all .35s ease}
#pg-pill.top{left:50%;right:auto;bottom:auto;top:8px;transform:translateX(-50%)}
#pg-pill{position:fixed;right:16px;bottom:16px;z-index:10000;display:flex;gap:4px;padding:5px;border-radius:14px;background:#1d1d1f;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);font:600 12px/1 "Noto Sans",system-ui,sans-serif}
#pg-pill span{padding:8px 10px;color:#77777e}
#pg-pill button{border:0;border-radius:10px;padding:8px 10px;background:transparent;color:#d6d6db;font:inherit;cursor:pointer}
#pg-pill button.on{background:#4a1f27;color:#fff}`;
  document.head.appendChild(css);

  const pop = document.createElement('div'); pop.id = 'pg-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-live', 'polite');
  const ring = document.createElement('div'); ring.id = 'pg-ring';
  const pill = document.createElement('div'); pill.id = 'pg-pill';
  pill.innerHTML = '<span>Prototype</span><button type="button" id="pg-tog"></button><button type="button" id="pg-re">Restart</button>';
  let i = 0, timer = 0;

  function hide() { pop.remove(); ring.remove(); }
  function paint() { const b = pill.querySelector('#pg-tog'); b.textContent = off ? 'Guide off' : 'Guide on'; b.classList.toggle('on', !off); }
  function place(el) {
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = el.getBoundingClientRect(), W = innerWidth, H = innerHeight, pw = 340, ph = pop.offsetHeight || 160, g = 14;
    Object.assign(ring.style, { left: r.left - 6 + 'px', top: r.top - 6 + 'px', width: r.width + 12 + 'px', height: r.height + 12 + 'px' });
    let x, y;
    if (r.left - pw - g > 8) { x = r.left - pw - g; y = r.top; }                 // left of it
    else if (r.right + pw + g < W - 8) { x = r.right + g; y = r.top; }           // right of it
    else if (r.top - ph - g > 8) { x = r.left + r.width / 2 - pw / 2; y = r.top - ph - g; } // above
    else { x = r.left + r.width / 2 - pw / 2; y = r.bottom + g; }                // below
    pop.style.left = Math.max(8, Math.min(W - pw - 8, x)) + 'px';
    pop.style.top = Math.max(8, Math.min(H - ph - 8, y)) + 'px';
  }
  function show(n, tries = 0) {
    clearTimeout(timer); i = n;
    if (off || i >= T.length) return hide();
    const s = T[i], el = s.el && s.el();
    if (!el) { if (tries < 30) timer = setTimeout(() => show(n, tries + 1), 250); else show(n + 1); return; }
    const last = i === T.length - 1;
    pop.innerHTML = `<div class="st">${i + 1} of ${T.length}</div><h4>${s.title}</h4><p>${s.body}</p>` +
      `<div class="r"><button type="button" class="sk">${last ? 'Close' : 'Skip guide'}</button>${last ? '' : '<button type="button" class="go">Next</button>'}</div>`;
    document.body.append(ring, pop); place(el);
    pop.querySelector('.sk').onclick = () => { if (!last) { off = true; save(); paint(); } hide(); };
    const go = pop.querySelector('.go'); if (go) go.onclick = () => { if (s.next) s.next(); show(i + 1); };
  }
  function save() { try { sessionStorage.setItem(KEY, off ? 'off' : 'on'); } catch (e) {} }
  pill.querySelector('#pg-tog').onclick = () => { off = !off; save(); paint(); off ? hide() : show(i); };
  pill.querySelector('#pg-re').onclick = () => { off = false; save(); paint(); if (tour === 'd4') location.hash = '#/discover'; setTimeout(() => show(0), 300); };
  addEventListener('resize', () => { if (pop.isConnected) { const el = T[i].el(); if (el) place(el); } });
  function start() { if (/^#\/play/.test(location.hash)) pill.classList.add('top'); document.body.appendChild(pill); paint(); setTimeout(() => show(0), tour === 'd4' ? 900 : 2700); }
  if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
})();
