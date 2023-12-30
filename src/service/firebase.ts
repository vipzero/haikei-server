import admin from 'firebase-admin'
import { eventId, nonWriteMode, serviceAccountPath } from '../config'
import { Count, Counts, HistoryRaw, HistTop, Song } from '../types/index'
import { chunk, textNormalize } from '../utils'
import { error, log, warnDesc } from '../utils/logger'
import { CacheFile } from './../types/index'

export { admin }

const P_SONGS = 'songs'
const P_SONG = 'song'
// const P_EMOL = 'emol'
const P_HIST = 'hist'
const P_YO = 'yo'
const P_COUNTS = 'counts'
const P_CURRENT = 'current'

const serviceAccount = require(serviceAccountPath)

const credential = admin.credential.cert(serviceAccount)
admin.initializeApp({ credential })

export const fdb = admin.firestore()
const storageId = process.env.STORAGE_ID || ''
const storageIdArchive = process.env.STORAGE_ID_ARCHIVE || ''
const storageUrl = process.env.STORAGE_URL || ''
const bucketUrl = storageUrl + storageId
export const getBucket = (id: string = storageId) => admin.storage().bucket(id)
export const getArchiveBucket = () => getBucket(storageIdArchive)

type Obj = { [key: string]: number | string | object | boolean }
const removeUndefined = (obj: Obj) => {
  const newObj: Obj = {}
  Object.keys(obj).forEach((key) => {
    const v = obj[key]
    if (v !== undefined) newObj[key] = v
  })
  return newObj
}

export const init = async () => {
  const { counts, lasttime } = await loadWordCounts()

  return { lasttime, counts }
}

export const getCurrentPlay = async () => {
  const res = await fdb.collection(P_SONG).doc(eventId).get()
  return res.data() || { icy: '' }
}

export const saveSong = (song: Song) => {
  if (nonWriteMode) return
  fdb
    .collection(P_SONG)
    .doc(eventId)
    .update(removeUndefined(song))
    .catch((e) => {
      error(`SaveSongError: `, JSON.stringify(song))
      log({ e })
    })
}

export const histSongsRef = (eid = eventId) =>
  fdb.collection(P_HIST).doc(eid).collection(P_SONGS)
export const bookCountDocRef = () => fdb.collection(P_YO).doc(P_CURRENT)

export const loadHistEventSongs = async (eid: string) => {
  const snaps = await histSongsRef(eid).orderBy('time', 'asc').get()
  const lines: HistoryRaw[] = []
  snaps.docs.forEach((doc) => {
    const d = doc.data() as HistoryRaw
    lines.push(d)
  })
  return lines
}

export const loadHistoryTimes = async () => {
  const histSnaps = await histSongsRef()
    .where('n', '==', null)
    // .where('time', '>=', 1628511233991)
    .orderBy('time', 'asc')
    .get()
  const times = histSnaps.docs.map((docSnap) => docSnap.id)
  return times
}

export const addHistory = async (
  title: string,
  time: number | null,
  n: null | number = null
) => {
  if (nonWriteMode) return
  await bookCountDocRef().update({ bookCount: 0 })

  return await histSongsRef().doc(String(time)).set({ title, time, n, b: 0 })
}

export const loadAllIcy = async () => {
  const snap = await fdb
    .collection(P_HIST)
    .doc(eventId)
    .collection(P_SONGS)
    .get()
  return snap.docs.map((v) => v.data().title)
}

export const loadWordCounts = async () => {
  const hist = await fdb.collection(P_HIST).doc(eventId).get()
  const snap = await fdb
    .collection(P_HIST)
    .doc(eventId)
    .collection(P_COUNTS)
    .get()
  const lasttime = (hist.exists && (hist.data() as HistTop).lasttime) || 0

  const counts: Counts = {}

  snap.forEach((v) => (counts[textNormalize(v.data().word)] = v.data().count))

  return { counts, lasttime }
}

