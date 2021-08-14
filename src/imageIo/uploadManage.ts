import { uploadByUrl } from '../service/firebase'
import { error } from '../logger'
import { UploadFile } from '../types/index'

export const uploadByUrlAll = async (urls: string[]) => {
  const timeId = +new Date()
  const uploads: UploadFile[] = []

  for (const [i, url] of urls.entries()) {
    // console.log(url)
    const res = await uploadByUrl(url, `${timeId}_${i}`).catch((e) => {
      error('UploadError', e)
      return false as const
    })
    // console.log(res)

    if (!res) continue

    uploads.push(res)
    if (uploads.length >= 3) break
  }
  return uploads
}
