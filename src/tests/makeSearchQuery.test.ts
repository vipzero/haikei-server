import { makeSearchQuery } from '../lib/makeSearchWord'

test('makeSearchQuery', () => {
  expect(
    makeSearchQuery({
      artist: '蒼井翔太',
      title: 'give me ? me',
      icy: '蒼井翔太 - give me ? me',
    })
  ).toMatchInlineSnapshot(`"蒼井翔太 give me ? me (アニメ OR キャラ)"`)

  expect(
makeSearchQuery({
  icy: 'せーので跳べって言ってんの! - 本城香澄(CV:岩橋由佳)' })).

toMatchInlineSnapshot('本城香澄', `"本城香澄"`)

  expect(
    makeSearchQuery({
      artist: 'artist',
      title: 'title',
      animeTitle: 'アニメタイトルあり',
      icy: 'artist - title',
    })
  ).toMatchInlineSnapshot(`"アニメタイトルあり"`)
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
  expect(
    makeSearchQuery({
      opOrEd: 'OP',
      spInfo: '',
      songId: '2564',
      title: '飯島真理',
      artist: '飯島真理',
      category: 'ゲーム',
      gameType: 'シューティング',
      animeTitle: '超時空要塞マクロス 愛・おぼえていますか',
      chapNum: '',
      date: '1997-06-06',
      icy: '飯島真理 - 愛・おぼえていますか',
    })
  ).toMatchInlineSnapshot(
    `"超時空要塞マクロス 愛・おぼえていますか AND (ゲーム)"`
  )
})
