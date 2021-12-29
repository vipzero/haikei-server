import { readFileSync } from 'fs'

export const loadingUrls = readFileSync(
  __dirname + '/threadUrls.lines.txt',
  'utf8'
)
  .split('\n')
  .filter(Boolean)
  .filter((line) => !line.startsWith('//'))
