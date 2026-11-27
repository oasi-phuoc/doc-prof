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
const { splitLogistiquePages } = load(root + '/src/logistique/pagination.ts')

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

test('le catalogue propose les six types dans les 143 sous-thèmes autorisés', () => {
  for (const [diploma, themes, modules] of [['CFC', 9, 80], ['AFP', 7, 63]]) {
    const domain = 'logistique-' + diploma.toLowerCase()
    const topics = catalog.logistiqueTopics.filter((topic) => topic.domain === domain)
    const subthemes = topics.flatMap((topic) => catalog.logistiqueSubthemes(topic.id))
    assert.equal(topics.length, themes)
    assert.equal(subthemes.length, modules)
    for (const subtheme of subthemes) {
      const first = catalog.logistiqueTypeForSubtheme(subtheme.id, '')
      assert.deepEqual(catalog.logistiqueTypeChoices(subtheme.topic, first.id).map((type) => type.kind),
        ['objectifs-apercu', 'theorie', 'maths', 'verification', 'situation', 'glossaire'])
    }
  }
  assert.equal(new Set(catalog.logistiqueTypes.map((type) => type.id)).size, 858)
  for (const code of ['501', '506', '604', '612', '702', '705', '805', '807', '901', '902']) {
    assert.equal(catalog.logistiqueType(`log-afp-${code}-theorie`), undefined)
  }
})

test('les références actives séparent objectifs, aperçu et théorie illustrée sans modifier les anciennes recettes', () => {
  for (const type of catalog.logistiqueTypes.filter(({ kind }) => kind === 'theorie')) {
    const theoryPage = config(type.diploma, type.module, type.kind)
    const introPage = config(type.diploma, type.module, 'objectifs-apercu')
    const theory = generateLogistique(theoryPage, 7).items.map((item) => item.theoryBlock)
    const intro = generateLogistique(introPage, 7).items.map((item) => item.theoryBlock)
    assert.equal(Boolean(theory.length), Boolean(intro.length), type.id)
    if (!theory.length) continue
    assert.equal(validLogistiquePages(freezeLogistiquePages([introPage])), true, type.id)
    assert(intro.some((block) => block.kind === 'heading' && /^Objectifs/.test(block.text)), type.id)
    assert(intro.some((block) => block.kind === 'heading' && /^Aperçu/.test(block.text)), type.id)
    assert.doesNotMatch(JSON.stringify(intro), /EnterSite|ASFL|SVBL|"text":"Source"/i, type.id)
    assert(!theory.some((block) => block.kind === 'heading' && /^(?:Objectifs du module|Aperçu)/.test(block.text)), type.id)
    assert(theory.filter((block) => block.kind === 'image').length >= 2, type.id)
  }
  const historical = { ...config('AFP', '105', 'theorie'), logistiqueBankRevision: 'logistique-105-v001' }
  assert.equal(freezeLogistiquePages([historical])[0].logistiqueBankRevision, historical.logistiqueBankRevision)
  assert.equal(generateLogistique(historical, 7).items.length, 98)
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
  assert.deepEqual(generateLogistique({
    ...config('AFP', '100', 'maths'), logistiqueBankRevision: 'logistique-initiale',
  }, 109).items, [], 'une révision sans banque ne produit pas d’exercice')
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

test('les questions restent dans l’ordre et partagent les pages sauf saut manuel', () => {
  const items = generateLogistique({ ...config('CFC', '110', 'maths'), count: 6 }, 20261126).items
  const block = { title: 'Exercice 1', items, exerciseIndex: 1, exerciseType: 'log-cfc-110-maths' }
  const sheets = splitLogistiquePages({ blocks: [block], items })
  assert.deepEqual(sheets.flatMap((sheet) => sheet.items), items)
  assert(sheets.every((sheet) => sheet.items.length > 1))
  assert.deepEqual(sheets.map((sheet) => sheet.blocks[0].itemOffset), [0, 2, 4])
  const withBreak = splitLogistiquePages({ blocks: [{ ...block, tcfPageBreakAfter: [true] }], items })
  assert.deepEqual(withBreak[0].items, items.slice(0, 1))
  assert.deepEqual(withBreak.flatMap((sheet) => sheet.items), items)
})

test('les problèmes courts gardent chacun la place de leur grille et de la réponse', () => {
  const items = Array.from({ length: 6 }, () => ({ layout: 'text', prompt: 'Calculez 2 + 3.', answer: '5', calcAnswer: '2 + 3 = 5' }))
  const block = { title: 'Exercice 1', items, exerciseIndex: 1, exerciseType: 'log-cfc-302-maths' }
  const pages = splitLogistiquePages({ blocks: [block], items })
  assert.deepEqual(pages.map((page) => page.items.length), [2, 2, 2])
})
