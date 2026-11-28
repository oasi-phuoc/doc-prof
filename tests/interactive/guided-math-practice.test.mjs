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
  const { buildPage, buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const practice = await server.ssrLoadModule('/src/math/guided-practice.ts')
  const fundamentals = await server.ssrLoadModule('/src/math/fundamental-practice.ts')
  const shortProblems = await server.ssrLoadModule('/src/math/short-problems.ts')
  const { realMapPlans } = await server.ssrLoadModule('/src/math/real-map-catalog.ts')
  const { realMapPractice } = await server.ssrLoadModule('/src/math/real-map-practice.ts')
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

  await test('the Sion photo defaults to eight columns and five rows, with questions in both directions', () => {
    assert.deepEqual(practice.SION_PLACES.slice(0, 4).map(({ code }) => code), ['B4', 'C4', 'E4', 'G2'])
    const { columns, rows } = practice.SION_GRID
    assert.deepEqual([columns, rows], [8, 5])
    for (const place of practice.SION_PLACES) {
      assert.equal(Math.floor(place.x * columns), place.column)
      assert.equal(Math.floor(place.y * rows), place.row)
    }
    for (const difficulty of ['facile', 'avance']) {
      for (let seed = 1; seed <= 32; seed++) {
        const [item] = itemsFor(practice.REAL_MAP_TYPE, 'reperage', 'géométrie', difficulty, seed)
        const place = practice.SION_PLACES[item.sionMap.target]
        assert.equal(item.answer, `Dans la case ${place.code}.`)
        assert.match(item.prompt, /^(Où|Dans quelle case)/)
        assert(item.prompt.includes(place.name))
        assert(realMapPractice(item.sionMap).questions.some(question => question.kind === 'check'))
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
    assert.equal(mixed.blocks[1].items[0].sionMap.planId, 'sion-historique')

    const [frozen] = buildPage({ ...page, libreItems: [simplified], sionMapBackground: 'photo' }, 41).items
    assert.deepEqual(frozen, { ...original, sionMap: { ...original.sionMap, background: 'photo' } })
  })

  await test('map and numbered questions use separate sheets and respect settings on legacy saved items', () => {
    const page = { ...defaultPage('géométrie'), topic: 'reperage', exerciseType: practice.REAL_MAP_TYPE, count: 1,
      libreItems: [{ layout: 'text', prompt: 'Ancienne question', answer: 'C3', sionMap: { target: 2 } }],
      realMapColumns: 12, realMapRows: 9, realMapNotation: 'coordinates', sionMapBackground: 'annotated', realMapQuestionCount: 4,
    }
    const following = { ...defaultPage('géométrie'), topic: 'aires', exerciseType: practice.RECTANGLE_MEASURES_TYPE }
    const [map, questions, next] = buildWorksheets([page, following], 41)
    assert.deepEqual([map.blocks[0].realMapPart, questions.blocks[0].realMapPart], ['map', 'questions'])
    assert.equal(map.blocks[0].items[0], questions.blocks[0].items[0])
    assert.equal(map.blocks[0].exerciseIndex, 0)
    assert.equal(next.blocks[0].exerciseIndex, 1)
    const { sionMap, prompt } = map.items[0]
    assert(prompt.startsWith('Placez D'))
    assert.deepEqual({ ...sionMap }, { planId: undefined, columns: 12, rows: 9, notation: 'coordinates', background: 'annotated', target: 2, questionCount: 4 })
    assert.equal(realMapPractice(sionMap).questions.length, 4)
    assert.equal(realMapPractice(sionMap).plan.places.length, 10)
    const resized = buildPage({ ...page, realMapColumns: 50, realMapRows: 2 }, 41).items[0]
    assert.deepEqual(realMapPractice(resized.sionMap).plan.grid, { columns: 12, rows: 3 })
  })

  await test('each map has three aligned assets, consistent answers and a shorter question set', async () => {
    assert.deepEqual(Object.fromEntries(['swiss', 'imaginary', 'europe', 'world'].map(family =>
      [family, realMapPlans.filter(plan => plan.family === family).length])), { swiss: 25, imaginary: 25, europe: 8, world: 9 })
    assert.equal(new Set(realMapPlans.map(({ id }) => id)).size, 67)
    const europeanCountries = new Set(realMapPlans.filter(plan => plan.family === 'europe').flatMap(plan => plan.places.map(place => place.country)))
    assert.equal(europeanCountries.size, 50)
    assert(!europeanCountries.has(undefined))
    assert(['sion-ensemble', 'zermatt', 'martigny', 'ardon', 'vetroz', 'lausanne', 'berne', 'zurich', 'bale'].every(
      id => realMapPlans.some(plan => plan.id === id),
    ))
    const linkColors = new Set()
    for (const { id, places, grid, family } of realMapPlans) {
      assert(places.length >= 2)
      if (family === 'swiss' || family === 'imaginary') assert.equal(places.length, 10, id)
      assert.equal(new Set(places.map(({ name }) => name)).size, places.length, id)
      for (const place of places) {
        assert(place.x > 0 && place.x < 1 && place.y > 0 && place.y < 1)
        assert.equal(Math.floor(place.x * grid.columns), place.column)
        assert.equal(Math.floor(place.y * grid.rows), place.row)
      }
      if (id !== 'sion-historique') {
        const folder = family === 'europe' ? 'world' : family
        for (const variant of ['photo.webp', 'annotated.webp', 'simplified.png']) {
          await access(resolve(`src/math/media/spatial/${folder}/${id}-${variant}`))
        }
      }
      for (const [columns, rows] of [[4, 3], [8, 5], [12, 9]]) {
        for (let target = 0; target < places.length; target++) {
          const options = { planId: id, columns, rows, target }
          const { plan, questions, route } = realMapPractice(options)
          const place = plan.places[target]
          assert.deepEqual(plan.grid, { columns, rows })
          assert.deepEqual([place.x, place.y], [places[target].x, places[target].y])
          assert.equal(questions[0].answer, `Dans la case ${place.code}.`)
          const checked = questions[1].choices.filter(choice => choice.correct).map(choice => choice.label).sort()
          assert.deepEqual(checked, plan.places.filter(other => other.code === place.code).map(other => other.name).sort())
          const draw = questions.find(question => question.kind === 'draw')
          assert(draw && draw.prompt.includes(route.color.name) && draw.answer.includes(route.color.name))
          linkColors.add(route.color.name)
          const distance = Math.abs(route.from.column - route.to.column) + Math.abs(route.from.row - route.to.row)
          assert.equal(Number.parseInt(questions[5].answer), distance)
          const last = questions.at(-1)
          for (const { label, correct } of last.choices) {
            assert.equal(correct, last.prompt.includes('sans repère nommé') !== plan.places.some(other => other.code === label), id)
          }
          const short = realMapPractice({ ...options, questionCount: 4 })
          assert.equal(short.questions.length, 4)
          assert.deepEqual(short.plan.places, plan.places)
          assert.deepEqual(short.route, route)

          const { posts, questions: axes } = realMapPractice({ ...options, notation: 'coordinates' })
          assert.equal(posts.length, 10)
          assert.equal(new Set(posts.map(post => `${post.column},${post.row}`)).size, 10)
          assert(posts.every(post => post.column >= 0 && post.column <= columns && post.row >= 0 && post.row <= rows))
          assert.deepEqual(axes[0].posts.map(post => post.name), ['D', 'A', 'P1', 'P3', 'P4', 'P6'])
          assert.deepEqual(posts.filter(post => post.given), axes[1].posts)
        }
      }
    }
    assert.equal(linkColors.size, 5)
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

  await test('short problems preserve the illustrated givens, the unit and the calculation', () => {
    const { SHORT_PROBLEM_HOURS, SHORT_PROBLEM_PRICES, SHORT_PROBLEM_DISTANCES, rebuildShortProblem } = shortProblems
    const prompts = new Set()
    for (const type of [SHORT_PROBLEM_HOURS, SHORT_PROBLEM_PRICES, SHORT_PROBLEM_DISTANCES]) {
      for (const difficulty of ['facile', 'moyen', 'avance']) {
        const variants = new Set()
        for (let seed = 1; seed <= 256; seed++) {
          const items = itemsFor(type, 'problemes', 'algèbre', difficulty, seed)
          assert.deepEqual(items.map(item => item.shortProblem.guided), [true, false])
          assert.notEqual(items[0].prompt, items[1].prompt)
          for (const item of items) {
            assert(item.prompt.split('\n').at(-1).endsWith('?'))
            assert(item.calcAnswer && item.responseAnswer)
            for (const { facts } of item.shortProblem.diagram.rows) {
              for (const { value } of facts) assert(item.prompt.includes(value))
            }
            const { duration, minute, first, second, third, fourth } = item.problemVars
            if (type === SHORT_PROBLEM_HOURS) {
              assert.equal(item.answer, `Le trajet dure ${duration} min.`)
              assert.equal(minute + duration < 60, difficulty === 'facile')
            } else if (type === SHORT_PROBLEM_PRICES) {
              const total = (Math.round(first * 100) + Math.round(second * 100)) / 100
              assert(item.answer.endsWith(`${total.toFixed(2).replace('.', ',')} CHF.`))
            } else if (difficulty === 'avance') {
              assert.notEqual(first + second, third + fourth)
              assert.equal(item.answer, `Le trajet ${first + second < third + fourth ? 'A' : 'B'} est plus court avec ${Math.min(first + second, third + fourth)} m.`)
            } else {
              const metres = first * (difficulty === 'moyen' ? 1000 : 1) + second
              assert.equal(item.answer, `Le trajet mesure ${metres} m.`)
            }
            variants.add(item.prompt)
          }
        }
        assert(variants.size >= 100)
        for (const prompt of variants) {
          assert(!prompts.has(prompt))
          prompts.add(prompt)
        }
      }
    }

    const context = { type: SHORT_PROBLEM_HOURS, difficulty: 'moyen', variant: 0, guided: true }
    const edited = rebuildShortProblem(context, { hour: 9, minute: 55, duration: 20 })
    assert.equal(edited.shortProblem.diagram.rows[0].facts[1].value, '10 h 15')
    assert(edited.prompt.includes('10 h 15'))
    assert(edited.calcAnswer.includes('5 min + 15 min = 20 min'))
    assert.equal(rebuildShortProblem(context, { hour: 9, minute: 60, duration: 20 }), undefined)
    const equalRoutes = rebuildShortProblem({ ...context, type: SHORT_PROBLEM_DISTANCES, difficulty: 'avance' }, {
      first: 200, second: 320, third: 240, fourth: 280,
    })
    assert.equal(equalRoutes.answer, 'Les deux trajets mesurent 520 m.')
  })
} finally {
  await server.close()
}
