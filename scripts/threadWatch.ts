import chch from 'chch'

const crawledCallback: CrawledCallback = ({
  newPosts,
  nthCall,
  recentCount10Min,
  nextCallMs,
  finish,
}) => {
  if (newPosts.length > 0 && cli.flags.command) {
  }
  newPosts
    .filter((p) => p.number <= 1000)
    .forEach((post) => {
      console.log(`${post.number}:${post.userId.substr(0, 3)}: ${post.message}`)
    })
  console.log(
    console.log(
      `crawled ${nthCall} ${String(newPosts.length)} post ${String(
        recentCount10Min
      )}post/10min'`
    )
  )
  if (finish) {
    process.exit(0)
  }
}

watchSmart(crawledCallback)
