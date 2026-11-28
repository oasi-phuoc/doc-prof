import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { dossierMaths } from '../../scripts/logistique-dossier-maths.mjs'

const require = createRequire(import.meta.url)
const fixture = require('./fixture.json')
const palletPhoto = require('../../docs/logistique/preparation/306-v004.json').visuals[0]
const illustratedRevisions = new Map([
  ['405', require('../../docs/logistique/preparation/405-v004.json')],
  ['406', require('../../docs/logistique/preparation/406-v004.json')],
  ['408', require('../../docs/logistique/preparation/408-v006.json')],
  ['503', require('../../docs/logistique/preparation/503-v004.json')],
  ['504', require('../../docs/logistique/preparation/504-v004.json')],
  ['601', require('../../docs/logistique/preparation/601-v004.json')],
  ['602', require('../../docs/logistique/preparation/602-v004.json')],
  ['603', require('../../docs/logistique/preparation/603-v004.json')],
])
const { load, root } = require('../../scripts/gattegno-loader.cjs')
const catalog = load(root + '/src/logistique/catalog.ts')
const { generateLogistique, logistiqueDocumentTitle, logistiqueHasSummary, logistiqueQuestionItems, logistiqueQuestionPhotos } = load(root + '/src/logistique/generate.ts')
const { assignLogistiqueReplacement, availableLogistiqueQuestions, logistiqueReplacementChoices,
  retainLogistiqueQuestions, newLogistiqueQuestion, reviewableLogistiqueAnswer } = load(root + '/src/logistique/libre.ts')
const { buildPage } = load(root + '/src/math/generate.ts')
const { initialLogistiqueStory, allocateLogistiquePoints, applyLogistiqueStoryChange, logistiqueDuration,
  logistiqueStoryVariant, validLogistiqueStory } = load(root + '/src/logistique/evaluation.ts')
const { initialInventoryStory } = load(root + '/src/logistique/inventory-story.ts')
const { editLogistiqueGaps, logistiqueGapDistractors, validLogistiqueGaps } = load(root + '/src/logistique/gaps.ts')
const { logistiqueCasePoints, validLogistiqueExerciseTable } = load(root + '/src/logistique/tables.ts')
const { freezeLogistiquePages, validLogistiquePages } = load(root + '/src/logistique/recipe.ts')
const { canReuseLogistiqueEvaluation, reuseLogistiqueEvaluation } = load(root + '/src/logistique/model.ts')
const { parseFicheRecipe } = load(root + '/src/fiches/recipe.ts')
const { currentLogistiquePublication, logistiquePublications } = load(root + '/src/logistique/approved-banks.ts')
const { splitLogistiquePages } = load(root + '/src/logistique/pagination.ts')
const { blockItemsForConfig } = load(root + '/src/components/generator/sheet-items.ts')
const { pageForA5Half } = load(root + '/src/components/generator/sheet-format.ts')
const { applyLogistiqueWording } = load(root + '/src/logistique/wording.ts')

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
  const modules = [['306', 'Box-palette', 34], ['407', 'Diagramme de capacité', 22], ['409', 'AutoStore', 27], ['410', 'Palonnier', 23]]
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

