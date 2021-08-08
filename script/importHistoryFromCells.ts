import { parse } from 'date-fns'
import { readFileSync } from 'fs'
import { addHistory } from '../lib/firebase'
import { sleep } from '../lib/utils'
import { anaCounts } from '../lib/wordCounts'

const parseLine = (text: string) => {
  const [timeRaw, title] = text.split('\t')

  const time = +parse(timeRaw, 'yyyy/MM/dd HH:mm:ss', new Date())

  return { time, title }
}

const text = readFileSync('./data/history2.txt', 'utf8').trim()

const lines = text.trim().split('\n')

async function main() {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const { title, time } = parseLine(line)
    await sleep(200)
    await addHistory(title, time)
    anaCounts(title, {})

    process.stdout.write('.')
  }
  console.log('')
}

main().then(() => console.log('fin'))