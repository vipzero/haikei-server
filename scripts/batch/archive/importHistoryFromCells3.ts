import { readFileSync } from 'fs'
import { addHistory } from '../../../src/service/firebase'
import { sleep } from '../../../src/utils'
import { anaCounts } from '../../../src/utils/wordCounts'

const parseLine = (text: string) => {
  const [title, artist, time] = text.split(',')

  return { time, title: `${title} - ${artist}` }
}

const importFile = './data/archive/history_1214.txt'
const text = readFileSync(importFile, 'utf8')

const lines = text.trim().split('\n')

async function main() {
  // for (let i = 0; i < 3; i++) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const { title, time } = parseLine(line)

    await sleep(200)

    await addHistory(title.trim(), Number(time), 0)
    anaCounts([title], {}, [], true)

    process.stdout.write('.')
  }
}

main().then(() => console.log('fin'))
