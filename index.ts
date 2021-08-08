import { getImageLinks } from './lib/customImageSearch'
import { findSong } from './lib/findSong'
import {
  addHistoryNow,
  deleteFile,
  getCurrentPlay,
  init,
  saveMusic,
  uploadByUrlAll,
} from './lib/firebase'
import subscribeIcy from './lib/icy'
import { getAlbum } from './lib/itunes'
import { getLyricsSafe } from './lib/jlyricnet'
// import { spotifySearchSongInfo } from './lib/spotify'
import { pathQueue, push as pushQueue } from './lib/state/pathQueue'
import { Counts, Song } from './lib/types/index'
import { sleep } from './lib/utils'
import { anaCounts } from './lib/wordCounts'

const url = process.env.URL
let counts: Counts = {},
  startPlay: false | string

pathQueue.watch((s) => {
  const last = s[s.length - 1]
  if (last) last.map(deleteFile)
})

async function prepareImages(q: string) {
  const googleImageLinks = await getImageLinks(q)
  const [imageLinks, paths] = await uploadByUrlAll(googleImageLinks)
  pushQueue(paths)
  return imageLinks
}

async function receiveIcy(icy: string) {
  console.log(icy)
  if (startPlay === icy) {
    // 起動時の重複登録を防ぐ
    startPlay = false
    return
  } else {
    addHistoryNow(icy)
  }
  const song = findSong(icy)
  const additionals: string[] = [song.animeTitle, song.title].filter(
    Boolean
  ) as string[]
  const { wordCounts, counts: countsNew } = anaCounts(
    icy,
    counts || {},
    additionals
  )
  counts = countsNew

  const imageSearchWord = song.animeTitle ? song.animeTitle : icy
  const imageLinksSync = prepareImages(imageSearchWord)

  // const spoinfo = spotifySearchSongInfo(song.title, song.artist)
  // if (spoinfo) song.artwork = spoinfo.artwork

  // NOTE: 破壊的で微妙
  const albumInfos = await getAlbum(icy)
  const { creators } = await getLyricsSafe(song.title, song.artist)
  // const lyric = lyrics ? lyrics.lyric : null

  console.log(icy)
  console.log(song)

  const [imageLinks] = await Promise.all([imageLinksSync])
  const compSong: Song = {
    ...song,
    imageLinks,
    ...albumInfos,
    ...creators,
    wordCounts,
    time: 0,
  }

  saveMusic(compSong)
}

async function main() {
  const res = await getCurrentPlay()
  counts = (await init()).counts
  startPlay = res && res.icy
  if (!url) {
    console.error('empty URL')
    process.exit(1)
  }

  subscribeIcy(url, receiveIcy, async () => {
    // change stream retry
    console.log('finish')
    await sleep(10 * 1000)
    main()
  })
}

main()
