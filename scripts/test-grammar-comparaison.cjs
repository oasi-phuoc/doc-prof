const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection}=load(root+'/src/grammaire/curriculum/generate.ts')
const {assertGrammarBank,isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {validWordPlacements}=load(root+'/src/interactive/domain/word-sorting.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {buildGrammairePracticeTypes,resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {hasRetiredGrammarRecipe}=load(root+'/src/grammaire/curriculum/retirement.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-decrire'&&b.subthemeId==='f9')
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,8);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),10)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),400)
assert.equal(new Set(banks.map(b=>b.activityId)).size,4)
const types=buildGrammairePracticeTypes().filter(t=>banks.some(b=>b.activityId===t.id));assert.equal(types.length,4)
let variants=0
for(const b of banks){
 assertGrammarBank(b);assert.equal(b.review.humanReview,'pending')
 assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,b.subthemeId)
 assert.equal(types.find(t=>t.id===b.activityId).label,b.label)
 for(const presentation of b.presentations){
  const cfg={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarPresentation:presentation,grammarBankRevision:b.revision,...(presentation==='document-set'?{grammarDocumentCount:20}:{})}
  const snapshot=generateGrammarSelection(cfg,839);assert(isGrammarSnapshot(snapshot));assert.deepEqual(generateGrammarSelection(cfg,839),snapshot)
  const expected=presentation==='document-set'?60:50;variants+=expected
  const recipe=buildFicheRecipe(input([cfg]));assert(parseFicheRecipe(JSON.parse(JSON.stringify(recipe))))
  const game=convertRecipe(recipe);assert.equal(game.questions.length,expected);assert.deepEqual(game.issues,[])
  assert(game.questions.every(q=>!('answer' in q)&&!('model' in q)&&!('correctId' in q)&&!('sortingTargets' in q)))
  if(!['choice','document-set'].includes(presentation))assert(game.questions.every(q=>q.compatibility==='teacher-led'))
  if(b.level==='A2')for(const q of game.questions){assert(q.context?.length>100);if(presentation==='choice'||presentation==='gap')assert(q.prompt.length<160);else if(presentation==='transform')assert(/comparez/iu.test(q.prompt));}
  if(presentation==='gap')for(const c of Object.values(game.corrections)){
   assert(!c.text.includes('___'));assert(!/\bde le\b|\bde les\b|l’\s+[a-zàâéèêîôùû]/iu.test(c.text.split('\n')[0]),'Malformed revealed group: '+c.text)
  }
  if(presentation==='match')for(const q of game.questions){
   assert.equal(q.mode,'sorting');assert.equal(q.choices.length,0)
   const u=b.units.find(u=>u.prompt===q.context);assert(u);assert.equal(q.wordSorting.sentence.tokens.length,2)
   assert(q.wordSorting.sentence.tokens.every(t=>u.pairs.some(p=>p.left===t)))
   const target=game.corrections[q.id].sortingTargets;assert(validWordPlacements(q,target))
   u.pairs.forEach((p,i)=>assert.equal(q.wordSorting.categories.find(c=>c.id===target[i]).label,p.right))
  }
 }
}
assert.equal(variants,500)


