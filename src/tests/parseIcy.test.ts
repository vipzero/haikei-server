import { icyCaptureAdditionals } from '../utils/icyParse'

test('icyCaptureAdditionals', () => {
  expect(icyCaptureAdditionals('a - b')).toMatchInlineSnapshot(`
{
  "add": null,
  "icy": "a - b",
  "rep": null,
}
`)
  expect(icyCaptureAdditionals('a - b{a}')).toMatchInlineSnapshot(`
{
  "add": "a",
  "icy": "a - b",
  "rep": null,
}
`)
  expect(icyCaptureAdditionals('a - b【k】')).toMatchInlineSnapshot(`
{
  "add": "k",
  "icy": "a - b",
  "rep": null,
}
`)
  expect(icyCaptureAdditionals('a - b{{k}}')).toMatchInlineSnapshot(`
{
  "add": null,
  "icy": "a - b",
  "rep": "k",
}
`)
})
