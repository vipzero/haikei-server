import axios from 'axios'
import { log, error } from '../utils/logger'

const apikey = process.env.MUSIXMATCH_API_KEY

function searchTrack(title: string, artist: string) {
  const options = {
    method: 'GET',
    url: 'http://api.musixmatch.com/ws/1.1/track.search',
    params: {
      apikey,
      q_track: title,
      q_artist: artist,
      f_has_lyrics: true,
      f_lyrics_language: 'ja',
    },
  } as const

  return axios.request(options)
}

function getLyrics(id: string) {
  const options = {
    method: 'GET',
    url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
    params: { apikey, track_id: id },
  } as const

  return axios.request(options)
}

export async function getMusixMatch(title: string, artist: string) {
  const res = await searchTrack(title, artist).catch((e) => {
    error('GetMusixMutchError', e)
    return false as const
  })
  if (!res || !res.data.message.body.track_list[0]) return false
  const { track } = res.data.message.body.track_list[0]

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
  const res = await searchTrack(title, artist).catch((e) => {
    error('GetMusixError', e)
    return false as const
  })
  if (!res) return false
  const track = res.data.message.body.track_list[0].track
  if (!track) return false

  const lyricRes = await getLyrics(track.track_id)
  if (!lyricRes) return false
  log(lyricRes.data.message.body)
  if (!track) return false
  // return res.data.message.body.lyrics.lyrics_body
}
