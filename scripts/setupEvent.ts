import { fdb } from '../src/lib/firebase'
const eventId = process.env.EVENT_ID

async function main() {
  if (!eventId) return
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
}

main()
