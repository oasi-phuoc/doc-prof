import assert from 'node:assert/strict'
import test from 'node:test'
import { deployWithBuildSecrets } from '../../api/fiches/deploy.mjs'

function harness({ env = {}, args = [], codes = [] } = {}) {
  const calls = [], logs = []
  return {
    calls, logs,
    run: () => deployWithBuildSecrets({ env, args, log: line => logs.push(line), run: async (command, input) => {
      calls.push({ command, input })
      return codes[calls.length - 1] ?? 0
    } }),
  }
}

await test('les secrets de build sont transmis par stdin avant le déploiement, jamais dans les arguments ou logs', async () => {
  const env = { ACCESS_ADMIN: 'Fixture!été9"=\\ligne', ACCESS_FULL: 'FixtureFull!9', ACCESS_PARTIAL: 'FixturePartial!9' }
  const h = harness({ env })
  assert.equal(await h.run(), 0)
  assert.deepEqual(h.calls.map(call => call.command), [['secret', 'bulk'], ['deploy']])
  assert.deepEqual(JSON.parse(h.calls[0].input), env)
  assert.equal(h.calls[1].input, undefined)
  for (const value of Object.values(env)) {
    assert(!JSON.stringify(h.calls.map(call => call.command)).includes(value))
    assert(!h.logs.join('\n').includes(value))
  }
})

await test('sans variables de build, les secrets existants du Worker sont conservés', async () => {
  const h = harness()
  assert.equal(await h.run(), 0)
  assert.deepEqual(h.calls, [{ command: ['deploy'], input: undefined }])
})

await test('les valeurs absentes ou vides ne sont jamais envoyées comme suppressions', async () => {
  const h = harness({ env: { ACCESS_ADMIN: '', ACCESS_FULL: 'FixtureFull!9', ACCESS_PARTIAL: '   ' } })
  assert.equal(await h.run(), 0)
  assert.deepEqual(JSON.parse(h.calls[0].input), { ACCESS_FULL: 'FixtureFull!9' })
})

await test('les identifiants Cloudflare et les autres variables ne deviennent pas des secrets de l’application', async () => {
  const h = harness({ env: { ACCESS_ADMIN: 'FixtureAdmin!9', CLOUDFLARE_API_TOKEN: 'fixture-management', VITE_ACCESS_ADMIN: 'fixture-client', OTHER_SECRET: 'fixture-other' } })
  assert.equal(await h.run(), 0)
  assert.deepEqual(JSON.parse(h.calls[0].input), { ACCESS_ADMIN: 'FixtureAdmin!9' })
})

await test('une synchronisation refusée bloque le déploiement et conserve le code d’échec', async () => {
  const h = harness({ env: { ACCESS_ADMIN: 'FixtureAdmin!9' }, codes: [17] })
  assert.equal(await h.run(), 17)
  assert.equal(h.calls.length, 1)
})

await test('un échec du déploiement reste un échec de la commande npm', async () => {
  const h = harness({ env: { ACCESS_ADMIN: 'FixtureAdmin!9' }, codes: [0, 23] })
  assert.equal(await h.run(), 23)
})

await test('un dry-run ne tente aucune modification des secrets même si les variables sont fournies', async () => {
  const args = ['--dry-run', '--outdir', '/tmp/fiches-deploy-fixture']
  const h = harness({ env: { ACCESS_ADMIN: 'FixtureAdmin!9' }, args })
  assert.equal(await h.run(), 0)
  assert.deepEqual(h.calls, [{ command: ['deploy', ...args], input: undefined }])
})

await test('une autre cible Wrangler ne modifie pas les secrets du Worker de production', async () => {
  const args = ['--env', 'preview', '--name', 'fixture-preview']
  const h = harness({ env: { ACCESS_ADMIN: 'FixtureAdmin!9' }, args })
  assert.equal(await h.run(), 0)
  assert.deepEqual(h.calls, [{ command: ['deploy', ...args], input: undefined }])
})

await test('un espace ajouté autour du mot de passe est signalé sans divulguer sa valeur', async () => {
  const value = ' FixtureAdmin!9 '
  const h = harness({ env: { ACCESS_ADMIN: value } })
  assert.equal(await h.run(), 1)
  assert.deepEqual(h.calls, [])
  assert(h.logs[0].includes('ACCESS_ADMIN'))
  assert(!h.logs.join('\n').includes(value.trim()))
})
