import parse from 'csv-parse/lib/sync'
import fs from 'fs'
import { ProgramRecord, SongRecord, SongSupportAttr } from './types/index'
import { textNormalize } from './utils'

const programFilename = './data/program.csv'
const filenames = ['./data/anison.csv', './data/game.csv', './data/sf.csv']
const anisonFilename = './data/animesong.csv'

const programs: Record<string, ProgramRecord> = {}
const songs: { [title: string]: { [song: string]: SongRecord } } = {}
const animes: { [title: string]: { [song: string]: SongSupportAttr } } = {}
const songsSa: { [song: string]: { [title: string]: SongRecord } } = {}

const data = fs.readFileSync(programFilename, 'utf-8')
const anisonData = fs.readFileSync(anisonFilename, 'utf-8')
const csvOptions = { trim: true, header: false, skipLinesWithError: true }

const parsedLines = parse(data, csvOptions) as string[][]
parsedLines.forEach(
  ([programId, category, gameType, animeTitle, , , , chapNum, , date]) => {
    programs[programId] = { category, gameType, animeTitle, chapNum, date }
  }
)
const anisonLines = parse(anisonData, csvOptions) as string[][]

anisonLines.forEach(
  ([animeTitle, title, artist, writer, composer, arranger]) => {
    if (!animes[keyNormalize(artist)]) animes[keyNormalize(artist)] = {}
    animes[keyNormalize(artist)][keyNormalize(title)] = {
      animeTitle,
      artist,
      writer,
      composer,
      arranger,
    }
  }
)

filenames.forEach((filename) => {
  const headerAlias = 'programId,media,animeTitle,opOrEd,spNum,id,title,artist'
  const lines = fs.readFileSync(filename, 'utf-8').split('\n')
  lines[0] = headerAlias
  const data = lines.join('\n')

  const rows: string[][] = parse(data, {
    trim: true,
    // header: false, // NOTE: type に含まれてなかったから消しちゃうけどどうにでもなれー！
    skipLinesWithError: true,
  })

  rows.forEach(
    ([programId, , , opOrEd, spInfo, songId, titleBase, artistBase]) => {
      const title = keyNormalize(titleBase || '')
      const artist = keyNormalize(artistBase || '')
      // if (!songs[title]) songs[title] = {}
      if (!songs[artist]) songs[artist] = {}
      const song = {
        opOrEd: opOrEd || '',
        spInfo: spInfo || '',
        songId: songId || '',
        title: titleBase,
        artist: artistBase,
        ...programs[programId],
      }
      songs[artist][title] = song
    }
  )
})

export function keyNormalize(str: string) {
  return textNormalize(str)
    .replace(/\(.*?\)/g, '')
    .replace(/ /g, '')
    .toLowerCase()
}

export { songsSa, animes }
export default songs
