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
    url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
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
  const item = res.data.message.body.track_list[0]
  console.log(item.track)
  const res2 = await getTrack(item.track.track_id).catch((e) => {
    console.error(e)
    return false
  })
  if (!res2) return false

  return res2.data.message.body.lyrics
}
module.exports = { getMusixMatch }
