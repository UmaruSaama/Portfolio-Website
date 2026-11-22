"use strict";
/* Sample content for every screen outside the player. All titles, text and numbers are invented for this prototype.
   Tokens use the same format as content.js: words separated by spaces, kanji reading in [brackets], dictionary form in {braces}. */

/* Fit bands — share of a title's words you know (Figma: Fit badge 883:97) */
const FIT = [
  { key: 'easy',    label: 'Easy',    range: '91+',   min: 91 },
  { key: 'ideal',   label: 'Ideal',   range: '85–90', min: 85 },
  { key: 'stretch', label: 'Stretch', range: '78–84', min: 78 },
  { key: 'hard',    label: 'Hard',    range: '<78',   min: 0 }
];
const fitOf = pct => FIT.find(f => pct >= f.min).key;

/* The library. `play` says what the player loads: 'practice' (built-in scene) or 'mine' (your YouTube clip). Others are preview only. */
const SHOWS = [
  { id: 'kissaten', title: 'Kissaten no Yoru', jp: '喫茶店の夜', en: 'Night at the Café', medium: 'anime', fit: 82, level: 'L2', jlpt: 'N4', subs: 'JP / EN subs',
    genre: 'Slice of life · Iyashikei', eps: 24, seasons: 2, epMin: 24, year: 2024, studio: 'Fictional Studio', source: 'Original', grad: ['#5b2a5e', '#d65a6c'], play: 'practice',
    desc: 'An old café in a quiet Tokyo neighbourhood is about to close after forty years. Its owner and the regulars who still come each evening try to keep it open — one cup at a time.',
    words: { known: 1840, learning: 120, unknown: 280, ignored: 12 }, sentences: { all: 41, one: 32, more: 27 },
    epFit: [76, 80, 82, 79, 74, 81, 83, 78, 85, 80, 77, 84] },
  { id: 'bento', title: 'Bentō Days', jp: '弁当デイズ', medium: 'anime', fit: 89, level: 'L2', jlpt: 'N4', subs: 'JP / EN subs', genre: 'Food', eps: 12, epMin: 12, grad: ['#5a1f12', '#f08a3c'] },
  { id: 'mori', title: 'Mori no Yūbin', jp: '森の郵便', medium: 'anime', fit: 86, level: 'L2', jlpt: 'N4', subs: 'JP / EN subs', genre: 'Fantasy', eps: 13, epMin: 11, grad: ['#123a2a', '#5aa070'] },
  { id: 'sakamichi', title: 'Sakamichi Radio', jp: '坂道ラジオ', medium: 'anime', fit: 86, level: 'L2', jlpt: 'N4', subs: 'JP / EN subs', genre: 'Comedy', eps: 13, epMin: 22, grad: ['#2e1a52', '#8a55c4'] },
  { id: 'ame', title: 'Ame no Hi Bakery', jp: '雨の日ベーカリー', medium: 'anime', fit: 88, level: 'L2', jlpt: 'N4', subs: 'JP / EN subs', genre: 'Slice of life', eps: 12, epMin: 23, grad: ['#163460', '#3a86bf'] },
  { id: 'hoshi', title: 'Hoshi no Ekiben', jp: '星の駅弁', medium: 'anime', fit: 87, level: 'L2', jlpt: 'N4', subs: 'JP subs', genre: 'Travel · Food', eps: 10, epMin: 22, grad: ['#4a1c10', '#e08a3a'] },
  { id: 'neko', title: 'Kōen no Neko', jp: '公園の猫', medium: 'anime', fit: 90, level: 'L1', jlpt: 'N5', subs: 'JP / EN subs', genre: 'Iyashikei', eps: 12, epMin: 12, grad: ['#123a28', '#4f9a6a'] },
  { id: 'natsu', title: 'Natsu no Owari', jp: '夏の終わり', medium: 'anime', fit: 85, level: 'L3', jlpt: 'N3', subs: 'JP subs', genre: 'Drama', eps: 11, epMin: 24, grad: ['#4a1c3a', '#d05a78'] },
  { id: 'ohayo', title: 'Ohayō Kitchen', jp: 'おはようキッチン', medium: 'anime', fit: 94, level: 'L1', jlpt: 'N5', subs: 'JP / EN subs', genre: 'Cooking', eps: 24, epMin: 8, grad: ['#3a2a10', '#c89a3a'] },
  { id: 'densha', title: 'Densha de Go Home', jp: '電車でゴーホーム', medium: 'anime', fit: 92, level: 'L1', jlpt: 'N5', subs: 'JP / EN subs', genre: 'Comedy', eps: 12, epMin: 11, grad: ['#102a40', '#3a7ab0'] },
  { id: 'hanabi', title: 'Hanabi Street', jp: '花火通り', medium: 'manga', fit: 88, level: 'L2', jlpt: 'N4', subs: 'Furigana', genre: 'Slice of life', eps: 24, unit: 'chapters', grad: ['#3a1030', '#c04a7a'], open: 'manga' },
  { id: 'tsuki', title: 'Tsuki no Yado', jp: '月の宿', medium: 'novel', fit: 79, level: 'L3', jlpt: 'N3', subs: 'Furigana on tap', genre: 'Web novel · Quiet', eps: 18, unit: 'chapters', grad: ['#141a40', '#5a62b0'], open: 'read' },
  { id: 'lunchbox', title: 'Tokyo Lunchbox', jp: '東京ランチボックス', medium: 'jdrama', fit: 91, level: 'L2', jlpt: 'N4', subs: 'JP / EN subs', genre: 'Food · Work', eps: 10, epMin: 45, grad: ['#40200a', '#b0702a'] },
  { id: 'chill', title: 'Nihongo Chill', jp: '日本語チル', medium: 'podcast', fit: 93, level: 'L1', jlpt: 'N5', subs: 'Transcript', genre: 'Learner podcast', eps: 40, epMin: 15, grad: ['#102a2a', '#3a9a90'] },
  { id: 'shorts', title: 'Machi Aruki', jp: '街あるき', medium: 'short', fit: 90, level: 'L1', jlpt: 'N5', subs: 'JP / EN subs', genre: 'City walks', eps: 60, epMin: 3, grad: ['#2a2a10', '#9a9a3a'] }
];
const showById = id => SHOWS.find(s => s.id === id);

