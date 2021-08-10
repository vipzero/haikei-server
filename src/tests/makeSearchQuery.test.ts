import { makeSearchQuery } from '../lib/makeSearchWord'

describe('makeSearchQuery', () => {
  test('lost animeTitle', () => {
    expect(
      makeSearchQuery({
        artist: '蒼井翔太',
        title: 'give me ? me',
        icy: '蒼井翔太 - give me ? me',
      })
    ).toMatchInlineSnapshot(`"蒼井翔太 give me ? me (アニメ OR キャラ)"`)
  })
  test('lost animeTitle and detect chara', () => {
    expect(
      makeSearchQuery({
        icy: 'せーので跳べって言ってんの! - 本城香澄(CV:岩橋由佳)',
      })
    ).toMatchInlineSnapshot(`"本城香澄"`)
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
      `"アニメタイトルあり AND (アニメ OR meme OR ネタ OR カット OR キャラ OR かわいい)"`
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
