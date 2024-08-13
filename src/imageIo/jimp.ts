import { compareHashes, read } from 'jimp'
import { error, warnDesc } from '../utils/logger'
import { enableMobileImg, enableQuality } from '../config'

const QUALITY_MAP: Record<string, number> = {
  'image/jpeg': 50,
  'image/png': 70,
}
// const enableResize = true

export async function jimpHash(path: string) {
  const img = await read(path).catch(() => false as const)
  if (img === false) {
    warnDesc('read error', path, 2)

    return false
  }
  const needClop = img.bitmap.height > 1500 || img.bitmap.width > 1500
  const mime = img.getMIME()
  const resized = needClop ? await img.scaleToFit(1500, 1500) : img

  const res = enableQuality
    ? await resized.quality(QUALITY_MAP[mime] || 80)
    : resized
  if (enableQuality || needClop) {
    await res.writeAsync(path).catch(() => error('write error', path, 2))
  }

  if (enableMobileImg) {
    const minPath = path + '_m'
    const needClop = img.bitmap.height > 1500 || img.bitmap.width > 400
    if (needClop) {
      const resized = needClop ? await img.scaleToFit(1500, 400) : img

      const resMobile = enableQuality
        ? await resized.quality(QUALITY_MAP[mime] || 80)
        : resized
      if (enableQuality || needClop) {
        await resMobile
          .writeAsync(minPath)
          .catch(() => error('write error', path))
      }
    } else {
      await res.writeAsync(minPath).catch(() => error('write error', path))
    }
  }

  return {
    hash: res.hash(),
    height: res.getHeight(),
    width: res.getWidth(),
    mime,
  }
}

export async function isUniqueHash(check: string, targets: string[]) {
  return targets.every((v) => {
    try {
      const p = compareHashes(check, v)
      const dup = p < 0.15

      return !dup
    } catch (e) {
      error('compareHashes', '')
    }
  })
}
