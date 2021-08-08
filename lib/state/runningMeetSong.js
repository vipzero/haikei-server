import { createEvent, createStore } from 'effector'

// 開始時に最後に記録されていた曲
export const setMeetSong = createEvent()
export const $meetSong = createStore(false).on(setMeetSong, (_, item) => item)
