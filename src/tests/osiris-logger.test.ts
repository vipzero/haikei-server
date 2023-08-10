import { osirisLogger } from '../../scripts/osiris-logger'
import * as m from '../streaming/icy'

let spyLog: jest.SpyInstance
let spyIcy: jest.SpyInstance

let errorCount = 0
beforeAll(() => {
  spyIcy = jest
    .spyOn(m, 'subscribeIcy')
    .mockImplementation((url, cb, onError) => {
      if (errorCount > 0) {
        errorCount--
        onError()
        return
      }
    })
  spyLog = jest.spyOn(console, 'log')
})

afterEach(() => {
  spyLog.mockClear()
  spyIcy.mockClear()
})

test('osirisLogger', () => {
  errorCount = 3
  osirisLogger()
  expect(spyLog.mock.calls).toMatchInlineSnapshot()
})
