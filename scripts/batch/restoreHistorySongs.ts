import { readFileSync } from 'fs'
import { addHistory } from '../../src/service/firebase'
import { sleep } from '../../src/utils'
import { anaCounts } from '../../src/utils/wordCounts'

const parseLine = (text: string) => {
  const [time, icy] = text.split(',')

  return { time, icy }
}

const importFile = './data/icy.txt'
const text = readFileSync(importFile, 'utf8')

const lines = text.trim().split('\n')

async function main() {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const { icy, time } = parseLine(line)

    await sleep(200)
    if (i === 0 || i === lines.length - 1) {
      console.log(icy)
      console.log(+new Date(time))
    }

    await addHistory(icy.trim(), Number(new Date(time)), 0)
    anaCounts([icy], {}, [], true)
  }
}

main().then(() => console.log('fin'))
