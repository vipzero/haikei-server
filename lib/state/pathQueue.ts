import { createEvent, createStore } from 'effector'

const LENGTH = 3
export const push = createEvent<string[]>()

// state: [...queue, expectDeleted]
export const pathQueue = createStore<string[][]>([]).on(push, (list, item) => {
  return [item, ...list].slice(0, LENGTH)
})
