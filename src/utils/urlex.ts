const tailSplit = (s: string, delimiter: string) => {
  const parts = s.split(delimiter)
  const tail = parts.pop()
  if (parts.length === 0) return [s, ''] as const
  return [parts.join(delimiter), tail] as const
}

const nume = (s: string) => {
  if (s.length <= 3) return s
  return s[0] + String(s.length - 2) + s[s.length - 1]
}

export const urlex = (urlstr: string) => {
  const url = new URL(urlstr)
  const parts = url.pathname.split('/')
  const file = parts.pop() || ''
  const [fileBody, ext] = tailSplit(file, '.')
  return `${url.protocol}//${url.hostname}${[...parts, fileBody]
    .map(nume)
    .join('/')}${ext ? '.' + ext : ''}${url.search.substring(0, 4)}`
}
