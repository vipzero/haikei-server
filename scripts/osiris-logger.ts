import { log } from 'console'
import { subscribeIcy } from '../src/streaming/icy'
import { appendFile } from 'fs/promises'
import { sleep } from '../src/utils'
import { icyOcirisPath } from '../src/config'

const outPath = icyOcirisPath

log(`write to ${outPath}`)
const url = process.env.URL

const saveIcy = (icy: string) =>
  appendFile(outPath, `${new Date().toISOString()},${icy}\n`)

export async function osirisLogger() {
  let failCount = 0

  function task() {
    if (!url) throw new Error('URL is not set')
    subscribeIcy(
      url,
      (icy) => {
        saveIcy(icy)
        failCount = 0
      },
      async () => {
        failCount = Math.min(failCount + 1, 6)
        const sleepTimeSec = 2 ** failCount
        log(`disconnected: (${failCount} retry after ${sleepTimeSec}s)`)
        await sleep(sleepTimeSec * 1000)

        queueMicrotask(task)
      }
    )
  }
  task()
}

if (!module.parent) {
  osirisLogger()
}
