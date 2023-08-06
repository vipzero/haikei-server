import { shuffle } from '../utils/random'

describe('shuffle', () => {
  it('shuffle', () => {
    const a = [1, 2, 3, 4, 5]
    const b = shuffle(a, 'a')
    const c = shuffle(a, 'b')

    expect(b).toMatchInlineSnapshot(`
[
  3,
  2,
  4,
  5,
  1,
]
`)
    expect(c).toMatchInlineSnapshot(`
[
  3,
  4,
  2,
  1,
  5,
]
`)
  })
})
