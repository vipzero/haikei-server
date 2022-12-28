import { findSong } from './anisonDb/findSong'
import { uploadByUrlAll } from './imageIo/uploadManage'
import { getImageLinks } from './service/customImageSearch'
import {
  addHistory,
  deleteFile,
  getCurrentPlay,
  init,
  saveMusic,
} from './service/firebase'
import { getAlbum } from './service/itunes'
import { getLyricsSafe } from './service/jlyricnet'
import { Store, store } from './state/store'
import subscribeIcy from './streaming/icy'
import { Song } from './types/index'
import { sleep } from './utils'
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
  store: Store
): Promise<[Song] | false> {
  info(icy)

  if (store.isDuplicate(icy)) return false // 起動時の重複登録を防ぐ

  addHistory(icy, time)

  const song = findSong(icy)

  const additionals: string[] = [song.animeTitle, song.title].filter(
    Boolean
  ) as string[]
  const { wordCounts, counts } = anaCounts(icy, store.counts || {}, additionals)
  store.counts = counts

  const imageSearchWord = makeSearchQuery(song, Math.random())
  const imageLinksSync = prepareImages(imageSearchWord)

  const albumInfosSync = getAlbum(icy)
  const lyricsSync = getLyricsSafe(song.title, song.artist)

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
    time,
    imageSearchWord,
  }
  return [compSong]
}

async function receiveIcy(icy: string) {
  performance.mark('e2')
  performance.measure('first', 's2', 'e2')
  if (performance.getEntriesByName('first').length === 1) {
    log(performance.getEntriesByName('first')[0])
  }

  const res = await icyToSong(icy, Date.now(), store)
  if (!res) return
  const [song] = res
  songPrint(song)
  saveMusic(song)
}

performance.mark('s1')

async function main() {
  const res = await getCurrentPlay()
  performance.mark('e1')
  performance.measure('launch', 's1', 'e1')

  log(performance.getEntriesByName('launch')[0])

  performance.mark('s2')

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
    main()
  })
}

main()
