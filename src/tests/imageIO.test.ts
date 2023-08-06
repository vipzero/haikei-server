import { choiceImage } from '../imageIo/uploadManage'
import { CacheFile } from '../types'

test('choiceImage', () => {
  const basePng = {
    fileType: { ext: 'png', mime: 'image/png' },
    size: 100_000,
    height: 700,
    width: 800,
    hash: 'ffffff',
    // stat: {
    //   url: '',
    //   times: { prev: 0, dw: 0, sharp: 0, jimp: 0 },
    //   size: { before: 0, sharped: 0, sharpReport: 0, jimped: 0 },
    // },
  } as CacheFile
  const downloads: CacheFile[] = [
    {
      ...basePng,
      filePath: 'will skipped',
      size: 555117,
    },
    {
      ...basePng,
      filePath: 'tmp/base_png',
    },
    {
      ...basePng,
      filePath: 'tmp/base_jpg',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
    },
    {
      ...basePng,
      filePath: 'tmp/jacket_png',
      height: 500,
      width: 500,
    },
    {
      ...basePng,
      filePath: 'tmp/will_skip_smaller',
      height: 30,
      width: 80,
    },
    {
      ...basePng,
      filePath: 'tmp/bad_raito',
      height: 1000,
      width: 30,
    },
  ]

  expect(choiceImage(downloads)).toMatchInlineSnapshot(`
[
  {
    "filePath": "tmp/base_png",
    "fileType": {
      "ext": "png",
      "mime": "image/png",
    },
    "hash": "ffffff",
    "height": 700,
    "size": 100000,
    "width": 800,
  },
  {
    "filePath": "tmp/bad_raito",
    "fileType": {
      "ext": "png",
      "mime": "image/png",
    },
    "hash": "ffffff",
    "height": 1000,
    "size": 100000,
    "width": 30,
  },
  {
    "filePath": "tmp/base_jpg",
    "fileType": {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "hash": "ffffff",
    "height": 700,
    "size": 100000,
    "width": 800,
  },
  {
    "filePath": "tmp/jacket_png",
    "fileType": {
      "ext": "png",
      "mime": "image/png",
    },
    "hash": "ffffff",
    "height": 500,
    "size": 100000,
    "width": 500,
  },
  {
    "filePath": "will skipped",
    "fileType": {
      "ext": "png",
      "mime": "image/png",
    },
    "hash": "ffffff",
    "height": 700,
    "size": 555117,
    "width": 800,
  },
  {
    "filePath": "tmp/will_skip_smaller",
    "fileType": {
      "ext": "png",
      "mime": "image/png",
    },
    "hash": "ffffff",
    "height": 30,
    "size": 100000,
    "width": 80,
  },
]
`)
})
