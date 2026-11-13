import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = base + '/__test_api'
const server = await createServer({ cacheDir: '/tmp/clairfle-decks-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
const { defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
const { defaultThemeGameContent } = await server.ssrLoadModule('/src/jeux/bank.ts')
const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
const { buildPage } = await server.ssrLoadModule('/src/math/generate.ts')
const recipe = { ...demoRecipe(), libreMode: true, pages: ['jeux-dominos', 'jeux-loto'].map(type => ({ ...defaultPage('jeux'), ...defaultThemeGameContent(type, 'fruits'), domain: 'jeux', topic: 'jeux-fruits', exerciseType: type, count: 1, columns: 1, libreItems: undefined, extraBlocks: undefined })) }
recipe.pages = recipe.pages.map((page, index) => ({ ...page, libreItems: buildPage(page, recipe.seed + index * 7919).blocks[0].items }))
const original = structuredClone(recipe), game = convertRecipe(recipe)
assert.equal(game.questions.length, 43)
const key = index => { const q = game.questions[index]; return q.choices.find(choice => choice.id === game.corrections[q.id].choiceId).text }
const saved = { id: 'decks-source', name: 'Dominos et Loto', recipe, domains: ['jeux'], createdAt: '2026-11-13T00:00:00Z', updatedAt: '2026-11-13T00:00:00Z' }
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = [], errors = [], methods = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const card = (page, text) => page.locator('.ci-answer').filter({ has: page.getByText(text, { exact: true }) })
async function setup(width, height) {
  const context = await browser.newContext({ viewport: { width, height } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await context.addInitScript(() => localStorage.setItem('clairfle-fiche-sync', 'decks-fixture'))
  await context.route('**/__test_api/fiches', route => { methods.push(route.request().method()); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ fiches: [saved] }) }) })
  const page = await context.newPage(); page.setDefaultTimeout(30000); page.on('pageerror', e => errors.push(e.message))
  await page.goto(base + '/interactif/' + saved.id); await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  return { context, page }
}
async function navigate(page, index) {
  await page.getByRole('button', { name: /^Choisir une question ·/ }).click()
  await page.getByRole('dialog', { name: 'Choisir une question', exact: true }).locator('li button').nth(index).click()
}
async function picture(page, index) {
  const image = page.locator('.ci-stimulus-images img:visible'); await image.waitFor(); await image.evaluate(node => node.decode())
  const src = await image.getAttribute('src'), expected = game.questions[index].images[0]
  if (src.startsWith('blob:')) {
    const bytes = await image.evaluate(async node => Array.from(new Uint8Array(await (await fetch(node.src)).arrayBuffer())))
    const digest = value => createHash('sha256').update(value).digest('hex')
    assert.equal(digest(Buffer.from(bytes)), digest(await readFile('public' + expected)))
  } else assert.equal(new URL(src, base).pathname, expected)
  assert.ok(await image.evaluate(node => node.naturalWidth > 0))
}
async function reveal(page, index) {
  assert.equal(await page.locator('.ci-answer:enabled').count(), 0)
  for (const name of ['Signal : levez vos cartes', 'Discuter', 'Enseignant : révéler']) await button(page, name).click()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), key(index))
  assert.equal(await page.locator('.ci-answer-muted').count(), await page.locator('.ci-answer').count() - 1)
  assert.equal(await page.locator('.ci-margin-answer,.ci-model-answer,.ci-chosen').count(), 0)
}
async function fits(page, width, height) {
  if (await page.locator('.ci-round-question').count()) await page.waitForFunction(() => document.querySelector('.ci-round-question')?.dataset.ciReadability !== undefined)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const boxes = await page.locator('.ci-stimulus-images img:visible,.ci-answer:visible,.ci-margin-left:not(:empty):visible,.ci-controls:visible,.ci-competition-host-controls:visible').evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, ...node.getBoundingClientRect().toJSON() })))
  if (boxes.some((a, i) => a.x < -1 || a.y < -1 || a.right > width + 1 || a.bottom > height + 1 || boxes.slice(i + 1).some(b => !(a.right <= b.x + 1 || b.right <= a.x + 1 || a.bottom <= b.y + 1 || b.bottom <= a.y + 1)))) {
    await page.screenshot({ path: '/tmp/clairfle-decks-overflow.png' })
    await writeFile('/tmp/clairfle-decks-overflow.json', JSON.stringify(await page.locator('.ci-round-question,.ci-question,.ci-answer-grid,.ci-answer-content,.ci-margin-left,.ci-controls').evaluateAll(nodes => nodes.map(node => ({ className: node.className, dataset: { ...node.dataset }, inline: node.style.cssText, rect: node.getBoundingClientRect().toJSON(), clientHeight: node.clientHeight, scrollHeight: node.scrollHeight }))), null, 2))
  }
  for (const box of boxes) assert.ok(box.x >= -1 && box.y >= -1 && box.right <= width + 1 && box.bottom <= height + 1, JSON.stringify(box))
  for (const [i, a] of boxes.entries()) for (const b of boxes.slice(i + 1)) assert.ok(a.right <= b.x + 1 || b.right <= a.x + 1 || a.bottom <= b.y + 1 || b.bottom <= a.y + 1, JSON.stringify({ a, b }))
  const clipped = await page.locator('.ci-stimulus-images img:visible').evaluate(image => { const a = image.getBoundingClientRect(), b = image.closest('.ci-question').getBoundingClientRect(); return a.top < b.top - 1 || a.bottom > b.bottom + 1 })
  assert.equal(clipped, false, 'The entire source picture stays visible')
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  assert.deepEqual((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations, [])
}
try {
  for (const [width, height] of [[390, 844], [1366, 768], [360, 640]]) {
    if (process.env.DECKS_VIEWPORT && width !== Number(process.env.DECKS_VIEWPORT)) continue
    const { context, page } = await setup(width, height)
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(), 43)
    await page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
    await page.locator('.ci-launch').click(); await page.locator('.ci-answer').first().waitFor()
    assert.equal(await page.locator('.ci-answer').count(), 6)
    await picture(page, 0); await fits(page, width, height); await reveal(page, 0); await fits(page, width, height)
    await navigate(page, 1); await picture(page, 1)
    assert.equal(await page.locator('.ci-answer-used').count(), 1); assert.equal(await card(page, key(0)).isDisabled(), true)
    const slots = await page.locator('.ci-answer-content').allTextContents()
    assert.match(await page.locator('.ci-matching-progress').innerText(), /Groupe 1\/3 · 5 mot/)
    await fits(page, width, height); await reveal(page, 1)
    await navigate(page, 2); assert.equal(await page.locator('.ci-answer-used').count(), 2)
    await navigate(page, 1); assert.deepEqual(await page.locator('.ci-answer-content').allTextContents(), slots)
    await navigate(page, 15); assert.equal(await page.locator('.ci-answer').count(), 4); await picture(page, 15); await fits(page, width, height); await reveal(page, 15); await fits(page, width, height)
    await page.screenshot({ path: `docs/interactive/screenshots/dominos-${width}.png` })
    await navigate(page, 16); assert.equal(await page.locator('.ci-answer').count(), 6); assert.equal(await page.locator('.ci-answer-used').count(), 0)
    await picture(page, 16); await fits(page, width, height); await reveal(page, 16)
    await navigate(page, 42); assert.equal(await page.locator('.ci-answer').count(), 3); await picture(page, 42); await fits(page, width, height); await reveal(page, 42)
    await button(page, 'Quitter la séance').click(); await page.locator('.ci-launch:enabled').waitFor(); await page.reload()
    await button(page, 'Reprendre la séance').click(); await page.locator('.ci-answer-key').waitFor()
    await picture(page, 42); assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(), key(42)); await fits(page, width, height)
    await navigate(page, 2); assert.equal(await page.locator('.ci-answer-used').count(), 2); await navigate(page, 42)
    await page.screenshot({ path: `docs/interactive/screenshots/loto-${width}.png` })
    results.push({ viewport: `${width}x${height}`, class: '16 paires Dominos en trois groupes et 27 paires Loto en cinq groupes ; mots déjà associés indisponibles et indépendance des groupes et des deux fiches.', resume: 'Question, image et corrigé conservés après rechargement et navigation ; les lettres restent à leur place.', layout: 'Images entières, cartes, mascotte et commandes visibles ; axe passe.' })
    await context.close()
  }
  const solo = await setup(390, 844)
  await button(solo.page, 'Tout désélectionner').click()
  for (const index of [16, 17, 18]) await solo.page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check()
  await button(solo.page, 'Mode de jeu').click(); await solo.page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
  await button(solo.page, 'Régler le minuteur').click(); await solo.page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('1'); await button(solo.page, 'Fermer les réglages').click()
  await solo.page.clock.install(); await solo.page.clock.pauseAt(new Date(Date.now() + 1000)); await solo.page.locator('.ci-launch').click(); await solo.page.locator('.ci-answer:enabled').first().waitFor()
  await card(solo.page, key(16)).click(); await solo.page.locator('.ci-answer-correct').waitFor(); await solo.page.clock.runFor(1100)
  await solo.page.locator('.ci-answer:enabled').first().waitFor(); assert.equal(await solo.page.locator('.ci-answer:enabled').count(), 5); assert.equal(await card(solo.page, key(16)).isDisabled(), true)
  await solo.page.locator('.ci-answer:enabled').filter({ hasNot: solo.page.getByText(key(17), { exact: true }) }).first().click(); await solo.page.locator('.ci-answer-incorrect').waitFor()
  assert.equal(await solo.page.locator('.ci-answer-key .ci-answer-content').innerText(), key(17)); await solo.page.clock.runFor(1100)
  await solo.page.locator('.ci-answer:enabled').first().waitFor(); await solo.page.clock.runFor(5100); await solo.page.locator('.ci-reveal').waitFor()
  assert.equal(await solo.page.locator('.ci-answer-key .ci-answer-content').innerText(), key(18)); assert.equal((await solo.page.locator('.ci-correction-status').innerText()).trim(), 'Temps écoulé')
  await solo.page.clock.runFor(1100); await solo.page.locator('.ci-summary').waitFor(); assert.match(await solo.page.locator('.ci-matching-summary').innerText(), /1 paire réussie sur 3/)
  await solo.context.close(); results.push({ solo: 'Bonne réponse, erreur et expiration ; mots utilisés bloqués ; correction et suite automatiques ; bilan 1/3.' })

  const local = await setup(390, 844)
  await button(local.page, 'Tout désélectionner').click()
  for (const index of [0, 16, 17]) await local.page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check()
  await local.page.getByRole('checkbox', { name: 'Activer le minuteur', exact: true }).uncheck()
  await button(local.page, 'Compétition').click(); await button(local.page, 'Préparer le défi local').click()
  await button(local.page, 'Ajouter cette mascotte').click(); await button(local.page, 'Renard').click(); await button(local.page, 'Ajouter cette mascotte').click()
  await button(local.page, 'Commencer la compétition').click()
  for (const [turn, index] of [0, 16, 17].entries()) {
    if (turn) await button(local.page, 'Question suivante').click()
    await button(local.page, 'Je suis prêt').click(); await local.page.locator('.ci-answer:enabled').first().waitFor()
    if (!turn) await local.context.setOffline(true)
    await picture(local.page, index)
    assert.equal(await local.page.locator('.ci-answer-used').count(), turn === 2 ? 1 : 0)
    if (turn === 2) assert.equal(await card(local.page, key(16)).isDisabled(), true)
    await card(local.page, key(index)).click(); await button(local.page, 'Je suis prêt').click()
    assert.equal(await local.page.locator('.ci-answer-key').count(), 0); assert.equal(await card(local.page, key(index)).isEnabled(), true)
    if (turn === 2) { assert.equal(await card(local.page, key(16)).isDisabled(), true); await card(local.page, key(index)).click() }
    else await local.page.locator('.ci-answer:enabled').filter({ hasNot: local.page.getByText(key(index), { exact: true }) }).first().click()
    await local.page.locator('.ci-answer-key').waitFor(); assert.equal(await local.page.locator('.ci-answer-key .ci-answer-content').innerText(), key(index)); await fits(local.page, 390, 844)
  }
  await local.context.close(); results.push({ competition: 'Deux mascottes, une paire Dominos puis deux paires Loto sans réseau après préparation ; images identiques aux originaux ; aucun corrigé courant dévoilé entre joueurs et mots des tours précédents bloqués.' })

  const paperContext = await browser.newContext({ viewport: { width: 1366, height: 1000 } })
  await paperContext.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  const captures = []
  for (const withWord of [false, true]) {
    const source = structuredClone(recipe); source.pages = [source.pages[0]]
    if (!withWord) for (const item of source.pages[0].libreItems) for (const card of item.gameBoard.cards) delete card.dominoWord
    const page = await paperContext.newPage(); page.on('pageerror', e => errors.push(e.message))
    await page.goto(base + '/'); await page.locator('.landing-page').waitFor({ timeout: 120000 })
    await page.evaluate(recipe => { history.pushState({ clairfleFiche: { id: 'dominos-paper', name: 'Dominos', recipe } }, '', '/generateur'); dispatchEvent(new PopStateEvent('popstate')) }, source)
    const frame = page.locator('.a4-frame').first(); await frame.waitFor({ timeout: 120000 }); assert.equal(await frame.locator('.game-card.is-domino').count(), 16)
    await page.evaluate(() => document.fonts.ready); await frame.locator('img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode() })))
    await page.waitForTimeout(500); captures.push(await frame.screenshot({ path: withWord ? 'docs/interactive/screenshots/dominos-a4.png' : '/tmp/clairfle-dominos-without-word.png', animations: 'disabled' })); await page.close()
  }
  assert.ok(captures[0].equals(captures[1]), 'The source image label must not change printed dominos')
  await paperContext.close(); results.push({ paper: 'Planche A4 Dominos identique avec et sans le libellé image conservé ; banques et grilles Loto préservées.' })
  assert.deepEqual(recipe, original); assert.ok(methods.every(method => method === 'GET')); assert.deepEqual(errors, [])
  results.push({ sourceTemplate: 'unchanged', serverWrites: 0, errors })
  await writeFile('docs/interactive/printable-decks-results.json', JSON.stringify(results, null, 2) + '\n'); console.log(JSON.stringify(results, null, 2))
} finally { await browser.close(); await server.close() }
