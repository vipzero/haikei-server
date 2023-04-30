import fs from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'
import { CacheFile, CacheFileStat } from '../types'
import { raseTimeout } from '../utils'
import { error, info, log, warn, warnDesc } from '../utils/logger'
import { jimpHash } from './jimp'
import { sharpMin } from './sharp'
import {
  ImageSetupTimeTable,
  printImageSetupTimeTable,
} from '../utils/tableTimeLogger'

const uuidv4 = require('uuid/v4')

const pipeline = promisify(stream.pipeline)

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
          log(`Timeout`, `${url}`)
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
  url: string
): Promise<CacheFile | false> => {
  // tt.init(url)

  // log('s: ' + url)
  const stat: CacheFileStat = {
    url,
    times: { prev: performance.now(), dw: 0, sharp: 0, jimp: 0 },
    size: { before: 0, sharped: 0, sharpReport: 0, jimped: 0 },
  }

  const filePath = `tmp/${uuidv4()}`

  const res = await raseTimeout(download(url, filePath), 10000, false as const)

  if (res === 'SaveError' || !res) return false
  stat.times.dw = performance.now() - stat.times.prev
  stat.times.prev = performance.now()

  // await imageMin(filePath)

  const shapeTask = sharpMin(filePath).catch((e) => {
    warnDesc('UnsupportedError', e)
    return false as const
  })
  const shapeRes = await raseTimeout(shapeTask, 10000, false as const)
  if (!shapeRes) return false

  const { size, height, width, format } = shapeRes
  const fileType = mimeMap[format] || fileTypeDefault

  stat.times.sharp = performance.now() - stat.times.prev
  stat.times.prev = performance.now()

  const jimpTask = jimpHash(filePath, fileType.mime).catch((e) => {
    warnDesc('JimpError', e)
    return false as const
  })

  const resj = await raseTimeout(jimpTask, 10000, false as const)

  if (!resj) return false
  const { hash } = resj
  stat.times.jimp = performance.now() - stat.times.prev
  stat.times.prev = performance.now()

  return { filePath, fileType, size, height, width, hash, stat }
}
