'use strict'

const subscribeIcy = require('./icy').default
const songs = require('./loadDb').default
const { saveMusic } = require('./firebase')
const { getImage } = require('./customImageSearch')

const url = process.env.URL
const trimTail = (s) => s.substring(0, s.length - 1)

function findSong(titleBase, artist) {
  let title = titleBase.toLowerCase()
  let songsByArtist = songs[title]
  // 曲名: 後ろからHitしない場合削る

  // console.log(songsByArtist)
  while (!songsByArtist && title.length >= 4) {
    title = trimTail(title)
    songsByArtist = songs[title]
  }

  if (!songsByArtist) return false
  // console.log(songsByArtist)

  // Hit したアーティスト名を含むものを一つ選ぶ
  const findSong = Object.entries(songsByArtist).find(([k]) => {
    return artist.indexOf(k) !== -1 || artist.indexOf(k.replace(' ', ''))
  })
  if (!findSong) return false
  // console.log({ song })

  return findSong[1]
}

subscribeIcy(url, ({ artist, title }) => {
  const song =
    artist && title
      ? findSong(title, artist) || findSong(artist, title) || { artist, title }
      : { artist: artist + title, title: artist + title }

  const imageSearchWord = song.animeTitle ? song.animeTitle : artist + title
  console.log(song)

  getImage(imageSearchWord)
    .then((res) => {
      const imageLinks = res.data.items.map((item) => item.link)
      // console.log(imageLinks)
      saveMusic({ ...song, imageLinks })
    })
    .catch((e) => {
      console.error(e)
      saveMusic(song)
    })
})
