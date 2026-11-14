const assert=require('node:assert/strict')
const {load,root}=require('./gattegno-loader.cjs')
const {grammarBanksForType,defaultGrammarPilot,GRAMMAR_PILOT_BANKS:banks}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {buildPage}=load(root+'/src/math/generate.ts')
const {splitGradedGrammarPages}=load(root+'/src/grammaire/curriculum/pagination.ts')
const data=banks.filter(b=>b.subthemeId==='a9'&&b.level==='A2')
assert.equal(data.length,4)
assert.equal(data.reduce((n,b)=>n+b.presentations.length,0),5)
assert.equal(data.reduce((n,b)=>n+b.units.length,0),200)
assert(data.every(b=>b.review.humanReview==='pending'))
const bank=suffix=>data.find(b=>b.activityId==='gram-ex-a9-'+suffix)
const block=(suffix,pres)=>{const b=bank(suffix);return {domain:'grammaire',topic:'gram-present',exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId),grammarLevel:'A2',grammarBankRevision:b.revision,grammarPresentation:pres??b.presentations[0]}}
const q=bank('qcm-verbe'),o=bank('ordre'),c=bank('corriger-erreur'),t=bank('curriculum-t')
assert.equal(new Set(q.units.map(u=>u.prompt)).size,50)
assert.equal(new Set(q.units.map(u=>u.cue)).size,50)
const meanings=new Set()
for(let i=0;i<50;i++) {
 const completion=q.units[i],order=o.units[i],error=c.units[i],transform=t.units[i]
 const answer=completion.prompt.replace('___',completion.answers[0])
 assert.equal(order.answers[0],answer)
 assert.equal(error.answers[0],answer)
 assert.equal(transform.answers[0],answer)
 assert(completion.cue.length>60&&completion.givenVerb)
 assert.equal(completion.options.filter(v=>completion.answers.includes(v.text)).length,1)
 assert(!grammarBanksForType('gram-ex-a9-qcm-verbe')[0].units.some(a=>a.prompt===completion.prompt),'A2 uses distinct contexts, not altered A1 names.')
 const e=error.error
 assert.equal(error.prompt.slice(e.start,e.end),e.text)
 assert.equal(error.prompt.slice(0,e.start)+completion.answers[0]+error.prompt.slice(e.end),answer,'Only the erroneous group changes.')
 assert(!transform.prompt.includes('___')&&transform.directive.includes('Réécrivez avec'))
 assert.equal(transform.targetSubject,undefined)
 meanings.add(transform.directive.match(/« (.+?) »/)[1])
}
assert.deepEqual([...meanings].sort(),['aucun','aucune','jamais','pas encore','personne','plus','rien'].sort())
assert.deepEqual(select(block('qcm-verbe','choice'),1087).questions.map(q=>q.unit),select(block('qcm-verbe','gap'),1087).questions.map(q=>q.unit))
const page=buildPage(block('qcm-verbe','gap'),1087),short=structuredClone(page)
short.blocks.forEach(b=>b.items.forEach(i=>{i.grammar.unit.cue='Indice court.'}))
const longPages=splitGradedGrammarPages(page),shortPages=splitGradedGrammarPages(short)
assert(longPages.length>shortPages.length,'Long context cues reserve room even with short explanations.')
assert.deepEqual(longPages.flatMap(p=>p.items.map(i=>i.grammar.id)),shortPages.flatMap(p=>p.items.map(i=>i.grammar.id)))
for(const suffix of ['qcm-verbe','ordre'])assert.deepEqual(grammarBanksForType('gram-ex-a9-'+suffix).map(b=>b.level),['A1','A2'])
for(const suffix of ['corriger-erreur','curriculum-t'])assert.deepEqual(grammarBanksForType('gram-ex-a9-'+suffix).map(b=>b.level),['A2'])
assert.equal(grammarEligibleCount({...block('ordre'),phrasePolarity:'negative'}),50)
assert.equal(grammarEligibleCount({...block('ordre'),phrasePolarity:'positive'}),0)
assert.equal(grammarEligibleCount({...block('ordre'),phrasePolarity:'mixed'}),0)
assert.throws(()=>select({...block('ordre'),phrasePolarity:'positive'},1087),e=>e.code==='GRAMMAR_CAPACITY_EXCEEDED')
for(const [prompt,expected] of [
 ['Vous achetez encore des billets en papier.','Vous n’achetez plus de billets en papier.'],
 ['Ma sœur et moi nous inscrivons encore à la séance du mercredi.','Ma sœur et moi ne nous inscrivons plus à la séance du mercredi.'],
 ['Les enfants se couchent parfois après minuit.','Les enfants ne se couchent jamais après minuit.'],
 ['On peut imprimer quelque chose avec cette machine.','On ne peut rien imprimer avec cette machine.'],
 ['Je peux changer quelque chose dans ce fichier.','Je ne peux rien changer dans ce fichier.'],
 ['Les élèves connaissent quelqu’un dans ce nouveau quartier.','Les élèves ne connaissent personne dans ce nouveau quartier.'],
 ['Le secrétariat donne une information sur le changement de salle.','Le secrétariat ne donne aucune information sur le changement de salle.'],
 ['Le guichet propose un billet pour samedi.','Le guichet ne propose aucun billet pour samedi.'],
])assert.equal(t.units.find(u=>u.prompt===prompt)?.answers[0],expected)
for(const suffix of ['corriger-erreur','curriculum-t']) {
 const cfg=block(suffix)
 assert.equal(resolveGramSubthemeAll('gram-present',cfg.exerciseType).id,'a9')
 const recipe=buildFicheRecipe({pages:[cfg],seed:1087,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
 assert(parseFicheRecipe(JSON.parse(JSON.stringify(recipe))))
 const game=convertRecipe(recipe)
 assert.equal(game.questions.length,50)
 assert(game.questions.every(q=>q.compatibility==='teacher-led'&&q.choices.length===0&&!('answer' in q)&&!('model' in q)))
 assert(game.questions.every(q=>game.corrections[q.id].text))
}
const registry=require('../docs/grammaire/implementation/target-registry.json')
assert(registry.offerings.filter(x=>x.themeId==='gram-present').every(x=>x.availability==='pilot_preview'))
console.log('Négations A2 : 250 variantes, sept formes, articles, élisions, réflexifs, infinitifs, capacités et cinq présentations vérifiés ; toutes les offres du présent sont en pilote.')
