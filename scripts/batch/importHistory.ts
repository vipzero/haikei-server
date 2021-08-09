'use strict'

import { addHistory } from '../../src/lib/firebase'
import { sjisToUtf8, sleep } from '../../src/lib/utils'
import { readFileSync } from 'fs'
import { parse } from 'date-fns'

const parseLine = (text) => {
  // text.split('|').pop() NOTE:  曲名に | が入る場合にエスケープされている瓦家内
  const m = /(?<time>.*?)\|.*?\|.*?\|(?<title>.*)/.exec(text)

  // NOTE '27/Dec/2020:07:13:17 +0900' なんてフォーマット？
  const time = +parse(m.groups.time, 'd/LLL/y:HH:mm:ss X', new Date())
  const { title } = m.groups
  return { time, title }
}

const data = readFileSync('./data/history.txt')
const buf = Buffer.from(data, 'binary') //バイナリバッファを一時的に作成する
const text = sjisToUtf8(buf)

const lines = text.trim().split('\n')
lines.map(parseLine)
async function main() {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const { time, title } = parseLine(line)
    await sleep(200)
    await addHistory(title, time)
  }
}

main()
