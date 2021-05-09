import songs from './anisonDb'
import { isHit } from './utils'

const trimTail = (s) => s.substring(0, s.length - 1)

export function findSong(icy) {
  const [artist, titleBase] = icy.split(' - ')

  if (!artist || !titleBase) return { icy }
  const songBase = { artist, title: titleBase, icy }

  let title = titleBase.toLowerCase()
  let songsByArtist = songs[title]

  // 曲名検索Hitしない場合後ろの文字から削る
  // console.log(songsByArtist)
  while (!songsByArtist && title.length >= 4) {
    title = trimTail(title)
    songsByArtist = songs[title]
  }

  if (!songsByArtist) return songBase
  // console.log(songsByArtist)

  // Hit したアーティスト名を含むものを一つ選ぶ

  const findSong = Object.entries(songsByArtist).find(([k]) =>
    k.split(',').some((part) => isHit(artist, part))
  )
  if (!findSong) return songBase
  // console.log({ song })

  return { ...findSong[1], icy }
}
