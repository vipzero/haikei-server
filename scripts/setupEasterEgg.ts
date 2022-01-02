import { fdb } from '../src/service/firebase'
const eventId = process.env.EVENT_ID

async function main() {
  if (!eventId) return
  const votes = {
    gotoyome: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    oreimo: { ki: 0, ku: 0, ay: 0, ba: 0, ka: 0, ma: 0, se: 0 },
    oregairu: { yk: 0, yi: 0, ir: 0, ot: 0 },
    saekano: { mg: 0, ut: 0, er: 0, iz: 0, mt: 0 },
    monogatari: {
      ht: 0,
      my: 0,
      kn: 0,
      nd: 0,
      hn: 0,
      sn: 0,
      kr: 0,
      tk: 0,
      on: 0,
      ou: 0,
      oi: 0,
    },
    oreshura: { hr: 0, nt: 0, ak: 0, fy: 0 },
    jinsei: { ri: 0, bu: 0, ta: 0, si: 0, bi: 0 },
    steinsgate: { kr: 0, my: 0, sz: 0, fe: 0, rk: 0, me: 0 },
  }

  const tasks = Object.entries(votes).map(async ([animeId, inits]) => {
    const animeRef = fdb.collection('cvote').doc(animeId)
    const doc = await animeRef.get()
    if (doc.exists) return

    await animeRef.set(inits)
  })
  await Promise.all(tasks)
}

// eslint-disable-next-line no-console
main().then(() => console.log('fin'))
