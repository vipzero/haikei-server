import { SongSeed } from './types/index'
import { pickCharaIcy } from './utils'

const animeExt = [
  'アニメ',
  'meme',
  'ネタ',
  'カット',
  'キャラ',
  'かわいい',
].join(' OR ')
const gameExt = ['ゲーム'].join(' OR ') // 実験

export function makeSearchQuery(song: SongSeed): string {
  const { icy, category, animeTitle } = song
  if (!animeTitle) {
    const charaName = pickCharaIcy(icy).join(' ')

    return charaName || icy.replace(' - ', ' ') + ' (アニメ OR キャラ)'
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
