import { Song } from '../types'
import { addEe, startWithMatch } from '../utils/addEe'

test('convertTimeTags', () => {
  expect(addEe({ icy: 'a - b' } as Song)).toMatchInlineSnapshot(`
{
  "icy": "a - b",
}
`)

  expect(addEe({ icy: 'Crossing! - abc' } as Song)).toMatchInlineSnapshot(`
{
  "hedwig": "mts10:10011",
  "icy": "Crossing! - abc",
}
`)
  expect(addEe({ icy: 'ESPADA - abc' } as Song)).toMatchInlineSnapshot(`
{
  "hedwig": "mts10:10011:MTS",
  "icy": "ESPADA - abc",
}
`)
  expect(addEe({ icy: '絵本 - hit' } as Song)).toMatchInlineSnapshot(`
{
  "hedwig": "mts10:10011:LTH",
  "icy": "絵本 - hit",
}
`)
  const icy =
    '咲くは浮世の君花火 - 閃光☆HANABI団 [高山紗代子 (CV.駒形友梨)、高坂海美 (CV.上田麗奈)、福田のり子 (CV.浜崎奈々)、横山奈緒 (CV.渡部優衣)、佐竹美奈子 (CV.大関英里)]'
  expect(addEe({ icy } as Song)).toMatchInlineSnapshot(`
{
  "hedwig": "mts10:10011:MTG",
  "icy": "咲くは浮世の君花火 - 閃光☆HANABI団 [高山紗代子 (CV.駒形友梨)、高坂海美 (CV.上田麗奈)、福田のり子 (CV.浜崎奈々)、横山奈緒 (CV.渡部優衣)、佐竹美奈子 (CV.大関英里)]",
}
`)

  //   expect(addEe({ icy: '絵本と - nohit' } as Song)).toMatchInlineSnapshot(`
  // {
  //   "icy": "絵本と - nohit",
  // }
  // `)
  //   expect(addEe({ icy: 'DIAMOND - hit' } as Song)).toMatchInlineSnapshot()
  //   // 8文字以下は完全一致
  //   expect(addEe({ icy: 'DIAMOND_ - no hit' } as Song)).toMatchInlineSnapshot()

  //   // 追加情報
  //   expect(
  //     addEe({ icy: 'Silent Joker X var - hit' } as Song)
  //   ).toMatchInlineSnapshot()
})

test('startWithMatch', () => {
  const lib = new Map([
    ['aaab', 1],
    ['ab', 2],
    ['hogefuga', 3],
  ])
  const hit = startWithMatch('abc', lib)
  expect(hit).toBe(1)

  const noonhit = startWithMatch('adc', lib)
  expect(noonhit).toBe(undefined)
})
