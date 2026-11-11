import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const before = globalThis.sessionStorage, stored = new Map()
globalThis.sessionStorage = { getItem: (key) => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, String(value)) }
try {
  const { newLocalCompetition, readLocalCompetition, writeLocalCompetition } = await server.ssrLoadModule('/src/interactive/competition/local.ts')
  const { competitionStep: step, competitionView: view } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const { PALETTE, defaultShapes } = await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const colors = PALETTE.map((item) => item.color), settings = { enabled: false, seconds: 30, feedbackSeconds: 5, speedPoints: true }, now = 100_000
  const quiz = { id: 'local-fixture', title: 'Private source title', items: [{ question: { id: 'q1', prompt: 'Private question text', images: [], choices: [{ id: 'c0', text: 'one' }, { id: 'c1', text: 'two' }] }, correctChoiceId: 'c0' }] }
  await test('local action journal resumes exact turns and derived scores without storing the quiz or its answer key', () => {
    const original = newLocalCompetition(quiz, settings, colors, defaultShapes, now)
    const actions = [{ type: 'join', avatarId: 'panda' }, { type: 'join', avatarId: 'fox' }, { type: 'start' }, { type: 'begin-turn' }, { type: 'answer', playerId: 'p1', questionId: 'q1', choiceId: 'c0' }, { type: 'begin-turn' }, { type: 'answer', playerId: 'p2', questionId: 'q1', choiceId: 'c1' }]
    let room = original.room
    const journal = { ...original.journal, events: actions.map((action, i) => { room = step(room, action, now + i); return { at: now + i, action } }) }
    assert.equal(writeLocalCompetition(journal), true)
    const reloaded = readLocalCompetition(quiz, settings, colors, defaultShapes, now + 100)
    assert.deepEqual(view(reloaded.room, now + 100), view(room, now + 100))
    assert.deepEqual(reloaded.room.players.map((player) => player.score), [1000, 0])
    const text = [...stored.values()][0]
    for (const content of ['Private source title', 'Private question text', 'correctChoiceId', 'lastCorrect', 'score']) assert.ok(!text.includes(content))
  })
  await test('future and malformed local journals stay untouched and cannot create names, phantom votes or forged results', () => {
    const [key, valid] = [...stored.entries()][0]
    for (const transform of [(value) => ({ ...value, version: 99 }), (value) => ({ ...value, events: [...value.events, { at: now + 7, action: { type: 'answer', playerId: 'p3', questionId: 'q1', choiceId: 'c0' } }] }), (value) => ({ ...value, events: [{ at: now + 1, action: { type: 'join', avatarId: 'panda', nickname: 'untrusted' } }] })]) {
      const raw = JSON.stringify(transform(JSON.parse(valid))); stored.set(key, raw)
      const loaded = readLocalCompetition(quiz, settings, colors, defaultShapes, now + 100)
      assert.equal(loaded.writable, false); assert.ok(loaded.warning); assert.equal(stored.get(key), raw)
    }
    stored.set(key, valid)
  })
  await test('an expired local match is preserved and requires an explicit fresh start', () => {
    const [key, raw] = [...stored.entries()][0]
    const expired = readLocalCompetition(quiz, settings, colors, defaultShapes, now + 3 * 60 * 60 * 1000)
    assert.equal(expired.writable, false); assert.equal(stored.get(key), raw)
    const fresh = newLocalCompetition(quiz, settings, colors, defaultShapes, now + 3 * 60 * 60 * 1000)
    assert.equal(writeLocalCompetition(fresh.journal), true)
    assert.equal(readLocalCompetition(quiz, settings, colors, defaultShapes, now + 3 * 60 * 60 * 1000).room.phase, 'lobby')
  })
} finally { globalThis.sessionStorage = before; await server.close() }
