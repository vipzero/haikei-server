import { readFileSync } from 'fs'
const confFilename = './data/conf.json'

type SyncConf = {
  simpleSearch: boolean
}

const defaultConf: SyncConf = {
  simpleSearch: false,
}

const safeJsonReadFileSync = (filename: string): object => {
  try {
    return JSON.parse(readFileSync(filename, 'utf-8'))
  } catch (err) {
    return {}
  }
}

export const getSyncConf = (): SyncConf => {
  return {
    ...defaultConf,
    ...safeJsonReadFileSync(confFilename),
  } as SyncConf
}
