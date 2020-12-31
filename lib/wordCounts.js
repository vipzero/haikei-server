const { readFileSync, existsSync, writeFileSync } = require('fs')

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
module.exports = { getCounts, saveCounts }
