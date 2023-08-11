import { error } from './utils/logger'

const { SERVICE_ACCOUNT_FILE_PATH, EVENT_ID } = process.env

if (!SERVICE_ACCOUNT_FILE_PATH || !EVENT_ID) {
  error('SetupErorr', 'empty envvar SERVICE_ACCOUNT_FILE_PATH or EVENT_ID')
  process.exit(1)
}

export const serviceAccountPath = SERVICE_ACCOUNT_FILE_PATH
export const eventId = EVENT_ID
export const enableMobileImg =
  process.env.ENABLE_MOBILE_IMG === '1' && process.env.DIRECT_MODE !== '1'
