import axios from 'axios'
import { error, info, log } from '../utils/logger'
const { GCP_CUSTOM_SEARCH_API_KEY, GCP_CUSTOM_SEARCH_ENGINE_ID } = process.env

export const getImage = (q: string) => {
  info(`search q: ${q}`)
  return axios.request<{ items: { link: string }[] }>({
    method: 'GET',
    url: 'https://www.googleapis.com/customsearch/v1',
    params: {
      q,
      searchType: 'image',
      key: GCP_CUSTOM_SEARCH_API_KEY || '',
      cx: GCP_CUSTOM_SEARCH_ENGINE_ID || '',
      lr: 'lang_ja',
    },
  })
}

const blackList = [
  'static.wikia.nocookie.net',
  'amazon.com',
  'fril.jp',
  'shopping.yahoo.co.jp',
  'static.mercdn.net',
]
const white = (v: string) => !blackList.some((blink) => v.includes(blink))

export const getImageLinks = async (q: string) => {
  // マイナス検索を省く

  const res = await getImage(q.replace(/-/g, ' ')).catch((e) => {
    error('GetImageError', q)
    log(e)
    return false as const
  })
  const imageLinks = res ? (res.data.items || []).map((item) => item.link) : []
  return imageLinks.filter(white)
}
