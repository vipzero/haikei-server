/* eslint-disable no-console */
import { eventId } from '../src/config'
import { fdb } from '../src/service/firebase'

async function main() {
  const hist = await fdb.collection('hist').doc(eventId).get()
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
