import { makeSearchQuery } from './lib/makeSearchWord'
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
  if (s.length < 3) return
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

  const imageSearchWord = makeSearchQuery(song)
  const imageLinksSync = prepareImages(imageSearchWord)

  // const spoinfo = spotifySearchSongInfo(song.title, song.artist)
  // if (spoinfo) song.artwork = spoinfo.artwork

  const albumInfosSync = getAlbum(icy)
  const lyricsSync = getLyricsSafe(song.title, song.artist)
  // const lyric = lyrics ? lyrics.lyric : null

  const [imageLinks, albumInfos, { creators }] = await Promise.all([
    imageLinksSync,
    albumInfosSync,
    lyricsSync,
  ])
  const compSong: Song = {
    ...song,
    imageLinks,
    ...albumInfos,
    ...creators,
    wordCounts,
    time: 0,
  }

  console.log(compSong)
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
