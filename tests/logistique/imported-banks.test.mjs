import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const runtime = JSON.parse(await readFile(new URL('../../src/logistique/imported-banks.json', import.meta.url), 'utf8'))
const archive = JSON.parse(await readFile(new URL('../../editorial/logistique/source-archive.json', import.meta.url), 'utf8'))

const pageForType = {
  theorie: 'theorie',
  maths: 'maths',
  verification: 'verification',
  situation: 'situation',
  glossaire: 'glossaire',
}

function expectedLevel(domain) {
  return domain === 'logistique-afp' ? 'AFP' : 'CFC'
}

test('imports every CFC/AFP source bank into an editorial archive, not the public runtime', () => {
  assert.equal(runtime.source.repository, 'oasi-phuoc/epcas')
  assert.equal(runtime.source.commit, 'ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f')
  assert.equal(runtime.counts.modules, 80)
  assert.equal(runtime.counts.catalogBanks, 715)
  assert.equal(runtime.counts.populatedBanks, 692)
  assert.equal(runtime.counts.uniqueUnits, 2013)
  assert.equal(runtime.counts.approvedUnits, 0)
  assert.equal(runtime.counts.emptyBanks, 23)
  assert.equal(runtime.counts.sourcePagesImported, 540)
  assert.deepEqual(runtime.counts.populatedByType, {
    theorie: 78,
    maths: 310,
    verification: 390,
    situation: 682,
    glossaire: 553,
  })
  assert.deepEqual(runtime.counts.sourcePageCounts, {
    objectifs: 78,
    apercu: 78,
    theorie: 78,
    glossaire: 77,
    situation: 77,
    maths: 76,
    verification: 76,
  })
  assert.equal(Object.keys(runtime.banks).length, 715)
  assert.equal(Object.keys(runtime.units).length, 0)
  assert.equal(Object.keys(archive.sourcePages).length, 563)
  assert.equal(Object.keys(archive.units).length, runtime.counts.uniqueUnits)
  const archivedPrompt = Object.values(archive.units).find(unit => unit.payload.kind === 'source-question')?.payload.promptMarkdown
  assert.ok(archivedPrompt)
  assert.equal(JSON.stringify(runtime).includes(archivedPrompt), false)
  assert.equal(runtime.report.sourcePages.populated, 540)
  assert.deepEqual(archive.report.parsed.structuredCollections, {
    exercises: 3,
    lessonQuestions: 0,
    assessmentQuestions: 0,
    assessments: 0,
  })
  assert.equal(runtime.report.review.quarantineCount, Object.keys(archive.quarantine).length)
  assert.equal(runtime.report.review.duplicateCandidates.length, 0)
  assert.equal(archive.report.review.duplicateCandidates.length, 2)

  for (const [key, publicBank] of Object.entries(runtime.banks)) {
    const [domain, code, type] = key.split(':')
    const sourceBank = archive.banks[key]
    assert.equal(publicBank.submoduleCode, code)
    assert.equal(publicBank.type, type)
    assert.ok(['logistique-cfc', 'logistique-afp'].includes(domain))
    assert.ok(pageForType[type])
    assert.equal(publicBank.sourceUnitCount, sourceBank.unitIds.length)
    assert.deepEqual(publicBank.sourcePageIds, sourceBank.sourcePageIds)
    assert.deepEqual(publicBank.unitIds, [])
    assert.ok(publicBank.sourcePageIds.every(id => archive.sourcePages[id]))

    for (const unitId of sourceBank.unitIds) {
      const unit = archive.units[unitId]
      assert.ok(unit, `Unité éditoriale absente : ${unitId}`)
      assert.equal(unit.submoduleCode, code)
      assert.equal(unit.type, type)
      assert.ok(unit.eligibleLevels.includes(expectedLevel(domain)))
      assert.notEqual(unit.status, 'approved')
      assert.ok(unit.provenance.every(source => source.rights === 'pending'))
      assert.ok(unit.provenance.every(source => source.sourceHash && source.commit))
    }
  }

  for (const duplicate of archive.report.review.duplicateCandidates) {
    for (const id of duplicate.references) {
      assert.ok(archive.units[id].tags.includes('possible-duplicate'))
      assert.ok(archive.units[id].sourceDuplicateCandidates.length > 0)
    }
  }
})

test('keeps shared CFC/AFP material canonical while preserving each bank reference', () => {
  for (const [key, bank] of Object.entries(archive.banks)) {
    const [domain, code, type] = key.split(':')
    if (domain !== 'logistique-cfc') continue
    const afpBank = archive.banks[`logistique-afp:${code}:${type}`]
    if (afpBank) {
      assert.deepEqual(afpBank.unitIds, bank.unitIds)
      assert.equal(afpBank.sourcePageIds.length, bank.sourcePageIds.length)
    }
  }
})
