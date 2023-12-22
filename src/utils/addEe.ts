import { existsSync, readFileSync, writeFileSync } from 'fs'
import { titleKeyNormalize } from '../anisonDb/anisonDb'
import { Song } from '../types'
import { seriesLib } from './imaslib/seriesLib'
import { eventId } from '../config'

const statusFile = `data/status.${eventId}.json`
const namesFile = `data/names.txt`

const nameText = existsSync(namesFile) ? readFileSync(namesFile, 'utf-8') : ''
const nameGroups = nameText
  .trim()
  .split('\n\n')
  .map((lines) => lines.split('\n'))
// ['a', 'b'] => { 'a': true, 'b': true }

const nameGroupMap = new Map(
  nameGroups
    .map((names, i) => names.map((name, j) => [name, [i, j]] as const))
    .flat()
)

const initialNames = nameGroups.map((names) =>
  boolsToBase64(Array(names.length).fill(false))
)

const exist = <T>(v: T | undefined): v is T => v !== undefined
export const imasIdols = (
  keys: string[]
): (readonly [number, number])[] | null => {
  const hitNames = keys
    .map((k) => k.replace(' ', ''))
    .map((k) => nameGroupMap.get(k))
    .filter(exist)
  if (0 < hitNames.length && hitNames.length <= 7) {
    return hitNames
  } else {
    return null
  }
}

type Status = {
  mts: string
  idols: string[]
}
const initialStatus: Status = {
  mts: '00000',
  idols: initialNames,
}
const saveStatus = (status: Status) =>
  writeFileSync(statusFile, JSON.stringify(status))

const loadStatus = (): Status => {
  if (!existsSync(statusFile)) saveStatus(initialStatus)

  return JSON.parse(readFileSync(statusFile, 'utf-8')) as Status
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

const status = loadStatus()
export function addEe(song: Song): Song {
  song.icy.split(' - ').forEach((title) => {
    const titleNorm = titleKeyNormalize(title)
    const mk = byT.get(titleNorm)

    const t = mtsTitles.findIndex((v) => v === titleNorm)
    const idols = imasIdols(Object.keys(song.wordCounts || {}))
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

function boolsToBase64(ba: boolean[]) {
  const boolBuffer = new Uint8Array(ba.map((value) => (value ? 1 : 0)))
  const boolArrayBuffer = boolBuffer.buffer
  const base64String = btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(boolArrayBuffer)))
  )
  return base64String
}

function base64toBools(a: string) {
  const binaryString = atob(a)
  const boolArrayBuffer = new ArrayBuffer(binaryString.length)
  const boolArray = new Uint8Array(boolArrayBuffer)
  for (let i = 0; i < binaryString.length; i++) {
    boolArray[i] = binaryString.charCodeAt(i)
  }
  const decodedBoolArray = Array.from(boolArray, (value) => value === 1)
  return decodedBoolArray
}
