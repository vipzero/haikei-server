import { compareHashes, read } from 'jimp'
import { warnDesc } from '../utils/logger'

const QUALITY_MAP: Record<string, number> = {
  'image/jpeg': 50,
  'image/png': 70,
}

export async function jimpHash(path: string, mime: string) {
  const img = await read(path).catch(() => false as const)
  if (img === false) {
    warnDesc('read error', path)

    return false
  }

  const res = await img.quality(QUALITY_MAP[mime] || 80).write(path)

  return { hash: res.hash(), height: res.getHeight(), width: res.getWidth() }
}

export async function isUniqueHash(check: string, targets: string[]) {
  return targets.every((v) => {
    const p = compareHashes(check, v)
    const dup = p < 0.15
    return !dup
  })
}
