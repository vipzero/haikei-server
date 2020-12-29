'use strict'

const subscribeIcy = require('./lib/icy').default
const { saveMusic, addHistoryNow } = require('./lib/firebase')
const { getImage } = require('./lib/customImageSearch')
const { findSong } = require('./lib/findSong')
const { sleep } = require('./lib/utils')
// const { spotifySearchSongInfo } = require('./lib/spotify')

const url = process.env.URL

function main() {
  subscribeIcy(
    url,
    async (icy) => {
      addHistoryNow(icy)
      const song = findSong(icy)

      const imageSearchWord = song.animeTitle ? song.animeTitle : icy

      console.log(icy)
      console.log(song)

      const res = await getImage(imageSearchWord).catch((e) => {
        console.error(e)
        return false
      })

      // const spoinfo = spotifySearchSongInfo(song.title, song.artist)
      // if (spoinfo) song.artwork = spoinfo.artwork

      const imageLinks = res ? res.data.items.map((item) => item.link) : []
      // console.log(imageLinks)
      saveMusic({ ...song, imageLinks })
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
