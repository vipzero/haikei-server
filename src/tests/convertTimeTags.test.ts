import { convertTimeTags } from '../utils'

test('convertTimeTags', () => {
  expect(convertTimeTags('2000-01-01')).toMatchInlineSnapshot(`
Array [
  "[2000]",
  "[2000-01]",
  "[2000-s1]",
]
`)
  expect(convertTimeTags('2010-05-20')).toMatchInlineSnapshot(`
Array [
  "[2010]",
  "[2010-05]",
  "[2010-s2]",
]
`)
  const range = (n: number) => [...Array(n).keys()]

  const res = range(12).map((i) =>
    convertTimeTags(`2000-${String(i + 1).padStart(2, '0')}-01`)
  )

  expect(res.map((v) => v[2])).toMatchInlineSnapshot(`
Array [
  "[2000-s1]",
  "[2000-s1]",
  "[2000-s1]",
  "[2000-s2]",
  "[2000-s2]",
  "[2000-s2]",
  "[2000-s3]",
  "[2000-s3]",
  "[2000-s3]",
  "[2000-s4]",
  "[2000-s4]",
  "[2000-s4]",
]
`)
})
