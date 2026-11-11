import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
import { classroomRecipe } from './classroom-fixture.mjs'
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})
try {
  const { convertRecipe, numberChoices } = await server.ssrLoadModule(
    '/src/interactive/domain/convert.ts',
  )
  const { startSession, transition } = await server.ssrLoadModule(
    '/src/interactive/domain/session.ts',
  )
  const { prepareGame, roundsFor, excludeQuestions } =
    await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { PALETTE, inkForColor } = await server.ssrLoadModule(
    '/src/interactive/domain/palette.ts',
  )
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { parseInteractiveDraft } = await server.ssrLoadModule(
    '/src/interactive/navigation.ts',
  )
  const { buildWorksheets } = await server.ssrLoadModule(
    '/src/math/generate.ts',
  )
  const { advanceAction } = await server.ssrLoadModule(
    '/src/interactive/domain/progression.ts',
  )
  const recipe = demoRecipe()
  await test('default pastel cards provide black marks with at least AAA text contrast', () => {
    for (const card of PALETTE) {
      assert.equal(inkForColor(card.color), '#000000')
      const channels = [1, 3, 5].map(
        (i) => parseInt(card.color.slice(i, i + 2), 16) / 255,
      )
      const linear = channels.map((c) =>
        c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
      )
      const luminance =
        0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
      assert.ok(
        (luminance + 0.05) / 0.05 >= 7,
        `Insufficient contrast for card ${card.letter}`,
      )
    }
  })
  await test('temporary uploads survive handoff without changing saved recipe parsing', () => {
    const result = parseInteractiveDraft({
      recipe,
      name: 'Brouillon',
      temporaryImages: {
        '/lib/images/source.webp': 'blob:temporary-test',
        invalid: 'javascript:invalid',
      },
    })
    assert.equal(
      result.recipe.imageOverrides['/lib/images/source.webp'],
      'blob:temporary-test',
    )
    assert.equal(result.recipe.imageOverrides.invalid, undefined)
    assert.equal(recipe.imageOverrides, undefined)
  })
  const game = convertRecipe(recipe)
  const step = (state, type, extra = {}) =>
    transition(game, state, { type, ...extra })
  await test('four required scenarios use generated source and deterministic IDs', () => {
    assert.deepEqual(convertRecipe(recipe), game)
    assert.equal(
      new Set(game.questions.map((q) => q.id)).size,
      game.questions.length,
    )
    assert.equal(game.questions[0].prompt, '788 + 771 = ?')
    assert.match(game.corrections[game.questions[0].id].text, /1.?559/)
    assert.ok(game.questions.some((q) => q.figure?.dims.side === 349))
    assert.ok(
      game.questions.filter((q) => q.audio).length >= 6,
      JSON.stringify(game.issues),
    )
    assert.ok(
      game.questions.some(
        (q) => q.mode === 'sequence' && q.images.length === 4,
      ),
      JSON.stringify(game.issues),
    )
    for (const q of game.questions) {
      assert.ok(!('answer' in q))
      assert.ok(!('correct' in q))
      for (const c of q.choices) assert.ok(!('correct' in c))
    }
  })
  await test('integer distractors are distinct, correct, deterministic and nonnegative', () => {
    for (const value of [0, 1, 83, 1559, 121801, -20])
      for (let seed = 1; seed < 30; seed++) {
        const result = numberChoices(value, seed)
        assert.deepEqual(result, numberChoices(value, seed))
        assert.ok(result.choices.length >= 2 && result.choices.length <= 6)
        assert.equal(
          new Set(result.choices.map((c) => c.id)).size,
          result.choices.length,
        )
        assert.equal(
          result.choices.filter((c) => c.id === result.correctId).length,
          1,
        )
        if (value >= 0)
          assert.ok(result.choices.every((c) => !c.id.startsWith('n-')))
      }
  })
  await test('reveal, discussion and next cannot be bypassed', () => {
    let state = startSession(game)
    for (const type of ['REVEAL', 'NEXT', 'DISCUSS'])
      assert.deepEqual(step(state, type), state)
    assert.deepEqual(
      step(state, 'SELECT', { choiceId: game.questions[0].choices[0].id }),
      state,
    )
    state = step(state, 'CARDS_UP')
    assert.deepEqual(step(state, 'SELECT', { choiceId: 'invalid' }), state)
    state = step(state, 'SELECT', { choiceId: game.questions[0].choices[0].id })
    assert.equal(state.phase, 'cards-up')
    assert.equal(state.history.length, 0)
    assert.deepEqual(step(state, 'REVEAL'), state)
    state = step(state, 'DISCUSS')
    state = step(state, 'REVEAL')
    assert.equal(state.phase, 'revealed')
    assert.equal(state.index, 0)
    assert.equal(state.history.length, 1)
    assert.deepEqual(step(state, 'REVEAL'), state)
    assert.deepEqual(step(state, 'SKIP'), state)
    state = step(state, 'NEXT')
    assert.equal(state.index, 1)
    assert.equal(state.phase, 'thinking')
    state = step(state, 'PREVIOUS')
    assert.equal(state.index, 0)
    assert.equal(state.phase, 'revealed')
    const priorHistory = state.history
    assert.equal(step(state, 'SKIP'), state)
    state = step(state, 'NEXT')
    assert.deepEqual(state.history, priorHistory)
    assert.equal(state.index, 1)
  })
  await test('pause blocks all game actions until resume', () => {
    const state = step(startSession(game), 'PAUSE')
    for (const type of ['CARDS_UP', 'REVEAL', 'NEXT', 'SKIP'])
      assert.deepEqual(step(state, type), state)
    assert.equal(step(state, 'RESUME').paused, false)
  })
  await test('skip and finish produce only actual actions, no fabricated score', () => {
    let state = startSession(game)
    for (let i = 0; i < game.questions.length; i++) state = step(state, 'SKIP')
    assert.equal(state.finished, true)
    assert.equal(state.history.length, game.questions.length)
    assert.ok(state.history.every((a) => a.skipped && a.correct === undefined))
    assert.deepEqual(step(state, 'NEXT'), state)
  })
  await test('three-choice QCM is preserved; duplicate/ambiguous answers rejected', () => {
    const config = {
      ...recipe.pages[0],
      libreItems: [
        {
          layout: 'select',
          prompt: 'Choisissez.',
          answer: 'deux',
          options: ['un', 'deux', 'trois'],
        },
      ],
    }
    const g = convertRecipe({ ...recipe, pages: [config] })
    assert.equal(g.questions[0].choices.length, 3)
    for (const options of [['un', 'un'], ['un', 'trois'], ['deux']]) {
      const rejected = convertRecipe({
        ...recipe,
        pages: [
          { ...config, libreItems: [{ ...config.libreItems[0], options }] },
        ],
      })
      assert.equal(rejected.questions.length, 0)
      assert.ok(rejected.issues.length)
    }
  })
  await test('wrong arithmetic correction never becomes a playable QCM', () => {
    const r = structuredClone(recipe)
    r.pages = [r.pages[0]]
    r.pages[0].libreItems[0].answer = '1560'
    r.pages[0].libreItems = [r.pages[0].libreItems[0]]
    assert.equal(convertRecipe(r).questions.length, 0)
  })
  await test('geometry rejects mismatched units and preserves verified area', () => {
    const r = structuredClone(recipe)
    r.pages = [r.pages[1]]
    let g = convertRecipe(r)
    assert.equal(g.questions.length, 1)
    const correct = g.corrections[g.questions[0].id].choiceId
    assert.equal(
      g.questions[0].choices.find((c) => c.id === correct).id,
      'n121801',
    )
    r.pages[0].libreItems[0].answer = '121801 m²'
    g = convertRecipe(r)
    assert.equal(g.questions.length, 0)
  })
  await test('libre image replacements are carried over without source mutation', () => {
    const r = structuredClone(recipe)
    r.pages = [
      {
        ...r.pages[0],
        libreItems: [
          {
            layout: 'select',
            prompt: 'Choisissez.',
            answer: 'un',
            options: ['un', 'deux'],
            optionImages: ['/lib/images/a.webp', '/lib/images/b.webp'],
          },
        ],
      },
    ]
    r.imageOverrides = { '/lib/images/a.webp': '/lib/images/new.webp' }
    const g = convertRecipe(r)
    assert.equal(g.questions[0].choices[0].image, '/lib/images/new.webp')
    assert.equal(r.pages[0].libreItems[0].optionImages[0], '/lib/images/a.webp')
  })
  await test('oral activity has manual assessment and never an automatic score', () => {
    const index = game.questions.findIndex((q) => q.mode === 'sequence')
    assert.ok(index >= 0)
    let state = { ...startSession(game), index }
    state = step(state, 'CARDS_UP')
    state = step(state, 'DISCUSS')
    state = step(state, 'REVEAL')
    assert.equal(state.history[0].correct, undefined)
    state = step(state, 'ASSESS', { value: 'retry' })
    assert.equal(state.history[0].manual, 'retry')
  })
  await test('conversion does not mutate recipe or A4 generator output', () => {
    const copy = structuredClone(recipe)
    const before = JSON.stringify(buildWorksheets(recipe.pages, recipe.seed))
    convertRecipe(recipe)
    assert.deepEqual(recipe, copy)
    assert.equal(
      JSON.stringify(buildWorksheets(recipe.pages, recipe.seed)),
      before,
    )
  })
  await test('TCF paper writing variants become real image choices and keep reading documents', async () => {
    const source = await classroomRecipe()
    const converted = convertRecipe(source)
    assert.equal(
      converted.questions.length,
      7,
      JSON.stringify(converted.issues),
    )
    assert.ok(converted.questions[0].context.includes('Le marché du quartier'))
    for (const q of converted.questions) {
      assert.equal(q.mode, 'choice')
      assert.equal(q.choices.length, 3)
      assert.ok(q.choices.every((choice) => choice.image.endsWith('.webp')))
      const correct = q.choices.find(
        (choice) => choice.id === converted.corrections[q.id].choiceId,
      )
      assert.match(correct.image, /5-tomates/)
      assert.equal(converted.corrections[q.id].text, '')
    }
    assert.deepEqual(source, await classroomRecipe())
  })
  await test('one recording keeps at most two questions deterministically with separate selections and verdicts', async () => {
    const source = await classroomRecipe()
    const converted = convertRecipe(source)
    const planned = prepareGame(converted)
    assert.deepEqual(planned, prepareGame(converted))
    assert.equal(planned.questions.length, 3)
    assert.equal(roundsFor(planned).length, 2)
    assert.equal(roundsFor(planned)[1].questionIds.length, 2)
    assert.ok(
      planned.issues.some((issue) =>
        /2 questions retenues sur 6/.test(issue.reason),
      ),
    )
    const pair = planned.questions.filter((q) => q.audio)
    let state = { ...startSession(planned), index: 1 }
    const send = (type, extra = {}) => {
      state = transition(planned, state, { type, ...extra })
    }
    send('CARDS_UP')
    send('SELECT', {
      questionId: pair[0].id,
      choiceId: planned.corrections[pair[0].id].choiceId,
    })
    assert.equal(state.phase, 'cards-up')
    send('DISCUSS')
    assert.equal(state.phase, 'discussion')
    send('SELECT', {
      questionId: pair[1].id,
      choiceId: pair[1].choices.find(
        (c) => c.id !== planned.corrections[pair[1].id].choiceId,
      ).id,
    })
    assert.equal(state.phase, 'discussion')
    send('DISCUSS')
    send('REVEAL')
    assert.equal(state.history.length, 2)
    assert.equal(state.history[0].correct, undefined)
    assert.equal(state.history[1].correct, undefined)
    assert.notEqual(state.history[0].questionId, state.history[1].questionId)
    send('NEXT')
    assert.equal(state.finished, true)
  })
  await test('paired audio reduction preserves verified answers and original choice identities', async () => {
    const converted = convertRecipe(await classroomRecipe())
    const audio = converted.questions.filter((q) => q.audio)
    for (const q of audio)
      q.choices.push({ id: 'fourth', text: 'Autre proposition de la banque' })
    const copy = structuredClone(converted)
    const planned = prepareGame(converted)
    for (const q of planned.questions.filter((q) => q.audio)) {
      assert.equal(q.choices.length, 3)
      assert.ok(
        q.choices.some((c) => c.id === planned.corrections[q.id].choiceId),
      )
      assert.ok(
        q.choices.every((c) =>
          converted.questions
            .find((source) => source.id === q.id)
            .choices.some((original) => original.id === c.id),
        ),
      )
    }
    assert.deepEqual(converted, copy)
  })
  await test('skipping a paired screen records each source question exactly once', async () => {
    const planned = prepareGame(convertRecipe(await classroomRecipe()))
    let state = transition(planned, startSession(planned), { type: 'SKIP' })
    state = transition(planned, state, { type: 'SKIP' })
    assert.equal(state.finished, true)
    assert.equal(state.history.length, planned.questions.length)
    assert.equal(
      new Set(state.history.map((a) => a.questionId)).size,
      planned.questions.length,
    )
    assert.ok(state.history.every((a) => a.skipped && a.correct === undefined))
  })
  await test('media exclusions filter the resolved plan without reselecting alternative questions', async () => {
    const source = convertRecipe(await classroomRecipe())
    const selected = source.questions.map((q) => q.id)
    const planned = prepareGame(source, selected)
    const snapshot = structuredClone(planned)
    const audio = planned.questions.filter((q) => q.audio)
    const filtered = excludeQuestions(planned, new Set([audio[0].id]))
    assert.equal(filtered.questions.length, 2)
    assert.deepEqual(filtered.rounds[1].questionIds, [audio[1].id])
    assert.ok(!filtered.corrections[audio[0].id])
    assert.notEqual(filtered.id, planned.id)
    assert.deepEqual(planned, snapshot)
    assert.equal(selected.length, source.questions.length)
    assert.equal(excludeQuestions(planned, new Set()), planned)
  })
  await test('teacher progression needs no board selection and never advances while paused', () => {
    let state = startSession(game)
    assert.deepEqual(advanceAction(game, state), { type: 'CARDS_UP' })
    state = step(state, 'CARDS_UP')
    assert.deepEqual(advanceAction(game, state), { type: 'DISCUSS' })
    state = step(state, 'SELECT', { choiceId: game.questions[0].choices[0].id })
    assert.deepEqual(advanceAction(game, state), { type: 'DISCUSS' })
    assert.equal(advanceAction(game, { ...state, paused: true }), undefined)
    state = step(state, 'DISCUSS')
    assert.deepEqual(advanceAction(game, state), { type: 'REVEAL' })
  })
  await test('solo selects during thinking, reveals immediately and ignores further selections', () => {
    const choiceId = game.corrections[game.questions[0].id].choiceId
    const initial = startSession(game, 'solo')
    assert.deepEqual(step(initial, 'CARDS_UP'), initial)
    const state = step(initial, 'SELECT', { choiceId })
    assert.equal(state.phase, 'revealed')
    assert.equal(state.history[0].correct, true)
    assert.deepEqual(step(state, 'SELECT', { choiceId: 'invalid' }), state)
    assert.equal(advanceAction(game, state), undefined)
    assert.equal(step(state, 'NEXT').index, 1)
  })
  await test('solo timeout is incorrect, idempotent and blocked by pause; open questions remain ungraded', () => {
    const initial = startSession(game, 'solo')
    const paused = step(initial, 'PAUSE')
    assert.deepEqual(step(paused, 'TIMEOUT'), paused)
    const state = step(initial, 'TIMEOUT')
    assert.equal(state.phase, 'revealed')
    assert.equal(state.history[0].correct, false)
    assert.equal(state.history[0].selected, undefined)
    assert.deepEqual(step(state, 'TIMEOUT'), state)
    const index = game.questions.findIndex((q) => q.mode !== 'choice')
    assert.equal(step({ ...initial, index }, 'TIMEOUT').history[0].correct, undefined)
  })
  await test('solo retains every audio question, full choices and one question per screen', async () => {
    const source = convertRecipe(await classroomRecipe())
    const planned = prepareGame(source, undefined, 'solo')
    assert.equal(planned.questions.length, source.questions.length)
    assert.equal(roundsFor(planned).length, source.questions.length)
    for (const q of planned.questions) assert.deepEqual([...q.choices].sort((a, b) => a.id.localeCompare(b.id)), [...source.questions.find((item) => item.id === q.id).choices].sort((a, b) => a.id.localeCompare(b.id)))
    assert.notEqual(planned.id, prepareGame(source).id)
  })
} finally {
  await server.close()
}
