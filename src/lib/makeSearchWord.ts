import { SongSeed } from './types/index'

export function makeSearchQuery(song: SongSeed): string {
  if (!song.animeTitle) {
    if (song.title) return song.title
    return song.icy.replace(' - ', ' OR ')
  }
  const { animeTitle } = song
  if (!song.category) return animeTitle

  if (song.category.includes('アニメ')) {
    // 実験
    // const ext = ['アニメ', 'ダイジェスト', '1話', 'meme', 'ネタ'].join(' OR ')
    return `${animeTitle} AND (アニメ OR 1話 OR meme OR ネタ OR 作画 OR 2ch OR カット)`
  }
  if (song.category.includes('ゲーム')) {
    const ext = ['ゲーム'].join(' OR ') // 実験
    return `${animeTitle} AND (${ext})`
  }
  return animeTitle
}
