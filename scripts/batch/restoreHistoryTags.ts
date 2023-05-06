import { assert } from 'console'
import { findSong } from '../../src/anisonDb/findSong'

import {
  countupWordsEntry,
  loadHistEventSongs
} from '../../src/service/firebase'
import { convertTimeTags } from '../../src/utils'
import { log } from '../../src/utils/logger'

// 年代をタグにして補完する
const restoreHistoryTags = async (id: string) => {
  // log({ id })
  if (!id) return
  const data = await loadHistEventSongs(id)

  const counts: Record<string, number> = {}

  data.map((s) => {
    const icy = s.title
    const { date } = findSong(icy)

    if (!date) return
    const tags = convertTimeTags(date)
    tags.map((v) => {
      if (!counts[v]) counts[v] = 0
      counts[v] += 1
    })
  })
  log(JSON.stringify(counts))
  countupWordsEntry(counts)
}

const eventId = process.argv[2]

assert(eventId, 'need arg [event_id]')

restoreHistoryTags(eventId).then(() => log('doae'))
