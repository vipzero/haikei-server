import icy from 'icy'
import { sjisToUtf8 } from './utils'

type IcyRes = {
  on: <
    T extends 'metadata' | 'end',
    Callback = T extends 'metadata' ? (metadata: Buffer) => void : () => void
  >(
    event: T,
    callback: Callback
  ) => void
  headers: any
  resume: () => void
}

function subscribeIcy(
  url: string,
  callback: (icy: string) => void,
  onEnd: () => void
) {
  // connect to the remote stream
  icy.get(url, (res: IcyRes) => {
    // log the HTTP response headers
    console.log(res.headers)

    // log any "metadata" events that happen
    res.on('metadata', (metadata) => {
      // console.log(encoding.detect(metadata))

      const parsed = icy.parse(sjisToUtf8(metadata))

      callback(parsed.StreamTitle)
    })
    res.on('end', () => onEnd())
    res.resume()
  })
}

export default subscribeIcy
