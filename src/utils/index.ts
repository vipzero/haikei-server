import iconv from 'iconv-lite'

export const isHit = (long: string, short: string) => long.indexOf(short) >= 0

const encodingFrom = 'SJIS'
export const sjisToUtf8 = (str: Buffer) => iconv.decode(str, encodingFrom)

export const sleep = (msec: number) => new Promise((rs) => setTimeout(rs, msec))

// frontend と同じ必要あり
export function textNormalize(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace('　', ' ')
    .replace(/[（【「[]/, '(')
    .replace(/[）】」\]]/, ')')
    .replace('！', '!')
    .replace('？', '?')
}
const parseWords = (s: string) =>
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

export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[r]
    a[r] = tmp
  }
  return a
}

export const sample = <T>(arr: T[], n = 1) => shuffle(arr).slice(0, n)

export const uniq = <T>(arr: T[]) => Array.from(new Set(arr))
export const uniqo = (arr: string[]) => {
  const obj: Record<string, string> = {}
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

export const parseCountWords = (icy: string, additional: string[] = []) => {
  const words = parseWords(icy)
  const entries = uniqo([...additional, ...words])

  return entries
}

export const chunk = <T>(array: T[], size: number) =>
  array.reduce<T[][]>(
    (newarr, _, i) =>
      i % size ? newarr : [...newarr, array.slice(i, i + size)],
    []
  )

export const strLen = (s: string) => [...s].length

export const pickCharaIcy = (s: string) =>
  flatten(s.split(' - ').map(pickChara))

const parenL = '(（'
const parenR = ')）'
const parenRsp = ',・，、&＆ '
const parenA = parenL + parenR
const ignoreParen = `[^${parenA}]`

const trimEx = (s: string) =>
  s.replace(RegExp(`^[${parenRsp}]+|[${parenRsp}]+$`, 'g'), '')

const reStr = `([${parenR}]|^)(${ignoreParen}+)([${parenL}|$])`
const regex = new RegExp(reStr, 'g')
export const pickChara = (s: string): string[] => {
  return [...s.trim().matchAll(regex)]
    .map((v) => v[2])
    .filter((v) => Boolean(v) && v !== s)
    .map(trimEx)
}

export const flatten = <T>(arr: T[][]) =>
  arr.reduce<T[]>((a, b) => a.concat(b), [])
