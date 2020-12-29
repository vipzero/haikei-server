const admin = require('firebase-admin')

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
const saveMusic = (song) => {
  fdb.collection('song').doc('current').set(song)
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

module.exports = { admin, fdb, saveMusic, addHistory, addHistoryNow }
