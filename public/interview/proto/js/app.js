"use strict";
/* ============================== storage + data ============================== */
const HOSTED=/claude|claudeusercontent|anthropic/.test(location.hostname);
if(location.protocol==='file:')document.addEventListener('DOMContentLoaded',()=>{const w=document.getElementById('fileWarn');if(w)w.classList.remove('hidden');});
const store={get(k,d){try{const v=localStorage.getItem('il3.'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('il3.'+k,JSON.stringify(v))}catch(e){}}};
const $=id=>document.getElementById(id);
let mine=store.get('mine',null)||JSON.parse(JSON.stringify(MINE_DEFAULT));
// v3.1: the Hindi-dub link (QLFA1MkDkww) has no Japanese audio — move untouched clips to the Japanese-audio episode
if(!mine.lines.length&&(!mine.videoId||mine.videoId==='QLFA1MkDkww')){mine=Object.assign(mine,{videoId:MINE_DEFAULT.videoId,listId:MINE_DEFAULT.listId,listIndex:0});}
let data=(mine.lines.length&&!HOSTED)?mine:PRACTICE; let selected=data===mine?'mine':'practice';
let words=store.get('words',{});   // base -> {st:'unknown'|'learning'|'known'|'ignored', g?:meaning, ctx?:{jp,en,title}, seen:n}
let settings=Object.assign({mode:'pause',autoPause:true,autoKnown:true,checkins:true,band:0,kataReading:true,rate:1,pauseOnLookup:true},store.get('settings',{}));
let tips=store.get('tips',{});
const HELP=['Japanese only','Some help','Lots of help'];
const HELP_DESC=['Japanese only. Tap a word or press E when you need help.','Readings only on new and practising words. English when a line has 2+ of them.','Readings over every kanji and katakana word. English under every line.'];
let help=2; let sig=null; resetSignals();
function resetSignals(){sig={lookups:0,replays:0,helpChanges:[],watched:0,seen:new Set(),helped:new Set(),lastCheckin:-999,ended:false,pauses:0,autoKnown:0,saved:0};}
function save(){store.set('mine',mine);store.set('words',words);store.set('settings',settings);store.set('tips',tips);}
const stOf=b=>(words[b]&&words[b].st)||'unknown';
function counts(){const c={unknown:0,learning:0,known:0,ignored:0};for(const v of Object.values(words))c[v.st]=(c[v.st]||0)+1;return c;}
const glossOf=(b,s)=>(words[b]&&words[b].g)||(data.gloss||{})[b]||(data.gloss||{})[s]||GLOSS[b]||GLOSS[s]||GLOSS_MORE[b]||GLOSS_MORE[s]||'';
const ST_LABEL={unknown:'New',learning:'Practising',known:'Known',ignored:'Ignored'};
let obMode=false,pendingSeek=null;   // obMode: the first, onboarding session (Figma F2–F4b)

/* ============================== tokenizer ============================== */
let tokenizer=null;
const isKanji=c=>/[㐀-鿿豈-﫿々〆ヶ]/.test(c);
const isKata=s=>/^[゠-ヿー]+$/.test(s);
const toHira=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const isPunct=s=>/^[\s、。！？!?「」『』（）()…・〜~,.\-♪―　]+$/.test(s);
const plain=s=>s.replace(/\s|\[[^\]]*\]|\{[^}]*\}/g,'');
function initTokenizer(){const st=$('tokStatus');
  if(!window.kuromoji){st.textContent='Couldn’t load the word splitter — check your connection. The practice scene still works.';return;}
  kuromoji.builder({dicPath:'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/'}).build((err,tk)=>{if(err){st.textContent='Couldn’t load the word splitter — the practice scene still works.';return;}tokenizer=tk;st.textContent='Ready.';tokCache.clear();});}
const tokCache=new Map();
function rubyFromReading(surface,reading){
  if(!reading||![...surface].some(isKanji))return [{text:surface}];
  let s=[...surface],r=[...toHira(reading)],pre='',suf='';
  while(s.length&&r.length&&!isKanji(s[s.length-1])&&toHira(s[s.length-1])===r[r.length-1]){suf=s.pop()+suf;r.pop();}
  while(s.length&&r.length&&!isKanji(s[0])&&toHira(s[0])===r[0]){pre+=s.shift();r.shift();}
  const parts=[];if(pre)parts.push({text:pre});parts.push({text:s.join(''),rt:r.join('')});if(suf)parts.push({text:suf});return parts;}
const POS={'名詞':['noun','a thing, person or idea'],'動詞':['verb','an action'],'形容詞':['adjective','describes something'],'副詞':['adverb','how or when'],'助詞':['particle','a small grammar word that links words'],'助動詞':['helper','adds tense or politeness'],'連体詞':['pre-noun','points at a noun, like “this”'],'感動詞':['interjection','a reaction, like “oh”'],'接続詞':['conjunction','joins sentences'],'接頭詞':['prefix','attaches before a word'],'フィラー':['filler','like “um”']};
function tokenize(line){
  if(tokCache.has(line))return tokCache.get(line);
  let toks=[];
  if(/[\s\[\]{}]/.test(line.trim())){
    for(const raw of line.trim().split(/\s+/)){
      let base=null,body=raw;const m=raw.match(/\{([^}]*)\}$/);if(m){base=m[1];body=raw.slice(0,m.index);}
      const parts=[];let rest=body;
      while(rest.length){const k=rest.match(/^([^\[]*?)([㐀-鿿々]+)\[([^\]]+)\]/);if(k){if(k[1])parts.push({text:k[1]});parts.push({text:k[2],rt:k[3]});rest=rest.slice(k[0].length);}else{parts.push({text:rest});rest='';}}
      const surface=parts.map(p=>p.text).join('');toks.push({surface,parts,base:base||surface,pos:null,punct:isPunct(surface)});}
  }else if(tokenizer){
    for(const t of tokenizer.tokenize(line)){const surface=t.surface_form,punct=t.pos==='記号'||isPunct(surface);
      toks.push({surface,parts:rubyFromReading(surface,t.reading&&t.reading!=='*'?t.reading:''),base:t.basic_form&&t.basic_form!=='*'?t.basic_form:surface,pos:POS[t.pos]||null,punct});}
  }else{
    const runs=line.match(/[㐀-鿿々]+[぀-ゟ]*|[぀-ゟ]+|[゠-ヿー]+|[^぀-ヿ㐀-鿿]+/g)||[line];
    for(const r of runs)toks.push({surface:r,parts:[{text:r}],base:r,pos:null,punct:isPunct(r)});}
  tokCache.set(line,toks);return toks;}
const content=line=>tokenize(line).filter(t=>!t.punct);
function fullReading(t){return t.parts.map(p=>p.rt||toHira(p.text)).join('');}
function lineNewWords(i){return content(data.lines[i].jp).filter(t=>stOf(t.base)==='unknown').length;}

/* ============================== player wrapper ============================== */
let ytReady=false,ytApiLoaded=false;const ytQueue=[];
// Locally we load YouTube's official IFrame API. Hosted on Claude (artifact), outside scripts other than CDNs are blocked,
// so we talk to the embed directly over postMessage — the same protocol the official API wraps.
const USE_SHIM=!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)&&location.protocol!=='file:';
function loadYT(cb){if(ytReady)return cb();ytQueue.push(cb);if(ytApiLoaded)return;ytApiLoaded=true;
  if(USE_SHIM){installYTShim();return window.onYouTubeIframeAPIReady();}
  const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=()=>toast('Couldn’t load the YouTube player. Check your connection.');document.head.appendChild(s);}
window.onYouTubeIframeAPIReady=()=>{if(ytReady)return;ytReady=true;ytQueue.splice(0).forEach(f=>f());};
function installYTShim(){window.YT={Player:function(elId,o){
  const ev=o.events||{},pv=Object.assign({},o.playerVars||{},{enablejsapi:1,origin:location.origin,widget_referrer:location.href});
  let path=o.videoId;if(!path){path='videoseries';delete pv.listType;}
  const ifr=document.createElement('iframe');ifr.id=elId;ifr.src='https://www.youtube.com/embed/'+path+'?'+new URLSearchParams(pv);
  ifr.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';ifr.referrerPolicy='strict-origin-when-cross-origin';ifr.setAttribute('frameborder','0');
  ifr.style.cssText='width:100%;height:100%;border:0';document.getElementById(elId).replaceWith(ifr);
  const st={t:+(pv.start||0),at:performance.now(),state:-1,dur:0,rate:1,vd:{}};let ready=false;
  const now=()=>st.state===1?st.t+(performance.now()-st.at)/1000*st.rate:st.t;
  const setState=n=>{if(n===st.state)return;st.t=now();st.at=performance.now();st.state=n;};
  const post=m=>{try{ifr.contentWindow.postMessage(JSON.stringify(Object.assign({id:elId,channel:'widget'},m)),'*')}catch(e){}};
  const send=(func,args=[])=>post({event:'command',func,args});
  const onMsg=e=>{if(e.source!==ifr.contentWindow)return;let d;try{d=typeof e.data==='string'?JSON.parse(e.data):e.data}catch(x){return}if(!d||!d.event)return;
    if(d.event==='onReady'){if(!ready){ready=true;clearInterval(ping);ev.onReady&&ev.onReady({target:self});}}
    else if(d.event==='infoDelivery'||d.event==='initialDelivery'){const i=d.info||{};
      if('playerState' in i)setState(i.playerState);
      if(typeof i.currentTime==='number'){st.t=i.currentTime;st.at=performance.now();}
      if(i.duration)st.dur=i.duration;if(i.playbackRate)st.rate=i.playbackRate;if(i.videoData)st.vd=i.videoData;}
    else if(d.event==='onStateChange'){setState(d.info);ev.onStateChange&&ev.onStateChange({data:d.info,target:self});}
    else if(d.event==='onError'){ev.onError&&ev.onError({data:d.info,target:self});}};
  window.addEventListener('message',onMsg);
  const ping=setInterval(()=>post({event:'listening'}),250);ifr.addEventListener('load',()=>post({event:'listening'}));
  const self={getCurrentTime:now,getPlayerState:()=>st.state,getDuration:()=>st.dur,getVideoData:()=>st.vd,
    playVideo:()=>send('playVideo'),pauseVideo:()=>{setState(2);send('pauseVideo');},
    seekTo:(s,a)=>{st.t=s;st.at=performance.now();send('seekTo',[s,a!==false]);},
    setPlaybackRate:r=>{send('setPlaybackRate',[r]);st.t=now();st.at=performance.now();st.rate=r;},
    destroy:()=>{clearInterval(ping);window.removeEventListener('message',onMsg);ifr.remove();}};
  return self;}};}
