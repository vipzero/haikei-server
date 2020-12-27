'use strict'

const subscribeIcy = require('./icy').default
const songs = require('./loadDb').default
const { saveMusic } = require('./firebase')
const { getImage } = require('./customImageSearch')

const url = process.env.URL
const trimTail = (s) => s.substring(0, s.length - 1)

function findSong(icy) {
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
  const trimSpace = (s) => s.replace(' ', '')
  const isHit = (long, short) => trimSpace(long).indexOf(trimSpace(short)) >= 0
  const findSong = Object.entries(songsByArtist).find(([k]) => isHit(artist, k))
  if (!findSong) return songBase
  // console.log({ song })

  return { ...findSong[1], icy }
}
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))

function main() {
  subscribeIcy(
    url,
    async (icy) => {
      const song = findSong(icy)

      const imageSearchWord = song.animeTitle ? song.animeTitle : icy

      console.log(icy)
      console.log(song)

      const res = await getImage(imageSearchWord).catch((e) => {
        console.error(e)
        saveMusic(song)
        return false
      })
      if (!res) return

      const imageLinks = res.data.items.map((item) => item.link)
      // console.log(imageLinks)
      saveMusic({ ...song, imageLinks })
    },
    async () => {
      // change stream retry
      console.log('finish')
      await sleep(10)
      main()
    }
  )
}

main()
