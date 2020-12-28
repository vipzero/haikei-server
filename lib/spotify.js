const Spotify = require('node-spotify-api')
const { isHit } = require('./utils')

const spotify = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
})

const spotifySearchAlbam = (query) =>
  spotify.search({ type: 'album', query, market: 'ja' })
const spotifySearchSongInfo = async (query, artistName) => {
  const res = await spotifySearchAlbam(query)
  // console.log(JSON.stringify(res))
  const song = res.albums.items.find((item) => {
    console.log(item)
    return item.artists.some((itemArtist) => {
      console.log(artistName, itemArtist.name)
      // console.log(itemArtist)
      return isHit(artistName, itemArtist.name)
    })
  })
  if (!song) return false

  return {
    artwark: song.images[0],
    artists: song.artists,
  }
}

module.exports = { spotifySearchAlbam, spotifySearchSongInfo }
