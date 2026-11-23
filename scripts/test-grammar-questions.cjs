const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,grammarUsesGradedDefault,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection}=load(root+'/src/grammaire/curriculum/generate.ts')
const {validGrammarUnit,isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {hasRetiredGrammarRecipe,isRetiredGrammarType}=load(root+'/src/grammaire/curriculum/retirement.ts')
const {buildGrammairePracticeTypes,resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {applyType}=load(root+'/src/components/generator/page-helpers.ts')
const {prune}=require('./prune-retired-grammar-fiches.cjs')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-questions'),types=buildGrammairePracticeTypes()
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,22);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),24)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),920)
for(const b of banks){
 assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,b.subthemeId)
 assert(grammarUsesGradedDefault(b.activityId));const type=types.find(t=>t.id===b.activityId);assert(type,b.activityId)
 const patch=applyType(type,{topic:'gram-questions',exerciseType:'gram-ex-c1-question-est-ce-que',count:3,columns:1,difficulty:'facile'})
 assert.equal(patch.grammarLevel,'A1')
 const config={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:b.presentations.includes('document-set')?1:50,...defaultGrammarPilot(b.activityId),...(b.presentations.includes('document-set')?{grammarDocumentCount:20}:{})}
 const s=generateGrammarSelection(config,839);assert(isGrammarSnapshot(s));const r=buildFicheRecipe(input([config]));assert(parseFicheRecipe(JSON.parse(JSON.stringify(r))))
 const game=convertRecipe(r)
 if(b.activityId.includes('reading-write')){
  assert(game.questions.every(q=>q.mode==='oral'&&q.compatibility==='teacher-led'));assert(game.questions.every(q=>!q.choices.length))
  assert(Object.values(game.corrections).every(c=>c.text.includes('Modèle possible')&&c.text.includes('Repères enseignant')))
 }
 for(const u of b.units){
  assert(validGrammarUnit(u))
  if(u.kind==='transform'&&b.subthemeId!=='c1')assert(u.directive.includes('Information à demander'))
  if(u.kind==='transform'&&b.subthemeId==='c1')assert.equal(u.directiveDisplay,'heading')
  if(u.kind==='reading')for(const child of u.questions){
   assert(child.evidence.every(q=>u.text.includes(q)))
   if(b.activityId.endsWith('-write')){
    assert(child.writingTask&&child.writingTask.rubric.length===3)
    assert(!child.answers.some(a=>child.prompt.includes(a)))
    const bad=structuredClone(u);bad.questions[0].writingTask.rubric=[];assert(!validGrammarUnit(bad))
   }
  }
 }
}
const c1=banks.find(b=>b.activityId==='gram-ex-c1-question-inversion')
for(const form of ['A-t-il','Est-elle','Sommes-nous','Avez-vous','Font-ils','Peux-tu'])assert(c1.units.some(u=>u.answers[0].includes(form)))
for(const suffix of ['affirmative','negative']){const bank=banks.find(b=>b.activityId==='gram-ex-c1-response-'+suffix);assert.equal(bank.units.filter(u=>u.prompt.startsWith('Est-ce')).length,25);assert(bank.units.every(u=>u.cue.startsWith('Jeu de rôle fictif.')))}
const c2=banks.find(b=>b.activityId==='gram-ex-c2-curriculum-complete')
for(const form of ['Qui','Où','Quand','Comment','Pourquoi','Qu’est-ce','De quoi','À quoi','Avec qui','Chez qui','À qui','Combien'])assert(c2.units.some(u=>u.answers[0].startsWith(form)),form)
const c3=banks.find(b=>b.activityId==='gram-ex-c3-curriculum-complete');assert.deepEqual([...new Set(c3.units.map(u=>u.answers[0].toLowerCase()))].sort(),['quel','quelle','quelles','quels'])
const oldPage={domain:'grammaire',topic:'gram-questions',exerciseType:'gram-ex-c1-question-est-ce-que',count:3,columns:1,difficulty:'facile'}
const fresh={...oldPage,...defaultGrammarPilot(oldPage.exerciseType)},co={...oldPage,exerciseType:'gram-ex-a1-co-theme'}
const cases=[{pages:[oldPage]}, {pages:[{domain:'algèbre',exerciseType:'add'}],libreSnapshot:[oldPage]},{pages:[{...co,extraBlocks:[oldPage]}]}, {pages:[fresh]},{pages:[co]},{pages:[{...oldPage,exerciseType:'gram-ex-e1-qcm-verbe'}]}, {pages:[{...oldPage,domain:'algèbre'}]},{pages:[{...oldPage,exerciseType:'gram-ex-a3-nat-co'}]}]
assert.deepEqual(cases.map(hasRetiredGrammarRecipe),[true,true,true,false,false,false,false,true])
assert.equal(parseFicheRecipe({...input([oldPage])}),null);assert(!isRetiredGrammarType('gram-ex-famille-fam-co'))
const protectedFiles=require('../docs/grammaire/implementation/audit-banques-historiques-20261122.json').protectedSha256
for(const [p,hash] of Object.entries(protectedFiles))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex'),hash,p)
;(async()=>{
 const rows=cases.map((recipe,i)=>({id:'fixture-'+i,recipe})),deleted=[]
 const request=async(path,method)=>method==='DELETE'?deleted.push(path):{fiches:rows}
 const dry=await prune({request});assert.equal(dry.retired,4);assert.equal(deleted.length,0)
 const live=await prune({request,apply:true});assert.equal(live.deleted,4);assert.equal(deleted.length,4)
 // The actual SQL maintenance query must select the same records as the app policy.
 const sql=fs.readFileSync(root+'/api/fiches/maintenance/purge-retired-grammar.sql','utf8')
 const python="import json,sqlite3,sys\nx=json.load(sys.stdin);d=sqlite3.connect(':memory:');d.execute('CREATE TABLE fiches (id TEXT, recipe TEXT)');d.executemany('INSERT INTO fiches VALUES (?, ?)',[(r['id'],json.dumps(r['recipe'])) for r in x['rows']]);d.executescript(x['sql']);print(json.dumps([r[0] for r in d.execute('SELECT id FROM fiches ORDER BY id')]))"
 const remaining=JSON.parse(cp.execFileSync('python3',['-c',python],{input:JSON.stringify({rows,sql}),encoding:'utf8'}));assert.deepEqual(remaining,rows.filter(r=>!hasRetiredGrammarRecipe(r.recipe)).map(r=>r.id))
 console.log(JSON.stringify({activities:22,offerings:24,units:920,writingTargets:300,protectedFiles:Object.keys(protectedFiles).length,purgePolicy:'app, SQL and API dry/apply agree',status:'passed'}))
})().catch(e=>{console.error(e);process.exitCode=1})
