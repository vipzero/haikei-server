import { existsSync, readFileSync, writeFileSync } from 'fs'
import { titleKeyNormalize } from '../anisonDb/anisonDb'
import { Song } from '../types'
const eventId = process.env.EVENT_ID

const statusFile = `data/status.${eventId}.json`
type Status = {
  mts: string
}
const initialStatus: Status = {
  mts: '00000',
}
const saveStatus = (status: Status) => {
  writeFileSync(statusFile, JSON.stringify(status))
}

const loadStatus = (): Status => {
  if (!existsSync(statusFile)) saveStatus(initialStatus)

  return JSON.parse(readFileSync(statusFile, 'utf-8')) as Status
}

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

    const t = mtsTitles.findIndex((v) => v === titleNorm)
    if (t === -1) return

    const status = loadStatus()
    status.mts = charPut(status.mts, t, '1')
    saveStatus(status)

    song.hedwig = `mts10:${charPut(status.mts, t, '1')}`
  })

  return song
}
