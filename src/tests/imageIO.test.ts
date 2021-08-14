import { choiceImage } from '../imageIo/uploadManage'

test('choiceImage', () => {
  const downloads = [
    {
      filePath: 'tmp/265c79a3-5a1e-4fdc-81eb-5b2a50d7098b',
      fileType: { ext: 'png', mime: 'image/png' },
      size: 555117,
      height: 720,
      width: 1280,
    },
    {
      filePath: 'tmp/b1b8f3d8-de75-4831-8718-7d19f3d3296d',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 51619,
      height: 620,
      width: 450,
    },
    {
      filePath: 'tmp/1a1ed908-0741-4e91-ba3b-0d04431098d5',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 101233,
      height: 765,
      width: 1360,
    },
    {
      filePath: 'tmp/522cb4ac-796e-400b-b974-cf94bfd818d2',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 41281,
      height: 290,
      width: 580,
    },
    {
      filePath: 'tmp/2f04f0ad-3ebd-4df1-afd6-b2af6133fc85',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 26619,
      height: 367,
      width: 620,
    },
    {
      filePath: 'tmp/e438e943-a0b5-4816-a8f1-60dc61ee7d98',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 24094,
      height: 360,
      width: 640,
    },
    {
      filePath: 'tmp/2a355f26-7bb4-4f84-935b-8c7892fc7c3f',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 58231,
      height: 640,
      width: 455,
    },
    {
      filePath: 'tmp/012686e4-5483-4531-9a2f-ac1f6a672427',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 115145,
      height: 844,
      width: 1500,
    },
    {
      filePath: 'tmp/f9e465a9-d533-4aa0-9de7-6abff44f446e',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 240982,
      height: 844,
      width: 1500,
    },
    {
      filePath: 'tmp/35957313-fe13-480e-84bb-6c49c7fef9ce',
      fileType: { ext: 'jpg', mime: 'image/jpeg' },
      size: 12790,
      height: 300,
      width: 190,
    },
  ]

  expect(choiceImage(downloads)).toMatchInlineSnapshot(`
Array [
  Object {
    "filePath": "tmp/265c79a3-5a1e-4fdc-81eb-5b2a50d7098b",
    "fileType": Object {
      "ext": "png",
      "mime": "image/png",
    },
    "height": 720,
    "size": 555117,
    "width": 1280,
  },
  Object {
    "filePath": "tmp/1a1ed908-0741-4e91-ba3b-0d04431098d5",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 765,
    "size": 101233,
    "width": 1360,
  },
  Object {
    "filePath": "tmp/522cb4ac-796e-400b-b974-cf94bfd818d2",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 290,
    "size": 41281,
    "width": 580,
  },
  Object {
    "filePath": "tmp/2f04f0ad-3ebd-4df1-afd6-b2af6133fc85",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 367,
    "size": 26619,
    "width": 620,
  },
  Object {
    "filePath": "tmp/35957313-fe13-480e-84bb-6c49c7fef9ce",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 300,
    "size": 12790,
    "width": 190,
  },
  Object {
    "filePath": "tmp/b1b8f3d8-de75-4831-8718-7d19f3d3296d",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 620,
    "size": 51619,
    "width": 450,
  },
  Object {
    "filePath": "tmp/e438e943-a0b5-4816-a8f1-60dc61ee7d98",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 360,
    "size": 24094,
    "width": 640,
  },
  Object {
    "filePath": "tmp/012686e4-5483-4531-9a2f-ac1f6a672427",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 844,
    "size": 115145,
    "width": 1500,
  },
  Object {
    "filePath": "tmp/f9e465a9-d533-4aa0-9de7-6abff44f446e",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 844,
    "size": 240982,
    "width": 1500,
  },
  Object {
    "filePath": "tmp/2a355f26-7bb4-4f84-935b-8c7892fc7c3f",
    "fileType": Object {
      "ext": "jpg",
      "mime": "image/jpeg",
    },
    "height": 640,
    "size": 58231,
    "width": 455,
  },
]
`)
})
