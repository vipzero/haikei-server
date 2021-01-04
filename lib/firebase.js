const admin = require('firebase-admin')
const { findSong } = require('./findSong')
const { parseCountWords } = require('./utils')
const { getCounts, saveCounts } = require('./wordCounts')

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
  let { counts, time } = getCounts()
  const snaps = await fdb
    .collection('hist')
    .doc(EVENT_ID)
    .collection('songs')
    .orderBy('time')
    .where('time', '>=', time)
    .get()

  let lasttime = 0
  snaps.docs.map((snap) => {
    const { time, title: icy } = snap.data()
    lasttime = time
    const song = findSong(icy)
    const additional = [song.title]
    if (song.animeTitle) additional.push(song.animeTitle)

    const [countsNew] = parseCountWords(icy, counts, additional)
    counts = countsNew
  })
  saveCounts(counts, lasttime)
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

const addHistoryNow = (title) => addHistory(title, +new Date())

module.exports = {
  admin,
  fdb,
  saveMusic,
  addHistory,
  addHistoryNow,
  getCurrentPlay,
  getAllIcy,
}