/* The sample learner on day 30 — used by Today, Learn and Stats once onboarding is done */
const PERSONA = {
  initials: 'SK', helpLevel: 'Bridge', known: 2398, knownWeek: 56,
  minutesWeek: 62, minutesDelta: 14, activeDays: 4, goal: 20,
  week: [['T', 14], ['W', 0], ['T', 22], ['F', 0], ['S', 11], ['S', 0], ['M', 20]],
  due: 12, dueWeek: [['Today', 12], ['T', 8], ['W', 9], ['T', 5], ['F', 11], ['S', 7], ['S', 6]],
  reviewsWeek: [['S', 14], ['M', 18], ['T', 9], ['W', 16], ['T', 12], ['F', 17]], reviewsTotal: 86, remembered: 87,
  month: { known: 2398, knownDelta: 212, minutes: 268, minutesDelta: 40, saved: 214, savedFrom: 9, remembered: 87 },
  knownSeries: [1622, 1680, 1745, 1801, 1850, 1932, 1998, 2062, 2150, 2228, 2305, 2398],
  calendar: [ // 0 none · 1 studied · 2 missed · 3 today · null outside month
    [null, null, null, 1, 1, 1, 0], [2, 1, 1, 1, 1, 1, 2], [3, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, null, null]]
};

const PLAN = { show: 'kissaten', ep: 3, prime: 4, watch: 12, review: 4, stopAt: '12:10' };

