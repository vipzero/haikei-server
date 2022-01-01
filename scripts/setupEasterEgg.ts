import { fdb } from '../src/service/firebase'
const eventId = process.env.EVENT_ID

async function main() {
  if (!eventId) return
  const votes = {
    gotoyome: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    },
    oreimo: {
      ki: 0,
      ku: 0,
      ay: 0,
      ba: 0,
      ka: 0,
      ma: 0,
      se: 0,
    },
    oregairu: {
      yk: 0,
      yi: 0,
      ir: 0,
      ot: 0,
    },
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