const YT_ERR={2:'That link isn’t a valid video.',5:'The video can’t play here.',100:'Video not found or private.',101:'The uploader doesn’t allow this video to be embedded. Try another video.',150:'The uploader doesn’t allow this video to be embedded. Try another video.',152:'YouTube needs a real web address. Double-click “Start ImmerLingo.bat” in this folder.',153:'YouTube needs a real web address. Double-click “Start ImmerLingo.bat” in this folder.'};
function makePlayer(elId,scene,onReady,onEnd){
  if(!scene.videoId&&!scene.listId){
    let t0=null,base=scene.start||0,playing=false,dur=scene.end||60,rate=1;
    const P={kind:'demo',time(){return playing?Math.min(dur,base+(performance.now()-t0)/1000*rate):base},play(){if(!playing){t0=performance.now();playing=true}},pause(){if(playing){base=this.time();playing=false}try{speechSynthesis.cancel()}catch(e){}},seek(s){base=Math.max(0,Math.min(dur,s));if(playing)t0=performance.now();try{speechSynthesis.cancel()}catch(e){}},playing(){if(playing&&this.time()>=dur){base=dur;playing=false}return playing},duration(){return dur},setRate(r){base=this.time();t0=performance.now();rate=r},destroy(){try{speechSynthesis.cancel()}catch(e){}}};
    setTimeout(()=>onReady(P),0);return;}
  loadYT(()=>{
    const pv={controls:elId==='ytTiming'?1:0,disablekb:1,rel:0,modestbranding:1,iv_load_policy:3,cc_load_policy:0,playsinline:1,start:Math.floor(scene.start||0)};
    const opts={playerVars:pv,events:{
      onReady:()=>{const yt=opts._yt;onReady({kind:'yt',yt,time:()=>yt.getCurrentTime()||0,play:()=>yt.playVideo(),pause:()=>yt.pauseVideo(),seek:s=>yt.seekTo(s,true),playing:()=>yt.getPlayerState()===1,duration:()=>yt.getDuration()||0,setRate:r=>yt.setPlaybackRate(r),destroy:()=>yt.destroy(),videoId:()=>{try{return yt.getVideoData().video_id}catch(e){return ''}}});},
      onError:e=>toast(YT_ERR[e.data]||('YouTube error '+e.data),12000),
      onStateChange:e=>{if(e.data===0&&onEnd)onEnd()}}};
    if(scene.videoId)opts.videoId=scene.videoId;else{pv.listType='playlist';pv.list=scene.listId;pv.index=scene.listIndex||0;}
    opts._yt=new YT.Player(elId,opts);});}
