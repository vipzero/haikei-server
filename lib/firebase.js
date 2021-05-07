const admin = require('firebase-admin')
const { findSong } = require('./findSong')
const { parseCountWords, textNormalize } = require('./utils')

const {
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  SERVICE_ACCOUNT_FILE_PATH,
  EVENT_ID,
} = process.env

const serviceAccount = require(SERVICE_ACCOUNT_FILE_PATH)

const config = {
  apiKey: FIREBASE_API_KEY || '',
  projectId: FIREBASE_PROJECT_ID || '',
  authDomain: FIREBASE_AUTH_DOMAIN || '',
  storageBucket: FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID || '',
  appId: FIREBASE_APP_ID || '',
}

// const app = firebase.initializeApp(config)

admin.initializeApp({
  ...config,
  credential: admin.credential.cert(serviceAccount),
})

const fdb = admin.firestore()
const removeUndefined = (obj) => {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return newObj
}

const getAllIcy = async () => {
  let { counts, lasttime } = loadWordCounts()
  const snaps = await fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('songs')
    .orderBy('time')
    .where('time', '>=', lasttime)
    .get()

  snaps.docs.map((snap) => {
    const { time, title: icy } = snap.data()
    lasttime = time
    const song = findSong(icy)
    const additional = [song.title]
    if (song.animeTitle) additional.push(song.animeTitle)

    const words = parseCountWords(icy, counts, additional)
    words.map(textNormalize).forEach((v) => {
      counts[v] = (counts[v] || 0) + 1
    })
  })
  setupCount(counts, lasttime)
  return { lasttime, counts }
}

const getCurrentPlay = async () => {
  const res = await fdb.collection('song').doc('current').get()
  return res.data()
}

const saveSong = (song) => {
  console.log(song)
  fdb
    .collection('song')
    .doc('current')
    .set({
      ...removeUndefined(song),
      time: Date.now(),
    })
}
const saveLyric = (text) => {
  // console.log(lyric)
  fdb.collection('song').doc('lyric').set({ text })
}
const saveMusic = (song, lyric) => {
  saveSong(song)
  if (lyric) {
    saveLyric(lyric)
  } else {
    saveLyric('no lyric')
  }
}

const addHistory = (title, time) => {
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

const loadAllIcy = async () => {
  const snap = await fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('songs')
    .get()
  return snap.docs.map((v) => v.data().title)
}

const loadWordCounts = async () => {
  const snap = await fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('counts')
    .get()
  const hist = await fdb.collection('hist').doc(EVENT_ID).get()
  const lasttime = (hist.exists && hist.data().lasttime) || 0

  const counts = {}
  snap.docs.forEach((v) => (counts[v.id] = v.data()))
  return { counts, lasttime }
}

const setupCount = async (counts, lasttime) => {
  const batch = fdb.batch()
  Object.entries(counts).forEach(([k, v]) => {
    batch.create(fdb.collection('hist').doc(EVENT_ID).collection('counts'), {
      word: k,
      count: v,
    })
  })
  batch.update(fdb.colleciton('hist').doc(EVENT_ID), { lasttime })
  await batch.commit()
}

const countupWords = async (words) => {
  const batch = fdb.batch()
  const docs = await fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('counts')
    .where('word', 'in', words)
    .get()
  docs.forEach((doc) => {
    batch.update(doc.ref, { count: admin.firestore.FieldValue.increment(1) })
  })
  batch.update(fdb.colleciton('hist').doc(EVENT_ID), { lasttime: +new Date() })
  await batch.commit()
}

const addHistoryNow = (title) => addHistory(title, +new Date())

module.exports = {
  admin,
  fdb,
  saveMusic,
  addHistory,
  addHistoryNow,
  getCurrentPlay,
  getAllIcy,
  loadAllIcy,
  setupCount,
  loadWordCounts,
  countupWords,
}
