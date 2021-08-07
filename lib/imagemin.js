const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminGifsicle = require('imagemin-gifsicle')
// const imageminSvgo = require('imagemin-svgo');
imagemin(['src/*.{jpg,png,gif}'], 'dest', {
  plugins: [
    imageminMozjpeg({ quality: 80 }),
    imageminPngquant({ quality: '65-80' }),
    imageminGifsicle(),
    // imageminSvgo(),
  ],
})
