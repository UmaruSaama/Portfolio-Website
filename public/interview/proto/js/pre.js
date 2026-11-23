/* Portfolio addition (draft, not tested with people): learn an episode's unknown words BEFORE watching,
   from the show page's "Will I understand it?" panel. Two targets: until comfortable (the 85–90% band) or 100%.
   Spoiler-free: every practice sentence is built from beginner words plus the one target word, never an episode line.
   Reuses the Prime screen's layout and keys, the word store and review cards (addCard); adds no learning mode.
   Practised words count as known for that show and get a review card. Progress lives in app.pre (saveApp). */
(function () {
  const BAND_LO = 85, TOPUP = 5;
  const P = id => { app.pre = app.pre || {}; return app.pre[id] || (app.pre[id] = { k: 0, done: [] }); };

  // Counts with practice applied (known share stays known / (known + learning + unknown), names excluded).
  window.preAdjust = (s, w) => { const p = app.pre && app.pre[s.id]; if (!p || !p.k) return w; const k = Math.min(p.k, w.unknown); return { known: w.known + k, learning: w.learning, unknown: w.unknown - k, ignored: w.ignored }; };
  window.preFit = (s, w) => { const p = app.pre && app.pre[s.id]; if (!p || !p.k) return s.fit; return Math.round(100 * w.known / (w.known + w.learning + w.unknown)); };
  const needFor = (w, fit) => fit >= BAND_LO ? 0 : Math.max(0, Math.ceil(BAND_LO / 100 * (w.known + w.learning + w.unknown)) - w.known);

  // Word pool: the episode's own words where the prototype has them (Kissaten no Yoru), else dictionary words as samples.
  const pool = s => (s.play ? PRIME_WORDS.map(p => p.w) : DICT.map(d => d.w)).filter((x, i, a) => a.indexOf(x) === i);

  window.preSection = (s, w, fit) => {
    const need = needFor(w, fit), inBand = fit >= BAND_LO, left = w.unknown, avail = pool(s).filter(x => !P(s.id).done.includes(x)).length;
    const comfy = inBand
      ? `<button class="btn small" data-act="preGo" data-v="${s.id}/topup">Top up · ${Math.min(TOPUP, left)} words</button>`
      : `<button class="btn primary small" data-act="preGo" data-v="${s.id}/comfy">Until comfortable · ${need} words</button>`;
    return `<hr><div class="col" style="gap:8px"><b>Before the episode</b>
      <span class="small muted">${inBand ? `You’re already in the ideal band (${fit}%). Nothing you must learn first; a short top-up is optional.` : `Learn the words that get you to ${BAND_LO}% before you press play.`}</span>
      <div class="row wr" style="gap:8px">${comfy}<button class="btn ${inBand ? '' : 'ghost'} small" data-act="preGo" data-v="${s.id}/all">100% · all ${left} unknown</button></div>
      <span class="small subtle">${ic('help')} Practice uses new sentences, not the episode’s lines: no spoilers.${avail < left ? ` Prototype: ${avail} sample words stand in for the ${left}.` : ''}</span></div>`;
  };

  // ---- spoiler-free sentence: beginner words + the one target word ----
  const TYPE = { 喫茶店: 'n', 四十年: 'time', 店: 'n', 閉める: 'v1', まだ: 'mada', 一つ: 'count', かしこまる: 'kashi', 常連: 'n', 明日: 'time', 朝: 'time', 早い: 'adj', 起きる: 'v1', 山: 'n', きれい: 'adj', わかる: 'v5', おやすみ: 'expr' };
  const I = { う: 'い', く: 'き', ぐ: 'ぎ', す: 'し', つ: 'ち', ぬ: 'に', ぶ: 'び', む: 'み', る: 'り' };
  const typeOf = w => { if (TYPE[w]) return TYPE[w]; const d = DICT.find(x => x.w === w), t = (d && d.tags || []).join(' ');
    return /Ichidan/.test(t) ? 'v1' : /Godan/.test(t) ? 'v5' : /adjective/i.test(t) ? 'adj' : /Noun/.test(t) ? 'n' : 'expr'; };
  const gloss = w => (meaningOf(w) || '').split(/[,;—(]/)[0].trim();
  function sentence(w) {
    const g = gloss(w), base = g.replace(/^to /, '');
    switch (typeOf(w)) {
      case 'v1': return [`わたし は まいにち ${w.slice(0, -1)}ます。`, `I ${base} every day.`];
      case 'v5': return [`わたし は まいにち ${w.slice(0, -1)}${I[w.slice(-1)] || ''}ます。`, `I ${base} every day.`];
      case 'adj': return [`とても ${w} です ね。`, `It’s very ${g}, isn’t it?`];
      case 'time': return [`${w} です ね。`, `It’s ${g}, right?`];
      case 'mada': return ['まだ です。', 'Not yet.'];
      case 'count': return ['これ を 一つ ください。', 'One of these, please.'];
      case 'kashi': return ['「かしこまりました」と いいます。', 'Staff say “certainly” (very polite).'];
      case 'expr': return [`「${w}」と いいます。`, `You say “${w}” (${g}).`];
      default: return [`これ は ${w} です。`, `This is ${/^(a|an|the) /i.test(g) ? g : (/^[aeiou]/i.test(g) ? 'an ' : 'a ') + g}.`];
    }
  }

  // ---- the session screen (full-screen, like Prime) ----
  let S = null;   // { id, mode, target, q, i, en }
  function start(param) {
    const [id, mode] = (param || '').split('/'), s = showById(id); if (!s) return null;
    const w0 = s.words || { known: Math.round(2290 * s.fit / 100), learning: 90, unknown: 2290 - Math.round(2290 * s.fit / 100) - 90, ignored: 10 };
    const w = preAdjust(s, w0), fit = preFit(s, w);
    const target = mode === 'all' ? w.unknown : mode === 'topup' ? Math.min(TOPUP, w.unknown) : needFor(w, fit);
    const q = pool(s).filter(x => !P(id).done.includes(x)).slice(0, target);
    return { id, mode, target, q, i: 0, en: false, startFit: fit, w0 };
  }
  window.scrPre = param => {
    if (!S || S.key !== param) { S = start(param); if (S) S.key = param; }
    if (!S) return '<div class="focus"><p>Show not found.</p></div>';
    const s = showById(S.id), N = S.q.length, p = P(S.id), w = preAdjust(s, S.w0), fit = preFit(s, w);
    const label = { comfy: 'Until comfortable', topup: 'Top-up', all: '100%' }[S.mode] || '';
    const head = sub => `<header class="focus-head"><a class="btn ghost small" href="#/show/${s.id}">${ic('left')} ${esc(s.title)}</a><div class="col center" style="gap:0"><b>Before the episode · ${label}</b><span class="small muted">${sub}</span></div>
      <div class="row" style="justify-content:flex-end;gap:8px"><span class="small muted">Known</span><span class="fit fit-ideal">${S.startFit}% → ${fit}%</span></div></header>
      <div class="segbar">${(N ? S.q : [0]).map((_, i) => `<i class="${i < S.i ? 'done' : i === S.i ? 'cur' : ''}"></i>`).join('')}</div>`;
    if (!N || S.i >= N) {
      const short = S.target > N;
      return `<div class="focus">${head(N ? `${N} words done` : 'Nothing to learn')}
        <div class="panel focus-card center col" style="gap:12px"><span class="h2">${fit >= BAND_LO ? `You’re at ${fit}%: in the ideal band` : `You’re at ${fit}%`}</span>
        <p class="muted" style="margin:0">${N ? `${N} word${N === 1 ? '' : 's'} learnt; each has a review card.` : 'There were no words to learn for this target.'}${short ? ` This prototype has ${N} sample words; the product would cover all ${S.target}.` : ''}</p>
        <div class="row center"><a class="btn primary" href="#/show/${s.id}">Back to ${esc(s.title)}</a>${s.play ? `<a class="btn" href="#/play/${s.play}">Watch episode ${detailEp} ${ic('play')}</a>` : ''}</div></div></div>`;
    }
    const x = S.q[S.i], r = findReading(x), [jp, en] = sentence(x);
    return `<div class="focus">${head(`Word ${S.i + 1} of ${N}${S.target > N ? ` (prototype sample of ${S.target})` : ''} · stop any time`)}
      <div class="panel focus-card col center" style="gap:12px">
        <span class="tag">New sentence, not from the episode</span>
        <span class="jp-display" lang="ja">${esc(x)}</span><span class="muted" lang="ja">${r && r !== x ? esc(r) + ' · ' : ''}${romaji(r || x)}</span>
        <span>${esc(meaningOf(x))}</span>
        <div class="rt-line big prime-line" lang="ja">${esc(jp)}</div>
        ${S.en ? `<span class="muted">${esc(en)}</span>` : `<button class="btn small" data-act="preEn">Show translation</button>`}
      </div>
      <div class="row center" style="margin-top:20px"><button class="btn" data-act="preKnew">I knew it</button><button class="btn primary" data-act="preLearn">Learnt it — add a review card</button></div>
      <p class="small subtle center">Keys <span class="kbd">1</span> knew it · <span class="kbd">2</span> learnt it</p>
      <div class="row center small" style="gap:24px"><a class="link" href="#/show/${s.id}">Stop for now (progress is kept)</a><span class="subtle">${ic('help')} One new word per sentence: the rest are beginner words</span></div>
    </div>`;
  };
  function answer(kind) {
    if (!S || S.i >= S.q.length) return;
    const x = S.q[S.i], p = P(S.id);
    words[x] = Object.assign(words[x] || { seen: 0 }, { st: 'known' });
    if (kind === 'learn') { const [jp, en] = sentence(x); addCard({ w: x, r: findReading(x), def: meaningOf(x), jp, en, here: jp, src: `Before the episode · ${showById(S.id).title}` }); }
    if (!p.done.includes(x)) { p.done.push(x); p.k++; }
    S.i++; S.en = false; save(); saveApp(); rerender();
  }
  Object.assign(ACT, {
    preGo: el => { S = null; location.hash = '#/pre/' + el.dataset.v; },
    preEn: () => { if (S) { S.en = true; rerender(); } },
    preKnew: () => answer('knew'), preLearn: () => answer('learn'),
  });
  SCREENS.pre = scrPre; FULL.add('pre'); TITLES.pre = 'Before the episode';
  addEventListener('keydown', e => { if (route.name !== 'pre' || !S || S.i >= S.q.length || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.key === '1') answer('knew'); else if (e.key === '2') answer('learn'); });
})();
