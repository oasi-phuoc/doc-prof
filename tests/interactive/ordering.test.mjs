import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-ordering-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { adaptOrdering } = await server.ssrLoadModule('/src/interactive/domain/ordering.ts')
  const { adaptSourceItem } = await server.ssrLoadModule('/src/interactive/domain/source-adapters.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { buildPage, buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS } = await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { positionOf } = await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const { exactDecimal, scaledDecimal } = await server.ssrLoadModule('/src/interactive/domain/exact-math.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { createGameSource, renewGameSource } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const base = demoRecipe(), seedFor = (part) => 12345 + part
  const source = { layout: 'order', sequence: ['34', '24', '6', '68', '76', '19', '7'], placeParts: ['6', '7', '19', '24', '34', '68', '76'], orderOp: '<', prompt: 'Du plus petit au plus grand :', answer: '6 < 7 < 19 < 24 < 34 < 68 < 76' }
  const alphabet = { layout: 'order', sequence: ['T', 'H', 'B', 'Q', 'S'], placeParts: ['B', 'H', 'Q', 'S', 'T'], orderOp: '<', prompt: 'Classez ces lettres par ordre alphabétique.', answer: 'B H Q S T' }
  const phrase = { layout: 'order', sequence: ['le', 'chat', 'voit', 'Le', 'chien'], placeParts: ['Le', 'chat', 'voit', 'le', 'chien'], prompt: 'Remettez la phrase en ordre.', answer: 'Le chat voit le chien' }
  const gameFor = (...items) => convertRecipe({ ...base, pages: [{ ...base.pages[0], count: items.length, extraBlocks: undefined, libreItems: items }] })
  const numericTypes = [['tpm', 'tpm-ranger'], ['algèbre', 'nombres-ranger'], ['tcm-csc', 'tcm-csc-ex06'], ['tcm-cfr', 'tcm-cfr-ex03']]
  const generatedNumber = (text) => Number(text.replace(/['’\s]/g, '').replace(',', '.'))

  await test('four numeric and one alphabetic type preserve valid ranks across 100 seeds and three levels; strict duplicate lists are rejected', () => {
    for (const [domain, type] of [...numericTypes, ['alphabetisation', 'alpha-alphabet-alphabet-ordre']]) for (const difficulty of ['facile', 'moyen', 'difficile']) for (let seed = 1; seed <= 100; seed++) {
      const config = { ...defaultPage(domain), topic: exerciseTypes.find((entry) => entry.id === type).topic, exerciseType: type, difficulty, count: 2, libreItems: undefined }
      const recipe = { ...base, pages: [config], seed, libreMode: false }, before = structuredClone(recipe)
      const items = buildPage(config, seed).blocks.flatMap((block) => block.items)
      const paper = seed === 1 ? structuredClone(buildWorksheets(recipe.pages, seed)) : undefined
      const game = convertRecipe(recipe)
      const invalid = domain === 'alphabetisation' ? [] : items.filter((item) => new Set(item.sequence.map(generatedNumber)).size !== item.sequence.length)
      assert.equal(game.questions.length, items.filter((item) => !invalid.includes(item)).reduce((n, item) => n + item.sequence.length, 0), `${type}/${difficulty}/${seed}: ${JSON.stringify(game.issues)}`)
      assert.equal(game.issues.length, invalid.length)
      assert.ok(game.issues.every((issue) => /répète un même nombre/.test(issue.reason)))
      for (const q of game.questions) {
        const item = items[q.source.item], correct = q.choices.find((choice) => choice.id === game.corrections[q.id].choiceId)
        assert.ok(item.sequence.includes(correct.text)); assert.equal(q.compatibility, 'auto')
        assert.equal(domain === 'alphabetisation' ? correct.text.toUpperCase() : generatedNumber(correct.text), domain === 'alphabetisation' ? item.placeParts[q.source.part].toUpperCase() : generatedNumber(item.placeParts[q.source.part]))
        assert.equal(new Set(q.choices.map((choice) => choice.id)).size, q.choices.length)
        assert.ok(q.choices.every((choice) => item.sequence.includes(choice.text)))
        assert.ok(item.sequence.every((term) => q.context.includes(term)))
        assert.equal('correct' in q, false); assert.equal('answer' in q, false)
      }
      assert.deepEqual(recipe, before)
      if (seed === 1) { assert.deepEqual(convertRecipe(recipe), game); assert.deepEqual(buildWorksheets(recipe.pages, seed), paper) }
    }
  })

  await test('all fifteen sentence families keep source words and human models, while long phrases remain explicitly unsupported', () => {
    const types = exerciseTypes.filter((entry) => entry.id.startsWith('alpha-phrase-') && entry.id.endsWith('-ordre-phrases'))
    assert.equal(types.length, 15)
    for (const type of types) for (const difficulty of ['facile', 'moyen', 'difficile']) for (let seed = 1; seed <= 100; seed++) {
      const config = { ...defaultPage('alphabetisation'), topic: type.topic, exerciseType: type.id, difficulty, count: 2, libreItems: undefined }
      const recipe = { ...base, pages: [config], seed, libreMode: false }, original = structuredClone(recipe)
      const items = buildPage(config, seed).blocks.flatMap((block) => block.items), game = convertRecipe(recipe)
      const playable = items.filter((item) => item.sequence.length >= 2 && item.sequence.length <= 6)
      assert.equal(game.questions.length, playable.length, `${type.id}/${seed}: ${JSON.stringify(game.issues)}`)
      for (const q of game.questions) {
        const item = items[q.source.item]
        assert.equal(q.mode, 'sequence'); assert.equal(q.compatibility, 'teacher-led')
        assert.deepEqual([...q.words].sort(), [...item.sequence].sort()); assert.equal(q.words.length, item.sequence.length)
        assert.equal(game.corrections[q.id].text, item.answer); assert.equal(game.corrections[q.id].choiceId, undefined)
        assert.notEqual(q.words.join(' '), item.answer)
      }
      if (items.some((item) => item.sequence.length > 6)) assert.ok(game.issues.some((issue) => /deux à six/.test(issue.reason)))
      assert.deepEqual(recipe, original)
    }
  })

  await test('decimal trailing zeroes, negative numbers and large integers retain their exact source order', () => {
    for (const item of [
      { ...source, sequence: ['5,79', '5,07', '5,48', '5,5', '5,4'], placeParts: ['5,79', '5,5', '5,48', '5,40', '5,07'], orderOp: '>', prompt: 'Du plus grand au plus petit :', answer: '5,79 > 5,5 > 5,48 > 5,4 > 5,07' },
      { ...source, sequence: ["9’007’199’254’740’993", '-2', '0,01', '9007199254740992'], placeParts: ['-2', '0,0100', '9007199254740992', '9007199254740993'], answer: '-2 < 0,01 < 9007199254740992 < 9007199254740993' },
    ]) {
      const original = structuredClone(item), result = adaptOrdering(item, seedFor)
      assert.deepEqual(result.issues, []); assert.equal(result.items.length, item.sequence.length)
      for (const [position, q] of result.items.entries()) {
        const a = exactDecimal(q.choices.find((choice) => choice.id === q.correctId).text), b = exactDecimal(item.placeParts[position])
        assert.equal(scaledDecimal(a, Math.max(a.precision, b.precision)), scaledDecimal(b, Math.max(a.precision, b.precision)))
        assert.equal(q.part, position)
      }
      assert.deepEqual(item, original)
    }
  })

  await test('missing elements, duplicate values, contradictory directions and stale printed keys cannot manufacture a ranking', () => {
    for (const invalid of [
      { ...source, orderOp: undefined }, { ...source, orderOp: '>' }, { ...source, prompt: 'Du plus grand au plus petit :' },
      { ...source, answer: '6 < 7 < 19 < 24 < 34 < 76 < 68' }, { ...source, placeParts: source.placeParts.slice(1) },
      { ...source, answer: source.answer.replace('<', '>') }, { ...source, sequence: ['0', '-0'], placeParts: ['0', '-0'], answer: '0 < -0' },
      { ...source, sequence: ['0,1', '0,10'], placeParts: ['0,1', '0,10'], answer: '0,1 < 0,10' },
      { ...source, sequence: ['1', 'word', '2'] }, { ...source, sequence: ['1/0', '1', '2'] },
      { ...alphabet, sequence: ['A', 'a'], placeParts: ['A', 'a'], answer: 'A a' },
      { ...alphabet, answer: 'H B Q S T' }, { ...alphabet, orderOp: '>' }, { ...alphabet, sequence: ['É', 'A'] },
      { ...source, sequence: Array(13).fill('1') },
    ]) { const result = adaptOrdering(invalid, seedFor); assert.ok(result, JSON.stringify(invalid)); assert.equal(result.items.length, 0); assert.ok(result.issues.length) }
    assert.equal(adaptSourceItem({ ...phrase, prompt: 'Rangez les animaux du plus petit au plus grand.' }, 'custom').items.length, 0)
    assert.equal(adaptSourceItem({ ...phrase, placeParts: ['wrong'], answer: 'wrong' }, 'custom').items.length, 0)
  })

  await test('each seven-number question keeps six source choices including its own key and shows the complete unordered list', () => {
    const signatures = new Set()
    for (let seed = 1; seed <= 100; seed++) for (const q of adaptOrdering(source, (part) => seed + part).items) {
      assert.equal(q.choices.length, 6); assert.equal(q.choices.filter((choice) => choice.id === q.correctId).length, 1)
      assert.ok(q.choices.every((choice) => source.sequence.includes(choice.text)))
      assert.ok(source.sequence.every((term) => q.context.includes(term)))
      assert.ok(!q.context.includes(source.answer)); signatures.add(JSON.stringify(q.choices))
    }
    assert.ok(signatures.size > 1)
    assert.deepEqual(adaptOrdering(source, seedFor), adaptOrdering(source, seedFor))
    assert.deepEqual(adaptOrdering(alphabet, seedFor).items.map((q) => q.choices.find((choice) => choice.id === q.correctId).text), ['B', 'H', 'Q', 'S', 'T'])
  })

  await test('question positions, numeric order and reduced card counts retain every verified key without changing the worksheet', () => {
    const game = gameFor(source), original = structuredClone(game)
    assert.deepEqual(game.questions.map(positionOf), source.sequence.map((_, i) => `0:0:0:${i}`))
    for (const maxChoices of [2, 3, 4, 5, 6]) {
      const plan = prepareGame(applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, numericOrder: true, maxChoices, orderMode: 'custom', customOrder: game.questions.map(positionOf).reverse() }))
      assert.deepEqual(plan.questions.map(positionOf), game.questions.map(positionOf).reverse())
      for (const q of plan.questions) {
        assert.equal(q.choices.length, maxChoices); assert.ok(q.choices.some((choice) => choice.id === game.corrections[q.id].choiceId))
        const values = q.choices.map((choice) => BigInt(choice.id.slice(1)))
        assert.deepEqual(values, [...values].sort((a, b) => a < b ? -1 : a > b ? 1 : 0))
      }
    }
    assert.deepEqual(game, original)
  })

  await test('new saved-template runs change numbers or letters, preserve original recipes and keep all source ranks selectable', () => {
    for (const [domain, type] of [...numericTypes, ['alphabetisation', 'alpha-alphabet-alphabet-ordre']]) {
      const page = { ...defaultPage(domain), topic: exerciseTypes.find((entry) => entry.id === type).topic, exerciseType: type, count: 2, libreItems: undefined }
      const recipe = { ...base, pages: [page], libreMode: false }, original = structuredClone(recipe)
      let source = createGameSource({ recipe, name: type }, 'saved', type)
      const variants = new Set()
      for (let run = 0; run < 8; run++) { const game = convertRecipe(source.recipe); assert.ok(game.issues.every((issue) => /répète un même nombre/.test(issue.reason))); if (game.questions.length) variants.add(game.questions[0].context); source = renewGameSource(source, game.questions.map(positionOf)) }
      assert.ok(variants.size > 1, type); assert.deepEqual(recipe, original)
    }
  })

  await test('Class stays collective, Solo grades ranks, and checkpoints preserve word moves without inventing a language verdict', async () => {
    const game = prepareGame(gameFor(source, alphabet, phrase))
    let state = startSession(game, 'class')
    assert.equal(transition(game, state, { type: 'SELECT', choiceId: game.questions[0].choices[0].id }), state)
    for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL']) state = transition(game, state, { type })
    assert.equal(state.phase, 'revealed')
    state = startSession(game, 'solo')
    for (const [index, kind] of ['correct', 'wrong', 'timeout'].entries()) {
      const q = game.questions[index], correctId = game.corrections[q.id].choiceId
      state = transition(game, state, kind === 'timeout' ? { type: 'TIMEOUT' } : { type: 'SELECT', choiceId: kind === 'correct' ? correctId : q.choices.find((choice) => choice.id !== correctId).id })
      assert.equal(state.history.at(-1).correct, kind === 'correct'); state = transition(game, state, { type: 'NEXT' })
    }
    const saved = compactSession(await newRecord(game, 'solo'), state)
    assert.deepEqual(replaySession(game, saved, await planIdentity(game), Date.now(), 'solo').state, state)
    const guided = prepareGame(gameFor(phrase)), q = guided.questions[0]
    state = transition(guided, startSession(guided, 'class'), { type: 'IMAGE_ORDER_SET', questionId: q.id, order: [3, 1, 2, 0, 4] })
    for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL']) state = transition(guided, state, { type })
    assert.equal(state.history.at(-1).correct, undefined)
    assert.equal(q.mode, 'sequence'); assert.equal(guided.corrections[q.id].choiceId, undefined)
  })

  await test('competition sends the original unordered list and question rank while keeping the verified ranking private', () => {
    const quiz = parseCompetitionQuiz(competitionQuiz(gameFor(source, alphabet, phrase), 'https://clairfle.example'))
    assert.equal(quiz.items.length, 12)
    let room = createCompetition(quiz, { enabled: false, seconds: 30, feedbackSeconds: 5, speedPoints: false }, 'online', 'ABC234', 1000)
    room = competitionStep(room, { type: 'join', avatarId: 'panda' }, 1100); room = competitionStep(room, { type: 'start' }, 1200)
    const view = competitionView(room, 1250, 'p1')
    assert.equal(view.correctChoiceId, undefined); assert.ok(source.sequence.every((term) => view.question.context.includes(term)))
    assert.ok(!JSON.stringify(view).includes(source.answer)); assert.equal(view.question.choices.length, 6)
    room = competitionStep(room, { type: 'answer', playerId: 'p1', questionId: view.question.id, choiceId: quiz.items[0].correctChoiceId }, 1300)
    assert.equal(competitionView(room, 1400, 'p1').self.points, 1000)
  })
} finally { await server.close() }