function parseYT(url){url=(url||'').trim();const v=url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);const l=url.match(/[?&]list=([\w-]+)/);return {videoId:v?v[1]:(/^[\w-]{11}$/.test(url)?url:''),listId:l?l[1]:''};}
const fmt=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const parseTime=s=>{s=String(s||'').trim();if(!s)return null;if(/^\d+(\.\d+)?$/.test(s))return +s;const p=s.split(':').map(Number);return p.length===2?p[0]*60+p[1]:p.length===3?p[0]*3600+p[1]*60+p[2]:null;};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function speak(s,rate){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='ja-JP';u.rate=rate||.9;const v=speechSynthesis.getVoices().find(v=>/ja/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}

/* ============================== views ============================== */
function show(id){document.querySelectorAll('body > section').forEach(s=>s.classList.add('hidden'));$(id).classList.remove('hidden');}
/* ============================== subtitles ============================== */
function showReading(t,lvl){const st=stOf(t.base);if(st==='known'||st==='ignored')return false;if(lvl>=2)return true;if(lvl===1)return st==='unknown'||st==='learning';return false;}
let tappedThisLine=new Set();
function tokEl(t,lvl,lineIdx){
  const el=document.createElement('span');el.className='tok'+(t.punct?' punct':'')+(tappedThisLine.has(t.base)?' tapped':'');
  const st=stOf(t.base);if(!t.punct)el.dataset.st=st;
  let rt=t.parts.filter(p=>p.rt).map(p=>p.rt).join('');if(!rt&&settings.kataReading&&isKata(t.surface))rt=toHira(t.surface);
  el.innerHTML=`<span class="fu">${rt&&showReading(t,lvl)?esc(rt):''}</span><span class="sf">${esc(t.surface)}</span><span class="ul"></span><span class="mk">${st==='learning'?'🔥':''}</span>`;
  if(!t.punct)el.onclick=e=>{e.stopPropagation();openPopup(t,el,lineIdx)};
  return el;}
let curLine=-1,enRevealed=new Set();
function englishFor(i){if(help>=2)return true;if(enRevealed.has(i))return true;if(help===1)return content(data.lines[i].jp).filter(t=>{const s=stOf(t.base);return s==='unknown'||s==='learning'}).length>=2;return false;}
/* portfolio visual pass: the practice scene shows the café stills from the onboarding build, one per beat */
const STILL=[0,0,1,1,2,2,3,4,4,4];
function setStill(i){const d=$('demoScreen');if(!d||d.classList.contains('hidden'))return;d.style.backgroundImage='url(../v2/assets/still'+(STILL[Math.max(0,Math.min(i,STILL.length-1))]||0)+'.jpg)';}
function renderLine(i,force){
  if(i===curLine&&!force)return;if(i!==curLine)tappedThisLine=new Set();curLine=i;setStill(i);const jp=$('jpLine'),en=$('enLine'),se=$('showEn');jp.innerHTML='';en.classList.add('hidden');se.classList.add('hidden');
  if(i<0)return;const L=data.lines[i];
  if(!sig.seen.has(i)){sig.seen.add(i);for(const t of content(L.jp)){const w=words[t.base]||(words[t.base]={st:'unknown',seen:0});w.seen=(w.seen||0)+1;if(!w.ctx)w.ctx={jp:plain(L.jp),en:L.en||'',title:data.title};}save();updateLibChip();}
  for(const t of tokenize(L.jp))jp.appendChild(tokEl(t,help,i));
  if(L.en){if(englishFor(i)){en.textContent=L.en;en.classList.remove('hidden');}else se.classList.remove('hidden');}}
function updateLibChip(){const k=counts();$('libChip').innerHTML=`<span style="color:var(--succ)">${k.known} known</span> · <span style="color:var(--purple)">${k.learning} practising</span> · <span style="color:var(--accent)">${k.unknown} new</span>`;}

/* ============================== line-by-line pause ============================== */
let turnLine=-1,doneLines=new Set(),activeLine=-1,spokenLine=-1,primedLines=new Set(),primedTurn=false;
function lineStartIdx(t){let i=-1;for(let k=0;k<data.lines.length;k++){if(data.lines[k].t<=t+0.02)i=k;else break;}return i;}
function lineEnd(i){const L=data.lines[i],n=data.lines[i+1];if(L.e)return n?Math.min(L.e,n.t-0.05):L.e;return n?Math.min(n.t-0.05,L.t+8):L.t+6;}
function lineVisible(t){const i=lineStartIdx(t);return i>=0&&t<lineEnd(i)+0.01?i:-1;}
function enterTurn(i){
  turnLine=i;if(P)P.pause();sig.pauses++;renderLine(i,true);
  const n=lineNewWords(i);$('turnText').innerHTML=`<b>Your turn.</b> ${n} new word${n===1?'':'s'} — tap any you don’t know.`;$('turn').classList.remove('hidden');
  if(!tips.turn)teachTurn();}
function enterPrimed(i){   // Primed listening: show the line's new words first, then play it
  turnLine=i;primedTurn=true;if(P){P.pause();P.seek(Math.max(0,data.lines[i].t-0.15));}spokenLine=-1;renderLine(i,true);
  const nw=[...new Map(content(data.lines[i].jp).filter(t=>stOf(t.base)==='unknown').map(t=>[t.base,t])).values()];
  $('turnText').innerHTML=`<b>Coming up:</b> ${nw.map(t=>`<span lang="ja">${esc(t.surface)}</span> <span class="subtle">${esc(glossOf(t.base,t.surface)||'')}</span>`).join(' · ')}`;
  $('turnGo').firstChild.textContent='Play the line ';$('turn').classList.remove('hidden');}
function continueTurn(){
  if(turnLine<0)return;
  if(primedTurn){primedTurn=false;turnLine=-1;$('turn').classList.add('hidden');$('turnGo').firstChild.textContent='Continue ▷ ';spokenLine=-1;if(P)P.play();return;}
  const i=turnLine;closePopup(true);
  if(settings.autoKnown){for(const t of content(data.lines[i].jp)){if(stOf(t.base)==='unknown'&&!tappedThisLine.has(t.base)){words[t.base].st='known';sig.autoKnown++;}}save();}
  doneLines.add(i);turnLine=-1;$('turn').classList.add('hidden');updateLibChip();renderSide();
  if(!tips.continued&&(sig.autoKnown>0||!settings.autoKnown)){tips.continued=1;save();toast(`<span style="width:36px;height:4px;border-radius:2px;background:var(--succ);flex:none"></span><span>${settings.autoKnown?'Words you didn’t tap moved to your library as <b>known</b> — their red line is gone. Fewer new words means fewer pauses.':'Your words are saved. Known words lose their line.'}</span>`,7000);}
  if(P)P.play();}

/* ============================== popup (Figma 07 word card) ============================== */
let selEl=null,popPaused=false,popLine=-1;
function openPopup(t,el,lineIdx){
  if(selEl)selEl.classList.remove('sel');selEl=el;el.classList.add('sel');el.classList.add('tapped');$('jpLine').classList.remove('pulse');
  if(!tappedThisLine.has(t.base)){sig.lookups++;tappedThisLine.add(t.base);}if(lineIdx!=null)sig.helped.add(lineIdx);
  if(!words[t.base])words[t.base]={st:'unknown',seen:1};save();
  popLine=lineIdx!=null?lineIdx:curLine;
  popPaused=false;if(P&&turnLine<0&&!coachActive&&P.playing()&&settings.pauseOnLookup){P.pause();popPaused=true;}
  const read=fullReading(t),st=stOf(t.base),g=glossOf(t.base,t.surface),L=data.lines[popLine]||{},d=DICT.find(x=>x.w===t.base);
  const tags=d?d.tags.slice(0,3):(t.pos?[t.pos[0]]:[]);
  const pop=$('popup');pop.innerHTML=`
   <div class="row" style="align-items:baseline"><span class="w" lang="ja">${esc(t.base)}</span>${t.base===t.surface&&read!==t.base?`<span class="r" lang="ja">${esc(read)}</span>`:''}<button class="icon-btn" id="say" aria-label="Hear it">${ic('speaker')}</button><div class="spacer"></div><span class="pill st-${st}">${ST_LABEL[st]}</span><button class="btn ghost small" id="popX" aria-label="Close">${ic('x')}</button></div>
   ${tags.length?`<div class="row wr">${tags.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:''}
   ${g?`<div class="def">${esc(g)}</div>`:`<div class="col" style="gap:6px"><span class="small muted">No meaning saved yet.</span><div class="row"><input id="glossIn" placeholder="Add a meaning…"><button class="btn small" id="glossSave">Save</button></div></div>`}
   ${L.jp?`<div class="small muted" lang="ja">Here: ${esc(t.surface)}${t.surface!==t.base?` (${esc(read)}) — a form of ${esc(t.base)}`:''}${L.en?' · “'+esc(L.en)+'”':''}</div>`:''}
   ${t.pos?`<div class="pos"><b>${t.pos[0]}</b> — ${t.pos[1]}</div>`:''}
   <div class="acts"><button class="btn primary small" data-st="learning">Save card ${ic('plus')}</button><button class="btn small" id="popEdit">Edit card</button><button class="btn small" id="popExplain">Explain line ${ic('spark')}</button></div>
   <div class="links"><button class="link small" data-st="known">${st==='known'?'Known ✓':'Mark as known'}</button><button class="link small" data-st="ignored">Ignore word</button><button class="link small" id="popSentence">Sentence card</button><a class="link small" target="_blank" rel="noopener" href="https://jisho.org/search/${encodeURIComponent(t.base)}">Jisho ↗</a></div>`;
  pop.classList.remove('hidden');
  const sr=$('stage').getBoundingClientRect(),er=el.getBoundingClientRect(),pw=pop.offsetWidth;
  pop.style.left=Math.max(12,Math.min(sr.width-pw-12,er.left-sr.left+er.width/2-pw/2))+'px';
  pop.style.top=Math.max(12,er.top-sr.top-pop.offsetHeight-14)+'px';
  $('popX').onclick=()=>closePopup();
  $('say').onclick=()=>speak(read||t.base,.8);speak(read||t.base,.8);
  if($('glossSave'))$('glossSave').onclick=()=>{const v=$('glossIn').value.trim();if(v){words[t.base].g=v;save();openPopup(t,el,null);}};
  pop.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{setWord(t,b.dataset.st);closePopup();renderLine(curLine,true);updateLibChip();renderSide();onStatusSet(b.dataset.st);});
  $('popEdit').onclick=()=>{closePopup(true);openCardPanel(t,'Word');};
  $('popSentence').onclick=()=>{closePopup(true);openCardPanel(t,'Sentence');};
  $('popExplain').onclick=()=>{closePopup(true);openExplain(popLine);};
  onPopupOpened(pop);}
function cardFromTok(t,type){const i=popLine>=0?popLine:Math.max(0,curLine),L=data.lines[i]||{jp:'',en:'',t:0},s0=data.start||0;
  return {w:t.base,r:fullReading(t),def:glossOf(t.base,t.surface),jp:L.jp,en:L.en||'',here:t.surface+(L.en?' — '+L.en:''),src:`${data.title}${data===PRACTICE?' · Ep '+(obMode?1:PLAN.ep):''} · ${fmt(L.t-s0)}`,line:data===PRACTICE?i:null,type:type||'Word',deck:'My cards',audio:`${fmt(L.t-s0)} – ${fmt(lineEnd(i)-s0)} from the episode`};}
function setWord(t,st){words[t.base].st=st;
  if(st==='learning'){sig.saved++;const L=data.lines[popLine]||{};words[t.base].ctx={jp:plain(L.jp||''),en:L.en||'',title:data.title};addCard(cardFromTok(t));toast(`<b lang="ja">${esc(t.base)}</b> saved — due tomorrow in My cards.`,2500);}
  save();}
function closePopup(silent){if($('popup').classList.contains('hidden'))return;$('popup').classList.add('hidden');if(selEl)selEl.classList.remove('sel');selEl=null;
  if(P&&popPaused&&!coachActive&&turnLine<0&&$('drawer').classList.contains('hidden'))P.play();popPaused=false;if(!silent)onPopupClosed();}

/* ============================== side panel: transcript · saved · episodes, or a tool (Figma 07–10) ============================== */
let sideTab='transcript';
function panel(html){const d=$('drawer');d.innerHTML=html;d.classList.remove('hidden');d.scrollTop=0;}
function panelClose(){$('drawer').classList.add('hidden');$('stageNote').classList.add('hidden');['settingsBtn','dictBtn','howBtn'].forEach(id=>$(id).classList.remove('on'));renderSide();}
function renderSide(){
  const box=$('ptabs');if(!box||$('player').classList.contains('hidden'))return;
  const bm=new Set(app.bookmarks[data.id]||[]),s0=data.start||0;
  const savedW=Object.entries(words).filter(([w,v])=>v.st==='learning'&&v.ctx&&v.ctx.title===data.title);
  const tabs=[['transcript','Transcript'],['saved','Saved · '+savedW.length],['episodes','Episodes']];
  let body='';
  if(sideTab==='transcript')body=`<div class="row small subtle side-meta"><span>Auto-scroll on</span><div class="spacer"></div><span>Bookmarked ${bm.size}</span></div>`+data.lines.map((L,i)=>{const n=lineNewWords(i);
    return `<div class="tline${i===curLine?' cur':''}" data-li="${i}" role="button" tabindex="0"><span class="row small"><span class="subtle">${fmt(L.t-s0)}</span>${n?`<span class="accent">${n} new</span>`:''}<div class="spacer"></div><button class="bm${bm.has(i)?' on':''}" data-bm="${i}" aria-label="Bookmark line">${ic('bookmark')}</button></span><span lang="ja">${esc(plain(L.jp))}</span></div>`;}).join('');
  else if(sideTab==='saved')body=savedW.length?savedW.map(([w,v])=>`<div class="tline"><span class="row"><b lang="ja">${esc(w)}</b><span class="small muted">${esc(glossOf(w,w))}</span></span><span class="small subtle" lang="ja">${esc(v.ctx.jp)}</span></div>`).join(''):'<p class="small muted">Words you save in this episode show up here. Tap a word, then Save card.</p>';
  else{const sh=data===PRACTICE?showById('kissaten'):null;body=sh?sh.epFit.map((v,i)=>{const n=i+1,cur=n===(obMode?1:PLAN.ep);return `<div class="tline${cur?' cur':''}"><span class="row"><b>Episode ${n}</b><div class="spacer"></div>${fitChip(v)}</span><span class="small subtle">${cur?'Playing now · opening scene':'Preview only in this prototype'}</span></div>`;}).join(''):'<p class="small muted">Your clip is a single episode.</p>';}
  box.innerHTML=`<div class="tabs full">${tabs.map(([k,l])=>`<button class="${sideTab===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div><div class="side-list" id="sideList">${body}</div>`;
  const cur=box.querySelector('.tline.cur');if(cur&&sideTab==='transcript')cur.scrollIntoView({block:'nearest'});}
function markSideLine(i){const box=$('ptabs');if(!box)return;box.querySelectorAll('.tline.cur').forEach(e=>e.classList.remove('cur'));const el=box.querySelector(`.tline[data-li="${i}"]`);if(el){el.classList.add('cur');el.scrollIntoView({block:'nearest'});}}

/* portfolio fix: kanji that appear in the practice scene, for Ask a follow-up (standard dictionary meanings and readings) */
const KANJI={
 '喫':{m:'consume, drink, smoke',r:'キツ',w:'喫茶店 (きっさてん)',wm:'café, coffee shop'},
 '茶':{m:'tea',r:'チャ, サ',w:'喫茶店 (きっさてん)',wm:'café, coffee shop'},
 '店':{m:'shop, store',r:'テン · みせ',w:'喫茶店 (きっさてん) · 店 (みせ)',wm:'café · shop'},
 '四':{m:'four',r:'シ · よ, よん, よっ(つ)',w:'四十年 (よんじゅうねん)',wm:'forty years'},
 '十':{m:'ten',r:'ジュウ, ジッ · とお',w:'四十年 (よんじゅうねん)',wm:'forty years'},
 '年':{m:'year',r:'ネン · とし',w:'四十年 (よんじゅうねん)',wm:'forty years'},
 '閉':{m:'close, shut',r:'ヘイ · し(める), し(まる), と(じる)',w:'閉めちゃった (しめちゃった)',wm:'(have) closed, casual'},
 '一':{m:'one',r:'イチ, イツ · ひと(つ)',w:'一つ (ひとつ)',wm:'one (thing)'},
 '常':{m:'usual, always',r:'ジョウ · つね',w:'常連 (じょうれん)',wm:'regular customer'},
 '連':{m:'take along, connect',r:'レン · つ(れる)',w:'常連 (じょうれん)',wm:'regular customer'},
 '明':{m:'bright, next',r:'メイ, ミョウ · あか(るい), あ(ける)',w:'明日 (あした)',wm:'tomorrow (a special reading)'},
 '日':{m:'day, sun',r:'ニチ, ジツ · ひ, か',w:'明日 (あした)',wm:'tomorrow'},
 '朝':{m:'morning',r:'チョウ · あさ',w:'朝 (あさ)',wm:'morning'},
 '早':{m:'early, fast',r:'ソウ · はや(い)',w:'早く (はやく)',wm:'early'},
 '起':{m:'get up, rise',r:'キ · お(きる)',w:'起きて (おきて)',wm:'get up (please)'},
 '山':{m:'mountain',r:'サン · やま',w:'山 (やま)',wm:'mountain'}};
function openExplain(i){
  if(i<0)i=curLine;if(i<0)i=Math.max(0,lineStartIdx(P?P.time():0));const L=data.lines[i];if(!L)return;
  const X=data===PRACTICE?EXPLAIN[i]:null;if(P&&P.playing())P.pause();
  /* show the explained line on screen too (portfolio demo fix: the panel and the subtitle must match) */
  if(P&&P.seek&&curLine!==i){P.seek(Math.max(0,L.t+0.05));renderLine(i,true);}$('stageNote').classList.remove('hidden');sig.helped.add(i);
  const pieces=X?X.pieces:[...new Map(content(L.jp).filter(t=>glossOf(t.base,t.surface)).map(t=>[t.surface,[t.surface,glossOf(t.base,t.surface),'']])).values()];
  panel(`<div class="row"><b class="h4">${ic('spark','accent')} Explain this line</b><div class="spacer"></div><button class="btn ghost small" id="pX" aria-label="Close">${ic('x')}</button></div>
   <div class="box col" style="gap:2px"><b lang="ja" class="jp-m">${esc(plain(L.jp))}</b><span class="small subtle">${fmt(L.t-(data.start||0))} · ${esc(data.title)}</span></div>
   <div class="ai-note">${ic('help')}<span>${X?'Written for this prototype. In the product: an AI explanation, grammar checked against a reference dictionary.':'Built from the dictionary in this prototype. In the product: an AI explanation.'} <button class="link small" id="xReport">Report a mistake</button></span></div>
   <span class="eyebrow">Piece by piece</span>${pieces.map(([j,m,n])=>`<div class="col" style="gap:2px"><span><b lang="ja">${esc(j)}</b>&nbsp; <b>${esc(m)}</b></span>${n?`<span class="small muted">${esc(n)}</span>`:''}</div>`).join('')||'<span class="small muted">No dictionary entries for this line yet.</span>'}
   <hr><span class="eyebrow">In plain English</span><div>${esc(X?X.plain:(L.en?'“'+L.en+'”':'No translation for this line yet.'))}</div>
   <div class="row wr"><button class="btn small" id="xSent">Save as sentence card ${ic('plus')}</button><button class="btn primary small" id="xResume">Resume ${ic('play')}</button></div>
   <div class="row"><span class="eyebrow">Ask a follow-up</span><div class="spacer"></div><button class="link small" id="xAsk">Ask</button></div>
   <input id="xQ" placeholder="${esc(X&&X.ask?X.ask:'Ask about this line…')}" aria-label="Ask a follow-up"><div id="xA" class="small"></div>
`);
  $('pX').onclick=panelClose;$('xResume').onclick=()=>{panelClose();if(turnLine>=0)continueTurn();else if(P)P.play();};
  $('xSent').onclick=()=>{const t=content(L.jp).find(t=>stOf(t.base)!=='known')||content(L.jp)[0];popLine=i;openCardPanel(t,'Sentence');};
  /* portfolio fix: answer follow-ups from data written for this prototype (kanji in the scene, the line's words,
     the scripted question) instead of a dead end. The product would call the AI service, checked against a dictionary. */
  const ask=(preset)=>{const q=(typeof preset==='string'?preset:$('xQ').value).trim();if(typeof preset==='string')$('xQ').value=preset;
    const label='<span class="small subtle" style="display:block;margin-top:6px">Answer written for this prototype. In the product: an AI answer, checked against a dictionary.</span>';
    const out=[];
    // 1. kanji in the question
    const ks=[...new Set([...q].filter(c=>KANJI[c]))];
    ks.forEach(c=>{const k=KANJI[c];out.push(`<div class="col" style="gap:2px"><span><b lang="ja" style="font-size:22px">${c}</b>&nbsp; <b>${esc(k.m)}</b></span><span class="small muted">Readings: <span lang="ja">${esc(k.r)}</span></span><span class="small muted">Here: <span lang="ja">${esc(k.w)}</span> · ${esc(k.wm)}</span></div>`);});
    // 2. words of this line named in the question
    if(!ks.length){const seen=new Set();content(L.jp).filter(t=>!t.punct&&t.surface.length>1&&q.includes(t.surface)).forEach(t=>{if(seen.has(t.base))return;seen.add(t.base);const g=glossOf(t.base,t.surface);if(g)out.push(`<div><b lang="ja">${esc(t.surface)}</b>&nbsp; ${esc(g)}</div>`);});}
    // 3. the scripted question for this line
    if(!out.length&&X&&X.answer&&(!q||q===X.ask||/の|か|why/i.test(q)))out.push(`<b>${esc(q||X.ask)}</b><br><span class="muted">${esc(X.answer)}</span>`);
    if(out.length){$('xA').innerHTML=`<div class="col" style="gap:10px;margin-top:4px">${out.join('')}</div>`+label;return;}
    // 4. nothing matched: offer questions this prototype can answer
    const kOn=[...new Set([...plain(L.jp)].filter(c=>KANJI[c]))].slice(0,2);
    const sug=[...kOn.map(c=>`What does ${c} mean?`),...(X&&X.ask?[X.ask]:[])];
    $('xA').innerHTML=`<span class="muted">This prototype answers questions about the kanji and words in this line${sug.length?'. Try:':'.'}</span>`+
      (sug.length?`<div class="row wr" style="gap:6px;margin-top:8px">${sug.map(s=>`<button class="chip-t" type="button" data-q="${esc(s)}" lang="ja">${esc(s)}</button>`).join('')}</div>`:'');
    $('xA').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>ask(b.dataset.q));};
  $('xAsk').onclick=ask;$('xQ').onkeydown=e=>{if(e.key==='Enter')ask();};
  $('xReport').onclick=()=>toast('Thanks. Reports aren’t sent anywhere in this prototype.',3000);}
function openCardPanel(t,type){
  if(P&&P.playing())P.pause();const c=cardFromTok(t,type);
  panel(cardFormHTML(c,true));
  $('cfSave').onclick=()=>{readCardForm(c);addCard(c);words[c.w]=Object.assign(words[c.w]||{seen:1},{st:'learning',ctx:{jp:plain(c.jp||''),en:c.en,title:data.title}});sig.saved++;save();
    panelClose();renderLine(curLine,true);updateLibChip();toast(`Card added · due tomorrow in “${esc(c.deck)}”`,2500);};}
function openDict(){
  $('dictBtn').classList.add('on');
  panel(`<div class="row"><b class="h4">${ic('search')} Dictionary</b><div class="spacer"></div><button class="btn ghost small" id="pX" aria-label="Close">${ic('x')}</button></div>
   <input id="pdQ" lang="ja" placeholder="Kana, kanji, romaji or English" aria-label="Search the dictionary"><div class="col" id="pdRes" style="gap:4px"></div>`);
  $('pX').onclick=panelClose;const run=()=>{const r=dictSearch($('pdQ').value);$('pdRes').innerHTML=r.length?r.slice(0,12).map(d=>`<div class="tline"><span class="row" style="gap:8px;align-items:baseline"><b lang="ja">${esc(d.w)}</b><span class="small muted" lang="ja">${d.r&&d.r!==d.w?esc(d.r):''}</span></span><span class="small">${esc(d.en.join('; '))}</span></div>`).join(''):($('pdQ').value?'<span class="small muted">No results.</span>':'<span class="small muted">The video stays paused while you search.</span>');};
  $('pdQ').oninput=run;run();if(P&&P.playing())P.pause();setTimeout(()=>$('pdQ').focus(),0);}

/* ============================== teaching layer ============================== */
let coachActive=false;
function coach({anchor,place='down',step,title,body,actions}){
  coachActive=true;const c=$('coach');c.className='coach '+place;
  c.innerHTML=`${step?`<div class="step">${step}</div>`:''}<h3>${title}</h3><p>${body}</p><div class="row">${actions.map((a,i)=>`<button class="btn small ${a.primary?'primary':a.ghost?'ghost':''}" data-i="${i}">${a.label}</button>`).join('')}</div>`;
  c.classList.remove('hidden');const sr=$('stage').getBoundingClientRect(),ar=anchor.getBoundingClientRect();
  if(place==='down'){c.style.left=Math.max(12,Math.min(sr.width-402,ar.left-sr.left+ar.width/2-195))+'px';c.style.top=Math.max(12,ar.top-sr.top-c.offsetHeight-18)+'px';}
  else if(place==='up'){c.style.left=Math.max(12,Math.min(sr.width-402,ar.right-sr.left-300))+'px';c.style.top='12px';}
  else if(place==='left'){const lx=ar.left-sr.left-410;if(lx<12){c.className='coach right';c.style.left=Math.min(sr.width-402,ar.right-sr.left+18)+'px';}else c.style.left=lx+'px';c.style.top=Math.max(12,ar.top-sr.top)+'px';}
  document.querySelectorAll('.spot').forEach(e=>e.classList.remove('spot'));anchor.classList.add('spot');
  c.querySelectorAll('button').forEach(b=>b.onclick=()=>actions[+b.dataset.i].do());}
function endCoach(){$('coach').classList.add('hidden');document.querySelectorAll('.spot').forEach(e=>e.classList.remove('spot'));coachActive=false;}
function toast(html,ms=7000){const t=$('player').classList.contains('hidden')?$('gtoast'):$('toast');t.innerHTML=html;t.classList.remove('hidden');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.add('hidden'),ms);}
function skipTips(){tips={turn:1,tap:1,popup:1,continued:1,help:1,status:1};save();endCoach();$('jpLine').classList.remove('pulse');}
function teachTurn(){tips.turn=1;save();
  coach({anchor:$('jpLine'),step:'1 of 3 · Your turn',title:'The video waits after each line',
    body:'Every word starts with a <b style="color:var(--accent)">red line</b> — new to you. The small hiragana above a word shows how to say it, even for kanji and katakana. English is underneath while you’re starting out.',
    actions:[{label:'Next',primary:1,do:()=>{coach({anchor:$('jpLine'),step:'2 of 3 · Try it',title:'Tap a word you don’t know',body:'Tap one of the glowing words to see what it means and hear it.',actions:[{label:'Skip the tips',ghost:1,do:skipTips}]});$('jpLine').classList.add('pulse');}},{label:'Skip the tips',ghost:1,do:skipTips}]});}
function onPopupOpened(pop){if(tips.popup)return;tips.popup=1;tips.turn=1;save();
  coach({anchor:pop,place:'left',step:'2 of 3 · The word card',title:'Meaning, reading and sound',
   body:'<b>Save card</b> keeps it to practise (purple line) and adds a review card. <b>Mark as known</b> clears its line. Or just close it — you’ve looked it up, so it stays <b>new</b>.',actions:[{label:'Got it',primary:1,do:endCoach}]});}
function onPopupClosed(){if(tips.continue_tip||!tips.popup||turnLine<0)return;tips.continue_tip=1;save();
  coach({anchor:$('turnGo'),step:'3 of 3 · Keep going',title:'Press Continue when you’re done',
   body:`${settings.autoKnown?'Words you <b>didn’t tap</b> go into your library as <b>known</b>, so they lose their red line. ':''}The video only pauses on lines that still have new words — so it stops less as you learn. Change help with − / + at the top, or switch the learning mode in Settings.`,
   actions:[{label:'Got it',primary:1,do:endCoach}]});}
function onStatusSet(st){if(tips.status)return;tips.status=1;save();
  const col={learning:'var(--purple)',known:'var(--succ)',ignored:'var(--sstrong)'}[st];
  toast(`<span style="width:36px;height:4px;border-radius:2px;background:${col};flex:none"></span><span>The coloured line is your word library at work. <b>Learn → Word library</b> lists everything you’ve met.</span>`,7000);}
function howItWorks(){$('howBtn').classList.add('on');panel(`<div class="row"><b class="h4">How it works</b><div class="spacer"></div><button class="btn ghost small" id="pX" aria-label="Close">${ic('x')}</button></div>
   <p class="small muted" style="margin:0">${{pause:'After each line with new words, the video waits. Tap words you don’t know, then Continue.',watch:'The video plays straight through. Tap any word when you want — it pauses while you read.',primed:'Before each line with new words, you see those words first. Then the line plays.'}[settings.mode]}</p>
   <div class="legend"><b>Lines under words</b>
    <div><span class="swatch" style="background:var(--accent)"></span>New — you haven’t marked it yet</div>
    <div><span class="swatch" style="background:var(--purple)"></span>🔥 Practising — saved as a card</div>
    <div><span class="swatch" style="background:var(--succ)"></span>Known (shows when you hover)</div>
    <div><span class="swatch" style="background:var(--sstrong)"></span>Ignored — names and sounds</div></div>
   <div class="legend"><b>Help levels</b>${HELP.map((h,i)=>`<div><span class="chip" style="min-width:120px;justify-content:center">${h}</span><span class="small muted">${HELP_DESC[i]}</span></div>`).reverse().join('')}</div>
   <div class="legend"><b>Keyboard shortcuts</b><div class="small muted">Space continue / play / pause · R hear the line again · A / D previous / next line · E show English · Esc close</div></div>
   <button class="btn small" id="replayTips" style="align-self:flex-start">Show the tips again</button>`);
  $('pX').onclick=panelClose;$('replayTips').onclick=()=>{tips={};save();panelClose();toast('Tips will show again at the next pause.',4000);};}
const MODES=[['pause','Pause on new words','The video waits after each line that still has new words'],['watch','Just watch','No pauses. Tap any word when you want; the video pauses while you read'],['primed','Primed listening','See a line’s new words first, then hear it']];
function setMode(m){settings.mode=m;settings.autoPause=m==='pause';save();$('modeLbl').textContent=MODES.find(x=>x[0]===m)[1];}
function openSettings(){$('settingsBtn').classList.add('on');
  const sw=(k,t,d)=>`<div class="toggle"><div><b>${t}</b><div class="small muted">${d}</div></div><button class="switch" data-k="${k}" role="switch" aria-checked="${!!settings[k]}" aria-label="${t}"></button></div>`;
  panel(`<div class="row"><span class="col" style="gap:0"><b class="h4">${ic('gear')} Settings for this episode</b><span class="small muted">Carries over to the next one unless you change it</span></span><div class="spacer"></div><button class="btn ghost small" id="pX" aria-label="Close">${ic('x')}</button></div>
   <span class="eyebrow">Learning mode</span><div class="col" id="sMode" style="gap:6px">${MODES.map(([k,l,d])=>`<button class="radio${settings.mode===k?' on':''}" data-m="${k}" role="radio" aria-checked="${settings.mode===k}"><span class="rd"></span><span class="col" style="gap:0;text-align:left"><b>${l}</b><span class="small muted">${d}</span></span></button>`).join('')}</div>
   <div class="box col"><b>Help level</b><div class="seg2" id="sHelp">${['None','Some','Lots'].map((h,i)=>`<button class="${help===i?'on':''}" data-h="${i}" title="${HELP[i]}">${h}</button>`).join('')}</div><span class="small muted" id="sHelpDesc">${HELP_DESC[help]}</span></div>
   <span class="eyebrow">Words</span>
   ${sw('autoKnown','Words I don’t tap become known','When you press Continue. Off = they stay new until you mark them.')}
   ${sw('pauseOnLookup','Pause when I tap a word','Resumes when you close the card')}
   ${sw('kataReading','Hiragana over katakana words','Turn off once you can read katakana')}
   ${sw('checkins','End-of-scene suggestions','One tap; the video keeps playing')}
   <span class="eyebrow">Playback</span>
   <div class="row"><b>Speed</b><div class="spacer"></div><div class="seg2 sm" id="sRate">${[.75,1,1.25].map(r=>`<button class="${(settings.rate||1)===r?'on':''}" data-r="${r}">${r}×</button>`).join('')}</div></div>
   <div class="col"><b>Cover the video’s own subtitles</b><div class="small muted">If subtitles are burned into the picture, slide until they’re hidden</div><input type="range" min="0" max="30" step="1" id="bandRange" aria-label="Cover height"></div>
   <span class="eyebrow">Keyboard shortcuts</span><div class="small muted">Space continue / play · R replay line · A / D previous / next line · E show English · Esc close</div>`);
  const d=$('drawer');$('pX').onclick=panelClose;
  d.querySelectorAll('.switch').forEach(s=>{s.classList.toggle('on',!!settings[s.dataset.k]);s.onclick=()=>{settings[s.dataset.k]=!settings[s.dataset.k];s.classList.toggle('on');s.setAttribute('aria-checked',!!settings[s.dataset.k]);save();renderLine(curLine,true);}});
  $('sHelp').querySelectorAll('button').forEach(b=>b.onclick=()=>{setHelp(+b.dataset.h,'settings');$('sHelp').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));$('sHelpDesc').textContent=HELP_DESC[help];});
  $('sMode').querySelectorAll('button').forEach(b=>b.onclick=()=>{setMode(b.dataset.m);$('sMode').querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-checked',x===b);});});
  $('sRate').querySelectorAll('button').forEach(b=>b.onclick=()=>{setRate(+b.dataset.r);$('sRate').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));});
  $('bandRange').value=settings.band||0;$('bandRange').oninput=e=>{settings.band=+e.target.value;$('coverBand').style.height=settings.band+'%';save();};}

