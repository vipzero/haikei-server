import { writeFile } from 'fs/promises'
import { compareHashes, read } from 'jimp'
import { info, warnDesc } from '../utils/logger'

export async function jimpHash(path: string, mime: string) {
  const img = await read(path).catch(() => false as const)
  if (img === false) {
    warnDesc('read error', path)

    return false
  }

  // const res = await img.scaleToFit(1500, 1500).quality(60)
  const res = await img.quality(60)
  const res2 = await writeFile(path, await res.getBufferAsync(mime)).catch(
    () => false as const
  )
  if (res2 === false) return false
  const befSize = Buffer.byteLength(await img.getBufferAsync(mime))
  const aftSize = Buffer.byteLength(await res.getBufferAsync(mime))
  info(`${befSize} => ${aftSize}`)

  return { hash: res.hash(), height: res.getHeight(), width: res.getWidth() }
}

export async function isUniqueHash(check: string, targets: string[]) {
  return targets.every((v) => {
    const p = compareHashes(check, v)
    const dup = p < 0.15
    return !dup
  })
}
