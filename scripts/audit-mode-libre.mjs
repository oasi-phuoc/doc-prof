import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { auditTypes } from './audit-mode-libre-types.mjs'
import { auditRecipes } from './audit-mode-libre-recipes.mjs'

const [, , output, section] = process.argv
const sections = ['types', 'recettes', 'controles']
if (!output || (section && !sections.includes(section))) {
  throw new Error('Usage : node scripts/audit-mode-libre.mjs <dossier de sortie> [types|recettes|controles]')
}
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const tree = execFileSync('git', ['rev-parse', 'HEAD^{tree}'], { encoding: 'utf8' }).trim()
const seed = 20261126
const root = await mkdtemp(join(tmpdir(), 'doc-prof-audit-libre-'))
const server = await createServer({
  cacheDir: join(root, 'vite'),
  server: { host: '127.0.0.1', port: 0, strictPort: true, hmr: false },
})
let base
const profile = {
  commit, tree, node: process.version,
  vite: JSON.parse(await readFile(new URL('../node_modules/vite/package.json', import.meta.url), 'utf8')).version,
}
let browser

const round = (number) => Math.round(number * 100) / 100
const previewItems = '.a4-frame .worksheet-sheet .exercise-item'

async function measure(page) {
  await page.evaluate(async () => { await document.fonts.ready })
  return page.evaluate(() => {
    function dimensions(selector) {
      const element = document.querySelector(selector)
      if (!element) return null
      const { width, height } = element.getBoundingClientRect()
      return [width, height].map((value) => Math.round(value * 100) / 100)
    }
    function controls(selector) {
      const panel = document.querySelector(selector)
      if (!panel) return []
      return [...panel.querySelectorAll('button, input, textarea, select')]
        .filter((element) => element.getClientRects().length)
        .map((element) => ({
          element: element.tagName.toLowerCase(),
          label: (element.getAttribute('aria-label') || element.getAttribute('title') ||
            element.labels?.[0]?.textContent || element.textContent || '').trim().replace(/\s+/g, ' '),
          disabled: element.disabled || element.getAttribute('aria-disabled') === 'true',
        }))
    }
    return {
      frame: dimensions('.a4-frame'),
      scale: document.querySelector('.a4-frame .worksheet-sheet')?.getBoundingClientRect().width /
        document.querySelector('.a4-frame .worksheet-sheet')?.offsetWidth || null,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      loadedFonts: [...document.fonts].filter(({ status }) => status === 'loaded').map(({ family }) => family),
      missingImages: [...document.querySelectorAll('.a4-frame img')]
        .filter((img) => !img.complete || !img.naturalWidth)
        .map((img) => new URL(img.src).pathname),
      sheet: dimensions('.a4-frame .worksheet-sheet'),
      settings: controls('.settings-panel'),
      libre: controls('.side-tool-panel.is-libre'),
      settingsPanels: document.querySelectorAll('.settings-panel').length,
      librePanels: document.querySelectorAll('.side-tool-panel.is-libre').length,
      visibleItems: [...document.querySelectorAll('.a4-frame .worksheet-sheet .exercise-item')]
        .map((element) => (element.textContent ?? '').trim()),
    }
  })
}

async function pdfMeasure(page, path) {
  await page.pdf({ path, preferCSSPageSize: true })
  try {
    const info = execFileSync('pdfinfo', [path], { encoding: 'utf8' })
    const text = execFileSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8' })
    const normalizedText = text.replace(/[^\S\f]+/g, ' ').trim()
    const textHash = createHash('sha256').update(normalizedText).digest('hex')
    return {
      pages: Number(info.match(/^Pages:\s+(\d+)/m)?.[1]),
      textHash,
      sizePoints: info.match(/^Page size:\s+([\d.]+) x ([\d.]+) pts/m)?.slice(1).map(Number) ?? null,
    }
  } catch (error) {
    return { status: 'bloqué', reason: error.code === 'ENOENT' ? 'outils Poppler absents' : error.message }
  }
}

async function auditAdditionControls(page) {
  const rows = []
  const quantity = page.getByRole('spinbutton', { name: 'Nombre de questions', exact: true })
  const items = page.locator(previewItems)
  async function changeQuantity() {
    const observations = []
    for (const value of [2, 3]) {
      await quantity.fill(String(value))
      observations.push({ value, renderedItems: await items.count() })
    }
    return observations
  }

  const normal = await changeQuantity()
  await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
  const libre = await changeQuantity()
  rows.push({
    control: 'Nombre de questions',
    normal,
    libre,
    status: [...normal, ...libre].every(({ value, renderedItems }) => value === renderedItems) ? 'réussi' : 'échoué',
  })
  rows.push({
    control: 'Audio',
    status: await page.locator('.workspace').getByRole('button', { name: 'Audio', exact: true }).count() === 0
      ? 'réussi' : 'échoué',
    expected: 'absent pour une addition',
  })

  const calculation = page.getByRole('group', { name: 'Calcul 1', exact: true })
  const operand = calculation.getByRole('textbox', { name: '1ʳᵉ', exact: true })
  const other = Number(await calculation.getByRole('textbox', { name: '2ᵉ', exact: true }).inputValue())
  await page.getByRole('button', { name: 'Fiche élève (cliquer pour corrigé)', exact: true }).click()
  const observations = []
  for (const value of [17, 29]) {
    await operand.fill(String(value))
    const beforeCommit = (await items.first().innerText()).replace(/\s/g, '')
    await operand.press('Tab')
    const afterCommit = (await items.first().innerText()).replace(/\s/g, '')
    observations.push({ value, other, expected: `${value}+${other}=${value + other}`, beforeCommit, afterCommit })
  }
  rows.push({
    control: 'Premier opérande et corrigé',
    status: observations.every(({ expected, beforeCommit, afterCommit }) =>
      beforeCommit.includes(expected) && afterCommit.includes(expected)) ? 'réussi' : 'échoué',
    observations,
  })
  return rows
}

