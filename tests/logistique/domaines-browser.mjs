import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const base = process.env.LOGISTIQUE_TEST_URL ?? 'http://127.0.0.1:5187'
const output = process.env.LOGISTIQUE_PROOF_DIR ?? '/tmp/doc-prof-logistique-proofs'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] })
const reports = [], errors = []

async function chooseDomain(page, label) {
  await page.getByRole('button', { name: 'Domaine', exact: true }).click()
  await page.getByRole('option', { name: label, exact: true }).click()
}

try {
  for (const width of [1366, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${base}/generateur`)
    await page.locator('.worksheet-sheet').first().waitFor({ timeout: 120000 })
    const original = await page.locator('.worksheet-sheet').first().textContent()

    for (const label of ['Logistique CFC', 'Logistique AFP']) {
      await chooseDomain(page, label)
      await page.getByRole('heading', { name: /^(CFC|AFP) ·/ }).waitFor()
      const logo = page.locator('.brand').getByRole('img', { name: 'EPCA', exact: true })
      await logo.waitFor()
      await page.waitForFunction(() => document.querySelector('.brand img')?.naturalWidth > 0)
      assert.equal(await page.locator('.worksheet-sheet').count(), 0, 'Aucune fiche précédente affichée ou imprimable en logistique')
      assert.equal(await page.getByRole('button', { name: 'Jouer cette fiche', exact: true }).count(), 0)
      assert.match(await page.getByRole('status').textContent(), /banques de contenus ne sont pas encore raccordées/)
      assert.equal(await page.getByRole('button', { name: 'Théorie À importer' }).count(), 1)
      await page.getByRole('button', { name: 'Mathématiques À importer' }).click()
      await page.getByRole('heading', { name: 'Réglages · Mathématiques' }).waitFor()
      assert.equal(await page.getByRole('spinbutton', { name: 'Nombre de problèmes' }).inputValue(), '6')
      const expectedSubmodules = label.endsWith('CFC') ? '80' : '63'
      assert.match(await page.locator('.logistique-catalog-count').textContent(), new RegExp(`${expectedSubmodules} sous-thèmes`))
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label} déborde à ${width}px`)
      await page.screenshot({ path: `${output}/${width}-${label.endsWith('CFC') ? 'cfc' : 'afp'}.png`, fullPage: true })
    }

    await chooseDomain(page, 'Algèbre')
    await page.locator('.worksheet-sheet').first().waitFor()
    assert.equal(await page.locator('.worksheet-sheet').first().textContent(), original, 'Retour à la même fiche, sans tirage ni modification')
    assert.equal(await page.locator('.brand img[alt="EPCA"]').count(), 0)
    assert.equal((await page.locator('.brand').textContent()).trim(), 'ClairFLE')
    reports.push({ width, domains: ['logistique-cfc', 'logistique-afp'], epcaLoaded: true, typeSettingsInteractive: true, worksheetPreserved: true, clairfleRestored: true, noOverflow: true })
    await context.close()
  }
  assert.deepEqual(errors, [])
  await writeFile(`${output}/result.json`, JSON.stringify({ passed: true, reports, errors }, null, 2) + '\n')
  console.log(JSON.stringify({ passed: true, reports, errors }))
} finally {
  await browser.close()
}
