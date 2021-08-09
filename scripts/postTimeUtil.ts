import { readFileSync, writeFileSync, existsSync } from 'fs'
const timeFile = 'data/postTime.json'
const raedFile = (path: string) =>
  existsSync(path) && readFileSync(path, 'utf-8')

type PostData = { [url: string]: { [time: number]: true } }

const makeJsonFileIo = (path: string) => ({
  loadData: () => JSON.parse(raedFile(path) || '{}') as PostData,
  saveData: (data: PostData) => writeFileSync(path, JSON.stringify(data)),
})

export const { loadData, saveData } = makeJsonFileIo(timeFile)
