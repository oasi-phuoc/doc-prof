import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { createGameSource, renewGameSource, saveGameRun, nextGameSeed, questionSourceKey } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const recipe = demoRecipe()
  recipe.pages = [{ ...recipe.pages[0], libreItems: undefined, count: 10, numberLibre: true, numberMin: 1, numberMax: 10, numberDecimals: false }]
  recipe.libreMode = false
  const stored = new Map()
  globalThis.sessionStorage = { getItem: (key) => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) }
  await test('new saved-template games vary questions within the original range and keep the template untouched', () => {
    const original = structuredClone(recipe)
    let source = createGameSource({ recipe, name: 'Additions de 1 à 10' }, 'saved', 'range-template')
    const first = convertRecipe(source.recipe)
    assert.equal(first.questions.length, 10)
    const originalPrompts = first.questions.map((question) => question.prompt)
    for (let run = 0; run < 5; run++) {
      const previous = source.recipe.seed
      source = renewGameSource(source, null)
      assert.notEqual(source.recipe.seed, previous)
      const game = convertRecipe(source.recipe)
      assert.equal(game.questions.length, 10)
      assert.notDeepEqual(game.questions.map((question) => question.prompt), originalPrompts)
      for (const question of game.questions) {
        const numbers = [...question.prompt.matchAll(/\d+/g)].map((match) => Number(match[0]))
        assert.equal(numbers.length, 2)
        assert.ok(numbers.every((number) => number >= 1 && number <= 10))
      }
      assert.deepEqual(source.recipe.pages, original.pages)
    }
    assert.deepEqual(recipe, original)
  })
  await test('resume metadata restores the current seed and selected source positions, not the template seed', () => {
    const source = createGameSource({ recipe, name: 'Test' }, 'saved', 'resume-template')
    const keys = convertRecipe(source.recipe).questions.slice(0, 3).map(questionSourceKey)
    assert.equal(saveGameRun(source, keys), true)
    const restored = createGameSource({ recipe, name: 'Test' }, 'saved', 'resume-template')
    assert.equal(restored.recipe.seed, source.recipe.seed)
    assert.deepEqual(restored.selectedKeys, keys)
    assert.deepEqual(convertRecipe(restored.recipe), convertRecipe(source.recipe))
    const next = renewGameSource(restored, keys)
    assert.notEqual(next.recipe.seed, restored.recipe.seed)
    assert.deepEqual(next.selectedKeys, keys)
  })
  await test('edited documents, authored items, media and instructions stay associated with their context', () => {
    const authored = demoRecipe()
    const source = createGameSource({ recipe: authored, name: 'Données libres' }, 'draft')
    const next = renewGameSource(source, null)
    assert.deepEqual(next.recipe.pages, authored.pages)
    assert.deepEqual(next.recipe.imageOverrides, authored.imageOverrides)
    assert.deepEqual(convertRecipe(next.recipe).questions.slice(0, 3).map((question) => question.prompt), convertRecipe(source.recipe).questions.slice(0, 3).map((question) => question.prompt))
    assert.notEqual(nextGameSeed(0), undefined)
  })
} finally { delete globalThis.sessionStorage; await server.close() }
