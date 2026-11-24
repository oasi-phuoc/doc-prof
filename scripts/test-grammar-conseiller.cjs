const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process')
const {load,root}=require('./gattegno-loader.cjs'),{GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{generateGrammarSelection,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts'),{isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts'),{buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts'),{bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts'),{buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-conseiller'),types=buildGrammairePracticeTypes(),r=require('../docs/grammaire/implementation/target-registry.json')
assert.equal(banks.length,13);assert.equal(new Set(banks.map(b=>b.activityId)).size,10);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),16)
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null});let variants=0
const config=(b,p)=>({domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:p==='document-set'?1:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarBankRevision:b.revision,grammarPresentation:p,...(p==='document-set'?{grammarDocumentCount:20}:{}),...(p==='order'&&b.level==='A2'?{phrasePolarity:'mixed'}:{})})
for(const b of banks){
 assert.equal(b.units.length,b.presentations.includes('document-set')?20:50);assert.equal(b.review.humanReview,'pending');assert.equal(bankForType(b.activityId).length,0);assert(types.some(t=>t.id===b.activityId&&t.label===b.label))
 for(const p of b.presentations){
  assert(r.offerings.some(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p));const cfg=config(b,p),s=generateGrammarSelection(cfg,839);assert(isGrammarSnapshot(s));assert.deepEqual(s,generateGrammarSelection(cfg,839));assert.notDeepEqual(s.questions.map(q=>q.id),generateGrammarSelection(cfg,840).questions.map(q=>q.id));assert.equal(grammarEligibleCount(cfg),b.units.length)
  assert(parseFicheRecipe(JSON.parse(JSON.stringify(buildFicheRecipe(input([cfg]))))))
  variants+=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
  for(const u of b.units){
   assert(!u.imageSupports);if(u.kind==='completion')assert.equal(u.options.filter(c=>u.answers.includes(c.text)).length,1)
   if(u.kind==='production'){assert(u.rubric.length>=3);assert(!u.task.includes('___'));assert(u.explanation.includes('exclusif'));assert(u.mode==='oral'?u.writeLines===0:u.writeLines===4)}
   if(u.kind==='reading'){assert.equal(u.questions.length,3);assert.equal(u.questions.filter(q=>q.response==='choice').length,2);for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))}
   if(u.kind==='scenario'){assert.equal(u.contract,'open');assert.equal(u.roles.length,2);assert.equal(u.followUps.length,1);assert.equal(u.writeLines,0);assert.equal(u.rubric.length,3);assert(u.answers[0].includes(u.followUps[0]))}
  }
 }
}
assert.equal(variants,810)
const orders=banks.filter(b=>b.presentations.includes('order'))
for(const b of orders){const cfg=config(b,'order'),neg=b.units.filter(u=>u.tokens.some(t=>t.category==='negation'));assert.equal(neg.length,b.level==='A1'?0:25);assert.equal(grammarEligibleCount({...cfg,phrasePolarity:'positive'}),b.level==='A1'?50:25);assert.equal(grammarEligibleCount({...cfg,phrasePolarity:'negative'}),b.level==='A1'?0:25);if(b.level==='A2')assert.throws(()=>generateGrammarSelection({...cfg,phrasePolarity:'positive'},839),e=>e.code==='GRAMMAR_CAPACITY_EXCEEDED');for(const u of b.units){assert.equal(new Set(u.tokens.map(t=>t.id)).size,u.tokens.length);assert.equal(u.tokens.map(t=>t.text).join(' ').replaceAll('’ ','’'),u.answers[0])}}
const a2=banks.find(b=>b.activityId==='gram-ex-f11-qcm-conj'&&b.level==='A2'),by=id=>a2.units.find(u=>u.id.endsWith('-'+id))
for(const [id,answer]of Object.entries({'bureau-y':'Vas-y','bureau-negative':'N’y va pas','soupe-en':'Manges-en','soupe-negative':'N’en mange pas','projet-en':'Parles-en','pain-en':'Achètes-en','gateau-men':'Donne-m’en','fiche-moi':'Donne-le-moi','fiche-negative':'Ne me le donne pas','colis-le-lui':'Envoyez-le-lui','dossier-negative':'Ne le lui donnez pas','places-vous':'Asseyez-vous','chaise-negative':'Ne t’assieds pas'}))assert.equal(by(id).answers[0],answer)
assert.deepEqual(by('places-vous').answers,['Asseyez-vous','Assoyez-vous']);assert.deepEqual(by('chaise-negative').answers,['Ne t’assieds pas','Ne t’assois pas'])
const source=level=>fs.readFileSync(root+'/scripts/grammar_curriculum/conseiller-f11-'+level+'.tsv','utf8').trim().split('\n').filter(l=>!l.startsWith('#')).map(l=>l.split('|')),data=source('a2')
const corrections=banks.find(b=>b.activityId==='gram-ex-f11-curriculum-c').units,transforms=banks.find(b=>b.activityId==='gram-ex-f11-curriculum-t').units
for(const [i,u]of corrections.entries()){
 const row=data[i],e=u.error;assert.equal(u.prompt.slice(e.start,e.end),row[6]);assert.equal(e.text,row[6]);assert.deepEqual(u.answers,a2.units[i].answers.map(a=>row[4].replace('___',a)));assert.equal(transforms[i].prompt,row[8]);assert.deepEqual(transforms[i].answers,u.answers);assert(u.cue.includes('Adresse : '+row[1]));assert(u.explanation.includes('impératif'))
}
const f10=banks.find(b=>b.activityId==='gram-ex-f10-qcm-conj'),forms=new Set(f10.units.map(u=>u.answers[0]));assert.deepEqual([...forms].sort(),['devrais','devriez','pourrais','pourriez']);assert.equal(new Set(f10.units.map(u=>u.cue)).size,50);assert(f10.units.every(u=>['devoir','pouvoir'].includes(u.givenVerb)))
const lectures=require('../scripts/grammar_curriculum/conseiller-lectures-a2.json');assert.equal(lectures.length,20);assert(lectures.every(d=>Array.isArray(d.text)&&d.text.every(l=>l.length<=80)))
const before=p=>JSON.parse(cp.execFileSync('git',['show','f96dee7f0:'+p],{encoding:'utf8',maxBuffer:16*1024*1024})),p='src/grammaire/exercises/communication-data.json';assert.deepEqual(require('../'+p),before(p).filter(g=>g.subId!=='f10'))
const path='src/grammaire/exercises/bank/lessons-revised.ts',legacy=s=>JSON.parse(s.split('= ').slice(1).join('= '));assert.deepEqual(legacy(fs.readFileSync(root+'/'+path,'utf8')),legacy(cp.execFileSync('git',['show','f96dee7f0:'+path],{encoding:'utf8',maxBuffer:16*1024*1024})).filter(x=>!['f10','f11'].includes(x.subId)))
console.log(JSON.stringify({status:'passed',activities:10,banks:13,offerings:16,units:620,variants,authoredSituations:150,readingDocuments:20,readingQuestions:60,orderA2Positive:25,orderA2Negative:25,canonicalCorrectionSpans:50,teacherApprovedUnits:0,savedWorksheetCleanup:'deferred by owner'}))
