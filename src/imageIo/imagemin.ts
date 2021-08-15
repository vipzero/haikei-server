import { error } from '../utils/logger'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'

// const imageminSvgo = require('imagemin-svgo');

export function imageMin(path: string) {
  return imagemin([path], {
    destination: 'tmp',
    plugins: [
      imageminMozjpeg({ quality: 50 }),
      imageminPngquant({ quality: [0.5, 0.6] }),
      imageminGifsicle(),
      // imageminSvgo(),
    ],
  }).catch((e) => {
    error('ImageMin', e)
    return false
  })
}
