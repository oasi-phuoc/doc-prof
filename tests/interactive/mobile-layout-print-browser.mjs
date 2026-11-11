import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const results = []
await mkdir('docs/interactive/screenshots', { recursive: true })
async function bottomOfAnswers(page) {
  return Math.max(...await page.locator('.ci-answer').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().bottom)))
}
async function fits(page, width, height) {
  for (const element of await page.locator('.ci-answer:visible, .ci-controls:visible, .ci-phase-art:visible, .ci-timer-value:visible, .ci-result-portrait:visible').all()) {
    const box = await element.boundingBox()
    assert.ok(box.x >= -1 && box.y >= -1 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1, `Off-screen: ${await element.getAttribute('class')} ${JSON.stringify(box)}`)
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
}
try {
  for (const [width, height] of [[360, 640], [390, 700], [430, 800], [700, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: true })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    await page.goto(`${base}/interactif/demo`)
    await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
    await page.locator('.ci-launch').click()
    await page.locator('.ci-controls').waitFor()
    const phase = await page.locator('.ci-phase-art').boundingBox()
    const timer = await page.locator('.ci-timer-value').boundingBox()
    assert.ok(phase.y >= await bottomOfAnswers(page))
    assert.ok(timer.y >= phase.y + phase.height - 1)
    assert.ok(Math.abs(phase.width - Math.min(108, Math.max(72, height * .14))) < 1)
    assert.ok(Math.abs(phase.x + phase.width / 2 - width / 2) < 2)
    assert.ok(Math.abs(timer.x + timer.width / 2 - width / 2) < 2)
    assert.equal((await page.locator('.ci-phase-banner').innerText()).trim(), '')
    assert.equal(await page.locator('.ci-phase-banner').getAttribute('aria-label'), 'Je réfléchis')
    const title = await page.locator('.ci-question h1').evaluate((element) => ({ size: parseFloat(getComputedStyle(element).fontSize), weight: Number(getComputedStyle(element).fontWeight), frame: parseFloat(getComputedStyle(element).borderTopWidth) }))
    assert.ok(title.size >= 28 && title.weight >= 700 && title.frame >= 2)
    await fits(page, width, height)
    await page.screenshot({ path: `docs/interactive/screenshots/mobile-question-mascot-${width}.png` })
    await page.getByRole('button', { name: 'Régler le minuteur', exact: true }).click()
    await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)', exact: true }).fill('5')
    await page.getByRole('spinbutton', { name: 'Temps entre les questions (secondes)', exact: true }).fill('10')
    await page.getByRole('button', { name: 'Fermer les réglages', exact: true }).click()
    await page.clock.install()
    await page.clock.pauseAt(new Date(Date.now() + 1000))
    await page.getByRole('button', { name: 'Mode de jeu', exact: true }).click()
    await page.locator('.ci-solo-session .ci-controls').waitFor()
    await page.clock.runFor(5100)
    await page.locator('.ci-reveal').waitFor()
    const status = page.locator('.ci-correction-status')
    assert.equal((await status.innerText()).trim(), 'Temps écoulé')
    const portrait = await page.locator('.ci-result-portrait').boundingBox()
    assert.equal(portrait.width, 104)
    assert.equal(await page.locator('.ci-margin-answer').count(), 0)
    assert.equal(await page.locator('.ci-answer-key').count(), 1)
    assert.equal(await page.locator('.ci-answer-muted').count(), 5)
    assert.ok(portrait.y >= await bottomOfAnswers(page))
    assert.equal(await page.locator('.ci-round-question .ci-explanation').count(), 0)
    await fits(page, width, height)
    await page.screenshot({ path: `docs/interactive/screenshots/mobile-timeout-mascot-${width}.png` })
    assert.deepEqual(errors, [])
    results.push({ viewport: `${width}x${height}`, question: title, phase: 'double-size mascot and centered timer below all answers, no visible caption', timeout: 'Temps écoulé; 104 px feedback mascot below answers', fit: 'all game controls and cards within viewport', errors })
    await page.close()
  }
  const page = await browser.newPage()
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  await page.getByRole('spinbutton', { name: 'Jeux de cartes', exact: true }).fill('2')
  await page.emulateMedia({ media: 'print' })
  assert.equal(await page.locator('.ci-card-sheet').count(), 4)
  for (const sheet of await page.locator('.ci-card-sheet').all()) {
    const positions = await sheet.locator('.ci-paper-card').evaluateAll((cards) => cards.map((card) => { const r = card.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }))
    assert.equal(positions.length, 6)
    for (const card of positions) assert.ok(Math.abs(card.width - card.height) < .1)
    for (let row = 0; row < 3; row++) { assert.equal(positions[row * 2].y, positions[row * 2 + 1].y); assert.ok(positions[row * 2 + 1].x > positions[row * 2].x) }
    assert.ok(positions[2].y > positions[0].y && positions[4].y > positions[2].y)
  }
  const pdf = await page.pdf({ path: '/tmp/clairfle-square-cards.pdf', preferCSSPageSize: true, printBackground: true })
  const content = pdf.toString('latin1')
  assert.equal([...content.matchAll(/\/Type\s*\/Page\b/g)].length, 4)
  for (const [, width, height] of content.matchAll(/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/g)) { assert.ok(Math.abs(Number(width) - 595.28) < 1); assert.ok(Math.abs(Number(height) - 841.89) < 1) }
  results.push({ print: 'six 88 mm square cards, two columns by three rows; two sets produce four portrait A4 pages for two duplex sheets' })
  await writeFile('docs/interactive/mobile-layout-print-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
