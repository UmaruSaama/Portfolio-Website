"use strict";
/* App shell, router and every screen outside the player.
   Each screen is a function that returns HTML; clicks are handled by one delegated listener using data-go (navigate)
   and data-act (run ACT[name]). State that outlives a screen lives in `app` and `cards` (localStorage, prefix il3.). */

/* ============================== state ============================== */
const APP_DEFAULT = {
  onboarded: false, first: null, help: 'auto',
  prefs: { media: ['anime', 'manga', 'short'], genres: ['Slice of life', 'Mystery', 'Comedy'], why: ['shows', 'jlpt'], minutes: 20 },
  watchlist: ['kissaten'], discover: { tab: 'anime', fit: ['ideal', 'easy'], starter: true, jpOnly: false, legend: true },
  bookmarks: {}, read: { page: 2, size: 20, furi: 'unknown' }
};
let app = Object.assign(JSON.parse(JSON.stringify(APP_DEFAULT)), store.get('app', {}));
let cards = store.get('cards', null);
if (!cards) cards = SEED_CARDS.map((c, i) => Object.assign({ id: 'seed' + i, deck: 'My cards', type: 'Word', ivl: 2, due: Date.now() - 1000 }, c));
function saveApp() { store.set('app', app); store.set('cards', cards); }
const dueCards = () => cards.filter(c => c.due <= Date.now());
function addCard(c) {
  const ex = cards.find(x => x.w === c.w && x.type === (c.type || 'Word'));
  if (ex) { Object.assign(ex, c); saveApp(); return ex; }
  const card = Object.assign({ id: 'c' + Date.now(), deck: 'My cards', type: 'Word', ivl: 1, due: Date.now() + 864e5 }, c);
  cards.push(card); saveApp(); return card;
}

/* ============================== small helpers ============================== */
const IC = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  book: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3zM21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  chart: '<path d="M5 20V11M12 20V5M19 20v-6M3 20h18"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
  play: '<path d="M7 4l13 8-13 8z"/>', video: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>', right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chev: '<path d="M9 6l6 6-6 6"/>', down: '<path d="M6 9l6 6 6-6"/>', check: '<path d="M5 12l5 5 9-10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
  speaker: '<path d="M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 0 1 0 6"/>', bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', undo: '<path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  dots: '<path d="M5 12h.01M12 12h.01M19 12h.01"/>', import: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>'
};
const ic = (n, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
const fitChip = (pct, txt) => `<span class="fit fit-${fitOf(pct)}"><i></i>${txt || pct + '% for you'}</span>`;
const lvl = l => `<span class="lvl lvl-${l}">${l}</span>`;
const bar = (p, cls) => `<span class="bar ${cls || ''}"><i style="width:${Math.round(Math.max(0, Math.min(1, p)) * 100)}%"></i></span>`;
const cover = (s, cls) => `<div class="cover ${cls || ''}" style="background:linear-gradient(180deg,${s.grad[0]},${s.grad[1]})"><span lang="ja">${esc(s.jp)}</span></div>`;
const MEDIUM = { anime: 'Anime', jdrama: 'J-Drama', manga: 'Manga', novel: 'Novel', podcast: 'Podcast', short: 'Short videos' };
const KR = { あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko', さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so', た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to', な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no', は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho', ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo', や: 'ya', ゆ: 'yu', よ: 'yo', ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n', が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo', だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do', ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo', ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po', ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o' };
function romaji(s) {
  s = toHira(s || ''); let o = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i], n = s[i + 1], Y = { ゃ: 'ya', ゅ: 'yu', ょ: 'yo' };
    if (c === 'っ') { o += (romaji(s[i + 1] || '')[0] || ''); continue; }
    if (n && Y[n] && KR[c]) { const b = KR[c], soft = { shi: 'sh', chi: 'ch', ji: 'j' }[b]; o += soft ? soft + Y[n].slice(1) : b.slice(0, -1) + Y[n]; i++; continue; }
    if (c === 'ー') { o += o.slice(-1); continue; }
    o += KR[c] || c;
  }
  return o;
}
const meaningOf = w => { const d = DICT.find(x => x.w === w); return (words[w] && words[w].g) || (d && d.en[0]) || GLOSS[w] || GLOSS_MORE[w] || ''; };
const readingOf = w => { const d = DICT.find(x => x.w === w); if (d) return d.r; const c = SEED_CARDS.find(x => x.w === w); if (c) return c.r; return ''; };
/* first reading for a word found in the practice scene or reader text */
function findReading(w) {
  const r = readingOf(w); if (r) return r;
  for (const src of [...PRACTICE.lines.map(l => l.jp), ...NOVEL.pages.flat(), ...MANGA.bubbles.map(b => b.text)])
    for (const t of tokenize(src)) if (t.base === w || t.surface === w) { const fr = fullReading(t); if (t.base === t.surface) return fr; }
  return [...w].some(isKanji) ? '' : toHira(w);
}
function gtoast(html, ms) { toast(html, ms); }
function modal(html) { $('resultBody').innerHTML = html; $('result').classList.remove('hidden'); $('result').onclick = e => { if (e.target.id === 'result') closeModal(); }; }
function closeModal() { $('result').classList.add('hidden'); }

/* Read and Manga show the day-30 learner: words you haven't met yet count as known unless the sample learner is still learning them */
const PERSONA_NEW = new Set(['女将', '満月', '鳴く', '聞こえる', '畳', '匂い', '布団', '眠る', '閉じる', 'うなずく', '閉店', '焼きそば', '遠く']);
const PERSONA_LEARNING = new Set(['湯のみ', '両手']);
const effSt = b => words[b] ? words[b].st : PERSONA_LEARNING.has(b) ? 'learning' : PERSONA_NEW.has(b) ? 'unknown' : 'known';
/* render a manual or kuromoji line as clickable tokens with optional furigana; tokens are collected into `bucket` */
function tokLine(line, bucket, furi, selBase, persona) {
  return tokenize(line).map(t => {
    if (t.punct) return `<span class="rt-p">${esc(t.surface)}</span>`;
    const st = persona ? effSt(t.base) : stOf(t.base), k = bucket.push(Object.assign({ line }, t)) - 1;
    const showR = furi === 'all' || (furi === 'unknown' && (st === 'unknown' || st === 'learning'));
    const inner = t.parts.map(p => p.rt && showR ? `<ruby>${esc(p.text)}<rt>${esc(p.rt)}</rt></ruby>` : esc(p.text)).join('');
    return `<span class="rt-tok${t.base === selBase ? ' sel' : ''}" data-st="${st}" data-k="${k}">${inner}</span>`;
  }).join('');
}

/* the word card used by Read, Manga and Dictionary-lite (Figma 12/13 right column) */
function wordCardHTML(t, ctx) {
  const w = t.base, st = effSt(w), d = DICT.find(x => x.w === w), r = (t.base === t.surface ? fullReading(t) : '') || findReading(w);
  const tags = d ? d.tags.slice(0, 3) : [ctx.common];
  const here = `Here: ${esc(plain(t.line || ''))}${ctx.en ? ' — “' + esc(ctx.en) + '”' : ''}`;
  return `<div class="row"><span class="wc-w" lang="ja">${esc(w)}</span>${r && r !== w ? `<span class="wc-r" lang="ja">${esc(r)}</span>` : ''}<button class="icon-btn" data-act="say" data-say="${esc(r || w)}" aria-label="Hear it">${ic('speaker')}</button><div class="spacer"></div><span class="pill st-${st}">${{ unknown: 'New', learning: 'Practising', known: 'Known', ignored: 'Ignored' }[st]}</span></div>
    <div class="row wr">${tags.filter(Boolean).map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
    <div class="wc-def">${esc(meaningOf(w)) || '<span class="subtle">No meaning saved yet</span>'}</div>
    <div class="small muted" lang="ja">${here}</div>
    ${ctx.related || ''}
    <div class="row wr"><button class="btn primary small" data-act="wcSave">Save card ${ic('plus')}</button><button class="btn small" data-act="wcKnown">${st === 'known' ? 'Mark new' : 'Mark known'}</button><button class="btn small" data-act="wcExplain">Explain ${ic('spark')}</button></div>`;
}

