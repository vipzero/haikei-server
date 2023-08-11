import { existsSync, readFileSync, writeFileSync } from 'fs'
import { titleKeyNormalize } from '../anisonDb/anisonDb'
import { Song } from '../types'
import { seriesLib } from './imaslib/seriesLib'
import { eventId } from '../config'

const statusFile = `data/status.${eventId}.json`
type Status = {
  mts: string
}
const initialStatus: Status = {
  mts: '00000',
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

export function addEe(song: Song): Song {
  song.icy.split(' - ').forEach((title) => {
    const titleNorm = titleKeyNormalize(title)
    const mk = byT.get(titleNorm)

    const t = mtsTitles.findIndex((v) => v === titleNorm)
    if (mk === undefined && t === -1) return

    const status = loadStatus()
    if (t >= 0) {
      status.mts = charPut(status.mts, t, '1')
      saveStatus(status)
    }

    song.hedwig = `mts10:${status.mts}`
    if (mk) song.hedwig += ':' + mk
  })

  return song
}
