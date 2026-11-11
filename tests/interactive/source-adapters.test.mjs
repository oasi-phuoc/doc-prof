import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { adaptSourceItem } = await server.ssrLoadModule('/src/interactive/domain/source-adapters.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { runtimeFor } = await server.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
  const { newRecord, compactSession, replaySession, planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
  const base = demoRecipe()
  const audio = { layout: 'audio-order', answer: '1 → chat · 2 → sac', audioOrder: { mode: 'words', clips: [{ word: 'chat', audioSrc: '/lib/audio/chat.mp3' }, { word: 'sac', audioSrc: '/lib/audio/sac.mp3' }], slots: [{ word: 'sac', correctNum: 2 }, { word: 'chat', correctNum: 1 }] } }
  const phrase = { layout: 'phrase-order', tokens: [{ text: 'est' }, { text: 'petite' }, { text: 'Elle' }], labels: ['Elle', 'est', 'petite'], answer: 'Elle est petite.', responseAnswer: 'Elle est petite.' }
  await test('audio associations preserve explicit source mapping and use only source alternatives', () => {
    const adapted = adaptSourceItem(audio, 'soutien-audio')
    assert.equal(adapted.items.length, 2)
    assert.equal(adapted.items[0].audio, audio.audioOrder.clips[0].audioSrc)
    assert.equal(adapted.items[0].choices.find((c) => c.id === adapted.items[0].correctId).text, 'chat')
    assert.equal(adapted.items[1].choices.find((c) => c.id === adapted.items[1].correctId).text, 'sac')
    assert.deepEqual(adapted.items.map((q) => q.part), [0, 1])
    assert.ok(adapted.items.every((q) => q.choices.every((choice) => audio.audioOrder.slots.some((slot) => slot.word === choice.text))))
    const eight = { ...audio, audioOrder: { mode: 'images', clips: Array.from({ length: 8 }, (_, i) => ({ word: `mot${i}`, audioSrc: `/audio/${i}.mp3` })), slots: Array.from({ length: 8 }, (_, i) => ({ imageSrc: `/images/${i}.webp`, correctNum: i + 1 })) } }
    for (const q of adaptSourceItem(eight, 'soutien-images').items) { assert.equal(q.choices.length, 6); assert.ok(q.choices.some((choice) => choice.id === q.correctId)); assert.ok(q.choices.every((choice) => eight.audioOrder.slots.some((slot) => slot.imageSrc === choice.image))) }
  })
  await test('broken mappings, duplicate choices and absent recordings cannot manufacture an audio answer', () => {
    assert.equal(adaptSourceItem({ ...audio, audioOrder: { ...audio.audioOrder, slots: [{ word: 'chat', correctNum: 1 }, { word: 'sac', correctNum: 1 }] } }, 'soutien').items.length, 0)
    assert.equal(adaptSourceItem({ ...audio, audioOrder: { ...audio.audioOrder, slots: [{ word: 'chat', correctNum: 1 }, { word: 'chat', correctNum: 2 }] } }, 'soutien').items.length, 0)
    const missing = structuredClone(audio); missing.audioOrder.clips[0].audioSrc = undefined
    assert.equal(adaptSourceItem(missing, 'soutien').items.length, 1)
    const mismatch = structuredClone(audio); mismatch.audioOrder.clips[0].word = 'foreign'
    assert.equal(adaptSourceItem(mismatch, 'soutien').items.length, 1)
  })
  await test('whole-word fallback for a syllable and shared ambiguous recordings stay teacher-led', () => {
    const fallback = adaptSourceItem(audio, 'alpha-a-associer-syllabe')
    assert.ok(fallback.items.every((q) => q.teacherLed && q.choices.length === 0 && q.correctId === undefined))
    const shared = structuredClone(audio); shared.audioOrder.clips[1].audioSrc = shared.audioOrder.clips[0].audioSrc
    assert.ok(adaptSourceItem(shared, 'soutien').items.every((q) => q.mode === 'oral' && !q.correctId))
  })
  await test('source syllable pairs become verified one-blank questions without new distractors', () => {
    const pairs = { layout: 'vocab-match', labels: ['ama', 'va'], options: ['llee', 'zone'], vocabMatchMode: 'syllables', vocabPairs: [{ left: 'ama', right: 'zone' }, { left: 'va', right: 'llee' }], answer: 'ama + zone → amazone · va + llee → vallee' }
    const converted = adaptSourceItem(pairs, 'soutien-a-relier')
    assert.equal(converted.items.length, 2)
    assert.equal(converted.items[0].prompt, 'Complète « amazone » : ama___')
    assert.equal(converted.items[0].choices.find((choice) => choice.id === converted.items[0].correctId).text, 'zone')
    assert.ok(converted.items.every((q) => q.choices.every((choice) => pairs.options.includes(choice.text))))
    assert.equal(adaptSourceItem({ ...pairs, answer: 'incorrect' }, 'soutien').items.length, 0)
    const ambiguous = { ...pairs, vocabMatchMode: 'text', labels: ['mot'], options: ['synonyme A', 'synonyme B'], vocabPairs: [{ left: 'mot', right: 'synonyme A' }, { left: 'mot', right: 'synonyme B' }] }
    const guided = adaptSourceItem(ambiguous, 'soutien')
    assert.equal(guided.items.length, 1)
    assert.equal(guided.items[0].teacherLed, true)
    assert.equal(guided.items[0].correctId, undefined)
  })
  await test('word ordering keeps source tokens public, the model separate and all verdicts human', async () => {
    const recipe = { ...base, pages: [{ ...base.pages[0], libreItems: [phrase] }] }
    const game = convertRecipe(recipe)
    assert.equal(game.questions.length, 1)
    const q = game.questions[0]
    assert.deepEqual(q.words, ['est', 'petite', 'Elle'])
    assert.equal(q.mode, 'sequence'); assert.equal(q.compatibility, 'teacher-led')
    assert.ok(!JSON.stringify(q).includes('Elle est petite.'))
    assert.equal(game.corrections[q.id].text, 'Elle est petite.')
    let state = startSession(game, 'solo')
    state = transition(game, state, { type: 'IMAGE_ORDER_SET', questionId: q.id, order: [2, 0, 1] })
    assert.deepEqual(runtimeFor(game, state).imageOrders[q.id], [2, 0, 1])
    assert.equal(transition(game, state, { type: 'IMAGE_ORDER_SET', questionId: q.id, order: [0, 0, 1] }), state)
    state = transition(game, state, { type: 'TIMEOUT' })
    assert.equal(state.history[0].correct, undefined)
    assert.equal(state.phase, 'revealed')
    const record = compactSession(await newRecord(game, 'solo'), state)
    assert.deepEqual(replaySession(game, record, await planIdentity(game), Date.now(), 'solo').state.roundStates, state.roundStates)
    const forged = structuredClone(record); forged.checkpoint.state.roundStates[q.id].imageOrders[q.id] = [0]
    assert.throws(() => replaySession(game, forged, record.planId, Date.now(), 'solo'), /Instantané/)
  })
  await test('word activities reject mismatched token sets and never truncate a long sentence', () => {
    assert.equal(adaptSourceItem({ ...phrase, labels: ['un', 'autre', 'texte'] }, 'soutien').items.length, 0)
    assert.equal(adaptSourceItem({ ...phrase, answer: '', responseAnswer: '' }, 'soutien').items.length, 0)
    const words = ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept']
    assert.equal(adaptSourceItem({ ...phrase, tokens: words.map((text) => ({ text })), labels: words, answer: words.join(' '), responseAnswer: undefined }, 'soutien').items.length, 0)
  })
  await test('real catalogue sources convert reproducibly while paper worksheets remain unchanged', async () => {
    const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
    for (const [domain, type] of [['alphabetisation', 'alpha-a-associer-syllabe'], ['soutien-fr', 'soutien-a-relier'], ['soutien-fr', 'soutien-a-ordre']]) {
      const config = { ...defaultPage(domain), topic: exerciseTypes.find((entry) => entry.id === type).topic, exerciseType: type, count: 2 }
      const recipe = { ...base, seed: 20261107, pages: [config], libreMode: false }
      const before = structuredClone(buildWorksheets(recipe.pages, recipe.seed))
      const converted = convertRecipe(recipe)
      assert.ok(converted.questions.length > 0, `${type}: ${JSON.stringify(converted.issues)}`)
      assert.deepEqual(convertRecipe(recipe), converted)
      assert.deepEqual(buildWorksheets(recipe.pages, recipe.seed), before)
      for (const q of converted.questions.filter((q) => q.mode === 'choice')) assert.equal(q.choices.filter((choice) => choice.id === converted.corrections[q.id].choiceId).length, 1)
    }
  })
} finally { await server.close() }
