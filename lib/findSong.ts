import songs from './anisonDb'
import { SongSeed } from './types/index'
import { isHit } from './utils'

const trimTail = (s: string) => s.substring(0, s.length - 1)

export function findSongBase(
  artist: string,
  titleBase: string,
  icy: string
): [SongSeed, number] {
  const songBase = { artist, title: titleBase, icy }

  let title = titleBase.toLowerCase()
  let songsByArtist = songs[title]

  // 曲名検索Hitしない場合後ろの文字から削る
  // console.log(songsByArtist)
  while (!songsByArtist && title.length >= 4) {
    console.log(title)
    title = trimTail(title)
    songsByArtist = songs[title]
  }
  console.log(songsByArtist)

  if (!songsByArtist) return [songBase, 0]
  // console.log(songsByArtist)

  // Hit したアーティスト名を含むものを一つ選ぶ

  const findSong = Object.entries(songsByArtist).find(([k]) =>
    k.split(',').some((part) => isHit(artist, part))
  )

  if (!findSong) {
    // 仮 song
    const findSongAlt = Object.entries(songsByArtist)[0][1]
    return [{ ...findSongAlt, icy }, [...title].length]
  }
  // console.log({ song })

  return [{ ...findSong[1], icy }, [...title].length * 10]
}

export function findSong(icy: string): SongSeed {
  const [artist, titleBase] = icy.split(' - ')
  if (!artist || !titleBase) return { icy }
  const [song1, p1] = findSongBase(artist, titleBase, icy)
  const [song2, p2] = findSongBase(titleBase, artist, icy)
  return p1 >= p2 ? song1 : song2
}
