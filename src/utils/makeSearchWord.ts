import { SongSeed } from '../types/index'
import { pickCharaIcy } from '.'

const animeExt = ['アニメ', 'meme', 'キャプ画', 'キャラ', 'かわいい'].join(
  ' OR '
)
const gameExt = ['ゲーム'].join(' OR ') // 実験
const icyOpt = `(名シーン OR キャラ) (キャプ画像 OR 壁紙) かわいい`

export function makeSearchQuery(song: SongSeed): string {
  const { icy, category, animeTitle } = song
  if (!animeTitle) {
    const charaName = pickCharaIcy(icy).join(' ')
    if (charaName) return `${charaName} ${icyOpt}`

    return icy.replace(' - ', ' ') + ` ${icyOpt}`
  }

  if (!category) return animeTitle
  if (category.includes('アニメ')) {
    // 実験
    return `${animeTitle} AND (${animeExt})`
  }
  if (category.includes('ゲーム')) {
    return `${animeTitle} AND (${gameExt})`
  }
  return animeTitle
}
