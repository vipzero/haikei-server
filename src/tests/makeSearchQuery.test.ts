import { makeSearchQuery } from '../utils/makeSearchWord'
import { pickCharaIcy } from '../utils'

describe('makeSearchQuery', () => {
  test('lost animeTitle', () => {
    expect(
      makeSearchQuery({
        artist: '蒼井翔太',
        title: 'give me ? me',
        icy: '蒼井翔太 - give me ? me',
      })
    ).toMatchInlineSnapshot(
      `"蒼井翔太 give me ? me (名シーン OR キャラ) (キャプ画像 OR 壁紙) かわいい"`
    )
  })
  test('lost animeTitle and detect chara', () => {
    expect(
      makeSearchQuery({
        icy: 'せーので跳べって言ってんの! - 本城香澄(CV:岩橋由佳)',
      })
    ).toMatchInlineSnapshot(
      `"本城香澄 (名シーン OR キャラ) (キャプ画像 OR 壁紙) かわいい"`
    )
  })
  test('has animeTitle', () => {
    expect(
      makeSearchQuery({
        artist: 'artist',
        title: 'title',
        animeTitle: 'アニメタイトルあり',
        icy: 'artist - title',
      })
    ).toMatchInlineSnapshot(`"アニメタイトルあり"`)
  })
  test('has animeTitle and category anime', () => {
    expect(
      makeSearchQuery({
        artist: 'artist',
        title: 'title',
        animeTitle: 'アニメタイトルあり',
        category: 'ほにゃららアニメ',
        icy: 'artist - title',
      })
    ).toMatchInlineSnapshot(
      `"アニメタイトルあり AND (アニメ OR meme OR キャプ画 OR キャラ OR かわいい)"`
    )
  })
  test('has animeTitle and category game', () => {
    expect(
      makeSearchQuery({
        title: '飯島真理',
        artist: '飯島真理',
        category: 'ゲーム',
        gameType: 'シューティング',
        animeTitle: '超時空要塞マクロス 愛・おぼえていますか',
        icy: '飯島真理 - 愛・おぼえていますか',
      })
    ).toMatchInlineSnapshot(
      `"超時空要塞マクロス 愛・おぼえていますか AND (ゲーム)"`
    )
  })
})

test('chara pick', () => {
  expect(
    pickCharaIcy(
      '大槻唯 (CV: 山下七海), 緒方智絵里 (CV: 大空直美) & 新田美波 (CV: 洲崎 綾) - 銀のイルカと熱い風'
    )
  ).toMatchInlineSnapshot(`
Array [
  "大槻唯",
  "緒方智絵里",
  "新田美波",
]
`)
})
