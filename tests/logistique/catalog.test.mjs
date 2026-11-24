import test from 'node:test'
import assert from 'node:assert/strict'
import curriculum from '../../src/logistique/curriculum.json' with { type: 'json' }

const cfcOnlyCodes = new Set(['501', '502', '503', '504', '505', '506', '604', '612', '702', '703', '704', '705', '805', '806', '807', '901', '902'])

function modulesFor(level) {
  return curriculum.modules.filter((module) => module.eligibleLevels.includes(level))
}

test('catalogue source pinned to the reviewed EPCAS revision', () => {
  assert.equal(curriculum.source.repository, 'oasi-phuoc/epcas')
  assert.equal(curriculum.source.commit, 'ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f')
})

test('catalogue contains 80 CFC and 63 AFP submodules without inventing reserved codes', () => {
  const cfc = modulesFor('CFC')
  const afp = modulesFor('AFP')
  assert.equal(cfc.length, 80)
  assert.equal(afp.length, 63)
  assert.deepEqual(afp.filter((module) => cfcOnlyCodes.has(module.code)), [])
  assert.equal(new Set(cfc.map((module) => module.code)).size, 80)
})

test('diploma-specific default years stay within the approved range', () => {
  for (const module of modulesFor('CFC')) {
    assert.ok([1, 2, 3].includes(module.years.CFC), `CFC year missing for ${module.code}`)
  }
  for (const module of modulesFor('AFP')) {
    assert.ok([1, 2].includes(module.years.AFP), `AFP year invalid for ${module.code}`)
  }
})

test('AFP keeps the common ICT knowledge modules but excludes Office practice modules', () => {
  const afpCodes = new Set(modulesFor('AFP').map((module) => module.code))
  for (const code of ['801', '802', '803', '804', '808', '809']) assert.ok(afpCodes.has(code))
  for (const code of ['805', '806', '807']) assert.ok(!afpCodes.has(code))
})
