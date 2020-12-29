const icy = require('icy')
const { sjisToUtf8 } = require('./utils')

const url = process.env.URL

// URL to a known ICY stream
console.log(url)

function subscribeIcy(url, callback, onEnd) {
  // connect to the remote stream
  icy.get(url, (res) => {
    // log the HTTP response headers
    console.log(res.headers)

    // log any "metadata" events that happen
    res.on('metadata', (metadata) => {
      // console.log(encoding.detect(metadata))

      const parsed = icy.parse(sjisToUtf8(metadata))

      callback(parsed.StreamTitle)
    })
    res.on('end', () => {
      onEnd()
    })
    res.resume()
  })
}

exports.default = subscribeIcy
