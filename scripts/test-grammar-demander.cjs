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
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-demander')
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,13);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),16)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),620)
assert.equal(new Set(banks.map(b=>b.activityId)).size,13)
const types=buildGrammairePracticeTypes().filter(t=>banks.some(b=>b.activityId===t.id));assert.equal(types.length,13)
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
assert.equal(variants,810)
const {grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {applyType}=load(root+'/src/components/generator/page-helpers.ts')
const demonstratives=banks.find(b=>b.activityId==='gram-ex-f1-qcm-verbe')
const example=(id)=>demonstratives.units.find(u=>u.id.endsWith('-'+id))
for(const [id,answer]of [['livre','Ce'],['heros','Ce'],['ami','Cet'],['hotel','Cet'],['homme','Cet'],['heure','Cette'],['image','Cette'],['hotels','Ces'],['ecoles','Ces']])assert.equal(example(id).answers[0],answer)
assert.deepEqual(Object.fromEntries(['Ce','Cet','Cette','Ces'].map(a=>[a,demonstratives.units.filter(u=>u.answers[0]===a).length])),{Ce:12,Cet:12,Cette:13,Ces:13})
const correction=banks.find(b=>b.activityId==='gram-ex-f1-curriculum-c')
for(const [i,u]of correction.units.entries()){
 const e=u.error;assert.equal(u.prompt.slice(e.start,e.end),e.text);assert.equal(u.prompt.slice(0,e.start)+demonstratives.units[i].answers[0]+u.prompt.slice(e.end),u.answers[0]);assert.notEqual(e.text,demonstratives.units[i].answers[0])
}
const sourceRows=fs.readFileSync(root+'/scripts/grammar_curriculum/demander-f2-a1.tsv','utf8').trim().split('\n').filter(s=>!s.startsWith('#')).map(s=>s.split('|'))
const conjugations={pouvoir:{je:'peux',tu:'peux',il:'peut',elle:'peut',nous:'pouvons',vous:'pouvez',ils:'peuvent',elles:'peuvent'},devoir:{je:'dois',tu:'dois',il:'doit',elle:'doit',nous:'devons',vous:'devez',ils:'doivent',elles:'doivent'},vouloir:{je:'veux',tu:'veux',il:'veut',elle:'veut',nous:'voulons',vous:'voulez',ils:'veulent',elles:'veulent'}}
const requests=banks.find(b=>b.activityId==='gram-ex-f2-qcm-conj')
for(const [i,u]of requests.units.entries()){
 const row=sourceRows[i];assert.equal(u.givenVerb,row[1]);assert.equal(u.answers[0],conjugations[row[1]][row[2]]);assert.equal(u.options.filter(o=>o.text===u.answers[0]).length,1);assert(u.cue.length>40)
}
const order=banks.find(b=>b.activityId==='gram-ex-f3-curriculum-o')
const cfg={domain:'grammaire',topic:'gram-demander',exerciseType:order.activityId,difficulty:'facile',count:50,columns:1,...defaultGrammarPilot(order.activityId)}
assert.equal(cfg.phrasePolarity,'mixed');assert.equal(grammarEligibleCount(cfg),50);for(const phrasePolarity of ['positive','negative'])assert.equal(grammarEligibleCount({...cfg,phrasePolarity}),25)
assert.equal(applyType(types.find(t=>t.id===order.activityId),{...cfg,phrasePolarity:'positive'}).phrasePolarity,'mixed')
assert(order.units.every(u=>u.tokens.length>=6&&u.tokens.length<=32));assert(order.units.some(u=>u.tokens.some(t=>t.text==='d’')&&u.answers[0].includes('d’accord')))
const scenarios=banks.flatMap(b=>b.units).filter(u=>u.kind==='scenario');assert.equal(scenarios.length,100)
for(const u of scenarios){assert.equal(u.contract,'open');assert(!u.questions);assert(u.turns.every(t=>!t.text.includes('___')&&!t.questionId));assert.equal(u.followUps.length,1);assert(u.rubric.length>=3);assert.equal(u.writeLines,0)}
const readings=banks.flatMap(b=>b.units).filter(u=>u.kind==='reading');assert.equal(readings.length,20);assert.equal(new Set(readings.map(u=>u.text)).size,20);assert.equal(readings.flatMap(u=>u.questions).length,60)
for(const u of readings){assert.deepEqual(u.answers,[]);for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))}
const retired=require('../src/grammaire/curriculum/retired-subthemes.json')
const before=JSON.parse(cp.execFileSync('git',['show','e4e22deae:src/grammaire/exercises/bank/lessons-revised.ts'],{encoding:'utf8'}).split('= ').slice(1).join('= '));const after=JSON.parse(fs.readFileSync(root+'/src/grammaire/exercises/bank/lessons-revised.ts','utf8').split('= ').slice(1).join('= '));assert.deepEqual(after,before.filter(x=>!retired.includes(x.subId)))
const beforeCommunication=JSON.parse(cp.execFileSync('git',['show','e4e22deae:src/grammaire/exercises/communication-data.json'],{encoding:'utf8'}));assert.deepEqual(require('../src/grammaire/exercises/communication-data.json'),beforeCommunication.filter(x=>!require('../src/grammaire/curriculum/retired-subthemes.json').includes(x.subId)))
const cases=[]
for(const sub of ['f1','f2','f3']){
 const b=banks.find(b=>b.subthemeId===sub&&b.presentations.includes('choice')),old={domain:'grammaire',exerciseType:b.activityId,topic:b.topic,count:1,columns:1,difficulty:'facile'},fresh={...old,...defaultGrammarPilot(old.exerciseType)}
 assert.equal(bankForType(old.exerciseType).length,0);assert.equal(parseFicheRecipe(input([old])),null);cases.push({pages:[old]},{pages:[{...fresh,extraBlocks:[old]}]},{pages:[fresh],libreSnapshot:[old]},{pages:[fresh]},{pages:[{...old,domain:'tcm'}]})
}
assert.deepEqual(cases.map(hasRetiredGrammarRecipe),cases.map((_,i)=>i%5<3))
const sql=fs.readFileSync(root+'/api/fiches/maintenance/purge-retired-grammar.sql','utf8'),python="import json,sqlite3,sys\nx=json.load(sys.stdin);d=sqlite3.connect(':memory:');d.execute('CREATE TABLE fiches (id TEXT, recipe TEXT)');d.executemany('INSERT INTO fiches VALUES (?, ?)',[(str(i),json.dumps(r)) for i,r in enumerate(x['cases'])]);d.executescript(x['sql']);print(json.dumps([r[0] for r in d.execute('SELECT id FROM fiches ORDER BY CAST(id AS INTEGER)')]))"
assert.deepEqual(JSON.parse(cp.execFileSync('python3',['-c',python],{input:JSON.stringify({cases,sql}),encoding:'utf8'})),cases.flatMap((_,i)=>i%5>=3?[String(i)]:[]))
console.log(JSON.stringify({status:'passed',activities:13,banks:13,offerings:16,units:620,variants,authoredSourceRows:170,documents:20,documentQuestions:60,groupedAssociationUnits:100,associationPairs:200,openScenarios:100,teacherApprovedUnits:0,historicalWrittenBanksRemoved:3,savedWorksheets:'untouched, cleanup deferred by owner'}))
