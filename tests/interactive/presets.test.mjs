import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { applyPlanOptions, DEFAULT_PLAN_OPTIONS, readPlanOptions } = await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { readLocalPreset, presetOptions } = await server.ssrLoadModule('/src/interactive/presets.ts')
  const questions = Array.from({ length: 6 }, (_, i) => ({ id: `q${i}`, source: { page: 0, block: 0, item: i, part: 0, exerciseType: 'addition' }, title: 'Calcul', instruction: 'Calculez', prompt: `${i} + 1`, mode: 'choice', images: [], compatibility: 'auto', choices: Array.from({ length: 6 }, (_, n) => ({ id: `n${n}`, text: String(n) })) }))
  const game = { id: 'preset-options', seed: 4567, title: 'Test', questions, corrections: Object.fromEntries(questions.map((q) => [q.id, { choiceId: 'n2', text: '2' }])), issues: [] }
  await test('default preset options preserve the original plan and unknown options cannot be silently ignored', () => {
    assert.equal(applyPlanOptions(game, DEFAULT_PLAN_OPTIONS), game)
    assert.deepEqual(readPlanOptions(undefined), DEFAULT_PLAN_OPTIONS)
    for (const patch of [{ maxChoices: 1 }, { maxChoices: '3' }, { orderMode: 'unknown' }, { customOrder: ['x'] }, { customOrder: ['0:0:0:0', '0:0:0:0'] }, { futureOption: true }]) assert.throws(() => readPlanOptions({ ...DEFAULT_PLAN_OPTIONS, ...patch }), /invalides/)
  })
  await test('choice caps retain the verified answer and only original distractors, without modifying the worksheet', () => {
    const original = structuredClone(game)
    for (const maxChoices of [2, 3, 4, 5, 6]) {
      const prepared = prepareGame(applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, maxChoices }), undefined, 'solo')
      for (const q of prepared.questions) {
        assert.equal(q.choices.length, maxChoices)
        assert.equal(q.choices.filter((choice) => choice.id === 'n2').length, 1)
        assert.ok(q.choices.every((choice) => game.questions.find((source) => source.id === q.id).choices.some((source) => source.id === choice.id)))
      }
    }
    assert.deepEqual(game, original)
  })
  await test('fixed references and aggregate choices are preserved even when the selected cap is smaller', () => {
    const protectedGame = { ...game, questions: [{ ...questions[0], choiceOrderPolicy: 'fixed' }, { ...questions[1], choices: [...questions[1].choices.slice(0, 5), { id: 'all', text: 'Toutes ces réponses' }] }] }
    const result = applyPlanOptions(protectedGame, { ...DEFAULT_PLAN_OPTIONS, maxChoices: 2 })
    assert.deepEqual(result.questions.map((q) => q.choices), protectedGame.questions.map((q) => q.choices))
    assert.equal(result.issues.length, 2)
  })
  await test('seeded and custom question order are reproducible and never drop or duplicate a question', () => {
    const shuffled = { ...DEFAULT_PLAN_OPTIONS, orderMode: 'shuffled' }
    assert.deepEqual(applyPlanOptions(game, shuffled), applyPlanOptions(game, shuffled))
    assert.deepEqual(applyPlanOptions(game, shuffled).questions.map((q) => q.id).sort(), questions.map((q) => q.id).sort())
    const custom = applyPlanOptions(game, { ...DEFAULT_PLAN_OPTIONS, orderMode: 'custom', customOrder: ['0:0:5:0', '0:0:0:0'] })
    assert.deepEqual(custom.questions.slice(0, 2).map((q) => q.id), ['q5', 'q0'])
    assert.notEqual(custom.id, game.id)
  })
  await test('numeric ordering remains exact beyond the safe floating-point integer range', () => {
    const choices = ['9007199254740993', '-9007199254740993', '9007199254740992', '0'].map((n) => ({ id: `n${n}`, text: n }))
    const numeric = { ...game, questions: [{ ...questions[0], choices }], corrections: { q0: { choiceId: 'n0', text: '0' } } }
    const prepared = prepareGame(applyPlanOptions(numeric, { ...DEFAULT_PLAN_OPTIONS, numericOrder: true }))
    assert.deepEqual(prepared.questions[0].choices.map((choice) => choice.text), ['-9007199254740993', '0', '9007199254740992', '9007199254740993'])
  })
  await test('paired audio cannot remove fixed references or aggregate alternatives to fit a shared grid', () => {
    const audio = { ...game, questions: questions.slice(0, 2).map((q) => ({ ...q, audio: '/audio.mp3', choiceOrderPolicy: 'fixed' })) }
    const prepared = prepareGame(audio)
    assert.equal(prepared.rounds.length, 2)
    assert.ok(prepared.questions.every((q) => q.choices.length === 6))
    assert.match(prepared.issues.map((issue) => issue.reason).join(' '), /restent séparées/)
  })
  await test('local preset version 2 validates its complete contract and keeps future records untouched', () => {
    const preset = { version: 2, presetId: 'local-preset', sourceKey: 'saved:worksheet', name: 'Ma séance', conversionVersion: 2, paletteVersion: 1, contentHashAtSave: '123', selectedQuestionIds: ['0:0:0:0'], ...DEFAULT_PLAN_OPTIONS, revealPolicy: 'teacher-only', correctionTiming: 'deferred', voteBeforeBoard: true, timer: { enabled: true, defaultSec: 30, feedbackSec: 5 }, scoring: { mode: 'none' }, effects: { badges: false }, playMode: 'class', revision: 0, createdAt: 1, updatedAt: 1 }
    assert.deepEqual(readLocalPreset(preset), preset)
    assert.deepEqual(presetOptions(preset), DEFAULT_PLAN_OPTIONS)
    for (const patch of [{ version: 3 }, { revision: -1 }, { selectedQuestionIds: ['wrong'] }, { futureField: true }, { timer: { ...preset.timer, feedbackSec: 11 } }]) {
      const future = { ...preset, ...patch }; const before = structuredClone(future)
      assert.throws(() => readLocalPreset(future), /conservées/)
      assert.deepEqual(future, before)
    }
  })
} finally { await server.close() }
