const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection}=load(root+'/src/grammaire/curriculum/generate.ts')
const {assertGrammarBank,isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {buildGrammairePracticeTypes,resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {activityDailyBanks}=load(root+'/src/grammaire/curriculum/daily-bank-aliases.ts')
const {hasRetiredGrammarRecipe}=load(root+'/src/grammaire/curriculum/retirement.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-activite')
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,11);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),15)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),520)
assert.equal(new Set(banks.map(b=>b.activityId)).size,10)
const types=buildGrammairePracticeTypes().filter(t=>banks.some(b=>b.activityId===t.id))
assert.equal(types.length,10)
let variants=0
for(const b of banks){
 assertGrammarBank(b);assert.equal(b.review.humanReview,'pending')
 assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,b.subthemeId)
 assert.equal(types.find(t=>t.id===b.activityId).label,b.label)
 for(const presentation of b.presentations){
  const cfg={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarPresentation:presentation,grammarBankRevision:b.revision,...(presentation==='document-set'?{grammarDocumentCount:20}:{})}
  const s=generateGrammarSelection(cfg,839);assert(isGrammarSnapshot(s));assert.deepEqual(generateGrammarSelection(cfg,839),s)
  const expected=presentation==='document-set'?60:50;variants+=expected
  const recipe=buildFicheRecipe(input([cfg]));assert(parseFicheRecipe(JSON.parse(JSON.stringify(recipe))))
  const game=convertRecipe(recipe);assert.equal(game.questions.length,expected)
  assert(game.questions.every(q=>!('answer' in q)&&!('model' in q)&&!('correctId' in q)))
  if(!['choice','document-set'].includes(presentation))assert(game.questions.every(q=>q.compatibility==='teacher-led'))
  if(presentation==='gap')for(const c of Object.values(game.corrections)){
   assert(!c.text.includes('___'));assert(!/(?:que|de) (?:elle|eux|elles)\b|l’\s+(?:escalade)\b/u.test(c.text),'Correction includes malformed elision: '+c.text)
  }
 }
}
assert.equal(variants,760)
// Semantic identity includes the explicit cue: a repeated short frame is not a duplicate situation.
const tone=banks.find(b=>b.activityId==='gram-ex-d3-qcm-verbe'&&b.level==='A2')
assert(tone.units.filter(u=>u.prompt==='Je pense ___.').length>=2)
const duplicate=structuredClone(tone);duplicate.units[1]={...structuredClone(duplicate.units[0]),id:'duplicate-context'}
assert.throws(()=>assertGrammarBank(duplicate))
const forms=new Set(banks.find(b=>b.activityId===tone.activityId&&b.level==='A1').units.map(u=>u.answers[0].toLowerCase()))
assert.deepEqual([...forms].sort(),['moi','toi','lui','elle','nous','vous','eux','elles'].sort())
for(const u of tone.units){
 assert(u.cue.includes('Groupe à reprendre'))
 assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
 for(const text of [...u.answers,...u.options.map(o=>o.text)])assert(!/(?:que|de) (?:elle|eux|elles)\b/u.test(text))
}
assert(tone.units.some(u=>u.answers[0]==='qu’elle'));assert(tone.units.some(u=>u.answers[0]==='près d’eux'))
const scenarios=banks.find(b=>b.presentations.includes('scenario-set'))
for(const u of scenarios.units){assert.equal(u.contract,'open');assert.equal(u.questions,undefined);assert(u.turns.every(t=>!t.text.includes('___')&&!t.questionId));assert(u.rubric.length>=3);assert(u.followUps.length);assert(!u.turns.some(t=>t.text===u.answers[0]))}
const canonical=GRAMMAR_PILOT_BANKS.filter(b=>b.subthemeId==='pronominaux'),original=JSON.stringify(canonical)
const aliases=activityDailyBanks(canonical)
assert.equal(aliases.length,3)
for(const b of aliases){
 const source=canonical.find(c=>'shared:'+c.activityId+':A1'===b.units[0].source.partition)
 assert(source);assert(b.revision.endsWith(source.revision));assert.equal(b.units.length,source.units.length)
 for(const [i,u]of b.units.entries()){
  const {id,source:s,...content}=u,{id:oldId,source:oldSource,...oldContent}=source.units[i]
  assert.notEqual(id,oldId);assert.deepEqual(content,oldContent);assert.equal(s.position,i)
  assert.equal(s.path,'src/grammaire/curriculum/data/pronominaux.json')
 }
}
aliases[0].units[0].answers[0]='mutation de test';assert.equal(JSON.stringify(canonical),original)
assert.throws(()=>activityDailyBanks([]))
const images=require('../docs/grammaire/implementation/activite-media-manifest.json')
assert.equal(images.reviewedIllustratedSituations,50);assert.equal(images.distinctImages,11)
const imageUnits=banks.find(b=>b.activityId===images.hostActivityId).units
assert(imageUnits.every(u=>u.imageSupports?.length===1));assert.equal(images.images.flatMap(i=>i.unitIds).length,50)
const digest=b=>crypto.createHash('sha256').update(b).digest('hex')
for(const image of images.images){
 const bytes=fs.readFileSync(root+'/public'+image.src),origin=fs.readFileSync(root+'/public'+image.source.path)
 assert.equal(digest(bytes),image.sha256);assert.deepEqual(bytes,origin);assert(image.width>100&&image.height>100)
 assert.equal(image.source.rights,'permitted-reuse');assert(fs.existsSync(root+'/'+image.source.manifest))
}
const readings=banks.find(b=>b.presentations.includes('document-set')).units
assert.equal(readings.length,20);assert.equal(new Set(readings.map(u=>u.text)).size,20)
assert.equal(readings.flatMap(u=>u.questions).length,60)
for(const u of readings)for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))
const cases=[]
for(const sub of ['d1','d2','d3']){
 const b=banks.find(b=>b.subthemeId===sub&&b.presentations.includes('choice'))
 const old={domain:'grammaire',exerciseType:b.activityId,topic:b.topic,count:1,columns:1,difficulty:'facile'}
 const fresh={...old,...defaultGrammarPilot(old.exerciseType)}
 assert.equal(bankForType(old.exerciseType).length,0)
 assert.equal(parseFicheRecipe(input([old])),null)
 cases.push({pages:[old]},{pages:[{...fresh,extraBlocks:[old]}]},{pages:[fresh],libreSnapshot:[old]},{pages:[fresh]},{pages:[{...old,domain:'tcm'}]})
}
const expected=cases.flatMap((_,i)=>i%5>=3?[String(i)]:[])
assert.deepEqual(cases.map(hasRetiredGrammarRecipe),cases.map((_,i)=>i%5<3))
const sql=fs.readFileSync(root+'/api/fiches/maintenance/purge-retired-grammar.sql','utf8')
const python="import json,sqlite3,sys\nx=json.load(sys.stdin);d=sqlite3.connect(':memory:');d.execute('CREATE TABLE fiches (id TEXT, recipe TEXT)');d.executemany('INSERT INTO fiches VALUES (?, ?)',[(str(i),json.dumps(r)) for i,r in enumerate(x['cases'])]);d.executescript(x['sql']);print(json.dumps([r[0] for r in d.execute('SELECT id FROM fiches ORDER BY CAST(id AS INTEGER)')]))"
assert.deepEqual(JSON.parse(cp.execFileSync('python3',['-c',python],{input:JSON.stringify({cases,sql}),encoding:'utf8'})),expected)
console.log(JSON.stringify({status:'passed',activities:10,banks:11,offerings:15,units:520,variants,sharedDailyUnits:150,illustratedSituations:50,distinctImages:11,documents:20,documentQuestions:60,openScenarios:50,retirement:'app and D1 query agree'}))
