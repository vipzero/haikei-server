/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-console */

import { findSong } from '../src/anisonDb/findSong'
import { imageSetupTimeTable } from '../src/utils/tableTimeLogger'

// import { pathQueue, push } from './state/pathQueue'
// const { spotifySearchSongInfo } = require('./spotify')
// const { getMusixMatch, getMusixLyrics } = require('./musixmatch')
// const { getLyrics } = require('./jlyricnet')
// import songs from './anisonDb'

// const { getImageLinks } = require('./customImageSearch')
// const { getAlbum } = require('./itunes')
// import { readFileSync } from 'fs'
// readFileSync('./scripts/read.ts', 'utf8')

// const obj = {
//   '花咲く☆最強レジェンドDays': 'find',
// }

// console.log(songs['花咲く☆最強レジェンドdays'])
// console.log(obj['花咲く☆最強レジェンドDays'])

// spotifySearchSongInfo('ココロオドル', 'nobodyknows+').then(console.log)

// spotifySearchSongInfo('空蝉', '志方あきこ').then(console.log)
// spotifySearchSongInfo('I swear ', 'sweet arms').then(console.log)
// spotifySearchSongInfo('マッチョアネーム?', '街雄鳴造(CV:石川界人)').then(
//   console.log
// )
// spotifySearchSongInfo('タチアガレ！', 'Wake Up, Girls!').then(console.log)

// getMusixLyrics('snowdrop', '春奈るな,河野マリナ').then(console.log)
// getLyrics('snowdrop', '春奈るな,河野マリナ').then(console.log)

// getAlbum('コスモルミナ - 芹澤優').then(console.log)

// const q = 'OxT - 君じゃなきゃダメみたい -OxT ver.- - 月刊少女野崎くん'

// getImageLinks(q).then(console.log)

// getAllIcy().then(console.log)

// import { uploadByUrlAll } from '../firebase'
// const url = 'http://genka-market.jp/genka-pics/10032004.jpg'
// uploadByUrlAll([url]).then(console.log)

// pathQueue.watch(console.log)

// console.log(1)
// push(1)
// console.log(2)
// push(2)
// console.log(3)
// push(3)
// console.log(4)
// push(4)
// console.log(songs)

// import { downloadOptimize } from '../download'
// const url =
//   'https://storage.googleapis.com/rekka-haikei.appspot.com/img/2021obon/1628425925010_2.png'
// downloadOptimize(url).then(console.log)

// import { imageMin } from '../src/imagemin'
// imageMin('tmp/tmp.png').then(console.log)
// imageMin('tmp/tmp1.png').then(console.log)
// imageMin('tmp/tmp2.png').then(console.log)

// import { sharpMin } from '../src/imageIo/sharp'
// sharpMin('tmp/tmp1.png').then(console.log)
// sharpMin('tmp/tmp2.png').then(console.log)

// import { state } from './../src/state/state'
// const s = state
// setInterval(() => {
//   s.incN()
//   p(s.n)
// }, 1000)

// import { getSyncConf } from './../src/utils/syncConf'
// console.log(getSyncConf())

// import { makeSearchQuery } from '../src/utils/makeSearchWord'
//
// const song = {
//   icy: '愛美 - LIVE for LIFE ～狼たちの夜～',
// }
// console.log(makeSearchQuery(song, Math.random()))

// import { makeEmol } from '../src/service/emol'

// const text =
//   '水面が 揺らぐ\n風の輪が 拡がる\n触れ合った指先の\n青い電流\n\n見つめあうだけで\n孤独な加速度が\n一瞬に砕け散る\nあなたが好きよ\n\n透明な真珠のように\n宙に浮く涙\n悲劇だってかまわない\nあなたと生きたい\n\nキラッ!\n流星にまたがって\nあなたに急降下　ah ah\n濃紺の星空に\n私たち花火みたい\n心が光の矢を放つ\n\n会話などなしに\n内側に潜って\n考えが読み取れる\n不思議な夜\n\nあなたの名　呪文みたいに\n無限のリピート\n憎らしくて手の甲に\n爪をたててみる\n\nキラッ!\n身体ごと透き通り\n絵のように漂う　uh uh\nけし粒の生命でも\n私たち瞬いてる\n魂に銀河　雪崩れてく\n\n流星にまたがって\nあなたは急上昇　oh oh\n濃紺の星空に\n私たち花火みたい\n心が光の矢を放つ\n\nけし粒の生命でも\n私たち瞬いてる\n魂に銀河　雪崩れてく\n魂に銀河　雪崩れてく'
// // emojify(text, { onlyEmoji: true }).then(console.log)
// makeEmol(text).then(console.log)

// const icy = `READY STEADY GO - L'Arc～en～Ciel`
// console.log(findSong(icy))

const tt = imageSetupTimeTable()
tt.init('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/a.jpg')
tt.init('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/b.jpg')
tt.init('http://example.com/c.jpg')

tt.mark('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/a.jpg', 'dw')
tt.mark('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/a.jpg', 'sharp')
tt.mark('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/a.jpg', 'jimp')
tt.mark('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/b.jpg', 'dw')
tt.mark('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/b.jpg', 'sharp')
// tt.mark('http://example.com/aaaaaaaaaaa/bbbbbbbbbbbb/b.jpg', 'jimp')
tt.mark('http://example.com/c.jpg', 'dw')
tt.mark('http://example.com/c.jpg', 'sharp')
tt.mark('http://example.com/c.jpg', 'jimp')

tt.print()