const source=level=>fs.readFileSync(root+'/scripts/grammar_curriculum/comparaison-f9-'+level+'.tsv','utf8').trim().split('\n').filter(s=>!s.startsWith('#')).map(s=>s.split('|'))
for(const level of ['A1','A2']){
 const data=source(level.toLowerCase()),qcm=banks.find(b=>b.activityId==='gram-ex-f9-qcm-verbe'&&b.level===level)
 assert.equal(qcm.units.length,50);assert.equal(new Set(data.map(r=>r[2])).size,50)
 for(const [i,u]of qcm.units.entries()){
  const r=data[i];assert.equal(u.source.path,'scripts/grammar_curriculum/comparaison-f9-'+level.toLowerCase()+'.tsv');assert.equal(u.answers[0],r[4]);assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
  assert(u.cue.includes(r[2])&&u.cue.includes(r[8]));assert(u.prompt.includes(' que '));assert.equal(u.prompt.split('___').length,2)
  for(const a of u.answers)assert(!/plus meilleur|plus bon(?:ne)?s?\b|plus pire|que que/u.test(u.prompt.replace('___',a)))
  for(const b of banks.filter(b=>b.level===level&&b.activityId!=='gram-ex-f9-qcm-verbe')){
   const v=b.units[i];assert.equal(v.prompt,r[2]);assert(v.answers[0].startsWith(u.prompt.replace('___',u.answers[0])));assert.equal(v.source.position,i)
   if(v.kind==='transform'){assert(v.directive.includes(r[8]));assert.equal(v.responseLines,2)}
   if(v.kind==='production'){
    assert(v.rubric.length>=3);assert.equal(v.writeLines,v.mode==='oral'?0:level==='A1'?2:6)
    if(level==='A2'||v.mode==='oral')assert(v.answers[0].includes(r[10]));else assert.equal(v.answers[0],u.prompt.replace('___',u.answers[0]))
    if(v.mode==='oral')assert(v.task.includes(r[9]))
   }
  }
 }
}
const qcm=level=>banks.find(b=>b.activityId==='gram-ex-f9-qcm-verbe'&&b.level===level),by=(level,slug)=>qcm(level).units.find(u=>u.id.endsWith('-'+slug))
for(const [slug,a]of Object.entries({'velo-prix':'moins cher','bus-duree':'plus court','sac-poids':'aussi lourd','salle-surface':'plus grande','eau-froide':'plus froide','valises-poids':'moins légère','arrets-distance':'aussi éloigné','velos-neufs':'plus récent','maisons-anciennes':'plus ancienne','textes-faciles':'plus facile','consignes-difficiles':'aussi difficiles','gateau-qualite':'meilleur','soupe-qualite':'meilleure','pains-qualite':'meilleurs','tartes-qualite':'meilleures','repas-qualite':'moins bon'}))assert.equal(by('A1',slug).answers[0],a)
assert(by('A1','route-etat').answers.includes('plus mauvaise'));assert(by('A1','chemins-etat').answers.includes('plus mauvais'))
for(const [slug,a]of Object.entries({'velos-location':'plus cher mais plus léger','trains-liaison':'plus rapide mais plus cher','bus-transport':'aussi cher mais plus rapide','ordinateurs-poids':'aussi léger mais moins cher','valises-transport':'plus légère mais aussi chère','textes-lisibilite':'plus lisible mais plus long','menus-qualite':'meilleur mais plus cher','soupes-choix':'meilleure mais plus chère','pains-lots':'meilleurs mais plus chers','tartes-commandes':'meilleures mais plus chères','route-travaux':'pire mais plus courte','livres-pret':'plus court et plus facile','films-programme':'aussi court','exercices-difficulte':'moins difficile et moins long'}))assert.equal(by('A2',slug).answers[0],a)
assert(by('A2','route-travaux').answers.includes('plus mauvaise mais plus courte'))
// Check decisions against numbers parsed from the authored facts, including equality at a limit.
const data=source('a2')
for(const [slug,pattern,limits,allowed] of [
 ['trains-liaison',/([ABC]) met (\d+) minutes pour (\d+) francs/g,/au maximum une heure et un budget de (\d+) francs/,(values,limit)=>values[0]<=60&&values[1]<=limit[0]],
 ['ordinateurs-poids',/([ABC]) coûte (\d+) francs et pèse (\d+) kilo/g,/poids de (\d+) kilo au maximum et dispose de (\d+) francs/,(values,limit)=>values[1]<=limit[0]&&values[0]<=limit[1]],
 ['films-programme',/([ABC]) dure (\d+) minutes et commence à (\d+) heures/g,/à partir de (\d+) heures et veut un film de (\d+) minutes au maximum/,(values,limit)=>values[1]>=limit[0]&&values[0]<=limit[1]]
]){
 const row=data.find(r=>r[0]===slug),match=row[2].match(limits);assert(match,slug)
 const limit=match.slice(1).map(Number),candidates=[...row[2].matchAll(pattern)];assert.equal(candidates.length,3)
 const possible=candidates.filter(m=>allowed(m.slice(2).map(Number),limit));assert.equal(possible.length,1,slug)
 assert.equal(row[10].match(/Je choisis ([ABC])/)[1],possible[0][1],slug)
}
const a1=qcm('A1'),a2=qcm('A2');assert.equal(new Set([...a1.units,...a2.units].map(u=>u.cue)).size,100)
assert(a2.units.filter(u=>/ mais | et /u.test(u.answers[0])).length>=40)
assert(source('a2').every(r=>['A','B','C'].every(letter=>new RegExp('\\b'+letter+'\\b').test(r[2]))))
const retired=require('../src/grammaire/curriculum/retired-subthemes.json'),before=JSON.parse(cp.execFileSync('git',['show','a99ea7b9f:src/grammaire/exercises/bank/lessons-revised.ts'],{encoding:'utf8'}).split('= ').slice(1).join('= ')),after=JSON.parse(fs.readFileSync(root+'/src/grammaire/exercises/bank/lessons-revised.ts','utf8').split('= ').slice(1).join('= '));assert.deepEqual(after,before.filter(x=>!retired.includes(x.subId)))
const old={domain:'grammaire',topic:'gram-decrire',exerciseType:'gram-ex-f9-qcm-verbe',difficulty:'facile',columns:1,count:1},fresh={...old,...defaultGrammarPilot(old.exerciseType)}
assert.equal(bankForType(old.exerciseType).length,0);assert.equal(parseFicheRecipe(input([old])),null);assert(hasRetiredGrammarRecipe({pages:[old]}));assert(!hasRetiredGrammarRecipe({pages:[fresh]}))
const registry=require('../docs/grammaire/implementation/target-registry.json');assert.equal(registry.imageObligations.filter(o=>o.hostActivityId?.startsWith('gram-ex-f9-')).length,0)
console.log(JSON.stringify({status:'passed',activities:4,banks:8,offerings:10,units:400,variants,authoredSituations:100,levels:['A1','A2'],teacherApprovedUnits:0,historicalWrittenBanksRemoved:1,savedWorksheets:'untouched, cleanup deferred by owner'}))
