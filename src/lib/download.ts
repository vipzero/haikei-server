import fs from 'fs'
import got from 'got'
import { promisify } from 'util'
import stream from 'stream'

import { fromStream } from 'file-type'

const uuidv4 = require('uuid/v4')

const pipeline = promisify(stream.pipeline)
const fileTypeDefault = { ext: '.png', mime: 'image/png' }

export const downloadOptimize = async (url: string) => {
  const uuid = uuidv4()
  const filePath = `tmp/${uuid}`
  const stream = got.stream(url)
  const fileTypePromise = fromStream(stream)

  const res = await pipeline(stream, fs.createWriteStream(filePath)).catch(
    (err) => {
      console.error('Save Error')
      console.error({ url, filePath })
      return 'SaveError' as const
    }
  )
  if (res === 'SaveError') return false as const

  const ft = await fileTypePromise.catch((e) => {
    console.error({ url, filePath })

    return fileTypeDefault
  })

  return { filePath, fileType: ft || fileTypeDefault }
}
