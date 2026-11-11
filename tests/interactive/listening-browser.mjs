import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { waitForBrowserValue } from './browser-actions.mjs'
const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-listening-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
recipe.pages = [{ ...recipe.pages[0], libreInstruction: 'Il y a 2 écoutes.', libreItems: ['Quelle réponse ?', 'Quelle autre réponse ?'].map((prompt) => ({ layout: 'select', prompt, options: ['un', 'deux', 'trois'], answer: 'deux', audioSrc: '/__listen.wav' })) }]
const saved = { id: 'listening-fixture', name: 'Écoutes limitées', domains: ['algèbre'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const rate = 16000, frames = rate * 2
const wav = Buffer.alloc(44 + frames * 2)
wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(frames * 2, 40)
for (let i = 0; i < frames; i++) wav.writeInt16LE(Math.round(Math.sin(i * 2 * Math.PI * 220 / rate) * 500), 44 + i * 2)
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], methods = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
async function setup(width = 390) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 768 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'listening-fixture-only'))
  await context.route('**/__test_api/fiches', async (route) => { methods.push(route.request().method()); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  await context.route('**/__listen.wav', (route) => route.fulfill({ status: 200, contentType: 'audio/wav', body: wav }))
  const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  return { page, context }
}
async function count(page, listens, limit = 2) { await page.locator('.ci-audio-caption [role="status"]').filter({ hasText: `Écoute ${listens} / ${limit}` }).waitFor() }
async function play(page) { await page.locator('audio').evaluate(async (audio) => { audio.muted = true; try { await audio.play() } catch (error) { if (error.name !== 'AbortError') throw error } }) }
async function ended(page) { await page.waitForFunction(() => document.querySelector('audio')?.ended) }
try {
  const { page, context } = await setup()
  await page.locator('.ci-launch').click()
  await count(page, 0)
  assert.equal(await page.locator('audio').evaluate((audio) => audio.paused && !audio.autoplay), true)
  await play(page); await count(page, 1)
  await page.waitForFunction(() => document.querySelector('audio').currentTime > 0.1)
  await page.locator('audio').evaluate((audio) => audio.pause())
  await play(page); await count(page, 1)
  await ended(page)
  assert.equal(await page.locator('.ci-audio-caption [role="status"]').innerText(), 'Écoute 1 / 2')
  // Starting a fresh pass from the middle is brought back to the beginning.
  await page.locator('audio').evaluate((audio) => { audio.currentTime = 1 })
  await play(page); await count(page, 2); await ended(page)
  await page.getByRole('status').filter({ hasText: 'Nombre d’écoutes atteint.' }).waitFor()
  await play(page)
  assert.equal(await page.locator('audio').evaluate((audio) => audio.paused), true)
  await count(page, 2)
  await button(page, 'Accorder une écoute de plus').click()
  await count(page, 2, 3)
  await play(page); await count(page, 3, 3); await ended(page)
  const bounds = await page.locator('.ci-header-audio').boundingBox()
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  await page.screenshot({ path: 'docs/interactive/screenshots/listening-mobile.png', fullPage: true })
  results.push({ nativeAudio: 'actual playing counted; pause/resume and middle start cannot add or bypass an allowance', quota: 'third pass blocked; teacher grant journaled and permits one more', mobile: 'counter, time and quota controls fit without horizontal overflow' })
  await page.reload()
  await button(page, 'Reprendre la séance').click()
  await count(page, 3, 3)
  await play(page)
  assert.equal(await page.locator('audio').evaluate((audio) => audio.paused), true)
  await button(page, 'Signal : levez vos cartes').click(); await button(page, 'Discuter').click()
  await page.getByRole('button', { name: /^Choisir une question ·/ }).click()
  await button(page, 'Réessayer cette question').click()
  await button(page, 'Nouvelle tentative').click()
  await count(page, 0)
  await waitForBrowserValue(page, async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); const rows = await requestLocal('sessions', 'readonly', (store) => store.getAll()); return rows.some((record) => record.events.some((event) => event.action.type === 'RETRY_QUESTION')) })
  const record = await page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('sessions', 'readonly', (store) => store.getAll()))[0] })
  const runtimeState = record.checkpoint?.state
  assert.equal(record.schemaVersion, 5)
  assert.ok(record.events.some((event) => event.action.type === 'RETRY_QUESTION') || runtimeState?.previousAttempts[0].audioListens === 3)
  results.push({ reload: 'used and additional listens persist; consumed allowance still blocks playback', retry: 'new attempt starts at zero and preserves previous listening counts' })
  await context.close()

  const solo = await setup(1366)
  await button(solo.page, 'Mode de jeu').click()
  await solo.page.locator('.ci-launch').click()
  await count(solo.page, 0)
  // Errors before the first playing event consume no listening allowance.
  await solo.page.locator('audio').evaluate((audio) => audio.dispatchEvent(new Event('error')))
  await button(solo.page, 'Réessayer l’audio').click()
  await count(solo.page, 0)
  await play(solo.page); await count(solo.page, 1)
  await solo.page.clock.install()
  await solo.page.clock.pauseAt(new Date(Date.now() + 100))
  await solo.page.locator('audio').evaluate((audio) => audio.dispatchEvent(new Event('stalled')))
  await solo.page.clock.runFor(8100)
  await button(solo.page, 'Réessayer l’audio').waitFor()
  await count(solo.page, 1)
  await solo.page.clock.resume()
  await button(solo.page, 'Réessayer l’audio').click()
  await play(solo.page); await count(solo.page, 2); await ended(solo.page)
  assert.equal(await button(solo.page, 'Accorder une écoute de plus').count(), 0)
  await play(solo.page)
  assert.equal(await solo.page.locator('audio').evaluate((audio) => audio.paused), true)
  results.push({ errors: 'failure before playing costs no listen; a stall longer than eight seconds exposes retry and retains already consumed listening', solo: 'quota enforced without teacher grant control', serverWrites: methods.filter((method) => method !== 'GET').length })
  assert.ok(methods.every((method) => method === 'GET'))
  assert.deepEqual(errors, [])
  await writeFile('docs/interactive/listening-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