/* ============================== check-ins ============================== */
function breakTimes(){const b=new Set(data.breaks||[]);for(let i=1;i<data.lines.length;i++)if(data.lines[i].t-data.lines[i-1].t>8)b.add(data.lines[i].t-1);return [...b].sort((a,b)=>a-b);}
function maybeCheckin(){
  if(!settings.checkins||coachActive||turnLine>=0||sig.watched<25||sig.watched-sig.lastCheckin<60)return;
  const mins=Math.max(sig.watched/60,0.5),rate=sig.lookups/mins,m=Math.max(1,Math.round(sig.watched/60));let msg=null;
  if(help>=1&&rate<1&&sig.replays<=1)msg={title:'Seems easy so far',body:`${sig.lookups} word${sig.lookups===1?'':'s'} tapped and ${sig.replays} replay${sig.replays===1?'':'s'} in ${m} min. ${help===2?'Show English only on harder lines?':'Hide English unless you ask?'}`,yes:'Yes, less help',d:-1};
  else if(help===2&&rate>=4)msg={title:'Lots of new words — that’s normal',body:`${sig.lookups} words tapped in ${m} min. Try 0.75× speed, or let some words go — you don’t need every one.`,yes:'Slow to 0.75×',slow:1};
  else if(help<=1&&rate>=3)msg={title:'Lots of new words',body:`${sig.lookups} words tapped in ${m} min. Bring back readings and English?`,yes:'Yes, more help',d:+1};
  if(!msg)return;sig.lastCheckin=sig.watched;
  const c=$('checkin');c.innerHTML=`<div class="row"><b>✦ ${msg.title}</b><div class="spacer"></div><button class="btn ghost small" id="ciX">✕</button></div><div class="muted">${msg.body}</div><div class="row"><button class="btn small" id="ciYes">${msg.yes}</button><button class="btn ghost small" id="ciNo">Keep as is</button></div><div class="small subtle">Video keeps playing · hides in 8 s</div>`;
  c.classList.remove('hidden');const hide=()=>c.classList.add('hidden');const tm=setTimeout(hide,8000);
  $('ciX').onclick=$('ciNo').onclick=()=>{clearTimeout(tm);hide()};$('ciYes').onclick=()=>{clearTimeout(tm);hide();if(msg.slow)setRate(.75);else setHelp(help+msg.d,'check-in')};}
