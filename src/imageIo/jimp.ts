import { compareHashes, read } from 'jimp'
import { log, warnDesc } from '../utils/logger'
import { enableQuality } from '../config'

const QUALITY_MAP: Record<string, number> = {
  'image/jpeg': 50,
  'image/png': 70,
}
// const enableResize = true

export async function jimpHash(path: string) {
  const img = await read(path).catch(() => false as const)
  if (img === false) {
    warnDesc('read error', path)

    return false
  }
  const needClop = img.bitmap.height > 1500 || img.bitmap.width > 1500
  const start = performance.now()
  const mime = img.getMIME()
  log(performance.now() - start)

  log(`${img.bitmap.width}x${img.bitmap.height}`)
  const resized = needClop ? await img.scaleToFit(1500, 1500) : img

  log(performance.now() - start)

  const res = enableQuality
    ? await resized.quality(QUALITY_MAP[mime] || 80)
    : resized
  res.write(path)
  log(`${res.getWidth()}x${res.getHeight()}`)

  log(performance.now() - start)
  log(res.hash())
  log(performance.now() - start)
  log(`${res.getHeight()}x${res.getWidth()}`)
  log(performance.now() - start)

  return {
    hash: res.hash(),
    height: res.getHeight(),
    width: res.getWidth(),
    mime,
  }
}

export async function isUniqueHash(check: string, targets: string[]) {
  return targets.every((v) => {
    const p = compareHashes(check, v)
    const dup = p < 0.15
    return !dup
  })
}
