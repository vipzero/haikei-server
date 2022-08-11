/* eslint-disable no-console */
import { loadActiveUrls } from './threadUrls'
import chch from 'chch'
import { sleep } from '../src/utils'
import { loadData, saveData } from './postTimeUtil'

async function main() {
  const search = process.env.THREAD_TITLE_WORD
  const currentTreads = search
    ? (await chch.getThreads(null)).threads
        .filter((t) => t.title.includes(search))
        .map((t) => t.url)
    : []

  const urls = loadActiveUrls()
    .map((v) => v.text)
    .concat(currentTreads)
  console.log(urls)

  const data = loadData()
  for (const url of urls) {
    const thread = await chch.getThread(url)

    if (!data[thread.url]) data[thread.url] = {}

    // const idFilter = (p) => !p.userId.match(/^.{9}a/)
    for (const post of thread.posts.filter((p) => p)) {
      data[thread.url][post.timestamp] = true
    }
    sleep(1000)
  }
  saveData(data)
}

// watch()
main().then(() => console.log('fin'))
