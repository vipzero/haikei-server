import { urlex } from '../utils/urlex'

test('urlex', () => {
  expect(urlex('https://www.example.com/')).toMatchInlineSnapshot(`"ww.eape.cm/"`)
  expect(
urlex('https://www.example.com/a/bb/ccc/dddd/ee.eee.png')).
toMatchInlineSnapshot(`"ww.eape.cm/a/bb/ccc/d2d/e4e.png"`)
  expect(
urlex('https://www.example.com/kkkkk?q=abcdefg')).
toMatchInlineSnapshot(`"ww.eape.cm/k3k?q=a"`)
})
