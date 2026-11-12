import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const audit = read('docs/tcf/pe-dialogue-consignes-20261112.json')
const canonical = (value) => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value
// Python's json.dumps uses a space after separators for the recorded evidence.
const pythonJson = (value) => JSON.stringify(canonical(value)).replace(/("(?:[^"\\]|\\.)*")|([,:])/g, (all, str, sep) => str ?? `${sep} `)
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { tryGenerateTcfBlock } = await vite.ssrLoadModule('/src/tcf/generate.ts')
  const { tcfPeConsigne } = await vite.ssrLoadModule('/src/tcf/consignes.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  assert.equal(audit.count, 50)
  for (const change of audit.changes) {
    const ex = read(change.bank).find((e) => e.id === change.exercise)
    const { consigne, ...unchanged } = ex
    assert.equal(createHash('sha256').update(pythonJson(unchanged)).digest('hex'), change.unchanged_sha256, ex.id)
    assert.equal(consigne, 'Complétez le dialogue.')
    assert.equal(ex.support.situation, change.situation)
    for (const domain of ['tpf', ex.niveau === 'A0-A1' ? 'tcf-csc' : 'tcf-cfr']) {
      const config = { domain, topic: 'tcf-pe', exerciseType: 'tcf-pe-dialogue', difficulty: ex.niveau === 'A0-A1' ? 'facile' : 'moyen', count: 1, columns: 1, pointsPerQuestion: ex.points }
      const current = tryGenerateTcfBlock({ ...config, tcfExercise: ex }, createRng(42))
      const saved = tryGenerateTcfBlock({ ...config, tcfExercise: { ...ex, consigne: change.before } }, createRng(42))
      assert.equal(current.instruction, 'Complétez le dialogue.', ex.id)
      assert.deepEqual(saved, current, `${ex.id}: ancienne fiche`)
      const contexts = current.items.filter((i) => i.tcf?.kind === 'dialogue' && i.tcf.situation)
      assert.equal(contexts.length, 1, ex.id)
      assert.equal(contexts[0].tcf.situation, change.situation)
      assert.equal(current.items.filter((i) => i.tcf?.kind === 'dialogue').length, 4, ex.id)
    }
  }
  const ex = read(audit.changes[0].bank).find((e) => e.id === audit.changes[0].exercise)
  assert.equal(tcfPeConsigne({ ...ex, consigne: 'Complétez le dialogue. Utilisez le vouvoiement.' }), 'Complétez le dialogue. Utilisez le vouvoiement.')
  assert.equal(tcfPeConsigne({ ...ex, consigne: 'Vous êtes à la pharmacie. Complétez le dialogue. Utilisez le vouvoiement.' }), 'Complétez le dialogue. Utilisez le vouvoiement.')
  assert.equal(tcfPeConsigne({ ...ex, consigne: 'Écrivez vos répliques en utilisant le vouvoiement.' }), 'Écrivez vos répliques en utilisant le vouvoiement.')
  const noContext = { ...ex, support: { ...ex.support, situation: '' }, consigne: audit.changes[0].before }
  assert.equal(tcfPeConsigne(noContext), noContext.consigne)
  console.log('50 dialogues PE : consigne unique, contexte détaillé une fois, anciennes recettes TPF/CSC/CFR et quatre échanges conservés.')
} finally { await vite.close() }
