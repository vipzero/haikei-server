import { upload10ImgLimitMs } from '../config'
import { Counts, Song, UploadFile, SkipInfo } from '../types'

export class Store {
  counts: Counts
  isFirst: boolean
  firstIcy: string
  songs: Song[]
  storageUrlQueue: UploadFile[][]
  onExpiredStorageUrl?: (urls: UploadFile[]) => void

  constructor() {
    this.counts = {}
    this.isFirst = true
    this.songs = []
    this.firstIcy = ''
    this.storageUrlQueue = []
  }

  setFirstIcy(icy: string) {
    this.firstIcy = icy
  }

  isDuplicate(icy: string): boolean {
    if (!this.isFirst) return false
    this.isFirst = false
    return icy === this.firstIcy
  }

  addQueue(urls: UploadFile[]) {
    this.storageUrlQueue.unshift(urls)
    if (this.storageUrlQueue.length > 3) {
      const expired = this.storageUrlQueue.pop()
      expired && this.onExpiredStorageUrl?.(expired)
    }
  }

  addSong(song: Song) {
    this.songs = [song, ...(this.songs || [])].slice(0, 5)
  }

  checkSkip(icy: string, time: number): SkipInfo {
    const [prev1, prev2] = this.songs
    // 過去二つと比較する

    const prev1chain = prev1 && someSongIcy(icy, prev1.icy)
    const prev2chain = prev2 && someSongIcy(icy, prev2.icy)
    const shortTimeChange =
      prev2 && chainTime(new Date(prev2.time), new Date(time))
    // 短期間の切り替えかつ 類似 icy である場合 chain と判定
    const chain = shortTimeChange && (prev1chain || prev2chain) ? prev1! : false

    const uploadLimit = !prev2
      ? 10
      : calcUploadLimit(new Date(prev2.time), new Date(time))

    return { chain, uploadLimit }
  }
}

export const someSongIcy = (a: string, b: string) => {
  const [a1, a2] = a.split(' - ')
  const [b1, b2] = b.split(' - ')

  return (
    (a2 === b2 && (a1?.startsWith(b1!) || b1?.startsWith(a1!))) ||
    (a1 === b1 && (a2?.startsWith(b2!) || b2?.startsWith(a2!)))
  )
}

export const chainTime = (prev: Date, now: Date) =>
  Math.abs(prev.getTime() - now.getTime()) < 1000 * 40

export function calcUploadLimit(prev: Date, now: Date) {
  // x分以上空いてて10枚
  const diffMs = Math.abs(now.getTime() - prev.getTime())
  const uploadRate = Math.min(diffMs / upload10ImgLimitMs, 1)
  return Math.max(1, Math.floor(uploadRate * 10))
}

export const store = new Store()
