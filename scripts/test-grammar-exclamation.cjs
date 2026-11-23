const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection}=load(root+'/src/grammaire/curriculum/generate.ts')
const {validGrammarUnit,isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {buildGrammairePracticeTypes,resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {hasRetiredGrammarRecipe}=load(root+'/src/grammaire/curriculum/retirement.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.subthemeId==='c4')
const source=level=>fs.readFileSync(root+'/scripts/grammar_curriculum/exclamation-'+level.toLowerCase()+'.tsv','utf8').trim().split('\n').filter(l=>!l.startsWith('#')).map(l=>l.split('|'))
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,7);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),9)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),350)
assert.equal(banks.reduce((n,b)=>n+b.units.length*b.presentations.length,0),450)
const types=buildGrammairePracticeTypes().filter(t=>t.topic==='gram-exclamation');assert.equal(types.length,5)
for(const b of banks){
 assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,'c4')
 assert.equal(b.review.humanReview,'pending');assert.equal(new Set(b.units.map(u=>u.kind==='order'?u.answers[0]:u.prompt)).size,b.units.length)
 for(const presentation of b.presentations){
  const cfg={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarPresentation:presentation,grammarBankRevision:b.revision}
  const s=generateGrammarSelection(cfg,839);assert(isGrammarSnapshot(s));assert.deepEqual(generateGrammarSelection(cfg,839),s)
  const recipe=buildFicheRecipe(input([cfg]));assert(parseFicheRecipe(JSON.parse(JSON.stringify(recipe))))
  const game=convertRecipe(recipe);assert.equal(game.questions.length,50);assert(game.questions.every(q=>!('answer' in q)&&!('model' in q)&&!('correctId' in q)))
  if(presentation!=='choice')assert(game.questions.every(q=>q.compatibility==='teacher-led'))
  if(presentation==='gap')assert(Object.values(game.corrections).every(c=>!c.text.includes('___')),'Revealed examples must be complete sentences')
  if(presentation==='gap'&&b.level==='A2'){
   const models=Object.values(game.corrections).map(c=>c.text).join('\n');assert(models.includes('Qu’il fait froid !'));assert(!/Qu’\s+(?:il|elle|ils|elles|on)\b/u.test(models))
  }
 }
 for(const u of b.units){
  assert(validGrammarUnit(u));assert(u.answers.every(a=>u.kind==='completion'||a.endsWith('!')||u.kind==='production'))
  if(u.kind==='completion'){
   assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
   if(u.answers.length>1){const invalid=structuredClone(u);invalid.options.push({id:'autre-valide',text:u.answers[1]});assert(!validGrammarUnit(invalid),'A QCM cannot offer two correct words')}
  }
  if(u.kind==='production')assert.equal(u.writeLines,0)
 }
}
const a1=banks.find(b=>b.level==='A1'&&b.presentations.includes('choice'))
assert.deepEqual(Object.fromEntries(['Quel','Quelle','Quels','Quelles'].map(form=>[form,a1.units.filter(u=>u.answers[0]===form).length])),{Quel:13,Quelle:13,Quels:12,Quelles:12})
const order=banks.find(b=>b.presentations.includes('order'))
for(const u of order.units){assert.equal(u.tokens.map(t=>t.text).join(' ')+' !',u.answers[0]);assert.deepEqual(u.tokens.map(t=>t.category),['determinant','adjectif','nom'])}
const correction=banks.find(b=>b.presentations.includes('correct')),rows=source('A2')
for(const [index,u]of correction.units.entries()){
 const e=u.error;assert.equal(u.prompt.slice(e.start,e.end),e.text)
 assert.equal(u.answers[0],rows[index][3]);const tail=u.prompt.slice(e.end)
 for(const accepted of u.answers){assert(accepted.endsWith(tail));assert.notEqual(accepted,u.prompt)}
 assert(!u.answers.some(a=>a.startsWith('Comment ')));assert(!u.answers.some(a=>/Qu’\s/u.test(a)))
}
assert.equal(bankForType('gram-ex-c4-qcm-verbe').length,0)
const registry=require('../docs/grammaire/implementation/target-registry.json')
for(const id of ['gram-ex-c4-qcm-verbe','gram-ex-c4-curriculum-p'])assert.deepEqual(registry.activities.find(a=>a.activityId===id).pilotPreview.levels,['A1','A2'])
const old={domain:'grammaire',exerciseType:'gram-ex-c4-qcm-verbe',topic:'gram-exclamation',count:1,columns:1,difficulty:'facile'}
const fresh={...old,...defaultGrammarPilot(old.exerciseType)}
const cases=[{pages:[old]},{pages:[{...fresh,extraBlocks:[old]}]},{pages:[fresh],libreSnapshot:[old]},{pages:[fresh]},{pages:[{...old,exerciseType:'gram-ex-a1-co-theme'}]},{pages:[{...old,domain:'algèbre'}]},{pages:[{...old,exerciseType:'gram-ex-c5-qcm-verbe'}]}]
assert.deepEqual(cases.map(hasRetiredGrammarRecipe),[true,true,true,false,false,false,false]);assert.equal(parseFicheRecipe(input([old])),null)
const sql=fs.readFileSync(root+'/api/fiches/maintenance/purge-retired-grammar.sql','utf8')
const python="import json,sqlite3,sys\nx=json.load(sys.stdin);d=sqlite3.connect(':memory:');d.execute('CREATE TABLE fiches (id TEXT, recipe TEXT)');d.executemany('INSERT INTO fiches VALUES (?, ?)',[(str(i),json.dumps(r)) for i,r in enumerate(x['cases'])]);d.executescript(x['sql']);print(json.dumps([r[0] for r in d.execute('SELECT id FROM fiches ORDER BY id')]))"
assert.deepEqual(JSON.parse(cp.execFileSync('python3',['-c',python],{input:JSON.stringify({cases,sql}),encoding:'utf8'})),['3','4','5','6'])
console.log(JSON.stringify({status:'passed',banks:7,offerings:9,units:350,variants:450,sourceScenes:100,retirement:'app and D1 query agree',levels:['A1','A2']}))