const LATER = [
  { show: 'hanabi', icon: 'book', sub: 'Manga · chapter 12, page 8 of 24', fit: 88, prog: .33, left: '16 pages left' },
  { show: 'tsuki', icon: 'book', sub: 'Web novel · chapter 4', fit: 79, prog: .4, left: '~14 min left' },
  { show: 'lunchbox', icon: 'play', sub: 'J-Drama · episode 2', fit: 91, prog: .6, left: '18 min left' },
  { show: 'chill', icon: 'mic', sub: 'Podcast · episode 21', fit: 93, prog: .2, left: '12 min left' },
  { show: null, title: 'Katakana', icon: 'layers', sub: 'Foundations · 12 of 46 characters', prog: .26, left: '~10 min a day', to: 'learn' }
];

const DECKS = [
  { id: 'mine', code: 'MC', name: 'My cards', due: 12, fresh: 7, note: '214 cards from your media' },
  { id: 'core', code: '2K', name: 'Core 2k / 6k', due: 0, fresh: 10, note: 'Frequency · premade' },
  { id: 'n5v', code: 'N5V', name: 'JLPT N5 Vocabulary', due: 4, fresh: 0, note: 'Exam prep · premade' },
  { id: 'n5k', code: 'N5K', name: 'JLPT N5 Kanji', due: 0, fresh: 5, note: 'Exam prep · premade' },
  { id: 'gr', code: 'GR', name: 'Grammar points', due: 2, fresh: 1, note: 'From “Explain this line”' }
];
const FOUNDATIONS = [
  { glyph: 'あ', name: 'Hiragana', done: 46, of: 46 },
  { glyph: 'ア', name: 'Katakana', done: 12, of: 46 },
  { glyph: '文', name: 'Grammar basics', pct: 70 },
  { glyph: '漢', name: 'Kanji level 1', done: 70, of: 100 },
  { glyph: '漢', name: 'Kanji level 2', done: 30, of: 100 }
];

const MILESTONES = [
  { done: true, title: 'First episode with no English', sub: 'Kissaten no Yoru · Ep 3' },
  { done: true, title: 'Finish a novel chapter at 80%+', sub: 'Tsuki no Yado · Ch 3' },
  { done: false, title: '100 words saved from manga', sub: '64 of 100', prog: .64 }
];
const FELT = [
  { medium: 'Anime', icon: 'play', meta: '18 h · 22 episodes', count: '6 watched · 3 planned', split: [14, 22, 22, 11, 31], latest: 'Kissaten no Yoru · Ep 3 · 84% followed' },
  { medium: 'Manga', icon: 'book', meta: '41 chapters · 3 volumes', count: '4 read · 2 planned', split: [0, 34, 17, 17, 32], latest: 'Hanabi Street · Ch 12 · 88% followed' }
];

/* Words the reader, manga and dictionary know about, on top of GLOSS in content.js */
const GLOSS_MORE = {
  '宿': 'inn', '窓': 'window', '大きな': 'big', '月': 'moon', '見える': 'to be visible, can see', '女将': 'landlady, proprietress (of an inn or restaurant)',
  '静か': 'quiet', 'お茶': 'tea', '入れる': 'to put in; to make (tea)', '今夜': 'tonight', '満月': 'full moon', '言う': 'to say', 'うなずく': 'to nod',
  '湯のみ': 'teacup', '両手': 'both hands', '持つ': 'to hold', '外': 'outside', '虫': 'insect', '鳴く': 'to chirp (insects), to sing (birds)', '遠く': 'far away',
  '川': 'river', '音': 'sound', '聞こえる': 'to be heard, can hear', '夜': 'night', '着く': 'to arrive', '駅': 'station', '歩く': 'to walk', '坂': 'slope, hill',
  '古い': 'old (things)', '部屋': 'room', '畳': 'tatami mat', '匂い': 'smell', 'する': 'to do', '布団': 'futon', '眠る': 'to sleep', '目': 'eye', '閉じる': 'to close (eyes, a book)',
  'いらっしゃい': 'welcome (casual)', '閉店': 'closing (of a shop, for the day or for good)', 'いいえ': 'no', '焼きそば': 'fried noodles', 'に': 'to, at (place or time)',
  'と': 'quotes what someone said', 'を': 'marks the object', 'で': 'with, by; at (where something happens)', 'て': 'and (links actions)', 'た': 'past ending',
  'も': 'also, too', 'ている': 'is …-ing', 'て いる': 'is …-ing', 'で': 'at; with', 'ます': 'polite verb ending', 'ない': 'not'
};

