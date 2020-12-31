const iconv = require('iconv-lite')

const searchFormat = (s) => s.replace(' ', '').toLowerCase()
const isHit = (long, short) =>
  searchFormat(long).indexOf(searchFormat(short)) >= 0

const encodingFrom = 'SJIS'
const sjisToUtf8 = (str) => iconv.decode(str, encodingFrom)

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))
const parseWords = (s) =>
  s
    .replace(
      /CV\. ?|[（［([](CV)?\.? ?|[〈〉（［([)）\]、］]| - |feat\.?/gi,
      ','
    )
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v !== '')

const parseCountWords = (title, counts) => {
  const words = parseWords(title)
  const entries = [...words, title]
  // const [a, t] = title.split(' - ')
  // if (t) {
  //   const revTitle = t + ' - ' + a
  //   entries.push(revTitle)
  // }

  entries.forEach((v) => {
    counts[v] = (counts[v] || 0) + 1
  })
  return [counts, entries]
}

module.exports = {
  isHit,
  searchFormat,
  sjisToUtf8,
  sleep,
  parseCountWords,
  parseWords,
}
