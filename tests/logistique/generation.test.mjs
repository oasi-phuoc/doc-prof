import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { dossierMaths } from '../../scripts/logistique-dossier-maths.mjs'

const require = createRequire(import.meta.url)
const fixture = require('./fixture.json')
const palletPhoto = require('../../docs/logistique/preparation/306-v004.json').visuals[0]
const { load, root } = require('../../scripts/gattegno-loader.cjs')
const catalog = load(root + '/src/logistique/catalog.ts')
const { generateLogistique, logistiqueDocumentTitle, logistiqueHasSummary, logistiqueQuestionItems, logistiqueQuestionPhotos } = load(root + '/src/logistique/generate.ts')
const { availableLogistiqueQuestions, retainLogistiqueQuestions } = load(root + '/src/logistique/libre.ts')
const { freezeLogistiquePages, validLogistiquePages } = load(root + '/src/logistique/recipe.ts')
const { currentLogistiquePublication, logistiquePublications } = load(root + '/src/logistique/approved-banks.ts')
const { splitLogistiquePages } = load(root + '/src/logistique/pagination.ts')
const { blockItemsForConfig } = load(root + '/src/components/generator/sheet-items.ts')
const { pageForA5Half } = load(root + '/src/components/generator/sheet-format.ts')

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

test('les glossaires de manutention incluent leurs nouveaux termes dans les deux diplômes', () => {
  const modules = [['306', 'Box-palette', 30], ['407', 'Diagramme de capacité', 22], ['409', 'AutoStore', 27], ['410', 'Palonnier', 23]]
  for (const diploma of ['CFC', 'AFP']) {
    for (const [code, term, count] of modules) {
      const page = config(diploma, code, 'glossaire')
      const blocks = generateLogistique(page, 7).items.map(({ theoryBlock }) => theoryBlock.text)
      assert.equal(blocks.length, count)
      assert(blocks.some((text) => text.startsWith(`{g}${term}{/g} — `)))
      assert.equal(new Set(blocks.map((text) => text.split('{/g}')[0])).size, count)
      const historical = { ...page, logistiqueBankRevision: 'logistique-theorie-306-v004' }
      const before = generateLogistique(historical, 7).items.map(({ theoryBlock }) => theoryBlock.text)
      assert.equal(before.length, 12)
      assert(before.every((text) => blocks.includes(text)))
    }
  }
})

test('les illustrations des glossaires sont reliées à des définitions et gardent les anciennes recettes', () => {
  let combinations = 0
  for (const type of catalog.logistiqueTypes.filter(({ kind }) => kind === 'glossaire')) {
    const page = config(type.diploma, type.module, type.kind)
    const { items } = generateLogistique(page, 7)
    const previous = generateLogistique({ ...page, logistiqueBankRevision: 'logistique-textes-a-trous-v006' }, 7)
    const figures = items.filter((item) => item.logistiqueGlossaryFigure)
    const unit = currentLogistiquePublication.units.find((entry) =>
      entry.kind === 'glossaire' && entry.module === type.module)
    assert(figures.length > 0, type.id)
    assert.equal(figures.length, Object.keys(unit.illustrations).length, type.id)
    assert.deepEqual(items.map(({ theoryBlock }) => theoryBlock), previous.items.map(({ theoryBlock }) => theoryBlock))
    assert(previous.items.every((item) => !item.logistiqueGlossaryFigure))
    for (const { theoryBlock, logistiqueGlossaryFigure } of figures) {
      const term = theoryBlock.text.match(/^\{g\}(.+?)\{\/g\}/)?.[1]
      const { src, alt } = logistiqueGlossaryFigure
      assert(alt && src.endsWith('.webp') && existsSync(root + '/public/' + src.replace(/^\//, '')), term)
      assert(src.includes('/commun/') || src.includes('/' + type.diploma.toLowerCase() + '/'), type.id)
      assert(src.endsWith(unit.illustrations[term].src), term)
    }
    combinations += 1
  }
  assert.equal(combinations, 143)
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
        if (code !== '101') {
          const originalText = textBlocks(version).filter((block) => code !== '306' || block.text !== palletPhoto.prose)
          assert.deepEqual(originalText, textBlocks(previous), `${diploma} ${code}`)
        }
      }
      const historical = { ...full, logistiqueBankRevision: 'logistique-901-v001' }
      assert(!logistiqueHasSummary(full.exerciseType, historical.logistiqueBankRevision))
      assert(generateLogistique(historical, 7).items.some((item) => item.theoryBlock?.src?.endsWith('.svg')))
      assert(!validLogistiquePages([{ ...historical, logistiqueTheoryView: 'resume' }]))
    }
  }
  assert(!validLogistiquePages([{ ...config('AFP', '101', 'maths'), logistiqueTheoryView: 'resume' }]))
})

