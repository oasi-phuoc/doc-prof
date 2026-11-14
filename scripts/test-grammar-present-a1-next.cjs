const assert=require('node:assert/strict')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks,grammarBanksForType,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {grammarEligibleCount,generateGrammarSelection:select}=load(root+'/src/grammaire/curriculum/generate.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {lessonForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const selected=banks.filter(b=>b.level==='A1'&&['modaux','pronominaux','a8','a9'].includes(b.subthemeId))
assert.equal(selected.length,18)
assert.equal(selected.reduce((n,b)=>n+b.presentations.length,0),22)
assert.equal(selected.reduce((n,b)=>n+b.units.length,0),870)
assert(selected.every(b=>b.level==='A1'&&b.review.humanReview==='pending'))
const bank=(sub,suffix)=>grammarBanksForType(`gram-ex-${sub}-${suffix}`)[0]
const cfg=b=>({domain:'grammaire',topic:'gram-present',exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId)})
const recipe=block=>buildFicheRecipe({pages:[block],seed:1103,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
for(const sub of ['modaux','pronominaux']) {
 const q=bank(sub,'qcm-conj'),raw=lessonForType(q.activityId).items
 for(let i=0;i<50;i++) {
  assert.equal(q.units[i].answers[0],raw[i].answer)
  assert.deepEqual(q.units[i].options.map(o=>o.text),raw[i].options)
 }
 const c=bank(sub,'corriger-erreur')
 for(const u of c.units) {
  const e=u.error
  assert.equal(u.prompt.slice(e.start,e.end),e.text)
  assert.equal(u.answers.length,1)
  assert.notEqual(u.prompt,u.answers[0])
 }
}
const p=bank('pronominaux','curriculum-t')
assert.equal(grammarEligibleCount(cfg(bank('pronominaux','ordre'))),50,'Plus tôt is comparative, not a negative sentence.')
for(const [prompt,expected] of [
 ['Je me lève à sept heures.','Nous nous levons à sept heures.'],
 ['Elle s’habille pour la fête.','Elles s’habillent pour la fête.'],
 ['Nous nous promenons dans le quartier.','Je me promène dans le quartier.'],
 ['Tu t’arrêtes au marché.','Vous vous arrêtez au marché.'],
])assert.equal(p.units.find(u=>u.prompt===prompt)?.answers[0],expected)
const n=bank('a8','curriculum-t')
for(const [prompt,expected] of [
 ['Tu cherches un logement.','Tu ne cherches pas de logement.'],
 ['Vous demandez une attestation.','Vous ne demandez pas d’attestation.'],
 ['J’arrive à la gare.','Je n’arrive pas à la gare.'],
 ['Je discute du projet.','Je ne discute pas du projet.'],
])assert.equal(n.units.find(u=>u.prompt===prompt)?.answers[0],expected)
for(const u of bank('a8','corriger-erreur').units) {
 const e=u.error,answer=u.answers[0]
 assert.equal(u.prompt.slice(e.start,e.end),e.text)
 assert(e.text.startsWith('ne pas '))
 const fixed=answer.slice(e.start,answer.length-(u.prompt.length-e.end))
 assert.equal(u.prompt.slice(0,e.start)+fixed+u.prompt.slice(e.end),answer)
 assert(/^(?:ne |n’).+ pas$/.test(fixed))
}
for(const sub of ['a8','a9']) {
 const b=bank(sub,'ordre'),block=cfg(b)
 assert.equal(grammarEligibleCount({...block,phrasePolarity:'positive'}),0)
 assert.equal(grammarEligibleCount({...block,phrasePolarity:'mixed'}),0)
 assert.equal(grammarEligibleCount({...block,phrasePolarity:'negative'}),50)
 assert.throws(()=>select(block,1103),e=>e.code==='GRAMMAR_CAPACITY_EXCEEDED')
 assert.equal(new Set(select({...block,phrasePolarity:'negative'},1103).questions.map(q=>q.id)).size,50)
}
const a9=bank('a9','qcm-verbe')
for(const u of a9.units) {
 assert(u.cue&&u.givenVerb,'Meaning and infinitive are supplied in both QCM and gap.')
 assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
}
for(const b of selected.filter(b=>b.presentations.some(p=>['open-written','open-oral','scenario-set','transform'].includes(p)))) {
 assert.equal(resolveGramSubthemeAll('gram-present',b.activityId).id,b.subthemeId)
 const r=recipe(cfg(b)),game=convertRecipe(r)
 assert(parseFicheRecipe(JSON.parse(JSON.stringify(r))))
 assert.equal(game.questions.length,50)
 assert(game.questions.every(q=>q.compatibility==='teacher-led'&&q.choices.length===0&&!('answer' in q)&&!('model' in q)))
 assert(game.questions.every(q=>game.corrections[q.id]?.text))
}
const s=bank('modaux','curriculum-s')
assert.equal(new Set(s.units.map(u=>u.situation)).size,50)
for(const u of s.units) {
 assert.equal(u.contract,'open');assert.equal(u.roles.length,2)
 assert(u.followUps.length>=2&&u.rubric.length===5)
 assert(u.roles.every(r=>r.goal)&&u.answers[0].includes('A :')&&u.answers[0].includes('B :'))
 assert(!u.roles[1].goal.includes(u.answers[0].split('B : ')[1]),'Role information supplies constraints, not the model reply.')
}
const ce=bank('modaux','communication-ce')
assert.equal(ce.units.length,20)
assert.equal(ce.units.reduce((n,u)=>n+u.questions.length,0),60)
for(const u of ce.units)for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))
const readRecipe=recipe({...cfg(ce),count:1,grammarDocumentCount:20})
const game=convertRecipe(readRecipe)
assert.equal(game.questions.length,60)
assert.equal(new Set(game.questions.map(q=>q.source.documentId)).size,20)
assert.equal(game.questions.filter(q=>q.compatibility==='auto').length,20)
console.log('Présent A1 : 22 offres, 870 unités, lectures 20/60, négations, articles, élisions, transformations pronominales et 50 jeux de rôle à appréciation humaine vérifiés.')
