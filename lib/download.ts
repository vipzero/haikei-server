import fs from 'fs'
import got from 'got'
import { promisify } from 'util'
import stream from 'stream'

import { fromStream } from 'file-type'

const uuidv4 = require('uuid/v4')

const pipeline = promisify(stream.pipeline)

export const downloadOptimize = async (url: string) => {
  const uuid = uuidv4()
  const filePath = `tmp/${uuid}`
  const stream = got.stream(url)
  const fileTypePromise = fromStream(stream)

  await pipeline(stream, fs.createWriteStream(filePath))
  fs.copyFileSync(filePath, filePath + '_back')

  const ft = await fileTypePromise

  console.log(ft)

  return { filePath, mine: '' }
}
