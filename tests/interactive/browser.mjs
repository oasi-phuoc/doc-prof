import assert from 'node:assert/strict'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const output = 'docs/interactive/screenshots'
await mkdir(output, { recursive: true })
const fixture = JSON.parse(
  await readFile('docs/interactive/demo-fixture.json', 'utf8'),
)
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
  args: ['--no-sandbox'],
})
const results = []
async function fitControls(page, height) {
  await page.evaluate(() => window.scrollTo(0, 0))
  const bounds = await page.locator('.ci-controls').boundingBox()
  assert.ok(
    bounds.y + bounds.height <= height + 2,
    `Controls exceed viewport: ${JSON.stringify(bounds)} / ${height}`,
  )
}
try {
  for (const [width, height] of [
    [1920, 1080],
    [1366, 768],
    [1280, 800],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: 'reduce',
    })
    page.setDefaultNavigationTimeout(120000)
    await page
      .context()
      .addCookies([
        { name: 'clairfle-fiche-access', value: 'admin', url: base },
      ])
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`${base}/interactif/demo`)
    await page
      .getByRole('button', { name: /Commencer la séance/ })
      .waitFor({ timeout: 120000 })
    assert.equal(
      await page.locator('.ci-question-list fieldset > label').count(),
      10,
    )
    await page.screenshot({
      path: `${output}/01-setup-${width}.png`,
      fullPage: true,
    })
    // The print kit remains six physical cards on each A4 portrait sheet.
    await page.getByRole('spinbutton', { name: 'Jeux de cartes' }).fill('2')
    await page.emulateMedia({ media: 'print' })
    assert.equal(await page.locator('.ci-card-sheet').count(), 2)
    for (const sheet of await page.locator('.ci-card-sheet').all()) {
      const box = await sheet.boundingBox()
      assert.ok(Math.abs(box.width - (210 / 25.4) * 96) < 2)
      assert.ok(Math.abs(box.height - (297 / 25.4) * 96) < 2)
      assert.equal(await sheet.locator('.ci-paper-card').count(), 6)
    }
    if (width === 1366)
      await page.pdf({
        path: `${output}/cartes-classe-a4.pdf`,
        preferCSSPageSize: true,
        printBackground: true,
      })
    await page.emulateMedia({ media: 'screen' })
    await page.getByRole('button', { name: /Commencer la séance/ }).click()
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    assert.equal(await page.getByRole('button', { name: /révéler/ }).count(), 0)
    assert.equal(await page.locator('.ci-answer:disabled').count(), 6)
    await page.screenshot({ path: `${output}/02-thinking-${width}.png` })
    await page
      .getByRole('button', { name: 'Signal : levez vos cartes' })
      .click()
    await page.locator('.ci-answer').first().click()
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    await page.getByRole('button', { name: 'Discuter', exact: true }).click()
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    await page.getByRole('button', { name: 'Enseignant : révéler' }).click()
    assert.equal(await page.locator('.ci-reveal').count(), 1)
    assert.match(await page.locator('.ci-reveal').innerText(), /1.?559/)
    await page.screenshot({ path: `${output}/03-reveal-${width}.png` })
    await page.waitForTimeout(1000)
    assert.match(
      await page.locator('.ci-progress').innerText(),
      /Question 1 \/ 10/,
    )
    await page.getByRole('button', { name: 'Question suivante' }).click()
    await page.getByRole('button', { name: 'Pause', exact: true }).click()
    assert.equal(await page.locator('.ci-answer:visible').count(), 0)
    await page
      .getByRole('button', { name: 'Reprendre la séance', exact: true })
      .last()
      .click()
    await page.getByRole('button', { name: 'Passer', exact: true }).click()
    assert.equal(await page.locator('.ci-figure svg').count(), 1)
    await fitControls(page, height)
    await page.screenshot({ path: `${output}/04-geometry-${width}.png` })
    await page.getByRole('button', { name: 'Passer', exact: true }).click()
    const audio = page.locator('audio')
    assert.equal(await audio.count(), 1)
    assert.equal(await audio.evaluate((a) => a.paused && !a.autoplay), true)
    assert.ok((await audio.getAttribute('src')).endsWith('.mp3'))
    await audio.evaluate(async (a) => {
      a.muted = true
      await a.play()
    })
    await page.waitForTimeout(600)
    assert.ok(await audio.evaluate((a) => a.currentTime > 0 && !a.paused))
    await audio.evaluate((a) => {
      a.pause()
      a.currentTime = 0
    })
    assert.equal(await audio.evaluate((a) => a.paused), true)
    assert.equal(
      await page.locator('.ci-answer').count(),
      fixture.questions[3].choices.length,
    )
    await page.screenshot({ path: `${output}/05-audio-${width}.png` })
    // Reload requires an explicit launch and resumes at reflection, never at reveal.
    await page.reload()
    await page.getByRole('button', { name: /Reprendre la séance/ }).click()
    assert.match(
      await page.locator('.ci-progress').innerText(),
      /Question 4 \/ 10/,
    )
    assert.equal(await page.locator('.ci-reveal').count(), 0)
    for (let i = 0; i < 6; i++)
      await page.getByRole('button', { name: 'Passer', exact: true }).click()
    assert.equal(
      await page.locator('.ci-sequence .ci-image-zoom img').count(),
      4,
    )
    const before = await page
      .locator('.ci-sequence img')
      .first()
      .getAttribute('src')
    await page
      .getByRole('button', { name: 'Déplacer la scène 1 à droite' })
      .click()
    assert.notEqual(
      await page.locator('.ci-sequence img').first().getAttribute('src'),
      before,
    )
    await fitControls(page, height)
    await page.screenshot({ path: `${output}/06-oral-${width}.png` })
    await page.getByRole('button', { name: 'Commencer l’échange' }).click()
    await page.getByRole('button', { name: 'Discuter', exact: true }).click()
    await page.getByRole('button', { name: 'Enseignant : révéler' }).click()
    await page
      .getByRole('button', { name: 'À retravailler', exact: true })
      .click()
    await page.getByRole('button', { name: 'Voir le bilan' }).click()
    assert.equal(await page.locator('.ci-summary').count(), 1)
    await page.screenshot({
      path: `${output}/07-summary-${width}.png`,
      fullPage: true,
    })
    await page
      .getByRole('button', { name: /Reprendre les questions difficiles/ })
      .click()
    assert.equal(await page.locator('.ci-question').count(), 1)
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
      false,
    )
    assert.deepEqual(errors, [])
    results.push({
      viewport: `${width}x${height}`,
      questions: 10,
      ritual: 'passed',
      print: '2 A4 sheets / 12 cards',
      resume: 'passed',
      errors,
    })
    await page.close()
  }
  // An unauthenticated direct saved-fiche URL cannot open protected content.
  const page = await browser.newPage()
  await page.goto(`${base}/interactif/inaccessible`)
  await page.waitForURL('**/acces')
  results.push({ unauthenticatedSavedRoute: 'redirects to access' })
  await page.close()
  await writeFile(
    'docs/interactive/browser-results.json',
    JSON.stringify(results, null, 2) + '\n',
  )
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
