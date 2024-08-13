import fs, { statSync } from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'
import { CacheFile, CacheFileStat } from '../types'
import { raseTimeout } from '../utils'
import { error, log, warnDesc } from '../utils/logger'
import { jimpHash } from './jimp'
// import { sharpMin } from './sharp'
import { imagePrepareTimeoutMs } from '../config'

const uuidv4 = require('uuid/v4')

const pipeline = promisify(stream.pipeline)
const timeout = imagePrepareTimeoutMs

const mimeJpg = { ext: 'jpg', mime: 'image/jpeg' }
const mimePng = { ext: 'png', mime: 'image/png' }
const mimeWebp = { ext: 'webp', mime: 'image/webp' }
const mimeGif = { ext: 'gif', mime: 'image/gif' }
const mimeSvg = { ext: 'svg', mime: 'image/svg+xml' }

const mimeMap: Record<string, CacheFile['fileType']> = {
  jpeg: mimeJpg,
  jpg: mimeJpg, // will unuse
  png: mimePng,
  webp: mimeWebp,
  gif: mimeGif,
  svg: mimeSvg,
}
const fileTypeDefault = mimePng
const gotOption = { timeout: { response: 10_000 } }

export const download = async (url: string, filePath: string) => {
  let res: string | boolean = true
  try {
    const stream = got.stream(url, gotOption)
    res = await pipeline(stream, fs.createWriteStream(filePath))
      .catch((e) => {
        if (e.name === 'TimeoutError') {
          log(`Timeout ${url}`, 2)
        } else {
          error(`DownloadSaveError`, `${url} ${filePath}`)
          log(JSON.stringify(e))
        }
        return 'SaveError' as const
      })
      .then(() => true)
  } catch (e) {
    warnDesc(`out-DownloadSaveError`, JSON.stringify(e))
    res = 'SaveError'
  }
  return res
}

export const downloadOptimize = async (
  url: string,
  stepCallback: (step: number) => void
): Promise<CacheFile | false> => {
  const stat: CacheFileStat = {
    url,
    times: { prev: performance.now(), dw: 0, sharp: 0, jimp: 0 },
    size: { before: 0, sharped: 0, sharpReport: 0, jimped: 0 },
  }

  const filePath = `tmp/${uuidv4()}`

  const res = await raseTimeout(
    download(url, filePath),
    timeout,
    false as const
  )

  if (res === 'SaveError' || !res) return false
  stat.times.dw = performance.now() - stat.times.prev
  stat.times.prev = performance.now()
  stat.size.before = statSync(filePath).size
  stepCallback(1)

  // const sharpTask = sharpMin(filePath).catch((e) => {
  //   warnDesc('UnsupportedError', e)
  //   return false as const
  // })
  // const sharpRes = await raseTimeout(sharpTask, timeout, false as const)
  // if (!sharpRes) return false

  // stat.times.sharp = performance.now() - stat.times.prev
  // stat.times.prev = performance.now()
  // stat.size.sharped = statSync(filePath).size
  // stat.size.sharpReport = size
  // stepCallback(1)

  // const fileType = mimeMap[format] || fileTypeDefault
  const jimpTask = jimpHash(filePath).catch((e) => {
    warnDesc('JimpError', e)
    return false as const
  })

  const resj = await raseTimeout(jimpTask, timeout, false as const)

  if (!resj) return false
  const fileType =
    Object.values(mimeMap).find((v) => v.mime === resj.mime) || fileTypeDefault
  const { hash, height, width } = resj
  stat.times.jimp = performance.now() - stat.times.prev
  stat.times.prev = performance.now()
  stat.size.jimped = statSync(filePath).size
  const size = stat.size.jimped
  stepCallback(2)

  return { filePath, fileType, size, height, width, hash, stat }
}