export const setupCount = async (counts: Counts, lasttime: number) => {
  if (nonWriteMode) return
  const blocks = chunk(Object.entries(counts), 490)

  for (const ents of blocks) {
    const batch = fdb.batch()

    ents.forEach(([k, v]) => {
      if (!k || !v) return
      batch.set(
        fdb.collection(P_HIST).doc(eventId).collection(P_COUNTS).doc(),
        {
          word: k,
          count: v,
        }
      )
    })
    await batch.commit()
  }
  fdb.collection(P_HIST).doc(eventId).set({ lasttime }, { merge: true })
}

export const setupHistN = async (ns: Record<string, number | null>) => {
  if (nonWriteMode) return
  const blocks = chunk(Object.entries(ns), 490)

  for (const block of blocks) {
    const batch = fdb.batch()
    for (const [id, n] of block) {
      batch.update(histSongsRef().doc(id), { n })
    }
    await batch.commit()
  }
}

export const countupWordsEntry = async (words: Record<string, number>) => {
  if (nonWriteMode) return
  const batch = fdb.batch()
  const check: Record<string, true> = {}
  for (const ws of chunk(Object.entries(words), 10)) {
    const docs = await fdb
      .collection(P_HIST)
      .doc(eventId)
      .collection(P_COUNTS)
      .where(
        'word',
        'in',
        ws.map((v) => v[0])
      )
      .get()
    docs.forEach((doc) => {
      const wk = (doc.data() as Count).word
      check[wk] = true
      batch.update(doc.ref, {
        count: admin.firestore.FieldValue.increment(words[wk] || 0),
      })
    })
  }
  Object.entries(words).forEach(([word, count]) => {
    if (check[word]) return
    batch.set(fdb.collection(P_HIST).doc(eventId).collection(P_COUNTS).doc(), {
      word,
      count,
    })
  })

  await batch.commit()
}

export const countupWords = async (words: string[]) => {
  if (nonWriteMode) return
  const batch = fdb.batch()
  const check: Record<string, true> = {}
  for (const ws of chunk(words, 10)) {
    const docs = await fdb
      .collection(P_HIST)
      .doc(eventId)
      .collection(P_COUNTS)
      .where('word', 'in', ws)
      .get()
    docs.forEach((doc) => {
      check[(doc.data() as Count).word] = true
      batch.update(doc.ref, { count: admin.firestore.FieldValue.increment(1) })
    })
  }
  words.forEach((word) => {
    if (check[word]) return
    batch.set(fdb.collection(P_HIST).doc(eventId).collection(P_COUNTS).doc(), {
      word,
      count: 1,
    })
  })
  batch.update(fdb.collection(P_HIST).doc(eventId), { lasttime: +new Date() })
  await batch.commit()
}

export const deleteFile = (path: string) => {
  // info(`delete op: ${path}`)

  return getBucket()
    .file(path)
    .delete()
    .catch((e) => {
      if (e.code === 404) {
        warnDesc(`NoDeleteTargetWarn`, `no delete target ${path}`)
        return
      }
      error(`DeleteFileError`, path)
      log({ e })
    })
}

export const uploadStorage = async (file: CacheFile, id: string) => {
  const { filePath: tmpFilePath, fileType } = file
  const { ext, mime: contentType } = fileType

  const destination = `img/${eventId}/${id}.${ext}`
  await getBucket().upload(tmpFilePath, {
    contentType,
    destination,
    predefinedAcl: 'publicRead',
    metadata: {
      cacheControl: `public, max-age=${60 * 10}`,
    },
  })

  const downloadUrl = `${bucketUrl}/${destination}`
  return { downloadUrl, path: destination, tmpFilePath }
}

const distPath = `archive`

type StoragePaths = {
  url: string
  localFile: string
  destination: string
  filename: string
}
export const archiveUrl = (eid: string): StoragePaths => {
  const localFile = `data/archvie_${eid}.csv`
  const filename = `hist_${eid}.csv`
  const destination = `${distPath}/${filename}`
  const url = `${bucketUrl}/${destination}`
  return { url, destination, filename, localFile }
}
export const uploadStorageArchive = async ({
  localFile,
  destination,
}: StoragePaths) => {
  await getArchiveBucket().upload(localFile, {
    contentType: 'text/csv',
    destination,
    predefinedAcl: 'publicRead',
  })
}
