import { emojify } from 'jptext-to-emoji'

export const makeEmol = async (lyric: string | null) => {
  if (lyric === null) return { text: '' }
  const text = (
    await Promise.all(
      lyric
        .split('\n')
        .map(async (line) =>
          (
            await Promise.all(
              line
                .split(/[ \u3000]/)
                .map((word) =>
                  word ? emojify(word, { onlyEmoji: false }) : ''
                )
            )
          ).join(' ')
        )
    )
  )
    .filter(Boolean)
    .join('\n')
  return { text }
}
