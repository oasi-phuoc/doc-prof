import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { runtimeFor, questionsForAttempt } = await server.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
  const { compactSession, replaySession, planIdentity, remainingFor } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const choices = Array.from({ length: 6 }, (_, i) => ({ id: `c${i}`, text: String(i) }))
  const game = { id: 'round-runtime', seed: 1234, title: 'Private source', issues: [], questions: [
    { id: 'q1', prompt: 'Private calculation', mode: 'choice', choices, images: [] },
    { id: 'q2', prompt: 'Private listening', mode: 'choice', choices, images: [], audio: '/listening.mp3' },
    { id: 'q3', prompt: 'Private oral', mode: 'sequence', choices: [], images: ['/1.webp', '/2.webp', '/3.webp', '/4.webp'], hints: ['Une relance', 'Une autre'] },
  ], corrections: { q1: { choiceId: 'c2', text: 'Private solution' }, q2: { choiceId: 'c4', text: 'Private answer' }, q3: { text: 'Private model' } } }
  const at = 1_000_000
  const step = (state, type, extra = {}) => transition(game, state, { type, ...extra }, at)
  const discuss = (state) => step(step(state, 'CARDS_UP'), 'DISCUSS')
  await test('navigation restores every visited phase and never reveals an unvisited question', () => {
    let state = step(discuss(startSession(game)), 'REVEAL')
    state = step(state, 'NEXT')
    state = discuss(state)
    state = step(state, 'NAVIGATE', { index: 0 })
    assert.equal(state.phase, 'revealed')
    assert.equal(state.history.length, 1)
    state = step(state, 'NAVIGATE', { index: 1 })
    assert.equal(state.phase, 'discussion')
    state = step(state, 'NAVIGATE', { index: 2 })
    assert.equal(state.phase, 'thinking')
    assert.equal(state.history.length, 1)
    assert.equal(step(state, 'NAVIGATE', { index: 99 }), state)
    assert.equal(step(state, 'NAVIGATE', { index: -1 }), state)
    assert.equal(step(state, 'NAVIGATE', { index: 1.5 }), state)
    const paused = step(state, 'PAUSE')
    assert.equal(step(paused, 'NAVIGATE', { index: 0 }), paused)
  })
  await test('Solo selections and verdicts survive leaving and returning; delayed events cannot affect another screen', () => {
    let state = step(startSession(game, 'solo'), 'SELECT', { questionId: 'q1', choiceId: 'c1' })
    state = step(state, 'NEXT')
    assert.equal(step(state, 'TIMEOUT', { roundId: 'q1' }), state)
    state = step(state, 'SELECT', { questionId: 'q2', choiceId: 'c4' })
    state = step(state, 'PREVIOUS')
    assert.equal(state.phase, 'revealed')
    assert.equal(state.selections.q1, 'c1')
    assert.equal(state.history[0].correct, false)
    state = step(state, 'NEXT')
    assert.equal(state.phase, 'revealed')
    assert.equal(state.selections.q2, 'c4')
    assert.equal(state.history.length, 2)
  })
  await test('new attempts archive counts and results, reset only the current question and move shuffled answer slots', () => {
    let state = discuss(startSession(game))
    state = step(state, 'MANUAL_VOTE_SET', { questionId: 'q1', vote: { counts: { c2: 4 }, shared: true } })
    state = step(state, 'REVEAL')
    const original = structuredClone(state)
    const source = structuredClone(game)
    for (let attempt = 1; attempt <= 8; attempt++) {
      const previous = questionsForAttempt(game, 0, attempt - 1).find((q) => q.id === 'q1').choices
      state = step(state, 'RETRY_QUESTION', { roundId: 'q1' })
      assert.equal(state.phase, 'thinking')
      assert.equal(state.history.length, 0)
      assert.equal(state.manualVotes.q1, undefined)
      assert.equal(runtimeFor(game, state).attempt, attempt)
      const next = questionsForAttempt(game, 0, attempt).find((q) => q.id === 'q1').choices
      assert.notEqual(previous.findIndex((c) => c.id === 'c2'), next.findIndex((c) => c.id === 'c2'))
      assert.deepEqual(next.map((c) => c.id).sort(), choices.map((c) => c.id).sort())
      state = step(discuss(state), 'REVEAL')
      assert.equal(state.history.length, 1)
    }
    assert.equal(state.previousAttempts.length, 8)
    assert.equal(state.previousAttempts[0].manualVotes.q1.counts.c2, 4)
    state.previousAttempts[0].manualVotes.q1.counts.c2 = 99
    assert.equal(original.manualVotes.q1.counts.c2, 4)
    assert.deepEqual(game, source)
    const fixed = { ...game, questions: [{ ...game.questions[0], choiceOrderPolicy: 'fixed' }] }
    assert.deepEqual(questionsForAttempt(fixed, 0, 1)[0].choices, fixed.questions[0].choices)
  })
  await test('oral image order, revealed hints and completed audio survive navigation with stale events refused', () => {
    let state = step(startSession(game), 'NAVIGATE', { index: 2 })
    state = step(state, 'IMAGE_ORDER_SET', { questionId: 'q3', order: [1, 0, 2, 3] })
    state = step(state, 'CARDS_UP')
    state = step(state, 'HINT_SHOW', { questionId: 'q3' })
    state = step(state, 'NAVIGATE', { index: 1 })
    state = step(state, 'AUDIO_STATE', { roundId: 'q2', status: 'ended' })
    state = step(state, 'NAVIGATE', { index: 2 })
    assert.deepEqual(runtimeFor(game, state).imageOrders.q3, [1, 0, 2, 3])
    assert.equal(runtimeFor(game, state).hintsShown.q3, 1)
    assert.equal(runtimeFor(game, state, 1).audioComplete, true)
    assert.equal(step(state, 'AUDIO_STATE', { roundId: 'q2', status: 'ended' }), state)
    assert.equal(step(state, 'IMAGE_ORDER_SET', { questionId: 'q3', order: [0, 0, 2, 3] }), state)
    assert.equal(step(state, 'HINT_SHOW', { questionId: 'q2' }), state)
  })
  await test('checkpoint copies round states and previous attempts, rejecting inconsistent or corrupt runtime data', async () => {
    const planId = await planIdentity(game)
    let state = step(discuss(startSession(game)), 'REVEAL')
    state = step(state, 'RETRY_QUESTION', { roundId: 'q1' })
    state = step(discuss(state), 'REVEAL')
    state = step(state, 'NAVIGATE', { index: 2 })
    state = step(state, 'IMAGE_ORDER_SET', { questionId: 'q3', order: [1, 0, 2, 3] })
    const record = { schemaVersion: 4, mode: 'class', sessionId: 'round-session', gameId: game.id, planId, updatedAt: at, events: [] }
    const compacted = compactSession(record, state)
    const resumed = replaySession(game, compacted, planId, at)
    assert.deepEqual(resumed.state, state)
    state.roundStates.q3.imageOrders.q3[0] = 2
    assert.equal(compacted.checkpoint.state.roundStates.q3.imageOrders.q3[0], 1)
    const invalid = [
      { ...resumed.state, roundStates: { ...resumed.state.roundStates, foreign: resumed.state.roundStates.q1 } },
      { ...resumed.state, roundStates: { ...resumed.state.roundStates, q3: { ...resumed.state.roundStates.q3, imageOrders: { q3: [0, 0, 2, 3] } } } },
      { ...resumed.state, previousAttempts: undefined },
      { ...resumed.state, history: [] },
    ]
    for (const state of invalid) assert.throws(() => replaySession(game, { ...compacted, checkpoint: { state } }, planId, at), /Instantané/)
    assert.ok(!JSON.stringify(compacted).includes('Private calculation'))
    assert.ok(!JSON.stringify(compacted).includes('Private solution'))
  })
  await test('legacy snapshots recover proven corrected phases and keep unknown questions unrevealed', async () => {
    const planId = await planIdentity(game)
    const legacy = { ...startSession(game), index: 1, phase: 'discussion', history: [{ questionId: 'q1' }] }
    delete legacy.roundStates
    for (const schemaVersion of [2, 3]) {
      const record = { schemaVersion, mode: 'class', sessionId: 'legacy', gameId: game.id, planId, updatedAt: at, events: [], checkpoint: { state: legacy } }
      const restored = replaySession(game, record, planId, at).state
      assert.equal(step(restored, 'NAVIGATE', { index: 0 }).phase, 'revealed')
      assert.equal(step(restored, 'NAVIGATE', { index: 2 }).phase, 'thinking')
      assert.equal(record.schemaVersion, schemaVersion)
    }
  })
  await test('independent clock snapshots validate round and attempt identities and preserve the legacy clock', async () => {
    const planId = await planIdentity(game)
    const clock = { roundId: 'q1', phase: 'thinking', durationMs: 30000, remainingMs: 12750, attempt: 1 }
    const second = { ...clock, roundId: 'q2', remainingMs: 21000, attempt: 0 }
    const record = { schemaVersion: 4, mode: 'class', sessionId: 'clocks', gameId: game.id, planId, updatedAt: at, events: [], clock, clocks: { q1: clock, q2: second } }
    const restored = replaySession(game, record, planId, at)
    assert.deepEqual(restored.record.clocks, record.clocks)
    assert.deepEqual(restored.record.clock, clock)
    assert.equal(remainingFor(clock, 'q1', 'thinking', 30000, 0), undefined)
    assert.equal(remainingFor(clock, 'q1', 'thinking', 30000, 1), 12750)
    assert.throws(() => replaySession(game, { ...record, clocks: { wrong: clock } }, planId, at), /Minuteurs/)
    assert.throws(() => replaySession(game, { ...record, clocks: { q1: { ...clock, attempt: -1 } } }, planId, at), /Minuteur/)
  })
  await test('finishing and reopening never resets the last corrected question or creates a duplicate result', () => {
    let state = step(discuss(startSession(game)), 'REVEAL')
    state = step(state, 'FINISH')
    state = step(state, 'REOPEN', { index: 0 })
    assert.equal(state.finished, false)
    assert.equal(state.phase, 'revealed')
    assert.equal(state.history.filter((a) => !a.skipped).length, 1)
  })
} finally { await server.close() }
