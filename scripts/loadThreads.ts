/* eslint-disable no-console */
import { loadingUrls } from './threadUrls'
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

  const urls = loadingUrls.concat(currentTreads)
  console.log(urls)

  const data = loadData()
  for (const url of urls) {
    const thread = await chch.getThread(url)

    if (!data[thread.url]) data[thread.url] = {}

    for (const post of thread.posts) {
      data[thread.url][post.timestamp] = true
    }
    sleep(1000)
  }
  saveData(data)
}

// watch()
main().then(() => console.log('fin'))