function setHelp(h,src){h=Math.max(0,Math.min(2,h));if(h===help)return;sig.helpChanges.push({at:P?P.time()-(data.start||0):0,from:help,to:h,src});help=h;$('helpLabel').textContent=HELP[help];$('helpBox').title=HELP_DESC[help];renderLine(curLine,true);toast(`<b>${HELP[help]}</b><span class="small muted">${HELP_DESC[help]}</span>`,3500);}
function setRate(r){settings.rate=r;save();if(P&&P.setRate)P.setRate(r);$('speedBtn').textContent=r+'×';}

/* ============================== session ============================== */
let P=null,loop=null,lastT=0,bt=[];
function leavePlayer(){if(P){P.destroy();P=null;}clearInterval(loop);endCoach();closePopup(true);panelClose();try{speechSynthesis.cancel()}catch(e){}obMode=false;}
function startPlayer(){
  if(!data.lines.length){go('clip');return;}
  show('player');resetSignals();enRevealed.clear();curLine=-1;turnLine=-1;doneLines=new Set();primedLines=new Set();primedTurn=false;activeLine=-1;spokenLine=-1;help=obMode?2:(app.help==='less'?1:app.help==='more'?2:1);
  if(obMode)help=2;
  $('helpLabel').textContent=HELP[help];$('helpBox').title=HELP_DESC[help];$('turn').classList.add('hidden');$('result').classList.add('hidden');
  const isP=data===PRACTICE;
  $('pTitle').textContent=isP?`Kissaten no Yoru · S1 E${obMode?1:PLAN.ep}`:data.title;
  document.querySelector('#player .toolbar').classList.toggle('ob',obMode);
  $('pFit').innerHTML=obMode?`<span class="ob-chip">${ic('spark')} Getting to know you · first estimate after this scene</span>`:(isP?fitChip(showById('kissaten').fit):'');
  $('modeLbl').textContent=MODES.find(x=>x[0]===(settings.mode||'pause'))[1];settings.autoPause=(settings.mode||'pause')==='pause';
  panelClose();$('checkin').classList.add('hidden');updateLibChip();
  $('demoScreen').classList.toggle('hidden',!!(data.videoId||data.listId));$('coverBand').style.height=(settings.band||0)+'%';
  bt=breakTimes();if(P){P.destroy();P=null;}$('yt').replaceWith(Object.assign(document.createElement('div'),{id:'yt'}));
  sideTab='transcript';renderSide();
  makePlayer('yt',data,p=>{P=p;const ps=pendingSeek;pendingSeek=null;p.seek(ps!=null&&data.lines[ps]?Math.max(0,data.lines[ps].t-0.2):(data.start||0));setRate(settings.rate||1);p.play();
    if(p.kind==='yt'&&data===mine&&!mine.videoId){const id=p.videoId&&p.videoId();if(id){mine.videoId=id;save();}}
    let author='',vt='';try{const vd=p.yt.getVideoData();author=vd.author||'';vt=vd.title||''}catch(e){}
    if(p.kind==='yt'&&/dub|hindi|tamil|telugu|english audio/i.test(vt)&&!/japanese audio/i.test(vt))toast('<b>This video looks dubbed</b> (“'+vt.replace(/[<>&]/g,'')+'”). Dubbed versions have no Japanese audio — pick the “English Sub” version of the episode in <b>Your clip</b>.',12000);
    $('credit').textContent=p.kind==='yt'?['Video: '+(author||'YouTube')+' on YouTube',data.credit].filter(Boolean).join(' · '):'Practice scene: original lines written for this prototype · Stills: AI-generated';},()=>endSession(true));
  runLoop();$('track').querySelectorAll('b').forEach(b=>b.remove());}
function runLoop(){clearInterval(loop);lastT=P?P.time():data.start||0;
  loop=setInterval(()=>{if(!P)return;const t=P.time(),playing=P.playing();
    if(playing&&t>lastT&&t-lastT<1.5)sig.watched+=t-lastT;
    if(t<lastT-0.5){doneLines.forEach(i=>{if(data.lines[i].t>=t-0.05)doneLines.delete(i)});primedLines.forEach(i=>{if(data.lines[i].t>=t-0.05)primedLines.delete(i)});spokenLine=-1;}
    for(const b of bt)if(lastT<b&&t>=b)maybeCheckin();
    const si=lineStartIdx(t);
    if(turnLine>=0){if(playing){turnLine=-1;if(primedTurn){primedTurn=false;$('turnGo').firstChild.textContent='Continue ▷ ';}$('turn').classList.add('hidden');}else{lastT=t;return;}}
    if(settings.mode==='primed'&&playing&&si>=0&&!primedLines.has(si)&&t<lineEnd(si)&&!coachActive){primedLines.add(si);if(lineNewWords(si)>0){enterPrimed(si);lastT=t;return;}}
    if(data.tts&&playing&&si>=0&&si!==spokenLine&&t<lineEnd(si)){spokenLine=si;speak(plain(data.lines[si].jp),.95*(settings.rate||1));}
    if(settings.autoPause&&playing&&si>=0&&!doneLines.has(si)&&t>=lineEnd(si)-0.08){
      if(lineNewWords(si)>0&&!coachActive){enterTurn(si);lastT=t;return;}doneLines.add(si);}
    lastT=t;const vis=lineVisible(t);if(vis!==curLine&&vis>=0)markSideLine(vis);renderLine(vis);
    const s=data.start||0,e=data.end||P.duration()||1,span=Math.max(1,e-s);
    $('trackFill').style.width=Math.max(0,Math.min(100,100*(t-s)/span))+'%';$('timeLbl').textContent=fmt(t-s)+' / '+fmt(span);$('playPause').innerHTML=playing?ic('pause'):ic('play');
    const tr=$('track');if(!tr.querySelector('b'))for(const b of bt){if(b<s||b>e)continue;const m=document.createElement('b');m.style.left=(100*(b-s)/span)+'%';tr.appendChild(m);}
    if(data.end&&t>=data.end-0.1&&!sig.ended&&turnLine<0){P.pause();endSession(true);}
  },80);}
