'use strict'

const subscribeIcy = require('./lib/icy').default
const { saveMusic, addHistoryNow } = require('./lib/firebase')
const { getImage } = require('./lib/customImageSearch')
const { findSong } = require('./lib/findSong')
const { sleep } = require('./lib/utils')
const { getAlbum } = require('./lib/itunes')
// const { spotifySearchSongInfo } = require('./lib/spotify')

const url = process.env.URL

function main() {
  subscribeIcy(
    url,
    async (icy) => {
      addHistoryNow(icy)
      const song = findSong(icy)

      const imageSearchWord = song.animeTitle ? song.animeTitle : icy

      const res = await getImage(imageSearchWord).catch((e) => {
        console.error(e)
        return false
      })
      const imageLinks = res ? res.data.items.map((item) => item.link) : []

      // const spoinfo = spotifySearchSongInfo(song.title, song.artist)
      // if (spoinfo) song.artwork = spoinfo.artwork

      // NOTE: 破壊的で微妙
      const albumInfos = await getAlbum(icy)

      console.log(icy)
      console.log(song)

      // console.log(imageLinks)
      saveMusic({ ...song, imageLinks, ...albumInfos })
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
