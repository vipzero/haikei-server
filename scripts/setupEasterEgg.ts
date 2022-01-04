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
    // prettier-ignore
    toaru: {
      msk: 0, ind: 0, skh: 0, krk: 0, uih: 0, stn: 0, knz: 0,
      hmg: 0, ora: 0, mik: 0, kme: 0, huk: 0, ror: 0, itw: 0,
      mtk: 0, knh: 0, hru: 0, may: 0, msj: 0, fky: 0, nnt: 0,
      mgn: 0, frn: 0, mai: 0, tkt: 0, snr: 0, feb: 0, ars: 0,
      dri: 0, oti: 0, msi: 0, utd: 0, bng: 0, oth: 0,
    },
    jojo: { s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, s6: 0, s7: 0, s8: 0, s9: 0 },
    bobo: { b1: 0, b2: 0, b3: 0, b4: 0, b5: 0 },
    rozen: { sg: 0, ki: 0, ss: 0, as: 0, mk: 0, hi: 0, br: 0 },
    amagami: { ay: 0, rh: 0, ko: 0, nk: 0, nn: 0, mr: 0, my: 0, kz: 0 },
    // prettier-ignore
    shanimas: {
      mn: 0, as: 0, mg: 0, rn: 0, mm: 0, st: 0, yk: 0, kk: 0,
      rh: 0, ty: 0, jr: 0, rs: 0, nh: 0, an: 0, kh: 0, cy: 0,
      ah: 0, hy: 0, ai: 0, to: 0, md: 0, ki: 0, hn: 0, nt: 0,
      mk: 0, rk: 0,
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
