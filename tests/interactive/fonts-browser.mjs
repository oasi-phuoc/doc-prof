import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
const base = process.env.INTERACTIVE_TEST_URL ?? 'http://127.0.0.1:5180'
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 700 } })
  const requests = []
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => { if (/fonts\.googleapis|fonts\.gstatic/.test(request.url())) requests.push(request.url()) })
  await page.route('https://**', (route) => route.abort())
  await page.context().addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/interactif/demo`)
  await page.locator('.ci-launch:enabled').waitFor({ timeout: 120000 })
  const typography = await page.evaluate(async () => {
    const sample = 'Élève, cœur, Œuvre, « déjà », 1\u202f234\u00a0cm² − × ÷'
    await document.fonts.load('400 20px "DM Sans"', sample)
    await document.fonts.load('700 20px "DM Sans"', sample)
    await document.fonts.load('400 20px "ClairFLE Numerals"', sample)
    await document.fonts.ready
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = `20px ${getComputedStyle(document.querySelector('.ci-app')).fontFamily}`
    const width = (value) => context.measureText(value).width
    const span = document.createElement('span')
    span.style.cssText = 'display:inline-block;position:absolute;font-size:20px;white-space:pre;'
    document.querySelector('.ci-app').append(span)
    span.textContent = '0000'
    const zero = span.getBoundingClientRect().width
    span.textContent = '8888'
    const eight = span.getBoundingClientRect().width
    span.remove()
    return { loaded: document.fonts.check('400 20px "DM Sans"', sample) && document.fonts.check('700 20px "DM Sans"', sample), language: document.documentElement.lang, tabular: getComputedStyle(document.querySelector('.ci-app')).fontVariantNumeric, narrowSpaceWidth: width('1\u202f234') - width('1234'), normalSpaceWidth: width('1 234') - width('1234'), zero, eight }
  })
  assert.equal(typography.loaded, true)
  assert.equal(typography.language, 'fr')
  assert.equal(typography.tabular, 'tabular-nums')
  assert.equal(typography.zero, typography.eight)
  assert.ok(typography.narrowSpaceWidth > 0 && typography.narrowSpaceWidth < typography.normalSpaceWidth)
  assert.deepEqual(requests, [])
  await page.locator('.ci-launch').click()
  await page.locator('.ci-controls').waitFor()
  for (const card of await page.locator('.ci-answer').all()) {
    const box = await card.boundingBox()
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= 391 && box.y + box.height <= 701)
  }
  assert.deepEqual(errors, [])
  const results = { fonts: 'same-origin WOFF2 with all HTTPS requests blocked', french: 'accents, ligatures, guillemets and nonbreaking spaces rendered', typography, googleRequests: 0, mobileCards: 'within viewport', errors }
  await writeFile('docs/interactive/fonts-results.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally { await browser.close() }
