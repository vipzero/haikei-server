import { eventId } from '../src/config'
import { fdb } from '../src/service/firebase'

const voteKeys = `
gotoyome:1 2 3 4 5
oreimo:ki ku ay ba ka ma se
oregairu:yk yi ir ot
saekano:mg ut er iz mt
monogatari:ht my kn nd hn sn kr tk on ou oi
oreshura:hr nt ak fy
jinsei:ri bu ta si bi
steinsgate:kr my sz fe rk me mh
toaru:msk ind skh krk uih stn knz hmg ora mik kme huk ror itw mtk knh hru may msj fky nnt mgn frn mai tkt snr feb ars dri oti msi utd bng oth
jojo:s1 s2 s3 s4 s5 s6 s7 s8 s9
bobo:b1 b2 b3 b4 b5
rozen:sg ki ss as mk hi br
amagami:ay rh ko nk nn mr my kz
shanimas:mn as mg rn mm st yk kk rh ty jr rs nh an kh cy ah hy ai to md ki hn nt mk rk
gabudoro:gb vi st rf
yamajo:ur nn mi mr na as si
bryunhild:nk kn kz kt nn ht mt
imasml:mr sy kt ar km er um mn nr no mt ik yr jr tk sz sb ay mz ro sh mk em cz rk tg hn sr an tm ri el ak kn tb kl hk my ko ah ch yh yy rt az io ma am mm mi hb tn
rakupro:mm si kt ym mk mo nn rr rt ma rn sz
shining:hn ss mr hy gs rr kk uo ms hr er te
aobuta:mi sk tm ft nd ke
milgram:es hr yn fu mu sd mh kz am mk kt
roshidere:ar yk ms
makein:yn ys km
`.trim()
const votes: Record<string, Record<string, number>> = voteKeys
  .split('\n')
  .reduce((acc, line) => {
    const [anime = '', keys = ''] = line.split(':')
    return {
      ...acc,
      [anime]: keys.split(' ').reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    }
  }, {})

async function main() {
  if (!eventId) return

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
