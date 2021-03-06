'use strict'

import { fdb } from '../lib/firebase'
const from = 'current'
const to = '2021gw'

async function main() {
  const snap = await fdb.collection('song').doc(from).get()
  const data = snap.data()
  await fdb.collection('song').doc(to).set(data)
}

main()
