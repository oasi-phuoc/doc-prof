import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { adaptSourceItem } = await server.ssrLoadModule('/src/interactive/domain/source-adapters.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { prepareGame } = await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { defaultPage, exerciseTypes } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const source = { layout: 'listen-check', options: ['chat', 'sac', 'chou'], labels: ['chat', 'chou'], answer: 'chat · chou', optionAudioSrcs: ['/audio/chat.mp3', '/audio/sac.mp3', '/audio/chou.mp3'], optionImages: ['/images/chat.webp', '/images/sac.webp', '/images/chou.webp'] }
  const instruction = 'Écoutez les mots et cochez quand vous entendez le son /ʃ/.'
  await test('sound recognition keeps the source target, audio and image, using one independent yes/no question per word', () => {
    const copy = structuredClone(source)
    const result = adaptSourceItem(source, 'soutien-ch-ecouter', instruction)
    assert.equal(result.items.length, 3)
    assert.deepEqual(result.items.map((q) => q.correctId), ['yes', 'no', 'yes'])
    assert.ok(result.items.every((q) => q.prompt === 'Entends-tu le son /ʃ/ ?'))
    for (const [index, q] of result.items.entries()) {
      assert.equal(q.part, index); assert.equal(q.audio, source.optionAudioSrcs[index])
      assert.deepEqual(q.images, [source.optionImages[index]])
      assert.deepEqual(q.choices, [{ id: 'yes', text: 'Oui' }, { id: 'no', text: 'Non' }])
      assert.ok(!q.prompt.includes(source.options[index]))
      assert.ok(q.model.includes(source.options[index]))
    }
    assert.deepEqual(source, copy)
    const custom = adaptSourceItem(source, 'custom', 'Écoutez : trouvez le son demandé.')
    assert.equal(custom.items[0].prompt, 'Écoutez : trouvez le son demandé. Réponds oui ou non pour ce mot.')
  })
  await test('contradictory keys, duplicate words and absent targets cannot invent sound verdicts', () => {
    for (const patch of [{ labels: ['étranger'] }, { answer: 'chat' }, { labels: undefined }, { labels: ['chat', 'chat'] }, { options: ['chat', 'CHAT', 'chou'] }]) {
      const result = adaptSourceItem({ ...source, ...patch }, 'soutien', instruction)
      assert.equal(result.items.length, 0); assert.ok(result.issues.length)
    }
    assert.equal(adaptSourceItem(source, 'soutien', '').items.length, 0)
    assert.ok(adaptSourceItem({ ...source, labels: [], answer: '' }, 'soutien', instruction).items.every((q) => q.correctId === 'no'))
    assert.ok(adaptSourceItem({ ...source, labels: source.options, answer: source.options.join(' · ') }, 'soutien', instruction).items.every((q) => q.correctId === 'yes'))
  })
  await test('missing or shared ambiguous recordings are reported individually, preserving stable source positions', () => {
    const missing = adaptSourceItem({ ...source, optionAudioSrcs: ['', source.optionAudioSrcs[1], source.optionAudioSrcs[2]] }, 'soutien', instruction)
    assert.deepEqual(missing.items.map((q) => q.part), [1, 2]); assert.match(missing.issues[0], /enregistrement absent/)
    const shared = adaptSourceItem({ ...source, optionAudioSrcs: [source.optionAudioSrcs[0], source.optionAudioSrcs[0], source.optionAudioSrcs[2]] }, 'soutien', instruction)
    assert.deepEqual(shared.items.map((q) => q.part), [2]); assert.match(shared.issues[0], /plusieurs mots/)
  })
  await test('real listening and image sources keep the paper worksheet intact and grade positive, negative and timed-out solo answers', () => {
    for (const type of ['soutien-a-ecouter', 'soutien-a-ecouter-image']) {
      const entry = exerciseTypes.find((entry) => entry.id === type)
      assert.ok(entry, type)
      const config = { ...defaultPage('soutien-fr'), topic: entry.topic, exerciseType: type, count: 6 }
      const recipe = { ...demoRecipe(), seed: 20261107, pages: [config], libreMode: false }
      const paper = structuredClone(buildWorksheets(recipe.pages, recipe.seed))
      const game = convertRecipe(recipe)
      assert.equal(game.questions.length, 6, JSON.stringify(game.issues))
      const item = paper[0].blocks[0].items[0]
      for (const q of game.questions) {
        const index = q.source.part
        const correct = item.labels.includes(item.options[index]) ? 'yes' : 'no'
        assert.equal(game.corrections[q.id].choiceId, correct)
        assert.equal(q.audio, item.optionAudioSrcs[index])
        assert.ok(!JSON.stringify(q).includes('correctId'))
        if (type.endsWith('-image')) assert.deepEqual(q.images, [item.optionImages[index]])
      }
      for (const mode of ['class', 'solo']) {
        const plan = prepareGame(game, undefined, mode)
        assert.equal(plan.questions.length, 6)
        if (mode === 'solo') {
          for (const q of plan.questions) {
            const single = { ...plan, questions: [q], rounds: undefined, corrections: { [q.id]: plan.corrections[q.id] } }
            const start = startSession(single, 'solo')
            const chosen = transition(single, start, { type: 'SELECT', choiceId: plan.corrections[q.id].choiceId })
            assert.equal(chosen.history[0].correct, true); assert.equal(chosen.phase, 'revealed')
            const timedOut = transition(single, start, { type: 'TIMEOUT' })
            assert.equal(timedOut.history[0].correct, false)
          }
        }
      }
      assert.deepEqual(buildWorksheets(recipe.pages, recipe.seed), paper)
      assert.deepEqual(convertRecipe(recipe), game)
    }
  })
} finally { await server.close() }