async function auditControls() {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' })
  const cases = [
    { domain: 'Algèbre' },
    { domain: 'Logistique CFC', module: '105 — Marchandises', type: 'Mathématiques' },
    { domain: 'Logistique AFP', module: '105 — Marchandises', type: 'Mathématiques' },
  ]
  const rows = []
  let effects = []
  for (const width of [320, 390, 768, 1024, 1366, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    try {
      await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
      const variants = width === 1366 || width === 390
        ? [...cases, { domain: 'Algèbre', format: 'a5-double-landscape' }]
        : cases.slice(0, 1)
      for (const entry of variants) {
        const page = await context.newPage()
        page.setDefaultTimeout(20000)
        try {
          await page.goto(base + '/generateur')
          await page.locator('.a4-frame .worksheet-sheet').first().waitFor()
          async function select(label, choice) {
            await page.getByRole('button', { name: label, exact: true }).click()
            await page.getByRole('option', { name: choice, exact: true }).click()
          }
          await select('Domaine', entry.domain)
          if (entry.module) await select('Sous-thème', entry.module)
          if (entry.type) await select('Type d’exercice', entry.type)
          if (entry.format === 'a5-double-landscape') {
            const settings = page.getByRole('button', { name: 'Paramètres', exact: true })
            await settings.click()
            await page.getByRole('radio', { name: /Paysage — double A5/ }).click()
            await settings.click()
          }
          await page.locator('.a4-frame .worksheet-sheet').first().waitFor()
          const normal = await measure(page)
          const normalPdf = await pdfMeasure(page, join(root, 'normal.pdf'))
          await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
          await page.locator('.side-tool-panel.is-libre').waitFor()
          const editor = await measure(page)
          const showPreview = page.getByRole('button', { name: 'Aperçu', exact: true })
          if (await showPreview.isVisible()) await showPreview.click()
          const libre = { ...await measure(page), libre: editor.libre }
          const frameDelta = libre.frame?.map((value, i) => round(value - normal.frame[i])) ?? null
          const itemCounts = [normal.visibleItems.length, libre.visibleItems.length]
          const sameItems = itemCounts[0] > 0 && JSON.stringify(normal.visibleItems) === JSON.stringify(libre.visibleItems)
          const librePdf = await pdfMeasure(page, join(root, 'libre.pdf'))
          const samePdf = normalPdf.textHash && librePdf.textHash
            ? normalPdf.textHash === librePdf.textHash && normalPdf.pages === librePdf.pages &&
              JSON.stringify(normalPdf.sizePoints) === JSON.stringify(librePdf.sizePoints)
            : null
          const showEditor = page.getByRole('button', { name: 'Édition', exact: true })
          if (await showEditor.isVisible()) await showEditor.click()
          await page.getByRole('button', { name: 'Fermer le mode libre', exact: true }).click()
          await page.locator('.side-tool-panel.is-libre').waitFor({ state: 'detached' })
          const closed = await measure(page)
          const sameAfterClose = JSON.stringify(normal.visibleItems) === JSON.stringify(closed.visibleItems)
          if (width === 1366 && entry.domain === 'Algèbre' && !entry.format) {
            try {
              effects = await auditAdditionControls(page)
            } catch (error) {
              effects = [{ status: 'bloqué', reason: error.message }]
            }
          }
          delete normal.visibleItems
          delete libre.visibleItems
          rows.push({
            ...entry, width, normal, libre, frameDelta, itemCounts, sameItems, sameAfterClose,
            normalPdf, librePdf, samePdf,
          })
        } catch (error) {
          rows.push({ ...entry, width, status: 'bloqué', reason: error.message })
        } finally {
          await page.close()
        }
      }
    } finally {
      await context.close()
    }
  }
  return { ...profile, browser: browser.version(), viewportHeight: 900, rows, effects }
}

try {
  await server.listen()
  base = `http://127.0.0.1:${server.httpServer.address().port}`
  await mkdir(output, { recursive: true })
  const reports = [
    ['audit-types', () => auditTypes(server, profile, seed)],
    ['audit-recettes', () => auditRecipes(server, profile, seed)],
    ['audit-controles', auditControls],
  ]
  for (const [name, execute] of reports) {
    if (section && name !== 'audit-' + section) continue
    const report = await execute()
    await writeFile(join(output, name + '.json'), JSON.stringify(report, null, 2) + '\n')
    console.log(name, report.summary ?? { cases: report.rows.length })
  }
} finally {
  await browser?.close()
  await server.close()
  await rm(root, { recursive: true, force: true })
}
