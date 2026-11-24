const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:all,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const {buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const registry=require('../docs/grammaire/implementation/target-registry.json')
const subs=['pc-idee','pc-avoir','pc-etre','imparfait','pqp','double-aux','pc-pronominaux','accord-pp'],banks=all.filter(b=>subs.includes(b.subthemeId)),types=buildGrammairePracticeTypes()
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,32);assert.equal(new Set(banks.map(b=>b.activityId)).size,29);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),43)
let variants=0,spans=0
for(const b of banks){
 assert.equal(b.units.length,b.presentations.includes('document-set')?20:50);assert.equal(b.review.humanReview,'pending');assert.equal(bankForType(b.activityId).length,0);assert(types.some(t=>t.id===b.activityId&&t.label===b.label))
 for(const p of b.presentations){
  assert.equal(registry.offerings.filter(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p).length,1)
  const cfg={domain:'grammaire',topic:'gram-passe',exerciseType:b.activityId,difficulty:'facile',columns:1,count:p==='document-set'?1:50,...defaultGrammarPilot(b.activityId),grammarLevel:b.level,grammarBankRevision:b.revision,grammarPresentation:p,...(p==='document-set'?{grammarDocumentCount:20}:{})},s=select(cfg,839)
  assert(isGrammarSnapshot(s));assert.deepEqual(s,select(cfg,839));assert.notDeepEqual(s.questions.map(q=>q.id),select(cfg,840).questions.map(q=>q.id));assert.equal(grammarEligibleCount(cfg),b.units.length)
  const recipe=buildFicheRecipe(input([cfg])),loaded=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)));assert(loaded);assert.deepEqual(loaded.pages[0].grammarSnapshot,recipe.pages[0].grammarSnapshot)
  variants+=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
 }
 for(const u of b.units){
  assert(fs.existsSync(root+'/'+u.source.path));assert(!u.imageSupports)
  if(u.kind==='completion')assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
  if(u.kind==='match'){assert.equal(u.pairs.length,2);assert.notEqual(u.pairs[0].right,u.pairs[1].right);assert(u.pairs.every(p=>p.left.length>30))}
  if(u.kind==='order')assert.equal(u.tokens.map(t=>t.text).join(' ').replaceAll('’ ','’'),u.answers[0])
  if(u.kind==='correct'){
   const e=u.error;assert.equal(u.prompt.slice(e.start,e.end),e.text)
   const row=fs.readFileSync(root+'/'+u.source.path,'utf8').trim().split('\n').filter(l=>!l.startsWith('#'))[u.source.position].split('|')
   assert.equal(u.prompt.slice(0,e.start)+row[4]+u.prompt.slice(e.end),u.answers[0].split('\n')[0]);spans++
   const t=banks.find(t=>t.activityId===b.activityId.replace('curriculum-c','curriculum-t')&&t.level===b.level).units.find(t=>t.source.path===u.source.path&&t.source.position===u.source.position);assert.deepEqual(t.answers,u.answers)
  }
  if(u.kind==='production'){assert.equal(u.rubric.length,3);assert(!u.task.includes('___'));assert(u.explanation.includes('non exclusif'));assert(u.mode==='oral'?u.writeLines===0:u.writeLines>=3)}
  if(u.kind==='reading'){assert.equal(u.questions.length,3);for(const c of u.questions){assert(c.writingTask);assert.equal(c.writingTask.rubric.length,3);assert(c.evidence.every(e=>u.text.includes(e)));assert(c.answers[0].endsWith('?'))}}
 }
}
assert.equal(variants,2160);assert.equal(spans,250)
const bank=(sub,level,mechanic='q')=>banks.find(b=>b.subthemeId===sub&&b.level===level&&b.activityId.endsWith(mechanic==='q'?['pc-avoir','pc-etre','imparfait','pqp'].includes(sub)?'qcm-conj':'qcm-verbe':'curriculum-'+mechanic))
const answer=(sub,level,id)=>bank(sub,level).units.find(u=>u.id.endsWith('-'+id)).answers[0]
for(const [sub,level,id,expected]of [
 ['pc-avoir','A1','bus','avons pris'],['pc-avoir','A1','fenetre','avez ouvert'],['pc-avoir','A1','table','ai nettoyé'],
 ['pc-etre','A1','ecole','suis allée'],['pc-etre','A1','bus','êtes monté'],['pc-etre','A1','classe','êtes entrées'],
 ['pc-etre','A2','entree-invitee','êtes entrée'],['pc-etre','A2','rester-negatif','suis restée'],
 ['imparfait','A2','études','étudiions'],['imparfait','A2','rire','riiez'],['imparfait','A2','crier','criions'],['imparfait','A2','commencer-nous','commencions'],['imparfait','A2','manger-vous','mangiez'],
 ['pqp','B1','trajet','étions revenues'],['pqp','B1','outils','avaient nettoyés'],['pqp','B1','ne-pas-lire','avais lu'],
 ['double-aux','A2','monter-valise','a monté'],['double-aux','A2','monter-etage','est montée'],['double-aux','B1','monter-valise','transitive directe'],['double-aux','B1','monter-etage','intransitive'],
 ['pc-pronominaux','A2','mains-je','me suis lavé'],['pc-pronominaux','A2','laver-elle','s’est lavée'],['pc-pronominaux','A2','parler-elles','se sont parlé'],['pc-pronominaux','A2','telephoner-negatif','ne vous êtes pas téléphoné'],
 ['accord-pp','B1','lettres','écrites'],['accord-pp','B1','mains-apres','lavé'],['accord-pp','B1','mains-avant','lavées'],['accord-pp','B1','photos-apres','montré'],['accord-pp','B1','photos-avant','montrées'],['accord-pp','B1','parler-coi','parlé'],['accord-pp','B1','deleguee','venue'],
])assert.equal(answer(sub,level,id),expected,sub+'/'+id)
const order=bank('pc-pronominaux','A2','o'),negative=u=>u.tokens.some(t=>t.category==='negation')
assert.equal(order.units.filter(negative).length,25);assert.equal(order.units.filter(u=>!negative(u)).length,25)
const orderConfig={domain:'grammaire',topic:'gram-passe',exerciseType:order.activityId,difficulty:'facile',columns:1,...defaultGrammarPilot(order.activityId)}
for(const [phrasePolarity,count]of [['positive',25],['negative',25],['mixed',50]]){const cfg={...orderConfig,phrasePolarity,count};assert.equal(grammarEligibleCount(cfg),count);assert.equal(select(cfg,839).questions.length,count)}
const analyses=bank('double-aux','B1').units;assert.equal(analyses.filter(u=>u.answers[0]==='transitive directe').length,25);assert.equal(analyses.filter(u=>u.answers[0]==='intransitive').length,25);assert(analyses.every(u=>!u.cue.includes('COD')))
const docs=require('../scripts/grammar_curriculum/passe-pqp-lectures-b1.json');assert.equal(docs.length,20);assert(docs.every(d=>d.text.every(l=>l.length<=80)))
const before=p=>cp.execFileSync('git',['show','024dd2fcf:'+p],{encoding:'utf8',maxBuffer:16*1024*1024})
const h8='src/grammaire/curriculum/data/imparfait-ou-pc.json';assert.equal(fs.readFileSync(root+'/'+h8,'utf8'),before(h8))
const lp='src/grammaire/exercises/bank/lessons-revised.ts',legacy=s=>JSON.parse(s.split('= ').slice(1).join('= '));assert.deepEqual(legacy(fs.readFileSync(root+'/'+lp,'utf8')),legacy(before(lp)).filter(r=>!require('../src/grammaire/curriculum/retired-subthemes.json').includes(r.subId)))
const comm='src/grammaire/exercises/communication-data.json';assert.equal(fs.readFileSync(root+'/'+comm,'utf8'),before(comm))
const protectedPaths=require('../docs/grammaire/implementation/passe-20261124-proofs/protected-sha256.json');for(const [p,h]of Object.entries(protectedPaths))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex'),h,p)
const sourceRows=fs.readdirSync(root+'/scripts/grammar_curriculum').filter(p=>/^passe-.*\.tsv$/.test(p)).reduce((n,p)=>n+fs.readFileSync(root+'/scripts/grammar_curriculum/'+p,'utf8').trim().split('\n').filter(l=>!l.startsWith('#')).length,0);assert.equal(sourceRows,400)
console.log(JSON.stringify({status:'passed',activities:29,banks:32,newOfferings:43,completeThemeOfferings:49,units:1570,variants,authoredSourceRows:400,documents:20,writingTargets:60,canonicalErrorSpans:spans,positiveOrder:25,negativeOrder:25,protectedTheoryAndCoFiles:Object.keys(protectedPaths).length,existingH8Preserved:true,teacherApprovedUnits:0}))
