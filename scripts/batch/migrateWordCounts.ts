import { Counts } from '../../src/types/index'

import { findSong } from '../../src/findSong'
import { textNormalize, parseCountWords } from '../../src/utils'
import { loadAllIcy, setupCount } from '../../src/service/firebase'

async function main() {
  const counts: Counts = {}
  const icys = await loadAllIcy()

  icys.forEach((icy) => {
    const song = findSong(icy)
    const additional: string[] = song.title ? [song.title] : []
    if (song.animeTitle) additional.push(song.animeTitle)

    const words = parseCountWords(icy, additional)
    words.map(textNormalize).forEach((v) => {
      counts[v] = (counts[v] || 0) + 1
    })
  })

  setupCount(counts, +new Date())
}

main()
