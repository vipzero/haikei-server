import songs, { animes, keyNormalize } from './anisonDb'
import { SongSeed } from './types/index'
import { parseCountWords, strLen } from './utils'

const trimTail = (s: string) => s.substring(0, s.length - 1)

export function findSongBase(
  artist: string,
  title: string,
  artistKey: string,
  titleKey: string,
  icy: string
): [SongSeed, number] {
  const songBase = { artist, title, icy }
  const hit = findSongLib(songs, titleKey, artistKey)
  const hitAttr = findSongLib(animes, titleKey, artistKey)
  return [
    { ...(hit || {}), ...(hitAttr || {}), ...songBase },
    (hit ? 1 : 0) + (hitAttr ? 1 : 0),
  ]
}

const findSongLib = <E>(
  lib: Record<string, Record<string, E>>,
  akeyBase: string,
  bkey: string
): E | null => {
  let akey = akeyBase

  let songsByArtist = lib[akey]

  const halfLen = strLen(akey) / 2
  // 曲名検索Hitしない場合後ろの文字から削る
  while (!songsByArtist && akey.length >= halfLen) {
    akey = trimTail(akey)
    songsByArtist = lib[akey]
  }

  if (!songsByArtist) return null
  console.log(Object.entries(songsByArtist).map(([k]) => parseCountWords(k)))

  // Hit したアーティスト名を含むものを一つ選ぶ
  const res = Object.entries(songsByArtist).find(([k]) => artistHit(bkey, k))
  if (!res) return null
  return res[1]
}

const artistHit = (icyArtist: string, libArtist: string) =>
  parseCountWords(libArtist).some((part) => icyArtist.indexOf(part) >= 0)

export function findSong(icy: string): SongSeed {
  const [artist, titleBase] = icy.split(' - ')
  if (!artist || !titleBase) return { icy }
  const akey = keyNormalize(artist)
  const bkey = keyNormalize(titleBase)

  const [song1, p1] = findSongBase(artist, titleBase, akey, bkey, icy)
  const [song2, p2] = findSongBase(titleBase, artist, bkey, akey, icy)

  return p1 >= p2 ? song1 : song2
}
