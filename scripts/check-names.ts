import { imasIdols } from '../src/utils/addEe'
// import { membersByUnitNameLib } from '../src/utils/iamsEeNames'
import { log } from '../src/utils/logger'
import { loadStatus, saveStatus } from '../src/utils/status'

function main() {
  // log(membersByUnitNameLib)
  log(imasIdols(['天海 春香'], 'Jupiter'))

  const status = loadStatus()

  saveStatus(status)
}
main()
