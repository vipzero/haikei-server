import { icyCaptureAdditionals } from '../utils/icyParse'

test('icyCaptureAdditionals', () => {
  expect(icyCaptureAdditionals('a - b')).toMatchInlineSnapshot(`null`)
  expect(icyCaptureAdditionals('a - b{a}')).toMatchInlineSnapshot(`
{
  "add": "a",
  "rep": undefined,
}
`)
  expect(icyCaptureAdditionals('a - b【k】')).toMatchInlineSnapshot(`
{
  "add": "k",
  "rep": undefined,
}
`)
  expect(icyCaptureAdditionals('a - b{{k}}')).toMatchInlineSnapshot(`
{
  "add": undefined,
  "rep": "k",
}
`)
})
