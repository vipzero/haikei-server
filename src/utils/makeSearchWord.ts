import { getSyncConf } from './syncConf'
import { SongSeed } from '../types/index'
import { pickCharaIcy } from '.'

/* anison DB から曲情報を取れた場合アニメタイトル、カテゴリ(ゲーム,アニメ,SF,映画)などを使用できる */
/* アニメカテゴリ場合は↓を検索クエリに追加する */
const animeExt = ['アニメ', 'meme', 'キャプ画', 'キャラ', 'かわいい'].join(
  ' OR '
)

/* ゲームカテゴリ場合は↓を検索クエリに追加する */
const gameExt = ['ゲーム'].join(' OR ')

/* アニメ情報が取れなかった曲は icy に↓を検索クエリに追加する */
const icyOpt = `(名シーン OR キャラ) (キャプ画像 OR 壁紙) かわいい`

export function makeSearchQuery(song: SongSeed): string {
  const { icy, category, animeTitle } = song
  if (getSyncConf().simpleSearch) return icy.replace(/-/g, ' ')

  if (!animeTitle) {
    const charaName = pickCharaIcy(icy).join(' ')
    if (charaName) return `${charaName} ${icyOpt}`

    return icy.replace(' - ', ' ') + ` ${icyOpt}`
  }

  if (!category) return animeTitle
  if (category.includes('アニメ')) {
    return `${animeTitle} AND (${animeExt})`
  }
  if (category.includes('ゲーム')) {
    return `${animeTitle} AND (${gameExt})`
  }
  return animeTitle
}
