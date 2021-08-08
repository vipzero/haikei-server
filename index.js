'use strict'

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
import { getLyrics } from './lib/jlyricnet'
// import { spotifySearchSongInfo } from './lib/spotify'
import { pathQueue, push as pushQueue } from './lib/state/pathQueue'
import { sample, sleep } from './lib/utils'
import { anaCounts } from './lib/wordCounts'

const url = process.env.URL
let counts = {},
  startPlay

pathQueue.watch((s) => {
  const last = s[s.length - 1]
  if (last) last.map(deleteFile)
})

async function receiveIcy(icy) {
  console.log(icy)
  if (startPlay === icy) {
    // 起動時の重複登録を防ぐ
    startPlay = false
    return
  } else {
    addHistoryNow(icy)
  }
  const song = findSong(icy)
  const additionals = [song.title]
  if (song.animeTitle) additionals.push(song.animeTitle)
  const { wordCounts, counts: countsNew } = anaCounts(
    icy,
    counts || {},
    additionals
  )
  counts = countsNew

  const imageSearchWord = song.animeTitle ? song.animeTitle : icy
  const googleImageLinks = await getImageLinks(imageSearchWord)

  const randLinks = sample(googleImageLinks, 5)
  const [imageLinks, paths] = await uploadByUrlAll(randLinks)
  pushQueue(paths)

  // const spoinfo = spotifySearchSongInfo(song.title, song.artist)
  // if (spoinfo) song.artwork = spoinfo.artwork

  // NOTE: 破壊的で微妙
  const albumInfos = await getAlbum(icy)
  const lyrics = await getLyrics(song.title, song.artist)
  const creators = lyrics ? lyrics.creators : {}
  const lyric = null
  // const lyric = lyrics ? lyrics.lyric : null

  console.log(icy)
  console.log(song)

  saveMusic(
    { ...song, imageLinks, ...albumInfos, ...creators, wordCounts },
    lyric
  )
}

async function main() {
  const res = await getCurrentPlay()
  counts = (await init()).counts
  startPlay = res && res.icy

  subscribeIcy(url, receiveIcy, async () => {
    // change stream retry
    console.log('finish')
    await sleep(10 * 1000)
    main()
  })
}

main()
