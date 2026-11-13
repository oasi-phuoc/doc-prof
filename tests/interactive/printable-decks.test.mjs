import assert from 'node:assert/strict'
import test from 'node:test'
import { access } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-decks-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
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
  const { usedMatchingChoices, matchingSummary } = await server.ssrLoadModule('/src/interactive/domain/matching.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { teacherSheetRows } = await server.ssrLoadModule('/src/interactive/domain/teacher-sheet.ts')
  const { PALETTE, defaultShapes } = await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const { competitionQuiz, parseCompetitionQuiz, createCompetition, competitionStep, competitionView } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const base = demoRecipe(), types = ['jeux-dominos', 'jeux-loto']
  const config = type => ({ ...defaultPage('jeux'), ...defaultThemeGameContent(type, 'fruits'), domain: 'jeux', topic: 'jeux-fruits', exerciseType: type, count: 1, columns: 1, extraBlocks: undefined, libreItems: undefined })
  const recipe = (type, seed = 1, count) => {
    const page = config(type)
    if (count !== undefined) page.gameEntries = page.gameEntries.slice(0, count)
    return { ...base, seed, pages: [page], libreMode: false }
  }
  const sourceItems = (type, seed = 1) => buildPage(config(type), seed).blocks[0].items
  const custom = (type, items, extra = {}) => ({ ...recipe(type), ...extra, libreMode: true, pages: [{ ...config(type), libreItems: items, count: items.length }] })
  const sourceIndex = (items, type) => items.findIndex(item => type === types[0] ? item.gameBoard.side === 'recto' : item.gameBoard.kind === 'loto-call')
  const normalize = text => text.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr')
  const correct = (game, q) => game.corrections[q.id].choiceId
  const answer = (game, q) => q.choices.find(c => c.id === correct(game, q))?.text
  const reveal = (game, state) => ['CARDS_UP', 'DISCUSS', 'REVEAL'].reduce((state, type) => transition(game, state, { type }), state)

  await test('Dominos and Loto across 600 real configurations retain source image/word pairs, six-word groups and all printed boards', async () => {
    const assets = new Set()
    for (const type of types) for (const difficulty of ['facile', 'moyen', 'avance']) for (let seed = 1; seed <= 100; seed++) {
      const input = recipe(type, seed); input.pages[0].difficulty = difficulty
      const before = structuredClone(input), items = buildPage(input.pages[0], seed).blocks[0].items, expectedIndex = sourceIndex(items, type)
      const paper = seed === 1 ? structuredClone(buildWorksheets(input.pages, seed)) : undefined
      const game = convertRecipe(input), expectedCount = type === types[0] ? 16 : 27
      assert.equal(game.questions.length, expectedCount, JSON.stringify(game.issues)); assert.deepEqual(game.issues, [])
      const groups = new Map()
      for (const q of game.questions) {
        const card = items[q.source.item].gameBoard.cards[q.source.part]
        const original = input.pages[0].gameEntries.find(entry => entry.imageSrc === card.imageSrc)
        assert.ok(original, card.imageSrc); assert.equal(answer(game, q), original.text)
        assert.equal(q.source.item, expectedIndex); assert.deepEqual(q.images, [card.imageSrc]); assets.add(card.imageSrc)
        assert.equal(q.mode, 'choice'); assert.equal(q.compatibility, 'assisted')
        assert.doesNotMatch(JSON.stringify(q), /dominoWord|correctChoiceId|"answer"|"correct"/)
        assert.ok(q.choices.length >= 2 && q.choices.length <= 6); assert.equal(new Set(q.choices.map(c => normalize(c.text))).size, q.choices.length)
        assert.ok(q.choices.every(c => input.pages[0].gameEntries.some(entry => entry.text === c.text)))
        if (type === types[0]) { assert.equal(card.dominoWord, original.text); assert.notEqual(answer(game, q), card.textRight, 'The right half names the next image, not this one') }
        else assert.equal(card.text, original.text)
        groups.set(q.matchingGroup.groupId, [...(groups.get(q.matchingGroup.groupId) ?? []), q])
      }
      assert.deepEqual([...groups.values()].map(group => group.length), type === types[0] ? [6, 6, 4] : [6, 6, 6, 6, 3])
      for (const group of groups.values()) for (const q of group) assert.deepEqual(q.choices.map(c => c.id).sort(), group.map(member => correct(game, member)).sort())
      assert.deepEqual(input, before); assert.deepEqual(convertRecipe(input), game)
      if (paper) assert.deepEqual(buildWorksheets(input.pages, seed), paper)
    }
    for (const src of assets) await access('public' + src)
  })

  await test('reordered domino faces, changed printed numbers and caller/grids keep explicit associations independent of card positions', () => {
    for (const type of types) {
      const items = sourceItems(type), source = items[sourceIndex(items, type)]
      source.gameBoard.cards.reverse(); source.gameBoard.cards.forEach(card => { delete card.badge })
      items.reverse()
      const game = convertRecipe(custom(type, items))
      assert.equal(game.questions.length, type === types[0] ? 16 : 27)
      for (const q of game.questions) {
        const card = items[q.source.item].gameBoard.cards[q.source.part]
        assert.equal(answer(game, q), type === types[0] ? card.dominoWord : card.text)
        assert.deepEqual(q.images, [card.imageSrc])
      }
    }
  })

  await test('old domino boards without image labels, foreign right-half words and contradictory faces never fabricate an answer', () => {
    for (const change of [
      items => { for (const card of items[0].gameBoard.cards) delete card.dominoWord },
      items => { items[0].gameBoard.cards[0].textRight = 'mot étranger à la planche' },
      items => { items[0].gameBoard.cards[0].dominoWord = 'corrigé absent des mots imprimés' },
      items => { items[0].gameBoard.side = 'verso' },
      items => { items[0].gameBoard.cards[0].variant = 'word' },
      items => { items[1].libreError = 'Face non validée' },
      items => { items[1].answer = 'Une autre réponse à conserver' },
    ]) {
      const items = sourceItems(types[0]); change(items)
      const input = custom(types[0], items), before = structuredClone(input), game = convertRecipe(input)
      assert.equal(game.questions.length, 0); assert.ok(game.issues.length); assert.deepEqual(input, before)
    }
    const items = sourceItems(types[0]); delete items[0].gameBoard.cards[0].imageSrc
    assert.equal(convertRecipe(custom(types[0], items)).questions.length, 15)
  })

  await test('Loto reads the caller once and rejects missing callers, repeated IDs, malformed panels and words absent from the caller', () => {
    for (const change of [
      items => { items.splice(sourceIndex(items, types[1]), 1) },
      items => { items.push(structuredClone(items[sourceIndex(items, types[1])])) },
      items => { const cards = items[sourceIndex(items, types[1])].gameBoard.cards; cards[1].id = cards[0].id },
      items => { items[0].gameBoard.panels[0].cards[0].text = 'mot absent du lot animateur' },
      items => { items[0].gameBoard.panels[0].cols = 0 },
      items => { items[0].gameBoard.panels = null },
      items => { items[1].gameBoard.panels[0].cards.push({ id: 'back-answer', text: 'réponse cachée' }) },
      items => { items[1].libreError = 'Grille non validée' },
    ]) {
      const items = sourceItems(types[1]); change(items)
      const input = custom(types[1], items), before = structuredClone(input), game = convertRecipe(input)
      assert.equal(game.questions.length, 0); assert.ok(game.issues.length); assert.deepEqual(input, before)
    }
    const items = sourceItems(types[1]); delete items[sourceIndex(items, types[1])].gameBoard.cards[0].imageSrc
    const partial = convertRecipe(custom(types[1], items)); assert.equal(partial.questions.length, 26); assert.match(partial.issues[0].reason, /image absente/)
  })

  await test('shared words and replacement images remain teacher-led; overrides apply once and printed padding cannot create extra questions', () => {
    for (const type of types) {
      const items = sourceItems(type), index = sourceIndex(items, type), [first, second, third] = items[index].gameBoard.cards
      const input = custom(type, items, { imageOverrides: { [first.imageSrc]: second.imageSrc } }), before = structuredClone(input)
      const game = convertRecipe(input)
      for (const q of game.questions.filter(q => [0, 1].includes(q.source.part))) {
        assert.equal(q.mode, 'oral'); assert.deepEqual(q.choices, []); assert.equal(game.corrections[q.id].choiceId, undefined)
        assert.equal(q.matchingGroup, undefined); assert.deepEqual(q.images, [second.imageSrc])
        assert.equal(game.corrections[q.id].text.split(' / ').length, 2)
      }
      assert.deepEqual(input, before)
      const duplicated = sourceItems(type), di = sourceIndex(duplicated, type), [a, b] = duplicated[di].gameBoard.cards
      const previous = type === types[0] ? b.dominoWord : b.text, replacement = type === types[0] ? a.dominoWord : a.text
      if (type === types[0]) {
        b.dominoWord = replacement
        duplicated[di].gameBoard.cards.find(c => c.textRight === previous).textRight = replacement
      } else {
        b.text = replacement
        for (const item of duplicated) for (const panel of item.gameBoard.panels ?? []) for (const card of panel.cards) if (card.text === previous) card.text = replacement
      }
      const shared = convertRecipe(custom(type, duplicated))
      for (const q of shared.questions.filter(q => [0, 1].includes(q.source.part))) { assert.equal(q.mode, 'oral'); assert.equal(shared.corrections[q.id].choiceId, undefined) }
      const chained = convertRecipe(custom(type, items, { imageOverrides: { [first.imageSrc]: second.imageSrc, [second.imageSrc]: third.imageSrc } }))
      assert.deepEqual(chained.questions.find(q => q.source.part === 0).images, [second.imageSrc])
      for (const count of [1, 2, 7, 13]) {
        const small = convertRecipe(recipe(type, 1, count))
        assert.equal(small.questions.length, count)
        if (count === 1) { assert.equal(small.questions[0].mode, 'oral'); assert.equal(small.corrections[small.questions[0].id].choiceId, undefined) }
        else {
          assert.ok(small.questions.every(q => q.mode === 'choice'))
          const groups = new Map(); for (const q of small.questions) groups.set(q.matchingGroup.groupId, (groups.get(q.matchingGroup.groupId) ?? 0) + 1)
          assert.ok([...groups.values()].every(size => size >= 2 && size <= 6))
        }
      }
    }
  })

  await test('caps, custom order, selected questions and teacher sheets keep source words, groups and the verified answer', () => {
    for (const type of types) {
      const source = convertRecipe(recipe(type)), before = structuredClone(source)
      for (const maxChoices of [2, 3, 4, 5, 6]) {
        const game = prepareGame(applyPlanOptions(source, { ...DEFAULT_PLAN_OPTIONS, maxChoices, orderMode: 'custom', customOrder: source.questions.map(positionOf).reverse() }))
        assert.deepEqual(game.questions.map(positionOf), source.questions.map(positionOf).reverse())
        const rows = teacherSheetRows(game, PALETTE.map(entry => entry.color), defaultShapes)
        for (const [i, q] of game.questions.entries()) {
          assert.equal(answer(game, q), answer(source, q)); assert.ok(q.choices.length <= maxChoices)
          assert.equal(rows[i].answer, answer(game, q)); assert.equal(rows[i].card.letter, PALETTE[q.choices.findIndex(c => c.id === correct(game, q))].letter)
        }
      }
      const partial = prepareGame(source, [source.questions[0].id, source.questions.at(-1).id])
      assert.equal(partial.questions.length, 2); assert.deepEqual(source, before)
    }
  })

  await test('new generated sessions renew their image order while preserving saved recipes and source pair meanings', () => {
    for (const type of types) {
      const input = recipe(type), before = structuredClone(input), orders = new Set()
      let source = createGameSource({ recipe: input, name: 'Dominos et Loto' }, 'saved', 'deck-' + type)
      for (let i = 0; i < 8; i++) {
        const game = convertRecipe(source.recipe); orders.add(JSON.stringify(game.questions.map(q => q.images)))
        const config = source.recipe.pages[0]
        for (const q of game.questions) assert.equal(answer(game, q), config.gameEntries.find(e => e.imageSrc === q.images[0]).text)
        source = renewGameSource(source, null)
      }
      assert.ok(orders.size > 1); assert.deepEqual(input, before)
    }
  })

  await test('collective Class and automatic Solo preserve progressive groups, independent decks, scores and durable checkpoints', async () => {
    const game = prepareGame(convertRecipe({ ...base, seed: 1, libreMode: false, pages: types.map(config) })), before = structuredClone(game)
    let collective = startSession(game, 'class')
    assert.equal(transition(game, collective, { type: 'SELECT', choiceId: correct(game, game.questions[0]) }), collective)
    collective = reveal(game, collective)
    assert.equal(usedMatchingChoices(game, collective, game.questions[1]).length, 1)
    assert.deepEqual(usedMatchingChoices(game, collective, game.questions.find(q => q.source.page === 1)), [])
    let solo = startSession(game, 'solo')
    for (const [index, kind] of ['correct', 'wrong', 'timeout'].entries()) {
      const q = game.questions[index], used = usedMatchingChoices(game, solo, q)
      if (index) assert.equal(transition(game, solo, { type: 'SELECT', choiceId: used[0] }), solo)
      solo = transition(game, solo, kind === 'timeout' ? { type: 'TIMEOUT' } : { type: 'SELECT', choiceId: kind === 'correct' ? correct(game, q) : q.choices.find(c => c.id !== correct(game, q) && !used.includes(c.id)).id })
      assert.equal(solo.phase, 'revealed'); assert.equal(solo.history.at(-1).correct, kind === 'correct')
      solo = transition(game, solo, { type: 'NEXT' })
    }
    const record = compactSession(await newRecord(game, 'solo'), solo)
    assert.deepEqual(replaySession(game, record, await planIdentity(game), Date.now(), 'solo').state, solo)
    assert.equal(matchingSummary(game, solo).reduce((sum, group) => sum + group.correct, 0), 1)
    assert.deepEqual(game, before)
  })

  await test('competition keeps prior matches unavailable for both players and retains original image paths without revealing the current key', () => {
    for (const type of types) {
      const source = prepareGame(convertRecipe(recipe(type))), selected = prepareGame(source, source.questions.slice(0, 2).map(q => q.id))
      const quiz = parseCompetitionQuiz(competitionQuiz(selected, 'https://clairfle.example'))
      let room = createCompetition(quiz, { enabled: false, seconds: 30, feedbackSeconds: 1, speedPoints: false }, 'online', 'ABC234', 1000)
      for (const avatarId of ['panda', 'fox']) room = competitionStep(room, { type: 'join', avatarId }, 1100)
      room = competitionStep(room, { type: 'start' }, 1200)
      const q = quiz.items[0], initial = competitionView(room, 1300, 'p1')
      assert.equal(initial.correctChoiceId, undefined); assert.doesNotMatch(JSON.stringify(initial), /dominoWord|correctChoiceId/)
      assert.equal(initial.question.images[0], new URL(selected.questions[0].images[0], 'https://clairfle.example').href)
      room = competitionStep(room, { type: 'answer', playerId: 'p1', questionId: q.question.id, choiceId: q.correctChoiceId }, 1400)
      assert.equal(competitionView(room, 1401, 'p2').correctChoiceId, undefined)
      room = competitionStep(room, { type: 'answer', playerId: 'p2', questionId: q.question.id, choiceId: q.question.choices.find(c => c.id !== q.correctChoiceId).id }, 1500)
      assert.equal(competitionView(room, 1501, 'p1').correctChoiceId, q.correctChoiceId)
      room = competitionStep(room, { type: 'next' }, 1600)
      const next = competitionView(room, 1601, 'p1'), used = next.question.choices.find(c => c.text === q.question.choices.find(c => c.id === q.correctChoiceId).text)
      assert.ok(next.unavailableChoiceIds.includes(used.id)); assert.equal(next.correctChoiceId, undefined)
      assert.throws(() => competitionStep(room, { type: 'answer', playerId: 'p1', questionId: next.question.id, choiceId: used.id }, 1700), error => error.status === 400)
      assert.equal(competitionView(room, 1701, 'p2').question.id, next.question.id)
    }
  })
} finally { await server.close() }
