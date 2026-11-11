import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { sourcePlan } = await server.ssrLoadModule('/src/interactive/domain/source-plan.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { positionOf } = await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const { createGameSource } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { newRecord, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { excludeQuestions } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { readTransfer, makeTransfer, validateTransfer, TRANSFER_MAX_BYTES } = await server.ssrLoadModule('/src/interactive/session-transfer.ts')
  const template = demoRecipe(), title = 'Private worksheet title'
  const source = createGameSource({ recipe: template, name: title }, 'saved', 'transfer-worksheet')
  const converted = convertRecipe(source.recipe, title)
  const keys = converted.questions.slice(0, 2).map(positionOf)
  const context = { reference: source.reference, sourceKey: source.sourceKey, seed: source.recipe.seed, replay: 1, selectedKeys: keys, timer: { enabled: true, seconds: 30, feedbackSeconds: 5 }, options: { orderMode: 'custom', customOrder: [...keys].reverse(), maxChoices: 3, numericOrder: true } }
  const game = sourcePlan(template, title, context, 'class')
  let state = startSession(game)
  const step = (action) => { state = transition(game, state, action, Date.now()) }
  for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL']) step({ type })
  step({ type: 'TEACHER_MARK_SET', questionId: game.questions[0].id, value: 'review' })
  step({ type: 'SESSION_NOTE_SET', note: 'Note technique locale.' })
  step({ type: 'FINISH' })
  const record = await newRecord(game, 'class', context)
  const transfer = await makeTransfer(game, record, state)
  await test('exports compact state and a derived report without worksheet content or answer keys', () => {
    assert.equal(transfer.session.events.length, 0)
    assert.equal(transfer.session.checkpoint.state.finished, true)
    assert.deepEqual(transfer.bilan, { total: 2, worked: 1, skipped: 1, correct: 0, incorrect: 0, teacherAssessed: 0, previousAttempts: 0, marks: { success: 0, review: 1, unassessed: 0 } })
    const text = JSON.stringify(transfer)
    assert.ok(text.includes('Note technique locale.'))
    assert.ok(!text.includes(title))
    assert.ok(!text.includes(game.questions[0].prompt))
    assert.ok(!text.includes('corrections'))
    assert.ok(!text.includes('libreItems'))
    assert.deepEqual(readTransfer(text), transfer)
  })
  await test('validated import restores the exact finished state and refreshes local retention', async () => {
    const old = structuredClone(transfer)
    old.exportedAt -= 9 * 24 * 60 * 60 * 1000
    old.session.updatedAt = old.exportedAt
    const now = Date.now()
    const validated = await validateTransfer(game, old, now)
    assert.deepEqual(validated.state, JSON.parse(JSON.stringify(state)))
    assert.equal(validated.record.updatedAt, now)
    assert.equal(validated.record.revision, 0)
    assert.equal(validated.record.sessionId, record.sessionId)
  })
  await test('import rejects unknown versions, oversized files, malformed JSON and extra record fields', () => {
    assert.throws(() => readTransfer('{'), /JSON/)
    assert.throws(() => readTransfer(' '.repeat(TRANSFER_MAX_BYTES + 1)), /2 Mo/)
    for (const patch of [{ exportVersion: 99 }, { schemaVersion: 99 }, { format: 'other' }, { extra: 'unexpected' }]) assert.throws(() => readTransfer(JSON.stringify({ ...transfer, ...patch })), /Version/)
    assert.throws(() => readTransfer(JSON.stringify({ ...transfer, session: { ...transfer.session, answerKey: 'unexpected' } })), /invalide/)
    assert.throws(() => readTransfer(JSON.stringify({ ...transfer, session: { ...transfer.session, sessionId: 'invalid' } })), /invalide/)
  })
  await test('the report, checkpoint, plan and current answer key are independently checked before import', async () => {
    await assert.rejects(validateTransfer(game, { ...transfer, bilan: { ...transfer.bilan, worked: 999 } }), /bilan/)
    const forged = structuredClone(transfer)
    forged.session.checkpoint.state.history[0].questionId = 'foreign-question'
    await assert.rejects(validateTransfer(game, forged), /Instantané/)
    const changed = { ...game, corrections: { ...game.corrections, [game.questions[0].id]: { choiceId: 'foreign-choice', text: 'Changed answer' } } }
    await assert.rejects(validateTransfer(changed, transfer), /changé/)
    await assert.rejects(validateTransfer(game, { ...transfer, exportVersion: 99 }), /Version/)
  })
  await test('source reconstruction preserves replay, custom order, choice cap and media exclusions exactly', async () => {
    assert.equal(game.questions.length, 2)
    assert.equal(positionOf(game.questions[0]), keys[1])
    assert.equal(game.questions[0].choices.length, 3)
    const filtered = excludeQuestions(game, new Set([game.questions[1].id]))
    const rebuilt = sourcePlan(template, title, { ...context, resolvedKeys: [positionOf(game.questions[0])] }, 'class')
    assert.equal(await planIdentity(rebuilt), await planIdentity(filtered))
    assert.deepEqual(template, demoRecipe())
  })
  await test('a changed worksheet or foreign source cannot silently reconstruct an imported plan', () => {
    assert.throws(() => sourcePlan({ ...template, seed: template.seed + 1 }, title, context, 'class'), /changé/)
    assert.throws(() => sourcePlan(template, title, { ...context, reference: { kind: 'saved', id: 'another-worksheet' } }, 'class'), /changé/)
  })
} finally { await server.close() }
