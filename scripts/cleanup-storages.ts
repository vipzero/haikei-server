import { eventId } from '../src/config'
import { getBucket } from '../src/service/firebase'
import { error, log } from '../src/utils/logger'

const folderName = `img/${eventId}`
const remain = 20

// バケット内のファイル一覧を取得し、最新5つ以外を削除する
async function deleteOldFiles() {
  const bucket = getBucket()
  const [files] = await bucket.getFiles({ prefix: folderName })

  files.sort((a, b) => b.metadata.updated - a.metadata.updated)

  const fl = files.length
  // 最新の5つ以外を削除
  for (let i = 20; i < files.length; i++) {
    await files[i].delete()
  }
  log(`[${eventId}] delete ${fl - remain} files. (${fl} -> ${remain})`)
}

deleteOldFiles()
  .then(() => {
    log('Old files deleted successfully.')
  })
  .catch((err) => {
    error('Error deleting files:', err)
  })
