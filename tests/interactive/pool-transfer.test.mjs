import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { makePoolTransfer, readPoolTransfer, previewPoolTransfer } = await vite.ssrLoadModule('/src/interactive/pools/transfer.ts')
  const { POOL_TYPES, newPoolEntry } = await vite.ssrLoadModule('/src/interactive/pools/config.ts')
  const { poolRecipe, convertPoolRecipe } = await vite.ssrLoadModule('/src/interactive/pools/recipe.ts')
  const { createGameSource } = await vite.ssrLoadModule('/src/interactive/game-run.ts')
  const { sourcePlan } = await vite.ssrLoadModule('/src/interactive/domain/source-plan.ts')
  const { positionOf } = await vite.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const { NEW_PLAN_OPTIONS } = await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { newRecord } = await vite.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { startSession, transition } = await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const type = POOL_TYPES.find(item => item.domain === 'algèbre' && item.type === 'addition-ligne')
  assert.ok(type)
  const pool = { version: 1, poolId: crypto.randomUUID(), name: 'Additions à transférer', seed: 42, config: { version: 1, entries: [{ ...newPoolEntry(type), count: 2 }], shuffle: true }, createdAt: Date.now() }
  const recipe = poolRecipe(pool.config, pool.seed)
  const source = createGameSource({ recipe, name: pool.name }, 'pool', pool.poolId)
  const options = { ...NEW_PLAN_OPTIONS, orderMode: 'shuffled' }
  const context = { reference: source.reference, sourceKey: source.sourceKey, options, seed: 17, replay: 2,
    selectedKeys: convertPoolRecipe({ ...recipe, seed: 17 }, pool.name).questions.map(positionOf), timer: { enabled: false, seconds: 30, feedbackSeconds: 5 } }
  const game = sourcePlan(recipe, pool.name, context, 'class')
  const state = ['CARDS_UP', 'DISCUSS', 'REVEAL', 'FINISH'].reduce((current, type) => transition(game, current, { type }), startSession(game))
  const record = await newRecord(game, 'class', context)
  const transfer = await makePoolTransfer(pool, record, state)

  await test('portable transfer preserves the pool, plan, selected positions and replay without serializing a worksheet or a correction', () => {
    assert.deepEqual(readPoolTransfer(JSON.stringify(transfer)), transfer)
    assert.equal(transfer.run.session.gameId, game.id)
    assert.deepEqual(transfer.run.session.source, context)
    assert.equal(transfer.run.bilan.worked, 1)
    assert.equal(transfer.run.bilan.skipped, 1)
    assert.ok(!JSON.stringify(transfer).includes('"questions":') && !JSON.stringify(transfer).includes('"corrections":'))
  })

  await test('future versions, foreign sources and embedded worksheet fields are refused', () => {
    for (const forged of [
      { ...transfer, exportVersion: 2 },
      { ...transfer, pool: { ...pool, poolId: crypto.randomUUID() } },
      { ...transfer, pool: { ...pool, recipe } },
      { ...transfer, run: { ...transfer.run, session: { ...transfer.run.session, source: undefined } } },
    ]) assert.throws(() => readPoolTransfer(JSON.stringify(forged)))
  })

  await test('preview enforces access and compares the regenerated plan and report', async () => {
    await assert.rejects(previewPoolTransfer(JSON.stringify(transfer)), /Votre compte/)
    globalThis.document = { cookie: 'clairfle-fiche-access=admin' }
    try {
      assert.deepEqual(await previewPoolTransfer(JSON.stringify(transfer)), transfer)
      await assert.rejects(previewPoolTransfer(JSON.stringify({ ...transfer, pool: { ...pool, seed: 43 } })))
      await assert.rejects(previewPoolTransfer(JSON.stringify({ ...transfer, run: { ...transfer.run, bilan: { ...transfer.run.bilan, worked: 4 } } })), /bilan/)
    } finally { delete globalThis.document }
  })
} finally {
  await vite.close()
}
