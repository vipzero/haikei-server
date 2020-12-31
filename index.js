'use strict'

const subscribeIcy = require('./lib/icy').default
const {
  saveMusic,
  addHistoryNow,
  getCurrentPlay,
  getAllIcy,
} = require('./lib/firebase')
const { getImageLinks } = require('./lib/customImageSearch')
const { findSong } = require('./lib/findSong')
const { sleep, parseCountWords } = require('./lib/utils')
const { getAlbum } = require('./lib/itunes')
const { saveCounts } = require('./lib/wordCounts')
const { getLyrics } = require('./lib/jlyricnet')
// const { spotifySearchSongInfo } = require('./lib/spotify')

const url = process.env.URL

async function main() {
  const res = await getCurrentPlay()
  let counts = getAllIcy()
  let startPlay = res && res.icy

  subscribeIcy(
    url,
    async (icy) => {
      if (startPlay && startPlay === icy) {
        // 起動時の重複登録を防ぐ
        startPlay = false
        return
      }
      addHistoryNow(icy)
      const song = findSong(icy)
      const [countsNew, entries] = parseCountWords(icy, counts)

      counts = countsNew
      saveCounts(counts)

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

      const wordCounts = {}
      entries.forEach((ent) => {
        wordCounts[ent] = counts[ent]
      })
      console.log({ wordCounts })

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
