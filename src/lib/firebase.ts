import { info, warn, log, error } from './logger'
import admin from 'firebase-admin'
import { downloadOptimize } from './get-image/download'
import { Count, Counts, HistTop, Song, UploadFile } from './types/index'
import { chunk } from './utils'

export { admin }

const { SERVICE_ACCOUNT_FILE_PATH, EVENT_ID } = process.env
if (!SERVICE_ACCOUNT_FILE_PATH || !EVENT_ID) {
  error('SetupErorr', 'empty envvar SERVICE_ACCOUNT_FILE_PATH or EVENT_ID')
  process.exit(1)
}

const serviceAccount = require(SERVICE_ACCOUNT_FILE_PATH)

const credential = admin.credential.cert(serviceAccount)
admin.initializeApp({ credential })

export const fdb = admin.firestore()
export const bucket = admin.storage().bucket('rekka-haikei.appspot.com')

type Obj = { [key: string]: number | string | object }
const removeUndefined = (obj: Obj) => {
  const newObj: Obj = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return newObj
}

export const init = async () => {
  const { counts, lasttime } = await loadWordCounts()

  return { lasttime, counts }
}

export const getCurrentPlay = async () => {
  const res = await fdb.collection('song').doc(EVENT_ID).get()
  return res.data() || { icy: '' }
}

const saveSong = (song: Song) => {
  fdb
    .collection('song')
    .doc(EVENT_ID)
    .set({
      ...removeUndefined(song),
      time: Date.now(),
    })
}
// const saveLyric = (text) => {
//   // console.log(lyric)
//   fdb.collection('song').doc('lyric').set({ text })
// }

export const saveMusic = (song: Song) => {
  saveSong(song)
  // if (lyric) {
  //   saveLyric(lyric)
  // } else {
  //   saveLyric('no lyric')
  // }
}

export const histSongsRef = () =>
  fdb.collection('hist').doc(EVENT_ID).collection('songs')

export const loadHistoryTimes = async () => {
  const histSnaps = await histSongsRef()
    .where('n', '==', null)
    // .where('time', '>=', 1628511233991)
    .orderBy('time', 'asc')
    .get()
  const times = histSnaps.docs.map((docSnap) => docSnap.id)
  return times
}

export const addHistory = (title: string, time: number | null) => {
  return histSongsRef().doc(String(time)).set({ title, time, n: null })
}

export const loadAllIcy = async () => {
  const snap = await fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('songs')
    .get()
  return snap.docs.map((v) => v.data().title)
}

export const loadWordCounts = async () => {
  const snap = await fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('counts')
    .get()
  const hist = await fdb.collection('hist').doc(EVENT_ID).get()
  const lasttime = (hist.exists && (hist.data() as HistTop).lasttime) || 0

  const counts: Counts = {}
  snap.docs.forEach((v) => (counts[v.data().word] = v.data().count))

  return { counts, lasttime }
}

export const setupCount = async (counts: Counts, lasttime: number) => {
  const blocks = chunk(Object.entries(counts), 490)

  for (const ents of blocks) {
    const batch = fdb.batch()

    ents.forEach(([k, v]) => {
      if (!k || !v) return
      batch.set(
        fdb.collection('hist').doc(EVENT_ID).collection('counts').doc(),
        {
          word: k,
          count: v,
        }
      )
    })
    await batch.commit()
  }
  fdb.collection('hist').doc(EVENT_ID).set({ lasttime }, { merge: true })
}

export const setupHistN500 = async (ns: Record<string, number>) => {
  const batch = fdb.batch()
  for (const [id, n] of Object.entries(ns)) {
    batch.update(
      fdb.collection('hist').doc(EVENT_ID).collection('song').doc(id),
      { n }
    )
  }
  await batch.commit()
}

export const setupHistN = async (ns: Record<string, number | null>) => {
  const blocks = chunk(Object.entries(ns), 490)

  for (const block of blocks) {
    const batch = fdb.batch()
    for (const [id, n] of block) {
      batch.update(histSongsRef().doc(id), { n })
    }
    await batch.commit()
  }
}

export const countupWords = async (words: string[]) => {
  const batch = fdb.batch()
  const check: Record<string, true> = {}
  for (const ws of chunk(words, 10)) {
    const docs = await fdb
      .collection('hist')
      .doc(EVENT_ID)
      .collection('counts')
      .where('word', 'in', ws)
      .get()
    docs.forEach((doc) => {
      check[(doc.data() as Count).word] = true
      batch.update(doc.ref, { count: admin.firestore.FieldValue.increment(1) })
    })
  }
  words.forEach((word) => {
    if (check[word]) return
    batch.set(fdb.collection('hist').doc(EVENT_ID).collection('counts').doc(), {
      word,
      count: 1,
    })
  })
  batch.update(fdb.collection('hist').doc(EVENT_ID), { lasttime: +new Date() })
  await batch.commit()
}

// const countupWordsBy = async (words) => {
//   const batch = fdb.batch()
//   const check = {}
//   for (const ws of chunk(Object.keys(words), 10)) {
//     const docs = await fdb
//       .collection('hist')
//       .doc(EVENT_ID)
//       .collection('counts')
//       .where('word', 'in', ws)
//       .get()
//     docs.forEach((doc) => {
//       check[doc.data().word] = true
//       batch.update(doc.ref, {
//         count: admin.firestore.FieldValue.increment(words[doc.data().word]),
//       })
//     })
//   }
//   Object.keys(words).forEach((word) => {
//     if (check[word]) return
//     batch.set(fdb.collection('hist').doc(EVENT_ID).collection('counts').doc(), {
//       word,
//       count: 1,
//     })
//   })
//   batch.update(fdb.collection('hist').doc(EVENT_ID), { lasttime: +new Date() })
//   await batch.commit()
// }

export const deleteFile = (path: string) => {
  info(`delete op: ${path}`)

  return bucket
    .file(path)
    .delete()
    .catch((e) => {
      if (e.code === 404) {
        warn(`NoDeleteTargetWarn`, `no delete target ${path}`)
        return
      }
      error(`DeleteFileError`, path)
      log({ e })
    })
}

export const uploadByUrl = async (
  url: string,
  name: string
): Promise<UploadFile | false> => {
  const res = await downloadOptimize(url)
  if (!res) return false
  const { filePath: tmpFilePath, fileType } = res

  const path = `img/${EVENT_ID}/${name}.${fileType.ext}`
  await bucket.upload(tmpFilePath, {
    contentType: fileType.mime,
    destination: path,
    predefinedAcl: 'publicRead',
  })

  const downloadUrl = `${process.env.STRAGE_URL}${path}`
  return { downloadUrl, path, tmpFilePath }
}

export const uploadByUrlAll = async (urls: string[]) => {
  const timeId = +new Date()
  const uploads: UploadFile[] = []

  for (const [i, url] of urls.entries()) {
    // console.log(url)
    const res = await uploadByUrl(url, `${timeId}_${i}`).catch((e) => {
      error('UploadError', e)
      return false as const
    })
    // console.log(res)

    if (!res) continue

    uploads.push(res)
    if (uploads.length >= 3) break
  }
  return uploads
}

export const addHistoryNow = (title: string) => addHistory(title, +new Date())
