const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection}=load(root+'/src/grammaire/curriculum/generate.ts')
const {assertGrammarBank,isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {validGrammarImage}=load(root+'/src/grammaire/curriculum/image-support.ts')
const {validWordPlacements}=load(root+'/src/interactive/domain/word-sorting.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {buildGrammairePracticeTypes,resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {hasRetiredGrammarRecipe}=load(root+'/src/grammaire/curriculum/retirement.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-espace')
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,14);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),18)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),670)
assert.equal(new Set(banks.map(b=>b.activityId)).size,12)
const types=buildGrammairePracticeTypes().filter(t=>banks.some(b=>b.activityId===t.id));assert.equal(types.length,12)
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
assert.equal(variants,910)
const e1=banks.find(b=>b.activityId==='gram-ex-e1-qcm-verbe')
assert.deepEqual([...new Set(e1.units.map(u=>u.answers[0]))].sort(),['sur','sous','dans','devant','derrière','entre'].sort())
const imageWords={'espace-sur':'sur','espace-sous':'sous','espace-dans':'dans','espace-devant':'devant','espace-derrière':'derrière','espace-entre':'entre'}
for(const u of e1.units){assert.equal(imageWords[u.imageSupports[0].id],u.answers[0]);assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)}
const e6=banks.filter(b=>b.activityId==='gram-ex-e6-qcm-verbe')
for(const b of e6)for(const u of b.units){
 assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
 assert(!u.prompt.includes('___ le ')&&!u.prompt.includes('___ les '),'De + article must be inside the requested group when contracted')
 for(const a of u.answers)assert(!/\bde le\b|\bde les\b/u.test(u.prompt.replace('___',a)))
}
assert(e6.find(b=>b.level==='A1').units.some(u=>u.answers[0]==='près du'))
assert(e6.find(b=>b.level==='A2').units.some(u=>u.answers[0]==='jusqu’au pont'))
const form=banks.find(b=>b.activityId==='gram-ex-e7-qcm-verbe'),correction=banks.find(b=>b.presentations.includes('correct'))
const expectedForms=['au','du','aux','des','à la','de la','à l’','de l’'];assert.deepEqual([...new Set(form.units.map(u=>u.answers[0]))].sort(),expectedForms.sort())
for(const [i,u]of correction.units.entries()){
 const source=form.units[i],error=u.error;assert.equal(u.prompt.slice(error.start,error.end),error.text)
 assert.equal(u.answers[0],source.prompt.replace('___',source.answers[0]));assert(!u.answers[0].includes('___'))
 assert(!/l’\s+[a-zé]/iu.test(u.answers[0]));assert(!/\b(?:à le|à les|de le|de les|au école|du hôpital)\b/u.test(u.answers[0]))
}
const images=require('../docs/grammaire/implementation/espace-media-manifest.json')
assert.equal(images.obligations.length,3);assert.equal(images.distinctImages,15)
for(const o of images.obligations){
 assert.equal(o.reviewedIllustratedSituations,50);const bank=banks.find(b=>b.activityId===o.hostActivityId&&b.level===o.level);assert(bank)
 assert.deepEqual(o.unitIds,bank.units.map(u=>u.id));assert(bank.units.every(u=>u.imageSupports?.length===1))
 assert.equal(o.distinctImages,new Set(bank.units.map(u=>u.imageSupports[0].sha256)).size)
}
const digest=b=>crypto.createHash('sha256').update(b).digest('hex')
for(const image of images.images){
 assert(validGrammarImage(image));const bytes=fs.readFileSync(root+'/public'+image.src),origin=fs.readFileSync(root+'/public'+image.source.path)
 assert.equal(digest(bytes),image.sha256);assert.deepEqual(bytes,origin)
 for(const use of image.uses){const u=banks.find(b=>b.activityId===use.activityId&&b.units.some(u=>u.id===use.unitId))?.units.find(u=>u.id===use.unitId);assert(u?.imageSupports.some(s=>s.id===image.id))}
}
const french=images.images.find(i=>i.source.path.includes('à-côté'));assert(french&&validGrammarImage(french))
for(const path of ['/lib/images/../secret.webp','/lib/images/%2e%2e/secret.webp','https://example.org/image.webp','/lib/images/x.webp?token=x','/lib/images/x\\secret.webp'])assert(!validGrammarImage({...french,source:{...french.source,path}}))
const readings=banks.find(b=>b.presentations.includes('document-set')).units
assert.equal(readings.length,20);assert.equal(new Set(readings.map(u=>u.text)).size,20);assert.equal(readings.flatMap(u=>u.questions).length,60)
for(const u of readings)for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))
const scenarios=banks.find(b=>b.presentations.includes('scenario-set')).units
for(const u of scenarios){assert.equal(u.contract,'open');assert.equal(u.questions,undefined);assert(u.turns.every(t=>!t.text.includes('___')&&!t.questionId));assert(u.rubric.length>=3);assert(u.followUps.length)}
const r=require('../docs/grammaire/implementation/target-registry.json')
for(const id of ['gram-ex-e6-qcm-verbe','gram-ex-e6-curriculum-p'])assert.deepEqual(r.activities.find(a=>a.activityId===id).pilotPreview.levels,['A1','A2'])
const cases=[]
for(const sub of ['e1','e6','e7']){
 const b=banks.find(b=>b.subthemeId===sub&&b.presentations.includes('choice'))
 const old={domain:'grammaire',exerciseType:b.activityId,topic:b.topic,count:1,columns:1,difficulty:'facile'}
 const fresh={...old,...defaultGrammarPilot(old.exerciseType)}
 assert.equal(bankForType(old.exerciseType).length,0);assert.equal(parseFicheRecipe(input([old])),null)
 cases.push({pages:[old]},{pages:[{...fresh,extraBlocks:[old]}]},{pages:[fresh],libreSnapshot:[old]},{pages:[fresh]},{pages:[{...old,domain:'tcm'}]})
}
const expected=cases.flatMap((_,i)=>i%5>=3?[String(i)]:[]);assert.deepEqual(cases.map(hasRetiredGrammarRecipe),cases.map((_,i)=>i%5<3))
const sql=fs.readFileSync(root+'/api/fiches/maintenance/purge-retired-grammar.sql','utf8')
const python="import json,sqlite3,sys\nx=json.load(sys.stdin);d=sqlite3.connect(':memory:');d.execute('CREATE TABLE fiches (id TEXT, recipe TEXT)');d.executemany('INSERT INTO fiches VALUES (?, ?)',[(str(i),json.dumps(r)) for i,r in enumerate(x['cases'])]);d.executescript(x['sql']);print(json.dumps([r[0] for r in d.execute('SELECT id FROM fiches ORDER BY CAST(id AS INTEGER)')]))"
assert.deepEqual(JSON.parse(cp.execFileSync('python3',['-c',python],{input:JSON.stringify({cases,sql}),encoding:'utf8'})),expected)
console.log(JSON.stringify({status:'passed',activities:12,banks:14,offerings:18,units:670,variants,illustratedSituations:150,distinctImages:15,documents:20,documentQuestions:60,groupedAssociations:100,associationPairs:200,openScenarios:50,retirement:'app and D1 query agree'}))
