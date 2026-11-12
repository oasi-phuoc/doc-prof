import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-geometry-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { verifiedGeometry } = await server.ssrLoadModule('/src/interactive/domain/geometry.ts')
  const { exactDecimal, scaledDecimal } = await server.ssrLoadModule('/src/interactive/domain/exact-math.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { buildPage, buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS } = await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { positionOf } = await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const { createGameSource, renewGameSource } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const base = demoRecipe()
  const families = ['perimetres-carre', 'perimetres-rectangle', 'aires-carre', 'aires-rectangle', 'perimetres-carre-manquant', 'perimetres-rectangle-manquant', 'aires-carre-manquant', 'aires-rectangle-manquant']
  const source = (figure, dims, prompt, answer, other = {}) => ({ layout: 'geo', figure, dims, prompt, answer, responseAnswer: answer, ...other })
  const unitOf = text => /\s(mm|cm|dm|m|km)(²|2)?$/.exec(text)
  const numberOf = text => exactDecimal(text.replace(/\s*(?:mm|cm|dm|m|km)(?:²|2)?$/, ''))
  const same = (a, b) => {
    assert.ok(a && b)
    const precision = Math.max(a.precision, b.precision)
    return scaledDecimal(a, precision) === scaledDecimal(b, precision)
  }
  const gameFor = (...items) => convertRecipe({ ...base, pages: [{ ...defaultPage('géométrie'), topic: 'aires', exerciseType: 'aires-carre', count: items.length, extraBlocks: undefined, libreItems: items }] })
  const examples = [
    source('square', { side: 0.3, unit: 'cm' }, 'Calculez l’aire.', '0,09 cm²'),
    source('rectangle', { length: 0.1, width: 0.2, unit: 'm' }, 'Calculez le périmètre.', '0,6 m'),
    source('square', { ask: 'side', unit: 'mm' }, 'Le périmètre mesure 10 mm. Calculez le côté.', '2,5 mm'),
    source('rectangle', { length: 5, ask: 'width', unit: 'cm' }, 'Le périmètre mesure 14 cm. La longueur mesure 5 cm. Calculez la largeur.', '2 cm'),
    source('square', { ask: 'side', unit: 'dm' }, 'L’aire mesure 0,09 dm². Calculez le côté.', '0,3 dm'),
    source('rectangle', { length: 3, ask: 'width', unit: 'km' }, 'L’aire mesure 7,5 km². La longueur mesure 3 km. Calculez la largeur.', '2,5 km'),
  ]

  await test('eight real square and rectangle types retain exact keys across 100 seeds and the three actual difficulty levels', () => {
    for (const type of families) for (const difficulty of ['facile', 'moyen', 'avance']) for (let seed = 1; seed <= 100; seed++) {
      const config = { ...defaultPage('géométrie'), topic: exerciseTypes.find(entry => entry.id === type).topic, exerciseType: type, difficulty, count: 2, libreItems: undefined }
      const recipe = { ...base, pages: [config], seed, libreMode: false }, original = structuredClone(recipe)
      const items = buildPage(config, seed).blocks.flatMap(block => block.items)
      const paper = seed === 1 ? structuredClone(buildWorksheets(recipe.pages, seed)) : undefined
      const game = convertRecipe(recipe)
      assert.equal(game.questions.length, items.length, `${type}/${difficulty}/${seed}: ${JSON.stringify(game.issues)}`)
      assert.deepEqual(game.issues, [])
      for (const [index, q] of game.questions.entries()) {
        const item = items[index], verified = verifiedGeometry(item)
        assert.ok(verified && !verified.reason, `${type}/${difficulty}/${seed}`)
        const correct = q.choices.find(choice => choice.id === game.corrections[q.id].choiceId)
        assert.ok(same(numberOf(correct.text), numberOf(item.answer)), `${type}: ${correct.text}/${item.answer}`)
        const expectedUnit = unitOf(item.answer)
        assert.ok(expectedUnit)
        const values = q.choices.map(choice => numberOf(choice.text))
        assert.ok(values.every(Boolean)); assert.equal(q.choices.length, 6)
        for (const choice of q.choices) {
          const unit = unitOf(choice.text)
          assert.ok(unit, choice.text)
          assert.equal(unit[1], expectedUnit[1]); assert.equal(Boolean(unit[2]), Boolean(expectedUnit[2]))
        }
        const precision = Math.max(...values.map(value => value.precision))
        assert.equal(new Set(values.map(value => String(scaledDecimal(value, precision)))).size, q.choices.length)
        assert.equal(q.figure.type, item.figure)
        if (item.dims.ask) assert.equal(q.figure.dims[item.dims.ask], undefined, 'the hidden dimension never appears in the public figure')
        else for (const dimension of item.figure === 'square' ? ['side'] : ['length', 'width']) assert.equal(q.figure.dims[dimension], item.dims[dimension])
        assert.equal('answer' in q, false); assert.equal('correct' in q, false)
      }
      assert.deepEqual(recipe, original)
      if (seed === 1) {
        assert.deepEqual(convertRecipe(recipe), game)
        assert.deepEqual(buildWorksheets(recipe.pages, seed), paper, 'conversion preserves the printable source and its correction')
      }
    }
  })

  await test('independent decimal, unit and large-integer cases are computed without floating-point rounding', () => {
    for (const item of [
      ...examples,
      source('square', { side: 3, unit: 'cm' }, 'Calculez l’aire.', '9cm²'),
      source('square', { side: 3, unit: 'cm' }, 'Calculez l’aire.', '9'),
      source('rectangle', { length: 1.25, width: 0.08, unit: 'cm' }, 'Calculez l’aire.', '0,1 cm²'),
      source('square', { side: 0.001, unit: 'm' }, 'Calculez l’aire.', '0,000001 m²'),
      source('square', { side: 100000001, unit: 'cm' }, 'Calculez l’aire.', '10000000200000001 cm²'),
    ]) {
      const before = structuredClone(item), value = verifiedGeometry(item)
      assert.ok(value && !value.reason, JSON.stringify(item))
      assert.ok(same(value.value, numberOf(item.answer)))
      assert.ok(same(numberOf(value.correctText), numberOf(item.answer)))
      assert.equal(unitOf(value.correctText)[1], item.dims.unit)
      assert.deepEqual(item, before)
      const game = gameFor(item), q = game.questions[0]
      assert.ok(q, JSON.stringify(game.issues))
      assert.ok(same(numberOf(q.choices.find(choice => choice.id === game.corrections[q.id].choiceId).text), numberOf(item.answer)))
    }
    for (const unit of ['mm', 'cm', 'dm', 'm', 'km']) {
      const item = source('square', { side: 1.5, unit }, 'Calculez l’aire.', `2,25 ${unit}²`)
      assert.ok(!verifiedGeometry(item).reason)
      const game = gameFor(item)
      assert.ok(game.questions[0].choices.every(choice => unitOf(choice.text)?.[1] === unit))
    }
  })

  await test('inverse questions recover exact roots and widths using only the visible givens', () => {
    for (const item of examples.filter(item => item.dims.ask)) {
      const result = verifiedGeometry(item)
      assert.ok(result && !result.reason)
      assert.equal(result.figure.dims.ask, item.dims.ask)
      assert.equal(result.figure.dims[item.dims.ask], undefined)
      assert.notEqual(result.figure.dims, item.dims)
      assert.ok(same(result.value, numberOf(item.answer)))
      assert.ok(result.prompt.includes(item.prompt), 'the given area/perimeter and length remain visible')
    }
    const square = source('square', { ask: 'side', unit: 'cm' }, 'L’aire mesure 10000000200000001 cm². Calculez le côté.', '100000001 cm')
    assert.ok(same(verifiedGeometry(square).value, { units: 100000001n, precision: 0 }))
    const thin = source('rectangle', { length: 1.25, ask: 'width', unit: 'm' }, 'L’aire mesure 0,1 m². La longueur mesure 1,25 m. Calculez la largeur.', '0,08 m')
    assert.ok(same(verifiedGeometry(thin).value, { units: 8n, precision: 2 }))
  })

  await test('stale corrections, contradictory prompts, hidden givens, invalid units and rounded inverses are explicitly rejected', () => {
    const direct = examples[0], inverse = examples[3]
    for (const invalid of [
      { ...direct, answer: '0,08 cm²' }, { ...direct, responseAnswer: '0,08 cm²' },
      { ...direct, answer: '0,09 m²', responseAnswer: '0,09 m²' },
      { ...direct, answer: '0,09 cm', responseAnswer: '0,09 cm' },
      { ...direct, dims: { ...direct.dims, unit: 'inch' } },
      { ...direct, dims: { ...direct.dims, side: 0 } }, { ...direct, dims: { ...direct.dims, side: -0.3 } },
      { ...direct, dims: { ...direct.dims, side: Infinity } }, { ...direct, dims: { ...direct.dims, side: NaN } },
      { ...direct, dims: { ...direct.dims, bare: true } },
      { ...direct, prompt: 'Calculez le volume.' }, { ...direct, prompt: 'Calculez l’aire. Puis doublez le résultat.' },
      { ...inverse, dims: { ...inverse.dims, width: 2 } },
      { ...inverse, dims: { ...inverse.dims, length: 6 } },
      { ...inverse, prompt: inverse.prompt.replace('5 cm', '6 cm') },
      { ...inverse, prompt: inverse.prompt.replace('14 cm', '14 mm') },
      { ...inverse, prompt: inverse.prompt + ' La largeur est différente.' },
      source('square', { side: 0.0001, unit: 'cm' }, 'Calculez l’aire.', '0,00000001 cm²'),
      source('square', { ask: 'side', unit: 'cm' }, 'L’aire mesure 2 cm². Calculez le côté.', '1,414214 cm'),
      source('rectangle', { length: 3, ask: 'width', unit: 'cm' }, 'L’aire mesure 1 cm². La longueur mesure 3 cm. Calculez la largeur.', '0,333333 cm'),
      source('rectangle', { length: 128, ask: 'width', unit: 'cm' }, 'L’aire mesure 1 cm². La longueur mesure 128 cm. Calculez la largeur.', '0,007813 cm'),
      source('rectangle', { length: 8, ask: 'width', unit: 'cm' }, 'Le périmètre mesure 14 cm. La longueur mesure 8 cm. Calculez la largeur.', '1 cm'),
      source('rectangle', { length: 5, ask: 'height', unit: 'cm' }, 'Le périmètre mesure 14 cm. La longueur mesure 5 cm. Calculez la largeur.', '2 cm'),
    ]) {
      const before = structuredClone(invalid), result = verifiedGeometry(invalid)
      assert.ok(result?.reason, JSON.stringify(invalid))
      assert.deepEqual(invalid, before)
    }
    for (const invalid of [
      { ...direct, answer: '0,08 cm²' }, { ...inverse, dims: { ...inverse.dims, width: 2 } },
      { ...direct, dims: { ...direct.dims, bare: true } },
    ]) {
      const game = gameFor(invalid)
      assert.equal(game.questions.length, 0); assert.ok(game.issues.length)
    }
    for (const item of [
      source('circle', { radius: 2, unit: 'cm' }, 'Calculez l’aire. Prenez π = 3,14.', '12,56 cm²'),
      { layout: 'geo-dual', answer: '12 cm²' }, { layout: 'text', answer: '12 cm²' },
    ]) assert.equal(verifiedGeometry(item), undefined)
  })

  await test('all six cards carry consistent units and retain the exact key under source order, numeric sorting and choice caps', () => {
    const game = gameFor(...examples), before = structuredClone(game)
    assert.equal(game.questions.length, examples.length)
    for (const maxChoices of [2, 3, 4, 5, 6]) {
      const plan = prepareGame(applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, numericOrder: true, maxChoices, orderMode: 'custom', customOrder: game.questions.map(positionOf).reverse() }))
      assert.deepEqual(plan.questions.map(positionOf), game.questions.map(positionOf).reverse())
      for (const q of plan.questions) {
        assert.equal(q.choices.length, maxChoices)
        assert.ok(q.choices.some(choice => choice.id === game.corrections[q.id].choiceId))
        const ids = q.choices.map(choice => BigInt(choice.id.slice(1)))
        assert.deepEqual(ids, [...ids].sort((a, b) => a < b ? -1 : a > b ? 1 : 0))
      }
    }
    assert.deepEqual(game, before)
  })

  await test('relaunching each geometry template changes the visible measures and preserves its saved source', () => {
    for (const type of families) {
      const page = { ...defaultPage('géométrie'), topic: exerciseTypes.find(entry => entry.id === type).topic, exerciseType: type, count: 2, libreItems: undefined }
      const recipe = { ...base, pages: [page], libreMode: false }, original = structuredClone(recipe)
      let source = createGameSource({ recipe, name: type }, 'saved', type)
      const signatures = new Set()
      for (let draw = 0; draw < 8; draw++) {
        const game = convertRecipe(source.recipe)
        assert.equal(game.issues.length, 0)
        assert.equal(game.questions.length, 2)
        signatures.add(JSON.stringify(game.questions.map(q => [q.prompt, q.figure])))
        source = renewGameSource(source, game.questions.map(positionOf))
      }
      assert.ok(signatures.size > 1, type)
      assert.deepEqual(recipe, original)
    }
  })

  await test('Class stays collective while Solo verdicts and restored checkpoints retain the original geometric givens', async () => {
    const game = prepareGame(gameFor(...examples.slice(0, 3)))
    let state = startSession(game, 'class')
    assert.equal(transition(game, state, { type: 'SELECT', choiceId: game.questions[0].choices[0].id }), state)
    for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL']) state = transition(game, state, { type })
    assert.equal(state.phase, 'revealed')
    state = startSession(game, 'solo')
    for (const [index, kind] of ['correct', 'wrong', 'timeout'].entries()) {
      const q = game.questions[index], correctId = game.corrections[q.id].choiceId
      state = transition(game, state, kind === 'timeout' ? { type: 'TIMEOUT' } : { type: 'SELECT', choiceId: kind === 'correct' ? correctId : q.choices.find(choice => choice.id !== correctId).id })
      assert.equal(state.phase, 'revealed'); assert.equal(state.history.at(-1).correct, kind === 'correct')
      state = transition(game, state, { type: 'NEXT' })
    }
    assert.equal(state.finished, true)
    const record = compactSession(await newRecord(game, 'solo'), state)
    assert.deepEqual(replaySession(game, record, await planIdentity(game), Date.now(), 'solo').state, state)
    assert.deepEqual(game.questions[2].figure.dims, examples[2].dims)
  })

  await test('competition preserves visible measurements and unknown dimensions without exposing a correction before revelation', () => {
    const game = gameFor(...examples), before = structuredClone(game)
    const quiz = parseCompetitionQuiz(competitionQuiz(game, 'https://clairfle.example'))
    assert.equal(quiz.items.length, examples.length)
    for (const [index, item] of quiz.items.entries()) {
      assert.deepEqual(item.question.figure, game.questions[index].figure)
      const ask = item.question.figure.dims.ask
      if (ask) assert.equal(item.question.figure.dims[ask], undefined)
    }
    let room = createCompetition(quiz, { enabled: false, seconds: 30, feedbackSeconds: 5, speedPoints: false }, 'online', 'ABC234', 1000)
    room = competitionStep(room, { type: 'join', avatarId: 'panda' }, 1100)
    room = competitionStep(room, { type: 'start' }, 1200)
    const view = competitionView(room, 1250, 'p1')
    assert.deepEqual(view.question.figure, quiz.items[0].question.figure)
    assert.equal(view.correctChoiceId, undefined)
    assert.equal('answer' in view.question, false)
    room = competitionStep(room, { type: 'answer', playerId: 'p1', questionId: view.question.id, choiceId: quiz.items[0].correctChoiceId }, 1300)
    assert.equal(competitionView(room, 1400, 'p1').self.points, 1000)
    assert.deepEqual(game, before)
  })
} finally { await server.close() }
