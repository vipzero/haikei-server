// const { findSong } = require('./lib/findSong')
// const { spotifySearchSongInfo } = require('./lib/spotify')
// const { getMusixMatch, getMusixLyrics } = require('./lib/musixmatch')
const { getLyrics } = require('./lib/jlyricnet')

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
getLyrics('snowdrop', '春奈るな,河野マリナ').then(console.log)

// getAlbum('コスモルミナ - 芹澤優').then(console.log)
