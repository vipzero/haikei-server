import { error, warn, log } from '../utils/logger'
import { fromStream } from 'file-type'
import fs from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'
import { imageMin } from './imagemin'
import { sharpMin } from './sharp'
import { CacheFile } from '../types'

const uuidv4 = require('uuid/v4')

const pipeline = promisify(stream.pipeline)
const fileTypeDefault = { ext: 'png', mime: 'image/png' }

export const downloadOptimize = async (
  url: string
): Promise<CacheFile | false> => {
  const uuid = uuidv4()
  const filePath = `tmp/${uuid}`
  const stream = got.stream(url)
  const fileTypePromise = fromStream(stream).catch(() => {
    // if (e.message.includes('End-Of-Stream')) {
    //   warn(`EndOfStreamError`, `${url} ${filePath}`)
    //   return
    // } else {
    //   error(`FileTypeError`, `${url} ${filePath}`)
    //   log(JSON.stringify(e))
    // }

    return fileTypeDefault
  })

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

  const { size, height, width } = shapeRes

  const fileType = (await fileTypePromise) || fileTypeDefault

  return { filePath, fileType, size, height, width }
}
