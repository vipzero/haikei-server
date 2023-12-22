import parse from 'csv-parse/lib/sync'
// import { parse } from 'csv-parse/sync'
import fs from 'fs'
import { ProgramRecord, SongRecord, SongSupportAttr } from '../types/index'
import { parseCountWords, textNormalize } from '../utils'

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

const parsedLines = parse(data, csvOptions) as [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
][]
parsedLines.shift()
parsedLines.forEach(
  ([programId, category, gameType, animeTitle, , , , chapNum, , date]) => {
    programs[programId] = { category, gameType, animeTitle, chapNum, date }
  }
)
const anisonLines = parse(anisonData, csvOptions) as [
  string,
  string,
  string,
  string,
  string,
  string
][]

anisonLines.forEach(
  ([animeTitle, title, artist, writer, composer, arranger]) => {
    const tk = titleKeyNormalize(title)
    const ak = artistKeyNormalize(artist)
    if (!animes[tk]) animes[tk] = {}

    animes[tk]![ak] = {
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

  const rows: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ][] = parse(data, {
    trim: true,
    // header: false, // NOTE: type に含まれてなかったから消しちゃうけどどうにでもなれー！
    skipLinesWithError: true,
  })

  rows.forEach(
    ([programId, , animeTitleI, opOrEd, spInfo, songId, title, artist]) => {
      const tk = titleKeyNormalize(title || '')
      const ak = artistKeyNormalize(artist || '')
      if (!songs[tk]) songs[tk] = {}
      // if (!songs[artist]) songs[artist] = {}
      const { animeTitle, ...programAttrs } = programs[programId]!
      const song = {
        opOrEd: opOrEd || '',
        spInfo: spInfo || '',
        songId: songId || '',
        title,
        artist,
        animeTitle: animeTitleI || animeTitle,
        ...programAttrs,
      }
      songs[tk]![ak] = song
    }
  )
})

export function artistKeyNormalize(str: string) {
  return parseCountWords(str).join('_').toLowerCase()
}
export function titleKeyNormalize(str: string) {
  return textNormalize(str)
    .replace(/\(.*?\)/g, '')
    .replace(/ /g, '')
    .toLowerCase()
}
const dateStr = (date: Date) => date.toISOString().slice(0, 10)
export const checkNewestProgram = () => {
  const ymd = dateStr(new Date())
  const p = Object.values(programs)
    .filter((a) => a.date < ymd)
    .sort((a, b) => b.date.localeCompare(a.date))
    .shift()
  if (!p) return 'no data'
  return p.date + ' ' + p.animeTitle
}
export const checkFileStats = () =>
  [programFilename, ...filenames, anisonFilename].map((filename) => {
    if (!fs.existsSync(filename)) {
      return { exists: false, filename }
    }
    const res = fs.statSync(filename)
    return { exists: true, filename, mtime: res.mtime, size: res.size }
  })

export { songsSa, animes }
export default songs