test('le 306 associe le nouvel encadré au passage des supports spéciaux dans les deux versions', () => {
  for (const diploma of ['CFC', 'AFP']) {
    for (const logistiqueTheoryView of ['complet', 'resume']) {
      const page = { ...config(diploma, '306', 'theorie'), logistiqueTheoryView }
      const blocks = generateLogistique(page, 7).items.map(({ theoryBlock }) => theoryBlock)
      const index = blocks.findIndex((block) => block.src?.endsWith(palletPhoto.file))
      assert(index > 0)
      assert.equal(blocks[index - 1].text, logistiqueTheoryView === 'resume' ? palletPhoto.summaryAnchor : palletPhoto.anchor)
      assert.equal(blocks[index + 1].text, palletPhoto.prose)
      const saved = { ...page, logistiqueBankRevision: 'logistique-exercices-approvisionnement-complet-v005' }
      assert(generateLogistique(saved, 7).items.every(({ theoryBlock }) => !theoryBlock.src?.endsWith(palletPhoto.file)))
    }
  }
})

test('les nouvelles publications conservent le tirage des recettes du thème 600', () => {
  const page = { ...config('AFP', '616', 'maths'), count: 6 }
  const historical = { ...page, logistiqueBankRevision: 'logistique-614-615-616-v001' }
  const previous = generateLogistique(historical, 20261127)
  assert(previous.items.length > 0)
  const beforeEnrichment = { ...page, logistiqueBankRevision: 'logistique-exercices-production-v005' }
  assert.deepEqual(generateLogistique(beforeEnrichment, 20261127), previous)
  assert.deepEqual(generateLogistique(freezeLogistiquePages([historical])[0], 20261127), previous)
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

test('l’évaluation combine des modules de plusieurs thèmes et applique chaque quota séparément', () => {
  for (const diploma of ['CFC', 'AFP']) {
    const base = { ...config(diploma, '105', 'maths'), count: 8 }
    const page = { ...base, logistiqueSelection: { modules: ['105', '308'], quantities: { '105': 3, '308': 1 } } }
    const draw = generateLogistique(page, 32, [...fixture.units, ...fixture.units])
    assert.deepEqual(draw.items.map(({ logistiqueSource }) => logistiqueSource.module), ['105', '308'])
    assert.equal(draw.bankQuestionCap, 2)
    assert.match(draw.title, /105 et 308/)
    const pooled = { ...page, logistiqueSelection: { modules: ['105', '308'] } }
    assert.deepEqual(generateLogistique(pooled, 32, fixture.units), generateLogistique(pooled, 32, fixture.units))
    assert.equal(generateLogistique({ ...page, logistiqueSelection: { modules: [] } }, 32, fixture.units).items.length, 0)
    assert.equal(validLogistiquePages(freezeLogistiquePages([page])), true)
  }
  const base = config('AFP', '105', 'maths')
  for (const selection of [{ modules: ['501'] }, { modules: ['105', '105'] },
    { modules: ['105'], quantities: { '308': 2 } }, { modules: ['105'], quantities: { '105': -1 } }]) {
    const page = { ...base, logistiqueSelection: selection }
    assert.equal(generateLogistique(page, 32, fixture.units).items.length, 0)
    assert.equal(validLogistiquePages([page]), false)
  }
})

test('le choix en Libre écarte les doublons et conserve les questions retouchées lors d’un nouveau tirage', () => {
  const page = { ...config('AFP', '105', 'maths'), count: 4, logistiqueSelection: { modules: ['105', '308'] } }
  const type = catalog.logistiqueType(page.exerciseType)
  const original = generateLogistique(page, 7).items
  const candidates = logistiqueQuestionItems(type, ['105', '308'])
  const newQuestion = availableLogistiqueQuestions(candidates, original)
    .find((item) => item.logistiqueSource.module === '308')
  assert(newQuestion)
  assert(!availableLogistiqueQuestions(candidates, [{ prompt: newQuestion.prompt }]).includes(newQuestion))
  assert.deepEqual(logistiqueQuestionItems(type, ['501']), [])

  const retained = { ...newQuestion, calcAnswer: 'Calcul relu par le formateur', logistiqueRetained: true }
  const editable = { ...page, libreItems: [...original, retained], libreInstruction: 'Présentez le calcul.' }
  for (const evalMode of [true, false]) {
    const draw = retainLogistiqueQuestions(editable, 41, evalMode)
    assert.equal(draw.libreItems.length, 5)
    assert.equal(draw.libreItems.at(-1), retained)
    assert.equal(draw.libreInstruction, editable.libreInstruction)
    assert.equal(new Set(draw.libreItems.map((item) => item.logistiqueSource.id)).size, 5)
    if (!evalMode) assert(draw.libreItems.slice(0, -1).every((item) => item.logistiqueSource.module === '105'))
  }
})

test('les deux présentations des textes à trous gardent le même tirage et la même correction', () => {
  for (const diploma of ['CFC', 'AFP']) {
    for (const code of ['101', '105', '306', '308', '409']) {
      const page = { ...config(diploma, code, 'verification'), count: 4 }
      const older = { ...page, logistiqueBankRevision: 'logistique-glossaires-supports-manutention-v002' }
      assert.deepEqual(generateLogistique(page, 27), generateLogistique(older, 27))
      const without = generateLogistique({ ...page, logistiqueGapMode: 'sans-liste' }, 27)
      const withWords = { ...page, logistiqueGapMode: 'avec-liste' }
      const withList = generateLogistique(withWords, 27)
      assert.equal(withList.bankQuestionCap, 3)
      const keys = (result) => result.items.map(({ logistiqueSource, prompt, logistiqueGaps }) =>
        [logistiqueSource.id, prompt, logistiqueGaps.answers])
      assert.deepEqual(keys(withList), keys(without))
      assert.deepEqual(withList, generateLogistique(freezeLogistiquePages([withWords])[0], 27))
      assert(without.items.every((item) => item.logistiqueGaps.words === undefined))
      for (const item of withList.items) {
        const { answers, words } = item.logistiqueGaps
        assert.equal(item.prompt.match(/___/g).length, answers.length)
        assert(answers.every((word) => words.includes(word)))
        assert.equal(new Set(words).size, words.length)
      }
      const theory = currentLogistiquePublication.units.find((unit) => unit.module === code && unit.kind === 'theorie')
      for (const unit of currentLogistiquePublication.units.filter((entry) => entry.module === code && entry.gaps)) {
        assert(theory.blocks.some(({ kind, text }) => kind === 'heading' && text === unit.theorySection), unit.id)
      }
    }
  }
  assert(!validLogistiquePages([{ ...config('AFP', '105', 'maths'), logistiqueGapMode: 'sans-liste' }]))
})

test('la photo d’une question reste attachée à son item et le catalogue refuse une source incompatible', () => {
  const page = config('AFP', '105', 'maths')
  const type = catalog.logistiqueType(page.exerciseType)
  const photos = logistiqueQuestionPhotos(type, ['105']).get('105')
  assert(photos.length > 1)
  assert(photos.every(({ src }) => catalog.logistiquePhotoPath(src, 'AFP')))
  const item = generateLogistique(page, 11).items[0]
  const image = { ...photos[0], caption: 'Photo de contrôle', width: 140, placement: 'droite', visibility: 'answers' }
  const attached = { ...page, libreItems: [{ ...item, logistiqueImage: image }] }
  assert(validLogistiquePages(freezeLogistiquePages([attached])))
  for (const half of ['left', 'right']) {
    assert.deepEqual(pageForA5Half(attached, half).libreItems, attached.libreItems)
  }
  for (const src of ['https://example.com/photo.webp', 'blob:temporary', '/assets/logistique/900/901/cfc/log-901-photo-v001.webp']) {
    assert(!validLogistiquePages([{ ...page, libreItems: [{ ...item, logistiqueImage: { ...image, src } }] }]))
  }
})

test('les banques enrichies augmentent la capacité par diplôme et préservent les tirages enregistrés', () => {
  const additions = { CFC: { maths: 5, verification: 5, situation: 4 }, AFP: { maths: 4, verification: 5, situation: 3 } }
  const lots = [
    [/^10[0-9]$|^110$/, 'logistique-theories-projets-v002', 'logistique-exercices-fondations-v003', additions],
    [/^20[1-9]$/, 'logistique-exercices-fondations-v003', 'logistique-exercices-service-client-v003', additions],
    [/^30[1-9]$|^31[0-2]$/, 'logistique-maths-fondations-service-v004', 'logistique-exercices-approvisionnement-v004', {
      CFC: { ...additions.CFC, maths: 6 }, AFP: { ...additions.AFP, maths: 5 },
    }],
  ]
  for (const [pattern, previousRevision, expandedRevision, expected] of lots) {
    for (const type of catalog.logistiqueTypes.filter(({ module }) => pattern.test(module))) {
      const extra = expected[type.diploma][type.kind]
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

test('les problèmes ajoutés et relus se rattachent à une section de leur cours', () => {
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
  const procurementMaths = currentLogistiquePublication.units.filter((unit) => unit.kind === 'maths' && unit.revision === 'approvisionnement-exercices-v004')
  assert.equal(procurementMaths.length, 72)
  for (const exercise of procurementMaths) {
    assert(sections.get(exercise.module).has(exercise.theorySection), exercise.id)
  }
  const hygiene = currentById.get('log-202-maths-v003-05')
  assert.match(hygiene.prompt, /lavage des mains/)
  assert.match(hygiene.calculation, /6 \+ 4 − 2 = 8/)
  const saved = { ...config('CFC', '202', 'maths'), count: 30, logistiqueBankRevision: original.revision }
  const [frozen] = freezeLogistiquePages([saved])
  assert(generateLogistique(frozen, 7).items.some(({ prompt }) => prompt.includes('CHF 58 par veste')))
})

test('les neuf thèmes atteignent les cibles de banque pour chacun des modules CFC et AFP', () => {
  const targets = { maths: 30, verification: 50, situation: 20 }
  const units = currentLogistiquePublication.units
  const activeThemes = new Set(units.flatMap(({ revision }) => revision.match(/^dossiers-(\d00)-v005$/)?.[1] ?? []))
  const sectionsByModule = new Map(units.filter(({ kind }) => kind === 'theorie').map((unit) => [
    unit.module, new Set(unit.blocks.filter(({ kind }) => kind === 'heading').map(({ text }) => text)),
  ]))
  assert.deepEqual([...activeThemes].sort(), ['100', '200', '300', '400', '500', '600', '700', '800', '900'])
  for (const module of new Set(units.map((unit) => unit.module))) {
    if (!activeThemes.has(module[0] + '00')) continue
    const additions = units.filter((unit) => unit.module === module && unit.revision.startsWith('dossiers-'))
    assert(additions.length > 0, module)
    for (const unit of additions) assert(sectionsByModule.get(module).has(unit.theorySection), unit.id)
  }
  for (const type of catalog.logistiqueTypes) {
    if (!activeThemes.has(type.module[0] + '00') || !targets[type.kind]) continue
    const page = { ...config(type.diploma, type.module, type.kind), count: 50 }
    const bank = generateLogistique(page, 20261127)
    assert(bank.bankQuestionCap >= targets[type.kind], type.id)
    assert.equal(new Set(bank.items.map(({ prompt }) => prompt)).size, bank.items.length, type.id)
  }
})

test('les calculs des dossiers conservent les unités, les décimales et les références utilisées dans le cours', () => {
  const [, redevance] = dossierMaths.tonneDistance('trajets', [312, 18, 0.025, 245, 22, 35])
  assert.match(redevance[0], /0,025/)
  assert.equal(redevance[1], 'CHF 140,4')
  const copiedFormula = dossierMaths.spreadsheet('colis', [43, 59, 36, 62, 4, 9])[3]
  assert.match(copiedFormula[0], /B2\*\$E\$1/)
  assert.equal(copiedFormula[1], '=B3*$E$1, soit CHF 236')
  const cycle = dossierMaths.cycle('pièces', [174, 12, 96, 5, 112, 40])
  assert.deepEqual(cycle.map(([, answer]) => answer), ['7 jours', '36 pièces', '148 pièces', '-4 pièces', '12 pièces par jour'])
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

test('le texte habille la photo sur la même page et un saut manuel reste prioritaire', () => {
  const items = [
    { kind: 'heading', text: 'Supports de charge' },
    { kind: 'paragraph', text: 'Consigne de contrôle. '.repeat(54) },
    { kind: 'heading', sub: true, text: 'Comparer les deux supports' },
    { kind: 'image', src: '/assets/logistique/log-306-supports-photo-v004.webp', alt: 'Deux supports', caption: 'Palette et box-palette.' },
    { kind: 'paragraph', text: 'Vérifiez le type de marchandise et le mode de prise avant de choisir le support de charge. '.repeat(3) },
  ].map((theoryBlock) => ({ layout: 'theory', theoryBlock, answer: '' }))
  const block = { title: 'Théorie', items, exerciseIndex: 1, exerciseType: 'log-afp-306-theorie' }
  for (const a5 of [false, true]) {
    const sheets = splitLogistiquePages({ items, blocks: [block] }, { a5 })
    assert.deepEqual(sheets.flatMap((sheet) => sheet.items), items)
    const wrapped = sheets.find(({ items: pageItems }) => pageItems.includes(items[3])).blocks[0]
    assert.deepEqual(wrapped.logistiqueWrappedFigures.map((index) => wrapped.items.slice(index, index + 2)), [items.slice(3)])
    assert(wrapped.items.includes(items[2]), 'Le titre reste avec la photo')
  }

  const withBreak = { ...block, tcfPageBreakAfter: [false, false, false, true] }
  const sheets = splitLogistiquePages({ items, blocks: [withBreak] })
  assert.equal(sheets.find(({ items: pageItems }) => pageItems.includes(items[3])).items.at(-1), items[3])
  assert(sheets.every(({ blocks }) => blocks.every(({ logistiqueWrappedFigures }) => !logistiqueWrappedFigures?.length)))
  assert.deepEqual(sheets.flatMap((sheet) => sheet.items), items)
})

test('les tableaux longs répètent leurs en-têtes en A5 et restent entiers dans les données de la fiche', () => {
  const title = { kind: 'heading', text: 'Comparaison des supports' }
  const table = { kind: 'table', headers: ['Support', 'Contrôle'], rows: Array.from(
    { length: 12 }, (_, index) => [`Support ${index + 1}`, 'Vérifier le marquage du support et relever les défauts avant l’échange.'],
  ) }
  const prose = { kind: 'paragraph', text: 'Relever les écarts dans le registre.' }
  const items = [title, table, prose].map((theoryBlock) => ({ layout: 'theory', theoryBlock, answer: '' }))
  const block = { title: 'Théorie', instruction: 'Lire le tableau.', items, exerciseIndex: 1, exerciseType: 'log-afp-306-theorie' }
  const sheet = { items, blocks: [{ ...block, tcfPageBreakAfter: [false, true] }] }
  const a4 = splitLogistiquePages(sheet)
  assert.deepEqual(a4.flatMap((page) => page.items), items)
  assert(a4.every(({ blocks }) => blocks.every((entry) => !entry.logistiqueTheorySlices)))

  const a5 = splitLogistiquePages(sheet, { a5: true }).map((page) => ({ ...page, configIndex: 0 }))
  const slices = a5.flatMap(({ blocks }) => blocks.flatMap((entry) => entry.logistiqueTheorySlices))
    .filter((part) => part.theoryBlock?.kind === 'table')
  assert(slices.length > 1)
  assert(slices.every((part) => part.sourceIndex === 1 && part.theoryBlock.headers === table.headers))
  assert.deepEqual(slices.flatMap(({ theoryBlock }) => theoryBlock.rows), table.rows)
  assert.deepEqual(slices.map(({ isLast }) => isLast), [...Array(slices.length - 1).fill(false), true])
  assert.deepEqual(a5.at(-1).items, [items[2]], 'Le saut manuel vient après la dernière partie du tableau')
  assert.deepEqual(blockItemsForConfig(a5, 0, 0), { items, instruction: block.instruction })
})

test('les longues listes A5 se poursuivent en gardant chaque entrée entière', () => {
  const list = { kind: 'list', items: Array.from({ length: 12 }, (_, index) =>
    `Consigne ${index + 1} pour reconnaître le pictogramme et lire l’étiquette avant de déplacer le lot.`) }
  const item = { layout: 'theory', theoryBlock: list, answer: '' }
  const block = { title: 'Théorie', items: [item], exerciseIndex: 1, exerciseType: 'log-afp-105-theorie' }
  const pages = splitLogistiquePages({ blocks: [block], items: [item] }, { a5: true })
  assert(pages.length > 1)
  const fragments = pages.flatMap((page) => page.blocks[0].logistiqueTheorySlices)
  assert.deepEqual(fragments.flatMap(({ theoryBlock }) => theoryBlock.items), list.items)
})
