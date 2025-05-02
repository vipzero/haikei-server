import got from 'got'
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
  const res = await got<SearchResponse>(makeSearchUrl(title), {
    responseType: 'json',
  })
  const search = res.body.query.search[0]
  if (!search) return null
  const { pageId } = search

  const res2 = await got<PageResponse>(makePageUrl(pageId), {
    responseType: 'json',
  })
  const html = res2.body.query.pages[pageId]?.revisions[0]?.['*']
  if (!html) return null

  const $ = load(html)
  $
}
