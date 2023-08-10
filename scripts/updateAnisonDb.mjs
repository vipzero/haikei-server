#!/usr/bin/env zx

await $`mkdir -p workspace`

await cd('workspace')

const files = ['anison', 'program', 'sf', 'game']
for (const file of files) {
  await $`wget http://anison.info/data/download/${file}.zip`

  await $`unzip -o ${file}.zip`
  await $`mv -f ${file}.csv ../data`
  await $`touch ../data/${file}.csv`
}

await cd('../')
await $`rm -rf workspace`
// await rm('workspace')
