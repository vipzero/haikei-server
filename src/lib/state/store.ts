import { UploadFile } from './../types/index'
import { Counts } from '../types/index'

class Store {
  counts: Counts
  isFirst: boolean
  firstIcy: string
  storageUrlQueue: UploadFile[][]
  onExpiredStorageUrl?: (urls: UploadFile[]) => void

  constructor() {
    this.counts = {}
    this.isFirst = true
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
}

export const store = new Store()
