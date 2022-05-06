import crypto from 'crypto'

const random = (seed: string) =>
  crypto.createHash('sha256').update(seed).digest().readUInt32LE()

export const shuffle = <T>(a: T[], seed: string) => {
  return a
    .map((v) => ({ v, r: random(seed + v) }))
    .sort((a, b) => a.r - b.r)
    .map(({ v }) => v)
}
