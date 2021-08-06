import admin from 'firebase-admin'
import { chunk } from './utils'
import { saveCountsFile } from './wordCounts'

export { admin }

const { SERVICE_ACCOUNT_FILE_PATH, EVENT_ID } = process.env

const serviceAccount = require(SERVICE_ACCOUNT_FILE_PATH)

const credential = admin.credential.cert(serviceAccount)
admin.initializeApp({ credential })

export const fdb = admin.firestore()
const removeUndefined = (obj) => {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return newObj
}

export const init = async () => {
  let { counts, lasttime } = await loadWordCounts()
  saveCountsFile(counts)

  return { lasttime, counts }
}

export const getCurrentPlay = async () => {
  const res = await fdb.collection('song').doc(EVENT_ID).get()
  return res.data()
}

const saveSong = (song) => {
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
export const saveMusic = (song) => {
  saveSong(song)
  // if (lyric) {
  //   saveLyric(lyric)
  // } else {
  //   saveLyric('no lyric')
  // }
}

export const addHistory = (title, time) => {
  return fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('songs')
    .doc(String(time))
    .set({
      title,
      time,
    })
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
  const lasttime = (hist.exists && hist.data().lasttime) || 0

  const counts = {}
  snap.docs.forEach((v) => (counts[v.data().word] = v.data().count))

  return { counts, lasttime }
}

export const setupCount = async (counts, lasttime) => {
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

export const countupWords = async (words) => {
  const batch = fdb.batch()
  const check = {}
  for (const ws of chunk(words, 10)) {
    const docs = await fdb
      .collection('hist')
      .doc(EVENT_ID)
      .collection('counts')
      .where('word', 'in', ws)
      .get()
    docs.forEach((doc) => {
      check[doc.data().word] = true
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

export const addHistoryNow = (title) => addHistory(title, +new Date())
