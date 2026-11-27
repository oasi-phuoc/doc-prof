import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'

const require = createRequire(import.meta.url)
const fixture = require('./fixture.json')
const { load, root } = require('../../scripts/gattegno-loader.cjs')
const catalog = load(root + '/src/logistique/catalog.ts')
const { generateLogistique, logistiqueDocumentTitle, logistiqueHasSummary } = load(root + '/src/logistique/generate.ts')
const { freezeLogistiquePages, validLogistiquePages } = load(root + '/src/logistique/recipe.ts')
const { currentLogistiquePublication, logistiquePublications } = load(root + '/src/logistique/approved-banks.ts')
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

test('les 858 types des modules CFC et AFP disposent de contenu à générer', () => {
  for (const type of catalog.logistiqueTypes) {
    const page = config(type.diploma, type.module, type.kind)
    assert(generateLogistique(page, 20261127).items.length > 0, type.id)
  }
})

test('les résumés illustrés sont distincts du cours et figés dans la recette', () => {
  const publishedTheories = currentLogistiquePublication.units.filter((unit) => unit.kind === 'theorie' && unit.summaryBlocks)
  assert.equal(publishedTheories.length, 80)
  assert.equal(new Set(publishedTheories.map(({ module }) => module)).size, 80)
  const images = (blocks) => blocks.flatMap((block) => block.kind === 'image' ? [block] : block.kind === 'image-row' ? block.cells : [])
  const textBlocks = (blocks) => blocks.filter((block) => block.kind !== 'image' && block.kind !== 'image-row')
  for (const { module: code, approvedFor } of publishedTheories) {
    for (const diploma of approvedFor) {
      const full = config(diploma, code, 'theorie')
      const [summary] = freezeLogistiquePages([{ ...full, logistiqueTheoryView: 'resume' }])
      assert(logistiqueHasSummary(full.exerciseType))
      assert(validLogistiquePages([summary]))
      assert.equal(summary.logistiqueTheoryView, 'resume')
      const blocks = generateLogistique(summary, 7).items.map((item) => item.theoryBlock)
      const fullBlocks = generateLogistique(full, 7).items.map((item) => item.theoryBlock)
      assert(blocks.length < fullBlocks.length)
      for (const [view, version] of [[summary, blocks], [full, fullBlocks]]) {
        const baseline = { ...view, logistiqueBankRevision: 'logistique-theories-projets-v002' }
        const previous = generateLogistique(baseline, 7).items.map((item) => item.theoryBlock)
        const figures = images(version)
        assert(figures.length > images(previous).length, `${diploma} ${code}`)
        assert(figures.every((figure) => figure.src.endsWith('.webp') && figure.alt && figure.caption), `${diploma} ${code}`)
        if (code !== '101') assert.deepEqual(textBlocks(version), textBlocks(previous), `${diploma} ${code}`)
      }
      const historical = { ...full, logistiqueBankRevision: 'logistique-901-v001' }
      assert(!logistiqueHasSummary(full.exerciseType, historical.logistiqueBankRevision))
      assert(generateLogistique(historical, 7).items.some((item) => item.theoryBlock?.src?.endsWith('.svg')))
      assert(!validLogistiquePages([{ ...historical, logistiqueTheoryView: 'resume' }]))
    }
  }
  assert(!validLogistiquePages([{ ...config('AFP', '101', 'maths'), logistiqueTheoryView: 'resume' }]))
})

test('les nouvelles publications conservent le tirage des recettes du thème 600', () => {
  const page = { ...config('AFP', '616', 'maths'), count: 6 }
  const historical = { ...page, logistiqueBankRevision: 'logistique-614-615-616-v001' }
  const previous = generateLogistique(historical, 20261127)
  assert(previous.items.length > 0)
  assert.deepEqual(generateLogistique(page, 20261127), previous)
  assert.deepEqual(generateLogistique({
    ...config('CFC', '901', 'maths'), logistiqueBankRevision: historical.logistiqueBankRevision,
  }, 20261127).items, [])
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
  assert.equal(generateLogistique({ ...maths, logistiqueBankRevision: 'logistique-theories-projets-v002' }, 109).bankQuestionCap, 2)
  assert.deepEqual(generateLogistique({ ...maths, domain: 'logistique-cfc' }, 109, fixture.units).items, [])
})

test('les banques enrichies augmentent la capacité par diplôme et préservent les tirages enregistrés', () => {
  const additions = { CFC: { maths: 5, verification: 5, situation: 4 }, AFP: { maths: 4, verification: 5, situation: 3 } }
  const lots = [
    [/^10[0-9]$|^110$/, 'logistique-theories-projets-v002', 'logistique-exercices-fondations-v003'],
    [/^20[1-9]$/, 'logistique-exercices-fondations-v003', 'logistique-exercices-service-client-v003'],
  ]
  for (const [pattern, previousRevision, expandedRevision] of lots) {
    for (const type of catalog.logistiqueTypes.filter(({ module }) => pattern.test(module))) {
      const extra = additions[type.diploma][type.kind]
      if (!extra) continue
      const page = { ...config(type.diploma, type.module, type.kind), count: 30 }
      const historical = { ...page, logistiqueBankRevision: previousRevision }
      const expanded = { ...page, logistiqueBankRevision: expandedRevision }
      const before = generateLogistique(historical, 20261127)
      const after = generateLogistique(expanded, 20261127)
      assert.equal(after.bankQuestionCap, before.bankQuestionCap + extra, type.id)
      const prompts = new Set(after.items.map(({ prompt }) => prompt))
      assert.equal(prompts.size, after.items.length, type.id)
      assert(before.items.every(({ prompt }) => prompts.has(prompt)), type.id)
      assert.deepEqual(generateLogistique(freezeLogistiquePages([historical])[0], 20261127), before, type.id)
    }
  }
})

test('la relecture des mathématiques des thèmes 100 et 200 rattache les problèmes à leur cours', () => {
  const original = logistiquePublications.find(({ revision }) => revision === 'logistique-illustrations-fico-ict-projets-v003')
  const priorMaths = original.units.filter((unit) => unit.kind === 'maths' && /^(?:fondations|service-client)-exercices-v003$/.test(unit.revision))
  const currentById = new Map(currentLogistiquePublication.units.map((unit) => [unit.id, unit]))
  const sections = new Map(currentLogistiquePublication.units.filter((unit) => unit.kind === 'theorie').map((unit) => [
    unit.module, new Set(unit.blocks.filter(({ kind }) => kind === 'heading').map(({ text }) => text)),
  ]))
  assert.equal(priorMaths.length, 100)
  for (const exercise of priorMaths) {
    const reviewed = currentById.get(exercise.id)
    assert.equal(reviewed.kind, 'maths', exercise.id)
    assert.deepEqual(reviewed.approvedFor, exercise.approvedFor, exercise.id)
    assert(sections.get(exercise.module).has(reviewed.theorySection), exercise.id)
  }
  const hygiene = currentById.get('log-202-maths-v003-05')
  assert.match(hygiene.prompt, /lavage des mains/)
  assert.match(hygiene.calculation, /6 \+ 4 − 2 = 8/)
  const saved = { ...config('CFC', '202', 'maths'), count: 30, logistiqueBankRevision: original.revision }
  const [frozen] = freezeLogistiquePages([saved])
  assert(generateLogistique(frozen, 7).items.some(({ prompt }) => prompt.includes('CHF 58 par veste')))
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
