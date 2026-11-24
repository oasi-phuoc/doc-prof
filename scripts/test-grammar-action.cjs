const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:all,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const {buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const registry=require('../docs/grammaire/implementation/target-registry.json'),subs=['j1','j2','j3'],banks=all.filter(b=>subs.includes(b.subthemeId)),types=buildGrammairePracticeTypes()
const before=p=>cp.execFileSync('git',['show','ec312e03e:'+p],{encoding:'utf8',maxBuffer:16*1024*1024})
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,19);assert.equal(new Set(banks.map(b=>b.activityId)).size,13);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),24)
let variants=0,spans=0,illustrated=0,readingQuestions=0
for(const b of banks){
 assert.equal(b.units.length,b.presentations.includes('document-set')?20:50);assert.equal(b.review.humanReview,'pending');assert.equal(bankForType(b.activityId).length,0)
 assert(types.some(t=>t.id===b.activityId&&t.label===b.label))
 for(const p of b.presentations){
  assert.equal(registry.offerings.filter(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p).length,1)
  const cfg={domain:'grammaire',topic:'gram-action',exerciseType:b.activityId,difficulty:'facile',columns:1,count:p==='document-set'?1:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarPresentation:p,...(p==='document-set'?{grammarDocumentCount:20}:{})},s=select(cfg,839)
  assert(isGrammarSnapshot(s));assert.deepEqual(s,select(cfg,839));assert.notDeepEqual(s.questions.map(q=>q.id),select(cfg,840).questions.map(q=>q.id));assert.equal(grammarEligibleCount(cfg),b.units.length)
  const recipe=buildFicheRecipe(input([cfg])),loaded=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)));assert(loaded);assert.deepEqual(loaded.pages[0].grammarSnapshot,recipe.pages[0].grammarSnapshot)
  variants+=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
 }
 for(const u of b.units){
  assert(fs.existsSync(root+'/'+u.source.path))
  if(u.kind==='completion'){
   assert.equal(u.options.length,3);assert.equal(new Set(u.options.map(o=>o.text)).size,3);assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
   assert(u.givenVerb);assert(u.prompt.includes('___'));assert(u.answers[0].includes(' ')||b.level==='A2'&&b.subthemeId==='j1')
   assert(u.cue.includes('Employez')||u.cue.includes('Insistez')||u.cue.includes('Exprimez'))
  }
  if(u.kind==='correct'){
   const e=u.error;assert.equal(u.prompt.slice(e.start,e.end),e.text)
   const replacement=u.source.path.endsWith('.json')?require('../'+u.source.path)[u.source.position].replacementText:
    fs.readFileSync(root+'/'+u.source.path,'utf8').trim().split('\n').filter(l=>!l.startsWith('#'))[u.source.position].split('|')[5]
   assert.equal(u.prompt.slice(0,e.start)+replacement+u.prompt.slice(e.end),u.answers[0]);assert.notEqual(u.prompt,u.answers[0]);spans++
  }
  if(u.kind==='transform'){assert(!u.directive.includes('___'));assert.notEqual(u.prompt,u.answers[0]);assert(u.cue.includes(b.subthemeId==='j1'?'Conservez les deux actions':'Verbe à employer'))}
  if(u.kind==='production'){
   assert.equal(u.rubric.length,3);assert(!u.task.includes('___'));assert(u.explanation.includes('non exclusif'))
   if(u.mode==='oral'){assert(u.task.includes('relance'));assert(u.answers[0].includes('Réponse à la relance'));assert.equal(u.writeLines,0)}else assert.equal(u.writeLines,4)
   if(b.subthemeId==='j1'&&b.level==='A2'){assert(u.answers[0].includes('D’habitude'));assert(u.answers[0].includes('en train d'))}
   if(b.subthemeId==='j3')assert(u.prompt.includes('Verbe au gérondif : '),'The oral task explicitly identifies which of the two verbs becomes a gerund')
  }
  if(u.kind==='reading'){
   assert.equal(u.questions.length,3)
   for(const c of u.questions){assert(c.evidence.every(e=>u.text.includes(e)));assert(!c.answers.includes(''));if(c.options)assert.equal(c.options.filter(o=>c.answers.includes(o.text)).length,1);readingQuestions++}
  }
  if(u.imageSupports){
   assert.equal(b.activityId,'gram-ex-j1-qcm-verbe');assert.equal(b.level,'A1');assert.equal(u.imageSupports.length,1);illustrated++
   for(const im of u.imageSupports){
    const original=fs.readFileSync(root+'/public'+im.source.path),copy=fs.readFileSync(root+'/public'+im.src)
    assert.deepEqual(original,copy);assert.equal(crypto.createHash('sha256').update(copy).digest('hex'),im.sha256);assert(im.alt.includes('texte'))
   }
  }
 }
}
assert.equal(variants,1220);assert.equal(spans,50);assert.equal(illustrated,50);assert.equal(readingQuestions,120)
const q=(s,l)=>banks.find(b=>b.activityId===`gram-ex-${s}-qcm-verbe`&&b.level===l),u=(s,l,id)=>q(s,l).units.find(u=>u.id.endsWith('-'+id))
for(const [s,l,id,answer]of [
 ['j1','A1','roman','suis en train de lire'],['j1','A1','lettre','suis en train d’écrire'],['j1','A1','repas-groupe','sommes en train de manger'],
 ['j1','A2','hab-arroser','arrosons'],['j1','A2','telephone','êtes en train de téléphoner'],
 ['j2','A1','fenetre','viens d’ouvrir'],['j2','A1','inscription','venons de nous inscrire'],['j2','A1','reveil','vient de se réveiller'],
 ['j2','A2','rapport-passe','venais de terminer'],['j2','A2','demande-passe','venions d’envoyer'],['j2','A2','accord-passe','venions de nous mettre'],
 ['j3','A2','pause','en mangeant'],['j3','A2','cours','en commençant'],['j3','A2','question','en réfléchissant'],
 ['j3','A2','fatigue','en étant'],['j3','A2','materiel','en ayant'],['j3','A2','savoir','en sachant'],
])assert.equal(u(s,l,id)?.answers[0],answer,[s,l,id].join('/'))
const progressive=q('j1','A2');assert.equal(progressive.units.filter(u=>u.cue.includes('Exprimez l’habitude')).length,25)
assert(progressive.units.every(u=>u.explanation.includes('Le présent simple peut aussi décrire une action actuelle')))
const recent=q('j2','A2');assert.equal(recent.units.filter(u=>u.cue.includes('à l’imparfait')).length,25)
const subject=require('../scripts/grammar_curriculum/action-j3-accord-sujet-a2.json');assert.equal(subject.length,10)
assert.equal(banks.find(b=>b.activityId==='gram-ex-j3-curriculum-c').units.filter(u=>u.source.path.endsWith('.json')).length,10)
const manifest=require('../docs/grammaire/implementation/action-media-manifest.json');assert.equal(manifest.images.length,10);assert(manifest.images.every(im=>im.uses.length===5));assert.equal(manifest.obligations[0].reviewedIllustratedSituations,50)
for(const level of ['a1','a2']){
 const docs=require('../scripts/grammar_curriculum/action-j1-lectures-'+level+'.json');assert.equal(docs.length,20)
 assert(docs.every(d=>d.text.every(l=>l.length<=80)&&q('j1',level.toUpperCase()).units.some(u=>u.id.endsWith('-'+d.sourceSituation))))
}
const sourceRows=fs.readdirSync(root+'/scripts/grammar_curriculum').filter(p=>/^action-.*\.tsv$/.test(p)).reduce((n,p)=>n+fs.readFileSync(root+'/scripts/grammar_curriculum/'+p,'utf8').trim().split('\n').filter(l=>!l.startsWith('#')).length,0);assert.equal(sourceRows,250)
const lp='src/grammaire/exercises/bank/lessons-revised.ts',legacy=s=>JSON.parse(s.split('= ').slice(1).join('= '));assert.deepEqual(legacy(fs.readFileSync(root+'/'+lp,'utf8')),legacy(before(lp)).filter(r=>!subs.includes(r.subId)));assert.equal(legacy(fs.readFileSync(root+'/'+lp,'utf8')).length,22)
const comm='src/grammaire/exercises/communication-data.json';assert.deepEqual(JSON.parse(fs.readFileSync(root+'/'+comm,'utf8')),JSON.parse(before(comm)).filter(r=>r.subId!=='j1'))
const retired=require('../src/grammaire/curriculum/retired-subthemes.json');assert.deepEqual(retired,[...JSON.parse(before('src/grammaire/curriculum/retired-subthemes.json')),...subs]);assert.equal(retired.length,76)
const original=JSON.parse(before('docs/grammaire/implementation/target-registry.json'))
for(const key of ['activities','offerings'])assert.deepEqual(registry[key].filter(o=>o.themeId!=='gram-action'),original[key].filter(o=>o.themeId!=='gram-action'))
assert.deepEqual(registry.notionLevels,original.notionLevels);assert.deepEqual(registry.imageObligations.filter(o=>o.obligationId!=='IMG-j1-A1'),original.imageObligations.filter(o=>o.obligationId!=='IMG-j1-A1'))
const protectedPaths=require('../docs/grammaire/implementation/action-20261124-proofs/protected-sha256.json')
for(const [p,h]of Object.entries(protectedPaths))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex'),h,p)
console.log(JSON.stringify({status:'passed',activities:13,banks:19,completeThemeOfferings:24,units:890,variants,authoredSourceRows:250,documents:40,readingQuestions,canonicalErrorSpans:spans,subjectCorrections:10,illustratedSituations:50,distinctImages:10,protectedTheoryAndCoFiles:Object.keys(protectedPaths).length,remainingLegacyWrittenBanks:22,remainingLegacyCommunicationGroups:4,teacherApprovedUnits:0}))
