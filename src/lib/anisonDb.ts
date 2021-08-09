import parse from 'csv-parse/lib/sync'
import fs from 'fs'
import { ProgramRecord, SongRecord } from './types/index'
import { strLen } from './utils'

const programFilename = './data/program.csv'
const filenames = ['./data/anison.csv', './data/game.csv', './data/sf.csv']
// 'anime,title,artist,writer,composer,arranger'

let programs: Record<string, ProgramRecord> = {}
let songs: { [title: string]: { [song: string]: SongRecord } } = {}
let songsSa: { [song: string]: { [title: string]: SongRecord } } = {}

const data = fs.readFileSync(programFilename, 'utf-8')
const csvOptions = { trim: true, header: false, skipLinesWithError: true }

const parsedLines = parse(data, csvOptions) as string[][]
parsedLines.forEach(
  ([programId, category, gameType, animeTitle, , , , chapNum, , date]) => {
    programs[programId] = { category, gameType, animeTitle, chapNum, date }
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
      if (!songs[title]) songs[title] = {}
      // if (!songs[artist]) songs[artist] = {}
      const song = {
        opOrEd: opOrEd || '',
        spInfo: spInfo || '',
        songId: songId || '',
        title: titleBase,
        artist: artistBase,
        ...programs[programId],
      }
      songs[title][artist] = song
      // songs[artist][title] = song
    }
  )
})

export function keyNormalize(str: string) {
  const res = str
    .split(/[（([]/)[0]
    .replace(/ /g, '')
    .toLowerCase()
  if (strLen(res) <= 3) return str.replace(/ /g, '')
  return res
}

export { songsSa }
export default songs
