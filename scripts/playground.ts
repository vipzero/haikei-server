// import { pathQueue, push } from './lib/state/pathQueue'
// const { spotifySearchSongInfo } = require('./lib/spotify')
// const { getMusixMatch, getMusixLyrics } = require('./lib/musixmatch')
// const { getLyrics } = require('./lib/jlyricnet')
// const { parseWords, uniqo } = require('./lib/utils')
// import songs from './lib/anisonDb'
const p = console.log

// const { getImageLinks } = require('./lib/customImageSearch')
// const { getAlbum } = require('./lib/itunes')

import { findSong } from '../lib/findSong'

p(findSong('Stellamaris (高橋未奈美, 諏訪彩花, 田中あいみ) - 恋はフュージョン'))
p(
  findSong(
    '放課後ティータイム (豊崎愛生, 日笠陽子, 佐藤聡美, 寿美菜子, 竹達彩奈) - カレーのちライス (映画「けいおん!」Mix)'
  )
)

// うまく取得できなかった icy のテスト
p(findSong('UNISON SQUARE GARDEN - Catch up, latency'))
p(findSong('Eve - 蒼のワルツ'))
p(
  findSong(
    'イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美) - Ray of bullet'
  )
)
p(findSong('テリブルルッキング - 花咲く☆最強レジェンドDays (男祭りver.)'))

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
// const q =
//   'ショコラ (CV:八木侑紀)、バニラ (CV:佐伯伊織)、アズキ (CV:井澤詩織)、メイプル (CV:伊藤美来)、シナモン (CV:のぐちゆり)、ココナツ (CV:水谷麻鈴) - Shiny Happy Days'
// '「ストライクウィッチーズ2」エンディング・メドレー - 宮藤芳佳(福圓美里)＆坂本美緒(世戸さおり)＆ミーナ・ディートリンデ・ヴィルケ(田中理恵)＆ペリーヌ・クロステルマン(沢城みゆき)＆リネット・ビショップ(名塚佳織)＆エーリカ・ハルトマン(野川さくら)＆ゲルトルート・バルクホルン(園崎未恵)＆フランチェスカ・ルッキーニ(斎藤千和)＆シャーロット・E・イェーガー(小清水亜美)＆サーニャ・V・リトヴャク(門脇舞以)＆エイラ・イルマタル・ユーティライネン(大橋歩夕)'

// getImageLinks(q).then(console.log)

// console.log(parseWords('key plus words - 平田志穂子 feat. 川村ゆみ'))
// console.log(
//   parseWords(
//     'イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美) - Ray of bullet'
//   )
// )
// console.log(parseWords(q))
// console.log(uniqo(['a', 'b', 'c', 'A', 'B']))

// getAllIcy().then(console.log)

// import { uploadByUrlAll } from '../lib/firebase'
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

// import { downloadOptimize } from '../lib/download'
// const url =
//   'https://storage.googleapis.com/rekka-haikei.appspot.com/img/2021obon/1628425925010_2.png'
// downloadOptimize(url).then(console.log)

// import { keyNormalize } from '../lib/anisonDb'

// console.log(keyNormalize('ボルサリーノ [黄猿](石塚運昇)'))

// import { imageMin } from '../lib/imagemin'
// imageMin('tmp/tmp').then(console.log)
