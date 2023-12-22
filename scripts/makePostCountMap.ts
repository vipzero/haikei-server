/* eslint-disable no-console */
import { flatten } from '../src/utils'
import { loadHistoryTimes, setupHistN } from '../src/service/firebase'
import { loadData } from './postTimeUtil'

type Counts = { [id: number]: number | null }
function mergeCount(delimiters: number[], times: number[]): Counts {
  const res: Counts = {}
  let j = 0

  while (times[j]! <= delimiters[0]!) j += 1

  delimiters.forEach((d, i) => {
    const next = delimiters[i + 1]
    // console.log({ d, next })
    if (!next) return
    if (!times[j]) {
      res[d] = null
      return
    }
    res[d] = 0
    while (times[j]! < next) {
      // console.log(times[j])
      res[d] = (res[d] || 0) + 1
      j += 1
      if (!times[j]) {
        delete res[d]
        return
      }
    }
  })
  return res
}

async function main() {
  const data = loadData()

  const postTimes = flatten(Object.entries(data).map(([, v]) => Object.keys(v)))
    .map(Number)
    .filter(Boolean)

  postTimes.sort((a, b) => a - b)

  const times = await loadHistoryTimes()
  console.log(times.length)
  // console.log(times[0])
  // console.log(times[times.length - 1])
  const res = mergeCount(times.map(Number), postTimes)
  // console.log(res)

  await setupHistN(res)
}

// watch()
main().then(() => console.log('fin'))

// console.log(mergeCount([0, 10, 20, 25, 40], [...Array(200).keys()]))
