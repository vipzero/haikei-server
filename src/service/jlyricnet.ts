import got from 'got'
import { load } from 'cheerio'

const defaultOptions = {
  timeout: 1000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  },
}

function searchJlyrics(title: string, artist: string | null) {
  const params: Record<string, string | number> = {
    kt: title,
    ct: 2,
    cl: 0,
  }
  if (artist) {
    params.ka = artist
    params.ca = 2
  }
  return got('https://search3.j-lyric.net/index.php', {
    method: 'GET',
    searchParams: params,
    responseType: 'text',
    ...defaultOptions,
  }).catch(() => false as const)
}

// function searchJlyricsResult(title, artist) {

// }

function scrapeFirstResult(html: string) {
  const $ = load(html)
  return $('#mnb a').attr('href')
}

function scrapeLyrics(html: string) {
  const $ = load(html)
  $('#Lyric').find('br').replaceWith('\n')
  $('.lbdy').find('br').replaceWith('\n')

  const lyric = $('#Lyric').text()
  const creators: { singer?: string; composer?: string; writer?: string } = {}
  $('.lbdy p').each((i, $p) => {
    const text = $($p).text()

    const ms = /歌：(.*)/.exec(text)
    if (ms) creators.singer = ms[1]

    const mc = /作詞：(.*)/.exec(text)
    if (mc) creators.composer = mc[1]

    const mw = /作曲：(.*)/.exec(text)
    if (mw) creators.writer = mw[1]
  })
  // const writer = /編曲：(.*)/.exec($('.lbdy').innerText)[1] // ある？

  return { lyric, creators }
}

export async function getLyricsSafe(title?: string, artist?: string) {
  if (process.env.JLYRICNET_ON !== '1') return { creators: {}, lyric: null }

  const res = await getLyrics(title, artist)
  if (!res) return { creators: {}, lyric: null }
  return res
}
export async function getLyrics(title?: string, artist?: string) {
  if (!title || !artist) return false

  const res = await searchJlyrics(title, artist.split(',')[0]!)
  let articleLink = undefined
  if (res) {
    articleLink = scrapeFirstResult(res.body)
  }
  if (!articleLink) {
    const res = await searchJlyrics(title, null)
    if (!res) return false
    articleLink = scrapeFirstResult(res.body)
  }
  if (!articleLink) return false

  const articleRes = await got(articleLink, {
    responseType: 'text',
    ...defaultOptions,
  }).catch(() => false as const)
  if (!articleRes) return false

  return scrapeLyrics(articleRes.body)
}
