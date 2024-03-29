import { findSong } from '../anisonDb/findSong'

// jest.mock('fs', () => ({
//   readFileSync: jest.fn((path) => {
//     switch (path) {
//       case './data/anison.csv':
//         return `
// 桜Trick,YES?NO?ココロ,園田優（井口裕香）,石井伸昂,石井伸昂,今泉洋
// `
//       case './data/game.csv':
//         return ``
//       case './data/sf.csv':
//         return ``
//       case './data/animesong.csv':
//         return ``
//       default:
//         return ``
//     }
//   }),
// }))

// うまく取得できなかった icy のテスト
let icy = ''
test('findSong', () => {
  icy = 'YES?NO?ココロ - 園田優(CV.井口裕香)'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "桜Trick",
  "arranger": "今泉洋",
  "artist": "園田優(CV.井口裕香)",
  "composer": "石井伸昂",
  "icy": "YES?NO?ココロ - 園田優(CV.井口裕香)",
  "title": "YES?NO?ココロ",
  "writer": "石井伸昂",
}
`)
  icy = '飯島真理 - 愛・おぼえていますか'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "超時空要塞マクロス 愛・おぼえていますか",
  "arranger": "清水信之",
  "artist": "飯島真理",
  "category": "ゲーム",
  "chapNum": "",
  "composer": "加藤和彦",
  "date": "1997-06-06",
  "gameType": "シューティング",
  "icy": "飯島真理 - 愛・おぼえていますか",
  "opOrEd": "OP",
  "songId": "2564",
  "spInfo": "",
  "title": "愛・おぼえていますか",
  "writer": "安井かずみ",
}
`)
  icy =
    'アップルティーの味 - ユリエ＝シグトゥーナ(CV：山本希望)×リーリス＝ブリストル(CV：山崎はるか)'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "アブソリュート・デュオ",
  "arranger": "楊慶豪",
  "artist": "ユリエ＝シグトゥーナ(CV：山本希望)×リーリス＝ブリストル(CV：山崎はるか)",
  "category": "テレビアニメーション",
  "chapNum": "12",
  "composer": "楊慶豪",
  "date": "2015-01-04",
  "gameType": "",
  "icy": "アップルティーの味 - ユリエ＝シグトゥーナ(CV：山本希望)×リーリス＝ブリストル(CV：山崎はるか)",
  "opOrEd": "ED",
  "songId": "91081",
  "spInfo": "2",
  "title": "アップルティーの味",
  "writer": "永塚健登",
}
`)
  icy = 'Stellamaris (高橋未奈美, 諏訪彩花, 田中あいみ) - 恋はフュージョン'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "artist": "Stellamaris (高橋未奈美, 諏訪彩花, 田中あいみ)",
  "icy": "Stellamaris (高橋未奈美, 諏訪彩花, 田中あいみ) - 恋はフュージョン",
  "title": "恋はフュージョン",
}
`)
  icy = 'UNISON SQUARE GARDEN - Catch up, latency'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "風が強く吹いている",
  "artist": "UNISON SQUARE GARDEN",
  "category": "テレビアニメーション",
  "chapNum": "23",
  "date": "2018-10-03",
  "gameType": "",
  "icy": "UNISON SQUARE GARDEN - Catch up, latency",
  "opOrEd": "OP",
  "songId": "115179",
  "spInfo": "1",
  "title": "Catch up, latency",
}
`)
  icy = 'イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美) - Ray of bullet'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "銃皇無尽のファフニール",
  "arranger": "園田智也",
  "artist": "イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美)",
  "category": "テレビアニメーション",
  "chapNum": "12",
  "composer": "園田智也",
  "date": "2015-01-09",
  "gameType": "",
  "icy": "イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美) - Ray of bullet",
  "opOrEd": "ED",
  "songId": "91288",
  "spInfo": "1",
  "title": "Ray of bullet",
  "writer": "園田智也",
}
`)
  // 以下はDBになさそう
  icy = '鬼頭明里 - The One'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "artist": "鬼頭明里",
  "icy": "鬼頭明里 - The One",
  "title": "The One",
}
`)
  icy = '六花 - 二者穿一'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "artist": "六花",
  "icy": "六花 - 二者穿一",
  "title": "二者穿一",
}
`)
  icy = 'ワクワクシークヮーサー - 大城あかり(CV:木村千咲)'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "artist": "ワクワクシークヮーサー",
  "icy": "ワクワクシークヮーサー - 大城あかり(CV:木村千咲)",
  "title": "大城あかり(CV:木村千咲)",
}
`)
  icy = 'Cry Baby - Official髭男dism'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "東京リベンジャーズ",
  "artist": "Official髭男dism",
  "icy": "Cry Baby - Official髭男dism",
  "opOrEd": "ED",
  "songId": "130767",
  "spInfo": "第1話のみ放映",
  "title": "Cry Baby",
}
`)
  icy = 'ZERO!! - Minami'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "artist": "ZERO!!",
  "icy": "ZERO!! - Minami",
  "title": "Minami",
}
`)
  icy = '色違いの翼 - あおい(CV:井口裕香)、ひなた(CV:阿澄佳奈)'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "ヤマノススメ",
  "artist": "あおい(CV:井口裕香)、ひなた(CV:阿澄佳奈)",
  "category": "テレビアニメーション",
  "chapNum": "49",
  "date": "2013-01-03",
  "gameType": "",
  "icy": "色違いの翼 - あおい(CV:井口裕香)、ひなた(CV:阿澄佳奈)",
  "opOrEd": "ED",
  "songId": "113597",
  "spInfo": "5",
  "title": "色違いの翼",
}
`)
  icy =
    '放課後ティータイム (豊崎愛生, 日笠陽子, 佐藤聡美, 寿美菜子, 竹達彩奈) - カレーのちライス (映画「けいおん!」Mix)'
  expect(findSong(icy)).toMatchInlineSnapshot(`
{
  "animeTitle": "けいおん！",
  "arranger": "前澤寛之",
  "artist": "放課後ティータイム (豊崎愛生, 日笠陽子, 佐藤聡美, 寿美菜子, 竹達彩奈)",
  "composer": "前澤寛之",
  "icy": "放課後ティータイム (豊崎愛生, 日笠陽子, 佐藤聡美, 寿美菜子, 竹達彩奈) - カレーのちライス (映画「けいおん!」Mix)",
  "title": "カレーのちライス (映画「けいおん!」Mix)",
  "writer": "稲葉エミ",
}
`)
})
