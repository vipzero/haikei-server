const icy = require('icy')
const iconv = require('iconv-lite')

const encodingFrom = 'SJIS'

const url = process.env.URL

// URL to a known ICY stream
console.log(url)

function subscribeIcy(url, callback) {
  // connect to the remote stream
  icy.get(url, (res) => {
    // log the HTTP response headers
    console.log(res.headers)

    // log any "metadata" events that happen
    res.on('metadata', (metadata) => {
      // console.log(encoding.detect(metadata))

      const parsed = icy.parse(iconv.decode(metadata, encodingFrom))

      const [artist, title] = parsed.StreamTitle.split(' - ')
      callback({ artist, title })
    })
    res.resume()
  })
}

exports.default = subscribeIcy
