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
    .trim()
    .toLowerCase()
    .replace('　', ' ')
    .replace('（', '(')
    .replace('）', ')')
    .replace('！', '!')
    .replace('？', '?')
const parseWords = (s) =>
  s
    .replace(
      /CV ?|[（［([](CV)? ?|[〈〉（）［］()【】[\]、・：．]| x | - |feat\.?/gi,
      ','
    )
    .split(',')
    .map((v) =>
      v
        .trim()
        .replace(/^[.:：&＆]/, '')
        .trim()
    )

    .filter((v) => !!v && v !== '-')

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
const uniqo = (arr) => {
  const obj = {}
  arr.filter(Boolean).forEach((v) => {
    const nv = textNormalize(v)
    if (!obj[nv]) {
      obj[nv] = v
    } else if (obj[nv] && v !== nv) {
      // ノーマライズされる前の文字を優先する
      obj[nv] = v
    }
  })
  return Object.values(obj)
}

const parseCountWords = (icy, additional = []) => {
  const words = parseWords(icy)
  const entries = uniqo([...additional, ...words])

  return entries
}

const chunk = (array, size) =>
  array.reduce(
    (newarr, _, i) =>
      i % size ? newarr : [...newarr, array.slice(i, i + size)],
    []
  )

module.exports = {
  isHit,
  searchFormat,
  sjisToUtf8,
  sleep,
  chunk,
  shuffle,
  parseCountWords,
  parseWords,
  textNormalize,
  uniq,
  uniqo,
}
