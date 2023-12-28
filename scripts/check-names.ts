import { imasIdols } from '../src/utils/addEe'
import { base64toBools, boolsToBase64 } from '../src/utils/iamsEeNames'
// import { membersByUnitNameLib } from '../src/utils/iamsEeNames'
import { log } from '../src/utils/logger'
import { loadStatus, saveStatus } from '../src/utils/status'

function main() {
  // log(membersByUnitNameLib)
  log(imasIdols(['天海 春香'], 'Jupiter'))

  const status = loadStatus()
  const patchUnits = `
イルミネーションスターズ
コメティック
シーズ
ノクチル
放課後クライマックスガールズ
S.E.M
Beit
Jupiter
`
    .trim()
    .split('\n')

  const idols = patchUnits
    .map((u) => imasIdols([], u))
    .flat()
    .filter((v): v is [number, number] => !!v)
  log(idols)
  const bins = status.idols.map(base64toBools)
  log(status.idols)

  idols.forEach(([i, j]) => {
    bins[i]![j] = true
  })
  status.idols = bins.map(boolsToBase64)
  log(status.idols)

  saveStatus(status)
}
main()
