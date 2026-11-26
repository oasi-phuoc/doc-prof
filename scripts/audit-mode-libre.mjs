import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const output = process.argv[2]
if (!output) throw new Error('Indiquez le dossier de sortie de l’audit.')
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const tree = execFileSync('git', ['rev-parse', 'HEAD^{tree}'], { encoding: 'utf8' }).trim()
const seed = 20261126
const root = await mkdtemp(join(tmpdir(), 'doc-prof-audit-libre-'))
const server = await createServer({
  cacheDir: join(root, 'vite'),
  server: { host: '127.0.0.1', port: 5192, strictPort: true, hmr: false },
})
const base = 'http://127.0.0.1:5192'
const profile = { commit, tree, node: process.version }
let browser

async function auditTypes() {
  const { exerciseTypes, topicById, defaultPage } = await server.ssrLoadModule('/src/math/catalog.ts')
  const { ACCESS_DOMAIN_OPTIONS, domainsForAccount } = await server.ssrLoadModule('/src/access.ts')
  const { generateLogistique } = await server.ssrLoadModule('/src/logistique/generate.ts')
  const { logistiqueTypes } = await server.ssrLoadModule('/src/logistique/catalog.ts')
  const { currentLogistiquePublication } = await server.ssrLoadModule('/src/logistique/approved-banks.ts')
  const access = Object.fromEntries(['admin', 'full', 'partial'].map((role) => [role, domainsForAccount(role)]))
  const rolesFor = (domain) => Object.keys(access).filter((role) => access[role].includes(domain))
  const declared = exerciseTypes.map(({ id, topic }) => ({ id, topic, domain: topicById[topic]?.domain ?? null }))
  const logistics = logistiqueTypes.map(({ id, topic, domain, module, kind }) => {
    const page = { ...defaultPage(domain), domain, topic, exerciseType: id, count: 2 }
    const result = generateLogistique(page, seed)
    return {
      domain, topic, module, kind, id,
      roles: rolesFor(domain),
      status: result.items.length ? 'générable' : 'banque indisponible',
      count: result.items.length,
      layouts: [...new Set(result.items.map((item) => item.layout))],
    }
  })
  const summary = {
    selectableDomainsReferenced: ACCESS_DOMAIN_OPTIONS.length,
    declaredTypes: declared.length,
    logistics: Object.fromEntries(['logistique-cfc', 'logistique-afp'].map((domain) => {
      const rows = logistics.filter((row) => row.domain === domain)
      const active = rows.filter((row) => row.status === 'générable')
      return [domain, { types: rows.length, generable: active.length, unavailable: rows.length - active.length }]
    })),
  }
  return { ...profile, seed, bankRevision: currentLogistiquePublication.revision, summary, access, declared, logistics }
}

const round = (number) => Math.round(number * 100) / 100

async function measure(page) {
  await page.evaluate(() => document.fonts.ready)
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
    return {
      pages: Number(info.match(/^Pages:\s+(\d+)/m)?.[1]),
      sizePoints: info.match(/^Page size:\s+([\d.]+) x ([\d.]+) pts/m)?.slice(1).map(Number) ?? null,
    }
  } catch (error) {
    return { status: 'bloqué', reason: error.code === 'ENOENT' ? 'pdfinfo absent' : error.message }
  }
}

async function auditControls() {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' })
  const cases = [
    { domain: 'Algèbre' },
    { domain: 'Logistique CFC', module: '105 — Marchandises', type: 'Mathématiques' },
    { domain: 'Logistique AFP', module: '105 — Marchandises', type: 'Mathématiques' },
  ]
  const rows = []
  for (const width of [1366, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    try {
      await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
      for (const entry of cases) {
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
          const normal = await measure(page)
          await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
          await page.locator('.side-tool-panel.is-libre').waitFor()
          const libre = await measure(page)
          const frameDelta = libre.frame?.map((value, i) => round(value - normal.frame[i])) ?? null
          const itemCounts = [normal.visibleItems.length, libre.visibleItems.length]
          const sameItems = itemCounts[0] > 0 && JSON.stringify(normal.visibleItems) === JSON.stringify(libre.visibleItems)
          const pdf = await pdfMeasure(page, join(root, 'fiche.pdf'))
          delete normal.visibleItems
          delete libre.visibleItems
          rows.push({ ...entry, width, normal, libre, frameDelta, itemCounts, sameItems, pdf })
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
  return { ...profile, browser: browser.version(), viewportHeight: 900, rows }
}

try {
  await server.listen()
  await mkdir(output, { recursive: true })
  for (const [name, execute] of [['audit-types', auditTypes], ['audit-controles', auditControls]]) {
    const report = await execute()
    await writeFile(join(output, name + '.json'), JSON.stringify(report, null, 2) + '\n')
    console.log(name, report.summary ?? { cases: report.rows.length })
  }
} finally {
  await browser?.close()
  await server.close()
  await rm(root, { recursive: true, force: true })
}
