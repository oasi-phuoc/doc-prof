const assert=require('node:assert/strict')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks,defaultGrammarPilot,grammarBanksForType}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const {typeChoicesForBlock}=load(root+'/src/components/generator/generator-derived.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {lessonForType}=load(root+'/src/grammaire/exercises/bank/index.ts')
const {buildPage}=load(root+'/src/math/generate.ts')
const {splitGradedGrammarPages}=load(root+'/src/grammaire/curriculum/pagination.ts')
const set=banks.filter(b=>b.topic==='gram-entrer-contact')
assert.equal(set.length,16);assert.equal(set.reduce((n,b)=>n+b.presentations.length,0),19)
assert.equal(set.reduce((n,b)=>n+b.units.length,0),800)
const cfg=(sub,suffix)=>{const id=`gram-ex-${sub}-${suffix}`;return{domain:'grammaire',topic:'gram-entrer-contact',exerciseType:id,count:50,columns:1,difficulty:'facile',...defaultGrammarPilot(id)}}
const recipe=block=>buildFicheRecipe({pages:[block],seed:1193,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
const canonical=new Map(set.flatMap(b=>b.units.filter(u=>u.kind==='completion').map(u=>[u.id,u])))
const meaning=(sub,answer)=>sub==='b1'?answer.toLowerCase():sub==='b2'&&['Au revoir','Bonne soirée'].includes(answer)?'congé':sub==='b3'&&['De rien','Je vous en prie'].includes(answer)?'réponse':sub==='b3'&&answer.startsWith('Merci')?'merci':answer
for(const b of set) {
 assert.equal(b.level,'A1');assert.equal(b.review.humanReview,'pending')
 assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,b.subthemeId)
 for(const u of b.units) {
  if(u.kind==='completion') {
   assert(u.cue);assert.equal(u.options.filter(o=>u.answers.includes(o.text)).length,1)
   assert(!u.prompt.includes('(à une personne que vous vouvoyez)'))
  }
  if(u.kind==='match') {
   assert.equal(u.pairs.length,b.subthemeId==='b1'?2:3)
   assert.equal(new Set(u.pairs.map(p=>meaning(b.subthemeId,p.right))).size,u.pairs.length,'No interchangeable replies share a matching problem.')
   for(const p of u.pairs) {
    const original=canonical.get(p.sourceId);assert(original)
    assert.equal(p.right,original.answers[0]);assert(p.left.includes(original.prompt)&&p.left.includes(original.cue))
   }
  }
  if(u.kind==='scenario') {
   assert.equal(u.contract,'open');assert.equal(u.roles.length,2)
   assert(u.followUps.length===2&&u.rubric.length>=3)
   assert(!u.roles.some(r=>u.answers[0].includes(r.goal)),'Goals are instructions, not copied model turns.')
  }
 }
 const block=cfg(b.subthemeId,b.activityId.replace(`gram-ex-${b.subthemeId}-`,''))
 for(const p of b.presentations) {
  const selected=select({...block,grammarPresentation:p},1193)
  assert.equal(selected.questions.length,50)
 }
 if(b.presentations.includes('gap')&&!b.presentations.includes('choice')) {
  const game=convertRecipe(recipe(block));assert(game.questions.every(q=>q.compatibility==='teacher-led'&&q.choices.length===0))
 }
 if(b.presentations.includes('match')) {
  const r=recipe(block);assert(parseFicheRecipe(JSON.parse(JSON.stringify(r))))
  const game=convertRecipe(r);assert.equal(game.questions.length,b.subthemeId==='b1'?100:150)
  assert(game.questions.every(q=>q.choices.length===(b.subthemeId==='b1'?2:3)))
 }
 if(b.presentations.some(p=>['open-written','open-oral','scenario-set'].includes(p))) {
  const r=recipe(block),game=convertRecipe(r);assert(parseFicheRecipe(JSON.parse(JSON.stringify(r))))
  assert(game.questions.every(q=>q.compatibility==='teacher-led'&&q.choices.length===0&&!('model' in q)&&!('answer' in q)))
  assert(game.questions.every(q=>game.corrections[q.id]?.text))
 }
}
for(const sub of ['b1','b3'])for(const kind of ['qcm-verbe','fill-conj']) {
 const original=lessonForType(`gram-ex-${sub}-${kind}`).items
 const migrated=grammarBanksForType(`gram-ex-${sub}-${kind}`)[0]
 assert.deepEqual(migrated.units.map(u=>u.answers[0]),original.map(u=>u.answer))
}
const b2=grammarBanksForType('gram-ex-b2-qcm-verbe')[0]
assert(b2.units[0].options.every(o=>o.text!=='Salut'),'A formal daytime question has no competing informal greeting.')
assert(b2.units[3].answers.includes('Enchanté')&&b2.units[3].answers.includes('Enchantée'))
assert.equal(grammarEligibleCount(cfg('b2','curriculum-o')),50)
assert.equal(grammarEligibleCount({...cfg('b2','curriculum-o'),phrasePolarity:'negative'}),0)
assert(typeChoicesForBlock('grammaire',cfg('b2','curriculum-o')).some(t=>t.id==='gram-ex-b2-curriculum-o'))
assert(!typeChoicesForBlock('grammaire',cfg('b1','qcm-verbe')).some(t=>t.id==='gram-ex-b2-curriculum-o'))
const r=require('../docs/grammaire/implementation/target-registry.json')
assert(r.offerings.filter(o=>o.themeId==='gram-entrer-contact').every(o=>o.availability==='pilot_preview'))
const full=buildPage(cfg('b1','fill-conj'),1193),short=structuredClone(full)
short.blocks.forEach(b=>b.items.forEach(i=>{delete i.grammar.unit.cue}))
const withCues=splitGradedGrammarPages(full),withoutCues=splitGradedGrammarPages(short)
assert(withCues.length>withoutCues.length,'Register cues reserve correction space even without an infinitive hint.')
assert.deepEqual(withCues.flatMap(p=>p.items.map(i=>i.grammar.id)),withoutCues.flatMap(p=>p.items.map(i=>i.grammar.id)))
const matching=buildPage(cfg('b2','curriculum-a'),1193),compact=structuredClone(matching)
compact.blocks.forEach(b=>b.items.forEach(i=>i.grammar.unit.pairs.forEach((p,j)=>{p.left=`Situation ${j+1} : ___` })))
assert(splitGradedGrammarPages(matching).length>splitGradedGrammarPages(compact).length,'Long matching contexts reserve space without removing any source problem.')
console.log('Entrer en contact : 19 offres, 800 unités, registres explicites, réponses polies, associations de 2/3 paires, jeux de rôle et sauvegardes vérifiés.')
