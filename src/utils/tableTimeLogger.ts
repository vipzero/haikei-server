import { logLine, log } from './logger'

export type ImageSetupTimeTable = ReturnType<typeof imageSetupTimeTable>
export const imageSetupTimeTable = () => {
  const data = new Map<string, { times: Map<string, number>; prev: number }>()

  // const decoTime = (ms: number) => {
  //     if (ms < 1000) {
  //       info(`${ms}ms`)
  //     } else {
  //       warn(`${ms}ms`)
  //     }
  // 	}

  return {
    init(name: string) {
      if (!data.has(name)) {
        data.set(name, { times: new Map(), prev: performance.now() })
      }
    },
    mark(name: string, step: 'dw' | 'shape' | 'jimp') {
      const item = data.get(name)
      if (!item) throw new Error()
      const cur = performance.now()
      const ms = Math.floor(cur - item.prev)
      data.get(name)?.times.set(step, ms)

      item.prev = cur
      logLine('.')
    },
    print() {
      const res = [...data.entries()]
        .map(([name, item]) => {
          const times = [...item.times.entries()]
            .map(([step, ms]) => `${step}: ${ms}ms`)
            .join(', ')
          return `${name}: ${times}`
        })
        .join('\n')
      log(res)
    },
  }
}
