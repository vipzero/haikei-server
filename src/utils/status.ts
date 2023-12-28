import { existsSync, readFileSync, writeFileSync } from 'fs'
import { eventId } from '../config'
import { initialNames } from './iamsEeNames'

const statusFile = `data/status.${eventId}.json`

type Status = {
  mts: string
  idols: string[]
}
const initialStatus: Status = {
  mts: '00000',
  idols: initialNames,
}
export const saveStatus = (status: Status) =>
  writeFileSync(statusFile, JSON.stringify(status))

export const loadStatus = (): Status => {
  if (!existsSync(statusFile)) saveStatus(initialStatus)

  return JSON.parse(readFileSync(statusFile, 'utf-8')) as Status
}
