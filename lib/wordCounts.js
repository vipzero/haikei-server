const { readFileSync, existsSync, writeFileSync } = require('fs')
const { parseCountWords, textNormalize } = require('./utils')

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

const anaCounts = (icy, additionals = []) => {
  const { counts: countsOld } = getCounts()
  const [counts, entries] = parseCountWords(icy, countsOld, additionals)
  saveCounts(counts)
  const wordCounts = {}
  // 参照は normalize 保存は元の文字
  entries.forEach((ent) => (wordCounts[ent] = counts[textNormalize(ent)]))
  return { wordCounts }
}

module.exports = { getCounts, saveCounts, anaCounts }
