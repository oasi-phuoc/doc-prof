import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { gameControl, waitForBrowserValue } from './browser-actions.mjs'

const base = 'http://127.0.0.1:5182', out = 'docs/interactive/fraction-proofs'
process.env.VITE_FICHES_API_URL = `${base}/__forbidden_fiches`
const vite = await createServer({ cacheDir: '/tmp/clairfle-fractions-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true, hmr: false } })
await vite.listen()
const { poolRecipe, convertPoolRecipe } = await vite.ssrLoadModule('/src/interactive/pools/recipe.ts')
const { applyPlanOptions } = await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
const { prepareGame } = await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
const {playPrompt}=await vite.ssrLoadModule('/src/interactive/domain/presentation.ts')
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const errors = [], api = [], availability = [], results = []
const families = ['fractions-identifier', 'fractions-equivalentes', 'fractions-simplifier', 'fractions-comparer', 'fractions-add', 'fractions-mul', 'fractions-div', 'addition-ligne']
async function setup(width, height, mode = 'class') {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 700 })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(mode => {
    sessionStorage.setItem('clairfle.interactive.mode.v1', mode)
    localStorage.setItem('clairfle.interactive.timer.v1', JSON.stringify({ enabled: mode === 'solo', seconds: 5, feedbackSeconds: mode === 'solo' ? 1 : 10 }))
  }, mode)
  await context.route('**/__forbidden_fiches/**', route => {
    const request = route.request(), path = new URL(request.url()).pathname
    if (path === '/__forbidden_fiches/competition/status') availability.push(request.method())
    else api.push({ path, method: request.method() })
    return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ available: false }) })
  })
  const page = await context.newPage(); page.setDefaultTimeout(30000)
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/interactif`)
  await page.getByRole('heading', { name: 'Composez votre pool d’exercices' }).waitFor({ timeout: 120000 })
  return { page, context }
}
async function choose(page, types = families, count = 1) {
  await page.getByRole('combobox', { name: 'Domaine des exercices' }).selectOption('algèbre')
  for (const type of types) {
    await page.locator(`input[data-pool-type="${type}"]`).check()
    const entry = page.locator(`[data-selected-pool-type="${type}"]`)
    await entry.locator('summary').click()
    await entry.getByRole('spinbutton', { name: /Nombre d’éléments/ }).fill(String(count))
    if (type === 'addition-ligne') await entry.getByRole('checkbox', { name: 'Choisir la plage de nombres' }).check()
    if (type.startsWith('fractions-') && type !== 'fractions-comparer') assert.equal(await entry.getByRole('checkbox', { name: 'Choisir la plage de nombres' }).count(), 0)
  }
  await page.getByRole('checkbox', { name: 'Mélanger les questions des différents types' }).uncheck()
}
async function prepare(page) {
  await page.getByRole('button', { name: 'Préparer la partie', exact: true }).click()
  await page.waitForURL(url => url.searchParams.has('pool'))
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  const id = new URL(page.url()).searchParams.get('pool')
  return page.evaluate(async id => { const { requestLocal } = await import('/src/interactive/storage.ts'); return requestLocal('pools', 'readonly', s => s.get(id)) }, id)
}
async function currentRun(page, pool, mode) {
  const record = await waitForBrowserValue(page, async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('sessions', 'readonly', s => s.getAll())).find(r => r.source?.reference.kind === 'pool') ?? null })
  const game = prepareGame(applyPlanOptions(convertPoolRecipe(poolRecipe(pool.config, record.source.seed), pool.name), record.source.options), undefined, mode)
  assert.equal(game.id, record.gameId)
  return { record, game }
}
async function competitionGame(page, pool) {
  // Entering a new competition intentionally renews the pool's play seed.
  // Read its actual metadata instead of assuming the first preparation's draw.
  const metadata = await waitForBrowserValue(page, () => {
    const key = Object.keys(sessionStorage).find(key => key.startsWith('clairfle.interactive.run.v1.pool-'))
    return key ? JSON.parse(sessionStorage.getItem(key)) : null
  })
  assert.notEqual(metadata.seed, pool.seed)
  return prepareGame(applyPlanOptions(convertPoolRecipe(poolRecipe(pool.config, metadata.seed), pool.name), metadata.options))
}
async function launch(page) { await page.locator('.ci-launch:enabled').click(); await page.locator('.ci-answer').first().waitFor() }
async function reveal(page) { for (const name of ['Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler']) await gameControl(page, name).click() }
async function navigate(page, index) {
  await gameControl(page, /^Choisir une question ·/).click()
  await page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').nth(index).click()
}
async function fits(page) {
  if (await page.locator('.ci-round-question').count()) await page.waitForFunction(() => document.querySelector('.ci-round-question')?.dataset.ciReadability !== undefined)
  else await page.locator('.ci-competition-question .ci-question').waitFor()
  const size = page.viewportSize()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  for (const box of await page.locator('.ci-answer:visible, .ci-controls:visible').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()))) {
    assert.ok(box.x >= -1 && box.y >= -1 && box.right <= size.width + 1 && box.bottom <= size.height + 1 && box.height >= 44, JSON.stringify({ size, box }))
  }
}
async function axe(page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  assert.deepEqual(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [])
}
async function stacked(page, root) {
  const digits = page.locator(`${root} .ci-fraction-digits`)
  assert.ok(await digits.count())
  for (const data of await digits.evaluateAll(nodes => nodes.map(node => ({ top: node.dataset.numerator, bottom: node.dataset.denominator, display: getComputedStyle(node).display, rows: getComputedStyle(node).gridTemplateRows.split(' ').length, rule: parseFloat(getComputedStyle(node, '::before').borderBottomWidth), height: node.getBoundingClientRect().height, font: parseFloat(getComputedStyle(node).fontSize) })))) {
    assert.equal(data.display, 'inline-grid'); assert.equal(data.rows, 2); assert.ok(data.rule > 0); assert.ok(data.height > data.font * 2)
  }
}
function answerText(game, index) { const q = game.questions[index]; return q.choices.find(choice => choice.id === game.corrections[q.id].choiceId).text }
const card = (page, text) => page.locator('.ci-answer').filter({ has: page.getByText(text, { exact: true }) })
try {
  await mkdir(out, { recursive: true })
  for (const [width, height] of [[390, 844], [1366, 768], [360, 640]]) {
    console.log(`Fractions, Classe ${width}×${height}`)
    const { page, context } = await setup(width, height)
    await choose(page); await axe(page)
    const pool = await prepare(page)
    assert.equal(pool.config.entries.length, 8)
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 8)
    await page.getByRole('checkbox', { name: 'Ranger les nombres par ordre croissant', exact: true }).check()
    await gameControl(page, 'Précharger toute la séance').click()
    await page.getByRole('status').filter({ hasText: 'Prêt à jouer sans connexion' }).waitFor()
    await context.setOffline(true); await launch(page)
    const { record, game } = await currentRun(page, pool, 'class')
    assert.equal(record.source.options.numericOrder, true)
    for (let index = 0; index < game.questions.length; index++) {
      if (index) await navigate(page, index)
      assert.equal(await page.locator('.ci-question-prompt').textContent(), playPrompt(game.questions[index].prompt))
      assert.ok(!/=\s*(?:[?□▢]|_+)/u.test(await page.locator('.ci-question-prompt').textContent()))
      assert.equal(await page.locator('.ci-answer:enabled').count(), 0)
      assert.equal(await page.locator('.ci-answer-key').count(), 0)
      if (index < 7) await stacked(page, '.ci-question-prompt')
      await reveal(page)
      // ICU uses an apostrophe in Node fr-CH and a narrow space in Chromium.
      const compact = text => text.replace(/['’\s]/g, '')
      assert.equal(compact(await page.locator('.ci-answer-key .ci-answer-content').textContent()), compact(answerText(game, index)))
      assert.equal(await page.locator('.ci-answer-muted').count(), game.questions[index].choices.length - 1)
      assert.equal(await page.locator('.ci-margin-answer, .ci-model-answer').count(), 0)
      await fits(page)
      if (index === 6) { await axe(page); await page.screenshot({ path: `${out}/division-${width}.png` }) }
    }
    // Reopen a revealed fraction and restore it from the durable source, after
    // removing the optional per-tab run cache.
    await navigate(page, 6); await context.setOffline(false)
    const prompt = await page.locator('.ci-question-prompt').textContent(), key = await page.locator('.ci-answer-key .ci-answer-content').textContent()
    await page.evaluate(() => sessionStorage.clear()); await page.reload()
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 }); await launch(page)
    await page.locator('.ci-answer-key').waitFor()
    assert.equal(await page.locator('.ci-question-prompt').textContent(), prompt)
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(), key)
    results.push({ viewport: `${width}x${height}`, mode: 'class', pool: 'Seven fraction types plus addition, source order, no worksheet service.', offline: 'All eight questions played after complete preparation and network cut.', correction: 'Teacher only; answer in its colored card and all other cards gray, no duplicate answer.', resume: 'Same revealed fraction, cards and key after clearing sessionStorage and reload.', layout: 'All answer cards and controls fit; automated axe checks pass.' })
    await context.close()
  }

  console.log('Fractions, Solo et nouvelle partie')
  {
    const { page, context } = await setup(390, 844, 'solo')
    await choose(page, ['fractions-div'], 3)
    const pool = await prepare(page)
    await page.getByRole('checkbox', { name: 'Ranger les nombres par ordre croissant', exact: true }).check()
    await page.clock.install(); await page.clock.pauseAt(new Date(Date.now() + 200))
    await launch(page)
    const { game, record } = await currentRun(page, pool, 'solo')
    await card(page, answerText(game, 0)).click(); await page.locator('.ci-answer-correct').waitFor()
    await page.clock.runFor(1200); await page.locator('.ci-question-prompt').filter({ hasText: playPrompt(game.questions[1].prompt) }).waitFor()
    const wrong = game.questions[1].choices.find(choice => choice.id !== game.corrections[game.questions[1].id].choiceId).text
    await card(page, wrong).click(); await page.locator('.ci-answer-incorrect').waitFor()
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(), answerText(game, 1))
    await page.clock.runFor(1200); await page.locator('.ci-question-prompt').filter({ hasText: playPrompt(game.questions[2].prompt) }).waitFor()
    await page.clock.runFor(5200); await page.locator('.ci-reveal').waitFor()
    assert.equal((await page.locator('.ci-correction-status').innerText()).trim(), 'Temps écoulé')
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(), answerText(game, 2))
    await page.clock.runFor(1200); await page.locator('.ci-summary').waitFor(); await page.clock.resume()
    assert.equal(await page.locator('.ci-summary-questions > p').count(), 3)
    await gameControl(page, 'Nouvelle partie').click(); await page.locator('.ci-answer:enabled').first().waitFor()
    const renewed = await waitForBrowserValue(page, async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return (await requestLocal('sessions', 'readonly', s => s.getAll())).length > 1 })
    assert.equal(renewed, true)
    const rows = await page.evaluate(async () => { const { requestLocal } = await import('/src/interactive/storage.ts'); return requestLocal('sessions', 'readonly', s => s.getAll()) })
    const next = rows.find(r => r.source?.reference.id === pool.poolId && r.source.seed !== record.source.seed)
    assert.ok(next); assert.deepEqual(next.source.selectedKeys, record.source.selectedKeys)
    const original = await page.evaluate(async id => { const { requestLocal } = await import('/src/interactive/storage.ts'); return requestLocal('pools', 'readonly', s => s.get(id)) }, pool.poolId)
    assert.deepEqual(original, pool)
    results.push({ mode: 'solo', answers: 'Correct, incorrect and timeout, then automatic one-second feedback through the report.', newPart: 'New source seed; same pool configuration, selection and ascending order; stored pool unchanged.' })
    await context.close()
  }

  console.log('Fractions, compétition locale')
  {
    const { page, context } = await setup(390, 844)
    await choose(page, ['fractions-div'])
    const pool = await prepare(page)
    await gameControl(page, 'Compétition').click(); await gameControl(page, 'Préparer le défi local').click()
    await gameControl(page, 'Ajouter cette mascotte').click(); await gameControl(page, 'Renard').click(); await gameControl(page, 'Ajouter cette mascotte').click()
    const raw = await competitionGame(page, pool), correct = answerText(raw, 0)
    await gameControl(page, 'Commencer la compétition').click(); await gameControl(page, 'Je suis prêt').click()
    await page.locator('.ci-answer:enabled').first().waitFor(); await context.setOffline(true)
    await card(page, correct).click(); await gameControl(page, 'Je suis prêt').click()
    await page.locator('.ci-answer:enabled').first().waitFor()
    const wrong = raw.questions[0].choices.find(choice => choice.text !== correct).text
    await card(page, wrong).click(); await page.locator('.ci-answer-key').waitFor()
    assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(), correct)
    assert.equal(await page.locator('.ci-answer-muted').count(), 5)
    await fits(page); await axe(page)
    await page.screenshot({ path: `${out}/competition-390.png` })
    results.push({ mode: 'local-competition', network: 'Disabled after media preparation.', turns: 'Two mascots, correct and incorrect answers with the same six rational cards and correction.' })
    await context.close()
  }
  console.log('Fractions, duel à deux')
  {
    const { page, context } = await setup(844, 390)
    await choose(page, ['fractions-div'])
    const pool = await prepare(page)
    await gameControl(page, 'Compétition').click(); await page.getByRole('button', { name: 'Préparer un duel', exact: true }).click()
    await page.getByRole('combobox', { name: 'Vie', exact: true }).selectOption('100')
    for (const level of [2, 3]) await page.getByRole('spinbutton', { name: `Chance de critique ×${level} (%)`, exact: true }).fill('0')
    await page.getByRole('spinbutton', { name: 'Chance de critique ×4 (%)', exact: true }).fill('100')
    await page.getByRole('checkbox', { name: 'Activer le minuteur du duel', exact: true }).uncheck()
    await page.getByRole('spinbutton', { name: 'Temps de correction (secondes)', exact: true }).fill('1')
    await page.getByRole('button', { name: 'Préparer la partie', exact: true }).click()
    await page.getByRole('button', { name: 'Commencer le duel', exact: true }).waitFor({ timeout: 120000 })
    const raw = await competitionGame(page, pool), correct = answerText(raw, 0)
    await context.setOffline(true); await page.getByRole('button', { name: 'Commencer le duel', exact: true }).click()
    await page.locator('.ci-duel-answer:enabled').first().waitFor()
    assert.equal(await page.locator('.ci-duel-answer').count(), 12)
    await stacked(page, '.ci-duel-question'); await stacked(page, '.ci-duel-choices')
    const questionBottom = (await page.locator('.ci-duel-question').boundingBox()).y + (await page.locator('.ci-duel-question').boundingBox()).height
    for (const box of await page.locator('.ci-duel-fighter .ci-power-aura').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()))) assert.ok(box.top >= questionBottom + 2, JSON.stringify({ box, questionBottom }))
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    for (const box of await page.locator('.ci-duel-answer:visible,.ci-duel-health-row:visible').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()))) {
      assert.ok(box.x >= -1 && box.y >= -1 && box.right <= 845 && box.bottom <= 391, JSON.stringify(box))
    }
    await page.screenshot({ path: `${out}/duel-844.png` })
    await page.locator('.ci-duel-player[data-side="left"] .ci-duel-answer').filter({ has: page.getByText(correct, { exact: true }) }).click()
    await page.locator('.ci-duel-feedback').waitFor()
    assert.match(await page.locator('.ci-duel-finished h1').innerText(), /remporte le duel/)
    results.push({ mode: 'duel', viewport: '844x390', network: 'Disabled after battle preparation.', result: 'Six stacked rational cards per player, first correct ×4 answer is graded with 100 HP; full charge aura stays below the question and the round reaches its correction.' })
    await context.close()
  }
  assert.deepEqual(errors, []); assert.deepEqual(api, []); assert.ok(availability.every(method => method === 'GET'))
  await writeFile('docs/interactive/fractions-results.json', JSON.stringify({ results, worksheetApiRequests: api, competitionAvailabilityChecks: availability, pageErrors: errors }, null, 2) + '\n')
  await writeFile(`${out}/index.html`, `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Fractions dans le jeu</title><style>body{font:17px system-ui;background:#f7f8fc;color:#182238;margin:24px}img{max-width:100%;height:auto}figure{background:white;padding:16px;border-radius:12px}</style><h1>Fractions dans les pools du jeu</h1><p>Classe, Solo et compétition avec calculs exacts et cartes distinctes.</p>${[390,1366,360].map(width => `<figure><figcaption>Division à ${width} px</figcaption><img src="division-${width}.png" alt="Question et six cartes de fractions"></figure>`).join('')}<figure><figcaption>Défi local hors ligne</figcaption><img src="competition-390.png" alt="Correction du défi à deux mascottes"></figure><figure><figcaption>Duel en paysage</figcaption><img src="duel-844.png" alt="Deux joueurs et leurs cartes de fractions"></figure></html>`)
  console.log(JSON.stringify(results, null, 2))
} catch (error) {
  for (const page of browser.contexts().flatMap(context => context.pages())) {
    await page.screenshot({ path: '/tmp/clairfle-fractions-error.png', fullPage: true }).catch(() => {})
    await writeFile('/tmp/clairfle-fractions-error.txt', await page.locator('body').innerText()).catch(() => {})
  }
  throw error
} finally { await browser.close(); await vite.close() }
