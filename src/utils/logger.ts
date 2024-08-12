/* eslint-disable no-console */
import chalk from 'chalk'

export const logLine = (str: string) => process.stdout.write(chalk.gray(str))
const LOG_LEVEL = Number(process.env.LOG_LEVEL || 1)

type Level = 0 | 1 | 2

const queue: unknown[] = []
let keep = false
export const log = (s: unknown, level: Level = 1, withoutKeep = false) => {
  if (level > LOG_LEVEL) return
  if (!withoutKeep && keep) {
    queue.push(s)
    return
  }
  console.log(s)
}

export const logKeepStart = () => {
  keep = true
  queue.length = 0
}
export const logKeepEnd = () => {
  keep = false
  queue.forEach((s) => console.log(s))
  queue.length = 0
}
export const info = (str: string | number | object, level: Level = 1) =>
  log(chalk.gray(str), level)
export const error = (key: string, description: string, level: Level = 1) => {
  log(chalk.red(`${key}: ${description}`), level)
}
export const warn = (str: string | number | object, level: Level = 1) =>
  log(chalk.yellow(str), level)

export const warnDesc = (key: string, desc: string, level: Level = 1) => {
  log(chalk.yellow(`${key}: ${desc}`), level)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const songPrint = (song: any) => {
  console.log(
    `
{ ti: '${val(song.title)}', ar: '${val(song.artist.substring(0, 30))}',${
      (song.animeTitle &&
        `
  at: '${val(song.animeTitle)}', ca: '${val(song.category)}', }
  ot: '${val(song.opOrEd)}:${val(song.spInfo)}:${val(song.songId)}:${val(
          song.gameType
        )}:${val(song.chapNum)}:${val(song.date)}',`) ??
      ``
    }
`.trim()
    // writer: '${val(song.writer)}', composer: '${val(song.composer)}', arranger: '${val(song.arranger)}', }
  )
}

const val = (v?: string) => (v ? chalk.green(v) : chalk.gray('none'))
