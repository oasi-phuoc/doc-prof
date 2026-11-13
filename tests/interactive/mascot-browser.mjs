import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.getByRole('button', { name: /Commencer la séance/ }).waitFor({ timeout: 120000 })
  await page.evaluate(async () => { const { mountMascots } = await import('/tests/interactive/mascot-fixture.tsx'); mountMascots() })
  await page.locator('[data-test-effects] .ci-mascot-incorrect').waitFor()
  const examples = page.locator('#mascot-test-root [data-test-pose] .ci-mascot-sprite')
  assert.equal(await examples.count(), 180)
  const samples = await examples.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element)
    const animation = element.getAnimations()[0]
    if (!animation) return { pose: element.parentElement.getAttribute('aria-label'), animation: 'none' }
    animation.pause()
    const duration = Number(animation.effect.getTiming().duration)
    animation.currentTime = duration * .1
    const before = getComputedStyle(element).transform
    animation.currentTime = duration * .5
    const after = getComputedStyle(element).transform
    animation.play()
    return { pose: element.parentElement.getAttribute('aria-label'), animation: style.animationName, before, after, image: style.backgroundImage }
  }))
  for (const sample of samples) {
    assert.notEqual(sample.animation, 'none', sample.pose)
    assert.notEqual(sample.before, sample.after, sample.pose)
  }
  for (const effect of ['.ci-confetti > i', '.ci-tears > i']) {
    assert.notEqual(await page.locator(`[data-test-effects] ${effect}`).first().evaluate((element) => getComputedStyle(element).animationName), 'none')
    assert.notEqual(await page.locator(`[data-test-effects] ${effect}`).first().evaluate((element) => getComputedStyle(element.parentElement).display), 'none')
  }
  await page.evaluate(async () => {
    const urls = new Set([...document.querySelectorAll('#mascot-test-root .ci-mascot-sprite')].map((element) => getComputedStyle(element).backgroundImage.slice(5, -2)))
    await Promise.all([...urls].map(async (url) => { const image = new Image(); image.src = url; await image.decode() }))
  })
  assert.deepEqual(errors, [])
  const results = { mascots: 30, poses: 6, movingExamples: samples.length, reducedMotion: 'mascots and effects remain active as requested', dragon: 'six poses decoded and animated', errors }
  await writeFile('docs/interactive/mascot-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
