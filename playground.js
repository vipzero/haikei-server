import { imageMin } from './lib/imagemin'
// import { uploadByUrlAll } from './lib/firebase'
// import { pathQueue, push } from './lib/state/pathQueue'
// const { findSong } = require('./lib/findSong')
// const { spotifySearchSongInfo } = require('./lib/spotify')
// const { getMusixMatch, getMusixLyrics } = require('./lib/musixmatch')
// const { getLyrics } = require('./lib/jlyricnet')
// const { parseWords, uniqo } = require('./lib/utils')
// import { downloadOptimize } from './lib/download'
// import songs from './lib/anisonDb'

// const { getImageLinks } = require('./lib/customImageSearch')
// const { getAlbum } = require('./lib/itunes')

// うまく取得できなかった icy のテスト
// const icy = 'UNISON SQUARE GARDEN - Catch up, latency'
// const icy = 'Eve - 蒼のワルツ'
// const icy =
//   'イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美) - Ray of bullet'
// const icy = 'テリブルルッキング - 花咲く☆最強レジェンドDays (男祭りver.)'

// console.log(findSong(icy))

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

// const url =
//   'https://img.cdn.nimg.jp/s/nicovideo/thumbnails/12741863/12741863.original/r1280x720l?key=79b8d896df2b5eb36b3a45f1201632df9f69fb98b51c7699e993fc5c776f94c9'
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
// console.log(findSong('Get Over - 佐咲紗花'))

// const url =
//   'https://storage.googleapis.com/rekka-haikei.appspot.com/img/2021obon/1628425925010_2.png'
// downloadOptimize(url).then(console.log)

imageMin('tmp/tmp').then(console.log)
