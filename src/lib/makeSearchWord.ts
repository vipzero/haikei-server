import { SongSeed } from './types/index'

export function makeSearchQuery(song: SongSeed): string {
  if (!song.animeTitle) {
    if (song.title) return song.title
    return song.icy.replace(' - ', ' ') + ' (アニメ OR キャラ)'
  }
  const { animeTitle } = song
  if (!song.category) return animeTitle

  if (song.category.includes('アニメ')) {
    // 実験
    const ext = ['アニメ', 'meme', 'ネタ', 'カット', 'キャラ', 'かわいい'].join(
      ' OR '
    )
    return `${animeTitle} AND (${ext})`
  }
  if (song.category.includes('ゲーム')) {
    const ext = ['ゲーム'].join(' OR ') // 実験
    return `${animeTitle} AND (${ext})`
  }
  return animeTitle
}