test('chaque notion de glossaire a son propre visuel et garde la définition de la recette', () => {
  let combinations = 0
  for (const type of catalog.logistiqueTypes.filter(({ kind }) => kind === 'glossaire')) {
    const page = config(type.diploma, type.module, type.kind)
    const { items } = generateLogistique(page, 7)
    const previous = generateLogistique({ ...page, logistiqueBankRevision: 'logistique-textes-a-trous-v006' }, 7)
    const figures = items.filter((item) => item.logistiqueGlossaryFigure)
    const unit = currentLogistiquePublication.units.find((entry) =>
      entry.kind === 'glossaire' && entry.module === type.module)
    assert.equal(figures.length, items.length, type.id)
    assert.equal(figures.length, Object.keys(unit.illustrations).length, type.id)
    assert.equal(new Set(figures.map(({ logistiqueGlossaryFigure }) => logistiqueGlossaryFigure.src)).size, items.length, type.id)
    const preserved = new Set(items.map(({ theoryBlock }) => theoryBlock.text))
    assert(previous.items.every(({ theoryBlock }) => preserved.has(theoryBlock.text)), type.id)
    assert(previous.items.every((item) => item.logistiqueGlossaryFigure && item.logistiqueGlossaryEntry), type.id)
    for (const { theoryBlock, logistiqueGlossaryEntry, logistiqueGlossaryFigure } of figures) {
      const term = theoryBlock.text.match(/^\{g\}(.+?)\{\/g\}/)?.[1]
      const { src, alt } = logistiqueGlossaryFigure
      assert(alt && src.endsWith('.webp') && existsSync(root + '/public/' + src.replace(/^\//, '')), term)
      assert(/\/(?:commun|glossaire)\//.test(src) || src.includes('/' + type.diploma.toLowerCase() + '/'), type.id)
      assert(src.endsWith(unit.illustrations[term].src), term)
      assert.equal(logistiqueGlossaryEntry?.term, term)
      assert(logistiqueGlossaryEntry?.definition.trim().length, term)
    }
    combinations += 1
  }
  assert.equal(combinations, 143)
  assert.equal(currentLogistiquePublication.units.filter(({ kind }) => kind === 'glossaire')
    .reduce((sum, { illustrations }) => sum + Object.keys(illustrations).length, 0), 1170)
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
          const plan = illustratedRevisions.get(code)
          const additions = code === '306' ? [palletPhoto] :
            (view.logistiqueTheoryView === 'resume' ? plan?.summaryVisuals : undefined) ?? plan?.visuals ?? []
          for (const addition of code === '306' ? [] : additions) {
            const position = version.findIndex((block) => block.kind === 'image' && block.src.endsWith(addition.file))
            assert(position > 0, `${diploma} ${code} ${addition.file}`)
            if (addition.prose) assert.equal(version[position + 1].text, addition.prose)
          }
          const originalText = textBlocks(version).filter((block) => !additions.some(({ prose }) => prose && block.text === prose))
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

test('le 306 compare les palettes de formats différents et les supports spéciaux sur des photos individuelles', () => {
  for (const diploma of ['CFC', 'AFP']) {
    for (const logistiqueTheoryView of ['complet', 'resume']) {
      const page = { ...config(diploma, '306', 'theorie'), logistiqueTheoryView }
      const blocks = generateLogistique(page, 7).items.map(({ theoryBlock }) => theoryBlock)
      const index = blocks.findIndex((block) => block.kind === 'image-row' && block.label === 'Support plat ou caisse-palette')
      assert(index > 0)
      assert.deepEqual(blocks[index].cells.map(({ caption }) => caption), ['Palette synthétique', 'Box-palette métallique'])
      const previousHeading = blocks.slice(0, index).findLast((block) => block.kind === 'heading')
      assert.equal(previousHeading?.text, logistiqueTheoryView === 'resume' ? palletPhoto.summaryAnchor : palletPhoto.anchor)
      assert.equal(blocks[index + 1].text, palletPhoto.prose)
      const formats = blocks.find((block) => block.kind === 'image-row' && block.label === 'Deux dimensions de palettes')
      assert.deepEqual(formats.cells.map(({ description }) => description), ['1 200 × 1 000 mm au sol.', '800 × 600 mm au sol.'])
      assert.equal(new Set([...blocks[index].cells, ...formats.cells].map(({ src }) => src)).size, 4)
      const saved = { ...page, logistiqueBankRevision: 'logistique-exercices-approvisionnement-complet-v005' }
      assert(generateLogistique(saved, 7).items.every(({ theoryBlock }) => !theoryBlock.src?.endsWith(palletPhoto.file)))
    }
  }
})

test('les palettes spéciales et les formes de stockage ont des vues propres dans le cours, le résumé et le glossaire', () => {
  const codes = [['306', 14, 'Varitainer', 'varitainer'], ['403', 14, 'Drive-through', 'drive-through'], ['404', 4, 'Entrepôt ouvert', 'a-ciel-ouvert']]
  for (const [code, count, term, photo] of codes) for (const diploma of ['CFC', 'AFP']) {
    const matches = (src) => src?.includes('-photo-v011.webp')
    const glossary = generateLogistique(config(diploma, code, 'glossaire'), 7).items
    assert(glossary.some(({ theoryBlock, logistiqueGlossaryFigure }) =>
      theoryBlock.text.startsWith(`{g}${term}{/g}`) && logistiqueGlossaryFigure?.src.includes(`-${photo}-photo-v011.webp`)))
    for (const logistiqueTheoryView of ['complet', 'resume']) {
      const page = { ...config(diploma, code, 'theorie'), logistiqueTheoryView }
      const figures = (cfg) => generateLogistique(cfg, 7).items.flatMap(({ theoryBlock }) =>
        theoryBlock.kind === 'image-row' ? theoryBlock.cells : theoryBlock.kind === 'image' ? [theoryBlock] : [])
      const current = figures(page).filter(({ src }) => matches(src))
      assert.equal(current.length, count)
      assert(current.every(({ src, alt, caption }) => alt && caption && existsSync(root + '/public' + src)))
      const legacy = figures({ ...page, logistiqueBankRevision: 'logistique-tableaux-v007' })
      assert(legacy.every(({ src }) => !matches(src)))
    }
  }
})

test('le râtelier vertical et le stockage en épis ont une illustration dans les deux cours et glossaires', () => {
  for (const diploma of ['CFC', 'AFP']) {
    for (const [module, word, file] of [
      ['403', 'Râtelier vertical', 'log-403-ratelier-vertical-photo-v011.webp'],
      ['408', 'Stockage en épis', 'log-408-epis-photo-v005.webp'],
    ]) {
      const glossary = generateLogistique(config(diploma, module, 'glossaire'), 7).items
      assert(glossary.some(({ theoryBlock, logistiqueGlossaryFigure }) =>
        theoryBlock.text.startsWith(`{g}${word}{/g}`) && logistiqueGlossaryFigure?.src.endsWith(file)))
      for (const logistiqueTheoryView of ['complet', 'resume']) {
        const page = { ...config(diploma, module, 'theorie'), logistiqueTheoryView }
        const { items } = generateLogistique(page, 7)
        const figure = items.find(({ theoryBlock }) => theoryBlock.src?.endsWith(file))?.theoryBlock
        assert(figure?.caption.trim() && existsSync(root + '/public' + figure.src), `${module} ${diploma} ${logistiqueTheoryView}`)
      }
    }
  }
})

test('les glossaires repris fournissent une photo individuelle pour chaque notion', () => {
  const photoGlossaries = [
    ['100', 13], ['101', 16], ['102', 25], ['103', 15], ['104', 20], ['105', 45], ['106', 14], ['107', 15],
    ['108', 13], ['109', 15], ['110', 16], ['201', 14], ['202', 14], ['203', 14],
    ['204', 14], ['205', 14], ['206', 14],
    ['207', 14], ['208', 14], ['209', 14],
    ['301', 12], ['302', 12], ['303', 12], ['304', 12], ['305', 12],
    ['306', 34], ['307', 12], ['308', 25], ['309', 12], ['310', 12], ['311', 12], ['312', 12],
    ['401', 12], ['402', 12], ['403', 27], ['404', 12], ['407', 22], ['409', 27], ['410', 23],
    ['501', 12],
  ]
  for (const [code, count] of photoGlossaries) for (const diploma of ['CFC', 'AFP']) {
    const page = config(diploma, code, 'glossaire')
    if (diploma === 'AFP' && !catalog.logistiqueType(page.exerciseType)) continue
    for (const logistiqueBankRevision of [undefined, 'logistique-glossaires-tableaux-v006']) {
      const { items } = generateLogistique({ ...page, logistiqueBankRevision }, 7)
      const photos = items.map(({ logistiqueGlossaryFigure }) => logistiqueGlossaryFigure)
      assert.equal(photos.length, count)
      assert(photos.every((photo) => photo?.alt.trim() && /-photo-v\d+\.webp$/.test(photo.src) && existsSync(root + '/public' + photo.src)))
      assert.equal(new Set(photos.map(({ src }) => src)).size, photos.length)
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

test('les tableaux de données et de dates renvoient au cours et gardent le tirage habituel des recettes', () => {
  const modules = [
    ['306', 'verification', 'tableau-donnees'],
    ['308', 'maths', 'tableau-donnees'],
    ['406', 'maths', 'tableau-dates'],
  ]
  for (const diploma of ['CFC', 'AFP']) for (const [code, kind, presentation] of modules) {
    const usual = { ...config(diploma, code, kind), count: 12 }
    const before = { ...usual, logistiqueBankRevision: 'logistique-glossaires-illustres-v003' }
    const after = { ...usual, logistiqueBankRevision: 'logistique-tableaux-v007' }
    assert.deepEqual(generateLogistique(after, 12), generateLogistique(before, 12))
    const page = { ...usual, logistiquePresentation: presentation }
    const { items, bankQuestionCap } = generateLogistique(page, 12)
    assert.equal(bankQuestionCap, 4)
    assert.equal(items.length, 4)
    assert(items.every(({ logistiqueTable }) => validLogistiqueExerciseTable(logistiqueTable)))
    const type = catalog.logistiqueType(page.exerciseType)
    assert.equal(logistiqueQuestionItems(type, [code], undefined, presentation).length, 4)
    assert.equal(logistiqueQuestionItems(type, [code], before.logistiqueBankRevision, presentation).length, 0)
    const headings = new Set(generateLogistique(config(diploma, code, 'theorie'), 12).items
      .map(({ theoryBlock }) => theoryBlock.text))
    for (const item of items) {
      const source = currentLogistiquePublication.units.find(({ id }) => id === item.logistiqueSource.id)
      assert(headings.has(source.theorySection), item.logistiqueSource.id)
      if (kind === 'maths') assert(item.calcAnswer && item.responseAnswer, item.logistiqueSource.id)
    }
    const [saved] = freezeLogistiquePages([{ ...page, libreItems: items }])
    assert.equal(saved.logistiquePresentation, presentation)
    assert(validLogistiquePages([saved]))
    const invalidItem = { ...items[0], logistiqueTable: { ...items[0].logistiqueTable, rows: [['donnée']] } }
    assert(!validLogistiquePages([{ ...saved, libreItems: [invalidItem] }]))
    if (code === '406') {
      const leap = items.find(({ logistiqueSource }) => logistiqueSource.id.includes('bissextile'))
      assert.deepEqual(leap?.logistiqueTable.rows[0], ['A', '28.02.2028', '02.03.2028', { answer: '3' }])
    }
  }
  assert(!validLogistiquePages([{ ...config('CFC', '306', 'theorie'), logistiquePresentation: 'tableau-donnees' }]))
})

test('les exercices des acquis couvrent tous les modules avec des questions distinctes et une référence au cours', () => {
  const kinds = ['maths', 'verification', 'situation']
  const previous = logistiquePublications.find(({ revision }) => revision === 'logistique-palettes-et-stockage-v005')
  const publication = logistiquePublications.find(({ revision }) => revision === 'logistique-exercices-acquis-v008')
  const added = publication.units.filter(({ revision }) => revision === 'acquis-v008')
  assert.equal(added.length, 286)
  const normalize = (text) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim()
  const prompts = new Set(previous.units.filter(({ kind }) => kinds.includes(kind)).map(({ module, kind, prompt }) =>
    `${module}/${kind}/${normalize(prompt)}`))
  for (const { id, module, kind, prompt, answer, calculation, theorySection } of added) {
    const key = `${module}/${kind}/${normalize(prompt)}`
    assert(!prompts.has(key), id)
    prompts.add(key)
    assert(answer.trim(), id)
    assert.equal(Boolean(calculation), kind === 'maths', id)
    const theory = previous.units.find((unit) => unit.module === module && unit.kind === 'theorie')
    assert(theory.blocks.some((block) => block.kind === 'heading' && block.text === theorySection), id)
  }
  for (const { diploma, module, kind } of catalog.logistiqueTypes.filter(({ kind }) => kinds.includes(kind))) {
    const relevant = added.filter((unit) => unit.module === module && unit.kind === kind && unit.approvedFor.includes(diploma))
    assert(relevant.length, `${diploma} ${module} ${kind}`)
    const page = { ...config(diploma, module, kind), count: 999 }
    const { items, bankQuestionCap } = generateLogistique({ ...page, logistiqueBankRevision: publication.revision }, 20261127)
    const old = generateLogistique({ ...page, logistiqueBankRevision: previous.revision }, 20261127)
    assert.equal(items.length, bankQuestionCap)
    assert.equal(items.length, old.items.length + relevant.length)
    assert.equal(items.length, new Set(items.map(({ logistiqueSource }) => logistiqueSource.id)).size)
  }
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

test('le remplacement manuel conserve la place et le barème dans le module et le format de la question', () => {
  for (const diploma of ['CFC', 'AFP']) {
    const page = config(diploma, '306', 'verification')
    const type = catalog.logistiqueType(page.exerciseType)
    const bank = logistiqueQuestionItems(type, ['306'], 'logistique-choix-v011')
    const [original, alreadyUsed] = bank.filter((item) => item.layout === 'text' && !item.logistiqueResponseLines)
    const previous = { ...original, libreId: 'question-2', points: 3.5,
      logistiqueAssessment: { minutes: 5, pointsLocked: true }, libreCorrectionPending: true }
    const otherItems = [alreadyUsed, previous, { prompt: bank[2].prompt.toUpperCase().replace(/ /g, '  ') }]
    const candidates = logistiqueReplacementChoices(type, previous, otherItems, 'logistique-choix-v011')
    assert(candidates.length > 0, diploma)
    assert(candidates.every((item) => item.logistiqueSource.module === '306' && item.layout === 'text' &&
      !item.logistiqueResponseLines && !otherItems.some((used) => used.logistiqueSource?.id === item.logistiqueSource.id)))
    assert(!candidates.some((item) => item.prompt === bank[2].prompt))
    assert.deepEqual(logistiqueReplacementChoices(type, { ...previous, libreLocked: true }, otherItems), [])
    assert.deepEqual(logistiqueReplacementChoices(type, previous, otherItems, 'revision-inconnue'), [])
    const replacement = assignLogistiqueReplacement(previous, candidates[0], true)
    assert.equal(replacement.libreId, 'question-2')
    assert.equal(replacement.points, 3.5)
    assert.equal(replacement.libreLocked, true)
    assert.equal(replacement.libreCorrectionPending, undefined)
    assert.deepEqual(replacement.logistiqueAssessment, { minutes: 5, pointsLocked: true })
    assert.equal(replacement.answer, candidates[0].answer)
    assert(validLogistiquePages([{ ...page, logistiqueBankRevision: 'logistique-choix-v011', libreItems: [replacement] }]))
  }
})

test('les deux présentations des textes à trous gardent le même tirage et la même correction', () => {
  for (const diploma of ['CFC', 'AFP']) {
    for (const code of ['101', '105', '306', '308', '409']) {
      const page = { ...config(diploma, code, 'verification'), count: 4 }
      const older = { ...page, logistiqueBankRevision: 'logistique-glossaires-supports-manutention-v002' }
      const gapsPublication = { ...page, logistiqueBankRevision: 'logistique-textes-a-trous-v006' }
      assert.deepEqual(generateLogistique(gapsPublication, 27), generateLogistique(older, 27))
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

test('l’édition des blancs assemble la liste et les réponses dans une seule mise à jour valide', () => {
  const previous = { answers: ['bac', 'bac'], words: ['bac', 'chariot', 'bac'] }
  assert.deepEqual(logistiqueGapDistractors(previous), ['chariot'])
  const draft = { prompt: 'Deux ___, puis un ___.', answers: 'lots\n colis ', distractors: ' chariot ', showWords: true }
  const { patch } = editLogistiqueGaps(draft, previous)
  assert.equal(patch.answer, 'lots / colis')
  assert.deepEqual(patch.logistiqueGaps.words.toSorted(), ['chariot', 'colis', 'lots'])
  assert(validLogistiqueGaps(patch.prompt, patch.logistiqueGaps))
  assert.equal(editLogistiqueGaps({ ...draft, showWords: false }, previous).patch.logistiqueGaps.words, undefined)
  assert.match(editLogistiqueGaps({ ...draft, answers: 'lots' }, previous).error, /2 blanc\(s\)/)
  assert.match(editLogistiqueGaps({ ...draft, distractors: 'COLIS' }, previous).error, /distinct/)
  assert(!validLogistiqueGaps('___ et ___', { answers: ['lots', 'colis'], words: ['lots', 'autre'] }))
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
  for (const diploma of ['AFP', 'CFC']) {
    const theory = config(diploma, '101', 'theorie')
    assert.equal(logistiqueDocumentTitle([theory]), 'Théorie : module 101')
    assert.equal(logistiqueDocumentTitle([{ ...theory, logistiqueTheoryView: 'resume' }]), 'Théorie résumée : module 101')
  }
  const pages = freezeLogistiquePages([{ ...a, extraBlocks: [b] }])
  assert.equal(pages[0].logistiqueBankRevision, currentLogistiquePublication.revision)
  assert.equal(pages[0].extraBlocks[0].logistiqueBankRevision, currentLogistiquePublication.revision)
  assert.equal(validLogistiquePages(pages), true)
  assert.equal(validLogistiquePages([a, config('AFP', '105', 'maths')]), false)
  assert.equal(validLogistiquePages([config('AFP', '902', 'theorie')]), false)
  assert.equal(validLogistiquePages([{ ...a, extraBlocks: [null] }]), false)
  assert.equal(validLogistiquePages([{ ...a, logistiqueBankRevision: 'inconnue' }]), false)
})

test('les questions locales sont imprimables et protégées même avec un filtre sans banque', () => {
  for (const diploma of ['AFP', 'CFC']) {
    const page = { ...config(diploma, '100', 'maths'), logistiqueSelection: { modules: [] } }
    const draft = newLogistiqueQuestion('100', 'maths', 'open')
    assert(draft.libreId && draft.libreCorrectionPending)
    assert(!reviewableLogistiqueAnswer(draft))
    assert.equal(draft.logistiqueSource, undefined)
    const completed = { ...draft, prompt: 'De 12 colis, 4 sont expédiés.\nCombien en reste-t-il ?',
      calcAnswer: '12 − 4 = 8', answer: '8 colis', responseAnswer: '8 colis', libreCorrectionPending: false }
    assert(reviewableLogistiqueAnswer(completed))
    const local = { ...page, libreId: 'log-activity', libreItems: [completed] }
    assert.equal(validLogistiquePages([local]), true)
    assert.deepEqual(buildPage(local, 7).items, [completed])
    assert.deepEqual(retainLogistiqueQuestions(local, 7, true).libreItems, [completed])
    assert.equal(validLogistiquePages([{ ...local, libreItems: [{ ...completed, logistiqueLocalModule: '000' }] }]), false)
    const selected = config(diploma, '100', 'maths')
    assert.deepEqual(buildPage({ ...selected, libreItems: [] }, 7).items, [])
  }
  const qcm = newLogistiqueQuestion('100', 'verification', 'qcm')
  assert(!reviewableLogistiqueAnswer({ ...qcm, prompt: 'Quel colis reste en réserve ?', answer: 'A' }))
  assert(reviewableLogistiqueAnswer({ ...qcm, prompt: 'Quel colis reste en réserve ?', options: ['Le bleu, fermé', 'Le rouge'], answer: 'Le bleu, fermé' }))
})

test('les réponses simples, les listes numérotées et les QCM tirent les unités compatibles du diplôme', () => {
  const authored = currentLogistiquePublication.units.filter((unit) => unit.revision === 'reponses-v009')
  assert.equal(authored.length, 22)
  for (const unit of authored) {
    const course = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(course?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    for (const diploma of unit.approvedFor) {
      const presentation = unit.options ? 'qcm' : 'lignes-numerotees'
      const page = { ...config(diploma, unit.module, 'verification'), logistiquePresentation: presentation }
      const result = generateLogistique(page, 37)
      assert.equal(result.bankQuestionCap, 1)
      assert.equal(result.items[0].logistiqueSource.id, unit.id)
      if (presentation === 'qcm') {
        assert.equal(new Set(result.items[0].options).size, 4)
        assert(result.items[0].options.includes(result.items[0].answer), unit.id)
      } else {
        assert.deepEqual(result.items[0].logistiqueResponseLines.answers, unit.numberedAnswers)
        assert.equal(result.items[0].logistiqueResponseLines.ordered, unit.orderedAnswers)
      }
      assert(validLogistiquePages([{ ...page, libreItems: result.items }]))
      assert.equal(generateLogistique({ ...page, logistiqueBankRevision: 'logistique-theorie-103-v004' }, 37).bankQuestionCap, 0)
    }
  }
  const simple = { ...config('AFP', '105', 'verification'), logistiquePresentation: 'lignes-simples', count: 4 }
  assert(generateLogistique(simple, 7).items.every((item) =>
    item.layout === 'text' && item.logistiqueResponseLines.count === 2 && !item.logistiqueGaps && !item.logistiqueTable))
  assert.equal(validLogistiquePages([{ ...config('AFP', '105', 'maths'), logistiquePresentation: 'qcm' }]), false)
})

test('les formats de comparaison, classement et ordre conservent les données et la correction du tableau', () => {
  const authored = currentLogistiquePublication.units.filter((unit) => unit.revision === 'structures-v009')
  assert.equal(authored.length, 9)
  for (const unit of authored) {
    const course = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(course?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    assert(validLogistiqueExerciseTable(unit.table), unit.id)
    for (const diploma of unit.approvedFor) {
      const page = { ...config(diploma, unit.module, unit.kind), logistiquePresentation: unit.table.presentation }
      const draw = generateLogistique(page, 23)
      assert.equal(draw.bankQuestionCap, 1, unit.id)
      assert.deepEqual(draw.items[0].logistiqueTable, unit.table)
      assert(validLogistiquePages([{ ...page, libreItems: draw.items }]))
    }
  }
})

test('les choix multiples et les verdicts restent exacts dans le tirage et dans les recettes', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'choix-v011')
  assert.equal(units.length, 18)
  for (const unit of units) {
    const course = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(course?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    const presentation = unit.choice.kind === 'multiple' ? 'qcm-multiple' : 'vrai-faux'
    for (const diploma of ['CFC', 'AFP']) {
      const page = { ...config(diploma, unit.module, 'verification'), logistiquePresentation: presentation }
      const result = generateLogistique(page, 43)
      assert.equal(result.bankQuestionCap, Number(unit.approvedFor.includes(diploma)))
      if (!result.bankQuestionCap) continue
      const [item] = result.items
      assert.equal(item.logistiqueSource.id, unit.id)
      assert(reviewableLogistiqueAnswer(item))
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }])
      assert(validLogistiquePages([frozen]))
      assert.deepEqual(buildPage(frozen, 71).items, [item])
      assert.equal(generateLogistique({ ...page, logistiqueBankRevision: 'logistique-reponses-v009' }, 43).bankQuestionCap, 0)
      if (item.logistiqueChoice.kind === 'multiple') {
        assert.deepEqual(item.logistiqueChoice.correct, unit.choice.correct)
        assert.deepEqual(new Set(item.options), new Set(unit.options))
        assert(!validLogistiquePages([{ ...frozen, libreItems: [{ ...item, options: ['Autre', 'Choix'] }] }]))
      } else {
        assert.deepEqual(item.options, ['Vrai', 'Faux'])
        assert.equal(item.logistiqueChoice.justification, unit.choice.justification)
      }
    }
  }
  const local = newLogistiqueQuestion('103', 'verification', 'vrai-faux')
  assert(!reviewableLogistiqueAnswer({ ...local, prompt: 'Vérifiez cette affirmation.' }))
  assert(!reviewableLogistiqueAnswer({ ...local, prompt: 'Vérifiez cette affirmation.', answer: 'Vrai', logistiqueChoice: { kind: 'true-false', justification: '' } }))
  assert(reviewableLogistiqueAnswer({ ...local, prompt: 'Vérifiez cette affirmation.', answer: 'Vrai' }))
})

test('les documents professionnels gardent leurs sous-questions et leur corrigé après pagination', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'documents-v012')
  assert.equal(units.length, 4)
  for (const unit of units) {
    const course = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(course?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    assert(validLogistiqueExerciseTable(unit.table), unit.id)
    const incomplete = { ...unit.table, questions: unit.table.questions.slice(0, 2) }
    assert.equal(validLogistiqueExerciseTable(incomplete), false)
    for (const diploma of unit.approvedFor) {
      const page = { ...config(diploma, unit.module, unit.kind), logistiquePresentation: unit.table.presentation }
      const worksheet = buildPage(page, 25)
      const [item] = worksheet.items
      assert.deepEqual(item.logistiqueTable, unit.table)
      assert(reviewableLogistiqueAnswer(item))
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }])
      assert(validLogistiquePages([frozen]))
      assert.deepEqual(buildPage(frozen, 91).items, [item])
      const questions = [...unit.table.questions, ...unit.table.questions, ...unit.table.questions.slice(0, 2)]
      const longItem = { ...item, logistiqueTable: { ...unit.table, questions } }
      const longWorksheet = { ...worksheet, items: [longItem], blocks: [{ ...worksheet.blocks[0], items: [longItem] }] }
      const pages = splitLogistiquePages(longWorksheet, { a5: true, fontScale: 1.5 }).map((sheet) => ({ ...sheet, configIndex: 0 }))
      const ranges = pages.flatMap(({ blocks }) => blocks.flatMap(({ logistiqueTheorySlices }) => logistiqueTheorySlices ?? []))
        .flatMap(({ subquestionRange }) => subquestionRange ? [subquestionRange] : [])
      assert(ranges.length > 1)
      assert.deepEqual(ranges.flatMap(({ start, end }) => questions.slice(start, end)), questions)
      assert.deepEqual(blockItemsForConfig(pages, 0, 0).items, [longItem])
    }
  }
})

test('les associations textuelles mélangent les définitions sans perdre les paires corrigées', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'associations-v013')
  assert.equal(units.length, 8)
  for (const unit of units) {
    const theory = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(theory?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    for (const diploma of ['CFC', 'AFP']) {
      const page = { ...config(diploma, unit.module, 'verification'), logistiquePresentation: 'associer-textes' }
      const [item] = buildPage(page, 201).items
      assert.equal(item.logistiqueSource.id, unit.id)
      assert.deepEqual(item.vocabPairs, unit.pairs)
      const definitions = unit.pairs.map(({ right }) => right)
      assert.notDeepEqual(item.options, definitions)
      assert.deepEqual(new Set(item.options), new Set(definitions))
      assert(reviewableLogistiqueAnswer(item))
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }])
      assert(validLogistiquePages([frozen]))
      assert.deepEqual(buildPage(frozen, 82).items, [item])
      assert.equal(generateLogistique({ ...page, logistiqueBankRevision: 'logistique-documents-v012' }, 23).bankQuestionCap, 0)
    }
  }
  const unfinished = newLogistiqueQuestion('306', 'verification', 'associer-textes')
  assert(validLogistiquePages([{ ...config('AFP', '306', 'verification'), libreItems: [unfinished] }]))
  assert(!reviewableLogistiqueAnswer({ ...unfinished, prompt: 'Reliez les paires.' }))
  const sample = buildPage({ ...config('AFP', '406', 'verification'), logistiquePresentation: 'associer-textes' }, 25)
  const original = sample.items[0]
  const complete = [...original.vocabPairs, { left: 'Entrée', right: 'Arrivée des articles.' }, { left: 'Sortie', right: 'Départ des articles.' }]
  const extended = { ...original, vocabPairs: complete, labels: complete.map(({ left }) => left),
    options: complete.map(({ right }) => right).reverse() }
  const pages = splitLogistiquePages({ ...sample, items: [extended], blocks: [{ ...sample.blocks[0], items: [extended] }] },
    { a5: true, fontScale: 1.5 }).map((page) => ({ ...page, configIndex: 0 }))
  assert.equal(pages.length, 2)
  assert.deepEqual(pages.map(({ blocks }) => blocks[0].logistiqueTheorySlices[0].subquestionRange),
    [{ start: 0, end: 3 }, { start: 3, end: 6 }])
  assert.deepEqual(blockItemsForConfig(pages, 0, 0).items, [extended])
})

test('frises et décisions utilisent les sections du cours et respectent les diplômes', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'complementaires-v015')
  assert.equal(units.length, 8)
  for (const unit of units) {
    const theory = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(theory?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    assert(validLogistiqueExerciseTable(unit.table), unit.id)
    for (const diploma of ['CFC', 'AFP']) {
      const page = { ...config(diploma, unit.module, unit.kind), count: 5, logistiquePresentation: unit.table.presentation }
      const draw = generateLogistique(page, 71)
      const item = draw.items.find((entry) => entry.logistiqueSource.id === unit.id)
      assert.equal(Boolean(item), unit.approvedFor.includes(diploma))
      if (!item) continue
      assert.deepEqual(item.logistiqueTable, unit.table)
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }])
      assert(validLogistiquePages([frozen]))
      assert.deepEqual(buildPage(frozen, 267).items, [item])
    }
  }
})

test('les cas mixtes réunissent les trois réponses et dérivent le barème des sous-questions', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'cas-mixtes-v016')
  assert.equal(units.length, 4)
  for (const unit of units) {
    const theory = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(theory?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    assert(validLogistiqueExerciseTable(unit.table), unit.id)
    assert.equal(logistiqueCasePoints(unit.table), 6)
    const { questions } = unit.table
    assert.deepEqual(questions.map(({ kind }) => kind ?? 'redaction'), ['choix', 'calcul', 'redaction'])
    assert(!validLogistiqueExerciseTable({ ...unit.table, questions: questions.with(0, { ...questions[0], answer: 'Autre choix' }) }))
    assert(!validLogistiqueExerciseTable({ ...unit.table, questions: questions.with(1, { ...questions[1], calculation: '' }) }))
    for (const diploma of unit.approvedFor) {
      const page = { ...config(diploma, unit.module, 'situation'), logistiquePresentation: 'cas-mixte' }
      const worksheet = buildPage(page, 40)
      const [item] = worksheet.items
      assert.equal(item.points, 6)
      assert(reviewableLogistiqueAnswer(item))
      assert(allocateLogistiquePoints([item], 2, 1).conflict)
      assert(!validLogistiquePages([{ ...page, libreItems: [{ ...item, points: 2 }] }]))
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }], true)
      assert(validLogistiquePages([frozen]))
      const split = splitLogistiquePages(worksheet, { a5: true, fontScale: 1.5, evaluation: true }).map((sheet) => ({ ...sheet, configIndex: 0 }))
      assert.deepEqual(blockItemsForConfig(split, 0, 0).items, [item])
    }
  }
})

