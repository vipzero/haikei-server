import { checkFileStats, checkNewestProgram } from './anisonDb/anisonDb'
import { log, warn } from './utils/logger'

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
  { name: 'SPOTIFY_CLIENT_ID' },
  { name: 'SPOTIFY_CLIENT_SECRET' },
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

const checkFirebase = () => {
  log('# checkFirebase')
  //
}

const checkStream = () => {
  log('# checkStream')
  //
}

const formatDate = (date: Date) => {
  return date.toLocaleString()
}

const checkAnisonFiles = () => {
  log('# checkAnisonFiles')
  const res = checkFileStats()
  res.forEach((status) => {
    log(
      status.exists ? '✅' : '❌',
      status.filename,
      status.mtime ? formatDate(new Date(status.mtime)) : '-'
    )
  })
  if (res.some((status) => !status.exists)) {
    warn('yarn setup:anison で更新')
  } else {
    log(checkNewestProgram())
  }
}

function ps() {
  checkEnvVars()
  checkAnisonFiles()
}

ps()
