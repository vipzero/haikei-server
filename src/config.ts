import { error } from './utils/logger'

const {
  SERVICE_ACCOUNT_FILE_PATH,
  EVENT_ID,
  NON_WRITE_DEBUG_MODE,
  SEARCH_EXT,
  IMAGE_PREPARE_TIMEOUT_MS,
  IMAGE_QUORITIFY,
  IMAGE_LOOK_LIMIT,
} = process.env

if (!SERVICE_ACCOUNT_FILE_PATH || !EVENT_ID) {
  error('SetupErorr', 'empty envvar SERVICE_ACCOUNT_FILE_PATH or EVENT_ID')
  process.exit(1)
}

const isTest = process.env.NODE_ENV === 'test'
export const serviceAccountPath = SERVICE_ACCOUNT_FILE_PATH
export const eventId = isTest ? '9999test' : EVENT_ID
export const enableMobileImg =
  process.env.ENABLE_MOBILE_IMG === '1' && process.env.DIRECT_MODE !== '1'
export const nonWriteMode = NON_WRITE_DEBUG_MODE === '1'
export const searchExt = SEARCH_EXT ?? false

// 2つ前からの間隔が短い(かつ似た名前の)ときは画像検索しない
export const imageSearchCooltimeMs = 1000 * 20

// 10枚アップロードするために必要な2つ前からの間隔
export const upload10ImgLimitMs = 1000 * 60 * 1

export const icyOcirisPath = './data/icy.txt'
export const icyOcirisEditedPath = './data/icy-import.txt'

export const imagePrepareTimeoutMs = Number(IMAGE_PREPARE_TIMEOUT_MS || '5000')
// 画像の圧縮
export const enableQuality = IMAGE_QUORITIFY === '1'

export const imageLookLimit = Number(IMAGE_LOOK_LIMIT || 10)

export const customImageblackList = [
  'static.wikia.nocookie.net',
  'amazon.com',
  'fril.jp',
  'shopping.yahoo.co.jp',
  'static.mercdn.net',
  'auctions.c.yimg.jp',
  'github.com',
  'githubassets.com',
  'animatetimes.com',
  'showroom-live.com',
  'tiktok',
  'ytimg.com',
]
