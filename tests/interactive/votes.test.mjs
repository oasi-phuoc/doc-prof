import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { validateManualVote, manualTotal } = await server.ssrLoadModule('/src/interactive/domain/votes.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { planIdentity, replaySession } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const q = { id: 'q1', prompt: 'Question', mode: 'choice', images: [], choices: [{ id: 'wrong', text: 'Non' }, { id: 'right', text: 'Oui' }] }
  const game = { id: 'manual-count-test', title: 'Test', questions: [q, { ...q, id: 'q2' }], corrections: { q1: { choiceId: 'right', text: 'Oui' }, q2: { choiceId: 'right', text: 'Oui' } }, issues: [] }
  const vote = { counts: { wrong: 2, right: 5 }, present: 8, shared: false }
  const apply = (state, ...actions) => actions.reduce((value, action) => transition(game, value, action), state)
  await test('manual counts reject invalid numbers, inactive slots and totals above attendance without changing data', () => {
    for (const counts of [{ wrong: -1 }, { wrong: 1.2 }, { wrong: 100 }, { wrong: '2' }, { wrong: Infinity }, { unknown: 1 }]) assert.equal(validateManualVote(q, { ...vote, counts }).ok, false)
    assert.equal(validateManualVote(q, { ...vote, present: 6 }).ok, false)
    assert.equal(validateManualVote(q, { ...vote, present: -1 }).ok, false)
    assert.equal(validateManualVote({ ...q, mode: 'oral' }, vote).ok, false)
    assert.deepEqual(vote.counts, { wrong: 2, right: 5 })
    assert.equal(validateManualVote(q, vote).ok, true)
  })
  await test('empty counts are absent; qualitative observations never invent numeric votes', () => {
    assert.equal(validateManualVote(q, { counts: { wrong: 0 }, shared: false }).vote, null)
    const qualitative = validateManualVote(q, { counts: {}, quick: 'majority-review', shared: false }).vote
    assert.equal(manualTotal(qualitative), 0)
    assert.equal(qualitative.quick, 'majority-review')
    assert.equal(validateManualVote(q, null).vote, null)
  })
  await test('class counting preserves the phase and never creates a selection or automatic verdict', () => {
    const initial = startSession(game)
    const count = { type: 'MANUAL_VOTE_SET', questionId: 'q1', vote }
    assert.equal(transition(game, initial, count), initial)
    const cards = transition(game, initial, { type: 'CARDS_UP' })
    assert.equal(transition(game, cards, { ...count, questionId: 'q2' }), cards)
    const counted = transition(game, cards, count)
    assert.equal(counted.phase, 'cards-up')
    assert.deepEqual(counted.history, [])
    assert.deepEqual(counted.selections, {})
    assert.deepEqual(counted.manualVotes.q1, vote)
    const reveal = apply(counted, { type: 'DISCUSS' }, { type: 'REVEAL' })
    assert.equal(reveal.history[0].correct, undefined)
    assert.deepEqual(reveal.manualVotes.q1, vote)
    const next = transition(game, reveal, { type: 'NEXT' })
    assert.deepEqual(transition(game, next, { type: 'PREVIOUS' }).manualVotes.q1, vote)
    assert.equal(transition(game, startSession(game, 'solo'), count).manualVotes.q1, undefined)
  })
  await test('local notes and teacher marks work in the summary without affecting results', () => {
    const finished = apply(startSession(game), { type: 'SKIP' }, { type: 'SKIP' })
    const marked = transition(game, finished, { type: 'TEACHER_MARK_SET', questionId: 'q1', value: 'review' })
    assert.equal(marked.teacherMarks.q1, 'review')
    assert.deepEqual(marked.history, finished.history)
    const noted = transition(game, marked, { type: 'SESSION_NOTE_SET', note: 'Revoir les retenues.' })
    assert.equal(noted.note, 'Revoir les retenues.')
    assert.equal(transition(game, noted, { type: 'SESSION_NOTE_SET', note: 'x'.repeat(2001) }), noted)
    assert.equal(transition(game, startSession(game, 'solo'), { type: 'SESSION_NOTE_SET', note: 'Test' }).note, '')
  })
  await test('a journal restores manual counts, visibility, teacher marks and summary notes, rejecting corrupted payloads', async () => {
    const actions = [{ type: 'CARDS_UP' }, { type: 'MANUAL_VOTE_SET', questionId: 'q1', vote }, { type: 'DISCUSS' }, { type: 'REVEAL' }, { type: 'NEXT' }, { type: 'SKIP' }, { type: 'TEACHER_MARK_SET', questionId: 'q1', value: 'review' }, { type: 'SESSION_NOTE_SET', note: 'Revoir les retenues.' }]
    const planId = await planIdentity(game)
    const now = Date.now()
    const saved = { schemaVersion: 1, mode: 'class', sessionId: 'manual-session', gameId: game.id, planId, updatedAt: now, events: actions.map((action, i) => ({ eventId: String(i), at: now, action })) }
    const { state } = replaySession(game, saved, planId, now)
    assert.equal(state.finished, true)
    assert.deepEqual(state.manualVotes.q1, vote)
    assert.equal(state.teacherMarks.q1, 'review')
    assert.equal(state.note, 'Revoir les retenues.')
    assert.equal(state.history[0].correct, undefined)
    for (const action of [{ type: 'SESSION_NOTE_SET', note: 'x'.repeat(2001) }, { type: 'MANUAL_VOTE_SET', questionId: 'q1', vote: { ...vote, counts: { wrong: -2 } } }]) {
      assert.throws(() => replaySession(game, { ...saved, events: [{ eventId: 'bad', at: now, action }] }, planId, now), /invalide/)
    }
  })
} finally { await server.close() }
