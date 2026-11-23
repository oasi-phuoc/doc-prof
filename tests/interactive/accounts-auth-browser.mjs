import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5196'
const endpoint = '/__accounts_auth_api'
const server = await createServer({
  cacheDir: '/tmp/accounts-auth-vite',
  server: { host: '127.0.0.1', port: 5196, strictPort: true },
  define: { 'import.meta.env.VITE_FICHES_API_URL': JSON.stringify(endpoint) },
})
await server.listen()
let browser
const errors = []
try {
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] })
  async function openAccounts({ password, account = 'admin', handle }) {
    const context = await browser.newContext()
    await context.addCookies([{ name: 'clairfle-fiche-access', value: account, url: base }])
    if (password) await context.addInitScript(value => localStorage.setItem('clairfle-fiche-sync', value), password)
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.route(`**${endpoint}/users`, handle)
    await page.goto(`${base}/comptes`)
    await page.getByRole('heading', { name: 'Comptes enseignants', exact: true }).waitFor({ timeout: 120000 })
    return { context, page }
  }
  async function unlock(page, password) {
    const form = page.getByRole('form', { name: 'Accéder aux comptes enseignants' })
    await form.getByLabel('Mot de passe administrateur', { exact: true }).fill(password)
    await form.getByRole('button', { name: 'Accéder aux comptes', exact: true }).click()
  }
  async function creationForm(page) {
    const form = page.getByRole('form', { name: 'Créer un compte enseignant' })
    await form.getByRole('button', { name: 'Créer le compte', exact: true }).waitFor()
    await form.getByLabel('Prénom', { exact: true }).waitFor({ state: 'visible' })
    await page.waitForFunction(() => !document.querySelector('form[aria-label="Créer un compte enseignant"] fieldset')?.disabled)
    return form
  }

  await test('admin sans mot de passe mémorisé : ressaisie puis chargement sans quitter la page', async () => {
    const requests = []
    const { context, page } = await openAccounts({ handle: async route => {
      requests.push(route.request().headers().authorization)
      await route.fulfill({ json: { users: [] } })
    } })
    try {
      await page.getByRole('form', { name: 'Accéder aux comptes enseignants' }).waitFor()
      assert.equal(requests.length, 0)
      assert.equal(await page.getByRole('form', { name: 'Créer un compte enseignant' }).count(), 0)
      await unlock(page, 'fixture-admin')
      await creationForm(page)
      assert.deepEqual(requests, ['Bearer fixture-admin'])
      assert.equal(new URL(page.url()).pathname, '/comptes')
      assert.equal(await page.getByLabel('Mot de passe administrateur', { exact: true }).count(), 0)
    } finally { await context.close() }
  })

  await test('401 au chargement : suppression du mot de passe refusé et nouvelle tentative contrôlée par le serveur', async () => {
    const { context, page } = await openAccounts({ password: 'fixture-refused', handle: async route => {
      const accepted = route.request().headers().authorization === 'Bearer fixture-admin'
      await route.fulfill({ status: accepted ? 200 : 401, json: accepted ? { users: [] } : { error: 'Refusé' } })
    } })
    try {
      await page.getByRole('form', { name: 'Accéder aux comptes enseignants' }).waitFor()
      assert.equal(await page.evaluate(() => localStorage.getItem('clairfle-fiche-sync')), null)
      await unlock(page, 'fixture-wrong-again')
      await page.getByRole('form', { name: 'Accéder aux comptes enseignants' }).waitFor()
      await page.getByRole('alert').filter({ hasText: 'pas reconnu' }).waitFor()
      assert.equal(await page.getByLabel('Mot de passe administrateur', { exact: true }).inputValue(), '')
      assert.equal(await page.evaluate(() => localStorage.getItem('clairfle-fiche-sync')), null)
      await unlock(page, 'fixture-admin')
      await creationForm(page)
      assert.equal(await page.getByRole('alert').count(), 0)
    } finally { await context.close() }
  })

  await test('401 pendant la création : formulaire conservé et aucune création rejouée automatiquement', async () => {
    let postCount = 0
    const { context, page } = await openAccounts({ password: 'fixture-admin', handle: async route => {
      if (route.request().method() !== 'POST') return route.fulfill({ json: { users: [] } })
      postCount++
      if (postCount === 1) return route.fulfill({ status: 401, json: { error: 'Refusé' } })
      assert.equal(route.request().headers().authorization, 'Bearer fixture-admin-renewed')
      const body = route.request().postDataJSON()
      return route.fulfill({ status: 201, json: { user: {
        id: '22222222-2222-4222-8222-222222222222', ...body, password: undefined, active: true,
      } } })
    } })
    try {
      let form = await creationForm(page)
      await form.getByLabel('Prénom', { exact: true }).fill('Noémie')
      await form.getByLabel('Nom', { exact: true }).fill('Exemple')
      await form.getByLabel('Adresse e-mail professionnelle').fill('noemie.exemple@admin.vs.ch')
      await form.getByLabel('Mot de passe du compte', { exact: true }).fill('Teacher!88')
      await form.getByLabel('Confirmer le mot de passe').fill('Teacher!88')
      await form.getByLabel('Vocabulaire', { exact: true }).check()
      await form.getByRole('button', { name: 'Créer le compte', exact: true }).click()
      await page.getByRole('form', { name: 'Accéder aux comptes enseignants' }).waitFor()
      assert.equal(postCount, 1)
      await unlock(page, 'fixture-admin-renewed')
      form = await creationForm(page)
      assert.equal(postCount, 1)
      assert.equal(await form.getByLabel('Prénom', { exact: true }).inputValue(), 'Noémie')
      assert.equal(await form.getByLabel('Adresse e-mail professionnelle').inputValue(), 'noemie.exemple@admin.vs.ch')
      assert(await form.getByLabel('Vocabulaire', { exact: true }).isChecked())
      assert.equal(await form.getByLabel('Mot de passe du compte', { exact: true }).inputValue(), 'Teacher!88')
      assert.equal(await page.evaluate(() => Object.values(localStorage).some(value => value.includes('Teacher!88'))), false)
      await form.getByRole('button', { name: 'Créer le compte', exact: true }).click()
      await page.getByRole('status').filter({ hasText: 'Compte créé pour Noémie' }).waitFor()
      assert.equal(postCount, 2)
      assert.equal(await form.getByLabel('Mot de passe du compte', { exact: true }).inputValue(), '')
    } finally { await context.close() }
  })

  await test('compte non administrateur : aucune invitation à gérer les comptes', async () => {
    const context = await browser.newContext()
    try {
      await context.addCookies([{ name: 'clairfle-fiche-access', value: 'partial', url: base }])
      const page = await context.newPage()
      await page.goto(`${base}/comptes`)
      await page.getByRole('alert').filter({ hasText: 'réservé à l’administrateur' }).waitFor({ timeout: 120000 })
      assert.equal(await page.getByRole('form', { name: 'Accéder aux comptes enseignants' }).count(), 0)
      assert.equal(await page.getByRole('form', { name: 'Créer un compte enseignant' }).count(), 0)
    } finally { await context.close() }
  })
  assert.deepEqual(errors, [])
} finally {
  await browser?.close()
  await server.close()
}
