"use strict";
/* Scene content for the prototype. Pure data: edit lines, glossary and the default clip here.
   Line format: words separated by spaces; kanji reading in [brackets]; dictionary form in {braces}. */
const PRACTICE={id:'practice',tts:true,videoId:'',listId:'',listIndex:0,title:'Kissaten no Yoru',show:'kissaten',start:0,end:64,breaks:[37],
 lines:[
  {t:0.5,jp:'いらっしゃいませ 。',en:'Welcome.'},
  {t:4.5,jp:'この 喫茶店[きっさてん] 、 もう 四十年[よんじゅうねん] なん だ 。',en:'This café has been here forty years.'},
  {t:10,jp:'もう 店[みせ] 、 閉[し]めちゃった{閉める} の ？',en:'You’ve already closed the shop?'},
  {t:15,jp:'ううん 、 まだ だ よ 。',en:'No, not yet.'},
  {t:19.5,jp:'じゃあ 、 コーヒー 一[ひと]つ 。',en:'Then one coffee, please.'},
  {t:24,jp:'かしこまりました{かしこまる} 。',en:'Certainly.'},
  {t:29,jp:'常連[じょうれん] さん だ ね 。',en:'You’re a regular, huh.'},
  {t:39,jp:'明日[あした] の 朝[あさ] は 、 早[はや]く{早い} 起[お]きて{起きる} ください ね 。',en:'Get up early tomorrow morning, okay?'},
  {t:46,jp:'山[やま] が とても きれい です から 。',en:'Because the mountains are really beautiful.'},
  {t:53,jp:'わかった{わかる} 。 おやすみ 。',en:'Got it. Good night.'}],
 gloss:{}};
const GLOSS={'喫茶店':'café — the old-style, sit-down kind','四十年':'forty years','店':'shop, store','閉める':'to close, to shut','まだ':'not yet, still','コーヒー':'coffee','一つ':'one (thing)','かしこまる':'certainly (very polite)','常連':'regular customer','さん':'polite name ending, like Mr/Ms','明日':'tomorrow','朝':'morning','早い':'early, fast','起きる':'to wake up, get up','山':'mountain','とても':'very','きれい':'beautiful; clean','わかる':'to understand — “got it”','おやすみ':'good night','いらっしゃいませ':'welcome (said to customers)','ううん':'no (casual)','じゃあ':'well then','もう':'already','この':'this','ください':'please (do …)','の':'here: makes it a soft question','だ':'is (casual)','よ':'adds emphasis — “you know”','ね':'asks for agreement — “right?”','は':'marks the topic','が':'marks the subject','から':'because','です':'is (polite)','なん':'it’s that … (explaining)','君':'you (casual, often male)','僕':'I (boyish)','俺':'I (rough, male)','私':'I','何':'what','誰':'who','名前':'name','そう':'so, like that','いう':'to say, called'};
/* 08 · Explain this line — written for the practice scene, by line index. pieces: [Japanese, short meaning, note] */
const EXPLAIN=[
 {pieces:[['いらっしゃいませ','welcome','What staff say when a customer walks in. Very polite; customers don’t answer it.']],plain:'“Welcome.” — the owner greets a customer coming in.'},
 {pieces:[['この喫茶店','this café','この = this, right here. 喫茶店 is the old-style café: table service, coffee, quiet.'],['もう四十年','already forty years','もう = already. 四十年 = forty years.'],['なんだ','it’s that…','Casual explaining tone. The speaker is telling you about their situation.']],plain:'“This café has been here forty years.” — said with pride, and a little sadness.'},
 {pieces:[['閉めちゃった','closed it (already)','閉める “to close” + ちゃう — the casual form of てしまう. It’s already done, often with surprise or regret.'],['もう','already',''],['の？','asking for the story','Asks for an explanation — softer and more personal than a plain question.']],plain:'“You’ve closed the shop already?” — she’s surprised it closed so early.',
  ask:'Why の and not か?',answer:'か makes a plain yes/no question and sounds stiff between friends. の asks for the story behind what she sees: “did you close already? what happened?” Very common in casual speech.'},
 {pieces:[['ううん','no (casual)','A soft, casual “no”. Don’t mix it up with うん, which means yes.'],['まだだ','not yet','まだ = not yet, still. だ = casual “is”.'],['よ','you know','Marks this as news for the listener.']],plain:'“No, not yet.” — reassuring her the café is still open.'},
 {pieces:[['じゃあ','well then','Starts a decision based on what was just said.'],['コーヒー一つ','one coffee','Naming the thing and how many is a normal way to order. 一つ = one (thing).']],plain:'“Then one coffee, please.”'},
 {pieces:[['かしこまりました','certainly','A very polite “understood” from staff. The everyday version is わかりました.']],plain:'“Certainly.” — the owner switches to polite shop language.'},
 {pieces:[['常連さん','a regular','常連 = regular customer. さん makes it polite and friendly.'],['だね','right?','だ = is. ね asks for agreement — a warm “aren’t you”.']],plain:'“You’re a regular, huh.”'},
 {pieces:[['明日の朝は','as for tomorrow morning','の links the words: tomorrow’s morning. は sets the topic.'],['早く起きて','get up early','早い “early” becomes 早く to describe 起きる “get up”.'],['くださいね','please, okay?','て-form + ください = please do it. ね makes it gentle.']],plain:'“Get up early tomorrow morning, okay?”'},
 {pieces:[['山が','the mountains','が marks what the sentence is about here.'],['とてもきれいです','are very beautiful','とても = very. きれい = beautiful. です = polite “is”.'],['から','because','At the end of a sentence, から gives the reason for what was said before.']],plain:'“Because the mountains are really beautiful.” — the reason to get up early.'},
 {pieces:[['わかった','got it','Past form of わかる “understand” — a casual “got it”.'],['おやすみ','good night','Casual. The polite version is おやすみなさい.']],plain:'“Got it. Good night.”'}];
const MINE_DEFAULT={id:'mine',videoId:'-3-wRY65ioY',listId:'PLpm1VVK4UL14QojgRgXTQM8reHvv6hERO',listIndex:0,title:"JoJo’s Bizarre Adventure · episode 1",start:0,end:120,breaks:[],lines:[],gloss:{}};
