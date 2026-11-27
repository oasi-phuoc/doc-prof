import assert from 'node:assert/strict'
import test from 'node:test'
import { resolve } from 'node:path'
import { access } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  resolve: { alias: { '@': resolve('src') } },
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})

try {
  const { buildPage } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const practice = await server.ssrLoadModule('/src/math/guided-practice.ts')
  const fundamentals = await server.ssrLoadModule('/src/math/fundamental-practice.ts')
  const { realMapPlans } = await server.ssrLoadModule('/src/math/real-map-catalog.ts')
  const itemsFor = (exerciseType, topic, domain, difficulty, seed) => buildPage({
    ...defaultPage(domain), exerciseType, topic, difficulty, count: 2,
  }, seed).items

  await test('a subtraction through zero preserves the value of the rewritten minuend', () => {
    assert.deepEqual(practice.subtractionExchangeItem(302, 67, true).subtractionExchange.digits, ['2', '9', '12'])
    assert.deepEqual(practice.subtractionExchangeItem(42, 17, true).subtractionExchange.digits, ['3', '12'])
    for (const difficulty of ['facile', 'moyen', 'avance']) {
      for (let seed = 1; seed <= 32; seed++) {
        const items = itemsFor(practice.SUBTRACTION_EXCHANGE_TYPE, 'soustraction', 'algèbre', difficulty, seed)
        assert.equal(items.length, 2)
        for (const [index, item] of items.entries()) {
          const { guided, digits } = item.subtractionExchange
          let value = 0
          for (let i = 0; i < digits.length; i++) {
            const rewritten = Number(digits[i] || item.digitsA[i])
            assert(rewritten >= Number(item.digitsB[i]))
            value = 10 * value + rewritten
          }
          assert.equal(value, item.a)
          assert.equal(item.answer, String(item.a - item.b))
          assert.equal(guided, index === 0)
          assert.equal(Math.floor(item.a / 10) % 10 === 0, difficulty === 'avance' || (difficulty === 'moyen' && index > 0))
        }
      }
    }
  })

  await test('both measurements describe the same rectangle and use different units', () => {
    for (let seed = 1; seed <= 32; seed++) {
      const items = itemsFor(practice.RECTANGLE_MEASURES_TYPE, 'aires', 'géométrie', 'avance', seed)
      assert.equal(items.length, 2)
      for (const [index, item] of items.entries()) {
        const { length, width, guided } = item.rectangleMeasures
        assert(length > width)
        assert.equal(item.answer, `${2 * (length + width)} cm · ${length * width} cm²`)
        assert.equal(guided, index === 0)
      }
    }
  })

  await test('all translated vertices stay inside the printable grid', () => {
    for (const difficulty of ['facile', 'moyen', 'avance']) {
      for (let seed = 1; seed <= 32; seed++) {
        const [item] = itemsFor(practice.TRANSLATION_PRACTICE_TYPE, 'transformations', 'géométrie', difficulty, seed)
        const { figure, vector, guided } = item.translationPractice
        const { columns, rows } = practice.TRANSLATION_GRID
        assert.equal(guided, difficulty === 'facile')
        for (const [x, y] of figure) {
          const image = practice.translatePoint([x, y], vector)
          assert.deepEqual(image, [x + vector[0], y + vector[1]])
          assert(image[0] > 0 && image[0] < columns && image[1] > 0 && image[1] <= rows)
        }
      }
    }
  })

  await test('the Sion photo uses four distinct cells and both directions of reading', () => {
    assert.deepEqual(practice.SION_PLACES.map(({ code }) => code), ['A3', 'B3', 'C3', 'D1'])
    const { columns, rows } = practice.SION_GRID
    for (const place of practice.SION_PLACES) {
      assert.equal(Math.floor(place.x * columns), place.column)
      assert.equal(Math.floor(place.y * rows), place.row)
      assert(place.x * columns % 1 > 0.08 && place.y * rows % 1 > 0.08)
    }
    for (const difficulty of ['facile', 'avance']) {
      for (let seed = 1; seed <= 32; seed++) {
        const [item] = itemsFor(practice.REAL_MAP_TYPE, 'reperage', 'géométrie', difficulty, seed)
        const place = practice.SION_PLACES[item.sionMap.target]
        assert.equal(item.answer, difficulty === 'avance' ? place.name : place.code)
      }
    }
  })

  await test('Sion backgrounds are a per-exercise setting and preserve the question', () => {
    const page = {
      ...defaultPage('géométrie'), topic: 'reperage', exerciseType: practice.REAL_MAP_TYPE, count: 1,
    }
    const [original] = buildPage(page, 41).items
    const [simplified] = buildPage({ ...page, sionMapBackground: 'simplified' }, 41).items
    assert.equal(original.sionMap.background, undefined)
    assert.deepEqual(simplified, { ...original, sionMap: { ...original.sionMap, background: 'simplified' } })
    const [annotated] = buildPage({ ...page, sionMapBackground: 'annotated' }, 41).items
    assert.deepEqual(annotated, { ...original, sionMap: { ...original.sionMap, background: 'annotated' } })

    const mixed = buildPage({ ...page, realMapId: 'ardon', sionMapBackground: 'simplified', extraBlocks: [page] }, 41)
    assert.equal(mixed.blocks[0].items[0].sionMap.background, 'simplified')
    assert.equal(mixed.blocks[0].items[0].sionMap.planId, 'ardon')
    assert.equal(mixed.blocks[1].items[0].sionMap.background, undefined)
    assert.equal(mixed.blocks[1].items[0].sionMap.planId, undefined)

    const [frozen] = buildPage({ ...page, libreItems: [simplified], sionMapBackground: 'photo' }, 41).items
    assert.deepEqual(frozen, { ...original, sionMap: { ...original.sionMap, background: 'photo' } })
  })

  await test('every Swiss plan has three distinct assets and unambiguous questions', async () => {
    assert.equal(realMapPlans.length, 20)
    assert.equal(new Set(realMapPlans.map(({ id }) => id)).size, 20)
    assert(['sion-ensemble', 'zermatt', 'martigny', 'ardon', 'vetroz', 'lausanne', 'berne', 'zurich', 'bale'].every(
      id => realMapPlans.some(plan => plan.id === id),
    ))
    for (const { id, places, grid } of realMapPlans) {
      assert(places.length >= 2)
      assert.equal(new Set(places.map(({ code }) => code)).size, places.length)
      for (const place of places) {
        assert(place.x > 0 && place.x < 1 && place.y > 0 && place.y < 1)
        assert.equal(Math.floor(place.x * grid.columns), place.column)
        assert.equal(Math.floor(place.y * grid.rows), place.row)
      }
      if (id !== 'sion-historique') {
        for (const variant of ['photo.webp', 'annotated.webp', 'simplified.png']) {
          await access(resolve(`src/math/media/spatial/swiss/${id}-${variant}`))
        }
      }
      for (const difficulty of ['facile', 'avance']) {
        const page = {
          ...defaultPage('géométrie'), topic: 'reperage', exerciseType: practice.REAL_MAP_TYPE, count: 1, difficulty,
          realMapId: id,
        }
        for (let seed = 1; seed <= 12; seed++) {
          const [item] = buildPage(page, seed).items
          const place = places[item.sionMap.target]
          assert.equal(item.answer, difficulty === 'avance' ? place.name : place.code)
          assert.equal(item.sionMap.planId ?? 'sion-historique', id)
        }
      }
    }
  })

  await test('fundamental practice has a guided item and a consistent second answer', () => {
    const { PLACE_VALUE_PRACTICE, DECIMAL_LINE_PRACTICE, SHAPE_PRACTICE, LENGTH_PRACTICE } = fundamentals
    for (let seed = 1; seed <= 32; seed++) {
      const numbers = itemsFor(PLACE_VALUE_PRACTICE, 'nombres', 'algèbre', 'facile', seed)
      assert(numbers[0].baseTen.tens > 0)
      assert.equal(numbers[1].baseTen.tens, 0)
      for (const item of numbers) {
        const { hundreds, tens, ones } = item.baseTen
        assert.equal(item.answer, `${hundreds * 100 + tens * 10 + ones} = ${hundreds * 100} + ${tens * 10} + ${ones}`)
      }
      const lines = itemsFor(DECIMAL_LINE_PRACTICE, 'decimaux', 'algèbre', 'avance', seed)
      assert.deepEqual(lines.map(({ numberLine }) => numberLine.labelAt), [1, 10])
      for (const { numberLine, answer } of lines) {
        const { start, target, step, labelAt } = numberLine
        assert.notEqual(target, labelAt)
        assert.equal(step, 0.01)
        assert.equal(Math.round((start + target * step) * 100), Math.round(Number.parseFloat(answer.replace(',', '.')) * 100))
      }
      const shapes = itemsFor(SHAPE_PRACTICE, 'figures', 'géométrie', 'facile', seed)
      assert.notEqual(shapes[0].shapePractice.kind, shapes[1].shapePractice.kind)
      assert.equal(shapes[0].shapePractice.angle, 0)
      assert(shapes[1].shapePractice.angle > 0)
      for (const { lengthPractice, answer } of itemsFor(LENGTH_PRACTICE, 'conversions', 'géométrie', 'avance', seed)) {
        const { cm, mm } = lengthPractice
        assert.equal(answer, `${cm * 10} mm + ${mm} mm = ${cm * 10 + mm} mm.`)
      }
    }
  })
} finally {
  await server.close()
}
