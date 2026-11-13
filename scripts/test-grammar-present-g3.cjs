const assert = require('node:assert/strict')
const {load, root} = require('./gattegno-loader.cjs')
const {grammarBanksForType, defaultGrammarPilot} = load(root+'/src/grammaire/curriculum/registry.ts')
const {lessonForType} = load(root+'/src/grammaire/exercises/bank/index.ts')
const supplement = require('../src/grammaire/exercises/present-supplement-data.json')
const {generateGrammarSelection: select} = load(root+'/src/grammaire/curriculum/generate.ts')
const {convertRecipe} = load(root+'/src/interactive/domain/convert.ts')
const {buildFicheRecipe} = load(root+'/src/fiches/recipe.ts')
const {typeChoicesForBlock} = load(root+'/src/components/generator/generator-derived.ts')
const {buildPage} = load(root+'/src/math/generate.ts')
const {splitGradedGrammarPages} = load(root+'/src/grammaire/curriculum/pagination.ts')
const {resolveGramSubthemeAll} = load(root+'/src/grammaire/exercises/catalog-exercises.ts')

for (const sub of ['aller-destination','er']) {
 const prefix = 'gram-ex-'+sub+'-'
 const qtype = prefix+(sub==='er'?'qcm-conj':'qcm-verbe')
 const block = {domain:'grammaire',topic:'gram-present',exerciseType:qtype,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(qtype)}
 const completion = grammarBanksForType(qtype)[0]
 const original = lessonForType(qtype).items
 for (let i=0;i<50;i++) {
  const u = completion.units[i]
  assert.equal(u.source.position,i)
  assert.deepEqual(u.answers,[original[i].answer])
  assert.deepEqual(u.options.map(o=>o.text),original[i].options)
  assert.equal(u.prompt,sub==='er'?original[i].prompt.replace(/ \([^)]+\)/,''):original[i].prompt)
  if(sub==='er') assert.equal(u.givenVerb,original[i].prompt.match(/\(([^)]+)\)/)[1])
  else assert.equal(u.givenVerb,undefined,'A single-verb activity never repeats the infinitive.')
 }
 assert.deepEqual(select(block,521).questions.map(q=>q.unit),select({...block,grammarPresentation:'gap'},521).questions.map(q=>q.unit))
 if(sub==='aller-destination') {
  const full=buildPage(block,521)
  const withRules=splitGradedGrammarPages(full)
  const short=structuredClone(full)
  short.blocks.forEach(b=>b.items.forEach(i=>{i.grammar.unit.explanation='Règle courte.'}))
  const withoutRules=splitGradedGrammarPages(short)
  assert(withRules.length>withoutRules.length,'Long destination explanations reserve more correction space.')
  assert.deepEqual(withRules.flatMap(p=>p.items.map(i=>i.grammar.id)),withoutRules.flatMap(p=>p.items.map(i=>i.grammar.id)),'Pagination preserves the frozen question sequence.')
 }
 const correction = grammarBanksForType(prefix+'corriger-erreur')[0]
 for (let i=0;i<50;i++) {
  const u=correction.units[i],e=u.error
  assert.equal(u.prompt,supplement[sub].corrections[i].prompt.split('\n')[0])
  assert.equal(u.prompt.slice(e.start,e.end),e.text)
  // Error spans select the complete erroneous verb, not just the changed suffix.
  assert(!/[\p{L}]/u.test(u.prompt[e.start-1]??''))
  assert(!/[\p{L}]/u.test(u.prompt[e.end]??''))
  const words=u.answers[0].match(/[\p{L}]+/gu)
  const wrongWords=[...u.prompt.matchAll(/[\p{L}]+/gu)]
  const changed=wrongWords.findIndex(w=>w.index===e.start)
  assert.equal(u.prompt.slice(0,e.start)+words[changed]+u.prompt.slice(e.end),u.answers[0],'Only the verb changes in the full correction.')
 }
 const transform=grammarBanksForType(prefix+'curriculum-t')[0]
 const ordered=grammarBanksForType(prefix+'ordre')[0]
 for(let i=0;i<50;i++) {
  assert.deepEqual(ordered.units[i].tokens.map(({id,...token})=>token),supplement[sub].a1[i].tokens)
  assert.equal(ordered.units[i].answers[0],supplement[sub].a1[i].answer)
 }
 assert.deepEqual(grammarBanksForType(prefix+'curriculum-t').map(b=>b.level),['A1'])
 assert(typeChoicesForBlock('grammaire',block).some(t=>t.id===transform.activityId))
 for(let i=0;i<50;i++) {
  const u=transform.units[i],row=supplement[sub].a1[i]
  assert.equal(u.prompt,row.answer)
  assert.notEqual(u.targetSubject,row.tokens[0].text)
  assert(u.answers[0].startsWith(u.targetSubject+' ')||u.targetSubject==='Je'&&u.answers[0].startsWith('J’'))
  const unchanged=row.answer.slice(row.tokens[0].text.length).trimStart().slice(row.tokens[1].text.length)
  assert(u.answers[0].endsWith(unchanged),'A subject change preserves the destination and other information.')
 }
 // The new activities stay scoped to their own notion.
 assert(!typeChoicesForBlock('grammaire',block).some(t=>t.id===`gram-ex-${sub==='er'?'aller-destination':'er'}-curriculum-t`))
}

const erTransforms=grammarBanksForType('gram-ex-er-curriculum-t')[0].units
assert.equal(erTransforms.find(u=>u.prompt==='Nous aidons la nouvelle élève.').answers[0],'J’aide la nouvelle élève.')
assert.equal(erTransforms.find(u=>u.prompt==='Nous invitons les collègues.').answers[0],'J’invite les collègues.')
assert.equal(erTransforms.find(u=>u.prompt==='Elle reste chez ma sœur.').answers[0],'Elles restent chez ma sœur.','A third-person subject change does not change the speaker’s sister.')

const type='gram-ex-aller-destination-curriculum-p'
const oral=grammarBanksForType(type)[0]
assert.equal(resolveGramSubthemeAll('gram-present',type).id,'aller-destination','The oral pilot remains in Aller when selected, rather than falling back to Être.')
assert(typeChoicesForBlock('grammaire',{domain:'grammaire',topic:'gram-present',exerciseType:type}).some(t=>t.id===type))
assert.equal(new Set(oral.units.map(u=>u.prompt)).size,50)
for(const u of oral.units) {
 assert.equal(u.mode,'oral')
 assert.equal(u.rubric.length,5)
 assert(u.task.includes('interlocuteur')&&u.task.includes('relance'))
 assert(/\b(vais|vas|va|allons|allez|vont)\b/.test(u.answers[0]))
 assert.equal(u.givenVerb,undefined)
}
const recipe=buildFicheRecipe({pages:[{domain:'grammaire',topic:'gram-present',exerciseType:type,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(type)}],seed:521,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
const game=convertRecipe(recipe)
assert.equal(game.questions.length,50)
for(const q of game.questions) {
 assert.equal(q.compatibility,'teacher-led')
 assert.equal(q.correctId,undefined)
 assert.deepEqual(q.choices,[])
 assert(!('model' in q),'Models are only revealed through the correction channel.')
 assert(game.corrections[q.id].text.includes('Modèle'))
}
console.log('G3 présent : provenance, corrections complètes, sujets imposés, élisions, périmètres et 50 tâches orales sans notation automatique vérifiés.')
