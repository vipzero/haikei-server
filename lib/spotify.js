import Spotify from 'node-spotify-api'
import { isHit } from './utils'

const spotify = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
})

export const spotifySearchAlbam = (query) =>
  spotify.search({ type: 'album', query, market: 'ja' })
export const spotifySearchSongInfo = async (query, artistName) => {
  const res = await spotifySearchAlbam(query + ' ' + artistName)
  // console.log(JSON.stringify(res))
  const song =
    res.albums.items.find((item) => {
      return item.artists.some((itemArtist) => {
        console.log(artistName, itemArtist.name)
        // console.log(itemArtist)
        return isHit(artistName, itemArtist.name)
      })
    }) || res.albums.items[0]
  if (!song) return false

  return {
    artwark: song.images[0],
    artists: song.artists,
  }
}