test('les processus gardent les étapes, les réponses et les suites dans l’ordre du cours', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'processus-v017')
  assert.equal(units.length, 6)
  for (const unit of units) {
    const theory = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(theory?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    assert(validLogistiqueExerciseTable(unit.table), unit.id)
    for (const diploma of unit.approvedFor) {
      const page = { ...config(diploma, unit.module, unit.kind), logistiquePresentation: 'processus-a-completer' }
      const worksheet = buildPage(page, 40)
      const [item] = worksheet.items
      assert.deepEqual(item.logistiqueTable, unit.table)
      assert(reviewableLogistiqueAnswer(item))
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }])
      assert(validLogistiquePages([frozen]))
      assert.equal(generateLogistique({ ...page, logistiqueBankRevision: 'logistique-cas-mixtes-v016' }, 20).bankQuestionCap, 0)
      const rows = [...unit.table.rows, ['Tracer', 'Enregistrer le résultat.'], ['Confirmer', { answer: 'Informer le prochain poste.' }]]
      const long = { ...item, logistiqueTable: { ...unit.table, rows } }
      assert(validLogistiqueExerciseTable(long.logistiqueTable))
      const pages = splitLogistiquePages({ ...worksheet, items: [long], blocks: [{ ...worksheet.blocks[0], items: [long] }] },
        { a5: true, fontScale: 1.5 }).map((sheet) => ({ ...sheet, configIndex: 0 }))
      assert.equal(pages.length, 2)
      assert.deepEqual(pages.flatMap(({ blocks }) => blocks[0].logistiqueTheorySlices ?? [])
        .flatMap(({ subquestionRange }) => rows.slice(subquestionRange.start, subquestionRange.end)), rows)
      assert.deepEqual(blockItemsForConfig(pages, 0, 0).items, [long])
    }
  }
})

