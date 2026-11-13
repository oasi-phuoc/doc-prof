import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
const base = 'http://127.0.0.1:5193'
const server = await createServer({ cacheDir: '/tmp/clairfle-delf-actif-browser', server: { host: '127.0.0.1', port: 5193, strictPort: true } })
await server.listen()
let browser
const errors = [], results = []
try {
  const { buildTpfFamilyTestPages } = await server.ssrLoadModule('/src/tcf/generate.ts')
  const configs = buildTpfFamilyTestPages('tpf', 531)
  const sample = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
  const pages = []
  for (const [level, difficulty] of [['a0-a1', 'facile'], ['a1-a2', 'moyen'], ['a2-b1', 'avance']]) {
    const bank = JSON.parse(await readFile(`src/tcf/content/${level}/co.json`, 'utf8'))
    const exercise = bank.find(ex => ex.id.startsWith('tcf-delf-actif-') && ex.questions.length >= 4)
    assert.ok(exercise)
    const config = configs.find(config => config.difficulty === difficulty && config.exerciseType === 'tcf-co-ex-3')
    assert.ok(config, difficulty)
    pages.push({ ...config, tcfBankId: exercise.id, tcfExercise: { ...exercise, questions: exercise.questions.slice(0, 3) }, tcfQuestionCount: 3, columns: 1 })
  }
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(fiche => {
    if (location.pathname === '/generateur') history.replaceState({ clairfleFiche: fiche }, '', location.href)
  }, { id: 'delf-actif-import-proof', name: 'Nouveaux audios DELF Actif', recipe: { ...sample, pages, seed: 531, evalMode: true, libreMode: false, libreSnapshot: null } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/generateur`)
  const stage = page.locator('.sheet-stage:not(.print-only-sheets)')
  await stage.locator('.tcf-enonce').first().waitFor({ timeout: 120000 })
  for (const [index, config] of pages.entries()) {
    if (index) await page.getByLabel(`Page ${index + 1}`, { exact: true }).click()
    // The existing teacher/correction view exposes playback controls.
    const correction = page.getByRole('button', { name: 'Fiche élève (cliquer pour corrigé)', exact: true })
    if (await correction.count()) await correction.click()
    const audio = stage.locator(`audio[src="${config.tcfExercise.support.audio}"]`).first()
    await audio.waitFor()
    const playback = await audio.evaluate(async node => {
      node.muted = true
      const metadata = new Promise((resolve, reject) => {
        if (node.readyState >= 1) resolve()
        else { node.addEventListener('loadedmetadata', resolve, { once: true }); node.addEventListener('error', () => reject(new Error(`Audio error ${node.error?.code}`)), { once: true }) }
      })
      node.load(); await metadata; await node.play()
      await new Promise(resolve => setTimeout(resolve, 250)); node.pause()
      return { src: node.getAttribute('src'), duration: node.duration, currentTime: node.currentTime, mediaError: node.error?.code ?? null }
    })
    assert.ok(playback.duration > 0); assert.ok(playback.currentTime > 0); assert.equal(playback.mediaError, null)
    const groups = stage.getByRole('group', { name: 'Forme de réponse', exact: true })
    assert.equal(await groups.count(), 3)
    const first = groups.first()
    await first.getByRole('button', { name: 'Forme Phrase', exact: true }).click()
    await first.locator('[aria-label="Forme Phrase"][aria-pressed="true"]').waitFor()
    await first.getByRole('button', { name: 'Forme Texte', exact: true }).click()
    await first.locator('[aria-label="Forme Texte"][aria-pressed="true"]').waitFor()
    results.push({ level: config.tcfExercise.niveau, questions: 3, textInlineSwitch: 'passed', playback })
  }
  assert.deepEqual(errors, [])
  await writeFile('docs/tcf/delf-actif-20261113/browser-results.json', JSON.stringify({ results, errors, note: 'Technical metadata decoding and short muted playback; not a human listen or a full-recording listening claim.' }, null, 2) + '\n')
  console.log(JSON.stringify({ levels: results.length, playback: 'passed', questionFormats: 'passed', errors }))
  await context.close()
} finally { await browser?.close(); await server.close() }
