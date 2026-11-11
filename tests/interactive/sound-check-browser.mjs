import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-sound-check-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const image = '/lib/images/tcf/co/objets/5-tomates.webp'
recipe.pages = [{ ...recipe.pages[0], libreInstruction: 'Écoutez les mots et cochez quand vous entendez le son /a/.', libreItems: [{
  layout: 'listen-check', options: ['chat', 'sac', 'chou', 'mot sans piste'], labels: ['chat', 'chou'], answer: 'chat · chou',
  optionAudioSrcs: ['/__sound-0.mp3', '/__sound-1.mp3', '/__sound-2.mp3', ''], optionImages: ['', '', image, ''],
}] }]
const original = structuredClone(recipe)
const saved = { id: 'sound-source', name: 'Reconnaître un son', domains: ['soutien-fr'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const fixture = JSON.parse(await readFile('docs/interactive/demo-fixture.json', 'utf8'))
// A decodable recording exercises playback. Catalogue tests check the real source
// mappings independently of these synthetic yes/no keys.
const recording = await readFile(`public${fixture.questions.find((q) => q.audio).audio}`)
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const errors = [], methods = [], results = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const answer = (page, text) => page.locator('.ci-answer').filter({ has: page.locator('.ci-answer-content > span').filter({ hasText: new RegExp(`^${text}$`) }) })
async function listen(page, index) {
  const audio = page.locator('audio')
  assert.equal(new URL(await audio.getAttribute('src'), base).pathname, `/__sound-${index}.mp3`)
  await audio.evaluate(async (audio) => { audio.muted = true; audio.playbackRate = 16; await audio.play() })
  await page.waitForFunction(() => document.querySelector('audio')?.ended)
}
async function reveal(page) { await button(page, 'Signal : levez vos cartes').click(); await button(page, 'Discuter').click(); await button(page, 'Enseignant : révéler').click() }
async function correction(page, expected) {
  await page.locator('.ci-answer-key').waitFor()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), expected)
  assert.equal(await page.locator('.ci-answer-muted').count(), 1)
  assert.equal(await page.locator('.ci-margin-answer, .ci-model-answer').count(), 0)
}
try {
  for (const [width, height] of [[390, 844], [1366, 768]]) {
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'sound-fixture-only'))
    await context.route('**/__test_api/fiches', async (route) => { methods.push(route.request().method()); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
    await context.route('**/__sound-*.mp3', (route) => route.fulfill({ status: 200, contentType: 'audio/mpeg', body: recording }))
    const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}/interactif/${saved.id}`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 3)
    await page.getByText(/Mot 4 : enregistrement absent/).waitFor({ state: 'attached' })
    await page.locator('.ci-launch').click()
    assert.equal(await page.locator('.ci-question h1').innerText(), 'Entends-tu le son /a/ ?')
    assert.equal(await page.locator('.ci-answer:disabled').count(), 2)
    assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
    await listen(page, 0); await reveal(page); await correction(page, 'Oui')
    await button(page, 'Question suivante').click()
    await listen(page, 1); await reveal(page); await correction(page, 'Non')
    // Exact source part and the negative verdict survive an ordinary reload.
    await page.reload(); await button(page, 'Reprendre la séance').click()
    await correction(page, 'Non')
    await button(page, 'Question suivante').click()
    await listen(page, 2)
    assert.equal(new URL(await page.locator('.ci-stimulus-images .ci-image-zoom img').getAttribute('src'), base).pathname, image)
    await reveal(page); await correction(page, 'Oui')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.screenshot({ path: `docs/interactive/screenshots/sound-check-${width}.png` })
    await button(page, 'Quitter la séance').click()
    await page.locator('.ci-launch:enabled').waitFor()
    await button(page, 'Mode de jeu').click()
    await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
    await button(page, 'Régler le minuteur').click()
    await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('10')
    await button(page, 'Fermer les réglages').click()
    await page.clock.install()
    await page.locator('.ci-launch').click()
    await listen(page, 0)
    await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 100))
    await answer(page, 'Non').click(); await correction(page, 'Oui')
    assert.ok((await page.locator('.ci-correction-status').innerText()).includes('Faux'))
    await page.clock.runFor(10100); await page.clock.resume()
    await listen(page, 1)
    await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 100))
    await answer(page, 'Non').click(); await correction(page, 'Non')
    assert.ok((await page.locator('.ci-correction-status').innerText()).includes('Félicitations'))
    await page.clock.runFor(10100); await page.clock.resume()
    await listen(page, 2)
    await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 100))
    await page.clock.runFor(5200); await correction(page, 'Oui')
    assert.equal((await page.locator('.ci-correction-status').innerText()).trim(), 'Temps écoulé')
    await page.clock.runFor(10100)
    await page.locator('.ci-summary').waitFor()
    await page.clock.resume()
    await page.waitForFunction(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); const rows = await requestLocal('sessions', 'readonly', (store) => store.getAll()); return rows.some((row) => row.mode === 'solo' && row.checkpoint?.state.finished) })
    const history = await page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); const rows = await requestLocal('sessions', 'readonly', (store) => store.getAll()); return rows.find((row) => row.mode === 'solo' && row.checkpoint?.state.finished).checkpoint.state.history })
    assert.deepEqual(history.map((attempt) => attempt.correct), [false, true, false])
    results.push({ viewport: `${width}x${height}`, class: 'three independent listening questions, source sound and image, two response cards, teacher-only reveal and exact negative-result reload', solo: 'wrong choice, correct negative choice and timeout; ten-second automatic progression and derived report', missing: 'fourth source word excluded with a visible reason', serverWrites: 0 })
    await context.close()
  }
  assert.deepEqual(recipe, original)
  assert.ok(methods.every((method) => method === 'GET')); assert.deepEqual(errors, [])
  await writeFile('docs/interactive/sound-check-results.json', JSON.stringify({ results, errors }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
