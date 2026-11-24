const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:all,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {isGrammarSnapshot}=load(root+'/src/grammaire/curriculum/validation.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {bankForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const {buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const registry=require('../docs/grammaire/implementation/target-registry.json'),subs=['i1','i2','i3','i5','i6','i7','i8','i9'],banks=all.filter(b=>subs.includes(b.subthemeId)),types=buildGrammairePracticeTypes()
const input=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
assert.equal(banks.length,26);assert.equal(new Set(banks.map(b=>b.activityId)).size,26);assert.equal(banks.reduce((n,b)=>n+b.presentations.length,0),34)
const fill=(p,a)=>{const [before,tail]=p.split('___'),after=tail.trimStart();return before+a+(a.endsWith('’')||!after||/^[.,;:!?]/.test(after)?'':' ')+after}
let variants=0,spans=0
for(const b of banks){
 assert.equal(b.units.length,b.presentations.includes('document-set')?20:50);assert.equal(b.review.humanReview,'pending');assert.equal(bankForType(b.activityId).length,0);assert(types.some(t=>t.id===b.activityId&&t.label===b.label))
 for(const p of b.presentations){
  assert.equal(registry.offerings.filter(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p).length,1)
  const cfg={domain:'grammaire',topic:'gram-pronoms',exerciseType:b.activityId,difficulty:'facile',columns:1,count:p==='document-set'?1:50,...defaultGrammarPilot(b.activityId),grammarPresentation:p,...(p==='document-set'?{grammarDocumentCount:20}:{})},s=select(cfg,839)
  assert(isGrammarSnapshot(s));assert.deepEqual(s,select(cfg,839));assert.notDeepEqual(s.questions.map(q=>q.id),select(cfg,840).questions.map(q=>q.id));assert.equal(grammarEligibleCount(cfg),b.units.length)
  const recipe=buildFicheRecipe(input([cfg])),loaded=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)));assert(loaded);assert.deepEqual(loaded.pages[0].grammarSnapshot,recipe.pages[0].grammarSnapshot)
  variants+=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
 }
 for(const u of b.units){
  assert(fs.existsSync(root+'/'+u.source.path));assert(!u.imageSupports)
  if(u.kind==='completion'){assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1);if(u.answers[0].endsWith('’'))assert(!/^\s/.test(u.prompt.split('___')[1]),'An elided answer attaches directly to the next word in the actual sentence renderer')}
  if(u.kind==='match'){assert.equal(u.pairs.length,2);assert.notEqual(u.pairs[0].right,u.pairs[1].right);assert(u.pairs.every(p=>p.left.includes('___')))}
  if(u.kind==='correct'){
   const e=u.error;assert.equal(u.prompt.slice(e.start,e.end),e.text)
   const row=fs.readFileSync(root+'/'+u.source.path,'utf8').trim().split('\n').filter(l=>!l.startsWith('#'))[u.source.position].split('|')
   assert.equal(u.prompt.slice(0,e.start)+row[3]+u.prompt.slice(e.end),u.answers[0]);assert.equal(u.answers[0],fill(row[2],row[3]));spans++
   const t=banks.find(t=>t.activityId===b.activityId.replace('curriculum-c','curriculum-t')).units[u.source.position];assert.deepEqual(t.answers,u.answers)
   if(row[3].endsWith('’'))assert(e.text.endsWith(' '),'The corrected interval removes the unwanted space before elision')
  }
  if(u.kind==='production'){assert.equal(u.rubric.length,3);assert(!u.task.includes('___'));assert(u.explanation.includes('non exclusif'));assert(u.writeLines>=3)}
  if(u.kind==='scenario'){assert.equal(u.contract,'open');assert.equal(u.roles.length,2);assert.equal(u.rubric.length,3);assert(u.answers[0].includes(u.followUps[0]));assert(u.turns[0].text.endsWith('?'))}
  if(u.kind==='reading'){assert.equal(u.questions.length,3);for(const c of u.questions){assert(c.writingTask);assert.equal(c.writingTask.rubric.length,3);assert(c.evidence.every(e=>u.text.includes(e)));assert(c.answers[0].endsWith('?'))}}
 }
}
assert.equal(variants,1710);assert.equal(spans,200)
const q=sub=>banks.find(b=>b.activityId===`gram-ex-${sub}-qcm-verbe`),u=(sub,id)=>q(sub).units.find(u=>u.id.endsWith('-'+id))
for(const [sub,id,a]of [
 ['i1','voisine','qui'],['i1','ville-visite','que'],['i1','roman','qu’'],['i1','quartier','où'],['i1','jour','où'],
 ['i2','sac-moi','le mien'],['i2','cles-moi','les miennes'],['i2','projet-nous','le nôtre'],['i2','recettes-vous','les vôtres'],['i2','commande-elles','la leur'],['i2','sacs-eux','les leurs'],['i2','avis-moi','du mien'],['i2','messages-toi','aux tiens'],
 ['i3','sac-de','celui'],['i3','cles-de','celles'],['i3','stylo-ci','celui-ci'],['i3','valises-la','celles-là'],['i3','ce-personnes','Ce'],
 ['i5','voisine','lui'],['i5','parents','leur'],['i5','voir-voisine','la'],['i5','ecouter-professeure','l’'],['i5','futur-eleves','leur'],
 ['i6','porte','Quelqu’un'],['i6','salle-vide','personne'],['i6','sac-objet','quelque chose'],['i6','oubli-rien','rien'],['i6','ranger-tout','tout'],['i6','toutes-pretes','Toutes'],['i6','chacun-badge','Chacun'],
 ['i7','pain','en'],['i7','origine','en'],['i7','ecole','y'],['i7','village-retour','y'],['i7','livres-futur','en'],['i7','horaire','y'],
 ['i8','outil','dont j’ai besoin'],['i8','maison','dont le toit est rouge'],['i8','regles','dont je vérifie l’application'],['i8','projets-deux','dont deux sont financés'],
 ['i9','probleme','auquel'],['i9','questions','auxquelles'],['i9','batiment','à côté duquel'],['i9','maisons','à côté desquelles'],['i9','etageres','entre lesquelles'],['i9','portes','derrière chacune desquelles'],
])assert.equal(u(sub,id).answers[0],a,sub+'/'+id)
assert.equal(new Set(q('i2').units.map(u=>u.answers[0])).size,23)
assert.deepEqual(u('i3','cela-explication').answers,['cela','ça']);assert.equal(u('i3','cela-explication').options.filter(o=>u('i3','cela-explication').answers.includes(o.text)).length,1)
assert.equal(q('i7').units.filter(u=>u.answers[0]==='en').length,25);assert.equal(q('i7').units.filter(u=>u.answers[0]==='y').length,25)
assert.equal(q('i5').units.filter(u=>u.cue.startsWith('Contraste')).length,10)
assert(q('i8').units.every(u=>u.answers[0].startsWith('dont ')))
const dontFacts=fs.readFileSync(root+'/scripts/grammar_curriculum/pronoms-i8-b1.tsv','utf8').trim().split('\n').filter(l=>!l.startsWith('#')).map(l=>l.split('|'))
for(const [i,unit]of q('i8').units.entries())assert(unit.cue.includes(dontFacts[i][6]),'A full-clause gap gives both facts, including its subject and verb')
const text=(sub,id)=>{const x=u(sub,id);return fill(x.prompt,x.answers[0])}
assert.equal(text('i7','pommes-passe'),'Elle en a acheté trois.');assert.equal(text('i7','regle'),'Je m’en souviens.');assert.equal(text('i7','ecole-negatif'),'Je n’y vais pas.')
assert.equal(text('i5','ecouter-professeure'),'Je l’écoute.');assert.equal(text('i9','etageres'),'Voici les étagères entre lesquelles passe le chariot.')
const docs=require('../scripts/grammar_curriculum/pronoms-i9-lectures-b1.json');assert.equal(docs.length,20);assert(docs.every(d=>d.text.every(l=>l.length<=80)&&q('i9').units.some(u=>u.id.endsWith('-'+d.sourceSituation))))
const before=p=>cp.execFileSync('git',['show','6e55930e9:'+p],{encoding:'utf8',maxBuffer:16*1024*1024}),cod='src/grammaire/curriculum/data/i4.json';assert.equal(fs.readFileSync(root+'/'+cod,'utf8'),before(cod))
const lp='src/grammaire/exercises/bank/lessons-revised.ts',legacy=s=>JSON.parse(s.split('= ').slice(1).join('= '));assert.deepEqual(legacy(fs.readFileSync(root+'/'+lp,'utf8')),legacy(before(lp)).filter(r=>!require('../src/grammaire/curriculum/retired-subthemes.json').includes(r.subId)))
const comm='src/grammaire/exercises/communication-data.json';assert.deepEqual(JSON.parse(fs.readFileSync(root+'/'+comm,'utf8')),JSON.parse(before(comm)).filter(r=>!require('../src/grammaire/curriculum/retired-subthemes.json').includes(r.subId)))
const protectedPaths=require('../docs/grammaire/implementation/pronoms-20261124-proofs/protected-sha256.json');for(const [p,h]of Object.entries(protectedPaths))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex'),h,p)
const sourceRows=fs.readdirSync(root+'/scripts/grammar_curriculum').filter(p=>/^pronoms-.*\.tsv$/.test(p)).reduce((n,p)=>n+fs.readFileSync(root+'/scripts/grammar_curriculum/'+p,'utf8').trim().split('\n').filter(l=>!l.startsWith('#')).length,0);assert.equal(sourceRows,400)
console.log(JSON.stringify({status:'passed',activities:26,banks:26,newOfferings:34,completeThemeOfferings:41,units:1270,variants,authoredSourceRows:400,documents:20,writingTargets:60,canonicalErrorSpans:spans,en:25,y:25,protectedTheoryAndCoFiles:Object.keys(protectedPaths).length,existingCodPreserved:true,teacherApprovedUnits:0}))
