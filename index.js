'use strict'

const subscribeIcy = require('./icy')

const url = process.env.URL

subscribeIcy(url, ({ artist, title }) => {})
