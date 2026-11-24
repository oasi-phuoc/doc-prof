import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'

const vite = await createServer({ configFile: './vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })
const { tryGenerateLogistiqueBlock } = await vite.ssrLoadModule('/src/logistique/generate.ts')
const { validateLogistiqueBank } = await vite.ssrLoadModule('/src/logistique/validation.ts')

const approvedUnit = (id, level = 'CFC') => ({
  id,
  submoduleCode: '105',
  type: 'verification',
  revision: '1.0.0',
  objectiveIds: ['obj-105-a'],
  difficulty: 'facile',
  bloomLevel: 1,
  eligibleLevels: [level],
  reviewByLevel: { [level]: { status: 'approved', revision: 'review-1' } },
  status: 'approved',
  payload: { kind: 'question', prompt: `Question ${id}`, format: 'qcm', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }] },
  correction: { kind: 'choice', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], correctIds: ['a'] },
  provenance: [{ origin: 'epcas', repository: 'oasi-phuoc/epcas', commit: 'abc123', path: 'src/lib/curriculum.ts', sourceField: 'verification', rights: 'permitted-reuse', resolution: level === 'AFP' ? 'native-afp' : 'native-cfc' }],
  tags: [],
})

const bankWith = (...units) => ({ schemaVersion: 1, revision: 'bank-1', submoduleCode: '105', type: 'verification', units })
const config = (domain, submoduleId, overrides = {}) => ({ domain, submoduleId, type: 'verification', seed: 73, quantity: 1, ...overrides })
const resolverFor = bank => () => bank

test('deterministic bank draws repeat from the same seed and preserve corrections', () => {
  const bank = bankWith(approvedUnit('unit-b'), approvedUnit('unit-a'))
  const config105 = config('logistique-cfc', 'log-cfc-sub-105')
  const first = tryGenerateLogistiqueBlock(config105, resolverFor(bank))
  const second = tryGenerateLogistiqueBlock(config105, resolverFor(bank))
  assert.equal(first.status, 'ready')
  assert.deepEqual(first, second)
  assert.equal(first.snapshot.units[0].correction.correctIds[0], 'a')
  assert.equal(first.available, 2)
})

test('AFP never falls back to CFC review status or CFC-only units', () => {
  const cfcOnly = approvedUnit('cfc-only')
  const shared = { ...approvedUnit('shared'), eligibleLevels: ['AFP', 'CFC'], reviewByLevel: { CFC: { status: 'approved', revision: 'cfc-r1' } } }
  const result = tryGenerateLogistiqueBlock(
    config('logistique-afp', 'log-afp-sub-105'),
    resolverFor(bankWith(cfcOnly, shared)),
  )
  assert.equal(result.status, 'invalid')
  assert.match(result.reason, /validation explicite AFP requise/)
})

test('empty bank does not invent filler questions', () => {
  const result = tryGenerateLogistiqueBlock(config('logistique-cfc', 'log-cfc-sub-105'), resolverFor(bankWith()))
  assert.deepEqual(result, { status: 'empty', reason: 'no-approved-units', available: 0 })
})

test('invalid diploma/submodule target is rejected before bank selection', () => {
  const result = tryGenerateLogistiqueBlock(config('logistique-afp', 'log-afp-sub-805'), resolverFor(bankWith(approvedUnit('unit-a'))))
  assert.equal(result.status, 'invalid')
})

test('bank validation rejects duplicate ids, pending rights, and unreviewed approvals', () => {
  const bad = approvedUnit('duplicate')
  const pending = { ...approvedUnit('pending'), provenance: [{ origin: 'epcas', path: 'curriculum.ts', rights: 'pending' }] }
  const bank = bankWith(bad, { ...bad }, pending)
  assert.ok(validateLogistiqueBank(bank).some(error => error.includes('Identifiant dupliqué')))
  assert.ok(validateLogistiqueBank(bank).some(error => error.includes('droits non résolus')))
})

test('source and difficulty filters report the true available count', () => {
  const one = approvedUnit('original')
  const two = { ...approvedUnit('source'), difficulty: 'avance', provenance: [{ origin: 'original-doc-prof', path: 'editorial/source.ts', rights: 'project-original' }] }
  const result = tryGenerateLogistiqueBlock(
    config('logistique-cfc', 'log-cfc-sub-105', { source: 'nouvelle', difficulty: 'avance' }),
    resolverFor(bankWith(one, two)),
  )
  assert.equal(result.status, 'ready')
  assert.equal(result.available, 1)
  assert.equal(result.snapshot.units[0].id, 'source')
})

test.after(async () => { await vite.close() })
