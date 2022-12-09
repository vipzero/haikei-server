import { assert } from 'console'
import { stringify } from 'csv-stringify/sync'
import { writeFile } from 'fs/promises'

import {
  archiveUrl,
  loadHistEventSongs,
  uploadStorageArchive,
} from '../../src/service/firebase'
import { log } from '../../src/utils/logger'

const archiveEventCsv = async (id: string) => {
  log({ id })
  if (!id) return
  const data = await loadHistEventSongs(id)
  const dataWithN = data.map((d) => ({ ...d, n: d.n || 0 }))
  const csvText = stringify(dataWithN, {
    header: true,
    columns: ['time', 'title', 'n'].map((key) => ({ key, header: key })),
  })

  await saveFile(id, csvText)
}

const saveFile = async (id: string, text: string) => {
  const paths = archiveUrl(id)
  const { localFile } = paths

  await writeFile(localFile, text)
  await uploadStorageArchive(paths)
  log({ paths })
}

const eventId = process.argv[2]

assert(eventId, 'need arg [event_id]')

archiveEventCsv(eventId).then(() => log('doae'))
