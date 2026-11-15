import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const read = async path => JSON.parse(await readFile(path, 'utf8'))
const registerPath = process.argv[2] ?? 'docs/tcf/validation-directe-scenes-20261115.json'
const reportPath = process.argv[3] ?? 'docs/tcf/validation-directe-20261115-browser.json'
const screenshotPrefix = `/tmp/${basename(reportPath, '.json').replace(/-browser$/, '')}`
const direct = await read(registerPath)
const library = new Map((await read('docs/tcf/images-generees.json')).images.map(image => [image.path, image]))
const gallery = new Map((await read('src/gallery/catalog.generated.json')).map(image => [image.src, image]))
const base = 'http://127.0.0.1:5194'
const server = await createServer({ cacheDir: '/tmp/tcf-direct-validation-browser', server: { host: '127.0.0.1', port: 5194, strictPort: true } })
await server.listen()
let browser
const errors = [], results = []
try {
  const { buildTpfFamilyTestPages } = await server.ssrLoadModule('/src/tcf/generate.ts')
  const { drawAssociationCompose } = await server.ssrLoadModule('/src/tcf/draw-series.ts')
  const { createRng } = await server.ssrLoadModule('/src/math/rng.ts')
  const configs = buildTpfFamilyTestPages('tpf', 923)
  const remaining = [...direct.sources], pages = []
  while (remaining.length) {
    const first = remaining.shift(), pack = [first]
    const level = first.exercise.includes('-b1-') ? 'A2-B1' : first.exercise.includes('-a2-') ? 'A1-A2' : 'A0-A1'
    const difficulty = level === 'A2-B1' ? 'avance' : level === 'A1-A2' ? 'moyen' : 'facile'
    for (let i = 0; i < remaining.length && pack.length < 4;) {
      const trial = [...pack, remaining[i]]
      if (drawAssociationCompose(level, createRng(923), { audioSlots: trial.map(source => source.audio) })) pack.push(...remaining.splice(i, 1))
      else i++
    }
    const drawn = drawAssociationCompose(level, createRng(923), { audioSlots: pack.map(source => source.audio) })
    assert.ok(drawn)
    const config = configs.find(config => config.difficulty === difficulty && config.exerciseType === 'tcf-co-ex-4')
    assert.ok(config)
    pages.push({ ...config, tcfBankId: undefined, tcfExercise: drawn, tcfAudioSlots: drawn.support.audios, tcfAudioPickMode: 'libre', columns: 1 })
  }
  const sample = await read('docs/interactive/demo-source-recipe.json')
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(fiche => {
    if (location.pathname === '/generateur') history.replaceState({ clairfleFiche: fiche }, '', location.href)
  }, { id: 'direct-scene-validation', name: 'Scènes validées directement', recipe: { ...sample, pages, seed: 923, evalMode: true, libreMode: false, libreSnapshot: null } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/generateur`)
  const stage = page.locator('.sheet-stage:not(.print-only-sheets)')
  for (const [index, config] of pages.entries()) {
    if (index) await page.getByLabel(`Page ${index + 1}`, { exact: true }).click()
    const expected = config.tcfExercise.situations.map(scene => scene.image)
    for (const src of expected) {
      const image = stage.locator(`img[src="${src}"]`).first()
      await image.waitFor({ timeout: 120000 }); await image.evaluate(node => node.decode())
      const [width, height] = await image.evaluate(node => [node.naturalWidth, node.naturalHeight])
      assert.equal(width * 3, height * 4)
    }
    const clippedFrames = await stage.locator('.tcf-situation-frame').evaluateAll(nodes => nodes.flatMap((node, index) => {
      const frame = node.getBoundingClientRect(), body = node.closest('.sheet-body').getBoundingClientRect()
      return frame.bottom > body.bottom + 1 || frame.left < body.left - 1 || frame.right > body.right + 1 ? [index] : []
    }))
    assert.deepEqual(clippedFrames, [])
    results.push({ audios: config.tcfAudioSlots, images: expected, loaded: expected.length, clipped_frames: clippedFrames })
    if (index < 2) await stage.screenshot({ path: `${screenshotPrefix}-page-${index + 1}.png` })
  }
  for (const source of direct.sources) assert(results.some(result => result.audios.includes(source.audio) && result.images.includes(source.image)), source.exercise)
  await page.goto(`${base}/images`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Galerie d’images', exact: true }).waitFor()
  await page.getByLabel('Type d’image', { exact: true }).selectOption('Scénario')
  const assets = [...new Set(direct.sources.map(source => source.image))]
  for (const src of assets) {
    const asset = library.get(src), entry = gallery.get(src)
    assert.ok(asset); assert.ok(entry)
    assert(entry.themes.includes('Scènes validées directement'))
    await page.getByLabel('Rechercher une image', { exact: true }).fill(entry.label)
    const image = page.locator(`.gallery-card img[src="${src}"]`)
    await image.waitFor(); await image.evaluate(node => node.decode())
    assert.deepEqual(await image.evaluate(node => [node.naturalWidth, node.naturalHeight]), [asset.width, asset.height])
  }
  await page.screenshot({ path: `${screenshotPrefix}-gallery.png` })
  assert.deepEqual(errors, [])
  const report = { date: '2026-11-15', register: registerPath, results, selected_audio_scenes: direct.sources.length, activated_scenes: direct.summary.activated_prepared_scenes, gallery_images: assets.length, errors, human_audio_listening_performed: false }
  await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify({ pages: pages.length, selected_audio_scenes: direct.sources.length, association_images: results.reduce((n, result) => n + result.loaded, 0), gallery_images: assets.length, errors }))
  await context.close()
} finally { await browser?.close(); await server.close() }
