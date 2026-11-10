import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { replaySession, planIdentity, compactSession } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const game = { id: 'checkpoint-test', title: 'Private source title', questions: [1, 2].map((n) => ({ id: `q${n}`, prompt: 'Private prompt', mode: 'choice', images: [], choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }] })), corrections: { q1: { choiceId: 'b', text: 'Private solution' }, q2: { choiceId: 'a', text: 'Another private solution' } }, issues: [] }
  const planId = await planIdentity(game)
  const now = Date.now()
  const record = (actions, mode = 'class') => ({ schemaVersion: 1, mode, sessionId: 'checkpoint-session', gameId: game.id, planId, updatedAt: now, events: actions.map((action, index) => ({ eventId: `e${index}`, at: now, action })) })
  const count = { type: 'MANUAL_VOTE_SET', questionId: 'q1', vote: { counts: { a: 2, b: 4 }, shared: false, present: 7 } }
  await test('compaction preserves a class vote, counts and pause without revealing or storing the source', () => {
    const original = record([{ type: 'CARDS_UP' }, count, { type: 'PAUSE' }])
    const { state } = replaySession(game, original, planId, now)
    const compacted = compactSession(original, state)
    assert.equal(compacted.schemaVersion, 2)
    assert.equal(compacted.events.length, 0)
    assert.deepEqual(replaySession(game, compacted, planId, now).state, state)
    assert.equal(compacted.checkpoint.state.phase, 'cards-up')
    assert.deepEqual(compacted.checkpoint.state.history, [])
    assert.equal(compacted.checkpoint.state.paused, true)
    assert.equal(original.schemaVersion, 1)
    assert.equal(original.events.length, 3)
    const json = JSON.stringify(compacted)
    for (const value of ['Private prompt', 'Private solution', 'Private source title', 'corrections']) assert.ok(!json.includes(value))
    state.manualVotes.q1.counts.a = 99
    assert.equal(compacted.checkpoint.state.manualVotes.q1.counts.a, 2)
  })
  await test('finished checkpoint keeps teacher marks and notes; later notes compact without losing the summary', () => {
    const original = record([{ type: 'CARDS_UP' }, count, { type: 'DISCUSS' }, { type: 'REVEAL' }, { type: 'NEXT' }, { type: 'SKIP' }, { type: 'TEACHER_MARK_SET', questionId: 'q1', value: 'review' }, { type: 'SESSION_NOTE_SET', note: 'Revoir les retenues.' }])
    const { state } = replaySession(game, original, planId, now)
    assert.equal(state.finished, true)
    const compacted = compactSession(original, state)
    const edited = { ...compacted, events: [{ eventId: 'after-checkpoint', at: now, action: { type: 'SESSION_NOTE_SET', note: 'Revoir les retenues, puis expliquer.' } }] }
    const resumed = replaySession(game, edited, planId, now)
    assert.equal(resumed.state.teacherMarks.q1, 'review')
    assert.equal(resumed.state.note, 'Revoir les retenues, puis expliquer.')
    assert.deepEqual(resumed.state.history, state.history)
    assert.deepEqual(replaySession(game, compactSession(resumed.record, resumed.state), planId, now).state, resumed.state)
  })
  await test('solo checkpoint retains the selected answer, verdict and remaining feedback time', () => {
    const original = { ...record([{ type: 'SELECT', questionId: 'q1', choiceId: 'b' }, { type: 'PAUSE' }], 'solo'), clock: { roundId: 'q1', phase: 'revealed', durationMs: 7000, remainingMs: 2900 } }
    const { state } = replaySession(game, original, planId, now, 'solo')
    const restored = replaySession(game, compactSession(original, state), planId, now, 'solo')
    assert.deepEqual(restored.state, state)
    assert.equal(restored.record.clock.remainingMs, 2900)
    assert.equal(restored.state.history[0].correct, true)
  })
  await test('corrupt or source-mismatched checkpoints are refused without changing the saved object', () => {
    const original = record([{ type: 'CARDS_UP' }])
    const compacted = compactSession(original, replaySession(game, original, planId, now).state)
    for (const patch of [{ index: 99 }, { phase: 'unknown' }, { finished: true }, { note: 'x'.repeat(2001) }, { corrections: game.corrections }, { history: [{ questionId: 'foreign' }] }, { manualVotes: { q1: { counts: { a: -1 }, shared: false } } }, { selections: { q1: 'b' }, selected: 'b' }]) {
      const broken = { ...compacted, checkpoint: { ...compacted.checkpoint, state: { ...compacted.checkpoint.state, ...patch } } }
      assert.throws(() => replaySession(game, broken, planId, now), /Instantané/)
    }
    assert.equal(compacted.checkpoint.state.phase, 'cards-up')
    assert.throws(() => replaySession(game, { ...compacted, schemaVersion: 3 }, planId, now), /Version/)
    assert.throws(() => compactSession(original, { ...compacted.checkpoint.state, gameId: 'other-game' }), /changé/)
  })
  await test('new journal segment deduplicates repeated events and the checkpoint boundary', () => {
    const original = record([{ type: 'CARDS_UP' }, { type: 'DISCUSS' }, { type: 'REVEAL' }])
    const compacted = compactSession(original, replaySession(game, original, planId, now).state)
    const next = { eventId: 'next-screen', at: now, action: { type: 'NEXT' } }
    const resumed = replaySession(game, { ...compacted, events: [original.events.at(-1), next, next] }, planId, now)
    assert.equal(resumed.state.index, 1)
    assert.equal(resumed.state.phase, 'thinking')
    assert.equal(resumed.state.history.length, 1)
    assert.equal(resumed.record.events.length, 1)
  })
} finally { await server.close() }
