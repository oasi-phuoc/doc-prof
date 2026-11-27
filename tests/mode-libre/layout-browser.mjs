import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const directory = await mkdtemp(join(tmpdir(), 'doc-prof-libre-browser-'))
const server = process.env.BASE_URL ? null : await createServer({
  cacheDir: join(directory, 'vite'),
  server: { host: '127.0.0.1', port: 0, hmr: false },
})
let browser

const button = (page, name) => page.getByRole('button', { name, exact: true })
const frame = '.a4-frame:visible'
const items = '.a4-frame .exercise-item'
const editor = '.side-tool-panel.is-libre'

async function snapshot(page) {
  await page.locator(frame).first().waitFor()
  await page.evaluate(async () => { await document.fonts.ready })
  const box = await page.locator(frame).first().boundingBox()
  const scale = await page.locator(frame).first().evaluate((element) =>
    getComputedStyle(element).getPropertyValue('--a4-scale'),
  )
  return { width: box.width, height: box.height, scale, contents: await page.locator(items).allTextContents() }
}

async function pdfSize(page, name) {
  const path = join(directory, name + '.pdf')
  await page.pdf({ path, preferCSSPageSize: true })
  const info = execFileSync('pdfinfo', [path], { encoding: 'utf8' })
  return {
    size: info.match(/^Page size:\s+([\d.]+) x ([\d.]+) pts/m)?.slice(1).map(Number),
    pages: Number(info.match(/^Pages:\s+(\d+)/m)?.[1]),
    text: execFileSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8' }),
  }
}

async function chooseDoubleA5(page) {
  await button(page, 'Paramètres').click()
  await page.getByRole('radio', { name: /Paysage — double A5/ }).click()
  await button(page, 'Paramètres').click()
}

async function selectDomainOptions(page) {
  await button(page, 'Domaine').click()
  const options = await page.getByRole('listbox', { name: 'Domaine' }).getByRole('option').allTextContents()
  await page.keyboard.press('Escape')
  return options
}

async function assertNoHorizontalOverflow(page) {
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  assert(fits, 'Le document déborde horizontalement.')
}

async function checkLayout(page, width, doubleA5) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto('/generateur')
  if (doubleA5) await chooseDoubleA5(page)
  const normal = await snapshot(page)
  const print = width === 1366 ? await pdfSize(page, 'normal') : null
  const domains = await selectDomainOptions(page)

  await button(page, 'Mode libre').click()
  assert.equal(await page.locator('.settings-panel').count(), 0)
  assert.equal(await page.locator(editor).count(), 1)
  assert.equal(await page.locator('.result-panel').count(), 1)
  assert.deepEqual(await selectDomainOptions(page), domains)
  await assertNoHorizontalOverflow(page)

  if (width <= 550) {
    assert(!(await page.locator('.result-panel').isVisible()))
    const instruction = page.locator(editor).getByRole('textbox', { name: 'Consigne' })
    await instruction.focus()
    await button(page, 'Aperçu').click()
    assert(!(await page.locator(editor).isVisible()))
    await page.locator('#activity-preview:focus').waitFor()
    await assertNoHorizontalOverflow(page)
  } else {
    const left = await page.locator(editor).boundingBox()
    const right = await page.locator('.result-panel').boundingBox()
    if (width >= 851) assert(left.x + left.width <= right.x + 1)
    if (width === 1366) {
      await button(page, 'En-tête et pied de page').click()
      await page.locator(editor + ' > .is-footer').waitFor()
      assert.equal(await page.locator('.workspace > .is-footer').count(), 0)
      assert.equal(await page.locator('.result-panel').count(), 1)
      await button(page, 'Fermer le panneau pied de page').click()
    }
  }

  const libre = await snapshot(page)
  assert(Math.abs(libre.width - normal.width) <= 1)
  assert(Math.abs(libre.height - normal.height) <= 1)
  assert(Math.abs(Number(libre.scale) - Number(normal.scale)) <= 0.001)
  assert.deepEqual(libre.contents, normal.contents)
  if (print) {
    const librePrint = await pdfSize(page, 'libre')
    assert.deepEqual(librePrint, print)
    assert.deepEqual(print.size, doubleA5 ? [841.92, 594.96] : [594.96, 841.92])
  }

  if (width <= 550) {
    await button(page, 'Édition').click()
    await page.locator(editor + ' textarea:focus').waitFor()
  }
  await button(page, 'Fermer le mode libre').click()
  assert.equal(await page.locator(editor).count(), 0)
  assert.equal(await page.locator('.settings-panel').count(), 1)
  assert.deepEqual((await snapshot(page)).contents, normal.contents)
}

