import { fdb } from '../../src/service/firebase'

async function main() {
  const snap = await fdb
    .collection('hist')
    .doc('2020nematu')
    .collection('songs')
    .where('time', '>=', 1619611546000)
    .get()
  console.log(snap.docs.length)
  const batch = fdb.batch()

  snap.docs.forEach((v) => {
    const d = v.data()

    batch.set(
      fdb.collection('hist').doc('2021gw').collection('songs').doc(`${d.time}`),
      d
    )
    batch.delete(v.ref)
  })
  await batch.commit()
}

main()
