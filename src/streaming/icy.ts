import { error } from '../utils/logger'
import { sjisToUtf8 } from '../utils'
const icy = require('icy')

type IcyRes = {
  on: {
    (event: 'metadata', callback: (metadata: Buffer) => void): void
    (event: 'end', callback: () => void): void
  }
  headers: Record<string, string>
  resume: () => void
}

export function subscribeIcy(
  url: string,
  callback: (icy: string) => void,
  onEnd: () => void
) {
  // connect to the remote stream
  const p = icy.get(url, (res: IcyRes) => {
    // log the HTTP response headers
    // log(res.headers)

    // log any "metadata" events that happen
    res.on('metadata', (metadata) => {
      // console.log(encoding.detect(metadata))

      const parsed = icy.parse(sjisToUtf8(metadata))

      callback(parsed.StreamTitle)
    })
    res.on('end', onEnd)
    res.resume()
  })
  p.on('error', (e: Error) => {
    error('icyGetError', e.message)
    onEnd()
  })
}
