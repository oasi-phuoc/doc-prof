import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { replaySession, planIdentity, newRecord, remainingFor } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const game = {
    id: 'test', title: 'Test', issues: [],
    questions: [{ id: 'q1', mode: 'choice', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], images: [], prompt: 'Question' }],
    corrections: { q1: { choiceId: 'b', text: 'Solution' } },
  }
  const planId = await planIdentity(game)
  const now = Date.now()
  function record(actions) {
    return { schemaVersion: 1, mode: 'class', sessionId: 'random-session', gameId: game.id, planId, updatedAt: now,
      events: actions.map((action, i) => ({ eventId: String(i), at: now, action })) }
  }
  const selected = [{ type: 'CARDS_UP' }]
  await test('reload preserves collective vote without revealing or creating a verdict', () => {
    const { state } = replaySession(game, record(selected), planId, now)
    assert.equal(state.phase, 'cards-up')
    assert.equal(state.selections.q1, undefined)
    assert.deepEqual(state.history, [])
  })
  await test('replay preserves a teacher reveal and manual navigation, deduplicating event ids', () => {
    const saved = record([...selected, { type: 'DISCUSS' }, { type: 'REVEAL' }])
    saved.events.push(saved.events[2])
    const restored = replaySession(game, saved, planId, now)
    assert.equal(restored.state.phase, 'revealed')
    assert.equal(restored.state.history.length, 1)
    assert.equal(restored.state.history[0].correct, undefined)
    assert.equal(restored.record.events.length, 3)
  })
  await test('pause during a paired collective vote survives reload', async () => {
    const paired = { ...game, questions: [...game.questions, { ...game.questions[0], id: 'q2' }], rounds: [{ id: 'pair', questionIds: ['q1', 'q2'] }] }
    const pairedId = await planIdentity(paired)
    const saved = { ...record([...selected, { type: 'PAUSE' }]), planId: pairedId }
    const { state } = replaySession(paired, saved, pairedId, now)
    assert.equal(state.phase, 'cards-up')
    assert.equal(state.paused, true)
    assert.deepEqual(state.selections, {})
  })
  await test('rejects changed plan including changed answer key, newer schema and malformed events', async () => {
    const saved = record(selected)
    const changed = await planIdentity({ ...game, corrections: { q1: { choiceId: 'a', text: 'Autre solution' } } })
    assert.notEqual(changed, planId)
    assert.throws(() => replaySession(game, saved, changed, now), /changé/)
    assert.throws(() => replaySession(game, { ...saved, schemaVersion: 2 }, planId, now), /Version/)
    assert.throws(() => replaySession(game, record([{ type: 'SELECT', choiceId: 2 }]), planId, now), /invalide/)
    assert.throws(() => replaySession(game, record([{ type: 'REVEAL', secret: 'extra' }]), planId, now), /invalide/)
    assert.equal(saved.events.length, 1)
  })
  await test('expires after seven days without deleting the stored record', () => {
    assert.equal(replaySession(game, record(selected), planId, now + 8 * 86400000), null)
  })
  await test('solo answer is restored as a correction, isolated from class', () => {
    const saved = { ...record([{ type: 'SELECT', choiceId: 'b' }]), mode: 'solo' }
    const { state } = replaySession(game, saved, planId, now, 'solo')
    assert.equal(state.phase, 'revealed')
    assert.equal(state.history[0].correct, true)
    assert.throws(() => replaySession(game, saved, planId, now, 'class'), /changé/)
  })
  await test('clock snapshots preserve remaining time without changing the restored phase', () => {
    const clock = { roundId: 'q1', phase: 'thinking', durationMs: 30000, remainingMs: 12750 }
    const saved = { ...record([]), clock }
    const restored = replaySession(game, saved, planId, now)
    assert.equal(restored.state.phase, 'thinking')
    assert.deepEqual(restored.record.clock, clock)
    assert.equal(remainingFor(restored.record.clock, 'q1', 'thinking', 30000), 12750)
    assert.equal(remainingFor(restored.record.clock, 'q2', 'thinking', 30000), undefined)
    assert.equal(remainingFor(restored.record.clock, 'q1', 'revealed', 5000), undefined)
    assert.equal(remainingFor(restored.record.clock, 'q1', 'thinking', 5000), undefined)
  })
  await test('correction snapshots accept zero and reject corrupted or excessive durations', () => {
    const clock = { roundId: 'q1', phase: 'revealed', durationMs: 5000, remainingMs: 0 }
    const saved = { ...record([{ type: 'SELECT', choiceId: 'b' }]), mode: 'solo', clock }
    const restored = replaySession(game, saved, planId, now, 'solo')
    assert.equal(restored.state.phase, 'revealed')
    assert.equal(restored.record.clock.remainingMs, 0)
    for (const invalid of [{ ...clock, remainingMs: -1 }, { ...clock, remainingMs: 5001 }, { ...clock, durationMs: 11000 }, { ...clock, durationMs: Infinity }, { ...clock, phase: 'cards-up' }]) {
      assert.throws(() => replaySession(game, { ...saved, clock: invalid }, planId, now, 'solo'), /Minuteur/)
    }
  })
  await test('saved journal contains neither answer keys nor question content', async () => {
    const saved = await newRecord(game)
    const json = JSON.stringify(saved)
    assert.ok(!json.includes('Solution'))
    assert.ok(!json.includes('corrections'))
    assert.ok(!json.includes('Question'))
    assert.equal(saved.events.length, 0)
  })
  await test('legacy journals gain a zero revision in memory and invalid revisions are refused without rewriting', () => {
    const legacy = record(selected)
    assert.equal(legacy.revision, undefined)
    assert.equal(replaySession(game, legacy, planId, now).record.revision, 0)
    assert.equal(legacy.revision, undefined)
    for (const revision of [-1, 1.2, '2', Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => replaySession(game, { ...legacy, revision }, planId, now), /Révision/)
  })
} finally { await server.close() }
