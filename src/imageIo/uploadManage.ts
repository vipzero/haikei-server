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

  for (const [i, file] of downloads.entries()) {
    const id = `${timeId}_${i}`
    const res = await uploadStorage(file, id).catch((e) => {
      error('UploadError', e)
      return false as const
    })
    if (!res) continue
    uploads.push(res)
    if (uploads.length >= 3) break
  }

  return uploads
}
