/* eslint-disable no-console */
import { loadActiveUrls } from './threadUrls'
import chch from 'chch'
import { sleep } from '../src/utils'
import { loadData, saveData } from './postTimeUtil'

const filterNonGreeting = (s: string) =>
  !(s.includes('>>') && /^おつ|^よろ|^云々/m.exec(s))

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
  console.log(urls, 2)

  const data = loadData()
  for (const url of urls) {
    const thread = await chch.getThread(url)

    if (!data[thread.url]) data[thread.url] = {}

    for (const post of thread.posts.filter((p) =>
      filterNonGreeting(p.message)
    )) {
      data[thread.url]![post.timestamp] = true
    }
    sleep(1000)
  }
  saveData(data)
}

// watch()
main().then(() => console.log('fin'))
