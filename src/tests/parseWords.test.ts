import { uniqo, pickCharaIcy } from './../lib/utils'
import { parseCountWords } from '../lib/utils'

let q: string
test('parseWords', () => {
  q = 'イリス・フレイア(CV.日高里菜)、物部深月(CV.沼倉愛美) - Ray of bullet'
  expect(parseCountWords(q)).toMatchInlineSnapshot(`
Array [
  "イリス",
  "フレイア",
  "日高里菜",
  "物部深月",
  "沼倉愛美",
  "Ray of bullet",
]
`)

  q =
    'ショコラ (CV:八木侑紀)、バニラ (CV:佐伯伊織)、アズキ (CV:井澤詩織)、メイプル (CV:伊藤美来)、シナモン (CV:のぐちゆり)、ココナツ (CV:水谷麻鈴) - Shiny Happy Days'
  expect(parseCountWords(q)).toMatchInlineSnapshot(`
Array [
  "ショコラ",
  "八木侑紀",
  "バニラ",
  "佐伯伊織",
  "アズキ",
  "井澤詩織",
  "メイプル",
  "伊藤美来",
  "シナモン",
  "のぐちゆり",
  "ココナツ",
  "水谷麻鈴",
  "Shiny Happy Days",
]
`)
  q =
    '「ストライクウィッチーズ2」エンディング・メドレー - 宮藤芳佳(福圓美里)＆坂本美緒(世戸さおり)＆ミーナ・ディートリンデ・ヴィルケ(田中理恵)＆ペリーヌ・クロステルマン(沢城みゆき)＆リネット・ビショップ(名塚佳織)＆エーリカ・ハルトマン(野川さくら)＆ゲルトルート・バルクホルン(園崎未恵)＆フランチェスカ・ルッキーニ(斎藤千和)＆シャーロット・E・イェーガー(小清水亜美)＆サーニャ・V・リトヴャク(門脇舞以)＆エイラ・イルマタル・ユーティライネン(大橋歩夕)'
  expect(parseCountWords(q)).toMatchInlineSnapshot(`
Array [
  "「ストライクウィッチーズ2」エンディング",
  "メドレー",
  "宮藤芳佳",
  "福圓美里",
  "坂本美緒",
  "世戸さおり",
  "ミーナ",
  "ディートリンデ",
  "ヴィルケ",
  "田中理恵",
  "ペリーヌ",
  "クロステルマン",
  "沢城みゆき",
  "リネット",
  "ビショップ",
  "名塚佳織",
  "エーリカ",
  "ハルトマン",
  "野川さくら",
  "ゲルトルート",
  "バルクホルン",
  "園崎未恵",
  "フランチェスカ",
  "ルッキーニ",
  "斎藤千和",
  "シャーロット",
  "E",
  "イェーガー",
  "小清水亜美",
  "サーニャ",
  "V",
  "リトヴャク",
  "門脇舞以",
  "エイラ",
  "イルマタル",
  "ユーティライネン",
  "大橋歩夕",
]
`)
}) // (^-^)b

test('uniqo', () => {
  expect(uniqo(['a', 'b', 'c', 'A', 'B'])).toMatchInlineSnapshot(`
Array [
  "A",
  "B",
  "c",
]
`)
})

test('pickCharactor', () => {
  q = 'せーので跳べって言ってんの! - 本城香澄(CV:岩橋由佳)'
  expect(pickCharaIcy(q)).toMatchInlineSnapshot(`
Array [
  "本城香澄",
]
`)

  q =
    'ちいさな冒険者 - アクア(CV.雨宮天)、めぐみん(CV.高橋李依)、ダクネス(CV.茅野愛衣)'
  expect(pickCharaIcy(q)).toMatchInlineSnapshot(`
Array [
  "アクア",
  "めぐみん",
  "ダクネス",
]
`)
})
