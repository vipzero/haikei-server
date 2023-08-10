import { CacheFileStat } from '../types'
import { log } from './logger'

import chalk from 'chalk'

export type ImageSetupTimeTable = ReturnType<typeof printImageSetupTimeTable>
const decoTime = (ms: number) => {
  const s = `${Math.floor(ms)}ms`.padStart(8)
  if (ms < 1000) {
    return chalk.gray(s)
  } else {
    return chalk.yellow(s)
  }
}
export const printImageSetupTimeTable = (status: CacheFileStat[]) => {
  log('')
  log(
    [
      'url'.padStart(30),
      'dw'.padStart(8),
      'sharp'.padStart(8),
      'jimp'.padStart(8),
    ].join(', '),
    2
  )
  const res = status
    .map((item) => {
      const cols = [item.times.dw, item.times.sharp, item.times.jimp]
      const times = cols
        .map((ms) => (ms ? decoTime(ms) : '-'.padStart(8)))
        .join(', ')
      const sizes = `${printSize(item.size.before)} => ${printSize(
        item.size.sharpReport
      )} => ${printSize(item.size.sharped)} => ${printSize(item.size.jimped)}`
      return `${printId(item.url)
        .substring(0, 30)
        .padStart(30)}, ${times}, ${sizes}`
    })
    .join('\n')
  log(res, 2)
}
const printSize = (size: number) => {
  return chalk.gray(`${(size / 1024).toFixed(1)}KB`)
}
const printId = (str: string) => {
  if (str.length <= 30) return str
  return (
    str.substring(0, 20 - 5) +
    ' ... ' +
    str.substring(str.length - 10, str.length)
  )
}