/* 12 · Read — Tsuki no Yado, chapter 4 (three short pages) */
const NOVEL = {
  show: 'tsuki', chapter: 4, title: 'Tsuki no Yado · Chapter 4',
  pages: [
    ['夜[よる] の 八時[はちじ] に 、 宿[やど] に 着[つ]いた{着く} 。',
     '駅[えき] から 坂[さか] を 歩[ある]いて{歩く} 、 二十分[にじゅっぷん] かかった{かかる} 。',
     '古[ふる]い{古い} 部屋[へや] は 、 畳[たたみ] の 匂[にお]い が した{する} 。'],
    ['宿[やど] の 窓[まど] から 、 大[おお]きな 月[つき] が 見[み]えた{見える} 。',
     '女将[おかみ] さん は 静[しず]か に お茶[ちゃ] を 入[い]れて{入れる} 、 「 今夜[こんや] は 満月[まんげつ] です よ 」 と 言[い]った{言う} 。',
     '私[わたし] は うなずいて{うなずく} 、 湯[ゆ]のみ を 両手[りょうて] で 持[も]った{持つ} 。',
     '外[そと] では 虫[むし] が 鳴[な]いて{鳴く} いて{いる} 、 遠[とお]く に 川[かわ] の 音[おと] も 聞[き]こえた{聞こえる} 。',
     '「 明日[あした] の 朝[あさ] は 、 早[はや]く{早い} 起[お]きて{起きる} ください ね 。 山[やま] が とても きれい です から 」'],
    ['布団[ふとん] に 入[はい]って{入る} 、 目[め] を 閉[と]じた{閉じる} 。',
     '川[かわ] の 音[おと] を 聞[き]き{聞く} ながら 、 すぐ に 眠[ねむ]った{眠る} 。']
  ]
};
Object.assign(GLOSS_MORE, { '入る': 'to enter, to get into', '聞く': 'to listen, to hear', 'ながら': 'while (doing)', 'すぐ': 'right away', 'かかる': 'to take (time)', '八時': 'eight o’clock', '二十分': 'twenty minutes', 'では': 'at, in (contrast)', 'いる': 'is …-ing (after て)' });

/* 13 · Read — Hanabi Street, chapter 12, page 8. Boxes are % of the page. */
const MANGA = {
  show: 'hanabi', chapter: 12, page: 8, pages: 24,
  panels: [{ x: 3, y: 3, w: 94, h: 44 }, { x: 3, y: 50, w: 46, h: 24 }, { x: 51, y: 50, w: 46, h: 24 }, { x: 3, y: 77, w: 94, h: 20 }],
  bubbles: [
    { n: 1, x: 78, y: 7, w: 12, h: 30, text: 'いらっしゃい ！', en: 'Welcome!' },
    { n: 2, x: 10, y: 8, w: 14, h: 32, text: 'もう 閉店[へいてん] です か ？', en: 'Are you closed already?' },
    { n: 3, x: 24, y: 52, w: 15, h: 21, text: 'いいえ 、 まだ です よ 。', en: 'No, not yet.' },
    { n: 4, x: 74, y: 78, w: 16, h: 18, text: 'じゃあ 、 焼[や]きそば 一[ひと]つ ！', en: 'Then one fried noodles!' }
  ]
};

