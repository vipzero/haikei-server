'use strict'

const subscribeIcy = require('./lib/icy').default
const { saveMusic } = require('./lib/firebase')
const { getImage } = require('./lib/customImageSearch')
const { findSong } = require('./lib/findSong')

const url = process.env.URL

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))

function main() {
  subscribeIcy(
    url,
    async (icy) => {
      const song = findSong(icy)

      const imageSearchWord = song.animeTitle ? song.animeTitle : icy

      console.log(icy)
      console.log(song)

      const res = await getImage(imageSearchWord).catch((e) => {
        console.error(e)
        saveMusic(song)
        return false
      })
      if (!res) return

      const imageLinks = res.data.items.map((item) => item.link)
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
