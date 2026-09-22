import { describe, expect, it } from 'vitest'
import { buildPage } from '@/math/generate'
import type { PageConfig } from '@/math/types'

const base: PageConfig = {
  domain: 'algèbre',
  topic: '__topic__',
  exerciseType: '__id__',
  count: 6,
  columns: 2,
}

describe('__id__', () => {
  it('est déterministe pour une même graine', () => {
    const a = buildPage(base, 42)
    const b = buildPage(base, 42)
    expect(a.items.map((i) => i.answer)).toEqual(b.items.map((i) => i.answer))
  })

  it('change avec la graine', () => {
    const a = buildPage(base, 1)
    const b = buildPage(base, 2)
    expect(a.items.map((i) => i.answer)).not.toEqual(b.items.map((i) => i.answer))
  })
})
