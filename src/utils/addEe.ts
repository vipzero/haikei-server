import { readFileSync } from 'fs'
import { titleKeyNormalize } from '../anisonDb/anisonDb'
import { Song } from '../types'
import {
  base64toBools,
  boolsToBase64,
  membersByUnitName,
  nameGroupMap,
} from './iamsEeNames'
import { seriesLib } from './imaslib/seriesLib'
import { loadStatus, saveStatus } from './status'

const birthdayFile = `data/birthday.json`

const exist = <T>(v: T | undefined): v is T => v !== undefined
export const imasIdols = (
  tags: string[],
  artist: string
): (readonly [number, number])[] | null => {
  const hitNames2 = membersByUnitName(artist) || []
  const hitNames = [...tags, ...hitNames2]
    .map((k) => k.replace(' ', ''))
    .map((word) => membersByUnitName(word) || [word])
    .flat()
    .map((char) => nameGroupMap.get(char))
    .filter(exist)

  if (0 < hitNames.length && hitNames.length <= 7) {
    return hitNames
  } else {
    return null
  }
}

const byT: Map<string, string> = new Map()
seriesLib.map(({ names, k }) => {
  names
    .trim()
    .split('\n')
    .map(titleKeyNormalize)
    .forEach((t) => {
      byT.set(t, k)
    })
})

const range = (s: number) => [...Array(s).keys()]

export const startWithMatch = <T>(s: string, lib: Map<string, T>) =>
  range(s.length - 1).find(
    (i) => lib.get(s.substring(0, s.length - i)) || false
  )
export const startWithMatchMt = (s: string) => startWithMatch(s, byT)
export const mtsTitles = [
  'Crossing!',
  'Criminally Dinner ～正餐とイーヴルナイフ～',
  'スペードのQ',
  'KING of SPADE',
  'ESPADA',
].map(titleKeyNormalize)
const charPut = (s: string, i: number, c: string) =>
  s.substring(0, i) + c + s.substring(i + 1)
const birthdayData = JSON.parse(
  readFileSync(birthdayFile, 'utf-8')
) as unknown as {
  [date: string]: { name: string; anime: string }[]
}
const getBirthdayChars = (mmdd: string) => {
  const namesDict: Record<string, { name: string; anime: string }> = {}

  // データを走査して名前を抽出し、辞書に追加する
  for (const entry of birthdayData[mmdd] || []) {
    namesDict[entry.name.trim().replace(/ /g, '')] = entry
    if (entry.anime.trim()) {
      namesDict[entry.anime.trim()] = entry
    }
  }
  return namesDict
}

const status = loadStatus()
export function addEe(
  song: Song,
  today: Date = new Date(),
  words: string[] | null = null
): Song {
  song.icy.split(' - ').forEach((title) => {
    const titleNorm = titleKeyNormalize(title)
    const mk = byT.get(titleNorm)

    const t = mtsTitles.findIndex((v) => v === titleNorm)
    const tags = words || Object.keys(song.wordCounts || {})
    const dayKey = today.toLocaleDateString('ja-JP', {
      month: '2-digit',
      day: '2-digit',
    })

    const chars = getBirthdayChars(dayKey.replace('/', ''))

    const tag = tags.find((v) => chars[v])
    const findTitle = chars[tag || '']
    if (findTitle) {
      song.hedwig = `birth:${dayKey}:${findTitle.name}:${findTitle.anime}`
      return
    }
    const idols = imasIdols(tags, title)
    if (idols && idols.length > 0) {
      const bins = status.idols.map(base64toBools)
      idols.forEach(([i, j]) => {
        bins[i]![j] = true
      })
      status.idols = bins.map(boolsToBase64)
      song.hedwig = `mts10:::${status.idols.join(',')}`
      saveStatus(status)
    }
    if (mk === undefined && t === -1) return

    if (t >= 0) {
      status.mts = charPut(status.mts, t, '1')
      saveStatus(status)
    }

    song.hedwig = `mts10:${status.mts}:${mk || ''}:${status.idols.join(',')}`
  })

  return song
}
