export type ProgramRecord = {
  category: string
  gameType: string
  animeTitle: string
  chapNum: string
  date: string
}

export type SongRecord = ProgramRecord & {
  opOrEd: string
  spInfo: string
  songId: string
  title: string
  artist: string
}

export type SongBroken = Partial<SongSeedFull> & { icy: string }
export type SongSeedNor = Partial<SongSeedFull> & {
  icy: string
  artist: string
  title: string
}

export type SongSeedFull = {
  artist: string
  title: string
  icy: string
} & SongRecord
export type SongSeed = SongBroken | SongSeedNor | SongSeedFull

export type SongSupportAttr = {
  animeTitle: string
  artist: string
  writer: string
  composer: string
  arranger: string
}

export type SongMiss = {
  icy: string
  time: number
  albumName?: string
  copyright?: string
  artworkUrl100?: string
  trackTimeMillis?: number
  itunesUrl?: string
  imageLinks?: string[]
  singer?: string
  composer?: string
  writer?: string
  wordCounts: Counts
  // wordCountsAna: { name: string; label: string; count: number }[]
}

export type SongFull = SongMiss & {
  title: string
  artist: string
  animeTitle: string
  opOrEd: string
  spInfo: string
  songId: string
  category: string
  gameType: string
  chapNum: number
  date: string
}

export type Song = SongFull | SongMiss
export type HistoryRaw = {
  title: string
  time: number
}

export type HistTop = {
  lasttime: number
}
export type UploadFile = {
  path: string
  downloadUrl: string
  tmpFilePath: string
}
export type Counts = Record<string, number>
export type Count = {
  word: string
  count: number
}
