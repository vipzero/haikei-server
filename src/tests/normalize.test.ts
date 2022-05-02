import { textNormalize } from '../utils'
test('textNormalize', () => {
  const generalParret = textNormalize('［【test】］')
  expect(generalParret).toMatchInlineSnapshot(`"［(test)］"`)

  const wided = textNormalize('ＴEｓtﾃｽトT　！？')
  expect(wided).toMatchInlineSnapshot(`"testテストt !?"`)
})
