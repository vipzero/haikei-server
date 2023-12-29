import { calcUploadLimit, store } from '../state/store'
import { Song } from '../types'

test('calcUploadLimit', () => {
  expect(calcUploadLimit(new Date(0), new Date(1000))).toMatchInlineSnapshot(
    `1`
  )
  expect(
    calcUploadLimit(new Date(0), new Date(1000 * 30))
  ).toMatchInlineSnapshot(`5`)
})

test('checkSkip', () => {
  store.addSong({ icy: 'aaa - bbb', time: 0 } as Song)
  expect(store.checkSkip('aaa - bbb', 1)).toMatchInlineSnapshot(`
{
  "chain": false,
  "uploadLimit": 10,
}
`)
  store.addSong({ icy: 'aaa - bbb', time: 0 } as Song)
  expect(store.checkSkip('aaa - bbb', 1)).toMatchInlineSnapshot(`
{
  "chain": {
    "icy": "aaa - bbb",
    "time": 0,
  },
  "uploadLimit": 1,
}
`)
  store.addSong({ icy: 'aaa - bbb', time: 0 } as Song)

  expect(store.checkSkip('aaa - bbb', 1)).toMatchInlineSnapshot(`
{
  "chain": {
    "icy": "aaa - bbb",
    "time": 0,
  },
  "uploadLimit": 1,
}
`)
  store.addSong({ icy: 'aaa - bbb', time: 1 } as Song)

  expect(store.checkSkip('aaaX - ccc', 2)).toMatchInlineSnapshot(`
{
  "chain": false,
  "uploadLimit": 1,
}
`)

  store.addSong({ icy: 'aaaX - ccc', time: 2 } as Song)
  expect(store.checkSkip('xxx - ddd', 3)).toMatchInlineSnapshot(`
{
  "chain": false,
  "uploadLimit": 1,
}
`)
  store.addSong({ icy: 'xxx - ddd', time: 3 } as Song)
  const time1 = 5 + 1000 * 60
  expect(store.checkSkip('xxx - ddd', time1)).toMatchInlineSnapshot(`
{
  "chain": false,
  "uploadLimit": 10,
}
`)
  store.addSong({ icy: 'xxx - ddd', time: time1 } as Song)
  store.addSong({ icy: 'xxx - ddd', time: time1 + 1 } as Song)

  const time2 = time1 + 1000 * 30
  expect(store.checkSkip('aaa - bbb', time2)).toMatchInlineSnapshot(`
{
  "chain": false,
  "uploadLimit": 5,
}
`)
})
