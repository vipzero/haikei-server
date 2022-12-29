import { assert } from 'console'
import { findSong } from '../../src/anisonDb/findSong'

import { loadHistEventSongs } from '../../src/service/firebase'
import { nonEmpty } from '../../src/utils'
import { log } from '../../src/utils/logger'
import { anaCounts } from '../../src/utils/wordCounts'

const restoreHistoryTags = async (id: string) => {
  // log({ id })
  if (!id) return
  const data = await loadHistEventSongs(id)

  let counts = {}

  data.map((s) => {
    const icy = s.title
    const song = findSong(icy)

    const additionals: string[] = nonEmpty([song.animeTitle])
    const cres = anaCounts([song.artist || ''], counts, additionals)
    counts = cres.counts
  })
  log(JSON.stringify(counts))
}

const eventId = process.argv[2]

assert(eventId, 'need arg [event_id]')

restoreHistoryTags(eventId).then(() => log('doae'))