/* 14 · Dictionary — entries with more than a one-line gloss */
const DICT = [
  { w: '待つ', r: 'まつ', ro: 'matsu', en: ['to wait (for)', 'to await, to look forward to', 'to depend on, to need'], tags: ['Godan verb', 'Transitive', 'JLPT N5', 'Very common'],
    forms: [['Polite · ます', '待ちます'], ['Te-form · て', '待って'], ['Past · た', '待った'], ['Negative · ない', '待たない']], formNote: 'Godan · う-verb',
    seen: [['ちょっと 待[ま]って ！', 'play', 'Kissaten no Yoru · Ep 2 · 12:40'], ['待[ま]ってた よ 。', 'book', 'Hanabi Street · Ch 9 · p 4'], ['楽[たの]しみ に 待[ま]って います 。', 'mic', 'Nihongo Chill · Ep 21 · 06:02']], seenOf: 41,
    kanji: { k: '待', m: 'wait', strokes: 9, jlpt: 'N4', also: '期待 (expectation) and 招待 (invitation)' } },
  { w: '祭り', r: 'まつり', ro: 'matsuri', en: ['festival'], tags: ['Noun', 'JLPT N4', 'Common'] },
  { w: '松', r: 'まつ', ro: 'matsu', en: ['pine tree'], tags: ['Noun', 'JLPT N1'] },
  { w: '末', r: 'まつ', ro: 'matsu', en: ['end (of a period)'], tags: ['Noun', 'JLPT N2'] },
  { w: '抹茶', r: 'まっちゃ', ro: 'matcha', en: ['matcha, powdered green tea'], tags: ['Noun', 'Common'] },
  { w: '睫毛', r: 'まつげ', ro: 'matsuge', en: ['eyelashes'], tags: ['Noun'] },
  { w: '閉める', r: 'しめる', ro: 'shimeru', en: ['to close, to shut', 'to tighten', 'to total (up)'], tags: ['Ichidan verb', 'Transitive', 'JLPT N3', 'Common in anime'],
    forms: [['Polite · ます', '閉めます'], ['Te-form · て', '閉めて'], ['Past · た', '閉めた'], ['Casual “already” · ちゃう', '閉めちゃった']], formNote: 'Ichidan · る-verb',
    seen: [['もう 店[みせ] 、 閉[し]めちゃった{閉める} の ？', 'play', 'Kissaten no Yoru · Ep 3 · 04:27']], seenOf: 6,
    kanji: { k: '閉', m: 'close', strokes: 11, jlpt: 'N3', also: '閉店 (closing a shop)' } },
  { w: '喫茶店', r: 'きっさてん', ro: 'kissaten', en: ['café — the old-style, sit-down kind', 'coffee shop'], tags: ['Noun', 'JLPT N4'],
    seen: [['この 喫茶店[きっさてん] 、 もう 四十年[よんじゅうねん] なん だ 。', 'play', 'Kissaten no Yoru · Ep 3 · 04:22']], seenOf: 9 },
  { w: '起きる', r: 'おきる', ro: 'okiru', en: ['to wake up, to get up', 'to happen'], tags: ['Ichidan verb', 'Intransitive', 'JLPT N5'],
    forms: [['Polite · ます', '起きます'], ['Te-form · て', '起きて'], ['Past · た', '起きた'], ['Negative · ない', '起きない']], formNote: 'Ichidan · る-verb' },
  { w: '女将', r: 'おかみ', ro: 'okami', en: ['landlady, proprietress (of an inn or restaurant)'], tags: ['Noun', 'JLPT N1', 'Common in novels'] },
  { w: '閉店', r: 'へいてん', ro: 'heiten', en: ['closing (of a shop, for the day or for good)'], tags: ['Noun', 'JLPT N2', 'Common in manga'] },
  { w: '満月', r: 'まんげつ', ro: 'mangetsu', en: ['full moon'], tags: ['Noun', 'JLPT N2'] }
];

