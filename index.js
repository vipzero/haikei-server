'use strict'

const subscribeIcy = require('./icy').default
const songs = require('./loadDb').default
const { saveMusic } = require('./firebase')

const url = process.env.URL
const trimTail = (s) => s.substring(0, s.length - 1)

function findSong(titleBase, artistBase) {
  let title = titleBase.toLowerCase()
  let artist = artistBase.toLowerCase()
  let songsByArtist = songs[title]

  while (!songsByArtist && title.length > 8) {
    title = trimTail(title)
    songsByArtist = songs[title]
  }
  if (!songsByArtist) return false

  let song = songsByArtist[artist]

  while (!songsByArtist && artist.length > 8) {
    artist = trimTail(artist)
    song = songsByArtist[artist]
  }

  return song
}

subscribeIcy(url, ({ artist, title }) => {
  console.log({ artist, title })
  const song = findSong(title, artist) || { artist, title }
  saveMusic(song)
})
