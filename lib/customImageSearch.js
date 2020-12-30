const { GCP_CUSTOM_SEARCH_API_KEY, GCP_CUSTOM_SEARCH_ENGINE_ID } = process.env
const axios = require('axios').default

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

const getImageLinks = async (q) => {
  const res = await getImage(q).catch((e) => {
    console.error(e)
    return false
  })
  const imageLinks = res ? res.data.items.map((item) => item.link) : []
  return imageLinks.filter((v) => !blackList.some((blink) => v.includes(blink)))
}

module.exports = { getImage, getImageLinks }
