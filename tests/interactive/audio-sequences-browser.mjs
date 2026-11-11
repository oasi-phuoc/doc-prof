import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-audio-sequences-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { numberAudioParts, mulAudioParts } = await server.ssrLoadModule('/src/tcm-cfr/audio-nombres.ts')
const { cscCalculationParts } = await server.ssrLoadModule('/src/tcm-csc/items.ts')
const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
const { competitionQuiz } = await server.ssrLoadModule('/src/interactive/competition/core.ts')
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const dictation = (value) => ({ layout: 'audio-dictation', audioSrc: numberAudioParts(value)[0], audioParts: numberAudioParts(value), answer: String(value) })
const items = [dictation(201), dictation(202),
  { layout: 'audio-dictation', audioParts: cscCalculationParts(12, 24, '+'), answer: '36', cscTask: { kind: 'calculation-audio', a: 12, b: 24, operation: '+' } },
  { layout: 'audio-dictation', left: '3', right: '4', audioParts: mulAudioParts(3, 4), answer: '12' },
]
recipe.pages = [{ ...recipe.pages[0], count: 4, libreInstruction: 'Il y a 2 écoutes.', libreItems: items }]
const original = structuredClone(recipe), saved = { id: 'audio-sequence-source', name: 'Nombres et calculs oraux', domains: ['algèbre'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const count = (page, n, max = 2) => page.locator('.ci-audio-caption [role="status"]').filter({ hasText: `Écoute ${n} / ${max}` }).waitFor()
async function ready(page) { await page.waitForFunction(() => { const a = document.querySelector('audio'); return a?.src.startsWith('blob:') && a.duration > 0 }); return page.locator('audio') }
async function play(page) { const audio = await ready(page); await audio.evaluate(async (audio) => { audio.muted = true; audio.playbackRate = 16; await audio.play() }); await page.waitForFunction(() => document.querySelector('audio')?.ended) }
async function reveal(page, expected) { await button(page, 'Signal : levez vos cartes').click(); await button(page, 'Discuter').click(); await button(page, 'Enseignant : révéler').click(); assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), expected) }
async function setup(width = 390) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 768 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => {
    localStorage.setItem('clairfle-fiche-sync', 'audio-sequence-fixture-only')
    const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL)
    window.__sequenceUrls = { created: [], revoked: [] }
    URL.createObjectURL = (blob) => { const url = create(blob); if (blob.type === 'audio/wav') window.__sequenceUrls.created.push(url); return url }
    URL.revokeObjectURL = (url) => { window.__sequenceUrls.revoked.push(url); revoke(url) }
  })
  await context.route('**/__test_api/fiches', (route) => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 4)
  await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
  return { context, page }
}
async function duration(page, parts) {
  const expected = await page.evaluate(async (parts) => {
    const context = new AudioContext()
    try { let total = 0; for (const part of parts) total += (await context.decodeAudioData(await (await fetch(part)).arrayBuffer())).duration; return total }
    finally { await context.close() }
  }, parts)
  const actual = await (await ready(page)).evaluate((audio) => audio.duration)
  assert.ok(Math.abs(expected - actual) < .05, `${actual} instead of ${expected}`)
  return Math.round(actual * 100) / 100
}
async function disposed(page) {
  await button(page, 'Quitter la séance').click()
  await page.locator('.ci-launch:enabled').waitFor()
  const urls = await page.evaluate(() => window.__sequenceUrls)
  assert.ok(urls.created.length > 0)
  assert.ok(urls.created.every((url) => urls.revoked.includes(url)), 'Every temporary recording is revoked after leaving the game.')
}
try {
  await mkdir('docs/interactive/screenshots', { recursive: true })
  for (const width of [390, 1366]) {
    const { page, context } = await setup(width)
    await page.locator('.ci-launch').click()
    await ready(page); await count(page, 0)
    const seconds = []
    seconds.push(await duration(page, items[0].audioParts))
    assert.equal(await page.locator('audio').evaluate((audio) => audio.paused && !audio.autoplay), true)
    await page.locator('audio').evaluate(async (audio) => { audio.muted = true; audio.playbackRate = 1; await audio.play() })
    await count(page, 1)
    await page.waitForFunction(() => document.querySelector('audio')?.currentTime > .1)
    await page.locator('audio').evaluate((audio) => audio.pause())
    await play(page); await count(page, 1)
    await page.locator('audio').evaluate((audio) => { audio.currentTime = 0 })
    await play(page); await count(page, 2)
    await page.locator('audio').evaluate(async (audio) => { try { await audio.play() } catch (error) { if (error.name !== 'AbortError') throw error } })
    assert.equal(await page.locator('audio').evaluate((audio) => audio.paused), true)
    await button(page, 'Accorder une écoute de plus').click()
    await play(page); await count(page, 3, 3)
    await reveal(page, '201')
    for (const [index, expected] of [[1, '202'], [2, '36'], [3, '12']]) {
      await button(page, 'Question suivante').click()
      await ready(page); await count(page, 0)
      assert.match(await page.locator('.ci-progress').innerText(), new RegExp(`Question ${index + 1} / 4`))
      seconds.push(await duration(page, items[index].audioParts))
      assert.equal(await page.locator('.ci-answer-key').count(), 0)
      await play(page); await count(page, 1); await reveal(page, expected)
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    assert.deepEqual(scan.violations.map((v) => v.id), [])
    await page.screenshot({ path: `docs/interactive/screenshots/audio-sequence-${width}.png` })
    await page.reload(); await button(page, 'Reprendre la séance').click()
    await ready(page); await count(page, 1)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '12')
    await disposed(page)
    results.push({ viewport: `${width}x${width === 390 ? 844 : 768}`, realDecodedSeconds: seconds, recording: 'full number, addition and multiplication clips form one seekable WAV; shared prefixes retain four independent screens', listens: 'pause/resume costs one allowance; limit, explicit extra listen and reload persist', accessibility: 'axe: no automatic violations; no horizontal overflow', cleanup: 'temporary audio URLs revoked on exit' })
    await context.close()
  }
  const failure = await setup()
  let missing = true
  await failure.context.route('**/nombres-mesures/cent.mp3', (route) => missing ? route.fulfill({ status: 404, body: '' }) : route.continue())
  await failure.page.locator('.ci-launch').click()
  await button(failure.page, 'Réessayer l’audio').waitFor()
  assert.equal(await failure.page.locator('audio').count(), 0, 'A valid prefix never plays when a suffix is missing.')
  missing = false; await button(failure.page, 'Réessayer l’audio').click()
  await ready(failure.page); await count(failure.page, 0)
  await play(failure.page); await count(failure.page, 1)
  await disposed(failure.page); await failure.context.close()
  results.push({ missingSuffix: 'whole recording unavailable, no partial audio or consumed allowance; explicit retry recovers the complete sequence' })

  const rapid = await setup()
  let release, entered, timeout
  const requested = new Promise((resolve) => { entered = resolve })
  await rapid.context.route('**/nombre/1.mp3', async (route) => { entered(); await new Promise((resolve) => { release = resolve }); await route.continue().catch(() => {}) })
  await rapid.page.locator('.ci-launch').click()
  try { await Promise.race([requested, new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Delayed suffix was not requested')), 10000) })]) } finally { clearTimeout(timeout) }
  await rapid.page.getByRole('button', { name: /^Choisir une question ·/ }).click()
  await rapid.page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').nth(1).click()
  await ready(rapid.page); await count(rapid.page, 0)
  const currentUrl = await rapid.page.locator('audio').getAttribute('src')
  release(); await rapid.page.waitForTimeout(150)
  assert.equal(await rapid.page.locator('audio').getAttribute('src'), currentUrl)
  assert.equal(await rapid.page.evaluate(() => window.__sequenceUrls.created.length), 1)
  await disposed(rapid.page); await rapid.context.close()
  results.push({ staleNavigation: 'leaving while a suffix is pending aborts the old recording; its late response cannot replace the next question or create a leaked WAV URL' })

  const solo = await setup(1366)
  await button(solo.page, 'Mode de jeu').click()
  await button(solo.page, 'Régler le minuteur').click()
  await solo.page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('1')
  await button(solo.page, 'Fermer les réglages').click()
  await solo.page.locator('.ci-launch').click()
  await play(solo.page); await count(solo.page, 1)
  await solo.page.locator('.ci-answer').filter({ has: solo.page.locator('.ci-answer-content').filter({ hasText: /^201$/ }) }).click()
  await solo.page.locator('.ci-correction-status').filter({ hasText: 'Félicitations' }).waitFor()
  await solo.page.locator('.ci-progress').filter({ hasText: 'Question 2 / 4' }).waitFor()
  await ready(solo.page); await count(solo.page, 0)
  assert.equal(await button(solo.page, 'Accorder une écoute de plus').count(), 0)
  const quiz = competitionQuiz(convertRecipe(recipe), base)
  const preloaded = await solo.page.evaluate(async (quiz) => {
    const { prepareLocalCompetition } = await import('/src/interactive/competition/local.ts')
    const { composeAudioParts } = await import('/src/interactive/media/compose-audio.ts')
    window.__offlineCompose = composeAudioParts
    window.__offlinePrepared = await prepareLocalCompetition(quiz, new AbortController().signal)
    return window.__offlinePrepared.quiz.items.map(({ question }) => question.audioParts)
  }, quiz)
  assert.ok(preloaded.flat().every((src) => src.startsWith('blob:')))
  await solo.context.setOffline(true)
  const offline = await solo.page.evaluate(async () => {
    const durations = []
    for (const item of window.__offlinePrepared.quiz.items) {
      const blob = await window.__offlineCompose(item.question.audioParts, { baseUrl: location.href }, new AbortController().signal)
      const context = new AudioContext()
      try { durations.push((await context.decodeAudioData(await blob.arrayBuffer())).duration) } finally { await context.close() }
    }
    window.__offlinePrepared.dispose()
    return durations
  })
  assert.equal(offline.length, 4); assert.ok(offline.every((seconds) => seconds > 0))
  await solo.context.setOffline(false)
  await disposed(solo.page); await solo.context.close()
  results.push({ solo: 'one complete listen and immediate correct verdict, then automatic next question after one second', localCompetition: 'all four ordered recordings compose from fully preloaded blobs with the network disabled; no cold-start offline claim' })
  assert.deepEqual(recipe, original); assert.ok(methods.every((method) => method === 'GET')); assert.deepEqual(errors, [])
  await writeFile('docs/interactive/audio-sequences-results.json', JSON.stringify({ results, errors, serverWrites: 0 }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
