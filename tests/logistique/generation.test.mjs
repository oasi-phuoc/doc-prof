import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'

const require = createRequire(import.meta.url)
const fixture = require('./fixture.json')
const { load, root } = require('../../scripts/gattegno-loader.cjs')
const catalog = load(root + '/src/logistique/catalog.ts')
const { generateLogistique, logistiqueDocumentTitle } = load(root + '/src/logistique/generate.ts')
const { freezeLogistiquePages, validLogistiquePages } = load(root + '/src/logistique/recipe.ts')
const { currentLogistiquePublication } = load(root + '/src/logistique/approved-banks.ts')

function config(diploma, module, kind) {
  const tag = diploma.toLowerCase()
  return {
    domain: 'logistique-' + tag,
    topic: `log-${tag}-theme-${module[0]}00`,
    exerciseType: `log-${tag}-${module}-${kind}`,
    count: 1,
    columns: 1,
  }
}

test('le catalogue reproduit les 143 sous-thèmes et les 715 types EPCAS', () => {
  for (const [diploma, themes, modules] of [['CFC', 9, 80], ['AFP', 7, 63]]) {
    const domain = 'logistique-' + diploma.toLowerCase()
    const topics = catalog.logistiqueTopics.filter((topic) => topic.domain === domain)
    const subthemes = topics.flatMap((topic) => catalog.logistiqueSubthemes(topic.id))
    assert.equal(topics.length, themes)
    assert.equal(subthemes.length, modules)
    for (const subtheme of subthemes) {
      const first = catalog.logistiqueTypeForSubtheme(subtheme.id, '')
      assert.deepEqual(catalog.logistiqueTypeChoices(subtheme.topic, first.id).map((type) => type.kind),
        ['theorie', 'maths', 'verification', 'situation', 'glossaire'])
    }
  }
  assert.equal(new Set(catalog.logistiqueTypes.map((type) => type.id)).size, 715)
  for (const code of ['501', '506', '604', '612', '702', '705', '805', '807', '901', '902']) {
    assert.equal(catalog.logistiqueType(`log-afp-${code}-theorie`), undefined)
  }
})

test('le tirage est déterministe et limité aux unités approuvées pour le diplôme', () => {
  const maths = config('AFP', '105', 'maths')
  const result = generateLogistique({ ...maths, count: 9 }, 109, [...fixture.units, ...fixture.units])
  assert.deepEqual(result, generateLogistique(maths, 109, fixture.units))
  assert.equal(result.bankQuestionCap, 1)
  assert.match(result.items[0].calcAnswer, /42 kg/)
  assert.equal(result.items[0].responseAnswer, 'Le poids total est de 42 kg.')
  assert.deepEqual(generateLogistique(config('AFP', '105', 'verification'), 109, fixture.units).items, [])
  assert.equal(generateLogistique(config('CFC', '105', 'verification'), 109, fixture.units).items.length, 1)
  assert.deepEqual(generateLogistique(config('AFP', '100', 'maths'), 109).items, [], 'les modules à compléter restent vides')
  assert.equal(generateLogistique(maths, 109).bankQuestionCap, 2)
  assert.deepEqual(generateLogistique({ ...maths, domain: 'logistique-cfc' }, 109, fixture.units).items, [])
})

test('les titres et les recettes conservent les modules, le diplôme et la révision', () => {
  const a = config('CFC', '105', 'maths')
  const b = config('CFC', '101', 'verification')
  assert.equal(logistiqueDocumentTitle([a]), 'Mathématiques : module 105')
  assert.equal(logistiqueDocumentTitle([a, b], true), 'Évaluation : modules 101 et 105')
  assert.equal(logistiqueDocumentTitle([config('AFP', '105', 'glossaire')]), 'Glossaire : module 105')
  const pages = freezeLogistiquePages([{ ...a, extraBlocks: [b] }])
  assert.equal(pages[0].logistiqueBankRevision, currentLogistiquePublication.revision)
  assert.equal(pages[0].extraBlocks[0].logistiqueBankRevision, currentLogistiquePublication.revision)
  assert.equal(validLogistiquePages(pages), true)
  assert.equal(validLogistiquePages([a, config('AFP', '105', 'maths')]), false)
  assert.equal(validLogistiquePages([config('AFP', '902', 'theorie')]), false)
  assert.equal(validLogistiquePages([{ ...a, extraBlocks: [null] }]), false)
  assert.equal(validLogistiquePages([{ ...a, logistiqueBankRevision: 'inconnue' }]), false)
})
