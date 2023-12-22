import axios from 'axios'
import { load } from 'cheerio'

const qp = {
  format: 'json',
  action: 'query',
}

const url = 'https://ja.wikipedia.org/w/api.php'
export const makePageUrl = (pageId: string | number) =>
  `${url}/?${new URLSearchParams({
    ...qp,
    prop: 'revisions',
    rvprop: 'content',
    rvparse: '',
    pageids: String(pageId),
  }).toString()}`
export const makeSearchUrl = (title: string) =>
  `${url}/?${new URLSearchParams({
    ...qp,
    list: 'search',
    srsearch: title,
  }).toString()}`

type SearchResponse = { query: { search: { pageId: number }[] } }

type PageResponse = {
  query: {
    pages: {
      [pageId: number | string]: {
        pageid: number
        ns: 0
        title: string
        revisions: { '*': string }[]
      }
    }
  }
}

export const searchWikipedia = async (title: string) => {
  const res = await axios.get<SearchResponse>(makeSearchUrl(title))
  const search = res.data.query.search[0]
  if (!search) return null
  const { pageId } = search

  const res2 = await axios.get<PageResponse>(makePageUrl(pageId))
  const html = res2.data.query.pages[pageId]?.revisions[0]?.['*']
  if (!html) return null

  const $ = load(html)
  $
}
