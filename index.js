'use strict'

import subscribeIcy from './lib/icy'
import {
  saveMusic,
  addHistoryNow,
  getCurrentPlay,
  init,
  uploadByUrlAll,
  deleteFile,
} from './lib/firebase'
import { getImageLinks } from './lib/customImageSearch'
import { findSong } from './lib/findSong'
import { sample, sleep } from './lib/utils'
import { getAlbum } from './lib/itunes'
import { anaCounts } from './lib/wordCounts'
import { getLyrics } from './lib/jlyricnet'
// import { spotifySearchSongInfo } from './lib/spotify'
import { pathQueue, push as pushQueue } from './lib/state/pathQueue'
import { $meetSong, setMeetSong } from './lib/state/runningMeetSong'

const url = process.env.URL
let counts = {}

pathQueue.watch((s) => {
  const last = s[s.length - 1]
  if (last) last.map(deleteFile)
})

async function receiveIcy(icy) {
  console.log(`icy: ${icy}`)
  if ($meetSong.map((v) => v === icy)) {
    // 起動時の重複登録を防ぐ
    setMeetSong(false)
    console.log('skip')
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

  const randLinks = sample(googleImageLinks, 3)
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
  setMeetSong(res && res.icy)

  subscribeIcy(url, receiveIcy, async () => {
    // change stream retry
    console.log('finish')
    await sleep(10 * 1000)
    main()
  })
}

main()
