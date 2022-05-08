import iconv from 'iconv-lite'
import toWideKatakana from 'jaco/fn/toWideKatakana'
import toNarrowAlphanumeric from 'jaco/fn/toNarrowAlphanumeric'

export const isHit = (long: string, short: string) => long.indexOf(short) >= 0

const encodingFrom = 'SJIS'
export const sjisToUtf8 = (str: Buffer) => iconv.decode(str, encodingFrom)

export const sleep = (msec: number) => new Promise((rs) => setTimeout(rs, msec))

// frontend と同じ必要あり
export function textNormalize(s: string) {
  return toNarrowAlphanumeric(
    toWideKatakana(
      s
        .trim()
        .toLowerCase()
        .replace(/　/g, ' ')
        .replace(/[（【「[]/g, '(')
        .replace(/[）】」\]]/g, ')')
        .replace(/〜/g, '~')
        .replace(/！/g, '!')
        .replace(/？/g, '?')
    )
  )
}
const SP =
  /CV ?|[（［([](CV)? ?|[〈〉（）［］()【】[\]、・：．]| x | - |feat\.?/gi
const isTagWord = (v: string) => !!v && v !== '-'
const trimWord = (v: string) =>
  v
    .trim()
    .replace(/^[.:：&＆]/, '')
    .trim()

const parseWords = (s: string) =>
  s.replace(SP, ',').split(',').map(trimWord).filter(isTagWord)

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
