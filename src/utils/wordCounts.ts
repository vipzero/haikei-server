import { Counts } from '../types/index'
import { countupWords } from '../service/firebase'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { parseCountWords, textNormalize } from '.'

export function getCounts() {
  if (!existsSync('counts.json')) {
    return { counts: {}, time: 0 }
  }
  const res = JSON.parse(readFileSync('counts.json', 'utf8'))
  return res
}

export function saveCountsFile(counts: Counts, time = Date.now()) {
  writeFileSync('counts.json', JSON.stringify({ counts, time }))
}

export function anaCounts(
  icys: string[],
  countsOld: Counts,
  additionals: string[] = [],
  write = false
) {
  const entries = parseCountWords(icys, additionals)
  const counts = { ...countsOld }
  const entriesNoms = entries.map(textNormalize)

  if (write) countupWords(entriesNoms)

  entriesNoms.forEach((v) => {
    counts[v] = (countsOld[v] || 0) + 1
  })

  const wordCounts: Counts = {}
  // 参照は normalize 保存は元の文字
  entries.forEach((ent) => (wordCounts[ent] = counts[textNormalize(ent)]))
  return { wordCounts, counts }
}
