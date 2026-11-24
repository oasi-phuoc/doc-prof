const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{generateGrammarSelection}=load(root+'/src/grammaire/curriculum/generate.ts'),{isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts'),{buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts'),{bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts'),{buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const subs=['f13','f14','description-physique'],banks=GRAMMAR_PILOT_BANKS.filter(b=>subs.includes(b.subthemeId)),types=buildGrammairePracticeTypes(),registry=require('../docs/grammaire/implementation/target-registry.json')
assert.equal(banks.length,19);assert.equal(new Set(banks.map(b=>b.activityId)).size,12);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),24)
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
let variants=0
for(const b of banks){
 assert.equal(b.units.length,b.presentations.includes('document-set')?20:50);assert.equal(b.review.humanReview,'pending');assert.equal(bankForType(b.activityId).length,0);assert(types.some(t=>t.id===b.activityId&&t.label===b.label))
 for(const p of b.presentations){
  assert(registry.offerings.some(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p));const reading=p==='document-set'
  const cfg={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:reading?1:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarBankRevision:b.revision,grammarPresentation:p,...(reading?{grammarDocumentCount:20}:{})}
  const a=generateGrammarSelection(cfg,839);assert(isGrammarSnapshot(a));assert.deepEqual(a,generateGrammarSelection(cfg,839));assert.notDeepEqual(a.questions.map(q=>q.id),generateGrammarSelection(cfg,840).questions.map(q=>q.id));const r=buildFicheRecipe(input([cfg]));assert(parseFicheRecipe(JSON.parse(JSON.stringify(r))))
  variants+=reading?b.units.reduce((n,u)=>n+u.questions.length,0):50
  for(const u of b.units){
   if(u.kind==='completion')assert.equal(u.options.filter(c=>u.answers.includes(c.text)).length,1)
   if(u.kind==='production'){assert(u.rubric.length>=3);assert(!u.task.includes('___'));assert(u.explanation.includes('exclusif'));assert(u.mode==='oral'?u.writeLines===0:u.writeLines>=3);if(b.level==='A2')assert(u.rubric.some(c=>/Choix/.test(c.label)))}
   if(u.kind==='reading'){assert.equal(u.questions.length,3);assert.equal(u.questions.filter(q=>q.response==='choice').length,2);assert.equal(u.questions.filter(q=>q.response==='short').length,1);for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))}
  }
 }
}
assert.equal(variants,1210)
const source=(prefix,level)=>fs.readFileSync(root+'/scripts/grammar_curriculum/'+prefix+'-'+level.toLowerCase()+'.tsv','utf8').trim().split('\n').filter(s=>!s.startsWith('#')).map(s=>s.split('|'))
for(const level of ['A1','A2']){
 const sb=banks.find(b=>b.subthemeId==='f13'&&b.level===level&&b.presentations.includes('choice')),src=source('superlatif-f13',level);assert.equal(new Set(src.map(r=>r[0])).size,50)
 src.forEach((r,i)=>{const facts=r[2].split(';').map(s=>{const [label,n]=s.split('=');return {label,n:Number(n)}}),values=facts.map(f=>f.n),extreme=r[4]==='max'?Math.max(...values):Math.min(...values);assert.deepEqual(facts.filter(f=>f.n===extreme).map(f=>f.label),[r[5]]);assert(sb.units[i].cue.includes(r[1]));assert(sb.units[i].answers.every(a=>a.startsWith(r[8]+' ')));assert(sb.units[i].prompt.endsWith(r[10]+'.'))})
 const qb=banks.find(b=>b.subthemeId==='f14'&&b.level===level&&b.presentations.includes('choice')),qs=source('quantites-f14',level),seen=new Set();assert.equal(new Set(qs.map(r=>r[0])).size,50)
 qs.forEach((r,i)=>{const [id,context,l,rhs,kind,onset,prompt]=r,a=qb.units[i].answers[0],prefix=Number(l)>Number(rhs)?'plus':Number(l)<Number(rhs)?'moins':'autant';assert(a.startsWith(prefix));assert.equal(a,kind==='verbe'?prefix:prefix+(onset==='oui'?' d’':' de'));assert.equal(qb.units[i].prompt,prompt);assert.equal(qb.units[i].cue,context);seen.add(kind+':'+prefix);if(kind==='nom'&&onset==='oui')assert(prompt.includes('___')&&!prompt.includes('___ '))})
 for(const k of ['nom','verbe'])for(const relation of ['plus','moins','autant'])assert(seen.has(k+':'+relation))
}
const superA2=banks.find(b=>b.subthemeId==='f13'&&b.level==='A2'&&b.presentations.includes('choice'))
const ends=id=>superA2.units.find(u=>u.id.endsWith('-'+id))
assert.equal(ends('qualite-outil').answers[0],'les meilleurs');assert.equal(ends('qualite-solutions').answers[0],'les meilleures');assert.deepEqual(ends('mauvaise-route').answers,['la pire','la plus mauvaise']);assert.equal(ends('train-budget').answers[0],'le plus rapide')
const qb=banks.find(b=>b.subthemeId==='f14'&&b.level==='A1'&&b.presentations.includes('choice'))
for(const [id,answer]of Object.entries({eau:'autant d’',pommes:'plus de',sel:'moins de',travail:'plus',lecture:'moins',natation:'autant'}))assert.equal(qb.units.find(u=>u.id.endsWith('-'+id)).answers[0],answer)
const media=require('../docs/grammaire/implementation/physique-media-manifest.json');assert.equal(media.distinctImages,10);assert.equal(media.obligations[0].unitIds.length,50)
for(const s of media.images){for(const p of [s.src,s.source.path])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/public'+p)).digest('hex'),s.sha256);assert.equal(s.source.rights,'permitted-reuse')}
const phys=banks.find(b=>b.subthemeId==='description-physique'&&b.presentations.includes('choice'));assert.equal(new Set(phys.units.map(u=>u.imageSupports[0].sha256)).size,10);for(const image of media.images)assert.equal(phys.units.filter(u=>u.imageSupports[0].sha256===image.sha256).length,5)
for(const id of ['lisa-chemise','nadia-pull'])assert(phys.units.find(u=>u.id.endsWith('-'+id)).explanation.includes('invariables'))
const before=path=>JSON.parse(cp.execFileSync('git',['show','31c9081c3:'+path],{encoding:'utf8',maxBuffer:16*1024*1024})),p='src/grammaire/exercises/communication-data.json';assert.deepEqual(require('../'+p),before(p).filter(r=>!require('../src/grammaire/curriculum/retired-subthemes.json').includes(r.subId)))
assert(!load(root+'/src/grammaire/exercises/communication.ts').GRAM_COMMUNICATION_GROUPS.some(g=>g.subId==='description-physique'))
const theme=banks=>banks.filter(b=>b.topic==='gram-decrire');assert.equal(theme(GRAMMAR_PILOT_BANKS).reduce((n,b)=>n+b.presentations.length,0),registry.offerings.filter(o=>o.themeId==='gram-decrire').length)
console.log(JSON.stringify({status:'passed',activities:12,banks:19,offerings:24,units:920,variants,authoredObservations:250,readingDocuments:20,readingQuestions:60,images:10,themeOfferings:63,teacherApprovedUnits:0}))
