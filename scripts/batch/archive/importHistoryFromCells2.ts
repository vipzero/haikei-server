import { readFileSync } from 'fs'
import { addHistory } from '../../../src/service/firebase'
import { sleep } from '../../../src/utils'
import { anaCounts } from '../../../src/utils/wordCounts'

const parseLine = (text: string) => {
  const [time, title] = text.split(',')

  return { time, title }
}

const importFile = './data/20220501_0200-0800.mid.csv'
const text = readFileSync(importFile, 'utf8')

const lines = text.trim().split('\r\n')

async function main() {
  // for (let i = 0; i < 3; i++) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) throw Error('ParseError')
    const { title, time } = parseLine(line)
    if (!title) throw Error('ParseError')

    await sleep(200)
    await addHistory(title.trim(), Number(time), 0)
    anaCounts([title], {}, [], true)

    process.stdout.write('.')
  }
}

main().then(() => console.log('fin'))