test('les applications 300 à 600 suivent le cours, le programme du diplôme et les révisions de banque', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'applications-v019')
  assert.equal(units.length, 8)
  assert.equal(units.filter(({ approvedFor }) => approvedFor.includes('AFP')).length, 6)
  assert.deepEqual(units.map(({ module }) => module), ['302', '309', '402', '404', '502', '504', '602', '605'])
  for (const unit of units) {
    const theory = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(theory?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    assert(validLogistiqueExerciseTable(unit.table), unit.id)
    for (const diploma of ['CFC', 'AFP']) {
      const page = { ...config(diploma, unit.module, unit.kind), logistiquePresentation: unit.table.presentation }
      const [item] = generateLogistique(page, 20).items
      assert.equal(item?.logistiqueSource.id, unit.approvedFor.includes(diploma) ? unit.id : undefined)
      assert.equal(generateLogistique({ ...page, logistiqueBankRevision: 'logistique-graphiques-v018' }, 20).bankQuestionCap, 0)
      if (!item) continue
      assert(reviewableLogistiqueAnswer(item), unit.id)
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }], true)
      assert(validLogistiquePages([frozen]), unit.id)
      assert.deepEqual(buildPage(frozen, 30).items, [item])
    }
  }
})

test('les questions sur photo imposent un support élève et conservent leur présentation et leurs réponses', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'questions-photo-v023')
  assert.equal(units.length, 7)
  for (const unit of units) {
    const theory = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(theory?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    const { image, lines, presentation } = unit.photoTask
    assert(existsSync(root + '/public' + image.src), unit.id)
    for (const diploma of ['CFC', 'AFP']) {
      const page = { ...config(diploma, unit.module, 'verification'), logistiquePresentation: presentation }
      const [item] = generateLogistique(page, 20).items
      assert.equal(item?.logistiqueSource.id, unit.approvedFor.includes(diploma) ? unit.id : undefined)
      assert.equal(generateLogistique({ ...page, logistiqueBankRevision: 'logistique-distribution-illustree-v022' }, 20).bankQuestionCap, 0)
      if (!item) continue
      assert.equal(item.answer, unit.answer)
      assert.equal(item.logistiquePhotoPresentation, presentation)
      assert.deepEqual(item.logistiqueImage, image)
      assert.deepEqual(item.logistiqueResponseLines, { kind: 'simple', count: lines })
      assert(reviewableLogistiqueAnswer(item))
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }])
      assert(validLogistiquePages([frozen]))
      assert.deepEqual(buildPage(frozen, 30).items, [item])
      const missing = { ...item, logistiqueImage: undefined }
      const hidden = { ...item, logistiqueImage: { ...image, visibility: 'answers' } }
      assert(!reviewableLogistiqueAnswer(missing))
      assert(!validLogistiquePages([{ ...frozen, libreItems: [missing] }]))
      assert(!validLogistiquePages([{ ...frozen, a5RightLibre: { id: 'droite', items: [hidden] } }]))
    }
  }
})

