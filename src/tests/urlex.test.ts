import { urlex } from '../utils/urlex'

test('urlex', () => {
  expect(urlex('https://www.example.com/')).toBe('https://www.example.com/')
  expect(urlex('https://www.example.com/a/bb/ccc/dddd/ee.eee.png')).toBe(
    'https://www.example.com/a/bb/ccc/d2d/e4e.png'
  )
  expect(urlex('https://www.example.com/kkkkk?q=abcdefg')).toBe(
    'https://www.example.com/k3k?q=a'
  )
})
