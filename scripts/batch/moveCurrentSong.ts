import { fdb } from '../../src/lib/firebase'
const from = 'current'
const to = '2021gw'

async function main() {
  const snap = await fdb.collection('song').doc(from).get()
  const data = snap.data()
  if (!data) return
  await fdb.collection('song').doc(to).set(data)
}

main()
