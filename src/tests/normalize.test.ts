import { textNormalize } from '../utils'
test('textNormalize', () => {
  const generalParret = textNormalize('［【test】］')
  expect(generalParret).toMatchInlineSnapshot(`"［(test)］"`)

  const wided = textNormalize('ＴEｓtﾃｽトT　！？')
  expect(wided).toMatchInlineSnapshot(`"testテストt !?"`)

  const multiple = textNormalize('〜スヤスヤ生活〜')
  expect(multiple).toMatchInlineSnapshot(`"~スヤスヤ生活~"`)
})
