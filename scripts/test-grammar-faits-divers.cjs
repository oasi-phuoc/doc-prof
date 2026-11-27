const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const { readFileSync } = require('node:fs')
const { load, root } = require('./gattegno-loader.cjs')

const { GRAMMAR_PILOT_BANKS, defaultGrammarPilot } = load(root + '/src/grammaire/curriculum/registry.ts')
const { generateGrammarSelection, grammarEligibleCount } = load(root + '/src/grammaire/curriculum/generate.ts')
const { grammarItems } = load(root + '/src/grammaire/curriculum/items.ts')
const { adaptSourceItem } = load(root + '/src/interactive/domain/source-adapters.ts')
const { isGrammarSnapshot } = load(root + '/src/grammaire/curriculum/validation.ts')
const { buildGrammairePracticeTypes } = load(root + '/src/grammaire/exercises/catalog-exercises.ts')
const { bankForType } = load(root + '/src/grammaire/exercises/bank/index.ts')
const { isRetiredGrammarType } = load(root + '/src/grammaire/curriculum/retirement.ts')
const { buildFicheRecipe, parseFicheRecipe } = load(root + '/src/fiches/recipe.ts')
const { offerings } = require('../docs/grammaire/implementation/target-registry.json')

const banks = GRAMMAR_PILOT_BANKS.filter(bank => bank.topic === 'gram-faits')
const byOffer = (id, level, presentation) => [id, level, presentation].join('/')
const expected = offerings.filter(offer => offer.themeId === 'gram-faits')
  .map(offer => byOffer(offer.activityId, offer.level, offer.presentation)).sort()
const actual = banks.flatMap(bank => bank.presentations.map(presentation =>
  byOffer(bank.activityId, bank.level, presentation))).sort()
assert.deepEqual(actual, expected)
assert.equal(actual.length, 35)
assert.equal(banks.length, 28)

const types = buildGrammairePracticeTypes()
let variants = 0
let errorSpans = 0
let documents = 0
let scenarios = 0
for (const bank of banks) {
  assert.equal(types.filter(type => type.id === bank.activityId && type.label === bank.label).length, 1)
  assert.equal(bank.review.humanReview, 'pending')
  assert.equal(bank.editorialStatus, 'reviewed')
  assert.equal(isRetiredGrammarType(bank.activityId), true)
  assert.equal(bankForType(bank.activityId).length, 0)
  assert.equal(bank.units.length, bank.presentations.includes('document-set') ? 20 : 50)
  for (const presentation of bank.presentations) {
    const document = presentation === 'document-set'
    const config = {
      domain: 'grammaire', topic: 'gram-faits', exerciseType: bank.activityId, difficulty: 'facile',
      columns: 1, count: document ? 1 : 50, ...defaultGrammarPilot(bank.activityId),
      grammarLevel: bank.level, grammarPresentation: presentation,
      ...(document ? { grammarDocumentCount: 20 } : {}),
    }
    const seed = 839
    const selected = generateGrammarSelection(config, seed)
    assert(isGrammarSnapshot(selected))
    assert.deepEqual(selected, generateGrammarSelection(config, seed))
    assert.notDeepEqual(selected.questions.map(question => question.id),
      generateGrammarSelection(config, seed + 1).questions.map(question => question.id))
    assert.equal(grammarEligibleCount(config), bank.units.length)
    assert.equal(selected.questions.length, bank.units.length)
    const input = {
      pages: [config], seed, institutional: {}, evalMode: false, pointsPerQuestion: 1,
      libreMode: false, libreSnapshot: null,
    }
    const recipe = buildFicheRecipe(input)
    const restored = parseFicheRecipe(JSON.parse(JSON.stringify(recipe)))
    assert(restored)
    assert.deepEqual(restored.pages[0].grammarSnapshot, recipe.pages[0].grammarSnapshot)
    const projected = grammarItems(selected).flatMap(item => {
      const adapted = adaptSourceItem(item, bank.activityId, selected.instruction)
      assert.deepEqual(adapted.issues, [])
      return adapted.items
    })
    assert.equal(projected.length, document ? 60 : 50)
    if (presentation === 'choice') {
      assert(projected.every(item => item.choices.length === 3 && item.choices.some(choice => choice.id === item.correctId)))
      if (bank.subthemeId === 'j7') {
        assert(projected.some(item => item.model.includes('s’il avait retrouvé sa pochette')))
        assert(projected.some(item => item.model.includes('ce qu’il avait entendu')))
        assert(projected.every(item => !/’\s+il\b/u.test(item.model)))
      }
    } else if (!document) {
      assert(projected.every(item => item.teacherLed && !item.correctId))
    }
    variants += document ? bank.units.reduce((count, unit) => count + unit.questions.length, 0) : bank.units.length
  }
  for (const unit of bank.units) {
    if (unit.kind === 'correct') {
      assert.equal(unit.prompt.slice(unit.error.start, unit.error.end), unit.error.text)
      assert.notEqual(unit.prompt, unit.answers[0])
      errorSpans++
    } else if (unit.kind === 'reading') {
      assert.equal(unit.questions.length, 3)
      assert(unit.questions.every(question => question.evidence.every(quote => unit.text.includes(quote))))
      documents++
    } else if (unit.kind === 'scenario') {
      assert.equal(unit.contract, 'open')
      assert.equal(unit.roles.length, 2)
      assert(unit.answers[0].includes(unit.followUps[0]))
      scenarios++
    }
  }
}

assert.equal(variants, 1770)
assert.equal(errorSpans, 150)
assert.equal(documents, 40)
assert.equal(scenarios, 100)
const unit = (subtheme, level, slug, presentation = 'choice') => banks
  .find(bank => bank.subthemeId === subtheme && bank.level === level && bank.presentations.includes(presentation))
  .units.find(item => item.id.endsWith('-' + slug))
assert.equal(unit('j6', 'B1', 'animaux').answers[0], 'ont été mis')
assert.equal(unit('j6', 'B1', 'fontaine').answers[0], 'sera remise')
assert.equal(unit('j7', 'B1', 'pochette').answers[0], 's’')
assert.equal(unit('j7', 'B1', 'moto').answers[0], 'ce qu’')
assert.equal(unit('j8', 'A2', 'rampe').answers[0], 'pourrais')
assert.equal(unit('j8', 'B1', 'courrier').answers[0], 'ouvriraient')
assert.equal(unit('j9', 'A2', 'habits').answers[0], 'me changerai')
assert.equal(unit('j9', 'B1', 'habits').answers[0], 'me changerais')
assert.equal(unit('j10', 'B1', 'ponton').answers[0], 'serions descendues')
assert.equal(unit('j10', 'B1', 'marche').answers[0], 'seraient venues')

const files = ['j6', 'j7', 'j8', 'j9', 'j10'].map(subtheme =>
  root + '/src/grammaire/curriculum/data/' + subtheme + '.json')
const original = files.map(file => readFileSync(file, 'utf8'))
execFileSync('python3', [root + '/scripts/build-grammar-faits-divers.py'])
assert.deepEqual(files.map(file => readFileSync(file, 'utf8')), original)
console.log(JSON.stringify({ status: 'passed', offerings: actual.length, variants, documents, errorSpans, scenarios }))
