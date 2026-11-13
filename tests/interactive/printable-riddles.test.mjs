import assert from 'node:assert/strict'
import test from 'node:test'
import { access } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-riddles-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { buildPage, buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { defaultThemeGameContent } = await server.ssrLoadModule('/src/jeux/bank.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS } = await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { positionOf } = await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const { createGameSource, renewGameSource } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { teacherSheetRows } = await server.ssrLoadModule('/src/interactive/domain/teacher-sheet.ts')
  const { PALETTE, defaultShapes } = await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const types = ['jeux-devinettes', 'jeux-intrus'], base = demoRecipe()
  const config = type => ({ ...defaultPage('jeux'), ...defaultThemeGameContent(type, 'fruits'), domain: 'jeux', topic: 'jeux-fruits', exerciseType: type, count: 1, columns: 1, extraBlocks: undefined, libreItems: undefined })
  const recipe = (type, seed = 1) => ({ ...base, seed, libreMode: false, pages: [config(type)] })
  const sourceItems = (type, seed = 1) => buildPage(config(type), seed).blocks[0].items
  const authored = (type, items, extra = {}) => ({ ...recipe(type), ...extra, libreMode: true, pages: [{ ...config(type), libreItems: items }] })
  const key = text => text.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr')
  const answer = (game, q) => q.choices.find(choice => choice.id === game.corrections[q.id].choiceId)?.text

  await test('real riddle and odd-word templates over 600 configurations retain every clue, word and explicit key without changing either paper face', async () => {
    const assets = new Set()
    for (const type of types) for (const difficulty of ['facile', 'moyen', 'avance']) for (let seed = 1; seed <= 100; seed++) {
      const input = recipe(type, seed); input.pages[0].difficulty = difficulty
      const before = structuredClone(input), items = buildPage(input.pages[0], seed).blocks[0].items
      const paper = seed === 1 ? structuredClone(buildWorksheets(input.pages, seed)) : undefined
      const game = convertRecipe(input)
      const expected = type === 'jeux-intrus' ? 9 : items[1].gameBoard.cards.filter(card => key(card.text) !== 'décrivez ce mot sans dire son nom.').length
      assert.equal(game.questions.length, expected, JSON.stringify(game.issues))
      for (const q of game.questions) {
        const card = items[q.source.item].gameBoard.cards[q.source.part]
        assert.equal(q.compatibility, q.mode === 'oral' ? 'teacher-led' : 'assisted')
        assert.equal(q.matchingGroup, undefined)
        assert.doesNotMatch(JSON.stringify(q), /intrusAnswer|correctId|correctChoiceId|"correct"/)
        if (type === 'jeux-intrus') {
          assert.equal(answer(game, q), card.intrusAnswer)
          assert.deepEqual(q.choices.map(c => c.text).sort(), card.scatter.map(w => w.text).sort())
          assert.equal(game.corrections[q.id].text, card.intrusAnswer)
          assert.equal(q.choices.length, 5)
        } else {
          const clue = items[1].gameBoard.cards.find(other => other.badge === card.badge).text
          assert.equal(q.prompt, `Quel est le mot\u00a0?\n${clue.trim()}`)
          assert.equal(q.images.length, 0, 'The answer picture is not presented as the clue')
          if (q.mode === 'choice') assert.equal(answer(game, q), card.text)
          else assert.ok(game.corrections[q.id].text.split(' / ').includes(card.text))
          for (const choice of q.choices) {
            const original = items[0].gameBoard.cards.find(card => card.text === choice.text)
            assert.ok(original); assert.equal(choice.image, original.imageSrc)
            if (choice.image) assets.add(choice.image)
          }
        }
        if (q.mode === 'choice') assert.ok(q.choices.length >= 2 && q.choices.length <= 6)
      }
      assert.deepEqual(input, before); assert.deepEqual(convertRecipe(input), game)
      if (paper) assert.deepEqual(buildWorksheets(input.pages, seed), paper)
    }
    for (const src of assets) await access('public' + src)
  })

  await test('mirrored and freely reordered riddle cards follow explicit pair numbers; invalid faces or repeated numbers never invent an answer', () => {
    const items = sourceItems(types[0]); items[0].gameBoard.cards.reverse(); items[1].gameBoard.cards.reverse()
    const game = convertRecipe(authored(types[0], items))
    assert.equal(game.questions.length, convertRecipe(recipe(types[0])).questions.length)
    for (const q of game.questions) {
      const card = items[0].gameBoard.cards[q.source.part], clue = items[1].gameBoard.cards.find(c => c.badge === card.badge)
      assert.ok(q.prompt.endsWith(clue.text)); assert.equal(answer(game, q), card.text)
    }
    for (const change of [
      items => { delete items[1].gameBoard.cards[0].badge },
      items => { items[1].gameBoard.cards[0].badge = items[1].gameBoard.cards[1].badge },
      items => { items[1].gameBoard.cards.pop() },
      items => { items[1].gameBoard.side = 'recto' },
      items => { items[0].gameBoard.kind = 'memory' },
      items => { items[1].libreError = 'Face non validée' },
    ]) {
      const bad = sourceItems(types[0]); change(bad)
      const input = authored(types[0], bad), before = structuredClone(input), result = convertRecipe(input)
      assert.equal(result.questions.length, 0); assert.ok(result.issues.length); assert.deepEqual(input, before)
    }
  })

  await test('incomplete or contradictory odd-word keys are excluded, including old authored boards that did not retain their answer', () => {
    for (const change of [
      card => { delete card.intrusAnswer },
      card => { card.intrusAnswer = 'mot absent de la carte' },
      card => { card.scatter[1].text = card.scatter[0].text },
      card => { card.scatter[0].text = '…' },
      card => { card.scatter = card.scatter.slice(0, 2) },
      card => { card.scatter = 'Un tableau de mots est nécessaire' },
      card => { card.scatter.push({ text: 'six', x: 0, y: 0 }, { text: 'sept', x: 0, y: 0 }) },
    ]) {
      const items = sourceItems(types[1]); change(items[0].gameBoard.cards[0])
      const input = authored(types[1], items), before = structuredClone(input), game = convertRecipe(input)
      assert.equal(game.questions.length, 8); assert.ok(game.issues.length)
      assert.equal(game.questions.some(q => q.source.part === 0), false); assert.deepEqual(input, before)
    }
    const old = sourceItems(types[1]); for (const card of old[0].gameBoard.cards) delete card.intrusAnswer
    const game = convertRecipe(authored(types[1], old))
    assert.equal(game.questions.length, 0); assert.equal(game.issues.length, 9)
    assert.ok(game.issues.every(issue => /Régénérez/.test(issue.reason)))
  })

  await test('shared clues stay teacher-led; missing clues and padding are not fabricated, and image replacements apply only once', () => {
    const items = sourceItems(types[0]), [first, second] = items[0].gameBoard.cards
    const clue = items[1].gameBoard.cards.find(c => c.badge === first.badge)
    clue.text = 'Un indice partagé dans la fiche.'
    items[1].gameBoard.cards.find(c => c.badge === second.badge).text = clue.text
    const game = convertRecipe(authored(types[0], items))
    const ambiguous = game.questions.filter(q => [0, 1].includes(q.source.part))
    assert.equal(ambiguous.length, 2)
    for (const q of ambiguous) {
      assert.equal(q.mode, 'oral'); assert.deepEqual(q.choices, []); assert.equal(game.corrections[q.id].choiceId, undefined)
      assert.deepEqual(game.corrections[q.id].text.split(' / ').sort(), [first.text, second.text].sort())
    }
    const missing = sourceItems(types[0]), valid = missing[1].gameBoard.cards.find(c => key(c.text) !== 'décrivez ce mot sans dire son nom.')
    valid.text = '…'
    assert.equal(convertRecipe(authored(types[0], missing)).questions.length, convertRecipe(recipe(types[0])).questions.length - 1)
    const short = recipe(types[0]); short.pages[0].gameEntries = short.pages[0].gameEntries.slice(0, 2)
    assert.equal(convertRecipe(short).questions.length, 2)
    const original = sourceItems(types[0]), [a, b, c] = original[0].gameBoard.cards.map(card => card.imageSrc)
    const changed = convertRecipe(authored(types[0], original, { imageOverrides: { [a]: b, [b]: c } }))
    for (const q of changed.questions) for (const choice of q.choices) {
      const source = original[0].gameBoard.cards.find(card => card.text === choice.text)
      if (source.imageSrc === a) assert.equal(choice.image, b)
    }
  })

  await test('choice caps, selected questions, custom order and teacher sheets preserve the exact prepared answer and source alternatives', () => {
    for (const type of types) {
      const original = convertRecipe(recipe(type)), before = structuredClone(original)
      for (const maxChoices of [2, 3, 4, 5, 6]) {
        const game = prepareGame(applyPlanOptions(original, { ...DEFAULT_PLAN_OPTIONS, maxChoices, orderMode: 'custom', customOrder: original.questions.map(positionOf).reverse() }))
        assert.deepEqual(game.questions.map(positionOf), original.questions.map(positionOf).reverse())
        const rows = teacherSheetRows(game, PALETTE.map(c => c.color), defaultShapes)
        for (const [index, q] of game.questions.entries()) {
          assert.ok(q.choices.length <= maxChoices); assert.equal(answer(game, q), answer(original, q))
          assert.equal(rows[index].answer, answer(game, q))
          assert.equal(rows[index].card.letter, PALETTE[q.choices.findIndex(choice => choice.id === game.corrections[q.id].choiceId)].letter)
          assert.ok(q.choices.every(choice => original.questions.find(source => source.id === q.id).choices.some(c => c.id === choice.id)))
        }
      }
      const selected = prepareGame(original, [original.questions[1].id, original.questions[4].id])
      assert.equal(selected.questions.length, 2); assert.deepEqual(original, before)
    }
  })

  await test('renewed generated templates change their riddles, distractors or odd words while keeping the saved worksheet untouched', () => {
    for (const type of types) {
      const input = recipe(type), before = structuredClone(input), prompts = new Set(), choices = new Set()
      let source = createGameSource({ recipe: input, name: 'Devinettes et intrus' }, 'saved', 'riddles-' + type)
      for (let i = 0; i < 8; i++) {
        const game = convertRecipe(source.recipe)
        prompts.add(JSON.stringify(game.questions.map(q => q.prompt))); choices.add(JSON.stringify(game.questions.map(q => q.choices)))
        source = renewGameSource(source, null)
      }
      assert.ok(choices.size > 1); if (type === types[0]) assert.ok(prompts.size > 1)
      assert.deepEqual(input, before)
    }
  })

  await test('Class stays collective; Solo correct, wrong and timeout outcomes retain their source answers through durable checkpoints', async () => {
    for (const type of types) {
      const game = prepareGame(convertRecipe(recipe(type))), before = structuredClone(game)
      let collective = startSession(game, 'class')
      assert.equal(transition(game, collective, { type: 'SELECT', choiceId: game.questions[0].choices[0].id }), collective)
      for (const action of ['CARDS_UP', 'DISCUSS', 'REVEAL']) collective = transition(game, collective, { type: action })
      assert.equal(collective.phase, 'revealed'); assert.equal(collective.history[0].correct, undefined)
      let solo = startSession(game, 'solo')
      for (const [index, kind] of ['correct', 'wrong', 'timeout'].entries()) {
        const q = game.questions[index], id = game.corrections[q.id].choiceId
        solo = transition(game, solo, kind === 'timeout' ? { type: 'TIMEOUT' } : { type: 'SELECT', choiceId: kind === 'correct' ? id : q.choices.find(c => c.id !== id).id })
        assert.equal(solo.phase, 'revealed'); assert.equal(solo.history.at(-1).correct, kind === 'correct')
        solo = transition(game, solo, { type: 'NEXT' })
      }
      const record = compactSession(await newRecord(game, 'solo'), solo)
      assert.deepEqual(replaySession(game, record, await planIdentity(game), Date.now(), 'solo').state, solo)
      assert.deepEqual(game, before)
    }
  })

  await test('competition sends original prompts and choices while keeping the riddle and odd-word keys private until correction', () => {
    for (const type of types) {
      const original = prepareGame(convertRecipe(recipe(type))), before = structuredClone(original)
      const quiz = parseCompetitionQuiz(competitionQuiz(original, 'https://clairfle.example'))
      let room = createCompetition(quiz, { enabled: false, seconds: 30, feedbackSeconds: 1, speedPoints: false }, 'online', 'ABC234', 1000)
      for (const avatarId of ['panda', 'fox']) room = competitionStep(room, { type: 'join', avatarId }, 1100)
      room = competitionStep(room, { type: 'start' }, 1200)
      const view = competitionView(room, 1300, 'p1'), q = original.questions[0]
      assert.equal(view.question.prompt, q.prompt); assert.deepEqual(view.question.choices.map(c => c.text), q.choices.map(c => c.text))
      assert.equal(view.correctChoiceId, undefined); assert.doesNotMatch(JSON.stringify(view), /intrusAnswer|correctChoiceId/)
      for (const choice of view.question.choices) {
        const source = q.choices.find(c => c.text === choice.text)
        assert.equal(choice.image, source.image ? new URL(source.image, 'https://clairfle.example').href : undefined)
      }
      const item = quiz.items[0]
      room = competitionStep(room, { type: 'answer', playerId: 'p1', questionId: item.question.id, choiceId: item.correctChoiceId }, 1400)
      assert.equal(competitionView(room, 1401, 'p2').correctChoiceId, undefined)
      room = competitionStep(room, { type: 'answer', playerId: 'p2', questionId: item.question.id, choiceId: item.question.choices.find(c => c.id !== item.correctChoiceId).id }, 1500)
      const corrected = competitionView(room, 1501, 'p1')
      assert.equal(corrected.phase, 'correction'); assert.equal(corrected.correctChoiceId, item.correctChoiceId)
      assert.equal(corrected.players.find(p => p.id === 'p1').score, 1000)
      assert.deepEqual(original, before)
    }
  })
} finally { await server.close() }
