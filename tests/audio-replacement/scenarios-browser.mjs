import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5194'
const priorityMode = process.argv.includes('--priority')
const interlocutorsMode = process.argv.includes('--interlocuteurs')
const b1FinalMode = process.argv.includes('--b1-final')
const genderReviewMode = process.argv.includes('--gender-review')
const b1SuiteMode = process.argv.includes('--b1-suite')
const b1ComplementMode = process.argv.includes('--b1-complement')
const suiteMode = process.argv.includes('--a2-suite')
const a1ComplementMode = process.argv.includes('--a1-complement')
const a2ComplementMode = process.argv.includes('--a2-complement')
const a2FinalMode = process.argv.includes('--a2-final')
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
  const motherCorrection = b1ComplementMode ? JSON.parse(await readFile('docs/tcf/correction-interlocuteurs-pluie-20261114.json', 'utf8')).images[0] : null
  const interlocutors = interlocutorsMode ? JSON.parse(await readFile('docs/tcf/corrections-interlocuteurs-20261115.json', 'utf8')) : null
  const scenarioCatalog = interlocutorsMode ? JSON.parse(await readFile('src/tcf/association-image-themes.json', 'utf8')) : null
  const specs = b1FinalMode ? [
    { level: 'A2-B1', difficulty: 'avance', clips: ['b1-001-01', 'b1-001-03', 'b1-002-03', 'b1-041-01-01'] },
  ] : interlocutorsMode ? ['tcf-a1-s3-co-4', 'tcf-a1-s4-co-4'].map(exercise => ({ level: 'A0-A1', difficulty: 'facile', rawSlots: scenarioCatalog.sources.filter(source => source.exercise === exercise).sort((a, b) => a.dialogue - b.dialogue).map(source => source.audio) })) : genderReviewMode ? [
    { level: 'A0-A1', difficulty: 'facile', rawSlots: genderAudit.sources.filter(s => s.exercise === correction.exercise).sort((a, b) => a.dialogue - b.dialogue).map(s => s.audio) },
  ] : b1ComplementMode ? [
    { level: 'A2-B1', difficulty: 'avance', clips: ['b1-012-01', 'b1-001-01', 'b1-002-03', 'b1-041-01-01'] },
  ] : b1SuiteMode ? [
    { level: 'A2-B1', difficulty: 'avance', clips: ['b1-001-01', 'b1-001-03', 'b1-002-03', 'b1-041-01-01'] },
  ] : a2FinalMode ? [
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-043-04-01', 'a2-043-04-02', 'a2-046-04-03', 'a2-033-04'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-043-04-04', 'a2-043-04-01', 'a2-046-04-03', 'a2-035-01'] },
  ] : a2ComplementMode ? [
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-030-01', 'a2-030-03', 'a2-031-04', 'a2-032-01'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-032-03', 'a2-032-04', 'a2-034-03', 'a2-035-02'] },
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-044-04-01', 'a2-033-04', 'a2-035-01', 'a2-045-04-01'] },
  ] : a1ComplementMode ? [
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-049-04-03', 'a1-051-04-04', 'a1-030-03', 'a1-032-04'] },
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-030-04', 'a1-029-05', 'a1-032-01', 'a1-050-04-01'] },
    { level: 'A0-A1', difficulty: 'facile', clips: ['a1-031-04', 'a1-029-05', 'a1-030-03', 'a1-032-04'] },
  ] : suiteMode ? [
    { level: 'A1-A2', difficulty: 'moyen', clips: ['a2-033-04', 'a2-035-01', 'a2-044-04-03', 'a2-045-04-01'] },
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
    if (interlocutorsMode) for (const asset of interlocutors.images.filter(asset => asset.binding_action === 'replace_existing_scene')) {
      const oldRecipeScene = exercise.situations.find(scene => scene.image === asset.path)
      if (oldRecipeScene) oldRecipeScene.image = asset.previous_image
    }
    if (genderReviewMode) exercise.situations.find(s => s.dialogue === correction.dialogue).image = correction.previous_image
    if (b1ComplementMode) exercise.situations.find(s => s.dialogue === 2).image = motherCorrection.previous_image
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
    const clippedFrames = await stage.locator('.tcf-situation-frame').evaluateAll(nodes => nodes.flatMap((node, index) => {
      const frame = node.getBoundingClientRect()
      const body = node.closest('.sheet-body').getBoundingClientRect()
      return frame.bottom > body.bottom + 1 || frame.left < body.left - 1 || frame.right > body.right + 1
        ? [{ index, frameBottom: frame.bottom, bodyBottom: body.bottom }] : []
    }))
    assert.deepEqual(clippedFrames, [], 'All six scene frames must fit inside the printable page body')
    if (b1ComplementMode) {
      assert.equal(await stage.locator(`img[src="${motherCorrection.previous_image}"]`).count(), 0)
      assert.equal(await stage.locator(`img[src="${motherCorrection.path}"]`).count(), 1)
    }
    const selectors = page.locator('.tcf-co-audio-slots select')
    if (await selectors.count() === 4) {
      assert.equal(await selectors.first().inputValue(), config.tcfAudioSlots[0])
      assert.equal(await selectors.first().locator(`option[value="${config.tcfAudioSlots[1]}"]`).isDisabled(), true)
    }
    results.push({ level: specs[index].level, audios: config.tcfAudioSlots, images: expected, loaded: expected.length, native_new_pngs: expected.filter(p => p.includes('/delf-actif/')).length, clipped_frames: clippedFrames })
    if (b1FinalMode) {
      const pending = JSON.parse(await readFile('docs/tcf/generation-scenarios-b1-final-20261115.json', 'utf8'))
      assert(pending.images.every(asset => !expected.includes(asset.path)), 'Pending B1 scenes must stay outside audio associations')
      await stage.screenshot({ path: '/tmp/scenarios-b1-final-20261115-association.png' })
    }
    if (interlocutorsMode) {
      for (const asset of interlocutors.images.filter(asset => asset.binding_action === 'replace_existing_scene')) {
        assert.equal(await stage.locator(`img[src="${asset.previous_image}"]`).count(), 0)
        if (expected.includes(asset.path)) assert.equal(await stage.locator(`img[src="${asset.path}"]`).count(), 1)
      }
      await stage.screenshot({ path: `/tmp/scenarios-interlocuteurs-20261115-page-${index + 1}.png` })
    }
    if (b1ComplementMode) await stage.screenshot({ path: '/tmp/scenarios-b1-complement-20261114.png' })
    if (b1SuiteMode) await stage.screenshot({ path: '/tmp/scenarios-b1-suite-20261114.png' })
    if (a2FinalMode) await stage.screenshot({ path: `/tmp/scenarios-a2-final-20261114-page-${index + 1}.png` })
    if (genderReviewMode) {
      assert.equal(await stage.locator(`img[src="${correction.previous_image}"]`).count(), 0)
      assert.equal(await stage.locator(`img[src="${correction.path}"]`).count(), 1)
      await stage.screenshot({ path: '/tmp/scenarios-genres-20261114-ancienne-recette.png' })
    }
    if (priorityMode) await stage.screenshot({ path: `/tmp/scenarios-priorite-20261114-page-${index + 1}.png` })
  }
  assert.deepEqual(errors, [])
  const nativeNewPngs = new Set(results.flatMap(r => r.images).filter(p => p.includes('/delf-actif/'))).size
  if (!a1ComplementMode && !a2ComplementMode && !a2FinalMode && !interlocutorsMode && !b1FinalMode) assert.equal(nativeNewPngs, genderReviewMode ? 1 : (b1SuiteMode || b1ComplementMode) ? 4 : priorityMode ? 21 : suiteMode ? 4 : 7)
  let galleryImages = 0
  if (suiteMode || a1ComplementMode || a2ComplementMode || a2FinalMode || interlocutorsMode || b1FinalMode) {
    const suite = JSON.parse(await readFile(b1FinalMode ? 'docs/tcf/generation-scenarios-b1-final-20261115.json' : interlocutorsMode ? 'docs/tcf/corrections-interlocuteurs-20261115.json' : a2FinalMode ? 'docs/tcf/generation-scenarios-a2-final-20261114.json' : a2ComplementMode ? 'docs/tcf/generation-scenarios-a2-complement-20261114.json' : a1ComplementMode ? 'docs/tcf/generation-scenarios-a1-complement-20261114.json' : 'docs/tcf/generation-scenarios-a2-suite-20261114.json', 'utf8'))
    const assets = a2FinalMode ? [...suite.images, ...suite.reuses] : suite.images
    const catalogue = JSON.parse(await readFile('src/tcf/association-image-themes.json', 'utf8'))
    for (const asset of assets.filter(a => interlocutorsMode ? a.binding_action === 'replace_existing_scene' : a.gender_review.status === 'documented_roles_match')) {
      for (const binding of asset.bindings) {
        const active = catalogue.sources.find(source => source.exercise === binding.exercise && (source.dialogue ?? 1) === (binding.dialogue ?? 1))
        assert.ok(active)
        assert(results.some(result => result.audios.includes(active.audio) && result.images.includes(active.image)), `The currently selected approved scene appears in an actual association: ${active.image}`)
      }
    }
    await page.goto(`${base}/images`, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'Galerie d’images', exact: true }).waitFor()
    await page.getByLabel('Type d’image', { exact: true }).selectOption('Scénario')
    const themeFilter = page.getByLabel('Thème', { exact: true })
    const hasThemeFilter = await themeFilter.count() > 0
    if (!interlocutorsMode && hasThemeFilter) await themeFilter.selectOption(b1FinalMode ? 'CO CFR B1' : a1ComplementMode ? 'CO CFR A1' : 'CO CFR A2')
    for (const asset of assets) {
      const theme = b1FinalMode ? 'CO CFR B1' : interlocutorsMode ? (asset.binding_action === 'replace_prepared_scene' ? 'CO CFR B1' : 'CO CFR A1') : a1ComplementMode ? 'CO CFR A1' : 'CO CFR A2'
      if (interlocutorsMode && hasThemeFilter) await themeFilter.selectOption(theme)
      await page.getByLabel('Rechercher une image', { exact: true }).fill(hasThemeFilter ? asset.label : `${theme} ${asset.label}`)
      const image = page.locator(`.gallery-card img[src="${asset.path}"]`)
      await image.waitFor();await image.evaluate(node => node.decode())
      assert.deepEqual(await image.evaluate(node => [node.naturalWidth, node.naturalHeight]), [asset.width, asset.height])
      galleryImages++
    }
    await page.screenshot({ path: b1FinalMode ? '/tmp/scenarios-b1-final-20261115-gallery.png' : interlocutorsMode ? '/tmp/scenarios-interlocuteurs-20261115-gallery.png' : a2FinalMode ? '/tmp/scenarios-a2-final-20261114-gallery.png' : a2ComplementMode ? '/tmp/scenarios-a2-complement-20261114-gallery.png' : a1ComplementMode ? '/tmp/scenarios-a1-complement-20261114-gallery.png' : '/tmp/scenarios-a2-suite-20261114-gallery.png' })
  }
  const report = b1FinalMode ? 'docs/tcf/scenarios-b1-final-20261115-browser.json' : interlocutorsMode ? 'docs/tcf/scenarios-interlocuteurs-20261115-browser.json' : b1ComplementMode ? 'docs/tcf/scenarios-b1-complement-20261114-browser.json' : b1SuiteMode ? 'docs/tcf/scenarios-b1-suite-20261114-browser.json' : genderReviewMode ? 'docs/tcf/scenarios-genres-20261114-browser.json' : a2FinalMode ? 'docs/tcf/scenarios-a2-final-20261114-browser.json' : a2ComplementMode ? 'docs/tcf/scenarios-a2-complement-20261114-browser.json' : a1ComplementMode ? 'docs/tcf/scenarios-a1-complement-20261114-browser.json' : suiteMode ? 'docs/tcf/scenarios-a2-suite-20261114-browser.json' : priorityMode ? 'docs/tcf/scenarios-priorite-20261114-browser.json' : 'docs/tcf/scenarios-audio-20261114-browser.json'
  await writeFile(report, JSON.stringify({ date: interlocutorsMode || b1FinalMode ? '2026-11-15' : '2026-11-14', results, gallery_images: galleryImages, errors, human_audio_listening_performed: false }, null, 2) + '\n')
  console.log(JSON.stringify({ pages: results.length, native_new_pngs: nativeNewPngs, images: results.reduce((n, r) => n + r.loaded, 0), gallery_images: galleryImages, errors }))
  await context.close()
} finally { await browser?.close(); await server.close() }
