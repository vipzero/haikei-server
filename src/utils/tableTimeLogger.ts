import { logLine, log } from './logger'

import chalk from 'chalk'

export type ImageSetupTimeTable = ReturnType<typeof imageSetupTimeTable>
export const imageSetupTimeTable = () => {
  const data = new Map<string, { times: Map<string, number>; prev: number }>()

  const decoTime = (ms: number) => {
    if (ms < 1000) {
      return chalk.gray(`${ms}ms`.padStart(8))
    } else {
      return chalk.yellow(`${ms}ms`.padStart(8))
    }
  }

  return {
    init(name: string) {
      if (!data.has(name)) {
        data.set(name, { times: new Map(), prev: performance.now() })
      }
    },
    mark(name: string, step: 'dw' | 'sharp' | 'jimp') {
      const item = data.get(name)
      if (!item) throw new Error()
      const cur = performance.now()
      const ms = Math.floor(cur - item.prev) + 1000
      item.times.set(step, ms)

      item.prev = cur
      logLine('.')
    },
    print() {
      log('')
      log(
        [
          'url'.padStart(30),
          'dw'.padStart(8),
          'sharp'.padStart(8),
          'jimp'.padStart(8),
        ].join(', ')
      )
      const res = [...data.entries()]
        .map(([id, item]) => {
          const cols = [
            item.times.get('dw'),
            item.times.get('sharp'),
            item.times.get('jimp'),
          ]
          const times = cols
            .map((ms) => (ms ? decoTime(ms) : '-'.padStart(8)))
            .join(', ')
          return `${id.substring(0, 30).padStart(30)}, ${times}`
        })
        .join('\n')
      log(res)
    },
  }
}
