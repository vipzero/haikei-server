import axios from 'axios'

const apikey = process.env.MUSIXMATCH_API_KEY

function searchTrack(title, artist) {
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
  }

  return axios.request(options)
}

function getLyrics(id) {
  const options = {
    method: 'GET',
    url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
    params: { apikey, track_id: id },
  }

  return axios.request(options)
}

export async function getMusixMatch(title, artist) {
  const res = await searchTrack(title, artist).catch((e) => {
    console.error(e)
    return false
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

export async function getMusixLyrics(title, artist) {
  const res = await searchTrack(title, artist).catch((e) => {
    console.error(e)
    return false
  })
  if (!res) return false
  const track = res.data.message.body.track_list[0].track
  if (!track) return false

  const lyricRes = await getLyrics(track.track_id)
  if (!lyricRes) return false
  console.log(lyricRes.data.message.body)
  if (!track) return false
  console.log()
  // return res.data.message.body.lyrics.lyrics_body
}
