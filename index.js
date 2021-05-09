'use strict'

import subscribeIcy from './lib/icy'
import { saveMusic, addHistoryNow, getCurrentPlay, init } from './lib/firebase'
import { getImageLinks } from './lib/customImageSearch'
import { findSong } from './lib/findSong'
import { sleep } from './lib/utils'
import { getAlbum } from './lib/itunes'
import { anaCounts } from './lib/wordCounts'
import { getLyrics } from './lib/jlyricnet'
// import { spotifySearchSongInfo } from './lib/spotify'

const url = process.env.URL

async function main() {
  const res = await getCurrentPlay()
  let { counts } = await init()
  let startPlay = res && res.icy

  subscribeIcy(
    url,
    async (icy) => {
      if (startPlay && startPlay === icy) {
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
        counts,
        additionals
      )
      counts = countsNew

      const imageSearchWord = song.animeTitle ? song.animeTitle : icy
      const imageLinks = await getImageLinks(imageSearchWord)

      // const spoinfo = spotifySearchSongInfo(song.title, song.artist)
      // if (spoinfo) song.artwork = spoinfo.artwork

      // NOTE: 破壊的で微妙
      const albumInfos = await getAlbum(icy)
      const lyrics = await getLyrics(song.title, song.artist)
      const creators = lyrics ? lyrics.creators : {}
      const lyric = lyrics ? lyrics.lyric : null

      console.log(icy)
      console.log(song)

      // console.log(imageLinks)
      saveMusic(
        { ...song, imageLinks, ...albumInfos, ...creators, wordCounts },
        lyric
      )
    },
    async () => {
      // change stream retry
      console.log('finish')
      await sleep(10 * 1000)
      main()
    }
  )
}

main()
