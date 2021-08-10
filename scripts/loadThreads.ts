import chch from 'chch'
import { sleep } from '../src/lib/utils'
import { loadData, saveData } from './postTimeUtil'

const loadingUrls = `
https://hebi.5ch.net/test/read.cgi/news4vip/1628509701
`
  .trim()
  .split('\n')
// https://hebi.5ch.net/test/read.cgi/news4vip/1628262507
// https://hebi.5ch.net/test/read.cgi/news4vip/1628333320
// https://hebi.5ch.net/test/read.cgi/news4vip/1628347791
// https://hebi.5ch.net/test/read.cgi/news4vip/1628413179
// https://hebi.5ch.net/test/read.cgi/news4vip/1628379119
// https://hebi.5ch.net/test/read.cgi/news4vip/1628427158
// https://hebi.5ch.net/test/read.cgi/news4vip/1628250138
// https://hebi.5ch.net/test/read.cgi/news4vip/1628287442
// https://hebi.5ch.net/test/read.cgi/news4vip/1628440944
// https://hebi.5ch.net/test/read.cgi/news4vip/1628519885

async function main() {
  const data = loadData()
  for (const url of loadingUrls) {
    const thread = await chch.getThread(url)

    for (const post of thread.posts) {
      if (!data[thread.url]) data[thread.url] = {}
      data[thread.url][post.timestamp] = true
    }
    sleep(1000)
  }
  saveData(data)
}

// watch()
main().then(() => console.log('fin'))