async function checkAddition(page) {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto('/generateur')
  await button(page, 'Mode libre').click()
  assert.equal(await button(page, 'Valider les changements').count(), 0)
  const quantity = page.getByRole('spinbutton', { name: 'Nombre de questions', exact: true })
  await quantity.fill('2')
  await page.waitForFunction((selector) => document.querySelectorAll(selector).length === 2, items)

  const first = page.getByRole('group', { name: 'Calcul 1', exact: true })
  const operand = first.getByRole('textbox', { name: '1ʳᵉ', exact: true })
  const right = Number((await first.getByRole('textbox', { name: '2ᵉ', exact: true }).inputValue()).replace(/[\s'’]/g, ''))
  await button(page, 'Fiche élève (cliquer pour corrigé)').click()
  const correction = page.locator(items).first().locator('.eq-ans')
  const number = (value) => Number(value.replace(/[\s'’]/g, '').replace(',', '.'))
  for (const value of [17, 29]) {
    await operand.fill(String(value))
    assert.equal(number(await correction.textContent()), value + right)
  }

  await operand.fill('-')
  assert.equal(await operand.getAttribute('aria-invalid'), 'true')
  assert.equal(number(await correction.textContent()), 29 + right)

  await page.evaluate(() => {
    window.print = () => { document.documentElement.dataset.printCalled = 'true' }
  })
  const print = button(page, 'Imprimer la fiche et le corrigé')
  let confirmation = ''
  page.once('dialog', async (dialog) => {
    confirmation = dialog.message()
    await dialog.dismiss()
  })
  await print.click()
  assert.match(confirmation, /Calcul 1.*imprimer.*29/)
  await page.locator('#activity-editor input[aria-invalid=true]:focus').waitFor()
  assert.equal(await page.locator('html').getAttribute('data-print-called'), null)

  page.once('dialog', (dialog) => dialog.accept())
  await print.click()
  await page.locator('html[data-print-called=true]').waitFor({ state: 'attached' })
  assert.equal(await operand.inputValue(), '-')

  page.once('dialog', async (dialog) => {
    confirmation = dialog.message()
    await dialog.accept()
  })
  await button(page, 'Enregistrer').click()
  const save = page.getByRole('dialog', { name: 'Enregistrer la fiche' })
  await save.waitFor()
  assert.match(confirmation, /Calcul 1.*enregistrer.*29/)
  await button(save, 'Fermer').click()
  assert.equal(await operand.inputValue(), '-')
  await operand.fill('29')

  await quantity.fill('3')
  await page.waitForFunction((selector) => document.querySelectorAll(selector).length === 3, items)
  assert.equal(await operand.inputValue(), '29')
  assert.equal(number(await correction.textContent()), 29 + right)

  page.once('dialog', (dialog) => dialog.dismiss())
  await quantity.fill('2')
  assert.equal(await quantity.inputValue(), '3')
  assert.equal(await page.locator(items).count(), 3)

  page.once('dialog', (dialog) => dialog.accept())
  await quantity.fill('2')
  await page.waitForFunction((selector) => document.querySelectorAll(selector).length === 2, items)
  assert.equal(await operand.inputValue(), '29')
  assert.equal(number(await correction.textContent()), 29 + right)
  await button(page, 'Fermer le mode libre').click()
  assert.equal(number(await correction.textContent()), 29 + right)
  await button(page, 'Mode libre').click()
  assert.equal(await operand.inputValue(), '29')
  assert.equal(number(await correction.textContent()), 29 + right)
}

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL })
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'partial', url: baseURL }])
  const page = await context.newPage()
  page.setDefaultTimeout(15000)
  for (const width of [320, 390, 768, 1024, 1366, 1440, 1920]) {
    await checkLayout(page, width, false)
    console.log(`A4 à ${width} px`)
  }
  for (const width of [390, 1366]) {
    await checkLayout(page, width, true)
    console.log(`Double A5 à ${width} px`)
  }
  await checkAddition(page)
  await context.close()
  console.log('9 parcours de présentation et 1 parcours d’édition testés.')
} finally {
  await browser?.close()
  await server?.close()
  await rm(directory, { recursive: true, force: true })
}
