import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const imported = JSON.parse(await readFile(new URL('../../src/logistique/imported-banks.json', import.meta.url), 'utf8'))

const pageForType = {
  theorie: 'theorie',
  maths: 'maths',
  verification: 'verification',
  situation: 'situation',
  glossaire: 'glossaire',
}

test('imports the complete CFC and AFP bank catalogue without promoting source content', () => {
  assert.equal(imported.source.repository, 'oasi-phuoc/epcas')
  assert.equal(imported.source.commit, 'ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f')
  assert.equal(imported.counts.modules, 80)
  assert.equal(imported.counts.catalogBanks, 715)
  assert.equal(imported.counts.populatedBanks, 692)
  assert.equal(imported.counts.uniqueUnits, 384)
  assert.equal(imported.counts.emptyBanks, 23)
  assert.equal(imported.counts.sourcePagesImported, 540)
  assert.deepEqual(imported.counts.populatedByType, {
    theorie: 78,
    maths: 76,
    verification: 76,
    situation: 77,
    glossaire: 77,
  })
  assert.deepEqual(imported.counts.sourcePageCounts, {
    objectifs: 78,
    apercu: 78,
    theorie: 78,
    glossaire: 77,
    situation: 77,
    maths: 76,
    verification: 76,
  })
  const theoryUnits = Object.values(imported.units).filter(unit => unit.type === 'theorie')
  assert.equal(theoryUnits.length, 78)
  assert.ok(theoryUnits.every(unit => unit.payload.objectivesMarkdown || unit.payload.objectivesSummaryMarkdown || unit.payload.overviewMarkdown || unit.payload.overviewSummaryMarkdown))

  for (const [key, bank] of Object.entries(imported.banks)) {
    const [domain, code, type] = key.split(':')
    assert.equal(bank.submoduleCode, code)
    assert.equal(bank.type, type)
    assert.ok(['logistique-cfc', 'logistique-afp'].includes(domain))
    assert.ok(pageForType[type])
    for (const unitId of bank.unitIds) {
      const unit = imported.units[unitId]
      assert.ok(unit, `Unité absente : ${unitId}`)
      assert.equal(unit.submoduleCode, code)
      assert.equal(unit.type, type)
      assert.equal(unit.payload.kind, 'source-document')
      assert.equal(unit.payload.sourceSlug, pageForType[type])
      assert.ok([unit.payload.fullMarkdown, unit.payload.summaryMarkdown, unit.payload.objectivesMarkdown, unit.payload.overviewMarkdown].some(content => content?.trim()))
      assert.equal(unit.status, 'imported-unreviewed')
      assert.equal(unit.provenance.every(source => source.rights === 'pending'), true)
      assert.ok(unit.eligibleLevels.includes(domain === 'logistique-afp' ? 'AFP' : 'CFC'))
    }
  }
})

test('stores shared AFP/CFC source units once and references them from both catalogues', () => {
  for (const [key, bank] of Object.entries(imported.banks)) {
    const [domain, code, type] = key.split(':')
    if (domain !== 'logistique-cfc') continue
    const afpBank = imported.banks[`logistique-afp:${code}:${type}`]
    if (afpBank) assert.deepEqual(afpBank.unitIds, bank.unitIds)
  }
})