test('les formulations relues gardent les données, le corrigé et les droits des mêmes exercices', () => {
  const previous = new Map(logistiquePublications.find(({ revision }) => revision === 'logistique-supports-4-3-v024').units
    .map((unit) => [unit.id, unit]))
  const units = currentLogistiquePublication.units.filter((unit) => unit.wording)
  const values = (text) => (text.match(/\d+(?:[’'.,]\d+)*/g) ?? []).sort()
  assert(units.length >= 600)
  assert.equal(new Set(units.filter(({ approvedFor }) => approvedFor.includes('AFP')).map(({ module }) => module)).size, 63)
  for (const unit of units) {
    const old = previous.get(unit.id)
    assert.deepEqual([unit.module, unit.kind, unit.answer, unit.calculation, unit.approvedFor],
      [old.module, old.kind, old.answer, old.calculation, old.approvedFor], unit.id)
    assert.equal(unit.prompt, unit.wording.normal)
    assert.notEqual(unit.wording.normal, unit.wording.falc, unit.id)
    assert.deepEqual(values(unit.wording.normal), values(old.prompt), unit.id)
    assert.deepEqual(values(unit.wording.falc), values(old.prompt), unit.id)
    for (const [index, question] of (unit.table?.questions ?? []).entries()) {
      const { wording, ...unchanged } = question
      assert.deepEqual(unchanged, old.table.questions[index], unit.id)
      if (wording) assert.deepEqual(values(wording.falc), values(unchanged.prompt), unit.id)
    }
  }
})

test('la relecture des calculs corrige les répétitions sans modifier le lot déjà relu', () => {
  const earlier = logistiquePublications.find(({ revision }) => revision === 'logistique-formulations-v025')
  const current = logistiquePublications.find(({ revision }) => revision === 'logistique-calculs-formulations-v026')
  const updated = new Map(current.units.map((unit) => [unit.id, unit]))
  for (const unit of earlier.units.filter(({ wording, kind }) => wording || kind !== 'maths')) {
    assert.strictEqual(updated.get(unit.id), unit)
  }
  const id = 'log-409-maths-v005-controle-1'
  assert.match(earlier.units.find((unit) => unit.id === id).prompt, /contrôles contrôlés/)
  const { wording } = updated.get(id)
  assert.match(wording.normal, /Le relevé porte sur 124 contrôles\. Il indique 13 écarts/)
  assert.match(wording.falc, /Il indique 13 écarts\.\nCalculez le taux d’écart en pourcentage/)
})

test('les vérifications des dossiers ont une version FALC qui garde la notion et les références', () => {
  const publication = logistiquePublications.find(({ revision }) => revision === 'logistique-verification-formulations-v027')
  const units = publication.units.filter(({ revision, kind }) => /^dossiers-\d{3}-v005$/.test(revision) && kind === 'verification')
  assert(units.every(({ wording }) => wording))
  assert.match(units.find(({ id }) => id === 'log-401-verification-v005-terme-1').wording.falc,
    /^Que veut dire « Affinage » \?\nRépondez avec vos mots\.$/u)
  assert.match(units.find(({ prompt }) => prompt.includes('$E$1')).wording.falc, /\$E\$1/u)
})

test('le choix Normal ou FALC garde le tirage, les deux moitiés et les changements locaux', () => {
  const page = { ...config('CFC', '301', 'maths'), count: 40 }
  const normal = generateLogistique(page, 17).items
  const falc = generateLogistique({ ...page, logistiqueWordingMode: 'falc' }, 17).items
  const afp = generateLogistique({ ...page, ...config('AFP', '301', 'maths'), count: 40 }, 17).items
  assert.deepEqual(falc.map(({ logistiqueSource, answer, calcAnswer }) => [logistiqueSource, answer, calcAnswer]),
    normal.map(({ logistiqueSource, answer, calcAnswer }) => [logistiqueSource, answer, calcAnswer]))
  const sample = falc.find((item) => item.logistiqueWording)
  assert(sample)
  assert.equal(sample.prompt, sample.logistiqueWording.falc)
  assert.equal(afp.find((item) => item.logistiqueSource.id === sample.logistiqueSource.id)?.prompt, sample.prompt)
  assert.equal(normal.find((item) => item.logistiqueSource.id === sample.logistiqueSource.id)?.prompt, sample.logistiqueWording.normal)
  const historical = generateLogistique({ ...page, logistiqueWordingMode: 'falc', logistiqueBankRevision: 'logistique-supports-4-3-v024' }, 17).items
  assert.equal(historical.find((item) => item.logistiqueSource.id === sample.logistiqueSource.id)?.logistiqueWording, undefined)

  const left = { ...sample, libreId: 'question-a', points: 3.5, libreLocked: true }
  const right = { ...left, libreId: 'question-b', prompt: 'Énoncé personnalisé par le formateur.', libreCorrectionPending: true }
  const [frozen] = freezeLogistiquePages([{ ...page, libreId: 'exercice-a', logistiqueWordingMode: 'falc', libreItems: [left],
    a5RightLibre: { id: 'exercice-b', items: [right] } }])
  assert(validLogistiquePages([frozen]))
  assert.equal(buildPage(pageForA5Half(frozen, 'left'), 17).items[0].prompt, left.prompt)
  assert.equal(buildPage(pageForA5Half(frozen, 'right'), 17).items[0].prompt, right.prompt)
  assert.deepEqual(applyLogistiqueWording(left, 'normal'), { ...left, prompt: left.logistiqueWording.normal })
  assert.strictEqual(applyLogistiqueWording(right, 'normal'), right)
  assert(!validLogistiquePages([{ ...frozen, logistiqueWordingMode: 'simplifie' }]))

  const casePage = { ...config('CFC', '308', 'situation'), logistiquePresentation: 'cas-mixte' }
  const [mixed] = generateLogistique(casePage, 17).items
  const simplified = applyLogistiqueWording(mixed, 'falc')
  assert.notEqual(simplified.prompt, mixed.prompt)
  assert.deepEqual(simplified.logistiqueTable.questions.map(({ prompt, wording, ...question }) => question),
    mixed.logistiqueTable.questions.map(({ prompt, wording, ...question }) => question))
  assert.equal(simplified.points, 6)
})

test('les deux présentations de graphiques gardent les valeurs, les repères et le corrigé', () => {
  const units = currentLogistiquePublication.units.filter(({ revision }) => revision === 'graphiques-v018')
  assert.equal(units.length, 4)
  for (const unit of units) {
    const theory = currentLogistiquePublication.units.find(({ module, kind }) => module === unit.module && kind === 'theorie')
    assert(theory?.blocks.some((block) => block.kind === 'heading' && block.text === unit.theorySection), unit.id)
    assert(validLogistiqueExerciseTable(unit.table), unit.id)
    assert(!validLogistiqueExerciseTable({ ...unit.table, rows: [['A', '12'], ['A', '5']] }))
    assert(!validLogistiqueExerciseTable({ ...unit.table, rows: [['A', '-1'], ['B', '5']] }))
    for (const diploma of unit.approvedFor) {
      const page = { ...config(diploma, unit.module, unit.kind), logistiquePresentation: unit.table.presentation }
      const [item] = buildPage(page, 30).items
      assert.deepEqual(item.logistiqueTable, unit.table)
      assert(reviewableLogistiqueAnswer(item))
      const [frozen] = freezeLogistiquePages([{ ...page, libreItems: [item] }])
      assert(validLogistiquePages([frozen]))
      assert.deepEqual(buildPage(frozen, 161).items, [item])
      assert.equal(generateLogistique({ ...page, logistiqueBankRevision: 'logistique-processus-v017' }, 20).bankQuestionCap, 0)
    }
  }
})

test('la trame de réception calcule les étapes liées, respecte les protections et fige le document', () => {
  const scenario = initialLogistiqueStory
  for (const diploma of ['CFC', 'AFP']) {
    const page = { ...config(diploma, '303', 'maths'), count: 3,
      logistiqueSelection: { modules: ['601', '303', '312'], quantities: { 303: 1, 312: 1, 601: 1 } },
      logistiqueEvaluation: { mode: 'histoire', story: scenario } }
    const draw = generateLogistique(page, 31)
    assert.equal(draw.bankQuestionCap, 3)
    assert.deepEqual(draw.items.map(({ logistiqueSource }) => logistiqueSource.module), ['303', '312', '601'])
    assert.match(draw.items[0].logistiqueNarrative, /Chez EnterSite, vous suivez/)
    assert(!draw.items[1].logistiqueNarrative.includes(scenario.company))
    assert.equal(draw.items[0].calcAnswer, '56 − 60 = -4')
    assert.equal(draw.items[1].calcAnswer, '56 − 5 = 51')
    assert.match(draw.items[2].answer, /44 unité.*7 unité.*0 unité/)
    assert.equal(draw.items.reduce((points, item) => points + item.points, 0), 9)
    assert.equal(validLogistiquePages([page]), true)
    const updatedStory = { ...scenario, ordered: 55 }
    const updated = applyLogistiqueStoryChange(scenario, updatedStory, page.logistiqueSelection.modules, draw.items)
    assert.strictEqual(updated.items[0], draw.items[0])
    assert.strictEqual(updated.items[1], draw.items[1])
    assert.match(updated.items[2].answer, /51 unité.*0 unité.*4 unité/)
    assert(applyLogistiqueStoryChange(scenario, updatedStory, page.logistiqueSelection.modules,
      draw.items.with(2, { ...draw.items[2], libreLocked: true })).conflict)
    assert(applyLogistiqueStoryChange({ ...scenario, introductionLocked: true },
      { ...updatedStory, introductionLocked: true }, page.logistiqueSelection.modules).conflict)
    const [frozen] = freezeLogistiquePages([page], true)
    assert.deepEqual(frozen.libreItems, draw.items)
    assert.deepEqual(buildPage(frozen, 55).items, draw.items)
    const independent = { ...frozen, logistiqueEvaluation: { mode: 'independantes', story: scenario } }
    assert(buildPage(independent, 55).items.every((item) => !item.logistiqueNarrative))
    assert.match(frozen.libreItems[0].logistiqueNarrative, /Chez EnterSite/)
    assert.equal(validLogistiquePages([{ ...page, logistiqueSelection: { modules: ['105'] } }]), false)
    assert.equal(validLogistiquePages([{ ...page, logistiqueEvaluation: { mode: 'histoire', story: { ...scenario, held: 99 } } }]), false)
  }
  assert(validLogistiqueStory(logistiqueStoryVariant(scenario, 20261127)))
  assert.deepEqual(logistiqueStoryVariant(scenario, 20261127), logistiqueStoryVariant(scenario, 20261127))
})

test('une introduction longue se poursuit avant les calculs sans dupliquer les questions', () => {
  const story = {
    ...initialLogistiqueStory,
    introduction: Array(11).fill('Le lot reste au quai pendant le contrôle.').join('\n'),
  }
  const page = buildPage({ ...config('AFP', '303', 'maths'), count: 3,
    logistiqueSelection: { modules: ['303', '312', '601'], quantities: { 303: 1, 312: 1, 601: 1 } },
    logistiqueEvaluation: { mode: 'histoire', story },
  }, 31)
  const sheets = splitLogistiquePages(page, { a5: true, fontScale: 1.5, evaluation: true })
  assert.deepEqual(sheets.flatMap((sheet) => sheet.items), page.items)
  const contexts = sheets.flatMap((sheet) => sheet.blocks.filter((block) => block.document))
  assert(contexts.length > 1)
  assert.equal(contexts.map((block) => block.document.text).join(' ').replace(/\s+/g, ' '),
    page.items[0].logistiqueNarrative.replace(/\s+/g, ' '))
  assert(sheets.slice(0, contexts.length).every((sheet) => !sheet.items.length))
  assert.deepEqual(sheets[contexts.length].blocks[0].logistiqueDetachedNarratives, [0])
})

test('une évaluation enregistrée peut servir de modèle avec des questions renouvelées par module', () => {
  for (const diploma of ['CFC', 'AFP']) {
    const page = { ...config(diploma, '303', 'maths'), count: 4,
      logistiqueSelection: { modules: ['303', '312'], quantities: { 303: 2, 312: 2 } },
      logistiqueEvaluation: { mode: 'independantes', targetPoints: 10, targetMinutes: 15 }, contentSeed: 17 }
    const seed = 110
    const fromBank = buildPage(page, seed).items
    const slots = fromBank.map((item, index) => ({ ...item, libreId: `question-${index}`, points: index + 1 }))
    slots[0].libreLocked = true
    const savedPage = { ...page, libreId: 'activite-garde', libreItems: slots, libreInstruction: 'Montrez votre démarche.' }
    const recipe = { version: 1, pages: freezeLogistiquePages([savedPage], true), seed, evalMode: true,
      institutional: { documentTitle: 'Évaluation logistique' }, pointsPerQuestion: 1, libreMode: false, libreSnapshot: null }
    const untouched = structuredClone(recipe)
    assert(canReuseLogistiqueEvaluation(recipe))
    const result = reuseLogistiqueEvaluation(recipe, 20261128)
    assert(!result.error, result.error)
    assert.match(result.notice, /3 questions renouvelées/)
    const [fresh] = result.recipe.pages
    assert.deepEqual(recipe, untouched)
    assert.strictEqual(fresh.libreItems[0], slots[0])
    assert.equal(fresh.libreInstruction, page.libreInstruction ?? savedPage.libreInstruction)
    assert.deepEqual(fresh.logistiqueSelection, page.logistiqueSelection)
    assert.deepEqual(fresh.logistiqueEvaluation, page.logistiqueEvaluation)
    assert.deepEqual(fresh.libreItems.map((item) => item.points), [1, 2, 3, 4])
    assert.deepEqual(fresh.libreItems.map((item) => item.logistiqueSource.module), slots.map((item) => item.logistiqueSource.module))
    assert(fresh.libreItems.slice(1).every((item) => !slots.some((source) => source.logistiqueSource.id === item.logistiqueSource.id)))
    assert(parseFicheRecipe(result.recipe))
    const double = reuseLogistiqueEvaluation({ ...recipe, sheetFormat: 'a5-double-landscape' }, 20261128)
    assert(!double.error, double.error)
    assert(parseFicheRecipe(double.recipe))
    const [both] = double.recipe.pages
    assert.strictEqual(both.libreItems[0], slots[0])
    assert(both.a5RightLibre.items.length > 0)
    assert(buildPage(pageForA5Half(both, 'left'), seed).items.every((item, index) => item.answer === both.libreItems[index].answer))
    assert.deepEqual(buildPage(pageForA5Half(both, 'right'), seed).items, both.a5RightLibre.items)
  }
})

test('un nouveau tirage narratif respecte les passages protégés et laisse l’original intact', () => {
  const story = { ...initialLogistiqueStory, passages: { 303: { text: 'Vous contrôlez la réception.', locked: true } } }
  const page = { ...config('AFP', '303', 'maths'), count: 3,
    logistiqueSelection: { modules: ['303', '312', '601'], quantities: { 303: 1, 312: 1, 601: 1 } },
    logistiqueEvaluation: { mode: 'histoire', story } }
  const recipe = { version: 1, pages: freezeLogistiquePages([page], true), institutional: {},
    seed: 99, evalMode: true, pointsPerQuestion: 1, libreMode: false, libreSnapshot: null }
  const result = reuseLogistiqueEvaluation(recipe, 20261128)
  assert(!result.error, result.error)
  const [fresh] = result.recipe.pages
  assert.equal(fresh.logistiqueEvaluation.story.expected, story.expected)
  assert.equal(fresh.logistiqueEvaluation.story.received, story.received)
  assert.deepEqual(fresh.logistiqueEvaluation.story.passages, story.passages)
  assert.deepEqual(fresh.libreItems[0], recipe.pages[0].libreItems[0])
  assert.notDeepEqual(fresh.libreItems[2], recipe.pages[0].libreItems[2])
  assert(parseFicheRecipe(result.recipe))
  const blocked = { ...page, logistiqueEvaluation: { mode: 'histoire', story: { ...story, introductionLocked: true } } }
  assert.match(reuseLogistiqueEvaluation({ ...recipe, pages: [blocked] }, 20261128).error, /Déverrouillez l’introduction/)
  assert.match(reuseLogistiqueEvaluation({ ...recipe, pages: [{ ...page, logistiqueBankRevision: 'absente' }] }, 25).error, /révision de banque/)
})

test('la trame inventaire, FIFO et préparation recalcule les seules questions liées', () => {
  for (const diploma of ['CFC', 'AFP']) {
    const story = initialInventoryStory
    const page = { ...config(diploma, '701', 'maths'), count: 3,
      logistiqueSelection: { modules: ['601', '701', '406'], quantities: { 601: 1, 701: 1, 406: 1 } },
      logistiqueEvaluation: { mode: 'histoire', story } }
    const items = generateLogistique(page, 25).items
    assert.deepEqual(items.map((item) => item.logistiqueSource.module), ['701', '406', '601'])
    assert.equal(items[0].calcAnswer, '84 − 88 = -4')
    assert.match(items[1].answer, /24 unités.*34 unités/)
    assert.match(items[2].answer, /58 unités.*26 unités.*0 unité/)
    const changed = applyLogistiqueStoryChange(story, { ...story, held: 28 }, page.logistiqueSelection.modules, items)
    assert.strictEqual(changed.items[0], items[0])
    assert.match(changed.items[1].answer, /28 unités.*30 unités/)
    assert.strictEqual(changed.items[2], items[2])
    const enlarged = generateLogistique({ ...page, logistiqueEvaluation: { ...page.logistiqueEvaluation,
      story: { ...story, ordered: 100 } } }, 25).items
    assert.match(enlarged[1].answer, /24 unités.*60 unités/)
    assert.match(enlarged[2].answer, /84 unités.*0 unité.*16 unités/)
    const intendedOrder = { ...story, passages: { 406: { text: 'Le lot ancien sort d’abord.', locked: true } } }
    assert(applyLogistiqueStoryChange(intendedOrder, { ...intendedOrder, held: 20 }, page.logistiqueSelection.modules).conflict)
    assert(!applyLogistiqueStoryChange(intendedOrder, { ...intendedOrder, expected: 81 }, page.logistiqueSelection.modules).conflict)
    assert(validLogistiquePages([page]))
    assert(!validLogistiquePages([{ ...page, logistiqueSelection: { modules: ['312'] } }]))
    assert(!validLogistiqueStory({ ...story, passages: { 303: { text: 'Au quai.' } } }))
    const [frozen] = freezeLogistiquePages([page], true)
    assert.deepEqual(buildPage(frozen, 77).items, items)
  }
})

test('le barème atteint la cible par demi-points et la durée compte une seule lecture commune', () => {
  const page = { ...config('AFP', '303', 'maths'), count: 3,
    logistiqueSelection: { modules: ['303', '312', '601'], quantities: { 303: 1, 312: 1, 601: 1 } },
    logistiqueEvaluation: { mode: 'histoire', story: initialLogistiqueStory, targetPoints: 10, readingMinutes: 3.5, reviewMinutes: 1.5 },
  }
  const [first, second, third] = generateLogistique(page, 7).items
  const locked = { ...first, logistiqueAssessment: { ...first.logistiqueAssessment, pointsLocked: true } }
  const ungraded = { layout: 'text', prompt: 'Rappel', answer: '', noPoints: true }
  const items = [locked, second, third, ungraded]
  const result = allocateLogistiquePoints(items, 10, 1)
  assert.deepEqual(result.items.slice(0, 3).map(({ points }) => points), [3, 2.5, 4.5])
  assert.strictEqual(result.items[0], locked)
  assert.strictEqual(result.items[3], ungraded)
  assert(result.items[1].logistiqueRetained)
  assert(allocateLogistiquePoints(items, 3.5, 1).conflict)
  assert(allocateLogistiquePoints(items, 10, 0).conflict)
  assert(allocateLogistiquePoints([locked, { ...third, libreLocked: true }], 12, 1).conflict)
  const [frozen] = freezeLogistiquePages([{ ...page, libreItems: result.items }], true)
  assert(validLogistiquePages([frozen]))
  assert.deepEqual(buildPage(frozen, 23).items, result.items)
  assert.deepEqual(logistiqueDuration(items.slice(0, 3), page.logistiqueEvaluation, 'AFP'),
    { questions: 10.5, reading: 3.5, review: 1.5, total: 16 })
  assert.equal(logistiqueDuration(items.slice(0, 3), { mode: 'histoire' }, 'AFP').total, 14)
  assert.equal(validLogistiquePages([{ ...page, logistiqueEvaluation: { ...page.logistiqueEvaluation, readingMinutes: '2' } }]), false)
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
    assert.deepEqual(wrapped.logistiqueWrappedFigures.map(({ start, end }) => wrapped.items.slice(start, end)), [items.slice(3)])
    assert(wrapped.items.includes(items[2]), 'Le titre reste avec la photo')
  }

  const withBreak = { ...block, tcfPageBreakAfter: [false, false, false, true] }
  const sheets = splitLogistiquePages({ items, blocks: [withBreak] })
  assert.equal(sheets.find(({ items: pageItems }) => pageItems.includes(items[3])).items.at(-1), items[3])
  assert(sheets.every(({ blocks }) => blocks.every(({ logistiqueWrappedFigures }) => !logistiqueWrappedFigures?.length)))
  assert.deepEqual(sheets.flatMap((sheet) => sheet.items), items)
})

test('le 101 présente trois vues distinctes de la chaîne moderne et une carte pour chaque route', () => {
  for (const diploma of ['CFC', 'AFP']) for (const logistiqueTheoryView of ['complet', 'resume']) {
    const page = { ...config(diploma, '101', 'theorie'), logistiqueTheoryView }
    const blocks = generateLogistique(page, 7).items.map(({ theoryBlock }) => theoryBlock)
    const previous = generateLogistique({ ...page, logistiqueBankRevision: 'logistique-glossaires-tableaux-v006' }, 7)
      .items.map(({ theoryBlock }) => theoryBlock)
    const chain = blocks.find((block) => block.kind === 'image-row' && block.label === 'Approvisionnement, production, distribution')
    assert.deepEqual(chain?.cells.map(({ caption }) => caption), ['Approvisionnement', 'Production', 'Distribution'])
    assert.equal(new Set(chain.cells.map(({ src }) => src)).size, 3)
    for (const [route, word] of [['soie', 'Soie'], ['ambre', 'ambre']]) {
      const index = blocks.findIndex((block) => block.src?.endsWith(`log-101-carte-${route}-v004.webp`))
      assert(index > 0 && blocks[index - 1].kind === 'paragraph', route)
      assert(blocks.slice(0, index).findLast((block) => block.kind === 'heading')?.text.includes(word), route)
    }
    assert(previous.some((block) => block.src?.endsWith('log-101-chaine-moderne-photo-v002.webp')))
  }
})

test('le 103 place les objectifs avant les activités et illustre les 6 + 2 B séparément', () => {
  for (const diploma of ['CFC', 'AFP']) for (const logistiqueTheoryView of ['complet', 'resume']) {
    const page = { ...config(diploma, '103', 'theorie'), logistiqueTheoryView }
    const blocks = generateLogistique(page, 7).items.map(({ theoryBlock }) => theoryBlock)
    const objectives = blocks.findIndex((block) => block.kind === 'heading' && block.text === 'Objectifs de la logistique')
    assert(objectives >= 0)
    assert(blocks[objectives + 1].src.endsWith('log-103-objectifs-schema-v004.webp'))
    assert.match(blocks[objectives + 2].text, logistiqueTheoryView === 'complet' ? /^Les principales activités/ : /^Un dépôt cherche/)

    const rows = blocks.filter((block) => block.kind === 'image-row')
    assert.deepEqual(rows.map(({ cells }) => cells.length), [3, 3, 2])
    assert.equal(rows[0].caption, 'Les 6 B de la logistique')
    assert.equal(rows[2].caption, 'Les 2 B complémentaires')
    const cells = rows.flatMap((row) => row.cells)
    assert.deepEqual(cells.map(({ caption }) => caption), [
      'Bonne marchandise', 'Bonne quantité', 'Bonne qualité', 'Bon moment',
      'Bon endroit', 'Bon prix / coût', 'Bonnes informations', 'Bon client',
    ])
    assert.equal(new Set(cells.map(({ src }) => src)).size, 8)
    assert(cells.every(({ src, alt, description }) => src.endsWith('.webp') && alt && description))
    const previous = generateLogistique({ ...page, logistiqueBankRevision: 'logistique-theorie-101-v004' }, 7)
    assert(!previous.items.some(({ theoryBlock }) => theoryBlock.kind === 'image-row'))
  }
})

test('les paragraphes continuent à habiller la même photo jusqu’au saut de page explicite', () => {
  const items = [
    { kind: 'image', src: '/assets/logistique/log-101-ambre-photo-v003.webp', alt: 'Ambre', caption: 'Échange d’ambre sur la côte baltique.' },
    { kind: 'paragraph', text: 'Des marchands examinent l’ambre sur les plages de la côte baltique. ' },
    { kind: 'paragraph', text: 'La résine est utilisée pour faire des bijoux et se vend plus au sud.' },
    { kind: 'heading', text: 'Suivre la route' },
  ].map((theoryBlock) => ({ layout: 'theory', theoryBlock, answer: '' }))
  const block = { title: 'Théorie', items, exerciseIndex: 1, exerciseType: 'log-afp-101-theorie' }
  const [sheet] = splitLogistiquePages({ items, blocks: [block] })
  assert.deepEqual(sheet.blocks[0].logistiqueWrappedFigures, [{ start: 0, end: 3 }])
  const pages = splitLogistiquePages({ items, blocks: [{ ...block, tcfPageBreakAfter: [false, true] }] })
  assert.deepEqual(pages[0].items, items.slice(0, 2))
  assert.deepEqual(pages[1].items, items.slice(2))
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
