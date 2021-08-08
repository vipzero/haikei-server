import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'

// const imageminSvgo = require('imagemin-svgo');

export function imageMin(path) {
  return imagemin([path], {
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: '65-80' }),
      imageminGifsicle(),
      // imageminSvgo(),
    ],
  })
}
