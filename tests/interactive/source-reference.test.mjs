import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { readSessionSource } = await server.ssrLoadModule('/src/interactive/domain/source.ts')
  const { newRecord, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { createGameSource, renewGameSource, saveGameRun } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const source = { reference: { kind: 'saved', id: 'worksheet-id' }, sourceKey: 'saved-123', seed: 42, selectedKeys: ['0:0:0:0', '0:0:1:0'], replay: 1, timer: { enabled: false, seconds: 20, feedbackSeconds: 7 } }
  await test('source references preserve seed, selection, replay and timing without storing worksheet text or answer keys', async () => {
    const game = { id: 'source-game', title: 'Private title', questions: [{ id: 'q1', prompt: 'Private prompt', mode: 'choice', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], images: [] }], corrections: { q1: { choiceId: 'b', text: 'Private answer' } }, issues: [] }
    const record = await newRecord(game, 'solo', source)
    const restored = replaySession(game, record, await planIdentity(game), Date.now(), 'solo')
    assert.deepEqual(restored.record.source, source)
    record.source.selectedKeys.push('0:0:2:0')
    assert.equal(source.selectedKeys.length, 2)
    for (const value of ['Private title', 'Private prompt', 'Private answer']) assert.ok(!JSON.stringify(record).includes(value))
    assert.equal(readSessionSource(undefined), undefined)
  })
  await test('malformed references and unsafe timing values are refused without changing the source object', () => {
    const before = structuredClone(source)
    for (const patch of [{ reference: { kind: 'invalid', id: 'x' } }, { reference: { kind: 'saved', id: 'x'.repeat(201) } }, { seed: Infinity }, { selectedKeys: ['foreign-position'] }, { replay: -1 }, { timer: { ...source.timer, feedbackSeconds: 11 } }, { timer: { ...source.timer, seconds: 2 } }]) assert.throws(() => readSessionSource({ ...source, ...patch }), /invalide/)
    assert.deepEqual(source, before)
    assert.deepEqual(readSessionSource({ ...source, answerKey: 'not part of the source reference' }), source)
  })
  await test('legacy tab metadata remains readable and replay state resets only on a new generated part', () => {
    const stored = new Map()
    globalThis.sessionStorage = { getItem: (key) => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) }
    const recipe = demoRecipe()
    const initial = createGameSource({ recipe, name: 'Test' }, 'saved', 'worksheet')
    const replayed = { ...initial, replay: 2 }
    assert.equal(saveGameRun(replayed, ['0:0:0:0']), true)
    const restored = createGameSource({ recipe, name: 'Test' }, 'saved', 'worksheet')
    assert.equal(restored.replay, 2)
    assert.equal(restored.recipe.seed, replayed.recipe.seed)
    const next = renewGameSource(restored, restored.selectedKeys)
    assert.equal(next.replay, 0)
    assert.notEqual(next.recipe.seed, restored.recipe.seed)
    assert.deepEqual(next.template, recipe)
    delete globalThis.sessionStorage
  })
} finally { delete globalThis.sessionStorage; await server.close() }
