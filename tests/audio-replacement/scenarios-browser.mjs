import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5194'
const priorityMode = process.argv.includes('--priority')
const suiteMode = process.argv.includes('--a2-suite')
const a1ComplementMode = process.argv.includes('--a1-complement')
const server = await createServer({ cacheDir: '/tmp/clairfle-scenarios-browser', server: { host: '127.0.0.1', port: 5194, strictPort: true } })
await server.listen()
let browser
const errors = [], results = []
try {
  const { buildTpfFamilyTestPages } = await server.ssrLoadModule('/src/tcf/generate.ts')
  const { drawAssociationCompose } = await server.ssrLoadModule('/src/tcf/draw-series.ts')
  const { createRng } = await server.ssrLoadModule('/src/math/rng.ts')
  const configs = buildTpfFamilyTestPages('tpf', 923)
  const sample = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
  const specs = a1ComplementMode ? [
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-049-04-03', 'a1-051-04-04', 'a1-030-03', 'a1-032-04'] },
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-030-04', 'a1-029-05', 'a1-032-01', 'a1-050-04-01'] },
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-031-04', 'a1-029-05', 'a1-030-03', 'a1-032-04'] },
  ] : suiteMode ? [
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-033-04', 'a2-035-01', 'a2-044-04-03', 'a2-045-04-01'] },
  ] : priorityMode ? [
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-029-02', 'a1-029-05', 'a1-030-03', 'a1-032-04'] },
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-032-01', 'a1-050-04-01', 'a1-029-04', 'a1-029-05'] },
  ] : [
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-047-01', 'a1-048-01', 'a1-051-04-02', 'a1-044-01'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-044-04-03', 'a2-045-04-01', 'a2-032-02', 'a2-033-01'] },
  ]
  const pages = specs.map(spec => {
    const slots = spec.clips.map(id => `/lib/audio/tcf/co/delf-actif-${id.slice(0, 2)}/${id}.mp3`)
    const exercise = drawAssociationCompose(spec.level, createRng(923), { audioSlots: slots })
    assert.ok(exercise)
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
    const expected = config.tcfExercise.situations.map(s => s.image)
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
  }
  assert.deepEqual(errors, [])
  const nativeNewPngs = new Set(results.flatMap(r => r.images).filter(p => p.includes('/delf-actif/'))).size
  if (!a1ComplementMode) assert.equal(nativeNewPngs, suiteMode ? 4 : 7)
  let galleryImages = 0
  if (suiteMode || a1ComplementMode) {
    const suite = JSON.parse(await readFile(a1ComplementMode ? 'docs/tcf/generation-scenarios-a1-complement-20261114.json' : 'docs/tcf/generation-scenarios-a2-suite-20261114.json', 'utf8'))
    for (const asset of suite.images.filter(a => a.gender_review.status === 'documented_roles_match')) {
      assert(results.some(result => result.images.includes(asset.path)), `New bound scene appears in an actual association: ${asset.path}`)
    }
    await page.goto(`${base}/images`, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'Galerie d’images', exact: true }).waitFor()
    await page.getByLabel('Type d’image', { exact: true }).selectOption('Scénario')
    await page.getByLabel('Thème', { exact: true }).selectOption(a1ComplementMode ? 'CO CFR A1' : 'CO CFR A2')
    for (const asset of suite.images) {
      await page.getByLabel('Rechercher une image', { exact: true }).fill(asset.label)
      const image = page.locator(`.gallery-card img[src="${asset.path}"]`)
      await image.waitFor();await image.evaluate(node => node.decode())
      assert.deepEqual(await image.evaluate(node => [node.naturalWidth, node.naturalHeight]), [1448, 1086])
      galleryImages++
    }
    await page.screenshot({ path: a1ComplementMode ? '/tmp/scenarios-a1-complement-20261114-gallery.png' : '/tmp/scenarios-a2-suite-20261114-gallery.png' })
  }
  const report = a1ComplementMode ? 'docs/tcf/scenarios-a1-complement-20261114-browser.json' : suiteMode ? 'docs/tcf/scenarios-a2-suite-20261114-browser.json' : priorityMode ? 'docs/tcf/scenarios-priorite-20261114-browser.json' : 'docs/tcf/scenarios-audio-20261114-browser.json'
  await writeFile(report, JSON.stringify({ date: '2026-11-14', results, gallery_images: galleryImages, errors, human_audio_listening_performed: false }, null, 2) + '\n')
  console.log(JSON.stringify({ pages: results.length, native_new_pngs: nativeNewPngs, images: results.reduce((n, r) => n + r.loaded, 0), gallery_images: galleryImages, errors }))
  await context.close()
} finally { await browser?.close(); await server.close() }
