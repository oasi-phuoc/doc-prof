import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: { port: 0 } }, appType: 'custom' })
try {
  const { exactDecimal, exactExpression, compareExact, formatDecimal, scaledDecimal } = await server.ssrLoadModule('/src/interactive/domain/exact-math.ts')
  const { adaptNumeracy } = await server.ssrLoadModule('/src/interactive/domain/numeracy.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { buildPage, buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS } = await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const base = demoRecipe()
  const seedFor = (part) => 12345 + part
  const sequence = { layout: 'sequence', sequence: ['0,05', '0,4', '0,75', '1,1', '1,45', '1,8'], blankIndexes: [0, 1, 4, 5], answer: '0,05 ; 0,4 ; 1,45 ; 1,8' }
  const gameFor = (...items) => convertRecipe({ ...base, pages: [{ ...base.pages[0], libreItems: items }] })
  const compare = (left, right, answer) => ({ layout: 'compare', left, right, answer })

  await test('exact school arithmetic handles decimals, fractions, signs, precedence and large integers without rounding', () => {
    for (const [left, right, expected] of [['0,1 + 0,2', '0,3', '='], ['1/3', '0,333333', '>'], ['1/-3', '-0,3', '<'], ['-2 × -3 + 1', '2 + 5', '='], ['2 + 3 * 4', '14', '='], ['12 ÷ 3 - 5', '−1', '='], ["9'007'199'254'740'993", '9007199254740992', '>'], ['1 234,05', '1’234,05', '='], ['1\u202f234\u202f567', '1234567', '=']]) {
      assert.equal(compareExact(exactExpression(left), exactExpression(right)), expected, `${left} / ${right}`)
    }
    for (const input of ['', '1/0', 'Infinity', '1e9', '2**3', '(2+3)', '1+alert(1)', '1,2345678', "12'34", "1’234'567", '1 23', '1.2.3', '1+'.repeat(18) + '1', '9'.repeat(19)]) assert.equal(exactExpression(input), null, input)
    assert.deepEqual(exactDecimal('−0,2500'), { units: -2500n, precision: 4 })
    for (const value of [-12345678901234567890n, -1n, 0n, 2500n]) assert.equal(scaledDecimal(exactDecimal(formatDecimal(value, 4)), 4), value)
  })

  await test('comparison answers are recomputed and inconsistent or unsupported edits are rejected', () => {
    const input = compare('1/3', '0,3', '>'), original = structuredClone(input)
    const result = adaptNumeracy(input, seedFor)
    assert.equal(result.items.length, 1)
    assert.deepEqual(result.items[0].choices.map((choice) => choice.text), ['<', '=', '>'])
    assert.equal(result.items[0].choices.find((choice) => choice.id === result.items[0].correctId).text, '>')
    assert.equal(result.items[0].prompt, 'Compare : 1/3 □ 0,3')
    assert.equal(result.items[0].compatibility, 'auto')
    for (const invalid of [{ ...input, answer: '<' }, { ...input, answer: ' > ' }, { ...input, left: '1/0' }, { ...input, left: '(2 + 3)' }, { ...input, right: undefined }]) assert.equal(adaptNumeracy(invalid, seedFor).items.length, 0)
    assert.deepEqual(input, original)
  })

  await test('each sequence blank has its own stable source position, all missing terms remain private', () => {
    const original = structuredClone(sequence), result = adaptNumeracy(sequence, seedFor)
    assert.equal(result.items.length, 4)
    assert.deepEqual(result.items.map((q) => q.part), [0, 1, 4, 5])
    for (const [index, q] of result.items.entries()) {
      assert.deepEqual(q.numberSequence.terms, [null, null, '0,75', '1,1', null, null])
      assert.equal(q.numberSequence.target, q.part)
      assert.equal(q.choices.length, 6)
      assert.equal(new Set(q.choices.map((c) => c.id)).size, 6)
      assert.equal(q.choices.find((c) => c.id === q.correctId).text, sequence.answer.split(' ; ')[index])
      assert.equal(q.compatibility, 'assisted')
    }
    assert.deepEqual(sequence, original)
    const literal = { layout: 'sequence', sequence: ['17', '□', '29', '□', '□', '47', '53', '59'], blankIndexes: [1, 3, 4], answer: '23 ; 35 ; 41' }
    assert.deepEqual(adaptNumeracy(literal, seedFor).items.map((q) => q.part), [1, 3, 4])
    const descending = { layout: 'sequence', sequence: ['3', '2,50', '2', '1,50', '1'], blankIndexes: [1, 3], answer: '2,5 ; 1,5', prompt: 'Aide : −0,5' }
    assert.equal(adaptNumeracy(descending, seedFor).items.length, 2)
    assert.equal(adaptNumeracy(descending, seedFor).items[0].numberSequence.hint, 'Aide : −0,5')
  })

  await test('non-arithmetic sequences, contradictory hints, stale corrections and malformed masks never manufacture an answer', () => {
    const invalid = [
      { ...sequence, answer: '0,06 ; 0,4 ; 1,45 ; 1,8' },
      { ...sequence, answer: '0,05;0,4;1,45;1,8' },
      { ...sequence, sequence: ['0,05', '0,4', '0,75', '1,2', '1,45', '1,8'] },
      { ...sequence, blankIndexes: [0, 0, 4, 5] }, { ...sequence, blankIndexes: [-1] }, { ...sequence, blankIndexes: [99] },
      { ...sequence, blankIndexes: [0, 1, 2, 3, 4] }, { ...sequence, sequence: ['□', '□', '□'] },
      { ...sequence, prompt: 'Aide : +0,5' }, { ...sequence, prompt: 'La réponse est 1,45.' },
      { ...sequence, sequence: ['1', '2', '4', '8'], blankIndexes: [2], answer: '4' },
    ]
    for (const item of invalid) { const adapted = adaptNumeracy(item, seedFor); assert.equal(adapted.items.length, 0, JSON.stringify(item)); assert.ok(adapted.issues.length) }
  })

  await test('all sixteen real catalogue types work across 100 seeds at all three difficulty levels', () => {
    const families = [
      ['tpm', 'tpm-comparer'], ['tpm', 'tpm-suite'], ['tpm', 'tpm-grandes-suites'], ['tpm', 'tpm-suites-6'],
      ...['nombres-comparer', 'nombres-suite', 'addition-comparer', 'soustraction-comparer', 'fractions-comparer', 'decimaux-comparer', 'relatifs-comparer'].map((type) => ['algèbre', type]),
      ...['tcm-csc-ex04', 'tcm-csc-ex05', 'tcm-csc-ex07', 'tcm-csc-ex08'].map((type) => ['tcm-csc', type]), ['tcm-cfr', 'tcm-cfr-ex04'],
    ]
    for (const [domain, type] of families) for (const difficulty of ['facile', 'moyen', 'difficile']) for (let seed = 1; seed <= 100; seed++) {
      const config = { ...defaultPage(domain), topic: exerciseTypes.find((entry) => entry.id === type).topic, exerciseType: type, difficulty, count: 6, libreItems: undefined }
      const recipe = { ...base, pages: [config], seed, libreMode: false }
      const items = buildPage(config, seed).blocks.flatMap((block) => block.items)
      const expected = items.reduce((total, item) => total + (item.layout === 'compare' ? 1 : item.blankIndexes.length), 0)
      const paper = seed === 1 ? structuredClone(buildWorksheets(recipe.pages, seed)) : undefined
      const source = seed === 1 ? structuredClone(recipe) : undefined
      const game = convertRecipe(recipe)
      assert.equal(game.questions.length, expected, `${type}/${difficulty}/${seed}: ${JSON.stringify(game.issues)}`)
      assert.deepEqual(game.issues, [])
      for (const q of game.questions) {
        assert.equal(q.choices.filter((choice) => choice.id === game.corrections[q.id].choiceId).length, 1)
        assert.equal(new Set(q.choices.map((choice) => choice.id)).size, q.choices.length)
        if (q.numberSequence) assert.equal(q.numberSequence.terms[q.source.part], null)
      }
      if (seed === 1) {
        assert.deepEqual(convertRecipe(recipe), game)
        prepareGame(game)
        assert.deepEqual(recipe, source)
        assert.deepEqual(buildWorksheets(recipe.pages, seed), paper)
      }
    }
  })

  await test('decimal choices sort exactly, retain the key with fewer choices and do not mutate the source game', () => {
    const game = gameFor(sequence), original = structuredClone(game)
    for (const maxChoices of [2, 3, 4, 5, 6]) {
      const plan = prepareGame(applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, numericOrder: true, maxChoices }))
      for (const q of plan.questions) {
        assert.equal(q.choices.length, maxChoices)
        assert.ok(q.choices.some((c) => c.id === game.corrections[q.id].choiceId))
        const values = q.choices.map((c) => exactExpression(c.text))
        for (let i = 1; i < values.length; i++) assert.equal(compareExact(values[i - 1], values[i]), '<')
        assert.deepEqual(q.numberSequence, game.questions.find((source) => source.id === q.id).numberSequence)
      }
    }
    assert.deepEqual(game, original)
  })

  await test('class and solo reuse existing verdicts, navigation, source masks and durable checkpoints', async () => {
    const game = prepareGame(gameFor(sequence))
    let state = startSession(game, 'class')
    assert.equal(transition(game, state, { type: 'SELECT', choiceId: game.questions[0].choices[0].id }), state)
    for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL']) state = transition(game, state, { type })
    assert.equal(state.phase, 'revealed')
    state = startSession(game, 'solo')
    for (const [index, kind] of ['correct', 'wrong', 'timeout'].entries()) {
      const q = game.questions[index], choiceId = kind === 'correct' ? game.corrections[q.id].choiceId : q.choices.find((c) => c.id !== game.corrections[q.id].choiceId).id
      state = transition(game, state, kind === 'timeout' ? { type: 'TIMEOUT' } : { type: 'SELECT', choiceId })
      assert.equal(state.phase, 'revealed')
      assert.equal(state.history.at(-1).correct, kind === 'correct')
      state = transition(game, state, { type: 'NEXT' })
    }
    const saved = compactSession(await newRecord(game, 'solo'), state)
    assert.deepEqual(replaySession(game, saved, await planIdentity(game), Date.now(), 'solo').state, state)
    assert.ok(game.questions.every((q) => q.numberSequence.terms[q.numberSequence.target] === null))
  })

  await test('competition transports only the masked sequence and exposes its answer solely in correction', () => {
    const game = gameFor(sequence), quiz = competitionQuiz(game, 'https://clairfle.example')
    quiz.items[0].question.numberSequence.solution = 'injected'
    const parsed = parseCompetitionQuiz(quiz)
    assert.equal(parsed.items[0].question.numberSequence.solution, undefined)
    assert.deepEqual(parsed.items[0].question.numberSequence.terms, [null, null, '0,75', '1,1', null, null])
    for (const invalid of [{ target: 2 }, { terms: [null, null, null] }, { target: -1 }, { terms: ['1', '2', 'visible answer'] }, { hint: 'x'.repeat(161) }, { target: 0.5 }]) {
      const broken = structuredClone(quiz); Object.assign(broken.items[0].question.numberSequence, invalid)
      assert.throws(() => parseCompetitionQuiz(broken), /Suite numérique invalide/)
    }
    let room = createCompetition(parsed, { enabled: false, seconds: 30, feedbackSeconds: 5, speedPoints: false }, 'online', 'ABC234', 1000)
    room = competitionStep(room, { type: 'join', avatarId: 'panda' }, 1100)
    room = competitionStep(room, { type: 'start' }, 1200)
    let view = competitionView(room, 1250, 'p1')
    assert.equal(view.correctChoiceId, undefined)
    assert.equal(view.question.numberSequence.terms[0], null)
    room = competitionStep(room, { type: 'answer', playerId: 'p1', questionId: view.question.id, choiceId: parsed.items[0].correctChoiceId }, 1300)
    view = competitionView(room, 1400, 'p1')
    assert.equal(view.phase, 'correction'); assert.equal(view.self.correct, true)
    assert.equal(view.question.numberSequence.terms[0], null)
  })
} finally { await server.close() }
