import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const server = process.env.BASE_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser

const firstNumber = (page) => page.getByRole('group', { name: 'Calcul 1', exact: true })
  .getByRole('textbox', { name: '1ʳᵉ', exact: true })

function storeAccount(id) {
  localStorage.setItem('clairfle-fiche-sync', 'cfu_test-' + id)
  localStorage.setItem('clairfle-personal-session', JSON.stringify({
    expiresAt: Date.now() + 10_000_000,
    user: {
      id,
      givenName: 'Enseignant',
      familyName: 'Témoin',
      email: id + '@example.test',
      account: 'partial',
      domains: ['algèbre', 'géométrie'],
    },
  }))
}

function inspectDrafts({ worksheet, owner }) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open('doc-prof-mode-libre', 1)
    open.onerror = () => reject(open.error)
    open.onsuccess = () => {
      const db = open.result
      if (!db.objectStoreNames.contains('worksheets')) {
        db.close()
        resolve([])
        return
      }
      const read = db.transaction('worksheets', 'readonly').objectStore('worksheets').get([owner, worksheet])
      read.onsuccess = () => {
        db.close()
        resolve(read.result?.revisions.map(({ snapshot, id, parent }) => ({
          id, parent,
          operand: snapshot.revision.pages[0]?.libreItems?.[0]?.a,
          fields: snapshot.fields,
          locked: snapshot.revision.pages[0]?.libreItems?.[0]?.libreLocked,
        })) ?? [])
      }
      read.onerror = () => { db.close(); reject(read.error) }
    }
  })
}

async function waitForDraft(page, worksheet, count, owner = 'alice') {
  // Browser-side storage is asynchronous, including the hook's debounce.
  const deadline = Date.now() + 10_000
  for (;;) {
    const result = await page.evaluate(inspectDrafts, { worksheet, owner })
    if (result.length === count) return result
    if (Date.now() >= deadline) assert.fail(`Attendu ${count} brouillons, reçu ${result.length}`)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

try {
  await server?.listen()
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:' + server.httpServer.address().port
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium' })
  const context = await browser.newContext({ baseURL, viewport: { width: 1366, height: 900 } })
  const page = await context.newPage()
  await page.addInitScript(storeAccount, 'alice')
  await page.goto('/generateur')
  await page.getByRole('button', { name: 'Mode libre', exact: true }).click()
  await firstNumber(page).fill('29')
  await page.getByRole('button', { name: 'Verrou de la question 1', exact: true }).click()
  await firstNumber(page).fill('-')
  await page.getByText('Brouillon conservé sur cet appareil.', { exact: true }).waitFor()
  const identity = await page.evaluate(() => history.state.clairfleLibreDraft)
  const [first] = await waitForDraft(page, identity.worksheet, 1)
  assert.equal(first.operand, 29)
  assert(first.locked)
  assert(Object.values(first.fields).includes('-'))

  await page.reload()
  await page.getByText('Brouillon récupéré.', { exact: true }).waitFor()
  assert.equal(await firstNumber(page).inputValue(), '-')
  assert.equal(await firstNumber(page).getAttribute('data-applied-value'), '29')
  assert.equal(await page.getByRole('button', { name: 'Verrou de la question 1', exact: true }).getAttribute('aria-pressed'), 'true')

  const other = await context.newPage()
  await other.addInitScript((stored) => {
    history.replaceState({ ...history.state, clairfleLibreDraft: stored }, '')
  }, identity)
  await other.goto('/generateur')
  await other.getByText('Brouillon récupéré.', { exact: true }).waitFor()
  assert.equal(await firstNumber(other).inputValue(), '-')
  await firstNumber(page).fill('41')
  await page.getByText('Brouillon conservé sur cet appareil.', { exact: true }).waitFor()
  await firstNumber(other).fill('55')
  await other.getByText('Brouillon conservé sur cet appareil.', { exact: true }).waitFor()
  const branches = await waitForDraft(page, identity.worksheet, 2)
  assert.deepEqual(branches.map(({ operand }) => operand).sort(), [41, 55])
  assert(branches.every(({ parent }) => parent === first.id))

  await other.reload()
  await other.getByText('Plusieurs révisions de cette fiche sont disponibles.', { exact: true }).waitFor()
  await other.getByText('Brouillons sur cet appareil', { exact: true }).click()
  const recover = other.getByRole('button', { name: 'Reprendre', exact: true })
  assert.equal(await recover.count(), 2)
  await recover.first().click()
  await other.getByText('Brouillon récupéré.', { exact: true }).waitFor()
  assert([41, 55].includes(Number(await firstNumber(other).inputValue())))
  assert.equal((await waitForDraft(page, identity.worksheet, 2)).length, 2)

  await page.close()
  await other.evaluate(storeAccount, 'bob')
  await other.reload()
  await other.getByRole('button', { name: 'Domaine', exact: true }).waitFor()
  assert.equal(await other.getByText('Brouillons sur cet appareil', { exact: true }).count(), 0)
  assert.equal(await other.locator('#activity-editor').count(), 0)
  await other.getByRole('button', { name: 'Mode libre', exact: true }).click()
  await firstNumber(other).fill('17')
  await other.getByText('Brouillon conservé sur cet appareil.', { exact: true }).waitFor()
  const bobWorksheet = await other.evaluate(() => history.state.clairfleLibreDraft.worksheet)
  await other.evaluate(() => {
    const put = IDBObjectStore.prototype.put
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === 'worksheets') throw new DOMException('Quota témoin', 'QuotaExceededError')
      return put.apply(this, args)
    }
  })
  await firstNumber(other).fill('84')
  await other.getByText(/Le stockage local est plein/).waitFor()
  assert.equal(await firstNumber(other).inputValue(), '84')
  assert.equal((await waitForDraft(other, bobWorksheet, 1, 'bob'))[0].operand, 17)
  await context.close()
  console.log('Reprise, valeurs transitoires, divergence entre onglets, quota et isolation de compte vérifiés.')
} finally {
  await browser?.close()
  await server?.close()
}
