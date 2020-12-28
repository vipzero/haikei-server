const fs = require('fs')
const parse = require('csv-parse/lib/sync')

const programFilename = './data/program.csv'
const filenames = ['./data/anison.csv', './data/game.csv', './data/sf.csv']

let programs = {}
let songs = {}

const data = fs.readFileSync(programFilename, 'utf-8')
const csvOptions = { trim: true, header: false, skipLinesWithError: true }
// console.log(rows)

parse(data, csvOptions).forEach(
  ([programId, category, gameType, animeTitle, , , , chapNum, , date]) => {
    programs[programId] = { category, gameType, animeTitle, chapNum, date }
  }
)

filenames.forEach((filename) => {
  const headerAlias = 'programId,media,animeTitle,opOrEd,spNum,id,title,artist'
  const lines = fs.readFileSync(filename, 'utf-8').split('\n')
  lines[0] = headerAlias
  const data = lines.join('\n')

  const rows = parse(data, {
    trim: true,
    header: false,
    skipLinesWithError: true,
  })
  // console.log(rows)

  rows.forEach(
    ([programId, , , opOrEd, spInfo, songId, titleBase, artistBase]) => {
      const title = (titleBase || '').toLowerCase()
      const artist = (artistBase || '').toLowerCase()
      if (!songs[title]) songs[title] = {}
      songs[title][artist] = {
        // animeTitle: animeTitle || '',
        opOrEd: opOrEd || '',
        spInfo: spInfo || '',
        songId: songId || '',
        title,
        artist,
        ...programs[programId],
      }
    }
  )
})

exports.default = songs
