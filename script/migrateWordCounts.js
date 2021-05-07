'use strict'

const { findSong } = require('../lib/findSong')
const { anaCounts } = require('../lib/wordCounts')
const { loadAllIcy, setupCount } = require('../lib/firebase')

function wordCounting(icys) {
  const res = {}

  icys.forEach((icy) => {
    const song = findSong(icy)
    const additionals = [song.title]

    if (song.animeTitle) additionals.push(song.animeTitle)
    const { wordCounts } = anaCounts(icy, res, additionals)

    Object.entries(wordCounts).forEach(([k, v]) => {
      res[k] = (res[k] || 0) + v
    })
  })
  console.log(res)
}

async function main() {
  const icys = await loadAllIcy()
  const counts = wordCounting(icys)
  await setupCount(counts)
}

main()