/* ============================== router ============================== */
const FULL = new Set(['start', 'setup', 'prime', 'review']);
let route = { name: '', param: '' };
function go(path) { if (location.hash === '#/' + path) handleRoute(); else location.hash = '#/' + path; }
function handleRoute() {
  const [name, ...rest] = location.hash.replace(/^#\/?/, '').split('/');
  const param = decodeURIComponent(rest.join('/'));
  const target = name || (app.onboarded ? 'today' : 'start');
  if (route.name === 'play' && target !== 'play') leavePlayer();
  if (target === 'prime' && route.name !== 'prime') primeStart();   // fresh queue each time you enter
  if (target === 'review' && route.name !== 'review') reviewStart();
  route = { name: target, param };
  closeModal();
  if (target === 'play') { const sc = param === 'mine' ? mine : PRACTICE; data = sc; selected = param === 'mine' ? 'mine' : 'practice'; startPlayer(); return; }
  if (target === 'words') { goWords('app'); return; }
  if (target === 'clip') { goSetup(); return; }
  const fn = SCREENS[target]; if (!fn) { go(app.onboarded ? 'today' : 'start'); return; }
  if (FULL.has(target)) { show('full'); $('full').innerHTML = fn(param); }
  else { show('app'); $('nav').innerHTML = navHTML(target); $('view').innerHTML = fn(param); $('view').scrollTop = 0; }
  (AFTER[target] || (() => { }))(param);
  document.title = (TITLES[target] || 'ImmerLingo') + ' · ImmerLingo';
}
window.addEventListener('hashchange', handleRoute);
const TITLES = { start: 'What do you want to watch?', setup: 'Your setup', today: 'Today', discover: 'Discover', show: 'Show', prime: 'Prime', read: 'Read', manga: 'Manga', dictionary: 'Dictionary', learn: 'Learn', review: 'Review', stats: 'Stats' };

function navHTML(cur) {
  const items = [['today', 'home', 'Today'], ['discover', 'compass', 'Discover'], ['read', 'book', 'Read'], ['learn', 'layers', 'Learn'], ['dictionary', 'search', 'Dictionary'], ['stats', 'chart', 'Stats']];
  const on = { show: 'discover', manga: 'read' }[cur] || cur;
  const helpTxt = { less: 'Less', auto: 'Auto', more: 'More' }[app.help] + ' · ' + PERSONA.helpLevel;
  return `<div class="brand"><span class="mark"><i></i></span>ImmerLingo</div>
    <nav class="nav-items">${items.map(([r, i, l]) => `<a href="#/${r}" class="nav-i${on === r ? ' on' : ''}"${on === r ? ' aria-current="page"' : ''}>${ic(i)}${l}</a>`).join('')}</nav>
    <div class="spacer"></div>
    <button class="help-card" data-act="helpLevel"><span><span class="eyebrow">Help level</span><b>${helpTxt}</b></span>${ic('chev')}</button>
    <a class="nav-i" href="#/setup/settings">${ic('gear')}Settings</a>
    <button class="nav-i" data-act="helpFeedback">${ic('help')}Help &amp; feedback</button>`;
}
const searchBox = (ph) => `<label class="search">${ic('search')}<input id="gsearch" placeholder="${ph || 'Search words, shows, manga…'}" autocomplete="off"><span class="kbd">/</span></label>`;
const avatar = () => `<button class="avatar" data-act="helpFeedback" aria-label="Account">${PERSONA.initials}</button>`;
const pageHead = (eyebrow, title, right) => `<header class="page-head"><div class="col" style="gap:4px">${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<h1 class="h2">${title}</h1></div><div class="spacer"></div>${right == null ? searchBox() + avatar() : right}</header>`;

/* ============================== F1 · start (pick a show, no test) ============================== */
const START_IDS = ['kissaten', 'bento', 'mori', 'sakamichi', 'ame'];
let startSel = 'kissaten';
function startCard(s, sel, sub, chip) {
  return `<button class="show-card${sel ? ' sel' : ''}" data-act="startPick" data-id="${s.id}" aria-pressed="${sel}">${cover(s)}<b>${esc(s.title)}</b>
    <span class="row" style="gap:6px">${chip}</span><span class="small subtle">${sub}</span></button>`;
}
function scrStart() {
  const yt = { id: 'mine', title: 'Your YouTube clip', jp: 'ジョジョ', grad: ['#2b1d4a', '#6b4bb0'] };
  const selShow = startSel === 'mine' ? null : showById(startSel);
  const playable = startSel === 'mine' || (selShow && selShow.play);
  const t = []; const sample = tokLine(PRACTICE.lines[2].jp, t, 'all');
  return `<div class="wrap start">
    <div class="row"><div class="brand"><span class="mark"><i></i></span>ImmerLingo</div><div class="spacer"></div><span class="status hidden-sm" id="startStatus"></span></div>
    <div class="col" style="gap:8px;margin-top:24px"><span class="eyebrow">No test. Just start.</span><h1>What do you want to watch?</h1>
      <p class="lead">You learn your level by watching, not by answering questions. We start with plenty of help and turn it down as we see what you know.</p></div>
    <div class="show-row">${START_IDS.map(id => { const s = showById(id); return startCard(s, startSel === id, `${s.subs}<br>${s.genre.split(' · ')[0]} · ${s.epMin} min`, `${fitChip(s.fit, 'Fit after ep. 1').replace(/fit-\w+/, 'fit-easy')}${lvl(s.level)}`); }).join('')}
      ${startCard(yt, startSel === 'mine', HOSTED ? 'Local version only' : 'JoJo · episode 1 · 2-min clip', '<span class="tag">YouTube</span>')}</div>
    <div class="panel preview"><div class="col" style="gap:6px;max-width:380px"><span class="eyebrow">How episode 1 will look</span><h3>Plenty of help to start</h3>
      <p class="small muted" style="margin:0">Reading for every kanji, English under each line. After each line with new words the video waits so you can tap the ones you don’t know. Help shrinks as we learn what you know.</p></div>
      <div class="preview-line"><div class="rt-line big" lang="ja">${sample}</div><div class="muted">${esc(PRACTICE.lines[2].en)}</div></div></div>
    <div class="row wr start-foot"><button class="btn ghost small" data-go="learn">Can’t read kana yet? Start from zero</button><button class="btn ghost small" data-go="setup/import">Already track words? Import them</button><div class="spacer"></div>
      ${playable ? `<button class="btn primary" data-act="startPlay">Play episode 1 ${ic('play')}</button>` : `<span class="small subtle">Only Kissaten no Yoru and your YouTube clip play in this prototype</span><button class="btn primary" disabled>Play episode 1 ${ic('play')}</button>`}</div>
  </div>`;
}

/* ============================== 02 · setup (after episode 1, and as Settings) ============================== */
function startingPoint() {
  const f = app.first; if (!f) return null;
  const level = f.followed >= 85 ? 'Native subtitles' : f.followed >= 60 ? 'Bridge' : 'Starter';
  const estimate = Math.max(100, Math.round(f.followed * 25 / 100) * 100);
  return { level, estimate, f };
}
function scrSetup(param) {
  const p = app.prefs, sp = startingPoint(), asSettings = param === 'settings';
  const chip = (on, act, val, label) => `<button class="chip-t${on ? ' on' : ''}" data-act="${act}" data-v="${esc(val)}" aria-pressed="${on}">${on ? ic('check') : ''}${label}</button>`;
  const WHY = [['shows', 'Enjoy shows, manga and games', 'Picks follow your taste first'], ['travel', 'Travel in Japan', 'Adds everyday-speech shows'], ['jlpt', 'Pass the JLPT', 'Adds JLPT decks and a level target'], ['work', 'Work or study in Japan', 'Adds polite speech and workplace dramas'], ['friends', 'Friends, family or living there', 'Adds casual conversation picks']];
  const MIN = { 10: 'about half an episode or a chapter, plus 5 minutes of review', 20: 'about one episode or chapter, plus 10 minutes of review', 45: 'two episodes or chapters, plus 15 minutes of review', 60: 'two or three episodes, plus 20 minutes of review' };
  return `<div class="wrap setup">
    <div class="row"><div class="brand"><span class="mark"><i></i></span>ImmerLingo</div><div class="spacer"></div>${asSettings ? `<button class="btn ghost small" data-go="today">${ic('left')} Back to Today</button>` : `<span class="small">Step 2 of 2</span><span class="steps2"><i></i><i></i></span>`}</div>
    ${sp ? `<div class="banner">${ic('target')}<div class="col" style="gap:2px"><b>Your starting point: ${sp.level}</b><span class="muted">You probably know about ${sp.estimate.toLocaleString()} words. ${LEVELS[sp.level]} Based on ${sp.f.lookups} tap${sp.f.lookups === 1 ? '' : 's'} across ${sp.f.lines} line${sp.f.lines === 1 ? '' : 's'}.</span></div><div class="spacer"></div><button class="btn ghost small" data-act="helpLevel">Not right? Change</button></div>`
      : `<div class="banner">${ic('target')}<div class="col" style="gap:2px"><b>No starting point yet</b><span class="muted">Watch one episode and we’ll estimate it from how you watched. There’s no test.</span></div><div class="spacer"></div><button class="btn ghost small" data-go="start">Pick a show</button></div>`}
    <div class="setup-grid">
      <div class="panel col" style="gap:12px"><h3>What do you want to enjoy in Japanese?</h3><span class="small subtle">Pick any. Shapes Discover and your first pick.</span>
        <div class="row wr">${Object.entries(MEDIUM).map(([k, l]) => chip(p.media.includes(k), 'prefMedia', k, l)).join('')}</div>
        <span class="eyebrow" style="margin-top:8px">Genres · optional</span>
        <div class="row wr">${['Slice of life', 'Mystery', 'Comedy', 'Romance', 'Action', 'Fantasy', 'Food & travel'].map(g => chip(p.genres.includes(g), 'prefGenre', g, esc(g))).join('')}</div></div>
      <div class="panel col" style="gap:12px"><h3>Why are you learning?</h3><span class="small subtle">Pick up to two. Each choice changes your decks and picks.</span>
        ${WHY.map(([k, t, s]) => `<button class="check-card${p.why.includes(k) ? ' on' : ''}" data-act="prefWhy" data-v="${k}" aria-pressed="${p.why.includes(k)}"><span class="box">${p.why.includes(k) ? ic('check') : ''}</span><span class="col" style="gap:0"><b>${t}</b><span class="small subtle">${s}</span></span></button>`).join('')}</div>
      <div class="col" style="gap:16px">
        <div class="panel col" style="gap:12px" id="importPanel"><h3>Bring what you already know</h3><span class="small subtle">Optional. Words you already know carry over, so your starting level is closer from day one.</span>
          <div class="imp"><span class="imp-ic">${ic('layers')}</span><span class="col" style="gap:0;flex:1"><b>Anki</b><span class="small subtle">Import a deck file (.apkg) — known cards carry over</span></span><button class="btn ghost small" data-act="ankiImport">Import</button></div>
          <div class="imp"><span class="imp-ic">${ic('import')}</span><span class="col" style="gap:0;flex:1"><b>jpdb or Migaku</b><span class="small subtle">Import your known-words list (.txt or .csv)</span></span><label class="btn ghost small">Import<input type="file" id="knownFile" accept=".txt,.csv,.tsv,.json" class="hidden"></label></div>
          <span class="status" id="importStatus"></span></div>
        <div class="panel col" style="gap:12px"><h3>How much time on a normal day?</h3>
          <div class="seg2">${[10, 20, 45, 60].map(m => `<button class="${p.minutes === m ? 'on' : ''}" data-act="prefMin" data-v="${m}" aria-pressed="${p.minutes === m}">${m === 60 ? '1 hour+' : m + ' min'}</button>`).join('')}</div>
          <span class="small subtle">At ${p.minutes === 60 ? 'an hour' : p.minutes + ' minutes'}: ${MIN[p.minutes]}. Sets your review load.</span></div>
        <a class="small" href="#/clip">Set up your own YouTube clip →</a></div>
    </div>
    <div class="row setup-foot">${asSettings ? '' : `<button class="btn" data-act="setupBack">Back</button>`}<div class="spacer"></div><span class="small subtle">Everything here can be changed later in Settings.</span><button class="btn primary" data-act="setupDone">${asSettings ? 'Save' : 'Show me my first pick'} ${ic('right')}</button></div>
  </div>`;
}

/* ============================== 03 · Today ============================== */
function primeList() { return PRIME_WORDS.filter(p => { const s = stOf(p.w); return s === 'unknown'; }); }
function scrToday() {
  const s = showById(PLAN.show), now = new Date(), part = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';
  const day = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const nPrime = primeList().length, due = dueCards().length, goal = app.prefs.minutes || PERSONA.goal;
  const tot = PLAN.prime + PLAN.watch + PLAN.review, maxW = Math.max(...PERSONA.week.map(w => w[1]), goal);
  const dueMax = Math.max(...PERSONA.dueWeek.map(d => d[1]));
  const ep = [76, 80, 82], X = i => 40 + i * 100, Y = v => 80 - (v - 70) * 3;
  return `${pageHead(`${day} ${part}`, `Tonight: ${goal} minutes, one episode closer`)}
  <div class="grid-today">
    <section class="panel plan">
      <div class="row"><h2 class="h3">${esc(s.title)} · Episode ${PLAN.ep}</h2><div class="spacer"></div><a class="link" href="#/discover">Change plan</a></div>
      <div class="row wr">${fitChip(s.fit)}${lvl(s.level)}<span class="small muted">Anime · Season 1</span><div class="spacer"></div><span class="small muted">Help level: ${PERSONA.helpLevel}</span><button class="link small" data-act="whyHelp">Why?</button></div>
      <div class="plan-body">${cover(s, 'tall')}<div class="col" style="gap:8px;flex:1">
        <a class="step on" href="#/prime"><span class="num">1</span><span class="col" style="gap:0;flex:1"><b>Prime ${nPrime} word${nPrime === 1 ? '' : 's'}</b><span class="small muted">Takes this episode from ${s.fit}% to about 90%</span></span><span class="small accent">${PLAN.prime} min</span></a>
        <a class="step" href="#/play/practice"><span class="num">2</span><span class="col" style="gap:0;flex:1"><b>Watch scenes 1–3</b><span class="small muted">Stops at ${PLAN.stopAt}, a natural break</span></span><span class="small muted">${PLAN.watch} min</span></a>
        <a class="step" href="#/review"><span class="num">3</span><span class="col" style="gap:0;flex:1"><b>Review ${Math.min(due, 8)} due words</b><span class="small muted">${Math.max(0, due - 8)} more wait for tomorrow</span></span><span class="small muted">${PLAN.review} min</span></a></div></div>
      <div class="row small"><b>Time budget</b><span class="lg"><i class="sw a"></i>Prime ${PLAN.prime}</span><span class="lg"><i class="sw w"></i>Watch ${PLAN.watch}</span><span class="lg"><i class="sw r"></i>Review ${PLAN.review}</span><div class="spacer"></div><b>${tot} of your ${goal} min</b></div>
      <div class="budget"><i class="a" style="flex:${PLAN.prime}"></i><i class="w" style="flex:${PLAN.watch}"></i><i class="r" style="flex:${PLAN.review}"></i></div>
      <div class="row wr"><a class="btn primary" href="#/prime">Start — prime ${nPrime} words</a><a class="btn" href="#/play/practice">Skip to watching ${ic('play')}</a><div class="spacer"></div><a class="link small" href="#/play/practice">Full episode (+12 min)</a></div>
    </section>
    <section class="panel side">
      <span class="eyebrow">Am I improving?</span>
      <div class="row" style="align-items:baseline"><span class="h3">${PERSONA.minutesWeek} min</span><span class="small muted">understood this week</span></div>
      <span class="small good">+${PERSONA.minutesDelta} min vs last week · active ${PERSONA.activeDays} of 7 days</span>
      <div class="small muted" style="text-align:right">Goal ${goal} min / day</div>
      <div class="mini-bars" role="img" aria-label="Minutes per day this week">${PERSONA.week.map(([d, m], i) => `<span title="${m} min"><i style="height:${Math.max(3, m / maxW * 44)}px" class="${i === PERSONA.week.length - 1 ? 'today' : ''}"></i><em>${d}</em></span>`).join('')}<b class="goal" style="bottom:${goal / maxW * 44 + 18}px"></b></div>
      <hr><b class="small">How much of this show you follow</b>
      <div class="row small"><span class="muted">85–90% = ideal</span><div class="spacer"></div><span class="accent">Ep 3 primed ~90%</span></div>
      <svg class="spark-ep" viewBox="0 0 300 100" role="img" aria-label="Episode 1 76%, episode 2 80%, episode 3 82%, about 90% after priming">
        <line x1="10" x2="295" y1="${Y(90)}" y2="${Y(90)}" class="ref"/>
        <polyline points="${ep.map((v, i) => X(i) + ',' + Y(v)).join(' ')}" class="ln"/>
        <line x1="${X(2)}" y1="${Y(82)}" x2="285" y2="${Y(90)}" class="dash"/>
        ${ep.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" class="${i === 2 ? 'hollow' : ''}"/><text x="${X(i)}" y="${Y(v) + 18}">Ep ${i + 1} · ${v}%</text>`).join('')}<circle cx="285" cy="${Y(90)}" r="3.5" class="acc"/></svg>
      <hr><div class="row"><div class="col" style="gap:0"><b>${(PERSONA.known + counts().known).toLocaleString()} known words</b><span class="small good">+${PERSONA.knownWeek + counts().known} this week</span></div><div class="spacer"></div>
        <svg width="96" height="28" viewBox="0 0 96 28" aria-hidden="true"><polyline points="${PERSONA.knownSeries.map((v, i) => (i * 8) + ',' + (26 - (v - 1600) / 800 * 24)).join(' ')}" class="spark"/></svg></div>
    </section>
    <section class="panel later">
      <div class="row"><h2 class="h4">Pick up later</h2><span class="small muted">Watchlist ${app.watchlist.length + 5} · Read later 3</span><div class="spacer"></div><a class="link small" href="#/discover">Open library ${ic('right')}</a></div>
      ${LATER.map(l => { const s = l.show && showById(l.show); const to = l.to || (s && s.open) || ('show/' + l.show);
        return `<a class="later-row" href="#/${to}"><span class="sq">${ic(l.icon)}</span><span class="col" style="gap:0;flex:1"><b>${esc(s ? s.title : l.title)}</b><span class="small muted">${esc(l.sub)}</span></span>${l.fit ? fitChip(l.fit) : '<span></span>'}<span class="col later-prog">${bar(l.prog)}<span class="small muted">${l.left}</span></span>${ic('chev')}</a>`; }).join('')}
    </section>
    <section class="panel side">
      <span class="eyebrow">Review queue</span>
      <div class="row" style="align-items:baseline"><span class="h3">${due} due</span><span class="small muted">today · about ${Math.max(1, Math.round(due / 2))} min</span></div>
      <div class="due-bars">${PERSONA.dueWeek.map(([d, n], i) => { const v = i === 0 ? due : n; return `<span><em>${v}</em><i style="height:${Math.max(4, v / Math.max(dueMax, due) * 44)}px" class="${i === 0 ? 'today' : ''}"></i><em>${d}</em></span>`; }).join('')}</div>
      <p class="small muted">${Math.min(due, 8)} are in tonight’s plan; clearing them keeps every day under ${dueMax}.</p>
      <div class="spacer"></div><a class="btn wide" href="#/review">Review all ${due} now</a>
    </section>
  </div>`;
}

/* ============================== 04 · Discover ============================== */
function scrDiscover() {
  const D = app.discover;
  const pass = s => s.medium === D.tab && D.fit.includes(fitOf(s.fit)) && (!D.starter || ['L1', 'L2'].includes(s.level)) && (!D.jpOnly || s.subs.startsWith('JP'));
  const rows = [
    ['Right for you', '85–90% of the words are ones you know — enough to follow, still teaching you something', s => fitOf(s.fit) === 'ideal'],
    ['Start here', 'Easy for you — short episodes and clear speech to build momentum', s => fitOf(s.fit) === 'easy'],
    ['Stretch yourself', 'More new words. Prime first, or read along with readings on', s => ['stretch', 'hard'].includes(fitOf(s.fit))]
  ];
  const card = s => `<a class="show-card" href="#/show/${s.id}">${cover(s)}<b>${esc(s.title)}</b><span class="row" style="gap:6px">${fitChip(s.fit)}${lvl(s.level)}</span><span class="small subtle">${esc(s.subs)} · ${s.jlpt}</span><span class="small subtle">${esc(s.genre)} · ${s.eps} ${s.unit || 'eps'}</span></a>`;
  const fchip = (k, l) => `<button class="chip-t${D.fit.includes(k) ? ' on' : ''}" data-act="dFit" data-v="${k}" aria-pressed="${D.fit.includes(k)}">${D.fit.includes(k) ? ic('check') : ''}${l}</button>`;
  let body = rows.map(([t, sub, f]) => { const list = SHOWS.filter(s => pass(s) && f(s)); return list.length ? `<section class="col" style="gap:4px"><div class="row"><h2 class="h3">${t}</h2><div class="spacer"></div><button class="link small" data-act="soon">See all ${ic('right')}</button></div><p class="small muted" style="margin:0 0 12px">${sub}</p><div class="show-grid">${list.map(card).join('')}</div></section>` : ''; }).join('');
  if (!body) body = `<div class="panel empty"><b>Nothing matches these filters</b><span class="muted small">Try adding Stretch, or turning off Starter–L2.</span><button class="btn small" data-act="dReset">Reset filters</button></div>`;
  return `${pageHead('Discover · in your ImmerLingo library', 'Shows you can follow tonight')}
  <div class="row wr"><div class="tabs">${Object.entries(MEDIUM).map(([k, l]) => `<button class="${D.tab === k ? 'on' : ''}" data-act="dTab" data-v="${k}" aria-pressed="${D.tab === k}">${l}</button>`).join('')}</div>
    <span class="small muted">${ic('check')} Every title has Japanese and English subtitles</span><button class="link small" data-act="request">Request a show</button></div>
  <div class="row wr filters"><span class="small muted">Fit</span>${fchip('ideal', 'Ideal 85–90%')}${fchip('easy', 'Easy 91%+')}${fchip('stretch', 'Stretch')}${fchip('hard', 'Hard')}<span class="divider"></span>
    <span class="small muted">Show</span><button class="chip-t${D.starter ? ' on' : ''}" data-act="dStarter" aria-pressed="${D.starter}">${D.starter ? ic('check') : ''}Starter–L2</button><button class="chip-t${D.jpOnly ? ' on' : ''}" data-act="dJp" aria-pressed="${D.jpOnly}">${D.jpOnly ? ic('check') : ''}JP subtitles</button><div class="spacer"></div><span class="chip-t">Sort: best fit</span></div>
  ${D.legend ? `<div class="legend-bar">${ic('help')}<b>Reading a card</b><span class="small muted">% = words you know:</span><span class="lg"><i class="dot easy"></i>Easy 91+</span><span class="lg"><i class="dot ideal"></i><b>Ideal 85–90</b></span><span class="lg"><i class="dot stretch"></i>Stretch 78–84</span><span class="lg"><i class="dot hard"></i>Hard &lt;78</span>${lvl('L2')}<span class="small muted">overall difficulty</span><div class="spacer"></div><button class="btn small" data-act="dLegend">Got it</button></div>` : ''}
  ${body}
  ${D.tab !== 'anime' ? '' : `<section class="col" style="gap:4px"><div class="row"><h2 class="h3">Your own clip</h2></div><p class="small muted" style="margin:0 0 12px">A YouTube episode with Japanese audio, played in the ImmerLingo player</p>
    <div class="show-grid"><a class="show-card" href="#/clip"><div class="cover" style="background:linear-gradient(180deg,#2b1d4a,#6b4bb0)"><span>YouTube</span></div><b>${esc(mine.title)}</b><span class="small subtle">${mine.lines.length ? mine.lines.length + ' lines ready' : 'Add subtitles first'}</span></a></div></section>`}`;
}

/* ============================== 05 · Media detail ============================== */
let detailSeason = 1, detailEp = 3;
function scrShow(id) {
  const s = showById(id) || showById('kissaten'), full = !!s.words;
  const w = s.words || { known: Math.round(s.fit * 22), learning: 90, unknown: Math.round((100 - s.fit) * 22), ignored: 10 };
  const total = w.known + w.learning + w.unknown + w.ignored, sen = s.sentences || { all: Math.round(s.fit / 2), one: 30, more: 100 - Math.round(s.fit / 2) - 30 };
  const epFit = s.epFit || Array.from({ length: Math.min(12, s.eps) }, (_, i) => Math.max(70, Math.min(95, s.fit + ((i * 7) % 9) - 4)));
  const eps = detailSeason === 1 ? epFit : epFit.map(v => Math.max(70, v - 4));
  const nPrime = primeList().length, inList = app.watchlist.includes(s.id);
  const pctPos = v => Math.max(0, Math.min(100, (v - 50) * 2));
  return `<header class="page-head"><a class="btn ghost small" href="#/discover">${ic('left')} Discover</a><div class="spacer"></div>${searchBox()}${avatar()}</header>
  <div class="grid-detail">
    <div class="col" style="gap:24px">
      <section class="detail-top">${cover(s, 'poster')}
        <div class="col" style="gap:10px;flex:1">
          <h1 class="h1">${esc(s.title)}</h1><span class="muted" lang="ja">${esc(s.jp)}${s.en ? ' · ' + esc(s.en) : ''}</span>
          <div class="row wr">${lvl(s.level)}<span class="tag">${s.jlpt} grammar</span><span class="tag">${MEDIUM[s.medium]}</span><span class="small muted">${s.year || 2025} · ${s.seasons || 1} season${(s.seasons || 1) > 1 ? 's' : ''} · ${s.eps} ${s.unit || 'eps'}</span></div>
          <p class="muted" style="margin:0">${esc(s.desc || 'A sample title in the prototype library. Its numbers are generated from its fit so the screen reads as it would for a real show.')}</p>
          <div class="row wr facts"><span><em>Genre</em><b>${esc(s.genre)}</b></span><span><em>Studio</em><b>${esc(s.studio || 'Sample Studio')}</b></span><span><em>Source</em><b>${esc(s.source || 'Original')}</b></span></div>
          <div class="row wr">${s.play ? `<a class="btn" href="#/play/${s.play}">Watch episode ${detailEp} ${ic('play')}</a>` : s.open ? `<a class="btn" href="#/${s.open}">Open ${s.medium === 'manga' ? 'chapter 12' : 'chapter 4'} ${ic('right')}</a>` : `<button class="btn" disabled title="Only Kissaten no Yoru plays in this prototype">Watch episode ${detailEp} ${ic('play')}</button>`}
            <button class="btn ghost" data-act="watchlist" data-id="${s.id}" aria-pressed="${inList}">${inList ? 'On your watchlist' : 'Watchlist'} ${ic(inList ? 'check' : 'bookmark', 'accent')}</button></div>
          <span class="small muted">${ic('check')} In your library · Japanese and English subtitles · ${s.eps} ${s.unit || 'episodes'}${s.play ? '' : ' · preview only in this prototype'}</span>
        </div></section>
      <section class="panel col" style="gap:16px">
        <div class="row"><div class="col" style="gap:0"><h2 class="h4">Episodes</h2><span class="small muted">% = words you know in that episode</span></div><div class="spacer"></div>
          ${(s.seasons || 1) > 1 ? `<div class="tabs small">${[1, 2].map(n => `<button class="${detailSeason === n ? 'on' : ''}" data-act="season" data-v="${n}">Season ${n}</button>`).join('')}</div>` : ''}</div>
        <div class="ep-grid">${eps.map((v, i) => { const n = i + 1, watched = detailSeason === 1 && n < 3, next = detailSeason === 1 && n === detailEp; return `<button class="ep${next ? ' next' : ''}${v < 78 ? ' hard' : ''}" data-act="pickEp" data-v="${n}"><b>${watched ? ic('check') : ''}${n}</b><span>${v}%</span></button>`; }).join('')}</div>
        <span class="small muted">${ic('check')} Watched · Outlined = up next · <span class="danger">Red %</span> = hard for you (&lt;78%) — prime first</span></section>
    </div>
    <div class="col" style="gap:24px">
      <section class="panel col" style="gap:14px">
        <span class="eyebrow">Will I understand it?</span>
        <div class="row" style="align-items:center;gap:16px"><span class="big-num">${s.fit}%</span><div class="col" style="gap:0"><b>of this show’s words you know</b><span class="small muted">Ideal is 85–90%: easy to follow, still teaching</span></div></div>
        <div class="scale"><i style="width:${pctPos(s.fit)}%"></i><b style="left:${pctPos(85)}%;width:${pctPos(90) - pctPos(85)}%"></b></div>
        <div class="row small muted"><span>50%</span><div class="spacer"></div><span style="margin-right:12px">You</span><span>85</span><span>90</span><span style="margin-left:24px">100%</span></div>
        <hr><div class="row"><b>Unique words</b><div class="spacer"></div><b>${total.toLocaleString()}</b></div>
        <div class="stack">${[['known', w.known], ['learning', w.learning], ['unknown', w.unknown], ['ignored', w.ignored]].map(([k, v]) => `<i class="${k}" style="flex:${v}"></i>`).join('')}</div>
        <div class="grid2 small"><span class="lg"><i class="sw known"></i>Known <b>${w.known.toLocaleString()}</b></span><span class="lg"><i class="sw learning"></i>Learning <b>${w.learning}</b></span><span class="lg"><i class="sw unknown"></i>Unknown <b>${w.unknown}</b></span><span class="lg"><i class="sw ignored"></i>Ignored (names) <b>${w.ignored}</b></span></div>
        <hr><b>Sentences</b>
        ${[['Every word known', sen.all], ['One new word', sen.one, true], ['Two or more new', sen.more]].map(([l, v, best]) => `<div class="col" style="gap:4px"><div class="row"><span>${l}</span>${best ? '<span class="fit fit-ideal">Best for learning</span>' : ''}<div class="spacer"></div><b>${v}%</b></div>${bar(v / 100)}</div>`).join('')}
      </section>
      ${s.play ? `<section class="panel col path" style="gap:12px"><h2 class="h4">${ic('target', 'accent')} Path to 90%</h2>
        <p class="muted" style="margin:0">Learn ${nPrime} words that come up in episode ${detailEp} — about ${Math.max(1, Math.round(nPrime / 4))} minutes. You’ll follow nine lines in ten.</p>
        <a class="btn primary wide" href="#/prime">Prime ${nPrime} words, then watch ${ic('spark')}</a>
        <button class="link small" data-act="bulkCards" data-n="${w.unknown}">Make cards for all ${w.unknown} unknown</button>
        <span class="small subtle">Bulk cards lose the scene they came from — priming usually sticks better.</span></section>` : ''}
    </div>
  </div>`;
}

/* ============================== 06 · Prime ============================== */
let primeQ = [], primeI = 0, primeShowEn = false, primeDone = [];
function primeStart() { primeQ = primeList().map(p => p.w); primeI = 0; primeShowEn = false; primeDone = []; }
function scrPrime() {
  const s = showById(PLAN.show), N = primeQ.length;
  const head = (sub) => `<header class="focus-head"><a class="btn ghost small" href="#/show/${s.id}">${ic('left')} ${esc(s.title)}</a><div class="col center" style="gap:0"><b>Before episode ${PLAN.ep}</b><span class="small muted">${sub}</span></div>
    <div class="row" style="justify-content:flex-end;gap:8px"><span class="small muted">You’ll follow</span><span class="fit fit-ideal">${s.fit}% → ${Math.min(90, s.fit + Math.round(primeDone.length / Math.max(1, N) * (90 - s.fit)))}% so far</span></div></header>
    <div class="segbar">${(N ? primeQ : [0]).map((_, i) => `<i class="${i < primeI ? 'done' : i === primeI ? 'cur' : ''}"></i>`).join('')}</div>`;
  if (!N || primeI >= N) {
    return `<div class="focus">${head(N ? `All ${N} words done` : 'Nothing to prime')}
      <div class="panel focus-card center col" style="gap:12px"><span class="h2">${N ? 'Primed — you’re ready' : 'You already know every word worth priming'}</span>
      <p class="muted" style="margin:0">${N ? `${primeDone.filter(x => x === 'keep').length} kept to practise · ${primeDone.filter(x => x === 'knew').length} you already knew. Kept words show a purple line while you watch.` : 'Watch straight away. New words still get a red line.'}</p>
      <div class="row center"><a class="btn primary" href="#/play/practice">Watch episode ${PLAN.ep} ${ic('play')}</a><a class="btn" href="#/today">Back to Today</a></div></div></div>`;
  }
  const w = primeQ[primeI], pw = PRIME_WORDS.find(p => p.w === w), L = PRACTICE.lines[pw.line], r = findReading(w);
  const times = PRACTICE.lines.filter(l => tokenize(l.jp).some(t => t.base === w)).length;
  const toks = []; const lineHTML = tokLine(L.jp, toks, 'off', w);
  return `<div class="focus">${head(`Word ${primeI + 1} of ${N} · about ${Math.max(1, Math.ceil((N - primeI) / 4))} min left`)}
    <div class="panel focus-card col center" style="gap:12px">
      <span class="tag">Said ${times} time${times === 1 ? '' : 's'} in this scene</span>
      <span class="jp-display" lang="ja">${esc(w)}</span><span class="muted" lang="ja">${r && r !== w ? esc(r) + ' · ' : ''}${romaji(r || w)}</span>
      <span>${esc(meaningOf(w))}</span>
      <div class="scene-box"><button class="btn small dark" data-act="primeHear">${ic('play')} Hear it in the scene · ${fmt(L.t)}</button></div>
      <div class="rt-line big prime-line" lang="ja">${lineHTML}</div>
      ${primeShowEn ? `<span class="muted">${esc(L.en)}</span>` : `<button class="btn small" data-act="primeEn">Show translation</button>`}
    </div>
    <div class="row center" style="margin-top:20px"><button class="btn" data-act="primeKnew">I knew it</button><button class="btn primary" data-act="primeKeep">New to me — keep it</button></div>
    <p class="small subtle center">Keys <span class="kbd">1</span> knew it · <span class="kbd">2</span> keep it · <span class="kbd">Space</span> replay</p>
    <div class="row center small" style="gap:24px"><a class="link" href="#/play/practice">Skip the rest and watch</a><span class="subtle">${ic('help')} Why these ${N}: new to you and said in this scene</span></div>
  </div>`;
}

/* ============================== 12 · Read (novel) ============================== */
let readTab = 'library', readSel = null, readToks = [], pasted = '';
function scrRead() {
  const R = app.read, page = NOVEL.pages[R.page - 1] || NOVEL.pages[0], s = showById('tsuki');
  readToks = [];
  const tabs = [['library', 'My library'], ['novels', 'Web novels'], ['articles', 'Articles'], ['paste', 'Paste or import']];
  let main;
  if (readTab === 'paste') {
    main = `<section class="panel reader col" style="gap:16px"><h2 class="h4">Paste Japanese text</h2><textarea id="pasteIn" lang="ja" placeholder="Paste an article, a chapter or lyrics you own…">${esc(pasted)}</textarea>
      <div class="row"><span class="small subtle">${tokenizer ? 'Words are split and given readings automatically.' : 'The word splitter is still loading or offline — words split roughly.'}</span><div class="spacer"></div><button class="btn primary small" data-act="pasteRead">Read it</button></div>
      ${pasted ? `<hr><div class="reader-text" style="font-size:${R.size}px" lang="ja">${pasted.split(/\n+/).filter(Boolean).map(p => `<p>${tokLine(p, readToks, R.furi, readSel && readSel.base, true)}</p>`).join('')}</div>` : ''}</section>`;
  } else if (readTab !== 'library') {
    main = `<section class="panel reader empty"><b>${tabs.find(t => t[0] === readTab)[1]} aren’t in this prototype</b><span class="muted small">My library has one chapter, and Paste or import reads any Japanese text.</span></section>`;
  } else {
    main = `<section class="panel reader col">
      <div class="row reader-head"><div class="col" style="gap:0"><h2 class="h4">${esc(NOVEL.title)}</h2><span class="small muted">Web novel · page ${R.page} of ${NOVEL.pages.length}</span></div><div class="spacer"></div>
        <button class="btn ghost small" data-act="readSize" title="Text size">Aa</button><button class="btn ghost small" data-act="readFuri">Furigana: ${R.furi === 'all' ? 'all' : R.furi === 'off' ? 'off' : 'unknown'} ${ic('down')}</button><button class="icon-btn" data-act="readAloud" aria-label="Read the page aloud">${ic('speaker')}</button></div>
      <div class="reader-text" style="font-size:${R.size}px" lang="ja">${page.map(p => `<p>${tokLine(p, readToks, R.furi, readSel && readSel.base, true)}</p>`).join('')}</div>
      <div class="spacer"></div>
      <div class="row pager"><button class="btn small" data-act="readPage" data-v="-1" ${R.page <= 1 ? 'disabled' : ''}>Previous ${ic('left')}</button><span class="flex">${bar(R.page / NOVEL.pages.length)}</span><span class="small muted">Page ${R.page} of ${NOVEL.pages.length}</span><button class="btn small" data-act="readPage" data-v="1" ${R.page >= NOVEL.pages.length ? 'disabled' : ''}>Next page ${ic('right')}</button></div></section>`;
  }
  const allT = NOVEL.pages.flat().flatMap(l => content(l)), newW = new Set(allT.filter(t => effSt(t.base) === 'unknown').map(t => t.base));
  const saved = [...new Set(allT.filter(t => effSt(t.base) === 'learning').map(t => t.base))];
  return `<header class="page-head"><div class="tabs">${tabs.map(([k, l]) => `<button class="${readTab === k ? 'on' : ''}" data-act="readTab" data-v="${k}">${l}</button>`).join('')}</div><div class="spacer"></div>${searchBox()}${avatar()}</header>
  <div class="grid-read">${main}
    <aside class="col" style="gap:16px">
      <section class="panel col" style="gap:12px"><span class="eyebrow">This chapter</span>
        <div class="grid3 kpis"><span><b>${s.fit}%</b><em>for you</em></span><span><b>${newW.size}</b><em>new words</em></span><span><b>~12 min</b><em>to read</em></span></div>
        <span class="fit fit-stretch" style="align-self:flex-start">Stretch · prime ${Math.min(9, newW.size)} words first?</span></section>
      <section class="panel col wcard" style="gap:10px" id="wcard">${readSel ? wordCardHTML(readSel, { common: 'Common in novels', en: '' }) : '<span class="muted small">Tap any word to see its reading and meaning. Words with a <span class="accent">red line</span> are new to you; <span style="color:var(--purple)">purple</span> means you’re practising it.</span>'}</section>
      <section class="panel col" style="gap:8px"><div class="row"><b>Saved in this chapter</b><div class="spacer"></div><b>${saved.length}</b></div>
        ${saved.length ? saved.map(w => `<div class="row small"><span class="jp-s" lang="ja">${esc(w)}</span><span class="muted">${esc(meaningOf(w))}</span></div>`).join('') : '<span class="small subtle">Words you save show up here.</span>'}</section>
    </aside></div>`;
}

/* ============================== 13 · Manga ============================== */
let mangaBubble = 2, mangaSel = null, mangaToks = [], mangaFix = false, mangaRtl = true, mangaSpread = false;
function scrManga() {
  const b = MANGA.bubbles.find(x => x.n === mangaBubble);
  mangaToks = [];
  const line = tokLine(b.text, mangaToks, 'off', mangaSel && mangaSel.base, true);
  if (!mangaSel) mangaSel = mangaToks.find(t => effSt(t.base) === 'unknown') || mangaToks[0];
  const rel = mangaSel && Object.entries(words).find(([w, v]) => w !== mangaSel.base && v.st === 'learning' && [...w].some(c => isKanji(c) && mangaSel.base.includes(c)));
  const related = rel ? `<div class="related">${ic('link')}<span>Related: <span lang="ja">${esc(rel[0])}</span> — saved from ${esc(rel[1].ctx ? rel[1].ctx.title : 'your media')}</span></div>` : '';
  return `<header class="page-head"><a class="btn ghost small" href="#/read">${ic('left')} Library</a><div class="col" style="gap:0"><h1 class="h4">Hanabi Street · Chapter ${MANGA.chapter}</h1><span class="small muted">Manga · page ${MANGA.page} of ${MANGA.pages}</span></div><div class="spacer"></div>
    <span class="fit fit-ideal">Text detected · ${MANGA.bubbles.length} bubbles</span><button class="btn ghost small" data-act="mRtl" aria-pressed="${mangaRtl}">${ic(mangaRtl ? 'left' : 'right')} ${mangaRtl ? 'Right-to-left' : 'Left-to-right'}</button><button class="btn ghost small" data-act="mSpread" aria-pressed="${mangaSpread}">${ic('book')} ${mangaSpread ? 'Single page' : 'Spread'}</button></header>
  <div class="grid-read">
    <section class="panel manga-wrap col" style="gap:16px">
      <div class="manga-page" role="img" aria-label="Manga page with four speech bubbles">
        ${MANGA.panels.map(p => `<div class="mpanel" style="left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%"></div>`).join('')}
        ${MANGA.bubbles.map(x => `<button class="bubble${x.n === mangaBubble ? ' on' : ''}" style="left:${x.x}%;top:${x.y}%;width:${x.w}%;height:${x.h}%" data-act="mBubble" data-v="${x.n}" aria-label="Bubble ${x.n}"><span class="bn">${x.n}</span><span class="vt" lang="ja">${esc(plain(x.text))}</span></button>`).join('')}
      </div>
      <div class="row center"><button class="btn small" data-act="mPage">Next page ${ic(mangaRtl ? 'left' : 'right')}</button><span class="small muted">${MANGA.page} / ${MANGA.pages}</span><button class="btn small" data-act="mPage">Previous ${ic(mangaRtl ? 'right' : 'left')}</button></div>
    </section>
    <aside class="col" style="gap:16px">
      <section class="panel col" style="gap:10px"><div class="row"><span class="eyebrow">Bubble ${b.n} · detected text</span><div class="spacer"></div><button class="link small" data-act="mFix">${mangaFix ? 'Done' : 'Fix text'}</button></div>
        ${mangaFix ? `<input id="mFixIn" lang="ja" value="${esc(plain(b.text))}">` : `<div class="rt-line big" lang="ja">${line}</div>`}
        <span class="small subtle">${mangaFix ? 'Edits stay on this device in the prototype.' : 'Wrong text? Fixing it improves detection for everyone.'}</span></section>
      <section class="panel col wcard" style="gap:10px" id="wcard">${mangaSel ? wordCardHTML(mangaSel, { common: 'Common in manga', en: b.en, related }) : ''}</section>
      <span class="small subtle">${ic('help')} The panel image is attached to the card automatically.</span>
    </aside></div>`;
}

/* ============================== 14 · Dictionary ============================== */
let dictSel = null;
function dictSearch(q) {
  q = (q || '').trim(); if (!q) return [];
  const qh = toHira(q).toLowerCase(), ql = q.toLowerCase();
  const pool = new Map();
  for (const d of DICT) pool.set(d.w, d);
  for (const [w, g] of Object.entries(Object.assign({}, GLOSS_MORE, GLOSS))) if (!pool.has(w)) pool.set(w, { w, r: findReading(w), en: [g], tags: [] });
  const score = d => { const r = toHira(d.r || ''), ro = d.ro || romaji(r);
    if (d.w === q || r === qh || ro === ql) return 0; if (d.w.startsWith(q) || r.startsWith(qh) || ro.startsWith(ql)) return 1;
    if (d.w.includes(q) || (r && r.includes(qh))) return 2; if (d.en.some(e => e.toLowerCase().includes(ql))) return 3; return 9; };
  return [...pool.values()].map(d => [score(d), d]).filter(x => x[0] < 9).sort((a, b) => a[0] - b[0] || (DICT.includes(b[1]) - DICT.includes(a[1]))).map(x => x[1]).slice(0, 30);
}
function scrDictionary(q) {
  q = q || 'まつ';
  const res = dictSearch(q); if (!dictSel || !res.includes(dictSel)) dictSel = res[0] || null;
  const d = dictSel;
  let detail = '<div class="empty"><b>No results</b><span class="muted small">Try kana, kanji, romaji or an English word.</span></div>';
  if (d) {
    const seenMine = Object.entries(words).filter(([w, v]) => w === d.w && v.ctx).map(([w, v]) => [v.ctx.jp, 'play', v.ctx.title]);
    const seen = [...(d.seen || []).map(x => [plain(x[0]), x[1], x[2], x[0]]), ...seenMine.filter(x => !(d.seen || []).some(y => plain(y[0]) === x[0]))];
    const st = stOf(d.w), r = d.r || '';
    detail = `<div class="row" style="align-items:flex-start"><div class="col" style="gap:4px"><div class="row" style="align-items:baseline;gap:12px"><span class="jp-display" lang="ja">${esc(d.w)}</span><span class="muted" lang="ja">${r && r !== d.w ? esc(r) + ' · ' : ''}${esc(d.ro || romaji(r || d.w))}</span><button class="icon-btn" data-act="say" data-say="${esc(r || d.w)}" aria-label="Hear it">${ic('speaker')}</button></div></div><div class="spacer"></div>
        <button class="btn" data-act="dictKnown">${st === 'known' ? 'Known ✓' : 'Mark known'}</button><button class="btn primary" data-act="dictSave">Save card ${ic('plus')}</button></div>
      <div class="row wr">${(d.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <ol class="senses">${d.en.map(e => `<li>${esc(e)}</li>`).join('')}</ol>
      ${d.forms ? `<hr><div class="row"><span class="eyebrow">Forms</span><div class="spacer"></div><span class="small muted">${d.formNote}</span></div><div class="forms">${d.forms.map(([l, f]) => `<div><span class="small muted">${l}</span><span lang="ja">${esc(f)}</span></div>`).join('')}</div>` : ''}
      <div class="row"><span class="eyebrow">Seen in your media</span><div class="spacer"></div><span class="small muted">${seen.length ? `${seen.length} of ${Math.max(seen.length, d.seenOf || seen.length)}` : 'Not yet'}</span></div>
      ${seen.length ? seen.map(x => `<button class="seen" data-act="say" data-say="${esc(x[0])}">${ic('play')}<span lang="ja">${esc(x[0]).replace(esc(d.w), `<u>${esc(d.w)}</u>`)}</span><div class="spacer"></div><span class="small muted">${ic(x[1])} ${esc(x[2])}</span></button>`).join('') : '<span class="small subtle">When this word shows up in something you watch or read, the line lands here.</span>'}
      ${d.kanji ? `<div class="kanji"><span class="kbox" lang="ja">${d.kanji.k}</span><div class="col" style="gap:0;flex:1"><b><span lang="ja">${d.kanji.k}</span> — ${d.kanji.m} · ${d.kanji.strokes} strokes · ${d.kanji.jlpt}</b><span class="small muted">Also in ${esc(d.kanji.also)}</span></div><button class="link small" data-act="soon">Kanji details ${ic('right')}</button></div>` : ''}`;
  }
  return `<header class="page-head"><label class="search wide">${ic('search')}<input id="dictIn" value="${esc(q)}" lang="ja" aria-label="Search the dictionary" autocomplete="off"><span class="kbd">/</span></label><span class="small muted hidden-sm">Japanese or English · kana, kanji, romaji</span>${avatar()}</header>
  <div class="grid-dict">
    <section class="panel results"><div class="row small"><b>${res.length} result${res.length === 1 ? '' : 's'}</b><div class="spacer"></div><span class="muted">Common first</span></div>
      ${res.map(x => `<button class="res${x === d ? ' on' : ''}" data-act="dictPick" data-w="${esc(x.w)}"><span class="row" style="gap:8px;align-items:baseline"><b class="jp-m" lang="ja">${esc(x.w)}</b><span class="small muted" lang="ja">${x.r && x.r !== x.w ? esc(x.r) : ''}</span></span><span class="small muted">${esc(x.en[0])}</span></button>`).join('')}</section>
    <section class="panel col detail" style="gap:16px">${detail}</section></div>`;
}

/* ============================== 15 · Learn ============================== */
function scrLearn() {
  const due = dueCards().length, maxR = Math.max(...PERSONA.reviewsWeek.map(r => r[1]), due);
  const fromShow = dueCards().filter(c => /Kissaten/.test(c.src || '')).length;
  return `${pageHead('Learn', 'Keep what you met', searchBox('Search decks and cards') + avatar())}
  <section class="panel week">
    <div class="col" style="gap:2px"><span class="eyebrow">This week</span><span class="h3">${PERSONA.reviewsTotal} reviews</span><span class="small muted">${PERSONA.remembered}% remembered · goal 85%</span></div>
    <div class="rev-bars">${PERSONA.reviewsWeek.map(([d, n]) => `<span><em>${n}</em><i style="height:${n / maxR * 48}px"></i><em>${d}</em></span>`).join('')}<span><em>${due} due</em><i class="today" style="height:${Math.max(6, due / maxR * 48)}px"></i><em>Today</em></span></div>
    <div class="col center" style="gap:6px"><a class="btn primary" href="#/review">Review ${due} due · ~${Math.max(1, Math.round(due / 2))} min</a><span class="small muted">${fromShow} are from Kissaten no Yoru</span></div></section>
  <div class="grid-learn">
    <section class="panel col" style="gap:12px"><div class="row"><h2 class="h4">Decks</h2><div class="spacer"></div><button class="link small" data-act="soon">Import deck</button><button class="link small" data-act="soon">New deck ${ic('plus')}</button></div>
      ${DECKS.map(d => { const n = d.id === 'mine' ? due : d.due, nn = d.id === 'mine' ? cards.filter(c => c.due > Date.now()).length : d.fresh;
        return `<a class="deck" href="${d.id === 'mine' ? '#/review' : '#/learn'}" ${d.id === 'mine' ? '' : 'data-act="soon"'}><span class="sq">${d.code}</span><span class="col" style="gap:4px;flex:1"><b>${esc(d.name)}</b><span class="row" style="gap:6px"><span class="pill ${n ? 'due' : ''}">${n} due</span><span class="pill">${nn} ${d.id === 'mine' ? 'later' : 'new'}</span><span class="small muted">${d.id === 'mine' ? cards.length + ' cards from your media' : esc(d.note)}</span></span></span><span class="dots">${'SMTWTFS'.split('').map(c => `<i>${c}</i>`).join('')}</span>${ic('dots')}</a>`; }).join('')}
      <a class="deck" href="#/words"><span class="sq">${ic('book')}</span><span class="col" style="gap:4px;flex:1"><b>Word library</b><span class="small muted">${Object.keys(words).length} words you’ve met · change any word’s status</span></span>${ic('chev')}</a></section>
    <section class="panel col" style="gap:14px"><h2 class="h4">Foundations</h2><span class="small muted">Short courses that unlock native media — taught with clips from real shows.</span>
      ${FOUNDATIONS.map(f => `<div class="found"><span class="sq jp-m" lang="ja">${f.glyph}</span><span class="col" style="gap:6px;flex:1"><span class="row"><b>${f.name}</b><div class="spacer"></div><span class="small muted">${f.pct != null ? f.pct + '%' : f.done + ' / ' + f.of}</span></span>${bar(f.pct != null ? f.pct / 100 : f.done / f.of, f.done === f.of ? 'good' : '')}</span></div>`).join('')}
      <button class="btn" data-act="soon" style="align-self:flex-start">Continue Katakana ${ic('right')}</button><span class="small muted">~10 min a day</span></section></div>`;
}

/* ============================== 16 · Review ============================== */
let revQ = [], revI = 0, revShow = false, revLog = [], revUndo = null;
function reviewStart() { revQ = dueCards().map(c => c.id); revI = 0; revShow = false; revLog = []; revUndo = null; }
const ivlTxt = d => d < 1 ? 'under a minute' : d === 1 ? '1 day' : d < 30 ? d + ' days' : Math.round(d / 30) + ' months';
function nextIvls(c) { const v = c.ivl || 1; return { again: 0, hard: Math.max(1, Math.round(v * 1.2)), good: Math.max(2, Math.round(v * 2)), easy: Math.max(4, Math.round(v * 4)) }; }
function scrReview() {
  const N = revQ.length;
  const head = sub => `<header class="focus-head"><a class="btn ghost small" href="#/learn">${ic('left')} Learn</a><div class="col center" style="gap:0"><b>Review · My cards</b><span class="small muted">${sub}</span></div>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost small" data-act="revEdit" ${revI < N ? '' : 'disabled'}>Edit card</button><button class="btn ghost small" data-act="revUndo" ${revUndo ? '' : 'disabled'}>${ic('undo')} Undo</button></div></header>
    <div class="segbar">${(N ? revQ : [0]).map((_, i) => `<i class="${i < revI ? 'done' : i === revI ? 'cur' : ''}"></i>`).join('')}</div>`;
  if (!N || revI >= N) {
    const ok = revLog.filter(x => x !== 'again').length;
    return `<div class="focus">${head(N ? 'All done' : 'Nothing due')}<div class="panel focus-card col center" style="gap:12px"><span class="h2">${N ? `${N} reviewed · ${Math.round(ok / N * 100)}% remembered` : 'Nothing is due right now'}</span>
      <p class="muted" style="margin:0">${N ? 'Cards you remembered come back later; Again cards come back sooner.' : 'Save words while you watch or read and they’ll show up here.'}</p>
      <div class="row center"><a class="btn primary" href="#/today">Back to Today</a><a class="btn" href="#/learn">Learn</a></div></div></div>`;
  }
  const c = cards.find(x => x.id === revQ[revI]), iv = nextIvls(c), toks = [];
  const line = tokLine(c.jp, toks, 'off', c.w);
  return `<div class="focus">${head(`Card ${revI + 1} of ${N} · about ${Math.max(1, Math.ceil((N - revI) / 3))} min left`)}
    <div class="panel rev-card">
      <div class="rev-scene"><span class="src">${ic('video')} ${esc(c.src || 'Your media')}</span><div class="rt-line big" lang="ja">${line}</div><button class="btn small dark" data-act="revHear">${ic('speaker')} Replay line <span class="kbd">R</span></button></div>
      ${revShow ? `<div class="col center rev-ans" style="gap:8px"><div class="row center" style="align-items:baseline;gap:10px"><span class="jp-display sm" lang="ja">${esc(c.w)}</span><span class="muted" lang="ja">${c.r && c.r !== c.w ? esc(c.r) : ''}</span><button class="icon-btn" data-act="say" data-say="${esc(c.r || c.w)}" aria-label="Hear it">${ic('speaker')}</button></div>
        <span>${esc(c.def)}</span><span class="small muted" lang="ja">Here: ${esc(c.here || c.en || '')}</span>
        ${c.line != null ? `<button class="link small" data-act="revScene" data-v="${c.line}">Open this scene ${ic('right')}</button>` : ''}</div>`
      : `<div class="col center rev-ans" style="gap:8px"><span class="muted">What does <b lang="ja">${esc(c.w)}</b> mean here?</span><button class="btn" data-act="revShow">Show answer <span class="kbd">Space</span></button></div>`}
    </div>
    ${revShow ? `<div class="grades">${[['again', 'Again', 'Next in under a minute'], ['hard', 'Hard', 'Next in ' + ivlTxt(iv.hard)], ['good', 'Good', 'Next in ' + ivlTxt(iv.good)], ['easy', 'Easy', 'Next in ' + ivlTxt(iv.easy)]].map(([k, l, s], i) => `<span class="col center" style="gap:6px"><button class="btn ${k === 'good' ? 'primary' : ''}" data-act="grade" data-v="${k}">${l}</button><span class="small muted">${s}</span></span>`).join('')}</div>
      <p class="small subtle center">Keys <span class="kbd">1</span> again · <span class="kbd">2</span> hard · <span class="kbd">3</span> good · <span class="kbd">4</span> easy</p>` : ''}
  </div>`;
}

/* ============================== 17 · Stats ============================== */
let statsPeriod = 'Month';
function scrStats() {
  const M = PERSONA.month, month = new Date().toLocaleDateString('en-GB', { month: 'long' });
  const title = { Week: 'This week', Month: month + ' so far', Year: new Date().getFullYear() + ' so far', 'All time': 'Since you started' }[statsPeriod];
  const k = counts(), known = M.known + k.known;
  const S = PERSONA.knownSeries.slice(), W = 760, H = 200, x = i => 40 + i * (W - 60) / (S.length - 1), y = v => 10 + (2500 - v) / 1000 * (H - 30);
  const cal = PERSONA.calendar;
  return `${pageHead('Stats', title, `<div class="tabs">${['Week', 'Month', 'Year', 'All time'].map(p => `<button class="${statsPeriod === p ? 'on' : ''}" data-act="period" data-v="${p}">${p}</button>`).join('')}</div>${avatar()}`)}
  <p class="small subtle" style="margin:-8px 0 0">Sample learner on day 30. Words you add in this prototype are added on top.</p>
  <div class="kpi-row">${[['Known words', known.toLocaleString(), `+${M.knownDelta + k.known} vs last month`], ['Minutes understood', M.minutes + ' min', `+${M.minutesDelta} vs last month`], ['Words saved', (M.saved + k.learning).toString(), `from ${M.savedFrom} titles`], ['Remembered in review', M.remembered + '%', 'goal 85% · last 30 days']].map(([l, v, s]) => `<section class="panel kpi"><span class="eyebrow">${l}</span><span class="h2">${v}</span><span class="small muted">${s}</span></section>`).join('')}</div>
  <div class="grid-stats">
    <section class="panel col" style="gap:8px"><div class="row"><div class="col" style="gap:0"><b>Known words — last 12 weeks</b><span class="small muted">+${(S[S.length - 1] - S[0]).toLocaleString()} in 12 weeks · about ${Math.round((S[S.length - 1] - S[0]) / 11)} a week</span></div><div class="spacer"></div><button class="link small" data-act="soon">All stats ${ic('right')}</button></div>
      <svg class="line-chart" viewBox="0 0 ${W} ${H + 20}" role="img" aria-label="Known words rose from ${S[0]} to ${S[S.length - 1]} over 12 weeks">
        ${[1500, 2000, 2500].map(v => `<line x1="40" x2="${W - 20}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="0" y="${y(v) + 4}" class="tick">${v}</text>`).join('')}
        <polyline points="${S.map((v, i) => x(i) + ',' + y(v)).join(' ')}" class="ln"/><circle cx="${x(S.length - 1)}" cy="${y(S[S.length - 1])}" r="4" class="end"/>
        <text x="${x(S.length - 1) - 4}" y="${y(S[S.length - 1]) - 10}" text-anchor="end" class="val">${S[S.length - 1].toLocaleString()}</text>
        ${[['Aug 4', 0, 'start'], ['Sep 1', 4, 'middle'], ['Sep 29', 8, 'middle'], ['This week', 11, 'end']].map(([l, i, a]) => `<text x="${a === 'start' ? x(i) - 4 : a === 'end' ? x(i) + 4 : x(i)}" y="${H + 14}" text-anchor="${a}" class="tick">${l}</text>`).join('')}</svg></section>
    <section class="panel col" style="gap:10px"><div class="row"><b>Goal: 5 days a week</b><div class="spacer"></div><button class="link small" data-act="soon">Change</button></div><span class="small muted">Last week 5 of 5 · 8 active days this month</span>
      <div class="cal">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<em>${d}</em>`).join('')}${cal.flat().map(v => `<i class="c${v == null ? 'x' : v}"></i>`).join('')}</div>
      <div class="row small muted"><span class="lg"><i class="sw studied"></i>Studied</span><span class="lg"><i class="sw missed"></i>Missed</span><span class="lg"><i class="sw todayc"></i>Today</span></div></section>
    <section class="panel col" style="gap:14px"><b>Titles by how they felt</b>
      <div class="row wr small"><span class="lg"><i class="sw easy"></i>Easy</span><span class="lg"><i class="sw ideal"></i>Ideal</span><span class="lg"><i class="sw stretch"></i>Stretch</span><span class="lg"><i class="sw hard"></i>Hard</span><span class="lg"><i class="sw plan"></i>Plan to watch</span></div>
      ${FELT.map(f => `<div class="col" style="gap:6px"><div class="row"><b>${ic(f.icon)} ${f.medium}</b><span class="small muted">${f.meta}</span><div class="spacer"></div><b class="small">${f.count}</b></div><div class="stack felt">${['easy', 'ideal', 'stretch', 'hard', 'plan'].map((c, i) => f.split[i] ? `<i class="${c}" style="flex:${f.split[i]}"></i>` : '').join('')}</div><span class="small muted">Latest: ${f.latest}</span></div>`).join('')}
      <span class="small muted">Also: novels 14% · J-drama 6% · podcasts 4% of words you met</span></section>
    <section class="panel col" style="gap:14px"><b>Milestones</b>
      ${MILESTONES.map(m => `<div class="mile"><span class="mk${m.done ? ' done' : ''}">${m.done ? ic('check') : ''}</span><span class="col" style="gap:4px;flex:1"><b>${m.title}</b><span class="small muted">${m.sub}</span>${m.prog ? bar(m.prog) : ''}</span></div>`).join('')}</section>
  </div>`;
}

const SCREENS = { start: scrStart, setup: scrSetup, today: scrToday, discover: scrDiscover, show: scrShow, prime: scrPrime, read: scrRead, manga: scrManga, dictionary: scrDictionary, learn: scrLearn, review: scrReview, stats: scrStats };
const AFTER = {
  setup: p => { const f = $('knownFile'); if (f) f.onchange = e => importKnown(e.target.files[0]); if (p === 'import') { const el = $('importPanel'); el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); } },
  dictionary: () => { const i = $('dictIn'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); let tm; i.oninput = () => { clearTimeout(tm); tm = setTimeout(() => { dictSel = null; history.replaceState(null, '', '#/dictionary/' + encodeURIComponent(i.value)); route.param = i.value; rerender(); const j = $('dictIn'); j.focus(); j.setSelectionRange(j.value.length, j.value.length); }, 250); }; },
  read: () => { const t = $('pasteIn'); if (t) t.oninput = e => { pasted = e.target.value; }; },
  manga: () => { const i = $('mFixIn'); if (i) i.oninput = e => { const b = MANGA.bubbles.find(x => x.n === mangaBubble); b.text = e.target.value; }; }
};
function rerender() { const y = $('view').scrollTop; if (FULL.has(route.name)) $('full').innerHTML = SCREENS[route.name](route.param); else { $('view').innerHTML = SCREENS[route.name](route.param); $('view').scrollTop = y; } (AFTER[route.name] || (() => { }))(route.param); }

