import type { Question } from './types'
export const sourcePosition = /^\d+:\d+:\d+:\d+$/
export const positionOf = (q: Question) => [q.source.page, q.source.block, q.source.item, q.source.part].join(':')
