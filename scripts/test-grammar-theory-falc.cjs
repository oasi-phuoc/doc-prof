const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { load, root } = require('./gattegno-loader.cjs')

const { GRAMMAIRE_THEORY_DOCS: docs, theoryDocByTypeId } = load(root + '/src/grammaire/theory/index.ts')
const { falcOpenings } = load(root + '/src/grammaire/theory/falc-openings.ts')
const { falcLessonBlocks } = load(root + '/src/grammaire/theory/falc-lesson.ts')
const { falcRevisions } = load(root + '/src/grammaire/theory/falc-revisions.ts')
const { tryGenerateGrammaireBlock } = load(root + '/src/grammaire/generate.ts')
const { theorySpacerDivisor } = load(root + '/src/francais/grammar-theory.ts')
const { buildWorksheets } = load(root + '/src/math/generate.ts')
const { defaultPage } = load(root + '/src/math/catalog.ts')
const { pageForA5Half } = load(root + '/src/components/generator/sheet-format.ts')

function leaves(blocks) {
  return blocks.flatMap(block => {
    if (block.kind === 'section') return leaves(block.blocks)
    if (block.kind === 'page' || (block.kind === 'paragraph' && theorySpacerDivisor(block.text))) return []
    return [block]
  })
}

function unitTexts(block) {
  if (block.kind === 'examples') {
    return block.items.flatMap(item => typeof item === 'string' ? [item] : [item.text, item.wrong].filter(Boolean))
  }
  if (block.kind === 'table') return [...block.headers, ...block.rows.flat()]
  return typeof block.text === 'string' ? [block.text] : []
}

function configFor(doc) {
  return { ...defaultPage('grammaire'), topic: doc.topic, exerciseType: doc.typeId, columns: 1, count: 1 }
}

assert.equal(docs.length, 98)
assert.deepEqual(Object.keys(falcOpenings).sort(), docs.map(doc => doc.id).sort())
assert.equal(theoryDocByTypeId['gram-a5-theorie'], theoryDocByTypeId['gram-a4-theorie'])

let sourceBlocks = 0
let revisedTexts = 0
for (const doc of docs) {
  const config = configFor(doc)
  const revisions = falcRevisions[doc.id] ?? {}
  const blocks = falcLessonBlocks(doc)
  const printed = blocks.filter(block => block.kind !== 'page')
  assert(!blocks.some(block => block.kind === 'section'), doc.typeId)
  assert(printed[1].kind === 'examples' || printed[1].kind === 'image-row', doc.typeId)
  assert(printed[2].text.trim(), doc.typeId)

  const source = leaves(doc.blocks)
  const retained = printed.filter((block, index) => index !== 1 && index !== 2 &&
    !(block.kind === 'heading' && block.sub && block.text === falcOpenings[doc.id].reference))
  assert.equal(retained.length, source.length, doc.typeId)
  const originalStrings = new Set(source.flatMap(unitTexts))
  for (const key of Object.keys(revisions)) assert(originalStrings.has(key), `reformulation sans source dans ${doc.typeId}: ${key}`)
  revisedTexts += Object.keys(revisions).length
  sourceBlocks += source.length
  for (const [index, old] of source.entries()) {
    const active = retained[index]
    const expected = unitTexts(old).map(text => (revisions[text] ?? text).replace(/^\{c\}Attention\s*:\s*\{\/c\}\s*/u, ''))
    assert.deepEqual(unitTexts(active), expected, `${doc.typeId} bloc ${index}`)
  }

  const readBlocks = sheets => sheets.flatMap(sheet => sheet.items.map(item => item.theoryBlock))
  const a4 = buildWorksheets([config], 1)
  const a5 = buildWorksheets([pageForA5Half(config, 'left')], 1)
  assert.deepEqual(readBlocks(a4), printed, doc.typeId)
  assert.deepEqual(readBlocks(a5), printed, doc.typeId)
  assert(a4.every(sheet => sheet.items.at(-1).theoryBlock.kind !== 'heading'), doc.typeId)
  assert(a5.every(sheet => sheet.items.at(-1).theoryBlock.kind !== 'heading'), doc.typeId)
  assert(a4.every(sheet => sheet.items.every(item => item.grammarTheoryFalc)), doc.typeId)
}

const map = theoryDocByTypeId['gram-e6-theorie']
const illustration = falcLessonBlocks(map)[1]
assert.equal(illustration.cells.length, 2)
for (const image of illustration.cells) {
  assert(image.alt && image.caption)
  assert(fs.statSync(path.join(root, 'public', image.src)).size > 0)
}

const etre = configFor(theoryDocByTypeId['gram-m2-theorie'])
const oldBreaks = [false, false, false, false, true, false]
const legacyItems = tryGenerateGrammaireBlock({ ...etre, tcfPageBreakAfter: oldBreaks }, 1).items
assert.equal(legacyItems.length, oldBreaks.length)
assert(legacyItems.some(item => item.theoryBlock?.kind === 'section'))
const libreItems = structuredClone(legacyItems)
libreItems[1].theoryBlock.text = 'J’habite près de la gare.'
const reopened = buildWorksheets([{
  ...etre,
  libreItems: JSON.parse(JSON.stringify(libreItems)),
  tcfPageBreakAfter: oldBreaks,
}], 1)
assert.deepEqual(reopened.flatMap(sheet => sheet.items), JSON.parse(JSON.stringify(libreItems)))
assert.equal(reopened.length, 2)

const practice = { ...etre, topic: 'gram-espace', exerciseType: 'gram-ex-e1-qcm-verbe' }
const mixed = buildWorksheets([{ ...practice, tcfPageBreakAfter: [false, false], extraBlocks: [etre, practice] }], 1)
const mixedTheory = mixed.filter(sheet => sheet.blocks[0].sourceBlockIndex === 1)
assert.deepEqual(mixedTheory.flatMap(sheet => sheet.items), buildWorksheets([etre], 1).flatMap(sheet => sheet.items))
assert.equal(mixed[0].blocks[0].sourceBlockIndex, 0)
assert.equal(mixed.at(-1).blocks[0].sourceBlockIndex, 2)

console.log(JSON.stringify({ fiches: docs.length, sourceBlocks, revisedTexts, compatibility: 'catalogue, double A5, ancien Libre et fiche mixte' }))
