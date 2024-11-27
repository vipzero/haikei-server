import { readFile, writeFile } from 'fs/promises'
import imagemin from 'imagemin'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import { error } from '../utils/logger'

export async function imageMin(path: string) {
  const originalFileBuffer = await readFile(path)

  const modifiedFileBuffer = await imagemin
    .buffer(originalFileBuffer, {
      plugins: [
        imageminMozjpeg({ quality: 50 }),
        imageminPngquant({ quality: [0.5, 0.6] }),
        imageminGifsicle(),
        // imageminSvgo(),
      ],
    })
    .catch((e) => {
      error('ImageMin', e)
      return false
    })
  if (typeof modifiedFileBuffer === 'boolean') return false
  await writeFile(path, modifiedFileBuffer)
  return true
}
