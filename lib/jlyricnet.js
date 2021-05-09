import axios from 'axios'
import cheerio from 'cheerio'

function searchJlyrics(title, artist) {
  const params = {
    kt: title,
    ct: 2,
    cl: 0,
  }
  if (artist) {
    params.ka = artist
    params.ca = 2
  }
  const options = {
    method: 'GET',
    url: 'https://search2.j-lyric.net/index.php',
    params,
  }

  return axios.request(options)
}

// function searchJlyricsResult(title, artist) {

// }

function scrapeFirstResult(html) {
  const $ = cheerio.load(html)
  return $('#mnb a').attr('href')
}

function scrapeLyrics(html) {
  const $ = cheerio.load(html)
  $('#Lyric').find('br').replaceWith('\n')
  $('.lbdy').find('br').replaceWith('\n')

  const lyric = $('#Lyric').text()
  const creators = {}
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

export async function getLyrics(title, artsit) {
  const res = await searchJlyrics(title, artsit.split(',')[0])
  let articleLink = scrapeFirstResult(res.data)
  if (!articleLink) {
    const res = await searchJlyrics(title, null)
    articleLink = scrapeFirstResult(res.data)
  }
  if (!articleLink) return false

  const articleRes = await axios.request(articleLink)
  if (!res) return false

  return scrapeLyrics(articleRes.data)
}
