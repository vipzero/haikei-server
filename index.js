'use strict'

const icy = require('icy')
const iconv = require('iconv-lite')

const encodingFrom = 'SJIS'

const url = process.env.URL

// URL to a known ICY stream
console.log(url)

// connect to the remote stream
icy.get(url, (res) => {
  // log the HTTP response headers
  console.log(res.headers)

  // log any "metadata" events that happen
  res.on('metadata', (metadata) => {
    // console.log(encoding.detect(metadata))

    const parsed = icy.parse(iconv.decode(metadata, encodingFrom))

    // console.log(encoding.detect(parsed.StreamTitle))
    console.log(parsed.StreamTitle)
  })
  res.resume()
})
