import fs from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'
import { CacheFile } from '../types'
import { error, log, warn } from '../utils/logger'
import { jimpHash } from './jimp'
import { sharpMin } from './sharp'

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
const gotOption = { timeout: { request: 3000 } }

export const downloadOptimize = async (
  url: string
): Promise<CacheFile | false> => {
  // log('s: ' + url)
  const filePath = `tmp/${uuidv4()}`
  const stream = got.stream(url, gotOption)

  let ts = Date.now()
  let res
  try {
    res = await pipeline(stream, fs.createWriteStream(filePath)).catch((e) => {
      if (e.name === 'TimeoutError') {
        log(`Timeout`, `${url}`)
      } else {
        error(`DownloadSaveError`, `${url} ${filePath}`)
        log(JSON.stringify(e))
      }
      return 'SaveError' as const
    })
  } catch (e) {
    warn(`out-DownloadSaveError`, JSON.stringify(e))
    res = 'SaveError'
  }
  log(` dw: ${Date.now() - ts}ms`)
  if (res === 'SaveError') return false
  // await imageMin(filePath)

  ts = Date.now()

  const shapeRes = await sharpMin(filePath).catch((e) => {
    warn('UnsupportedError', e)
    return false as const
  })
  if (!shapeRes) return false

  const { size, height, width, format } = shapeRes
  const fileType = mimeMap[format] || fileTypeDefault

  log(` shape: ${Date.now() - ts}ms`)

  ts = Date.now()
  const resj = await jimpHash(filePath, fileType.mime).catch((e) => {
    warn('JimpError', e)
    return false as const
  })
  if (!resj) return false
  const { hash } = resj
  log(`  jimp: ${Date.now() - ts}ms`)
  // log(`   size: ${width}x${height}`)

  return { filePath, fileType, size, height, width, hash }
}
