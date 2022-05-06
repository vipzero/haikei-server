import { shuffle } from '../utils/random'

describe('shuffle', () => {
  it('shuffle', () => {
    const a = [1, 2, 3, 4, 5]
    const b = shuffle(a, 'a')
    const c = shuffle(a, 'b')

    expect(b).toStrictEqual([2, 1, 5, 3, 4])
    expect(c).toStrictEqual([2, 3, 1, 5, 4])
  })
})
