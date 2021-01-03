const iconv = require('iconv-lite')

const searchFormat = (s) => s.replace(' ', '').toLowerCase()
const isHit = (long, short) =>
  searchFormat(long).indexOf(searchFormat(short)) >= 0

const encodingFrom = 'SJIS'
const sjisToUtf8 = (str) => iconv.decode(str, encodingFrom)

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))

// frontend と同じ必要あり
const textNormalize = (s) =>
  s
    .toLowerCase()
    .replace('　', ' ')
    .replace('（', '(')
    .replace('）', ')')
    .replace('！', '!')
    .replace('？', '?')
const parseWords = (s) =>
  s
    .replace(
      /CV[.:] ?|[（［([](CV)?[.:]? ?|[〈〉（［([)）\]、］・：]| x | - |feat\.?/gi,
      ','
    )
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v !== '' && v !== '-')

const shuffle = (arr) => {
  const a = [...arr]
  for (var i = a.length - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1))
    var tmp = a[i]
    a[i] = a[r]
    a[r] = tmp
  }
  return a
}
const uniq = (arr) => Array.from(new Set(arr))

const parseCountWords = (icy, counts, additional = []) => {
  const words = parseWords(icy)
  const entries = uniq([...additional, ...words])
  // const [a, t] = title.split(' - ')
  // if (t) {
  //   const revTitle = t + ' - ' + a
  //   entries.push(revTitle)
  // }

  entries
    .filter(Boolean)
    .map(textNormalize)
    .forEach((v) => {
      counts[v] = (counts[v] || 0) + 1
    })
  return [counts, entries]
}

module.exports = {
  isHit,
  searchFormat,
  sjisToUtf8,
  sleep,
  shuffle,
  parseCountWords,
  parseWords,
  textNormalize,
  uniq,
}
