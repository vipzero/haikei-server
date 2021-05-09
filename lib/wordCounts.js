import { countupWords } from './firebase'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { parseCountWords, textNormalize } from './utils'

export function getCounts() {
  if (!existsSync('counts.json')) {
    return { counts: {}, time: 0 }
  }
  const res = JSON.parse(readFileSync('counts.json', 'utf8'))
  return res
}

export function saveCountsFile(counts, time = Date.now()) {
  writeFileSync('counts.json', JSON.stringify({ counts, time }))
}

export function anaCounts(icy, countsOld, additionals = []) {
  console.log('ccl')
  console.log(Object.values(countsOld).length)
  const entries = parseCountWords(icy, additionals)
  const counts = { ...countsOld }
  const entriesNoms = entries.map(textNormalize)

  countupWords(entriesNoms)
  entriesNoms.forEach((v) => {
    counts[v] = (countsOld[v] || 0) + 1
    console.log(v)
    console.log(countsOld[v])
  })

  const wordCounts = {}
  // 参照は normalize 保存は元の文字
  entries.forEach((ent) => (wordCounts[ent] = counts[textNormalize(ent)]))
  return { wordCounts, counts }
}
