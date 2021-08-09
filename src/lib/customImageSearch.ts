const { GCP_CUSTOM_SEARCH_API_KEY, GCP_CUSTOM_SEARCH_ENGINE_ID } = process.env
import axios from 'axios'
import { shuffle } from './utils'

export const getImage = (q: string) => {
  return axios.request<{ items: { link: string }[] }>({
    method: 'GET',
    url: 'https://www.googleapis.com/customsearch/v1',
    params: {
      q,
      searchType: 'image',
      key: GCP_CUSTOM_SEARCH_API_KEY || '',
      cx: GCP_CUSTOM_SEARCH_ENGINE_ID || '',
    },
  })
}

const blackList = ['static.wikia.nocookie.net', 'amazon.com']
const white = (v: string) => !blackList.some((blink) => v.includes(blink))

export const getImageLinks = async (q: string) => {
  // マイナス検索を省く

  const res = await getImage(q.replace(/-/g, ' ')).catch((e) => {
    console.error(e)
    return false as const
  })
  const imageLinks = res ? (res.data.items || []).map((item) => item.link) : []
  return shuffle(imageLinks.filter(white))
}
