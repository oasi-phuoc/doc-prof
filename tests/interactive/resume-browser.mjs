import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
async function savedClock(page, phase) {
  for (let i = 0; i < 100; i++) {
    const clock = await page.evaluate(async (phase) => {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('clairfle-interactive', 1)
        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
      })
      const rows = await new Promise((resolve, reject) => {
        const tx = db.transaction('sessions')
        const request = tx.objectStore('sessions').getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
      })
      db.close()
      return rows.find((row) => row.mode === 'solo' && row.clock?.phase === phase && row.clock.remainingMs > 2500 && row.clock.remainingMs < 3100)?.clock
    }, phase)
    if (clock) return clock
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  assert.fail(`No current durable ${phase} clock`)
}
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.getByRole('button', { name: /Commencer la séance/ }).waitFor({ timeout: 120000 })
  await page.getByRole('button', { name: 'Mode de jeu', exact: true }).click()
  await page.getByRole('combobox', { name: 'Mode de jeu', exact: true }).selectOption('solo')
  await page.getByRole('spinbutton', { name: 'Temps de réflexion (secondes)' }).fill('5')
  await page.clock.install()
  await page.clock.pauseAt(new Date(Date.now() + 1000))
  await page.getByRole('button', { name: /Commencer la séance/ }).click()
  await page.locator('.ci-controls').waitFor()
  await page.clock.runFor(2100)
  assert.equal(await page.locator('.ci-timer-value').innerText(), '0:03')
  await page.getByRole('button', { name: 'Pause', exact: true }).click()
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  const thinking = await savedClock(page, 'thinking')
  await page.reload()
  await page.clock.resume()
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 30000 })
  assert.match(await page.locator('.ci-launch').innerText(), /Reprendre la séance/, await page.locator('body').innerText())
  await page.clock.pauseAt(new Date((await page.evaluate(() => Date.now())) + 100))
  assert.equal(await page.getByRole('button', { name: 'Mode de jeu', exact: true }).getAttribute('aria-description'), 'Mode actuel : Solo')
  await page.getByRole('button', { name: /Reprendre la séance/ }).click()
  await page.locator('.ci-pause').waitFor()
  assert.equal(await page.locator('.ci-timer-value').innerText(), '0:03')
  await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).click()
  await page.clock.runFor(2700)
  assert.equal(await page.locator('.ci-reveal').count(), 0)
  await page.clock.runFor(400)
  await page.locator('.ci-reveal').waitFor()
  assert.match(await page.locator('.ci-correction-status').innerText(), /sans réponse/)
  await page.clock.runFor(2100)
  await page.getByRole('button', { name: 'Pause', exact: true }).click()
  await page.getByRole('button', { name: 'Quitter la séance', exact: true }).click()
  await page.getByRole('button', { name: /Reprendre la séance/ }).waitFor()
  const correction = await savedClock(page, 'revealed')
  await page.reload()
  await page.clock.resume()
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 30000 })
  assert.match(await page.locator('.ci-launch').innerText(), /Reprendre la séance/, await page.locator('body').innerText())
  await page.clock.pauseAt(new Date((await page.evaluate(() => Date.now())) + 100))
  await page.getByRole('button', { name: /Reprendre la séance/ }).click()
  await page.locator('.ci-pause').waitFor()
  await page.getByRole('button', { name: 'Reprendre la séance', exact: true }).click()
  await page.clock.runFor(2700)
  assert.match(await page.locator('.ci-progress').innerText(), /Question 1 /)
  await page.clock.runFor(400)
  await page.locator('.ci-progress').filter({ hasText: /Question 2 / }).waitFor()
  assert.deepEqual(errors, [])
  const results = { mode: 'solo retained after reload', thinkingRemainingMs: thinking.remainingMs, correctionRemainingMs: correction.remainingMs, paused: 'preserved', verdict: 'timeout remains incorrect', automaticNext: 'remaining correction time, no extra five seconds', errors }
  await writeFile('docs/interactive/resume-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
