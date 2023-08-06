import { titleKeyNormalize } from '../anisonDb/anisonDb'
import { Song } from '../types'

export const mtsTitles = [
  'Crossing!',
  'Criminally Dinner ～正餐とイーヴルナイフ～',
  'スペードのQ',
  'KING of SPADE',
  'ESPADA',
].map(titleKeyNormalize)

export function addEe(song: Song): Song {
  let hit = false
  let k = '00000'

  song.icy.split(' - ').forEach((title) => {
    const titleNorm = titleKeyNormalize(title)

    const t = mtsTitles.findIndex((v) => v === titleNorm)
    if (t !== -1) {
      hit = true
      k = k.substring(0, t) + '1' + k.substring(t + 1)
    }
  })
  if (hit) {
    song.hedwig = `mts10:${k}`
  }

  return song
}
