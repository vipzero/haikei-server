import { checkFileStats, checkNewestProgram } from './anisonDb/anisonDb'
import { getCurrentPlay, init } from './service/firebase'
import { error, info, log, warn } from './utils/logger'
import { fdb } from '../src/service/firebase'
import { DateTime } from 'luxon'
const formatDate = (date: Date) =>
  DateTime.fromJSDate(date).toFormat('yyyy-MM-dd HH:mm')

type SetupStatus = {
  ok: boolean
  key: string
  value: string
}
const checkStatus = (key: string): SetupStatus => {
  const value = process.env[key] || ''
  return { ok: !!value, key, value }
}
const checkEnvs = [
  { name: 'URL' },
  { name: 'EVENT_ID' },
  { name: 'EMPTY_MODE_SEARCH_WORD' },
  { name: 'GCP_CUSTOM_SEARCH_API_KEY' },
  { name: 'GCP_CUSTOM_SEARCH_ENGINE_ID' },
  { name: 'SERVICE_ACCOUNT_FILE_PATH' },
  { name: 'STORAGE_ID' },
  { name: 'STORAGE_ID_ARCHIVE' },
  { name: 'STORAGE_URL' },
  // { name: 'SPOTIFY_CLIENT_ID' },
  // { name: 'SPOTIFY_CLIENT_SECRET' },
  // { name: 'MUSIXMATCH_API_KEY' },
  { name: 'DIRECT_MODE' },
]
function checkEnvVars() {
  log('# checkEnvVars')
  const all = checkEnvs.map((k, i) => {
    const status = checkStatus(k.name)
    log(status.ok ? '✅' : '❌', status.key, status.value)
    if (i === 2) log('---')

    return status.ok
  })
  if (!all.every(Boolean)) {
    warn('.env.sample を参考に環境変数を設定')
  }
}

const checkFirebase = async () => {
  log('# checkFirebase')
  const EVENT_ID = process.env.EVENT_ID || ''
  info('event id: ' + EVENT_ID)
  //
  try {
    const res = await getCurrentPlay()
    info('playing: ' + res.icy || 'none')
    info('words: ' + (await init()).lasttime)

    log('✅', '接続')
  } catch (e) {
    error('firebase error', '')
  }
  const histOk = (await fdb.collection('hist').doc(EVENT_ID).get()).exists
  log(histOk ? '✅' : '❌', 'setup')
  if (!histOk) {
    warn('yarn setup で設定')
  }
}

// const checkStream = () => {
//   log('# checkStream')
//   //
// }

const checkAnisonFiles = () => {
  log('# checkAnisonFiles')
  const res = checkFileStats()
  res.forEach((status) => {
    log(
      status.exists ? '✅' : '❌',
      status.filename,
      status.mtime ? formatDate(status.mtime) : '-'
    )
  })
  const now = Date.now()
  const lastModTime = res[0].mtime || 0
  if (res.some((status) => !status.exists)) {
    warn('yarn setup:anison でダウンロード')
    return
  }
  info('最新の番組データ' + checkNewestProgram())
  if (now - +lastModTime > 1000 * 60 * 60 * 24 * 30) {
    warn('2ヶ月以上更新されていない')
    warn('yarn setup:anison で更新')
  }
}

async function ps() {
  checkEnvVars()
  checkAnisonFiles()
  await checkFirebase()
}

ps()
