import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', cacheDir: '/tmp/clairfle-fractions-unit' })
try {
  const { verifiedFractions, fractionChoices } = await vite.ssrLoadModule('/src/interactive/domain/fractions.ts')
  const {fractionParts,isFractionQuestion}=await vite.ssrLoadModule('/src/interactive/domain/fraction-notation.ts')
  const {FractionText}=await vite.ssrLoadModule('/src/interactive/components/FractionText.tsx')
  const { convertRecipe } = await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { buildPage, buildWorksheets } = await vite.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage } = await vite.ssrLoadModule('/src/math/catalog.ts')
  const { demoRecipe } = await vite.ssrLoadModule('/src/interactive/demo.ts')
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS, positionOf } = await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { prepareGame } = await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { startSession, transition } = await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await vite.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { createGameSource, renewGameSource } = await vite.ssrLoadModule('/src/interactive/game-run.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await vite.ssrLoadModule('/src/interactive/competition/core.ts')
  const base = demoRecipe()
  const families = ['fractions-identifier', 'fractions-equivalentes', 'fractions-simplifier', 'fractions-comparer', 'fractions-add', 'fractions-mul', 'fractions-div']
  const config = (exerciseType, difficulty = 'moyen') => ({ ...defaultPage('algèbre'), topic: 'fractions', exerciseType, difficulty, count: 4, libreItems: undefined, extraBlocks: undefined })
  const source = (prompt, answer) => ({ layout: 'inline', prompt, answer })
  const gameFor = (type, ...items) => convertRecipe({ ...base, pages: [{ ...config(type), count: items.length, libreItems: items }] })
  // Independent integer cross-products, never the adapter's parser or arithmetic.
  const ratio = text => {
    const [n, d = '1'] = text.trim().replace('−', '-').split('/').map(part => part.trim())
    assert.match(n, /^-?\d+$/); assert.match(d, /^\d+$/); assert.notEqual(BigInt(d), 0n)
    return [BigInt(n), BigInt(d)]
  }
  const equal = (a, b) => a[0] * b[1] === b[0] * a[1]
  const ascending = (choices) => choices.every((choice, i) => !i || (() => { const [an, ad] = ratio(choices[i - 1].text), [bn, bd] = ratio(choice.text); return an * bd < bn * ad })())

  await test('vertical fraction notation preserves the literal source and blanks without treating prose, dates or URLs as fraction questions',()=>{
    assert.deepEqual(fractionParts('2/3 = □/12'),[{numerator:'2',denominator:'3'},' = ',{numerator:'□',denominator:'12'}])
    assert.deepEqual(fractionParts('−5/6 + 3/4'),[{numerator:'−5',denominator:'6'},' + ',{numerator:'3',denominator:'4'}])
    for(const prompt of ['Dans 6/9, le numérateur est…','Dans 6/9, le dénominateur est…','Simplifie : 12/8 = □','2/3 = 8/□','Compare : 1/2 □ 2/3','Compare : 1/3 □ 0,3','1/2 ÷ 3/4 = □'])assert.ok(isFractionQuestion(prompt),prompt)
    for(const prompt of ['Le rendez-vous est le 12/10.','12/10/2026','https://example.com/1/2','2/3','2 + 2 = ?','Quel est le sujet ?'])assert.equal(isFractionQuestion(prompt),false,prompt)
    assert.deepEqual(fractionParts('12/10/2026'),['12/10/2026'])
    assert.deepEqual(fractionParts('0,5/2 + 1/2,5'),['0,5/2 + 1/2,5'])
  })
  await test('stacked fractions retain one accessible, copyable literal value and escaped display attributes, with an opt-out for ordinary text',()=>{
    const html=renderToStaticMarkup(createElement(FractionText,{text:'2/3 = □/12'}))
    assert.equal((html.match(/class="ci-fraction-digits"/g)??[]).length,2)
    assert.ok(html.includes('class="ci-sr-only">2/3</span>'));assert.ok(html.includes('class="ci-sr-only">□/12</span>'))
    assert.ok(html.includes('aria-hidden="true" data-numerator="□" data-denominator="12"'))
    assert.equal(renderToStaticMarkup(createElement(FractionText,{text:'2/3',enabled:false})),'2/3')
    assert.ok(!renderToStaticMarkup(createElement(FractionText,{text:'<script>1/2</script>'})).includes('<script>'))
  })

  await test('all seven actual fraction types retain every question, exact source keys and unchanged print data over 2,100 configurations', () => {
    for (const type of families) for (const difficulty of ['facile', 'moyen', 'avance']) for (let seed = 1; seed <= 100; seed++) {
      const page = config(type, difficulty), recipe = { ...base, pages: [page], seed, libreMode: false }, before = structuredClone(recipe)
      const items = buildPage(page, seed).blocks.flatMap(block => block.items), paper = seed === 1 ? buildWorksheets(recipe.pages, seed) : undefined
      const game = convertRecipe(recipe)
      assert.equal(game.questions.length, items.length, `${type}/${difficulty}/${seed}: ${JSON.stringify(game.issues)}`)
      assert.deepEqual(game.issues, [])
      for (const [index, q] of game.questions.entries()) {
        const correct = q.choices.find(choice => choice.id === game.corrections[q.id].choiceId), item = items[index]
        assert.equal(correct.text, item.answer)
        assert.equal(q.choices.length, type === 'fractions-comparer' ? 3 : 6)
        if (type !== 'fractions-comparer') {
          const values = q.choices.map(choice => ratio(choice.text))
          assert.ok(equal(ratio(correct.text), ratio(item.answer)))
          for (let a = 0; a < values.length; a++) for (let b = a + 1; b < values.length; b++) assert.ok(!equal(values[a], values[b]), `equivalent distractors: ${JSON.stringify(q.choices)}`)
          const verified = verifiedFractions(item, type)
          assert.ok(verified && !verified.reason)
          // Recompute every arithmetic source with elementary cross-products.
          if (['fractions-add', 'fractions-mul', 'fractions-div'].includes(type)) {
            const [left, op, right] = item.prompt.split(' '), [a, b] = ratio(left), [c, d] = ratio(right)
            const expected = op === '+' ? [a * d + c * b, b * d] : op === '−' ? [a * d - c * b, b * d] : op === '×' ? [a * c, b * d] : [a * d, b * c]
            assert.ok(equal(ratio(correct.text), expected))
          }
        }
        assert.equal('answer' in q || 'correct' in q, false)
      }
      assert.deepEqual(recipe, before)
      if (seed === 1) { assert.deepEqual(convertRecipe(recipe), game); assert.deepEqual(buildWorksheets(recipe.pages, seed), paper) }
    }
  })

  await test('equivalent-fraction series mix amplification and reduction with exact answers and either missing term', () => {
    const singleDirections = new Set(), blanks = new Set()
    for (const count of [1, 2, 3, 8, 9]) for (let draw = 1; draw <= 40; draw++) {
      const seed = draw * 1_000_003
      const page = { ...config('fractions-equivalentes'), count }
      const items = buildPage(page, seed).blocks.flatMap(block => block.items)
      assert.equal(items.length, count)
      const directions = { up: 0, down: 0 }
      for (const item of items) {
        assert.equal(item.prompt.match(/□/g)?.length, 1)
        assert.match(item.answer, /^[1-9]\d*$/)
        const [left, right] = item.prompt.replace('□', item.answer).split(' = ').map(ratio)
        assert.ok(equal(left, right), `${item.prompt} → ${item.answer}`)
        assert.ok(left[0] < left[1] && right[0] < right[1])
        const direction = left[1] < right[1] ? 'up' : 'down'
        directions[direction]++
        const [smaller, larger] = left[1] < right[1] ? [left, right] : [right, left]
        assert.equal(larger[0] % smaller[0], 0n)
        assert.equal(larger[1] % smaller[1], 0n)
        assert.equal(larger[0] / smaller[0], larger[1] / smaller[1])
        assert.ok(larger[1] / smaller[1] >= 2n && larger[1] / smaller[1] <= 5n)
        blanks.add(`${direction}:${item.prompt.includes('□/') ? 'numerator' : 'denominator'}`)
        if (count === 1) singleDirections.add(direction)
      }
      assert.ok(Math.abs(directions.up - directions.down) <= 1)
      if (count >= 2) assert.ok(directions.up && directions.down)
    }
    assert.deepEqual(singleDirections, new Set(['up', 'down']))
    assert.deepEqual(blanks, new Set(['up:numerator', 'up:denominator', 'down:numerator', 'down:denominator']))
  })

  await test('identifier questions use the written numerator/denominator, and equivalent fractions keep exactly one integer blank', () => {
    for (const [prompt, answer] of [['Dans 6/9, le numérateur est', '6'], ['Dans 6/9, le dénominateur est', '9'], ['Dans 0/9, le numérateur est', '0']]) {
      const verified = verifiedFractions(source(prompt, answer), 'fractions-identifier')
      assert.ok(!verified.reason); assert.equal(verified.value.numerator.toString(), answer); assert.equal(verified.integer, true)
    }
    for (const [prompt, answer] of [['2/3 = □/12', '8'], ['2/3 = 8/□', '12'], ['8/12 = □/3', '2'], ['8/12 = 2/□', '3'], ['0/3 = □/9', '0'], ['−2/3 = −8/□', '12']]) {
      const verified = verifiedFractions(source(prompt, answer), 'fractions-equivalentes')
      assert.ok(!verified.reason, prompt); assert.equal(verified.model.includes('□'), false)
      const game = gameFor('fractions-equivalentes', source(prompt, answer))
      assert.equal(game.questions.length, 1, JSON.stringify(game.issues)); assert.ok(game.questions[0].choices.every(choice => /^n-?\d+$/.test(choice.id)))
    }
    assert.ok(verifiedFractions(source('0/3 = 0/□', '9'), 'fractions-equivalentes').reason)
  })

  await test('whole-fraction division, negative and zero results, irreducible answers and large integers are computed exactly', () => {
    for (const [type, prompt, answer] of [
      ['fractions-div', '1/2 ÷ 3/4 =', '2/3'], ['fractions-div', '−2/3 ÷ 4/5 = □', '−5/6'],
      ['fractions-mul', '3/2 × 2/3 =', '1'], ['fractions-mul', '0/7 × 3/4 =', '0'],
      ['fractions-add', '2/3 + 1/4 =', '11/12'], ['fractions-add', '1/4 − 2/3 =', '-5/12'],
      ['fractions-add', '1/3 − 1/3 =', '0'], ['fractions-simplifier', '12/8 =', '3/2'],
      ['fractions-simplifier', '15/5 =', '3/1'], ['fractions-simplifier', '0/7 =', '0/1'],
      ['fractions-simplifier', '9007199254740993/3 =', '3002399751580331'],
      ['fractions-div', '9007199254740993/2 ÷ 3/4 =', '6004799503160662'],
    ]) {
      const item = source(prompt, answer), before = structuredClone(item), verified = verifiedFractions(item, type)
      assert.ok(verified && !verified.reason, `${prompt}: ${verified?.reason}`)
      assert.equal(verified.correctText, answer); assert.equal(verified.prompt.match(/□/g)?.length ?? 0, 1)
      const game = gameFor(type, item), q = game.questions[0]
      assert.ok(q, JSON.stringify(game.issues)); assert.equal(q.choices.find(choice => choice.id === game.corrections[q.id].choiceId).text, answer)
      assert.deepEqual(item, before)
    }
  })

  await test('contradictions, zero denominators, missing/nonunique values, wrong operations and executable syntax are excluded explicitly', () => {
    for (const [type, prompt, answer] of [
      ['fractions-identifier', 'Dans 6/9, le numérateur est', '2'], ['fractions-identifier', 'Dans 6/0, le dénominateur est', '0'],
      ['fractions-equivalentes', '2/3 = □/12', '7'], ['fractions-equivalentes', '2/3 = □/10', '7'],
      ['fractions-equivalentes', '2/3 = □/□', '8'], ['fractions-equivalentes', '0/3 = 0/□', '9'],
      ['fractions-equivalentes', '1/2 = □/0', '0'], ['fractions-equivalentes', '1/2 = 0/□', '0'],
      ['fractions-simplifier', '12/8 =', '6/4'], ['fractions-simplifier', '12/8 =', '3/4'],
      ['fractions-div', '1/2 ÷ 3/4 =', '1/24'], ['fractions-div', '1/2 ÷ 0/4 =', '0'],
      ['fractions-add', '1/0 + 1/4 =', '1/4'], ['fractions-add', '1/2 + 1/4 =', '6/8'],
      ['fractions-mul', '1/2 ÷ 3/4 =', '2/3'], ['fractions-add', '1/2 + 1/4 = 3/4', '3/4'],
      ['fractions-mul', '1/2 × (globalThis.leaked = 1) =', '1'], ['fractions-mul', '1/2 × 3/4 =', 'eval(1)'],
    ]) {
      const item = source(prompt, answer), before = structuredClone(item), result = verifiedFractions(item, type)
      assert.match(result.reason, /^Fractions :/)
      const game = gameFor(type, item); assert.equal(game.questions.length, 0, prompt); assert.ok(game.issues.length)
      assert.deepEqual(item, before)
    }
    assert.equal(verifiedFractions(source('1/2 =', '1/2'), 'unknown'), undefined)
    assert.equal(verifiedFractions({ ...source('1/2 =', '1/2'), layout: 'geo' }, 'fractions-simplifier'), undefined)
    assert.ok(verifiedFractions(source(`${'1'.repeat(257)}/2 =`, '1/2'), 'fractions-simplifier').reason)
    assert.equal(globalThis.leaked, undefined)
    // Free worksheets could already contain a manually prepared QCM under a
    // fraction type. Its explicit choices still use the original QCM adapter.
    const manual = gameFor('fractions-simplifier', { layout: 'select', prompt: 'Quelle fraction vaut un demi ?', options: ['1/2', '1/3'], answer: '1/2' })
    assert.equal(manual.questions.length, 1); assert.deepEqual(manual.issues, [])
    assert.equal(manual.questions[0].choices.find(choice => choice.id === manual.corrections[manual.questions[0].id].choiceId).text, '1/2')
  })

  await test('seeded rational cards are unique by value, preserve source notation, vary across seeds and sort exactly under every cap', () => {
    const examples = [['1/2 ÷ 3/4 =', '2/3'], ['−2/3 ÷ 4/5 =', '−5/6'], ['3/2 ÷ 3/2 =', '1'], ['0/2 ÷ 3/4 =', '0']]
    for (const [prompt, answer] of examples) {
      const verified = verifiedFractions(source(prompt, answer), 'fractions-div'), variations = new Set()
      for (let seed = 1; seed <= 100; seed++) {
        const choices = fractionChoices(verified.value, answer, seed, verified.integer, verified.distractors)
        assert.deepEqual(choices, fractionChoices(verified.value, answer, seed, verified.integer, verified.distractors)); assert.equal(choices.choices.length, 6)
        variations.add(JSON.stringify(choices.choices))
      }
      assert.ok(variations.size > 50)
      const raw = gameFor('fractions-div', source(prompt, answer)), before = structuredClone(raw)
      for (const maxChoices of [2, 3, 4, 5, 6]) {
        const plan = prepareGame(applyPlanOptions(raw, { ...DEFAULT_PLAN_OPTIONS, maxChoices, numericOrder: true }))
        assert.equal(plan.questions[0].choices.length, maxChoices); assert.ok(ascending(plan.questions[0].choices))
        assert.equal(plan.questions[0].choices.filter(choice => equal(ratio(choice.text), ratio(answer))).length, 1)
      }
      assert.deepEqual(raw, before)
    }
    const game = gameFor('fractions-simplifier', source('9007199254740993/9007199254740992 =', '9007199254740993/9007199254740992'))
    assert.ok(ascending(prepareGame(applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, numericOrder: true })).questions[0].choices))
  })

  await test('new parts renew every fraction family while keeping selected types, settings and the source template', () => {
    const recipe = { ...base, pages: families.map(type => config(type)), seed: 42, libreMode: false }, before = structuredClone(recipe)
    const source = createGameSource({ recipe, name: 'Fractions' }, 'pool', 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee')
    const first = convertRecipe(source.recipe), keys = first.questions.map(positionOf), next = renewGameSource(source, keys)
    assert.notEqual(next.recipe.seed, source.recipe.seed); assert.deepEqual(next.recipe.pages, recipe.pages); assert.deepEqual(next.selectedKeys, keys)
    assert.notDeepEqual(convertRecipe(next.recipe).questions.map(q => q.prompt), first.questions.map(q => q.prompt)); assert.deepEqual(recipe, before)
  })

  await test('Class stays collective, Solo correct/wrong/timeout outcomes replay and compact using the same rational plan', async () => {
    const recipe = { ...base, seed: 42, pages: [config('fractions-div')] }, raw = convertRecipe(recipe)
    for (const mode of ['class', 'solo']) {
      const options = { ...DEFAULT_PLAN_OPTIONS, numericOrder: true }, game = prepareGame(applyPlanOptions(raw, options), undefined, mode)
      const source = createGameSource({ recipe, name: 'Fractions' }, 'pool', 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee')
      const context = { reference: source.reference, sourceKey: source.sourceKey, seed: 42, replay: 0, selectedKeys: raw.questions.map(positionOf), options, timer: { enabled: true, seconds: 5, feedbackSeconds: 1 } }
      const first = game.questions[0], second = game.questions[1]
      const actions = mode === 'class' ? [{ type: 'CARDS_UP' }, { type: 'DISCUSS' }, { type: 'REVEAL' }] : [
        { type: 'SELECT', choiceId: game.corrections[first.id].choiceId }, { type: 'NEXT' },
        { type: 'SELECT', choiceId: second.choices.find(c => c.id !== game.corrections[second.id].choiceId).id }, { type: 'NEXT' }, { type: 'TIMEOUT' },
      ]
      let state = startSession(game, mode)
      const events = actions.map((action, index) => ({ eventId: String(index), at: 1000 + index, action }))
      for (const event of events) state = transition(game, state, event.action, event.at)
      if (mode === 'class') assert.ok(state.history.every(attempt => attempt.correct === undefined))
      else assert.deepEqual(state.history.map(attempt => attempt.correct), [true, false, false])
      const record = { ...await newRecord(game, mode, context), updatedAt: 1100, events }, id = await planIdentity(game)
      assert.deepEqual(replaySession(game, record, id, 1200, mode).state, state)
      assert.deepEqual(replaySession(game, compactSession(record, state), id, 1200, mode).state, state)
    }
  })

  await test('online and local competition carry all rational cards and keep the key private until correction', () => {
    const game = prepareGame(gameFor('fractions-div', source('1/2 ÷ 3/4 =', '2/3')))
    const quiz = competitionQuiz(game, 'https://fractions.example'), parsed = parseCompetitionQuiz(quiz, ['https://fractions.example'])
    assert.deepEqual(parsed.items.map(item => item.question.choices.map(choice => choice.text)), quiz.items.map(item => item.question.choices.map(choice => choice.text)))
    assert.equal(parsed.items[0].question.choices.find(choice => choice.id === parsed.items[0].correctChoiceId).text, '2/3')
    for (const mode of ['online', 'local']) {
      let room = createCompetition(parsed, { enabled: false, seconds: 30, feedbackSeconds: 1, speedPoints: false }, mode, '123456', 1000)
      room = competitionStep(room, { type: 'join', avatarId: 'leaf' }, 1001)
      room = competitionStep(room, { type: 'join', avatarId: 'owl' }, 1002)
      room = competitionStep(room, { type: 'start' }, 1003)
      if (mode === 'local') room = competitionStep(room, { type: 'begin-turn' }, 1004)
      const view = competitionView(room, 1004, room.players[0].id)
      assert.equal(view.correctChoiceId, undefined); assert.equal(view.self.correct, undefined)
      assert.equal('correctChoiceId' in view.question || 'answer' in view.question, false)
      assert.deepEqual(view.question.choices, parsed.items[0].question.choices)
      room = competitionStep(room, { type: 'answer', playerId: room.players[0].id, questionId: view.question.id, choiceId: parsed.items[0].correctChoiceId }, 1005)
      if (mode === 'local') {
        room = competitionStep(room, { type: 'begin-turn' }, 1006)
        room = competitionStep(room, { type: 'answer', playerId: room.players[1].id, questionId: view.question.id, choiceId: parsed.items[0].correctChoiceId }, 1007)
      } else room = competitionStep(room, { type: 'answer', playerId: room.players[1].id, questionId: view.question.id, choiceId: parsed.items[0].correctChoiceId }, 1007)
      assert.equal(competitionView(room, 1007).correctChoiceId, parsed.items[0].correctChoiceId)
      assert.equal(room.players[0].score, room.players[1].score)
    }
  })
} finally { await vite.close() }
