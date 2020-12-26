const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const songs = {}

const filenames = [
  './data/test.csv',
  './data/anison.csv',
  './data/game.csv',
  './data/program.csv',
  './data/sf.csv',
]

// const trimDoublQuote = (cell) => {
//   if (cell[0] !== '"') return cell
//   return cell.substr(1, cell.length - 2)
// }
filenames.forEach((filename) => {
  const headerAlias = 'bId,media,animeTitle,opOrEd,spNum,id,title,artist'
  const lines = fs.readFileSync(filename, 'utf-8').split('\n')
  lines[0] = headerAlias
  const data = lines.join('\n')

  const rows = parse(data, {
    trim: true,
    header: false,
    skipLinesWithError: true,
  })
  // console.log(rows)

  rows.forEach(([, , title, opOrEd, spInfo, songId, songTitle, artist]) => {
    if (!songs[title]) songs[title] = {}
    songs[title][artist] = { title, opOrEd, spInfo, songId, songTitle, artist }
  })
})

exports.default = songs
