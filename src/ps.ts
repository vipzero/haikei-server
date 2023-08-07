type SetupStatus = {
  ok: boolean
  key: string
  value: string
}
const checkStatus = (key: string): SetupStatus => {
  const value = process.env[key] || ''
  return { ok: !!value, key, value }
}

function ps() {
  console.log('-- envvar')
  const streamUrl = checkStatus('URL')
  if (streamUrl.ok) {
    console.log(streamUrl.value)
  }

  firebaseEnvs.map(checkStatus).forEach((v) => {
    if (!v.ok) console.log(v.value)
  })
}

const firebaseEnvs = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
]

// export URL="http://autols1.ggtea.net:8196/autoxmas"

// export GCP_CUSTOM_SEARCH_API_KEY=""
// export GCP_CUSTOM_SEARCH_ENGINE_ID=""

// export SERVICE_ACCOUNT_FILE_PATH=""

// export SPOTIFY_CLIENT_ID=""
// export SPOTIFY_CLIENT_SECRET=""

// export MUSIXMATCH_API_KEY=""
// export EVENT_ID="todo"
// export STORAGE_ID=""
// export STORAGE_ID_ARCHIVE=""
// export STORAGE_URL=""

// export EMPTY_MODE_SEARCH_WORD="探偵 クイズ 推理 アニメ "

// export THREAD_TITLE_WORD="ならアニソン"
// export DIRECT_MODE=0

ps()
