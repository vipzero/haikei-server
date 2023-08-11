/* eslint-disable no-console */
import chalk from 'chalk'

export const logLine = (str: string) => process.stdout.write(chalk.gray(str))
const LOG_LEVEL = Number(process.env.LOG_LEVEL || 1)

type Level = 0 | 1 | 2
export const log = (s: unknown, level: Level = 1) => {
  if (level > LOG_LEVEL) return
  console.log(s)
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
{ title: '${val(song.title)}', artist: '${val(song.artist)}',${
      song.animeTitle &&
      `
  animeTitle: '${val(song.animeTitle)}', category: '${val(song.category)}',
  opt: '${val(song.opOrEd)}:${val(song.spInfo)}:${val(song.songId)}:${val(
        song.gameType
      )}:${val(song.chapNum)}:${val(song.date)}',`
    }
  writer: '${val(song.writer)}', composer: '${val(
      song.composer
    )}', arranger: '${val(song.arranger)}', }
`.trim()
  )
}

const val = (v?: string) => (v ? chalk.green(v) : chalk.gray('none'))
