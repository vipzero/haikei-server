import songs, { animes, keyNormalize } from './anisonDb'
import { SongSeed } from './types/index'
import { isHit, strLen } from './utils'

const trimTail = (s: string) => s.substring(0, s.length - 1)

export function findSongBase(
  artist: string,
  titleBase: string,
  icy: string
): [SongSeed, number] {
  const artistKey = keyNormalize(artist)
  let title = keyNormalize(titleBase)
  const songBase = { artist, title: titleBase, icy }
  let songsByArtist = songs[title]

  const halfLen = strLen(title) / 2
  // 曲名検索Hitしない場合後ろの文字から削る
  while (!songsByArtist && title.length >= halfLen) {
    title = trimTail(title)
    songsByArtist = songs[title]
  }

  if (!songsByArtist) return [songBase, 0]

  // Hit したアーティスト名を含むものを一つ選ぶ
  const findSong = Object.entries(songsByArtist).find(([k]) =>
    k.split(',').some((part) => isHit(artistKey, keyNormalize(part)))
  )

  if (!findSong) return [songBase, 0]
  return [{ ...findSong[1], icy }, 2]
}

export function findSong(icy: string): SongSeed {
  const [artist, titleBase] = icy.split(' - ')
  if (!artist || !titleBase) return { icy }

  const [song1, p1] = findSongBase(artist, titleBase, icy)
  const [song2, p2] = findSongBase(titleBase, artist, icy)

  const akey = keyNormalize(artist)
  const bkey = keyNormalize(titleBase)

  // アニメ検索
  const attr = animes[akey]?.[bkey] || animes[bkey]?.[akey] || {}

  const songBase = p1 >= p2 ? song1 : song2
  return { ...songBase, ...attr }
}
