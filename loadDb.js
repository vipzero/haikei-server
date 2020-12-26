const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const songs = {}

const filenames = [
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
  // const headerAlias = 'bId,media,animeTitle,opOrEd,spNum,id,title,artist'
  const lines = fs.readFileSync(filename, 'utf-8').split('\n')
  // lines[0] = headerAlias
  const data = lines.join('\n')

  const rows = parse(data, {
    columns: true,
    // columns: headerAlias.split(','),
  })

  rows.forEach((record) => {
    const { title, artist } = record

    if (!songs[title]) songs[title] = {}
    songs[title][artist] = record
  })
})

console.log(Object.values(songs)[0])
console.log(Object.values(songs)[1])
console.log(Object.values(songs)[2])

exports.default = songs
