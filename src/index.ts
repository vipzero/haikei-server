import { unlink } from 'fs/promises'
import { findSong } from './findSong'
import subscribeIcy from './icy'
import { uploadByUrlAll } from './imageIo/uploadManage'
import { error, info, log, songPrint, warn } from './logger'
import { makeSearchQuery } from './makeSearchWord'
import { getImageLinks } from './service/customImageSearch'
import {
  addHistoryNow,
  deleteFile,
  getCurrentPlay,
  init,
  saveMusic,
} from './service/firebase'
import { getAlbum } from './service/itunes'
import { getLyricsSafe } from './service/jlyricnet'
// import { spotifySearchSongInfo } from './spotify'
import { store } from './state/store'
import { Song } from './types/index'
import { sleep } from './utils'
import { anaCounts } from './wordCounts'

const url = process.env.URL

store.onExpiredStorageUrl = (urls) => {
  urls.forEach(({ tmpFilePath, path }) => {
    unlink(tmpFilePath).catch((e) => {
      if (e.code === 'ENOENT') return warn('NoFile', tmpFilePath)

      error('RemoveFile', e)
    })
    deleteFile(path)
  })
}

async function prepareImages(q: string) {
  const googleImageLinks = await getImageLinks(q)
  const uploads = await uploadByUrlAll(googleImageLinks)
  store.addQueue(uploads)
  return uploads.map((u) => u.downloadUrl)
}

async function receiveIcy(icy: string) {
  info(icy)

  if (store.isDuplicate(icy)) return // 起動時の重複登録を防ぐ

  addHistoryNow(icy)

  const song = findSong(icy)
  const additionals: string[] = [song.animeTitle, song.title].filter(
    Boolean
  ) as string[]
  const { wordCounts, counts } = anaCounts(icy, store.counts || {}, additionals)
  store.counts = counts

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

  songPrint(compSong)
  saveMusic(compSong)
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
    main()
  })
}

main()
