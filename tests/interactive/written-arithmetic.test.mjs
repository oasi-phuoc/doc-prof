import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-written-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { verifiedWrittenArithmetic } = await server.ssrLoadModule('/src/interactive/domain/written-arithmetic.ts')
  const { decimalChoices } = await server.ssrLoadModule('/src/interactive/domain/decimal-choices.ts')
  const { exactDecimal, scaledDecimal } = await server.ssrLoadModule('/src/interactive/domain/exact-math.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { buildPage, buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS } = await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { createGameSource, renewGameSource } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const base = demoRecipe()
  const inline = (a, op, b, answer, other = {}) => ({ layout: 'inline', a, op, b, answer, ...other })
  const gameFor = (...items) => convertRecipe({ ...base, pages: [{ ...base.pages[0], count: items.length, extraBlocks: undefined, libreItems: items }] })
  const answerValue = (text) => exactDecimal(text.replace(/^\((.*)\)$/, '$1'))
  const same = (a, b) => scaledDecimal(a, Math.max(a.precision, b.precision)) === scaledDecimal(b, Math.max(a.precision, b.precision))
  const families = [
    ...['tpm-operations', 'tpm-quatre-ops', 'tpm-ops-decimales', 'tpm-relatifs-ops'].map((type) => ['tpm', type]),
    ...['addition-trou', 'soustraction-trou', 'multiplication-trou', 'division-ligne', 'division-trou', 'decimaux-add-colonne', 'decimaux-sub-colonne', 'decimaux-mul-colonne'].map((type) => ['algèbre', type]),
  ]

  await test('the twelve extended catalogue types preserve their exact worksheet answers across 100 seeds and all three levels', () => {
    for (const [domain, type] of families) for (const difficulty of ['facile', 'moyen', 'difficile']) for (let seed = 1; seed <= 100; seed++) {
      const config = { ...defaultPage(domain), topic: exerciseTypes.find((entry) => entry.id === type).topic, exerciseType: type, difficulty, count: 12, libreItems: undefined }
      const recipe = { ...base, pages: [config], seed, libreMode: false }
      const items = buildPage(config, seed).blocks.flatMap((block) => block.items)
      const paper = seed === 1 ? structuredClone(buildWorksheets(recipe.pages, seed)) : undefined, original = structuredClone(recipe)
      const game = convertRecipe(recipe)
      assert.equal(game.questions.length, items.length, `${type}/${difficulty}/${seed}: ${JSON.stringify(game.issues)}`)
      assert.deepEqual(game.issues, [])
      for (const [index, q] of game.questions.entries()) {
        const key = game.corrections[q.id], correct = q.choices.find((choice) => choice.id === key.choiceId)
        assert.ok(same(answerValue(correct.text), answerValue(items[index].answer)), type)
        const numbers = q.choices.map((choice) => answerValue(choice.text))
        assert.ok(numbers.every(Boolean), type)
        const precision = Math.max(...numbers.map((number) => number.precision))
        assert.equal(new Set(numbers.map((number) => String(scaledDecimal(number, precision)))).size, numbers.length)
        assert.ok(q.choices.length >= 2 && q.choices.length <= 6)
        assert.equal('answer' in q, false); assert.equal('correct' in q, false)
      }
      assert.deepEqual(recipe, original)
      if (seed === 1) { assert.deepEqual(convertRecipe(recipe), game); assert.deepEqual(buildWorksheets(recipe.pages, seed), paper) }
    }
  })

  await test('addition, subtraction, multiplication and division keep exactly one blank in its source position', () => {
    for (const [a, op, b, result] of [[12, '+', 4, 16], [12, '−', 4, 8], [12, '×', 4, 48], [12, '÷', 4, 3]]) for (const missing of ['a', 'b', 'result']) {
      const answer = String(missing === 'a' ? a : missing === 'b' ? b : result)
      const prompt = `${missing === 'a' ? '□' : a} ${op} ${missing === 'b' ? '□' : b} = ${missing === 'result' ? '□' : result}`
      const item = inline(a, op, b, answer, { missing, prompt, result }), original = structuredClone(item)
      const verified = verifiedWrittenArithmetic(item)
      assert.equal(verified.prompt, prompt); assert.equal(verified.correctText, answer)
      assert.equal(verified.prompt.split('□').length, 2)
      assert.deepEqual(item, original)
      const q = gameFor(item).questions[0]
      if (missing !== 'result' || op === '÷') { assert.equal(q.prompt, prompt); assert.equal(q.choices.length, 6) }
    }
  })

  await test('decimal products, finite quotients and signed numbers are checked without floating-point approximations', () => {
    for (const item of [
      inline(0.1, '+', 0.2, '0,3', { prompt: '0,1 + 0,2 = □' }),
      inline(4.01, '×', 3.6, '14,436'), inline(1, '÷', 8, '0,125'), inline(-1, '÷', 8, '(−0,125)'),
      inline(0.1, '÷', 0.2, '0,5'), inline(3, '÷', 0.4, '7,5'),
      inline(61, '+', -28, '(+33)', { prompt: '(+61) + (−28) =', labels: ['relatif'] }),
      inline(11.32, '+', 16, '27,3200', { layout: 'column' }),
    ]) {
      const verified = verifiedWrittenArithmetic(item)
      assert.equal(verified.reason, undefined, JSON.stringify(item))
      assert.equal(verified.correctText, item.answer)
      const game = gameFor(item), q = game.questions[0]
      assert.ok(q, JSON.stringify(game.issues))
      assert.ok(same(answerValue(q.choices.find((choice) => choice.id === game.corrections[q.id].choiceId).text), answerValue(item.answer)))
    }
    assert.match(verifiedWrittenArithmetic(inline(61, '+', -28, '(+33)', { prompt: '(+61) + (−28) =' })).prompt, /= □$/)
    const grouped = inline(1234.5, '÷', 2, '617,25', { prompt: "1’234,50 ÷ 2 = □" })
    assert.equal(verifiedWrittenArithmetic(grouped).prompt, grouped.prompt)
    const boundary = verifiedWrittenArithmetic(inline(1, '÷', 64, '0,015625'))
    assert.equal(boundary.reason, undefined); assert.equal(boundary.value.precision, 6)
    assert.ok(verifiedWrittenArithmetic(inline(1, '÷', 128, '0,007813')).reason)
  })

  await test('stale answers, changed equations, wrong blank locations and ambiguous zero operations are rejected', () => {
    const source = inline(12, '÷', 4, '4', { missing: 'b', result: 3, prompt: '12 ÷ □ = 3' })
    for (const invalid of [
      { ...source, answer: '5' }, { ...source, result: 4 }, { ...source, prompt: '13 ÷ □ = 3' },
      { ...source, prompt: '□ ÷ 4 = 3' }, { ...source, prompt: '12 ÷ 4 = 3' }, { ...source, prompt: '12 ÷ □ = 4' },
      { ...source, prompt: '12 ÷ □ = 3 + 0' }, { ...source, prompt: '12 ÷ □ = 3<script>bad</script>' },
      inline(1, '÷', 3, '0,333333'), inline(1, '÷', 0, '0'), inline(1e-7, '+', 0.2, '0,2000001'),
      inline(4, '×', 0, '4', { missing: 'a' }), inline(0, '×', 4, '4', { missing: 'b' }), inline(0, '÷', 4, '4', { missing: 'b' }),
      inline(1, '÷', 2, '2', { missing: 'b' }),
      inline(0.1, '+', 0.2, '0,3', { blankOperands: true }),
    ]) { const rejected = gameFor(invalid); assert.equal(rejected.questions.length, 0, JSON.stringify(invalid)); assert.ok(rejected.issues.length) }
    assert.ok(verifiedWrittenArithmetic(inline(Infinity, '+', 1, '1')).reason)
    assert.throws(() => gameFor(inline(Infinity, '+', 1, '1')), /nombre invalide/)
    assert.ok(verifiedWrittenArithmetic(inline(0.1, '+', 0.2, '0,3000001')).reason)
    // Free-worksheet normalization runs before conversion and can repair the
    // source answer. In that case the game must use the actual printable value.
    const normalized = gameFor(inline(0.1, '+', 0.2, '0,3000001')), q = normalized.questions[0]
    assert.equal(q.choices.find((choice) => choice.id === normalized.corrections[q.id].choiceId).text, '0,3')
    assert.equal(verifiedWrittenArithmetic({ layout: 'division-column', a: 7, b: 2, op: '÷', answer: '3 reste 1' }), undefined)
    assert.equal(verifiedWrittenArithmetic({ layout: 'inline', prompt: '2³ =', a: 2, b: 3, labels: ['power'], answer: '8' }), undefined)
  })

  await test('six seeded decimal cards remain unique, vary between seeds, support signs and retain their key after exact sorting or caps', () => {
    const item = inline(-0.1, '÷', -0.2, '0,5'), verified = verifiedWrittenArithmetic(item)
    const signatures = new Set()
    let negatives = false
    for (let seed = 1; seed <= 100; seed++) {
      const value = verified.value
      const choices = decimalChoices(value.units, value.precision, 10n ** BigInt(value.precision), verified.correctText, seed, verified.signed)
      assert.deepEqual(choices, decimalChoices(value.units, value.precision, 10n ** BigInt(value.precision), verified.correctText, seed, verified.signed))
      assert.equal(choices.choices.length, 6); signatures.add(JSON.stringify(choices))
      negatives ||= choices.choices.some((choice) => answerValue(choice.text).units < 0n)
    }
    assert.ok(negatives); assert.ok(signatures.size > 1)
    const game = gameFor(item), original = structuredClone(game)
    for (const maxChoices of [2, 3, 4, 5, 6]) {
      const plan = prepareGame(applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, maxChoices, numericOrder: true }))
      const q = plan.questions[0]
      assert.equal(q.choices.length, maxChoices); assert.ok(q.choices.some((choice) => choice.id === game.corrections[q.id].choiceId))
      const ids = q.choices.map((choice) => BigInt(choice.id.slice(1)))
      assert.deepEqual(ids, [...ids].sort((a, b) => a < b ? -1 : a > b ? 1 : 0))
    }
    assert.deepEqual(game, original)
  })

  await test('relaunching generated templates changes their calculations while preserving the saved worksheet', () => {
    for (const [domain, type] of families) {
      const page = { ...defaultPage(domain), topic: exerciseTypes.find((entry) => entry.id === type).topic, exerciseType: type, count: 6, libreItems: undefined }
      const recipe = { ...base, pages: [page], libreMode: false }, original = structuredClone(recipe)
      let source = createGameSource({ recipe, name: type }, 'saved', type)
      const variants = new Set()
      for (let run = 0; run < 8; run++) { const game = convertRecipe(source.recipe); assert.equal(game.issues.length, 0); variants.add(JSON.stringify(game.questions.map((q) => q.prompt))); source = renewGameSource(source, null) }
      assert.ok(variants.size > 1, type); assert.deepEqual(recipe, original)
    }
  })

  await test('class remains collective and solo verdicts, navigation and durable checkpoints preserve the original equations', async () => {
    const game = prepareGame(gameFor(inline(12, '÷', 4, '4', { missing: 'b', prompt: '12 ÷ □ = 3' }), inline(4.01, '×', 3.6, '14,436'), inline(1, '÷', 8, '0,125')))
    let state = startSession(game, 'class')
    assert.equal(transition(game, state, { type: 'SELECT', choiceId: game.questions[0].choices[0].id }), state)
    for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL']) state = transition(game, state, { type })
    assert.equal(state.phase, 'revealed')
    state = startSession(game, 'solo')
    for (const [index, kind] of ['correct', 'wrong', 'timeout'].entries()) {
      const q = game.questions[index], correctId = game.corrections[q.id].choiceId
      state = transition(game, state, kind === 'timeout' ? { type: 'TIMEOUT' } : { type: 'SELECT', choiceId: kind === 'correct' ? correctId : q.choices.find((choice) => choice.id !== correctId).id })
      assert.equal(state.phase, 'revealed'); assert.equal(state.history.at(-1).correct, kind === 'correct')
      state = transition(game, state, { type: 'NEXT' })
    }
    assert.equal(state.finished, true)
    const saved = compactSession(await newRecord(game, 'solo'), state)
    assert.deepEqual(replaySession(game, saved, await planIdentity(game), Date.now(), 'solo').state, state)
    assert.equal(game.questions[0].prompt, '12 ÷ □ = 3')
  })

  await test('competition keeps the missing operand and exact decimal cards public while the verified key stays private', () => {
    const game = gameFor(inline(12, '÷', 4, '4', { missing: 'b', prompt: '12 ÷ □ = 3' })), quiz = parseCompetitionQuiz(competitionQuiz(game, 'https://clairfle.example'))
    let room = createCompetition(quiz, { enabled: false, seconds: 30, feedbackSeconds: 5, speedPoints: false }, 'online', 'ABC234', 1000)
    room = competitionStep(room, { type: 'join', avatarId: 'panda' }, 1100); room = competitionStep(room, { type: 'start' }, 1200)
    const view = competitionView(room, 1250, 'p1')
    assert.equal(view.question.prompt, '12 ÷ □ = 3'); assert.equal(view.correctChoiceId, undefined)
    assert.equal(view.question.choices.length, 6)
    room = competitionStep(room, { type: 'answer', playerId: 'p1', questionId: view.question.id, choiceId: quiz.items[0].correctChoiceId }, 1300)
    assert.equal(competitionView(room, 1400, 'p1').self.points, 1000)
  })
} finally { await server.close() }
