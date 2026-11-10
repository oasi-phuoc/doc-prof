import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { assignChoicePositions, choiceOrderPolicy } = await server.ssrLoadModule('/src/interactive/domain/slots.ts')
  const { hash, deriveSeed, canonicalJson } = await server.ssrLoadModule('/src/interactive/domain/seeds.ts')
  const { numberChoices } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const question = (index, n) => ({ id: `q${index}`, prompt: `Question ${index}`, mode: 'choice', images: [], choices: Array.from({ length: n }, (_, i) => ({ id: `c${i}`, text: `Option ${i}` })), source: { page: 0, block: 0, item: index, part: 0, exerciseType: 'test' } })
  const make = (sizes, seed = 1) => ({ id: `slot-test-${seed}`, seed, title: 'Test', questions: sizes.map((n, index) => question(index, n)), corrections: Object.fromEntries(sizes.map((_, index) => [`q${index}`, { choiceId: 'c0', text: 'Option 0' }])), issues: [] })
  function check(game, planned) {
    const positions = planned.map((q) => q.choices.findIndex((choice) => choice.id === game.corrections[q.id].choiceId))
    for (let i = 2; i < positions.length; i++) assert.ok(positions[i] !== positions[i - 1] || positions[i] !== positions[i - 2], `Three repeated correct positions at ${i}: ${positions.slice(i - 4, i + 1)}`)
    for (const n of new Set(planned.map((q) => q.choices.length))) {
      const group = planned.filter((q) => q.choices.length === n)
      const counts = Array(n).fill(0)
      for (const q of group) counts[q.choices.findIndex((choice) => choice.id === game.corrections[q.id].choiceId)]++
      assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `Unbalanced ${n}-choice group: ${counts}`)
    }
  }
  await test('seed identities have fixed hash vectors and separate purposes, versions and attempts', () => {
    assert.equal(hash(''), 2166136261)
    assert.equal(hash('a'), 3826002220)
    assert.equal(hash('hello'), 1335831723)
    const input = { originalSeed: 42, sourceKey: 'fiche/é/0', purpose: 'slots' }
    assert.equal(deriveSeed(input), deriveSeed({ ...input, sourceKey: 'fiche/e\u0301/0' }))
    const values = ['slots', 'distractors', 'order', 'replay'].map((purpose) => deriveSeed({ ...input, purpose }))
    assert.equal(new Set(values).size, 4)
    assert.notEqual(deriveSeed(input), deriveSeed({ ...input, attempt: 1 }))
    assert.notEqual(deriveSeed(input), deriveSeed({ ...input, conversionVersion: 3 }))
    assert.equal(canonicalJson({ z: 1, a: { c: 'e\u0301', b: -0 } }), canonicalJson({ a: { b: 0, c: 'é' }, z: 1 }))
    assert.notEqual(hash('🙂'), hash('🙃'), 'Both UTF-16 units of non-BMP text participate in identity')
    assert.throws(() => canonicalJson({ value: Infinity }), /nombre invalide/)
  })
  await test('100 seeds balance every position for 2–6 choices, without runs longer than two', () => {
    for (let seed = 1; seed <= 100; seed++) for (let n = 2; n <= 6; n++) {
      const game = make(Array(11 + seed % 90).fill(n), seed)
      const result = assignChoicePositions(game, game.questions)
      check(game, result)
      assert.deepEqual(result, assignChoicePositions(game, game.questions))
    }
  })
  await test('mixed choice counts keep each group balanced and the complete sequence free of triples', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const game = make(Array.from({ length: 180 }, (_, i) => 2 + ((i * 13 + seed) % 5)), seed)
      check(game, assignChoicePositions(game, game.questions))
    }
    const large = make(Array.from({ length: 5000 }, (_, i) => 2 + i % 5), 700)
    check(large, assignChoicePositions(large, large.questions))
  })
  await test('fixed references, true/false, pinned aggregate and numeric ordering preserve meaning', () => {
    const game = make([2, 3, 3, 3])
    game.questions[0].choices = [{ id: 'c0', text: 'Faux' }, { id: 'c1', text: 'Vrai' }]
    game.questions[1].choices[2].text = 'Les réponses A et B'
    game.questions[2].choices[1].text = 'Aucune de ces réponses'
    game.questions[3].choices = [{ id: 'n20', text: '20' }, { id: 'n3', text: '3' }, { id: 'n10', text: '10' }]
    game.questions[3].choiceOrderPolicy = 'ascending'
    game.corrections.q3.choiceId = 'n10'
    const original = structuredClone(game)
    const result = assignChoicePositions(game, game.questions)
    assert.equal(result[0].choices[0].text, 'Vrai')
    assert.equal(result[0].choiceOrderPolicy, 'fixed')
    assert.deepEqual(result[1].choices, game.questions[1].choices)
    assert.equal(result[1].compatibility, 'assisted')
    assert.equal(result[2].choices.at(-1).text, 'Aucune de ces réponses')
    assert.deepEqual(result[3].choices.map((choice) => choice.id), ['n3', 'n10', 'n20'])
    assert.deepEqual(game, original)
    assert.equal(choiceOrderPolicy({ ...question(9, 3), choiceOrderPolicy: 'fixed' }), 'fixed')
  })
  await test('resolved plans keep choices and key IDs associated, and isolate versions from previous journals', () => {
    const game = make(Array(30).fill(6), 501)
    const original = structuredClone(game)
    const planned = prepareGame(game, undefined, 'solo')
    assert.match(planned.id, /-plan3-/)
    assert.deepEqual(planned.corrections, game.corrections)
    assert.deepEqual(game, original)
    assert.deepEqual(planned, prepareGame(game, undefined, 'solo'))
    assert.notDeepEqual(planned.questions.map((q) => q.choices), prepareGame({ ...game, seed: 502 }, undefined, 'solo').questions.map((q) => q.choices))
    check(game, planned.questions)
  })
  await test('long numeric distractor lists always retain the verified answer exactly once', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const result = numberChoices(42, seed, '', Array.from({ length: 20 }, (_, i) => i))
      assert.equal(result.choices.length, 6)
      assert.equal(result.choices.filter((choice) => choice.id === result.correctId).length, 1)
    }
  })
} finally { await server.close() }
