import { unlink } from 'fs/promises'
import { error } from '../logger'
import { UploadFile } from '../types/index'
import { uploadStorage } from './../service/firebase'
import { CacheFile } from './../types/index'
import { downloadOptimize } from './download'

export const uploadByUrlAll = async (urls: string[]) => {
  const timeId = +new Date()

  const downloads: CacheFile[] = []
  for (const url of urls) {
    // console.log(url)
    const res = await downloadOptimize(url)
    if (!res) continue
    downloads.push(res)
    // console.log(res)
  }

  const uploads: UploadFile[] = []

  const selects = choiceImage(downloads)

  for (const [i, file] of selects.entries()) {
    const id = `${timeId}_${i}`
    const res = await uploadStorage(file, id).catch((e) => {
      error('UploadError', e)
      return false as const
    })
    if (!res) continue
    uploads.push(res)
    if (uploads.length >= 3) break
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

  if (400_000 <= size) point -= 3
  if (300_000 <= size && size < 400_000) point -= 2
  if (200_000 <= size && size < 300_000) point += 0
  if (100_000 <= size && size < 200_000) point += 1
  if (size < 100_000) point += 2 // ちょうどよいサイズ 100KB~200KB

  const fsize = height + width // frame size raito

  if (500 <= fsize && fsize < 800) point -= 1 // 解像度が低すぎる
  if (fsize <= 500) point -= 3

  return point
}

export const choiceImage = (files: CacheFile[]): CacheFile[] => {
  const res = files
    .map((file, i) => [imageSortScore(file, i), file] as const)
    .sort(([a], [b]) => a - b)

  return res.map(([, file]) => file)
}
