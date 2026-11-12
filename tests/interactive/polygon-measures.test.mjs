import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-polygons-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { verifiedGeometry } = await server.ssrLoadModule('/src/interactive/domain/geometry.ts')
  const { exactDecimal, exactExpression, compareExact, scaledDecimal } = await server.ssrLoadModule('/src/interactive/domain/exact-math.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { buildPage, buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS } = await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { createGameSource, renewGameSource } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { positionOf } = await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const base = demoRecipe()
  const families = ['perimetres-triangle', 'perimetres-parallelogramme', 'aires-triangle', 'aires-parallelogramme', 'perimetres-triangle-manquant', 'perimetres-parallelogramme-manquant', 'aires-triangle-manquant', 'aires-parallelogramme-manquant']
  const geo = (figure, dims, prompt, answer) => ({ layout: 'geo', figure, dims, prompt, answer, responseAnswer: answer })
  const examples = [
    geo('triangle', { a: 3, b: 4, c: 5, triangleKind: 'scalene', unit: 'cm' }, 'Calculez le périmètre.', '12 cm'),
    geo('parallelogram', { base: 3.2, side: 4, unit: 'm' }, 'Calculez le périmètre.', '14,4 m'),
    geo('triangle', { base: 3, height: 2.5, unit: 'dm' }, 'Calculez l’aire.', '3,75 dm²'),
    geo('parallelogram', { base: 1.25, height: 0.08, unit: 'km' }, 'Calculez l’aire.', '0,1 km²'),
    geo('triangle', { a: 3, b: 4, ask: 'c', triangleKind: 'scalene', unit: 'cm' }, 'Le périmètre mesure 12 cm. Calculez le côté marqué ?.', '5 cm'),
    geo('parallelogram', { base: 5, ask: 'side', unit: 'cm' }, 'Le périmètre mesure 14 cm. La base mesure 5 cm. Calculez l’autre côté.', '2 cm'),
    geo('triangle', { base: 3, ask: 'height', unit: 'mm' }, 'L’aire mesure 3,75 mm². La base mesure 3 mm. Calculez la hauteur.', '2,5 mm'),
    geo('parallelogram', { base: 1.25, ask: 'height', unit: 'cm' }, 'L’aire mesure 0,1 cm². La base mesure 1,25 cm. Calculez la hauteur.', '0,08 cm'),
  ]
  const numberText = value => value.replace(/\s*(?:mm|cm|dm|dam|hm|km|m)(?:²|2)?$/, '')
  const rationalAnswer = value => exactExpression(numberText(value))
  const gameFor = (...items) => convertRecipe({ ...base, pages: [{ ...defaultPage('géométrie'), topic: 'aires', exerciseType: 'aires-triangle', libreItems: items, count: items.length }] })
  // Independent rational oracle: the printed givens, not the source answer,
  // determine the mathematical target. The game must reject source rounding.
  function expected(item) {
    const d = item.dims, triangle = item.figure === 'triangle', area = item.prompt.includes('aire')
    const given = /mesure (.+?) (?:mm|cm|dm|dam|hm|km|m)/.exec(item.prompt)?.[1]
    let expression
    if (d.ask) expression = area ? `${given}${triangle ? ' × 2' : ''} ÷ ${d.base}`
      : triangle ? `${given} − ${d.a} − ${d.b}` : `${given} ÷ 2 − ${d.base}`
    else expression = area ? `${d.base} × ${d.height}${triangle ? ' ÷ 2' : ''}`
      : triangle ? `${d.a} + ${d.b} + ${d.c}` : `2 × ${d.base} + 2 × ${d.side}`
    return exactExpression(expression)
  }
  function feasible(item) {
    if (item.figure !== 'triangle' || item.prompt.includes('aire')) return true
    const d = item.dims, c = d.c ?? Number(numberText(item.answer).replace(',', '.'))
    const sides = [d.a, d.b, c].map(value => scaledDecimal(exactDecimal(String(value)), 6)).sort((a,b) => a < b ? -1 : a > b ? 1 : 0)
    return sides[0] + sides[1] > sides[2]
  }

  await test('eight polygon families across 2,400 configurations accept exact sources and report rounded or degenerate sources', () => {
    let accepted = 0, rejected = 0
    for (const type of families) for (const difficulty of ['facile','moyen','avance']) for (let seed = 1; seed <= 100; seed++) {
      const config = { ...defaultPage('géométrie'), topic: exerciseTypes.find(entry => entry.id === type).topic, exerciseType: type, difficulty, count: 2, libreItems: undefined }
      const recipe = { ...base, pages: [config], seed, libreMode: false }, original = structuredClone(recipe)
      const items = buildPage(config, seed).blocks.flatMap(block => block.items)
      const paper = seed === 1 ? structuredClone(buildWorksheets(recipe.pages, seed)) : undefined
      const game = convertRecipe(recipe)
      const supported = items.filter(item => compareExact(expected(item), rationalAnswer(item.answer)) === '=' && feasible(item))
      assert.equal(game.questions.length, supported.length, `${type}/${difficulty}/${seed}: ${JSON.stringify(game.issues)}`)
      assert.equal(game.issues.length, items.length - supported.length)
      accepted += supported.length; rejected += items.length - supported.length
      for (const q of game.questions) {
        const item = items[q.source.item], correct = q.choices.find(choice => choice.id === game.corrections[q.id].choiceId)
        assert.equal(compareExact(rationalAnswer(correct.text), expected(item)), '=')
        assert.equal(q.choices.length, 6)
        assert.equal(new Set(q.choices.map(choice => choice.text)).size, 6)
        assert.ok(q.choices.every(choice => choice.text.endsWith(item.answer.match(/\s\S+$/)[0])))
        assert.equal(q.figure.type, item.figure)
        if (item.dims.ask) assert.equal(q.figure.dims[item.dims.ask], undefined)
        assert.equal('answer' in q, false)
        assert.equal(q.source.part, 0)
      }
      assert.deepEqual(recipe, original)
      if (seed === 1) {
        assert.deepEqual(convertRecipe(recipe), game)
        assert.deepEqual(buildWorksheets(recipe.pages, seed), paper)
      }
    }
    assert.ok(accepted > 4000); assert.ok(rejected > 0, 'rounded triangle areas are not treated as exact')
  })

  await test('known decimals, large exact areas and all seven units produce the independently calculated target', () => {
    for (const item of [...examples,
      geo('triangle', { base: 0.001, height: 0.002, unit: 'm' }, 'Calculez l’aire.', '0,000001 m²'),
      geo('parallelogram', { base: 100000001, height: 100000001, unit: 'cm' }, 'Calculez l’aire.', '10000000200000001 cm²'),
    ]) {
      const before = structuredClone(item), result = verifiedGeometry(item)
      assert.ok(result && !result.reason, JSON.stringify(item))
      assert.equal(compareExact(rationalAnswer(result.correctText), expected(item)), '=')
      assert.deepEqual(item,before)
      assert.deepEqual(gameFor(item).issues, [])
    }
    for (const unit of ['mm','cm','dm','m','dam','hm','km']) {
      const item = geo('triangle', { base: 3, height: 2.5, unit }, 'Calculez l’aire.', `3,75 ${unit}²`)
      assert.ok(gameFor(item).questions[0].choices.every(choice => choice.text.endsWith(` ${unit}²`)))
    }
  })

  await test('inverse polygons keep every known measure readable and never copy the target into the public drawing', () => {
    for (const item of examples.slice(4)) {
      const result = verifiedGeometry(item)
      assert.ok(!result.reason)
      assert.equal(result.prompt, item.prompt)
      assert.equal(result.figure.dims.ask, item.dims.ask)
      assert.equal(Object.hasOwn(result.figure.dims,item.dims.ask),false)
      assert.notEqual(result.figure.dims,item.dims)
      for (const key of ['a','b','base']) if (item.dims[key] !== undefined) assert.ok([result.prompt,result.context].filter(Boolean).join(' ').includes(String(item.dims[key]).replace('.',',')))
    }
  })

  await test('invalid triangles, stale keys, conflicting givens, hidden targets and approximate answers are rejected', () => {
    const triangle = examples[0], inverse = examples[6], para = examples[5]
    const invalid = [
      { ...triangle, dims: { ...triangle.dims, c: 7 }, answer: '14 cm', responseAnswer: '14 cm' },
      { ...triangle, dims: { ...triangle.dims, c: 8 }, answer: '15 cm', responseAnswer: '15 cm' },
      { ...triangle, answer: '13 cm' }, { ...triangle, responseAnswer: '13 cm' },
      { ...triangle, dims: { ...triangle.dims, triangleKind: 'right' } },
      { ...triangle, dims: { ...triangle.dims, height: 2 } },
      { ...triangle, dims: { ...triangle.dims, unit: 'inch' } },
      { ...triangle, dims: { ...triangle.dims, bare: true } },
      ...[0,-1,Infinity,NaN,1e9+1,0.1234567].map(a => ({ ...triangle, dims: { ...triangle.dims,a } })),
      { ...inverse, dims: { ...inverse.dims, height: 2.5 } },
      { ...inverse, dims: { ...inverse.dims, ask: 'base' } },
      { ...inverse, prompt: inverse.prompt.replace('3 mm','4 mm') },
      { ...inverse, prompt: inverse.prompt.replace('mm²','cm²') },
      { ...inverse, prompt: inverse.prompt + ' Puis doublez.' },
      { ...para, prompt: para.prompt.replace('5 cm','6 cm') },
      geo('triangle', { a: 3, b: 4, ask: 'c', unit: 'cm' }, 'Le périmètre mesure 14 cm. Calculez le côté marqué ?.', '7 cm'),
      geo('triangle', { base: 1.3, height: 1.3, unit: 'cm' }, 'Calculez l’aire.', '0,85 cm²'),
      geo('triangle', { base: 1.3, ask: 'height', unit: 'cm' }, 'L’aire mesure 0,85 cm². La base mesure 1,3 cm. Calculez la hauteur.', '1,3 cm'),
      geo('parallelogram', { base: 3, ask: 'height', unit: 'cm' }, 'L’aire mesure 1 cm². La base mesure 3 cm. Calculez la hauteur.', '0,333333 cm'),
      geo('parallelogram', { base: 8, ask: 'side', unit: 'cm' }, 'Le périmètre mesure 14 cm. La base mesure 8 cm. Calculez l’autre côté.', '1 cm'),
    ]
    for (const item of invalid) {
      const original = structuredClone(item)
      assert.ok(verifiedGeometry(item)?.reason, JSON.stringify(item))
      if (Number.isFinite(item.dims.a ?? 1)) {
        const game = gameFor(item)
        assert.equal(game.questions.length, 0)
        assert.ok(game.issues.length)
      } else assert.throws(() => gameFor(item), /nombre invalide/)
      assert.deepEqual(item,original)
    }
  })

  await test('numeric sorting, caps and custom order retain the exact key and the source position', () => {
    const game = gameFor(...examples), original = structuredClone(game)
    for (const maxChoices of [2,3,4,5,6]) {
      const plan = prepareGame(applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, maxChoices, numericOrder: true, orderMode: 'custom', customOrder: game.questions.map(positionOf).reverse() }))
      assert.deepEqual(plan.questions.map(positionOf),game.questions.map(positionOf).reverse())
      for (const q of plan.questions) {
        assert.equal(q.choices.length,maxChoices)
        assert.ok(q.choices.some(choice => choice.id === game.corrections[q.id].choiceId))
        const numbers = q.choices.map(choice => rationalAnswer(choice.text))
        for (let index = 1; index < numbers.length; index++) assert.equal(compareExact(numbers[index-1],numbers[index]), '<')
      }
    }
    assert.deepEqual(game,original)
  })

  await test('new polygon draws preserve the saved template and the printed worksheet', () => {
    for (const type of families) {
      const page = { ...defaultPage('géométrie'), topic: exerciseTypes.find(entry => entry.id === type).topic, exerciseType: type, difficulty: 'moyen', count: 2, libreItems: undefined }
      const recipe = { ...base, pages: [page], libreMode: false }, original = structuredClone(recipe)
      let source = createGameSource({recipe,name:type},'saved',type)
      const signatures = new Set()
      for (let draw = 0; draw < 5; draw++) {
        const game = convertRecipe(source.recipe)
        assert.equal(game.questions.length,2)
        signatures.add(JSON.stringify(game.questions.map(q => [q.prompt,q.figure])))
        source = renewGameSource(source,game.questions.map(positionOf))
      }
      assert.ok(signatures.size > 1,type)
      assert.deepEqual(recipe,original)
    }
  })

  await test('Class remains collective; Solo and durable replay preserve polygon corrections and hidden heights', async () => {
    const game = prepareGame(gameFor(...examples.slice(4,7)))
    let state = startSession(game,'class')
    assert.equal(transition(game,state,{type:'SELECT',choiceId:game.questions[0].choices[0].id}),state)
    state = startSession(game,'solo')
    for (const [index,kind] of ['correct','wrong','timeout'].entries()) {
      const q = game.questions[index], correctId = game.corrections[q.id].choiceId
      state = transition(game,state,kind === 'timeout' ? {type:'TIMEOUT'} : {type:'SELECT',choiceId:kind === 'correct' ? correctId : q.choices.find(choice => choice.id !== correctId).id})
      assert.equal(state.phase,'revealed'); assert.equal(state.history.at(-1).correct,kind === 'correct')
      state = transition(game,state,{type:'NEXT'})
    }
    assert.equal(state.finished,true)
    const record = compactSession(await newRecord(game,'solo'),state)
    assert.deepEqual(replaySession(game,record,await planIdentity(game),Date.now(),'solo').state,state)
  })

  await test('polygon figures survive competition transport without exposing a key or a hidden dimension before correction', () => {
    const game = gameFor(...examples.slice(4)), original = structuredClone(game)
    const quiz = parseCompetitionQuiz(competitionQuiz(game,'https://clairfle.example'))
    for (const [index,item] of quiz.items.entries()) {
      assert.deepEqual(item.question.figure,game.questions[index].figure)
      assert.equal(item.question.figure.dims[item.question.figure.dims.ask],undefined)
    }
    let room = createCompetition(quiz,{enabled:false,seconds:30,feedbackSeconds:1,speedPoints:false},'online','ABC234',1000)
    room = competitionStep(room,{type:'join',avatarId:'panda'},1100)
    room = competitionStep(room,{type:'start'},1200)
    const view = competitionView(room,1250,'p1')
    assert.deepEqual(view.question.figure,quiz.items[0].question.figure)
    assert.equal(view.correctChoiceId,undefined)
    assert.equal('answer' in view.question,false)
    assert.deepEqual(game,original)
  })
} finally { await server.close() }
