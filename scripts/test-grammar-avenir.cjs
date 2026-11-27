const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:all,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const {buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const registry=require('../docs/grammaire/implementation/target-registry.json'),subs=['futur-proche','futur-simple','futur-proche-ou-simple','futur-anterieur','hypothese-futur'],banks=all.filter(b=>subs.includes(b.subthemeId)),types=buildGrammairePracticeTypes()
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,22);assert.equal(new Set(banks.map(b=>b.activityId)).size,22);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),27)
let variants=0,spans=0,docs=0,questions=0,scenarios=0
const noBadElision=s=>{assert(!/\b[Jj]e [aeéiouyhàâêîôûœ]/u.test(s),'The full sentence elides je before a vowel: '+s);assert(!/[Ss]’ell(?:e|es)\b/.test(s),'Si elle and si elles do not elide')}
for(const b of banks){
 assert.equal(b.units.length,b.presentations.includes('document-set')?20:60);assert.equal(b.review.humanReview,'pending');assert.equal(bankForType(b.activityId).length,0);assert(types.some(t=>t.id===b.activityId&&t.label===b.label))
 for(const p of b.presentations){
  assert.equal(registry.offerings.filter(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p).length,1)
  const cfg={domain:'grammaire',topic:'gram-avenir',exerciseType:b.activityId,difficulty:'facile',columns:1,count:p==='document-set'?1:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarPresentation:p,...(p==='document-set'?{grammarDocumentCount:20}:{})},s=select(cfg,839)
  assert(isGrammarSnapshot(s));assert.deepEqual(s,select(cfg,839));assert.notDeepEqual(s.questions.map(q=>q.id),select(cfg,840).questions.map(q=>q.id));assert.equal(grammarEligibleCount(cfg),b.units.length)
  assert.equal(s.questions.length,p==='document-set'?20:50)
  if(p!=='document-set')assert(s.questions.some(question=>question.unit.source.position>=50))
  const recipe=buildFicheRecipe(input([cfg])),loaded=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)));assert(loaded);assert.deepEqual(loaded.pages[0].grammarSnapshot,recipe.pages[0].grammarSnapshot)
  variants+=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):b.units.length
 }
 for(const u of b.units){
  assert(fs.existsSync(root+'/'+u.source.path));assert(!u.imageSupports)
  if(u.kind==='completion'){
   assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1);assert.equal(u.options.length,3);assert(u.givenVerb)
   for(const a of u.answers)noBadElision(u.prompt.replace('___',a))
   if(b.subthemeId==='futur-proche-ou-simple'){
    assert(u.cue.includes('Employez le futur'));const r=fs.readFileSync(root+'/'+u.source.path,'utf8').trim().split('\n').filter(l=>!l.startsWith('#'))[u.source.position].split('|');noBadElision(u.prompt.replace('___',r[6]));assert(u.explanation.includes('La distance temporelle seule'))
   }
  }
  for(const a of u.answers)noBadElision(a)
  if(u.kind==='correct'){
   const e=u.error;assert.equal(u.prompt.slice(e.start,e.end),e.text);const r=fs.readFileSync(root+'/'+u.source.path,'utf8').trim().split('\n').filter(l=>!l.startsWith('#'))[u.source.position].split('|');assert.equal(u.prompt.slice(0,e.start)+r[4]+u.prompt.slice(e.end),u.answers[0]);spans++
  }
  if(u.kind==='transform'){assert.notEqual(u.prompt,u.answers[0]);assert(u.directive);assert(u.explanation.includes('non exclusif'))}
  if(u.kind==='production'){
   assert.equal(u.rubric.length,3);assert(u.explanation.includes('non exclusif'));assert(!u.task.includes('___'))
   if(u.mode==='oral'){assert(u.task.includes('relance'));assert(u.answers.every(a=>a.includes('Réponse à la relance')));assert.equal(u.writeLines,0)}else assert.equal(u.writeLines,4)
   if(b.subthemeId==='futur-proche-ou-simple'){assert.equal(u.answers.length,2);assert(u.answers.every(a=>a.includes('Justification possible')))}
  }
  if(u.kind==='scenario'){
   assert.equal(u.contract,'open');assert.equal(u.roles.length,2);assert.equal(u.rubric.length,3);assert(u.answers[0].includes(u.followUps[0]));assert(u.turns[0].text.endsWith('?'));assert(u.answers[0].includes(u.turns[0].text));scenarios++
  }
  if(u.kind==='reading'){
   assert.equal(u.questions.length,3);docs++
   for(const c of u.questions){assert(!c.writingTask,'Lire et répondre keeps comprehension questions');assert(c.evidence.every(e=>u.text.includes(e)));if(c.options)assert.equal(c.options.filter(o=>c.answers.includes(o.text)).length,1);questions++}
  }
 }
}
assert.equal(variants,1620);assert.equal(spans,60);assert.equal(docs,60);assert.equal(questions,180);assert.equal(scenarios,120)
const q=s=>banks.find(b=>b.subthemeId===s&&b.presentations.includes('choice')),u=(s,id)=>q(s).units.find(u=>u.id.endsWith('-'+id))
for(const [s,id,a]of [
 ['futur-proche','bibliotheque','allons aller'],['futur-proche','inscription','allons nous inscrire'],['futur-proche','reveil','vas te lever'],
 ['futur-simple','aller','irons'],['futur-simple','envoyer','enverra'],['futur-simple','appeler','appelleras'],['futur-simple','courir','courra'],['futur-simple','tenir','tiendrons'],['futur-simple','pleuvoir','pleuvra'],['futur-simple','falloir','faudra'],
 ['futur-proche-ou-simple','billet','Je vais acheter'],['futur-proche-ou-simple','promesse','j’aiderai'],['futur-proche-ou-simple','carnet','J’apporterai'],
 ['futur-anterieur','photos','auront pris'],['futur-anterieur','gare-nous','serons arrivées'],['futur-anterieur','venue-vous','serez venu'],['futur-anterieur','arrivee-vous','serez arrivée'],['futur-anterieur','installation-elles','se seront installées'],['futur-anterieur','reveil-je','me serai réveillé'],
 ['hypothese-futur','pluie','pleut'],['hypothese-futur','argent','ai'],['hypothese-futur','inscription-resultat','nous inscrirons'],
 ['futur-proche','lavage-mains','vont se laver'],['futur-proche-ou-simple','maison-association','recevra'],
 ['futur-anterieur','salle-equipe','se seront échauffées'],['hypothese-futur','sortie-patinage','pourront']
])assert.equal(u(s,id)?.answers[0],a,s+'/'+id)
assert.deepEqual(u('futur-simple','connaitre').answers,['connaîtront','connaitront']);assert.deepEqual(u('futur-simple','essayer').answers,['essaierai','essayerai'])
assert.equal(q('futur-proche-ou-simple').units.filter(u=>u.cue.includes('Employez le futur proche')).length,30)
assert(banks.find(b=>b.activityId==='gram-ex-futur-proche-curriculum-s').units.find(u=>u.id.endsWith('-bus')).answers[0].includes('je vais prendre le bus'))
assert(banks.find(b=>b.activityId==='gram-ex-hypothese-futur-curriculum-s').units.find(u=>u.id.endsWith('-guide-resultat')).answers[0].includes('nous préviendrons le guide'))
assert(banks.find(b=>b.activityId==='gram-ex-hypothese-futur-curriculum-s').units.find(u=>u.id.endsWith('-temps')).answers[0].includes('Si j’ai le temps, je viendrai'))
const source=s=>fs.readFileSync(root+'/scripts/grammar_curriculum/avenir-'+s+'-'+q(s).level.toLowerCase()+'.tsv','utf8').trim().split('\n').filter(l=>!l.startsWith('#')).map(l=>l.split('|'))
assert.equal(source('futur-anterieur').filter(r=>r[8]==='être').length,24);assert.equal(source('hypothese-futur').filter(r=>r[8]==='condition').length,30)
assert(u('hypothese-futur','disponible').prompt.startsWith('Si elle'));assert(u('hypothese-futur','train').prompt.startsWith('S’ils'))
assert.equal(subs.reduce((n,s)=>n+source(s).length,0),300)
for(const sub of ['futur-proche','futur-proche-ou-simple','futur-anterieur']){const ds=require('../scripts/grammar_curriculum/avenir-'+sub+'-lectures-'+q(sub).level.toLowerCase()+'.json');assert.equal(ds.length,20);assert(ds.every(d=>d.text.every(l=>l.length<=80)&&source(sub).some(r=>r[0]===d.sourceSituation)))}
const retired=require('../src/grammaire/curriculum/retired-subthemes.json')
assert(subs.every(sub=>retired.includes(sub)))
const legacy=JSON.parse(fs.readFileSync(root+'/src/grammaire/exercises/bank/lessons-revised.ts','utf8').split('= ').slice(1).join('= '))
assert(legacy.every(row=>!subs.includes(row.subId)))
assert(require('../src/grammaire/exercises/communication-data.json').every(row=>row.subId!=='futur-proche'))
const protectedPaths=require('../docs/grammaire/implementation/avenir-20261124-proofs/protected-sha256.json')
const staticSources=Object.entries(protectedPaths).filter(([path])=>
 path.startsWith('public/lib/audio/grammaire/')||path==='src/grammaire/theory/avenir.ts')
for(const [path,hash]of staticSources)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+path)).digest('hex'),hash,path)
console.log(JSON.stringify({status:'passed',activities:22,banks:22,completeThemeOfferings:27,units:1200,variants,authoredSourceRows:300,documents:docs,readingQuestions:questions,openScenarios:scenarios,canonicalErrorSpans:spans,protectedTheoryAndRecordings:staticSources.length,teacherApprovedUnits:0}))
