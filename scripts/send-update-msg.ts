import { sendPushMessage } from '../src/service/firebase'

sendPushMessage(Number(process.argv[2] ?? 0))
