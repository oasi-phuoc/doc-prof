import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { buildEditorialReport, renderMarkdown } from '../../scripts/logistique/editorial-report.mjs'

const archive = JSON.parse(await readFile(new URL('../../editorial/logistique/source-archive.json', import.meta.url), 'utf8'))
const report = buildEditorialReport(archive)

test('editorial coverage report reconciles all 715 bank slots and keeps approvals evidence-based', () => {
  assert.equal(report.byBank.length, 715)
  assert.equal(report.totals.CFC.bankSlots, 400)
  assert.equal(report.totals.AFP.bankSlots, 315)
  assert.equal(report.totals.CFC.emptySlots + report.totals.AFP.emptySlots, 23)
  assert.equal(report.totals.CFC.uniqueUnits, 2013)
  assert.equal(report.totals.AFP.uniqueUnits, 1589)
  assert.equal(report.totals.CFC.pendingRightsUnits, 2013)
  assert.equal(report.totals.AFP.pendingRightsUnits, 1589)
  assert.equal(report.byBank.reduce((sum, row) => sum + row.approvedUnits, 0), 0)
  assert.ok(report.byBank.every(row => row.responsible === null && row.lastReview === null))
  assert.ok(report.byBank.every(row => row.deficit === null || row.deficit >= 0))
})

test('coverage report does not infer pedagogical approval from imported status or rights', () => {
  const first = Object.values(archive.units)[0]
  const fixture = structuredClone(archive)
  fixture.units[first.id] = {
    ...first,
    status: 'approved',
    reviewByLevel: Object.fromEntries(first.eligibleLevels.map(level => [level, { status: 'approved' }])),
    provenance: first.provenance.map(source => ({ ...source, rights: 'pending' })),
  }
  const revised = buildEditorialReport(fixture)
  const affected = revised.byBank.filter(row => fixture.banks[row.key].unitIds.includes(first.id))
  assert.ok(affected.length > 0)
  assert.ok(affected.every(row => row.approvedUnits === 0))
})

test('markdown report distinguishes empty banks and pending editorial work', () => {
  const markdown = renderMarkdown(report)
  assert.match(markdown, /Rapport d’importation et de couverture/)
  assert.match(markdown, /droits confirmés/)
  assert.match(markdown, /responsable et de dernière revue restent nuls/)
})
