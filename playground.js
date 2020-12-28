const { findSong } = require('./lib/findSong')

// うまく取得できなかった icy のテスト
// const icy = 'UNISON SQUARE GARDEN - Catch up, latency'
// const icy = 'Eve - 蒼のワルツ'
const icy =
  'イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美) - Ray of bullet'
// const icy = 'テリブルルッキング - 花咲く☆最強レジェンドDays (男祭りver.)'

console.log(findSong(icy))

// const obj = {
//   '花咲く☆最強レジェンドDays': 'find',
// }

// console.log(songs['花咲く☆最強レジェンドdays'])
// console.log(obj['花咲く☆最強レジェンドDays'])
