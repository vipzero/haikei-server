'use strict'

const subscribeIcy = require('./icy').default
const songs = require('./loadDb').default

const url = process.env.URL

subscribeIcy(url, ({ artist, title }) => {
  console.log({ artist, title })
  console.log(songs[title])
})
