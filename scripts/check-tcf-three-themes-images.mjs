import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'

const review = JSON.parse(readFileSync('docs/tcf/po-trois-themes-images-20261107.json', 'utf8'))
const approved = new Map(review.images.map((r) => [r.after, r]))
for (const row of review.images) {
  assert.equal(row.status, 'visually_reviewed_for_theme')
  assert.ok(!row.after.includes('/vocabulaire/'))
  assert.equal(createHash('sha256').update(readFileSync(`public${row.after}`)).digest('hex'), row.sha256)
}
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { threeThemeImageSrc } = await vite.ssrLoadModule('/src/tcf/three-themes-images.ts')
  const { tcfExerciseItems } = await vite.ssrLoadModule('/src/tcf/generate.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  for (const row of review.images) {
    assert.equal(threeThemeImageSrc(row.before), row.after)
    assert.equal(threeThemeImageSrc(row.before.slice('/lib/images/'.length)), row.after)
    assert.equal(threeThemeImageSrc(row.before + '?v=1'), row.after + '?v=1')
    assert.equal(threeThemeImageSrc(row.after), row.after)
  }
  const draws = new Set()
  for (const level of ['a0-a1', 'a1-a2']) {
    const exercise = JSON.parse(readFileSync(`src/tcf/content/${level}/po.json`, 'utf8')).find((e) => e.type_exercice === 'trois_themes')
    assert.equal(exercise.support.themes.length, 15)
    for (const theme of exercise.support.themes) {
      assert.ok(theme.images.length >= 4)
      assert.equal(new Set(theme.images).size, theme.images.length)
      assert.ok(theme.images.every((p) => approved.has(p)))
    }
    for (let seed = 1; seed <= 32; seed++) {
      const items = tcfExerciseItems(exercise, createRng(seed))
      const themes = items[0].tcf.exercise.support.themes
      assert.equal(themes.length, 3)
      assert.equal(new Set(themes.map((t) => t.theme)).size, 3)
      for (const theme of themes) {
        assert.equal(theme.images.length, 4)
        const pool = exercise.support.themes.find((t) => t.theme === theme.theme).images
        assert.ok(theme.images.every((p) => pool.includes(p) && !p.includes('/vocabulaire/')))
      }
      draws.add(JSON.stringify(themes.map((t) => [t.theme, t.images])))
    }
    // A saved sheet containing legacy URLs must also migrate on regeneration.
    const legacy = structuredClone(exercise)
    for (const theme of legacy.support.themes) theme.images = review.images.filter((r) => r.theme === theme.theme).map((r) => r.before)
    const migrated = tcfExerciseItems(legacy, createRng(123))[0].tcf.exercise.support.themes
    assert.ok(migrated.every((t) => t.images.every((p) => approved.has(p))))
  }
  assert.ok(draws.size > 20, 'theme selection and image selection vary with refresh seed')
  console.log('PO trois thèmes : 15 thèmes, 238 usages remplacés, 64 tirages et anciens supports vérifiés.')
} finally { await vite.close() }