function lineStep(dir){if(!P)return;turnLine=-1;primedTurn=false;$('turn').classList.add('hidden');const t=P.time();let i=curLine>=0?curLine:lineStartIdx(t);i=Math.max(0,Math.min(data.lines.length-1,i+dir));doneLines.delete(i);primedLines.add(i);spokenLine=-1;P.seek(Math.max(0,data.lines[i].t-0.15));}
function seekLine(i){if(!P)return;turnLine=-1;primedTurn=false;$('turn').classList.add('hidden');doneLines.delete(i);primedLines.add(i);spokenLine=-1;P.seek(Math.max(0,data.lines[i].t-0.15));P.play();}
function replay(){if(!P)return;let i=turnLine>=0?turnLine:curLine>=0?curLine:Math.max(0,lineStartIdx(P.time()));sig.replays++;sig.helped.add(i);
  turnLine=-1;primedTurn=false;$('turn').classList.add('hidden');doneLines.delete(i);primedLines.add(i);spokenLine=-1;P.seek(Math.max(0,data.lines[i].t-0.2));P.play();}
const LEVELS={Starter:'Readings on every kanji and English under every line, for a little longer.',Bridge:'Readings only on kanji you looked up or haven’t seen. English only on lines with 2 or more new words.','Native subtitles':'Japanese only. Tap a word or press E when you need help.'};
function endSession(finished){
  if(sig.ended)return;sig.ended=true;if(P)P.pause();closePopup(true);endCoach();clearInterval(loop);panelClose();try{speechSynthesis.cancel()}catch(e){}
  const seen=sig.seen.size||1,followed=Math.max(0,Math.round(100*(seen-[...sig.helped].filter(i=>sig.seen.has(i)).length)/seen));
  const t=P?Math.max(0,P.time()-(data.start||0)):0,mins=Math.max(1,Math.round(sig.watched/60)),total=(data.end||t)-(data.start||0);
  const hc=sig.helpChanges.length,isP=data===PRACTICE,nPrime=primeList().length;
  const met=Object.entries(words).filter(([w,v])=>v.ctx&&v.ctx.title===data.title&&(v.st==='unknown'||v.st==='learning'));
  const tile=(l,v,c)=>`<div class="stat"><div class="l">${l}</div><div class="v">${v}</div><div class="c">${c}</div></div>`;
  const wordsList=met.length?`<details class="box"><summary><b>Words to practise from this ${isP?'scene':'clip'} (${met.length})</b></summary><div class="col" style="margin-top:12px;gap:6px">${met.map(([w,v])=>`<div class="row"><span class="jp-m" lang="ja">${esc(w)}</span><span class="pill st-${v.st}">${ST_LABEL[v.st]}</span><span class="small muted">${esc(glossOf(w,w))}</span></div>`).join('')}</div></details>`:'';
  let html,bind;
  const enough=sig.seen.size>=3&&sig.watched>=0.3*Math.max(1,total);   // skipping through doesn't earn a score
  if(obMode&&finished&&!enough)finished=false;   // too little watched to score: show the rough-estimate version
  if(obMode){
    app.first={lookups:sig.lookups,lines:sig.seen.size,followed,replays:sig.replays,watched:Math.round(sig.watched)};saveApp();
    const level=followed>=85?'Native subtitles':followed>=60?'Bridge':'Starter';
    if(finished){   // F4 · stops after the episode
      html=`<div class="row"><div class="col" style="gap:2px"><span class="eyebrow">Episode 1 done</span><h3>Kissaten no Yoru</h3></div><div class="spacer"></div><button class="btn ghost small" id="rX" aria-label="Close">${ic('x')}</button></div>
       <div class="col" style="gap:4px"><h2 class="h3" style="margin:0">You followed about ${followed}%</h2><span class="muted">Worked out from how you watched — there was no test.</span></div>
       <div class="stats">${tile('Lookups',sig.lookups+' word'+(sig.lookups===1?'':'s'),sig.lookups?'tapped while watching':'none needed')}${tile('Replays',sig.replays+' line'+(sig.replays===1?'':'s'),sig.replays?'heard again':'none')}${tile('Help changed',hc?hc===1?'Once':hc+' times':'Never',hc?'at '+fmt(sig.helpChanges[0].at):'kept as it was')}${tile('Watched',fmt(sig.watched),'of '+fmt(total)+' · this scene')}</div>
       <div class="box col"><div class="row"><b>${ic('spark')} Next episode: ${level}</b><div class="spacer"></div><button class="link small" id="rWhy">Why this?</button></div><span>${LEVELS[level]}</span><span class="small subtle" id="rWhyTxt">Known words: about ${Math.max(100,Math.round(followed*25/100)*100).toLocaleString()}. The estimate narrows a little every episode.</span></div>
       <div class="row wr"><button class="btn primary" id="rNext">Continue — 1-minute setup ${ic('right')}</button>${nPrime?`<button class="btn" id="rWarm">Warm up first · ${nPrime} words</button>`:''}<div class="spacer"></div><button class="btn ghost small" id="rMore">Keep more help</button></div>
       <span class="small subtle">${ic('help')} Warm-up is optional. Skipping it doesn’t change your level.</span>${wordsList}`;
      bind=()=>{$('rNext').onclick=()=>go('setup');if($('rWarm'))$('rWarm').onclick=()=>go('prime');$('rMore').onclick=()=>{app.help='more';saveApp();go('setup');};
        $('rWhy').onclick=()=>{$('rWhyTxt').textContent=`You needed help on ${[...sig.helped].length} of ${seen} lines (${100-followed}%). ${level==='Starter'?'That’s normal at the start — help stays generous.':'So English drops to the harder lines next time.'}`;};};
    }else{          // F4b · stops early
      html=`<div class="row"><div class="col" style="gap:2px"><span class="eyebrow">Stopped at ${fmt(t)} · Episode 1</span><h3>Kissaten no Yoru</h3></div><div class="spacer"></div><button class="btn ghost small" id="rX" aria-label="Close">${ic('x')}</button></div>
       <div class="col" style="gap:4px"><h2 class="h3" style="margin:0">You have a first, rough estimate</h2><span class="muted">It’s rough for now, and it firms up as you watch. You never need to finish an episode for this to work.</span></div>
       <div class="stats three">${tile('Lookups',sig.lookups+' word'+(sig.lookups===1?'':'s'),'in '+mins+' minute'+(mins===1?'':'s'))}${tile('Replays',sig.replays+' line'+(sig.replays===1?'':'s'),sig.replays?'heard again':'none')}${tile('Estimate','Rough','firms up as you watch')}</div>
       <div class="box col"><b>${ic('spark')} Next time: help stays generous</b><span>With a rough estimate we keep more help on rather than guess low: it’s safer to give a little too much help than too little.</span></div>
       <div class="row wr"><button class="btn primary" id="rResume">Resume at ${fmt(t)} ${ic('play')}</button><button class="btn" id="rShort">Try a shorter show</button><div class="spacer"></div><button class="btn ghost small" id="rDone">Done for today</button></div>${wordsList}`;
      bind=()=>{$('rResume').onclick=()=>{$('result').classList.add('hidden');sig.ended=false;if(P.time()>=(data.end||1e9)-1)P.seek(data.start||0);runLoop();P.play();};$('rShort').onclick=()=>{app.discover.fit=['easy'];saveApp();toast('Only Kissaten no Yoru plays in this prototype — the others are previews.',4000);go('discover');};$('rDone').onclick=()=>go('setup');};
    }
  }else{            // 11 · episode-end summary
    const ep=isP?PLAN.ep:1,prev=isP?[76,80]:[],pts=[...prev,followed],X=i=>40+i*(220/Math.max(1,pts.length-1)),Y=v=>90-(Math.max(60,Math.min(100,v))-60)*1.6;
    const less=sig.lookups/Math.max(1,mins)<1.5,due=dueCards().length;
    html=`<div class="row"><div class="col" style="gap:2px"><span class="eyebrow">${finished?(isP?'Episode '+ep+' done':'Clip done'):'Stopped at '+fmt(t)}</span><h3>${esc(isP?'Kissaten no Yoru':data.title)}</h3></div><div class="spacer"></div><button class="btn ghost small" id="rX" aria-label="Close">${ic('x')}</button></div>
     <div class="row wr" style="gap:24px;align-items:center"><div class="col" style="gap:2px"><span class="big-num">${enough?followed+'%':'—'}</span><b>${enough?`of this ${isP?'episode':'clip'} you followed`:'Watch a few more lines for a score'}</b>${prev.length&&enough?`<span class="small good">${followed>=prev[0]?'+':''}${followed-prev[0]} points since episode 1</span>`:''}</div><div class="spacer"></div>
      ${pts.length>1&&enough?`<svg class="sum-chart" viewBox="0 0 300 120" role="img" aria-label="Followed by episode: ${pts.join('%, ')}%"><line x1="20" x2="290" y1="${Y(90)}" y2="${Y(90)}" class="ref"/><text x="290" y="${Y(90)-6}" text-anchor="end" class="tick">90% · comfortable</text><polyline points="${pts.map((v,i)=>X(i)+','+Y(v)).join(' ')}" class="ln"/>${pts.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="4" class="${i===pts.length-1?'':'hollow'}"/><text x="${X(i)}" y="${Y(v)+(i===pts.length-1?-10:18)}" text-anchor="middle" class="val">${v}%</text><text x="${X(i)}" y="116" text-anchor="middle" class="tick">Ep ${i+1}</text>`).join('')}</svg>`:''}</div>
     <div class="stats three">${tile('Looked up',sig.lookups+' word'+(sig.lookups===1?'':'s'),sig.replays+' replays')}${tile('Saved',sig.saved+' card'+(sig.saved===1?'':'s'),'due from tomorrow')}${tile('Watched',fmt(sig.watched),'help on '+[...sig.helped].length+' lines · paused '+sig.pauses+'×')}</div>
     <div class="box col"><b>${ic('spark')} Next episode: ${less?'a little less help':'same help'}</b><span>${less?'English only on lines with 2+ new words — you looked up few words this time.':'You looked up a fair number of words, so help stays where it is.'}</span><div class="row"><button class="link small" id="rKeep">Keep current help</button></div></div>
     <div class="row wr">${isP?`<button class="btn primary" id="rPrime">Prime episode ${ep+1}${nPrime?' · '+nPrime+' words':''} ${ic('spark')}</button>`:`<button class="btn primary" id="rAgain">Watch again ${ic('play')}</button>`}<button class="btn" id="rReview">Review ${due} card${due===1?'':'s'}</button>${finished?'':`<button class="btn" id="rResume">Resume ${ic('play')}</button>`}<div class="spacer"></div><button class="link small" id="rHome">Back to Today</button></div>${wordsList}`;
    bind=()=>{if($('rPrime'))$('rPrime').onclick=()=>go('prime');if($('rAgain'))$('rAgain').onclick=()=>{$('result').classList.add('hidden');startPlayer();};$('rReview').onclick=()=>go('review');$('rHome').onclick=()=>go(app.onboarded?'today':'start');
      $('rKeep').onclick=()=>toast('Help stays as it is for the next episode.',2500);if($('rResume'))$('rResume').onclick=()=>{$('result').classList.add('hidden');sig.ended=false;runLoop();P.play();};};
  }
  $('resultBody').innerHTML=html;$('result').classList.remove('hidden');$('result').onclick=null;
  $('rX').onclick=()=>$('result').classList.add('hidden');bind();}

/* ============================== word library ============================== */
let wFilter='all',wBack='home';
function goWords(back){wBack=back||'home';show('words');renderWords();}
function renderWords(){
  const k=counts();const F=[['all','All',Object.keys(words).length],['unknown','New',k.unknown],['learning','Practising',k.learning],['known','Known',k.known],['ignored','Ignored',k.ignored]];
  $('wFilter').innerHTML=F.map(([v,l,n])=>`<button class="${wFilter===v?'on':''}" data-v="${v}">${l} ${n}</button>`).join('');
  $('wFilter').querySelectorAll('button').forEach(b=>b.onclick=()=>{wFilter=b.dataset.v;renderWords();});
  const q=$('wSearch').value.trim().toLowerCase();
  const list=Object.entries(words).filter(([w,v])=>(wFilter==='all'||v.st===wFilter)&&(!q||w.includes(q)||(glossOf(w,w)||'').toLowerCase().includes(q))).sort((a,b)=>(b[1].seen||0)-(a[1].seen||0));
  $('wTable').innerHTML=list.length?list.map(([w,v])=>`<div class="wrow"><div class="col" style="gap:0"><span class="w">${esc(w)}</span><span class="small subtle">seen ${v.seen||1}×</span></div>
     <div class="col" style="gap:2px"><span>${esc(glossOf(w,w))||'<span class="subtle small">no meaning yet</span>'}</span>${v.ctx?`<span class="ctx">${esc(v.ctx.jp)}</span>`:''}</div>
     <div><span class="chip ${v.st==='unknown'?'new':v.st}">${v.st==='unknown'?'new':v.st==='learning'?'🔥 practising':v.st}</span></div>
     <div class="seg" data-w="${esc(w)}">${[['unknown','New'],['learning','Practise'],['known','Known'],['ignored','Ignore']].map(([s,l])=>`<button class="${v.st===s?'on':''}" data-s="${s}">${l}</button>`).join('')}<button title="Hear it" data-say="1">🔊</button></div></div>`).join('')
   :'<div class="box muted">No words here yet. Watch a clip — every word you meet lands in your library.</div>';
  $('wTable').querySelectorAll('.seg').forEach(seg=>seg.querySelectorAll('button').forEach(b=>b.onclick=()=>{const w=seg.dataset.w;if(b.dataset.say){speak(w,.8);return;}words[w].st=b.dataset.s;save();renderWords();}));}

/* ============================== your clip (setup) ============================== */
function goHome(){go(app.onboarded?'today':'start');}
function goSetup(){selected='mine';data=mine;fillSetup();show('setup');}
function fillSetup(){
  $('ytUrl').value=mine.videoId?'https://www.youtube.com/watch?v='+mine.videoId+(mine.listId?'&list='+mine.listId:''):(mine.listId?'https://www.youtube.com/playlist?list='+mine.listId:'');
  $('listIdx').value=(mine.listIndex||0)+1;$('titleIn').value=mine.title||'';$('startIn').value=fmt(mine.start||0);$('endIn').value=fmt(mine.end||120);
  $('creditIn').value=mine.credit||'';$('jpIn').value=mine.lines.map(l=>l.jp).join('\n');$('enIn').value=mine.lines.map(l=>l.en||'').join('\n');$('jsonIn').value=JSON.stringify(mine,null,1);
  $('setupStatus').innerHTML=mine.lines.length?`${mine.lines.length} lines ready.`:'No subtitles yet — generate them with AI above.';
  $('setupPlay').disabled=!mine.lines.length;}
function readClipFields(){
  const u=parseYT($('ytUrl').value);if($('ytUrl').value.trim()&&!u.videoId&&!u.listId){$('setupStatus').innerHTML='<span class="err">That doesn’t look like a YouTube link.</span>';return false;}
  const idx=Math.max(0,(+$('listIdx').value||1)-1);
  if(u.videoId!==mine.videoId||u.listId!==mine.listId||idx!==mine.listIndex){mine.videoId=u.videoId;mine.listId=u.listId;mine.listIndex=idx;}
  mine.title=$('titleIn').value.trim()||'Your clip';mine.start=parseTime($('startIn').value)??0;mine.end=parseTime($('endIn').value)??mine.start+120;save();return true;}
function readLines(){
  const jp=$('jpIn').value.split('\n').map(s=>s.trim()).filter(Boolean),en=$('enIn').value.split('\n').map(s=>s.trim());
  const old=mine.lines;mine.lines=jp.map((j,i)=>({t:old[i]?old[i].t:mine.start+i*4,e:old[i]&&old[i].jp===j?old[i].e:undefined,jp:j,en:en[i]||''}));
  tokCache.clear();save();fillSetup();}
function parseSubs(text){const out=[];text=text.replace(/\r/g,'');let prevLines=[];
  for(const block of text.split(/\n\s*\n/)){const m=block.match(/(\d{1,2}:)?(\d{1,2}):(\d{2})[.,](\d{1,3})\s*-->\s*(\d{1,2}:)?(\d{1,2}):(\d{2})[.,](\d{1,3})/);if(!m)continue;
    const ts=(h,mm,ss,ms)=>(h?parseInt(h)*3600:0)+parseInt(mm)*60+parseInt(ss)+parseInt(ms.padEnd(3,'0'))/1000;
    const t=ts(m[1],m[2],m[3],m[4]),e=ts(m[5],m[6],m[7],m[8]);
    const bl=block.split('\n');let lines=bl.slice(bl.findIndex(l=>l.includes('-->'))+1).map(s=>s.replace(/<[^>]+>|\{[^}]+\}|&nbsp;/g,'').trim()).filter(Boolean);
    // YouTube auto-captions roll: each cue repeats the previous cue's last line. Keep only what's new.
    while(lines.length&&prevLines.includes(lines[0]))lines.shift();
    if(e-t<0.2||!lines.length){continue;}
    prevLines=lines;const body=lines.join(' ').trim();
    const last=out[out.length-1];if(last&&last.text===body){last.e=e;continue;}
    out.push({t,e,text:body});}
  return out;}
const isJaText=s=>/[぀-ヿ㐀-鿿]/.test(s);
function importCaptionFiles(files){
  readClipFields();const st=mine.start||0,en=mine.end||1e9;
  Promise.all([...files].map(f=>f.text().then(s=>({name:f.name,cues:parseSubs(s)})))).then(res=>{
    let ja=null,eng=null;
    for(const r of res){if(!r.cues.length)continue;const jaShare=r.cues.filter(c=>isJaText(c.text)).length/r.cues.length;
      if(jaShare>0.5)ja=r;else eng=r;}
    if(!ja&&!eng){$('setupStatus').innerHTML='<span class="err">No caption lines found in those files.</span>';return;}
    const inClip=c=>c.t>=st-0.5&&c.t<=en;
    if(ja){const L=[];for(const c of ja.cues.filter(inClip)){const jp=c.text.replace(/[ 　]+/g,''),p=L[L.length-1];
        // auto-captions cut sentences mid-way: join short fragments that follow each other closely
        if(p&&c.t-p.e<0.4&&(p.jp+jp).length<=22&&!/[。？！?!]$/.test(p.jp)){p.jp+=jp;p.e=c.e;}else L.push({t:c.t,e:c.e,jp,en:''});}
      mine.lines=L;}
    if(eng&&mine.lines.length){const E=eng.cues.filter(c=>c.t>=st-2&&c.t<=en+2);
      for(const L of mine.lines){const ov=E.filter(c=>Math.min(c.e,L.e||L.t+4)-Math.max(c.t,L.t)>0.3).map(c=>c.text);L.en=[...new Set(ov)].join(' ');}}
    const fromYT=res.some(r=>/\[[\w-]{11}\]/.test(r.name));
    if(!$('creditIn').value.trim())$('creditIn').value=fromYT?'Subtitles: YouTube captions':'Subtitles: imported caption files';
    mine.credit=$('creditIn').value.trim();tokCache.clear();save();fillSetup();
    $('setupStatus').textContent=ja?`Imported ${mine.lines.length} Japanese lines${eng?' with English':''} inside your clip.`:(mine.lines.length?'Matched English to your existing lines.':'Only English found — import the Japanese captions too.');
  });}

/* ============================== AI subtitles (Whisper in the browser) ============================== */
const AI_STEPS=['Share this tab’s sound','Play the clip once and listen','Load the speech model','Write the Japanese lines','Translate them to English'];
function aiStep(n,msg,done){$('aiSteps').innerHTML=AI_STEPS.map((s,i)=>`<div class="${i<n||done?'done':i===n?'now':''}">${i<n||done?'✓':i===n?'●':'○'} ${s}</div>`).join('');if(msg!=null)$('aiStatus').innerHTML=msg;}
function aiProg(p){const b=$('aiProg');if(p==null){b.classList.add('hidden');return;}b.classList.remove('hidden');b.firstElementChild.style.width=Math.round(p*100)+'%';}
let asrPipe=null,asrModel='';
async function generateSubs(){
  if(!readClipFields())return;if(!mine.videoId&&!mine.listId){$('aiStatus').innerHTML='<span class="err">Add a YouTube link first.</span>';return;}
  const span=(mine.end||120)-(mine.start||0);if(span>300&&!confirm(`That clip is ${fmt(span)} long. Listening takes the same time. Continue?`))return;
  $('aiGo').disabled=true;
  try{
    // 1 — tab audio
    aiStep(0,'Chrome will ask what to share: pick <b>this tab</b> and switch on <b>“Also share tab audio”</b>.');
    let stream;try{stream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true,preferCurrentTab:true,selfBrowserSurface:'include',systemAudio:'include'});}catch(e){throw new Error('Sharing was cancelled. Press Generate again and share this tab with its audio.');}
    const at=stream.getAudioTracks();if(!at.length){stream.getTracks().forEach(t=>t.stop());throw new Error('No sound was shared. Pick this tab and switch on “Also share tab audio”.');}
    stream.getVideoTracks().forEach(t=>t.stop());const audioStream=new MediaStream(at);
    // 2 — play once and record
    aiStep(1,`Playing your clip (${fmt(span)}). Keep this tab open — sound can stay on.`);
    show('timing');$('tTitle').textContent='Listening to your clip…';$('tHelp').textContent='The AI is listening. This takes as long as the clip.';$('tButtons').classList.add('hidden');$('tDoneRow').classList.add('hidden');$('tLines').innerHTML='<div class="subtle">Lines appear here when it’s done.</div>';
    $('ytTiming').replaceWith(Object.assign(document.createElement('div'),{id:'ytTiming',style:'position:absolute;inset:0;width:100%;height:100%'}));
    const player=await new Promise(res=>makePlayer('ytTiming',mine,res));
    if(player.videoId){const id=player.videoId();if(id){mine.videoId=id;save();}}
    player.seek(mine.start||0);await new Promise(r=>setTimeout(r,800));
    const rec=new MediaRecorder(audioStream);const chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
    player.play();await new Promise(r=>{const w=setInterval(()=>{if(player.playing()){clearInterval(w);r();}},50);});
    const recStartVideoT=player.time();rec.start(1000);
    await new Promise(r=>{const w=setInterval(()=>{const t=player.time();$('tStatus').textContent=`Listening · ${fmt(t-(mine.start||0))} / ${fmt(span)}`;if(t>=mine.end){clearInterval(w);r();}},250);});
    player.pause();rec.stop();await new Promise(r=>rec.onstop=r);at.forEach(t=>t.stop());player.destroy();
    show('setup');
    // decode to 16 kHz mono
    const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});const ab=await blob.arrayBuffer();
    const ctx=new (window.AudioContext||window.webkitAudioContext)({sampleRate:16000});const buf=await ctx.decodeAudioData(ab);
    let audio=buf.getChannelData(0);if(buf.numberOfChannels>1){const b=buf.getChannelData(1);const m=new Float32Array(audio.length);for(let i=0;i<m.length;i++)m[i]=(audio[i]+b[i])/2;audio=m;}
    // 3 — model
    const model=$('aiModel').value;aiStep(2,'Loading the speech model — first time only, this can take a few minutes.');aiProg(0);
    const tf=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2');
    if(!asrPipe||asrModel!==model){const files={};asrPipe=await tf.pipeline('automatic-speech-recognition',model,{device:navigator.gpu?'webgpu':'wasm',dtype:navigator.gpu?{encoder_model:'fp32',decoder_model_merged:'q4'}:'q8',
      progress_callback:p=>{if(p.status==='progress'&&p.total){files[p.file]=[p.loaded,p.total];const L=Object.values(files).reduce((a,b)=>a+b[0],0),T=Object.values(files).reduce((a,b)=>a+b[1],0);aiProg(L/T);}}});asrModel=model;}
    // 4 — Japanese
    aiStep(3,'Writing the Japanese lines…');aiProg(null);
    const ja=await asrPipe(audio,{language:'japanese',task:'transcribe',return_timestamps:true,chunk_length_s:30,stride_length_s:5});
    // 5 — English
    aiStep(4,'Translating to English…');
    const en=await asrPipe(audio,{language:'japanese',task:'translate',return_timestamps:true,chunk_length_s:30,stride_length_s:5});
    const off=recStartVideoT;
    const jaC=(ja.chunks||[]).map((c,i,a)=>({t:off+(c.timestamp[0]??0),e:off+(c.timestamp[1]??(a[i+1]?a[i+1].timestamp[0]:c.timestamp[0]+4)),jp:c.text.trim()})).filter(c=>c.jp&&!/^[♪\s。、…]+$/.test(c.jp));
    const enC=(en.chunks||[]).map(c=>({t:off+(c.timestamp[0]??0),e:off+(c.timestamp[1]??c.timestamp[0]+4),en:c.text.trim()}));
    for(const L of jaC){const ov=enC.filter(E=>Math.min(E.e,L.e)-Math.max(E.t,L.t)>0.3).map(E=>E.en);L.en=[...new Set(ov)].join(' ');}
    if(!jaC.length)throw new Error('No speech was found. Check the clip has Japanese audio and the tab sound was shared.');
    mine.lines=jaC;mine.gen={model,at:new Date().toISOString()};mine.credit='Subtitles: generated by AI (Whisper) — may contain mistakes';tokCache.clear();save();fillSetup();
    aiStep(5,`✓ Done — ${jaC.length} lines with English. AI subtitles can mishear names or fast speech; you can fix any line under “Other ways to add lines”.`,true);
  }catch(err){show('setup');aiStep(-1,'');$('aiStatus').innerHTML='<span class="err">'+esc(err.message||String(err))+'</span>';aiProg(null);}
  finally{$('aiGo').disabled=false;$('tButtons').classList.remove('hidden');$('tDoneRow').classList.remove('hidden');}}

/* ============================== manual timing ============================== */
let TP=null,tMarks=[],tBreaks=[],tLoop=null;
function startTiming(){readClipFields();readLines();if(!mine.videoId&&!mine.listId){$('setupStatus').innerHTML='<span class="err">Add a YouTube link first.</span>';return;}if(!mine.lines.length){$('setupStatus').innerHTML='<span class="err">Paste the Japanese lines first.</span>';return;}
  show('timing');$('tTitle').textContent='Press Space the moment each line starts';$('tHelp').textContent='Space = this line starts now · B = scene break · Backspace = undo';tMarks=[];tBreaks=[];renderTLines();
  $('ytTiming').replaceWith(Object.assign(document.createElement('div'),{id:'ytTiming',style:'position:absolute;inset:0;width:100%;height:100%'}));
  makePlayer('ytTiming',mine,p=>{TP=p;p.seek(mine.start||0);});
  clearInterval(tLoop);tLoop=setInterval(()=>{if(TP)$('tStatus').textContent=fmt(TP.time())+' · '+tMarks.length+' of '+mine.lines.length+' lines timed';},200);}
function renderTLines(){const box=$('tLines');box.innerHTML=mine.lines.map((l,i)=>`<div class="${i===tMarks.length?'cur':''}"><span class="t">${tMarks[i]!=null?fmt(tMarks[i]):'—'}</span><span>${esc(plain(l.jp))}</span></div>`).join('');const cur=box.querySelector('.cur');if(cur)cur.scrollIntoView({block:'nearest'});}
function tMark(){if(!TP||tMarks.length>=mine.lines.length)return;tMarks.push(+TP.time().toFixed(2));renderTLines();}
function tBreak(){if(TP)tBreaks.push(+TP.time().toFixed(2));$('tStatus').textContent='Scene break marked';}
function tDone(){tMarks.forEach((t,i)=>{mine.lines[i].t=t;delete mine.lines[i].e;});mine.breaks=tBreaks;if(TP){TP.destroy();TP=null;}clearInterval(tLoop);save();tokCache.clear();goSetup();$('setupStatus').textContent=`Saved ${tMarks.length} timings.`;}

/* ============================== wiring ============================== */
$('backLib').onclick=()=>{if(obMode&&!sig.ended){endSession(false);return;}go(app.onboarded?'today':'start');};
$('wordsBack').onclick=()=>go('learn');$('wSearch').oninput=renderWords;
$('wordsReset').onclick=()=>{if(confirm('Forget every word in your library?')){words={};save();renderWords();}};
$('endBtn').onclick=()=>endSession(false);
$('lessHelp').onclick=()=>setHelp(help-1,'button');$('moreHelp').onclick=()=>setHelp(help+1,'button');
$('settingsBtn').onclick=()=>{$('settingsBtn').classList.contains('on')?panelClose():openSettings()};$('modeBtn').onclick=openSettings;$('dictBtn').onclick=()=>{$('dictBtn').classList.contains('on')?panelClose():openDict()};
$('ptabs').onclick=e=>{const tb=e.target.closest('[data-tab]');if(tb){sideTab=tb.dataset.tab;renderSide();return;}const bmk=e.target.closest('[data-bm]');if(bmk){const k=data.id,i=+bmk.dataset.bm,a=app.bookmarks[k]||(app.bookmarks[k]=[]);a.includes(i)?a.splice(a.indexOf(i),1):a.push(i);saveApp();renderSide();return;}const li=e.target.closest('[data-li]');if(li)seekLine(+li.dataset.li);};
$('howBtn').onclick=()=>{$('howBtn').classList.contains('on')?panelClose():howItWorks()};$('speedBtn').onclick=()=>setRate(settings.rate===1?.75:1);
$('clickcatch').onclick=()=>{if(coachActive)return;if(!$('popup').classList.contains('hidden'))return closePopup();if(turnLine>=0)return;if(P)P.playing()?P.pause():P.play();};
$('playPause').onclick=()=>{if(coachActive)return;if(turnLine>=0)return continueTurn();if(P)P.playing()?P.pause():P.play();};
$('turnGo').onclick=()=>{if(!coachActive)continueTurn();};$('turnReplay').onclick=replay;
$('track').onclick=e=>{if(!P)return;turnLine=-1;$('turn').classList.add('hidden');const r=e.currentTarget.getBoundingClientRect(),s=data.start||0,en=data.end||P.duration();P.seek(s+(e.clientX-r.left)/r.width*(en-s));};
$('prevLine').onclick=()=>lineStep(-1);$('nextLine').onclick=()=>lineStep(1);$('replayLine').onclick=replay;
$('showEn').onclick=()=>{if(curLine<0)return;enRevealed.add(curLine);sig.helped.add(curLine);renderLine(curLine,true);};
$('setupBack').onclick=()=>{readClipFields();go(app.onboarded?'discover':'start');};$('saveSetup').onclick=()=>{readClipFields();readLines();$('setupStatus').textContent='Saved.';};$('toTiming').onclick=startTiming;
$('setupPlay').onclick=()=>{readClipFields();go('play/mine');};
$('aiGo').onclick=generateSubs;
$('subFile').onchange=e=>{if(e.target.files.length)importCaptionFiles(e.target.files);e.target.value='';};
$('capFiles').onchange=e=>{if(e.target.files.length)importCaptionFiles(e.target.files);e.target.value='';};
$('creditIn').oninput=e=>{mine.credit=e.target.value.trim();save();};
$('exportBtn').onclick=()=>{readClipFields();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({mine,words},null,1)],{type:'application/json'}));a.download='immerlingo-clip.json';a.click();};
$('importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(s=>{try{const o=JSON.parse(s);mine=Object.assign(JSON.parse(JSON.stringify(MINE_DEFAULT)),o.mine||o);if(o.words)words=o.words;data=mine;tokCache.clear();save();fillSetup();$('setupStatus').textContent='Imported.';}catch(err){$('setupStatus').innerHTML='<span class="err">Not a valid clip file.</span>';}});};
$('applyJson').onclick=()=>{try{mine=JSON.parse($('jsonIn').value);data=mine;tokCache.clear();save();fillSetup();$('setupStatus').textContent='JSON applied.';}catch(e){$('setupStatus').innerHTML='<span class="err">JSON error: '+esc(e.message)+'</span>';}};
$('timingBack').onclick=()=>{if(TP){TP.destroy();TP=null;}clearInterval(tLoop);goSetup();};
$('tPlay').onclick=()=>{if(TP)TP.playing()?TP.pause():TP.play();};$('tMark').onclick=tMark;$('tBreak').onclick=tBreak;$('tUndo').onclick=()=>{tMarks.pop();renderTLines();};$('tDone').onclick=tDone;
document.addEventListener('keydown',e=>{
  if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if(!$('timing').classList.contains('hidden')){if(!TP)return;if(e.code==='Space'){e.preventDefault();tMark();}else if(e.key==='b'||e.key==='B')tBreak();else if(e.key==='Backspace'){e.preventDefault();tMarks.pop();renderTLines();}return;}
  if($('player').classList.contains('hidden')||coachActive)return;
  if(e.code==='Space'||e.key==='Enter'){e.preventDefault();if(turnLine>=0)continueTurn();else if(P)P.playing()?P.pause():P.play();}
  else if(e.key==='r'||e.key==='R')replay();else if(e.key==='a'||e.key==='A')lineStep(-1);else if(e.key==='d'||e.key==='D')lineStep(1);
  else if(e.key==='e'||e.key==='E')$('showEn').click();else if(e.key==='Escape'){if(!$('popup').classList.contains('hidden'))closePopup();else panelClose();}
});
try{speechSynthesis.getVoices();}catch(e){}

