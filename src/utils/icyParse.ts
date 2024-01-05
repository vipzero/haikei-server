import { warn } from './logger'

export const icyCaptureAdditionals = (icy: string) => {
  const m = icy.match(
    /(?<icy>(?<p1>.*) - (?<p2>.*?))(?:{{(?<rep>.*)}}|(?:\{(?<add>.*)\}|【(?<add2>.*)】))/
  )
  if (!m || !m.groups) return { icy, rep: null, add: null }
  const { rep, add, add2, icy: icyPart } = m.groups
  if (!icyPart) {
    warn(`icyParse: icyPart is null ${icyPart}`)
    return { icy, rep: null, add: null }
  }
  return { icy: icyPart, rep: rep || null, add: add || add2 || null }
}
