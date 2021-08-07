import { createEvent, createStore } from 'effector'

const LENGTH = 3
export const push = createEvent()

// state: [...queue, expectDeleted]
export const pathQueue = createStore([]).on(push, (list, item) => {
  return [item, ...list].slice(0, LENGTH)
})
