import { artistKeyNormalize } from '../anisonDb/anisonDb'
const Spotify = require('node-spotify-api')
import { isHit } from '../utils'

const spotify = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
})

export const spotifySearchAlbam = (query: string) =>
  spotify.search({ type: 'album', query, market: 'ja' })
export const spotifySearchSongInfo = async (
  query: string,
  artistName: string
) => {
  const res: Res = await spotifySearchAlbam(query + ' ' + artistName)
  // console.log(JSON.stringify(res))
  type Res = {
    albums: {
      items: {
        name: string
        images: string[]
        artists: {
          name: string
        }[]
      }[]
    }
  }
  const song =
    res.albums.items.find((item) => {
      return item.artists.some((itemArtist) => {
        return isHit(
          artistKeyNormalize(artistName),
          artistKeyNormalize(itemArtist.name)
        )
      })
    }) || res.albums.items[0]
  if (!song) return false

  return {
    artwark: song.images[0],
    artists: song.artists,
  }
}
