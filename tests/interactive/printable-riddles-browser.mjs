import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = base + '/__test_api'
const server = await createServer({ cacheDir: '/tmp/clairfle-riddles-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
const { defaultThemeGameContent } = await server.ssrLoadModule('/src/jeux/bank.ts')
const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
const { buildPage } = await server.ssrLoadModule('/src/math/generate.ts')
const recipe = { ...demoRecipe(), seed: 1, libreMode: true, pages: ['jeux-devinettes', 'jeux-intrus'].map(type => ({ ...defaultPage('jeux'), ...defaultThemeGameContent(type, 'fruits'), domain: 'jeux', topic: 'jeux-fruits', exerciseType: type, count: 1, columns: 1, libreItems: undefined, extraBlocks: undefined })) }
recipe.pages = recipe.pages.map((page, index) => ({ ...page, libreItems: buildPage(page, recipe.seed + index * 7919).blocks[0].items }))
const original = structuredClone(recipe), game = convertRecipe(recipe)
const firstIntrus = game.questions.findIndex(q => q.source.exerciseType === 'jeux-intrus')
assert.ok(firstIntrus >= 3); assert.equal(game.questions.length, firstIntrus + 9)
const key = index => { const q = game.questions[index]; return q.choices.find(choice => choice.id === game.corrections[q.id].choiceId).text }
const saved = { id: 'riddles-source', name: 'Devinettes et intrus', recipe, domains: ['jeux'], createdAt: '2026-11-13T00:00:00Z', updatedAt: '2026-11-13T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const card = (page, text) => page.locator('.ci-answer').filter({ has: page.getByText(text, { exact: true }) })
async function setup(width, height) {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'riddles-fixture'))
  await context.route('**/__test_api/fiches', route => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage(); page.setDefaultTimeout(30000); page.on('pageerror', error => errors.push(error.message))
  await page.goto(base + '/interactif/' + saved.id); await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  return { context, page }
}
async function navigate(page, index) {
  await page.getByRole('button', { name: /^Choisir une question ·/ }).click()
  await page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').nth(index).click()
}
async function fits(page, width, height) {
  if (await page.locator('.ci-round-question').count()) await page.waitForFunction(() => document.querySelector('.ci-round-question')?.dataset.ciReadability !== undefined)
  await page.locator('.ci-answer img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const boxes = await page.locator('.ci-question:visible,.ci-answer:visible,.ci-margin-left:not(:empty):visible,.ci-controls:visible,.ci-competition-host-controls:visible').evaluateAll(nodes => nodes.map(node => ({ className: node.className, ...node.getBoundingClientRect().toJSON() })))
  if (boxes.some((a, i) => a.x < -1 || a.y < -1 || a.right > width + 1 || a.bottom > height + 1 || boxes.slice(i + 1).some(b => !(a.right <= b.x + 1 || b.right <= a.x + 1 || a.bottom <= b.y + 1 || b.bottom <= a.y + 1)))) {
    await page.screenshot({ path: '/tmp/clairfle-riddles-overflow.png' })
    await writeFile('/tmp/clairfle-riddles-overflow.json', JSON.stringify(await page.locator('.ci-round-question,.ci-question,.ci-answer-grid,.ci-answer-content,.ci-answer-content img,.ci-stage-visual,.ci-controls').evaluateAll(nodes => nodes.map(node => ({ className: node.className, dataset: { ...node.dataset }, inline: node.style.cssText, rect: node.getBoundingClientRect().toJSON(), clientHeight: node.clientHeight, scrollHeight: node.scrollHeight, display: getComputedStyle(node).display, gridRows: getComputedStyle(node).gridTemplateRows }))), null, 2))
  }
  for (const box of boxes) assert.ok(box.x >= -1 && box.y >= -1 && box.right <= width + 1 && box.bottom <= height + 1, JSON.stringify(box))
  for (const [i, a] of boxes.entries()) for (const b of boxes.slice(i + 1)) assert.ok(a.right <= b.x + 1 || b.right <= a.x + 1 || a.bottom <= b.y + 1 || b.bottom <= a.y + 1, JSON.stringify({ a, b }))
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  const violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations
  assert.deepEqual(violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [])
}
async function checkQuestion(page, index) {
  assert.equal(await page.locator('.ci-question-prompt').textContent(), game.questions[index].prompt)
  assert.equal(await page.locator('.ci-answer').count(), game.questions[index].choices.length)
  const words = await page.locator('.ci-answer-content').allTextContents()
  assert.ok(words.includes(key(index))); assert.equal(new Set(words).size, words.length)
  if (game.questions[index].source.exerciseType === 'jeux-intrus') assert.deepEqual(words.sort(), game.questions[index].choices.map(c => c.text).sort())
  else {
    const source = recipe.pages[0].libreItems[0].gameBoard.cards.map(card => card.text)
    assert.ok(words.every(word => source.includes(word)), 'Seeded alternatives must all come from the authored sheet')
  }
}
async function reveal(page, index) {
  assert.equal(await page.locator('.ci-answer:enabled').count(), 0)
  assert.equal(await page.locator('.ci-answer-key,.ci-model-answer').count(), 0)
  for (const name of ['Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler']) await button(page, name).click()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), key(index))
  assert.equal(await page.locator('.ci-answer-muted').count(), game.questions[index].choices.length - 1)
  assert.equal(await page.locator('.ci-margin-answer,.ci-model-answer,.ci-chosen').count(), 0)
}
try {
  for (const [width, height] of [[390, 844], [1366, 768], [360, 640]]) {
    if (process.env.RIDDLES_VIEWPORT && width !== Number(process.env.RIDDLES_VIEWPORT)) continue
    const { context, page } = await setup(width, height)
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), game.questions.length)
    await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
    await page.locator('.ci-launch').click(); await page.locator('.ci-answer').first().waitFor()
    await checkQuestion(page, 0); await fits(page, width, height)
    await reveal(page, 0); await fits(page, width, height)
    await page.screenshot({ path: `docs/interactive/screenshots/riddles-${width}.png` })
    await navigate(page, firstIntrus); await checkQuestion(page, firstIntrus); await fits(page, width, height)
    await reveal(page, firstIntrus); await fits(page, width, height)
    await page.screenshot({ path: `docs/interactive/screenshots/intrus-${width}.png` })
    await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor()
    await page.reload(); await button(page, 'Reprendre la séance').click(); await page.locator('.ci-answer-key').waitFor()
    await checkQuestion(page, firstIntrus); assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), key(firstIntrus))
    await navigate(page, 0); assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), key(0))
    await fits(page, width, height); await context.close()
    results.push({ viewport: `${width}x${height}`, class: 'Indices et mots source, vote collectif sans sélection au tableau, correction dans les cartes uniquement ; les autres cartes deviennent grises.', resume: 'Question, choix et corrigé conservés après fermeture et rechargement, puis navigation vers la première devinette.', layout: 'Question, cartes, images, mascotte et commandes visibles sans chevauchement ; axe passe.' })
  }
  const solo = await setup(390, 844), chosen = [0, firstIntrus, firstIntrus + 1]
  await button(solo.page, 'Tout désélectionner').click()
  for (const index of chosen) await solo.page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check()
  await button(solo.page, 'Mode de jeu').click()
  await solo.page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
  await button(solo.page, 'Régler le minuteur').click()
  await solo.page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('1')
  await button(solo.page, 'Fermer les réglages').click()
  await solo.page.clock.install(); await solo.page.clock.pauseAt(new Date(Date.now() + 1000))
  await solo.page.locator('.ci-launch').click(); await solo.page.locator('.ci-answer:enabled').first().waitFor()
  await card(solo.page, key(chosen[0])).click(); await solo.page.locator('.ci-answer-correct').waitFor()
  await solo.page.clock.runFor(1100); await solo.page.locator('.ci-answer:enabled').first().waitFor()
  await checkQuestion(solo.page, chosen[1])
  await solo.page.locator('.ci-answer:enabled').filter({ hasNot: solo.page.getByText(key(chosen[1]), { exact: true }) }).first().click()
  await solo.page.locator('.ci-answer-incorrect').waitFor(); assert.equal(await solo.page.locator('.ci-answer-key .ci-answer-content').innerText(), key(chosen[1]))
  await solo.page.clock.runFor(1100); await solo.page.locator('.ci-answer:enabled').first().waitFor()
  await solo.page.clock.runFor(5100); await solo.page.locator('.ci-reveal').waitFor()
  assert.equal(await solo.page.locator('.ci-answer-key .ci-answer-content').innerText(), key(chosen[2]))
  assert.equal((await solo.page.locator('.ci-correction-status').innerText()).trim(), 'Temps écoulé')
  await solo.page.clock.runFor(1100); await solo.page.locator('.ci-summary').waitFor()
  assert.equal(await solo.page.locator('.ci-summary-questions > p').count(), 3)
  await solo.context.close(); results.push({ solo: 'Bonne réponse, erreur et expiration sur une devinette et deux intrus ; correction et passage automatiques après une seconde ; bilan de trois questions.' })

  const local = await setup(390, 844)
  await button(local.page, 'Tout désélectionner').click()
  for (const index of [0, firstIntrus]) await local.page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check()
  await local.page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
  await button(local.page, 'Compétition').click(); await button(local.page, 'Préparer le défi local').click()
  await button(local.page, 'Ajouter cette mascotte').click(); await button(local.page, 'Renard').click(); await button(local.page, 'Ajouter cette mascotte').click()
  await button(local.page, 'Commencer la compétition').click(); await button(local.page, 'Je suis prêt').click()
  await local.page.locator('.ci-answer:enabled').first().waitFor(); await local.context.setOffline(true)
  await checkQuestion(local.page, 0)
  for (const answer of await local.page.locator('.ci-answer').all()) {
    const image = answer.locator('img')
    if (!await image.count()) continue
    const text = await answer.locator('.ci-answer-content').innerText()
    const source = recipe.pages[0].libreItems[0].gameBoard.cards.find(c => c.text === text)?.imageSrc
    const bytes = await image.evaluate(async node => Array.from(new Uint8Array(await (await fetch(node.src)).arrayBuffer())))
    const digest = data => createHash('sha256').update(data).digest('hex')
    assert.equal(digest(Buffer.from(bytes)), digest(await readFile('public' + source)))
  }
  await card(local.page, key(0)).click(); await button(local.page, 'Je suis prêt').click()
  assert.equal(await local.page.locator('.ci-answer-key').count(), 0)
  await local.page.locator('.ci-answer:enabled').filter({ hasNot: local.page.getByText(key(0), { exact: true }) }).first().click()
  await local.page.locator('.ci-answer-key').waitFor(); assert.equal(await local.page.locator('.ci-answer-key .ci-answer-content').innerText(), key(0))
  await fits(local.page, 390, 844)
  await button(local.page, 'Question suivante').click(); await button(local.page, 'Je suis prêt').click()
  await local.page.locator('.ci-answer:enabled').first().waitFor(); await checkQuestion(local.page, firstIntrus)
  await card(local.page, key(firstIntrus)).click(); await button(local.page, 'Je suis prêt').click()
  await card(local.page, key(firstIntrus)).click(); await local.page.locator('.ci-answer-key').waitFor()
  assert.equal(await local.page.locator('.ci-answer-key .ci-answer-content').innerText(), key(firstIntrus))
  await fits(local.page, 390, 844); await local.context.close()
  results.push({ competition: 'Deux mascottes, devinette puis intrus sans réseau après préparation des médias ; images identiques aux fichiers source ; corrigé absent pendant le tour suivant du deuxième joueur.' })

  // The extra odd-word key is data only: compare the actual A4 rendering with
  // the same authored paper boards before that metadata existed.
  const paperContext = await browser.newContext({ viewport: { width: 1366, height: 1000 } })
  await paperContext.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  const captures = []
  for (const withKey of [false, true]) {
    const source = structuredClone(recipe)
    source.pages = [source.pages[1]]
    if (!withKey) for (const page of source.pages) for (const item of page.libreItems) for (const card of item.gameBoard.cards) delete card.intrusAnswer
    const page = await paperContext.newPage(); page.on('pageerror', error => errors.push(error.message))
    await page.goto(base + '/'); await page.locator('.landing-page').waitFor({ timeout: 120000 })
    await page.evaluate(recipe => { history.pushState({ clairfleFiche: { id: 'riddles-paper', name: 'Devinettes et intrus', recipe } }, '', '/generateur'); dispatchEvent(new PopStateEvent('popstate')) }, source)
    const frame = page.locator('.a4-frame').first(); await frame.waitFor({ timeout: 120000 })
    assert.equal(await frame.locator('.game-card.is-scatter').count(), 9)
    await page.evaluate(() => document.fonts.ready); await frame.locator('img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() })))
    await page.waitForTimeout(500)
    captures.push(await frame.screenshot({ path: withKey ? 'docs/interactive/screenshots/intrus-a4.png' : '/tmp/clairfle-intrus-a4-without-key.png', animations: 'disabled' }))
    await page.close()
  }
  assert.ok(captures[0].equals(captures[1]), 'An odd-word key must never change printed cards')
  await paperContext.close(); results.push({ paper: 'La capture A4 de la planche Intrus est identique avec et sans le nouveau champ de corrigé ; les deux faces des deux jeux sont conservées.' })
  assert.deepEqual(recipe, original); assert.ok(methods.every(method => method === 'GET')); assert.deepEqual(errors, [])
  results.push({ sourceTemplate: 'unchanged', serverWrites: 0, errors })
  await writeFile('docs/interactive/printable-riddles-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
