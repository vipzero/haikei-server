export const icyCaptureAdditionals = (icy: string) => {
  const m = icy.match(
    /(?<p1>.*) - (?<p2>.*?)(?:{{(?<rep>.*)}}|(?:\{(?<add>.*)\}|【(?<add2>.*)】))/
  )
  if (!m || !m.groups) return null
  const { rep, add, add2 } = m.groups
  return { rep, add: add || add2 }
}
