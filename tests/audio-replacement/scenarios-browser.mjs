import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5194'
const priorityMode = process.argv.includes('--priority')
const genderReviewMode = process.argv.includes('--gender-review')
const server = await createServer({ cacheDir: '/tmp/clairfle-scenarios-browser', server: { host: '127.0.0.1', port: 5194, strictPort: true } })
await server.listen()
let browser
const errors = [], results = []
try {
  const { buildTpfFamilyTestPages } = await server.ssrLoadModule('/src/tcf/generate.ts')
  const { drawAssociationCompose } = await server.ssrLoadModule('/src/tcf/draw-series.ts')
  const { createRng } = await server.ssrLoadModule('/src/math/rng.ts')
  const { tcfImageSrc } = await server.ssrLoadModule('/src/tcf/media.ts')
  const configs = buildTpfFamilyTestPages('tpf', 923)
  const sample = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
  const genderAudit = genderReviewMode ? JSON.parse(await readFile('docs/tcf/recontrole-genres-scenes-20261114.json', 'utf8')) : null
  const correction = genderAudit?.corrections[0]
  const specs = genderReviewMode ? [
    { level: 'A0-A1', difficulty: 'facile', rawSlots: genderAudit.sources.filter(s => s.exercise === correction.exercise).sort((a, b) => a.dialogue - b.dialogue).map(s => s.audio) },
  ] : priorityMode ? [
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-029-02', 'a1-029-05', 'a1-030-03', 'a1-032-04'] },
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-032-01', 'a1-050-04-01', 'a1-029-04', 'a1-029-05'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-033-04', 'a2-035-01', 'a2-032-01', 'a2-031-04'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-032-04', 'a2-043-04-01', 'a2-046-04-03', 'a2-030-03'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-035-02', 'a2-044-04-01', 'a2-034-03', 'a2-033-03'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-031-01', 'a2-032-03', 'a2-030-04', 'a2-043-04-02'] },
  ] : [
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-047-01', 'a1-048-01', 'a1-051-04-02', 'a1-044-01'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-044-04-03', 'a2-045-04-01', 'a2-032-02', 'a2-033-01'] },
  ]
  const pages = specs.map(spec => {
    const slots = spec.rawSlots ?? spec.clips.map(id => `/lib/audio/tcf/co/delf-actif-${id.slice(0, 2)}/${id}.mp3`)
    const exercise = drawAssociationCompose(spec.level, createRng(923), { audioSlots: slots })
    assert.ok(exercise)
    if (genderReviewMode) exercise.situations.find(s => s.dialogue === correction.dialogue).image = correction.previous_image
    const config = configs.find(c => c.difficulty === spec.difficulty && c.exerciseType === 'tcf-co-ex-4')
    assert.ok(config)
    return { ...config, tcfBankId: undefined, tcfExercise: exercise, tcfAudioSlots: slots, tcfAudioPickMode: 'libre', columns: 1 }
  })
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(fiche => {
    if (location.pathname === '/generateur') history.replaceState({ clairfleFiche: fiche }, '', location.href)
  }, { id: 'scenario-expansion-proof', name: 'Scénarios A1 A2', recipe: { ...sample, pages, seed: 923, evalMode: true, libreMode: false, libreSnapshot: null } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/generateur`)
  const stage = page.locator('.sheet-stage:not(.print-only-sheets)')
  for (const [index, config] of pages.entries()) {
    if (index) await page.getByLabel(`Page ${index + 1}`, { exact: true }).click()
    const expected = config.tcfExercise.situations.map(s => tcfImageSrc(s.image))
    for (const src of expected) {
      const image = stage.locator(`img[src="${src}"]`).first()
      await image.waitFor({ timeout: 120000 })
      await image.evaluate(node => node.decode())
      const size = await image.evaluate(node => ({ width: node.naturalWidth, height: node.naturalHeight }))
      assert.equal(size.width * 3, size.height * 4)
      if (src.includes('/delf-actif/')) assert.deepEqual(size, { width: 1448, height: 1086 })
    }
    const selectors = page.locator('.tcf-co-audio-slots select')
    if (await selectors.count() === 4) {
      assert.equal(await selectors.first().inputValue(), config.tcfAudioSlots[0])
      assert.equal(await selectors.first().locator(`option[value="${config.tcfAudioSlots[1]}"]`).isDisabled(), true)
    }
    results.push({ level: specs[index].level, audios: config.tcfAudioSlots, images: expected, loaded: expected.length, native_new_pngs: expected.filter(p => p.includes('/delf-actif/')).length })
    if (priorityMode) await stage.screenshot({ path: `/tmp/scenarios-priorite-20261114-page-${index + 1}.png` })
    if (genderReviewMode) {
      assert.equal(await stage.locator(`img[src="${correction.previous_image}"]`).count(), 0)
      assert.equal(await stage.locator(`img[src="${correction.path}"]`).count(), 1)
      await stage.screenshot({ path: '/tmp/scenarios-genres-20261114-ancienne-recette.png' })
    }
  }
  assert.deepEqual(errors, [])
  const nativeNewPngs = new Set(results.flatMap(r => r.images).filter(p => p.includes('/delf-actif/'))).size
  assert.equal(nativeNewPngs, genderReviewMode ? 1 : priorityMode ? 21 : 7)
  const report = genderReviewMode ? 'docs/tcf/scenarios-genres-20261114-browser.json' : priorityMode ? 'docs/tcf/scenarios-priorite-20261114-browser.json' : 'docs/tcf/scenarios-audio-20261114-browser.json'
  await writeFile(report, JSON.stringify({ date: '2026-11-14', results, errors, human_audio_listening_performed: false }, null, 2) + '\n')
  console.log(JSON.stringify({ pages: results.length, native_new_pngs: nativeNewPngs, images: results.reduce((n, r) => n + r.loaded, 0), errors }))
  await context.close()
} finally { await browser?.close(); await server.close() }
