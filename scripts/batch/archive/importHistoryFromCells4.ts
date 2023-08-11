import { readFileSync } from 'fs'
// import { addHistory } from '../../src/service/firebase'
import { sleep } from '../../../src/utils'
// import { anaCounts } from '../../src/utils/wordCounts'
import { DateTime } from 'luxon'

const parseLine = (text: string) => {
  const [time, ...icys] = text.split(' ')
  const icy = icys.join(' ')

  return { time, title: icy }
}

const importFile = './data/archive/history_2023gw0501.utf.txt'
const text = readFileSync(importFile, 'utf8')

const lines = text.trim().split('\r\n')

async function main() {
  // for (let i = 0; i < 3; i++) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const { time: timeStr } = parseLine(line)

    await sleep(200)
    // 01/May/2023:05:19:32
    const time = DateTime.fromFormat(timeStr, 'dd/MMM/yyyy:HH:mm:ss')
      .setLocale('ja')
      .toMillis()
    if (i === 0) console.log('start1: ', time)
    if (i === 1) console.log('start2: ', time)
    if (i === lines.length - 1) console.log('end: ', time)

    // await addHistory(title.trim(), Number(time), 0)
    // anaCounts([title], {}, [], true)

    // process.stdout.write('.')
  }
}

main().then(() => console.log('fin'))
