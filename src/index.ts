import { findSong } from './anisonDb/findSong'
import { enableMobileImg, nonWriteMode } from './config'
import { uploadByUrlAll } from './imageIo/uploadManage'
import { getImageLinks } from './service/customImageSearch'
import {
  addHistory,
  deleteFile,
  getCurrentPlay,
  init,
  saveSong,
} from './service/firebase'
import { getAlbum } from './service/itunes'
import { getLyricsSafe } from './service/jlyricnet'
import { store } from './state/store'
import { subscribeIcy } from './streaming/icy'
import { Counts, SkipInfo, Song } from './types/index'
import {
  convertMinPath,
  convertTimeTags,
  cycle,
  nonEmpty,
  sleep,
} from './utils'
import { addEe } from './utils/addEe'
import { error, info, log, songPrint, warn } from './utils/logger'
import { makeSearchQuery } from './utils/makeSearchWord'
import { anaCounts } from './utils/wordCounts'

const url = process.env.URL

store.onExpiredStorageUrl = (urls) => {
  urls.forEach(({ path }) => {
    deleteFile(path)

    if (enableMobileImg) {
      deleteFile(convertMinPath(path))
    }
  })
}

const DIRECT_MODE = Boolean(Number(process.env.DIRECT_MODE))
async function prepareImages(q: string) {
  const googleImageLinks = await getImageLinks(q)
  if (DIRECT_MODE) return googleImageLinks
  const uploads = await uploadByUrlAll(googleImageLinks)
  store.addQueue(uploads)
  return uploads.map((u) => u.downloadUrl)
}

export async function icyToSongCache(
  skipInfo: SkipInfo,
  time: number
): Promise<Song | false> {
  const song = skipInfo.chain
  if (!song) return false

  const compSong: Song = {
    ...song,
    time,
    imageLinks: cycle(song.imageLinks || []),
  }
  return compSong
}

export async function icyToSong(
  icy: string,
  time: number,
  prevCounts: Counts = {}
): Promise<[Song, Counts] | false> {
  const skipConf = store.checkSkip(icy, time)
  if (skipConf.chain) {
    const song = await icyToSongCache(skipConf, time)
    return song ? [song, prevCounts] : false
  }

  const song = findSong(icy)

  const imageSearchWord = makeSearchQuery(song, Math.random())

  const [imageLinks, albumInfos, { creators }] = await Promise.all([
    prepareImages(imageSearchWord),
    getAlbum(icy),
    getLyricsSafe(song.title, song.artist),
  ])

  const additionals: string[] = nonEmpty([
    song.animeTitle,
    ...convertTimeTags(song.date),
  ])
  const { wordCounts, counts } = anaCounts(
    [icy, song.artist || '', ...nonEmpty(Object.values(creators))],
    prevCounts,
    additionals,
    true
  )
  if (albumInfos?.artworkUrl100) {
    imageLinks.push(albumInfos.artworkUrl100)
  }

  const compSong: Song = {
    ...song,
    imageLinks,
    ...albumInfos,
    ...creators,
    wordCounts,
    time,
    imageSearchWord,
    hasMinImg: enableMobileImg,
  }
  return [addEe(compSong), counts]
}

async function receiveIcy(icy: string) {
  info(icy)

  if (store.isDuplicate(icy)) return false // 起動時の重複登録を防ぐ

  const time = Date.now()
  const res = await icyToSong(icy, time, store.counts)
  if (!res) return
  const [song, counts] = res
  store.counts = counts
  songPrint(song)
  saveSong(song)
  store.addSong(song)
  addHistory(icy, time).catch((e) => {
    error('AddHistoryError', e)
    error('AddHistoryError', JSON.stringify({ icy, time }))
  })
}

let failCount = 0

async function main() {
  const res = await getCurrentPlay()
  if (nonWriteMode) {
    warn('nonWriteMode: on')
  }

  store.counts = (await init()).counts
  store.setFirstIcy(res.icy)
  if (!url) {
    error('SetupErorr', 'empty envvar URL')
    process.exit(1)
  }

  subscribeIcy(
    url,
    (icy) => {
      receiveIcy(icy)
      failCount = 0
    },
    async () => {
      // change stream retry
      failCount = Math.min(failCount + 1, 8)
      const sleepTimeSec = 2 ** failCount
      log(`stopped ${failCount},${sleepTimeSec}s`)
      await sleep(sleepTimeSec * 1000)
      queueMicrotask(main)
    }
  )
}

main()
