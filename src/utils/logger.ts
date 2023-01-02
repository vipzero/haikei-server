/* eslint-disable no-console */
import chalk from 'chalk'

export const log = console.log
export const info = (str: string | number | object) =>
  console.log(chalk.gray(str))
export const error = (key: string, description: string) => {
  console.error(chalk.red(`${key}: ${description}`))
}
export const warn = (str: string | number | object) =>
  console.warn(chalk.yellow(str))

export const warnDesc = (key: string, description: string) => {
  console.warn(chalk.yellow(`${key}: ${description}`))
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
