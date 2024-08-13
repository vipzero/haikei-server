import { CacheFileStat } from '../types'
import { log } from './logger'

import chalk from 'chalk'

const urlLen = 50

export type ImageSetupTimeTable = ReturnType<typeof printImageSetupTimeTable>
const decoTime = (ms: number) => {
  const s = `${Math.floor(ms)}ms`.padStart(7)
  if (ms < 1000) {
    return chalk.gray(s)
  } else {
    return chalk.yellow(s)
  }
}
export const printImageSetupTimeTable = (status: CacheFileStat[]) => {
  log(
    [
      'url'.padStart(urlLen),
      'dw'.padStart(7),
      // 'sharp'.padStart(7),
      // 'jimp'.padStart(7),
    ].join(', '),
    2
  )
  const sum = (a: number, b: number) => a + b
  const totalTime = status
    .map((item) => [item.times.dw, item.times.jimp].reduce(sum))
    .reduce((a, b) => Math.max(a, b), 0)

  const res = status
    .map((item) => {
      const cols = [
        item.times.dw,
        // item.times.jimp
      ]
      const times = cols
        .map((ms) => (ms ? decoTime(ms) : '-'.padStart(7)))
        .join(', ')
      return `${printId(item.url)
        .substring(0, urlLen + 10) // chalk 5 chars x 2
        .padStart(urlLen)}, ${times}`
    })
    .join('\n')
  log(res, 2)
  log(`total time: ${decoTime(totalTime)}`, 2)
}

export const printSize = (size: number) => {
  return chalk.gray(`${(size / 1024).toFixed(1)}KB`)
}
export const printId = (str: string) => {
  const tailLen = 8
  const url2 = str.substring(8) // remove https://
  if (url2.length <= urlLen) return url2
  return (
    url2.substring(0, urlLen - tailLen - 1) +
    chalk.gray('~') +
    url2.substring(url2.length - tailLen, url2.length)
  )
}
