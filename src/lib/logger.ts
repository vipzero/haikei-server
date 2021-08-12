/* eslint-disable no-console */
import chalk from 'chalk'

export const log = console.log
export const info = (str: string | number | object) =>
  console.log(chalk.gray(str))
export const error = (key: string, description: string) => {
  console.error(chalk.red(`${key}: ${description}`))
}

export const warn = (key: string, description: string) => {
  console.warn(chalk.red(`${key}: ${description}`))
}

export const songPrint = (song: any) => {
  console.log(
    `
{ title: '${song.title}', artist: '${song.artist}',
  animeTitle: '${song.animeTitle}', category: '${song.category}',
  opt: '${song.opOrEd}:${song.spInfo}:${song.songId}:${song.gameType}:${song.chapNum}:${song.date}',
  writer: '${song.writer}', composer: '${song.composer}', arranger: '${song.arranger}', }
`.trim()
  )
}
