import got from 'got'

interface MusixmatchResponse {
  message: {
    body: {
      track_list: Array<{
        track: {
          album_name: string
          album_coverart_800x800?: string
          album_coverart_500x500?: string
          album_coverart_350x350?: string
          album_coverart_100x100?: string
          track_id: string
        }
      }>
      lyrics?: {
        lyrics_body: string
      }
    }
  }
}
import { log, error } from '../utils/logger'

const apikey = process.env.MUSIXMATCH_API_KEY

function searchTrack(title: string, artist: string) {
  return got<MusixmatchResponse>(
    'http://api.musixmatch.com/ws/1.1/track.search',
    {
      method: 'GET',
      searchParams: {
        apikey,
        q_track: title,
        q_artist: artist,
        f_has_lyrics: true,
        f_lyrics_language: 'ja',
      },
      responseType: 'json',
    }
  )
}

function getLyrics(id: string) {
  return got<MusixmatchResponse>(
    'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
    {
      method: 'GET',
      searchParams: {
        apikey,
        track_id: id,
      },
      responseType: 'json',
    }
  )
}

export async function getMusixMatch(title: string, artist: string) {
  const res = await searchTrack(title, artist).catch((e: Error) => {
    error('GetMusixMutchError', e.toString())
    return false as const
  })
  if (!res || !res.body.message.body.track_list[0]) return false
  const { track } = res.body.message.body.track_list[0]

  return {
    albumName: track.album_name,
    coverArt:
      track.album_coverart_800x800 ||
      track.album_coverart_500x500 ||
      track.album_coverart_350x350 ||
      track.album_coverart_100x100 ||
      '',
  }
}

export async function getMusixLyrics(title: string, artist: string) {
  const res = await searchTrack(title, artist).catch((e: Error) => {
    error('GetMusixError', e.toString())
    return false as const
  })
  if (!res) return false
  const track = res.body.message.body.track_list[0].track
  if (!track) return false

  const lyricRes = await getLyrics(track.track_id)
  if (!lyricRes) return false
  log(lyricRes.body.message.body)
  if (!track) return false
  // return res.data.message.body.lyrics.lyrics_body
}
