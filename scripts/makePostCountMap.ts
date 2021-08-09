import { readFileSync, writeFileSync, existsSync } from 'fs'
import { sleep } from '../src/lib/utils'

const timeFile = 'data/postTime.json'
const raedFile = (path: string) =>
  existsSync(path) && readFileSync(path, 'utf-8')

const { loadData, saveData } = makeJsonFileIo(timeFile)

loadData
async function main() {}

// watch()
main().then(() => console.log('fin'))
