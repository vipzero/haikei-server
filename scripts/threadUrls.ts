import { readFileSync, writeFileSync } from 'fs'

export const loadUrls = () => {
  return readFileSync(__dirname + '/threadUrls.lines.txt', 'utf8')
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean)
    .map((text) => ({
      text,
      active: !text.startsWith('//'),
    }))
}
export const loadActiveUrls = () => {
  return loadUrls().filter((v) => v.active)
}

export const saveUrls = (urls: string[]) => {
  writeFileSync(__dirname + '/threadUrls.lines.txt', urls.join('\n'))
}