/* ============================== actions ============================== */
function importKnown(file) {
  if (!file) return; file.text().then(txt => {
    const list = [...new Set((txt.match(/[぀-ヿ㐀-鿿々ー]+/g) || []))];
    list.forEach(w => { words[w] = Object.assign(words[w] || { seen: 0 }, { st: 'known' }); }); save();
    $('importStatus').textContent = list.length ? `Imported ${list.length.toLocaleString()} known words. They won’t pause the video or show a line.` : 'No Japanese words found in that file.';
  });
}
function selectTok(bucket, k, setter) { const t = bucket[+k]; if (!t) return; setter(t); speak(t.base === t.surface ? fullReading(t) : t.surface, .85); rerender(); }
const ACT = {
  say: el => speak(el.dataset.say, .85),
  soon: () => gtoast('Not part of this prototype yet.', 3000),
  request: () => gtoast('Requests aren’t sent anywhere in this prototype.', 3500),
  helpLevel: () => {
    modal(`<div class="row"><h3>Help level</h3><div class="spacer"></div><button class="btn ghost small" data-act="closeModal">${ic('x')}</button></div>
      <p class="muted" style="margin:0">Auto turns help down as we see what you know. Less and More shift it one step either way.</p>
      <div class="seg2">${[['less', 'Less'], ['auto', 'Auto'], ['more', 'More']].map(([k, l]) => `<button class="${app.help === k ? 'on' : ''}" data-act="setHelpPref" data-v="${k}">${l}</button>`).join('')}</div>
      <div class="box small muted">Now: <b>${PERSONA.helpLevel}</b> — Japanese subtitles, readings on words you haven’t learned, English only on lines with 2+ new words.</div>`);
  },
  setHelpPref: el => { app.help = el.dataset.v; saveApp(); closeModal(); rerender(); gtoast(`Help level: ${el.textContent}`, 2500); },
  closeModal: () => closeModal(),
  helpFeedback: () => modal(`<div class="row"><h3>How ImmerLingo works</h3><div class="spacer"></div><button class="btn ghost small" data-act="closeModal">${ic('x')}</button></div>
    <div class="legend"><b>Lines under words</b><div><span class="swatch" style="background:var(--accent)"></span>New — you haven’t marked it yet</div><div><span class="swatch" style="background:var(--purple)"></span>Practising — saved as a card</div><div><span class="swatch" style="background:var(--succ)"></span>Known — line only shows on hover</div><div><span class="swatch" style="background:var(--sstrong)"></span>Ignored — names and sounds</div></div>
    <div class="legend"><b>Fit</b><div class="small muted">Share of a title’s words you know. 85–90% is ideal: easy to follow, still teaching.</div></div>
    <div class="box small muted">This is a prototype. Kissaten no Yoru’s opening scene and your YouTube clip play; other titles are previews. Screens after onboarding show a sample learner on day 30.</div>
    <div class="row wr"><button class="btn small" data-act="restartOnboarding">Restart onboarding</button><button class="btn ghost small" data-act="resetAll">Reset everything</button></div>`),
  restartOnboarding: () => { app.onboarded = false; app.first = null; saveApp(); tips = {}; save(); startSel = 'kissaten'; go('start'); },
  resetAll: el => { if (el.dataset.sure) { try { Object.keys(localStorage).filter(k => k.startsWith('il3.')).forEach(k => localStorage.removeItem(k)); } catch (e) { } location.hash = ''; location.reload(); } else { el.dataset.sure = 1; el.textContent = 'Click again to erase all words, cards and settings'; } },
  /* F1 */
  startPick: el => { startSel = el.dataset.id; rerender(); },
  startPlay: () => { obMode = true; go(startSel === 'mine' ? 'play/mine' : 'play/practice'); },
  /* 02 */
  prefMedia: el => { const a = app.prefs.media, v = el.dataset.v; a.includes(v) ? a.splice(a.indexOf(v), 1) : a.push(v); saveApp(); rerender(); },
  prefGenre: el => { const a = app.prefs.genres, v = el.dataset.v; a.includes(v) ? a.splice(a.indexOf(v), 1) : a.push(v); saveApp(); rerender(); },
  prefWhy: el => { const a = app.prefs.why, v = el.dataset.v; if (a.includes(v)) a.splice(a.indexOf(v), 1); else { a.push(v); if (a.length > 2) a.shift(); } saveApp(); rerender(); },
  prefMin: el => { app.prefs.minutes = +el.dataset.v; saveApp(); rerender(); },
  ankiImport: () => { $('importStatus').textContent = 'Anki decks (.apkg) can’t be read in this prototype. Export a word list from Anki and use the jpdb / Migaku import instead.'; },
  setupBack: () => history.back(),
  setupDone: () => { app.onboarded = true; if (app.prefs.media.length) app.discover.tab = app.prefs.media[0]; saveApp(); go('today'); },
  whyHelp: () => gtoast(`<b>${PERSONA.helpLevel}</b><span class="small muted">You looked up fewer words last episode, so English now shows only on lines with 2+ new words.</span>`, 6000),
  /* 04 */
  dTab: el => { app.discover.tab = el.dataset.v; saveApp(); rerender(); },
  dFit: el => { const a = app.discover.fit, v = el.dataset.v; a.includes(v) ? a.splice(a.indexOf(v), 1) : a.push(v); saveApp(); rerender(); },
  dStarter: () => { app.discover.starter = !app.discover.starter; saveApp(); rerender(); },
  dJp: () => { app.discover.jpOnly = !app.discover.jpOnly; saveApp(); rerender(); },
  dLegend: () => { app.discover.legend = false; saveApp(); rerender(); },
  dReset: () => { app.discover = Object.assign({}, APP_DEFAULT.discover, { tab: app.discover.tab, fit: ['ideal', 'easy', 'stretch', 'hard'], starter: false }); saveApp(); rerender(); },
  /* 05 */
  watchlist: el => { const a = app.watchlist, v = el.dataset.id; a.includes(v) ? a.splice(a.indexOf(v), 1) : a.push(v); saveApp(); rerender(); },
  season: el => { detailSeason = +el.dataset.v; rerender(); },
  pickEp: el => { detailEp = +el.dataset.v; detailSeason === 1 || (detailSeason = 1); rerender(); },
  bulkCards: el => gtoast(`That would add ${el.dataset.n} cards with no scene attached. Priming ${primeList().length} words first usually sticks better — so it’s off in this prototype.`, 6000),
  /* 06 */
  primeHear: () => { const pw = PRIME_WORDS.find(p => p.w === primeQ[primeI]); speak(plain(PRACTICE.lines[pw.line].jp), .9); },
  primeEn: () => { primeShowEn = true; rerender(); },
  primeKnew: () => primeAnswer('knew'), primeKeep: () => primeAnswer('keep'),
  /* 12 */
  readTab: el => { readTab = el.dataset.v; readSel = null; rerender(); },
  readPage: el => { app.read.page = Math.max(1, Math.min(NOVEL.pages.length, app.read.page + +el.dataset.v)); readSel = null; saveApp(); rerender(); },
  readSize: () => { app.read.size = app.read.size >= 26 ? 18 : app.read.size + 4; saveApp(); rerender(); },
  readFuri: () => { app.read.furi = { unknown: 'all', all: 'off', off: 'unknown' }[app.read.furi]; saveApp(); rerender(); },
  readAloud: () => speak((NOVEL.pages[app.read.page - 1] || []).map(plain).join(''), .9),
  pasteRead: () => { pasted = $('pasteIn').value; readSel = null; rerender(); },
  /* 13 */
  mBubble: el => { mangaBubble = +el.dataset.v; mangaSel = null; mangaFix = false; rerender(); },
  mFix: () => { mangaFix = !mangaFix; if (!mangaFix) { mangaSel = null; tokCache.clear(); } rerender(); },
  mRtl: () => { mangaRtl = !mangaRtl; rerender(); }, mSpread: () => { mangaSpread = !mangaSpread; gtoast('Only one page of this chapter is in the prototype.', 2500); rerender(); },
  mPage: () => gtoast('Only page 8 of this chapter is in the prototype.', 2500),
  /* word card (Read / Manga) */
  wcSave: () => { const t = curWordTok(); if (!t) return; words[t.base] = Object.assign(words[t.base] || { seen: 1 }, { st: 'learning', ctx: { jp: plain(t.line), en: '', title: route.name === 'manga' ? 'Hanabi Street' : 'Tsuki no Yado' } }); save();
    addCard({ w: t.base, r: findReading(t.base), def: meaningOf(t.base), jp: t.line, en: '', here: plain(t.line), src: route.name === 'manga' ? 'Hanabi Street · Ch 12 · p 8' : `Tsuki no Yado · Ch 4 · p ${app.read.page}` });
    gtoast(`<b lang="ja">${esc(t.base)}</b> saved — it’s due tomorrow in My cards.`, 3000); rerender(); },
  wcKnown: () => { const t = curWordTok(); if (!t) return; words[t.base] = Object.assign(words[t.base] || { seen: 1 }, { st: effSt(t.base) === 'known' ? 'unknown' : 'known' }); save(); rerender(); },
  wcExplain: () => { const t = curWordTok(); if (!t) return; const b = route.name === 'manga' ? MANGA.bubbles.find(x => x.n === mangaBubble) : null;
    modal(`<div class="row"><h3>${ic('spark', 'accent')} Explain this line</h3><div class="spacer"></div><button class="btn ghost small" data-act="closeModal">${ic('x')}</button></div><div class="box"><b lang="ja" style="font-size:20px">${esc(plain(t.line))}</b></div>
      <span class="eyebrow">Piece by piece</span>${content(t.line).filter(x => meaningOf(x.base)).map(x => `<div><b lang="ja">${esc(x.surface)}</b> <span class="muted">${esc(meaningOf(x.base))}</span></div>`).join('')}
      ${b ? `<span class="eyebrow">In plain English</span><div>“${esc(b.en)}”</div>` : ''}<span class="small subtle">${ic('help')} Built from the dictionary in this prototype. The real version uses an AI explanation checked against a reference dictionary.</span>`); },
  /* 14 */
  dictPick: el => { dictSel = dictSearch(route.param || 'まつ').find(x => x.w === el.dataset.w); rerender(); },
  dictKnown: () => { if (!dictSel) return; words[dictSel.w] = Object.assign(words[dictSel.w] || { seen: 0 }, { st: stOf(dictSel.w) === 'known' ? 'unknown' : 'known' }); save(); rerender(); },
  dictSave: () => { if (!dictSel) return; const d = dictSel, ex = d.seen && d.seen[0];
    words[d.w] = Object.assign(words[d.w] || { seen: 0 }, { st: 'learning' }); save();
    addCard({ w: d.w, r: d.r, def: d.en[0], jp: ex ? ex[0] : d.w, en: '', here: ex ? plain(ex[0]) : d.en[0], src: ex ? ex[2] : 'Dictionary' }); gtoast(`<b lang="ja">${esc(d.w)}</b> saved to My cards.`, 2500); rerender(); },
  /* 16 */
  revShow: () => { revShow = true; rerender(); },
  revHear: () => { const c = cards.find(x => x.id === revQ[revI]); if (c) speak(plain(c.jp), .9); },
  revScene: el => { data = PRACTICE; go('play/practice'); pendingSeek = +el.dataset.v; },
  revEdit: () => { const c = cards.find(x => x.id === revQ[revI]); if (c) openCardEditor(c, () => rerender()); },
  revUndo: () => { if (!revUndo) return; const u = revUndo; Object.assign(cards.find(x => x.id === u.id), u.prev); revQ = u.q; revI = u.i; revLog.pop(); revShow = true; revUndo = null; saveApp(); rerender(); },
  grade: el => gradeCard(el.dataset.v),
  /* 17 */
  period: el => { statsPeriod = el.dataset.v; rerender(); }
};
function curWordTok() { return route.name === 'manga' ? mangaSel : readSel; }
function primeAnswer(kind) {
  const w = primeQ[primeI]; if (!w) return;
  words[w] = Object.assign(words[w] || { seen: 0 }, { st: kind === 'knew' ? 'known' : 'learning' });
  if (kind === 'keep') { const pw = PRIME_WORDS.find(p => p.w === w), L = PRACTICE.lines[pw.line]; words[w].ctx = { jp: plain(L.jp), en: L.en, title: PRACTICE.title };
    addCard({ w, r: findReading(w), def: meaningOf(w), jp: L.jp, en: L.en, here: plain(L.jp), src: `Kissaten no Yoru · Ep ${PLAN.ep} · ${fmt(L.t)}`, line: pw.line }); }
  save(); primeDone.push(kind); primeI++; primeShowEn = false; rerender();
}
function gradeCard(k) {
  const c = cards.find(x => x.id === revQ[revI]); if (!c || !revShow) return;
  const iv = nextIvls(c); revUndo = { id: c.id, prev: { ivl: c.ivl, due: c.due }, q: revQ.slice(), i: revI };
  if (k === 'again') { c.ivl = 1; c.due = Date.now() + 60e3; revQ.push(c.id); }
  else { c.ivl = iv[k]; c.due = Date.now() + iv[k] * 864e5; if (words[c.w] && k === 'easy') words[c.w].st = 'known'; }
  revLog.push(k); revI++; revShow = false; saveApp(); save(); rerender();
}

