import got from 'got'
import { error, info, log } from '../utils/logger'
import { customImageblackList, imageLookLimit } from '../config'
const { GCP_CUSTOM_SEARCH_API_KEY, GCP_CUSTOM_SEARCH_ENGINE_ID } = process.env

interface CustomSearchResponse {
  items: { link: string }[]
}

export const getImage = (q: string) => {
  info(`search q: ${q}`)
  return got<CustomSearchResponse>(
    'https://www.googleapis.com/customsearch/v1',
    {
      method: 'GET',
      searchParams: {
        q,
        searchType: 'image',
        key: GCP_CUSTOM_SEARCH_API_KEY || '',
        cx: GCP_CUSTOM_SEARCH_ENGINE_ID || '',
        lr: 'lang_ja',
      },
      responseType: 'json',
    }
  )
}

const white = (v: string) =>
  !customImageblackList.some((blink) => v.includes(blink))

export const getImageLinks = async (q: string) => {
  // マイナス検索を省く

  const res = await getImage(q).catch((e: Error) => {
    error('GetImageError', q)
    log(e)
    return false as const
  })
  const imageLinks = res
    ? (res.body.items || []).map((item: { link: string }) => item.link)
    : []
  return imageLinks.filter(white).splice(0, imageLookLimit)
}
