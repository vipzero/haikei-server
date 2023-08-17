import { readFileSync } from 'fs'

const result = readFileSync('./data/names.txt', 'utf-8')
  .trim()
  .split('\n\n')
  .map((v) =>
    v
      .split('\n')
      .map((v) => v.trim().substring(0, 1))
      .join('')
  )
  .join('\n')

console.log(result)
