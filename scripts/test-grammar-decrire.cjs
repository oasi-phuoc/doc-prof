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
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-decrire'&&['f4','f5','f6','f7','f8'].includes(b.subthemeId))
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,16);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),21)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),800)
assert.equal(new Set(banks.map(b=>b.activityId)).size,16)
const types=buildGrammairePracticeTypes().filter(t=>banks.some(b=>b.activityId===t.id));assert.equal(types.length,16)
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
assert.equal(variants,1050)

const crypto=require('node:crypto')
const source=sub=>fs.readFileSync(root+'/scripts/grammar_curriculum/decrire-'+sub+'-a1.tsv','utf8').trim().split('\n').filter(s=>!s.startsWith('#')).map(s=>s.split('|'))
const qcm=sub=>banks.find(b=>b.activityId==='gram-ex-'+sub+'-qcm-verbe')
for(const b of banks){
 if(b.presentations.includes('match'))assert.equal(new Set(b.units.map(u=>u.pairs.map(p=>p.sourceId).sort().join('|'))).size,50)
 assert.equal(b.units.length,50);assert.equal(new Set(b.units.map(u=>u.prompt+(u.cue??u.task??'')+(u.situation??''))).size,50)
 for(const u of b.units){
  if(u.kind==='completion'){assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1);assert(u.prompt.includes('___'))}
  if(u.kind==='match'){assert.equal(u.pairs.length,2);assert.equal(new Set(u.pairs.map(p=>p.right)).size,2)}
  if(u.kind==='production'||u.kind==='scenario'){assert(u.rubric.length>=3);assert.equal(u.writeLines,u.kind==='production'&&u.mode==='written'?4:0)}
 }
}
const weather=qcm('f4');assert(weather.units.every(u=>u.imageSupports.length===1))
assert.deepEqual([...new Set(weather.units.map(u=>u.answers[0].toLocaleLowerCase('fr')))].sort(),['il fait','il neige','il pleut','il y a'])
const manifest=require('../docs/grammaire/implementation/decrire-media-manifest.json');assert.equal(manifest.images.length,8);assert.equal(manifest.obligations[0].reviewedIllustratedSituations,50);assert.equal(manifest.obligations[0].unitIds.length,50)
for(const image of manifest.images){
 assert(!/\/(chaud|froid)\.webp$/.test(image.source.path));const data=fs.readFileSync(root+'/public'+image.src)
 assert.equal(crypto.createHash('sha256').update(data).digest('hex'),image.sha256);assert.deepEqual(data,fs.readFileSync(root+'/public'+image.source.path));assert(image.alt.length>20)
}
const f5=qcm('f5');for(const [i,u]of banks.find(b=>b.activityId==='gram-ex-f5-curriculum-c').units.entries()){
 const e=u.error;assert.equal(u.prompt.slice(e.start,e.end),e.text);assert.equal(u.prompt.slice(0,e.start)+f5.units[i].answers[0]+u.prompt.slice(e.end),u.answers[0]);assert(['Ce est','Il sont','Elle sont','il y as'].includes(e.text))
}
for(const u of banks.find(b=>b.activityId==='gram-ex-f5-curriculum-t').units)assert(!u.answers[0].includes('?')&&!u.answers[0].includes('—'))
assert(f5.units.filter(u=>['Il est','Elle est'].includes(u.answers[0])).every(u=>u.cue.includes('pronom personnel')))
const poss=qcm('f6'),p=id=>poss.units.find(u=>u.id.endsWith('-'+id)).answers[0]
for(const [id,a]of Object.entries({'sac-je':'Mon','cle-je':'Ma','livres-je':'Mes','adresse-je':'Mon','amie-je':'Mon','histoire-tu':'Ton','haie-luc':'Sa','sac-nora':'Son','voiture-paul':'Sa','histoire-nora':'Son','local-nous':'Notre','livres-nous':'Nos','salle-vous':'Votre','billets-vous':'Vos','local-ils':'Leur','voiture-elles':'Leur','velos-ils':'Leurs'}))assert.equal(p(id),a)
assert.deepEqual([...new Set(poss.units.map(u=>u.answers[0]))].sort(),['Mon','Ma','Mes','Ton','Ta','Tes','Son','Sa','Ses','Notre','Nos','Votre','Vos','Leur','Leurs'].sort())
const adjectives=qcm('f7');for(const [i,u]of adjectives.units.entries()){
 const row=source('f7')[i],expected=row[1+(row[7]==='pluriel'?2:0)+(row[6]==='féminin'?1:0)];assert.equal(u.answers[0],expected);assert(u.prompt.startsWith(row[5]));assert(u.options.every(o=>row.slice(1,5).includes(o.text)))
}
assert(adjectives.units.some(u=>u.options.length===2));assert.equal(adjectives.units.find(u=>u.id.endsWith('fleurs-belles')).answers[0],'belles')
const professions=qcm('f8');assert.equal(new Set(professions.units.map(u=>u.answers[0])).size,50)
const jobs=source('f8');for(const [i,u]of professions.units.entries()){
 for(const o of u.options.filter(o=>!u.answers.includes(o.text)))assert.notEqual(jobs.find(r=>r[3]===o.text)[1],jobs[i][1]);assert(u.answers.includes(jobs[i][3]))
}
const oralJobs=banks.find(b=>b.activityId==='gram-ex-f8-curriculum-p');assert(oralJobs.units.every(u=>u.answers[0].startsWith('Je suis ')&&u.task.includes('« je »')))
const scenarios=banks.find(b=>b.activityId==='gram-ex-f8-curriculum-s').units;assert(scenarios.every(u=>u.contract==='open'&&!u.questions&&u.turns[0].text==='Quel est votre métier ?'&&u.followUps.length===1))
const retired=require('../src/grammaire/curriculum/retired-subthemes.json')
const before=JSON.parse(cp.execFileSync('git',['show','cb5e6b883:src/grammaire/exercises/bank/lessons-revised.ts'],{encoding:'utf8'}).split('= ').slice(1).join('= ')),after=JSON.parse(fs.readFileSync(root+'/src/grammaire/exercises/bank/lessons-revised.ts','utf8').split('= ').slice(1).join('= '));assert.deepEqual(after,before.filter(x=>!retired.includes(x.subId)))
for(const sub of ['f4','f5','f6','f7','f8']){
 const b=qcm(sub),old={domain:'grammaire',exerciseType:b.activityId,topic:b.topic,count:1,columns:1,difficulty:'facile'},fresh={...old,...defaultGrammarPilot(old.exerciseType)}
 assert.equal(bankForType(old.exerciseType).length,0);assert.equal(parseFicheRecipe(input([old])),null);assert(hasRetiredGrammarRecipe({pages:[old]}));assert(!hasRetiredGrammarRecipe({pages:[fresh]}))
}
console.log(JSON.stringify({status:'passed',activities:16,offerings:21,units:800,variants,authoredSituations:250,illustratedSituations:50,distinctImages:8,associationGroups:100,associationPairs:200,openScenarios:50,teacherApprovedUnits:0,historicalWrittenBanksRemoved:5,savedWorksheets:'untouched, cleanup deferred by owner'}))
