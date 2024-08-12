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
      return `${printId(item.url).substring(0, 30).padStart(30)}, ${times}`
    })
    .join('\n')
  log(res, 2)
  log(`total time: ${decoTime(totalTime)}`)
}

export const printSize = (size: number) => {
  return chalk.gray(`${(size / 1024).toFixed(1)}KB`)
}
const printId = (str: string) => {
  if (str.length <= urlLen) return str.substring(8) // remove https://
  const tailLen = 10
  return (
    str.substring(8, urlLen - tailLen - 1) +
    chalk.gray('~') +
    str.substring(str.length - 10, str.length)
  )
}
