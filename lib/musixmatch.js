const axios = require('axios').default

const apikey = process.env.MUSIXMATCH_API_KEY

function searchTrack(title, artist) {
  const options = {
    method: 'GET',
    url: 'http://api.musixmatch.com/ws/1.1/track.search',
    params: {
      apikey,
      q_track: title,
      q_artist: artist,
      f_lyrics_language: 'ja',
    },
  }

  return axios.request(options)
}

function getTrack(id) {
  const options = {
    method: 'GET',
    url: 'http://api.musixmatch.com/ws/1.1/track.get',
    params: { apikey, track_id: id },
  }

  return axios.request(options)
}

async function getMusixMatch(title, artist) {
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

async function getMusixLyrics(trackId) {
  const res = await getTrack(trackId).catch((e) => {
    console.error(e)
    return false
  })
  if (!res) return false
  return res.data.message.body.lyrics.lyrics_body
}

module.exports = { getMusixMatch, getMusixLyrics }
