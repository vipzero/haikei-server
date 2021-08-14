import { error, warn, log } from '../logger'
import { fromStream } from 'file-type'
import fs from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'
import { imageMin } from './imagemin'
import { sharpMin } from './sharp'

const uuidv4 = require('uuid/v4')

const pipeline = promisify(stream.pipeline)
const fileTypeDefault = { ext: 'png', mime: 'image/png' }

export const downloadOptimize = async (url: string) => {
  const uuid = uuidv4()
  const filePath = `tmp/${uuid}`
  const stream = got.stream(url)
  const fileTypePromise = fromStream(stream).catch((e) => {
    if (e.message.includes('End-Of-Stream')) {
      warn(`EndOfStreamError`, `${url} ${filePath}`)
      return
    } else {
      error(`FileTypeError`, `${url} ${filePath}`)
      log(JSON.stringify(e))
    }

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
  if (res === 'SaveError') return false as const
  await imageMin(filePath)
  await sharpMin(filePath)

  const ft = await fileTypePromise

  return { filePath, fileType: ft || fileTypeDefault }
}
