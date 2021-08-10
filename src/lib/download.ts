import { fromStream } from 'file-type'
import fs from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'

const uuidv4 = require('uuid/v4')

const pipeline = promisify(stream.pipeline)
const fileTypeDefault = { ext: '.png', mime: 'image/png' }

export const downloadOptimize = async (url: string) => {
  const uuid = uuidv4()
  const filePath = `tmp/${uuid}`
  const stream = got.stream(url)
  const fileTypePromise = fromStream(stream).catch((e) => {
    console.log(typeof e)

    console.log(e.message)
    if (e.message.includes('End-Of-Stream')) {
      console.error(`FileTypeError: ${url} ${filePath}`)
    }
    console.error(`FileTypeError: ${url} ${filePath}`)
    console.log(JSON.stringify(e))

    return fileTypeDefault
  })

  const res = await pipeline(stream, fs.createWriteStream(filePath)).catch(
    (e) => {
      console.log(typeof e)
      console.log({ e })
      console.error(`DownloadSaaveError: ${url} ${filePath}`)
      return 'SaveError' as const
    }
  )
  if (res === 'SaveError') return false as const

  const ft = await fileTypePromise

  return { filePath, fileType: ft || fileTypeDefault }
}
