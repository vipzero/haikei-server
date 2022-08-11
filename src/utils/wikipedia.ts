import axios from 'axios'

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
        revisions: string[]
      }
    }
  }
}

export const searchWikipedia = async (title: string) => {
  const res = await axios.get<SearchResponse>(makeSearchUrl(title))
  if (res.data.query.search.length === 0) return null
  const { pageId } = res.data.query.search[0]

  await axios.get<PageResponse>(makePageUrl(pageId))
}
