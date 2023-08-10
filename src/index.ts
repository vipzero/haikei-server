import { findSong } from './anisonDb/findSong'
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
import { Counts, Song } from './types/index'
import { convertTimeTags, nonEmpty, sleep } from './utils'
import { error, info, log, songPrint } from './utils/logger'
import { makeSearchQuery } from './utils/makeSearchWord'
import { anaCounts } from './utils/wordCounts'

const url = process.env.URL

store.onExpiredStorageUrl = (urls) => {
  urls.forEach(({ path }) => {
    deleteFile(path)
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

export async function icyToSong(
  icy: string,
  time: number,
  prevCounts: Counts = {}
): Promise<[Song, Counts] | false> {
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
    additionals
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
  }
  return [compSong, counts]
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
  addHistory(icy, time)
}

async function main() {
  const res = await getCurrentPlay()

  store.counts = (await init()).counts
  store.setFirstIcy(res.icy)
  if (!url) {
    error('SetupErorr', 'empty envvar URL')
    process.exit(1)
  }

  subscribeIcy(url, receiveIcy, async () => {
    // change stream retry
    log('finish')
    await sleep(10 * 1000)
    queueMicrotask(main)
  })
}

main()
