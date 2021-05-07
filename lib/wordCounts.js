const { readFileSync, existsSync, writeFileSync } = require('fs')
const { countupWords } = require('./firebase')
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

const anaCounts = (icy, countsOld, additionals = []) => {
  const entries = parseCountWords(icy, additionals)
  const counts = { ...countsOld }
  const entriesNoms = entries.map(textNormalize)
  entriesNoms.forEach((v) => {
    counts[v] = (countsOld[v] || 0) + 1
  })

  countupWords(entriesNoms)

  const wordCounts = {}
  // 参照は normalize 保存は元の文字
  entries.forEach((ent) => (wordCounts[ent] = counts[textNormalize(ent)]))
  return { wordCounts, counts }
}

module.exports = { getCounts, saveCounts, anaCounts }
