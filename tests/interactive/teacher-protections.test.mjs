import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { advanceAction } = await server.ssrLoadModule('/src/interactive/domain/progression.ts')
  const { retractionRemaining } = await server.ssrLoadModule('/src/interactive/domain/teacher.ts')
  const { compactSession, replaySession, planIdentity, newRecord } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const game = { id: 'teacher-protections', title: 'Source privée', questions: ['q1', 'q2', 'q3'].map((id) => ({ id, mode: 'choice', prompt: 'Énoncé privé', images: [], choices: [{ id: 'a', text: 'Un' }, { id: 'b', text: 'Deux' }] })), corrections: Object.fromEntries(['q1', 'q2', 'q3'].map((id) => [id, { choiceId: 'b', text: 'Corrigé privé' }])), issues: [] }
  const at = 1_000_000
  const step = (state, type, extra = {}, time = at) => transition(game, state, { type, ...extra }, time)
  const discussion = () => step(step(startSession(game), 'CARDS_UP'), 'DISCUSS')
  await test('a locked teacher toolbar rejects progression, notes, pause, skip and finish until explicitly unlocked', () => {
    const locked = step(discussion(), 'TEACHER_LOCK_SET', { locked: true })
    for (const action of [{ type: 'REVEAL' }, { type: 'PAUSE' }, { type: 'NEXT' }, { type: 'SKIP' }, { type: 'FINISH' }, { type: 'SESSION_NOTE_SET', note: 'Autre' }]) assert.equal(transition(game, locked, action, at), locked)
    assert.equal(advanceAction(game, locked), undefined)
    const unlocked = step(locked, 'TEACHER_LOCK_SET', { locked: false })
    assert.equal(step(unlocked, 'REVEAL').phase, 'revealed')
    const paused = step(step(startSession(game), 'PAUSE'), 'TEACHER_LOCK_SET', { locked: true })
    assert.equal(step(paused, 'RESUME'), paused)
    assert.equal(step(step(paused, 'TEACHER_LOCK_SET', { locked: false }), 'RESUME').paused, false)
  })
  await test('retracting a reveal clears its current verdict without losing counts, previous questions or adding duplicate scores', () => {
    let state = step(discussion(), 'REVEAL')
    state = step(state, 'NEXT')
    state = step(step(state, 'CARDS_UP'), 'DISCUSS')
    state = step(state, 'MANUAL_VOTE_SET', { questionId: 'q2', vote: { counts: { a: 2, b: 4 }, shared: false } })
    state = step(state, 'REVEAL')
    const saved = structuredClone(state)
    const hidden = step(state, 'UNREVEAL', { roundId: 'q2' }, at + 2000)
    assert.equal(hidden.phase, 'discussion')
    assert.equal(hidden.revealedAt, undefined)
    assert.deepEqual(hidden.history.map((a) => a.questionId), ['q1'])
    assert.deepEqual(hidden.manualVotes, state.manualVotes)
    assert.equal(hidden.revealRetractions.q2, 1)
    assert.equal(step(hidden, 'UNREVEAL', { roundId: 'q2' }), hidden)
    const again = step(hidden, 'REVEAL', {}, at + 3000)
    assert.equal(again.history.length, 2)
    assert.ok(again.history.every((a) => a.correct === undefined))
    assert.deepEqual(state, saved)
  })
  await test('a reveal can only be retracted within ten seconds, on its current screen, while unpaused and unlocked', () => {
    const state = step(discussion(), 'REVEAL')
    for (const time of [at - 1, at + 10_000, at + 20_000, NaN, Infinity]) assert.equal(step(state, 'UNREVEAL', { roundId: 'q1' }, time), state)
    assert.equal(step(state, 'UNREVEAL', { roundId: 'stale-screen' }), state)
    const paused = step(state, 'PAUSE')
    assert.equal(step(paused, 'UNREVEAL', { roundId: 'q1' }), paused)
    const locked = step(state, 'TEACHER_LOCK_SET', { locked: true })
    assert.equal(step(locked, 'UNREVEAL', { roundId: 'q1' }), locked)
    assert.equal(step(state, 'UNREVEAL', { roundId: 'q1' }, at + 9999).phase, 'discussion')
    assert.equal(retractionRemaining(at, at + 4000), 6000)
    assert.equal(retractionRemaining(undefined, at), 0)
  })
  await test('a paired screen retracts both corrections together and counts each retraction once', () => {
    const paired = { ...game, rounds: [{ id: 'paired', questionIds: ['q1', 'q2'] }, { id: 'last', questionIds: ['q3'] }] }
    let state = startSession(paired)
    for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL', 'UNREVEAL']) state = transition(paired, state, { type, ...(type === 'UNREVEAL' ? { roundId: 'paired' } : {}) }, at)
    assert.deepEqual(state.history, [])
    assert.deepEqual(state.revealRetractions, { q1: 1, q2: 1 })
    assert.equal(state.phase, 'discussion')
  })
  await test('finishing early preserves completed activities and marks every untreated question as skipped without an invented result', () => {
    let state = step(discussion(), 'REVEAL')
    state = step(state, 'SESSION_NOTE_SET', { note: 'À poursuivre.' })
    const history = structuredClone(state.history)
    const finished = step(step(step(state, 'NEXT'), 'PAUSE'), 'FINISH')
    assert.equal(finished.finished, true)
    assert.equal(finished.index, 2)
    assert.equal(finished.phase, 'thinking')
    assert.equal(finished.paused, false)
    assert.equal(finished.note, 'À poursuivre.')
    assert.deepEqual(finished.history[0], history[0])
    assert.deepEqual(finished.history.slice(1), [{ questionId: 'q2', skipped: true }, { questionId: 'q3', skipped: true }])
  })
  await test('Solo keeps its immediate selection and timeout behavior and refuses teacher-only actions', () => {
    const solo = startSession(game, 'solo')
    for (const action of [{ type: 'TEACHER_LOCK_SET', locked: true }, { type: 'FINISH' }, { type: 'UNREVEAL', roundId: 'q1' }]) assert.equal(transition(game, solo, action, at), solo)
    assert.equal(step(solo, 'TIMEOUT').history[0].correct, false)
    assert.equal(step(solo, 'SELECT', { choiceId: 'b' }).history[0].correct, true)
  })
  await test('schema 3 journals and compacted snapshots preserve the lock, original reveal time and retractions across reload', async () => {
    const planId = await planIdentity(game)
    const record = { schemaVersion: 3, mode: 'class', sessionId: 'protected-session', gameId: game.id, planId, updatedAt: at + 4000, events: [
      { eventId: 'cards', at, action: { type: 'CARDS_UP' } }, { eventId: 'discuss', at, action: { type: 'DISCUSS' } },
      { eventId: 'reveal', at, action: { type: 'REVEAL' } }, { eventId: 'hide', at: at + 2000, action: { type: 'UNREVEAL', roundId: 'q1' } },
      { eventId: 'reveal-again', at: at + 3000, action: { type: 'REVEAL' } }, { eventId: 'lock', at: at + 4000, action: { type: 'TEACHER_LOCK_SET', locked: true } },
    ] }
    const loaded = replaySession(game, record, planId, at + 5000)
    assert.equal(loaded.state.teacherLocked, true)
    assert.equal(loaded.state.revealedAt, at + 3000)
    assert.equal(loaded.state.revealRetractions.q1, 1)
    assert.equal(loaded.state.history.length, 1)
    const compacted = compactSession(record, loaded.state)
    assert.deepEqual(replaySession(game, compacted, planId, at + 15_000).state, loaded.state)
    assert.equal(retractionRemaining(loaded.state.revealedAt, at + 15_000), 0)
    assert.ok(!JSON.stringify(compacted).includes('Corrigé privé'))
    assert.equal((await newRecord(game)).schemaVersion, 4)
    for (const schemaVersion of [1, 2]) assert.equal(replaySession(game, { ...record, schemaVersion, events: record.events.slice(0, 3) }, planId, at + 5000).state.phase, 'revealed')
    const brokenStates = [{ teacherLocked: 'true' }, { revealedAt: Infinity }, { revealRetractions: { foreign: 1 } }, { revealRetractions: { q1: -1 } }]
    for (const patch of brokenStates) assert.throws(() => replaySession(game, { ...compacted, checkpoint: { ...compacted.checkpoint, state: { ...compacted.checkpoint.state, ...patch } } }, planId, at + 5000), /Instantané/)
    const malformed = { ...record, events: [{ eventId: 'bad-lock', at, action: { type: 'TEACHER_LOCK_SET', locked: 'yes' } }] }
    assert.throws(() => replaySession(game, malformed, planId, at + 5000), /Journal/)
  })
} finally { await server.close() }
