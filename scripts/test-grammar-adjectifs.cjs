const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{generateGrammarSelection,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts'),{assertGrammarBank,isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts'),{buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts'),{convertRecipe}=load(root+'/src/interactive/domain/convert.ts'),{buildGrammairePracticeTypes,resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts'),{hasRetiredGrammarRecipe}=load(root+'/src/grammaire/curriculum/retirement.ts'),{bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.subthemeId==='f12'),types=buildGrammairePracticeTypes().filter(t=>banks.some(b=>b.activityId===t.id))
assert.equal(banks.length,6);assert.equal(types.length,4);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),8)
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
const config=(b,p)=>({domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarBankRevision:b.revision,grammarPresentation:p})
let variants=0
for(const b of banks){
 assertGrammarBank(b);assert.equal(b.units.length,50);assert.equal(b.review.humanReview,'pending');assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,'f12');assert.equal(types.find(t=>t.id===b.activityId).label,b.label)
 assert.equal(new Set(b.units.map(u=>u.prompt+'|'+u.cue)).size,50)
 for(const p of b.presentations){
  const cfg=config(b,p),snapshot=generateGrammarSelection(cfg,839);assert(isGrammarSnapshot(snapshot));assert.deepEqual(snapshot,generateGrammarSelection(cfg,839));assert.notDeepEqual(snapshot.questions.map(q=>q.id),generateGrammarSelection(cfg,840).questions.map(q=>q.id))
  const recipe=buildFicheRecipe(input([cfg]));assert(parseFicheRecipe(JSON.parse(JSON.stringify(recipe))))
  const game=convertRecipe(recipe);assert.equal(game.questions.length,50);assert.deepEqual(game.issues,[]);variants+=50
  for(const q of game.questions){assert(!('answer'in q)&&!('correctId'in q)&&!('model'in q));assert(q.context?.length>40);if(p!=='choice')assert.equal(q.compatibility,'teacher-led');if(p==='choice'||p==='gap')assert(q.prompt.length<100);if(p==='gap')assert(!game.corrections[q.id].text.includes('___'))}
  if(p==='order'){
   assert(game.questions.every(q=>q.mode==='sequence'&&q.words.length===3));assert(b.units.every(u=>u.orderScope==='noun-group'&&u.tokens.filter(t=>t.category==='adjectif').length===1))
   for(const phrasePolarity of ['positive','negative','mixed'])for(const phraseCategories of [{},{adjectif:false,adverbe:false,preposition:false}]){
    const changed={...cfg,phrasePolarity,phraseCategories};assert.equal(grammarEligibleCount(changed),50);assert.equal(generateGrammarSelection(changed,839).questions.length,50)
   }
  }
 }
}
assert.equal(variants,400)
const source=level=>fs.readFileSync(root+'/scripts/grammar_curriculum/adjectifs-f12-'+level+'.tsv','utf8').trim().split('\n').filter(s=>!s.startsWith('#')).map(s=>s.split('|'))
const group=r=>r[4].split(';').map(t=>t.split('~')[0]).join(' ').replaceAll('’ ','’')
const qcm=level=>banks.find(b=>b.activityId==='gram-ex-f12-qcm-verbe'&&b.level===level)
for(const level of ['A1','A2']){
 const data=source(level.toLowerCase());assert.equal(data.length,50);assert.equal(new Set(data.map(r=>r[2])).size,50)
 for(const [i,u]of qcm(level).units.entries()){
  const row=data[i];assert.equal(u.answers[0],group(row));assert.deepEqual(u.answers,[group(row),...row[5].split(';').filter(Boolean)]);assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
  if(u.answers.includes(row[6]))assert(!u.options.some(o=>o.text===row[6]),'An accepted position cannot be a distractor')
  const order=banks.find(b=>b.activityId==='gram-ex-f12-curriculum-o'&&b.level===level).units[i];assert.equal(order.answers[0],group(row));assert(order.cue.includes(row[9]+' le nom'));assert.equal(order.tokens.findIndex(t=>t.category==='adjectif')<order.tokens.findIndex(t=>t.category==='nom'),row[9]==='avant')
  if(level==='A1')assert(u.cue.includes(row[9]+' le nom'))
 }
}
const a1=qcm('A1'),by=id=>a1.units.find(u=>u.id.endsWith('-'+id))
for(const [id,answer]of Object.entries({'bel-arbre':'un bel arbre','bel-hotel':'un bel hôtel','vieil-immeuble':'un vieil immeuble','vieil-homme':'un vieil homme','nouvel-eleve':'un nouvel élève','beau-heros':'un beau héros','vieux-heros':'un vieux héros','vieilles-chaussures':'mes vieilles chaussures','plats-japonais':'des plats japonais','table-ronde':'une table ronde'}))assert.equal(by(id).answers[0],answer)
const a2=qcm('A2'),meaning=id=>a2.units.find(u=>u.id.endsWith('-'+id))
for(const [id,answer]of Object.entries({'ancienne-collegue':'une ancienne collègue','propre-bureau':'mon propre bureau','bureau-propre':'un bureau propre','seul-client':'un seul client','client-seul':'un client seul','brave-homme':'un brave homme','homme-brave':'un homme brave','pauvre-voyageur':'un pauvre voyageur','voyageur-pauvre':'un voyageur pauvre','derniere-annee':'la dernière année','annee-derniere':'l’année dernière'}))assert.equal(meaning(id).answers[0],answer)
for(const id of ['meuble-ancien','homme-grand','femme-grande','histoire-vraie','question-simple','chercheuse-curieuse','nouvel-emploi'])assert.equal(meaning(id).answers.length,2)
const data=source('a2'),corrections=banks.find(b=>b.activityId==='gram-ex-f12-curriculum-c').units,transforms=banks.find(b=>b.activityId==='gram-ex-f12-curriculum-t').units
for(const [i,u]of corrections.entries()){
 const row=data[i],e=u.error;assert.equal(u.prompt.slice(e.start,e.end),row[8]);assert.equal(e.text,row[8]);assert(!a2.units[i].answers.includes(e.text));assert.equal(u.prompt.slice(0,e.start)+a2.units[i].answers[0]+u.prompt.slice(e.end),u.answers[0]);assert.deepEqual(u.answers,a2.units[i].answers.map(a=>row[3].replace('___',a)))
 assert.equal(transforms[i].prompt,row[3].replace('___',row[11]));assert.deepEqual(transforms[i].answers,u.answers);assert(transforms[i].directive.includes(row[1]));assert(transforms[i].directive.includes(row[10]))
}
const order=banks.find(b=>b.activityId==='gram-ex-f12-curriculum-o').units[0]
const orderBank=banks.find(b=>b.activityId==='gram-ex-f12-curriculum-o')
for(const patch of [{orderScope:'sentence'},{tokenUnit:'clause'}])assert.throws(()=>assertGrammarBank({...orderBank,units:orderBank.units.map((u,i)=>i===0?{...u,...patch}:u)}),e=>e.code==='GRAMMAR_BANK_INVALID')
assert.throws(()=>assertGrammarBank({...a1,units:a1.units.map((u,i)=>i===0?{...u,orderScope:'noun-group'}:u)}),e=>e.code==='GRAMMAR_BANK_INVALID')
const {grammarOrderHasSentenceFilters}=load(root+'/src/grammaire/curriculum/types.ts');assert(!grammarOrderHasSentenceFilters([order]));assert(!grammarOrderHasSentenceFilters([{...order,orderScope:undefined,tokenUnit:'clause'}]));assert(grammarOrderHasSentenceFilters([{...order,orderScope:undefined}]))
const retired=require('../src/grammaire/curriculum/retired-subthemes.json'),before=JSON.parse(cp.execFileSync('git',['show','7f859fc38:src/grammaire/exercises/bank/lessons-revised.ts'],{encoding:'utf8',maxBuffer:8*1024*1024}).split('= ').slice(1).join('= ')),after=JSON.parse(fs.readFileSync(root+'/src/grammaire/exercises/bank/lessons-revised.ts','utf8').split('= ').slice(1).join('= '));assert.deepEqual(after,before.filter(x=>!retired.includes(x.subId)))
const old={domain:'grammaire',topic:'gram-decrire',exerciseType:a1.activityId,difficulty:'facile',columns:1,count:1},fresh={...old,...defaultGrammarPilot(old.exerciseType)};assert.equal(bankForType(old.exerciseType).length,0);assert.equal(parseFicheRecipe(input([old])),null);assert(hasRetiredGrammarRecipe({pages:[old]}));assert(!hasRetiredGrammarRecipe({pages:[fresh]}))
console.log(JSON.stringify({status:'passed',activities:4,banks:6,offerings:8,units:300,variants,authoredSituations:100,nounGroups:100,canonicalErrorSpans:50,historicalWrittenBanksRemoved:1,teacherApprovedUnits:0,savedWorksheetCleanup:'deferred by owner'}))
