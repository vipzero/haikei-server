import { convertTimeTags } from '../utils'

test('convertTimeTags', () => {
  expect(convertTimeTags('2000-01-01')).toMatchInlineSnapshot(`
[
  "[2000]",
  "[2000-01]",
  "[2000-S1]",
]
`)
  expect(convertTimeTags('2010-05-20')).toMatchInlineSnapshot(`
[
  "[2010]",
  "[2010-05]",
  "[2010-S2]",
]
`)
  const range = (n: number) => [...Array(n).keys()]

  const res = range(12).map((i) =>
    convertTimeTags(`2000-${String(i + 1).padStart(2, '0')}-01`)
  )

  expect(res.map((v) => v[2])).toMatchInlineSnapshot(`
[
  "[2000-S1]",
  "[2000-S1]",
  "[2000-S1]",
  "[2000-S2]",
  "[2000-S2]",
  "[2000-S2]",
  "[2000-S3]",
  "[2000-S3]",
  "[2000-S3]",
  "[2000-S4]",
  "[2000-S4]",
  "[2000-S4]",
]
`)
})
