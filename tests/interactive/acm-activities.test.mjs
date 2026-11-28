import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

const expandedThemes = [
  'acm-quilling',
  'acm-paper-layering',
  'acm-cartes-pop-up',
  'acm-pate-a-sel',
  'acm-creations-saisonnieres',
  'acm-perspective-espace',
  'acm-ombrage-volume-lumiere',
  'acm-peinture',
  'acm-paysage-papier-dechire',
]

let server
let catalog
let defaultPage
let buildWorksheets

before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  const [acm, math, generate] = await Promise.all([
    server.ssrLoadModule('/src/acm/catalog.ts'),
    server.ssrLoadModule('/src/math/catalog.ts'),
    server.ssrLoadModule('/src/math/generate.ts'),
  ])
  catalog = acm
  defaultPage = math.defaultPage
  buildWorksheets = generate.buildWorksheets
})

after(() => server?.close())

test('ACM exposes at least twenty distinct activities in each expanded theme', () => {
  const { ACM_TOPICS, ACM_EXERCISE_TYPES } = catalog
  assert.equal(new Set(ACM_EXERCISE_TYPES.map(({ id }) => id)).size, ACM_EXERCISE_TYPES.length)
  for (const topic of expandedThemes) {
    assert.ok(ACM_TOPICS.some(({ id }) => id === topic))
    const titles = ACM_EXERCISE_TYPES.filter((type) => type.topic === topic).map(({ label }) => label)
    assert.ok(new Set(titles).size >= 20, topic)
  }
})

test('ACM keeps each photo or brief paired with its numbered step across worksheet pages', async () => {
  for (const { id, topic } of catalog.ACM_EXERCISE_TYPES) {
    const activity = catalog.getAcmActivity(id)
    const pages = buildWorksheets([{ ...defaultPage('acm'), topic, exerciseType: id }], 42)
    const items = pages.flatMap(({ items }) => items)
    assert.equal(items.length, pages.length, id)
    assert.ok(items.every((item) => item.layout === 'acm'), id)
    assert.equal(activity.stepImages.length, activity.steps.length, id)
    assert.deepEqual(items.flatMap(({ acm }) => acm.steps), activity.steps, id)
    assert.deepEqual(items.flatMap(({ acm }) => acm.stepImages), activity.stepImages, id)

    let offset = 0
    for (const item of items) {
      assert.equal(item.acmStepOffset ?? 0, offset, id)
      const hasBriefs = activity.stepImages.some((visual) => 'brief' in visual)
      assert.ok(item.acm.steps.length <= (hasBriefs ? 4 : 6), id)
      offset += item.acm.steps.length
    }
    for (const [index, visual] of activity.stepImages.entries()) {
      if ('src' in visual) {
        assert.match(visual.src, /^\/lib\/images\/acm\/.*\.webp$/)
        assert.ok(visual.alt.trim(), id)
        await access(join('public', decodeURI(visual.src)))
        if (visual.nextFold) {
          const { from, to, ratio } = visual.nextFold
          assert.ok(index + 1 < activity.steps.length, id)
          assert.ok(Number.isFinite(ratio) && ratio > 0, id)
          assert.notDeepEqual(from, to, id)
          assert.ok([...from, ...to].every(value => value > 0 && value < 100), id)
        }
      } else {
        assert.ok(visual.brief.trim(), id)
      }
    }
  }
})
