import songs, { keyNormalize } from './anisonDb'
import { SongSeed } from './types/index'
import { isHit, strLen } from './utils'

const trimTail = (s: string) => s.substring(0, s.length - 1)

export function findSongBase(
  artist: string,
  titleBase: string,
  icy: string
): [SongSeed, number] {
  const songBase = { artist, title: titleBase, icy }

  let title = keyNormalize(titleBase)
  let songsByArtist = songs[title]

  const halfLen = strLen(title) / 2

  // 曲名検索Hitしない場合後ろの文字から削る
  console.log(songsByArtist)
  while (!songsByArtist && title.length >= halfLen) {
    title = trimTail(title)
    songsByArtist = songs[title]
  }
  console.log(songsByArtist)

  if (!songsByArtist) return [songBase, 0]
  // console.log(songsByArtist)

  // Hit したアーティスト名を含むものを一つ選ぶ

  const findSong = Object.entries(songsByArtist).find(([k]) =>
    k.split(',').some((part) => isHit(keyNormalize(artist), keyNormalize(part)))
  )

  if (!findSong) {
    // 仮 song
    const findSongAlt = Object.entries(songsByArtist)[0][1]
    return [{ ...findSongAlt, icy }, 1]
  }
  // console.log({ song })

  return [{ ...findSong[1], icy }, 2]
}

export function findSong(icy: string): SongSeed {
  const [artist, titleBase] = icy.split(' - ')
  if (!artist || !titleBase) return { icy }
  const [song1, p1] = findSongBase(artist, titleBase, icy)
  const [song2, p2] = findSongBase(titleBase, artist, icy)
  return p1 >= p2 ? song1 : song2
}
