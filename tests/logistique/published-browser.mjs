import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const externalUrl = process.env.LOGISTIQUE_TEST_URL
const base = externalUrl ?? 'http://127.0.0.1:5190'
const server = externalUrl ? null : await createServer({ server: { host: '127.0.0.1', port: 5190, strictPort: true } })
let browser
try {
  await server?.listen()
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ viewport: { width: 1366, height: 1000 } })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  const page = await context.newPage()
  page.setDefaultTimeout(90000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const sheet = page.locator('.a4-frame .worksheet-sheet').first()

  async function select(label, choice) {
    await page.getByRole('button', { name: label, exact: true }).click()
    await page.getByRole('option', { name: choice, exact: true }).click()
  }

  async function inspectPrint(label) {
    await page.emulateMedia({ media: 'print' })
    const printed = page.locator('.print-only-sheets .worksheet-sheet')
    await printed.first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    const pages = await printed.evaluateAll(async (elements) => {
      await Promise.all(elements.flatMap((element) => [...element.querySelectorAll('img')]).map((img) => img.decode()))
      return elements.map((element) => {
        const bounds = element.getBoundingClientRect()
        const items = [...element.querySelectorAll('.exercise-item')]
        const lastBottom = Math.max(...items.map((item) => item.getBoundingClientRect().bottom))
        const footer = element.querySelector('.doc-footer')
        return {
          height: bounds.height,
          count: items.length,
          reserve: (footer?.getBoundingClientRect().top ?? bounds.bottom) - lastBottom,
        }
      })
    })
    assert(pages.every(({ height }) => Math.abs(height - 1122.52) < 3), label + ' A4')
    assert(pages.every(({ reserve }) => reserve >= 25), label + ' reserve: ' + JSON.stringify(pages))
    const printText = await page.locator('.print-only-sheets').innerText()
    await page.emulateMedia({ media: 'screen' })
    return { pages, printText }
  }

  await page.goto(base + '/generateur')
  await sheet.waitFor()
  for (const diploma of ['CFC', 'AFP']) {
    await select('Domaine', 'Logistique ' + diploma)
    await select('Sous-thème', '105 — Marchandises')
    await sheet.getByText('Théorie : module 105', { exact: true }).waitFor()
    const theory = await inspectPrint('Théorie ' + diploma)
    assert(theory.pages.length > 1)
    assert.equal(theory.pages.reduce((sum, item) => sum + item.count, 0), 98)
    assert.match(theory.printText, /L’humidité relative est le rapport/)
    assert.match(theory.printText, /5\.7\.2 La manutention des marchandises/)
    assert.equal(await page.locator('.print-only-sheets img[src*="degre-transformation"]').count(), 1)
    await select('Type d’exercice', 'Glossaires')
    const glossary = await inspectPrint('Glossaire ' + diploma)
    assert.equal(glossary.pages.reduce((sum, item) => sum + item.count, 0), 45)
    await select('Type d’exercice', 'Mathématiques')
    const calculations = await inspectPrint('Mathématiques ' + diploma)
    assert.equal(calculations.pages.reduce((sum, item) => sum + item.count, 0), diploma === 'CFC' ? 8 : 4)
    assert.match(calculations.printText, /1 200 CHF/)
    await select('Type d’exercice', 'Vérification des connaissances')
    await inspectPrint('Vérification ' + diploma)
    await select('Type d’exercice', 'Mises en situation')
    await inspectPrint('Situations ' + diploma)
    console.log(`Module 105 ${diploma} en banque active : cinq types imprimés, réserve de 25 px vérifiée.`)
  }
  assert.deepEqual(errors, [])
} finally {
  await browser?.close()
  await server?.close()
}
