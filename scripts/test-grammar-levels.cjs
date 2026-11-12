const assert=require('node:assert/strict')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,generateGradedGrammarBlock,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {isGrammarSnapshot,isGrammarQuestion}=load(root+'/src/grammaire/curriculum/validation.ts')
const {tryGenerateGrammaireBlock:generate}=load(root+'/src/grammaire/generate.ts')
const {isProtectedGrammarCo}=load(root+'/src/grammaire/curriculum/types.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {pageAsConfig,pageBlocks}=load(root+'/src/math/page-model.ts')
const {buildPage,buildWorksheets}=load(root+'/src/math/generate.ts')
const {adaptSourceItem}=load(root+'/src/interactive/domain/source-adapters.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {prepareGame}=load(root+'/src/interactive/domain/plan.ts')
const base=(id='gram-ex-etre-qcm-conj')=>({domain:'grammaire',topic:'gram-present',exerciseType:id,difficulty:'facile',columns:1,count:6,...defaultGrammarPilot(id)})
const {typeChoicesForBlock}=load(root+'/src/components/generator/generator-derived.ts')
assert(typeChoicesForBlock('grammaire',base()).some(t=>t.id==='gram-ex-etre-curriculum-a'))
assert(!typeChoicesForBlock('grammaire',{...base(),exerciseType:'gram-ex-avoir-qcm-conj'}).some(t=>t.id==='gram-ex-etre-curriculum-a'))
const recipeInput=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
let variants=0
for (const bank of banks) {
 assert.equal(bank.units.length,50)
 assert.equal(bank.review.humanReview,'pending')
 for (const presentation of bank.presentations) {
  const block={...base(bank.activityId),count:50,grammarPresentation:presentation}
  const selected=select(block,839)
  assert(isGrammarSnapshot(selected))
  assert.equal(selected.questions.length,50)
  assert.equal(new Set(selected.questions.map(q=>q.id)).size,50)
  assert.deepEqual(select(block,839),selected)
  assert.notDeepEqual(select(block,840).questions.map(q=>q.id),selected.questions.map(q=>q.id))
  assert(selected.questions.every(q=>q.presentation===presentation))
  assert.equal(grammarEligibleCount(block),50)
  for (const q of selected.questions) {
   assert(isGrammarQuestion(q))
   const adapted=adaptSourceItem({layout:'grammar',grammar:q},block.exerciseType,selected.instruction)
   assert(adapted && adapted.items.length>0)
   assert(!adapted.issues.some(s=>/invalide|non vérifiable/.test(s)))
   if(presentation==='choice') assert(adapted.items[0].choices.some(c=>c.id===adapted.items[0].correctId))
   if(presentation==='order') {
    assert.notDeepEqual(q.tokens.map(t=>t.text),q.unit.tokens.map(t=>t.text))
    assert.equal(adapted.items[0].mode,'sequence')
   }
  }
  const sheets=buildWorksheets([block],839)
  assert(sheets.length>1)
  assert.deepEqual(sheets.flatMap(s=>s.items.map(i=>i.grammar.id)),selected.questions.map(q=>q.id))
  assert(sheets.every(s=>s.blocks[0].sourceBlockIndex===0))
  const recipe=buildFicheRecipe(recipeInput([block]))
  assert(isGrammarSnapshot(recipe.pages[0].grammarSnapshot))
  const roundTrip=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)))
  assert(roundTrip)
  assert.deepEqual(roundTrip.pages[0].grammarSnapshot,recipe.pages[0].grammarSnapshot)
  assert.deepEqual(buildPage(roundTrip.pages[0],839).items,buildPage(block,839).items)
  const game=convertRecipe(roundTrip)
  assert.equal(game.questions.length,presentation==='match'?150:50)
  assert(game.questions.every(q=>!('answer' in q)&&!('correctId' in q)))
  assert(game.questions.every(q=>game.corrections[q.id]?.text))
  const prepared=prepareGame(game)
  for (const q of prepared.questions.filter(q=>q.mode==='choice')) {
   assert.equal(q.choiceOrderPolicy,'fixed')
   assert.deepEqual(q.choices,game.questions.find(original=>original.id===q.id).choices,'Paper option letters stay identical at the board.')
  }
  variants+=selected.questions.length
 }
}
// Missing new fields is the legacy route, never implicit A1.
const old={...base(),grammarLevel:undefined,grammarActivityId:undefined,grammarPresentation:undefined,grammarBankRevision:undefined,grammarPreview:undefined}
assert.equal(generateGradedGrammarBlock(old,17),null)
assert(!generate(old,17).items.some(item=>item.layout==='grammar'))
const oldRecipe=buildFicheRecipe(recipeInput([old]))
assert.equal(oldRecipe.pages[0].grammarSnapshot,undefined)
// New settings never leak from the main block into a legacy or CO extra block.
const mixed={...base(),extraBlocks:[{...old,topic:'gram-present'},{...old,exerciseType:'gram-ex-a3-nat-co',topic:'gram-se-presenter'}]}
for(const extra of pageBlocks(mixed).slice(1)) {
 const single=pageAsConfig(mixed,extra)
 assert.equal(single.grammarLevel,undefined)
 assert.equal(generateGradedGrammarBlock(single,17),null)
}
const different={...base(),extraBlocks:[{...base('gram-ex-etre-corriger-erreur'),contentSeed:5}]}
const frozen=buildFicheRecipe(recipeInput([different,base('gram-ex-etre-ordre')]))
assert.deepEqual(buildPage(frozen.pages[0],839).items,buildPage(different,839).items)
assert.deepEqual(buildPage(frozen.pages[1],839+7919).items,buildPage(base('gram-ex-etre-ordre'),839+7919).items)
// Saved selection remains readable independently of the current bank revision.
const archived=structuredClone(frozen.pages[0]); archived.grammarBankRevision='archived-revision';
archived.grammarSnapshot.bankRevision='archived-revision'
const key=JSON.parse(archived.grammarSnapshot.requestKey);key.revision='archived-revision';archived.grammarSnapshot.requestKey=JSON.stringify(key)
assert.equal(select(archived,839).bankRevision,'archived-revision')
const noSnap={...archived,grammarSnapshot:undefined}
assert.throws(()=>select(noSnap,839),e=>e.code==='GRAMMAR_BANK_REVISION_MISSING')
for(const id of ['gram-ex-a3-nat-co','gram-ex-a1-co-audio','gram-ex-famille-fam-co','gram-ex-a1-co-theme']) {
 assert(isProtectedGrammarCo(id))
 assert.equal(generateGradedGrammarBlock({...base(),exerciseType:id},17),null)
}
assert(!isProtectedGrammarCo('gram-ex-a6-prov-pays'))
assert.throws(()=>select({...base(),count:51},17),e=>e.code==='GRAMMAR_CONFIG_INVALID')
assert.throws(()=>select({...base(),grammarPreview:false},17),e=>e.code==='GRAMMAR_ACTIVITY_UNAVAILABLE')
const filtered={...base('gram-ex-etre-ordre'),phraseCategories:{preposition:false}}
const cap=grammarEligibleCount(filtered)
assert(cap<50)
assert.throws(()=>select({...filtered,count:50},17),e=>e.code==='GRAMMAR_CAPACITY_EXCEEDED')
assert.equal(grammarEligibleCount({...base('gram-ex-etre-ordre'),phrasePolarity:'negative'}),0)
const invalid=structuredClone(frozen);invalid.pages[0].grammarSnapshot.questions[0].options=[null]
assert.equal(parseFicheRecipe(invalid),null)
const badTokens=structuredClone(buildFicheRecipe(recipeInput([base('gram-ex-etre-ordre')])));badTokens.pages[0].grammarSnapshot.questions[0].tokens=[null]
assert.equal(parseFicheRecipe(badTokens),null)
assert.equal(parseFicheRecipe({...oldRecipe,pages:[{...base(),grammarLevel:'B2'}]}),null)
const badSeed=structuredClone(frozen);badSeed.pages[0].grammarSnapshot.seed+=1
assert.equal(parseFicheRecipe(badSeed),null)
const badKey=structuredClone(frozen);badKey.pages[0].grammarSnapshot.requestKey='different'
assert.equal(parseFicheRecipe(badKey),null)
// Cardinality is grammatical, never truncated by the shared TCF renderer.
const first=select(base(),17).questions[0]
assert(!isGrammarQuestion({...first,unit:{...first.unit,answers:first.unit.options.slice(0,2).map(o=>o.text)}}))
for(const count of [2,3,4,5,6]) {
 const answer=first.unit.answers[0]
 const labels=[answer,...['suis','es','est','sommes','êtes','sont'].filter(v=>v!==answer)].slice(0,count)
 const options=labels.map((text,i)=>({id:'o'+i,text}))
 const q={...first,unit:{...first.unit,options},options}
 assert(isGrammarQuestion(q))
 assert.equal(adaptSourceItem({layout:'grammar',grammar:q},base().exerciseType).items[0].choices.length,count)
}
load(root+'/src/grammaire/catalog.ts').assertGrammaireCatalog()
assert(!generate({...old,exerciseType:'gram-a5-theorie'},17).items.some(i=>i.prompt==='empty'))
console.log(`Grammar pilot: ${variants} reviewed variants, recipes, filters, pagination, 2–6 options and board adaptations verified. Teacher approval remains pending.`)
