import fs from 'fs'
import got from 'got'
import stream from 'stream'
import { promisify } from 'util'
import { CacheFile } from '../types'
import { error, info, log, warn, warnDesc } from '../utils/logger'
import { jimpHash } from './jimp'
import { sharpMin } from './sharp'
import { raseTimeout, sleep } from '../utils'

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

const putil = () => {
  let prev = performance.now()

  return {
    mark(name: string) {
      const cur = performance.now()
      const ms = Math.floor(cur - prev)
      if (ms < 1000) {
        info(`${name}${ms}ms`)
      } else {
        warn(`${name}${ms}ms`)
      }

      prev = cur
    },
  }
}
export const download = async (url: string, filePath: string) => {
  let res
  try {
    const stream = got.stream(url, gotOption)
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
    warnDesc(`out-DownloadSaveError`, JSON.stringify(e))
    res = 'SaveError'
  }
  return res
}

export const downloadOptimize = async (
  url: string
): Promise<CacheFile | false> => {
  const time = putil()

  // log('s: ' + url)
  const filePath = `tmp/${uuidv4()}`

  const res = await raseTimeout(download(url, filePath), 10000, false as const)

  time.mark(` dw: `)
  if (res === 'SaveError' || !res) return false
  // await imageMin(filePath)

  const shapeTask = sharpMin(filePath).catch((e) => {
    warnDesc('UnsupportedError', e)
    return false as const
  })
  const shapeRes = await raseTimeout(shapeTask, 10000, false as const)
  if (!shapeRes) return false

  const { size, height, width, format } = shapeRes
  const fileType = mimeMap[format] || fileTypeDefault

  time.mark(` shape: `)

  const jimpTask = jimpHash(filePath, fileType.mime).catch((e) => {
    warnDesc('JimpError', e)
    return false as const
  })
  const resj = await raseTimeout(jimpTask, 10000, false as const)

  if (!resj) return false
  const { hash } = resj
  time.mark(`  jimp: `)
  // time.mark(`   size: `)

  return { filePath, fileType, size, height, width, hash }
}
