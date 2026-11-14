const assert=require('node:assert/strict')
const {load,root}=require('./gattegno-loader.cjs')
const {grammarBanksForType,defaultGrammarPilot,GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {lessonForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const originalOrder=require('../src/grammaire/exercises/present-supplement-data.json')
const {typeChoicesForBlock}=load(root+'/src/components/generator/generator-derived.ts')
const {resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {buildFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')

for(const sub of ['ir','re-oir']) {
 const prefix=`gram-ex-${sub}-`
 const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.subthemeId===sub)
 assert.equal(banks.length,6)
 assert.equal(banks.reduce((n,b)=>n+b.units.length*b.presentations.length,0),400)
 assert.deepEqual(grammarBanksForType(prefix+'curriculum-t').map(b=>b.level),['A2'])
 assert.deepEqual(grammarBanksForType(prefix+'corriger-erreur').map(b=>b.level),['A2'])
 const bank=(suffix,level)=>banks.find(b=>b.activityId===prefix+suffix&&b.level===level)
 const block=(suffix,level,presentation)=>{
  const b=bank(suffix,level)
  return {domain:'grammaire',topic:'gram-present',exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,
   ...defaultGrammarPilot(b.activityId),grammarLevel:level,grammarBankRevision:b.revision,grammarPresentation:presentation??b.presentations[0]}
 }
 const legacy=lessonForType(prefix+'qcm-conj').items,a1=bank('qcm-conj','A1')
 for(let i=0;i<50;i++) {
  const u=a1.units[i]
  assert.equal(u.source.position,i)
  assert.equal(u.answers[0],legacy[i].answer)
  assert.deepEqual(u.options.map(o=>o.text),legacy[i].options)
  assert.equal(u.givenVerb,legacy[i].prompt.match(/\(([^)]+)\)/)[1])
  const clear=legacy[i].prompt.replace(/ \([^)]+\)/,'')
  assert.equal(u.prompt,sub==='ir'&&i===47?clear.replace('le permis','l’examen du permis de conduire'):clear)
  assert.equal(bank('ordre','A1').units[i].source.position,i)
  if(!(sub==='ir'&&i===47))assert.equal(bank('ordre','A1').units[i].answers[0],originalOrder[sub].a1[i].answer)
 }
 for(const level of ['A1','A2']) {
  const b=block('qcm-conj',level)
  assert.deepEqual(select(b,921).questions.map(q=>q.unit),select({...b,grammarPresentation:'gap'},921).questions.map(q=>q.unit))
 }
 const q=bank('qcm-conj','A2'),ordered=bank('ordre','A2'),correct=bank('corriger-erreur','A2'),transform=bank('curriculum-t','A2')
 assert(new Set(q.units.map(u=>u.givenVerb)).size>=20,'A2 compares multiple conjugation models.')
 for(let i=0;i<50;i++) {
  const u=q.units[i],o=ordered.units[i],c=correct.units[i],t=transform.units[i]
  const answer=u.prompt.replace('___',u.answers[0])
  assert.equal(o.answers[0],answer)
  assert.equal(c.answers[0],answer)
  assert.equal(t.prompt,answer)
  assert.equal(c.prompt.slice(c.error.start,c.error.end),c.error.text)
  assert(!/[\p{L}]/u.test(c.prompt[c.error.start-1]??''))
  assert(!/[\p{L}]/u.test(c.prompt[c.error.end]??''))
  assert.equal(c.prompt.slice(0,c.error.start)+u.answers[0]+c.prompt.slice(c.error.end),answer,'Only the target verb changes in a correction.')
  assert.equal(t.prompt.includes(' pas '),t.answers[0].includes(' pas '),'Negation survives the imposed subject change.')
  assert.equal(t.givenVerb,u.givenVerb)
  assert(!a1.units.some(a=>a.prompt===u.prompt),'A2 has its own contexts rather than copied A1 stems.')
 }
 assert.equal(resolveGramSubthemeAll('gram-present',transform.activityId).id,sub)
 const tBlock=block('curriculum-t','A2')
 assert(typeChoicesForBlock('grammaire',tBlock).some(t=>t.id===transform.activityId))
 assert(!typeChoicesForBlock('grammaire',tBlock).some(t=>t.id===`gram-ex-${sub==='ir'?'re-oir':'ir'}-curriculum-t`))
 const oBlock=block('ordre','A2')
 assert.equal(grammarEligibleCount({...oBlock,phrasePolarity:'positive'}),44)
 assert.equal(grammarEligibleCount({...oBlock,phrasePolarity:'negative'}),6)
 assert.equal(grammarEligibleCount({...oBlock,phrasePolarity:'mixed'}),50)
 assert.throws(()=>select(oBlock,921),e=>e.code==='GRAMMAR_CAPACITY_EXCEEDED')
 assert.equal(select({...oBlock,phrasePolarity:'negative',count:6},921).questions.length,6)
 const all=select({...oBlock,phrasePolarity:'mixed'},921)
 assert.equal(new Set(all.questions.map(q=>q.id)).size,50)
 assert.equal(all.questions.filter(q=>q.unit.tokens.some(t=>t.category==='negation')).length,6)
 const recipe=buildFicheRecipe({pages:[tBlock],seed:921,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
 const game=convertRecipe(recipe)
 assert.equal(game.questions.length,50)
 assert(game.questions.every(q=>q.compatibility==='teacher-led'&&q.choices.length===0&&!('model' in q)))
 assert(game.questions.every(q=>game.corrections[q.id].text))
}
const transform=(sub,prompt)=>grammarBanksForType(`gram-ex-${sub}-curriculum-t`)[0].units.find(u=>u.prompt===prompt)
for(const [sub,prompt,expected] of [
 ['ir','Tu réfléchis à ton orientation pendant les vacances.','Nous réfléchissons à notre orientation pendant les vacances.'],
 ['ir','Les apprenties ne sortent pas de l’atelier sans leur casque.','Elle ne sort pas de l’atelier sans son casque.'],
 ['ir','Le gardien n’ouvre pas la salle avant neuf heures.','Vous n’ouvrez pas la salle avant neuf heures.'],
 ['ir','Je tiens le guidon avec les deux mains.','Nous tenons le guidon avec les deux mains.'],
 ['re-oir','Tu perds du temps quand tu cherches tes clés.','Vous perdez du temps quand vous cherchez vos clés.'],
 ['re-oir','Les nouveaux élèves entendent la sonnerie depuis la cour.','J’entends la sonnerie depuis la cour.'],
 ['re-oir','Nous reprenons nos sacs après la visite du château.','Elle reprend son sac après la visite du château.'],
 ['re-oir','Tu vis avec tes parents pendant ta formation.','Vous vivez avec vos parents pendant votre formation.'],
 ['re-oir','Nous n’entendons pas le guide à cause du bruit.','Je n’entends pas le guide à cause du bruit.'],
]) {
 assert.equal(transform(sub,prompt)?.answers[0],expected)
}
const know=grammarBanksForType('gram-ex-re-oir-qcm-conj')[0].units.find(u=>u.answers[0]==='connaît')
assert.deepEqual(know.answers,['connaît','connait'],'Traditional and rectified spellings are both accepted without two correct QCM options.')
assert.equal(know.options.filter(o=>know.answers.includes(o.text)).length,1)
const registry=require('../docs/grammaire/implementation/target-registry.json').implementation
assert.equal(registry.reviewedOfferings,GRAMMAR_PILOT_BANKS.reduce((n,b)=>n+b.presentations.length,0))
assert.equal(registry.reviewedActivities,new Set(GRAMMAR_PILOT_BANKS.map(b=>b.activityId)).size)
console.log('IR / RE-OIR : 800 variantes, réemploi A1, contextes A2, modèles irréguliers, correction unique, possessifs, élisions, capacités 44/6/50 et transformations guidées vérifiés.')
