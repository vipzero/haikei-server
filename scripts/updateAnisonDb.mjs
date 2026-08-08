#!/usr/bin/env zx

await $`mkdir -p workspace`

await cd('workspace')

// anison.info は wget のデフォルト UA を 403 で弾くのでブラウザの UA を名乗る
const userAgent =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

const files = ['anison', 'program', 'sf', 'game']
for (const file of files) {
  await $`wget --user-agent=${userAgent} http://anison.info/data/download/${file}.zip`

  await $`unzip -o ${file}.zip`
  await $`mv -f ${file}.csv ../data`
  await $`touch ../data/${file}.csv`
}

await cd('../')
await $`rm -rf workspace`
// await rm('workspace')
