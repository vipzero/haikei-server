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
module.exports = { getImage }
