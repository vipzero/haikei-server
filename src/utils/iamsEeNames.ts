import { existsSync, readFileSync } from 'fs'

const namesFile = `data/names.txt`
const namesUnitsFile = `data/names-units.txt`

const loadFileSync = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf-8') : ''
const nameText = loadFileSync(namesFile)
const nameUnitsText = loadFileSync(namesUnitsFile)

const nameGroups = nameText
  .trim()
  .split('\n\n')
  .map((lines) => lines.split('\n'))
// ['a', 'b'] => { 'a': true, 'b': true }

export const nameGroupMap = new Map(
  nameGroups
    .map((names, i) => names.map((name, j) => [name, [i, j]] as const))
    .flat()
)

const nameUnitsTextParsed = nameUnitsText
  .trim()
  .split('\n')
  .filter((v) => v !== '')
  .map((line) => {
    if (!line) return false
    const [unitNamesPart, namesSegPart] = line.split('\t')
    const unitNames = unitNamesPart?.split('___')
    const names = namesSegPart?.split('、')
    if (!unitNames || !names) return false
    return unitNames.map((unitName) => [unitName, names] as const)
  })
  .filter((v): v is [string, string[]][] => v !== false)
  .flat()

export const membersByUnitNameLib = new Map(nameUnitsTextParsed)

export const membersByUnitName = (name: string) =>
  membersByUnitNameLib.get(name)

export const initialNames = nameGroups.map((names) =>
  boolsToBase64(Array(names.length).fill(false))
)

export function boolsToBase64(ba: boolean[]) {
  const boolBuffer = new Uint8Array(ba.map((value) => (value ? 1 : 0)))
  const boolArrayBuffer = boolBuffer.buffer
  const base64String = btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(boolArrayBuffer)))
  )
  return base64String
}

export function base64toBools(a: string) {
  const binaryString = atob(a)
  const boolArrayBuffer = new ArrayBuffer(binaryString.length)
  const boolArray = new Uint8Array(boolArrayBuffer)
  for (let i = 0; i < binaryString.length; i++) {
    boolArray[i] = binaryString.charCodeAt(i)
  }
  const decodedBoolArray = Array.from(boolArray, (value) => value === 1)
  return decodedBoolArray
}
