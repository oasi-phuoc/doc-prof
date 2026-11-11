import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = `${base}/__test_api`
const server = await createServer({ cacheDir: '/tmp/clairfle-source-adapters-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { buildCscProblem } = await server.ssrLoadModule('/src/tcm-csc/problems.ts')
const cscProblem = buildCscProblem('soustraction-01', 98, 54)
const recipe = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
const images = ['/lib/images/tcf/co/objets/5-tomates.webp', '/lib/images/tcf/co/objets/8-tomates.webp', '/lib/images/tcf/co/objets/10-tomates.webp']
const clips = ['cinq', 'huit', 'dix'].map((word, index) => ({ word, audioSrc: `/__adapter-${index}.mp3` }))
recipe.pages = [{ ...recipe.pages[0], libreItems: [
  { layout: 'audio-order', audioOrder: { mode: 'words', clips, slots: [{ word: 'dix', correctNum: 3 }, { word: 'cinq', correctNum: 1 }, { word: 'huit', correctNum: 2 }] }, answer: '1 → cinq · 2 → huit · 3 → dix' },
  { layout: 'audio-order', audioOrder: { mode: 'images', clips, slots: [2, 0, 1].map((index) => ({ imageSrc: images[index], correctNum: index + 1 })) }, answer: '1 → cinq · 2 → huit · 3 → dix' },
  { layout: 'vocab-match', labels: ['ama', 'va'], options: ['llee', 'zone'], vocabMatchMode: 'syllables', vocabPairs: [{ left: 'ama', right: 'zone' }, { left: 'va', right: 'llee' }], answer: 'ama + zone → amazone · va + llee → vallee' },
  { layout: 'phrase-order', tokens: [{ text: 'est' }, { text: 'petite' }, { text: 'Elle' }], labels: ['Elle', 'est', 'petite'], answer: 'Elle est petite.', responseAnswer: 'Elle est petite.' },
] }]
recipe.pages.push({ ...recipe.pages[0], domain: 'tcm-csc', topic: 'tcm-csc-test', exerciseType: 'tcm-csc-ex22', count: 2, libreItems: [
  { layout: 'csc-task', answer: '+', cscTask: { kind: 'operator', a: 12, b: 24, operation: '+', blank: 'operator' } },
  { layout: 'algebra', prompt: cscProblem.statement, answer: cscProblem.answer, cscTask: { kind: 'problem', templateId: cscProblem.templateId, a: 98, b: 54 } },
] })
const original = structuredClone(recipe)
const saved = { id: 'adapter-source', name: 'Écouter, associer, ordonner', domains: ['algèbre', 'tcm-csc'], recipe, createdAt: '2026-11-11T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
const fixture = JSON.parse(await readFile('docs/interactive/demo-fixture.json', 'utf8'))
const audio = await readFile(`public${fixture.questions.find((q) => q.audio).audio}`)
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], methods = [], errors = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const words = (page) => page.locator('.ci-word-sequence > button > b').allTextContents()
async function navigate(page, prompt) { await page.getByRole('button', { name: /^Choisir une question ·/ }).click(); await page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').filter({ hasText: prompt }).click() }
async function reveal(page, open = false) { await button(page, open ? 'Commencer l’échange' : 'Signal : levez vos cartes').click(); await button(page, 'Discuter').click(); await button(page, 'Enseignant : révéler').click() }
try {
  for (const [width, height] of [[390, 844], [1366, 768]]) {
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'adapter-fixture-only'))
    await context.route('**/__test_api/fiches', async (route) => { methods.push(route.request().method()); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
    await context.route('**/__adapter-*.mp3', (route) => route.fulfill({ status: 200, contentType: 'audio/mpeg', body: audio }))
    const page = await context.newPage(); page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}/interactif/${saved.id}`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 11)
    await page.locator('.ci-launch').click()
    await page.locator('.ci-answer').first().waitFor()
    assert.equal(await page.locator('.ci-answer').count(), 6)
    assert.equal(await page.locator('.ci-answer img').count(), 3)
    assert.equal(new URL(await page.locator('audio').getAttribute('src'), base).pathname, '/__adapter-0.mp3')
    assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key').count(), 2)
    assert.equal(await page.locator('.ci-answer-muted').count(), 4)
    assert.equal(new URL(await page.locator('.ci-answer-key img').getAttribute('src'), base).pathname, images[0])
    assert.equal((await page.locator('.ci-answer-key .ci-answer-content > span').allTextContents())[0], 'cinq')
    await navigate(page, 'Complète « amazone »')
    assert.equal(await page.locator('.ci-answer').count(), 2)
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), 'zone')
    await navigate(page, 'Complète : 12 □ 24 = 36')
    assert.deepEqual((await page.locator('.ci-answer-content').allTextContents()).sort(), ['+', '=', '−'].sort())
    assert.equal(await page.locator('.ci-answer-key').count(), 0)
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '+')
    assert.equal(await page.locator('.ci-answer-muted').count(), 2)
    await navigate(page, cscProblem.statement.split('\n\n').pop())
    assert.match(await page.locator('.ci-context').innerText(), /98 livres/)
    assert.match(await page.locator('.ci-context').innerText(), /54/)
    assert.equal(await page.locator('.ci-answer').count(), 6)
    assert.equal(await page.locator('.ci-answer-key, .ci-model-answer').count(), 0)
    await reveal(page)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), '44')
    assert.equal(await page.locator('.ci-answer-muted').count(), 5)
    await page.screenshot({ path: `docs/interactive/screenshots/csc-problem-${width}.png` })
    await navigate(page, 'Remets les mots dans l’ordre.')
    assert.deepEqual(await words(page), ['est', 'petite', 'Elle'])
    assert.equal(await page.locator('.ci-model-answer').count(), 0)
    await page.locator('.ci-word-sequence > button').first().click()
    assert.equal(await page.locator('.ci-word-sequence > button[aria-pressed="true"]').count(), 1)
    await page.locator('.ci-word-sequence > button').last().click()
    assert.deepEqual(await words(page), ['Elle', 'petite', 'est'])
    await button(page, 'Annuler le déplacement').click()
    assert.deepEqual(await words(page), ['est', 'petite', 'Elle'])
    await page.locator('.ci-word-sequence > button').first().focus()
    await page.keyboard.press('ArrowRight')
    assert.deepEqual(await words(page), ['petite', 'est', 'Elle'])
    await button(page, 'Verrouiller les commandes').click()
    assert.equal(await page.locator('.ci-word-sequence > button:enabled').count(), 0)
    await button(page, 'Déverrouiller les commandes').click()
    await navigate(page, 'Complète « vallee »')
    await navigate(page, 'Remets les mots dans l’ordre.')
    assert.deepEqual(await words(page), ['petite', 'est', 'Elle'])
    await button(page, 'Quitter la séance').click()
    await page.locator('.ci-launch:enabled').waitFor()
    await page.reload()
    await button(page, 'Reprendre la séance').click()
    await page.locator('.ci-word-sequence').waitFor()
    assert.deepEqual(await words(page), ['petite', 'est', 'Elle'])
    await reveal(page, true)
    assert.match(await page.locator('.ci-model-answer').innerText(), /Elle est petite\./)
    assert.equal(await page.locator('.ci-answer-key').count(), 0)
    await button(page, 'Acquis').click()
    await page.waitForFunction(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('sessions', 'readonly', (store) => store.getAll())).some((record) => record.events.some((event) => event.action.type === 'ASSESS')) })
    const rows = await page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return requestLocal('sessions', 'readonly', (store) => store.getAll()) })
    assert.ok(rows[0].events.some((event) => event.action.type === 'ASSESS'))
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    for (const selector of ['.ci-word-sequence', '.ci-controls']) {
      const bounds = await page.locator(selector).boundingBox()
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width, selector)
      assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= height, `${selector}: ${JSON.stringify(bounds)}`)
    }
    await page.screenshot({ path: `docs/interactive/screenshots/word-order-${width}.png` })
    results.push({ viewport: `${width}x${height}`, audio: 'source word and image associations become paired questions with separate correct cards', vocabulary: 'verified source completion uses original suffix choices', csc: 'three sign cards and six numeric problem cards; original story and numbers retained; correction remains hidden before teacher reveal and only colors the correct card afterwards', ordering: 'touch swap, undo, keyboard move, lock, navigation and reload preserve the proposal', evaluation: 'source sentence model only after teacher reveal; alternative orders receive human assessment', layout: 'word grid and commands remain within the viewport' })
    await context.close()
  }
  assert.deepEqual(recipe, original)
  assert.ok(methods.every((method) => method === 'GET'))
  assert.deepEqual(errors, [])
  results.push({ serverWrites: 0, sourceTemplate: 'unchanged', errors })
  await writeFile('docs/interactive/source-adapters-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
