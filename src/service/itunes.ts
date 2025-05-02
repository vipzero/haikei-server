import { error } from '../utils/logger'
// eslintの警告を無視するために型を明示的に指定
import got from 'got'

interface ITunesResponse {
  resultCount: number
  results: Array<{
    collectionName: string
    copyright: string
    artworkUrl100: string
    trackTimeMillis: number
    collectionViewUrl: string
  }>
}

const iTunesSearchSong = (term: string) =>
  got<ITunesResponse>('https://itunes.apple.com/search', {
    method: 'GET',
    searchParams: {
      country: 'jp',
      'media	': 'music',
      entity: 'musicTrack',
      term,
      lang: 'ja_jp',
    },
    responseType: 'json',
  })

export async function getAlbum(term: string) {
  const res = await iTunesSearchSong(term).catch(() => {
    error('iTunesSearchError', term)
    // log(e)
    return false as const
  })
  const data = res ? (res.body as ITunesResponse) : null
  if (!data || data.resultCount === 0 || !data.results[0]) return {}

  const {
    collectionName,
    copyright,
    artworkUrl100,
    trackTimeMillis,
    collectionViewUrl,
  } = data.results[0]
  return {
    albumName: collectionName,
    copyright,
    artworkUrl100: artworkUrlScale(artworkUrl100),
    trackTimeMillis,
    itunesUrl: collectionViewUrl,
  }
}
const artworkUrlScale = (url: string) => url.replace(/100x100bb/, '500x500bb') // チートなのでいつまで使えるかわからない
