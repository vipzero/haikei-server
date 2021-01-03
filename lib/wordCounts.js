const { readFileSync, existsSync, writeFileSync } = require('fs')
const { parseCountWords } = require('./utils')

function getCounts() {
  if (!existsSync('counts.json')) {
    return { counts: {}, time: 0 }
  }
  const res = JSON.parse(readFileSync('counts.json', 'utf8'))
  return res
}

function saveCounts(counts, time = Date.now()) {
  writeFileSync('counts.json', JSON.stringify({ counts, time }))
}

const anaCounts = (title, additionals = []) => {
  const { counts: countsOld } = getCounts()
  const [counts, entries] = parseCountWords(title, countsOld, additionals)
  saveCounts(counts)
  const wordCounts = {}
  entries.forEach((ent) => (wordCounts[ent] = counts[ent]))
  return { wordCounts }
}

module.exports = { getCounts, saveCounts, anaCounts }
