import { unlink } from 'fs/promises'
import { UploadFile } from '../types/index'
import { error, log } from '../utils/logger'
import { uploadStorage } from './../service/firebase'
import { CacheFile } from './../types/index'
import { downloadOptimize } from './download'
import { isUniqueHash } from './jimp'
import { printImageSetupTimeTable } from '../utils/tableTimeLogger'
import { urlex } from '../utils/urlex'
import { moveCursor } from 'readline'
import { sleep } from '../utils'

const progressBarWidth = 40
const nonFalse = <T>(v: T | false): v is T => v !== false
export const uploadByUrlAll = async (urls: string[]) => {
  const timeId = +new Date()

  urls.forEach((url) => {
    log(urlex(url), 2)
  })
  const l = urls.length
  const tp = l * 2
  const prog: number[] = [0, 0, 0] as const
  const prog2: number[] = Array(l).fill(0)
  let writed = false
  const step = (id: number, k: number) => {
    if (!writed) {
      writed = true
      log('\n\n\n')
    }
    moveCursor(process.stdout, 0, -3)
    prog[k]++
    prog2[id] = k
    const i = prog[0]! + prog[1]! + prog[2]!
    const p = i / tp
    const pcn = prog.map((v) => Math.floor((v / tp) * progressBarWidth))
    const space = '_'.repeat(
      Math.max(0, progressBarWidth - pcn[0]! - pcn[1]! - pcn[2]!)
    )
    log(
      `[${pcn
        .map((v, i) => `${'-+='[i]}`.repeat(v))
        .join('')}${space} ${Math.round(p * 100)}%]`,
      0
    )
    log(prog2.map((v) => ['__', '||', '###'][v]).join('|') + '\n', 1)
  }

  const downloads: CacheFile[] = (
    await Promise.all(
      urls.map((url, id) => downloadOptimize(url, (i) => step(id, i)))
    )
  ).filter((v) => nonFalse(v)) as CacheFile[]
  await sleep(100)
  // tt.print()
  printImageSetupTimeTable(downloads.map((v) => v.stat))

  const uploads: UploadFile[] = []
  const selects = choiceImage(downloads)
  const hashs: string[] = []

  for (const [i, file] of selects.entries()) {
    if (!(await isUniqueHash(file.hash, hashs))) {
      continue
    }
    hashs.push(file.hash)

    const id = `${timeId}_${i}`
    const res = await uploadStorage(file, id).catch((e) => {
      error('UploadError', e)
      return false as const
    })
    await uploadStorage(
      { ...file, filePath: file.filePath + '_m' },
      id + '_min'
    ).catch((e) => {
      error('UploadError', e)
      return false as const
    })
    if (!res) continue
    uploads.push(res)
    if (uploads.length >= 5) break
  }
  downloads.map((f) => unlink(f.filePath))

  return uploads
}

export const imageSortScore = (file: CacheFile, order: number): number => {
  let point = 0
  const { height, width, size } = file
  if (order >= 6) point += 1
  if (order >= 8) point += 1 // 検索順後方の意外性プラス
  if (file.fileType.ext === 'gif') point += 1
  if (['jpg', 'jpeg'].includes(file.fileType.ext)) point -= 1
  const raito = height / width
  if (0.95 < raito && raito < 1.05) point -= 1 // 正方形・ジャケット画像マイナス
  if (raito < 0.25 && 4 < raito) point -= 1 // 正方形・ジャケット画像マイナス

  if (400_000 <= size) point -= 100 // 制限
  if (300_000 <= size && size < 400_000) point -= 2
  if (200_000 <= size && size < 300_000) point += 0
  if (100_000 <= size && size < 200_000) point += 1
  if (size < 100_000) point += 2 // 助かるサイズ 100KB~200KB

  const fsize = height + width // frame size raito

  if (500 <= fsize && fsize < 800) point -= 1 // 解像度が低すぎる
  if (fsize <= 500) point -= 3
  if (fsize <= 300) point -= 100 // 制限

  return point
}

export const choiceImage = (files: CacheFile[]): CacheFile[] => {
  const res = files
    .map((file, i) => [imageSortScore(file, i), file] as const)
    .sort(([a], [b]) => b - a)

  return res.map(([, file]) => file)
}
