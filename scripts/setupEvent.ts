/* eslint-disable no-console */
import { fdb } from '../src/service/firebase'
const eventId = process.env.EVENT_ID

async function main() {
  if (!eventId) {
    console.warn(`EVENT_ID が設定されてません`)
    return
  }
  const hist = await fdb.collection('hist').doc(eventId).get()
  await fdb.collection('yo').doc('current').set({ bookCount: 0 })
  if (hist.exists) {
    console.warn(`${eventId} は登録済み`)
    return
  }

  await fdb.collection('hist').doc(eventId).set({ lasttime: 0 })

  await fdb
    .collection('song')
    .doc(eventId)
    .set({
      title: '----',
      artworkUrl100: '',
      artist: '----',
      imageLinks: [],
      albumName: '',
      trackTimeMillis: 1000,
      writer: '----',
      singer: '----',
      itunesUrl: '',
      time: 1620900279274,
      wordCounts: {},
      icy: '',
      composer: '',
      wordCountsAna: [{ name: '----', count: 0, label: '----' }],
    })
  await fdb.collection('vote').doc(eventId).set({ postCount: 0 })
}

// eslint-disable-next-line no-console
main().then(() => console.log('fin'))
