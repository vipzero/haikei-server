import { makeSearchQuery } from '../utils/makeSearchWord'
import { pickCharaIcy } from '../utils'

const seed = 0.123456789
describe('makeSearchQuery', () => {
  test('lost animeTitle', () => {
    expect(
      makeSearchQuery(
        {
          artist: '蒼井翔太',
          title: 'give me ? me',
          icy: '蒼井翔太 - give me ? me',
        },

        seed
      )
    ).toMatchInlineSnapshot(
      `"(蒼井翔太 OR give me ? me) ネタ画像 OR 壁紙 OR 作画 OR 5話"`
    )
  })
  test('lost animeTitle and detect chara', () => {
    expect(
      makeSearchQuery(
        {
          icy: 'せーので跳べって言ってんの! - 本城香澄(CV:岩橋由佳)',
        },

        seed
      )
    ).toMatchInlineSnapshot(
      `"本城香澄 (名シーン OR キャラ) (キャプ画像 OR 壁紙)"`
    )
  })
  test('has animeTitle', () => {
    expect(
      makeSearchQuery(
        {
          artist: 'artist',
          title: 'title',
          animeTitle: 'アニメタイトルあり',
          icy: 'artist - title',
        },
        seed
      )
    ).toMatchInlineSnapshot(`"アニメタイトルあり"`)
  })
  test('has animeTitle and category anime', () => {
    expect(
      makeSearchQuery(
        {
          artist: 'artist',
          title: 'title',
          animeTitle: 'アニメタイトルあり',
          category: 'ほにゃららアニメ',
          icy: 'artist - title',
        },

        seed
      )
    ).toMatchInlineSnapshot(
      `"アニメタイトルあり アニメ -公式 AND (ネタ画像 OR 壁紙 OR 作画 OR 5話)"`
    )
  })
  test('has animeTitle and category game', () => {
    expect(
      makeSearchQuery(
        {
          title: '飯島真理',
          artist: '飯島真理',
          category: 'ゲーム',
          gameType: 'シューティング',
          animeTitle: '超時空要塞マクロス 愛・おぼえていますか',
          icy: '飯島真理 - 愛・おぼえていますか',
        },
        seed
      )
    ).toMatchInlineSnapshot(
      `"超時空要塞マクロス 愛・おぼえていますか AND (ゲーム)"`
    )
  })

  test('additional option', () => {
    expect(
      makeSearchQuery(
        {
          artist: 'artist',
          title: 'title',
          animeTitle: 'アニメタイトルあり',
          icy: 'artist - title',
        },
        seed,
        { additional: 'オプション' }
      )
    ).toMatchInlineSnapshot(`"アニメタイトルあり オプション"`)
  })
})

test('chara pick', () => {
  expect(
    pickCharaIcy(
      '大槻唯 (CV: 山下七海), 緒方智絵里 (CV: 大空直美) & 新田美波 (CV: 洲崎 綾) - 銀のイルカと熱い風'
    )
  ).toMatchInlineSnapshot(`
[
  "大槻唯",
  "緒方智絵里",
  "新田美波",
]
`)
})
