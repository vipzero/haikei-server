import iconv from 'iconv-lite'

const searchFormat = (s) => s.replace(' ', '').toLowerCase()
export const isHit = (long, short) =>
  searchFormat(long).indexOf(searchFormat(short)) >= 0

const encodingFrom = 'SJIS'
export const sjisToUtf8 = (str) => iconv.decode(str, encodingFrom)

export const sleep = (msec) =>
  new Promise((resolve) => setTimeout(resolve, msec))

// frontend と同じ必要あり
export function textNormalize(s) {
  return s
    .trim()
    .toLowerCase()
    .replace('　', ' ')
    .replace('（', '(')
    .replace('）', ')')
    .replace('！', '!')
    .replace('？', '?')
}
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

export const shuffle = (arr) => {
  const a = [...arr]
  for (var i = a.length - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1))
    var tmp = a[i]
    a[i] = a[r]
    a[r] = tmp
  }
  return a
}

export const sample = (arr, n) => shuffle(arr).slice(0, n)

export const uniq = (arr) => Array.from(new Set(arr))
export const uniqo = (arr) => {
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

export const parseCountWords = (icy, additional = []) => {
  const words = parseWords(icy)
  const entries = uniqo([...additional, ...words])

  return entries
}

export const chunk = (array, size) =>
  array.reduce(
    (newarr, _, i) =>
      i % size ? newarr : [...newarr, array.slice(i, i + size)],
    []
  )
