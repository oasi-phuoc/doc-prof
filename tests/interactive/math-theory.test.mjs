import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import test from 'node:test'
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  resolve: { alias: { '@': resolve('src') } },
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})

try {
  const { algebraTopics, geometryTopics, defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { MATH_THEORY_PREFIX, mathTheoryLessons } = await server.ssrLoadModule('/src/math/theory-lessons.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { typeChoicesForBlock } = await server.ssrLoadModule('/src/components/generator/generator-derived.ts')

  const configs = [...algebraTopics, ...geometryTopics]
    .filter(({ id }) => Object.hasOwn(mathTheoryLessons, id))
    .map(({ domain, id }) => ({
      ...defaultPage(domain),
      domain,
      topic: id,
      exerciseType: MATH_THEORY_PREFIX + id,
      columns: 1,
      count: 1,
    }))

  await test('every math theory is listed first and produces a page for each illustrated part', async () => {
    assert.equal(configs.length, 23)
    const sheets = buildWorksheets(configs, 41)
    assert.equal(sheets.length, 49)
    for (const [index, config] of configs.entries()) {
      assert.equal(typeChoicesForBlock(config.domain, config)[0].id, config.exerciseType)
      const { continuation = [], ...lesson } = mathTheoryLessons[config.topic]
      const parts = [lesson, ...continuation]
      const rendered = sheets.filter((sheet) => sheet.configIndex === index)
      assert.equal(rendered.length, parts.length)
      for (const [partIndex, sheet] of rendered.entries()) {
        assert.equal(Boolean(sheet.isContinuation), partIndex > 0)
        assert.equal(sheet.blocks[0].sourceBlockIndex, 0)
        assert.equal(sheet.items.length, 1)
        const { mathTheory, answer } = sheet.items[0]
        assert.equal(answer, '')
        assert.equal(mathTheory.title, parts[partIndex].title)
        assert.equal(mathTheory.heading, parts[partIndex].heading)
        assert(mathTheory.heading.endsWith('?'))
        assert.notEqual(mathTheory.heading, mathTheory.title)
        assert(mathTheory.words.some((word) => word[2]))
        await access(resolve('src/math/media/theory/falc', mathTheory.illustration + '.png'))
      }
    }
  })

  await test('written arithmetic follows the introductory lesson and has its own explanations', () => {
    const parts = (id) => {
      const config = configs.find(({ topic }) => topic === id)
      return buildWorksheets([config], 41).map((sheet) => sheet.items[0].mathTheory)
    }
    assert.deepEqual(parts('addition').map(({ title, heading }) => [title, heading]), [['Poser une addition', 'Comment additionner ?']])
    assert.deepEqual(parts('multiplication').map(({ illustration }) => illustration), ['multiplication', 'multiplication-colonne', 'multiplication-deux-chiffres'])
    assert.deepEqual(parts('division').map(({ illustration }) => illustration), ['division', 'division-posee', 'division-zero-quotient'])
    assert.equal(parts('decimaux').at(-1).example, '7,5 ÷ 0,3 = 75 ÷ 3 = 25.')
  })

  await test('multipage transformations preserve the title and order of surrounding exercises', () => {
    const transformations = configs.find((page) => page.topic === 'transformations')
    const mixed = {
      ...defaultPage('géométrie'),
      topic: 'figures',
      exerciseType: 'figures-nommer',
      extraBlocks: [transformations, { topic: 'aires', exerciseType: 'aires-rectangle', count: 1, columns: 1 }],
    }
    const sheets = buildWorksheets([mixed], 41)
    assert.equal(sheets.length, 7)
    assert.deepEqual(sheets.map((sheet) => sheet.blocks[0].sourceBlockIndex), [0, 1, 1, 1, 1, 1, 2])
    assert.deepEqual(sheets.slice(1, 6).map((sheet) => sheet.items[0].mathTheory.illustration),
      ['translation', 'rotation', 'symetrie-axiale', 'symetrie-centrale', 'agrandissement'])
    assert.equal(sheets.at(-1).blocks[0].exerciseType, 'aires-rectangle')
  })
} finally {
  await server.close()
}
