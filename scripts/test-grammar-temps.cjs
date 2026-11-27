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
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-temps')
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,22);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),28)
assert.equal(banks.reduce((n,b)=>n+b.units.length,0),1040)
assert.equal(new Set(banks.map(b=>b.activityId)).size,18)
const types=buildGrammairePracticeTypes().filter(t=>banks.some(b=>b.activityId===t.id));assert.equal(types.length,18)
let variants=0
for(const b of banks){
 assertGrammarBank(b);assert.equal(b.review.humanReview,'pending')
 assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,b.subthemeId)
 assert.equal(types.find(t=>t.id===b.activityId).label,b.label)
 for(const presentation of b.presentations){
  const cfg={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarPresentation:presentation,grammarBankRevision:b.revision,...(presentation==='document-set'?{grammarDocumentCount:20}:{})}
  const snapshot=generateGrammarSelection(cfg,839);assert(isGrammarSnapshot(snapshot));assert.deepEqual(generateGrammarSelection(cfg,839),snapshot)
  const expected=presentation==='document-set'?(b.level==='A1'?80:60):50;variants+=expected
  if(presentation==='document-set'&&b.level==='A1'){
   assert.equal(snapshot.questions.filter(q=>q.unit.imageSupports?.length).length,4)
   assert(snapshot.groups.every(group=>group.questionIds.length===4))
  }
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
assert.equal(variants,1440)
const {grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {validGrammarUnit}=load(root+'/src/grammaire/curriculum/validation.ts')
const {applyType}=load(root+'/src/components/generator/page-helpers.ts')
const scoped=(sub)=>banks.filter(b=>b.subthemeId===sub)
const durations=scoped('e3').filter(b=>b.presentations.includes('choice'))
for(const b of durations)for(const u of b.units){
 assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
 if(u.answers[0]==='pour'){assert(u.answers.includes('pendant'));assert(!u.options.some(o=>o.text==='pendant'))}
 assert(!u.options.some(o=>o.text==='pour')||!u.options.some(o=>o.text==='pendant')||u.answers[0]==='il y a')
}
const a2=durations.find(b=>b.level==='A2'),correct=scoped('e3').find(b=>b.presentations.includes('correct'))
for(const [i,u]of correct.units.entries()){
 const error=u.error;assert.equal(u.prompt.slice(error.start,error.end),error.text)
 assert.equal(u.prompt.slice(0,error.start)+a2.units[i].answers[0]+u.prompt.slice(error.end),u.answers[0])
}
const frequency=banks.find(b=>b.activityId==='gram-ex-e4-curriculum-o')
assert.equal(frequency.units.filter(u=>u.tokens.some(t=>t.text==='jamais')).length,10)
for(const u of frequency.units.filter(u=>u.tokens.some(t=>t.text==='jamais')))assert(u.tokens.some(t=>t.text==='ne'&&t.category==='negation'))
const fconfig={domain:'grammaire',topic:'gram-temps',exerciseType:frequency.activityId,count:50,columns:1,difficulty:'facile',...defaultGrammarPilot(frequency.activityId)}
assert.equal(fconfig.phrasePolarity,'mixed');assert.equal(grammarEligibleCount(fconfig),50);assert.equal(grammarEligibleCount({...fconfig,phrasePolarity:'negative'}),10);assert.equal(grammarEligibleCount({...fconfig,phrasePolarity:'positive'}),40)
const patch=applyType(types.find(t=>t.id===frequency.activityId),{...fconfig,phrasePolarity:'positive'});assert.equal(patch.phrasePolarity,'mixed')
for(const b of scoped('e5').filter(b=>b.presentations.includes('order'))){
 assert(b.units.every(u=>u.tokenUnit==='clause'&&u.tokens.length===(b.level==='A1'?3:4)))
 const cfg={domain:'grammaire',topic:b.topic,exerciseType:b.activityId,difficulty:'facile',columns:1,count:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarBankRevision:b.revision}
 for(const polarity of ['positive','negative','mixed']){const c={...cfg,phrasePolarity:polarity,phraseCategories:{adverbe:false,verbe:false}};assert.equal(grammarEligibleCount(c),50);assert.equal(generateGrammarSelection(c,839).questions.length,50)}
 assert(!validGrammarUnit({...b.units[0],tokenUnit:'word'}));assert(!validGrammarUnit({...a2.units[0],tokenUnit:'clause'}))
 const game=convertRecipe(buildFicheRecipe(input([cfg])))
 assert(game.questions.every(q=>q.mode==='sequence'&&q.words.length===(b.level==='A1'?3:4)&&q.instruction.includes('étape')))
}
const images=require('../docs/grammaire/implementation/temps-media-manifest.json'),digest=b=>crypto.createHash('sha256').update(b).digest('hex')
assert.equal(images.obligations.length,1);assert.equal(images.distinctImages,14);assert.equal(images.obligations[0].distinctImages,10);assert.equal(images.obligations[0].reviewedIllustratedSituations,50)
for(const image of images.images){assert(validGrammarImage(image));const bytes=fs.readFileSync(root+'/public'+image.src);assert.equal(digest(bytes),image.sha256);assert.deepEqual(bytes,fs.readFileSync(root+'/public'+image.source.path))}
const readings=banks.flatMap(b=>b.units).filter(u=>u.kind==='reading');assert.equal(readings.length,40);assert.equal(new Set(readings.map(u=>u.text)).size,40);assert.equal(readings.flatMap(u=>u.questions).length,140)
for(const u of readings){assert.deepEqual(u.answers,[]);for(const q of u.questions)assert(q.evidence.every(e=>u.text.includes(e)))}
const scenarios=banks.flatMap(b=>b.units).filter(u=>u.kind==='scenario');assert.equal(scenarios.length,50)
for(const u of scenarios){assert.equal(u.contract,'open');assert(u.turns.every(t=>!t.text.includes('___')&&!t.questionId));assert(u.rubric.length>=3&&u.followUps.length)}
for(const sub of ['e2','e3','e4','e5']){
 const b=banks.find(b=>b.subthemeId===sub&&b.presentations.includes('choice')),old={domain:'grammaire',exerciseType:b.activityId,topic:b.topic,count:1,columns:1,difficulty:'facile'}
 assert.equal(bankForType(old.exerciseType).length,0);assert.equal(parseFicheRecipe(input([old])),null);assert(hasRetiredGrammarRecipe({pages:[old]}));assert(!hasRetiredGrammarRecipe({pages:[{...old,...defaultGrammarPilot(old.exerciseType)}]}))
}
const before=JSON.parse(cp.execFileSync('git',['show','fd05e4de5:src/grammaire/exercises/bank/lessons-revised.ts'],{encoding:'utf8'}).split('= ').slice(1).join('= '))
const after=fs.readFileSync(root+'/src/grammaire/exercises/bank/lessons-revised.ts','utf8').split('= ').slice(1).join('= ')
assert.deepEqual(JSON.parse(after),before.filter(x=>!require('../src/grammaire/curriculum/retired-subthemes.json').includes(x.subId)))
console.log(JSON.stringify({status:'passed',activities:18,banks:22,offerings:28,units:1040,variants,documents:40,documentQuestions:140,groupedAssociations:50,openScenarios:50,illustratedSituations:50,illustratedReadings:4,distinctImages:14,retiredHistoricalBanks:4,savedWorksheets:'untouched, deferred by owner'}))
