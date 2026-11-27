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

const themes = new Set(['gram-argumenter', 'gram-exprimer'])
const banks = GRAMMAR_PILOT_BANKS.filter(bank => themes.has(bank.topic) && bank.subthemeId !== 'k10')
const byOffer = (id, level, presentation) => [id, level, presentation].join('/')
const expected = offerings.filter(offer => themes.has(offer.themeId) && offer.pedagogicalNotionId !== 'k10')
  .map(offer => byOffer(offer.activityId, offer.level, offer.presentation)).sort()
const actual = banks.flatMap(bank => bank.presentations.map(presentation =>
  byOffer(bank.activityId, bank.level, presentation))).sort()
assert.deepEqual(actual, expected)
assert.equal(actual.length, 73)
assert.equal(banks.length, 58)

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
  assert.equal(bank.units.length, bank.presentations.includes('document-set') ? 20 : 60)
  for (const presentation of bank.presentations) {
    const document = presentation === 'document-set'
    const config = {
      domain: 'grammaire', topic: bank.topic, exerciseType: bank.activityId, difficulty: 'facile',
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
    assert.equal(selected.questions.length, document ? 20 : 50)
    if (!document) assert(selected.questions.some(question => question.unit.source.position >= 50))
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
    assert.equal(projected.length, document ? (bank.subthemeId === 'k13' ? 80 : 60) : presentation === 'match' ? 100 : 50)
    if (presentation === 'choice') {
      assert(projected.every(item => item.choices.length === 3 && item.choices.some(choice => choice.id === item.correctId)))
    } else if (['gap', 'transform', 'correct', 'order', 'open-written', 'open-oral', 'scenario-set'].includes(presentation)) {
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
      assert.equal(unit.questions.length, bank.subthemeId === 'k13' ? 4 : 3)
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

assert.equal(variants, 4400)
assert.equal(errorSpans, 300)
assert.equal(documents, 120)
assert.equal(scenarios, 120)
const unit = (subtheme, level, slug, presentation = 'choice') => banks
  .find(bank => bank.subthemeId === subtheme && bank.level === level && bank.presentations.includes(presentation))
  .units.find(item => item.id.endsWith('-' + slug))
assert.equal(unit('k9', 'B1', 'jardin').answers[0], 'y en')
assert.equal(unit('k9', 'B1', 'dossier', 'transform').answers[0], 'Nadir ne le leur transmet pas.')
assert.equal(unit('k11', 'B1', 'chariot', 'transform').answers[0], 'Je m’en contente.')
assert.equal(unit('k12', 'B1', 'tournee').answers[0], 'soient venus')
assert.equal(unit('k13', 'B1', 'panier').answers[0], 'prend')
assert.equal(unit('k7', 'B1', 'cour').answers[0], 'Bien que')
for (const [subtheme, level, marker] of [
  ['k3', 'A2', ', car la cour était inondée.'],
  ['k4', 'A2', 'C’est pourquoi les élèves ont pris leur pause sous le préau.'],
  ['k6', 'B1', 'En revanche, les élèves du bâtiment B sont rentrés en classe.'],
]) {
  const reading = unit(subtheme, level, 'cour', 'document-set')
  assert(reading.questions[0].evidence.some(passage => passage.includes(marker)))
}
for (const subtheme of ['k12', 'k13']) {
  const reading = unit(subtheme, 'B1', 'panier', 'document-set')
  assert.equal(reading.questions[2].answers[0], 'Pour les poires.')
  assert(reading.questions[2].evidence[0].includes('trop petits pour les poires'))
}
const condition = unit('k13', 'B1', 'cable', 'document-set').questions[3]
assert.equal(condition.response, 'short')
assert.equal(condition.answers[0], 'Il faut l’examiner.')
assert(condition.evidence[0].includes('tant qu’il n’aura pas été examiné'))
assert.deepEqual(require('../src/grammaire/curriculum/data/k10.json'), GRAMMAR_PILOT_BANKS.filter(bank => bank.subthemeId === 'k10'))

const files = [...new Set(banks.map(bank => bank.subthemeId))].map(subtheme =>
  root + '/src/grammaire/curriculum/data/' + subtheme + '.json')
const original = files.map(file => readFileSync(file, 'utf8'))
execFileSync('python3', [root + '/scripts/build-grammar-arguments.py'])
assert.deepEqual(files.map(file => readFileSync(file, 'utf8')), original)
console.log(JSON.stringify({ status: 'passed', offerings: actual.length, variants, documents, errorSpans, scenarios }))
