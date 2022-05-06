import { pickCharaIcy } from '.'
import { SongSeed } from '../types/index'
import { getSyncConf } from './syncConf'
import { shuffle } from './random'

/* anison DB から曲情報を取れた場合アニメタイトル、カテゴリ(ゲーム,アニメ,SF,映画)などを使用できる */

/* ランダムに追加する */
const animeExt = [
  'meme',
  'キャプ画',
  'キャラ',
  'かわいい',
  'グッズ',
  'ネタ画像',
  '壁紙',
  '相関図',
  '名シーン',
  '作画',
  'wallpaper',
]
/* アニメカテゴリ場合は↓を検索クエリに追加する */
const animeExtBase = ['アニメ'].join(' OR ')

/* ゲームカテゴリ場合は↓を検索クエリに追加する */
const gameExt = ['ゲーム'].join(' OR ')

/* アニメ情報が取れなかった曲は icy に↓を検索クエリに追加する */
const icyOpt = `(名シーン OR キャラ) (キャプ画像 OR 壁紙)`

export function makeSearchQuery(song: SongSeed, seed: number): string {
  const { icy, category, animeTitle } = song
  if (getSyncConf().simpleSearch) return icy.replace(/-/g, ' ')
  const r = shuffle(animeExt, `${seed}`)
  const opts = [r[0], r[1], r[2]]

  if (!animeTitle) {
    const charaName = pickCharaIcy(icy).join(' ')
    if (charaName) return `${charaName} ${icyOpt}`

    return (
      `(${icy
        .split(' - ')
        .map((v) => v.substring(0, 16))
        .join(' OR ')})` + ` ${opts.join(' OR ')}`
    )
  }

  if (!category) return animeTitle
  if (category.includes('アニメ')) {
    return `${animeTitle} AND (${animeExtBase} OR ${opts.join(' OR ')})`
  }
  if (category.includes('ゲーム')) {
    return `${animeTitle} AND (${gameExt})`
  }
  return animeTitle
}
