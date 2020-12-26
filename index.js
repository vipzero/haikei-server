'use strict'

const subscribeIcy = require('./icy').default
const songs = require('./loadDb').default
const { saveMusic } = require('./firebase')
const { getImage } = require('./customImageSearch')

const url = process.env.URL
const trimTail = (s) => s.substring(0, s.length - 1)

function findSong(titleBase, artistBase) {
  let title = titleBase.toLowerCase()
  let artists = artistBase.toLowerCase().split(' ')
  let songsByArtist = songs[title]

  while (!songsByArtist && title.length >= 4) {
    title = trimTail(title)
    songsByArtist = songs[title]
  }

  if (!songsByArtist) return false

  let song = undefined
  for (let i = 0; i < artists.length && !song; i++) {
    let artist = artists[i]
    song = songsByArtist[artist]

    while (!song && artist.length >= 4) {
      artist = trimTail(artist)
      song = songsByArtist[artist]
    }
  }

  return song
}

subscribeIcy(url, ({ artist, title }) => {
  console.log({ artist, title })
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
