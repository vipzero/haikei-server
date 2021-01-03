const { GCP_CUSTOM_SEARCH_API_KEY, GCP_CUSTOM_SEARCH_ENGINE_ID } = process.env
const axios = require('axios').default
const { shuffle } = require('./utils')

const getImage = (q) => {
  const options = {
    method: 'GET',
    url: 'https://www.googleapis.com/customsearch/v1',
    params: {
      q,
      searchType: 'image',
      key: GCP_CUSTOM_SEARCH_API_KEY,
      cx: GCP_CUSTOM_SEARCH_ENGINE_ID,
    },
  }

  return axios.request(options)
}

const blackList = ['static.wikia.nocookie.net']
const white = (v) => !blackList.some((blink) => v.includes(blink))

const getImageLinks = async (q) => {
  // マイナス検索を省く

  const res = await getImage(q.replace(/-/g, ' ')).catch((e) => {
    console.error(e)
    return false
  })
  const imageLinks = res ? res.data.items.map((item) => item.link) : []
  return shuffle(imageLinks.filter(white))
}

module.exports = { getImage, getImageLinks }
