import { loadHistoryTimes, setupHistN } from './../src/lib/firebase'
import { loadData } from './postTimeUtil'

const flatten = <T>(arr: T[][]) => arr.reduce<T[]>((a, b) => a.concat(b), [])

function mergeCount(
  delimiters: number[],
  times: number[]
): { [key: number]: number } {
  const res: { [id: number]: number } = {}
  let j = 0

  while (times[j] <= delimiters[0]) j += 1

  delimiters.forEach((d, i) => {
    const next = delimiters[i]
    // console.log({ d, next })
    if (!next) return
    res[d] = 0
    while (times[j] < next) {
      // console.log(times[j])
      res[d] += 1
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

  console.log(postTimes[0])
  console.log(postTimes[1])
  console.log(postTimes[2])

  console.log(postTimes.length)
  console.log(postTimes[0])
  console.log(postTimes[postTimes.length - 1])

  const times = await loadHistoryTimes()
  console.log(times.length)
  console.log(times[0])
  console.log(times[times.length - 1])
  const res = mergeCount(times.map(Number), postTimes)
  console.log(res)

  await setupHistN(res)
}

// watch()
main().then(() => console.log('fin'))

// console.log(mergeCount([0, 10, 20, 25, 40], [...Array(200).keys()]))
