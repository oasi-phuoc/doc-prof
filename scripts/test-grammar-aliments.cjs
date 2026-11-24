const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs'),{GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{generateGrammarSelection,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts'),{isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts'),{buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts'),{bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts'),{buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-aliments'),types=buildGrammairePracticeTypes(),registry=require('../docs/grammaire/implementation/target-registry.json')
assert.equal(banks.length,20);assert.equal(new Set(banks.map(b=>b.activityId)).size,19);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),27)
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null});let variants=0
for(const b of banks){
 assert.equal(b.units.length,b.presentations.includes('document-set')?20:50);assert.equal(b.review.humanReview,'pending');assert.equal(bankForType(b.activityId).length,0);assert(types.some(t=>t.id===b.activityId&&t.label===b.label))
 for(const p of b.presentations){
  assert(registry.offerings.some(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p));const cfg={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:p==='document-set'?1:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarBankRevision:b.revision,grammarPresentation:p,...(p==='document-set'?{grammarDocumentCount:20}:{})},s=generateGrammarSelection(cfg,839)
  assert(isGrammarSnapshot(s));assert.deepEqual(s,generateGrammarSelection(cfg,839));assert.notDeepEqual(s.questions.map(q=>q.id),generateGrammarSelection(cfg,840).questions.map(q=>q.id));assert.equal(grammarEligibleCount(cfg),b.units.length);assert(parseFicheRecipe(JSON.parse(JSON.stringify(buildFicheRecipe(input([cfg]))))))
  variants+=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
  for(const u of b.units){
   if(u.kind==='completion')assert.equal(u.options.filter(c=>u.answers.includes(c.text)).length,1)
   if(u.kind==='match'){assert.equal(u.pairs.length,2);assert.notEqual(u.pairs[0].right,u.pairs[1].right);assert(u.pairs.every(x=>x.left.includes('___')))}
   if(u.kind==='production'){assert(u.rubric.length>=3);assert(!u.task.includes('___'));assert(u.explanation.includes('exclusif'));assert(u.mode==='oral'?u.writeLines===0:u.writeLines>=3)}
   if(u.kind==='scenario'){assert.equal(u.contract,'open');assert.equal(u.roles.length,2);assert.equal(u.rubric.length,3);assert(u.answers[0].includes(u.followUps[0]));assert(u.turns[0].text.endsWith('?'))}
   if(u.kind==='reading'){assert.equal(u.questions.length,3);assert.equal(u.questions.filter(q=>q.response==='choice').length,2);for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))}
  }
 }
}
assert.equal(variants,1360)
const qcm=(sub,level='A1')=>banks.find(b=>b.activityId===`gram-ex-${sub}-qcm-verbe`&&b.level===level),u=(sub,id,level='A1')=>qcm(sub,level).units.find(u=>u.id.endsWith('-'+id))
for(const [sub,id,answer,level]of [['g1','croissant','un'],['g1','baguette','une'],['g1','oeufs','des'],['g2','haricot','le'],['g2','huile','l’'],['g2','chocolat-negatif','le'],['g3','pain','du'],['g3','compote','de la'],['g3','huile','de l’'],['g3','sans-huile','d’'],['g3','sans-lait','de'],['g4','eau-verre','un verre d’'],['g4','pommes-trois','trois'],['g4','eau-demi-litre','un demi-litre d’'],['g4','viande-cinq-cents','cinq cents grammes de'],['g5','tout-monde','Tout','A2'],['g5','tous-invites','Tous','A2'],['g5','toutes-tables','Toutes','A2'],['g5','chaque-client','Chaque','A2'],['g5','plusieurs-personnes','Plusieurs','A2'],['g6','marche','au'],['g6','commercants','aux'],['g6','retour-marche','du'],['g6','prix-pommes','des'],['g6','boulangerie','à la'],['g6','epicerie','à l’'],['g6','retour-boulangerie','de la'],['g6','retour-epicerie','de l’']])assert.equal(u(sub,id,level).answers[0],answer,sub+'/'+id)
const csv=(sub,level)=>fs.readFileSync(root+`/scripts/grammar_curriculum/aliments-${sub}-${level.toLowerCase()}.tsv`,'utf8').trim().split('\n').filter(s=>!s.startsWith('#')).map(s=>s.split('|'))
for(const [sub,level]of [['g1','A1'],['g2','A1'],['g3','A1'],['g4','A1'],['g5','A2'],['g6','A1'],['g6','A2']]){const rows=csv(sub,level);assert.equal(rows.length,50);assert.equal(new Set(rows.map(r=>r[0])).size,50)}
for(const sub of ['g2','g5','g6']){
 const level=sub==='g2'?'A1':'A2',data=csv(sub,level),corrections=banks.find(b=>b.activityId===`gram-ex-${sub}-curriculum-c`).units,transforms=banks.find(b=>b.activityId===`gram-ex-${sub}-curriculum-t`).units
 for(const [i,c]of corrections.entries()){
  const r=data[i],a=sub==='g2'?(r[2]==='p'?'les':['v','h-muet'].includes(r[3])?'l’':r[1]==='m'?'le':'la'):r[2],e=c.error
  assert.equal(c.prompt.slice(e.start,e.end),e.text);assert.equal(c.prompt.slice(0,e.start)+a+c.prompt.slice(e.end),c.answers[0]);assert.deepEqual(transforms[i].answers,c.answers)
  if(sub==='g2'&&a==='l’')assert(e.text.endsWith(' '),'The correction interval removes the space before an elided noun')
 }
}
const analyses=csv('g6','A2'),labels={partitif:'un article partitif',contracte:'un article contracté',indefini:'un article indéfini'}
analyses.forEach((r,i)=>{assert.equal(qcm('g6','A2').units[i].answers[0],labels[r[1]]);assert(qcm('g6','A2').units[i].prompt.includes('« '+r[2]+' »'))})
assert.equal(analyses.filter(r=>r[1]==='partitif').length,15);assert.equal(analyses.filter(r=>r[1]==='contracte').length,30);assert.equal(analyses.filter(r=>r[1]==='indefini').length,5)
const media=require('../docs/grammaire/implementation/aliments-media-manifest.json');assert.equal(media.obligations.length,3);assert.equal(media.distinctImages,81);assert.equal(new Set(media.images.map(i=>i.sha256)).size,81)
for(const ob of media.obligations){assert.equal(ob.reviewedIllustratedSituations,50);assert.equal(ob.unitIds.length,50);const b=banks.find(b=>b.activityId===ob.hostActivityId);assert(b.units.every(u=>u.imageSupports?.length===1));assert.deepEqual(ob.unitIds,b.units.map(u=>u.id))}
for(const img of media.images)for(const path of [img.src,img.source.path])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/public'+path)).digest('hex'),img.sha256)
assert(!media.images.some(i=>i.source.path.endsWith('/fruits/orange.webp')||i.source.path.endsWith('/aliments/creme.webp')||i.source.path.endsWith('/cuisine/plat.webp')))
const before=p=>JSON.parse(cp.execFileSync('git',['show','f3c1b3609:'+p],{encoding:'utf8',maxBuffer:16*1024*1024})),path='src/grammaire/exercises/communication-data.json';assert.deepEqual(require('../'+path),before(path).filter(r=>r.subId!=='g4'))
const legacy=p=>JSON.parse(p.split('= ').slice(1).join('= ')),lp='src/grammaire/exercises/bank/lessons-revised.ts';assert.deepEqual(legacy(fs.readFileSync(root+'/'+lp,'utf8')),legacy(cp.execFileSync('git',['show','f3c1b3609:'+lp],{encoding:'utf8',maxBuffer:16*1024*1024})).filter(r=>!['g1','g2','g3','g4','g5','g6'].includes(r.subId)))
const lectures=require('../scripts/grammar_curriculum/aliments-lectures-a1.json');assert.equal(lectures.length,20);assert(lectures.every(d=>d.text.every(l=>l.length<=80)))
console.log(JSON.stringify({status:'passed',activities:19,banks:20,offerings:27,units:970,variants,sourceRows:350,readingDocuments:20,readingQuestions:60,illustratedSituations:150,images:81,canonicalErrorSpans:150,teacherApprovedUnits:0,savedWorksheetCleanup:'deferred by owner'}))
