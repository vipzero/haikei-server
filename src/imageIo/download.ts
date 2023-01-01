import fs from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'
import { CacheFile } from '../types'
import { error, log, warn } from '../utils/logger'
import { imageMin } from './imagemin'
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

export const downloadOptimize = async (
  url: string
): Promise<CacheFile | false> => {
  const uuid = uuidv4()
  const filePath = `tmp/${uuid}`
  const stream = got.stream(url, { timeout: { request: 5000 } })

  const res = await pipeline(stream, fs.createWriteStream(filePath)).catch(
    (e) => {
      error(`DownloadSaveError`, `${url} ${filePath}`)
      log(typeof e)
      log(JSON.stringify(e))
      return 'SaveError' as const
    }
  )
  if (res === 'SaveError') return false
  await imageMin(filePath)
  const shapeRes = await sharpMin(filePath).catch((e) => {
    warn('UnsupportedError', e)
    return false as const
  })
  if (!shapeRes) return false

  const { size, height, width, format } = shapeRes

  const fileType = mimeMap[format] || fileTypeDefault

  return { filePath, fileType, size, height, width }
}
