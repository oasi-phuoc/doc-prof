import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { maxListensFor, ListeningPass } = await server.ssrLoadModule('/src/interactive/domain/listening.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { runtimeFor } = await server.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
  const { compactSession, replaySession } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const q = { id: 'q1', prompt: 'Écoutez.', instruction: 'Il y a [[em]]2 écoutes[[/em]].', audio: '/listen.wav', mode: 'choice', choices: [{ id: 'a', text: 'un' }, { id: 'b', text: 'deux' }], images: [] }
  const game = { id: 'listening', title: 'Audio', questions: [q, { ...q, id: 'q2', audio: undefined, instruction: 'Répondez.' }], corrections: { q1: { choiceId: 'a', text: 'un' }, q2: { choiceId: 'b', text: 'deux' } }, issues: [] }
  const send = (state, type, extra = {}) => transition(game, state, { type, roundId: 'q1', ...extra }, 1000)
  const two = (mode) => send(send(startSession(game, mode), 'AUDIO_LISTEN_STARTED'), 'AUDIO_LISTEN_STARTED')
  await test('only an explicit bounded source instruction limits listening', () => {
    assert.equal(maxListensFor([q]), 2)
    assert.equal(maxListensFor([{ ...q, instruction: 'Écoutez 6 documents.' }]), undefined)
    assert.equal(maxListensFor([{ ...q, instruction: 'Il y a 0 écoute.' }]), undefined)
    assert.equal(maxListensFor([{ ...q, instruction: 'Il y a 99 écoutes.' }]), undefined)
    assert.equal(maxListensFor([{ ...q, instruction: 'Maximum de 1 écoute.' }]), 1)
    assert.equal(maxListensFor([q, { ...q, audioMaxListens: 1 }]), 1)
  })
  await test('playing from the beginning counts once; pause/resume and middle starts do not', () => {
    const pass = new ListeningPass()
    assert.equal(pass.begin(0.8), false)
    assert.equal(pass.begin(0.1), true)
    assert.equal(pass.begin(0.2), false)
    pass.seek(0.9)
    pass.seek(0)
    assert.equal(pass.active, false)
    assert.equal(pass.begin(0), true)
    pass.end()
    assert.equal(pass.begin(0), true)
  })
  await test('quotas, teacher grants, pause, locks and stale rounds are enforced in the reducer', () => {
    let state = two('class')
    assert.equal(runtimeFor(game, state).audioListens, 2)
    assert.equal(send(state, 'AUDIO_LISTEN_STARTED'), state)
    const paused = send(state, 'PAUSE')
    assert.equal(send(paused, 'AUDIO_EXTRA_LISTEN_GRANTED'), paused)
    const locked = send(state, 'TEACHER_LOCK_SET', { locked: true })
    assert.equal(send(locked, 'AUDIO_EXTRA_LISTEN_GRANTED'), locked)
    assert.equal(send(state, 'AUDIO_EXTRA_LISTEN_GRANTED', { roundId: 'q2' }), state)
    state = send(state, 'AUDIO_EXTRA_LISTEN_GRANTED')
    assert.equal(runtimeFor(game, state).extraListens, 1)
    assert.equal(send(state, 'AUDIO_EXTRA_LISTEN_GRANTED'), state)
    state = send(state, 'AUDIO_LISTEN_STARTED')
    assert.equal(runtimeFor(game, state).audioListens, 3)
    const solo = two('solo')
    assert.equal(send(solo, 'AUDIO_EXTRA_LISTEN_GRANTED'), solo)
    const other = send(state, 'NAVIGATE', { index: 1 })
    assert.equal(send(other, 'AUDIO_LISTEN_STARTED', { roundId: 'q2' }), other)
  })
  await test('navigation keeps quotas and a new attempt archives counts before resetting them', () => {
    let state = two('class')
    state = send(state, 'NAVIGATE', { index: 1 })
    state = send(state, 'NAVIGATE', { index: 0, roundId: 'q2' })
    assert.equal(runtimeFor(game, state).audioListens, 2)
    state = send(send(state, 'CARDS_UP'), 'DISCUSS')
    state = send(state, 'RETRY_QUESTION')
    assert.equal(state.previousAttempts[0].audioListens, 2)
    assert.equal(runtimeFor(game, state).audioListens ?? 0, 0)
    assert.equal(runtimeFor(game, state).attempt, 1)
  })
  await test('listen events replay idempotently and compacted quotas reject forged counts', () => {
    const first = { eventId: 'one', at: 1000, action: { type: 'AUDIO_LISTEN_STARTED', roundId: 'q1' } }
    const record = { schemaVersion: 5, sessionId: 'session', gameId: game.id, mode: 'class', planId: 'plan', updatedAt: 1000, events: [first, first, { ...first, eventId: 'two' }, { eventId: 'grant', at: 1000, action: { type: 'AUDIO_EXTRA_LISTEN_GRANTED', roundId: 'q1' } }] }
    const resume = replaySession(game, record, 'plan', 1000)
    assert.equal(runtimeFor(game, resume.state).audioListens, 2)
    assert.equal(runtimeFor(game, resume.state).extraListens, 1)
    const compacted = compactSession(resume.record, resume.state)
    assert.deepEqual(replaySession(game, compacted, 'plan', 1000).state, resume.state)
    const forged = structuredClone(compacted)
    forged.checkpoint.state.roundStates.q1.audioListens = 4
    assert.throws(() => replaySession(game, forged, 'plan', 1000), /Instantané/)
    forged.checkpoint.state.roundStates.q1.audioListens = 2
    forged.checkpoint.state.roundStates.q1.extraListens = -1
    assert.throws(() => replaySession(game, forged, 'plan', 1000), /Instantané/)
    const legacy = { ...compacted, schemaVersion: 4, checkpoint: { state: startSession(game) } }
    assert.equal(runtimeFor(game, replaySession(game, legacy, 'plan', 1000).state).audioListens ?? 0, 0)
    assert.ok(!JSON.stringify(compacted).includes('Écoutez.'))
  })
} finally { await server.close() }