/* the card editor (Figma 10) — shared by the player and Review */
function cardFormHTML(c, inPlayer) {
  const f = (id, label, val, act, actLabel, auto) => `<label class="cf"><span class="row"><span class="eyebrow">${label}</span>${auto ? '<span class="small good">Auto-filled</span>' : ''}<div class="spacer"></div>${act ? `<button type="button" class="link small" data-act="${act}">${actLabel}</button>` : ''}</span><input id="${id}" value="${esc(val)}" lang="ja"></label>`;
  return `<div class="row"><span class="col" style="gap:0"><b class="h4">${ic('plus')} ${c.id ? 'Edit card' : 'New card'}</b><span class="small muted">Filled from the scene — change only what you want</span></span><div class="spacer"></div><button class="btn ghost small" data-act="${inPlayer ? 'panelClose' : 'closeModal'}" aria-label="Close">${ic('x')}</button></div>
    <div class="grid2"><label class="cf"><span class="eyebrow">Card type</span><select id="cfType">${['Word', 'Sentence'].map(t => `<option ${c.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label class="cf"><span class="eyebrow">Deck</span><select id="cfDeck">${['My cards', 'Kissaten no Yoru', 'Grammar points'].map(t => `<option ${c.deck === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div>
    ${f('cfW', 'Target word', c.w, '', '', true)}${f('cfJp', 'Sentence', plain(c.jp || ''), '', '', true)}${f('cfEn', 'Translation', c.en || '', '', '', !!c.en)}${f('cfDef', 'Definition', c.def || '', '', '', !!c.def)}
    ${c.audio ? f('cfAudio', 'Sentence audio', c.audio, '', '', true) : ''}
    <span class="small muted">${c.id ? 'Next due ' + new Date(c.due).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Due tomorrow'} · in “${esc(c.deck || 'My cards')}”</span><div class="row"><div class="spacer"></div><button class="btn" data-act="${inPlayer ? 'panelClose' : 'closeModal'}">Cancel</button><button class="btn primary" id="cfSave">${c.id ? 'Save' : 'Add card'}</button></div>`;
}
function readCardForm(c) { return Object.assign(c, { type: $('cfType').value, deck: $('cfDeck').value, w: $('cfW').value.trim(), en: $('cfEn').value.trim(), def: $('cfDef').value.trim(), jp: c.jp && plain(c.jp) === $('cfJp').value.trim() ? c.jp : $('cfJp').value.trim() }); }
function openCardEditor(c, done) { modal(cardFormHTML(c, false)); $('cfSave').onclick = () => { readCardForm(c); saveApp(); closeModal(); gtoast('Card saved.', 2000); done && done(); }; }

/* ============================== global events ============================== */
document.addEventListener('click', e => {
  const tk = e.target.closest('.rt-tok');
  if (tk && (route.name === 'read' || route.name === 'manga')) { if (route.name === 'read') selectTok(readToks, tk.dataset.k, t => readSel = t); else selectTok(mangaToks, tk.dataset.k, t => mangaSel = t); return; }
  const a = e.target.closest('[data-act]'); if (a && ACT[a.dataset.act]) { e.preventDefault(); ACT[a.dataset.act](a); return; }
  const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); }
});
document.addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (e.key === 'Enter' && document.activeElement.id === 'gsearch') { go('dictionary/' + encodeURIComponent(document.activeElement.value)); return; }
  if (typing) return;
  if (e.key === 'Escape' && !$('result').classList.contains('hidden')) { closeModal(); return; }
  if (e.key === '/' && !$('app').classList.contains('hidden')) { const s = $('gsearch') || $('dictIn'); if (s) { e.preventDefault(); s.focus(); } return; }
  if (route.name === 'prime' && primeI < primeQ.length) { if (e.key === '1') primeAnswer('knew'); else if (e.key === '2') primeAnswer('keep'); else if (e.code === 'Space') { e.preventDefault(); ACT.primeHear(); } }
  if (route.name === 'review' && revI < revQ.length) {
    if (e.code === 'Space') { e.preventDefault(); if (!revShow) ACT.revShow(); }
    else if (e.key === 'r' || e.key === 'R') ACT.revHear();
    else if (revShow && '1234'.includes(e.key)) gradeCard(['again', 'hard', 'good', 'easy'][+e.key - 1]);
  }
});
