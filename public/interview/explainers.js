/* Context slide: click Anki or Language Reactor for a short looping animation of how each tool works.
   Illustrations drawn from the tools' public descriptions (Anki manual; Language Reactor's store listing
   and reviews), not screen recordings. */
(function () {
  const css = `
.lg-btn{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:18px;border-radius:24px;padding:0;transition:transform .2s}
.lg-btn:hover{transform:translateY(-4px)}.lg-btn:focus-visible{outline:3px solid var(--accent);outline-offset:6px}
.lg-btn .tap{font:600 15px/1 var(--text);color:var(--ink-soft);opacity:.75;margin-top:-8px}
#xpl{position:fixed;inset:0;z-index:400;display:grid;place-items:center;background:rgba(6,5,6,.72);backdrop-filter:blur(6px);animation:xIn .25s ease}
#xpl[hidden]{display:none}
@keyframes xIn{from{opacity:0}to{opacity:1}}
#xpl .box{width:min(920px,94vw);background:#161417;border-radius:22px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1),0 40px 90px rgba(0,0,0,.6);overflow:hidden;color:#eee;font-family:"Noto Sans",system-ui,sans-serif}
#xpl .hd{display:flex;align-items:center;gap:14px;padding:16px 20px}
#xpl .hd img,#xpl .hd i{width:36px;height:36px;border-radius:50%;flex:none}
#xpl .hd b{font:800 22px/1 var(--display,system-ui);font-stretch:68%}
#xpl .hd .sp{flex:1}
#xpl .hd button{all:unset;cursor:pointer;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:#bbb}
#xpl .hd button:hover{background:rgba(255,255,255,.08);color:#fff}
#xpl .vp{position:relative;width:100%;aspect-ratio:16/9;background:#0d0c0e;overflow:hidden}
#xpl .cv{position:absolute;left:0;top:0;width:720px;height:405px;transform-origin:0 0}
#xpl .ft{display:flex;align-items:center;gap:16px;padding:14px 20px 16px}
#xpl .cap{flex:1;font-size:17px;line-height:1.35;min-height:46px;display:flex;align-items:center}
#xpl .cap b{color:#e8838f;margin-right:8px}
#xpl .tabs{display:flex;gap:4px;margin-left:14px;padding:4px;border-radius:12px;background:rgba(255,255,255,.05)}#xpl .tabs button{all:unset;cursor:pointer;padding:7px 12px;border-radius:9px;font:600 13px/1 "Noto Sans",system-ui,sans-serif;color:#aaa}#xpl .tabs button.on{background:#3a2a30;color:#fff}#xpl .tabs button:focus-visible{outline:2px solid #e8838f}
#xpl .dots{display:flex;gap:6px}#xpl .dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.2)}#xpl .dots i.on{background:#e8838f}
#xpl .note{padding:0 20px 14px;font-size:12px;color:#8d8a90}
/* shared */
.x-cur{position:absolute;width:22px;height:22px;z-index:20;transition:left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1);pointer-events:none}
.x-cur svg{width:22px;height:22px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.6))}
.x-cur.x-click::after{content:"";position:absolute;left:-9px;top:-9px;width:22px;height:22px;border-radius:50%;border:2px solid #fff;animation:clk .45s ease-out forwards}
@keyframes clk{from{transform:scale(.4);opacity:1}to{transform:scale(1.6);opacity:0}}
.x-fade{transition:opacity .4s,transform .4s}.x-hid{opacity:0;transform:translateY(6px);pointer-events:none}
/* anki */
.x-ak{position:absolute;inset:0;background:#2f2f31;color:#e6e6e6;font-family:system-ui,"Noto Sans JP",sans-serif}
.x-ak .x-tb{height:30px;background:#232325;display:flex;align-items:center;padding:0 12px;gap:8px;font-size:12px;color:#aaa}
.x-ak .x-tb i{width:11px;height:11px;border-radius:50%;background:#555}
.x-ak .x-tb span{margin-left:auto;margin-right:auto}
.x-ak .x-scr{position:absolute;inset:30px 0 0 0}
.x-ak .x-add{padding:16px 22px;display:flex;flex-direction:column;gap:9px;font-size:13px}
.x-ak .x-add .x-r{display:flex;gap:10px}.x-ak .x-add .x-pill{background:#444448;border-radius:6px;padding:5px 10px}
.x-ak .x-add label{color:#aaa;font-size:12px}
.x-ak .x-add .x-fld{background:#1f1f21;border:1px solid #4a4a4e;border-radius:6px;min-height:44px;padding:10px 12px;font-size:18px}
.x-ak .x-add .x-fld.x-f{border-color:#5d8fd8}
.x-ak .x-add .x-bar{display:flex;justify-content:flex-end;margin-top:6px}
.x-ak .x-btn{background:#4a4a4f;border-radius:6px;padding:8px 18px;font-size:14px;color:#eee;transition:background .2s}
.x-ak .x-btn.x-hit{background:#5d8fd8}
.x-ak .x-toast{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);background:#111;color:#fff;padding:8px 16px;border-radius:8px;font-size:14px}
.x-ak .x-rev{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding-top:44px}
.x-ak .x-front{font-size:44px;font-weight:600}
.x-ak hr{width:80%;border:0;border-top:1px solid #555;margin:18px 0}
.x-ak .x-back{font-size:22px;text-align:center;line-height:1.4}
.x-ak .x-bot{position:absolute;left:0;right:0;bottom:0;height:92px;background:#28282a;border-top:1px solid #3c3c3f;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
.x-ak .x-cnt{font-size:13px;letter-spacing:.06em}.x-ak .x-cnt .x-n{color:#4c8fea}.x-ak .x-cnt .x-l{color:#e05a5a}.x-ak .x-cnt .x-v{color:#4cae5b}
.x-ak .x-ans{display:flex;gap:10px}.x-ak .x-ans div{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;color:#aaa}
.x-ak .x-ans .x-btn{min-width:74px;text-align:center;font-size:14px}
.x-ak .x-done{position:absolute;inset:0;display:grid;place-items:center;text-align:center;font-size:17px;line-height:1.6;color:#ddd}
/* language reactor */
.x-lr{position:absolute;inset:0;background:#000;font-family:system-ui,"Noto Sans JP",sans-serif;color:#fff}
.x-lr .x-vid{position:absolute;inset:0;background:center/cover no-repeat url(v2/assets/still0.jpg)}
.x-lr .x-vid::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.75))}
.x-lr .x-sub{position:absolute;left:0;right:0;bottom:62px;text-align:center;z-index:2}
.x-lr .x-jp{font-size:30px;font-weight:600;text-shadow:0 2px 6px #000;display:inline-flex;gap:2px}
.x-lr .x-jp span{padding:0 3px;border-radius:5px;transition:background .25s,color .25s}
.x-lr .x-jp span.x-hv{background:rgba(255,255,255,.22)}
.x-lr .x-jp span.x-sv{color:#f2c94c}
.x-lr .x-en{font-size:17px;color:#d7d7d7;margin-top:6px;text-shadow:0 2px 5px #000}
.x-lr .x-bar{position:absolute;left:0;right:0;bottom:0;height:40px;background:rgba(15,15,18,.85);display:flex;align-items:center;gap:14px;padding:0 14px;z-index:3;font-size:12px;color:#ccc}
.x-lr .x-bar .x-ic{width:26px;height:26px;border-radius:6px;display:grid;place-items:center;transition:background .2s}
.x-lr .x-bar .x-ic.x-hit{background:#9b3fd1}
.x-lr .x-bar .x-tl{flex:1;height:4px;background:rgba(255,255,255,.25);border-radius:2px;position:relative}
.x-lr .x-bar .x-tl i{position:absolute;left:0;top:0;bottom:0;background:#e50914;border-radius:2px;transition:width .4s linear}
.x-lr .x-bar .x-brand{display:flex;align-items:center;gap:6px;color:#fff;font-weight:600}
.x-lr .x-bar .x-brand img{width:18px;height:18px;border-radius:50%}
.x-lr .x-pop{position:absolute;left:220px;bottom:150px;width:310px;background:#fff;color:#111;border-radius:10px;padding:12px 14px;z-index:5;box-shadow:0 10px 30px rgba(0,0,0,.6);font-size:13px;line-height:1.45}
.x-lr .x-pop .x-w{display:flex;align-items:baseline;gap:8px}.x-lr .x-pop .x-w b{font-size:22px;white-space:nowrap}.x-lr .x-pop .x-w span{color:#666}
.x-lr .x-pop .x-star{margin-left:auto;font-size:20px;color:#bbb;transition:color .2s}.x-lr .x-pop .x-star.x-on{color:#f2c94c}
.x-lr .x-pop .x-m{margin-top:4px}
.x-lr .x-list{position:absolute;right:12px;top:12px;width:190px;background:rgba(20,20,24,.92);border-radius:10px;padding:10px 12px;z-index:4;font-size:12px;line-height:1.5}
.x-lr .x-list b{display:block;margin-bottom:4px;color:#f2c94c}
.x-lr .x-pz{position:absolute;left:50%;top:22%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,.55);display:grid;place-items:center;z-index:3}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const CUR = '<svg viewBox="0 0 24 24"><path d="M4 2l15 9-6.5 1.6L16 20l-3 1.4-3.4-7.3L4 18z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>';

  const TOOLS = {
    anki: {
      name: 'Anki', icon: '<i style="background:#80C2EE;display:grid;place-items:center"><span style="width:18px;height:18px;background:#fff;-webkit-mask:url(imgw/logos/anki.svg) center/contain no-repeat;mask:url(imgw/logos/anki.svg) center/contain no-repeat"></span></i>',
      note: 'Illustration of Anki’s desktop add and review screens, based on the Anki manual. Not a screen recording.',
      html: `<div class="x-ak"><div class="x-tb"><i></i><i></i><i></i><span id="akT">Add</span></div><div class="x-scr">
        <div class="x-add x-fade" id="akAdd"><div class="x-r"><span class="x-pill">Type: Basic</span><span class="x-pill">Deck: Japanese</span></div>
          <label>Front</label><div class="x-fld" id="akF"></div><label>Back</label><div class="x-fld" id="akB"></div>
          <div class="x-bar"><span class="x-btn" id="akAddB">Add</span></div></div>
        <div class="x-toast x-fade x-hid" id="akToast">Added</div>
        <div class="x-rev x-fade x-hid" id="akRev"><div class="x-front">いらっしゃいませ</div><hr class="x-fade x-hid" id="akHr"><div class="x-back x-fade x-hid" id="akBack">Welcome<br><span style="font-size:15px;color:#aaa">(said to customers)</span></div>
          <div class="x-bot"><div class="x-cnt x-fade" id="akCnt"><span class="x-n">1</span> + <span class="x-l">0</span> + <span class="x-v">0</span></div><span class="x-btn" id="akShow">Show Answer</span>
          <div class="x-ans x-fade x-hid" id="akAns"><div>&lt;1m<span class="x-btn">Again</span></div><div>&lt;6m<span class="x-btn">Hard</span></div><div>&lt;10m<span class="x-btn" id="akGood">Good</span></div><div>4d<span class="x-btn">Easy</span></div></div></div></div>
        <div class="x-done x-fade x-hid" id="akDone">Congratulations! You have finished this deck for now.<br><span style="color:#999;font-size:14px">いらっしゃいませ comes back in 10 minutes.</span></div>
      </div><div class="x-cur" id="cur">${CUR}</div></div>`,
      steps: [
        ['Make each card by hand', 'Type the word on the front and its meaning on the back, then Add.'],
        ['Recall it first', 'The card shows the front. Try to remember, then Show Answer.'],
        ['Grade yourself', 'The time above each button is when the card comes back.'],
        ['Come back on schedule', 'Spaced repetition shows the card again just before you’d forget it.'],
      ],
      run(S) {
        const $ = id => S.q('#' + id);
        S.at(0, () => { S.step(0); S.cur(560, 330); });
        S.type('akF', 'いらっしゃいませ', 400, 110);
        S.type('akB', 'Welcome (said to customers)', 1500, 45);
        S.at(2900, () => S.cur(650, 305));
        S.at(3700, () => { S.click(); $('akAddB').classList.add('x-hit'); $('akToast').classList.remove('x-hid'); });
        S.at(4700, () => { $('akAdd').classList.add('x-hid'); $('akToast').classList.add('x-hid'); });
        S.at(5150, () => { $('akT').textContent = 'Japanese'; $('akRev').classList.remove('x-hid'); S.step(1); S.cur(420, 380); });
        S.at(6200, () => S.cur(372, 362));
        S.at(6900, () => { S.click(); $('akShow').style.display = 'none'; $('akCnt').classList.add('x-hid'); $('akHr').classList.remove('x-hid'); $('akBack').classList.remove('x-hid'); $('akAns').classList.remove('x-hid'); S.step(2); });
        S.at(8300, () => S.cur(428, 372));
        S.at(9200, () => { S.click(); $('akGood').classList.add('x-hit'); });
        S.at(9900, () => { $('akRev').classList.add('x-hid'); $('akDone').classList.remove('x-hid'); S.step(3); S.cur(600, 330); });
        return 13500;
      },
    },
    lr: {
      name: 'Language Reactor', icon: '<img src="imgw/logos/language-reactor.png" alt="">',
      note: 'Illustration of Language Reactor on a streaming player, based on its store listing and reviews. Not a screen recording; the café still is a placeholder.',
      html: `<div class="x-lr"><div class="x-vid"></div>
        <div class="x-sub"><div class="x-jp" lang="ja"><span id="lw1">いらっしゃいませ</span><span>。</span></div><div class="x-en x-fade" id="lrEn">Welcome.</div></div>
        <div class="x-pop x-fade x-hid" id="lrPop"><div class="x-w"><b lang="ja">いらっしゃいませ</b><span>irasshaimase</span><span class="x-star" id="lrStar">★</span></div><div class="x-m">welcome (said to customers in a shop or restaurant)</div></div>
        <div class="x-list x-fade x-hid" id="lrList"><b>★ Saved</b><span lang="ja">いらっしゃいませ</span> · welcome</div>
        <div class="x-pz x-fade x-hid" id="lrPz"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg></div>
        <div class="x-bar"><span class="x-ic">▶</span><span class="x-ic" id="lrRep" title="Replay line">↺</span><div class="x-tl"><i id="lrTl" style="width:8%"></i></div><span>0:01</span><span class="x-brand"><img src="imgw/logos/language-reactor.png" alt="">LR</span></div>
        <div class="x-cur" id="cur">${CUR}</div></div>`,
      steps: [
        ['Dual subtitles', 'Japanese on top, a translation underneath, on Netflix or YouTube.'],
        ['Hover a word', 'A pop-up dictionary explains it without leaving the video.'],
        ['Save it', 'Saved words and phrases collect in a list (a Pro feature).'],
        ['Replay the line', 'Precise controls replay a line as often as you like. Reviewing saved words happens somewhere else.'],
      ],
      run(S) {
        const $ = id => S.q('#' + id);
        S.at(0, () => { S.step(0); S.cur(600, 120); S.q('#lrTl').style.width = '8%'; });
        S.at(400, () => { S.q('#lrTl').style.width = '22%'; });
        S.at(2600, () => { S.step(1); S.cur(330, 312); });
        S.at(3400, () => { $('lw1').classList.add('x-hv'); $('lrPop').classList.remove('x-hid'); $('lrPz').classList.remove('x-hid'); });
        S.at(5600, () => { S.step(2); S.cur(472, 218); });
        S.at(6400, () => { S.click(); $('lrStar').classList.add('x-on'); $('lw1').classList.add('x-sv'); $('lrList').classList.remove('x-hid'); });
        S.at(8200, () => { $('lrPop').classList.add('x-hid'); $('lw1').classList.remove('x-hv'); $('lrPz').classList.add('x-hid'); S.step(3); S.cur(62, 380); });
        S.at(9000, () => { S.click(); $('lrRep').classList.add('x-hit'); $('lrTl').style.transition = 'none'; $('lrTl').style.width = '8%'; });
        S.at(9300, () => { $('lrTl').style.transition = ''; $('lrTl').style.width = '22%'; $('lrRep').classList.remove('x-hit'); });
        return 13000;
      },
    },
  };

  /* ---- Anki, part 2: spaced repetition and EF.
     Scene A = measured data (Ebbinghaus; Dros replication) from Murre & Dros 2015, PLoS One, Table 3: savings, not recall.
     Scene B = a model, not data: FSRS forgetting curve R = (1 + 19/81 * t/S)^-0.5, review assumed at R = 0.9 (so S = interval),
     intervals from Anki's default ease 2.5. Design from the dataviz-expert spec. ---- */
  const SR_CSS = `
.x-sr{position:absolute;inset:0;background:#18171a;color:#e8e8ea;font-family:system-ui,"Noto Sans",sans-serif}
.x-sr svg{position:absolute;left:0;top:0}
.x-sr .x-scene{transition:opacity .3s}
.x-sr .x-ax{stroke:#4a4850;stroke-width:1}
.x-sr .x-grid{stroke:#2c2a30;stroke-width:1}
.x-sr .x-lb{fill:#a9a6ad;font-size:13px}
.x-sr .x-yt{fill:#c9c6cc;font-size:13px;font-weight:600}
.x-sr .x-src{fill:#8a8790;font-size:12px}
.x-sr .x-eb{fill:#F2A541}
.x-sr .x-dr{fill:none;stroke:#F2A541;stroke-width:2}
.x-sr .x-pt{transition:opacity .25s}
.x-sr .x-ml{fill:#F2A541;font-size:13px;font-weight:600}
.x-sr .x-note{fill:#e8c58e;font-size:12px}
.x-sr .x-nr{stroke:#8A8790;stroke-width:2;fill:none;stroke-dasharray:5 5;transition:opacity .6s}
.x-sr .x-mod{stroke:#6CB4EE;stroke-width:2.5;fill:none;stroke-linejoin:round}
.x-sr .x-tgt{stroke:#B8B5BC;stroke-width:1;stroke-dasharray:3 4}
.x-sr .x-tk{stroke:#6CB4EE;stroke-width:2}
.x-sr .x-gap{fill:#6CB4EE;font-size:13px;font-weight:700;transition:opacity .3s}
.x-sr .x-gap.x-pulse{animation:xpul 1s ease 2}
@keyframes xpul{50%{fill:#f2c94c}}
.x-sr .x-badge{position:absolute;left:24px;top:14px;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.06em}
.x-sr .x-badge.x-ms{background:rgba(242,165,65,.16);color:#F2A541;box-shadow:inset 0 0 0 1px rgba(242,165,65,.5)}
.x-sr .x-badge.x-md{background:rgba(108,180,238,.14);color:#6CB4EE;box-shadow:inset 0 0 0 1px rgba(108,180,238,.5)}
.x-sr .x-panel{position:absolute;left:24px;right:24px;bottom:8px;height:100px;background:#232226;border-radius:12px;padding:12px 16px;display:flex;gap:18px;align-items:center;box-shadow:0 -10px 30px rgba(0,0,0,.4)}
.x-sr .x-ef{display:flex;flex-direction:column;align-items:center;min-width:110px}
.x-sr .x-ef small{font-size:11px;color:#aaa;letter-spacing:.06em}
.x-sr .x-ef b{font-size:34px;line-height:1.1;color:#6CB4EE;transition:color .3s}
.x-sr .x-ef b.x-dn{color:#e0705a}
.x-sr .x-ef span{font-size:12px;color:#8d8a90}
.x-sr .x-eq{flex:1;font-size:17px;line-height:1.4;min-width:140px}
.x-sr .x-eq em{font-style:normal;color:#f2c94c;font-weight:700}
.x-sr .x-gr{display:flex;gap:8px}.x-sr .x-gr.x-hid{display:none}
.x-sr .x-gr div{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;color:#aaa;width:80px;text-align:center;line-height:1.3}
.x-sr .x-gr .x-btn{background:#3a393e;border-radius:6px;padding:6px 0;width:100%;font-size:13px;color:#eee;transition:background .2s}
.x-sr .x-gr .x-btn.x-hit{background:#5d8fd8}`;
  { const s2 = document.createElement('style'); s2.textContent = SR_CSS; document.head.appendChild(s2); }

  // Layout: row 1 = badge; row 2 = y-axis title (left) and legend (right); then the plot. Data starts 18px inside the axis.
  const PX0 = 78, PX1 = 676, PT = 84, PB = 232, PH = PB - PT, DX0 = PX0 + 18;
  // Scene A: measured savings (proportions), log time axis in minutes
  const SAV = [[20, .582, .472], [60, .442, .373], [540, .358, .276], [1440, .337, .317], [2880, .278, .230], [8640, .254, .168], [44640, .211, .041]];
  const LA = Math.log(20), LB = Math.log(44640);
  const ax = t => DX0 + (PX1 - DX0) * (Math.log(t) - LA) / (LB - LA), ay = v => PB - PH * v / 0.70;
  const DODGE = 5;   // the two series sit 5px apart horizontally so close values (1 day) don't hide each other
  const aTicks = [[20, '20 min'], [60, '1 h'], [540, '9 h'], [1440, '1 d'], [10080, '1 wk'], [44640, '1 mo']];
  const sceneA =
    [0, .2, .4, .6].map(v => `<line class="x-grid" x1="${PX0}" x2="${PX1}" y1="${ay(v)}" y2="${ay(v)}"/><text class="x-lb" x="${PX0 - 8}" y="${ay(v) + 4}" text-anchor="end">${v * 100}%</text>`).join('') +
    `<line class="x-ax" x1="${PX0}" x2="${PX1}" y1="${PB}" y2="${PB}"/>` +
    aTicks.map(([t, l]) => `<line class="x-ax" x1="${ax(t)}" x2="${ax(t)}" y1="${PB}" y2="${PB + 5}"/><text class="x-lb" x="${ax(t)}" y="${PB + 20}" text-anchor="middle">${l}</text>`).join('') +
    `<text class="x-yt" x="${PX0 - 40}" y="${PT - 18}">Savings: % of relearning time saved</text>` +
    `<text class="x-lb" x="${PX1}" y="${PB + 38}" text-anchor="end">time since learning (log scale)</text>` +
    SAV.map(([t, e], i) => `<circle class="x-eb x-pt" id="sE${i}" cx="${ax(t) - DODGE}" cy="${ay(e)}" r="5" opacity="0"/>`).join('') +
    SAV.map(([t, , d], i) => `<circle class="x-dr x-pt" id="sD${i}" cx="${ax(t) + DODGE}" cy="${ay(d)}" r="5" opacity="0"/>`).join('') +
    `<text class="x-ml x-pt" id="sEl" x="${PX1 - 178}" y="${PT - 18}" text-anchor="end" opacity="0">● Ebbinghaus</text>` +
    `<text class="x-ml x-pt" id="sDl" x="${PX1}" y="${PT - 18}" text-anchor="end" opacity="0">○ Dros 2015 replication</text>` +
    `<text class="x-note x-pt" id="sN" x="${PX1}" y="${ay(.45)}" text-anchor="end" opacity="0">At 1 month they disagree (21% vs 4%):</text>` +
    `<text class="x-note x-pt" id="sN2" x="${PX1}" y="${ay(.45) + 16}" text-anchor="end" opacity="0">1 subject each</text>` +
    `<text class="x-src" x="${PX0 - 40}" y="${PB + 56}">Ebbinghaus; Dros 2015. Nonsense syllables, 1 subject each. Murre &amp; Dros 2015, PLoS One, Table 3.</text>`;

  // Scene B: FSRS model, linear days 0-60, recall probability 0-100%
  const bx = d => DX0 + (PX1 - DX0) * d / 60, by = r => PB - PH * r;
  const Rf = (t, S) => Math.pow(1 + (19 / 81) * t / S, -0.5);
  const REVS = [[0, 1], [1, 3], [4, 8], [12, 20], [32, 50]];  // [review day, interval = stability]
  const teeth = REVS.map(([t0, S], i) => { const t1 = i < REVS.length - 1 ? REVS[i + 1][0] : 60; let p = ''; for (let k = 0; k <= 30; k++) { const t = t0 + (t1 - t0) * k / 30; p += (k ? 'L' : 'M') + bx(t).toFixed(1) + ' ' + by(Rf(t - t0, S)).toFixed(1); } if (i < REVS.length - 1) p += 'L' + bx(t1).toFixed(1) + ' ' + by(1).toFixed(1); return p; });
  let nr = ''; for (let k = 0; k <= 60; k++) { const t = k; nr += (k ? 'L' : 'M') + bx(t).toFixed(1) + ' ' + by(Rf(t, 1)).toFixed(1); }
  const sceneB =
    [0, .25, .5, .75, 1].map(v => `<line class="x-grid" x1="${PX0}" x2="${PX1}" y1="${by(v)}" y2="${by(v)}"/><text class="x-lb" x="${PX0 - 8}" y="${by(v) + 4}" text-anchor="end">${v * 100}%</text>`).join('') +
    `<line class="x-ax" x1="${PX0}" x2="${PX1}" y1="${PB}" y2="${PB}"/>` +
    [0, 10, 20, 30, 40, 50, 60].map(d => `<text class="x-lb" x="${bx(d)}" y="${PB + 20}" text-anchor="middle">${d}</text>`).join('') +
    `<text class="x-yt" x="${PX0 - 40}" y="${PT - 18}">Recall probability (model)</text>` +
    `<line class="x-tgt" x1="${PX1 - 250}" x2="${PX1 - 226}" y1="${PT - 22}" y2="${PT - 22}"/><text class="x-lb" x="${PX1}" y="${PT - 18}" text-anchor="end">review at 90% recall (assumed)</text>` +
    `<text class="x-lb" x="${PX1}" y="${PB + 38}" text-anchor="end">days since first learned</text>` +
    `<line class="x-tgt" x1="${PX0}" x2="${PX1}" y1="${by(.9)}" y2="${by(.9)}"/>` +
    `<path class="x-nr" id="sNR" d="${nr}" opacity="0"/><text class="x-lb x-pt" id="sNRl" x="${bx(60)}" y="${by(Rf(60, 1)) - 10}" text-anchor="end" opacity="0">no reviews (model)</text>` +
    teeth.map((d, i) => `<path class="x-mod" id="sT${i}" d="${d}"/>`).join('') +
    REVS.slice(1).map(([t], i) => `<line class="x-tk x-pt" id="sK${i}" x1="${bx(t)}" x2="${bx(t)}" y1="${PB}" y2="${PB - 8}" opacity="0"/>`).join('') +
    `<text class="x-gap x-pt" id="sG0" x="${bx(36)}" y="${by(.70)}" text-anchor="middle" opacity="0">gaps between reviews: 1 → 3 → 8 → 20 days</text>` +
    `<text class="x-gap x-pt" id="sG4" x="${bx(36)}" y="${by(.70) + 17}" text-anchor="middle" opacity="0">next review: day 82</text>` +
    `<text class="x-src" x="${PX0 - 40}" y="${PB + 56}">FSRS curve R = (1 + 19/81 · t/S)^−0.5, S = interval. Anki default intervals × 2.5.</text>`;
  const SR = {
    label: '2 · Spaced repetition and EF',
    note: 'Scene 1 is measured: savings (relearning time saved) for Ebbinghaus and the Dros replication, as tabulated in Murre & Dros 2015, PLoS One, Table 3 (nonsense syllables, one subject each). Scene 2 is a model, not data: the FSRS forgetting curve, with reviews assumed at 90% recall. EF values are Anki’s documented defaults; newer Anki can use FSRS instead of EF.',
    html: '<div class="x-sr"><div class="x-badge x-ms" id="sBadge">MEASURED</div>' +
      `<svg width="720" height="300" viewBox="0 0 720 300"><g class="x-scene" id="sA">${sceneA}</g><g class="x-scene" id="sB" style="opacity:0">${sceneB}</g></svg>` +
      '<div class="x-panel x-fade x-hid" id="srP">' +
      '<div class="x-ef"><small>EF · EASE</small><b id="srEF">2.50</b><span id="srPct">Anki shows 250%</span></div>' +
      '<div class="x-eq" id="srEq">next gap = last gap × EF<br><em>8 days × 2.5 = 20 days</em></div>' +
      '<div class="x-gr x-fade x-hid" id="srG"><div><span class="x-btn">Again</span>EF −0.20, relearn</div><div><span class="x-btn" id="srHard">Hard</span>EF −0.15, ×1.2</div><div><span class="x-btn">Good</span>EF unchanged</div><div><span class="x-btn">Easy</span>EF +0.15, ×1.3 bonus</div></div>' +
      '</div><div class="x-cur" id="cur">' + CUR + '</div></div>',
    steps: [
      ['Measured', 'Ebbinghaus’ data: the benefit of studying fades fast, then levels off. It doesn’t reach zero.'],
      ['A model, not measured', 'If you review near 90% recall (assumed), the gaps between reviews can keep growing: 1, 3, 8, 20 days.'],
      ['EF, the ease factor', 'Each new gap = the last gap × EF. New cards start at EF 2.5, so 8 days becomes 20.'],
      ['Your grade changes EF', 'Hard lowers EF by 0.15 and multiplies the gap by only 1.2, so the card comes back sooner. EF never falls below 1.3.'],
    ],
    run(S) {
      const $ = id => S.q('#' + id), op = (id, v) => { const e = $(id); if (e) e.setAttribute('opacity', v); };
      const teethEls = REVS.map((_, i) => $('sT' + i));
      teethEls.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = L; p.dataset.len = L; });
      S.at(0, () => { S.step(0); S.cur(700, 395); });
      SAV.forEach((_, i) => S.at(300 + i * 220, () => op('sE' + i, 1)));
      S.at(300, () => op('sEl', 1));
      SAV.forEach((_, i) => S.at(2000 + i * 180, () => op('sD' + i, 1)));
      S.at(2000, () => op('sDl', 1));
      S.at(3400, () => { op('sN', 1); op('sN2', 1); });
      // scene switch: fade to empty, then the model
      S.at(6200, () => { $('sA').style.opacity = 0; $('sBadge').style.opacity = 0; });
      S.at(6550, () => { const b = $('sBadge'); b.className = 'x-badge x-md'; b.textContent = 'MODEL, NOT MEASURED'; b.style.opacity = 1; $('sB').style.opacity = 1; S.step(1); });
      S.at(6800, () => { op('sNR', 1); op('sNRl', 1); });
      teethEls.forEach((p, i) => S.at(7400 + i * 750, () => { p.style.transition = 'stroke-dashoffset .7s linear'; p.style.strokeDashoffset = 0; if (i < 4) S.at(700, () => op('sK' + i, 1)); }));
      S.at(7400 + 5 * 750, () => { op('sG0', 1); op('sG4', 1); });
      S.at(12200, () => { S.step(2); $('srP').classList.remove('x-hid'); $('sG0').classList.add('x-pulse'); });
      S.at(15600, () => { S.step(3); $('sB').style.opacity = .6; $('srEq').innerHTML = 'Grade it:<br>each button changes EF'; $('srG').classList.remove('x-hid'); S.cur(470, 395); });
      S.at(16900, () => S.cur(468, 336));
      S.at(17600, () => { S.click(); $('srHard').classList.add('x-hit'); });
      S.at(18200, () => { const ef = $('srEF'); ef.classList.add('x-dn'); ef.textContent = '2.35'; $('srPct').textContent = 'Anki shows 235%'; $('srEq').innerHTML = 'Hard: 8 days × 1.2<br><em>= 10 days, not 20</em>'; $('srG').classList.add('x-hid'); });
      return 23500;
    },
  };
  TOOLS.anki.label = '1 · Making and reviewing cards';
  TOOLS.anki.anims = [TOOLS.anki, SR];
  TOOLS.lr.anims = [TOOLS.lr];

  const m = document.createElement('div'); m.id = 'xpl'; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
  document.body.appendChild(m);
  let timers = [], open = null, opener = null, curIdx = 0;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  function fit() { const vp = m.querySelector('.vp'), cv = m.querySelector('.cv'); if (vp && cv) cv.style.transform = `scale(${vp.clientWidth / 720})`; }
  function play(key, idx) {
    clear(); curIdx = idx; const A = TOOLS[key].anims[idx], cv = m.querySelector('.cv'); cv.innerHTML = A.html; fit();
    m.querySelectorAll('.tabs button').forEach((b, j) => { b.classList.toggle('on', j === idx); b.setAttribute('aria-selected', j === idx); });
    m.querySelector('.dots').innerHTML = A.steps.map(() => '<i></i>').join(''); m.querySelector('.note').textContent = A.note;
    const cr = cv.querySelector('#cur'), dots = [...m.querySelectorAll('.dots i')], cap = m.querySelector('.cap');
    const S = {
      q: s => cv.querySelector(s),
      at: (t, f) => timers.push(setTimeout(f, t)),
      cur: (x, y) => { cr.style.left = x + 'px'; cr.style.top = y + 'px'; },
      click: () => { cr.classList.remove('x-click'); void cr.offsetWidth; cr.classList.add('x-click'); },
      step: i => { dots.forEach((d, j) => d.classList.toggle('on', j === i)); cap.innerHTML = `<span><b>${A.steps[i][0]}</b>${A.steps[i][1]}</span>`; },
      type: (id, text, start, per) => { [...text].forEach((c, i) => S.at(start + i * per, () => { const f = cv.querySelector('#' + id); f.classList.add('x-f'); f.textContent = text.slice(0, i + 1); })); S.at(start + text.length * per, () => cv.querySelector('#' + id).classList.remove('x-f')); },
    };
    const len = A.run(S); S.at(len, () => play(key, idx));
  }
  function show(key, btn) {
    const T = TOOLS[key]; open = key; opener = btn;
    const tabs = T.anims.length > 1 ? `<div class="tabs" role="tablist">${T.anims.map((a, i) => `<button type="button" role="tab" data-i="${i}">${a.label}</button>`).join('')}</div>` : '';
    m.innerHTML = `<div class="box"><div class="hd">${T.icon}<b>How ${T.name} works</b>${tabs}<span class="sp"></span><button type="button" class="rp" aria-label="Play again" title="Play again"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></button><button type="button" class="x" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>
      <div class="vp"><div class="cv"></div></div><div class="ft"><div class="cap"></div><div class="dots"></div></div><div class="note"></div></div>`;
    m.hidden = false; m.querySelector('.x').onclick = close; m.querySelector('.rp').onclick = () => play(key, curIdx);
    m.querySelectorAll('.tabs button').forEach(b => b.onclick = () => play(key, +b.dataset.i));
    m.onclick = e => { if (e.target === m) close(); };
    play(key, 0); m.querySelector('.x').focus();
  }
  function close() { clear(); m.hidden = true; m.innerHTML = ''; open = null; if (opener) opener.focus({ preventScroll: true }); }
  window.__xplOpen = () => !!open;
  addEventListener('resize', fit);
  addEventListener('keydown', e => { if (!open) return; if (e.key === 'Escape') { e.preventDefault(); close(); } e.stopImmediatePropagation(); }, true);

  // Turn the two logos into buttons.
  document.querySelectorAll('#context .logo').forEach(el => {
    const name = el.querySelector('b')?.textContent.trim(), key = name === 'Anki' ? 'anki' : name === 'Language Reactor' ? 'lr' : null;
    if (!key) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'logo lg-btn'; b.setAttribute('aria-label', `How ${name} works`);
    b.innerHTML = el.innerHTML + '<span class="tap">See how it works</span>'; el.replaceWith(b);
    b.addEventListener('click', e => { e.stopPropagation(); show(key, b); });
  });
})();
