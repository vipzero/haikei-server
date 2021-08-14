import { choiceImage } from '../imageIo/uploadManage'

test('choiceImage', () => {
  const basePng = {
    fileType: { ext: 'png', mime: 'image/png' },
    size: 100_000,
    height: 700,
    width: 800,
  }
  const downloads = [
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
Array [
  Object {
    "filePath": "tmp/base_png",
    "fileType": Object {
      "ext": "png",
      "mime": "image/png",
    },
    "height": 700,
    "size": 100000,
    "width": 800,
  },
  Object {
    "filePath": "tmp/bad_raito",
    "fileType": Object {
      "ext": "png",
      "mime": "image/png",
    },
    "height": 1000,
    "size": 100000,
    "width": 30,
  },
  Object {
    "filePath": "tmp/base_jpg",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 700,
    "size": 100000,
    "width": 800,
  },
  Object {
    "filePath": "tmp/jacket_png",
    "fileType": Object {
      "ext": "png",
      "mime": "image/png",
    },
    "height": 500,
    "size": 100000,
    "width": 500,
  },
  Object {
    "filePath": "will skipped",
    "fileType": Object {
      "ext": "png",
      "mime": "image/png",
    },
    "height": 700,
    "size": 555117,
    "width": 800,
  },
  Object {
    "filePath": "tmp/will_skip_smaller",
    "fileType": Object {
      "ext": "png",
      "mime": "image/png",
    },
    "height": 30,
    "size": 100000,
    "width": 80,
  },
]
`)
})
