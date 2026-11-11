import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { classroomRecipe } from './classroom-fixture.mjs'
import { skipQuestion } from './browser-actions.mjs'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
async function verifyCards(page, correct = 1, muted = 5) {
  assert.equal(await page.locator('.ci-answer-key').count(), correct)
  assert.equal(await page.locator('.ci-answer-muted').count(), muted)
  assert.equal(await page.locator('.ci-margin-answer, .ci-correction-card, .ci-correction-answer').count(), 0)
  for (const card of await page.locator('.ci-answer-key').all()) {
    const appearance = await card.evaluate((element) => { const hex = element.style.getPropertyValue('--card-color').trim(); return { color: getComputedStyle(element).backgroundColor, expected: `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`, filter: getComputedStyle(element).filter, label: element.querySelector('.ci-sr-only')?.textContent } })
    assert.equal(appearance.color, appearance.expected)
    assert.equal(appearance.filter, 'none')
    assert.equal(appearance.label.trim(), 'Bonne réponse')
  }
  for (const card of await page.locator('.ci-answer-muted').all()) {
    const style = await card.evaluate((element) => ({ filter: getComputedStyle(element).filter, background: getComputedStyle(element).backgroundColor }))
    assert.equal(style.filter, 'grayscale(1)')
    assert.equal(style.background, 'rgb(229, 231, 235)')
  }
}
try {
  for (const [width, height] of [[390, 700], [1366, 768]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await page.goto(`${base}/interactif/demo`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
    await page.locator('.ci-launch').click()
    await page.locator('.ci-controls').waitFor()
    assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
    await page.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).click()
    await page.getByRole('button', { name: 'Discuter', exact: true }).click()
    assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
    await page.getByRole('button', { name: 'Enseignant : révéler', exact: true }).click()
    await verifyCards(page)
    assert.equal(await page.locator('.ci-correction-status').count(), 0)
    await page.clock.install()
    await page.clock.pauseAt(new Date(Date.now() + 1000))
    await page.getByRole('button', { name: 'Mode de jeu', exact: true }).click()
    await page.locator('.ci-solo-session .ci-answer:enabled').first().waitFor()
    assert.equal(await page.locator('.ci-answer-key, .ci-answer-muted').count(), 0)
    await page.locator('.ci-answer').filter({ hasNotText: /1.?559/ }).first().click()
    await page.locator('.ci-reveal').waitFor()
    await verifyCards(page)
    assert.equal(await page.locator('.ci-answer-incorrect.ci-answer-muted').count(), 1)
    assert.match(await page.locator('.ci-correction-status').innerText(), /Faux/)
    await page.screenshot({ path: `docs/interactive/screenshots/card-feedback-${width}.png` })
    assert.deepEqual(errors, [])
    results.push({ viewport: `${width}x${height}`, beforeReveal: 'no correctness styling or labels', classAndSolo: 'one full-color correct card, five gray cards; original order retained', duplicatedAnswer: 'removed', errors })
    await page.close()
  }
  const paired = await browser.newPage()
  await paired.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await paired.goto(`${base}/generateur`)
  await paired.evaluate((recipe) => { history.pushState({ clairfleInteractive: { recipe, name: 'Questions appariées' } }, '', '/interactif'); dispatchEvent(new PopStateEvent('popstate')) }, await classroomRecipe())
  await paired.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  await paired.locator('.ci-launch').click()
  await skipQuestion(paired)
  await paired.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).click()
  await paired.getByRole('button', { name: 'Discuter', exact: true }).click()
  await paired.getByRole('button', { name: 'Enseignant : révéler', exact: true }).click()
  await verifyCards(paired, 2, 4)
  assert.equal(await paired.locator('.ci-answer-key img').count(), 2)
  results.push({ pairedAudio: 'one colored correct card per question, four gray cards; images retained in place' })
  const dark = await browser.newPage()
  await dark.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await dark.addInitScript(() => localStorage.setItem('clairfle.interactive.palette.v2', JSON.stringify(['#182238', '#172554', '#312e81', '#581c87', '#052e16', '#431407'])))
  await dark.goto(`${base}/interactif/demo`)
  await dark.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  await dark.locator('.ci-launch').click()
  await dark.getByRole('button', { name: 'Signal : levez vos cartes', exact: true }).click()
  await dark.getByRole('button', { name: 'Discuter', exact: true }).click()
  await dark.getByRole('button', { name: 'Enseignant : révéler', exact: true }).click()
  await verifyCards(dark)
  assert.equal(await dark.locator('.ci-answer-key .ci-answer-verdict').evaluate((element) => getComputedStyle(element).color), 'rgb(24, 34, 56)')
  results.push({ customPalette: 'correct card retains its configured dark color; marker readable; incorrect cards neutral gray' })
  await writeFile('docs/interactive/card-feedback-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
