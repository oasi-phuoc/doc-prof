import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({
  server: { middlewareMode: true, hmr: { port: 0 } },
  appType: 'custom',
})
try {
  const { convertRecipe, numberChoices } = await server.ssrLoadModule(
    '/src/interactive/domain/convert.ts',
  )
  const { startSession, transition } = await server.ssrLoadModule(
    '/src/interactive/domain/session.ts',
  )
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { parseInteractiveDraft } = await server.ssrLoadModule(
    '/src/interactive/navigation.ts',
  )
  const { buildWorksheets } = await server.ssrLoadModule(
    '/src/math/generate.ts',
  )
  const recipe = demoRecipe()
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
    assert.equal(state.phase, 'selected')
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
    assert.equal(state.phase, 'thinking')
    const priorHistory = state.history
    state = step(state, 'SKIP')
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
} finally {
  await server.close()
}
