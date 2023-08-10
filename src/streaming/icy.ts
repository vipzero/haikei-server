import { sjisToUtf8 } from '../utils'
const icy = require('icy')

type IcyRes = {
  on: <
    T extends 'metadata' | 'end',
    Callback = T extends 'metadata' ? (metadata: Buffer) => void : () => void
  >(
    event: T,
    callback: Callback
  ) => void
  headers: Record<string, string>
  resume: () => void
}

export function subscribeIcy(
  url: string,
  callback: (icy: string) => void,
  onEnd: () => void
) {
  // connect to the remote stream
  icy.get(url, (res: IcyRes) => {
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
}
