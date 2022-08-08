import { emojify } from 'jptext-to-emoji'

export const makeEmol = async (lyric: string | null) => {
  if (lyric === null) return { text: '' }
  const text = (
    await Promise.all(
      lyric.split('\n').map((line) => (line ? emojify(line) : ''))
    )
  ).join('\n')
  return { text }
}
