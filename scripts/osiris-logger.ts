import { log } from 'console'
import { subscribeIcy } from '../src/streaming/icy'
import { appendFile } from 'fs/promises'
import { sleep } from '../src/utils'

const outPath = 'data/icy.txt'

log(`write to ${outPath}`)
const url = process.env.URL

const saveIcy = (icy: string) =>
  appendFile(outPath, `${new Date().toISOString()},${icy}\n`)

export async function osirisLogger() {
  let active = true
  let failCount = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!url) throw new Error('URL is not set')
    if (active) {
      await sleep(1000)
      continue
    }
    subscribeIcy(
      url,
      (icy) => {
        saveIcy(icy)
        failCount = 0
      },
      async () => {
        failCount++
        const sleepTimeSec = Math.min(60, 2 ** failCount)
        log(`disconnected: (${failCount} retry after ${sleepTimeSec}s)`)
        await sleep(sleepTimeSec * 1000)

        active = false
      }
    )
    active = true
  }
}

if (!module.parent) {
  osirisLogger()
}