/* Cards seeded for the Review screen (16) when you haven't saved any yet */
const SEED_CARDS = [
  { w: '閉める', r: 'しめる', def: 'to close, to shut', jp: 'もう 店[みせ] 、 閉[し]めちゃった{閉める} の ？', en: 'You’ve already closed the shop?', here: '閉めちゃった — closed it (already), with surprise', src: 'Kissaten no Yoru · Ep 3 · 04:27', line: 2 },
  { w: '喫茶店', r: 'きっさてん', def: 'café — the old-style, sit-down kind', jp: 'この 喫茶店[きっさてん] 、 もう 四十年[よんじゅうねん] なん だ 。', en: 'This café has been here forty years.', here: 'この喫茶店 — this café', src: 'Kissaten no Yoru · Ep 3 · 04:22', line: 1 },
  { w: '常連', r: 'じょうれん', def: 'regular customer', jp: '常連[じょうれん] さん だ ね 。', en: 'You’re a regular, huh.', here: '常連さん — a regular (polite)', src: 'Kissaten no Yoru · Ep 3 · 04:47', line: 6 },
  { w: '起きる', r: 'おきる', def: 'to wake up, get up', jp: '明日[あした] の 朝[あさ] は 、 早[はや]く{早い} 起[お]きて{起きる} ください ね 。', en: 'Get up early tomorrow morning, okay?', here: '起きて — get up (please)', src: 'Kissaten no Yoru · Ep 3 · 05:09', line: 7 },
  { w: '女将', r: 'おかみ', def: 'landlady (of an inn)', jp: '女将[おかみ] さん は 静[しず]か に お茶[ちゃ] を 入[い]れて{入れる} 。', en: 'The landlady quietly made tea.', here: '女将さん — the inn’s landlady, said politely', src: 'Tsuki no Yado · Ch 4 · p 2' },
  { w: '満月', r: 'まんげつ', def: 'full moon', jp: '今夜[こんや] は 満月[まんげつ] です よ 。', en: 'It’s a full moon tonight.', here: '満月 — full moon', src: 'Tsuki no Yado · Ch 4 · p 2' },
  { w: '湯のみ', r: 'ゆのみ', def: 'teacup', jp: '湯[ゆ]のみ を 両手[りょうて] で 持[も]った{持つ} 。', en: 'I held the teacup in both hands.', here: '湯のみ — a teacup without a handle', src: 'Tsuki no Yado · Ch 4 · p 2' },
  { w: '閉店', r: 'へいてん', def: 'closing (of a shop)', jp: 'もう 閉店[へいてん] です か ？', en: 'Are you closed already?', here: '閉店 — closing time', src: 'Hanabi Street · Ch 12 · p 8' },
  { w: 'かしこまる', r: 'かしこまる', def: 'certainly (very polite)', jp: 'かしこまりました{かしこまる} 。', en: 'Certainly.', here: 'かしこまりました — “certainly”, from staff', src: 'Kissaten no Yoru · Ep 3 · 04:44', line: 5 },
  { w: '鳴く', r: 'なく', def: 'to chirp (insects)', jp: '外[そと] では 虫[むし] が 鳴[な]いて{鳴く} いた 。', en: 'Outside, insects were chirping.', here: '鳴いていた — were chirping', src: 'Tsuki no Yado · Ch 4 · p 2' },
  { w: '早い', r: 'はやい', def: 'early, fast', jp: '明日[あした] の 朝[あさ] は 、 早[はや]く{早い} 起[お]きて{起きる} ください ね 。', en: 'Get up early tomorrow morning, okay?', here: '早く — early (describing 起きる)', src: 'Kissaten no Yoru · Ep 3 · 05:09', line: 7 },
  { w: 'きれい', r: 'きれい', def: 'beautiful; clean', jp: '山[やま] が とても きれい です から 。', en: 'Because the mountains are really beautiful.', here: 'きれい — beautiful', src: 'Kissaten no Yoru · Ep 3 · 05:16', line: 8 }
];

/* 06 · Prime — content words worth learning before the practice scene (in order of appearance) */
const PRIME_WORDS = [
  { w: '喫茶店', line: 1 }, { w: '四十年', line: 1 }, { w: '店', line: 2 }, { w: '閉める', line: 2 }, { w: 'まだ', line: 3 },
  { w: '一つ', line: 4 }, { w: 'かしこまる', line: 5 }, { w: '常連', line: 6 }, { w: '明日', line: 7 }, { w: '朝', line: 7 },
  { w: '早い', line: 7 }, { w: '起きる', line: 7 }, { w: '山', line: 8 }, { w: 'きれい', line: 8 }, { w: 'わかる', line: 9 }, { w: 'おやすみ', line: 9 }
];
