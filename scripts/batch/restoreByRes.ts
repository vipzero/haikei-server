/* eslint-disable no-console */
import { loadActiveUrls } from './../threadUrls'
import chch from 'chch'
import { Post } from 'chch/dist/types'
import { sleep } from '../../src/utils'

const filterRes = (p: Post) =>
  p.name.raw.includes(process.env.TARGET_NAME || '---')

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

  for (const url of urls) {
    const thread = await chch.getThread(url)

    for (const post of thread.posts.filter(filterRes)) {
      const line1 = post.message.split('\n')[0]
      if (line1.includes('　'))
        console.log(line1.split('　').join(',') + ',' + post.timestamp)
    }
    sleep(1000)
  }
}

// watch()
main().then(() => console.log('fin'))
